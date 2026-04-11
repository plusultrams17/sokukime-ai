/**
 * 料金プラン定義 (Source of Truth)
 *
 * 2026-04-11: 4プラン構成へ移行完了
 *
 * 各プランの環境変数 (Stripe Price ID):
 * - STRIPE_STARTER_PRICE_ID  (スタータープラン ¥990)
 * - STRIPE_PRO_PRICE_ID      (プロプラン ¥1,980)
 * - STRIPE_MASTER_PRICE_ID   (マスタープラン ¥4,980)
 *
 * 統合済み:
 *   - Stripe webhook で plan_tier を metadata から読み取り (src/app/api/stripe/webhook/route.ts)
 *   - profiles.plan は free/starter/pro/master の enum
 *   - usage.ts に月次クレジット管理実装済み (Starter 30 / Pro 60 / Master 200、JST 暦月リセット)
 *   - lessons/access.ts でスターター以上を full access
 *
 * 値を変更するときは usage.ts の TIER_MONTHLY_CREDITS と同期すること。
 */

export type PlanTier = "free" | "starter" | "pro" | "master";

export interface PlanDefinition {
  tier: PlanTier;
  name: string;
  tagline: string;
  price: number; // 月額 (税込)
  monthlyCredits: number | null; // null = 累計のみ (Free)
  baseCredits: number | null; // 通常時のクレジット数 (キャンペーン適用前)
  bonusPercent: number; // 「今だけお得！」の増量率 (%)
  recommended: boolean;
  ctaLabel: string;
  features: string[];
  envKey?: string; // Stripe Price ID 環境変数キー
  description: string;
}

export const PLANS: PlanDefinition[] = [
  {
    tier: "free",
    name: "無料プラン",
    tagline: "まずは試してみたい方に",
    price: 0,
    monthlyCredits: null,
    baseCredits: 5, // 累計
    bonusPercent: 0,
    recommended: false,
    ctaLabel: "無料で始める",
    features: [
      "AIロープレ累計5回まで（生涯）",
      "基本3レッスン",
      "成約スコア1カテゴリ",
      "登録後すぐ利用可能",
      "クレジットカード不要",
    ],
    description: "AIロープレを体験",
  },
  {
    tier: "starter",
    name: "スタータープラン",
    tagline: "個人営業マン向け",
    price: 990,
    monthlyCredits: 30, // 通常20 + 50%
    baseCredits: 20,
    bonusPercent: 50,
    recommended: false,
    ctaLabel: "申し込む",
    envKey: "STRIPE_STARTER_PRICE_ID",
    features: [
      "学習コース全22レッスン",
      "業種別トークスクリプト全業種",
      "切り返し話法30パターン",
      "成約スコア全5カテゴリ",
      "メールサポート",
    ],
    description: "営業を学び始めた方向け",
  },
  {
    tier: "pro",
    name: "プロプラン",
    tagline: "本格的に営業力を伸ばしたい方向け",
    price: 1980,
    monthlyCredits: 60, // 通常40 + 50%
    baseCredits: 40,
    bonusPercent: 50,
    recommended: true,
    ctaLabel: "申し込む",
    envKey: "STRIPE_PRO_PRICE_ID",
    features: [
      "学習コース全22レッスン",
      "業種別トークスクリプト全業種",
      "切り返し話法30パターン",
      "成約スコア全5カテゴリ",
      "メールサポート",
    ],
    description: "中堅・成果重視の営業向け",
  },
  {
    tier: "master",
    name: "マスタープラン",
    tagline: "トップセールス・営業マネージャー向け",
    price: 4980,
    monthlyCredits: 200, // 通常100 + 100%
    baseCredits: 100,
    bonusPercent: 100,
    recommended: false,
    ctaLabel: "申し込む",
    envKey: "STRIPE_MASTER_PRICE_ID",
    features: [
      "学習コース全22レッスン",
      "業種別トークスクリプト全業種",
      "切り返し話法30パターン",
      "成約スコア全5カテゴリ",
      "メールサポート",
    ],
    description: "トップセールスを目指す方向け",
  },
];

export function getPlan(tier: PlanTier): PlanDefinition {
  const plan = PLANS.find((p) => p.tier === tier);
  if (!plan) throw new Error(`Unknown plan tier: ${tier}`);
  return plan;
}

/**
 * Tier から Stripe Price ID を取得
 * 環境変数が未設定の場合は null
 */
export function getPriceIdForTier(tier: PlanTier): string | null {
  const plan = getPlan(tier);
  if (!plan.envKey) return null;
  const value = process.env[plan.envKey];
  return value ? value.trim() : null;
}
