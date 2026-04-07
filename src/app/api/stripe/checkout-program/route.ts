import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";

export async function POST() {
  const t0 = Date.now();
  try {
    const priceId = process.env.STRIPE_PROGRAM_PRICE_ID;
    if (!priceId) {
      console.error("[checkout-program] STRIPE_PROGRAM_PRICE_ID is not set");
      return NextResponse.json(
        { error: "教材の料金設定に問題があります。管理者にお問い合わせください。" },
        { status: 500 }
      );
    }

    // 1. Auth check
    const supabase = await createClient();
    if (!supabase) {
      console.error("[checkout-program] Supabase client creation failed");
      return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
    }
    const {
      data: { user },
    } = await supabase.auth.getUser();
    console.log(`[checkout-program] auth: ${Date.now() - t0}ms`);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Get existing Stripe customer ID (optional — fallback to customer_email)
    const { data: profile } = await supabase
      .from("profiles")
      .select("stripe_customer_id")
      .eq("id", user.id)
      .maybeSingle();
    console.log(`[checkout-program] profile: ${Date.now() - t0}ms`);

    const customerId = profile?.stripe_customer_id;

    // 3. Create checkout session (single Stripe call)
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      ...(customerId
        ? { customer: customerId }
        : { customer_email: user.email! }),
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
    console.log(`[checkout-program] session created: ${Date.now() - t0}ms`);

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error(`[checkout-program] error at ${Date.now() - t0}ms:`, error);
    return NextResponse.json(
      { error: "チェックアウトセッションの作成に失敗しました" },
      { status: 500 }
    );
  }
}
