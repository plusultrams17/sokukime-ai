import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getReferralStats } from "@/lib/referral";

export async function GET() {
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

  const stats = await getReferralStats(supabase, user.id);
  return NextResponse.json(stats);
}
