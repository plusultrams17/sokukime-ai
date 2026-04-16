import { NextRequest, NextResponse } from "next/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { trySendOnboardingEmail } from "@/lib/email";

// Validate that a redirect path is internal only (prevent open redirect)
function isValidRedirect(path: string): boolean {
  return path.startsWith("/") && !path.startsWith("//") && !path.includes("://");
}

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const redirectParam = searchParams.get("redirect") || "/roleplay";
  const redirect = isValidRedirect(redirectParam) ? redirectParam : "/roleplay";
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
      // Exchange failed — check if user already has a valid session (re-login attempt)
      const { data: { user: existingUser } } = await supabase.auth.getUser();
      if (existingUser) {
        // Already authenticated, just redirect to destination
        return NextResponse.redirect(`${origin}${redirect}`);
      }
      console.error("[auth/callback] exchangeCodeForSession failed:", error.message);
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
        // Service role credentials for admin operations (referral + trial)
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        // Detect first-time user by checking trial_ends_at (not usage_records — avoids infinite re-activation)
        let isFirstTime = true;
        if (supabaseUrl && supabaseServiceKey) {
          const adminCheck = createAdminClient(supabaseUrl, supabaseServiceKey);
          const { data: existingProfile } = await adminCheck
            .from("profiles")
            .select("trial_ends_at")
            .eq("id", user.id)
            .single();
          if (existingProfile?.trial_ends_at) {
            isFirstTime = false;
          }
        }

        if (isFirstTime) {
          // Record referral if applicable (use admin client to bypass RLS)
          if (refCode && supabaseUrl && supabaseServiceKey) {
            try {
              const adminForRef = createAdminClient(supabaseUrl, supabaseServiceKey);
              const { data: referralCode } = await adminForRef
                .from("referral_codes")
                .select("user_id")
                .eq("code", refCode.toUpperCase())
                .single();

              if (referralCode && referralCode.user_id !== user.id) {
                // ignoreDuplicates prevents regressing status if user already converted
                const { data: upsertResult } = await adminForRef.from("referral_conversions").upsert(
                  {
                    referrer_id: referralCode.user_id,
                    referee_id: user.id,
                    status: "signed_up",
                  },
                  { onConflict: "referrer_id,referee_id", ignoreDuplicates: true }
                ).select("id");

                // 新規コンバージョンの場合のみ紹介者にボーナスクレジット +5 を付与
                if (upsertResult && upsertResult.length > 0) {
                  try {
                    const { data: referrerProfile } = await adminForRef
                      .from("profiles")
                      .select("bonus_credits")
                      .eq("id", referralCode.user_id)
                      .single();
                    const currentBonus = referrerProfile?.bonus_credits || 0;
                    await adminForRef
                      .from("profiles")
                      .update({ bonus_credits: currentBonus + 5 })
                      .eq("id", referralCode.user_id);
                  } catch (bonusErr) {
                    console.error("[auth/callback] Bonus credit grant failed:", bonusErr);
                  }
                }
              }
            } catch (err) {
              console.error("[auth/callback] Referral tracking failed:", err);
            }
          }

          // Reverse trial removed — first-time users start on the Free plan.
          // Pro access is granted only via Stripe checkout (7-day Stripe trial)
          // or campaign codes redeemed on /activate.
          // We still upsert the profile row (without plan/trial_ends_at) so
          // that the "first-time" detection via trial_ends_at above remains
          // reliable on subsequent logins: we mark trial_ends_at with a
          // sentinel past timestamp to flip isFirstTime to false next time.
          if (supabaseUrl && supabaseServiceKey) {
            try {
              const admin = createAdminClient(supabaseUrl, supabaseServiceKey);
              await admin.from("profiles").upsert({
                id: user.id,
                ...(user.email ? { email: user.email } : {}),
                plan: "free",
                trial_ends_at: new Date(0).toISOString(),
              }, { onConflict: "id" });
            } catch (err) {
              console.error("[auth/callback] First-time profile upsert failed:", err);
            }
          }

          // Send welcome email (fire-and-forget)
          if (user.email) {
            trySendOnboardingEmail(supabase, user.id, user.email, "welcome");
          }

          // First-time user welcome
          // If a non-/roleplay redirect was specified (e.g. /activate?code=XXX), honor it without welcome param
          if (redirect && !redirect.startsWith("/roleplay")) {
            return NextResponse.redirect(`${origin}${redirect}`);
          }
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
