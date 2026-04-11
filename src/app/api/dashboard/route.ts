import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getStreak, type PlanTier } from "@/lib/usage";

export async function GET() {
  try {
    const supabase = await createClient();
    if (!supabase) {
      return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
    }
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch score history (last 30 entries)
    const { data: scores } = await supabase
      .from("roleplay_scores")
      .select("overall_score, category_scores, difficulty, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(30);

    // Fetch total session count
    const { count: totalSessions } = await supabase
      .from("usage_records")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id);

    // Fetch plan info, then streak with plan info for Streak Shield
    const profileResult = await supabase.from("profiles").select("plan").eq("id", user.id).single();
    if (profileResult.error) {
      console.error("Profile query failed (dashboard):", profileResult.error);
      return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
    }
    const profile = profileResult.data;
    const rawPlan = profile?.plan;
    const plan: PlanTier =
      rawPlan === "starter" || rawPlan === "pro" || rawPlan === "master"
        ? rawPlan
        : "free";
    const streak = await getStreak(supabase, user.id, plan);

    const scoreList = scores || [];
    const overallScores = scoreList.map((s) => s.overall_score);

    // Calculate stats
    const bestScore = overallScores.length > 0 ? Math.max(...overallScores) : 0;
    const avgScore = overallScores.length > 0 ? Math.round(overallScores.reduce((a, b) => a + b, 0) / overallScores.length) : 0;
    const latestScore = overallScores.length > 0 ? overallScores[0] : 0;
    const previousScore = overallScores.length > 1 ? overallScores[1] : null;
    const scoreTrend = previousScore !== null ? latestScore - previousScore : 0;
    const firstScore = overallScores.length > 0 ? overallScores[overallScores.length - 1] : null;

    // Calculate weakest category from latest score
    let weakestCategory: { name: string; score: number } | null = null;
    if (scoreList.length > 0 && scoreList[0].category_scores) {
      const cats = scoreList[0].category_scores as { name: string; score: number }[];
      if (cats.length > 0) {
        weakestCategory = cats.reduce((min, c) => c.score < min.score ? c : min, cats[0]);
      }
    }

    // Score history for chart (chronological order)
    const history = scoreList
      .map((s) => ({
        score: s.overall_score,
        date: s.created_at,
        difficulty: s.difficulty,
      }))
      .reverse();

    // trial_ends_at は auth/callback で first-time 判定用 sentinel (1970-01-01) として
    // 使われているだけなので、残日数は常に null。
    const trialDaysRemaining: number | null = null;

    return NextResponse.json({
      totalSessions: totalSessions || 0,
      totalScored: scoreList.length,
      bestScore,
      avgScore,
      latestScore,
      scoreTrend,
      firstScore,
      weakestCategory,
      history,
      plan,
      streak,
      trialDaysRemaining,
    });
  } catch (error) {
    console.error("Dashboard API error:", error);
    return NextResponse.json({ error: "Failed to load dashboard" }, { status: 500 });
  }
}
