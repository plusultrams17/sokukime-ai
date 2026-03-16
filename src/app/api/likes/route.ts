import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  if (!supabase) return NextResponse.json({ likes: {} });

  const { data } = await supabase
    .from("industry_likes")
    .select("slug, like_count");

  const likes: Record<string, number> = {};
  data?.forEach((row) => {
    likes[row.slug] = row.like_count;
  });

  return NextResponse.json({ likes });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }

  const { slug, action } = await request.json();
  if (!slug || typeof slug !== "string") {
    return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
  }

  const rpcName =
    action === "unlike"
      ? "decrement_industry_like"
      : "increment_industry_like";

  const { data, error } = await supabase.rpc(rpcName, {
    industry_slug: slug,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ like_count: data });
}
