import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getABTestResults } from "@/lib/ab-test";

/**
 * Admin A/B Test Management API
 *
 * GET  /api/admin/ab-tests?secret=ADMIN_SECRET — List all tests with results
 * POST /api/admin/ab-tests?secret=ADMIN_SECRET — Create a new A/B test
 * PATCH /api/admin/ab-tests?secret=ADMIN_SECRET — End test / declare winner
 */

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

function authorize(request: NextRequest): boolean {
  const authHeader = request.headers.get("authorization");
  return !!authHeader && authHeader === `Bearer ${process.env.ADMIN_SECRET}`;
}

export async function GET(request: NextRequest) {
  if (!authorize(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getSupabase();
  const results = await getABTestResults(supabase);

  return NextResponse.json({ tests: results });
}

export async function POST(request: NextRequest) {
  if (!authorize(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getSupabase();
  const body = await request.json();

  const { test_name, email_type, variants, traffic_split } = body;

  if (!test_name || !email_type || !variants || variants.length < 2) {
    return NextResponse.json(
      { error: "Required: test_name, email_type, variants (2+)" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase.from("ab_tests").insert({
    test_name,
    email_type,
    variants,
    traffic_split: traffic_split || { control: 50, variant: 50 },
    is_active: true,
  }).select().single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ test: data }, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  if (!authorize(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getSupabase();
  const body = await request.json();

  const { test_id, action, winner } = body;

  if (!test_id || !action) {
    return NextResponse.json(
      { error: "Required: test_id, action (end_test | set_winner)" },
      { status: 400 }
    );
  }

  if (action === "end_test") {
    await supabase
      .from("ab_tests")
      .update({ is_active: false, ended_at: new Date().toISOString() })
      .eq("id", test_id);
  } else if (action === "set_winner" && winner) {
    await supabase
      .from("ab_tests")
      .update({ winner, is_active: false, ended_at: new Date().toISOString() })
      .eq("id", test_id);
  }

  return NextResponse.json({ success: true });
}
