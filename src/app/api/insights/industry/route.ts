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

    const { primaryIndustry, secondaryIndustries } = await request.json();

    if (!primaryIndustry) {
      return NextResponse.json({ error: "primaryIndustry is required" }, { status: 400 });
    }

    const { error } = await supabase
      .from("user_industry_preferences")
      .upsert(
        {
          user_id: user.id,
          primary_industry: primaryIndustry,
          secondary_industries: secondaryIndustries || [],
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      );

    if (error) {
      console.error("Industry preference upsert error:", error);
      return NextResponse.json({ error: "Failed to save preferences" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Industry preference API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
