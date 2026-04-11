import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    if (!supabase) {
      return NextResponse.json({ error: "Config error" }, { status: 500 });
    }
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Check Free user daily view limit
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("plan")
      .eq("id", user.id)
      .single();

    if (profileError) {
      console.error("Profile query failed (insights/[id]):", profileError);
      return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
    }

    const isPaid =
      profile?.plan === "starter" ||
      profile?.plan === "pro" ||
      profile?.plan === "master";

    if (!isPaid) {
      const today = new Date().toISOString().split("T")[0];
      const { count } = await supabase
        .from("insight_usage")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("used_date", today)
        .eq("action", "view");

      if ((count || 0) >= 3) {
        return NextResponse.json(
          { error: "本日の無料閲覧上限（3件）に達しました。有料プラン（Starter ¥990〜）にアップグレードすると無制限に閲覧できます。" },
          { status: 403 }
        );
      }
    }

    // Fetch the insight
    const { data: insight, error } = await supabase
      .from("insights")
      .select("*")
      .eq("id", id)
      .eq("status", "active")
      .single();

    if (error || !insight) {
      return NextResponse.json({ error: "Insight not found" }, { status: 404 });
    }

    // Record view interaction
    await supabase.from("insight_interactions").insert({
      user_id: user.id,
      insight_id: id,
      action: "view",
    });

    // Record usage for Free limit tracking
    const todayForUsage = new Date().toISOString().split("T")[0];
    await supabase.from("insight_usage").insert({
      user_id: user.id,
      used_date: todayForUsage,
      action: "view",
    });

    return NextResponse.json({ insight });
  } catch (error) {
    console.error("Insight detail API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
