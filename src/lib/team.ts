import { SupabaseClient } from "@supabase/supabase-js";
import type { TeamPlanTier } from "@/lib/plans";

export interface TeamMembership {
  orgId: string;
  orgName: string;
  role: "owner" | "admin" | "member";
  maxMembers: number;
  /** チームプランのティア (team_5/team_10/team_30/team_50)。未設定時は null */
  teamPlanTier: TeamPlanTier | null;
  /** トライアル中かどうか */
  isTrial: boolean;
  /** トライアル終了日 */
  trialEndsAt: string | null;
}

/**
 * Check if a user belongs to an active team (with Stripe subscription or active trial).
 * Returns the team info if they are a member, null otherwise.
 */
export async function getTeamMembership(
  supabase: SupabaseClient,
  userId: string
): Promise<TeamMembership | null> {
  // First try: team with active Stripe subscription
  const { data } = await supabase
    .from("team_members")
    .select(`
      role,
      org_id,
      organizations!inner (
        id,
        name,
        max_members,
        stripe_subscription_id,
        team_plan_tier,
        trial_ends_at
      )
    `)
    .eq("user_id", userId)
    .limit(1)
    .maybeSingle();

  if (!data) return null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const org = (data as any).organizations;

  // Team must have either an active subscription or an active trial
  const now = new Date();
  const trialEndsAt = org.trial_ends_at ? new Date(org.trial_ends_at) : null;
  const isTrial = !org.stripe_subscription_id && trialEndsAt !== null && trialEndsAt > now;
  const hasAccess = !!org.stripe_subscription_id || isTrial;

  if (!hasAccess) return null;

  return {
    orgId: org.id,
    orgName: org.name,
    role: data.role as "owner" | "admin" | "member",
    maxMembers: org.max_members,
    teamPlanTier: org.team_plan_tier || null,
    isTrial,
    trialEndsAt: org.trial_ends_at || null,
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

  if (
    profile?.plan === "starter" ||
    profile?.plan === "pro" ||
    profile?.plan === "master"
  ) {
    return { isPro: true, source: "plan" };
  }

  const team = await getTeamMembership(supabase, userId);
  if (team) {
    return { isPro: true, source: "team" };
  }

  return { isPro: false, source: "none" };
}
