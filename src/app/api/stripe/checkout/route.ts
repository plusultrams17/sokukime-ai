import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const stripe = getStripe();
    const supabase = await createClient();
    if (!supabase) {
      return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
    }
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse billing period from request body
    let billing: "monthly" | "annual" = "monthly";
    try {
      const body = await request.json();
      if (body.billing === "annual") {
        billing = "annual";
      }
    } catch {
      // Default to monthly if no body
    }

    // Get or create Stripe customer
    const { data: profile } = await supabase
      .from("profiles")
      .select("stripe_customer_id, email")
      .eq("id", user.id)
      .single();

    let customerId = profile?.stripe_customer_id;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: profile?.email || user.email!,
        metadata: { supabase_user_id: user.id },
      });
      customerId = customer.id;

      await supabase
        .from("profiles")
        .update({ stripe_customer_id: customerId })
        .eq("id", user.id);
    }

    // Use annual or monthly price ID
    const priceId =
      billing === "annual" && process.env.STRIPE_PRO_ANNUAL_PRICE_ID
        ? process.env.STRIPE_PRO_ANNUAL_PRICE_ID
        : process.env.STRIPE_PRO_PRICE_ID!;

    // 被紹介者の場合、¥1,000 OFFクーポンを適用
    const { data: referral } = await supabase
      .from("referral_conversions")
      .select("id")
      .eq("referee_id", user.id)
      .eq("status", "signed_up")
      .single();

    let discounts: { coupon: string }[] | undefined;
    if (referral) {
      try {
        let coupon;
        try {
          coupon = await stripe.coupons.retrieve("referral_referee_1000off");
        } catch {
          coupon = await stripe.coupons.create({
            id: "referral_referee_1000off",
            amount_off: 1000,
            currency: "jpy",
            duration: "once",
            name: "紹介特典 初月 ¥1,000 OFF",
          });
        }
        discounts = [{ coupon: coupon.id }];
      } catch {
        // クーポン適用に失敗しても決済は続行
      }
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      ...(discounts ? { discounts } : {}),
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/roleplay?upgraded=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
      locale: "ja",
      subscription_data: {
        metadata: { supabase_user_id: user.id },
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "チェックアウトセッションの作成に失敗しました" },
      { status: 500 }
    );
  }
}
