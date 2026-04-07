import { NextRequest, NextResponse } from "next/server";
import { getPersona } from "@/lib/personas";
import { checkRateLimit } from "@/lib/rate-limit";
import OpenAI from "openai";

/**
 * Guest chat API — no auth required.
 * Rate-limited per IP: max ~30 turns/day (sliding 24h window).
 * Also short-burst limited to 15/min per IP to prevent spam.
 */

const SYSTEM_PROMPT = `あなたは営業ロープレ用の「お客さん役」AIです。
ユーザーが営業マンとして商談の練習をしています。以下のルールに従ってリアルなお客さんを演じてください。

## あなたの役割
- 業種や商材に合わせた、リアルなお客さんとして自然に会話する
- お客さんの名前、会社名、状況は自然に設定してください
- 営業マン（ユーザー）が最初に声をかけてきます。その内容・場面設定に合わせて自然に反応してください
- 営業マンがどの場面（入り口での挨拶、電話の第一声、商談途中など）から始めても、そのシチュエーションに合わせて対応してください

## 会話のリアルさ
- 一般的な顧客の心理を再現する：最初は警戒、徐々に関心、悩み、決断という流れ
- 営業マンの「ゴール共有」「褒め」がうまければ心を開く
- ヒアリングで深い問題を引き出されたら、本音を話し始める
- クロージングで提案されたら、悩む様子を見せる

## 重要
- あなたは「お客さん」です。営業のアドバイスは絶対にしないでください
- 営業メソッドの解説はしないでください
- 自然な会話として返答してください
- 日本語の口語体で話してください
- ペルソナの指示に従って返答の長さ・トーンを調整してください`;

let openaiClient: OpenAI | null = null;
function getOpenAIClient(): OpenAI | null {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;
  if (!openaiClient) {
    openaiClient = new OpenAI({ apiKey });
  }
  return openaiClient;
}

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

    // Short-burst limit: max 15 messages/min per IP
    const burstLimit = checkRateLimit(`guest-chat-burst:${ip}`, 15, 60_000);
    if (!burstLimit.success) {
      return NextResponse.json(
        { error: "リクエストが多すぎます。しばらくお待ちください。" },
        { status: 429, headers: { "Retry-After": String(Math.ceil(burstLimit.resetMs / 1000)) } }
      );
    }

    // Daily limit: max 30 messages/24h per IP (≈ 3 full sessions)
    const dailyLimit = checkRateLimit(`guest-chat-daily:${ip}`, 30, 24 * 60 * 60 * 1000);
    if (!dailyLimit.success) {
      return NextResponse.json(
        {
          error: "guest_daily_limit",
          message: "本日のゲスト体験回数の上限に達しました。無料登録で明日も続けてロープレできます。",
        },
        { status: 429 }
      );
    }

    const { messages, industry, product, difficulty, scene, customerType, productContext, customerContext, lessonFocus } =
      await request.json();

    const client = getOpenAIClient();
    if (!client) {
      return NextResponse.json({ message: getDefaultResponse() }, { status: 200 });
    }

    const persona = getPersona(difficulty);

    const sceneMap: Record<string, string> = {
      phone: "電話での商談（営業マンが電話をかけてきた）",
      visit: "訪問営業（営業マンが自分の会社/自宅に来た）",
      inbound: "問い合わせ対応（自分から問い合わせた）",
    };

    const customerTypeMap: Record<string, string> = {
      individual: "個人のお客さん（一般消費者）",
      owner: "会社オーナー・社長",
      manager: "部長・課長クラスの決裁者",
      staff: "担当者・一般社員（上に確認が必要）",
    };

    const productInfo = productContext ? `\n\n## 営業マンの商材の詳細情報\n${productContext}` : "";
    const customerInfo = customerContext
      ? `\n\n## お客さんのペルソナ詳細\n以下の情報を踏まえてお客さんを演じてください:\n${customerContext}`
      : "";
    const lessonFocusInfo = lessonFocus ? `\n\n${lessonFocus}` : "";

    const personaInstructions = persona ? `\n\n${persona.systemPromptInstructions}` : "";

    const systemContent = `${SYSTEM_PROMPT}${personaInstructions}${productInfo}${customerInfo}${lessonFocusInfo}

## 今回のシナリオ
- お客さんの属性: ${customerTypeMap[customerType] || "個人のお客さん"}
- お客さんの業種/背景: ${industry || "一般的な顧客"}
- 営業シーン: ${sceneMap[scene] || sceneMap.visit}
- 営業マンの商材: ${product}
- お客さんのタイプ: ${persona?.label || "慎重なお客さん"}`;

    const openaiMessages: OpenAI.ChatCompletionMessageParam[] = [
      { role: "system", content: systemContent },
      ...(messages as { role: string; content: string }[]).map((m) => ({
        role: m.role === "assistant" ? ("assistant" as const) : ("user" as const),
        content: m.content,
      })),
    ];

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      max_tokens: 300,
      messages: openaiMessages,
    });

    const assistantMessage =
      response.choices[0]?.message?.content ?? getDefaultResponse();

    return NextResponse.json({ message: assistantMessage });
  } catch (error) {
    console.error("Guest chat API error:", error);
    return NextResponse.json(
      { message: "すみません、少々お待ちください...（通信エラー）" },
      { status: 200 }
    );
  }
}

function getDefaultResponse(): string {
  return "あ、はい。どのようなご用件でしょうか？";
}
