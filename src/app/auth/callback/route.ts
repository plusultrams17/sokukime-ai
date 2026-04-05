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

          // Activate reverse trial — 7-day free Pro access
          // Uses service role to bypass RLS for profile update
          const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
          const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
          if (supabaseUrl && supabaseServiceKey) {
            try {
              const admin = createAdminClient(supabaseUrl, supabaseServiceKey);
              const trialEnd = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
              await admin.from("profiles").update({
                plan: "pro",
                trial_ends_at: trialEnd,
              }).eq("id", user.id);
            } catch {
              // Trial activation failure should not block signup
            }
          }

          // Send welcome email (fire-and-forget)
          if (user.email) {
            trySendOnboardingEmail(supabase, user.id, user.email, "welcome");
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
