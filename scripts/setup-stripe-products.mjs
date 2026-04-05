/**
 * Stripe商品・価格の自動セットアップスクリプト
 *
 * 使い方:
 *   1. .env.local に STRIPE_SECRET_KEY が設定されていることを確認
 *   2. node scripts/setup-stripe-products.mjs
 *   3. 出力された Price ID を .env.local の STRIPE_PRO_PRICE_ID / STRIPE_PRO_ANNUAL_PRICE_ID 等にコピー
 *
 * 冪等性: 同じ商品名が既にある場合はスキップします。
 */

import Stripe from "stripe";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ── .env.local を読み込み ──
const envPath = path.join(__dirname, "..", ".env.local");
if (!fs.existsSync(envPath)) {
  console.error("❌ .env.local が見つかりません");
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, "utf-8");
for (const line of envContent.split(/\r?\n/)) {
  const match = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
  if (match) {
    const key = match[1].trim();
    let val = match[2].trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    process.env[key] = val;
  }
}

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
if (!STRIPE_SECRET_KEY) {
  console.error("❌ STRIPE_SECRET_KEY が .env.local に設定されていません");
  console.error("   https://dashboard.stripe.com/apikeys から取得してください");
  process.exit(1);
}

const isTestMode = STRIPE_SECRET_KEY.startsWith("sk_test_");
console.log(`\n🔑 Stripe mode: ${isTestMode ? "TEST" : "LIVE ⚠️"}\n`);

const stripe = new Stripe(STRIPE_SECRET_KEY);

// ── 作成する商品定義 ──
const PRODUCTS = [
  {
    envKey: "STRIPE_PRO_PRICE_ID",
    productName: "成約コーチ AI Proプラン（月額）",
    productDescription: "無制限ロープレ、履歴保存、コーチモード、詳細スコア分析",
    prices: [
      {
        unitAmount: 2980,
        currency: "jpy",
        recurring: { interval: "month" },
        nickname: "Pro月額 ¥2,980",
      },
    ],
  },
  {
    envKey: "STRIPE_PRO_ANNUAL_PRICE_ID",
    productName: "成約コーチ AI Proプラン（年額）",
    productDescription: "無制限ロープレ、履歴保存、コーチモード、詳細スコア分析（年額で2ヶ月分お得）",
    prices: [
      {
        unitAmount: 29800,
        currency: "jpy",
        recurring: { interval: "year" },
        nickname: "Pro年額 ¥29,800",
      },
    ],
  },
  {
    envKey: "STRIPE_PROGRAM_PRICE_ID",
    productName: "成約コーチ AI 教育プログラム",
    productDescription: "5ステップメソッド22レッスン動画 + ワークシート + ロープレ3ヶ月無制限",
    prices: [
      {
        unitAmount: 49800,
        currency: "jpy",
        recurring: null, // 買い切り
        nickname: "教育プログラム ¥49,800",
      },
    ],
  },
];

// ── 既存商品の検索 ──
async function findExistingProduct(name) {
  const products = await stripe.products.list({ limit: 100, active: true });
  return products.data.find((p) => p.name === name);
}

async function findExistingPrice(productId, unitAmount, recurring) {
  const prices = await stripe.prices.list({
    product: productId,
    limit: 100,
    active: true,
  });
  return prices.data.find((price) => {
    if (price.unit_amount !== unitAmount) return false;
    if (recurring && !price.recurring) return false;
    if (!recurring && price.recurring) return false;
    if (recurring && price.recurring?.interval !== recurring.interval) return false;
    return true;
  });
}

// ── メイン処理 ──
async function main() {
  const results = [];

  for (const productDef of PRODUCTS) {
    console.log(`📦 処理中: ${productDef.productName}`);

    // 既存商品を検索
    let product = await findExistingProduct(productDef.productName);
    if (product) {
      console.log(`   ✓ 既存商品を使用: ${product.id}`);
    } else {
      product = await stripe.products.create({
        name: productDef.productName,
        description: productDef.productDescription,
      });
      console.log(`   ✓ 新規作成: ${product.id}`);
    }

    // 価格作成
    for (const priceDef of productDef.prices) {
      let price = await findExistingPrice(
        product.id,
        priceDef.unitAmount,
        priceDef.recurring
      );
      if (price) {
        console.log(`   ✓ 既存価格を使用: ${price.id} (${priceDef.nickname})`);
      } else {
        const priceParams = {
          product: product.id,
          unit_amount: priceDef.unitAmount,
          currency: priceDef.currency,
          nickname: priceDef.nickname,
        };
        if (priceDef.recurring) {
          priceParams.recurring = priceDef.recurring;
        }
        price = await stripe.prices.create(priceParams);
        console.log(`   ✓ 新規作成: ${price.id} (${priceDef.nickname})`);
      }

      results.push({
        envKey: productDef.envKey,
        priceId: price.id,
        nickname: priceDef.nickname,
      });
    }
    console.log("");
  }

  // ── 結果出力 ──
  console.log("════════════════════════════════════════════");
  console.log("✅ セットアップ完了");
  console.log("════════════════════════════════════════════\n");
  console.log("以下を .env.local に追加してください:\n");
  for (const r of results) {
    console.log(`${r.envKey}=${r.priceId}  # ${r.nickname}`);
  }
  console.log("\n本番環境（Vercel）にも同じ値を設定してください。\n");

  if (isTestMode) {
    console.log("⚠️  現在 TEST モードです。");
    console.log("    本番用の価格IDを作成するには STRIPE_SECRET_KEY を sk_live_... に変更してから再実行。\n");
  }
}

main().catch((err) => {
  console.error("\n❌ エラー:", err.message);
  process.exit(1);
});
