import type { ScenarioConfig } from "./types";

export const exhibition: ScenarioConfig = {
  meta: {
    id: "exhibition",
    title: "展示会営業 — ブースでの名刺交換",
    shortTitle: "展示会営業",
    emoji: "🎪",
    description: "IT展示会のブースで通りかかった見込み客を捕まえろ。たった3分で名刺交換→アポ獲得を目指す。",
    location: "東京ビッグサイト IT EXPO 2026",
    customerType: "50代男性 / 物流会社 部長 / 忙しい・時間がない",
    product: "物流DX管理システム",
    sceneType: "exhibition",
    difficulty: "intermediate",
  },
  phaseLabels: ["声かけ", "興味付け", "ヒアリング", "デモ", "アポ取り", "名刺交換"],
  initialEmotion: 20,
  introScenes: [
    { id: "ex-intro-1", text: "東京ビッグサイト", subText: "IT EXPO 2026 — 物流DXゾーン", duration: 2500 },
    { id: "ex-intro-2", text: "午後2時\nブースへの来場者がピークを迎える", subText: "通路を忙しそうに歩くスーツ姿の男性が——", duration: 2500 },
    { id: "ex-intro-3", text: "彼の胸には「山田運輸」の\n名札が見える——", duration: 2000 },
  ],
  nodeOrder: [
    "ex-call-1", "ex-hook-1", "ex-hook-2",
    "ex-hear-1", "ex-hear-2", "ex-demo-1",
    "ex-demo-2", "ex-appo-1", "ex-appo-2", "ex-card-1",
  ],
  gameNodes: [
    {
      id: "ex-call-1", phase: 0, phaseLabel: "声かけ",
      narration: "通路をスーツ姿の男性が足早に歩いている。胸の名札には「山田運輸 業務部 部長 山田太郎」と書かれている。今しかない。",
      choices: [
        { id: "ex-c1-a", label: "名札を読んで社名で声をかける", icon: "🎯", salesTalk: "山田運輸さんですか！ちょうど物流業界の方にお見せしたいものがあるんです。30秒だけいいですか？", customerResponse: "…え？（立ち止まる）うちのこと知ってるの？…まあ30秒なら。", score: 10, emotionDelta: 10, technique: "社名呼びかけ＋時間限定", quality: "excellent", hint: "社名で呼ぶと「自分向け」と感じて立ち止まる" },
        { id: "ex-c1-b", label: "「物流業界の方ですか？」と声をかける", icon: "🚛", salesTalk: "物流業界の方ですか？今ちょうど物流DXのデモをやってまして——", customerResponse: "…ああ、まあそうだけど。（チラッとブースを見る）…手短にね。", score: 5, emotionDelta: 3, quality: "good" },
        { id: "ex-c1-c", label: "チラシを差し出す", icon: "📄", salesTalk: "こちらのチラシだけでもどうぞ！物流DXの資料です！", customerResponse: "…（受け取るが目を通さず）ありがとう。（そのまま歩き続けようとする）", score: 0, emotionDelta: -2, quality: "neutral" },
        { id: "ex-c1-d", label: "「すみません！ちょっといいですか！」と大声", icon: "📢", salesTalk: "すみませーん！！ちょっとだけいいですか！！お時間ください！！", customerResponse: "…（眉をひそめる）いや、急いでるんで。（足を速める）", score: -5, emotionDelta: -8, quality: "bad" },
      ],
    },
    {
      id: "ex-hook-1", phase: 1, phaseLabel: "興味付け",
      narration: "男性が立ち止まった。しかし腕時計をチラチラ見ている。残り時間はわずかだ。",
      customerLine: "…で、何？手短にお願いね。次のセミナーまであんまり時間ないんだ。",
      choices: [
        { id: "ex-h1-a", label: "数字インパクトで興味を引く", icon: "📊", salesTalk: "御社のような物流会社で、配車計画に1日3時間かけている会社が、うちのシステムで30分になった事例があるんです。", customerResponse: "…3時間が30分？（腕時計を見る手が止まる）…それ、本当？", score: 10, emotionDelta: 12, technique: "数字インパクト＋第三者事例", quality: "excellent", hint: "展示会では最初の一言で数字を出して興味を掴む" },
        { id: "ex-h1-b", label: "「業界の課題」を指摘する", icon: "🔍", salesTalk: "2024年問題で物流業界は大変ですよね。ドライバー不足の中、いかに効率化するかが勝負じゃないですか？", customerResponse: "…まあ、それはうちも例外じゃないけど。で、何ができるの？", score: 6, emotionDelta: 5, quality: "good" },
        { id: "ex-h1-c", label: "会社概要から説明する", icon: "🏢", salesTalk: "弊社は2015年創業のITベンチャーでして、物流業界に特化したシステム開発を行っております——", customerResponse: "…（退屈そう）あのさ、会社の説明はいいから。何が便利なのか教えてくれる？", score: -2, emotionDelta: -5, quality: "neutral" },
        { id: "ex-h1-d", label: "「今だけ特別割引やってます」と価格を出す", icon: "💰", salesTalk: "今日ブースでご契約いただくと、初期費用50万円が無料になるキャンペーン中でして！", customerResponse: "…いや、まだ何のシステムかも聞いてないのに契約とか。（呆れ顔で）じゃ。", score: -5, emotionDelta: -10, quality: "bad" },
      ],
    },
    {
      id: "ex-hook-2", phase: 1, phaseLabel: "興味付け",
      narration: "男性の足が完全に止まった。体がこちらを向いている。興味を持ち始めた証拠だ。",
      customerLine: "ふーん…で、それうちみたいな中規模の会社でも使えるの？",
      choices: [
        { id: "ex-h2-a", label: "同規模の導入事例で安心させる", icon: "🚛", salesTalk: "もちろんです。車両50台規模の会社さんで一番成果が出てます。先月導入いただいた東海物流さん、御社と同じくらいの規模ですけど、残業時間が月40時間減ったそうです。", customerResponse: "東海物流？（驚いた顔）あそこ知ってるよ。同業で…。へぇ、あそこが使ってるんだ。", score: 10, emotionDelta: 10, technique: "同規模事例＋社会的証明", quality: "excellent", hint: "「同じ規模の会社が使っている」は最強の安心材料" },
        { id: "ex-h2-b", label: "「中小企業向けプランがあります」", icon: "📋", salesTalk: "中小企業向けのライトプランがあって、車両10台から導入できます。機能も必要なものだけ選べます。", customerResponse: "ライトプランか…。具体的にどんな機能があるの？", score: 5, emotionDelta: 3, quality: "good" },
        { id: "ex-h2-c", label: "「大手さんメインですが対応可能です」", icon: "🏭", salesTalk: "基本的に大手企業さんがメインのお客様ですが、中規模企業さんにも対応できます。", customerResponse: "…ふーん。大手メインね。（うちは後回しにされそうだな）", score: -2, emotionDelta: -5, quality: "neutral" },
        { id: "ex-h2-d", label: "「詳しくは資料に書いてあります」", icon: "📑", salesTalk: "詳しくはこちらの資料に全部書いてありますので、後でゆっくり読んでください。", customerResponse: "…（資料を受け取りながら）いや、口で説明してよ。資料なんて後で読まないよ。", score: -3, emotionDelta: -5, quality: "bad" },
      ],
    },
    {
      id: "ex-hear-1", phase: 2, phaseLabel: "ヒアリング",
      narration: "男性がブースの前まで来てくれた。ここから具体的な課題を聞き出したい。",
      customerLine: "うちもDX化しなきゃいけないのはわかってるんだけどね。なかなか進まないんだよ。",
      choices: [
        { id: "ex-he1-a", label: "「一番のボトルネック」を聞く", icon: "🎯", salesTalk: "DXが進まない一番のボトルネックって何ですか？現場の抵抗ですか、それともシステム選びですか？", customerResponse: "…正直、両方だね。現場のベテランが「紙でいい」って言うし、どのシステムが合うかもわからん。", score: 8, emotionDelta: 8, technique: "二択質問＋深掘り", quality: "excellent", hint: "二択で聞くと答えやすく、本音が出やすい" },
        { id: "ex-he1-b", label: "「今はどう管理されてますか？」", icon: "📝", salesTalk: "ちなみに今の配車管理はどうされてますか？専用のシステムですか？", customerResponse: "Excelだよ。配車担当が毎朝手作業で組んでる。もう職人芸みたいになってて。", score: 6, emotionDelta: 5, quality: "good" },
        { id: "ex-he1-c", label: "「DXは今やらないと手遅れですよ」と煽る", icon: "⚠️", salesTalk: "正直、今やらないと手遅れになりますよ。競合他社はどんどんDX化してますから。", customerResponse: "…そんなこと言われなくてもわかってるよ。（ムッとした表情）", score: -3, emotionDelta: -6, quality: "neutral" },
        { id: "ex-he1-d", label: "「うちのシステムなら全部解決」と断言", icon: "💪", salesTalk: "大丈夫です！弊社のシステムを入れれば全部解決しますから！", customerResponse: "…全部って。まだ何も聞いてないでしょ。（信用できない顔）", score: -5, emotionDelta: -8, quality: "bad" },
      ],
    },
    {
      id: "ex-hear-2", phase: 2, phaseLabel: "ヒアリング",
      narration: "山田部長が具体的な悩みを話し始めた。展示会でここまで話してくれるのは珍しい。",
      customerLine: "配車のExcelがブラックボックス化しててさ。担当者が辞めたら終わりなんだよ。",
      specialEvent: "silence",
      choices: [
        { id: "ex-he2-a", label: "リスクを可視化して当事者意識を高める", icon: "🔥", salesTalk: "それ、かなり危険ですね。もしその担当者が明日急に辞めたら…配車は誰が組むんですか？", customerResponse: "…（顔が青ざめる）いや、それは…考えたくないけど、実際マズいんだよね。去年ヒヤッとしたことあって。", score: 10, emotionDelta: 8, technique: "リスク可視化＋地獄IF", quality: "excellent", hint: "「もし明日」の一言でリスクを自分事化させる" },
        { id: "ex-he2-b", label: "「属人化の解消」が得意と伝える", icon: "🔧", salesTalk: "属人化の解消は弊社の得意分野です。配車ロジックをシステムに落とし込めば、誰でも80%の精度で配車できるようになります。", customerResponse: "80%か…。まあベテランの100%には勝てないだろうけど、誰でもできるなら意味はあるな。", score: 7, emotionDelta: 5, quality: "good" },
        { id: "ex-he2-c", label: "「マニュアル作ればいいのでは？」と提案", icon: "📖", salesTalk: "まずはその方にマニュアルを書いてもらうのも手ですよね。", customerResponse: "マニュアル？（苦笑）何回も言ったけど、あの人の頭の中の経験値はマニュアルにできないんだよ。", score: 0, emotionDelta: -3, quality: "neutral" },
        { id: "ex-he2-d", label: "「Excelはもう限界ですよ」と否定する", icon: "🚫", salesTalk: "Excelで配車管理してる時点でもう限界ですよ。早くシステム入れないと。", customerResponse: "…そりゃわかってるけどさ。（上から目線で言われるのは不快だ）", score: -3, emotionDelta: -6, quality: "bad" },
      ],
    },
    {
      id: "ex-demo-1", phase: 3, phaseLabel: "デモ",
      narration: "山田部長がブース内のモニターに興味を示している。デモを見せるチャンスだ。",
      customerLine: "…で、そのシステムってどんな画面なの？ちょっと見せてよ。",
      choices: [
        { id: "ex-d1-a", label: "課題に直結するデモだけ見せる", icon: "🖥️", salesTalk: "（モニターで配車画面を開く）これが配車計画の画面です。ドライバーと荷物をドラッグ＆ドロップで割り当てるだけ。AIが最適ルートを自動計算します。今のExcel作業がこれだけになるんです。", customerResponse: "（目を見開く）これだけ？…嘘だろ。うちの担当が3時間かけてやってることが、これだけで？", score: 10, emotionDelta: 12, technique: "課題直結デモ＋驚き演出", quality: "excellent", hint: "デモは全機能ではなく、相手の課題に絞って見せる" },
        { id: "ex-d1-b", label: "全体の機能一覧から説明する", icon: "📋", salesTalk: "まず全体像から説明しますね。配車管理、運行管理、日報管理、請求管理、ダッシュボードの5モジュールがありまして——", customerResponse: "（時計をチラッと見て）あー…全部は今いいから。配車のところだけ見せてくれる？", score: 4, emotionDelta: 0, quality: "good" },
        { id: "ex-d1-c", label: "「まず弊社の紹介動画をご覧ください」", icon: "🎬", salesTalk: "まず3分の紹介動画がありますので、こちらをご覧ください。", customerResponse: "3分？…いや、動画はいいから。画面を直接見せてよ。時間ないんだから。", score: -2, emotionDelta: -5, quality: "neutral" },
        { id: "ex-d1-d", label: "「操作説明書を渡しますね」と資料を出す", icon: "📚", salesTalk: "操作説明書がありますので、こちらをお持ちください。（分厚い冊子を差し出す）", customerResponse: "…（冊子を見て苦笑）いや、こんなの読まないよ。展示会で見せるのはそこじゃないでしょ。", score: -5, emotionDelta: -8, quality: "bad" },
      ],
    },
    {
      id: "ex-demo-2", phase: 3, phaseLabel: "デモ",
      narration: "山田部長がモニターに釘付けになっている。もう一つの強みを見せるタイミングだ。",
      customerLine: "へぇ…ルートの自動計算はいいね。でもうちの配車はもっと複雑でさ、時間指定とか荷物の制約とかあるんだよ。",
      choices: [
        { id: "ex-d2-a", label: "制約条件の設定画面をその場で見せる", icon: "⚙️", salesTalk: "（画面を切り替えて）実はここで時間指定、積載重量、車種制約、全部設定できるんです。たとえばA社は午前指定、B社は4tトラック限定——こうやって入れると、AIが制約を考慮した最適配車を出してくれます。", customerResponse: "おお…（感嘆）これ、まさにうちが毎日やってることだ。設定すれば自動で組めるのか…すごいな。", score: 10, emotionDelta: 10, technique: "具体的デモ＋カスタマイズ訴求", quality: "excellent", hint: "相手の「でも」をデモで即座に解決するのが最強" },
        { id: "ex-d2-b", label: "導入企業の活用事例を伝える", icon: "📊", salesTalk: "同じような複雑な配車をされている物流会社さんでも、導入3ヶ月で配車時間を70%削減されていますよ。", customerResponse: "70%か…。まあ信じたいけど、うちの複雑さは特殊だからなぁ。", score: 6, emotionDelta: 5, quality: "good" },
        { id: "ex-d2-c", label: "「カスタマイズもできます」と口頭で説明", icon: "💬", salesTalk: "カスタマイズも柔軟にできますので、御社の要件に合わせた設定が可能です。", customerResponse: "具体的には？口で言うだけじゃなくて見せてよ。", score: 1, emotionDelta: -2, quality: "neutral" },
        { id: "ex-d2-d", label: "「標準機能で十分対応できます」と言い切る", icon: "✅", salesTalk: "大丈夫です。標準機能で十分対応できますよ。カスタマイズ不要です。", customerResponse: "…うちの業務も知らないのに「十分」って言い切れるの？（不信感）", score: -4, emotionDelta: -7, quality: "bad" },
      ],
    },
    {
      id: "ex-appo-1", phase: 4, phaseLabel: "アポ取り",
      narration: "山田部長の表情が変わった。完全に前のめりだ。ここでアポに繋げたい。",
      customerLine: "…これ、いいかもしれないな。でも展示会で即決はできないよ。上にも話さないといけないし。",
      choices: [
        { id: "ex-ap1-a", label: "「上への説明用」資料を提案＋日程を切る", icon: "📅", salesTalk: "もちろんです。であれば、上司の方への説明用に、御社の配車データで試算したROIシミュレーションをお作りしましょうか？来週30分だけお時間いただければ、オンラインでお見せできます。", customerResponse: "ROIシミュレーション？…それがあると上にも話しやすいな。来週…水曜の午後なら空いてるけど。", score: 10, emotionDelta: 10, technique: "上申支援＋具体日程提示", quality: "excellent", hint: "「上に説明するための武器」を提供すると即アポが取れる" },
        { id: "ex-ap1-b", label: "「無料トライアル」を提案する", icon: "🆓", salesTalk: "2週間の無料トライアルがありますので、まずは実際に使ってみませんか？リスクゼロです。", customerResponse: "無料か…。まあ試すだけなら。でもセットアップとか面倒じゃないの？", score: 6, emotionDelta: 5, technique: "リスクリバーサル", quality: "good" },
        { id: "ex-ap1-c", label: "「ぜひ導入をご検討ください」と言う", icon: "🙏", salesTalk: "ぜひ前向きにご検討いただけますと幸いです。何かあればいつでもご連絡ください。", customerResponse: "あ、うん…。（連絡先もらってもたぶん自分からは連絡しないけどな）", score: -2, emotionDelta: -3, quality: "neutral" },
        { id: "ex-ap1-d", label: "「展示会限定の特別価格」で押す", icon: "🏷️", salesTalk: "今日この場で仮申込みいただければ、展示会限定で初期費用30%オフですよ！", customerResponse: "…さっき「即決できない」って言ったよね？押しが強いなぁ。（一歩引く）", score: -5, emotionDelta: -8, quality: "bad" },
      ],
    },
    {
      id: "ex-appo-2", phase: 4, phaseLabel: "アポ取り",
      narration: "アポの話が具体的になってきた。日程を確定させたい。",
      customerLine: "まあ、話を聞く分にはいいけど…本当に30分で終わる？長い会議は勘弁だよ。",
      choices: [
        { id: "ex-ap2-a", label: "時間を厳守する約束＋議題を明示", icon: "⏱️", salesTalk: "30分厳守でお約束します。内容は①御社の配車データでのROI試算、②実際の画面デモ、③ご質問の3点だけ。超過したら途中でも終わりにします。", customerResponse: "（笑って）はっきりしてるな。…いいよ、水曜14時で。メールアドレス教えるから招待送ってくれ。", score: 10, emotionDelta: 8, technique: "時間厳守宣言＋議題提示", quality: "excellent", hint: "忙しい人には「議題と時間の約束」が最大の安心材料" },
        { id: "ex-ap2-b", label: "「オンラインで手短に」と提案", icon: "💻", salesTalk: "オンラインでサクッとやりましょう。移動時間ゼロなので、昼休みにでもできますよ。", customerResponse: "オンラインか。まあそれなら負担は少ないな。いいよ、日程は後で調整しよう。", score: 6, emotionDelta: 4, quality: "good" },
        { id: "ex-ap2-c", label: "「御社に訪問します」と申し出る", icon: "🚗", salesTalk: "御社にお伺いしますよ。現場も見せていただけると、より具体的な提案ができますし。", customerResponse: "訪問？…いや、わざわざ来てもらうのも気を遣うし。オンラインでいいよ。", score: 2, emotionDelta: -2, quality: "neutral" },
        { id: "ex-ap2-d", label: "「2時間くらい見てもらえれば」と言う", icon: "🕐", salesTalk: "できれば2時間くらい見ていただけると全機能お見せできるんですが。", customerResponse: "2時間？（苦笑）30分って言ったよね？…やっぱり長い会議になりそうだな。", score: -4, emotionDelta: -6, quality: "bad" },
      ],
    },
    {
      id: "ex-card-1", phase: 5, phaseLabel: "名刺交換",
      narration: "山田部長がスーツの内ポケットに手を入れた。名刺交換のタイミングだ。",
      customerLine: "じゃあ名刺交換しとこうか。…（名刺を差し出す）",
      specialEvent: "business_card",
      choices: [
        { id: "ex-ca1-a", label: "名刺を丁寧に受け取り＋次のアクションを確認", icon: "🤝", salesTalk: "ありがとうございます。（両手で受け取り一礼）山田部長、改めてよろしくお願いいたします。では水曜14時にオンラインミーティングの招待をお送りしますね。事前に簡単なヒアリングシートもお送りしてよろしいですか？", customerResponse: "ああ、いいよ。ヒアリングシートか、準備してくれるんだね。…ちゃんとしてるな。よろしく。", score: 10, emotionDelta: 10, technique: "名刺マナー＋ネクストアクション確認", quality: "excellent", hint: "名刺交換で終わらず、次のアクションまで決めると確度が上がる" },
        { id: "ex-ca1-b", label: "名刺を受け取り笑顔でお礼", icon: "😊", salesTalk: "ありがとうございます！（名刺を受け取る）山田部長、今日は貴重なお時間をいただきありがとうございました。来週お楽しみに！", customerResponse: "うん、まあ楽しみにしてるよ。（名刺を見ながら）ちゃんと連絡してきてね。", score: 7, emotionDelta: 5, quality: "good" },
        { id: "ex-ca1-c", label: "名刺を受け取り、自分の名刺を探す", icon: "💼", salesTalk: "あ、すみません…名刺が…（カバンをゴソゴソ）…あ、ありました！（折れた名刺を出す）", customerResponse: "…（苦笑）展示会で名刺切らすのはマズいよ。まあいいけど。", score: 1, emotionDelta: -3, quality: "neutral" },
        { id: "ex-ca1-d", label: "名刺を片手で受け取り、すぐにカバンにしまう", icon: "✋", salesTalk: "（片手で受け取り）どうもー。（すぐに名刺入れにしまう）じゃ、連絡しますね！", customerResponse: "…（顔が曇る）（片手で受け取って即しまうか…この人の会社、大丈夫かな）", score: -5, emotionDelta: -8, quality: "bad" },
      ],
    },
  ],
  getEnding(totalScore, emotion) {
    if (totalScore >= 65 && emotion >= 60) return { id: "hot-lead", title: "アポ確定！ホットリード獲得", emoji: "🏆", description: "展示会でわずか数分の会話からアポを確定させた。山田部長は上司への上申にも前向き。次回商談で成約の可能性大！", grade: "S" };
    if (totalScore >= 45 && emotion >= 40) return { id: "warm-lead", title: "名刺交換＋後日連絡約束", emoji: "📇", description: "名刺交換と後日の連絡約束を獲得。山田部長は興味を持ってくれたが、日程の確定には至らず。フォローメールが勝負です。", grade: "A" };
    if (totalScore >= 25 && emotion >= 20) return { id: "cold-lead", title: "チラシ渡しのみ", emoji: "📄", description: "チラシは受け取ってもらえたものの、名刺交換もアポも取れず。展示会では最初の15秒で興味を引く一言が勝負です。", grade: "B" };
    return { id: "passed-by", title: "素通りされた", emoji: "💨", description: "声をかけたものの立ち止まってもらえず、通り過ぎてしまった。展示会では社名呼びかけや数字インパクトで相手の足を止める工夫が必要です。", grade: "C" };
  },
};
