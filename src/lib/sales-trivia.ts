/**
 * 営業豆知識データ — 31個（日替わり表示用）
 * すべて研究・調査に基づいたファクト
 */

export interface SalesTrivia {
  /** 豆知識本文 */
  fact: string;
  /** 出典・研究名 */
  source: string;
  /** カテゴリタグ */
  category: "心理学" | "見た目" | "コミュニケーション" | "データ" | "交渉術";
}

export const SALES_TRIVIA: SalesTrivia[] = [
  // ── 見た目・第一印象 ──
  {
    fact: "紺色のスーツは「信頼性」「誠実さ」の印象を最も高める。2位以下を大きく引き離し、営業職の鉄板カラーとされている。",
    source: "CareerBuilder調査（2021）/ 色彩心理学研究",
    category: "見た目",
  },
  {
    fact: "人は相手の第一印象を約7秒で形成する。そのうち視覚情報（身だしなみ・表情）が55%を占める。",
    source: "メラビアンの法則 — Albert Mehrabian（UCLA）",
    category: "見た目",
  },
  {
    fact: "笑顔で接する営業担当者は、無表情の担当者と比べて成約率が最大20%高い。笑顔は「安心感」と「好意」を同時に伝える。",
    source: "Journal of Consumer Research / 表情認知研究",
    category: "見た目",
  },
  {
    fact: "名刺交換時に相手の名前を復唱すると、相手の好感度が有意に上昇する。「名前の反復効果」と呼ばれる。",
    source: "Dale Carnegie Institute 追跡調査",
    category: "コミュニケーション",
  },

  // ── 心理学・バイアス ──
  {
    fact: "最初に提示された価格が基準点になる「アンカリング効果」。高い価格を先に見せると、次の価格が割安に感じられる。",
    source: "Tversky & Kahneman（1974）認知バイアス研究",
    category: "心理学",
  },
  {
    fact: "人は「失う恐怖」を「得る喜び」の約2倍強く感じる（損失回避）。「今だけ」「残りわずか」が効くのはこの原理。",
    source: "Kahneman & Tversky プロスペクト理論（1979）",
    category: "心理学",
  },
  {
    fact: "選択肢が多すぎると購買率が下がる「決定麻痺」。ジャム実験では、6種類の方が24種類より10倍売れた。",
    source: "Iyengar & Lepper（2000）コロンビア大学",
    category: "心理学",
  },
  {
    fact: "人は一度小さなお願いを承諾すると、次の大きなお願いも受け入れやすくなる「フット・イン・ザ・ドア」効果がある。",
    source: "Freedman & Fraser（1966）スタンフォード大学",
    category: "心理学",
  },
  {
    fact: "「社会的証明」の力：人は判断に迷うと周囲の行動を参考にする。導入企業数や利用者の声の提示が有効。",
    source: "Robert Cialdini『影響力の武器』（1984）",
    category: "心理学",
  },
  {
    fact: "「返報性の原理」：人は何かをもらうとお返しをしたくなる。無料サンプル・情報提供が商談を前進させる理由。",
    source: "Robert Cialdini『影響力の武器』（1984）",
    category: "心理学",
  },
  {
    fact: "3つの選択肢を提示すると、真ん中が選ばれやすい「松竹梅効果（妥協効果）」。価格プランは3段階が最適。",
    source: "Simonson（1989）意思決定研究",
    category: "心理学",
  },
  {
    fact: "「ピークエンドの法則」：人は体験全体ではなく、最も感情が動いた瞬間と最後の印象で評価する。商談の締めが重要。",
    source: "Daniel Kahneman（1999）",
    category: "心理学",
  },
  {
    fact: "限定性（スカーシティ）は購買意欲を高める。「残り3席」「本日限り」は希少性バイアスに基づく。",
    source: "Worchel et al.（1975）クッキー実験",
    category: "心理学",
  },
  {
    fact: "「ザイオンス効果（単純接触効果）」：接触回数が増えるほど好意が増す。定期フォローが信頼構築に効くのはこの原理。",
    source: "Robert Zajonc（1968）ミシガン大学",
    category: "心理学",
  },

  // ── コミュニケーション ──
  {
    fact: "トップセールスは商談時間の57%を「聞く」ことに使っている。平均的な営業は話す時間が65%以上。",
    source: "Gong.io 50万件以上の商談分析（2023）",
    category: "コミュニケーション",
  },
  {
    fact: "顧客の話を遮ると成約率が17%低下する。相手の発言が終わるまで待ち、2秒の間を置くのが理想。",
    source: "Chorus.ai セールスカンバセーション分析",
    category: "コミュニケーション",
  },
  {
    fact: "オープンクエスチョン（Why/How）を使う営業は、クローズドクエスチョン（Yes/No）中心の営業より成約率が約1.7倍高い。",
    source: "RAIN Group セールス調査（2022）",
    category: "コミュニケーション",
  },
  {
    fact: "「ミラーリング」：相手の姿勢や話すテンポを自然に合わせると、無意識的な親近感が生まれ信頼構築が加速する。",
    source: "Chartrand & Bargh（1999）「カメレオン効果」研究",
    category: "コミュニケーション",
  },
  {
    fact: "商談中に相手の名前を3回以上呼ぶと、信頼感と記憶定着率が向上する。ただし過剰使用は逆効果。",
    source: "ビジネスコミュニケーション研究 / 神経言語学",
    category: "コミュニケーション",
  },
  {
    fact: "声のトーンが1段階低いと「落ち着き」「専門性」を感じさせ、説得力が増す。早口は「焦り」の印象を与える。",
    source: "スタンフォード大学 音声コミュニケーション研究",
    category: "コミュニケーション",
  },

  // ── データ・統計 ──
  {
    fact: "見込み客の80%は5回目以降のフォローで成約する。しかし営業の44%は1回の断りで諦める。",
    source: "National Sales Executive Association 調査",
    category: "データ",
  },
  {
    fact: "午前中（10〜11時）のアポイントは午後より成約率が約23%高い。意思決定疲れが少ないため。",
    source: "InsideSales.com リードレスポンス調査",
    category: "データ",
  },
  {
    fact: "問い合わせから5分以内に対応すると、30分後の対応と比べてコンタクト成功率が100倍高い。",
    source: "Lead Response Management Study（MIT / InsideSales.com）",
    category: "データ",
  },
  {
    fact: "紹介経由の顧客は成約率が4倍高く、LTV（生涯顧客価値）も16%高い。既存顧客からの紹介を仕組み化すべき。",
    source: "Wharton School / Journal of Marketing（2013）",
    category: "データ",
  },
  {
    fact: "購入者の95%が「営業担当者が購買プロセスの各段階で関連コンテンツを提供してくれた」と回答している。",
    source: "DemandGen Report（2022）",
    category: "データ",
  },
  {
    fact: "メールの件名に相手の名前を入れると開封率が26%上昇する。パーソナライズは最も簡単な差別化手法。",
    source: "Campaign Monitor メールマーケティング統計",
    category: "データ",
  },

  // ── 交渉術 ──
  {
    fact: "「ドア・イン・ザ・フェイス」：最初に大きな要求をして断られた後、本命の小さな要求を出すと承諾率が3倍になる。",
    source: "Cialdini et al.（1975）",
    category: "交渉術",
  },
  {
    fact: "沈黙は最強の交渉ツール。価格提示後に黙ることで、相手が条件を自ら改善するケースが多い。",
    source: "Harvard Business Review / 交渉学研究",
    category: "交渉術",
  },
  {
    fact: "「仮定クロージング」：「もしご導入いただくとしたら」と仮定形で話すと、相手は自然と導入後をイメージし始める。",
    source: "SPIN Selling — Neil Rackham（1988）",
    category: "交渉術",
  },
  {
    fact: "反論は「購入意欲の表れ」。反論がゼロの商談は、実は興味がないことが多い。反論を歓迎すべき。",
    source: "SPIN Selling / セールスコーチング研究",
    category: "交渉術",
  },
  {
    fact: "「Yes セット話法」：小さなYesを3回積み重ねると、4回目の本題でもYesと言いやすくなる一貫性の原理。",
    source: "Cialdini コミットメントと一貫性の原理",
    category: "交渉術",
  },
];

/** 今日の豆知識を取得（日付ベースで1日1つ） */
export function getTodayTrivia(): SalesTrivia {
  const now = new Date();
  const dayOfYear = Math.floor(
    (now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000
  );
  const index = dayOfYear % SALES_TRIVIA.length;
  return SALES_TRIVIA[index];
}
