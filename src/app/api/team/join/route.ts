import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

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
    const token = body.token?.trim();
    if (!token) {
      return NextResponse.json({ error: "招待トークンが必要です" }, { status: 400 });
    }

    // Find the invitation
    const { data: invitation } = await supabase
      .from("team_invitations")
      .select("id, org_id, email, status, expires_at")
      .eq("token", token)
      .eq("status", "pending")
      .single();

    if (!invitation) {
      return NextResponse.json(
        { error: "招待が見つからないか、既に使用済みまたは期限切れです" },
        { status: 404 }
      );
    }

    // Check expiry
    if (new Date(invitation.expires_at) < new Date()) {
      await supabase
        .from("team_invitations")
        .update({ status: "expired" })
        .eq("id", invitation.id);

      return NextResponse.json({ error: "招待の有効期限が切れています" }, { status: 410 });
    }

    // Verify the user's email matches the invitation (if they have a profile)
    const { data: profile } = await supabase
      .from("profiles")
      .select("email")
      .eq("id", user.id)
      .single();

    if (profile?.email && profile.email.toLowerCase() !== invitation.email.toLowerCase()) {
      return NextResponse.json(
        { error: `この招待は ${invitation.email} 宛てです。該当するアカウントでログインしてください。` },
        { status: 403 }
      );
    }

    // Check if already a member of this org
    const { data: existingMember } = await supabase
      .from("team_members")
      .select("id")
      .eq("org_id", invitation.org_id)
      .eq("user_id", user.id)
      .maybeSingle();

    if (existingMember) {
      // Mark invitation as accepted anyway
      await supabase
        .from("team_invitations")
        .update({ status: "accepted" })
        .eq("id", invitation.id);

      return NextResponse.json({ success: true, alreadyMember: true });
    }

    // Check member count vs limit
    const { data: org } = await supabase
      .from("organizations")
      .select("max_members")
      .eq("id", invitation.org_id)
      .single();

    const { count: memberCount } = await supabase
      .from("team_members")
      .select("id", { count: "exact", head: true })
      .eq("org_id", invitation.org_id);

    if ((memberCount || 0) >= (org?.max_members || 5)) {
      return NextResponse.json(
        { error: "チームのメンバー上限に達しています" },
        { status: 400 }
      );
    }

    // Add user to team
    const { error: joinError } = await supabase
      .from("team_members")
      .insert({
        org_id: invitation.org_id,
        user_id: user.id,
        role: "member",
      });

    if (joinError) {
      console.error("Join error:", joinError);
      return NextResponse.json({ error: "チームへの参加に失敗しました" }, { status: 500 });
    }

    // Mark invitation as accepted
    await supabase
      .from("team_invitations")
      .update({ status: "accepted" })
      .eq("id", invitation.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Team join error:", error);
    return NextResponse.json(
      { error: "チームへの参加に失敗しました" },
      { status: 500 }
    );
  }
}
