import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

/**
 * Admin Revenue Metrics API
 * Returns comprehensive business KPIs for operations monitoring.
 * Protected by ADMIN_SECRET (same pattern as CRON_SECRET).
 *
 * Usage: GET /api/admin/metrics?secret=YOUR_ADMIN_SECRET
 *
 * Returns: MRR, user counts, conversion rates, churn, email performance,
 * cohort data, and engagement metrics.
 */
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || authHeader !== `Bearer ${process.env.ADMIN_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabaseServiceKey) {
    return NextResponse.json({ error: "Missing config" }, { status: 500 });
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  const now = new Date();

  // ── User Counts (4-tier: Free / Starter ¥990 / Pro ¥1,980 / Master ¥4,980) ──
  const [totalResult, starterResult, proResult, masterResult, trialResult, freeResult, canceledResult] = await Promise.all([
    supabase.from("profiles").select("id", { count: "exact", head: true }),
    supabase.from("profiles").select("id", { count: "exact", head: true }).eq("plan", "starter"),
    supabase.from("profiles").select("id", { count: "exact", head: true }).eq("plan", "pro"),
    supabase.from("profiles").select("id", { count: "exact", head: true }).eq("plan", "master"),
    supabase.from("profiles").select("id", { count: "exact", head: true }).eq("subscription_status", "trialing"),
    supabase.from("profiles").select("id", { count: "exact", head: true }).eq("plan", "free"),
    supabase.from("profiles").select("id", { count: "exact", head: true }).eq("subscription_status", "canceled"),
  ]);

  const totalUsers = totalResult.count || 0;
  const starterUsers = starterResult.count || 0;
  const proUsers = proResult.count || 0;
  const masterUsers = masterResult.count || 0;
  const paidUsers = starterUsers + proUsers + masterUsers;
  const trialUsers = trialResult.count || 0;
  const freeUsers = freeResult.count || 0;
  const canceledUsers = canceledResult.count || 0;

  // ── MRR Calculation (4-tier) ──
  // Starter ¥990 / Pro ¥1,980 / Master ¥4,980 月額。年額は未対応（全て月次想定）
  const monthlyMRR = starterUsers * 990 + proUsers * 1980 + masterUsers * 4980;

  // ── Active Users (last 7 days) ──
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const { data: activeUsersData } = await supabase
    .from("usage_records")
    .select("user_id")
    .gte("created_at", sevenDaysAgo.toISOString());

  const weeklyActiveUsers = new Set(activeUsersData?.map((r) => r.user_id) || []).size;

  // ── Active Users (last 30 days) ──
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const { data: monthlyActiveData } = await supabase
    .from("usage_records")
    .select("user_id")
    .gte("created_at", thirtyDaysAgo.toISOString());

  const monthlyActiveUsers = new Set(monthlyActiveData?.map((r) => r.user_id) || []).size;

  // ── Conversion Rate (free → pro in last 30 days) ──
  // Count users who have subscription_canceled or subscription events in onboarding_emails
  const { count: recentProConversions } = await supabase
    .from("onboarding_emails")
    .select("id", { count: "exact", head: true })
    .eq("email_type", "pro_welcome")
    .gte("created_at", thirtyDaysAgo.toISOString());

  const { count: recentSignups } = await supabase
    .from("profiles")
    .select("id", { count: "exact", head: true })
    .gte("created_at", thirtyDaysAgo.toISOString());

  const conversionRate = (recentSignups || 0) > 0
    ? Math.round(((recentProConversions || 0) / (recentSignups || 1)) * 100)
    : 0;

  // ── Churn (cancellations in last 30 days) ──
  const { count: recentCancellations } = await supabase
    .from("onboarding_emails")
    .select("id", { count: "exact", head: true })
    .eq("email_type", "subscription_canceled")
    .gte("created_at", thirtyDaysAgo.toISOString());

  const churnRate = paidUsers > 0
    ? Math.round(((recentCancellations || 0) / (paidUsers + (recentCancellations || 0))) * 100)
    : 0;

  // ── Payment Failure Rate ──
  const { count: recentPaymentFailures } = await supabase
    .from("onboarding_emails")
    .select("id", { count: "exact", head: true })
    .eq("email_type", "payment_failed")
    .gte("created_at", thirtyDaysAgo.toISOString());

  const { count: pastDueUsers } = await supabase
    .from("profiles")
    .select("id", { count: "exact", head: true })
    .eq("subscription_status", "past_due");

  // ── Email Performance ──
  const { data: emailCounts } = await supabase
    .from("onboarding_emails")
    .select("email_type")
    .gte("created_at", thirtyDaysAgo.toISOString());

  const emailPerformance: Record<string, number> = {};
  if (emailCounts) {
    for (const e of emailCounts) {
      emailPerformance[e.email_type] = (emailPerformance[e.email_type] || 0) + 1;
    }
  }

  // ── Roleplay & Score Stats ──
  const { count: totalRoleplays } = await supabase
    .from("usage_records")
    .select("id", { count: "exact", head: true });

  const { count: totalScores } = await supabase
    .from("roleplay_scores")
    .select("id", { count: "exact", head: true });

  const { data: avgScoreData } = await supabase
    .from("roleplay_scores")
    .select("overall_score")
    .order("created_at", { ascending: false })
    .limit(100);

  const platformAvgScore = avgScoreData && avgScoreData.length > 0
    ? Math.round(avgScoreData.reduce((sum, s) => sum + s.overall_score, 0) / avgScoreData.length)
    : 0;

  // ── Referral Stats ──
  const { count: totalReferralCodes } = await supabase
    .from("referral_codes")
    .select("id", { count: "exact", head: true });

  const { count: totalReferralConversions } = await supabase
    .from("referral_conversions")
    .select("id", { count: "exact", head: true })
    .eq("status", "converted_pro");

  // ── New Users This Week ──
  const { count: newUsersThisWeek } = await supabase
    .from("profiles")
    .select("id", { count: "exact", head: true })
    .gte("created_at", sevenDaysAgo.toISOString());

  // ── Revenue Projections ──
  const annualProjection = monthlyMRR * 12;
  const revenuePerUser = paidUsers > 0 ? Math.round(monthlyMRR / paidUsers) : 0;

  return NextResponse.json({
    timestamp: now.toISOString(),
    users: {
      total: totalUsers,
      starter: starterUsers,
      pro: proUsers,
      master: masterUsers,
      paid: paidUsers,
      trial: trialUsers,
      free: freeUsers,
      canceled: canceledUsers,
      pastDue: pastDueUsers || 0,
      newThisWeek: newUsersThisWeek || 0,
    },
    activity: {
      weeklyActive: weeklyActiveUsers,
      monthlyActive: monthlyActiveUsers,
      totalRoleplays: totalRoleplays || 0,
      totalScores: totalScores || 0,
      platformAvgScore,
    },
    revenue: {
      mrr: monthlyMRR,
      arr: annualProjection,
      revenuePerUser,
      conversionRate,
      churnRate,
      paymentFailures: recentPaymentFailures || 0,
    },
    referrals: {
      totalCodes: totalReferralCodes || 0,
      totalConversions: totalReferralConversions || 0,
    },
    emails: emailPerformance,
  });
}
