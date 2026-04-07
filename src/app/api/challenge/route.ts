import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";
import { getChallenge } from "@/lib/challenges";
import Anthropic from "@anthropic-ai/sdk";

let anthropicClient: Anthropic | null = null;
function getAnthropicClient(): Anthropic | null {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;
  if (!anthropicClient) anthropicClient = new Anthropic({ apiKey });
  return anthropicClient;
}

function getClientIP(request: NextRequest): string {
  const xff = request.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIP(request);
    const rl = checkRateLimit(`challenge:${ip}`, 10, 60 * 60 * 1000);
    if (!rl.success) {
      return NextResponse.json(
        { error: "リクエストが多すぎます。しばらくお待ちください。" },
        { status: 429 }
      );
    }

    const { challengeId, response, timeUsed } = await request.json();

    const challenge = getChallenge(challengeId);
    if (!challenge) {
      return NextResponse.json(
        { error: "チャレンジが見つかりません" },
        { status: 400 }
      );
    }

    if (!response || typeof response !== "string" || response.length < 2) {
      return NextResponse.json(
        { error: "返答を入力してください" },
        { status: 400 }
      );
    }

    const client = getAnthropicClient();
    if (!client) {
      return NextResponse.json({
        score: 50,
        feedback: "採点サービスが一時的に利用できません。",
        modelAnswer: "",
        techniques: challenge.idealTechniques.map((t) => ({
          name: t,
          detected: false,
        })),
      });
    }

    const result = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1500,
      temperature: 0,
      system: `あなたは営業スキルの採点AIです。営業ロープレの「切り返し」を採点します。
厳格かつ具体的にフィードバックしてください。

採点基準:
- 共感（相手の気持ちを受け止めているか）
- 論理性（根拠を持った切り返しができているか）
- テクニック（成約メソッドの型を使えているか）
- 自信（言い切りで提案できているか、NGワード不使用）

NGワード: 「どうされますか？」「思います」「いかがでしょうか」（使用-10点）

JSON形式のみで返答してください:
{
  "score": 0-100の整数,
  "feedback": "200文字程度の具体的フィードバック",
  "modelAnswer": "この場面での模範的な切り返しトーク（150-200文字）",
  "techniques": [
    {"name": "テクニック名", "detected": true/false},
    ...
  ]
}`,
      messages: [
        {
          role: "user",
          content: `以下の営業シーンでの切り返しを採点してください。

【シーン】${challenge.context}
【商材】${challenge.product}
【お客さん】${challenge.industry}
【お客さんの発言】「${challenge.customerLine}」

【理想のテクニック】${challenge.idealTechniques.join("、")}

【営業マンの返答】
${response}

【使用時間】${timeUsed}秒

上記をJSON形式で採点してください。`,
        },
      ],
    });

    const text =
      result.content[0]?.type === "text" ? result.content[0].text : "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);

    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return NextResponse.json(parsed);
    }

    return NextResponse.json({
      score: 50,
      feedback: "採点結果を解析できませんでした。もう一度お試しください。",
      modelAnswer: "",
      techniques: challenge.idealTechniques.map((t) => ({
        name: t,
        detected: false,
      })),
    });
  } catch (error) {
    console.error("Challenge API error:", error);
    return NextResponse.json({
      score: 40,
      feedback: "採点中にエラーが発生しました。",
      modelAnswer: "",
      techniques: [],
    });
  }
}
