import { SupabaseClient } from "@supabase/supabase-js";

export type EngagementEventType =
  | "roleplay_start"
  | "roleplay_complete"
  | "score_view"
  | "worksheet_edit"
  | "coach_view"
  | "login"
  | "billing_visit"
  | "settings_visit";

export interface UserAchievements {
  totalSessions: number;
  bestScore: number;
  scoreTrend: "improving" | "stable" | "declining" | "unknown";
  averageScore: number;
  daysSinceSignup: number;
}

/** エンゲージメントイベントをDBに記録 */
export async function trackEngagement(
  supabase: SupabaseClient,
  userId: string,
  eventType: EngagementEventType,
  metadata: Record<string, unknown> = {}
) {
  return supabase.from("engagement_events").insert({
    user_id: userId,
    event_type: eventType,
    metadata,
  });
}

/** 直近30日のイベントからエンゲージメントスコア(0-100)を算出 */
export async function calculateEngagementScore(
  supabase: SupabaseClient,
  userId: string
): Promise<number> {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const { data: events } = await supabase
    .from("engagement_events")
    .select("event_type, created_at")
    .eq("user_id", userId)
    .gte("created_at", thirtyDaysAgo.toISOString());

  if (!events || events.length === 0) return 0;

  // ロールプレイ頻度 (35%) — 週3回以上=100, 週1回=50, 0=0
  const roleplayStarts = events.filter(
    (e) => e.event_type === "roleplay_start"
  ).length;
  const roleplayPerWeek = (roleplayStarts / 30) * 7;
  const roleplayScore =
    roleplayPerWeek >= 3 ? 100 : roleplayPerWeek >= 1 ? 50 : roleplayPerWeek > 0 ? 25 : 0;

  // ワークシート進捗 (20%) — イベント数で判定
  const worksheetEdits = events.filter(
    (e) => e.event_type === "worksheet_edit"
  ).length;
  const worksheetScore = Math.min(worksheetEdits * 20, 100);

  // ログイン頻度 (15%) — ユニーク日数/30
  const loginDays = new Set(
    events
      .filter((e) => e.event_type === "login")
      .map((e) => e.created_at.split("T")[0])
  ).size;
  const loginScore = Math.min((loginDays / 30) * 100, 100);

  // コーチ活用 (10%)
  const coachViews = events.filter(
    (e) => e.event_type === "coach_view"
  ).length;
  const coachScore = Math.min(coachViews * 10, 100);

  // スコア改善トレンド (20%) — roleplay_complete イベントの有無で判定
  const completions = events.filter(
    (e) => e.event_type === "roleplay_complete"
  ).length;
  const trendScore = completions >= 4 ? 100 : completions >= 2 ? 60 : completions >= 1 ? 30 : 0;

  const total = Math.round(
    roleplayScore * 0.35 +
      trendScore * 0.2 +
      worksheetScore * 0.2 +
      loginScore * 0.15 +
      coachScore * 0.1
  );

  return Math.min(total, 100);
}

/** ユーザーの実績データを取得(解約モーダルで表示用) */
export async function getUserAchievements(
  supabase: SupabaseClient,
  userId: string
): Promise<UserAchievements> {
  const [usageResult, profileResult, eventsResult] = await Promise.all([
    supabase
      .from("usage_records")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId),
    supabase
      .from("profiles")
      .select("created_at")
      .eq("id", userId)
      .single(),
    supabase
      .from("engagement_events")
      .select("metadata, created_at")
      .eq("user_id", userId)
      .eq("event_type", "roleplay_complete")
      .order("created_at", { ascending: true })
      .limit(50),
  ]);

  const totalSessions = usageResult.count || 0;

  const createdAt = profileResult.data?.created_at
    ? new Date(profileResult.data.created_at)
    : new Date();
  const daysSinceSignup = Math.floor(
    (Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24)
  );

  // スコア推移の分析
  const scores = (eventsResult.data || [])
    .map((e) => (e.metadata as Record<string, unknown>)?.score as number)
    .filter((s): s is number => typeof s === "number");

  const bestScore = scores.length > 0 ? Math.max(...scores) : 0;
  const averageScore =
    scores.length > 0
      ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
      : 0;

  let scoreTrend: UserAchievements["scoreTrend"] = "unknown";
  if (scores.length >= 3) {
    const recent = scores.slice(-3);
    const earlier = scores.slice(-6, -3);
    if (earlier.length > 0) {
      const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
      const earlierAvg = earlier.reduce((a, b) => a + b, 0) / earlier.length;
      if (recentAvg > earlierAvg + 3) scoreTrend = "improving";
      else if (recentAvg < earlierAvg - 3) scoreTrend = "declining";
      else scoreTrend = "stable";
    }
  }

  return { totalSessions, bestScore, scoreTrend, averageScore, daysSinceSignup };
}
