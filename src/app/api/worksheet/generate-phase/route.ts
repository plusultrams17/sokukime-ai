import { NextRequest, NextResponse } from "next/server";

const PHASE_PROMPTS: Record<number, string> = {
  0: `以下の業種の営業マンが使える「信頼構築シート」の内容を生成してください。

生成する内容：
1. 褒めポイント3つ（praise1: 外見・雰囲気、praise2: 会社・店舗、praise3: 実績・評判）
2. 前提設定スクリプト（premise: 「良ければご検討、合わなければお断りOK」の事前合意文）
3. 上記を組み合わせたトーク例文（preview: 挨拶→褒め→前提設定の流れ）

JSON形式で返してください：
{ "praise1": "...", "praise2": "...", "praise3": "...", "premise": "...", "preview": "..." }`,

  1: `以下の業種の営業マンが使える「課題発掘シート」の内容を生成してください。

生成する内容：
1. 想定されるお客様のニーズ3つ（need1, need2, need3）
2. 深掘り質問5つ：
   - cause: 原因を探る質問
   - since: いつからか時間軸を確認する質問
   - concrete: 具体的な影響を引き出す質問
   - neglect: 放置した場合の結末を考えさせる質問
   - feeling: 感情を引き出す質問
3. ニーズと深掘り質問を組み合わせたヒアリングスクリプト例（preview）

JSON形式で返してください：
{ "need1": "...", "need2": "...", "need3": "...", "cause": "...", "since": "...", "concrete": "...", "neglect": "...", "feeling": "...", "preview": "..." }`,

  2: `以下の業種の営業マンが使える「価値提案シート」の内容を生成してください。

生成する内容：
1. セールスポイント→ベネフィット変換3組
   - feature1→benefit1, feature2→benefit2, feature3→benefit3
2. 競合比較1セット
   - compCompetitor: 他社の弱み
   - compOurs: 自社の強み
   - compBenefit: だからお客様のメリット
3. プレゼントーク例（preview: SP→ベネフィット変換と比較を組み込んだトーク）

JSON形式で返してください：
{ "feature1": "...", "benefit1": "...", "feature2": "...", "benefit2": "...", "feature3": "...", "benefit3": "...", "compCompetitor": "...", "compOurs": "...", "compBenefit": "...", "preview": "..." }`,

  3: `以下の業種の営業マンが使える「クロージングシート」の内容を生成してください。

生成する内容：
1. お客様の声2つ（voice1, voice2: 実際に言われそうなポジティブな感想）
2. 社会的証明（socialProof: 「多くの方が…」「○○%の方が…」形式）
3. 今やるべき論理的理由（reason: なぜ今決断すべきか）
4. 訴求フレーズ（appealPhrase: お客様の声+社会的証明+理由を組み合わせたクロージング文）
5. 完成されたクロージングトーク例（preview）

JSON形式で返してください：
{ "voice1": "...", "voice2": "...", "socialProof": "...", "reason": "...", "appealPhrase": "...", "preview": "..." }`,

  4: `以下の業種の営業マンが使える「反論処理シート」の内容を生成してください。

4大反論パターンとその切り返しを生成：
1. 意思決定の壁（obj1Script: お客さんのセリフ、obj1Response: 切り返しトーク）
2. 比較検討（obj2Script, obj2Response）
3. 予算の壁（obj3Script, obj3Response）
4. タイミングの壁（obj4Script, obj4Response）
5. 4つの切り返しを組み合わせた反論処理フロー例（preview）

JSON形式で返してください：
{ "obj1Script": "...", "obj1Response": "...", "obj2Script": "...", "obj2Response": "...", "obj3Script": "...", "obj3Response": "...", "obj4Script": "...", "obj4Response": "...", "preview": "..." }`,
};

export async function POST(request: NextRequest) {
  try {
    const { industry, phase, productInfo } = await request.json();

    if (!industry || phase === undefined || !PHASE_PROMPTS[phase]) {
      return NextResponse.json(
        { error: "industry and valid phase (0-4) are required" },
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

    const detailContext = productInfo
      ? `\n【詳細情報】\n商材名: ${productInfo.productName || "不明"}\nターゲット層: ${productInfo.targetAudience || "不明"}\n主な特徴: ${productInfo.keyFeatures || "不明"}\n価格帯: ${productInfo.priceRange || "不明"}\n競合優位性: ${productInfo.advantages || "不明"}\n課題: ${productInfo.challenges || "不明"}`
      : "";

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        max_tokens: 800,
        temperature: 0.7,
        messages: [
          {
            role: "system",
            content: `あなたは営業のプロフェッショナルです。営業準備ワークシートの内容を生成してください。
- 各項目は具体的でリアルな内容にしてください
- その業種ならではの表現を使ってください
- previewはそのまま商談で使えるトーク例にしてください（100〜150文字）
- 必ず指定されたJSON形式で返してください
- JSON以外のテキストは出力しないでください`,
          },
          {
            role: "user",
            content: `業種・商材: ${industry}${detailContext}\n\n${PHASE_PROMPTS[phase]}`,
          },
        ],
      }),
    });

    if (!response.ok) {
      console.error("OpenAI API error:", await response.text());
      return NextResponse.json({ error: "AI generation failed" }, { status: 500 });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";
    const jsonMatch = content.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      return NextResponse.json({ error: "Invalid AI response" }, { status: 500 });
    }

    return NextResponse.json(JSON.parse(jsonMatch[0]));
  } catch (error) {
    console.error("Phase generation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
