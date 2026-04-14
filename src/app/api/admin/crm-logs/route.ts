import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getCRMWebhookLogs } from "@/lib/crm-webhook";

/**
 * Admin CRM Webhook Logs API
 *
 * GET /api/admin/crm-logs?secret=ADMIN_SECRET — View recent CRM webhook event logs
 */
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
  const logs = await getCRMWebhookLogs(supabase);

  // Aggregate stats
  const stats = { total: logs.length, sent: 0, failed: 0, skipped: 0 };
  const byEvent: Record<string, number> = {};
  for (const log of logs) {
    if (log.status === "sent") stats.sent++;
    else if (log.status === "failed") stats.failed++;
    else stats.skipped++;
    byEvent[log.event_type] = (byEvent[log.event_type] || 0) + 1;
  }

  return NextResponse.json({ stats, byEvent, logs });
}
