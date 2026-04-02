import { SupabaseClient } from "@supabase/supabase-js";

/**
 * Engagement Health Score (0-100)
 *
 * Computed from:
 * - Login recency (40%): days since last activity
 * - Roleplay frequency (30%): sessions in last 14 days
 * - Feature breadth (20%): distinct event types used
 * - Score improvement (10%): trend direction
 *
 * Based on QuantLedger research: optimal intervention at score <50.
 */

export interface HealthScoreResult {
  score: number;
  recencyScore: number;
  frequencyScore: number;
  breadthScore: number;
  improvementScore: number;
  riskLevel: "healthy" | "at_risk" | "critical";
  daysSinceLastActivity: number;
}

export async function computeHealthScore(
  supabase: SupabaseClient,
  userId: string
): Promise<HealthScoreResult> {
  const now = new Date();
  const fourteenDaysAgo = new Date(now.getTime() - 14 * 86400000).toISOString();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 86400000).toISOString();

  // Parallel queries
  const [usageResult, eventsResult, scoresResult] = await Promise.all([
    // Recent usage records (last 14 days)
    supabase
      .from("usage_records")
      .select("used_date")
      .eq("user_id", userId)
      .gte("used_date", fourteenDaysAgo.split("T")[0])
      .order("used_date", { ascending: false }),

    // Distinct event types (last 30 days)
    supabase
      .from("engagement_events")
      .select("event_type")
      .eq("user_id", userId)
      .gte("created_at", thirtyDaysAgo),

    // Recent scores for improvement trend
    supabase
      .from("roleplay_scores")
      .select("overall_score, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  // 1. Recency score (40%) — days since last activity
  const usageDates = usageResult.data || [];
  let daysSinceLastActivity = 14;
  if (usageDates.length > 0) {
    const lastDate = new Date(usageDates[0].used_date);
    daysSinceLastActivity = Math.floor((now.getTime() - lastDate.getTime()) / 86400000);
  }
  // 0 days = 100, 1 day = 90, 3 days = 70, 7 days = 30, 14+ = 0
  const recencyScore = Math.max(0, Math.min(100, 100 - daysSinceLastActivity * 7.5));

  // 2. Frequency score (30%) — sessions in last 14 days
  const uniqueDates = new Set(usageDates.map((r) => r.used_date));
  const sessionCount = uniqueDates.size;
  // 7+ days = 100, 5 days = 80, 3 days = 50, 1 day = 20, 0 = 0
  const frequencyScore = Math.min(100, (sessionCount / 7) * 100);

  // 3. Feature breadth score (20%) — distinct event types
  const events = eventsResult.data || [];
  const distinctTypes = new Set(events.map((e) => e.event_type));
  const breadthCount = distinctTypes.size;
  // 5+ types = 100, 3 = 60, 1 = 20
  const breadthScore = Math.min(100, (breadthCount / 5) * 100);

  // 4. Score improvement (10%) — trend direction
  const scores = scoresResult.data || [];
  let improvementScore = 50; // neutral default
  if (scores.length >= 2) {
    const recent = scores.slice(0, Math.min(3, scores.length));
    const avgRecent = recent.reduce((s, r) => s + r.overall_score, 0) / recent.length;
    const older = scores.slice(Math.min(3, scores.length));
    if (older.length > 0) {
      const avgOlder = older.reduce((s, r) => s + r.overall_score, 0) / older.length;
      const diff = avgRecent - avgOlder;
      improvementScore = diff > 5 ? 100 : diff > 0 ? 75 : diff > -5 ? 40 : 10;
    }
  }

  // Weighted total
  const score = Math.round(
    recencyScore * 0.4 +
    frequencyScore * 0.3 +
    breadthScore * 0.2 +
    improvementScore * 0.1
  );

  const riskLevel: "healthy" | "at_risk" | "critical" =
    score >= 50 ? "healthy" : score >= 25 ? "at_risk" : "critical";

  return {
    score,
    recencyScore: Math.round(recencyScore),
    frequencyScore: Math.round(frequencyScore),
    breadthScore: Math.round(breadthScore),
    improvementScore: Math.round(improvementScore),
    riskLevel,
    daysSinceLastActivity,
  };
}

/**
 * Record current health score to history table for trend analysis.
 */
export async function recordHealthScore(
  supabase: SupabaseClient,
  userId: string,
  result: HealthScoreResult
): Promise<void> {
  await supabase.from("health_score_history").insert({
    user_id: userId,
    score: result.score,
    recency_score: result.recencyScore,
    frequency_score: result.frequencyScore,
    breadth_score: result.breadthScore,
    improvement_score: result.improvementScore,
    risk_level: result.riskLevel,
  });
}

/**
 * Predictive Churn Detection
 *
 * Analyzes health score trend over the last 7-14 days.
 * Detects declining patterns BEFORE the user reaches critical state.
 *
 * Returns:
 * - trend: "declining" | "stable" | "improving"
 * - velocityPerDay: rate of score change per day (negative = declining)
 * - predictedDaysToCritical: estimated days until score drops below 25
 * - shouldIntervene: true if early intervention is recommended
 */
export interface ChurnPrediction {
  trend: "declining" | "stable" | "improving";
  velocityPerDay: number;
  currentScore: number;
  predictedDaysToCritical: number | null;
  shouldIntervene: boolean;
}

export async function predictChurn(
  supabase: SupabaseClient,
  userId: string
): Promise<ChurnPrediction | null> {
  const fourteenDaysAgo = new Date(Date.now() - 14 * 86400000).toISOString();

  const { data: history } = await supabase
    .from("health_score_history")
    .select("score, created_at")
    .eq("user_id", userId)
    .gte("created_at", fourteenDaysAgo)
    .order("created_at", { ascending: true });

  // Need at least 3 data points for meaningful trend analysis
  if (!history || history.length < 3) return null;

  const currentScore = history[history.length - 1].score;

  // Calculate linear regression for velocity
  const n = history.length;
  const firstTime = new Date(history[0].created_at).getTime();
  const points = history.map(h => ({
    x: (new Date(h.created_at).getTime() - firstTime) / 86400000, // days
    y: h.score,
  }));

  const sumX = points.reduce((s, p) => s + p.x, 0);
  const sumY = points.reduce((s, p) => s + p.y, 0);
  const sumXY = points.reduce((s, p) => s + p.x * p.y, 0);
  const sumX2 = points.reduce((s, p) => s + p.x * p.x, 0);

  const denominator = n * sumX2 - sumX * sumX;
  if (denominator === 0) {
    return {
      trend: "stable",
      velocityPerDay: 0,
      currentScore,
      predictedDaysToCritical: null,
      shouldIntervene: false,
    };
  }

  const slope = (n * sumXY - sumX * sumY) / denominator;
  const velocityPerDay = Math.round(slope * 100) / 100;

  // Determine trend
  const trend: "declining" | "stable" | "improving" =
    velocityPerDay < -2 ? "declining" : velocityPerDay > 2 ? "improving" : "stable";

  // Predict days until critical (score < 25)
  let predictedDaysToCritical: number | null = null;
  if (velocityPerDay < 0 && currentScore > 25) {
    predictedDaysToCritical = Math.ceil((currentScore - 25) / Math.abs(velocityPerDay));
  }

  // Intervene if score is declining AND currently still in "healthy" range
  // (catching them before they become at_risk)
  const shouldIntervene =
    trend === "declining" &&
    currentScore >= 40 &&
    currentScore <= 70 &&
    (predictedDaysToCritical !== null && predictedDaysToCritical <= 14);

  return {
    trend,
    velocityPerDay,
    currentScore,
    predictedDaysToCritical,
    shouldIntervene,
  };
}
