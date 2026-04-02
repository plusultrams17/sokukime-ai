import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

/**
 * Admin Dunning Dashboard API
 *
 * GET /api/admin/dunning?secret=ADMIN_SECRET — View active dunning cases
 *
 * Returns:
 * - Active past_due users with retry history
 * - Recovery rate statistics
 * - Average time to recovery
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
  const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000).toISOString();

  // Active past_due users
  const { data: pastDueUsers } = await supabase
    .from("profiles")
    .select("id, email, subscription_status")
    .eq("subscription_status", "past_due");

  // Recent dunning attempts
  const { data: recentAttempts } = await supabase
    .from("dunning_attempts")
    .select("*")
    .gte("created_at", thirtyDaysAgo)
    .order("created_at", { ascending: false });

  // Group attempts by user
  const userAttempts: Record<string, { attempts: number; maxAttempt: number; lastFailure: string }> = {};
  for (const attempt of recentAttempts || []) {
    if (!userAttempts[attempt.user_id]) {
      userAttempts[attempt.user_id] = { attempts: 0, maxAttempt: 0, lastFailure: "" };
    }
    userAttempts[attempt.user_id].attempts++;
    userAttempts[attempt.user_id].maxAttempt = Math.max(
      userAttempts[attempt.user_id].maxAttempt,
      attempt.attempt_number
    );
    if (!userAttempts[attempt.user_id].lastFailure || attempt.created_at > userAttempts[attempt.user_id].lastFailure) {
      userAttempts[attempt.user_id].lastFailure = attempt.created_at;
    }
  }

  // Recovery rate: users who were past_due but recovered (payment_failed then deleted)
  const { count: totalDunningUsers } = await supabase
    .from("onboarding_emails")
    .select("user_id", { count: "exact", head: true })
    .eq("email_type", "payment_failed")
    .gte("created_at", thirtyDaysAgo);

  const currentPastDue = pastDueUsers?.length || 0;
  const recovered = (totalDunningUsers || 0) - currentPastDue;
  const recoveryRate = (totalDunningUsers || 0) > 0
    ? Math.round((recovered / (totalDunningUsers || 1)) * 100)
    : 0;

  // Dunning cases with details
  const activeCases = (pastDueUsers || []).map(user => ({
    ...user,
    retryInfo: userAttempts[user.id] || { attempts: 0, maxAttempt: 0, lastFailure: null },
  }));

  return NextResponse.json({
    summary: {
      activePastDue: currentPastDue,
      totalDunningLast30Days: totalDunningUsers || 0,
      recovered,
      recoveryRate: `${recoveryRate}%`,
    },
    activeCases,
    recentAttempts: (recentAttempts || []).slice(0, 20),
  });
}
