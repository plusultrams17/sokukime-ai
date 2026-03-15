import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { EngagementEventType } from "@/lib/engagement";

const VALID_EVENT_TYPES: EngagementEventType[] = [
  "roleplay_start",
  "roleplay_complete",
  "score_view",
  "worksheet_edit",
  "coach_view",
  "login",
  "billing_visit",
  "settings_visit",
];

export async function POST(request: NextRequest) {
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

  const body = await request.json();
  const { eventType, metadata } = body;

  if (!eventType || !VALID_EVENT_TYPES.includes(eventType)) {
    return NextResponse.json({ error: "Invalid event type" }, { status: 400 });
  }

  const { error } = await supabase.from("engagement_events").insert({
    user_id: user.id,
    event_type: eventType,
    metadata: metadata || {},
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ tracked: true });
}
