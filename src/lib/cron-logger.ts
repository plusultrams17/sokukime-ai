import { SupabaseClient } from "@supabase/supabase-js";

/**
 * Cron Job Logger
 *
 * Records execution results of cron jobs for monitoring and alerting.
 * Integrates with admin dashboard and email alerts.
 */

export interface CronLogEntry {
  job_name: string;
  status: "success" | "partial_failure" | "failure";
  duration_ms: number;
  results: Record<string, number>;
  error_details?: string;
}

/**
 * Log a cron job execution result.
 */
export async function logCronExecution(
  supabase: SupabaseClient,
  entry: CronLogEntry
): Promise<void> {
  await supabase.from("cron_logs").insert(entry);
}

/**
 * Get recent cron logs for admin monitoring.
 */
export async function getRecentCronLogs(
  supabase: SupabaseClient,
  jobName?: string,
  limit = 30
) {
  let query = supabase
    .from("cron_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (jobName) {
    query = query.eq("job_name", jobName);
  }

  const { data } = await query;
  return data || [];
}

/**
 * Check if the last cron execution failed (for alerting).
 */
export async function getLastCronStatus(
  supabase: SupabaseClient,
  jobName: string
): Promise<{ status: string; lastRun: string | null; consecutiveFailures: number }> {
  const { data } = await supabase
    .from("cron_logs")
    .select("status, created_at")
    .eq("job_name", jobName)
    .order("created_at", { ascending: false })
    .limit(5);

  if (!data || data.length === 0) {
    return { status: "unknown", lastRun: null, consecutiveFailures: 0 };
  }

  let consecutiveFailures = 0;
  for (const log of data) {
    if (log.status === "failure" || log.status === "partial_failure") {
      consecutiveFailures++;
    } else {
      break;
    }
  }

  return {
    status: data[0].status,
    lastRun: data[0].created_at,
    consecutiveFailures,
  };
}
