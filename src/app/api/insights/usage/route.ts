import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(_request: NextRequest) {
  try {
    const supabase = await createClient();
    if (!supabase) {
      return NextResponse.json({ error: "Config error" }, { status: 500 });
    }
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user plan
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("plan")
      .eq("id", user.id)
      .single();

    if (profileError) {
      console.error("Profile query failed (insights/usage):", profileError);
      return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
    }

    const plan = profile?.plan || "free";

    // Count today's views
    const today = new Date().toISOString().split("T")[0];
    const { count } = await supabase
      .from("insight_usage")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("used_date", today)
      .eq("action_type", "view");

    return NextResponse.json({
      viewedToday: count || 0,
      limit: plan === "pro" ? null : 3,
      plan,
    });
  } catch (error) {
    console.error("Insight usage API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
