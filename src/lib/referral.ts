import { SupabaseClient } from "@supabase/supabase-js";

const CODE_PREFIX = "SK-";
const CODE_LENGTH = 8;
const CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // 紛らわしい文字(0,O,1,I)を除外

/** ランダム紹介コードを生成 */
export function generateReferralCode(): string {
  let code = "";
  for (let i = 0; i < CODE_LENGTH; i++) {
    code += CODE_CHARS.charAt(Math.floor(Math.random() * CODE_CHARS.length));
  }
  return `${CODE_PREFIX}${code}`;
}

export interface ReferralStats {
  totalReferrals: number;
  convertedToPro: number;
  totalRewardsEarned: number; // ¥
  pendingRewards: number;
}

/** ユーザーの紹介統計を取得 */
export async function getReferralStats(
  supabase: SupabaseClient,
  userId: string
): Promise<ReferralStats> {
  const { data: conversions } = await supabase
    .from("referral_conversions")
    .select("status")
    .eq("referrer_id", userId);

  if (!conversions || conversions.length === 0) {
    return {
      totalReferrals: 0,
      convertedToPro: 0,
      totalRewardsEarned: 0,
      pendingRewards: 0,
    };
  }

  const totalReferrals = conversions.length;
  const convertedToPro = conversions.filter(
    (c) => c.status === "converted_pro" || c.status === "rewarded"
  ).length;
  const rewarded = conversions.filter((c) => c.status === "rewarded").length;
  const pending = convertedToPro - rewarded;

  return {
    totalReferrals,
    convertedToPro,
    totalRewardsEarned: rewarded * 1000,
    pendingRewards: pending,
  };
}

/** 紹介コードの有効性を検証 */
export async function validateReferralCode(
  supabase: SupabaseClient,
  code: string,
  currentUserId?: string
): Promise<{ valid: boolean; referrerId?: string }> {
  const { data } = await supabase
    .from("referral_codes")
    .select("user_id")
    .eq("code", code.toUpperCase())
    .single();

  if (!data) {
    return { valid: false };
  }

  // 自分自身のコードは無効
  if (currentUserId && data.user_id === currentUserId) {
    return { valid: false };
  }

  return { valid: true, referrerId: data.user_id };
}

/** チーム割引ティア */
export const TEAM_DISCOUNT_TIERS = [
  { min: 3, max: 5, label: "チーム S", discount: 17, pricePerPerson: 2480 },
  { min: 6, max: 10, label: "チーム M", discount: 34, pricePerPerson: 1980 },
  { min: 11, max: Infinity, label: "チーム L", discount: 50, pricePerPerson: 1490 },
] as const;

export function getTeamDiscount(memberCount: number) {
  return TEAM_DISCOUNT_TIERS.find(
    (t) => memberCount >= t.min && memberCount <= t.max
  );
}
