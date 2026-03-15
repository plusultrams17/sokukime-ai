export interface ScoreInput {
  messages: { role: string; content: string }[];
  industry: string;
  product: string;
  difficulty: string;
  scene: string;
  customerType: string;
  productContext?: string;
  customerContext?: string;
}

export interface ScoreResult {
  overall: number;
  categories: {
    name: string;
    score: number;
    feedback: string;
  }[];
  summary: string;
  strengths: string[];
  improvements: string[];
}

const SCORING_PROMPT = `あなたは「成約5ステップメソッド」に基づく営業スキル採点AIです。
営業マン（ユーザー）とお客さん（AI）のロープレ会話を分析し、成約メソッドの5ステップに基づいて採点してください。

## 成約5ステップメソッドの採点基準

### 1. アプローチ（信頼構築）- 配点20点
- 信頼構築ができているか（褒める、共感する）
- 前提設定ができているか（事前に合意を取る、心理的安全を確保する）
- メラビアンの法則を意識した伝え方ができているか
- 専門家としてのポジションを取れているか

### 2. ヒアリング（問題の把握）- 配点20点
- クローズドクエスチョンとオープンクエスチョンを使い分けているか
- 表面的な問題を本質的な課題に掘り下げられているか
- 第三者話法を使えているか（「〜と悩んでいる方が多いですが〇〇さんは？」）
- ニーズを「与える」のではなく「引き出せて」いるか

### 3. プレゼン（価値伝達）- 配点20点
- セールスポイント→「だから」→ベネフィットの変換ができているか
- 特徴ではなく価値（ベネフィット）で伝えているか
- お客さんの問題に対する解決策として提示できているか

### 4. クロージング（決断促進）- 配点20点
- 自信を持って提案を言い切れているか（NGワード：「どうされますか？」「思います」）
- 社会的証明（他のお客様の事例）を活用できているか
- 一貫性の活用（事前の合意と最後の提案の一致）ができているか
- お客様の声を効果的に引用できているか

### 5. 反論処理・切り返し（行動促進）- 配点20点
- 切り返しの型に沿えているか：共感→確認→根拠提示→行動促進
- 根拠を論理的に提示できているか（主張→理由→具体例→主張）
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

const customerTypeLabels: Record<string, string> = {
  individual: "個人のお客さん",
  owner: "会社オーナー・社長",
  manager: "部長・課長クラス",
  staff: "担当者・一般社員",
};

const sceneLabels: Record<string, string> = {
  phone: "電話営業",
  visit: "訪問営業",
  inbound: "問い合わせ対応",
};

export function generateFallbackScore(): ScoreResult {
  return {
    overall: 55,
    categories: [
      {
        name: "アプローチ",
        score: 60,
        feedback:
          "会話の入り方は自然でしたが、前提設定（事前に合意を取る）のテクニックを意識するとさらに良くなります。",
      },
      {
        name: "ヒアリング",
        score: 50,
        feedback:
          "お客さんの状況を聞く姿勢はありましたが、表面的な問題を本質的な課題に掘り下げる質問力を磨きましょう。",
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
          "自信を持って提案を言い切る力を高めましょう。「どうされますか？」はNGワードです。",
      },
      {
        name: "反論処理",
        score: 45,
        feedback:
          "お客さんの「考えます」に対する切り返しの型（共感→確認→根拠提示→行動促進）を練習しましょう。",
      },
    ],
    summary:
      "基本的な会話力はありますが、成約メソッドの「型」をより意識的に使うことで成約率が大幅に上がります。特に「前提設定」「提案の言い切り」「切り返しの型」を重点的に練習しましょう。",
    strengths: [
      "自然な会話の入り方ができている",
      "お客さんの話を聞く姿勢がある",
      "商品への知識がある",
    ],
    improvements: [
      "前提設定のテクニックを使って事前に合意を取る練習をする",
      "クロージングで自信を持って提案を言い切る練習をする",
      "反論に対して根拠を論理的に提示して切り返す",
    ],
  };
}

export async function scoreConversation(input: ScoreInput): Promise<ScoreResult> {
  const { getPersona } = await import("@/lib/personas");
  const { messages, industry, product, difficulty, scene, customerType, productContext, customerContext } = input;
  const persona = getPersona(difficulty);

  const conversationText = messages
    .map(
      (m) =>
        `${m.role === "user" ? "【営業マン】" : "【お客さん】"}: ${m.content}`
    )
    .join("\n\n");

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return generateFallbackScore();
  }

  const isBusiness = customerType === "owner" || customerType === "manager" || customerType === "staff";
  const isB2B = isBusiness && industry && industry !== customerType;

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

【シナリオ情報】
業種: ${industry}
商材: ${product}
お客さんのタイプ: ${persona?.label || difficulty}
お客さんの属性: ${customerTypeLabels[customerType] || "個人"}
営業シーン: ${sceneLabels[scene] || "訪問営業"}
${isB2B ? `取引タイプ: B2B（法人取引）─ 「${product}」を「${industry}」事業者に提案\n※ B2B営業の観点も含めて採点してください（事業課題の把握、ROI訴求、同業他社事例の活用など）` : ""}
${productContext ? `\n【商材の詳細情報】\n${productContext}` : ""}
${customerContext ? `\n【お客さんのペルソナ詳細】\n${customerContext}` : ""}

--- 会話内容 ---
${conversationText}
--- 会話ここまで ---

上記の会話を成約5ステップメソッドで採点し、JSON形式で返してください。`,
        },
      ],
    }),
  });

  if (!response.ok) {
    console.error("Scoring API error:", await response.text());
    return generateFallbackScore();
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content || "";

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    return JSON.parse(jsonMatch[0]);
  }

  return generateFallbackScore();
}
