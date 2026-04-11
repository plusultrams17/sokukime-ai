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
 *
 * 現在アクティブなキャンペーンはありません。
 * この配列に Promotion オブジェクトを追加すると PromoBanner / pricing page /
 * Stripe checkout の自動クーポン適用が有効化されます。
 */
const CAMPAIGNS: Promotion[] = [];

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
