import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import Anthropic from "@anthropic-ai/sdk";

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
      return NextResponse.json({ error: "Config error" }, { status: 500 });
    }
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Pro plan only
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("plan")
      .eq("id", user.id)
      .single();

    if (profileError) {
      console.error("Profile query failed (insights/convert):", profileError);
      return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
    }

    if (profile?.plan !== "pro") {
      return NextResponse.json({ error: "Pro plan required" }, { status: 403 });
    }

    const { insightId, industry, product } = await request.json();

    if (!insightId) {
      return NextResponse.json({ error: "insightId is required" }, { status: 400 });
    }

    const industrySlug = industry || "general";
    const productHash = product ? simpleHash(product) : "default";

    // Check cache first
    const { data: cached } = await supabase
      .from("sales_talk_cache")
      .select("talk_script")
      .eq("insight_id", insightId)
      .eq("industry_slug", industrySlug)
      .eq("product_hash", productHash)
      .single();

    if (cached?.talk_script) {
      try {
        const patterns = JSON.parse(cached.talk_script);
        return NextResponse.json({ patterns: patterns.patterns || patterns });
      } catch {
        // Invalid cached JSON, regenerate
      }
    }

    // Fetch the insight
    const { data: insight } = await supabase
      .from("insights")
      .select("title_ja, summary_ja")
      .eq("id", insightId)
      .single();

    if (!insight) {
      return NextResponse.json({ error: "Insight not found" }, { status: 404 });
    }

    // Call Anthropic to generate sales talk patterns
    const client = getAnthropicClient();
    if (!client) {
      return NextResponse.json({ error: "AI service unavailable" }, { status: 503 });
    }

    const prompt = `あなたは営業トークの専門家です。以下のニュース/研究情報を、営業トークに変換してください。

元の情報: ${insight.title_ja} - ${insight.summary_ja}
業種: ${industry || "一般"}
商材: ${product || "一般商材"}

3パターンのトークを日本語で生成してください:
A. 雑談ネタ（アプローチ段階）: 商談冒頭で使える自然な話題提供
B. 根拠トーク（プレゼン段階）: 提案の説得力を上げるデータ引用
C. 反論処理ネタ（切り返し段階）: 「今はいい」への切り返し材料

JSON形式で返してください:
{ "patterns": [
  { "type": "approach", "title": "雑談ネタ", "content": "..." },
  { "type": "presentation", "title": "根拠トーク", "content": "..." },
  { "type": "objection", "title": "反論処理ネタ", "content": "..." }
]}`;

    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: "You are a sales talk expert. Always respond in valid JSON.",
      messages: [
        { role: "user", content: prompt },
      ],
    });

    const content = response.content[0]?.type === "text" ? response.content[0].text : "";

    if (!content) {
      return NextResponse.json({ error: "AI generation failed" }, { status: 500 });
    }

    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ error: "AI generation failed" }, { status: 500 });
    }

    let parsed: { patterns?: unknown };
    try {
      parsed = JSON.parse(jsonMatch[0]);
    } catch (e) {
      console.error("Invalid JSON from LLM (insights/convert):", e);
      return NextResponse.json({ error: "AI generation failed" }, { status: 500 });
    }
    const patterns = parsed.patterns || parsed;

    // Cache the result
    await supabase.from("sales_talk_cache").insert({
      insight_id: insightId,
      industry_slug: industrySlug,
      product_hash: productHash,
      talk_script: JSON.stringify(parsed),
    });

    // Record convert interaction
    await supabase.from("insight_interactions").insert({
      user_id: user.id,
      insight_id: insightId,
      action: "convert",
    });

    return NextResponse.json({ patterns });
  } catch (error) {
    console.error("Insight convert API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}
