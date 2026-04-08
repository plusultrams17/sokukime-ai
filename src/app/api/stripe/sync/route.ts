import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

/**
 * POST /api/stripe/sync
 *
 * Stripe Webhook が遅延・未到達の場合のフォールバック。
 * ユーザーの stripe_customer_id から Stripe 上のサブスクリプション状態を取得し、
 * profiles テーブルを直接同期する。
 *
 * チェックアウト完了後 (?upgraded=true) にクライアントから呼ばれる。
 */
export async function POST() {
  try {
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

    // Get profile with stripe info
    const { data: profile } = await supabase
      .from("profiles")
      .select("stripe_customer_id, plan, subscription_status, stripe_subscription_id")
      .eq("id", user.id)
      .single();

    if (!profile?.stripe_customer_id) {
      return NextResponse.json({ synced: false, reason: "no_customer_id" });
    }

    // Already pro — no sync needed
    if (profile.plan === "pro" && profile.stripe_subscription_id) {
      return NextResponse.json({ synced: true, plan: "pro", status: profile.subscription_status });
    }

    // Check Stripe for active subscriptions
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    const subscriptions = await stripe.subscriptions.list({
      customer: profile.stripe_customer_id,
      status: "all",
      limit: 1,
    });

    const activeSub = subscriptions.data.find(
      (s) => s.status === "active" || s.status === "trialing"
    );

    if (!activeSub) {
      return NextResponse.json({ synced: false, reason: "no_active_subscription" });
    }

    // Sync to Supabase using admin client (bypass RLS)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ error: "Config error" }, { status: 500 });
    }

    const admin = createAdminClient(supabaseUrl, supabaseServiceKey);
    await admin
      .from("profiles")
      .update({
        plan: "pro",
        stripe_subscription_id: activeSub.id,
        subscription_status: activeSub.status,
      })
      .eq("id", user.id);

    return NextResponse.json({
      synced: true,
      plan: "pro",
      status: activeSub.status,
    });
  } catch (error) {
    console.error("Stripe sync error:", error);
    return NextResponse.json({ error: "Sync failed" }, { status: 500 });
  }
}
