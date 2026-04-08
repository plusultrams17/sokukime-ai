import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!);
}

export async function POST(request: NextRequest) {
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

  const body = await request.json();
  const { conversionId } = body;

  if (!conversionId) {
    return NextResponse.json(
      { error: "Missing conversion ID" },
      { status: 400 }
    );
  }

  // Use admin client for cross-user referral operations
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabaseServiceKey) {
    return NextResponse.json({ error: "Config error" }, { status: 500 });
  }
  const admin = createAdminClient(supabaseUrl, supabaseServiceKey);

  const { data: conversion } = await admin
    .from("referral_conversions")
    .select("id, referrer_id, status")
    .eq("id", conversionId)
    .eq("referrer_id", user.id)
    .single();

  if (!conversion) {
    return NextResponse.json(
      { error: "Conversion not found" },
      { status: 404 }
    );
  }

  // Idempotency: already rewarded
  if (conversion.status === "rewarded") {
    return NextResponse.json({ success: true, already: true });
  }

  // Must be in converted_pro status
  if (conversion.status !== "converted_pro") {
    return NextResponse.json(
      { error: "Friend has not converted to Pro yet" },
      { status: 400 }
    );
  }

  const stripe = getStripe();

  // 紹介者のサブスクリプション確認
  const { data: profile } = await supabase
    .from("profiles")
    .select("stripe_subscription_id")
    .eq("id", user.id)
    .single();

  if (!profile?.stripe_subscription_id) {
    return NextResponse.json(
      { error: "Proプランに登録すると自動適用されます" },
      { status: 400 }
    );
  }

  try {
    // 紹介者の¥1,000 OFFクーポンを作成/取得
    let coupon: Stripe.Coupon;
    try {
      coupon = await stripe.coupons.retrieve("referral_1000off");
    } catch {
      coupon = await stripe.coupons.create({
        id: "referral_1000off",
        amount_off: 1000,
        currency: "jpy",
        duration: "once",
        name: "紹介特典 ¥1,000 OFF",
      });
    }

    await stripe.subscriptions.update(profile.stripe_subscription_id, {
      discounts: [{ coupon: coupon.id }],
    });

    // ステータスを更新（admin clientで確実に）
    await admin
      .from("referral_conversions")
      .update({
        status: "rewarded",
        referrer_coupon_id: coupon.id,
        rewarded_at: new Date().toISOString(),
      })
      .eq("id", conversionId);

    return NextResponse.json({ success: true, couponId: coupon.id });
  } catch (err) {
    console.error("Apply reward error:", err);
    return NextResponse.json(
      { error: "Failed to apply reward" },
      { status: 500 }
    );
  }
}
