import { SupabaseClient } from "@supabase/supabase-js";
import { INDUSTRIES, GENERAL_SALES_QUERIES } from "./search-queries";
import Anthropic from "@anthropic-ai/sdk";

// ── Types ──

interface RawArticle {
  source_type: "google_news" | "semantic_scholar";
  source_id: string;
  source_url: string;
  title_original: string;
  published_date: string | null;
  industries: string[];
}

interface SummarizedArticle extends RawArticle {
  title_ja: string;
  summary_ja: string;
  sales_angle: string;
}

interface PipelineResult {
  fetched: number;
  new_inserted: number;
  duplicates_skipped: number;
  summarized: number;
  archived: number;
  errors: string[];
}

// ── Google News RSS ──

export async function fetchGoogleNews(query: string): Promise<RawArticle[]> {
  const url = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=en-US&gl=US&ceid=US:en`;

  try {
    const response = await fetch(url, {
      headers: { "User-Agent": "SokukimeAI-InsightsBot/1.0" },
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) return [];

    const xml = await response.text();
    return parseRssXml(xml);
  } catch {
    return [];
  }
}

function parseRssXml(xml: string): RawArticle[] {
  const articles: RawArticle[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;

  while ((match = itemRegex.exec(xml)) !== null) {
    const itemXml = match[1];

    const title = extractTag(itemXml, "title");
    const link = extractTag(itemXml, "link");
    const pubDate = extractTag(itemXml, "pubDate");

    if (!title || !link) continue;

    // Create a stable source_id from the link
    const source_id = `gn_${hashString(link)}`;

    articles.push({
      source_type: "google_news",
      source_id,
      source_url: link,
      title_original: decodeHtmlEntities(title),
      published_date: pubDate ? new Date(pubDate).toISOString() : null,
      industries: [],
    });
  }

  // Limit to 5 per query to avoid overwhelming the AI summarizer
  return articles.slice(0, 5);
}

function extractTag(xml: string, tag: string): string | null {
  const regex = new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>|<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`);
  const m = regex.exec(xml);
  if (!m) return null;
  return (m[1] || m[2] || "").trim();
}

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

// ── Semantic Scholar ──

export async function fetchSemanticScholar(query: string): Promise<RawArticle[]> {
  const url = `https://api.semanticscholar.org/graph/v1/paper/search?query=${encodeURIComponent(query)}&limit=5&fields=title,url,year,externalIds`;

  try {
    const response = await fetch(url, {
      headers: { "User-Agent": "SokukimeAI-InsightsBot/1.0" },
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) return [];

    const data = await response.json();
    if (!data.data) return [];

    return data.data.map((paper: { paperId: string; url: string; title: string; year?: number }) => ({
      source_type: "semantic_scholar" as const,
      source_id: `ss_${paper.paperId}`,
      source_url: paper.url || `https://www.semanticscholar.org/paper/${paper.paperId}`,
      title_original: paper.title,
      published_date: paper.year ? `${paper.year}-01-01T00:00:00Z` : null,
      industries: [],
    }));
  } catch {
    return [];
  }
}

// ── AI Summarization ──

let anthropicClient: Anthropic | null = null;
function getAnthropicClient(): Anthropic {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY not set");
  if (!anthropicClient) {
    anthropicClient = new Anthropic({ apiKey });
  }
  return anthropicClient;
}

export async function summarizeWithAI(
  articles: RawArticle[]
): Promise<SummarizedArticle[]> {
  if (articles.length === 0) return [];

  const client = getAnthropicClient();

  // Process in batches of 5 to stay within token limits
  const batchSize = 5;
  const results: SummarizedArticle[] = [];

  for (let i = 0; i < articles.length; i += batchSize) {
    const batch = articles.slice(i, i + batchSize);

    const articlesJson = batch.map((a, idx) => ({
      index: idx,
      title: a.title_original,
      source: a.source_type,
    }));

    try {
      const response = await client.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1024,
        system: `あなたは営業プロフェッショナル向けのニュースキュレーターです。
以下の記事タイトルそれぞれについて、日本語で：
1. title_ja: タイトルを自然な日本語に翻訳（日本語の場合はそのまま）
2. summary_ja: 営業パーソンが知っておくべきポイントを2-3文で要約
3. sales_angle: この情報を商談でどう活用できるか、具体的な営業トーク例を1-2文で

JSON形式で返してください。必ず {"results": [...]} の形式で、各要素は {index, title_ja, summary_ja, sales_angle} の形式。`,
        messages: [
          {
            role: "user",
            content: JSON.stringify(articlesJson),
          },
        ],
      });

      const content = response.content[0]?.type === "text" ? response.content[0].text : "";
      if (!content) continue;

      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) continue;

      const parsed = JSON.parse(jsonMatch[0]);
      // Handle both {results: [...]} and direct array formats
      const summaries: Array<{
        index: number;
        title_ja: string;
        summary_ja: string;
        sales_angle: string;
      }> = Array.isArray(parsed) ? parsed : parsed.results || parsed.articles || [];

      for (const summary of summaries) {
        const article = batch[summary.index];
        if (!article) continue;

        results.push({
          ...article,
          title_ja: summary.title_ja || article.title_original,
          summary_ja: summary.summary_ja || "",
          sales_angle: summary.sales_angle || "",
        });
      }
    } catch {
      // If parsing fails, add articles without summaries
      for (const article of batch) {
        results.push({
          ...article,
          title_ja: article.title_original,
          summary_ja: "",
          sales_angle: "",
        });
      }
    }
  }

  return results;
}

// ── Main Pipeline ──

export async function runPipeline(
  supabase: SupabaseClient
): Promise<PipelineResult> {
  const result: PipelineResult = {
    fetched: 0,
    new_inserted: 0,
    duplicates_skipped: 0,
    summarized: 0,
    archived: 0,
    errors: [],
  };

  const allArticles: RawArticle[] = [];

  // 1. Fetch from all industry queries
  for (const industry of INDUSTRIES) {
    // Google News queries
    for (const query of industry.newsQueries) {
      try {
        const articles = await fetchGoogleNews(query);
        for (const article of articles) {
          article.industries = [industry.slug];
          allArticles.push(article);
        }
      } catch (e) {
        result.errors.push(`News fetch error [${industry.slug}]: ${e}`);
      }
    }

    // Semantic Scholar queries
    for (const query of industry.scholarQueries) {
      try {
        const articles = await fetchSemanticScholar(query);
        for (const article of articles) {
          article.industries = [industry.slug];
          allArticles.push(article);
        }
      } catch (e) {
        result.errors.push(`Scholar fetch error [${industry.slug}]: ${e}`);
      }

      // Rate-limit Semantic Scholar (100 req/5min free tier)
      await sleep(500);
    }
  }

  // 2. Fetch general sales queries
  for (const query of GENERAL_SALES_QUERIES.newsQueries) {
    try {
      const articles = await fetchGoogleNews(query);
      for (const article of articles) {
        article.industries = ["general"];
        allArticles.push(article);
      }
    } catch (e) {
      result.errors.push(`General news fetch error: ${e}`);
    }
  }

  for (const query of GENERAL_SALES_QUERIES.scholarQueries) {
    try {
      const articles = await fetchSemanticScholar(query);
      for (const article of articles) {
        article.industries = ["general"];
        allArticles.push(article);
      }
    } catch (e) {
      result.errors.push(`General scholar fetch error: ${e}`);
    }
    await sleep(500);
  }

  result.fetched = allArticles.length;

  // 3. Deduplicate by source_id
  const seen = new Set<string>();
  const uniqueArticles: RawArticle[] = [];
  for (const article of allArticles) {
    if (seen.has(article.source_id)) {
      result.duplicates_skipped++;
      continue;
    }
    seen.add(article.source_id);
    uniqueArticles.push(article);
  }

  // 4. Check which articles already exist in DB
  const sourceIds = uniqueArticles.map((a) => a.source_id);
  const { data: existing } = await supabase
    .from("insights")
    .select("source_id")
    .in("source_id", sourceIds);

  const existingIds = new Set((existing || []).map((e) => e.source_id));
  const newArticles = uniqueArticles.filter((a) => !existingIds.has(a.source_id));
  result.duplicates_skipped += uniqueArticles.length - newArticles.length;

  if (newArticles.length === 0) {
    // Nothing new to process
    result.archived = await archiveOldInsights(supabase);
    return result;
  }

  // 5. Summarize with AI
  const summarized = await summarizeWithAI(newArticles);
  result.summarized = summarized.length;

  // 6. Insert into DB
  for (const article of summarized) {
    try {
      const { error } = await supabase.from("insights").insert({
        source_type: article.source_type,
        source_id: article.source_id,
        source_url: article.source_url,
        title_original: article.title_original,
        title_ja: article.title_ja,
        summary_ja: article.summary_ja,
        sales_angle: article.sales_angle,
        industries: article.industries,
        published_date: article.published_date,
      });

      if (error) {
        // Skip duplicate key errors silently
        if (error.code !== "23505") {
          result.errors.push(`Insert error: ${error.message}`);
        } else {
          result.duplicates_skipped++;
        }
      } else {
        result.new_inserted++;
      }
    } catch (e) {
      result.errors.push(`Insert error: ${e}`);
    }
  }

  // 7. Archive old articles
  result.archived = await archiveOldInsights(supabase);

  return result;
}

// ── Archive ──

export async function archiveOldInsights(
  supabase: SupabaseClient
): Promise<number> {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

  const { data, error } = await supabase
    .from("insights")
    .update({ status: "archived" })
    .eq("status", "active")
    .lt("published_date", thirtyDaysAgo)
    .select("id");

  if (error) return 0;
  return data?.length || 0;
}

// ── Helpers ──

function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash + char) | 0;
  }
  return Math.abs(hash).toString(36);
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
