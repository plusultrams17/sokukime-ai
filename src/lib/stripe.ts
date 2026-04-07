import Stripe from "stripe";

export function getStripe() {
  return new Stripe((process.env.STRIPE_SECRET_KEY || "").trim());
}

/** Team plan price ID (¥20,000/month for 5-member team) */
export const TEAM_PRICE_ID = process.env.STRIPE_TEAM_PRICE_ID || "";

/**
 * Create a Stripe checkout session for a team plan.
 */
export async function createTeamCheckoutSession(opts: {
  orgId: string;
  orgName: string;
  userId: string;
  email: string;
  customerId?: string;
}) {
  const stripe = getStripe();
  const priceId = TEAM_PRICE_ID;

  if (!priceId) {
    throw new Error("STRIPE_TEAM_PRICE_ID is not configured");
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
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/team?created=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
    locale: "ja",
    subscription_data: {
      metadata: {
        supabase_user_id: opts.userId,
        org_id: opts.orgId,
        plan_type: "team",
      },
    },
    metadata: {
      org_id: opts.orgId,
      org_name: opts.orgName,
      plan_type: "team",
    },
  });

  return { session, customerId };
}
