import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getPurchaseStatus } from "@/lib/lessons/access";

/**
 * 診断用: 自分のプロフィール状態を確認するためのエンドポイント
 * 認証必須。自分の情報だけ返す。
 * Pro判定がうまくいかない場合の原因特定に使う。
 */
export async function GET() {
  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json({ error: "supabase unavailable" }, { status: 503 });
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  // プロフィール全体を取得
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // 買い切りプログラム履歴
  const { data: purchases } = await supabase
    .from("program_purchases")
    .select("id, created_at")
    .eq("user_id", user.id);

  // テスター履歴
  const { data: testerRedemptions } = await supabase
    .from("tester_redemptions")
    .select("code, redeemed_at, expires_at")
    .eq("user_id", user.id);

  // 統合判定
  const status = await getPurchaseStatus(supabase);

  return NextResponse.json({
    authenticated: true,
    user: {
      id: user.id,
      email: user.email,
    },
    profile,
    profileError: profileError?.message,
    purchases,
    testerRedemptions,
    unifiedStatus: status,
    // 判定結果の解説
    diagnosis: {
      hasProgramPurchase: (purchases?.length ?? 0) > 0,
      isTester: profile?.is_tester === true,
      testerActive:
        profile?.is_tester === true &&
        (!profile?.tester_expires_at ||
          new Date(profile.tester_expires_at) > new Date()),
      planIsPro: profile?.plan === "pro",
      subscriptionStatus: profile?.subscription_status,
      finalTier: status.tier,
      finalPurchased: status.purchased,
      shouldSeeAllLessons: status.tier === "full",
    },
  });
}
