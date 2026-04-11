import { SupabaseClient } from "@supabase/supabase-js";

export interface KPISummary {
  mau: number;
  mrr: number;
  cvr: number;
  churnRate: number;
  npsScore: number;
  ltv: number;
  freeUsers: number;
  proUsers: number;
  newSignups: number;
  churnedUsers: number;
}

export interface KPIWithDelta extends KPISummary {
  prev: KPISummary | null;
}

export interface FunnelStep {
  step: string;
  label: string;
  count: number;
  rate: number;
}

export interface CohortRow {
  month: string;
  userCount: number;
  retention: number[]; // retention % for month 0, 1, 2, ...
}

// 4プラン構成 (2026-04-11〜)
const TIER_PRICE = {
  starter: 990,
  pro: 1980,
  master: 4980,
} as const;

/** Calculate all KPIs from live DB data */
export async function calculateCurrentKPIs(
  supabase: SupabaseClient
): Promise<KPISummary> {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  // Run all queries in parallel
  const [
    mauResult,
    freeResult,
    starterResult,
    proResult,
    masterResult,
    newSignupsResult,
    conversionsResult,
    cancellationsResult,
    npsResult,
  ] = await Promise.all([
    // MAU: unique users with engagement_events in last 30 days
    supabase
      .from("engagement_events")
      .select("user_id")
      .gte("created_at", thirtyDaysAgo.toISOString()),
    // Free users
    supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .eq("plan", "free"),
    // Starter users
    supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .eq("plan", "starter"),
    // Pro users
    supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .eq("plan", "pro"),
    // Master users
    supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .eq("plan", "master"),
    // New signups this month
    supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .gte("created_at", monthStart.toISOString()),
    // Pro conversions this month (pro_welcome emails as proxy)
    supabase
      .from("onboarding_emails")
      .select("id", { count: "exact", head: true })
      .eq("email_type", "pro_welcome")
      .gte("created_at", monthStart.toISOString()),
    // Cancellations this month
    supabase
      .from("onboarding_emails")
      .select("id", { count: "exact", head: true })
      .eq("email_type", "subscription_canceled")
      .gte("created_at", monthStart.toISOString()),
    // NPS: average from nps_responses
    supabase
      .from("nps_responses")
      .select("score, category")
      .order("created_at", { ascending: false })
      .limit(200),
  ]);

  // MAU count
  const uniqueUsers = new Set(
    mauResult.data?.map((e) => e.user_id) || []
  );
  const mau = uniqueUsers.size;

  const freeUsers = freeResult.count || 0;
  const starterUsers = starterResult.count || 0;
  const proOnlyUsers = proResult.count || 0;
  const masterUsers = masterResult.count || 0;
  // proUsers は後方互換のため「全有料プラン合計」を格納
  const proUsers = starterUsers + proOnlyUsers + masterUsers;
  const newSignups = newSignupsResult.count || 0;
  const churnedUsers = cancellationsResult.count || 0;

  // MRR = Σ(tier users * tier price)
  const mrr =
    starterUsers * TIER_PRICE.starter +
    proOnlyUsers * TIER_PRICE.pro +
    masterUsers * TIER_PRICE.master;

  // CVR = monthly conversions / month-start free users
  const monthlyConversions = conversionsResult.count || 0;
  const cvr =
    freeUsers > 0
      ? Math.round((monthlyConversions / freeUsers) * 10000) / 100
      : 0;

  // Churn = monthly cancellations / (paid + cancelled this month)
  const churnBase = proUsers + churnedUsers;
  const churnRate =
    churnBase > 0
      ? Math.round((churnedUsers / churnBase) * 10000) / 100
      : 0;

  // NPS = % promoters - % detractors
  const npsData = npsResult.data || [];
  let npsScore = 0;
  if (npsData.length > 0) {
    const promoters = npsData.filter((n) => n.category === "promoter").length;
    const detractors = npsData.filter(
      (n) => n.category === "detractor"
    ).length;
    npsScore =
      Math.round(
        ((promoters - detractors) / npsData.length) * 10000
      ) / 100;
  }

  // LTV = ARPU / monthly churn rate
  const arpu = proUsers > 0 ? mrr / proUsers : 0;
  const monthlyChurn = churnRate / 100;
  const ltv = monthlyChurn > 0 ? Math.round(arpu / monthlyChurn) : 0;

  return {
    mau,
    mrr,
    cvr,
    churnRate,
    npsScore,
    ltv,
    freeUsers,
    proUsers,
    newSignups,
    churnedUsers,
  };
}

/** Get the previous month's snapshot for comparison */
export async function getPreviousMonthSnapshot(
  supabase: SupabaseClient
): Promise<KPISummary | null> {
  const now = new Date();
  const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const monthStr = prevMonth.toISOString().slice(0, 10);

  const { data } = await supabase
    .from("monthly_kpi_snapshots")
    .select("*")
    .eq("month", monthStr)
    .single();

  if (!data) return null;

  return {
    mau: data.mau,
    mrr: data.mrr,
    cvr: Number(data.cvr),
    churnRate: Number(data.churn_rate),
    npsScore: Number(data.nps_score),
    ltv: data.ltv,
    freeUsers: data.free_users,
    proUsers: data.pro_users,
    newSignups: data.new_signups,
    churnedUsers: data.churned_users,
  };
}

/** Get monthly KPI snapshots for the past N months */
export async function getMonthlySnapshots(
  supabase: SupabaseClient,
  months: number = 12
): Promise<
  Array<{
    month: string;
    mrr: number;
    mau: number;
    cvr: number;
    churnRate: number;
    proUsers: number;
  }>
> {
  const { data } = await supabase
    .from("monthly_kpi_snapshots")
    .select("month, mrr, mau, cvr, churn_rate, pro_users")
    .order("month", { ascending: true })
    .limit(months);

  return (data || []).map((d) => ({
    month: d.month,
    mrr: d.mrr,
    mau: d.mau,
    cvr: Number(d.cvr),
    churnRate: Number(d.churn_rate),
    proUsers: d.pro_users,
  }));
}

/** Get conversion funnel data for the past 30 days */
export async function getConversionFunnel(
  supabase: SupabaseClient
): Promise<FunnelStep[]> {
  const thirtyDaysAgo = new Date(
    Date.now() - 30 * 24 * 60 * 60 * 1000
  );

  const steps = [
    { step: "visit", label: "サイト訪問" },
    { step: "signup", label: "会員登録" },
    { step: "first_roleplay", label: "初回ロープレ" },
    { step: "second_roleplay", label: "2回目ロープレ" },
    { step: "pricing_view", label: "料金ページ閲覧" },
    { step: "checkout_start", label: "決済開始" },
    { step: "payment_complete", label: "決済完了" },
  ];

  const results: FunnelStep[] = [];

  for (const s of steps) {
    const { count } = await supabase
      .from("conversion_funnel")
      .select("id", { count: "exact", head: true })
      .eq("step", s.step)
      .gte("created_at", thirtyDaysAgo.toISOString());

    results.push({
      step: s.step,
      label: s.label,
      count: count || 0,
      rate: 0,
    });
  }

  // Calculate drop-off rates relative to first step
  const maxCount = results[0]?.count || 1;
  for (const r of results) {
    r.rate = Math.round((r.count / maxCount) * 10000) / 100;
  }

  return results;
}

/** Get cohort retention data */
export async function getCohortRetention(
  supabase: SupabaseClient,
  months: number = 6
): Promise<CohortRow[]> {
  const now = new Date();
  const cohorts: CohortRow[] = [];

  for (let i = months - 1; i >= 0; i--) {
    const cohortStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const cohortEnd = new Date(
      now.getFullYear(),
      now.getMonth() - i + 1,
      1
    );
    const monthLabel = cohortStart.toISOString().slice(0, 7);

    // Users who signed up in this cohort month
    const { data: cohortUsers } = await supabase
      .from("profiles")
      .select("id")
      .gte("created_at", cohortStart.toISOString())
      .lt("created_at", cohortEnd.toISOString());

    const userIds = cohortUsers?.map((u) => u.id) || [];
    const userCount = userIds.length;

    if (userCount === 0) {
      cohorts.push({ month: monthLabel, userCount: 0, retention: [] });
      continue;
    }

    // Check retention for each subsequent month
    const retention: number[] = [100]; // Month 0 is always 100%

    for (let m = 1; m <= i; m++) {
      const checkStart = new Date(
        now.getFullYear(),
        now.getMonth() - i + m,
        1
      );
      const checkEnd = new Date(
        now.getFullYear(),
        now.getMonth() - i + m + 1,
        1
      );

      const { data: activeUsers } = await supabase
        .from("engagement_events")
        .select("user_id")
        .in("user_id", userIds)
        .gte("created_at", checkStart.toISOString())
        .lt("created_at", checkEnd.toISOString());

      const activeCount = new Set(
        activeUsers?.map((e) => e.user_id) || []
      ).size;
      retention.push(
        Math.round((activeCount / userCount) * 100)
      );
    }

    cohorts.push({ month: monthLabel, userCount, retention });
  }

  return cohorts;
}

/** Save a KPI snapshot for a given month */
export async function saveKPISnapshot(
  supabase: SupabaseClient,
  kpi: KPISummary,
  month: Date
): Promise<void> {
  const monthStr = new Date(month.getFullYear(), month.getMonth(), 1)
    .toISOString()
    .slice(0, 10);

  await supabase.from("monthly_kpi_snapshots").upsert(
    {
      month: monthStr,
      mau: kpi.mau,
      mrr: kpi.mrr,
      churn_rate: kpi.churnRate,
      cvr: kpi.cvr,
      ltv: kpi.ltv,
      nps_score: kpi.npsScore,
      free_users: kpi.freeUsers,
      pro_users: kpi.proUsers,
      new_signups: kpi.newSignups,
      churned_users: kpi.churnedUsers,
    },
    { onConflict: "month" }
  );
}
