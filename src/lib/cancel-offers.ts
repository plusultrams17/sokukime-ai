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

// ──────────────────────────────────────────────────────────
// 解約引き留め割引オファーの運用ポリシー
// ──────────────────────────────────────────────────────────
// 現段階（Pro user数が少ない初期フェーズ）は OFF。
// 理由:
//   1. 「解約時に値引き」は、セールスコーチAIのブランド
//      （誠実・王道）と矛盾する
//   2. SNSで「解約しようとしたら安くなった」と拡散される
//      リスクが高い（フォロワー少ない今は特に危険）
//   3. 正規ユーザーの不公平感を生む
//   4. 解約理由を純粋にヒアリングする方が今は価値が高い
//
// 有効化タイミング:
//   Pro user が 100人以上になり、
//   解約率（churn）を正確に測れるようになってから再評価する。
// ──────────────────────────────────────────────────────────
const DISCOUNT_OFFERS_ENABLED = false;

// 割引 ON 時のマップ（将来再開するとき用に保持）
const discountEnabledMap: Record<CancelReason, CancelOffer> = {
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
    title: "成約コーチAI だけの強み",
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

// 割引 OFF 時のマップ（現在有効）
// 「料金が高い」「他のツールを使っている」の割引オファーを
// 一時停止／フィードバック収集に置き換え
const discountDisabledMap: Record<CancelReason, CancelOffer> = {
  "料金が高い": {
    type: "pause",
    title: "一時停止はいかがですか？",
    description:
      "厳しい時期は最大3ヶ月間停止できます。データもすべて保持されます",
    pauseMonths: [1, 2, 3],
    showAchievements: false,
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
    type: "generic",
    title: "教えていただきありがとうございます",
    description:
      "よろしければ、どのツールに移行されますか？今後の改善に活かします",
    showAchievements: false,
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

const offerMap: Record<CancelReason, CancelOffer> = DISCOUNT_OFFERS_ENABLED
  ? discountEnabledMap
  : discountDisabledMap;

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
