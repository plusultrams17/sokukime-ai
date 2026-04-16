import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * B2B 14日間無料トライアル
 * - CC不要
 * - 最大10アカウント
 * - 全機能利用可能
 */
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
    if (!orgName) {
      return NextResponse.json({ error: "チーム名は必須です" }, { status: 400 });
    }

    // Check if user already owns an org (active or past)
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

    // Rate limit: check if user has used a trial before (via profile flag)
    const { data: profile } = await supabase
      .from("profiles")
      .select("trial_used_at")
      .eq("id", user.id)
      .single();

    if (profile?.trial_used_at) {
      return NextResponse.json(
        { error: "トライアルは1アカウントにつき1回までです" },
        { status: 409 }
      );
    }

    // Trial ends 14 days from now
    const trialEndsAt = new Date();
    trialEndsAt.setDate(trialEndsAt.getDate() + 14);

    // Create the organization with trial
    const { data: org, error: orgError } = await supabase
      .from("organizations")
      .insert({
        name: orgName,
        owner_id: user.id,
        max_members: 10, // Trial: up to 10 accounts
        team_plan_tier: "team_10", // Business tier during trial
        trial_ends_at: trialEndsAt.toISOString(),
      })
      .select("id")
      .single();

    if (orgError || !org) {
      console.error("Trial org creation error:", orgError);
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
      console.error("Trial team member insert error:", memberError);
      await supabase.from("organizations").delete().eq("id", org.id);
      return NextResponse.json(
        { error: "チームメンバーの追加に失敗しました" },
        { status: 500 }
      );
    }

    // Mark trial as used on profile to prevent re-use
    await supabase
      .from("profiles")
      .update({ trial_used_at: new Date().toISOString() })
      .eq("id", user.id);

    return NextResponse.json({
      success: true,
      orgId: org.id,
      trialEndsAt: trialEndsAt.toISOString(),
    });
  } catch (error) {
    console.error("Team trial error:", error);
    return NextResponse.json(
      { error: "トライアルの開始に失敗しました" },
      { status: 500 }
    );
  }
}
