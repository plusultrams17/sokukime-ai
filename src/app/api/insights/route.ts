import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { checkRateLimit } from "@/lib/rate-limit";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    if (!supabase) {
      return NextResponse.json({ error: "Config error" }, { status: 500 });
    }
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rl = checkRateLimit(`insights:${user.id}`, 30);
    if (!rl.success) {
      return NextResponse.json(
        { error: "リクエストが多すぎます。しばらくお待ちください。" },
        { status: 429, headers: { "Retry-After": String(Math.ceil(rl.resetMs / 1000)) } }
      );
    }

    const { searchParams } = new URL(request.url);
    const industryFilter = searchParams.get("industry");

    // Fetch user's industry preferences
    const { data: prefs } = await supabase
      .from("user_industry_preferences")
      .select("primary_industry, secondary_industries")
      .eq("user_id", user.id)
      .single();

    // Build query for published insights
    const today = new Date().toISOString().split("T")[0];
    let query = supabase
      .from("insights")
      .select("*")
      .eq("status", "published")
      .lte("published_date", today)
      .order("published_date", { ascending: false })
      .limit(50);

    // Filter by specific industry param, or user preferences
    if (industryFilter) {
      query = query.contains("industries", [industryFilter]);
    } else if (prefs) {
      const userIndustries = [
        prefs.primary_industry,
        ...(prefs.secondary_industries || []),
      ].filter(Boolean);
      if (userIndustries.length > 0) {
        query = query.overlaps("industries", userIndustries);
      }
    }

    const { data: insights, error } = await query;

    if (error) {
      console.error("Insights fetch error:", error);
      return NextResponse.json({ error: "Failed to fetch insights" }, { status: 500 });
    }

    return NextResponse.json({
      insights: insights || [],
      total: insights?.length || 0,
    });
  } catch (error) {
    console.error("Insights API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
