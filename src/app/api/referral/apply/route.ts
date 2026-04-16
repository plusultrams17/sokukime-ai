import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

/**
 * POST /api/referral/apply
 * 紹介コード適用 + ボーナスクレジット付与
 *
 * Body: { code: string }
 * - 紹介コードを検証し、referral_conversions に signed_up を記録
 * - 紹介者に +5 bonus_credits を付与
 */
export async function POST(request: NextRequest) {
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

  let body: { code?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { code } = body;
  if (!code || typeof code !== "string") {
    return NextResponse.json({ error: "Missing referral code" }, { status: 400 });
  }

  const normalizedCode = code.toUpperCase().trim();

  // Admin client for cross-user operations (bypass RLS)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabaseServiceKey) {
    return NextResponse.json({ error: "Config error" }, { status: 500 });
  }
  const admin = createAdminClient(supabaseUrl, supabaseServiceKey);

  // 紹介コードを検索
  const { data: referralCode } = await admin
    .from("referral_codes")
    .select("user_id")
    .eq("code", normalizedCode)
    .single();

  if (!referralCode) {
    return NextResponse.json(
      { error: "紹介コードが見つかりません" },
      { status: 404 }
    );
  }

  // 自分自身のコードは使えない
  if (referralCode.user_id === user.id) {
    return NextResponse.json(
      { error: "自分の紹介コードは使用できません" },
      { status: 400 }
    );
  }

  // 既に紹介済みか確認
  const { data: existingConversion } = await admin
    .from("referral_conversions")
    .select("id")
    .eq("referee_id", user.id)
    .single();

  if (existingConversion) {
    return NextResponse.json(
      { error: "既に紹介コードが適用されています" },
      { status: 409 }
    );
  }

  // referral_conversions に記録
  const { error: conversionError } = await admin
    .from("referral_conversions")
    .insert({
      referrer_id: referralCode.user_id,
      referee_id: user.id,
      status: "signed_up",
    });

  if (conversionError) {
    console.error("[referral/apply] Failed to create conversion:", conversionError);
    return NextResponse.json(
      { error: "紹介記録の作成に失敗しました" },
      { status: 500 }
    );
  }

  // 紹介者にボーナスクレジット +5 を付与
  const { data: referrerProfile } = await admin
    .from("profiles")
    .select("bonus_credits")
    .eq("id", referralCode.user_id)
    .single();

  const currentBonus = referrerProfile?.bonus_credits || 0;
  const { error: updateError } = await admin
    .from("profiles")
    .update({ bonus_credits: currentBonus + 5 })
    .eq("id", referralCode.user_id);

  if (updateError) {
    console.error("[referral/apply] Failed to grant bonus credits:", updateError);
    // コンバージョンは記録済みなので 500 は返さない
    // ボーナスは後からリトライ可能
  }

  return NextResponse.json({
    success: true,
    message: "紹介コードが適用されました",
  });
}
