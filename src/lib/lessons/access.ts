import type { SupabaseClient } from "@supabase/supabase-js";

export type AccessTier = "basic" | "intermediate" | "full";

/**
 * Beginner 1–3 — free/basic tier lessons (unlocked for everyone, including
 * unauthenticated visitors and "basic" tier testers).
 */
export const FREE_LESSON_SLUGS = [
  "sales-mindset",
  "praise-technique",
  "premise-setting",
];

/**
 * Beginner (8) + Intermediate (7) = 15 lessons.
 * Accessible to "intermediate" tier testers (③ プロコード: VIP).
 */
export const INTERMEDIATE_LESSON_SLUGS = [
  // Beginner (8)
  "sales-mindset",
  "praise-technique",
  "premise-setting",
  "mehrabian-rule",
  "drawer-phrases",
  "deepening",
  "benefit-method",
  "comparison-if",
  // Intermediate (7)
  "closing-intro",
  "social-proof",
  "consistency",
  "quotation-method",
  "positive-closing",
  "negative-closing",
  "desire-patterns",
];

export function isLessonFree(slug: string): boolean {
  return FREE_LESSON_SLUGS.includes(slug);
}

/**
 * Check whether a lesson is accessible for the given access tier.
 * - `full`: all 22 lessons
 * - `intermediate`: 15 lessons (beginner + intermediate)
 * - `basic` or null: only 3 free lessons
 */
export function isLessonAccessibleForTier(
  slug: string,
  tier: AccessTier | null,
): boolean {
  if (tier === "full") return true;
  if (tier === "intermediate") return INTERMEDIATE_LESSON_SLUGS.includes(slug);
  // "basic" or null — free user, only the 3 beginner lessons
  return FREE_LESSON_SLUGS.includes(slug);
}

export interface PurchaseStatus {
  /** true when the user has FULL access (tier === "full") — legacy field */
  purchased: boolean;
  /** The user's current access tier, or null for free/unauthenticated users */
  tier: AccessTier | null;
}

export async function getPurchaseStatus(
  supabase: SupabaseClient,
): Promise<PurchaseStatus> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { purchased: false, tier: null };

  // Check program_purchases (one-time purchase = full access)
  const { data: purchaseData } = await supabase
    .from("program_purchases")
    .select("id")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle();

  if (purchaseData) {
    return { purchased: true, tier: "full" };
  }

  // Check profile for Pro/tester state.
  // NOTE: `tester_access_tier` is OPTIONAL — only select columns that reliably
  // exist in the DB. Older schemas don't have it, and selecting a missing
  // column makes the whole query fail silently (profile === null), which
  // previously caused Pro users to be downgraded to 3 free lessons.
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("plan, subscription_status, is_tester, tester_expires_at")
    .eq("id", user.id)
    .single();

  if (profileError) {
    console.error("[access] profile query failed:", profileError);
  }
  if (!profile) return { purchased: false, tier: null };

  // Tester check — priority over paid Pro (activate sets plan=pro too).
  // All active testers get full access to the 22 lessons (roleplay quota
  // is enforced separately via src/lib/usage.ts).
  const testerExpiresAt = profile.tester_expires_at as string | null | undefined;
  const isTesterActive =
    profile.is_tester === true &&
    (testerExpiresAt === null ||
      testerExpiresAt === undefined ||
      new Date(testerExpiresAt) > new Date());

  if (isTesterActive) {
    return { purchased: true, tier: "full" };
  }

  // 有料プラン (Starter / Pro / Master) = 22レッスン全解放。
  // Stripe webhook が subscription deletion で plan='free' に降格するため、
  // plan カラム単体で "has an active paid entitlement" のプロキシとして機能する。
  // subscription_status は 'active' / 'past_due' / 'paused' / 'program' のいずれでも
  // レッスンアクセスは維持する（ロープレクレジットのみ src/lib/usage.ts で別判定）。
  // 月次クレジット (Starter=30 / Pro=60 / Master=200) は src/lib/usage.ts で制御。
  if (
    profile.plan === "starter" ||
    profile.plan === "pro" ||
    profile.plan === "master"
  ) {
    return { purchased: true, tier: "full" };
  }

  return { purchased: false, tier: null };
}
