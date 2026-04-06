import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const TOTAL_SLOTS = 30;

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function GET() {
  try {
    const supabaseAdmin = getSupabaseAdmin();

    const { count, error } = await supabaseAdmin
      .from("program_purchases")
      .select("id", { count: "exact", head: true })
      .eq("status", "completed");

    if (error) {
      console.error("Failed to count program purchases:", error);
      return NextResponse.json(
        { error: "Failed to fetch remaining slots" },
        { status: 500 }
      );
    }

    const sold = count || 0;
    const remaining = Math.max(TOTAL_SLOTS - sold, 0);

    return NextResponse.json({
      remaining,
      total: TOTAL_SLOTS,
      sold,
    });
  } catch (err) {
    console.error("Program remaining API error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
