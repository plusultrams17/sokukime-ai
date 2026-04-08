import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@/lib/supabase/server";

let anthropicClient: Anthropic | null = null;
function getAnthropicClient(): Anthropic | null {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;
  if (!anthropicClient) {
    anthropicClient = new Anthropic({ apiKey });
  }
  return anthropicClient;
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    if (!supabase) {
      return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
    }
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "ログインが必要です" }, { status: 401 });
    }

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

    const client = getAnthropicClient();
    if (!client) {
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

    // Ask Anthropic to extract product info
    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 500,
      system: `あなたはWebページの内容から商材・サービス情報を抽出する専門家です。
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
      messages: [
        {
          role: "user",
          content: `以下のWebページの内容から商材情報を抽出してください:\n\nURL: ${parsedUrl.toString()}\n\n--- ページ内容 ---\n${textContent}`,
        },
      ],
    });

    const content = response.content[0]?.type === "text" ? response.content[0].text : "";
    const jsonMatch = content.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      return NextResponse.json(
        { error: "ページの分析に失敗しました" },
        { status: 500 },
      );
    }

    let productInfo: unknown;
    try {
      productInfo = JSON.parse(jsonMatch[0]);
    } catch (e) {
      console.error("Invalid JSON from LLM (worksheet/analyze-url):", e);
      return NextResponse.json(
        { error: "ページの分析に失敗しました" },
        { status: 500 },
      );
    }

    return NextResponse.json({ productInfo });
  } catch (error) {
    console.error("URL analysis error:", error);
    return NextResponse.json(
      { error: "分析中にエラーが発生しました" },
      { status: 500 },
    );
  }
}
