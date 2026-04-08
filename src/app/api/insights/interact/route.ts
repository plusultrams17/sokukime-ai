import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    if (!supabase) {
      return NextResponse.json({ error: "Config error" }, { status: 500 });
    }
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { insightId, type } = await request.json();

    if (!insightId || !["save", "unsave", "share"].includes(type)) {
      return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
    }

    // For unsave, delete the existing save interaction
    if (type === "unsave") {
      await supabase
        .from("insight_interactions")
        .delete()
        .eq("user_id", user.id)
        .eq("insight_id", insightId)
        .eq("action", "save");

      return NextResponse.json({ success: true });
    }

    // Insert save or share interaction
    const { error } = await supabase.from("insight_interactions").insert({
      user_id: user.id,
      insight_id: insightId,
      action: type,
    });

    if (error) {
      console.error("Interaction insert error:", error);
      return NextResponse.json({ error: "Failed to record interaction" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Insight interact API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
