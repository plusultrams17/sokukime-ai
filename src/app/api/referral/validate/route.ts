import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { validateReferralCode } from "@/lib/referral";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.json({ valid: false, error: "No code provided" });
  }

  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json({ valid: false, error: "Service unavailable" });
  }

  // 認証済みユーザーの場合、自分自身のコードを除外
  let currentUserId: string | undefined;
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    currentUserId = user?.id;
  } catch {
    // 未認証でもOK（サインアップ時に使用）
  }

  const result = await validateReferralCode(supabase, code, currentUserId);
  return NextResponse.json(result);
}
