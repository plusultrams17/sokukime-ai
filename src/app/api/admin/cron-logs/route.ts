import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getRecentCronLogs, getLastCronStatus } from "@/lib/cron-logger";

/**
 * Admin Cron Logs API
 *
 * GET /api/admin/cron-logs?secret=ADMIN_SECRET — View recent cron execution logs
 * GET /api/admin/cron-logs?secret=ADMIN_SECRET&job=daily_emails — Filter by job name
 * GET /api/admin/cron-logs?secret=ADMIN_SECRET&status=true — Get current status summary
 */
export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");
  if (!secret || secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabaseServiceKey) {
    return NextResponse.json({ error: "Missing config" }, { status: 500 });
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  const jobName = request.nextUrl.searchParams.get("job") || undefined;
  const statusOnly = request.nextUrl.searchParams.get("status") === "true";

  if (statusOnly) {
    const dailyEmailsStatus = await getLastCronStatus(supabase, "daily_emails");
    return NextResponse.json({
      jobs: {
        daily_emails: dailyEmailsStatus,
      },
    });
  }

  const logs = await getRecentCronLogs(supabase, jobName);
  return NextResponse.json({ logs });
}
