import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getStreak } from "@/lib/usage";

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

    // Fetch plan + trial info, then streak with plan info for Streak Shield
    const profileResult = await supabase.from("profiles").select("plan, trial_ends_at, stripe_subscription_id").eq("id", user.id).single();
    const profile = profileResult.data;
    const plan = (profile?.plan || "free") as "free" | "pro";
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

    // Calculate reverse trial days remaining
    let trialDaysRemaining: number | null = null;
    if (profile?.trial_ends_at && !profile?.stripe_subscription_id) {
      const trialEnd = new Date(profile.trial_ends_at);
      const remaining = Math.ceil((trialEnd.getTime() - Date.now()) / 86400000);
      if (remaining > 0) trialDaysRemaining = remaining;
    }

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
      plan: profile?.plan || "free",
      streak,
      trialDaysRemaining,
    });
  } catch (error) {
    console.error("Dashboard API error:", error);
    return NextResponse.json({ error: "Failed to load dashboard" }, { status: 500 });
  }
}
