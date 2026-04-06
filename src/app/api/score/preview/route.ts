import { NextRequest, NextResponse } from "next/server";
import { scoreConversation, generateFallbackScore } from "@/lib/scoring";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  // IPベースのレート制限（1分あたり5回）
  const ip = request.headers.get("x-forwarded-for") || "unknown";
  const rl = checkRateLimit(`score-preview:${ip}`, 5);
  if (!rl.success) {
    return NextResponse.json(
      { error: "リクエストが多すぎます。しばらくお待ちください。" },
      { status: 429 }
    );
  }

  try {
    const input = await request.json();

    if (!input.messages || !Array.isArray(input.messages) || input.messages.length < 2) {
      return NextResponse.json({ error: "Invalid messages" }, { status: 400 });
    }

    const result = await scoreConversation(input);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Score preview API error:", error);
    return NextResponse.json(generateFallbackScore());
  }
}
