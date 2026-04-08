import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

export async function POST(request: Request) {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    if (!supabaseAdmin) {
      return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
    }

    const { answer } = await request.json();

    if (!answer || typeof answer !== "string") {
      return NextResponse.json({ error: "answer is required" }, { status: 400 });
    }

    const validAnswers = [
      "unlimited",
      "score_detail",
      "ai_advice",
      "price",
      "other",
    ];

    if (!validAnswers.includes(answer)) {
      return NextResponse.json({ error: "invalid answer" }, { status: 400 });
    }

    await supabaseAdmin.from("post_payment_surveys").insert({
      answer,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
