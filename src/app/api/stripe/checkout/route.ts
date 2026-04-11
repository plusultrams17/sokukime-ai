import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import type { PlanTier } from "@/lib/plans";

/**
 * Tier → Stripe Price ID env var の解決
 * - starter:  STRIPE_STARTER_PRICE_ID  (¥990)
 * - pro:      STRIPE_PRO_PRICE_ID      (¥1,980)
 * - master:   STRIPE_MASTER_PRICE_ID   (¥4,980)
 */
function resolvePriceId(tier: PlanTier, billing: "monthly" | "annual"): string | null {
  // 年額は現状proのみ対応 (legacy)
  if (billing === "annual" && tier === "pro" && process.env.STRIPE_PRO_ANNUAL_PRICE_ID) {
    return process.env.STRIPE_PRO_ANNUAL_PRICE_ID.trim();
  }
  switch (tier) {
    case "starter":
      return process.env.STRIPE_STARTER_PRICE_ID?.trim() || null;
    case "pro":
      return process.env.STRIPE_PRO_PRICE_ID?.trim() || null;
    case "master":
      return process.env.STRIPE_MASTER_PRICE_ID?.trim() || null;
    default:
      return null;
  }
}

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

    // Parse tier, billing period and promo code from request body
    let tier: PlanTier = "pro"; // 後方互換: tier 未指定なら pro
    let billing: "monthly" | "annual" = "monthly";
    let promoCode: string | undefined;
    let utmParams: Record<string, string> = {};
    try {
      const body = await request.json();
      if (body.tier && ["starter", "pro", "master"].includes(body.tier)) {
        tier = body.tier as PlanTier;
      }
      if (body.billing === "annual") {
        billing = "annual";
      }
      if (body.promoCode && typeof body.promoCode === "string") {
        promoCode = body.promoCode.trim();
      }
      if (body.utm && typeof body.utm === "object") {
        for (const [k, v] of Object.entries(body.utm)) {
          if (typeof v === "string" && v.length < 200) utmParams[k] = v;
        }
      }
    } catch {
      // Default to pro/monthly if no body
    }

    // Get or create profile + Stripe customer
    let { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("stripe_customer_id, email")
      .eq("id", user.id)
      .single();

    // Profile missing (trigger may have failed) — create it with service role (bypasses RLS)
    if (profileError && profileError.code === "PGRST116") {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
      if (supabaseUrl && supabaseServiceKey) {
        const admin = createAdminClient(supabaseUrl, supabaseServiceKey);
        const { data: newProfile, error: insertError } = await admin
          .from("profiles")
          .upsert({ id: user.id, ...(user.email ? { email: user.email } : {}) }, { onConflict: "id" })
          .select("stripe_customer_id, email")
          .single();
        if (insertError) {
          console.error("Profile creation failed (stripe/checkout):", insertError);
          return NextResponse.json(
            { error: "プロフィールの作成に失敗しました。再度お試しください。" },
            { status: 500 }
          );
        }
        profile = newProfile;
        profileError = null;
      }
    }

    if (profileError) {
      console.error("Profile query failed (stripe/checkout):", profileError);
      return NextResponse.json(
        { error: "プロフィール情報の取得に失敗しました。再度お試しください。" },
        { status: 503 }
      );
    }

    let customerId = profile?.stripe_customer_id;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: profile?.email || user.email!,
        metadata: { supabase_user_id: user.id },
      });
      customerId = customer.id;

      const { error: cidError } = await supabase
        .from("profiles")
        .update({ stripe_customer_id: customerId })
        .eq("id", user.id);

      if (cidError) {
        console.error("[checkout] stripe_customer_id save failed:", cidError);
      }
    }

    // Guard: prevent duplicate subscriptions (active, trialing, or past_due)
    if (customerId) {
      const existingSubs = await stripe.subscriptions.list({
        customer: customerId,
        status: "active",
        limit: 1,
      });
      const trialingSubs = await stripe.subscriptions.list({
        customer: customerId,
        status: "trialing",
        limit: 1,
      });
      const pastDueSubs = await stripe.subscriptions.list({
        customer: customerId,
        status: "past_due",
        limit: 1,
      });
      if (existingSubs.data.length > 0 || trialingSubs.data.length > 0 || pastDueSubs.data.length > 0) {
        return NextResponse.json(
          { error: "既に有料プランに登録されています。プラン変更はマイページから行ってください。" },
          { status: 400 }
        );
      }
    }

    // Tier から Price ID を解決
    const priceId = resolvePriceId(tier, billing);

    if (!priceId) {
      const tierName =
        tier === "starter" ? "スタータープラン" :
        tier === "pro" ? "プロプラン" :
        tier === "master" ? "マスタープラン" : tier;
      return NextResponse.json(
        {
          error: `${tierName}は現在準備中です。しばらくお待ちください。`,
        },
        { status: 503 }
      );
    }

    // ── Discount resolution (priority: referral > promo code > allow_promotion_codes) ──
    // 2026-04-11: 季節キャンペーン自動適用を廃止。Free累計5回 → 納得してProへ の導線に統一。
    let discounts: { coupon: string }[] | undefined;
    let promotionCodeId: string | undefined;

    // 1. 被紹介者の場合、¥1,000 OFFクーポンを適用
    // Use admin client to bypass RLS (referee has no SELECT policy on referral_conversions)
    const supabaseUrlRef = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKeyRef = process.env.SUPABASE_SERVICE_ROLE_KEY;
    let referral: { id: string } | null = null;
    if (supabaseUrlRef && supabaseServiceKeyRef) {
      const adminRef = createAdminClient(supabaseUrlRef, supabaseServiceKeyRef);
      const { data } = await adminRef
        .from("referral_conversions")
        .select("id")
        .eq("referee_id", user.id)
        .eq("status", "signed_up")
        .single();
      referral = data;
    }

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

    // 2. ユーザー入力のプロモコード（リファラル割引がない場合）
    if (promoCode && !discounts) {
      try {
        const promoCodes = await stripe.promotionCodes.list({
          code: promoCode,
          active: true,
          limit: 1,
        });
        if (promoCodes.data.length > 0) {
          promotionCodeId = promoCodes.data[0].id;
        }
      } catch {
        // Invalid promo code — continue without discount
      }
    }

    // Build discount config for Stripe session
    const discountConfig = discounts
      ? { discounts }
      : promotionCodeId
        ? { discounts: [{ promotion_code: promotionCodeId }] as { promotion_code: string }[] }
        : { allow_promotion_codes: true };

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      client_reference_id: user.id,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      ...discountConfig,
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/roleplay?upgraded=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
      locale: "ja",
      subscription_data: {
        metadata: { supabase_user_id: user.id, plan_tier: tier, ...utmParams },
      },
      metadata: { supabase_user_id: user.id, plan_tier: tier },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "チェックアウトの開始に失敗しました。時間をおいて再度お試しください。" },
      { status: 500 }
    );
  }
}
