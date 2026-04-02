import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

/**
 * Lead capture API — stores email from free tools.
 * Reuses beta_signups table for all lead capture sources.
 */
export async function POST(request: Request) {
  try {
    const { email, source } = await request.json();

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ error: "Missing config" }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { error } = await supabase.from("beta_signups").insert({
      email: email.toLowerCase().trim(),
    });

    if (error) {
      if (error.code === "23505") {
        // Duplicate email — still treat as success
        return NextResponse.json({ ok: true, alreadyExists: true });
      }
      console.error("Lead capture error:", error);
      return NextResponse.json({ error: "Failed to save" }, { status: 500 });
    }

    // Track GA4 event server-side if available
    const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
    const apiSecret = process.env.GA4_MEASUREMENT_PROTOCOL_SECRET;
    if (measurementId && apiSecret) {
      fetch(
        `https://www.google-analytics.com/mp/collect?measurement_id=${measurementId}&api_secret=${apiSecret}`,
        {
          method: "POST",
          body: JSON.stringify({
            client_id: "server",
            events: [{ name: "lead_capture", params: { source: source || "unknown" } }],
          }),
        }
      ).catch(() => {});
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
