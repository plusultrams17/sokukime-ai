import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";

export async function POST() {
  // Step 1: Check env
  const priceId = process.env.STRIPE_PROGRAM_PRICE_ID;
  if (!priceId) {
    return NextResponse.json(
      { error: "STRIPE_PROGRAM_PRICE_ID が未設定です" },
      { status: 500 }
    );
  }

  // Step 2: Auth
  let userId: string;
  let userEmail: string;
  try {
    const supabase = await createClient();
    if (!supabase) {
      return NextResponse.json(
        { error: "Supabase クライアント作成失敗（env未設定の可能性）" },
        { status: 503 }
      );
    }
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    userId = user.id;
    userEmail = user.email || "";
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json(
      { error: `認証エラー: ${msg}` },
      { status: 503 }
    );
  }

  // Step 3: Create Stripe checkout session
  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      customer_email: userEmail,
      client_reference_id: userId,
      mode: "payment",
      payment_method_types: ["card"],
      allow_promotion_codes: true,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/program/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/program`,
      locale: "ja",
      metadata: {
        supabase_user_id: userId,
        product_type: "program",
        program_slug: "five-step-master",
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[checkout-program] Stripe error:", msg);
    return NextResponse.json(
      { error: `Stripe: ${msg}` },
      { status: 500 }
    );
  }
}
