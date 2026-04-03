import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    if (!supabase) {
      return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find user's org
    const { data: membership } = await supabase
      .from("team_members")
      .select("org_id, role")
      .eq("user_id", user.id)
      .limit(1)
      .maybeSingle();

    if (!membership) {
      return NextResponse.json({ error: "チームに所属していません" }, { status: 404 });
    }

    // Get org info
    const { data: org } = await supabase
      .from("organizations")
      .select("id, name, max_members, stripe_subscription_id, created_at")
      .eq("id", membership.org_id)
      .single();

    // Get all members
    const { data: members } = await supabase
      .from("team_members")
      .select(`
        id,
        user_id,
        role,
        joined_at
      `)
      .eq("org_id", membership.org_id)
      .order("joined_at", { ascending: true });

    // Get member profiles (email)
    const memberUserIds = (members || []).map((m) => m.user_id);
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, email")
      .in("id", memberUserIds);

    const profileMap = new Map((profiles || []).map((p) => [p.id, p]));

    const enrichedMembers = (members || []).map((m) => ({
      id: m.id,
      userId: m.user_id,
      email: profileMap.get(m.user_id)?.email || "",
      role: m.role,
      joinedAt: m.joined_at,
    }));

    // Get pending invitations
    const { data: invitations } = await supabase
      .from("team_invitations")
      .select("id, email, status, created_at, expires_at")
      .eq("org_id", membership.org_id)
      .eq("status", "pending")
      .order("created_at", { ascending: false });

    return NextResponse.json({
      org: {
        id: org?.id,
        name: org?.name,
        maxMembers: org?.max_members,
        hasSubscription: !!org?.stripe_subscription_id,
        createdAt: org?.created_at,
      },
      members: enrichedMembers,
      invitations: invitations || [],
      currentUserRole: membership.role,
    });
  } catch (error) {
    console.error("Team members error:", error);
    return NextResponse.json(
      { error: "チーム情報の取得に失敗しました" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();
    if (!supabase) {
      return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const memberId = searchParams.get("memberId");
    const invitationId = searchParams.get("invitationId");

    // Find user's org where they are owner or admin
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

    // Delete a member
    if (memberId) {
      // Cannot remove the owner
      const { data: targetMember } = await supabase
        .from("team_members")
        .select("role, user_id")
        .eq("id", memberId)
        .eq("org_id", membership.org_id)
        .single();

      if (!targetMember) {
        return NextResponse.json({ error: "メンバーが見つかりません" }, { status: 404 });
      }

      if (targetMember.role === "owner") {
        return NextResponse.json({ error: "オーナーは削除できません" }, { status: 400 });
      }

      await supabase
        .from("team_members")
        .delete()
        .eq("id", memberId)
        .eq("org_id", membership.org_id);

      return NextResponse.json({ success: true });
    }

    // Cancel an invitation
    if (invitationId) {
      await supabase
        .from("team_invitations")
        .update({ status: "expired" })
        .eq("id", invitationId)
        .eq("org_id", membership.org_id);

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "memberId or invitationId is required" }, { status: 400 });
  } catch (error) {
    console.error("Team member delete error:", error);
    return NextResponse.json(
      { error: "操作に失敗しました" },
      { status: 500 }
    );
  }
}
