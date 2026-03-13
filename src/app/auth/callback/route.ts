import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const redirect = searchParams.get("redirect") || "/roleplay";

  if (code) {
    const supabase = await createClient();
    await supabase.auth.exchangeCodeForSession(code);

    // Check if first-time user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { count } = await supabase
        .from("usage_records")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id);

      if (!count || count === 0) {
        return NextResponse.redirect(`${origin}/roleplay?welcome=true`);
      }
    }
  }

  return NextResponse.redirect(`${origin}${redirect}`);
}
