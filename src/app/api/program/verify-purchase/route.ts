import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

/**
 * Fallback: verify Stripe checkout session and create purchase record
 * if the webhook missed it (e.g. Stripe connection error).
 */
export async function POST(request: NextRequest) {
  const { session_id } = await request.json();
  if (!session_id || typeof session_id !== "string") {
    return NextResponse.json({ error: "session_id required" }, { status: 400 });
  }

  // Auth check
  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json({ error: "Server error" }, { status: 503 });
  }
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabaseAdmin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  // Check if already recorded
  const { data: existing } = await supabaseAdmin
    .from("program_purchases")
    .select("id")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle();

  if (existing) {
    // Ensure profile is also set (may have been missed)
    await supabaseAdmin
      .from("profiles")
      .update({ plan: "pro", subscription_status: "program" })
      .eq("id", user.id);
    return NextResponse.json({ status: "already_recorded" });
  }

  // Verify with Stripe
  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (
      session.payment_status !== "paid" ||
      session.mode !== "payment" ||
      session.metadata?.product_type !== "program"
    ) {
      return NextResponse.json({ error: "Invalid session" }, { status: 400 });
    }

    // Verify this session belongs to this user
    if (session.metadata?.supabase_user_id !== user.id) {
      return NextResponse.json({ error: "Session mismatch" }, { status: 403 });
    }

    // Create purchase record — use upsert to handle race condition with webhook
    const programSlug = session.metadata.program_slug || "five-step-master";
    const paymentIntentId = session.payment_intent as string;
    const customerId = session.customer as string | null;

    const { error: insertError } = await supabaseAdmin
      .from("program_purchases")
      .upsert(
        {
          user_id: user.id,
          program_slug: programSlug,
          stripe_payment_intent_id: paymentIntentId,
          stripe_checkout_session_id: session.id,
          amount: session.amount_total || 0,
          currency: session.currency || "jpy",
          status: "completed",
          completed_at: new Date().toISOString(),
        },
        { onConflict: "stripe_payment_intent_id" },
      );

    if (insertError) {
      console.error("[verify-purchase] Insert error:", insertError);
      return NextResponse.json(
        { error: "Failed to record purchase" },
        { status: 500 },
      );
    }

    // Grant Pro access + store stripe_customer_id if available
    const profileUpdate: Record<string, string> = {
      plan: "pro",
      subscription_status: "program",
    };
    if (customerId) {
      profileUpdate.stripe_customer_id = customerId;
    }

    const { error: updateError } = await supabaseAdmin
      .from("profiles")
      .update(profileUpdate)
      .eq("id", user.id);

    if (updateError) {
      console.error("[verify-purchase] Profile update error:", updateError);
    }

    return NextResponse.json({ status: "verified_and_recorded" });
  } catch (e) {
    console.error("[verify-purchase] Stripe error:", e);
    return NextResponse.json(
      { error: "Stripe verification failed" },
      { status: 500 },
    );
  }
}
