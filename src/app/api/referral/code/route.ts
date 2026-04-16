import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateReferralCode, getReferralStats } from "@/lib/referral";

export async function GET() {
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

  // 既存のコードを取得
  const { data: existing } = await supabase
    .from("referral_codes")
    .select("code")
    .eq("user_id", user.id)
    .single();

  let code: string | undefined;

  if (existing) {
    code = existing.code;
  } else {
    // 新規生成（ユニーク性を保証するためリトライ）
    let attempts = 0;
    while (attempts < 5) {
      const newCode = generateReferralCode();
      const { error } = await supabase.from("referral_codes").insert({
        user_id: user.id,
        code: newCode,
      });
      if (!error) {
        code = newCode;
        break;
      }
      attempts++;
    }
    if (!code) {
      return NextResponse.json(
        { error: "Failed to generate code" },
        { status: 500 }
      );
    }
  }

  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL || "https://seiyaku-coach.vercel.app";
  const shareUrl = `${appUrl}/?ref=${code}`;
  const stats = await getReferralStats(supabase, user.id);

  // bonus_credits を取得
  const { data: profile } = await supabase
    .from("profiles")
    .select("bonus_credits")
    .eq("id", user.id)
    .single();
  const bonusCredits = profile?.bonus_credits || 0;

  return NextResponse.json({ code, shareUrl, stats, bonusCredits });
}
