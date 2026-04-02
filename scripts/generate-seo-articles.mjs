#!/usr/bin/env node
/**
 * Programmatic SEO Article Generator
 *
 * Generates long-tail SEO blog posts targeting high-intent keywords
 * for the 成約コーチ AI sales coaching platform.
 *
 * Usage:
 *   node scripts/generate-seo-articles.mjs              # Generate all pending templates
 *   node scripts/generate-seo-articles.mjs --dry-run    # Preview without writing
 *   node scripts/generate-seo-articles.mjs --count 5    # Generate only 5 articles
 *
 * Prerequisites:
 *   - OPENAI_API_KEY in .env.local
 *   - Node.js 18+
 *
 * Output:
 *   - Writes generated posts to src/lib/blog-generated.ts
 *   - Import and spread into blogPosts array in src/lib/blog.ts
 */

import { readFileSync, writeFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

// Load .env.local
const envPath = resolve(ROOT, ".env.local");
if (existsSync(envPath)) {
  const envContent = readFileSync(envPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match) {
      process.env[match[1].trim()] = match[2].trim().replace(/^["']|["']$/g, "");
    }
  }
}

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
if (!OPENAI_API_KEY) {
  console.error("Error: OPENAI_API_KEY not found in .env.local");
  process.exit(1);
}

// ── Keyword Templates ──
// Format: [slug, title, targetKeyword, tags, angle]
const TEMPLATES = [
  // 業界 × ロープレ
  ["car-sales-roleplay", "自動車営業ロープレ完全ガイド｜商談トークスクリプト付き", "自動車 営業 ロープレ", ["自動車営業", "ロープレ", "トークスクリプト"], "自動車ディーラーの営業マン向け。試乗提案からクロージングまでのロープレ練習法。"],
  ["it-sales-roleplay", "IT営業ロープレ練習法｜SaaS・システム提案のコツ", "IT営業 ロープレ", ["IT営業", "SaaS営業", "ロープレ"], "IT・SaaS営業のヒアリングから提案、反論処理のロープレシナリオ。"],
  ["medical-sales-roleplay", "医療機器営業ロープレ｜ドクター対応の実践トレーニング", "医療機器 営業 ロープレ", ["医療機器営業", "ロープレ", "ドクター対応"], "医療機器メーカーの営業向け。医師・院長への提案ロープレ練習。"],
  ["solar-sales-roleplay", "太陽光発電の営業ロープレ｜反論処理と即決クロージング", "太陽光 営業 ロープレ", ["太陽光営業", "ロープレ", "クロージング"], "太陽光パネル・蓄電池の訪問営業向けロープレ練習。"],
  ["wedding-sales-roleplay", "ウェディング営業ロープレ｜成約率を上げるカウンセリング術", "ウェディング 営業 ロープレ", ["ウェディング営業", "ロープレ", "カウンセリング"], "結婚式場プランナーの初回カウンセリングロープレ。"],

  // スキル × 練習
  ["hearing-skill-training", "営業ヒアリングスキルを鍛える5つの方法｜質問力アップ術", "営業 ヒアリング 練習", ["ヒアリング", "質問力", "練習方法"], "営業のヒアリング力を向上させるための具体的練習法とフレームワーク。"],
  ["presentation-sales-skill", "営業プレゼンの上達法｜提案が通る話し方トレーニング", "営業 プレゼン 練習", ["プレゼン", "提案力", "トレーニング"], "営業プレゼンの構成・話し方・資料の見せ方を改善する実践法。"],
  ["rapport-building-tips", "ラポール構築のテクニック7選｜初回訪問で信頼を掴むコツ", "ラポール 営業 テクニック", ["ラポール", "信頼構築", "初回訪問"], "営業の初回面談でラポールを構築するための具体テクニック。"],
  ["negotiation-sales-tips", "営業交渉術の極意｜値引き要求を上手にかわす方法", "営業 交渉 コツ", ["交渉術", "値引き対応", "営業テクニック"], "値引き交渉への対応、価格以外の価値提案の仕方。"],
  ["follow-up-sales-email", "営業フォローアップメールの書き方｜返信率が上がるテンプレート", "営業 フォローアップ メール", ["フォローアップ", "メール", "テンプレート"], "商談後のフォローメール、お礼メール、再アプローチメールの書き方。"],

  // 課題 × 解決
  ["sales-slump-overcome", "営業スランプの脱出法｜成約できない時の5つの対処法", "営業 スランプ 脱出", ["スランプ", "モチベーション", "メンタル"], "営業のスランプに陥った時の原因分析と脱出法。"],
  ["fear-of-rejection-sales", "営業の断られる恐怖を克服する方法｜メンタルトレーニング", "営業 断られる 怖い", ["メンタル", "克服", "断り対応"], "営業で断られることへの恐怖を克服するメンタルトレーニング法。"],
  ["sales-quota-tips", "営業ノルマ達成のコツ｜計画的に目標をクリアする方法", "営業 ノルマ 達成", ["ノルマ", "目標達成", "KPI"], "営業ノルマを安定的に達成するための行動計画と管理法。"],
  ["teleapo-script", "テレアポの成功トークスクリプト｜アポ率を3倍にする方法", "テレアポ トークスクリプト", ["テレアポ", "トークスクリプト", "アポ取り"], "テレアポの基本スクリプト、切り返しトーク、受付突破法。"],
  ["online-sales-tips", "オンライン営業のコツ｜Zoom商談で成約率を上げる方法", "オンライン営業 コツ", ["オンライン営業", "Zoom商談", "リモート営業"], "オンライン商談ならではのテクニック、画面共有、表情管理。"],

  // 比較 × 選択
  ["sales-training-comparison", "営業研修サービス比較2026年版｜おすすめ10選と選び方", "営業研修 比較 おすすめ", ["営業研修", "比較", "おすすめ"], "営業研修サービスの比較と、自社に合った研修の選び方。"],
  ["ai-sales-training-benefits", "AI営業研修のメリット｜従来研修との違いと導入効果", "AI 営業研修 メリット", ["AI研修", "営業研修", "DX"], "AI営業研修の具体的メリットと、従来のOJT/集合研修との比較。"],
  ["sales-coaching-app-comparison", "営業コーチングアプリ比較｜一人で練習できるおすすめツール", "営業 コーチング アプリ", ["営業アプリ", "コーチング", "ツール比較"], "営業スキルアップアプリの比較。機能・価格・効果の観点から。"],

  // ペルソナ × 悩み
  ["new-grad-sales-tips", "新卒営業マンが最初の3ヶ月で身につけるべき基礎スキル", "新卒 営業 コツ", ["新卒営業", "基礎スキル", "研修"], "新卒・未経験で営業配属になった人向けの基礎スキルガイド。"],
  ["sales-manager-coaching", "営業マネージャーのコーチング術｜部下の成約率を上げる指導法", "営業マネージャー コーチング", ["マネージャー", "コーチング", "部下育成"], "営業マネージャーが部下を育成するためのコーチング手法。"],
];

// ── Article Generation ──

async function generateArticle(template) {
  const [slug, title, keyword, tags, angle] = template;

  const systemPrompt = `あなたは営業コンサルタント兼SEOライターです。
日本語で2500〜3500文字の営業ノウハウ記事を書いてください。

ルール:
- HTML形式で出力（<h2>, <h3>, <p>, <ul>, <li>, <strong>タグを使用）
- <h1>は不要（ページ側で自動生成）
- 導入→本文（3〜5セクション）→まとめの構成
- 具体例やトーク例を必ず含める
- 「成約コーチ AI」を1〜2回自然に言及する（「AIロープレで練習できます」程度）
- SEOターゲットキーワード「${keyword}」を自然に含める
- 読者は日本の法人営業マン（20代〜40代）
- 信頼性のある実践的な内容にする
- 出力はHTMLのみ（説明文やマークダウンは不要）`;

  const userPrompt = `記事タイトル: ${title}
テーマ・切り口: ${angle}
ターゲットキーワード: ${keyword}

上記のテーマで記事を書いてください。`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 4000,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`OpenAI API error: ${response.status} ${err}`);
  }

  const data = await response.json();
  let content = data.choices[0].message.content.trim();

  // Strip markdown code fences if present
  content = content.replace(/^```html?\n?/i, "").replace(/\n?```$/i, "").trim();

  // Calculate reading time (~500 chars/min for Japanese)
  const textLength = content.replace(/<[^>]+>/g, "").length;
  const readingTime = Math.max(3, Math.round(textLength / 500));

  // Generate description from first paragraph
  const firstP = content.match(/<p>(.*?)<\/p>/s);
  let description = firstP
    ? firstP[1].replace(/<[^>]+>/g, "").slice(0, 150)
    : angle.slice(0, 150);
  if (description.length >= 148) description = description.slice(0, 147) + "…";

  return {
    slug,
    title,
    description,
    content,
    publishedAt: new Date().toISOString().split("T")[0],
    tags,
    readingTime,
  };
}

// ── Main ──

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const countIdx = args.indexOf("--count");
  const count = countIdx >= 0 ? parseInt(args[countIdx + 1]) : TEMPLATES.length;

  const outputPath = resolve(ROOT, "src/lib/blog-generated.ts");

  // Check which slugs already exist
  const existingSlugs = new Set();
  if (existsSync(outputPath)) {
    const existing = readFileSync(outputPath, "utf-8");
    const slugMatches = existing.matchAll(/slug:\s*"([^"]+)"/g);
    for (const m of slugMatches) existingSlugs.add(m[1]);
  }

  // Also check main blog.ts for existing slugs
  const blogPath = resolve(ROOT, "src/lib/blog.ts");
  if (existsSync(blogPath)) {
    const blogContent = readFileSync(blogPath, "utf-8");
    const slugMatches = blogContent.matchAll(/slug:\s*"([^"]+)"/g);
    for (const m of slugMatches) existingSlugs.add(m[1]);
  }

  const pending = TEMPLATES.filter(([slug]) => !existingSlugs.has(slug)).slice(0, count);

  if (pending.length === 0) {
    console.log("All templates already generated. Nothing to do.");
    return;
  }

  console.log(`Generating ${pending.length} articles${dryRun ? " (dry run)" : ""}...`);
  console.log("Existing slugs skipped:", existingSlugs.size);
  console.log("");

  const generated = [];

  for (let i = 0; i < pending.length; i++) {
    const template = pending[i];
    console.log(`[${i + 1}/${pending.length}] ${template[1]}`);

    if (dryRun) {
      console.log(`  → slug: ${template[0]}, keyword: ${template[2]}`);
      continue;
    }

    try {
      const article = await generateArticle(template);
      generated.push(article);
      console.log(`  → Generated (${article.readingTime}min read, ${article.content.length} chars)`);

      // Rate limiting: 500ms between requests
      if (i < pending.length - 1) {
        await new Promise((r) => setTimeout(r, 500));
      }
    } catch (err) {
      console.error(`  → Error: ${err.message}`);
    }
  }

  if (dryRun || generated.length === 0) {
    console.log(`\nDry run complete. ${pending.length} articles would be generated.`);
    return;
  }

  // Write output file
  const output = `// Auto-generated SEO blog posts
// Generated at: ${new Date().toISOString()}
// Do not edit manually — regenerate with: node scripts/generate-seo-articles.mjs

import type { BlogPost } from "./blog";

export const generatedBlogPosts: BlogPost[] = [
${generated.map((p) => `  {
    slug: ${JSON.stringify(p.slug)},
    title: ${JSON.stringify(p.title)},
    description: ${JSON.stringify(p.description)},
    publishedAt: ${JSON.stringify(p.publishedAt)},
    tags: ${JSON.stringify(p.tags)},
    readingTime: ${p.readingTime},
    content: ${JSON.stringify(p.content)},
  }`).join(",\n")}
];
`;

  writeFileSync(outputPath, output, "utf-8");
  console.log(`\n✅ Generated ${generated.length} articles → ${outputPath}`);
  console.log(`\nNext steps:`);
  console.log(`1. Review generated content in src/lib/blog-generated.ts`);
  console.log(`2. Add to src/lib/blog.ts:`);
  console.log(`   import { generatedBlogPosts } from "./blog-generated";`);
  console.log(`   export const blogPosts: BlogPost[] = [...existingPosts, ...generatedBlogPosts];`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
