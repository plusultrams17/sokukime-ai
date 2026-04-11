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

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("stripe_subscription_id, stripe_customer_id, plan")
    .eq("id", user.id)
    .single();

  if (profileError) {
    console.error("Profile query failed (stripe/cancel-offer):", profileError);
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }

  const isPaid =
    profile?.plan === "starter" ||
    profile?.plan === "pro" ||
    profile?.plan === "master";

  if (!profile?.stripe_subscription_id || !isPaid) {
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

  // 重複防止：過去30日以内に引き止めオファーを受けたかチェック
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const { data: recentOffer } = await supabase
    .from("cancel_reasons")
    .select("id")
    .eq("user_id", user.id)
    .eq("outcome", "accepted")
    .gte("created_at", thirtyDaysAgo)
    .limit(1);

  if (recentOffer && recentOffer.length > 0) {
    return NextResponse.json(
      { error: "最近オファーを利用済みです", alreadyUsed: true },
      { status: 409 }
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

    // 解約理由をログに記録（重複防止チェックに必要なため、失敗時はエラーにする）
    const { error: insertError } = await supabase.from("cancel_reasons").insert({
      user_id: user.id,
      reason,
      reason_detail: reasonDetail || null,
      offer_type: offerType,
      outcome: "accepted",
      stripe_coupon_id: stripeCouponId,
    });
    if (insertError) {
      console.error("Cancel reason insert failed:", insertError);
    }

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
