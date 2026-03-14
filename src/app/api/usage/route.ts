import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getUsageStatus } from "@/lib/usage";

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

  const [status, totalResult] = await Promise.all([
    getUsageStatus(supabase, user.id),
    supabase
      .from("usage_records")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id),
  ]);

  return NextResponse.json({
    ...status,
    totalSessions: totalResult.count || 0,
  });
}
