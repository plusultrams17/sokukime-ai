/**
 * Soul System -- Dark Souls inspired gamification for 成約コーチAI
 *
 * ソウル (Soul Points):
 *   D rank (0-39):   50 souls
 *   C rank (40-59):  100 souls
 *   B rank (60-79):  200 souls
 *   A rank (80-89):  400 souls
 *   S rank (90-100): 1000 souls
 *
 * ソウルレベル (Soul Level):
 *   SL = floor(sqrt(totalSouls / 50))
 *   Next level requires: ((SL+1)^2) * 50 total souls
 *
 * 篝火 (Bonfires):
 *   A session scoring A rank (80+) = 1 bonfire lit
 *
 * パリィ成功率 (Parry Rate):
 *   Average of 反論処理 category scores across all scored sessions
 */

import type { Grade } from "./grade";

// ---------------------------------------------------------------------------
// Soul points per grade
// ---------------------------------------------------------------------------

const SOUL_POINTS: Record<Grade, number> = {
  S: 1000,
  A: 400,
  B: 200,
  C: 100,
  D: 50,
};

export function getSoulPoints(grade: Grade): number {
  return SOUL_POINTS[grade] ?? 50;
}

export function getSoulPointsFromScore(score: number): number {
  if (score >= 90) return SOUL_POINTS.S;
  if (score >= 80) return SOUL_POINTS.A;
  if (score >= 60) return SOUL_POINTS.B;
  if (score >= 40) return SOUL_POINTS.C;
  return SOUL_POINTS.D;
}

// ---------------------------------------------------------------------------
// Soul Level calculation
// ---------------------------------------------------------------------------

const SOUL_LEVEL_FACTOR = 50;

export function getSoulLevel(totalSouls: number): number {
  return Math.floor(Math.sqrt(totalSouls / SOUL_LEVEL_FACTOR));
}

export function getSoulsForLevel(level: number): number {
  return level * level * SOUL_LEVEL_FACTOR;
}

export interface SoulLevelInfo {
  level: number;
  totalSouls: number;
  currentLevelSouls: number;  // souls needed to reach current level
  nextLevelSouls: number;     // souls needed to reach next level
  soulsToNext: number;        // remaining souls to next level
  progress: number;           // 0-100 progress to next level
}

export function getSoulLevelInfo(totalSouls: number): SoulLevelInfo {
  const level = getSoulLevel(totalSouls);
  const currentLevelSouls = getSoulsForLevel(level);
  const nextLevelSouls = getSoulsForLevel(level + 1);
  const rangeSize = nextLevelSouls - currentLevelSouls;
  const soulsInRange = totalSouls - currentLevelSouls;
  const soulsToNext = nextLevelSouls - totalSouls;
  const progress = rangeSize > 0 ? Math.min(100, Math.round((soulsInRange / rangeSize) * 100)) : 100;

  return { level, totalSouls, currentLevelSouls, nextLevelSouls, soulsToNext, progress };
}

// ---------------------------------------------------------------------------
// Bonfires -- sessions with A rank or above (score >= 80)
// ---------------------------------------------------------------------------

export function countBonfires(scores: number[]): number {
  return scores.filter((s) => s >= 80).length;
}

// ---------------------------------------------------------------------------
// Parry Rate -- average 反論処理 score
// ---------------------------------------------------------------------------

export function calcParryRate(objectionScores: number[]): number {
  if (objectionScores.length === 0) return 0;
  return Math.round(objectionScores.reduce((a, b) => a + b, 0) / objectionScores.length);
}

// ---------------------------------------------------------------------------
// Battle Result -- 商談不成立 / 商談成立 / 完全成約
// ---------------------------------------------------------------------------

export type BattleResult = "defeat" | "victory" | "perfect";

export interface BattleResultInfo {
  result: BattleResult;
  title: string;
  subtitle: string;
  colorClass: string;      // Tailwind text color
  bgClass: string;         // Tailwind bg color
  borderClass: string;     // Tailwind border color
}

export function getBattleResult(score: number): BattleResultInfo {
  if (score >= 80) {
    return {
      result: "perfect",
      title: "完 全 成 約",
      subtitle: "見事な営業力だ。次のボスが待っている。",
      colorClass: "text-green-400",
      bgClass: "bg-green-500/10",
      borderClass: "border-green-500/30",
    };
  }
  if (score >= 60) {
    return {
      result: "victory",
      title: "商 談 成 立",
      subtitle: "成約には至ったが、まだ上がある。",
      colorClass: "text-yellow-400",
      bgClass: "bg-yellow-500/10",
      borderClass: "border-yellow-500/30",
    };
  }
  return {
    result: "defeat",
    title: "商 談 不 成 立",
    subtitle: "でも、経験値は残る",
    colorClass: "text-red-400",
    bgClass: "bg-red-500/10",
    borderClass: "border-red-500/30",
  };
}

// ---------------------------------------------------------------------------
// Defeat Cause -- 敗因 analysis
// ---------------------------------------------------------------------------

export function getDefeatCause(
  categories: { name: string; score: number }[]
): { category: string; reason: string } | null {
  if (categories.length === 0) return null;
  const weakest = [...categories].sort((a, b) => a.score - b.score)[0];

  const reasons: Record<string, string> = {
    "アプローチ": "信頼構築が不十分。ゴール共有で相手の心を開け。",
    "ヒアリング": "顧客の本質課題を掘り下げられていない。深掘り質問を。",
    "プレゼン": "価値伝達が弱い。特徴をベネフィットに変換せよ。",
    "クロージング": "提案の言い切りが弱い。自信を持って訴求せよ。",
    "反論処理": "切り返しのパターンが未習得。共感→確認→根拠→行動。",
  };

  return {
    category: weakest.name,
    reason: reasons[weakest.name] || `${weakest.name}の強化が必要。`,
  };
}

// ---------------------------------------------------------------------------
// Boss Customers
// ---------------------------------------------------------------------------

export interface BossCustomer {
  id: string;
  name: string;
  title: string;
  description: string;
  difficulty: string;       // maps to customer persona value
  customerType: string;     // maps to customerType
  phases: string[];         // 3-phase description
  victoryScore: number;     // score needed to "defeat" this boss
  soulReward: number;       // bonus souls for defeating
  systemPromptExtra: string; // additional system prompt for AI customer
}

export const BOSS_CUSTOMERS: BossCustomer[] = [
  {
    id: "silent_giant",
    name: "沈黙の巨人",
    title: "大手メーカー 事業部長",
    description: "何を言っても「ふーん」「で？」しか返さない。沈黙の圧に耐えて質問で崩せ。",
    difficulty: "silent",
    customerType: "manager",
    phases: [
      "第1フェーズ: 無反応の壁 -- 丁寧に聞いているが反応はゼロ。焦って早口になると負け。",
      "第2フェーズ: 一言の刃 -- 「で、結局何が言いたいの？」と口を開く。ここが攻撃チャンス。",
      "第3フェーズ: 逃走の構え -- 興味を示し始めるが「上に確認する」と逃げようとする。追撃せよ。",
    ],
    victoryScore: 80,
    soulReward: 500,
    systemPromptExtra: `【ボス顧客モード: 沈黙の巨人】
あなたは大手メーカーの事業部長です。非常に寡黙で、営業マンの話に対して最小限の反応しかしません。
- 序盤（最初の3ターン）: 「ふーん」「はい」「それで？」のような短い返答のみ。表情は読めない。
- 中盤（4-6ターン）: 営業マンが核心的な質問をしてきたら、ようやく「で、結局何が言いたいの？」「うちにどんなメリットがあるの？」と本音を少し見せる。
- 終盤（7ターン以降）: 価値を感じ始めたら「まあ、検討はしてもいいけど」と譲歩するが、「上に確認しないと」と逃げようとする。
絶対に自分から話を広げない。営業マンが質問しない限り情報は出さない。沈黙を恐れない。`,
  },
  {
    id: "price_guardian",
    name: "価格の番人",
    title: "中堅企業 購買部長",
    description: "全ての提案を「高い」で返す。価格ではなく価値で勝負しろ。",
    difficulty: "skeptical",
    customerType: "manager",
    phases: [
      "第1フェーズ: 価格の壁 -- 最初から「いくら？」と聞いてくる。先に答えると不利になる。",
      "第2フェーズ: コスト攻撃 -- 「その金額なら他社でもできる」と競合を持ち出す。差別化で対抗。",
      "第3フェーズ: 値引き要求 -- 「もう少し安くなれば考える」と値引き交渉。価値の上乗せで対抗せよ。",
    ],
    victoryScore: 80,
    soulReward: 500,
    systemPromptExtra: `【ボス顧客モード: 価格の番人】
あなたは購買部長で、コスト削減が最大のミッションです。
- 序盤: 挨拶もそこそこに「で、いくらなの？」と価格を聞く。営業マンが価格を先に言ったら「高いね」と一蹴する。
- 中盤: 価値説明をされても「それは分かるけど、同じようなの他社でもあるでしょ？」「A社は3割安いよ」と競合比較で揺さぶる。
- 終盤: 価値を認め始めても「もう少し勉強してくれたら考えるよ」と値引きを迫る。
常にコスト意識が最優先。ROIを具体的に示されないと動かない。感情論は通じない。`,
  },
  {
    id: "fog_of_consideration",
    name: "検討の霧",
    title: "IT企業 課長",
    description: "「持ち帰って検討します」を何度でも繰り返す。決裁フローを見極めてキーマンを突け。",
    difficulty: "cautious",
    customerType: "manager",
    phases: [
      "第1フェーズ: 興味の仮面 -- 「面白いですね」「良さそうですね」と好意的だが、全て社交辞令。",
      "第2フェーズ: 検討の繰り返し -- 「上に相談してみます」「社内で検討します」と先送り。決裁者は誰かを特定せよ。",
      "第3フェーズ: 逃げの一手 -- 「今期は予算が...」「来期なら...」と時間軸で逃げる。今決める理由を作れ。",
    ],
    victoryScore: 80,
    soulReward: 500,
    systemPromptExtra: `【ボス顧客モード: 検討の霧】
あなたはIT企業の課長で、自分で決裁できないことを隠しながら商談に臨んでいます。
- 序盤: 「へー、面白いですね」「良い製品ですね」と好意的な反応を見せるが、全て社交辞令。本当の評価は言わない。
- 中盤: 具体的な話になると「一度持ち帰って検討しますね」「上にも相談してみないと」と先送りする。実は上司（部長）が真の決裁者。
- 終盤: 追い詰められると「今期の予算がもう...」「来期の計画に組み込めれば」と時間軸で逃げる。
自分の意見を明確に言わない。常に曖昧な返答。リスクを取ることを極端に嫌う。`,
  },
  {
    id: "comparison_dragon",
    name: "比較の竜",
    title: "製造業 調達部長",
    description: "競合3社と天秤にかけてくる。独自の価値を刺して勝ち取れ。",
    difficulty: "skeptical",
    customerType: "manager",
    phases: [
      "第1フェーズ: 情報収集 -- 「他にもいくつか見てるんだけど」とプレッシャーをかける。",
      "第2フェーズ: 比較攻撃 -- 「A社はこの機能がある」「B社はもっと安い」と具体的に比較を突きつける。",
      "第3フェーズ: 最終選考 -- 「最終的に1社に絞りたいんだけど、御社を選ぶ理由を教えて」と決定打を求める。",
    ],
    victoryScore: 80,
    soulReward: 500,
    systemPromptExtra: `【ボス顧客モード: 比較の竜】
あなたは製造業の調達部長で、必ず3社以上を比較検討してから決定するプロの調達者です。
- 序盤: 「今回、御社含めて4社に話を聞いてるんですが」と冒頭で宣言。常に比較意識をチラつかせる。
- 中盤: 「A社はAI機能が充実してるんですよね」「B社は価格が2割安い」「C社は導入実績が豊富」と具体的な競合情報を出して揺さぶる。営業マンの反応を見ている。
- 終盤: 「正直、どこも一長一短なんですよ。御社を選ぶ決定的な理由は？」とストレートに聞く。
数字とデータで話す。感情的な訴求は効きにくい。論理的な差別化を求める。`,
  },
  {
    id: "wall_of_status_quo",
    name: "既存の壁",
    title: "老舗企業 代表取締役",
    description: "「今の業者で満足してます」と鉄壁のガード。潜在的な不満を引き出して切り崩せ。",
    difficulty: "low-energy",
    customerType: "owner",
    phases: [
      "第1フェーズ: 門前払い -- 「うちは今の業者さんと長い付き合いだから」と最初から拒否姿勢。",
      "第2フェーズ: 微かな隙 -- 「まあ、不満がないわけじゃないけど...」とポロッと本音が漏れる瞬間がある。",
      "第3フェーズ: 義理の壁 -- 「確かにいいかもしれないけど、今の業者さんに申し訳ない」と義理人情で躊躇。",
    ],
    victoryScore: 80,
    soulReward: 500,
    systemPromptExtra: `【ボス顧客モード: 既存の壁】
あなたは老舗企業の社長で、現在の取引先と10年以上の付き合いがあります。
- 序盤: 「うちは○○さん（現業者）と長い付き合いだからね。特に困ってないよ」と門前払い。新しい業者に興味がないことを態度で示す。
- 中盤: 巧みな質問をされると「まあ...レスポンスが遅いことはあるけど」「たまに品質にバラつきはあるかな」とポロッと不満が漏れる。でもすぐ「でもまあ、長い付き合いだし」とフォローする。
- 終盤: 価値を認めても「気持ちは分かるけど、今の業者さんを切るのは人としてね...」と義理人情を持ち出す。
変化を嫌う。「今のままで十分」が口癖。潜在的な不満はあるが、自分から認めたくない。`,
  },
];

export function getBossById(id: string): BossCustomer | undefined {
  return BOSS_CUSTOMERS.find((b) => b.id === id);
}
