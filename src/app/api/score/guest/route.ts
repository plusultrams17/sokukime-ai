import { NextRequest, NextResponse } from "next/server";
import { scoreConversation, generateFallbackScore } from "@/lib/scoring";
import { checkRateLimit } from "@/lib/rate-limit";

/**
 * Guest score API — no auth required.
 * IP-based rate limit: max 5 scores/day (≈ 1-5 full sessions).
 */

function getClientIP(request: NextRequest): string {
  const xff = request.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  const real = request.headers.get("x-real-ip");
  if (real) return real.trim();
  return "unknown";
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIP(request);

    // Burst limit: max 3/min per IP
    const burstLimit = checkRateLimit(`guest-score-burst:${ip}`, 3, 60_000);
    if (!burstLimit.success) {
      return NextResponse.json(
        { error: "リクエストが多すぎます。しばらくお待ちください。" },
        { status: 429, headers: { "Retry-After": String(Math.ceil(burstLimit.resetMs / 1000)) } }
      );
    }

    // Daily limit: max 5 scorings/24h per IP
    const dailyLimit = checkRateLimit(`guest-score-daily:${ip}`, 5, 24 * 60 * 60 * 1000);
    if (!dailyLimit.success) {
      return NextResponse.json(
        {
          error: "guest_daily_limit",
          message: "本日のゲスト採点上限に達しました。無料登録で明日も採点できます。",
        },
        { status: 429 }
      );
    }

    const input = await request.json();

    if (!input.messages || !Array.isArray(input.messages) || input.messages.length < 2) {
      return NextResponse.json({ error: "Invalid messages" }, { status: 400 });
    }

    const result = await scoreConversation(input);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Guest score API error:", error);
    return NextResponse.json(generateFallbackScore());
  }
}
