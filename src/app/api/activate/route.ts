import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

/**
 * GET /api/activate?code=XXX
 * テスターコードを検証する（事前チェック用）
 * 認証不要 — 入力前にコードの存在確認に使う
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const rawCode = searchParams.get("code");

  if (!rawCode) {
    return NextResponse.json({ valid: false, error: "コードが指定されていません" });
  }

  const code = rawCode.trim().toUpperCase();
  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json({ valid: false, error: "サービスが一時的に利用できません" });
  }

  const { data: codeRow } = await supabase
    .from("tester_codes")
    .select(
      "code, description, duration_days, max_uses, current_uses, active, access_tier",
    )
    .eq("code", code)
    .maybeSingle();

  if (!codeRow) {
    return NextResponse.json({ valid: false, error: "このコードは存在しません" });
  }

  if (!codeRow.active) {
    return NextResponse.json({ valid: false, error: "このコードは無効化されています" });
  }

  if (
    codeRow.max_uses !== null &&
    codeRow.current_uses >= codeRow.max_uses
  ) {
    return NextResponse.json({ valid: false, error: "このコードは利用上限に達しました" });
  }

  return NextResponse.json({
    valid: true,
    code: codeRow.code,
    description: codeRow.description,
    durationDays: codeRow.duration_days,
    accessTier: codeRow.access_tier || "full",
  });
}

/**
 * POST /api/activate
 * body: { code: string }
 * テスターコードを引き換える（要ログイン）
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    if (!supabase) {
      return NextResponse.json({ error: "サービスが一時的に利用できません" }, { status: 503 });
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "ログインが必要です" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const rawCode = typeof body.code === "string" ? body.code : "";
    const code = rawCode.trim().toUpperCase();

    if (!code) {
      return NextResponse.json({ error: "コードを入力してください" }, { status: 400 });
    }

    // Service role client — for cross-user atomic updates
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ error: "サービスが一時的に利用できません" }, { status: 503 });
    }
    const admin = createAdminClient(supabaseUrl, supabaseServiceKey);

    // 1. Validate the code
    const { data: codeRow, error: codeError } = await admin
      .from("tester_codes")
      .select(
        "code, description, duration_days, max_uses, current_uses, active, access_tier",
      )
      .eq("code", code)
      .maybeSingle();

    if (codeError || !codeRow) {
      return NextResponse.json({ error: "このコードは存在しません" }, { status: 404 });
    }

    if (!codeRow.active) {
      return NextResponse.json({ error: "このコードは無効化されています" }, { status: 410 });
    }

    if (codeRow.max_uses !== null && codeRow.current_uses >= codeRow.max_uses) {
      return NextResponse.json({ error: "このコードは利用上限に達しました" }, { status: 410 });
    }

    // 2. Check if user already redeemed this code
    const { data: existingRedemption } = await admin
      .from("tester_redemptions")
      .select("id, expires_at")
      .eq("user_id", user.id)
      .eq("code", code)
      .maybeSingle();

    if (existingRedemption) {
      return NextResponse.json(
        {
          success: true,
          alreadyRedeemed: true,
          expiresAt: existingRedemption.expires_at,
          message: "このコードは既に有効化済みです",
        },
        { status: 200 }
      );
    }

    // 3. Calculate expiry
    const expiresAt =
      codeRow.duration_days !== null
        ? new Date(Date.now() + codeRow.duration_days * 24 * 60 * 60 * 1000).toISOString()
        : null;

    // 4. Update profile (set tester flag + Pro)
    // Clear trial_ends_at so the cron's reverse-trial-expiry job doesn't
    // downgrade testers when their original 7-day reverse trial would have ended.
    //
    // NOTE: `tester_access_tier` column is NOT written here because it doesn't
    // exist in the current DB schema. All active testers get full access via
    // src/lib/lessons/access.ts → getPurchaseStatus(). If tier-based tester
    // access is needed in the future, add the column + re-enable this write.
    const { error: profileError } = await admin
      .from("profiles")
      .update({
        is_tester: true,
        tester_expires_at: expiresAt,
        tester_code: code,
        plan: "pro",
        subscription_status: "active",
        trial_ends_at: null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (profileError) {
      console.error("[activate] profile update failed:", profileError);
      return NextResponse.json(
        { error: "プロフィール更新に失敗しました" },
        { status: 500 }
      );
    }

    // 5. Record redemption
    const { error: redemptionError } = await admin
      .from("tester_redemptions")
      .insert({
        user_id: user.id,
        code,
        expires_at: expiresAt,
      });

    if (redemptionError) {
      console.error("[activate] redemption insert failed:", redemptionError);
      // Continue anyway — profile is already updated
    }

    // 6. Increment current_uses (best-effort, non-blocking)
    await admin
      .from("tester_codes")
      .update({ current_uses: codeRow.current_uses + 1 })
      .eq("code", code);

    return NextResponse.json({
      success: true,
      code,
      description: codeRow.description,
      expiresAt,
      durationDays: codeRow.duration_days,
      accessTier,
    });
  } catch (error) {
    console.error("[activate] unexpected error:", error);
    return NextResponse.json(
      { error: "予期しないエラーが発生しました" },
      { status: 500 }
    );
  }
}
