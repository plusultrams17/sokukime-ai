export interface FieldDef {
  key: string;
  label: string;
  multiline?: boolean;
  example?: string;
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
          {
            key: "praise1",
            label: "外見・雰囲気を褒める",
            example:
              "今まで50社以上お伺いしましたが、これほど明るく活気のあるオフィスは初めてです",
          },
          {
            key: "praise2",
            label: "会社・店舗を褒める",
            example:
              "駅前のこの立地で、ここまで内装にこだわっている店舗はなかなかありませんね",
          },
          {
            key: "praise3",
            label: "実績・評判を褒める",
            example:
              "口コミサイトで★4.8はこのエリアではダントツです。お客様に愛されている証拠ですね",
          },
        ],
      },
      {
        title: "ゴール共有（事前合意）",
        fields: [
          {
            key: "premise",
            label: "ゴール共有トーク",
            multiline: true,
            example:
              "○○様、本日は精一杯ご説明させていただきます。もし合わないと感じたら遠慮なくおっしゃってください。逆に良いなと思っていただけたら、ぜひその場でスタートしてください。それでよろしいですか？",
          },
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
          {
            key: "need1",
            label: "想定ニーズ1",
            example: "集客コストが年々上がって利益を圧迫している",
          },
          {
            key: "need2",
            label: "想定ニーズ2",
            example: "スタッフの採用・教育に時間がかかり本業に集中できない",
          },
          {
            key: "need3",
            label: "想定ニーズ3",
            example: "リピート率が低く、新規集客に依存してしまっている",
          },
        ],
      },
      {
        title: "ニーズ発掘フレーズ（第三者話法）",
        fields: [
          {
            key: "drawer1",
            label: "ニーズ発掘フレーズ1",
            example:
              "『最近、広告費が上がって費用対効果が合わなくなってきた』とおっしゃる方が多いのですが、○○様のところではいかがですか？",
          },
          {
            key: "drawer2",
            label: "ニーズ発掘フレーズ2",
            example:
              "『人手が足りなくて、やりたいことが全然進まない』って声をよく聞くんですけど、○○様はいかがでしょうか？",
          },
          {
            key: "drawer3",
            label: "ニーズ発掘フレーズ3",
            example:
              "『一度来てくれたお客様がなかなかリピートしてくれない』というお悩み、同業の方からよく伺いますが…",
          },
        ],
      },
      {
        title: "深掘り質問チェーン",
        fields: [
          {
            key: "cause",
            label: "原因の深掘り",
            example: "それは何が原因だと思われますか？",
          },
          {
            key: "since",
            label: "いつから？（時間軸・金額換算）",
            example:
              "いつ頃からその状況ですか？ → 月5万円の機会損失 × 12ヶ月 = 年間60万円のロス",
          },
          {
            key: "concrete",
            label: "具体的にはどんな影響？",
            example:
              "具体的にどのくらいの影響がありますか？ → 先月も見込み客を3件逃しました",
          },
          {
            key: "neglect",
            label: "放置するとどうなる？",
            example:
              "このまま放置すると、半年後にはどうなりそうですか？ → 競合に差をつけられるかもしれません",
          },
          {
            key: "feeling",
            label: "気分はどうですか？",
            example:
              "率直に今のお気持ちはいかがですか？ → 正直、早くなんとかしないとまずいと思っています",
          },
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
          {
            key: "feature1",
            label: "セールスポイント1",
            example: "24時間365日のチャットサポート体制",
          },
          {
            key: "benefit1",
            label: "だから → ベネフィット1",
            example:
              "だから、夜間や休日にトラブルが起きても業務が止まる心配がなくなります",
          },
          {
            key: "feature2",
            label: "セールスポイント2",
            example: "AIによる自動レポート生成機能",
          },
          {
            key: "benefit2",
            label: "だから → ベネフィット2",
            example:
              "だから、毎月の報告書作成に費やしていた10時間が、新規開拓に使えるようになります",
          },
          {
            key: "feature3",
            label: "セールスポイント3",
            example: "導入実績500社・継続率98%",
          },
          {
            key: "benefit3",
            label: "だから → ベネフィット3",
            example:
              "だから、○○様も安心して導入でき、長く使い続けられるサービスです",
          },
        ],
      },
      {
        title: "比較話法",
        fields: [
          {
            key: "compCompetitor",
            label: "他社のやり方",
            example:
              "一般的にこの業界のサポートは平日9〜17時対応が多く、トラブル時に対応が遅れがちです",
          },
          {
            key: "compOurs",
            label: "当社のやり方",
            example:
              "当社では24時間365日対応＋専任担当制で、平均30分以内に初期対応します",
          },
          {
            key: "compBenefit",
            label: "お客様のメリット",
            example:
              "だから○○様は、週末や夜間にトラブルが起きても安心して対応を任せられます",
          },
        ],
      },
      {
        title: "IF活用（想像させる）",
        fields: [
          {
            key: "heavenIf",
            label: "天国IF（ポジティブ想像）",
            multiline: true,
            example:
              "もしこのシステムを導入して毎月20時間の作業が自動化されたら、その時間で何をしたいですか？ → 新規事業の企画に集中できますね！",
          },
          {
            key: "hellIf",
            label: "地獄IF（ネガティブ想像）",
            multiline: true,
            example:
              "もしこの問題が半年後も解決していなかったら、どんな影響がありそうですか？ → 優秀な社員が離職するかもしれません…",
          },
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
          {
            key: "quote1",
            label: "第三者の声（証言引用）1",
            example:
              "先日のお客様が『もっと早くやればよかった。迷っていた時間がもったいなかった』とおっしゃっていました",
          },
          {
            key: "quote2",
            label: "第三者の声（証言引用）2",
            example:
              "別のお客様からは『最初は不安だったけど、やってみたら全然違った。家族にも勧めました』と言われました",
          },
          {
            key: "socialProof",
            label: "社会的証明（みなさん〜）",
            example:
              "○○様と同じ悩みを持っていた方、みなっっっさんこちらを選ばれているんですよ。先月だけで150名以上にご契約いただいています",
          },
          {
            key: "consistency",
            label: "一貫性（ゴール共有との連動）",
            example:
              "最初にお伝えした通り、良いと思っていただけたなら一緒に始めましょう。先ほど『良いですね』とおっしゃっていましたよね",
          },
        ],
      },
      {
        title: "ポジティブクロージング",
        fields: [
          {
            key: "posIf",
            label: "ポジティブIF",
            example:
              "このプランを始めると、3ヶ月後には売上が20%アップしている自分を想像してみてください",
          },
          {
            key: "posTriple1",
            label: "ポジティブトリプル1",
            example: "まず、月間コストが30%下がります",
          },
          {
            key: "posTriple2",
            label: "ポジティブトリプル2",
            example:
              "しかも！業務効率が2倍になるので、チーム全体の生産性が上がります",
          },
          {
            key: "posTriple3",
            label: "ポジティブトリプル3",
            example:
              "さらに！今なら導入サポートが無料なので、初月からフル活用できます",
          },
        ],
      },
      {
        title: "ネガティブクロージング（ゆさぶり）",
        fields: [
          {
            key: "negReverseSP",
            label: "逆SP（メリットなし版）",
            example:
              "もしこのシステムがなければ、手作業のミスは今後も繰り返されます",
          },
          {
            key: "negReverseBenefit",
            label: "逆ベネフィット（ネガティブ結末）",
            example:
              "毎月10万円以上のコストが無駄になり続け、半年後には60万円が消えた状態になります",
          },
          {
            key: "negIf",
            label: "ネガティブIF",
            example:
              "もしこのまま何もしなければ、半年後に『あのとき始めていれば…』と思っても取り戻せません",
          },
          {
            key: "negTriple1",
            label: "ネガティブトリプル1",
            example: "このまま放置すると、まずコストが膨らみ続けます",
          },
          {
            key: "negTriple2",
            label: "ネガティブトリプル2",
            example:
              "しかも、競合はどんどん導入を進めています",
          },
          {
            key: "negTriple3",
            label: "ネガティブトリプル3",
            example:
              "さらに、半年後には取り返しのつかない差がつく可能性があります",
          },
        ],
      },
      {
        title: "欲求パターン",
        fields: [
          {
            key: "activeDesire",
            label: "積極的欲求（〜したい）",
            example:
              "もっと売上を伸ばしたい / 業界でトップになりたい / チームの生産性を上げたい",
          },
          {
            key: "passiveDesire",
            label: "消極的欲求（〜したくない）",
            example:
              "これ以上損したくない / 競合に負けたくない / 時代遅れだと思われたくない",
          },
        ],
      },
      {
        title: "訴求フレーズ",
        fields: [
          {
            key: "appealPhrase",
            label: "最終訴求フレーズ",
            multiline: true,
            example:
              "○○様、損を防いでさらに良い未来を手に入れましょう。一緒に始めましょう。",
          },
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
          {
            key: "obj1Script",
            label: "意思決定の壁 ― 想定セリフ",
            example: "ちょっと考えさせてください / 一度持ち帰って検討します",
          },
          {
            key: "obj1Rebuttal",
            label: "意思決定の壁 ― 切り返し",
            example:
              "そうですよね、大切な決断ですから。ちなみに具体的にどの部分が気になっていますか？",
          },
          {
            key: "obj2Script",
            label: "比較検討 ― 想定セリフ",
            example: "他のサービスも見てから決めたい / 他社と比較したい",
          },
          {
            key: "obj2Rebuttal",
            label: "比較検討 ― 切り返し",
            example:
              "比較されたいお気持ちはわかります。商品自体は良いと思っていただけましたか？",
          },
          {
            key: "obj3Script",
            label: "予算の壁 ― 想定セリフ",
            example: "ちょっと高いですね / 予算的に厳しい",
          },
          {
            key: "obj3Rebuttal",
            label: "予算の壁 ― 切り返し",
            example:
              "高いと感じさせてしまい申し訳ございません。もし価格が問題なければご契約いただけますか？",
          },
          {
            key: "obj4Script",
            label: "タイミングの壁 ― 想定セリフ",
            example: "今じゃなくてもいいかな / 来月から始めようかな",
          },
          {
            key: "obj4Rebuttal",
            label: "タイミングの壁 ― 切り返し",
            example:
              "そもそも○○を解決したいとおっしゃっていましたよね。考えている間も問題は続きます。1日でも早く始めた方が良いです",
          },
        ],
      },
      {
        title: "切り返しの型（共通フレーム）",
        fields: [
          {
            key: "empathy",
            label: "共感フレーズ",
            example:
              "あー、そうですよねー、わかります。大きな決断ですから慎重になりますよね",
          },
          {
            key: "gratitude",
            label: "感謝フレーズ",
            example:
              "真剣に考えていただいて、本当にありがとうございます",
          },
          {
            key: "hook",
            label: "フックYES質問",
            example:
              "ちなみに、商品自体は良いなと思ってくださっていますか？",
          },
        ],
      },
      {
        title: "5つの切り返し技法",
        fields: [
          {
            key: "tech1Recall",
            label: "①目的の振り返り",
            example:
              "最初にお話を伺った時、『集客が安定しなくて困っている』とおっしゃっていましたよね。その課題は今も変わりませんか？",
          },
          {
            key: "tech1Area",
            label: "①切り返しの公式",
            example:
              "今日お決めいただくのが最善です（主張）。検討期間が長くなるほど熱が冷めます（理由）。以前半年悩んで後悔された方がいました（具体例）。だからこそ今日始めましょう（再主張）",
          },
          {
            key: "tech2Episode",
            label: "②第三者エピソード",
            example:
              "3ヶ月前に同じように悩まれたお客様がいました。最終的にその日に決断され、先日『あの時決めて本当に良かった』とおっしゃっていました",
          },
          {
            key: "tech3YesPlus",
            label: "③YESの積み上げ（自己説得法）",
            example:
              "今日のお話の中で、一番『これいいな』と思ったポイントはどこですか？ → なぜそう思いましたか？ → 他にも良い点はありますか？",
          },
          {
            key: "tech4Reframe",
            label: "④すり替え（リフレーミング）",
            example:
              "『他も見たい』方の多くは、実は良いものに出会っているのに確信が持てないだけです。○○様はもう十分な情報をお持ちです",
          },
          {
            key: "tech4Correction",
            label: "④補正・褒め",
            example:
              "まさかこのまま何もしないお考えではないですよね？ → 「いえ、違います」 → ですよね！○○様は本気で取り組む方ですから",
          },
          {
            key: "tech5Apology",
            label: "⑤驚き＋謝罪",
            example:
              "えっ、高いですか！ 高く思わせてしまって申し訳ございません。私の伝え方が悪かっただけなんです",
          },
          {
            key: "tech5Value",
            label: "⑤価値の再提示（SP×3連発）",
            multiline: true,
            example:
              "みなさん最終的には安いとおっしゃる理由は3つあります。①お悩みの集客問題を根本解決 ②専任サポートでいつでも相談可 ③一度身につけたスキルは一生もの",
          },
        ],
      },
    ],
  },
];
