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

  // Check for active Pro subscription (paid, not trial)
  const { data: profile } = await supabase
    .from("profiles")
    .select("plan, subscription_status")
    .eq("id", user.id)
    .single();

  const isPaidPro =
    profile?.plan === "pro" && profile?.subscription_status === "active";

  return { purchased: isPaidPro };
}
