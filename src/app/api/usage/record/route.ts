import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getUsageStatus, recordUsage } from "@/lib/usage";

export async function POST() {
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

  // Check usage limit before recording
  const status = await getUsageStatus(supabase, user.id);
  if (!status.canStart) {
    return NextResponse.json(
      {
        error: "本日のロープレ上限に達しました",
        ...status,
      },
      { status: 403 }
    );
  }

  await recordUsage(supabase, user.id);

  const updatedStatus = await getUsageStatus(supabase, user.id);
  return NextResponse.json(updatedStatus);
}
