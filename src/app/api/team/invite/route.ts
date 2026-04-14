import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import crypto from "crypto";

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
    const email = body.email?.trim()?.toLowerCase();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "有効なメールアドレスを入力してください" }, { status: 400 });
    }

    // Find the user's org where they are owner or admin
    const { data: membership } = await supabase
      .from("team_members")
      .select("org_id, role")
      .eq("user_id", user.id)
      .in("role", ["owner", "admin"])
      .limit(1)
      .maybeSingle();

    if (!membership) {
      return NextResponse.json({ error: "チーム管理権限がありません" }, { status: 403 });
    }

    const orgId = membership.org_id;

    // Check org has active subscription
    const { data: org } = await supabase
      .from("organizations")
      .select("id, max_members, stripe_subscription_id")
      .eq("id", orgId)
      .single();

    if (!org?.stripe_subscription_id) {
      return NextResponse.json(
        { error: "チームプランのサブスクリプションが有効ではありません" },
        { status: 402 }
      );
    }

    // Check member count vs limit
    const { count: memberCount } = await supabase
      .from("team_members")
      .select("id", { count: "exact", head: true })
      .eq("org_id", orgId);

    const { count: pendingCount } = await supabase
      .from("team_invitations")
      .select("id", { count: "exact", head: true })
      .eq("org_id", orgId)
      .eq("status", "pending");

    const totalSlots = (memberCount || 0) + (pendingCount || 0);
    if (totalSlots >= org.max_members) {
      return NextResponse.json(
        { error: `チームの上限（${org.max_members}名）に達しています` },
        { status: 400 }
      );
    }

    // Check if already a member
    const { data: existingMember } = await supabase
      .from("team_members")
      .select("id")
      .eq("org_id", orgId)
      .eq("user_id", (
        await supabase.from("profiles").select("id").eq("email", email).maybeSingle()
      ).data?.id || "00000000-0000-0000-0000-000000000000")
      .maybeSingle();

    if (existingMember) {
      return NextResponse.json({ error: "既にチームメンバーです" }, { status: 409 });
    }

    // Check for existing pending invitation
    const { data: existingInvite } = await supabase
      .from("team_invitations")
      .select("id")
      .eq("org_id", orgId)
      .eq("email", email)
      .eq("status", "pending")
      .maybeSingle();

    if (existingInvite) {
      return NextResponse.json({ error: "既に招待を送信済みです" }, { status: 409 });
    }

    // Generate invitation token
    const token = crypto.randomBytes(32).toString("hex");

    const { error: inviteError } = await supabase
      .from("team_invitations")
      .insert({
        org_id: orgId,
        email,
        token,
        invited_by: user.id,
      });

    if (inviteError) {
      console.error("Invite error:", inviteError);
      return NextResponse.json({ error: "招待の作成に失敗しました" }, { status: 500 });
    }

    const inviteUrl = `${process.env.NEXT_PUBLIC_APP_URL}/team/invite/${token}`;

    return NextResponse.json({
      success: true,
      inviteUrl,
      token,
    });
  } catch (error) {
    console.error("Team invite error:", error);
    return NextResponse.json(
      { error: "招待の送信に失敗しました" },
      { status: 500 }
    );
  }
}
