import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

/**
 * NPS (Net Promoter Score) API
 * Records NPS scores and optional feedback.
 * Uses authenticated user context when available.
 */
export async function POST(request: Request) {
  try {
    const { score, feedback } = await request.json();

    if (typeof score !== "number" || score < 0 || score > 10) {
      return NextResponse.json({ error: "Invalid score" }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ error: "Missing config" }, { status: 500 });
    }

    // Try to get authenticated user
    let userId: string | null = null;
    try {
      const supabase = await createClient();
      if (supabase) {
        const { data: { user } } = await supabase.auth.getUser();
        userId = user?.id || null;
      }
    } catch { /* anonymous submission OK */ }

    const admin = createAdminClient(supabaseUrl, supabaseServiceKey);

    await admin.from("nps_responses").insert({
      user_id: userId,
      score,
      feedback: feedback || null,
      category: score <= 6 ? "detractor" : score <= 8 ? "passive" : "promoter",
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
