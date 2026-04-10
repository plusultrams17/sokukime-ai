export interface Promotion {
  id: string;
  name: string;
  message: string;
  discountPrice: number;
  originalPrice: number;
  startDate: string; // ISO date string (YYYY-MM-DD)
  endDate: string;   // ISO date string (YYYY-MM-DD)
  ctaText: string;
  ctaUrl: string;
  stripeCouponId?: string;
}

/**
 * Hardcoded seasonal campaigns.
 * Add new campaigns here as needed.
 */
const CAMPAIGNS: Promotion[] = [
  {
    id: "launch2026",
    name: "ローンチ記念キャンペーン",
    message: "先着100名限定！Proプランが初月¥980（67%OFF）",
    discountPrice: 980,
    originalPrice: 2980,
    startDate: "2026-04-10",
    endDate: "2026-05-10",
    ctaText: "初月¥980で始める",
    ctaUrl: "/pricing",
    stripeCouponId: "launch2026_67off",
  },
  {
    id: "spring2026",
    name: "春の営業力UPキャンペーン",
    message: "4月限定！Proプランが初月¥1,980",
    discountPrice: 1980,
    originalPrice: 2980,
    startDate: "2026-04-01",
    endDate: "2026-04-30",
    ctaText: "キャンペーン価格で始める",
    ctaUrl: "/pricing",
    stripeCouponId: "spring2026_1000off",
  },
  {
    id: "summer2026",
    name: "夏の集中トレーニングキャンペーン",
    message: "7月限定！Proプランが初月¥1,980",
    discountPrice: 1980,
    originalPrice: 2980,
    startDate: "2026-07-01",
    endDate: "2026-07-31",
    ctaText: "夏の特別価格で始める",
    ctaUrl: "/pricing",
    stripeCouponId: "summer2026_1000off",
  },
];

/**
 * Get the currently active promotion, if any.
 * Returns null if no campaign is active right now.
 */
export function getActivePromotion(): Promotion | null {
  const now = new Date();
  const today = now.toISOString().split("T")[0];

  for (const campaign of CAMPAIGNS) {
    if (today >= campaign.startDate && today <= campaign.endDate) {
      return campaign;
    }
  }

  return null;
}

/**
 * Get remaining time until campaign ends.
 */
export function getCampaignTimeRemaining(endDate: string): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
} {
  const end = new Date(endDate + "T23:59:59+09:00"); // JST
  const now = new Date();
  const diff = Math.max(0, end.getTime() - now.getTime());

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000),
  };
}
