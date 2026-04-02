import { SupabaseClient } from "@supabase/supabase-js";

/**
 * A/B Test Infrastructure
 *
 * Supports subject line and CTA variant testing for automated emails.
 * Variant assignment is deterministic per user (hash-based) to ensure
 * consistent experience across retries.
 */

export interface ABTest {
  id: string;
  test_name: string;
  email_type: string;
  variants: ABVariant[];
  traffic_split: Record<string, number>;
  is_active: boolean;
  winner: string | null;
}

export interface ABVariant {
  name: string;
  subject?: string;
  cta_text?: string;
  cta_url?: string;
}

export interface ABAssignment {
  testId: string;
  variant: string;
  variantData: ABVariant;
}

/**
 * Deterministic variant assignment using simple hash.
 * Ensures the same user always gets the same variant for a given test.
 */
function hashAssign(userId: string, testId: string, variantNames: string[]): string {
  let hash = 0;
  const key = `${userId}:${testId}`;
  for (let i = 0; i < key.length; i++) {
    const char = key.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  const index = Math.abs(hash) % variantNames.length;
  return variantNames[index];
}

/**
 * Get the A/B test assignment for a user and email type.
 * Returns null if no active test exists for this email type.
 */
export async function getABAssignment(
  supabase: SupabaseClient,
  userId: string,
  emailType: string
): Promise<ABAssignment | null> {
  const { data: test } = await supabase
    .from("ab_tests")
    .select("*")
    .eq("email_type", emailType)
    .eq("is_active", true)
    .limit(1)
    .single();

  if (!test) return null;

  const variants = test.variants as ABVariant[];
  if (!variants || variants.length < 2) return null;

  // If there's a winner, always use it
  if (test.winner) {
    const winnerVariant = variants.find(v => v.name === test.winner) || variants[0];
    return { testId: test.id, variant: test.winner, variantData: winnerVariant };
  }

  const variantNames = variants.map(v => v.name);
  const assigned = hashAssign(userId, test.id, variantNames);
  const variantData = variants.find(v => v.name === assigned) || variants[0];

  return { testId: test.id, variant: assigned, variantData };
}

/**
 * Record an A/B test conversion event.
 */
export async function recordABConversion(
  supabase: SupabaseClient,
  testId: string,
  userId: string,
  variant: string,
  conversionType: "sent" | "opened" | "clicked" | "converted"
): Promise<void> {
  await supabase.from("ab_test_conversions").insert({
    ab_test_id: testId,
    user_id: userId,
    variant,
    conversion_type: conversionType,
  });
}

/**
 * Get A/B test results for admin dashboard.
 */
export async function getABTestResults(supabase: SupabaseClient) {
  const { data: tests } = await supabase
    .from("ab_tests")
    .select("*")
    .order("created_at", { ascending: false });

  if (!tests || tests.length === 0) return [];

  const results = [];
  for (const test of tests) {
    const { data: conversions } = await supabase
      .from("ab_test_conversions")
      .select("variant, conversion_type")
      .eq("ab_test_id", test.id);

    const variantStats: Record<string, Record<string, number>> = {};
    for (const c of conversions || []) {
      if (!variantStats[c.variant]) {
        variantStats[c.variant] = { sent: 0, opened: 0, clicked: 0, converted: 0 };
      }
      variantStats[c.variant][c.conversion_type]++;
    }

    results.push({
      ...test,
      stats: variantStats,
    });
  }

  return results;
}
