import { SupabaseClient } from "@supabase/supabase-js";
import { getTeamMembership } from "@/lib/team";

export const FREE_DAILY_LIMIT = 1;

export interface UsageStatus {
  used: number;
  limit: number;
  canStart: boolean;
  plan: "free" | "pro";
  totalSessions?: number;
  streak?: number;
}

export async function getUsageStatus(
  supabase: SupabaseClient,
  userId: string
): Promise<UsageStatus> {
  const today = new Date().toISOString().split("T")[0];

  const [profileResult, usageResult] = await Promise.all([
    supabase.from("profiles").select("plan").eq("id", userId).single(),
    supabase
      .from("usage_records")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("used_date", today),
  ]);

  let plan = (profileResult.data?.plan || "free") as "free" | "pro";
  const used = usageResult.count || 0;

  // Team members get Pro-equivalent access
  if (plan !== "pro") {
    const team = await getTeamMembership(supabase, userId);
    if (team) {
      plan = "pro";
    }
  }

  if (plan === "pro") {
    return { used, limit: Infinity, canStart: true, plan };
  }

  return {
    used,
    limit: FREE_DAILY_LIMIT,
    canStart: used < FREE_DAILY_LIMIT,
    plan,
  };
}

/**
 * Calculate the current streak (consecutive days with at least 1 roleplay).
 * Pro users get a "Streak Shield" — 1 missed day doesn't break the streak.
 * Based on Nir Eyal's Hook Model (variable reward) and Duolingo's streak freeze
 * which reduced at-risk churn by 21% (Sensor Tower).
 *
 * Returns 0 if no recent activity.
 */
export async function getStreak(
  supabase: SupabaseClient,
  userId: string,
  plan?: "free" | "pro"
): Promise<number> {
  // Get distinct dates with activity, ordered descending, last 90 days
  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

  const { data } = await supabase
    .from("usage_records")
    .select("used_date")
    .eq("user_id", userId)
    .gte("used_date", ninetyDaysAgo.toISOString().split("T")[0])
    .order("used_date", { ascending: false });

  if (!data || data.length === 0) return 0;

  // Get unique dates
  const uniqueDates = [...new Set(data.map((r) => r.used_date))].sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );

  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
  const dayBeforeYesterday = new Date(Date.now() - 172800000).toISOString().split("T")[0];

  // For Pro users: allow 1-day gap (Streak Shield)
  const isPro = plan === "pro";
  const maxGap = isPro ? 2 : 1; // Pro: 2-day gap tolerance, Free: must be consecutive

  // Streak must include today, yesterday, or (for Pro) day before yesterday
  if (isPro) {
    if (uniqueDates[0] !== today && uniqueDates[0] !== yesterday && uniqueDates[0] !== dayBeforeYesterday) return 0;
  } else {
    if (uniqueDates[0] !== today && uniqueDates[0] !== yesterday) return 0;
  }

  let streak = 1;
  for (let i = 1; i < uniqueDates.length; i++) {
    const prev = new Date(uniqueDates[i - 1]);
    const curr = new Date(uniqueDates[i]);
    const diffDays = Math.round((prev.getTime() - curr.getTime()) / 86400000);
    if (diffDays <= maxGap) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

export async function recordUsage(
  supabase: SupabaseClient,
  userId: string
) {
  return supabase.from("usage_records").insert({
    user_id: userId,
  });
}
