import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import {
  calculateCurrentKPIs,
  getPreviousMonthSnapshot,
  getMonthlySnapshots,
} from "@/lib/kpi-calculation";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || authHeader !== `Bearer ${process.env.ADMIN_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabaseServiceKey) {
    return NextResponse.json({ error: "Missing config" }, { status: 500 });
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  const [current, previous, history] = await Promise.all([
    calculateCurrentKPIs(supabase),
    getPreviousMonthSnapshot(supabase),
    getMonthlySnapshots(supabase, 12),
  ]);

  return NextResponse.json({
    current,
    previous,
    history,
    timestamp: new Date().toISOString(),
  });
}
