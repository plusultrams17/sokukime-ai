import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const BETA_LIMIT = 100;

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function GET() {
  const supabase = getSupabaseAdmin();

  const { count, error } = await supabase
    .from("beta_signups")
    .select("*", { count: "exact", head: true });

  if (error) {
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }

  return NextResponse.json({
    total: BETA_LIMIT,
    registered: count ?? 0,
    remaining: BETA_LIMIT - (count ?? 0),
  });
}

export async function POST(req: NextRequest) {
  const supabase = getSupabaseAdmin();

  let body: { email?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }

  const { email } = body;

  if (!email || typeof email !== "string") {
    return NextResponse.json(
      { error: "メールアドレスを入力してください" },
      { status: 400 }
    );
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return NextResponse.json(
      { error: "有効なメールアドレスを入力してください" },
      { status: 400 }
    );
  }

  const { count } = await supabase
    .from("beta_signups")
    .select("*", { count: "exact", head: true });

  if ((count ?? 0) >= BETA_LIMIT) {
    return NextResponse.json(
      {
        error:
          "申し訳ございません。ベータテスターの募集枠が定員に達しました。",
      },
      { status: 409 }
    );
  }

  const { error } = await supabase
    .from("beta_signups")
    .insert({ email: email.toLowerCase().trim() });

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json(
        { error: "このメールアドレスは既に登録されています" },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { count: newCount } = await supabase
    .from("beta_signups")
    .select("*", { count: "exact", head: true });

  return NextResponse.json({
    success: true,
    remaining: BETA_LIMIT - (newCount ?? 0),
  });
}
