import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// POST: Submit a review
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    if (!supabase) {
      return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { displayName, role, reviewText, roleplayScore } = body;

    if (!displayName || !reviewText) {
      return NextResponse.json({ error: "displayName and reviewText are required" }, { status: 400 });
    }

    const { error } = await supabase.from("user_reviews").insert({
      user_id: user.id,
      display_name: displayName,
      role: role || "",
      review_text: reviewText,
      roleplay_score: roleplayScore || null,
      is_approved: false,
    });

    if (error) {
      console.error("Review insert error:", error);
      return NextResponse.json({ error: "Failed to submit review" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

// GET: Fetch approved reviews (public)
// Returns [] on any error so the frontend just hides the section gracefully.
export async function GET() {
  try {
    const supabase = await createClient();
    if (!supabase) {
      return NextResponse.json([]);
    }

    const { data, error } = await supabase
      .from("user_reviews")
      .select("display_name, role, review_text, roleplay_score, created_at")
      .eq("is_approved", true)
      .order("created_at", { ascending: false })
      .limit(10);

    if (error) {
      // Table may not exist yet — silent fallback
      return NextResponse.json([]);
    }

    return NextResponse.json(data || []);
  } catch {
    return NextResponse.json([]);
  }
}
