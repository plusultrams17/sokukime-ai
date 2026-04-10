import type { SupabaseClient } from "@supabase/supabase-js";

/** Slugs of lessons that are free (beginner 1–3) */
export const FREE_LESSON_SLUGS = [
  "sales-mindset",
  "praise-technique",
  "premise-setting",
];

export function isLessonFree(slug: string): boolean {
  return FREE_LESSON_SLUGS.includes(slug);
}

export async function getPurchaseStatus(
  supabase: SupabaseClient,
): Promise<{ purchased: boolean }> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { purchased: false };

  // Check program_purchases (one-time purchase)
  const { data: purchaseData } = await supabase
    .from("program_purchases")
    .select("id")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle();

  if (purchaseData) return { purchased: true };

  // Check for active Pro subscription (paid, not trial) OR tester access
  const { data: profile } = await supabase
    .from("profiles")
    .select("plan, subscription_status, is_tester, tester_expires_at")
    .eq("id", user.id)
    .single();

  const isPaidPro =
    profile?.plan === "pro" && profile?.subscription_status === "active";

  // Tester access counts as Pro (until expiry)
  const testerExpiresAt = profile?.tester_expires_at as string | null | undefined;
  const isTesterActive =
    profile?.is_tester === true &&
    (testerExpiresAt === null ||
      testerExpiresAt === undefined ||
      new Date(testerExpiresAt) > new Date());

  return { purchased: isPaidPro || isTesterActive };
}
