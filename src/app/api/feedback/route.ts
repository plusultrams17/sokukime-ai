import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
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

  const body = await req.json();
  const { npsScore, comment, roleplayScore } = body;

  if (typeof npsScore !== "number" || npsScore < 0 || npsScore > 10) {
    return NextResponse.json({ error: "Invalid NPS score" }, { status: 400 });
  }

  const { error } = await supabase.from("feedback").insert({
    user_id: user.id,
    nps_score: npsScore,
    comment: (comment || "").slice(0, 2000),
    roleplay_score: roleplayScore ?? null,
    page: "roleplay",
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
