import { NextRequest, NextResponse } from "next/server";
import { scoreConversation, generateFallbackScore } from "@/lib/scoring";

export async function POST(request: NextRequest) {
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
