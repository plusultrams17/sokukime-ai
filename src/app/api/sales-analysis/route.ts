import { NextRequest, NextResponse } from "next/server";

const ANALYSIS_PROMPT = `あなたは成約5ステップメソッドの専門コンサルタントです。
与えられた商材・サービス情報を分析し、営業現場で即座に使える武器を作成してください。

以下のJSON形式で回答してください：

{
  "productSummary": "商材・サービスの一行要約",
  "sellingPoints": [
    {
      "title": "セリングポイントのタイトル（短く）",
      "phrase": "営業トークで使える具体的な言い回し（お客さんに言う形で）",
      "psychology": "なぜこれが効くのか（営業心理学的な根拠を一文で）"
    }
  ],
  "competitorAnalysis": {
    "positioning": "この商材の市場でのポジショニング（一文）",
    "differentiators": [
      "競合と差別化できるポイント1",
      "競合と差別化できるポイント2",
      "競合と差別化できるポイント3"
    ],
    "counterPhrase": "競合比較された時の切り返しフレーズ"
  },
  "closingScripts": [
    {
      "situation": "場面（例: お客さんが『考えます』と言った時）",
      "script": "成約5ステップメソッドに基づくトークスクリプト",
      "step": "対応する成約5ステップ（アプローチ/ヒアリング/プレゼン/クロージング/反論処理）"
    }
  ]
}

## ルール
- sellingPointsは3つ生成
- closingScriptsは3つ生成（クロージングと反論処理を中心に）
- 言い回しは日本語の口語体で、実際の商談で使える自然な表現にする
- 成約メソッドの核心：「考えます」を言わせない前提設定、社会的証明、一貫性の原理を活用
- JSONのみを返すこと`;

function extractTextFromHtml(html: string): string {
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 4000);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, productName, industry } = body;

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "AI機能が設定されていません" },
        { status: 500 },
      );
    }

    let productContext = "";

    // Mode 1: URL input — fetch and extract
    if (url && typeof url === "string") {
      let parsedUrl: URL;
      try {
        parsedUrl = new URL(url);
        if (!parsedUrl.protocol.startsWith("http")) throw new Error();
      } catch {
        return NextResponse.json(
          { error: "有効なURLを入力してください（https://...）" },
          { status: 400 },
        );
      }

      try {
        const pageRes = await fetch(parsedUrl.toString(), {
          headers: {
            "User-Agent": "Mozilla/5.0 (compatible; SeiyakuCoachBot/1.0)",
            Accept: "text/html",
          },
          signal: AbortSignal.timeout(10000),
        });
        if (!pageRes.ok) {
          return NextResponse.json(
            { error: `ページの取得に失敗しました（${pageRes.status}）` },
            { status: 400 },
          );
        }
        const htmlText = await pageRes.text();
        const textContent = extractTextFromHtml(htmlText);

        if (textContent.length < 50) {
          return NextResponse.json(
            { error: "ページから十分な情報を取得できませんでした" },
            { status: 400 },
          );
        }

        productContext = `以下のWebページの内容から商材を分析してください:\n\nURL: ${parsedUrl.toString()}\n\n--- ページ内容 ---\n${textContent}`;
      } catch {
        return NextResponse.json(
          { error: "ページにアクセスできませんでした。URLを確認してください。" },
          { status: 400 },
        );
      }
    }
    // Mode 2: Manual input
    else if (productName || industry) {
      if (!productName) {
        return NextResponse.json(
          { error: "商材・サービス名を入力してください" },
          { status: 400 },
        );
      }
      productContext = `以下の商材・サービスについて分析してください:\n\n商材名: ${productName}\n業種: ${industry || "未指定"}`;
    } else {
      return NextResponse.json(
        { error: "URLまたは商材名を入力してください" },
        { status: 400 },
      );
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
        temperature: 0.7,
        messages: [
          { role: "system", content: ANALYSIS_PROMPT },
          { role: "user", content: productContext },
        ],
      }),
    });

    if (!response.ok) {
      console.error("OpenAI API error:", await response.text());
      return NextResponse.json(
        { error: "AI分析に失敗しました" },
        { status: 500 },
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";
    const jsonMatch = content.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      return NextResponse.json(
        { error: "分析結果の生成に失敗しました" },
        { status: 500 },
      );
    }

    const analysis = JSON.parse(jsonMatch[0]);
    return NextResponse.json({ analysis });
  } catch (error) {
    console.error("Sales analysis error:", error);
    return NextResponse.json(
      { error: "分析中にエラーが発生しました" },
      { status: 500 },
    );
  }
}
