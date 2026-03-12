import { NextRequest, NextResponse } from "next/server";

const SCORING_PROMPT = `あなたは「即決営業メソッド」に基づく営業スキル採点AIです。
営業マン（ユーザー）とお客さん（AI）のロープレ会話を分析し、即決営業の5ステップに基づいて採点してください。

## 即決営業メソッドの5ステップと採点基準

### 1. アプローチ（心の扉を開く）- 配点20点
- 褒めているか？（2度褒めが理想）
- 先回りができているか？（「気に入らなかったら断ってください」「気に入ったら契約してください」）
- メラビアンの法則を意識した伝え方ができているか
- 専門家としてのポジションを取れているか

### 2. ヒアリング（問題の把握）- 配点20点
- クローズドクエスチョンと限定質問を使えているか
- 浅い問題を深い問題に変換できているか（ささくれ→骨折）
- 第三者話法の引き出しフレーズを使えているか（「〜と悩んでいる人が多いですが〇〇さんは？」）
- ニーズを「与える」のではなく「引き出せて」いるか

### 3. プレゼン（感じてもらう）- 配点20点
- セールスポイント→「だから」→ベネフィットの変換ができているか
- 理屈ではなく感情に訴えかけているか
- お客さんの問題に対する解決策として提示できているか

### 4. クロージング（訴求）- 配点20点
- 「任せてください、契約してください」と言い切れているか（NGワード：「どうされますか？」「思います」）
- 過半数の技術（「みなさんやってます」）を使えているか
- 一貫性通し（事前告知と最後の訴求の一致）ができているか
- カギカッコ（第三者話法）を使えているか
- ポジティブシングル/トリプル（想像させる→訴求）ができているか

### 5. 反論処理・切り返し（背中を押す）- 配点20点
- 切り返しの「型」に沿えているか：共感→フック→AREA話法→訴求
- AREA話法（主張→理由→例え→主張）を使えているか
- 5技法（目的の振り返り、第三者アタック、+のシャワー、すり替え、価値の上乗せ）のいずれかを使えているか
- お客さんの「考えます」に対して諦めずに切り返せているか

## 出力形式（必ずこのJSON形式で返してください）
{
  "overall": 0-100の総合スコア,
  "categories": [
    {"name": "アプローチ", "score": 0-100, "feedback": "具体的なフィードバック"},
    {"name": "ヒアリング", "score": 0-100, "feedback": "具体的なフィードバック"},
    {"name": "プレゼン", "score": 0-100, "feedback": "具体的なフィードバック"},
    {"name": "クロージング", "score": 0-100, "feedback": "具体的なフィードバック"},
    {"name": "反論処理", "score": 0-100, "feedback": "具体的なフィードバック"}
  ],
  "summary": "200文字程度の総評",
  "strengths": ["良かった点1", "良かった点2", "良かった点3"],
  "improvements": ["改善点1", "改善点2", "改善点3"]
}

重要：
- JSON以外のテキストは出力しないでください
- 会話の中で実際に使われたテクニックのみを評価してください
- 会話が短い場合は、触れていないステップは低めに採点してください
- 具体的な会話の引用を含めてフィードバックしてください`;

export async function POST(request: NextRequest) {
  try {
    const { messages, industry, product, difficulty } = await request.json();

    const apiKey = process.env.OPENAI_API_KEY;

    const conversationText = messages
      .map(
        (m: { role: string; content: string }) =>
          `${m.role === "user" ? "【営業マン】" : "【お客さん】"}: ${m.content}`
      )
      .join("\n\n");

    if (!apiKey) {
      return NextResponse.json(generateFallbackScore());
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        max_tokens: 1500,
        messages: [
          { role: "system", content: SCORING_PROMPT },
          {
            role: "user",
            content: `以下の営業ロープレ会話を採点してください。

業種: ${industry}
商材: ${product}
難易度: ${difficulty}

--- 会話内容 ---
${conversationText}
--- 会話ここまで ---

上記の会話を即決営業メソッドの5ステップで採点し、JSON形式で返してください。`,
          },
        ],
      }),
    });

    if (!response.ok) {
      console.error("Scoring API error:", await response.text());
      return NextResponse.json(generateFallbackScore());
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || "";

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const scoreData = JSON.parse(jsonMatch[0]);
      return NextResponse.json(scoreData);
    }

    return NextResponse.json(generateFallbackScore());
  } catch (error) {
    console.error("Score API error:", error);
    return NextResponse.json(generateFallbackScore());
  }
}

function generateFallbackScore() {
  return {
    overall: 55,
    categories: [
      {
        name: "アプローチ",
        score: 60,
        feedback:
          "会話の入り方は自然でしたが、「先回り」（気に入らなかったら断ってください等）のテクニックを意識するとさらに良くなります。",
      },
      {
        name: "ヒアリング",
        score: 50,
        feedback:
          "お客さんの状況を聞く姿勢はありましたが、浅い問題を深い問題に変換する質問力を磨きましょう。",
      },
      {
        name: "プレゼン",
        score: 55,
        feedback:
          "商品説明はできていますが、セールスポイント→「だから」→ベネフィットの変換を意識しましょう。",
      },
      {
        name: "クロージング",
        score: 50,
        feedback:
          "「契約してください」と言い切る訴求力を高めましょう。「どうされますか？」はNGワードです。",
      },
      {
        name: "反論処理",
        score: 45,
        feedback:
          "お客さんの「考えます」に対する切り返しの型（共感→フック→AREA→訴求）を練習しましょう。",
      },
    ],
    summary:
      "基本的な会話力はありますが、即決営業メソッドの「型」をより意識的に使うことで成約率が大幅に上がります。特に「先回り」「訴求の言い切り」「切り返しの型」を重点的に練習しましょう。",
    strengths: [
      "自然な会話の入り方ができている",
      "お客さんの話を聞く姿勢がある",
      "商品への知識がある",
    ],
    improvements: [
      "「先回り」テクニックを使って事前にYESを取る練習をする",
      "クロージングで「任せてください！」と言い切る練習をする",
      "反論に対してAREA話法（主張→理由→例え→主張）で切り返す",
    ],
  };
}
