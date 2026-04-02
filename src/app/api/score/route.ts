import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { scoreConversation, generateFallbackScore } from "@/lib/scoring";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    if (!supabase) {
      return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
    }
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rl = checkRateLimit(`score:${user.id}`, 10);
    if (!rl.success) {
      return NextResponse.json(
        { error: "リクエストが多すぎます。しばらくお待ちください。" },
        { status: 429, headers: { "Retry-After": String(Math.ceil(rl.resetMs / 1000)) } }
      );
    }

    const input = await request.json();
    const result = await scoreConversation(input);

    // Persist score for dashboard history + shareable link
    let scoreId: string | null = null;
    let previousBest: number | null = null;
    try {
      // Fetch previous best score for aha moment detection
      const { data: prevScores } = await supabase
        .from("roleplay_scores")
        .select("overall_score")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1);
      if (prevScores && prevScores.length > 0) {
        previousBest = prevScores[0].overall_score;
      }

      const { data: inserted } = await supabase.from("roleplay_scores").insert({
        user_id: user.id,
        overall_score: result.overall,
        category_scores: result.categories.map((c: { name: string; score: number }) => ({ name: c.name, score: c.score })),
        difficulty: input.difficulty || null,
        industry: input.industry || null,
        scene: input.scene || null,
      }).select("id").single();
      if (inserted) scoreId = inserted.id;
    } catch {
      // Score save failure should not block response
    }

    return NextResponse.json({
      ...result,
      scoreId,
      previousScore: previousBest,
    });
  } catch (error) {
    console.error("Score API error:", error);
    return NextResponse.json(generateFallbackScore());
  }
}
