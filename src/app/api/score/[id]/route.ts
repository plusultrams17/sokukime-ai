import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

/** Public endpoint: fetch a score by ID for the share page. No auth required. */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  const { data, error } = await supabase
    .from("roleplay_scores")
    .select("id, overall_score, category_scores, difficulty, industry, scene, created_at")
    .eq("id", id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Score not found" }, { status: 404 });
  }

  return NextResponse.json({
    id: data.id,
    overall: data.overall_score,
    categories: data.category_scores,
    difficulty: data.difficulty,
    industry: data.industry,
    scene: data.scene,
    createdAt: data.created_at,
  });
}
