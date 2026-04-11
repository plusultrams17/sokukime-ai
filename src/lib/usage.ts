import { SupabaseClient } from "@supabase/supabase-js";
import { getTeamMembership } from "@/lib/team";

/**
 * プラン tier（src/lib/plans.ts の PlanTier と同期）
 */
export type PlanTier = "free" | "starter" | "pro" | "master";

/**
 * Free プランの累計（生涯）ロープレ上限。
 * 1日の制限ではなく、アカウント作成からの累計件数でカウントする。
 */
export const FREE_LIFETIME_LIMIT = 5;

/**
 * 有料プランごとの「月次クレジット」上限。
 * 月次リセットは JST 毎月 1 日 0:00（暦月ベース）。
 *
 * 注) このキャンペーン込み (baseCredits + 50%/100%) の数値は
 *    src/lib/plans.ts の monthlyCredits と同期している。
 *    値を変更するときは両方同時に更新すること。
 */
export const TIER_MONTHLY_CREDITS: Record<Exclude<PlanTier, "free">, number> = {
  starter: 30,
  pro: 60,
  master: 200,
};

export interface UsageStatus {
  /** Free: 累計件数（生涯） / 有料: 当月の件数（JST 暦月） */
  used: number;
  limit: number;
  canStart: boolean;
  plan: PlanTier;
  /** リセット単位: "lifetime" (Free) / "month" (Starter/Pro/Master) / "unlimited" (Tester/Team) */
  resetUnit: "lifetime" | "month" | "unlimited";
  /** 有料プランの月次リセット日 (YYYY-MM-01)。Free/Tester/Team は null */
  monthStart: string | null;
  totalSessions?: number;
  streak?: number;
}

/**
 * JST (Asia/Tokyo) の今日の日付を YYYY-MM-DD で返す。
 * usage_records.used_date の保存フォーマットに合わせる。
 */
function getTodayJst(): string {
  const now = new Date();
  // UTC+9 にシフトして ISO の先頭10文字 (YYYY-MM-DD) を取る
  const jst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  return jst.toISOString().split("T")[0];
}

/**
 * JST の「今月 1 日」を YYYY-MM-01 形式で返す。
 * 月次クレジットのカウント開始日として使う。
 */
function getMonthStartJst(): string {
  const today = getTodayJst(); // YYYY-MM-DD in JST
  return `${today.slice(0, 7)}-01`; // YYYY-MM-01
}

/**
 * plan カラムの値を PlanTier に正規化する。
 * 未知の値（過去の 'program' など）は 'free' 扱い。
 */
function normalizePlan(raw: unknown): PlanTier {
  if (raw === "starter" || raw === "pro" || raw === "master" || raw === "free") {
    return raw;
  }
  return "free";
}

export async function getUsageStatus(
  supabase: SupabaseClient,
  userId: string
): Promise<UsageStatus> {
  const today = getTodayJst();
  const monthStart = getMonthStartJst();

  const [profileResult, lifetimeResult, monthResult] = await Promise.all([
    supabase
      .from("profiles")
      .select("plan, subscription_status, is_tester, tester_expires_at")
      .eq("id", userId)
      .single(),
    // Free 判定で使う: user_id の全期間の合計件数
    supabase
      .from("usage_records")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId),
    // 有料判定で使う: 当月(JST)の件数
    supabase
      .from("usage_records")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .gte("used_date", monthStart),
  ]);

  const plan = normalizePlan(profileResult.data?.plan);
  const lifetimeUsed = lifetimeResult.count || 0;
  const monthUsed = monthResult.count || 0;
  const isTester = profileResult.data?.is_tester === true;
  const testerExpiresAt = profileResult.data?.tester_expires_at as string | null;

  // Tester access: tester flag set + (no expiry OR expiry in future) = unlimited
  const isTesterActive =
    isTester && (testerExpiresAt === null || new Date(testerExpiresAt) > new Date());

  if (isTesterActive) {
    return {
      used: monthUsed,
      limit: Infinity,
      canStart: true,
      plan: plan === "free" ? "pro" : plan,
      resetUnit: "unlimited",
      monthStart: null,
    };
  }

  // Team members get Pro-equivalent access (unlimited for B2B)
  if (plan === "free") {
    const team = await getTeamMembership(supabase, userId);
    if (team) {
      return {
        used: monthUsed,
        limit: Infinity,
        canStart: true,
        plan: "pro",
        resetUnit: "unlimited",
        monthStart: null,
      };
    }
  }

  if (plan === "starter" || plan === "pro" || plan === "master") {
    const limit = TIER_MONTHLY_CREDITS[plan];
    return {
      used: monthUsed,
      limit,
      canStart: monthUsed < limit,
      plan,
      resetUnit: "month",
      monthStart,
    };
  }

  // Free プラン: 累計 FREE_LIFETIME_LIMIT 回まで
  return {
    used: lifetimeUsed,
    limit: FREE_LIFETIME_LIMIT,
    canStart: lifetimeUsed < FREE_LIFETIME_LIMIT,
    plan: "free",
    resetUnit: "lifetime",
    monthStart: null,
  };
}

/**
 * Calculate the current streak (consecutive days with at least 1 roleplay).
 * 有料プラン (starter/pro/master) では "Streak Shield" — 1 日の穴が空いても連続扱い。
 * Based on Nir Eyal's Hook Model (variable reward) and Duolingo's streak freeze
 * which reduced at-risk churn by 21% (Sensor Tower).
 *
 * Returns 0 if no recent activity.
 */
export async function getStreak(
  supabase: SupabaseClient,
  userId: string,
  plan?: PlanTier
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

  // 有料プランは Streak Shield (1 日分の猶予)
  const isPaid = plan === "starter" || plan === "pro" || plan === "master";
  const maxGap = isPaid ? 2 : 1;

  // Streak must include today, yesterday, or (for paid) day before yesterday
  if (isPaid) {
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
  // used_date を JST で明示的に入れる（Postgres の CURRENT_DATE は UTC の場合があるため）
  return supabase.from("usage_records").insert({
    user_id: userId,
    used_date: getTodayJst(),
  });
}
