/**
 * X (Twitter) 投稿用画像を HTML+CSS → Puppeteer スクリーンショットで一括生成
 *
 * 使い方:
 *   1. npm install -D puppeteer (初回のみ)
 *   2. node scripts/generate-x-post-images.mjs
 *   3. public/images/x-posts/ に画像が保存される
 *
 * 特定の曜日だけ生成:
 *   node scripts/generate-x-post-images.mjs mon wed sat
 *
 * 既存ファイルを上書き:
 *   node scripts/generate-x-post-images.mjs --force
 */

import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputDir = path.join(__dirname, "..", "public", "images", "x-posts");
fs.mkdirSync(outputDir, { recursive: true });

// ── 共通デザイントークン ──
const COLORS = {
  bg: "#1a1a1a",
  card: "#2a2a2a",
  border: "#333333",
  accent: "#f97316",
  white: "#ffffff",
  muted: "#888888",
  green: "#22c55e",
  blue: "#3b82f6",
  red: "#ef4444",
};

const FONT_LINK = `<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700;900&display=swap" rel="stylesheet">`;

function baseStyle() {
  return `
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Noto Sans JP', sans-serif;
      background: ${COLORS.bg};
      color: ${COLORS.white};
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100vw;
      height: 100vh;
      overflow: hidden;
    }
  `;
}

// ══════════════════════════════════════════
//  7日分の投稿データ + HTMLテンプレート
// ══════════════════════════════════════════

const posts = [
  // ── 月曜: 新年度×あるある共感型 ──
  {
    day: "mon",
    label: "月曜 21:00 — 新年度×共感型",
    filename: "mon-new-year-empathy.png",
    width: 1200,
    height: 675,
    tweet: `新年度1週目。

「で、今月のノルマいくらだと思う？」

って上司に言われた瞬間、
胃がキュッとなった新人営業、いますよね。

大丈夫。全員そこからスタートしてる。

俺も1年目は月間成約ゼロだった。
でも「型」を覚えてから変わった。

新人営業に伝えたいことは1つ。
才能じゃない。型を知ってるかどうか。

#新年度 #営業 #新人営業`,
    html: () => `<!DOCTYPE html>
<html><head><meta charset="utf-8">${FONT_LINK}
<style>
${baseStyle()}
body { background: ${COLORS.bg}; position: relative; }
.container {
  width: 100%; height: 100%;
  display: flex;
  position: relative;
  overflow: hidden;
}
.left {
  width: 50%; height: 100%;
  background: ${COLORS.bg};
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}
.left::after {
  content: '';
  position: absolute;
  top: 0; right: 0;
  width: 1px; height: 100%;
  background: linear-gradient(to bottom, transparent, ${COLORS.accent}40, transparent);
}
.right {
  width: 50%; height: 100%;
  background: linear-gradient(135deg, ${COLORS.accent}15, ${COLORS.accent}40, ${COLORS.accent}20);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}
.right::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at center, ${COLORS.accent}20, transparent 70%);
}
.center-text {
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  z-index: 10;
}
.main-line {
  font-size: 72px;
  font-weight: 900;
  color: ${COLORS.white};
  text-shadow: 0 4px 30px rgba(0,0,0,0.8);
  letter-spacing: 4px;
  margin-bottom: 20px;
}
.sub-line {
  font-size: 36px;
  font-weight: 700;
  color: ${COLORS.accent};
  text-shadow: 0 2px 20px rgba(0,0,0,0.6);
}
.url {
  position: absolute;
  bottom: 24px;
  right: 32px;
  font-size: 16px;
  color: ${COLORS.muted};
  z-index: 10;
}
</style></head>
<body>
<div class="container">
  <div class="left"></div>
  <div class="right"></div>
  <div class="center-text">
    <div class="main-line">才能じゃない。</div>
    <div class="sub-line">型を知ってるかどうか。</div>
  </div>
  <div class="url">seiyaku-coach.vercel.app</div>
</div>
</body></html>`,
  },

  // ── 火曜: 失敗スレッド用（サムネ） ──
  {
    day: "tue",
    label: "火曜 7:30 — 失敗スレッド4連投（1枚目用）",
    filename: "tue-failure-patterns.png",
    width: 1200,
    height: 675,
    tweet: `【1/4】営業1年目、月間成約ゼロで上司に詰められた俺が、
1,600件の商談で気づいた「断られる営業の共通点」を、
朝の通勤時間にまとめます。

当時の俺に教えたい、4つの失敗パターン↓

#営業 #成約率`,
    html: () => `<!DOCTYPE html>
<html><head><meta charset="utf-8">${FONT_LINK}
<style>
${baseStyle()}
.container {
  width: 100%; height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 40px;
  padding: 60px;
}
.headline {
  font-size: 56px;
  font-weight: 900;
  text-align: center;
  line-height: 1.3;
  letter-spacing: 2px;
}
.subtitle {
  font-size: 24px;
  color: ${COLORS.accent};
  font-weight: 700;
  letter-spacing: 1px;
}
.icons-row {
  display: flex;
  gap: 28px;
  margin-top: 8px;
}
.icon-card {
  width: 120px;
  height: 120px;
  background: ${COLORS.card};
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  border: 1px solid ${COLORS.border};
}
.icon-card svg {
  width: 40px;
  height: 40px;
  fill: ${COLORS.accent};
}
.icon-label {
  font-size: 14px;
  color: ${COLORS.muted};
}
</style></head>
<body>
<div class="container">
  <div class="subtitle">1,600件の商談データから</div>
  <div class="headline">断られる営業の<br>4つの共通点</div>
  <div class="icons-row">
    <div class="icon-card">
      <svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/></svg>
      <span class="icon-label">一方的に話す</span>
    </div>
    <div class="icon-card">
      <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
      <span class="icon-label">即決を迫る</span>
    </div>
    <div class="icon-card">
      <svg viewBox="0 0 24 24"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>
      <span class="icon-label">準備不足</span>
    </div>
    <div class="icon-card">
      <svg viewBox="0 0 24 24"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>
      <span class="icon-label">テンプレ営業</span>
    </div>
  </div>
</div>
</body></html>`,
  },

  // ── 水曜: 営業Week便乗型 ──
  {
    day: "wed",
    label: "水曜 12:00 — 営業Week便乗型",
    filename: "wed-ai-sales-steps.png",
    width: 1200,
    height: 675,
    tweet: `今日から東京ビッグサイトで「営業Week」開催。
AI営業ワールドという特設エリアもあるらしい。

大手は商談解析AI、提案書自動生成、AI SDR…
数百万円のエンタープライズツールが並ぶ。

でも、個人の営業マンが今すぐ使えるAIは？

俺の答え：
「型を学んで、AIと練習して、点数で弱点を知る」

これなら無料で今日からできる。

#営業Week #AI営業`,
    html: () => `<!DOCTYPE html>
<html><head><meta charset="utf-8">${FONT_LINK}
<style>
${baseStyle()}
.container {
  width: 100%; height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 36px;
  padding: 60px;
}
.title {
  font-size: 52px;
  font-weight: 900;
  letter-spacing: 6px;
}
.title span { color: ${COLORS.accent}; }
.steps {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 560px;
}
.step {
  display: flex;
  align-items: center;
  gap: 20px;
  background: ${COLORS.card};
  border-radius: 16px;
  padding: 20px 28px;
  border: 1px solid ${COLORS.border};
  position: relative;
}
.step-num {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
  font-size: 20px;
  color: ${COLORS.white};
  flex-shrink: 0;
}
.step:nth-child(1) .step-num { background: ${COLORS.green}; }
.step:nth-child(2) .step-num { background: ${COLORS.accent}; }
.step:nth-child(3) .step-num { background: ${COLORS.blue}; }
.step-icon {
  width: 36px;
  height: 36px;
  flex-shrink: 0;
}
.step:nth-child(1) .step-icon { fill: ${COLORS.green}; }
.step:nth-child(2) .step-icon { fill: ${COLORS.accent}; }
.step:nth-child(3) .step-icon { fill: ${COLORS.blue}; }
.step-text {
  font-size: 24px;
  font-weight: 700;
}
.connector {
  width: 2px;
  height: 20px;
  background: ${COLORS.border};
  margin-left: 50px;
}
</style></head>
<body>
<div class="container">
  <div class="title">営業 <span>×</span> AI</div>
  <div class="steps">
    <div class="step">
      <div class="step-num">1</div>
      <svg class="step-icon" viewBox="0 0 24 24"><path d="M21 5c-1.11-.35-2.33-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .25.25.5.5.5.1 0 .15-.05.25-.05C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.1.05.15.05.25.05.25 0 .5-.25.5-.5V6c-.6-.45-1.25-.75-2-1zm0 13.5c-1.1-.35-2.3-.5-3.5-.5-1.7 0-4.15.65-5.5 1.5V8c1.35-.85 3.8-1.5 5.5-1.5 1.2 0 2.4.15 3.5.5v11.5z"/></svg>
      <span class="step-text">型を学ぶ</span>
    </div>
    <div class="step">
      <div class="step-num">2</div>
      <svg class="step-icon" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-3 12H7v-2h10v2zm0-3H7V9h10v2zm0-3H7V6h10v2z"/></svg>
      <span class="step-text">AIと練習する</span>
    </div>
    <div class="step">
      <div class="step-num">3</div>
      <svg class="step-icon" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/></svg>
      <span class="step-text">スコアで弱点を知る</span>
    </div>
  </div>
</div>
</body></html>`,
  },

  // ── 木曜: AIデモ見せ型 ──
  {
    day: "thu",
    label: "木曜 21:00 — AIデモ見せ型",
    filename: "thu-demo-frame.png",
    width: 1200,
    height: 675,
    tweet: `AIに「考えます」って言わせて、
切り返しを50回練習した結果がこちら。

最初はフリーズしてた俺が、
今は3パターン即答できるようになった。

先輩に頼まなくても、
夜中でもロープレできる時代。

商談即決スキルをAIで→ https://seiyaku-coach.vercel.app

#営業ロープレ #AI活用`,
    html: () => `<!DOCTYPE html>
<html><head><meta charset="utf-8">${FONT_LINK}
<style>
${baseStyle()}
.container {
  width: 100%; height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}
.phone {
  width: 360px;
  height: 520px;
  background: #111;
  border-radius: 36px;
  border: 3px solid ${COLORS.border};
  padding: 20px 16px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 0 80px ${COLORS.accent}30, 0 0 160px ${COLORS.accent}15;
}
.phone::before {
  content: '';
  position: absolute;
  top: 8px; left: 50%;
  transform: translateX(-50%);
  width: 80px; height: 6px;
  background: ${COLORS.border};
  border-radius: 3px;
}
.chat-area {
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.bubble {
  max-width: 80%;
  padding: 12px 16px;
  border-radius: 18px;
  font-size: 15px;
  line-height: 1.5;
}
.ai {
  align-self: flex-start;
  background: ${COLORS.card};
  border: 1px solid ${COLORS.border};
  color: ${COLORS.white};
  border-bottom-left-radius: 4px;
}
.human {
  align-self: flex-end;
  background: ${COLORS.accent};
  color: ${COLORS.white};
  border-bottom-right-radius: 4px;
}
.ai-label, .human-label {
  font-size: 11px;
  color: ${COLORS.muted};
  margin-bottom: 2px;
}
.ai-label { align-self: flex-start; }
.human-label { align-self: flex-end; }
.bottom-text {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 24px;
  font-weight: 700;
  white-space: nowrap;
  color: ${COLORS.white};
  text-shadow: 0 2px 20px rgba(0,0,0,0.6);
}
.glow {
  position: absolute;
  width: 400px; height: 400px;
  background: radial-gradient(circle, ${COLORS.accent}20, transparent 60%);
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  z-index: -1;
}
</style></head>
<body>
<div class="container">
  <div class="glow"></div>
  <div class="phone">
    <div class="chat-area">
      <div class="ai-label">AI顧客</div>
      <div class="bubble ai">ちょっと考えさせてください</div>
      <div class="human-label">あなた</div>
      <div class="bubble human">もちろんです。ちなみに、一番気になる点は？</div>
      <div class="ai-label">AI顧客</div>
      <div class="bubble ai">正直、価格が…</div>
      <div class="human-label">あなた</div>
      <div class="bubble human">実は今月だけの特別価格がありまして</div>
    </div>
  </div>
  <div class="bottom-text">24時間、何度でも練習できる</div>
</div>
</body></html>`,
  },

  // ── 金曜: 新人営業向け型紹介 ──
  {
    day: "fri",
    label: "金曜 12:00 — 新人営業向け5ステップ",
    filename: "fri-five-steps.png",
    width: 1080,
    height: 1080,
    tweet: `新人営業へ。
最初の1週間、お疲れさまでした。

来週の商談で1つだけ覚えておくこと：

「今日ご決断いただけるとしたら、
何が決め手になりますか？」

商談の最初にこれを聞くだけで、
・お客さんの判断基準がわかる
・ゴールが明確になる
・クロージングが自然になる

型を1つ持ってるだけで全然違う。

#新人営業 #営業 #商談即決スキル`,
    html: () => `<!DOCTYPE html>
<html><head><meta charset="utf-8">${FONT_LINK}
<style>
${baseStyle()}
.container {
  width: 100%; height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 72px 60px;
  gap: 48px;
}
.title {
  font-size: 48px;
  font-weight: 900;
  letter-spacing: 3px;
}
.stairs {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
}
.stair {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 22px 28px;
  background: ${COLORS.card};
  border-radius: 16px;
  border-left: 5px solid ${COLORS.accent};
  transition: all 0.3s;
}
.stair:nth-child(1) { margin-left: 0; }
.stair:nth-child(2) { margin-left: 40px; }
.stair:nth-child(3) { margin-left: 80px; }
.stair:nth-child(4) { margin-left: 120px; }
.stair:nth-child(5) { margin-left: 160px; }
.num {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: ${COLORS.accent};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
  font-size: 24px;
  flex-shrink: 0;
}
.stair-label {
  font-size: 28px;
  font-weight: 700;
}
.trophy {
  font-size: 48px;
  margin-left: 200px;
  margin-top: 8px;
  text-shadow: 0 0 30px ${COLORS.accent};
}
</style></head>
<body>
<div class="container">
  <div class="title">商談即決 5ステップ</div>
  <div class="stairs">
    <div class="stair">
      <div class="num">1</div>
      <span class="stair-label">アプローチ</span>
    </div>
    <div class="stair">
      <div class="num">2</div>
      <span class="stair-label">ヒアリング</span>
    </div>
    <div class="stair">
      <div class="num">3</div>
      <span class="stair-label">プレゼン</span>
    </div>
    <div class="stair">
      <div class="num">4</div>
      <span class="stair-label">クロージング</span>
    </div>
    <div class="stair">
      <div class="num">5</div>
      <span class="stair-label">反論処理</span>
    </div>
  </div>
  <svg width="52" height="52" viewBox="0 0 24 24" fill="${COLORS.accent}" class="trophy" style="margin-left:200px"><path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z"/></svg>
</div>
</body></html>`,
  },

  // ── 土曜: 練習方法比較型 ──
  {
    day: "sat",
    label: "土曜 9:00 — ロープレ相手比較表",
    filename: "sat-comparison.png",
    width: 1080,
    height: 1080,
    tweet: `営業ロープレの相手、どれが一番いい？

①先輩
 →忙しくて頼みづらい、ダメ出しが怖い

②同期
 →お互い素人、なぁなぁになる

③鏡の前で独り言
 →反論が返ってこない

④AI
 →24h対応、本気の反論、点数化

選択肢が増えた今、練習しない理由がない。

#営業ロープレ #AI活用 #営業`,
    html: () => `<!DOCTYPE html>
<html><head><meta charset="utf-8">${FONT_LINK}
<style>
${baseStyle()}
.container {
  width: 100%; height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 72px 60px;
  gap: 40px;
}
.title {
  font-size: 44px;
  font-weight: 900;
  letter-spacing: 2px;
}
.rows {
  display: flex;
  flex-direction: column;
  gap: 18px;
  width: 100%;
}
.row {
  display: flex;
  align-items: center;
  padding: 24px 28px;
  background: ${COLORS.card};
  border-radius: 16px;
  border: 2px solid ${COLORS.border};
  gap: 20px;
  opacity: 0.55;
}
.row.highlight {
  opacity: 1;
  border-color: ${COLORS.accent};
  box-shadow: 0 0 30px ${COLORS.accent}30, inset 0 0 20px ${COLORS.accent}10;
  background: linear-gradient(135deg, ${COLORS.card}, ${COLORS.accent}15);
}
.row-icon {
  width: 48px;
  height: 48px;
  flex-shrink: 0;
}
.row-icon svg {
  width: 100%;
  height: 100%;
}
.row-text {
  flex: 1;
  font-size: 26px;
  font-weight: 700;
}
.row-mark {
  font-size: 32px;
  font-weight: 900;
  flex-shrink: 0;
}
.row-mark.x { color: ${COLORS.red}; }
.row-mark.ok { color: ${COLORS.accent}; }
.tags {
  display: flex;
  gap: 10px;
  flex-shrink: 0;
}
.tag {
  font-size: 14px;
  color: ${COLORS.accent};
  background: ${COLORS.accent}20;
  padding: 4px 12px;
  border-radius: 20px;
  white-space: nowrap;
}
</style></head>
<body>
<div class="container">
  <div class="title">ロープレ相手、どれがベスト？</div>
  <div class="rows">
    <div class="row">
      <div class="row-icon"><svg viewBox="0 0 24 24" fill="${COLORS.muted}"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg></div>
      <span class="row-text">先輩</span>
      <span class="row-mark x">✕</span>
    </div>
    <div class="row">
      <div class="row-icon"><svg viewBox="0 0 24 24" fill="${COLORS.muted}"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg></div>
      <span class="row-text">同期</span>
      <span class="row-mark x">✕</span>
    </div>
    <div class="row">
      <div class="row-icon"><svg viewBox="0 0 24 24" fill="${COLORS.muted}"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/></svg></div>
      <span class="row-text">鏡の前</span>
      <span class="row-mark x">✕</span>
    </div>
    <div class="row highlight">
      <div class="row-icon"><svg viewBox="0 0 24 24" fill="${COLORS.accent}"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-3 12H7v-2h10v2zm0-3H7V9h10v2zm0-3H7V6h10v2z"/></svg></div>
      <span class="row-text">AI</span>
      <div class="tags">
        <span class="tag">24時間</span>
        <span class="tag">点数化</span>
      </div>
      <span class="row-mark ok">◎</span>
    </div>
  </div>
</div>
</body></html>`,
  },

  // ── 日曜: BuildInPublic週次報告 ──
  {
    day: "sun",
    label: "日曜 20:00 — 週次報告（数字カード）",
    filename: "sun-weekly-report.png",
    width: 1200,
    height: 675,
    tweet: `【週次報告】成約コーチAI 運営ログ

今週の数字
・フォロワー：+XX人
・サイト訪問：XX人
・Pro：X人

新年度のタイミングで「新人営業」向け発信を始めた。
反応が一番良かったのは○曜の投稿。

来週は「保険営業の切り返し集」投稿予定。

#BuildInPublic #営業`,
    html: () => `<!DOCTYPE html>
<html><head><meta charset="utf-8">${FONT_LINK}
<style>
${baseStyle()}
.container {
  width: 100%; height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 40px;
  padding: 60px;
}
.badge {
  background: ${COLORS.accent};
  color: ${COLORS.white};
  font-size: 16px;
  font-weight: 700;
  padding: 8px 24px;
  border-radius: 24px;
  letter-spacing: 3px;
}
.brand {
  font-size: 40px;
  font-weight: 900;
  letter-spacing: 2px;
}
.cards {
  display: flex;
  gap: 24px;
}
.kpi-card {
  width: 240px;
  height: 160px;
  background: ${COLORS.card};
  border-radius: 20px;
  border: 1px solid ${COLORS.border};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
}
.kpi-value {
  font-size: 44px;
  font-weight: 900;
  color: ${COLORS.accent};
  letter-spacing: 2px;
}
.kpi-label {
  font-size: 16px;
  color: ${COLORS.muted};
  text-transform: uppercase;
  letter-spacing: 2px;
}
.footer {
  font-size: 16px;
  color: ${COLORS.muted};
  letter-spacing: 1px;
}
</style></head>
<body>
<div class="container">
  <div class="badge">WEEK REPORT</div>
  <div class="brand">成約コーチAI</div>
  <div class="cards">
    <div class="kpi-card">
      <div class="kpi-value">+——</div>
      <div class="kpi-label">followers</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-value">——</div>
      <div class="kpi-label">visitors</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-value">——</div>
      <div class="kpi-label">paid</div>
    </div>
  </div>
  <div class="footer">#BuildInPublic</div>
</div>
</body></html>`,
  },
];

// ══════════════════════════════════════════
//  Puppeteer で HTML → PNG 生成
// ══════════════════════════════════════════

async function generateImage(browser, post, force) {
  const outPath = path.join(outputDir, post.filename);

  if (!force && fs.existsSync(outPath)) {
    console.log(`  skip (exists): ${post.filename}`);
    return;
  }

  console.log(`\n  generating: ${post.label}`);
  console.log(`   -> ${post.filename} (${post.width}x${post.height})`);

  const page = await browser.newPage();
  await page.setViewport({
    width: post.width,
    height: post.height,
    deviceScaleFactor: 2, // Retina品質
  });

  await page.setContent(post.html(), { waitUntil: "networkidle0" });

  await page.screenshot({ path: outPath, type: "png" });
  await page.close();

  console.log(`   saved: ${outPath}`);
}

// ── メイン ──
async function main() {
  console.log("===========================================");
  console.log("  X post images — HTML + Puppeteer");
  console.log("===========================================");
  console.log(`output: ${outputDir}\n`);

  // 引数で曜日をフィルタ / --force で上書き
  const rawArgs = process.argv.slice(2).map((a) => a.toLowerCase());
  const force = rawArgs.includes("--force");
  const args = rawArgs.filter((a) => a !== "--force");

  const targets =
    args.length > 0
      ? posts.filter((p) => args.includes(p.day))
      : posts;

  if (targets.length === 0) {
    console.log("no targets. specify days: mon tue wed thu fri sat sun");
    process.exit(0);
  }

  console.log(`targets: ${targets.map((p) => p.day).join(", ")} (${targets.length} images)`);
  if (force) console.log("mode: --force (overwrite existing)");
  console.log("");

  const browser = await puppeteer.launch({ headless: true });

  try {
    for (const post of targets) {
      await generateImage(browser, post, force);
    }
  } finally {
    await browser.close();
  }

  // ── 投稿テキスト一覧を出力 ──
  console.log("\n\n===========================================");
  console.log("  Tweet texts (copy-paste)");
  console.log("===========================================\n");

  for (const post of targets) {
    console.log(`--- ${post.label} ---`);
    console.log(`image: public/images/x-posts/${post.filename}`);
    console.log("");
    console.log(post.tweet);
    console.log("\n");
  }

  console.log("Done!");
  console.log(`images: ${outputDir}`);
}

main().catch(console.error);
