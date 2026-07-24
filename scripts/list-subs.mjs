// 読み取り専用: アクティブなStripe契約を一覧表示（変更はしない）
import fs from "node:fs";
import Stripe from "stripe";

const env = fs.readFileSync(new URL("../.env.local", import.meta.url), "utf8");
const key = env.split("\n").find((l) => l.startsWith("STRIPE_SECRET_KEY="))?.split("=")[1]?.trim();
if (!key) { console.error("STRIPE_SECRET_KEY not found"); process.exit(1); }
const stripe = new Stripe(key);
console.log("mode:", key.startsWith("sk_live") ? "LIVE(本番)" : "TEST");

const subs = await stripe.subscriptions.list({ status: "all", limit: 100, expand: ["data.customer"] });
const rows = subs.data.filter((s) => ["active", "trialing", "past_due"].includes(s.status));
console.log(`アクティブ契約: ${rows.length}件\n`);
for (const s of rows) {
  const email = typeof s.customer === "object" ? s.customer.email : s.customer;
  const item = s.items.data[0];
  const amount = item?.price?.unit_amount ? `¥${item.price.unit_amount.toLocaleString()}` : "?";
  const created = new Date(s.created * 1000).toISOString().slice(0, 10);
  console.log(`${email}\t${s.status}\t${amount}\tprice=${item?.price?.id}\tsub=${s.id}\t作成=${created}`);
}
