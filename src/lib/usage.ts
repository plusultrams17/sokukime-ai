import { SupabaseClient } from "@supabase/supabase-js";

export const FREE_DAILY_LIMIT = 1;

export interface UsageStatus {
  used: number;
  limit: number;
  canStart: boolean;
  plan: "free" | "pro";
  totalSessions?: number;
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

  const plan = (profileResult.data?.plan || "free") as "free" | "pro";
  const used = usageResult.count || 0;

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

export async function recordUsage(
  supabase: SupabaseClient,
  userId: string
) {
  return supabase.from("usage_records").insert({
    user_id: userId,
  });
}
