import { SupabaseClient } from "@supabase/supabase-js";

export interface TeamMembership {
  orgId: string;
  orgName: string;
  role: "owner" | "admin" | "member";
  maxMembers: number;
}

/**
 * Check if a user belongs to an active team (with Stripe subscription).
 * Returns the team info if they are a member, null otherwise.
 */
export async function getTeamMembership(
  supabase: SupabaseClient,
  userId: string
): Promise<TeamMembership | null> {
  const { data } = await supabase
    .from("team_members")
    .select(`
      role,
      org_id,
      organizations!inner (
        id,
        name,
        max_members,
        stripe_subscription_id
      )
    `)
    .eq("user_id", userId)
    .not("organizations.stripe_subscription_id", "is", null)
    .limit(1)
    .maybeSingle();

  if (!data) return null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const org = (data as any).organizations;
  return {
    orgId: org.id,
    orgName: org.name,
    role: data.role as "owner" | "admin" | "member",
    maxMembers: org.max_members,
  };
}

/**
 * Check if a user has Pro-equivalent access (either Pro plan or active team member).
 */
export async function hasProAccess(
  supabase: SupabaseClient,
  userId: string
): Promise<{ isPro: boolean; source: "plan" | "team" | "none" }> {
  const { data: profile } = await supabase
    .from("profiles")
    .select("plan")
    .eq("id", userId)
    .single();

  if (profile?.plan === "pro") {
    return { isPro: true, source: "plan" };
  }

  const team = await getTeamMembership(supabase, userId);
  if (team) {
    return { isPro: true, source: "team" };
  }

  return { isPro: false, source: "none" };
}
