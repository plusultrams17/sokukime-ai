import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { error: "URLを入力してください" },
        { status: 400 },
      );
    }

    // Validate URL format
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
      if (!parsedUrl.protocol.startsWith("http")) {
        throw new Error("Invalid protocol");
      }
    } catch {
      return NextResponse.json(
        { error: "有効なURLを入力してください（https://...）" },
        { status: 400 },
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "AI機能が設定されていません" },
        { status: 500 },
      );
    }

    // Fetch the page server-side (bypasses CORS)
    let htmlText: string;
    try {
      const pageRes = await fetch(parsedUrl.toString(), {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (compatible; SeiyakuCoachBot/1.0)",
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
      htmlText = await pageRes.text();
    } catch {
      return NextResponse.json(
        { error: "ページにアクセスできませんでした。URLを確認してください。" },
        { status: 400 },
      );
    }

    // Strip HTML tags and extract text (first 3000 chars)
    const textContent = htmlText
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 3000);

    if (textContent.length < 50) {
      return NextResponse.json(
        { error: "ページから十分なテキストを取得できませんでした" },
        { status: 400 },
      );
    }

    // Ask OpenAI to extract product info
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        max_tokens: 500,
        temperature: 0.3,
        messages: [
          {
            role: "system",
            content: `あなたはWebページの内容から商材・サービス情報を抽出する専門家です。
以下のJSON形式で情報を抽出してください。情報が見つからない場合は空文字にしてください。

{
  "productName": "商材・サービス名",
  "industry": "業種（例: 外壁塗装、生命保険、SaaSツール）",
  "targetAudience": "ターゲット層（例: 30-50代の持ち家世帯）",
  "keyFeatures": "主な特徴・強み（カンマ区切り）",
  "priceRange": "価格帯（わかる範囲で）",
  "advantages": "競合優位性・差別化ポイント",
  "challenges": "顧客が抱える課題・解決したい問題"
}

JSONのみを返してください。`,
          },
          {
            role: "user",
            content: `以下のWebページの内容から商材情報を抽出してください:\n\nURL: ${parsedUrl.toString()}\n\n--- ページ内容 ---\n${textContent}`,
          },
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
        { error: "ページの分析に失敗しました" },
        { status: 500 },
      );
    }

    const productInfo = JSON.parse(jsonMatch[0]);

    return NextResponse.json({ productInfo });
  } catch (error) {
    console.error("URL analysis error:", error);
    return NextResponse.json(
      { error: "分析中にエラーが発生しました" },
      { status: 500 },
    );
  }
}
