import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const PROMPTS: Record<string, string> = {
  needs:
    "この業種・商材のお客さんが抱える一般的なニーズ・お悩み・問題点を12個挙げてください。また、引き出しフレーズ「___で悩んでいる人が多いですが」の空欄に入る1〜3語のキーワードも提案してください。",
  strengths:
    "この業種・商材を提供する企業がアピールすべき強み・特徴・セールスポイントを12個挙げてください。お客さんに刺さる具体的な表現にしてください。",
  competitors:
    "この業種・商材において、お客さんが競合他社と比較する際に気にするポイント・判断基準を12個挙げてください。営業マンが事前に把握すべき比較軸です。",
  objections:
    "この業種・商材の営業において、お客さんからよくある反論・断り文句・懸念事項を12個挙げてください。実際の商談で頻出するリアルな表現にしてください。",
  deepening:
    "この業種・商材の営業において、お客さんの問題を深掘りする「具体化シート」用の質問を5個生成してください。以下の5カテゴリに対応した質問を、この業界に特有の表現で作成してください：①原因（何が原因か）、②いつから（時間軸）、③具体的に（状況・痛みの視覚化）、④問題認識（感情的な気づき）、⑤なぜ（解決しなかった理由）。また、引き出しフレーズの空欄キーワードも提案してください。",
};

export async function POST(request: NextRequest) {
  try {
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

    const { industry, type } = await request.json();

    if (!industry || !type || !PROMPTS[type]) {
      return NextResponse.json(
        { error: "industry and valid type are required" },
        { status: 400 },
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "OpenAI API key not configured" },
        { status: 500 },
      );
    }

    const isDeepening = type === "deepening";
    const itemCount = isDeepening ? 5 : 12;
    const lengthGuideline = isDeepening
      ? "各項目は自然な会話調の質問文で（30文字程度）"
      : "各項目は短く簡潔に（15文字以内が理想）";

    const systemPrompt = `あなたは即決営業のプロフェッショナルであり、業界分析の専門家です。
営業マンが事前準備として使う「ワークシート」の内容を生成してください。

回答ルール:
- ${lengthGuideline}
- その業種のリアルな内容を挙げること
- 一般的・抽象的すぎる表現は避け、具体的にすること
- 必ずJSON形式で回答すること`;

    const userPrompt = `業種・商材: ${industry}

${PROMPTS[type]}

以下のJSON形式で回答してください:
{
  ${type === "needs" || isDeepening ? '"phraseKeyword": "（引き出しフレーズの空欄に入るキーワード）",' : ""}
  "items": ["項目1", "項目2", ..., "項目${itemCount}"]
}

JSONのみを返してください。説明文は不要です。`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        max_tokens: 500,
        temperature: 0.7,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      console.error("OpenAI API error:", await response.text());
      return NextResponse.json(
        { error: "AI generation failed" },
        { status: 500 },
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";

    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json(
        { error: "Invalid AI response" },
        { status: 500 },
      );
    }

    const parsed = JSON.parse(jsonMatch[0]);
    const items = (parsed.items || []).slice(0, itemCount);

    return NextResponse.json({
      phraseKeyword: parsed.phraseKeyword || "",
      items,
    });
  } catch (error) {
    console.error("Worksheet API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
