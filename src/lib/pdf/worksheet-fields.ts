export interface FieldDef {
  key: string;
  label: string;
  multiline?: boolean;
}

export interface PhaseFieldDefs {
  phaseNum: string;
  phaseName: string;
  phaseSub: string;
  color: string;
  sections: {
    title: string;
    fields: FieldDef[];
  }[];
}

export const WORKSHEET_PHASES: PhaseFieldDefs[] = [
  {
    phaseNum: "Step 1",
    phaseName: "アプローチ",
    phaseSub: "信頼構築",
    color: "#0F6E56",
    sections: [
      {
        title: "褒めポイントを3つ準備（比較で強調）",
        fields: [
          { key: "praise1", label: "外見・雰囲気を褒める" },
          { key: "praise2", label: "会社・店舗を褒める" },
          { key: "praise3", label: "実績・評判を褒める" },
        ],
      },
      {
        title: "前提設定（先回り・事前合意）",
        fields: [
          { key: "premise", label: "前提設定トーク", multiline: true },
        ],
      },
    ],
  },
  {
    phaseNum: "Step 2",
    phaseName: "ヒアリング",
    phaseSub: "課題発掘",
    color: "#185FA5",
    sections: [
      {
        title: "想定ニーズ（3つ準備）",
        fields: [
          { key: "need1", label: "想定ニーズ1" },
          { key: "need2", label: "想定ニーズ2" },
          { key: "need3", label: "想定ニーズ3" },
        ],
      },
      {
        title: "引き出しフレーズ（第三者話法）",
        fields: [
          { key: "drawer1", label: "引き出しフレーズ1" },
          { key: "drawer2", label: "引き出しフレーズ2" },
          { key: "drawer3", label: "引き出しフレーズ3" },
        ],
      },
      {
        title: "深掘り質問チェーン",
        fields: [
          { key: "cause", label: "原因の深掘り" },
          { key: "since", label: "いつから？（時間軸・金額換算）" },
          { key: "concrete", label: "具体的にはどんな影響？" },
          { key: "neglect", label: "放置するとどうなる？" },
          { key: "feeling", label: "気分はどうですか？" },
        ],
      },
    ],
  },
  {
    phaseNum: "Step 3",
    phaseName: "プレゼン",
    phaseSub: "価値提案",
    color: "#534AB7",
    sections: [
      {
        title: "利点話法（SP→ベネフィット変換）",
        fields: [
          { key: "feature1", label: "セールスポイント1" },
          { key: "benefit1", label: "だから → ベネフィット1" },
          { key: "feature2", label: "セールスポイント2" },
          { key: "benefit2", label: "だから → ベネフィット2" },
          { key: "feature3", label: "セールスポイント3" },
          { key: "benefit3", label: "だから → ベネフィット3" },
        ],
      },
      {
        title: "比較話法",
        fields: [
          { key: "compCompetitor", label: "他社のやり方" },
          { key: "compOurs", label: "当社のやり方" },
          { key: "compBenefit", label: "お客様のメリット" },
        ],
      },
      {
        title: "IF活用（想像させる）",
        fields: [
          { key: "heavenIf", label: "天国IF（ポジティブ想像）", multiline: true },
          { key: "hellIf", label: "地獄IF（ネガティブ想像）", multiline: true },
        ],
      },
    ],
  },
  {
    phaseNum: "Step 4",
    phaseName: "クロージング",
    phaseSub: "決断促進",
    color: "#2563EB",
    sections: [
      {
        title: "基本3技術",
        fields: [
          { key: "quote1", label: "第三者の声（カギカッコ）1" },
          { key: "quote2", label: "第三者の声（カギカッコ）2" },
          { key: "socialProof", label: "社会的証明（みなさん〜）" },
          { key: "consistency", label: "一貫性（前提設定との連動）" },
        ],
      },
      {
        title: "ポジティブクロージング",
        fields: [
          { key: "posIf", label: "ポジティブIF" },
          { key: "posTriple1", label: "ポジティブトリプル1" },
          { key: "posTriple2", label: "ポジティブトリプル2" },
          { key: "posTriple3", label: "ポジティブトリプル3" },
        ],
      },
      {
        title: "ネガティブクロージング（ゆさぶり）",
        fields: [
          { key: "negReverseSP", label: "逆SP（メリットなし版）" },
          { key: "negReverseBenefit", label: "逆ベネフィット（ネガティブ結末）" },
          { key: "negIf", label: "ネガティブIF" },
          { key: "negTriple1", label: "ネガティブトリプル1" },
          { key: "negTriple2", label: "ネガティブトリプル2" },
          { key: "negTriple3", label: "ネガティブトリプル3" },
        ],
      },
      {
        title: "欲求パターン",
        fields: [
          { key: "activeDesire", label: "積極的欲求（〜したい）" },
          { key: "passiveDesire", label: "消極的欲求（〜したくない）" },
        ],
      },
      {
        title: "訴求フレーズ",
        fields: [
          { key: "appealPhrase", label: "最終訴求フレーズ", multiline: true },
        ],
      },
    ],
  },
  {
    phaseNum: "Step 5",
    phaseName: "反論処理",
    phaseSub: "切り返し",
    color: "#7C3AED",
    sections: [
      {
        title: "想定される反論（4大パターン）",
        fields: [
          { key: "obj1Script", label: "意思決定の壁 ― 想定セリフ" },
          { key: "obj1Rebuttal", label: "意思決定の壁 ― 切り返し" },
          { key: "obj2Script", label: "比較検討 ― 想定セリフ" },
          { key: "obj2Rebuttal", label: "比較検討 ― 切り返し" },
          { key: "obj3Script", label: "予算の壁 ― 想定セリフ" },
          { key: "obj3Rebuttal", label: "予算の壁 ― 切り返し" },
          { key: "obj4Script", label: "タイミングの壁 ― 想定セリフ" },
          { key: "obj4Rebuttal", label: "タイミングの壁 ― 切り返し" },
        ],
      },
      {
        title: "切り返しの型（共通フレーム）",
        fields: [
          { key: "empathy", label: "共感フレーズ" },
          { key: "gratitude", label: "感謝フレーズ" },
          { key: "hook", label: "フックYES質問" },
        ],
      },
      {
        title: "5つの切り返し技法",
        fields: [
          { key: "tech1Recall", label: "①目的の振り返り" },
          { key: "tech1Area", label: "①AREA話法" },
          { key: "tech2Episode", label: "②第三者エピソード" },
          { key: "tech3YesPlus", label: "③プラスのシャワー（YES+質問）" },
          { key: "tech4Reframe", label: "④すり替え（リフレーミング）" },
          { key: "tech4Correction", label: "④補正・褒め" },
          { key: "tech5Apology", label: "⑤驚き＋謝罪" },
          { key: "tech5Value", label: "⑤価値の上乗せ（SP×3連発）", multiline: true },
        ],
      },
    ],
  },
];
