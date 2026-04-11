import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getPurchaseStatus } from "@/lib/lessons/access";

// Force dynamic — no caching at edge/CDN
export const dynamic = "force-dynamic";
export const revalidate = 0;

// Version marker to verify which build is serving
const DEBUG_VERSION = "v3-tester-full-fix-2026-04-10";

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

  // access.ts と全く同じ SELECT を再現してみる
  const { data: narrowProfile, error: narrowProfileError } = await supabase
    .from("profiles")
    .select("plan, subscription_status, is_tester, tester_expires_at")
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

  // 手動でテスター判定を再現
  const testerExpiresAt = narrowProfile?.tester_expires_at as
    | string
    | null
    | undefined;
  const manualIsTesterActive =
    narrowProfile?.is_tester === true &&
    (testerExpiresAt === null ||
      testerExpiresAt === undefined ||
      new Date(testerExpiresAt) > new Date());

  return NextResponse.json({
    _version: DEBUG_VERSION,
    _serverTime: new Date().toISOString(),
    authenticated: true,
    user: {
      id: user.id,
      email: user.email,
    },
    profile,
    profileError: profileError?.message,
    narrowProfile,
    narrowProfileError: narrowProfileError?.message,
    manualIsTesterActive,
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
      planIsPaid:
        profile?.plan === "starter" ||
        profile?.plan === "pro" ||
        profile?.plan === "master",
      plan: profile?.plan,
      subscriptionStatus: profile?.subscription_status,
      finalTier: status.tier,
      finalPurchased: status.purchased,
      shouldSeeAllLessons: status.tier === "full",
    },
  });
}
