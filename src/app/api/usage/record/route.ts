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
  //  - Free: 累計5回（生涯）
  //  - Starter: 月30回 / Pro: 月60回 / Master: 月200回（JST 暦月リセット）
  const status = await getUsageStatus(supabase, user.id);
  if (!status.canStart) {
    const planLabel =
      status.plan === "master"
        ? "マスタープラン"
        : status.plan === "pro"
          ? "プロプラン"
          : status.plan === "starter"
            ? "スタータープラン"
            : "無料プラン";
    const errorMessage =
      status.plan === "free"
        ? `無料プランのロープレ累計上限（${status.limit}回）に達しました。上位プランでもっと練習できます。`
        : `今月の${planLabel}ロープレ上限（${status.limit}回）に達しました。来月1日にリセットされます。`;
    return NextResponse.json(
      {
        error: errorMessage,
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
