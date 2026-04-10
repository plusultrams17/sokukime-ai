// 全キャンペーン（Stripeクーポン + テスターコード）の使用状況を確認
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";

const env = Object.fromEntries(
  readFileSync(".env.local", "utf8")
    .split("\n")
    .filter((l) => l && !l.startsWith("#") && l.includes("="))
    .map((l) => {
      const i = l.indexOf("=");
      return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^["']|["']$/g, "")];
    })
);

const stripeKey = env.STRIPE_SECRET_KEY;
if (!stripeKey) {
  console.error("Missing STRIPE_SECRET_KEY");
  process.exit(1);
}

const stripe = new Stripe(stripeKey);

// コードベースで参照されている既知のクーポンID + 用途
const KNOWN_COUPONS = [
  { id: "spring2026_1000off", category: "季節キャンペーン", purpose: "春の営業力UPキャンペーン（4月）" },
  { id: "summer2026_1000off", category: "季節キャンペーン", purpose: "夏の集中トレーニングキャンペーン（7月）" },
  { id: "referral_1000off", category: "紹介報酬", purpose: "紹介者向け¥1000 OFF" },
  { id: "referral_referee_1000off", category: "紹介報酬", purpose: "紹介された人向け¥1000 OFF" },
  { id: "retention_25off_2mo", category: "解約引き留め", purpose: "解約フローでの25% OFF x 2ヶ月" },
];

console.log("\n═══════════════════════════════════════════");
console.log("  📊 全キャンペーン使用状況");
console.log("═══════════════════════════════════════════\n");

// ── セクション1: コードで使われている既知のクーポン ──
console.log("【1】Stripe 既知クーポン（コードで参照中）\n");

const rows = [];
for (const { id, category, purpose } of KNOWN_COUPONS) {
  try {
    const c = await stripe.coupons.retrieve(id);
    rows.push({
      カテゴリ: category,
      ID: id,
      用途: purpose,
      割引: c.amount_off ? `¥${c.amount_off}` : `${c.percent_off}%`,
      使用済み: c.times_redeemed,
      上限: c.max_redemptions ?? "無制限",
      状態: c.valid ? "✅" : "❌",
    });
  } catch {
    rows.push({
      カテゴリ: category,
      ID: id,
      用途: purpose,
      割引: "-",
      使用済み: "-",
      上限: "-",
      状態: "⚠️未作成",
    });
  }
}
console.table(rows);

// ── セクション2: Stripe に存在する全クーポンを網羅（未知のものがないか確認） ──
console.log("\n【2】Stripe に登録されている全クーポン（網羅確認）\n");
const allCoupons = await stripe.coupons.list({ limit: 100 });
const allRows = allCoupons.data.map((c) => ({
  ID: c.id,
  名前: c.name || "-",
  割引: c.amount_off ? `¥${c.amount_off}` : `${c.percent_off}%`,
  期間: c.duration + (c.duration === "repeating" ? `(${c.duration_in_months}ヶ月)` : ""),
  使用済み: c.times_redeemed,
  上限: c.max_redemptions ?? "無制限",
  有効: c.valid ? "✅" : "❌",
  作成日: new Date(c.created * 1000).toLocaleDateString("ja-JP"),
}));
console.table(allRows);

// ── セクション2.5: Supabase profiles.checkout_coupon_id 集計 ──
console.log("\n【2.5】Supabase上のクーポン使用集計（profiles.checkout_coupon_id）\n");
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
const { data: couponStats, error: couponStatsErr } = await supabase
  .from("profiles")
  .select("checkout_coupon_id")
  .not("checkout_coupon_id", "is", null);

if (couponStatsErr) {
  console.log(`  ⚠️ checkout_coupon_id カラムがまだ存在しません`);
  console.log(`     → migrations/002_add_checkout_coupon_id.sql を先に実行してください\n`);
} else {
  const counts = {};
  for (const row of couponStats) {
    counts[row.checkout_coupon_id] = (counts[row.checkout_coupon_id] || 0) + 1;
  }
  const entries = Object.entries(counts);
  if (entries.length === 0) {
    console.log("  （まだデータなし。バックフィルを実行: node scripts/backfill-checkout-coupon.mjs）\n");
  } else {
    console.table(
      entries
        .sort((a, b) => b[1] - a[1])
        .map(([coupon, count]) => ({ クーポン: coupon, Pro転換数: count }))
    );
  }
}

// ── セクション3: テスターコード（Supabase） ──
console.log("\n【3】テスターコード（Supabase）\n");
const { data: testerCodes } = await supabase
  .from("tester_codes")
  .select("code, description, duration_days, max_uses, current_uses, active")
  .order("code");

console.table(
  testerCodes.map((r) => ({
    コード: r.code,
    用途: r.description,
    期間: r.duration_days === null ? "無期限" : `${r.duration_days}日`,
    使用済み: r.current_uses,
    上限: r.max_uses ?? "無制限",
    残り: r.max_uses === null ? "∞" : r.max_uses - r.current_uses,
    状態: r.active ? "✅" : "❌",
  }))
);

// ── サマリー ──
console.log("\n═══════════════════════════════════════════");
console.log("  📈 使用回数サマリー");
console.log("═══════════════════════════════════════════\n");

const stripeTotal = rows
  .filter((r) => typeof r.使用済み === "number")
  .reduce((sum, r) => sum + r.使用済み, 0);
const testerTotal = testerCodes.reduce((sum, c) => sum + c.current_uses, 0);

console.log(`  Stripeクーポン合計使用: ${stripeTotal} 回`);
console.log(`  テスターコード合計使用: ${testerTotal} 回`);
console.log(`  総合計:               ${stripeTotal + testerTotal} 回\n`);

const today = new Date().toISOString().split("T")[0];
console.log(`  今日: ${today}`);
if (today >= "2026-04-01" && today <= "2026-04-30") {
  console.log("  🌸 現在アクティブ: 春の営業力UPキャンペーン (spring2026_1000off)");
} else if (today >= "2026-07-01" && today <= "2026-07-31") {
  console.log("  ☀️ 現在アクティブ: 夏の集中トレーニングキャンペーン (summer2026_1000off)");
} else {
  console.log("  → 現在アクティブな季節キャンペーン: なし");
}
console.log("");
