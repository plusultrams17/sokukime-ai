import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@/lib/supabase/server";

const EXTRACT_PROMPT = `あなたは営業コンサルタントです。与えられた情報から会社・商材の基本情報を抽出してください。

以下のJSON形式で回答してください（JSONのみ返すこと）：

{
  "companyName": "会社名（わかれば）",
  "industry": "業種",
  "productName": "主な商材・サービス名",
  "targetAudience": "ターゲット層",
  "keyFeatures": "主な特徴・強み（箇条書きをカンマ区切りで）",
  "priceRange": "価格帯（わかれば）",
  "advantages": "競合優位性（わかれば）",
  "challenges": "想定される営業課題"
}

## ルール
- 情報が不明な項目は空文字("")にする
- 推測で補完してもよいが、明確に推測とわかるようにしない（自然に書く）
- 日本語で回答すること
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
    .slice(0, 5000);
}

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

    const body = await request.json();
    const { url, documentText } = body;

    const client = getAnthropicClient();
    if (!client) {
      return NextResponse.json(
        { error: "AI機能が設定されていません" },
        { status: 500 },
      );
    }

    let context = "";

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

        if (textContent.length < 30) {
          return NextResponse.json(
            { error: "ページから十分な情報を取得できませんでした" },
            { status: 400 },
          );
        }

        context = `以下のWebページから会社・商材情報を抽出してください:\n\nURL: ${parsedUrl.toString()}\n\n--- ページ内容 ---\n${textContent}`;
      } catch {
        return NextResponse.json(
          { error: "ページにアクセスできませんでした。URLを確認してください。" },
          { status: 400 },
        );
      }
    } else if (documentText && typeof documentText === "string") {
      const trimmed = documentText.trim().slice(0, 5000);
      if (trimmed.length < 20) {
        return NextResponse.json(
          { error: "もう少し詳しい情報を入力してください" },
          { status: 400 },
        );
      }
      context = `以下の資料テキストから会社・商材情報を抽出してください:\n\n--- 資料内容 ---\n${trimmed}`;
    } else {
      return NextResponse.json(
        { error: "URLまたは資料テキストを入力してください" },
        { status: 400 },
      );
    }

    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 800,
      system: EXTRACT_PROMPT,
      messages: [
        { role: "user", content: context },
      ],
    });

    const content = response.content[0]?.type === "text" ? response.content[0].text : "";
    const jsonMatch = content.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      return NextResponse.json(
        { error: "情報の抽出に失敗しました" },
        { status: 500 },
      );
    }

    let extracted: unknown;
    try {
      extracted = JSON.parse(jsonMatch[0]);
    } catch (e) {
      console.error("Invalid JSON from LLM (company-context/extract):", e);
      return NextResponse.json(
        { error: "情報の抽出に失敗しました" },
        { status: 500 },
      );
    }
    return NextResponse.json({ extracted });
  } catch (error) {
    console.error("Company context extraction error:", error);
    return NextResponse.json(
      { error: "抽出中にエラーが発生しました" },
      { status: 500 },
    );
  }
}
