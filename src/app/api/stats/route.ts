import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

let cachedStats: { totalUsers: number; totalSessions: number; totalScores: number } | null = null;
let cachedAt = 0;
const CACHE_TTL = 3600_000; // 1 hour

export async function GET() {
  const now = Date.now();
  if (cachedStats && now - cachedAt < CACHE_TTL) {
    return NextResponse.json(cachedStats, {
      headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200" },
    });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    return NextResponse.json({ totalUsers: 0, totalSessions: 0, totalScores: 0 });
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  const [usersResult, sessionsResult, scoresResult] = await Promise.all([
    supabase.from("profiles").select("id", { count: "exact", head: true }),
    supabase.from("usage_records").select("id", { count: "exact", head: true }),
    supabase.from("roleplay_scores").select("id", { count: "exact", head: true }),
  ]);

  cachedStats = {
    totalUsers: usersResult.count || 0,
    totalSessions: sessionsResult.count || 0,
    totalScores: scoresResult.count || 0,
  };
  cachedAt = now;

  return NextResponse.json(cachedStats, {
    headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200" },
  });
}
