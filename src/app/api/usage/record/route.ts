import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getUsageStatus, recordUsage } from "@/lib/usage";
import { trySendOnboardingEmail } from "@/lib/email";

const UNVERIFIED_USAGE_LIMIT = 3;

export async function POST() {
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

  // Check if email verification is needed (email signup only, not OAuth)
  const isOAuthUser = user.app_metadata?.provider !== "email";
  if (!isOAuthUser && !user.email_confirmed_at) {
    // Count total usage for unverified users
    const { count } = await supabase
      .from("usage_records")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id);

    if ((count || 0) >= UNVERIFIED_USAGE_LIMIT) {
      return NextResponse.json(
        {
          error: "email_verification_required",
          message: "メール認証が必要です",
          email: user.email,
          usedBeforeVerify: count || 0,
          verifyLimit: UNVERIFIED_USAGE_LIMIT,
        },
        { status: 403 }
      );
    }
  }

  // Check usage limit before recording
  const status = await getUsageStatus(supabase, user.id);
  if (!status.canStart) {
    return NextResponse.json(
      {
        error: "本日のロープレ上限に達しました",
        ...status,
      },
      { status: 403 }
    );
  }

  const { error: usageError } = await recordUsage(supabase, user.id);
  if (usageError) {
    console.error("Usage record insert failed:", usageError);
    return NextResponse.json({ error: "使用記録の保存に失敗しました" }, { status: 500 });
  }

  // Send onboarding emails based on total roleplay count (fire-and-forget)
  if (user.email) {
    const { count: totalCount } = await supabase
      .from("usage_records")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id);

    if (totalCount === 1) {
      trySendOnboardingEmail(supabase, user.id, user.email, "first_roleplay");
    } else if (totalCount === 3) {
      trySendOnboardingEmail(supabase, user.id, user.email, "third_roleplay");
    }
  }

  const updatedStatus = await getUsageStatus(supabase, user.id);
  return NextResponse.json(updatedStatus);
}
