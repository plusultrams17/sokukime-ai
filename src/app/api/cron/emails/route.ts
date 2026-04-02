import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendTrialEmail, sendEngagementEmail, sendTransactionalEmail, sendAdminEmail, sendEmailWithABVariant } from "@/lib/email";
import type { WeeklyRevenueData, AdminAlertData } from "@/lib/email";
import { computeHealthScore, recordHealthScore, predictChurn } from "@/lib/health-score";
import { getABAssignment, recordABConversion } from "@/lib/ab-test";
import { logCronExecution, getLastCronStatus } from "@/lib/cron-logger";
import { sendCRMEvent } from "@/lib/crm-webhook";

/**
 * Cron job: Sends automated emails based on user lifecycle.
 *
 * Runs daily via Vercel Cron. Handles:
 * 1. Trial expiring (last day) → trial_expiring_6days
 * 2. Trial expiring in 3 days → trial_expiring_3days
 * 3. Trial expiring in 1 day → trial_expiring_1day
 * 4. Trial expired (just ended) → trial_expired
 * 5. Inactive users (7+ days no roleplay) → inactive_reminder
 *
 * Protected by CRON_SECRET to prevent unauthorized access.
 */
export async function GET(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    return NextResponse.json({ error: "Missing Supabase config" }, { status: 500 });
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  const now = new Date();
  const cronStartTime = Date.now();
  const results = { trial_6days: 0, trial_3days: 0, trial_1day: 0, trial_expired: 0, inactive: 0, no_roleplay: 0, pause_resume: 0, dunning_day4: 0, dunning_day7: 0, winback_7d: 0, winback_30d: 0, power_user: 0, referral_nudge: 0, streak_milestone: 0, pro_day1: 0, pro_day3: 0, pro_day7: 0, weekly_digest: 0, nps_survey: 0, at_risk: 0, monthly_to_annual: 0, reverse_trial_expired: 0, admin_weekly: 0, admin_alerts: 0, predictive_churn: 0, health_scores_recorded: 0, crm_events: 0, ab_tests_applied: 0, errors: 0 };

  // ── 1. Trial expiring emails ──
  // Find users with subscription_status = 'trialing'
  // and check their trial end date from Stripe metadata or created_at + 7 days
  const { data: trialingUsers } = await supabase
    .from("profiles")
    .select("id, email, created_at, subscription_status, email_unsubscribed")
    .eq("subscription_status", "trialing")
    .not("email", "is", null);

  if (trialingUsers) {
    for (const user of trialingUsers) {
      if (!user.email || user.email_unsubscribed) continue;

      // Calculate trial end date (7 days after subscription started)
      // We use the profiles.updated_at or a heuristic based on when status became 'trialing'
      const { data: emailLog } = await supabase
        .from("onboarding_emails")
        .select("email_type")
        .eq("user_id", user.id)
        .in("email_type", ["trial_expiring_6days", "trial_expiring_3days", "trial_expiring_1day", "trial_expired"]);

      const sentTypes = new Set(emailLog?.map((e) => e.email_type) || []);

      // Estimate trial start: look for checkout completion or use profile update
      // For simplicity, we check against profiles.created_at as a baseline
      // In production, store trial_start in profiles when checkout completes
      const createdAt = new Date(user.created_at);
      const trialEndDate = new Date(createdAt.getTime() + 7 * 24 * 60 * 60 * 1000);
      const daysUntilEnd = Math.ceil((trialEndDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

      try {
        if (daysUntilEnd === 1 && !sentTypes.has("trial_expiring_6days")) {
          // Last day (today ends) → "トライアル最終日"
          const sent = await sendTrialEmail(user.email, "trial_expiring_6days", user.id);
          if (sent) {
            await supabase.from("onboarding_emails").insert({ user_id: user.id, email_type: "trial_expiring_6days" });
            results.trial_6days++;
          }
        } else if (daysUntilEnd === 2 && !sentTypes.has("trial_expiring_1day")) {
          // Tomorrow ends → "明日で終了"
          const sent = await sendTrialEmail(user.email, "trial_expiring_1day", user.id);
          if (sent) {
            await supabase.from("onboarding_emails").insert({ user_id: user.id, email_type: "trial_expiring_1day" });
            results.trial_1day++;
          }
        } else if (daysUntilEnd >= 3 && daysUntilEnd <= 4 && !sentTypes.has("trial_expiring_3days")) {
          // 3-4 days remaining → "残り3日"
          const sent = await sendTrialEmail(user.email, "trial_expiring_3days", user.id);
          if (sent) {
            await supabase.from("onboarding_emails").insert({ user_id: user.id, email_type: "trial_expiring_3days" });
            results.trial_3days++;
          }
        }
      } catch {
        results.errors++;
      }
    }
  }

  // ── 2. Trial just expired (users who moved from trialing to active/canceled recently) ──
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const { data: recentlyExpired } = await supabase
    .from("profiles")
    .select("id, email, plan, subscription_status, email_unsubscribed")
    .eq("plan", "free")
    .in("subscription_status", ["canceled", "none"])
    .not("email", "is", null);

  if (recentlyExpired) {
    for (const user of recentlyExpired) {
      if (!user.email || user.email_unsubscribed) continue;

      const { data: emailLog } = await supabase
        .from("onboarding_emails")
        .select("email_type")
        .eq("user_id", user.id)
        .eq("email_type", "trial_expired");

      // Only send if they had a trial (check if trial emails were sent)
      const { data: hadTrial } = await supabase
        .from("onboarding_emails")
        .select("id")
        .eq("user_id", user.id)
        .in("email_type", ["trial_expiring_6days", "trial_expiring_3days", "trial_expiring_1day"])
        .limit(1);

      if (hadTrial && hadTrial.length > 0 && (!emailLog || emailLog.length === 0)) {
        try {
          const sent = await sendTrialEmail(user.email, "trial_expired", user.id);
          if (sent) {
            await supabase.from("onboarding_emails").insert({ user_id: user.id, email_type: "trial_expired" });
            results.trial_expired++;
          }
        } catch {
          results.errors++;
        }
      }
    }
  }

  // ── 3. Inactive user reminders (7+ days since last roleplay) ──
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  // Find users who have done at least 1 roleplay but none in the last 7 days
  // Include both free AND pro users (pro users who go inactive are at churn risk)
  const { data: inactiveUsers } = await supabase
    .from("profiles")
    .select("id, email, plan, email_unsubscribed")
    .in("plan", ["free", "pro"])
    .not("email", "is", null);

  if (inactiveUsers) {
    for (const user of inactiveUsers) {
      if (!user.email || user.email_unsubscribed) continue;

      // Check if they have recent activity
      const { data: recentActivity } = await supabase
        .from("usage_records")
        .select("id")
        .eq("user_id", user.id)
        .gte("created_at", sevenDaysAgo.toISOString())
        .limit(1);

      if (recentActivity && recentActivity.length > 0) continue; // Still active

      // Check if they have any past activity (not brand new users)
      const { data: anyActivity } = await supabase
        .from("usage_records")
        .select("id")
        .eq("user_id", user.id)
        .gte("created_at", thirtyDaysAgo.toISOString())
        .limit(1);

      if (!anyActivity || anyActivity.length === 0) continue; // No activity in 30 days or never used

      // Check if we already sent this email recently (within 14 days)
      const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
      const { data: recentReminder } = await supabase
        .from("onboarding_emails")
        .select("id")
        .eq("user_id", user.id)
        .eq("email_type", "inactive_reminder")
        .gte("created_at", fourteenDaysAgo.toISOString())
        .limit(1);

      if (recentReminder && recentReminder.length > 0) continue; // Already reminded recently

      try {
        // A/B test support: check for active variant
        const abAssignment = await getABAssignment(supabase, user.id, "inactive_reminder");
        const sent = abAssignment?.variantData.subject
          ? await sendEmailWithABVariant(user.email, "inactive_reminder", user.id, abAssignment.variantData.subject)
          : await sendEngagementEmail(user.email, "inactive_reminder", user.id);
        if (sent) {
          await supabase.from("onboarding_emails").insert({
            user_id: user.id,
            email_type: "inactive_reminder",
            ab_test_id: abAssignment?.testId || null,
            ab_variant: abAssignment?.variant || null,
          });
          if (abAssignment) {
            await recordABConversion(supabase, abAssignment.testId, user.id, abAssignment.variant, "sent");
            results.ab_tests_applied++;
          }
          results.inactive++;
        }
      } catch {
        results.errors++;
      }
    }
  }

  // ── 4. Pre-activation reminder (signed up 3+ days ago, never did a roleplay) ──
  const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
  const tenDaysAgo = new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000);

  const { data: newUsers } = await supabase
    .from("profiles")
    .select("id, email, created_at, email_unsubscribed")
    .not("email", "is", null)
    .lte("created_at", threeDaysAgo.toISOString())
    .gte("created_at", tenDaysAgo.toISOString()); // Only check users 3-10 days old

  if (newUsers) {
    for (const user of newUsers) {
      if (!user.email || user.email_unsubscribed) continue;

      // Check if they have ANY usage records
      const { data: anyUsage } = await supabase
        .from("usage_records")
        .select("id")
        .eq("user_id", user.id)
        .limit(1);

      if (anyUsage && anyUsage.length > 0) continue; // Has done at least 1 roleplay

      // Check if we already sent this email
      const { data: alreadySent } = await supabase
        .from("onboarding_emails")
        .select("id")
        .eq("user_id", user.id)
        .eq("email_type", "no_roleplay_day3")
        .limit(1);

      if (alreadySent && alreadySent.length > 0) continue;

      try {
        const sent = await sendEngagementEmail(user.email, "no_roleplay_day3", user.id);
        if (sent) {
          await supabase.from("onboarding_emails").insert({ user_id: user.id, email_type: "no_roleplay_day3" });
          results.no_roleplay++;
        }
      } catch {
        results.errors++;
      }
    }
  }

  // ── 5. Pause resuming in 3 days notification ──
  const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

  const { data: pausedUsers } = await supabase
    .from("profiles")
    .select("id, email, pause_resume_date, email_unsubscribed")
    .eq("subscription_status", "paused")
    .not("email", "is", null)
    .not("pause_resume_date", "is", null);

  if (pausedUsers) {
    for (const user of pausedUsers) {
      if (!user.email || user.email_unsubscribed || !user.pause_resume_date) continue;

      const resumeDate = new Date(user.pause_resume_date);
      const daysUntilResume = Math.ceil((resumeDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

      if (daysUntilResume <= 3 && daysUntilResume > 0) {
        const { data: alreadySent } = await supabase
          .from("onboarding_emails")
          .select("id")
          .eq("user_id", user.id)
          .eq("email_type", "pause_resuming_3days")
          .limit(1);

        if (alreadySent && alreadySent.length > 0) continue;

        try {
          const sent = await sendTransactionalEmail(user.email, "pause_resuming_3days", user.id);
          if (sent) {
            await supabase.from("onboarding_emails").insert({ user_id: user.id, email_type: "pause_resuming_3days" });
            results.pause_resume++;
          }
        } catch {
          results.errors++;
        }
      }
    }
  }

  // ── 6. Advanced payment failure follow-up (Day 4 & Day 7 with retry awareness) ──
  const { data: pastDueUsers } = await supabase
    .from("profiles")
    .select("id, email, subscription_status, email_unsubscribed")
    .eq("subscription_status", "past_due")
    .not("email", "is", null);

  if (pastDueUsers) {
    for (const user of pastDueUsers) {
      if (!user.email || user.email_unsubscribed) continue;

      // Check when the first payment_failed email was sent to calculate Day 4 / Day 7
      const { data: firstFailEmail } = await supabase
        .from("onboarding_emails")
        .select("created_at")
        .eq("user_id", user.id)
        .eq("email_type", "payment_failed")
        .order("created_at", { ascending: true })
        .limit(1);

      if (!firstFailEmail || firstFailEmail.length === 0) continue;

      const firstFailDate = new Date(firstFailEmail[0].created_at);
      const daysSinceFirstFail = Math.floor((now.getTime() - firstFailDate.getTime()) / (1000 * 60 * 60 * 24));

      // Advanced dunning: check latest retry attempt info
      const { data: latestDunning } = await supabase
        .from("dunning_attempts")
        .select("attempt_number, next_retry_at, amount")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1);

      const retryCount = latestDunning?.[0]?.attempt_number || 0;
      const nextRetryAt = latestDunning?.[0]?.next_retry_at;

      // Smart timing: avoid sending dunning email right before a Stripe auto-retry
      // (Stripe may succeed on retry, making our email confusing)
      const isRetryingSoon = nextRetryAt &&
        new Date(nextRetryAt).getTime() - now.getTime() < 24 * 60 * 60 * 1000;

      // Day 4 follow-up (skip if Stripe is retrying within 24h)
      if (daysSinceFirstFail >= 4 && daysSinceFirstFail < 7 && !isRetryingSoon) {
        const { data: alreadySent } = await supabase
          .from("onboarding_emails")
          .select("id")
          .eq("user_id", user.id)
          .eq("email_type", "payment_failed_day4")
          .limit(1);

        if (!alreadySent || alreadySent.length === 0) {
          try {
            const sent = await sendTransactionalEmail(user.email, "payment_failed_day4", user.id);
            if (sent) {
              await supabase.from("onboarding_emails").insert({ user_id: user.id, email_type: "payment_failed_day4" });
              results.dunning_day4++;
            }
          } catch {
            results.errors++;
          }
        }
      }

      // Day 7 final notice (always send regardless of retry — this is urgent)
      // After 3+ Stripe retries, the card is likely truly failed
      if (daysSinceFirstFail >= 7) {
        const { data: alreadySent } = await supabase
          .from("onboarding_emails")
          .select("id")
          .eq("user_id", user.id)
          .eq("email_type", "payment_failed_day7")
          .limit(1);

        if (!alreadySent || alreadySent.length === 0) {
          try {
            const sent = await sendTransactionalEmail(user.email, "payment_failed_day7", user.id);
            if (sent) {
              await supabase.from("onboarding_emails").insert({ user_id: user.id, email_type: "payment_failed_day7" });
              results.dunning_day7++;

              // CRM event: final dunning notice
              sendCRMEvent(supabase, "user.payment_failed", user.id, user.email, "pro", {
                stage: "final_notice",
                days_overdue: daysSinceFirstFail,
                retry_count: retryCount,
              });
            }
          } catch {
            results.errors++;
          }
        }
      }
    }
  }

  // ── 7. Win-back emails (Day 7 & Day 30 after cancellation) ──
  const { data: canceledUsers } = await supabase
    .from("profiles")
    .select("id, email, subscription_status, email_unsubscribed")
    .eq("subscription_status", "canceled")
    .eq("plan", "free")
    .not("email", "is", null);

  if (canceledUsers) {
    for (const user of canceledUsers) {
      if (!user.email || user.email_unsubscribed) continue;

      // Find when cancellation email was sent (anchor for timing)
      const { data: cancelEmail } = await supabase
        .from("onboarding_emails")
        .select("created_at")
        .eq("user_id", user.id)
        .eq("email_type", "subscription_canceled")
        .order("created_at", { ascending: false })
        .limit(1);

      if (!cancelEmail || cancelEmail.length === 0) continue;

      const cancelDate = new Date(cancelEmail[0].created_at);
      const daysSinceCancel = Math.floor((now.getTime() - cancelDate.getTime()) / (1000 * 60 * 60 * 24));

      try {
        // Day 7 win-back
        if (daysSinceCancel >= 7 && daysSinceCancel < 14) {
          const { data: already } = await supabase
            .from("onboarding_emails")
            .select("id")
            .eq("user_id", user.id)
            .eq("email_type", "winback_7days")
            .limit(1);

          if (!already || already.length === 0) {
            const sent = await sendTransactionalEmail(user.email, "winback_7days", user.id);
            if (sent) {
              await supabase.from("onboarding_emails").insert({ user_id: user.id, email_type: "winback_7days" });
              results.winback_7d++;
            }
          }
        }

        // Day 30 win-back
        if (daysSinceCancel >= 30 && daysSinceCancel < 37) {
          const { data: already } = await supabase
            .from("onboarding_emails")
            .select("id")
            .eq("user_id", user.id)
            .eq("email_type", "winback_30days")
            .limit(1);

          if (!already || already.length === 0) {
            const sent = await sendTransactionalEmail(user.email, "winback_30days", user.id);
            if (sent) {
              await supabase.from("onboarding_emails").insert({ user_id: user.id, email_type: "winback_30days" });
              results.winback_30d++;
            }
          }
        }
      } catch {
        results.errors++;
      }
    }
  }

  // ── 8. Power user upgrade trigger (free users hitting limit 3+ consecutive days) ──
  const { data: freeUsers } = await supabase
    .from("profiles")
    .select("id, email, plan, email_unsubscribed")
    .eq("plan", "free")
    .not("email", "is", null);

  if (freeUsers) {
    for (const user of freeUsers) {
      if (!user.email || user.email_unsubscribed) continue;

      // Check usage for the last 3 days
      const threeDaysAgoDate = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
      const { data: recentUsage } = await supabase
        .from("usage_records")
        .select("used_date")
        .eq("user_id", user.id)
        .gte("used_date", threeDaysAgoDate.toISOString().split("T")[0]);

      if (!recentUsage) continue;

      // Count unique days with usage
      const uniqueDays = new Set(recentUsage.map((r) => r.used_date));
      if (uniqueDays.size < 3) continue; // Not 3 consecutive days

      // Check if we already sent this email (within 30 days)
      const thirtyDaysAgoCheck = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      const { data: alreadySent } = await supabase
        .from("onboarding_emails")
        .select("id")
        .eq("user_id", user.id)
        .eq("email_type", "power_user_upgrade")
        .gte("created_at", thirtyDaysAgoCheck.toISOString())
        .limit(1);

      if (alreadySent && alreadySent.length > 0) continue;

      try {
        const abAssignment = await getABAssignment(supabase, user.id, "power_user_upgrade");
        const sent = abAssignment?.variantData.subject
          ? await sendEmailWithABVariant(user.email, "power_user_upgrade", user.id, abAssignment.variantData.subject)
          : await sendEngagementEmail(user.email, "power_user_upgrade", user.id);
        if (sent) {
          await supabase.from("onboarding_emails").insert({
            user_id: user.id,
            email_type: "power_user_upgrade",
            ab_test_id: abAssignment?.testId || null,
            ab_variant: abAssignment?.variant || null,
          });
          if (abAssignment) {
            await recordABConversion(supabase, abAssignment.testId, user.id, abAssignment.variant, "sent");
            results.ab_tests_applied++;
          }
          results.power_user++;
        }
      } catch {
        results.errors++;
      }
    }
  }

  // ── 9. Referral nudge (users with 3+ roleplays, no referral activity, 7+ days old) ──
  const sevenDaysAgoDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const { data: eligibleForReferral } = await supabase
    .from("profiles")
    .select("id, email, created_at, email_unsubscribed")
    .not("email", "is", null)
    .lte("created_at", sevenDaysAgoDate.toISOString());

  if (eligibleForReferral) {
    for (const user of eligibleForReferral) {
      if (!user.email || user.email_unsubscribed) continue;

      // Check if already sent
      const { data: alreadySent } = await supabase
        .from("onboarding_emails")
        .select("id")
        .eq("user_id", user.id)
        .eq("email_type", "referral_nudge")
        .limit(1);

      if (alreadySent && alreadySent.length > 0) continue;

      // Check if they have 3+ roleplays (engaged enough to refer)
      const { count: roleplayCount } = await supabase
        .from("usage_records")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id);

      if (!roleplayCount || roleplayCount < 3) continue;

      // Check if they already have referral activity
      const { data: hasReferral } = await supabase
        .from("referral_codes")
        .select("id")
        .eq("user_id", user.id)
        .limit(1);

      // Only skip if they have referral AND conversions (code generated = good, but no conversions = nudge worthy)
      if (hasReferral && hasReferral.length > 0) {
        const { data: hasConversions } = await supabase
          .from("referral_conversions")
          .select("id")
          .eq("referrer_id", user.id)
          .limit(1);

        if (hasConversions && hasConversions.length > 0) continue; // Already referring successfully
      }

      try {
        const sent = await sendEngagementEmail(user.email, "referral_nudge", user.id);
        if (sent) {
          await supabase.from("onboarding_emails").insert({ user_id: user.id, email_type: "referral_nudge" });
          results.referral_nudge++;
        }
      } catch {
        results.errors++;
      }
    }
  }

  // ── 9.5. Streak milestone emails (3, 7, 14, 30 day streaks) ──
  // Celebrate and reinforce daily practice habit
  const STREAK_MILESTONES = [3, 7, 14, 30];
  const { data: allActiveUsers } = await supabase
    .from("profiles")
    .select("id, email, email_unsubscribed")
    .not("email", "is", null);

  if (allActiveUsers) {
    for (const user of allActiveUsers) {
      if (!user.email || user.email_unsubscribed) continue;
      try {
        // Get user's current streak from usage records
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        let streak = 0;
        const checkDate = new Date(now);
        for (let i = 0; i < 31; i++) {
          const dayStr = checkDate.toISOString().split("T")[0];
          const { count } = await supabase
            .from("usage_records")
            .select("id", { count: "exact", head: true })
            .eq("user_id", user.id)
            .gte("created_at", dayStr + "T00:00:00")
            .lt("created_at", dayStr + "T23:59:59");
          if (count && count > 0) {
            streak++;
            checkDate.setDate(checkDate.getDate() - 1);
          } else {
            break;
          }
        }

        // Check if streak hits a milestone
        if (STREAK_MILESTONES.includes(streak)) {
          const milestoneKey = `streak_milestone_${streak}`;
          const { data: alreadySent } = await supabase
            .from("onboarding_emails")
            .select("id")
            .eq("user_id", user.id)
            .eq("email_type", milestoneKey)
            .limit(1);

          if (!alreadySent || alreadySent.length === 0) {
            const sent = await sendEngagementEmail(user.email, "streak_milestone", user.id);
            if (sent) {
              await supabase.from("onboarding_emails").insert({ user_id: user.id, email_type: milestoneKey });
              results.streak_milestone++;
            }
          }
        }
      } catch {
        results.errors++;
      }
    }
  }

  // ── 10. Weekly progress digest for Pro users ──
  // Sent once per week to active Pro users who have done at least 1 roleplay
  const sixDaysAgo = new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000);

  const { data: activeProUsers } = await supabase
    .from("profiles")
    .select("id, email, plan, email_unsubscribed")
    .eq("plan", "pro")
    .not("email", "is", null);

  if (activeProUsers) {
    for (const user of activeProUsers) {
      if (!user.email || user.email_unsubscribed) continue;

      // Check if we already sent weekly_digest in the last 6 days
      const { data: recentDigest } = await supabase
        .from("onboarding_emails")
        .select("id")
        .eq("user_id", user.id)
        .eq("email_type", "weekly_digest")
        .gte("created_at", sixDaysAgo.toISOString())
        .limit(1);

      if (recentDigest && recentDigest.length > 0) continue;

      // Check if they have recent activity (within last 14 days) — only send to active users
      const fourteenDaysAgoDate = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
      const { data: hasRecentActivity } = await supabase
        .from("usage_records")
        .select("id")
        .eq("user_id", user.id)
        .gte("created_at", fourteenDaysAgoDate.toISOString())
        .limit(1);

      if (!hasRecentActivity || hasRecentActivity.length === 0) continue;

      try {
        const sent = await sendTransactionalEmail(user.email, "weekly_digest", user.id);
        if (sent) {
          await supabase.from("onboarding_emails").insert({ user_id: user.id, email_type: "weekly_digest" });
          results.weekly_digest++;
        }
      } catch {
        results.errors++;
      }
    }
  }

  // ── 11. Post-Pro onboarding emails (Day 1, 3, 7 after Pro activation) ──
  // Uses pro_welcome email send time as anchor for when user became Pro
  const { data: proUsers } = await supabase
    .from("profiles")
    .select("id, email, plan, email_unsubscribed")
    .eq("plan", "pro")
    .not("email", "is", null);

  if (proUsers) {
    for (const user of proUsers) {
      if (!user.email || user.email_unsubscribed) continue;

      // Find when pro_welcome was sent (anchor for Pro activation date)
      const { data: welcomeEmail } = await supabase
        .from("onboarding_emails")
        .select("created_at")
        .eq("user_id", user.id)
        .eq("email_type", "pro_welcome")
        .order("created_at", { ascending: false })
        .limit(1);

      if (!welcomeEmail || welcomeEmail.length === 0) continue;

      const proStartDate = new Date(welcomeEmail[0].created_at);
      const daysSincePro = Math.floor((now.getTime() - proStartDate.getTime()) / (1000 * 60 * 60 * 24));

      // Check which onboarding emails have already been sent
      const { data: sentProEmails } = await supabase
        .from("onboarding_emails")
        .select("email_type")
        .eq("user_id", user.id)
        .in("email_type", ["pro_onboarding_day1", "pro_onboarding_day3", "pro_onboarding_day7"]);

      const sentProTypes = new Set(sentProEmails?.map((e) => e.email_type) || []);

      try {
        if (daysSincePro >= 1 && daysSincePro < 3 && !sentProTypes.has("pro_onboarding_day1")) {
          const sent = await sendTransactionalEmail(user.email, "pro_onboarding_day1", user.id);
          if (sent) {
            await supabase.from("onboarding_emails").insert({ user_id: user.id, email_type: "pro_onboarding_day1" });
            results.pro_day1++;
          }
        } else if (daysSincePro >= 3 && daysSincePro < 7 && !sentProTypes.has("pro_onboarding_day3")) {
          const sent = await sendTransactionalEmail(user.email, "pro_onboarding_day3", user.id);
          if (sent) {
            await supabase.from("onboarding_emails").insert({ user_id: user.id, email_type: "pro_onboarding_day3" });
            results.pro_day3++;
          }
        } else if (daysSincePro >= 7 && daysSincePro < 14 && !sentProTypes.has("pro_onboarding_day7")) {
          const sent = await sendTransactionalEmail(user.email, "pro_onboarding_day7", user.id);
          if (sent) {
            await supabase.from("onboarding_emails").insert({ user_id: user.id, email_type: "pro_onboarding_day7" });
            results.pro_day7++;
          }
        }
      } catch {
        results.errors++;
      }
    }
  }

  // ── 12. NPS Survey (Day 14 after Pro activation) ──
  // Sent once to Pro users 14+ days after activation.
  // Based on Bain & Company NPS methodology — measure at "moment of truth" after
  // enough time to form an opinion but before habituation reduces response accuracy.
  if (proUsers) {
    for (const user of proUsers) {
      if (!user.email || user.email_unsubscribed) continue;

      // Use pro_welcome send time as anchor
      const { data: proWelcome } = await supabase
        .from("onboarding_emails")
        .select("created_at")
        .eq("user_id", user.id)
        .eq("email_type", "pro_welcome")
        .order("created_at", { ascending: false })
        .limit(1);

      if (!proWelcome || proWelcome.length === 0) continue;

      const proStart = new Date(proWelcome[0].created_at);
      const daysSincePro = Math.floor((now.getTime() - proStart.getTime()) / (1000 * 60 * 60 * 24));

      if (daysSincePro >= 14 && daysSincePro < 21) {
        const { data: alreadySent } = await supabase
          .from("onboarding_emails")
          .select("id")
          .eq("user_id", user.id)
          .eq("email_type", "nps_survey")
          .limit(1);

        if (!alreadySent || alreadySent.length === 0) {
          try {
            const sent = await sendEngagementEmail(user.email, "nps_survey", user.id);
            if (sent) {
              await supabase.from("onboarding_emails").insert({ user_id: user.id, email_type: "nps_survey" });
              results.nps_survey++;
            }
          } catch {
            results.errors++;
          }
        }
      }
    }
  }

  // ── 13. At-risk health score intervention ──
  // Pro users with health score < 50 get a nudge email (max once per 14 days)
  {
    const { data: proUsers } = await supabase
      .from("profiles")
      .select("id, email, email_unsubscribed, subscription_status")
      .eq("plan", "pro")
      .in("subscription_status", ["active", "trialing"])
      .not("email", "is", null);

    if (proUsers) {
      for (const user of proUsers) {
        if (!user.email || user.email_unsubscribed) continue;

        try {
          // Check if we already sent at_risk email in the last 14 days
          const fourteenDaysAgo = new Date(now.getTime() - 14 * 86400000).toISOString();
          const { data: recentSent } = await supabase
            .from("onboarding_emails")
            .select("id")
            .eq("user_id", user.id)
            .eq("email_type", "at_risk_intervention")
            .gte("created_at", fourteenDaysAgo)
            .limit(1);

          if (recentSent && recentSent.length > 0) continue;

          const health = await computeHealthScore(supabase, user.id);
          if (health.score < 50 && health.daysSinceLastActivity >= 5) {
            const sent = await sendEngagementEmail(user.email, "at_risk_intervention", user.id);
            if (sent) {
              await supabase.from("onboarding_emails").insert({ user_id: user.id, email_type: "at_risk_intervention" });
              // Update engagement_score in profile
              await supabase.from("profiles").update({ engagement_score: health.score }).eq("id", user.id);
              results.at_risk++;
            }
          }
        } catch {
          results.errors++;
        }
      }
    }
  }

  // ── 14. Monthly-to-annual upgrade prompt ──
  // Pro users on monthly billing for 3+ months, prompt to switch to annual
  {
    const { data: monthlyPros } = await supabase
      .from("profiles")
      .select("id, email, email_unsubscribed, created_at")
      .eq("plan", "pro")
      .eq("subscription_status", "active")
      .not("email", "is", null);

    if (monthlyPros) {
      for (const user of monthlyPros) {
        if (!user.email || user.email_unsubscribed) continue;

        try {
          // Check if already sent monthly_to_annual email
          const { data: alreadySent } = await supabase
            .from("onboarding_emails")
            .select("id")
            .eq("user_id", user.id)
            .eq("email_type", "monthly_to_annual")
            .limit(1);

          if (alreadySent && alreadySent.length > 0) continue;

          // Check Pro activation date (use pro_welcome email as anchor)
          const { data: proWelcome } = await supabase
            .from("onboarding_emails")
            .select("created_at")
            .eq("user_id", user.id)
            .eq("email_type", "pro_welcome")
            .order("created_at", { ascending: false })
            .limit(1);

          if (!proWelcome || proWelcome.length === 0) continue;

          const proStart = new Date(proWelcome[0].created_at);
          const daysSincePro = Math.floor((now.getTime() - proStart.getTime()) / (1000 * 60 * 60 * 24));

          // Send at 90 days (3 months)
          if (daysSincePro >= 90 && daysSincePro < 120) {
            const sent = await sendEngagementEmail(user.email, "monthly_to_annual", user.id);
            if (sent) {
              await supabase.from("onboarding_emails").insert({ user_id: user.id, email_type: "monthly_to_annual" });
              results.monthly_to_annual++;
            }
          }
        } catch {
          results.errors++;
        }
      }
    }
  }

  // ── 15. Reverse trial expiration ──
  // Downgrade users whose reverse trial has ended (trial_ends_at < now, plan still 'pro', no Stripe subscription)
  {
    const { data: expiredTrials } = await supabase
      .from("profiles")
      .select("id, email, email_unsubscribed")
      .eq("plan", "pro")
      .is("stripe_subscription_id", null)
      .lt("trial_ends_at", now.toISOString())
      .not("trial_ends_at", "is", null);

    if (expiredTrials) {
      for (const user of expiredTrials) {
        try {
          await supabase
            .from("profiles")
            .update({ plan: "free", trial_ends_at: null })
            .eq("id", user.id);

          if (user.email && !user.email_unsubscribed) {
            await sendTrialEmail(user.email, "trial_expired", user.id);
          }
          results.reverse_trial_expired++;
        } catch {
          results.errors++;
        }
      }
    }
  }

  // ── 16. Weekly admin revenue report (Mondays only) ──
  const adminEmail = process.env.ADMIN_EMAIL;
  if (adminEmail && now.getDay() === 1) {
    try {
      const sevenDaysAgoISO = new Date(now.getTime() - 7 * 86400000).toISOString();

      // Total users
      const { count: totalUsers } = await supabase
        .from("profiles")
        .select("id", { count: "exact", head: true });

      // New users this week
      const { count: newUsersThisWeek } = await supabase
        .from("profiles")
        .select("id", { count: "exact", head: true })
        .gte("created_at", sevenDaysAgoISO);

      // Pro users
      const { count: proUsers } = await supabase
        .from("profiles")
        .select("id", { count: "exact", head: true })
        .eq("plan", "pro")
        .not("stripe_subscription_id", "is", null);

      // MRR = pro users * 2980
      const mrr = (proUsers || 0) * 2980;

      // Total sessions
      const { count: totalSessions } = await supabase
        .from("usage_records")
        .select("id", { count: "exact", head: true });

      // Sessions this week
      const { count: sessionsThisWeek } = await supabase
        .from("usage_records")
        .select("id", { count: "exact", head: true })
        .gte("created_at", sevenDaysAgoISO);

      // Churned this week (subscription_canceled emails sent this week)
      const { count: churnedThisWeek } = await supabase
        .from("onboarding_emails")
        .select("id", { count: "exact", head: true })
        .eq("email_type", "subscription_canceled")
        .gte("created_at", sevenDaysAgoISO);

      // Trial conversions (pro_welcome sent this week = new Pro activations)
      const { count: trialConversions } = await supabase
        .from("onboarding_emails")
        .select("id", { count: "exact", head: true })
        .eq("email_type", "pro_welcome")
        .gte("created_at", sevenDaysAgoISO);

      // Leads captured this week
      const { count: leadsCaptured } = await supabase
        .from("beta_signups")
        .select("id", { count: "exact", head: true })
        .gte("created_at", sevenDaysAgoISO);

      const reportData: WeeklyRevenueData = {
        totalUsers: totalUsers || 0,
        newUsersThisWeek: newUsersThisWeek || 0,
        proUsers: proUsers || 0,
        mrr,
        totalSessions: totalSessions || 0,
        sessionsThisWeek: sessionsThisWeek || 0,
        churnedThisWeek: churnedThisWeek || 0,
        trialConversions: trialConversions || 0,
        leadsCaptured: leadsCaptured || 0,
      };

      const sent = await sendAdminEmail(adminEmail, "weekly_revenue_report", reportData);
      if (sent) results.admin_weekly++;
    } catch {
      results.errors++;
    }
  }

  // ── 17. Admin alert: churn spike or MRR drop ──
  if (adminEmail) {
    try {
      const sevenDaysAgoISO = new Date(now.getTime() - 7 * 86400000).toISOString();
      const fourteenDaysAgoISO = new Date(now.getTime() - 14 * 86400000).toISOString();

      // Check churn spike: > 3 cancellations in last 7 days
      const { count: churnCount } = await supabase
        .from("onboarding_emails")
        .select("id", { count: "exact", head: true })
        .eq("email_type", "subscription_canceled")
        .gte("created_at", sevenDaysAgoISO);

      if (churnCount && churnCount > 3) {
        const alertData: AdminAlertData = {
          alertType: "churn_spike",
          value: churnCount,
          threshold: 3,
          details: `過去7日間で${churnCount}件の解約が発生しています。通常の閾値（3件）を超えています。早急に原因を調査してください。`,
        };
        const sent = await sendAdminEmail(adminEmail, "admin_alert", alertData);
        if (sent) results.admin_alerts++;
      }

      // Check MRR drop: compare this week vs last week Pro user count
      const { count: currentProCount } = await supabase
        .from("profiles")
        .select("id", { count: "exact", head: true })
        .eq("plan", "pro")
        .not("stripe_subscription_id", "is", null);

      // Estimate last week's Pro count by checking cancellations in last 7 days
      const currentMRR = (currentProCount || 0) * 2980;
      const estimatedPreviousMRR = ((currentProCount || 0) + (churnCount || 0)) * 2980;

      if (estimatedPreviousMRR > 0) {
        const mrrDropPercent = Math.round(((estimatedPreviousMRR - currentMRR) / estimatedPreviousMRR) * 100);
        if (mrrDropPercent >= 10) {
          const alertData: AdminAlertData = {
            alertType: "mrr_drop",
            value: mrrDropPercent,
            threshold: 10,
            details: `MRRが前週比で約${mrrDropPercent}%低下しています（推定 ¥${estimatedPreviousMRR.toLocaleString()} → ¥${currentMRR.toLocaleString()}）。チャーン対策の見直しを推奨します。`,
          };
          const sent = await sendAdminEmail(adminEmail, "admin_alert", alertData);
          if (sent) results.admin_alerts++;
        }
      }
    } catch {
      results.errors++;
    }
  }

  // ── 18. Predictive churn detection + health score history recording ──
  {
    const { data: activeProUsers } = await supabase
      .from("profiles")
      .select("id, email, email_unsubscribed, subscription_status")
      .eq("plan", "pro")
      .in("subscription_status", ["active", "trialing"])
      .not("email", "is", null);

    if (activeProUsers) {
      for (const user of activeProUsers) {
        try {
          const health = await computeHealthScore(supabase, user.id);

          // Record health score to history (for trend analysis)
          await recordHealthScore(supabase, user.id, health);
          results.health_scores_recorded++;

          // Update engagement_score in profile
          await supabase.from("profiles").update({ engagement_score: health.score }).eq("id", user.id);

          // Predictive churn check (only for non-unsubscribed users)
          if (!user.email_unsubscribed && user.email) {
            const prediction = await predictChurn(supabase, user.id);

            if (prediction?.shouldIntervene) {
              // Check if we already sent predictive_churn email in the last 14 days
              const fourteenDaysAgo = new Date(now.getTime() - 14 * 86400000).toISOString();
              const { data: recentSent } = await supabase
                .from("onboarding_emails")
                .select("id")
                .eq("user_id", user.id)
                .eq("email_type", "predictive_churn")
                .gte("created_at", fourteenDaysAgo)
                .limit(1);

              if (!recentSent || recentSent.length === 0) {
                const sent = await sendEngagementEmail(user.email, "predictive_churn", user.id);
                if (sent) {
                  await supabase.from("onboarding_emails").insert({
                    user_id: user.id,
                    email_type: "predictive_churn",
                  });
                  results.predictive_churn++;
                }
              }
            }
          }
        } catch {
          results.errors++;
        }
      }
    }

    // Admin alert: predictive churn spike (5+ users declining in same period)
    if (adminEmail && results.predictive_churn >= 5) {
      try {
        const alertData: AdminAlertData = {
          alertType: "predictive_churn_spike",
          value: results.predictive_churn,
          threshold: 5,
          details: `過去24時間で${results.predictive_churn}人のProユーザーにヘルススコア下降トレンドを検知しました。早期の介入が必要な可能性があります。`,
        };
        await sendAdminEmail(adminEmail, "admin_alert", alertData);
        results.admin_alerts++;
      } catch {
        results.errors++;
      }
    }
  }

  // ── 19. CRM webhook: send daily summary of key lifecycle events ──
  {
    const oneDayAgoISO = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();

    // Send CRM events for new signups today
    const { data: todaySignups } = await supabase
      .from("profiles")
      .select("id, email, plan, created_at")
      .gte("created_at", oneDayAgoISO)
      .not("email", "is", null);

    if (todaySignups) {
      for (const user of todaySignups) {
        try {
          // Check if we already sent this CRM event
          const { data: alreadySent } = await supabase
            .from("crm_webhook_logs")
            .select("id")
            .eq("event_type", "user.signup")
            .eq("user_id", user.id)
            .limit(1);

          if (!alreadySent || alreadySent.length === 0) {
            const sent = await sendCRMEvent(
              supabase, "user.signup", user.id, user.email, user.plan,
              { created_at: user.created_at }
            );
            if (sent) results.crm_events++;
          }
        } catch {
          // CRM events are non-critical
        }
      }
    }

    // Send CRM events for new Pro conversions today
    const { data: todayProWelcomes } = await supabase
      .from("onboarding_emails")
      .select("user_id")
      .eq("email_type", "pro_welcome")
      .gte("created_at", oneDayAgoISO);

    if (todayProWelcomes) {
      for (const record of todayProWelcomes) {
        try {
          const { data: profile } = await supabase
            .from("profiles")
            .select("id, email, plan")
            .eq("id", record.user_id)
            .single();

          if (profile?.email) {
            const { data: alreadySent } = await supabase
              .from("crm_webhook_logs")
              .select("id")
              .eq("event_type", "user.pro_conversion")
              .eq("user_id", profile.id)
              .limit(1);

            if (!alreadySent || alreadySent.length === 0) {
              const sent = await sendCRMEvent(supabase, "user.pro_conversion", profile.id, profile.email, profile.plan);
              if (sent) results.crm_events++;
            }
          }
        } catch {
          // CRM events are non-critical
        }
      }
    }

    // Send CRM events for cancellations today
    const { data: todayCancels } = await supabase
      .from("onboarding_emails")
      .select("user_id")
      .eq("email_type", "subscription_canceled")
      .gte("created_at", oneDayAgoISO);

    if (todayCancels) {
      for (const record of todayCancels) {
        try {
          const { data: profile } = await supabase
            .from("profiles")
            .select("id, email, plan")
            .eq("id", record.user_id)
            .single();

          if (profile?.email) {
            const { data: alreadySent } = await supabase
              .from("crm_webhook_logs")
              .select("id")
              .eq("event_type", "user.cancellation")
              .eq("user_id", profile.id)
              .limit(1);

            if (!alreadySent || alreadySent.length === 0) {
              const sent = await sendCRMEvent(supabase, "user.cancellation", profile.id, profile.email, profile.plan);
              if (sent) results.crm_events++;
            }
          }
        } catch {
          // CRM events are non-critical
        }
      }
    }
  }

  // ── 20. Cron execution logging + failure alerting ──
  {
    const durationMs = Date.now() - cronStartTime;
    const status = results.errors > 10 ? "failure" : results.errors > 0 ? "partial_failure" : "success";

    try {
      await logCronExecution(supabase, {
        job_name: "daily_emails",
        status,
        duration_ms: durationMs,
        results,
        error_details: results.errors > 0 ? `${results.errors} errors occurred during execution` : undefined,
      });

      // Check for consecutive failures and alert admin
      if (adminEmail) {
        const cronStatus = await getLastCronStatus(supabase, "daily_emails");
        if (cronStatus.consecutiveFailures >= 2) {
          const alertData: AdminAlertData = {
            alertType: "cron_failure",
            value: cronStatus.consecutiveFailures,
            threshold: 2,
            details: `日次メールCronジョブが${cronStatus.consecutiveFailures}回連続で失敗/部分失敗しています。メール自動配信に影響が出ている可能性があります。`,
          };
          await sendAdminEmail(adminEmail, "admin_alert", alertData);
          results.admin_alerts++;
        }
      }
    } catch {
      // Logging failure should not break the response
    }
  }

  return NextResponse.json({
    success: true,
    timestamp: now.toISOString(),
    duration_ms: Date.now() - cronStartTime,
    results,
  });
}
