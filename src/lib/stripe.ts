import Stripe from "stripe";
import {
  TEAM_PLANS,
  getTeamPlan,
  getTeamPriceId,
  type TeamPlanTier,
} from "@/lib/plans";

export function getStripe() {
  return new Stripe((process.env.STRIPE_SECRET_KEY || "").trim());
}

/**
 * 人数に基づいて最適なチームプランティアを判定する
 */
function resolveTeamTier(memberCount: number): TeamPlanTier {
  for (let i = TEAM_PLANS.length - 1; i >= 0; i--) {
    if (memberCount >= TEAM_PLANS[i].minMembers) {
      return TEAM_PLANS[i].tier;
    }
  }
  return "team_5";
}

/**
 * Create a Stripe checkout session for a team plan.
 * Per-seat pricing: quantity = member count.
 */
export async function createTeamCheckoutSession(opts: {
  orgId: string;
  orgName: string;
  userId: string;
  email: string;
  memberCount: number;
  billing?: "monthly" | "annual";
  customerId?: string;
}) {
  const stripe = getStripe();
  const billing = opts.billing || "monthly";
  const tier = resolveTeamTier(opts.memberCount);
  const priceId = getTeamPriceId(tier, billing);

  if (!priceId) {
    throw new Error(
      `Stripe Price ID not configured for team tier ${tier} (${billing})`
    );
  }

  // Create or reuse Stripe customer
  let customerId = opts.customerId;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: opts.email,
      metadata: {
        supabase_user_id: opts.userId,
        org_id: opts.orgId,
      },
    });
    customerId = customer.id;
  }

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    client_reference_id: opts.userId,
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: priceId, quantity: opts.memberCount }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/team?created=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/team`,
    locale: "ja",
    subscription_data: {
      metadata: {
        supabase_user_id: opts.userId,
        org_id: opts.orgId,
        plan_type: "team",
        plan_tier: tier,
        member_count: String(opts.memberCount),
      },
    },
    metadata: {
      org_id: opts.orgId,
      org_name: opts.orgName,
      plan_type: "team",
      plan_tier: tier,
    },
  });

  return { session, customerId, tier };
}

/**
 * Resolve team plan tier from Stripe metadata.
 * Falls back to team_5 if not set.
 */
export function resolveTeamPlanTier(
  metadata: Stripe.Metadata | null | undefined
): TeamPlanTier {
  const tier = metadata?.plan_tier;
  if (
    tier === "team_5" ||
    tier === "team_10" ||
    tier === "team_30" ||
    tier === "team_50"
  ) {
    return tier;
  }
  return "team_5";
}

/**
 * Get the per-user credits for a team plan tier.
 */
export function getTeamCreditsPerUser(tier: TeamPlanTier): number {
  return getTeamPlan(tier).creditsPerUser;
}
