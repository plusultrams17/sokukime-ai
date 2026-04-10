// 既存のPro課金ユーザーに対して、Stripeから遡及的にクーポンIDを取得して
// profiles.checkout_coupon_id に反映するバックフィルスクリプト
//
// アプローチ:
//   1. Subscription.discounts をチェック（現在適用中のクーポン）
//   2. 見つからなければ Invoice履歴から過去のdiscount適用を探す
//      （duration: "once" のクーポンは初月後に剥がれるため）
//
// 実行前に migrations/002_add_checkout_coupon_id.sql を Supabase で実行しておくこと
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

const stripe = new Stripe(env.STRIPE_SECRET_KEY);
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

console.log("\n=== checkout_coupon_id バックフィル開始 ===\n");

const { data: proUsers, error } = await supabase
  .from("profiles")
  .select("id, email, stripe_customer_id, stripe_subscription_id, checkout_coupon_id")
  .eq("plan", "pro")
  .eq("is_tester", false)
  .not("stripe_customer_id", "is", null);

if (error) {
  console.error("Supabase query failed:", error);
  process.exit(1);
}

console.log(`対象: ${proUsers.length} 人のPro課金ユーザー\n`);

let updated = 0;
let skipped = 0;
let noCoupon = 0;
let failed = 0;

for (const user of proUsers) {
  if (user.checkout_coupon_id) {
    console.log(`⏭️  ${user.email}: 既に ${user.checkout_coupon_id} が設定済み`);
    skipped++;
    continue;
  }

  let couponId = null;
  let appliedAt = null;

  try {
    // ── 方法1: 現在のSubscription discounts ──
    if (user.stripe_subscription_id) {
      const sub = await stripe.subscriptions.retrieve(user.stripe_subscription_id, {
        expand: ["discounts"],
      });
      for (const d of sub.discounts || []) {
        if (typeof d === "string") continue;
        const src = d.source;
        if (src?.coupon) {
          couponId = typeof src.coupon === "string" ? src.coupon : src.coupon.id;
          appliedAt = new Date(d.start * 1000).toISOString();
          break;
        }
      }
    }

    // ── 方法2: Invoice履歴から過去の discount を探す（duration: "once" 対応）──
    if (!couponId) {
      const invoices = await stripe.invoices.list({
        customer: user.stripe_customer_id,
        limit: 20,
      });
      for (const inv of invoices.data) {
        // total_discount_amounts は各 discount の適用金額を持つ
        const discounts = inv.discounts || [];
        if (discounts.length > 0) {
          // discount IDを取得し、retrieveで中身を見る
          for (const discRef of discounts) {
            const discId = typeof discRef === "string" ? discRef : discRef.id;
            if (!discId) continue;
            try {
              // Invoice経由でdiscountを取得するにはinvoice.discountsをexpandする必要がある
              const expandedInv = await stripe.invoices.retrieve(inv.id, {
                expand: ["discounts"],
              });
              for (const d of expandedInv.discounts || []) {
                if (typeof d === "string") continue;
                const src = d.source;
                if (src?.coupon) {
                  couponId =
                    typeof src.coupon === "string" ? src.coupon : src.coupon.id;
                  appliedAt = new Date(d.start * 1000).toISOString();
                  break;
                }
              }
            } catch {
              // continue
            }
            if (couponId) break;
          }
        }
        if (couponId) break;
      }
    }

    // ── 方法3: Checkout Session 履歴から探す（最終手段）──
    if (!couponId) {
      const sessions = await stripe.checkout.sessions.list({
        customer: user.stripe_customer_id,
        limit: 10,
        expand: ["data.total_details.breakdown.discounts"],
      });
      for (const s of sessions.data) {
        const breakdownDiscounts = s.total_details?.breakdown?.discounts || [];
        if (breakdownDiscounts.length > 0) {
          const first = breakdownDiscounts[0];
          const disc = first.discount;
          if (disc?.coupon) {
            couponId =
              typeof disc.coupon === "string" ? disc.coupon : disc.coupon.id;
            appliedAt = new Date(s.created * 1000).toISOString();
            break;
          }
        }
      }
    }

    if (!couponId) {
      console.log(`➖  ${user.email}: クーポン未使用（全方法で見つからず）`);
      noCoupon++;
      continue;
    }

    const { error: updErr } = await supabase
      .from("profiles")
      .update({
        checkout_coupon_id: couponId,
        checkout_coupon_applied_at: appliedAt || new Date().toISOString(),
      })
      .eq("id", user.id);

    if (updErr) {
      console.error(`❌ ${user.email}: 更新失敗 -`, updErr.message);
      failed++;
    } else {
      console.log(`✅ ${user.email}: ${couponId} を記録`);
      updated++;
    }
  } catch (err) {
    console.error(`❌ ${user.email}: Stripe取得失敗 -`, err.message);
    failed++;
  }
}

console.log("\n=== バックフィル結果 ===");
console.log(`  ✅ 更新: ${updated} 人`);
console.log(`  ⏭️  スキップ（既設定）: ${skipped} 人`);
console.log(`  ➖ クーポン未使用: ${noCoupon} 人`);
console.log(`  ❌ 失敗: ${failed} 人`);
console.log("");
