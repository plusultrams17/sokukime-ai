/**
 * 料金プラン定義 (Source of Truth)
 *
 * 2026-04-11: 4プラン構成へ移行完了
 * 2026-07-24: 料金リニューアル（値上げ＋名称刷新）。tierキーは維持＝課金ロジック無変更。
 *
 * 各プランの環境変数 (Stripe Price ID):
 * - STRIPE_STARTER_PRICE_ID  (ライトプラン ¥2,980)
 * - STRIPE_PRO_PRICE_ID      (プロプラン ¥6,980)
 * - STRIPE_MASTER_PRICE_ID   (無制限プラン ¥14,800)
 *
 * 統合済み:
 *   - Stripe webhook で plan_tier を metadata から読み取り (src/app/api/stripe/webhook/route.ts)
 *   - profiles.plan は free/starter/pro/master の enum
 *   - usage.ts に月次クレジット管理実装済み (ライト 30 / プロ 100 / 無制限 300、JST 暦月リセット)
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
    name: "フリー",
    tagline: "まずは試してみたい方に",
    price: 0,
    monthlyCredits: null,
    baseCredits: 5, // 累計
    bonusPercent: 0,
    recommended: false,
    ctaLabel: "無料で5回試す",
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
    name: "ライト",
    tagline: "個人営業マン向け",
    price: 2980,
    monthlyCredits: 30,
    baseCredits: 30,
    bonusPercent: 0,
    recommended: false,
    ctaLabel: "ライトを申し込む",
    envKey: "STRIPE_STARTER_PRICE_ID",
    features: [
      "AIロープレ月30回",
      "学習コース全22レッスン",
      "業種別トークスクリプト全業種",
      "切り返し話法30パターン",
      "成約スコア全5カテゴリ",
      "メールサポート",
    ],
    description: "週1〜2回、着実に練習したい方向け",
  },
  {
    tier: "pro",
    name: "プロ",
    tagline: "本格的に営業力を伸ばしたい方向け",
    price: 6980,
    monthlyCredits: 100,
    baseCredits: 100,
    bonusPercent: 0,
    recommended: true,
    ctaLabel: "プロを申し込む",
    envKey: "STRIPE_PRO_PRICE_ID",
    features: [
      "AIロープレ月100回",
      "学習コース全22レッスン",
      "業種別トークスクリプト全業種",
      "切り返し話法30パターン",
      "成約スコア全5カテゴリ + AI改善アドバイス",
      "メールサポート（48h以内回答）",
    ],
    description: "毎日練習・商談前チェックまで使う本命プラン",
  },
  {
    tier: "master",
    name: "無制限",
    tagline: "トップセールス・営業マネージャー向け",
    price: 14800,
    monthlyCredits: 300,
    baseCredits: 300,
    bonusPercent: 0,
    recommended: false,
    ctaLabel: "無制限を申し込む",
    envKey: "STRIPE_MASTER_PRICE_ID",
    features: [
      "AIロープレ実質無制限（月300回まで）",
      "学習コース全22レッスン",
      "業種別トークスクリプト全業種",
      "切り返し話法30パターン",
      "成約スコア全5カテゴリ + AI改善アドバイス",
      "優先サポート（24h以内回答）",
    ],
    description: "回数を気にせず徹底的に練習したい方向け",
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
 * 人数帯ごとの3ティア（2026-07-24 料金リニューアル）。年契は月額から20%OFF。
 *   Team 5-9名 ¥2,980/人 ・ Business 10-29名 ¥2,480/人 ・ Enterprise 30名〜 ¥1,980/人
 * 環境変数 (Stripe Price ID):
 *   STRIPE_TEAM_5_PRICE_ID   / STRIPE_TEAM_5_ANNUAL_PRICE_ID
 *   STRIPE_TEAM_10_PRICE_ID  / STRIPE_TEAM_10_ANNUAL_PRICE_ID
 *   STRIPE_TEAM_30_PRICE_ID  / STRIPE_TEAM_30_ANNUAL_PRICE_ID
 * ──────────────────────────────────────────────────────────── */

export type TeamPlanTier = "team_5" | "team_10" | "team_30";

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
    pricePerUser: 2980,
    annualPricePerUser: 2384,
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
    pricePerUser: 2480,
    annualPricePerUser: 1984,
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
    maxMembers: null,
    pricePerUser: 1980,
    annualPricePerUser: 1584,
    creditsPerUser: 100,
    features: [
      "全22レッスン",
      "AIロープレ月100回/人",
      "成約スコア全5カテゴリ",
      "チーム管理ダッシュボード",
      "メンバー招待管理",
      "請求書払い対応",
      "優先サポート",
      "導入設定・運用レクチャー伴走",
    ],
    envKey: "STRIPE_TEAM_30_PRICE_ID",
    annualEnvKey: "STRIPE_TEAM_30_ANNUAL_PRICE_ID",
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
