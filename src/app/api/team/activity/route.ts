import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

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

    // Find user's org
    const { data: membership } = await supabase
      .from("team_members")
      .select("org_id")
      .eq("user_id", user.id)
      .limit(1)
      .maybeSingle();

    if (!membership) {
      return NextResponse.json({ error: "Not in a team" }, { status: 404 });
    }

    // Get all member user_ids
    const { data: members } = await supabase
      .from("team_members")
      .select("user_id")
      .eq("org_id", membership.org_id);

    const memberIds = (members || []).map((m) => m.user_id);
    if (memberIds.length === 0) {
      return NextResponse.json({
        totalSessions: 0,
        avgScore: null,
        activeMembers: 0,
        lessonsCompleted: 0,
      });
    }

    // Current month start (JST)
    const now = new Date();
    const jst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
    const monthStart = `${jst.toISOString().slice(0, 7)}-01`;

    // Total sessions this month
    const { count: totalSessions } = await supabase
      .from("usage_records")
      .select("id", { count: "exact", head: true })
      .in("user_id", memberIds)
      .gte("used_date", monthStart);

    // Average score from roleplay_scores (this month)
    const { data: scores } = await supabase
      .from("roleplay_scores")
      .select("overall_score")
      .in("user_id", memberIds)
      .gte("created_at", monthStart);

    const avgScore =
      scores && scores.length > 0
        ? Math.round(
            scores.reduce((sum, s) => sum + (s.overall_score || 0), 0) / scores.length
          )
        : null;

    // Active members (had at least 1 session this month)
    const { data: activeData } = await supabase
      .from("usage_records")
      .select("user_id")
      .in("user_id", memberIds)
      .gte("used_date", monthStart);

    const activeMembers = new Set((activeData || []).map((r) => r.user_id)).size;

    // Lessons completed (learn_progress with completed_at not null)
    const { count: lessonsCompleted } = await supabase
      .from("learn_progress")
      .select("id", { count: "exact", head: true })
      .in("user_id", memberIds)
      .not("completed_at", "is", null);

    return NextResponse.json({
      totalSessions: totalSessions || 0,
      avgScore,
      activeMembers,
      lessonsCompleted: lessonsCompleted || 0,
    });
  } catch (error) {
    console.error("Team activity error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
