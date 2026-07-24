// ライトのPrice IDで実際にcheckout sessionが作れるか検証（課金なし・URL生成のみ）
import fs from "node:fs";
import Stripe from "stripe";
const env = fs.readFileSync(new URL("../.env.local", import.meta.url), "utf8");
const get = (k) => env.split("\n").find((l) => l.startsWith(k + "="))?.split("=").slice(1).join("=").trim();
const stripe = new Stripe(get("STRIPE_SECRET_KEY"));
for (const [label, k] of [["ライト","STRIPE_STARTER_PRICE_ID"],["プロ","STRIPE_PRO_PRICE_ID"],["無制限","STRIPE_MASTER_PRICE_ID"],["プロ年額","STRIPE_PRO_ANNUAL_PRICE_ID"]]) {
  const priceId = get(k);
  try {
    const price = await stripe.prices.retrieve(priceId);
    const s = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: "https://seiyaku-coach.vercel.app/",
      cancel_url: "https://seiyaku-coach.vercel.app/pricing",
    });
    console.log(`OK  ${label}\t${k}=${priceId}\t¥${price.unit_amount?.toLocaleString()}\tactive=${price.active}\tsession=${s.id.slice(0,20)}`);
  } catch (e) {
    console.log(`NG  ${label}\t${k}=${priceId}\tERROR: ${e.message}`);
  }
}
