import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createTeamCheckoutSession } from "@/lib/stripe";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    if (!supabase) {
      return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const orgName = body.name?.trim();
    const memberCount = Math.max(5, Math.min(200, parseInt(body.memberCount) || 5));
    const billing: "monthly" | "annual" = body.billing === "annual" ? "annual" : "monthly";
    if (!orgName) {
      return NextResponse.json({ error: "チーム名は必須です" }, { status: 400 });
    }

    // Check if user already owns an org
    const { data: existingOrg } = await supabase
      .from("organizations")
      .select("id")
      .eq("owner_id", user.id)
      .limit(1)
      .maybeSingle();

    if (existingOrg) {
      return NextResponse.json(
        { error: "既にチームを所有しています" },
        { status: 409 }
      );
    }

    // Create the organization
    const { data: org, error: orgError } = await supabase
      .from("organizations")
      .insert({
        name: orgName,
        owner_id: user.id,
        max_members: memberCount,
      })
      .select("id")
      .single();

    if (orgError || !org) {
      console.error("Org creation error:", orgError);
      return NextResponse.json(
        { error: "チームの作成に失敗しました" },
        { status: 500 }
      );
    }

    // Add the owner as a team member
    const { error: memberError } = await supabase.from("team_members").insert({
      org_id: org.id,
      user_id: user.id,
      role: "owner",
    });
    if (memberError) {
      console.error("Team member insert error:", memberError);
      // Clean up the org since the owner can't be added
      await supabase.from("organizations").delete().eq("id", org.id);
      return NextResponse.json(
        { error: "チームメンバーの追加に失敗しました" },
        { status: 500 }
      );
    }

    // Get user's Stripe customer ID if exists
    const { data: profile } = await supabase
      .from("profiles")
      .select("stripe_customer_id, email")
      .eq("id", user.id)
      .single();

    // Create Stripe checkout session for team plan
    let session, customerId;
    try {
      ({ session, customerId } = await createTeamCheckoutSession({
        orgId: org.id,
        orgName,
        userId: user.id,
        email: profile?.email || user.email!,
        memberCount,
        billing,
        customerId: profile?.stripe_customer_id || undefined,
      }));
    } catch (stripeError) {
      // Clean up orphan org + member if Stripe checkout fails
      console.error("Stripe checkout error, cleaning up org:", stripeError);
      await supabase.from("team_members").delete().eq("org_id", org.id);
      await supabase.from("organizations").delete().eq("id", org.id);
      return NextResponse.json(
        { error: "決済セッションの作成に失敗しました" },
        { status: 500 }
      );
    }

    // Update org with Stripe customer ID
    await supabase
      .from("organizations")
      .update({ stripe_customer_id: customerId })
      .eq("id", org.id);

    // Store the customer ID on the profile too if not already set
    if (!profile?.stripe_customer_id) {
      await supabase
        .from("profiles")
        .update({ stripe_customer_id: customerId })
        .eq("id", user.id);
    }

    return NextResponse.json({ url: session.url, orgId: org.id });
  } catch (error) {
    console.error("Team create error:", error);
    return NextResponse.json(
      { error: "チームの作成に失敗しました" },
      { status: 500 }
    );
  }
}
