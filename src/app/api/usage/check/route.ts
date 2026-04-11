import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getUsageStatus } from "@/lib/usage";

const UNVERIFIED_USAGE_LIMIT = 3;

/**
 * Read-only endpoint: ロープレを実際に「開始可能か」だけチェックする。
 * `/api/usage/record` と違い usage_records への INSERT はしない。
 *
 * 2026-04-11 仕様変更:
 * カウントタイミングを「ロープレ開始ボタン押下時」から
 * 「最初のユーザーメッセージ送信時」に変更したため、setup → chat の遷移時には
 * このエンドポイントで上限のみチェックし、実際の記録は chat-ui.tsx の
 * sendMessage() から /api/usage/record を呼ぶ。
 */
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

  // メール認証チェック（メール登録ユーザーのみ・OAuth は対象外）
  const isOAuthUser = user.app_metadata?.provider !== "email";
  if (!isOAuthUser && !user.email_confirmed_at) {
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

  return NextResponse.json(status);
}
