import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!);
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("stripe_subscription_id, plan")
    .eq("id", user.id)
    .single();

  if (profileError) {
    console.error("Profile query failed (stripe/pause):", profileError);
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }

  const isPaid =
    profile?.plan === "starter" ||
    profile?.plan === "pro" ||
    profile?.plan === "master";

  if (!profile?.stripe_subscription_id || !isPaid) {
    return NextResponse.json(
      { error: "No active subscription" },
      { status: 400 }
    );
  }

  const body = await request.json();
  const { action, pauseMonths } = body;

  const stripe = getStripe();

  try {
    if (action === "pause") {
      if (!pauseMonths || pauseMonths < 1 || pauseMonths > 3) {
        return NextResponse.json(
          { error: "Pause months must be 1-3" },
          { status: 400 }
        );
      }

      const resumeDate = new Date();
      resumeDate.setMonth(resumeDate.getMonth() + pauseMonths);
      const resumeTimestamp = Math.floor(resumeDate.getTime() / 1000);

      await stripe.subscriptions.update(profile.stripe_subscription_id, {
        pause_collection: {
          behavior: "void",
          resumes_at: resumeTimestamp,
        },
      });

      await supabase
        .from("profiles")
        .update({
          pause_start: new Date().toISOString(),
          pause_resume_date: resumeDate.toISOString(),
          subscription_status: "paused",
        })
        .eq("id", user.id);

      return NextResponse.json({
        success: true,
        action: "paused",
        resumeDate: resumeDate.toISOString(),
      });
    }

    if (action === "resume") {
      await stripe.subscriptions.update(profile.stripe_subscription_id, {
        pause_collection: "",
      } as Stripe.SubscriptionUpdateParams);

      await supabase
        .from("profiles")
        .update({
          pause_start: null,
          pause_resume_date: null,
          subscription_status: "active",
        })
        .eq("id", user.id);

      return NextResponse.json({ success: true, action: "resumed" });
    }

    return NextResponse.json(
      { error: "Invalid action. Use 'pause' or 'resume'" },
      { status: 400 }
    );
  } catch (err) {
    console.error("Pause/resume error:", err);
    return NextResponse.json(
      { error: "Failed to update subscription" },
      { status: 500 }
    );
  }
}
