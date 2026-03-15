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

  const { data: profile } = await supabase
    .from("profiles")
    .select("stripe_subscription_id, stripe_customer_id, plan")
    .eq("id", user.id)
    .single();

  if (!profile?.stripe_subscription_id || profile.plan !== "pro") {
    return NextResponse.json(
      { error: "No active subscription" },
      { status: 400 }
    );
  }

  const body = await request.json();
  const { reason, reasonDetail, offerType } = body;

  if (!reason || !offerType) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const stripe = getStripe();
  let stripeCouponId: string | null = null;

  try {
    if (offerType === "discount_25" || offerType === "comparison") {
      // 25%OFF 2ヶ月の保持クーポンを作成/取得して適用
      const couponName = "retention_25off_2mo";
      let coupon: Stripe.Coupon;

      try {
        coupon = await stripe.coupons.retrieve(couponName);
      } catch {
        coupon = await stripe.coupons.create({
          id: couponName,
          percent_off: 25,
          duration: "repeating",
          duration_in_months: 2,
          name: "解約防止 25%OFF（2ヶ月）",
        });
      }

      await stripe.subscriptions.update(profile.stripe_subscription_id, {
        discounts: [{ coupon: coupon.id }],
      });
      stripeCouponId = coupon.id;
    }

    // 解約理由をログに記録
    await supabase.from("cancel_reasons").insert({
      user_id: user.id,
      reason,
      reason_detail: reasonDetail || null,
      offer_type: offerType,
      outcome: "accepted",
      stripe_coupon_id: stripeCouponId,
    });

    return NextResponse.json({
      success: true,
      offerType,
      discountApplied: !!stripeCouponId,
    });
  } catch (err) {
    console.error("Cancel offer error:", err);
    return NextResponse.json(
      { error: "Failed to apply offer" },
      { status: 500 }
    );
  }
}
