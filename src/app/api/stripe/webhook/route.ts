import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

/** Send server-side event to GA4 via Measurement Protocol */
async function sendGA4Event(
  clientId: string,
  eventName: string,
  params: Record<string, unknown>
) {
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const apiSecret = process.env.GA4_MEASUREMENT_PROTOCOL_SECRET;
  if (!measurementId || !apiSecret) return;

  try {
    await fetch(
      `https://www.google-analytics.com/mp/collect?measurement_id=${measurementId}&api_secret=${apiSecret}`,
      {
        method: "POST",
        body: JSON.stringify({
          client_id: clientId,
          events: [{ name: eventName, params }],
        }),
      }
    );
  } catch {
    // Non-critical: don't block webhook processing
  }
}

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!);
}

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(request: NextRequest) {
  const stripe = getStripe();
  const supabaseAdmin = getSupabaseAdmin();

  const body = await request.text();
  const signature = request.headers.get("stripe-signature")!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const subscriptionId = session.subscription as string;
      const customerId = session.customer as string;

      await supabaseAdmin
        .from("profiles")
        .update({
          plan: "pro",
          stripe_subscription_id: subscriptionId,
          subscription_status: "active",
        })
        .eq("stripe_customer_id", customerId);

      // Track purchase via GA4 Measurement Protocol
      sendGA4Event(customerId, "purchase_completed", {
        plan: "pro",
        price: 2980,
        currency: "JPY",
        transaction_id: subscriptionId,
      });

      // 紹介報酬の処理: 新規Pro変換ユーザーが被紹介者かチェック
      const { data: profile } = await supabaseAdmin
        .from("profiles")
        .select("id")
        .eq("stripe_customer_id", customerId)
        .single();

      if (profile) {
        const { data: referral } = await supabaseAdmin
          .from("referral_conversions")
          .select("id, referrer_id")
          .eq("referee_id", profile.id)
          .eq("status", "signed_up")
          .single();

        if (referral) {
          // 被紹介者のステータスを更新
          await supabaseAdmin
            .from("referral_conversions")
            .update({
              status: "converted_pro",
              converted_at: new Date().toISOString(),
            })
            .eq("id", referral.id);

          // 紹介者にクーポンを適用
          const { data: referrerProfile } = await supabaseAdmin
            .from("profiles")
            .select("stripe_subscription_id")
            .eq("id", referral.referrer_id)
            .single();

          if (referrerProfile?.stripe_subscription_id) {
            try {
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

              await stripe.subscriptions.update(
                referrerProfile.stripe_subscription_id,
                { discounts: [{ coupon: coupon.id }] }
              );

              await supabaseAdmin
                .from("referral_conversions")
                .update({
                  status: "rewarded",
                  referrer_coupon_id: coupon.id,
                  rewarded_at: new Date().toISOString(),
                })
                .eq("id", referral.id);
            } catch (err) {
              console.error("Referral reward error:", err);
            }
          }
        }
      }

      break;
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;
      const status = subscription.status;

      // 一時停止の検知
      if (subscription.pause_collection) {
        await supabaseAdmin
          .from("profiles")
          .update({
            subscription_status: "paused",
            pause_start: new Date().toISOString(),
            pause_resume_date: subscription.pause_collection.resumes_at
              ? new Date(subscription.pause_collection.resumes_at * 1000).toISOString()
              : null,
          })
          .eq("stripe_customer_id", customerId);
        break;
      }

      const plan =
        status === "active" || status === "trialing" ? "pro" : "free";

      await supabaseAdmin
        .from("profiles")
        .update({
          plan,
          subscription_status: status,
          pause_start: null,
          pause_resume_date: null,
        })
        .eq("stripe_customer_id", customerId);

      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;

      await supabaseAdmin
        .from("profiles")
        .update({
          plan: "free",
          subscription_status: "canceled",
          stripe_subscription_id: null,
        })
        .eq("stripe_customer_id", customerId);

      break;
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      const customerId = invoice.customer as string;

      await supabaseAdmin
        .from("profiles")
        .update({ subscription_status: "past_due" })
        .eq("stripe_customer_id", customerId);

      break;
    }
  }

  return NextResponse.json({ received: true });
}
