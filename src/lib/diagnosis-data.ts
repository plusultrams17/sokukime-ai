/* ═══════════════════════════════════════════════════════════════
   Shared diagnosis data — used by /diagnosis and /diagnosis/result
═══════════════════════════════════════════════════════════════ */

export const SKILLS = [
  { key: "approach", name: "アプローチ", en: "APPROACH", color: "#FF9F1C" },
  { key: "hearing", name: "ヒアリング", en: "HEARING", color: "#2EC4B6" },
  { key: "presentation", name: "プレゼン", en: "PRESENTATION", color: "#A855F7" },
  { key: "closing", name: "クロージング", en: "CLOSING", color: "#F43F5E" },
  { key: "objection", name: "反論処理", en: "OBJECTION", color: "#3B82F6" },
] as const;

export interface DiagnosisType {
  name: string;
  en: string;
  headline: string;
  description: string;
  strengths: string[];
  failurePattern: string;
  aruaru: string;
  advice: string;
}

export const TYPES: DiagnosisType[] = [
  {
    name: "信頼構築タイプ",
    en: "Trust Builder",
    headline: "第一印象で心をつかむ天性の営業力",
    description:
      "初対面の警戒心を一瞬で解くセンスは天性のもの。雑談から自然に信頼関係を築くスピードが最大の武器。",
    strengths: [
      "瞬時に相手との距離を縮める力",
      "自然な雑談力とユーモア",
      "紹介・リピートが多い",
    ],
    failurePattern:
      "「いい人だったね」で終わり、見積もりが放置される",
    aruaru:
      "「あの営業さん感じよかったよ」と奥さんには好評。でも契約したのは別の会社だった。",
    advice:
      "弱点スキルの「型」を学べば、あなたの人間力が成約に直結します。",
  },
  {
    name: "傾聴分析タイプ",
    en: "Analytical Listener",
    headline: "相手の真のニーズを見抜く観察力がある",
    description:
      "聴く力が突出しており、相手が自然と本音を話す空気を作れる。情報収集力は営業チーム随一。",
    strengths: [
      "相手が自然と本音を話し出す傾聴力",
      "観察力が鋭く小さな変化に気づく",
      "顧客満足度が高い",
    ],
    failurePattern:
      "聴くだけで終わり、提案や決断に繋げられない",
    aruaru:
      "「話をよく聞いてくれるね」と言われるのに、契約は別の営業に取られる。",
    advice:
      "聴いた情報をベネフィットに変換する「伝え方の型」を身につけましょう。",
  },
  {
    name: "ストーリーテラータイプ",
    en: "Storyteller",
    headline: "価値を言葉で伝え、相手を動かす力がある",
    description:
      "商品の魅力を分かりやすく、心に響く言葉で伝えるのが得意。プレゼンでは聴衆を惹きつけるストーリーテリングが光る。",
    strengths: [
      "分かりやすい説明力と説得力",
      "数字とストーリーの使い分け",
      "提案資料の完成度が高い",
    ],
    failurePattern:
      "完璧なプレゼンの後に「で、うちに必要？」と言われる",
    aruaru:
      "「説明うまいね！」と褒められるけど、成約率は中の下。",
    advice:
      "伝達力は申し分なし。決断を後押しするクロージングの一言を加えましょう。",
  },
  {
    name: "即決クローザータイプ",
    en: "Decisive Closer",
    headline: "商談をまとめ上げる推進力がある",
    description:
      "ゴールに向かって最短距離で進む効率型。決断を促す力が強く、成約までのスピードが速い。",
    strengths: [
      "成約への強い推進力",
      "決断を促すタイミング感覚",
      "数字への貪欲さと行動量",
    ],
    failurePattern:
      "契約は取れるがキャンセルやクレームが多い",
    aruaru:
      "今月のノルマは達成。でも来月の解約リストに自分の契約が3件入ってた。",
    advice:
      "ヒアリングを強化すれば、お客さんが自ら「お願いします」と言う状況を作れます。",
  },
  {
    name: "切り返しの達人タイプ",
    en: "Objection Master",
    headline: "どんな反論にも動じない胆力がある",
    description:
      "「高い」「考えます」「必要ない」——あらゆる反論に冷静に対処する力がある。論理的かつ柔軟な対応力が武器。",
    strengths: [
      "冷静な反論対応力と交渉術",
      "論理的に相手を納得させる力",
      "粘り強さとメンタルの強さ",
    ],
    failurePattern:
      "守りは強いが、自分から攻める営業スタイルが弱い",
    aruaru:
      "既存客の対応は完璧なのに、新規開拓になると途端に苦手意識が出る。",
    advice:
      "アプローチを磨けば、そもそも反論が出にくい商談を設計できます。",
  },
];

export const COMBO_TYPES: Record<string, DiagnosisType> = {
  "0-3": {
    name: "人たらしの未完成クローザー",
    en: "Charming Incomplete Closer",
    headline: "好かれるのに契約が取れない——あと一歩が課題",
    description:
      "初対面の警戒心を一瞬で解くセンスは天性のもの。しかし「いい人」で終わり、決断を迫れないのが弱点。",
    strengths: ["雑談から信頼関係を築くスピード", "相手の緊張を解くユーモア", "紹介・リピートが多い"],
    failurePattern: "「良い人だったね」で終わり、見積もりが放置される",
    aruaru: "「あの営業さん感じよかったよ」と奥さんには好評。でも契約したのは別の会社だった。",
    advice: "クロージングの「型」を学べば、あなたの武器が何倍にも活きます。",
  },
  "0-1": {
    name: "第一印象番長",
    en: "First Impression King",
    headline: "掴みは完璧。でも深掘りが足りない",
    description:
      "初回で相手を笑顔にする才能がある。しかし本音を掘り下げる前に自分のペースで進めてしまいがち。",
    strengths: ["第一印象で相手を安心させる力", "場の空気を和らげる天性の明るさ", "初回アポ率が高い"],
    failurePattern: "盛り上がったのに2回目がない。相手のニーズを聞けていない",
    aruaru: "初回面談は盛り上がるのに「検討します」が多い。理由が分からずモヤモヤ。",
    advice: "あなたの第一印象力に「聴く力」が加われば、鬼に金棒です。",
  },
  "1-2": {
    name: "聞き上手の伝え下手",
    en: "Great Listener, Shy Presenter",
    headline: "ニーズは把握できる。でも伝え方で損している",
    description:
      "相手の話を丁寧に聴き、本当の悩みを引き出す力がある。しかし「この商品で解決できます」と伝えるのが苦手。",
    strengths: ["相手が自然と本音を話し出す傾聴力", "観察力が鋭く小さな変化に気づく", "顧客満足度が高い"],
    failurePattern: "ヒアリングは完璧なのに、提案がぼんやりして刺さらない",
    aruaru: "お客さんの悩みは100%理解してるのに「で、どうすればいいの？」と聞かれてしまう。",
    advice: "聴いた情報をベネフィットに変換する「伝え方の型」を身につけましょう。",
  },
  "1-3": {
    name: "共感止まりの優しい営業",
    en: "Empathetic Non-Closer",
    headline: "信頼は厚い。でも「売る」のが申し訳なく感じる",
    description:
      "お客さんの気持ちに寄り添い、深い信頼関係を築ける。しかし「売り込みたくない」が決断の後押しを邪魔する。",
    strengths: ["お客さんから相談される関係性", "クレームがほぼゼロ", "長期のリピーター多数"],
    failurePattern: "「もう少し考えます」を「そうですよね」で受け入れてしまう",
    aruaru: "「あなたから買いたい」と言われるのに、なぜかいつも「次回」になる。",
    advice: "クロージングは「押し売り」ではなく「決断のお手伝い」。型を知れば怖くなくなります。",
  },
  "2-1": {
    name: "一方通行プレゼンター",
    en: "One-Way Presenter",
    headline: "説明はプロ級。でも相手が置いてきぼり",
    description:
      "商品知識が豊富で論理的に説明する力がある。しかし相手のペースを無視して一方的に話してしまうことがある。",
    strengths: ["商品知識の深さと説得力", "データに基づく論理的な説明", "提案資料の完成度が高い"],
    failurePattern: "完璧なプレゼンの後に「で、うちに必要？」と言われる",
    aruaru: "自信満々でプレゼンしたのに、お客さんが途中からスマホを見始めた。",
    advice: "プレゼンの前に「聴く」を入れるだけで、成約率が劇的に変わります。",
  },
  "2-3": {
    name: "魅せるだけの未完走営業",
    en: "Dazzler Without Finish",
    headline: "興味は引ける。でもゴールテープを切れない",
    description:
      "商品の魅力を伝えるのは得意。しかし「欲しい」と思わせた後のクロージングが弱く、機会を逃しやすい。",
    strengths: ["分かりやすい言葉で価値を伝える力", "ストーリーテリングの巧みさ", "初回プレゼンの評価が高い"],
    failurePattern: "感動させたのに、最後の一言が出ず見積もり止まり",
    aruaru: "「説明うまいね！」と褒められるけど、成約率は中の下。",
    advice: "あなたのプレゼン力にクロージングの「型」を加えるだけで数字は変わります。",
  },
  "3-1": {
    name: "押しの即断営業",
    en: "Aggressive Quick Closer",
    headline: "決断は速い。でも相手の本音が見えていない",
    description:
      "商談をスピーディーに進め即決に持ち込む推進力がある。しかし真のニーズを確認せず進めるためキャンセル率が高い。",
    strengths: ["商談スピードの速さ", "決断を促す強いクロージング力", "数字への執着と行動量"],
    failurePattern: "契約は取れるがキャンセルやクレームが多い",
    aruaru: "今月のノルマは達成。でも来月の解約リストに自分の契約が3件入ってた。",
    advice: "ヒアリングの「型」を加えれば、キャンセルゼロの最強クローザーになれます。",
  },
  "3-0": {
    name: "いきなりクロージャー",
    en: "Cold Closer",
    headline: "成約力は高い。でも相手に構えられやすい",
    description:
      "ゴールに向かって最短距離で進む効率型。しかし関係構築を飛ばしがちで、警戒されやすい。",
    strengths: ["成約への最短ルートを見つける嗅覚", "数字目標への強いコミットメント", "商談回数が少なくて済む効率性"],
    failurePattern: "関係ができる前にクロージングして拒絶される",
    aruaru: "「もうちょっと仲良くなってからにして」と言われて、どうすればいいか分からない。",
    advice: "アプローチの「型」を学べば、あなたのクロージング力がフルに発揮されます。",
  },
  "4-0": {
    name: "守りの達人",
    en: "Defensive Master",
    headline: "反論には強い。でも自分から仕掛けられない",
    description:
      "お客さんの「高い」「考えます」を華麗に切り返す技術がある。しかし自分から攻める——特にアプローチが弱い。",
    strengths: ["どんな反論にも動じない冷静さ", "論理的に相手を納得させる力", "交渉での粘り強さ"],
    failurePattern: "反論処理は完璧だが、そもそも商談の入口が少ない",
    aruaru: "既存客の対応は得意なのに、新規のアポが全然取れない。",
    advice: "アプローチの「型」で入口を増やせば、あなたの切り返し力が最大限活きます。",
  },
  "4-2": {
    name: "切り返し職人",
    en: "Comeback Craftsman",
    headline: "守りは鉄壁。でも魅力を伝える力が足りない",
    description:
      "反論や質問に対する回答は完璧。しかし自ら商品の価値を語り、心を動かす攻めのプレゼンが苦手。",
    strengths: ["冷静な反論対応力", "お客さんの懸念を的確に解消する力", "トラブル対応での信頼獲得"],
    failurePattern: "質問には答えられるが、相手の「欲しい」を引き出せない",
    aruaru: "「質問にはちゃんと答えてくれたけど、結局よく分からなかった」と言われた。",
    advice: "プレゼンの「型」で攻めの引き出しを増やせば、攻守最強の営業になれます。",
  },
};

export function getComboType(scores: number[]): DiagnosisType {
  const maxIndex = scores.indexOf(Math.max(...scores));
  const minIndex = scores.indexOf(Math.min(...scores));
  if (maxIndex === minIndex) return TYPES[maxIndex];
  return COMBO_TYPES[`${maxIndex}-${minIndex}`] || TYPES[maxIndex];
}

export function pentagonPoint(
  cx: number,
  cy: number,
  radius: number,
  index: number,
): { x: number; y: number } {
  const angle = -Math.PI / 2 + (index * 2 * Math.PI) / 5;
  return {
    x: cx + radius * Math.cos(angle),
    y: cy + radius * Math.sin(angle),
  };
}

export function pentagonPath(cx: number, cy: number, radius: number): string {
  return (
    Array.from({ length: 5 }, (_, i) => {
      const p = pentagonPoint(cx, cy, radius, i);
      return `${i === 0 ? "M" : "L"}${p.x},${p.y}`;
    }).join(" ") + "Z"
  );
}

function normalCDF(x: number, mean: number, sd: number): number {
  const z = (x - mean) / sd;
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989422804014327;
  const p =
    d *
    Math.exp((-z * z) / 2) *
    t *
    (0.3193815 +
      t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  return z > 0 ? 1 - p : p;
}

export function getPercentile(score: number): number {
  const p = normalCDF(score, 55, 15) * 100;
  return Math.min(99, Math.max(1, Math.round(p)));
}

/** Parse dash-separated scores from URL param. Returns null if invalid. */
export function parseScores(param: string): number[] | null {
  const parts = param.split("-").map(Number);
  if (parts.length !== 5) return null;
  if (parts.some((n) => isNaN(n) || n < 0 || n > 100)) return null;
  return parts;
}

/** Encode scores to dash-separated URL-safe string */
export function encodeScores(scores: number[]): string {
  return scores.join("-");
}
