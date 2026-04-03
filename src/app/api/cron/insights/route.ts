import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { runPipeline } from "@/lib/insights/pipeline";
import { logCronExecution } from "@/lib/cron-logger";

/**
 * Cron job: Fetches industry insights from Google News RSS and Semantic Scholar,
 * summarizes them with AI, and stores in the insights table.
 *
 * Runs daily at 02:00 UTC via Vercel Cron.
 * Protected by CRON_SECRET to prevent unauthorized access.
 */
export async function GET(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    return NextResponse.json({ error: "Missing Supabase config" }, { status: 500 });
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  const cronStartTime = Date.now();

  try {
    const pipelineResult = await runPipeline(supabase);
    const durationMs = Date.now() - cronStartTime;
    const status = pipelineResult.errors.length > 10
      ? "failure"
      : pipelineResult.errors.length > 0
        ? "partial_failure"
        : "success";

    // Log cron execution
    await logCronExecution(supabase, {
      job_name: "daily_insights",
      status,
      duration_ms: durationMs,
      results: {
        fetched: pipelineResult.fetched,
        new_inserted: pipelineResult.new_inserted,
        duplicates_skipped: pipelineResult.duplicates_skipped,
        summarized: pipelineResult.summarized,
        archived: pipelineResult.archived,
        errors: pipelineResult.errors.length,
      },
      error_details: pipelineResult.errors.length > 0
        ? pipelineResult.errors.slice(0, 10).join("; ")
        : undefined,
    });

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      duration_ms: durationMs,
      results: pipelineResult,
    });
  } catch (error) {
    const durationMs = Date.now() - cronStartTime;

    await logCronExecution(supabase, {
      job_name: "daily_insights",
      status: "failure",
      duration_ms: durationMs,
      results: {},
      error_details: error instanceof Error ? error.message : String(error),
    }).catch(() => {});

    return NextResponse.json(
      { error: "Pipeline failed", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
