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

  const { data } = await supabase
    .from("program_purchases")
    .select("id")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle();

  return { purchased: !!data };
}
