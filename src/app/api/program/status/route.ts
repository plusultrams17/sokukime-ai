import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getPurchaseStatus } from "@/lib/lessons/access";

// Force dynamic — no caching at edge/CDN
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json(
      { purchased: false, tier: null, authenticated: false },
      { status: 200 },
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({
      purchased: false,
      tier: null,
      authenticated: false,
    });
  }

  // Unified access check: program_purchases OR active Pro subscription OR tester
  const { purchased, tier } = await getPurchaseStatus(supabase);

  return NextResponse.json({
    purchased,
    tier,
    authenticated: true,
  });
}
