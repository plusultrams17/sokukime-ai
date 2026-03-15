import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";

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

  const { data: conversion } = await supabase
    .from("referral_conversions")
    .select("id, referrer_id, status")
    .eq("id", conversionId)
    .eq("referrer_id", user.id)
    .single();

  if (!conversion || conversion.status === "rewarded") {
    return NextResponse.json(
      { error: "Invalid or already rewarded" },
      { status: 400 }
    );
  }

  const stripe = getStripe();

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

    // 紹介者のサブスクリプションにクーポンを適用
    const { data: profile } = await supabase
      .from("profiles")
      .select("stripe_subscription_id")
      .eq("id", user.id)
      .single();

    if (profile?.stripe_subscription_id) {
      await stripe.subscriptions.update(profile.stripe_subscription_id, {
        discounts: [{ coupon: coupon.id }],
      });
    }

    // コンバージョンのステータスを更新
    await supabase
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
