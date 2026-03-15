export type CancelReason =
  | "料金が高い"
  | "あまり使っていない"
  | "効果を感じない"
  | "他のツールを使っている"
  | "一時的に不要"
  | "その他";

export type OfferType =
  | "discount_25"
  | "pause"
  | "coaching"
  | "comparison"
  | "generic";

export interface CancelOffer {
  type: OfferType;
  title: string;
  description: string;
  discountPercent?: number;
  discountMonths?: number;
  pauseMonths?: number[];
  showAchievements: boolean;
}

const offerMap: Record<CancelReason, CancelOffer> = {
  "料金が高い": {
    type: "discount_25",
    title: "特別価格をご用意しました",
    description: "2ヶ月間 25%OFFでご利用いただけます",
    discountPercent: 25,
    discountMonths: 2,
    showAchievements: true,
  },
  "あまり使っていない": {
    type: "pause",
    title: "一時停止はいかがですか？",
    description: "データを保持したまま、最大3ヶ月間停止できます",
    pauseMonths: [1, 2, 3],
    showAchievements: false,
  },
  "効果を感じない": {
    type: "coaching",
    title: "もう一度試してみませんか？",
    description: "あなたのスコア推移を確認して、次のロープレに活かしましょう",
    showAchievements: true,
  },
  "他のツールを使っている": {
    type: "comparison",
    title: "成約コーチ AI だけの強み",
    description: "成約5ステップメソッドに基づくAIコーチングは他にありません",
    discountPercent: 25,
    discountMonths: 2,
    showAchievements: true,
  },
  "一時的に不要": {
    type: "pause",
    title: "一時停止がおすすめです",
    description: "必要になったらすぐ再開できます。データも保持されます",
    pauseMonths: [1, 2, 3],
    showAchievements: false,
  },
  "その他": {
    type: "generic",
    title: "ご不便をおかけして申し訳ありません",
    description: "よろしければ詳しい理由を教えてください",
    showAchievements: false,
  },
};

export const cancelReasons: CancelReason[] = [
  "料金が高い",
  "あまり使っていない",
  "効果を感じない",
  "他のツールを使っている",
  "一時的に不要",
  "その他",
];

export function getOfferForReason(reason: CancelReason): CancelOffer {
  return offerMap[reason] || offerMap["その他"];
}

/** 割引後の月額を計算 */
export function getDiscountedPrice(
  originalPrice: number,
  discountPercent: number
): number {
  return Math.round(originalPrice * (1 - discountPercent / 100));
}
