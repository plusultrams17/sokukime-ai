import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { sendTransactionalEmail, sendTrialEmail } from "@/lib/email";
import { sendCRMEvent } from "@/lib/crm-webhook";

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
      const customerId = session.customer as string;

      // ── One-time program purchase ──
      if (session.mode === "payment" && session.metadata?.product_type === "program") {
        const userId = session.metadata.supabase_user_id;
        const programSlug = session.metadata.program_slug || "five-step-master";
        const paymentIntentId = session.payment_intent as string;

        const { error: purchaseInsertError } = await supabaseAdmin
          .from("program_purchases")
          .upsert(
            {
              user_id: userId,
              program_slug: programSlug,
              stripe_payment_intent_id: paymentIntentId,
              stripe_checkout_session_id: session.id,
              amount: session.amount_total || 0,
              currency: session.currency || "jpy",
              status: "completed",
              completed_at: new Date().toISOString(),
            },
            { onConflict: "stripe_payment_intent_id" },
          );

        if (purchaseInsertError) {
          console.error("[webhook] program_purchases insert error:", purchaseInsertError);
        }

        // Grant Pro access — subscription_status='program' distinguishes from recurring subs
        const { error: profileUpdateError } = await supabaseAdmin
          .from("profiles")
          .update({
            plan: "pro",
            subscription_status: "program",
            ...(customerId ? { stripe_customer_id: customerId } : {}),
          })
          .eq("id", userId);

        if (profileUpdateError) {
          console.error("[webhook] profile update error:", profileUpdateError);
        }

        // Send purchase confirmation email
        const { data: buyerProfile } = await supabaseAdmin
          .from("profiles")
          .select("id, email")
          .eq("id", userId)
          .single();

        if (buyerProfile?.email) {
          sendTransactionalEmail(buyerProfile.email, "program_purchased", buyerProfile.id);
          sendCRMEvent(supabaseAdmin, "user.program_purchased", buyerProfile.id, buyerProfile.email, "free", {
            program_slug: programSlug,
            amount: session.amount_total,
          });
        }

        // Track via GA4
        sendGA4Event(customerId, "program_purchased", {
          program: programSlug,
          price: session.amount_total || 0,
          currency: "JPY",
          transaction_id: paymentIntentId,
        });

        break;
      }

      // ── Team plan checkout ──
      if (session.metadata?.plan_type === "team" && session.metadata?.org_id) {
        const orgId = session.metadata.org_id;
        const subscriptionId = session.subscription as string;

        await supabaseAdmin
          .from("organizations")
          .update({
            stripe_customer_id: customerId,
            stripe_subscription_id: subscriptionId,
          })
          .eq("id", orgId);

        break;
      }

      // ── Subscription checkout (existing logic) ──
      const subscriptionId = session.subscription as string;

      // Get actual subscription status from Stripe (usually "trialing" with trial_period_days)
      let subStatus = "active";
      if (subscriptionId) {
        try {
          const sub = await stripe.subscriptions.retrieve(subscriptionId);
          subStatus = sub.status; // "trialing", "active", etc.
        } catch {
          // Fallback to "active" if retrieval fails
        }
      }

      // Use client_reference_id as primary match (set in checkout), fallback to stripe_customer_id
      const userId = session.client_reference_id;
      const profileMatch = userId
        ? { field: "id", value: userId }
        : { field: "stripe_customer_id", value: customerId };

      const { error: subUpgradeError } = await supabaseAdmin
        .from("profiles")
        .update({
          plan: "pro",
          stripe_subscription_id: subscriptionId,
          subscription_status: subStatus,
          stripe_customer_id: customerId,
        })
        .eq(profileMatch.field, profileMatch.value);

      if (subUpgradeError) {
        console.error("[webhook] CRITICAL: Pro upgrade failed after payment:", subUpgradeError, { userId, customerId });
      }

      // Track purchase via GA4 Measurement Protocol (use actual amount from session)
      const amountTotal = session.amount_total ? session.amount_total : 0;
      sendGA4Event(customerId, "purchase_completed", {
        plan: "pro",
        price: amountTotal,
        currency: "JPY",
        transaction_id: subscriptionId,
        billing_interval: amountTotal > 10000 ? "annual" : "monthly",
      });

      // Send Pro welcome email
      const { data: newProProfile } = await supabaseAdmin
        .from("profiles")
        .select("id, email")
        .eq(profileMatch.field, profileMatch.value)
        .single();

      if (newProProfile?.email) {
        sendTransactionalEmail(newProProfile.email, "pro_welcome", newProProfile.id);
        // CRM event for Pro conversion
        sendCRMEvent(supabaseAdmin, "user.pro_conversion", newProProfile.id, newProProfile.email, "pro", {
          amount: amountTotal,
          billing_interval: amountTotal > 10000 ? "annual" : "monthly",
        });
      }

      // 紹介報酬の処理: 新規Pro変換ユーザーが被紹介者かチェック
      const profile = newProProfile;

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

          // 紹介者にクーポンを適用 & 通知
          const { data: referrerProfile } = await supabaseAdmin
            .from("profiles")
            .select("id, email, stripe_subscription_id")
            .eq("id", referral.referrer_id)
            .single();

          if (referrerProfile) {
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

              if (referrerProfile.stripe_subscription_id) {
                // 紹介者がPro会員: クーポンを即時適用（既存割引を保持）
                const referrerSub = await stripe.subscriptions.retrieve(
                  referrerProfile.stripe_subscription_id
                );
                const existingDiscounts = (referrerSub.discounts || [])
                  .filter((d): d is Stripe.Discount => typeof d !== "string" && !!d.id)
                  .map(d => ({ discount: d.id }));
                await stripe.subscriptions.update(
                  referrerProfile.stripe_subscription_id,
                  { discounts: [...existingDiscounts, { coupon: coupon.id }] }
                );

                await supabaseAdmin
                  .from("referral_conversions")
                  .update({
                    status: "rewarded",
                    referrer_coupon_id: coupon.id,
                    rewarded_at: new Date().toISOString(),
                  })
                  .eq("id", referral.id);
              } else {
                // 紹介者がFreeプラン: Pro登録時に自動適用されるよう記録のみ
                // status を converted_pro のままにし、apply-reward で後から適用可能
                await supabaseAdmin
                  .from("referral_conversions")
                  .update({
                    referrer_coupon_id: coupon.id,
                  })
                  .eq("id", referral.id);
              }

              // 紹介者に通知メールを送信（Pro/Free問わず）
              if (referrerProfile.email) {
                sendTransactionalEmail(referrerProfile.email, "referral_reward", referrerProfile.id);
              }
            } catch (err) {
              console.error("Referral reward error:", err);
            }
          }
        }
      }

      // 紹介者本人がPro登録した場合: 保留中の報酬を自動適用
      if (profile) {
        const { data: pendingRewards } = await supabaseAdmin
          .from("referral_conversions")
          .select("id, referrer_coupon_id")
          .eq("referrer_id", profile.id)
          .eq("status", "converted_pro");

        if (pendingRewards && pendingRewards.length > 0 && subscriptionId) {
          for (const pending of pendingRewards) {
            try {
              const couponId = pending.referrer_coupon_id || "referral_1000off";
              // Preserve existing discounts when appending referral reward
              const pendingSub = await stripe.subscriptions.retrieve(subscriptionId);
              const existingPendingDiscounts = (pendingSub.discounts || [])
                .filter((d): d is Stripe.Discount => typeof d !== "string" && !!d.id)
                .map(d => ({ discount: d.id }));
              await stripe.subscriptions.update(subscriptionId, {
                discounts: [...existingPendingDiscounts, { coupon: couponId }],
              });

              await supabaseAdmin
                .from("referral_conversions")
                .update({
                  status: "rewarded",
                  rewarded_at: new Date().toISOString(),
                })
                .eq("id", pending.id);

              // 1つだけ適用（複数保留がある場合は次月以降）
              break;
            } catch (err) {
              console.error("Pending referral reward error:", err);
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

      // Never downgrade program purchasers via subscription events
      // Fallback to subscription metadata if stripe_customer_id match fails
      let subUpdProfile: { subscription_status: string | null } | null = null;
      const { data: subUpdByCustomer } = await supabaseAdmin
        .from("profiles")
        .select("subscription_status")
        .eq("stripe_customer_id", customerId)
        .single();
      subUpdProfile = subUpdByCustomer;

      if (!subUpdProfile && subscription.metadata?.supabase_user_id) {
        const { data: subUpdByUserId } = await supabaseAdmin
          .from("profiles")
          .select("subscription_status")
          .eq("id", subscription.metadata.supabase_user_id)
          .single();
        subUpdProfile = subUpdByUserId;
      }

      if (subUpdProfile?.subscription_status === "program") {
        break;
      }

      // Determine profile match field (stripe_customer_id primary, supabase_user_id fallback)
      const subUpdMatch = subUpdByCustomer
        ? { field: "stripe_customer_id", value: customerId }
        : subscription.metadata?.supabase_user_id
          ? { field: "id", value: subscription.metadata.supabase_user_id }
          : { field: "stripe_customer_id", value: customerId };

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
          .eq(subUpdMatch.field, subUpdMatch.value);
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
        .eq(subUpdMatch.field, subUpdMatch.value);

      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;

      // Check if this is a team plan subscription
      if (subscription.metadata?.plan_type === "team" && subscription.metadata?.org_id) {
        await supabaseAdmin
          .from("organizations")
          .update({ stripe_subscription_id: null })
          .eq("id", subscription.metadata.org_id);
        break;
      }

      // Never downgrade program purchasers via subscription events
      const { data: subDelProfile } = await supabaseAdmin
        .from("profiles")
        .select("subscription_status")
        .eq("stripe_customer_id", customerId)
        .single();

      if (subDelProfile?.subscription_status === "program") {
        break;
      }

      const { error: cancelError } = await supabaseAdmin
        .from("profiles")
        .update({
          plan: "free",
          subscription_status: "canceled",
          stripe_subscription_id: null,
        })
        .eq("stripe_customer_id", customerId);

      if (cancelError) {
        console.error("[webhook] CRITICAL: Cancellation downgrade failed:", cancelError, { customerId });
      }

      // Send win-back email on cancellation
      const { data: canceledProfile } = await supabaseAdmin
        .from("profiles")
        .select("id, email")
        .eq("stripe_customer_id", customerId)
        .single();

      if (canceledProfile?.email) {
        sendTransactionalEmail(canceledProfile.email, "subscription_canceled", canceledProfile.id);
        // Record cancellation email send time (used by win-back cron to calculate Day 7/30)
        await supabaseAdmin.from("onboarding_emails").insert({
          user_id: canceledProfile.id,
          email_type: "subscription_canceled",
        });
        // CRM event for cancellation
        sendCRMEvent(supabaseAdmin, "user.cancellation", canceledProfile.id, canceledProfile.email, "free");
      }

      break;
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      const customerId = invoice.customer as string;

      await supabaseAdmin
        .from("profiles")
        .update({ subscription_status: "past_due" })
        .eq("stripe_customer_id", customerId);

      // Send dunning email to recover involuntary churn
      const { data: failedProfile } = await supabaseAdmin
        .from("profiles")
        .select("id, email")
        .eq("stripe_customer_id", customerId)
        .single();

      if (failedProfile?.email) {
        // Advanced dunning: track retry attempts
        const attemptCount = invoice.attempt_count || 1;
        const nextRetryAt = invoice.next_payment_attempt
          ? new Date(invoice.next_payment_attempt * 1000).toISOString()
          : null;

        await supabaseAdmin.from("dunning_attempts").insert({
          user_id: failedProfile.id,
          stripe_invoice_id: invoice.id,
          attempt_number: attemptCount,
          amount: invoice.amount_due || 0,
          failure_reason: invoice.last_finalization_error?.message || "unknown",
          next_retry_at: nextRetryAt,
        });

        // Only send first payment_failed email (avoid spam on Stripe retries)
        const { data: alreadyRecorded } = await supabaseAdmin
          .from("onboarding_emails")
          .select("id")
          .eq("user_id", failedProfile.id)
          .eq("email_type", "payment_failed")
          .limit(1);

        if (!alreadyRecorded || alreadyRecorded.length === 0) {
          sendTransactionalEmail(failedProfile.email, "payment_failed", failedProfile.id);
          await supabaseAdmin.from("onboarding_emails").insert({
            user_id: failedProfile.id,
            email_type: "payment_failed",
          });
        }

        // CRM event for payment failure
        sendCRMEvent(supabaseAdmin, "user.payment_failed", failedProfile.id, failedProfile.email, "pro", {
          attempt_number: attemptCount,
          amount: invoice.amount_due,
          next_retry_at: nextRetryAt,
        });
      }

      break;
    }

    case "checkout.session.expired": {
      const session = event.data.object as Stripe.Checkout.Session;
      const customerId = session.customer as string;

      if (customerId) {
        const { data: abandonedProfile } = await supabaseAdmin
          .from("profiles")
          .select("id, email, plan")
          .eq("stripe_customer_id", customerId)
          .single();

        // Only send if the user is still on free plan (didn't complete checkout elsewhere)
        if (abandonedProfile?.email && abandonedProfile.plan === "free") {
          // Check if we already sent this email recently (within 7 days)
          const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
          const { data: alreadySent } = await supabaseAdmin
            .from("onboarding_emails")
            .select("id")
            .eq("user_id", abandonedProfile.id)
            .eq("email_type", "checkout_abandoned")
            .gte("created_at", sevenDaysAgo.toISOString())
            .limit(1);

          if (!alreadySent || alreadySent.length === 0) {
            sendTransactionalEmail(abandonedProfile.email, "checkout_abandoned", abandonedProfile.id);
            await supabaseAdmin.from("onboarding_emails").insert({
              user_id: abandonedProfile.id,
              email_type: "checkout_abandoned",
            });
          }
        }
      }

      break;
    }

    case "customer.subscription.trial_will_end": {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;

      const { data: trialProfile } = await supabaseAdmin
        .from("profiles")
        .select("id, email, email_unsubscribed")
        .eq("stripe_customer_id", customerId)
        .single();

      if (trialProfile?.email && !trialProfile.email_unsubscribed) {
        const { data: alreadySent } = await supabaseAdmin
          .from("onboarding_emails")
          .select("id")
          .eq("user_id", trialProfile.id)
          .eq("email_type", "trial_expiring_3days")
          .limit(1);

        if (!alreadySent || alreadySent.length === 0) {
          sendTrialEmail(trialProfile.email, "trial_expiring_3days", trialProfile.id);
          await supabaseAdmin.from("onboarding_emails").insert({
            user_id: trialProfile.id,
            email_type: "trial_expiring_3days",
          });
        }
      }

      break;
    }

    case "invoice.payment_action_required": {
      const invoice = event.data.object as Stripe.Invoice;
      const customerId = invoice.customer as string;

      const { data: actionProfile } = await supabaseAdmin
        .from("profiles")
        .select("id, email")
        .eq("stripe_customer_id", customerId)
        .single();

      if (actionProfile?.email) {
        sendTransactionalEmail(actionProfile.email, "payment_failed", actionProfile.id);
      }

      break;
    }

    case "invoice.paid": {
      const invoice = event.data.object as Stripe.Invoice;
      const customerId = invoice.customer as string;

      // Clear past_due status when payment succeeds (recovery from dunning)
      const { data: wasRecovered } = await supabaseAdmin
        .from("profiles")
        .select("id, email")
        .eq("stripe_customer_id", customerId)
        .eq("subscription_status", "past_due")
        .single();

      await supabaseAdmin
        .from("profiles")
        .update({ subscription_status: "active", plan: "pro" })
        .eq("stripe_customer_id", customerId)
        .eq("subscription_status", "past_due");

      // Clean up dunning email records so they don't block future dunning cycles
      const { data: recoveredProfile } = await supabaseAdmin
        .from("profiles")
        .select("id, email")
        .eq("stripe_customer_id", customerId)
        .single();

      if (recoveredProfile) {
        await supabaseAdmin
          .from("onboarding_emails")
          .delete()
          .eq("user_id", recoveredProfile.id)
          .in("email_type", ["payment_failed", "payment_failed_day4", "payment_failed_day7"]);

        // Clean up dunning attempts on successful payment
        await supabaseAdmin
          .from("dunning_attempts")
          .delete()
          .eq("user_id", recoveredProfile.id)
          .eq("stripe_invoice_id", invoice.id);

        // CRM event for payment recovered (only if was actually past_due)
        if (wasRecovered?.email) {
          sendCRMEvent(supabaseAdmin, "user.payment_recovered", recoveredProfile.id, wasRecovered.email, "pro", {
            recovered_amount: invoice.amount_paid,
          });
        }
      }

      // Track renewal via GA4
      const invoiceAmount = invoice.amount_paid || 0;
      if (invoiceAmount > 0) {
        sendGA4Event(customerId, "subscription_renewed", {
          plan: "pro",
          price: invoiceAmount,
          currency: "JPY",
        });
      }

      break;
    }
  }

  return NextResponse.json({ received: true });
}
