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

    // Check user plan — free users only see 1 category (全categoryは有料プランのみ)
    const FREE_VISIBLE_CATEGORIES = 1;
    let isPaidPlan = false;
    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("plan, subscription_status")
        .eq("id", user.id)
        .single();
      const rawPlan = profile?.plan;
      if (rawPlan === "starter" || rawPlan === "pro" || rawPlan === "master") {
        isPaidPlan = true;
      }
    } catch {
      // Default to free if profile fetch fails
    }

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
        category_scores: result.categories.map((c: { name: string; score: number; feedback: string }) => ({
          name: c.name, score: c.score, feedback: c.feedback,
        })),
        summary: result.summary || null,
        strengths: result.strengths || [],
        improvements: result.improvements || [],
        difficulty: input.difficulty || null,
        industry: input.industry || null,
        scene: input.scene || null,
        customer_type: input.customerType || null,
        product: input.product || null,
        conversation_log: input.messages || null,
      }).select("id").single();
      if (inserted) scoreId = inserted.id;
    } catch {
      // Score save failure should not block response
    }

    // Filter categories for free users (server-side gate)
    const filteredResult = isPaidPlan
      ? result
      : {
          ...result,
          categories: result.categories.slice(0, FREE_VISIBLE_CATEGORIES),
        };

    return NextResponse.json({
      ...filteredResult,
      scoreId,
      previousScore: previousBest,
    });
  } catch (error) {
    console.error("Score API error:", error);
    return NextResponse.json(generateFallbackScore());
  }
}
