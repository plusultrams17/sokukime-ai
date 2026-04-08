import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { getActivePromotion } from "@/lib/promotions";

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

    // Parse billing period and promo code from request body
    let billing: "monthly" | "annual" = "monthly";
    let promoCode: string | undefined;
    let utmParams: Record<string, string> = {};
    try {
      const body = await request.json();
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
      // Default to monthly if no body
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
          { error: "既にProプランに登録されています。" },
          { status: 400 }
        );
      }
    }

    // Use annual or monthly price ID
    const priceId =
      billing === "annual" && process.env.STRIPE_PRO_ANNUAL_PRICE_ID
        ? process.env.STRIPE_PRO_ANNUAL_PRICE_ID
        : process.env.STRIPE_PRO_PRICE_ID;

    if (!priceId) {
      return NextResponse.json(
        { error: "料金プランの設定に問題があります。管理者にお問い合わせください。" },
        { status: 500 }
      );
    }

    // ── Discount resolution (priority: referral > promo code > campaign > allow_promotion_codes) ──
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

    // 3. 季節キャンペーンクーポン自動適用（他の割引がない場合、月額のみ）
    if (!discounts && !promotionCodeId && billing === "monthly") {
      const activePromo = getActivePromotion();
      if (activePromo?.stripeCouponId) {
        try {
          let campaignCoupon;
          try {
            campaignCoupon = await stripe.coupons.retrieve(activePromo.stripeCouponId);
          } catch {
            // キャンペーンクーポンが未作成なら自動作成
            campaignCoupon = await stripe.coupons.create({
              id: activePromo.stripeCouponId,
              amount_off: activePromo.originalPrice - activePromo.discountPrice,
              currency: "jpy",
              duration: "once",
              name: activePromo.name,
            });
          }
          discounts = [{ coupon: campaignCoupon.id }];
        } catch {
          // キャンペーンクーポン適用失敗でも決済は続行
        }
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
        trial_period_days: 7,
        metadata: { supabase_user_id: user.id, ...utmParams },
      },
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
