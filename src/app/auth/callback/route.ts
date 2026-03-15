import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const redirect = searchParams.get("redirect") || "/roleplay";
  const refCode = searchParams.get("ref");

  if (!code) {
    // No code provided - redirect to login with error
    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent("認証コードが見つかりません。もう一度お試しください。")}`
    );
  }

  try {
    const supabase = await createClient();
    if (!supabase) {
      return NextResponse.redirect(
        `${origin}/login?error=${encodeURIComponent("サービスが一時的に利用できません。")}`
      );
    }
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      return NextResponse.redirect(
        `${origin}/login?error=${encodeURIComponent("認証に失敗しました。もう一度お試しください。")}`
      );
    }

    // Check if first-time user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { count } = await supabase
        .from("usage_records")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id);

      if (!count || count === 0) {
        // 紹介コードがあれば紹介コンバージョンを記録
        if (refCode) {
          try {
            const { data: referralCode } = await supabase
              .from("referral_codes")
              .select("user_id")
              .eq("code", refCode.toUpperCase())
              .single();

            if (referralCode && referralCode.user_id !== user.id) {
              await supabase.from("referral_conversions").insert({
                referrer_id: referralCode.user_id,
                referee_id: user.id,
                status: "signed_up",
              });
            }
          } catch {
            // 紹介記録のエラーは無視（ユーザー登録フローを妨げない）
          }
        }

        // Preserve redirect params (e.g. showScore=true) for first-time users
        if (redirect && redirect !== "/roleplay" && redirect.startsWith("/roleplay")) {
          const redirectUrl = new URL(redirect, origin);
          redirectUrl.searchParams.set("welcome", "true");
          return NextResponse.redirect(redirectUrl.toString());
        }
        return NextResponse.redirect(`${origin}/roleplay?welcome=true`);
      }
    }
  } catch {
    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent("認証処理中にエラーが発生しました。もう一度お試しください。")}`
    );
  }

  return NextResponse.redirect(`${origin}${redirect}`);
}
