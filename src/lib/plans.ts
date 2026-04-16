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
  baseCredits: number | null; // 累計上限 (Free) / 月額クレジット数 (有料)
  bonusPercent: number; // 将来のキャンペーン用 (現在は全プラン0)
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
    monthlyCredits: 30,
    baseCredits: 30,
    bonusPercent: 0,
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
    monthlyCredits: 60,
    baseCredits: 60,
    bonusPercent: 0,
    recommended: true,
    ctaLabel: "申し込む",
    envKey: "STRIPE_PRO_PRICE_ID",
    features: [
      "学習コース全22レッスン",
      "業種別トークスクリプト全業種",
      "切り返し話法30パターン",
      "成約スコア全5カテゴリ + AI改善アドバイス",
      "メールサポート（48h以内回答）",
    ],
    description: "中堅・成果重視の営業向け",
  },
  {
    tier: "master",
    name: "マスタープラン",
    tagline: "トップセールス・営業マネージャー向け",
    price: 4980,
    monthlyCredits: 200,
    baseCredits: 200,
    bonusPercent: 0,
    recommended: false,
    ctaLabel: "申し込む",
    envKey: "STRIPE_MASTER_PRICE_ID",
    features: [
      "学習コース全22レッスン",
      "業種別トークスクリプト全業種",
      "切り返し話法30パターン",
      "成約スコア全5カテゴリ + AI改善アドバイス",
      "優先サポート（24h以内回答）",
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

/* ────────────────────────────────────────────────────────────
 * B2B チームプラン定義
 *
 * 人数帯ごとの4ティア。年契は月額から20%OFF。
 * 環境変数 (Stripe Price ID):
 *   STRIPE_TEAM_5_PRICE_ID   / STRIPE_TEAM_5_ANNUAL_PRICE_ID
 *   STRIPE_TEAM_10_PRICE_ID  / STRIPE_TEAM_10_ANNUAL_PRICE_ID
 *   STRIPE_TEAM_30_PRICE_ID  / STRIPE_TEAM_30_ANNUAL_PRICE_ID
 *   STRIPE_TEAM_50_PRICE_ID  / STRIPE_TEAM_50_ANNUAL_PRICE_ID
 * ──────────────────────────────────────────────────────────── */

export type TeamPlanTier = "team_5" | "team_10" | "team_30" | "team_50";

export interface TeamPlanDefinition {
  tier: TeamPlanTier;
  name: string;
  /** 人数帯の下限 */
  minMembers: number;
  /** 人数帯の上限 (null = 上限なし) */
  maxMembers: number | null;
  /** 月額単価 (税込・1人あたり) */
  pricePerUser: number;
  /** 年契月額単価 (税込・1人あたり、20%OFF) */
  annualPricePerUser: number;
  /** 1人あたりの月次ロープレクレジット (Infinity = 無制限) */
  creditsPerUser: number;
  features: string[];
  envKey: string;
  annualEnvKey: string;
}

export const TEAM_PLANS: TeamPlanDefinition[] = [
  {
    tier: "team_5",
    name: "Team",
    minMembers: 5,
    maxMembers: 9,
    pricePerUser: 1980,
    annualPricePerUser: 1584,
    creditsPerUser: 60,
    features: [
      "全22レッスン",
      "AIロープレ月60回/人",
      "成約スコア全5カテゴリ",
      "チーム管理ダッシュボード",
      "メンバー招待管理",
      "メールサポート",
    ],
    envKey: "STRIPE_TEAM_5_PRICE_ID",
    annualEnvKey: "STRIPE_TEAM_5_ANNUAL_PRICE_ID",
  },
  {
    tier: "team_10",
    name: "Business",
    minMembers: 10,
    maxMembers: 29,
    pricePerUser: 1480,
    annualPricePerUser: 1184,
    creditsPerUser: 60,
    features: [
      "全22レッスン",
      "AIロープレ月60回/人",
      "成約スコア全5カテゴリ",
      "チーム管理ダッシュボード",
      "メンバー招待管理",
      "請求書払い対応",
      "メールサポート",
    ],
    envKey: "STRIPE_TEAM_10_PRICE_ID",
    annualEnvKey: "STRIPE_TEAM_10_ANNUAL_PRICE_ID",
  },
  {
    tier: "team_30",
    name: "Enterprise",
    minMembers: 30,
    maxMembers: 49,
    pricePerUser: 980,
    annualPricePerUser: 784,
    creditsPerUser: 100,
    features: [
      "全22レッスン",
      "AIロープレ月100回/人",
      "成約スコア全5カテゴリ",
      "チーム管理ダッシュボード",
      "メンバー招待管理",
      "請求書払い対応",
      "優先サポート",
    ],
    envKey: "STRIPE_TEAM_30_PRICE_ID",
    annualEnvKey: "STRIPE_TEAM_30_ANNUAL_PRICE_ID",
  },
  {
    tier: "team_50",
    name: "Enterprise+",
    minMembers: 50,
    maxMembers: null,
    pricePerUser: 780,
    annualPricePerUser: 624,
    creditsPerUser: Infinity,
    features: [
      "全22レッスン",
      "AIロープレ無制限",
      "成約スコア全5カテゴリ",
      "チーム管理ダッシュボード",
      "メンバー招待管理",
      "請求書払い対応",
      "優先サポート",
      "専任カスタマーサクセス",
    ],
    envKey: "STRIPE_TEAM_50_PRICE_ID",
    annualEnvKey: "STRIPE_TEAM_50_ANNUAL_PRICE_ID",
  },
];

/**
 * 人数に基づいて最適なチームプランを返す
 */
export function getTeamPlanForSize(memberCount: number): TeamPlanDefinition {
  // 降順で最初にminMembers以上のものを探す
  for (let i = TEAM_PLANS.length - 1; i >= 0; i--) {
    if (memberCount >= TEAM_PLANS[i].minMembers) {
      return TEAM_PLANS[i];
    }
  }
  return TEAM_PLANS[0]; // fallback to smallest tier
}

export function getTeamPlan(tier: TeamPlanTier): TeamPlanDefinition {
  const plan = TEAM_PLANS.find((p) => p.tier === tier);
  if (!plan) throw new Error(`Unknown team plan tier: ${tier}`);
  return plan;
}

/**
 * TeamPlanTier から Stripe Price ID を取得
 */
export function getTeamPriceId(
  tier: TeamPlanTier,
  billing: "monthly" | "annual" = "monthly"
): string | null {
  const plan = getTeamPlan(tier);
  const key = billing === "annual" ? plan.annualEnvKey : plan.envKey;
  const value = process.env[key];
  return value ? value.trim() : null;
}
