import { NextRequest, NextResponse } from "next/server";

const PROMPTS: Record<string, string> = {
  // アプローチ
  needs_phrase:
    "この業種・商材のお客さんが抱える一般的なニーズ・お悩み・問題点を12個挙げてください。また、引き出しフレーズ「___で悩んでいる人が多いですが」の空欄に入る1〜3語のキーワードも提案してください。",

  // ヒアリング
  deepening:
    "この業種・商材の営業において、お客さんの問題を深掘りする「課題深掘りシート」用の質問を5個生成してください。以下の5カテゴリに対応した質問を、この業界に特有の表現で作成してください：①原因（何が原因か）、②いつから（時間軸）、③具体的に（状況・痛みの視覚化）、④問題認識（感情的な気づき）、⑤なぜ（解決しなかった理由）。また、引き出しフレーズの空欄キーワードも提案してください。",

  // プレゼン
  benefit:
    "この業種・商材のセールスポイント（特徴）を、お客さんにとってのメリット（ベネフィット）に変換した例を12個挙げてください。各項目は「○○（特徴）→ だから○○（メリット）」の形式で。",
  comparison:
    "この業種・商材の営業において、競合と比較する際に使える話法・トークポイントを12個挙げてください。自社の優位性を具体的に示せる比較軸と話し方の例で。",

  // クロージング
  social_proof:
    "この業種・商材の営業で使える社会的証明フレーズを12個挙げてください。「多くの方が…」「○○%の方が…」「業界では…」の形式で、信頼性を高める表現にしてください。",
  customer_voice:
    "この業種・商材の営業で使える「お客様の声」引用フレーズを12個挙げてください。「○○様は『…』とおっしゃっていました」のように、実際の商談で引用できる形式で。",
  proposal_pattern:
    "この業種・商材の営業で使えるクロージング提案パターンを12個挙げてください。「ぜひ○○してください」「任せてください」のように、自信を持って言い切る形式のトーク例で。",
  positive_single:
    "この業種・商材の営業で使えるメリット訴求フレーズを12個挙げてください。お客さんが得られる具体的なメリットを1つずつ提示する形式で。",
  positive_triple:
    "この業種・商材の営業で使える段階的メリット訴求を4セット生成してください。各セットは3段階で構成し「メリット1、さらにメリット2、そしてメリット3」と積み上げてください。合計12項目を配列で返してください。",
  motivation:
    "この業種・商材の営業で使える動機づけフレーズを12個挙げてください。前半6個は「積極的欲求」（○○が手に入る・○○できるようになる等のプラス訴求）、後半6個は「消極的欲求」（○○を避けられる・○○の心配がなくなる等のリスク回避訴求）の形式で。",
  urgency:
    "この業種・商材の営業で使える緊急性喚起フレーズを12個挙げてください。お客さんの「今すぐ決めたい」という気持ちを引き出す具体的なトーク例で。",
  urgency_practice:
    "この業種・商材の営業で想定される「お客さんの迷い・先送り発言」とその切り返し例を12個挙げてください。各項目は「客：○○ → 営業：○○」の形式で。",
  negative_single:
    "この業種・商材の営業で使えるリスク提示フレーズを12個挙げてください。決断を先送りすることで起こりうるデメリット・リスクを1つずつ提示する形式で。",
  negative_triple:
    "この業種・商材の営業で使える段階的リスク提示を4セット生成してください。各セットは3段階で構成し「リスク1、さらにリスク2、最終的にはリスク3」と段階的に示してください。合計12項目を配列で返してください。",

  // 反論処理
  objection_list:
    "この業種・商材の営業において、お客さんからよくある反論・断り文句・懸念事項を12個挙げてください。特に「考えます」系の断り文句を中心に、実際の商談で頻出するリアルな表現にしてください。",
  third_party:
    "この業種・商材の営業で使える第三者事例活用フレーズを12個挙げてください。「他のお客様も最初は○○でしたが…」「同業の方で○○というケースがありまして…」の形式で。",
  premise_check:
    "この業種・商材の営業で使える合意確認（前提確認）フレーズを12個挙げてください。商談の最初に取った合意を再確認して決断を促す形式で。「最初にお伝えした通り…」「先ほど○○とおっしゃいましたが…」",
  reframe:
    "この業種・商材の営業で使える視点転換フレーズを12個挙げてください。お客さんの反論や懸念を別の角度から見せ直すトーク例で。「○○という見方もありますが、△△と考えてみてはいかがでしょうか」",
};

export async function POST(request: NextRequest) {
  try {
    const { industry, type, productInfo } = await request.json();

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
      : "各項目は短く簡潔に（20文字以内が理想）";

    const systemPrompt = `あなたは営業のプロフェッショナルであり、業界分析の専門家です。
営業マンが事前準備として使う「ワークシート」の内容を生成してください。

回答ルール:
- ${lengthGuideline}
- その業種のリアルな内容を挙げること
- 一般的・抽象的すぎる表現は避け、具体的にすること
- 必ずJSON形式で回答すること`;

    const detailContext = productInfo
      ? `\n【詳細情報】\n商材名: ${productInfo.productName || "不明"}\nターゲット層: ${productInfo.targetAudience || "不明"}\n主な特徴: ${productInfo.keyFeatures || "不明"}\n価格帯: ${productInfo.priceRange || "不明"}\n競合優位性: ${productInfo.advantages || "不明"}\n課題: ${productInfo.challenges || "不明"}`
      : "";

    const needsPhrase = type === "needs_phrase" || isDeepening;

    const userPrompt = `業種・商材: ${industry}${detailContext}

${PROMPTS[type]}

以下のJSON形式で回答してください:
{
  ${needsPhrase ? '"phraseKeyword": "（引き出しフレーズの空欄に入るキーワード）",' : ""}
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
        max_tokens: 600,
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
