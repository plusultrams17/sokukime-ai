import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { scoreConversation, generateFallbackScore } from "@/lib/scoring";

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

    const input = await request.json();
    const result = await scoreConversation(input);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Score API error:", error);
    return NextResponse.json(generateFallbackScore());
  }
}
