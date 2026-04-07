import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

export const maxDuration = 30;

function getBaseUrl(): string {
  // 1. Explicit env var
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL;
  // 2. Vercel auto-set URL
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL)
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  // 3. Fallback
  return "https://seiyaku-coach.vercel.app";
}

export async function POST() {
  // Step 1: Check env vars
  const priceId = process.env.STRIPE_PROGRAM_PRICE_ID;
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const baseUrl = getBaseUrl();

  console.log("[checkout-program] Step 1 - env check:", {
    hasPriceId: !!priceId,
    hasStripeKey: !!stripeKey,
    stripeKeyPrefix: stripeKey?.substring(0, 8),
    baseUrl,
  });

  if (!priceId) {
    return NextResponse.json(
      { error: "STRIPE_PROGRAM_PRICE_ID が未設定です" },
      { status: 500 }
    );
  }

  if (!stripeKey) {
    return NextResponse.json(
      { error: "STRIPE_SECRET_KEY が未設定です" },
      { status: 500 }
    );
  }

  // Step 2: Auth
  let userId: string;
  let userEmail: string;
  try {
    console.log("[checkout-program] Step 2 - auth start");
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
    console.log("[checkout-program] Step 2 - auth OK, userId:", userId.substring(0, 8));
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[checkout-program] Step 2 FAILED:", msg);
    return NextResponse.json(
      { error: `認証エラー: ${msg}` },
      { status: 503 }
    );
  }

  // Step 2.5: Check if already purchased (prevent double charge)
  try {
    const supabaseAdmin = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );
    const { data: existingPurchase } = await supabaseAdmin
      .from("program_purchases")
      .select("id")
      .eq("user_id", userId)
      .limit(1)
      .maybeSingle();

    if (existingPurchase) {
      console.log("[checkout-program] Already purchased, redirecting to resources");
      return NextResponse.json(
        { error: "already_purchased", redirect: "/program/resources" },
        { status: 409 },
      );
    }
  } catch (e) {
    console.error("[checkout-program] Purchase check failed:", e);
    // Don't block checkout if check fails — Stripe handles idempotency
  }

  // Step 3: Create Stripe checkout session
  try {
    console.log("[checkout-program] Step 3 - Stripe session create start");
    const stripe = getStripe();

    // Quick connectivity test
    console.log("[checkout-program] Step 3a - testing Stripe connectivity...");
    const t0 = Date.now();

    const session = await stripe.checkout.sessions.create({
      customer_email: userEmail,
      client_reference_id: userId,
      mode: "payment",
      payment_method_types: ["card"],
      allow_promotion_codes: true,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${baseUrl}/program/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/program`,
      locale: "ja",
      metadata: {
        supabase_user_id: userId,
        product_type: "program",
        program_slug: "five-step-master",
      },
    });

    console.log("[checkout-program] Step 3 - SUCCESS in", Date.now() - t0, "ms, url:", session.url?.substring(0, 50));
    return NextResponse.json({ url: session.url });
  } catch (e: unknown) {
    const isStripeError = e && typeof e === "object" && "type" in e;
    const stripeType = isStripeError ? (e as { type: string }).type : "unknown";
    const stripeCode = isStripeError && "code" in e ? (e as { code: string }).code : "none";
    const msg = e instanceof Error ? e.message : String(e);

    console.error("[checkout-program] Step 3 FAILED:", {
      stripeErrorType: stripeType,
      stripeCode,
      message: msg,
      stack: e instanceof Error ? e.stack?.split("\n").slice(0, 3).join(" | ") : "",
    });

    return NextResponse.json(
      { error: `Stripe: ${msg}` },
      { status: 500 }
    );
  }
}
