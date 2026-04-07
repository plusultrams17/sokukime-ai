export interface Challenge {
  id: string;
  title: string;
  description: string;
  customerLine: string;
  context: string;
  product: string;
  industry: string;
  scene: string;
  difficulty: string;
  idealTechniques: string[];
}

export const CHALLENGES: Challenge[] = [
  {
    id: "expensive",
    title: "「高いですね」を切り返せ",
    description:
      "見積もり提示後にお客さんが価格に難色。あなたの切り返しで流れを変えろ。",
    customerLine:
      "うーん…正直、ちょっと高いですね。他社さんはもう少し安かったんですけど…",
    context:
      "外壁塗装の見積もり80万円を提示した直後。お客さんは他社の50万円の見積もりと比較している。",
    product: "外壁塗装",
    industry: "戸建て住宅オーナー",
    scene: "visit",
    difficulty: "cautious",
    idealTechniques: [
      "共感（そうですよね）",
      "価値上乗せ（SP3連発）",
      "比較話法（敬意前置き+差別化）",
    ],
  },
  {
    id: "consider",
    title: "「検討します」を突破せよ",
    description:
      "いい反応だったのにクロージングで「検討します」。ここで引き下がるな。",
    customerLine:
      "なるほど、わかりました。いい話だとは思うんですけど…ちょっと検討させてもらっていいですか？",
    context:
      "保険の提案プレゼン後。お客さんは内容に納得している様子だったが、最後に「検討します」と言い出した。",
    product: "医療保険",
    industry: "30代会社員",
    scene: "visit",
    difficulty: "cautious",
    idealTechniques: [
      "共感+感謝",
      "フック（商品自体は良いと思いますよね？）",
      "一貫性通し（最初のゴール共有に立ち戻る）",
    ],
  },
  {
    id: "competitor",
    title: "「他社と比較中」を逆転せよ",
    description:
      "他社にも見積もりを取っている。比較されても選ばれる一手を打て。",
    customerLine:
      "実は他の会社さんにも見積もり出してもらってて、比較してから決めたいんですよね。",
    context:
      "リフォーム会社の2回目の訪問。前回はいい雰囲気で終わったが、他社にも声をかけていたことが判明。",
    product: "キッチンリフォーム",
    industry: "40代夫婦",
    scene: "visit",
    difficulty: "skeptical",
    idealTechniques: [
      "共感（当然ですよね）",
      "敬意前置き+比較話法",
      "第三者話法（他のお客様は…）",
    ],
  },
];

export function getChallenge(id: string): Challenge | undefined {
  return CHALLENGES.find((c) => c.id === id);
}
