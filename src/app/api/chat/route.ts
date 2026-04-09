import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getPersona } from "@/lib/personas";
import { checkRateLimit } from "@/lib/rate-limit";
import OpenAI from "openai";

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

## 絶対に守るルール
- あなたは「お客さん」です。商品を売り込む側ではありません
- 絶対に営業トークをしないでください。「ご提案」「おすすめ」「ご紹介」などの営業側の言い回しは禁止です
- 営業メソッドの解説はしないでください
- あなたから商品のメリットを説明したり、購入を勧めたりしないでください
- 営業マン（ユーザー）の説明を「聞く側」に徹してください
- 自然な会話として返答してください
- 日本語の口語体で話してください
- ペルソナの指示に従って返答の長さ・トーンを調整してください
- 返答は短めに（1〜3文）。お客さんは営業マンほど長く話しません`;

let openaiClient: OpenAI | null = null;
function getOpenAIClient(): OpenAI | null {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;
  if (!openaiClient) {
    openaiClient = new OpenAI({ apiKey });
  }
  return openaiClient;
}

export async function POST(request: NextRequest) {
  try {
    // Auth check: require logged-in user to prevent API abuse
    const supabase = await createClient();
    if (!supabase) {
      return NextResponse.json({ message: getDefaultResponse() }, { status: 200 });
    }
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rl = checkRateLimit(`chat:${user.id}`, 30);
    if (!rl.success) {
      return NextResponse.json(
        { error: "リクエストが多すぎます。しばらくお待ちください。" },
        { status: 429, headers: { "Retry-After": String(Math.ceil(rl.resetMs / 1000)) } }
      );
    }

    // Check daily usage limit (server-side gate)
    const { getUsageStatus } = await import("@/lib/usage");
    const usage = await getUsageStatus(supabase, user.id);
    if (!usage.canStart && usage.plan === "free") {
      return NextResponse.json(
        { error: "本日のロープレ上限に達しました。Proプランで無制限に練習できます。", limitReached: true },
        { status: 403 }
      );
    }

    const { messages, industry, product, difficulty, scene, customerType, productContext, customerContext, lessonFocus } =
      await request.json();

    const client = getOpenAIClient();
    if (!client) {
      return NextResponse.json(
        { message: getDefaultResponse() },
        { status: 200 }
      );
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

    const isBusiness = customerType === "owner" || customerType === "manager" || customerType === "staff";
    const hasCustomIndustry = industry && industry !== customerType;
    const isB2B = isBusiness && hasCustomIndustry;

    const b2bContext = isB2B ? `
## 重要：B2B（法人対法人）シナリオ
- あなたは「${industry}」の事業を運営しているプロの経営者・担当者です
- 営業マンは「${product}」をあなたの事業向けに提案しています
- あなたは「個人として商品を買う」のではなく、「自分の事業のために導入を検討」しています
- あなたの関心事：コスト削減、品質向上、納期、アフターサポート、取引実績、自社ビジネスへのインパクト
- 業界のプロとして専門的な質問をしてください（素人ではありません）
- 「うちの事業に合うか」「利益が出るか」「他社製品と比べてどうか」が判断基準です` : "";

    const productInfo = productContext ? `\n\n## 営業マンの商材の詳細情報\n${productContext}` : "";
    const customerInfo = customerContext ? `\n\n## お客さんのペルソナ詳細\n以下の情報を踏まえてお客さんを演じてください:\n${customerContext}` : "";
    const lessonFocusInfo = lessonFocus ? `\n\n${lessonFocus}` : "";

    const personaInstructions = persona ? `\n\n${persona.systemPromptInstructions}` : "";

    const systemContent = `${SYSTEM_PROMPT}${personaInstructions}
${b2bContext}${productInfo}${customerInfo}${lessonFocusInfo}

## 今回のシナリオ
- お客さんの属性: ${customerTypeMap[customerType] || "個人のお客さん"}
- お客さんの業種/背景: ${industry || "一般的な顧客"}
- 営業シーン: ${sceneMap[scene] || sceneMap.visit}
- 営業マンの商材: ${product}
- お客さんのタイプ: ${persona?.label || "慎重なお客さん"}
${isB2B ? `- 取引タイプ: B2B（法人取引）─ 営業マンの「${product}」を、あなたの「${industry}」事業に導入するかの商談` : `- 取引タイプ: B2C（個人取引）─ 営業マンの「${product}」を個人のお客さんに提案`}`;

    // Convert messages for OpenAI format (system message first)
    const openaiMessages: OpenAI.ChatCompletionMessageParam[] = [
      { role: "system", content: systemContent },
      ...messages.map((m: { role: string; content: string }) => ({
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
    console.error("Chat API error:", error);
    return NextResponse.json(
      { message: "すみません、少々お待ちください...（通信エラー）" },
      { status: 200 }
    );
  }
}

function getDefaultResponse(): string {
  return "あ、はい。どのようなご用件でしょうか？";
}
