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
    .select("id, overall_score, category_scores, summary, strengths, improvements, difficulty, industry, scene, customer_type, product, created_at")
    .eq("id", id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Score not found" }, { status: 404 });
  }

  return NextResponse.json({
    id: data.id,
    overall: data.overall_score,
    categories: data.category_scores,
    summary: data.summary,
    strengths: data.strengths,
    improvements: data.improvements,
    difficulty: data.difficulty,
    industry: data.industry,
    scene: data.scene,
    customerType: data.customer_type,
    product: data.product,
    createdAt: data.created_at,
  });
}
