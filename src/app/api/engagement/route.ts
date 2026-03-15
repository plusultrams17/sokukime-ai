import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { calculateEngagementScore, getUserAchievements } from "@/lib/engagement";

export async function GET() {
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

  const [score, achievements] = await Promise.all([
    calculateEngagementScore(supabase, user.id),
    getUserAchievements(supabase, user.id),
  ]);

  return NextResponse.json({ score, achievements });
}
