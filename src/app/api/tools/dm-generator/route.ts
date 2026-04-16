import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

// Simple IP-based rate limiting (10 requests/day)
const rateLimitMap = new Map<
  string,
  { count: number; resetAt: number }
>();

function getRateLimit(ip: string): { allowed: boolean } {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (entry && entry.resetAt > now) {
    if (entry.count >= 10) {
      return { allowed: false };
    }
    entry.count++;
  } else {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 24 * 60 * 60 * 1000 });
  }

  return { allowed: true };
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting by IP
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      "unknown";
    const { allowed } = getRateLimit(ip);

    if (!allowed) {
      return NextResponse.json(
        {
          error:
            "本日の生成回数上限(10回)に達しました。明日またお試しください。",
        },
        { status: 429 },
      );
    }

    // Parse body
    const body = await request.json();
    const { targetName, industry, channel, relationship, additionalInfo } =
      body;

    // Validate required fields
    if (!industry || !channel || !relationship) {
      return NextResponse.json(
        { error: "必須項目を入力してください" },
        { status: 400 },
      );
    }

    // Sanitize inputs
    const sanitize = (s: string) =>
      s.replace(/[<>]/g, "").trim().slice(0, 500);

    const safeTargetName = targetName ? sanitize(targetName) : "";
    const safeIndustry = sanitize(industry);
    const safeChannel = sanitize(channel);
    const safeRelationship = sanitize(relationship);
    const safeAdditionalInfo = additionalInfo
      ? sanitize(additionalInfo)
      : "";

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const systemPrompt = `あなたは営業DM文面の専門ライターです。
以下の条件に合わせて、パーソナライズされた営業DM文面を3パターン生成してください。

ルール:
- 各パターンは200-400文字程度
- 自然で押し付けがましくないトーン
- 「成約コーチAI」（AIで営業ロープレ練習ができるアプリ）の紹介を自然に組み込む
- 成約コーチAIのURL: https://seiyaku-coach.vercel.app/
- 「無料で5回お試しできます」という案内を含める
- 各パターンは異なるアプローチ（例: 共感型、価値提案型、質問型）
- 絵文字は使わない
- 「確実に」「絶対に」「必ず」などの断定表現は使わない
- 「即決営業」という表現は使わない。「成約メソッド」を使う
- チャネルの特性に合わせた文体にする（X DMは短め、メールはフォーマル寄り、Instagram DMはカジュアル寄り、LinkedInはビジネス寄り）
- JSON形式で返す: { "patterns": [{ "label": "パターン名", "text": "DM本文" }] }`;

    const userPrompt = `ターゲット名: ${safeTargetName || "未指定"}
業種: ${safeIndustry}
チャネル: ${safeChannel}
関係性: ${safeRelationship}
追加情報: ${safeAdditionalInfo || "なし"}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.8,
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      return NextResponse.json(
        { error: "生成に失敗しました。もう一度お試しください。" },
        { status: 500 },
      );
    }

    const result = JSON.parse(content);
    return NextResponse.json(result);
  } catch (error) {
    console.error("DM generator error:", error);
    return NextResponse.json(
      { error: "生成中にエラーが発生しました。もう一度お試しください。" },
      { status: 500 },
    );
  }
}
