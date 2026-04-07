import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";

export const maxDuration = 30;

export async function POST() {
  try {
    const priceId = process.env.STRIPE_PROGRAM_PRICE_ID;

    if (!priceId) {
      return NextResponse.json(
        { error: "教材の料金設定に問題があります。管理者にお問い合わせください。" },
        { status: 500 }
      );
    }

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

    // Get or create Stripe customer
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("stripe_customer_id, email")
      .eq("id", user.id)
      .single();

    if (profileError) {
      console.error("Profile query failed (stripe/checkout-program):", profileError);
      return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
    }

    let customerId = profile?.stripe_customer_id;

    // Run Stripe customer creation and purchase check in parallel
    const [, existingResult] = await Promise.all([
      // Create Stripe customer if needed
      (async () => {
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
      })(),
      // Check existing purchase
      supabase
        .from("program_purchases")
        .select("id")
        .eq("user_id", user.id)
        .eq("program_slug", "five-step-master")
        .eq("status", "completed")
        .single(),
    ]);

    if (existingResult.data) {
      return NextResponse.json(
        { error: "このプログラムは既に購入済みです" },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      client_reference_id: user.id,
      mode: "payment",
      allow_promotion_codes: true,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/program/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/program`,
      locale: "ja",
      metadata: {
        supabase_user_id: user.id,
        product_type: "program",
        program_slug: "five-step-master",
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Program checkout error:", error);
    return NextResponse.json(
      { error: "チェックアウトセッションの作成に失敗しました" },
      { status: 500 }
    );
  }
}
