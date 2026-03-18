import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const redirect = searchParams.get("redirect") || "/roleplay";
  const refCode = searchParams.get("ref");

  if (!code) {
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

    // Check if first-time user (gracefully handle missing tables)
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      try {
        const { count } = await supabase
          .from("usage_records")
          .select("id", { count: "exact", head: true })
          .eq("user_id", user.id);

        if (!count || count === 0) {
          // Record referral if applicable
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
              // Ignore referral errors
            }
          }

          // First-time user welcome
          if (redirect && redirect !== "/roleplay" && redirect.startsWith("/roleplay")) {
            const redirectUrl = new URL(redirect, origin);
            redirectUrl.searchParams.set("welcome", "true");
            return NextResponse.redirect(redirectUrl.toString());
          }
          return NextResponse.redirect(`${origin}/roleplay?welcome=true`);
        }
      } catch {
        // DB tables may not exist yet — skip first-time check, proceed normally
      }
    }
  } catch {
    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent("認証処理中にエラーが発生しました。もう一度お試しください。")}`
    );
  }

  return NextResponse.redirect(`${origin}${redirect}`);
}
