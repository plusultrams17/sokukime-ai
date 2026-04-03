import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { calculateCurrentKPIs, saveKPISnapshot } from "@/lib/kpi-calculation";

/**
 * Monthly KPI Snapshot Cron Job
 * Runs on the 1st of each month to save the previous month's KPIs.
 * Schedule: 0 1 1 * * (1:00 AM on the 1st of every month)
 */
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabaseServiceKey) {
    return NextResponse.json({ error: "Missing config" }, { status: 500 });
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  const startTime = Date.now();

  try {
    const kpi = await calculateCurrentKPIs(supabase);

    // Save snapshot for the previous month
    const now = new Date();
    const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    await saveKPISnapshot(supabase, kpi, prevMonth);

    const duration = Date.now() - startTime;

    // Log to cron_logs
    await supabase.from("cron_logs").insert({
      job_name: "kpi-snapshot",
      status: "success",
      duration_ms: duration,
      results: { kpi },
    });

    return NextResponse.json({
      success: true,
      month: prevMonth.toISOString().slice(0, 7),
      kpi,
      duration_ms: duration,
    });
  } catch (error) {
    const duration = Date.now() - startTime;

    await supabase.from("cron_logs").insert({
      job_name: "kpi-snapshot",
      status: "failure",
      duration_ms: duration,
      results: {},
      error_details: error instanceof Error ? error.message : "Unknown error",
    });

    return NextResponse.json(
      { error: "KPI snapshot failed" },
      { status: 500 }
    );
  }
}
