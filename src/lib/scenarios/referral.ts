import type { ScenarioConfig } from "./types";

export const referral: ScenarioConfig = {
  meta: {
    id: "referral",
    title: "紹介営業 — 既存客からの紹介商談",
    shortTitle: "紹介営業",
    emoji: "🤝",
    description: "既存顧客の鈴木社長から紹介された新規顧客と商談。紹介者の信頼を活かしつつ、独自の関係を築け。",
    location: "新宿 高層ビル 会議室",
    customerType: "40代女性 / IT企業 取締役 / 紹介なので礼儀正しいが見る目は厳しい",
    product: "社内研修プラットフォーム",
    sceneType: "office",
    difficulty: "intermediate",
  },
  phaseLabels: ["挨拶", "関係構築", "ヒアリング", "プレゼン", "クロージング", "紹介連鎖"],
  initialEmotion: 45,
  introScenes: [
    { id: "rf-intro-1", text: "株式会社ネクストビジョン", subText: "新宿 高層ビル 28階・会議室", duration: 2500 },
    { id: "rf-intro-2", text: "鈴木社長から紹介された\n中村取締役との初めての商談", subText: "「鈴木さんの紹介なら会いましょう」と快諾してくれた", duration: 3000 },
    { id: "rf-intro-3", text: "紹介の信頼を活かしつつ\n自分自身の価値を証明する——", duration: 2000 },
  ],
  nodeOrder: [
    "rf-greet-1", "rf-relate-1", "rf-relate-2",
    "rf-hear-1", "rf-hear-2", "rf-present-1",
    "rf-present-2", "rf-close-1", "rf-chain-1", "rf-chain-2",
  ],
  gameNodes: [
    /* ══════════════════════════════════════════════════════════
       Phase 0: 挨拶（1 node）
    ══════════════════════════════════════════════════════════ */
    {
      id: "rf-greet-1", phase: 0, phaseLabel: "挨拶",
      narration: "会議室に通された。窓の向こうに新宿の街が広がっている。中村取締役が入ってきた。",
      customerLine: "はじめまして。鈴木さんからお話は伺っています。中村です。",
      specialEvent: "business_card",
      choices: [
        { id: "rf-g1-a", label: "紹介者への感謝＋自分の価値を伝える", icon: "✨", salesTalk: "はじめまして、○○会社の△△と申します。鈴木社長にはいつも大変お世話になっておりまして、今回ご紹介いただけたこと本当に嬉しく思います。中村様のお役に立てるよう、本日は精一杯お話しさせていただきます。", customerResponse: "ご丁寧にありがとうございます。鈴木さんが「この人は信頼できる」って言ってたので、楽しみにしてたんですよ。", score: 8, emotionDelta: 8, technique: "紹介感謝＋自立宣言", quality: "excellent", hint: "紹介者への感謝と自分の価値提示を両立させる" },
        { id: "rf-g1-b", label: "丁寧に名刺交換する", icon: "📇", salesTalk: "はじめまして、○○会社の△△と申します。（名刺を両手で差し出す）本日はお忙しいところお時間をいただきありがとうございます。", customerResponse: "中村です。（名刺を受け取る）わざわざお越しいただいてすみません。さて、どんなお話でしょう？", score: 5, emotionDelta: 3, technique: "名刺交換", quality: "good" },
        { id: "rf-g1-c", label: "鈴木社長の話題ばかり出す", icon: "💬", salesTalk: "鈴木社長にはもう3年お世話になってて、先月も一緒にゴルフ行きまして。鈴木さんって本当にいい方ですよね！", customerResponse: "…ええ、鈴木さんは良い方ですね。（この人は鈴木さんの話しかしないのかな…）で、今日のお話は？", score: 0, emotionDelta: -2, quality: "neutral" },
        { id: "rf-g1-d", label: "馴れ馴れしく接する", icon: "👋", salesTalk: "あー、中村さんですね！ 鈴木さんから聞いてますよ！ いやー紹介だから気楽にいきましょうよ！", customerResponse: "…（眉をひそめる）初対面ですし、もう少し丁寧にお願いできますか。", score: -5, emotionDelta: -8, quality: "bad" },
      ],
    },

    /* ══════════════════════════════════════════════════════════
       Phase 1: 関係構築（2 nodes）
    ══════════════════════════════════════════════════════════ */
    {
      id: "rf-relate-1", phase: 1, phaseLabel: "関係構築",
      narration: "名刺交換を終え、席に着いた。中村取締役は姿勢良く、こちらを見ている。",
      customerLine: "鈴木さんから「研修に強い方」と聞いていますが、具体的にどんなことをされているんですか？",
      choices: [
        { id: "rf-r1-a", label: "実績を簡潔に伝えつつ相手に質問を返す", icon: "🎯", salesTalk: "ありがとうございます。弊社は社内研修プラットフォームを提供していまして、鈴木社長のところでは新人の立ち上がりが2ヶ月短縮できました。ところで、中村様のところでは今どんな研修をされているんですか？", customerResponse: "2ヶ月も？ それはすごいですね。うちは…正直、研修らしい研修ができてなくて。OJT任せなんです。", score: 8, emotionDelta: 7, technique: "実績提示＋質問返し", quality: "excellent", hint: "実績で信頼を得つつ、主導権を渡して相手の状況を聞く" },
        { id: "rf-r1-b", label: "鈴木社長での成果を詳しく話す", icon: "📊", salesTalk: "鈴木社長の会社では、弊社プラットフォーム導入後に研修コストが40%削減、離職率も改善しました。", customerResponse: "へえ、鈴木さんのところでそこまで成果が出てるんですか。具体的にどんな仕組みなんですか？", score: 6, emotionDelta: 5, technique: "第三者実績", quality: "good" },
        { id: "rf-r1-c", label: "会社の沿革から長々と説明する", icon: "🏢", salesTalk: "弊社は2015年に設立しまして、最初はeラーニングのコンテンツ制作から始めて、2018年にプラットフォーム開発に舵を切り…", customerResponse: "（時計を見る）…すみません、あまり時間がないので、ポイントだけお願いできますか。", score: 1, emotionDelta: -3, quality: "neutral" },
        { id: "rf-r1-d", label: "「何でもできます」と大風呂敷を広げる", icon: "💪", salesTalk: "研修のことなら何でもお任せください！ eラーニングも集合研修もコーチングも全部できます！", customerResponse: "…何でもって言われると逆に不安なんですけど。専門性が見えないというか。", score: -3, emotionDelta: -6, quality: "bad" },
      ],
    },
    {
      id: "rf-relate-2", phase: 1, phaseLabel: "関係構築",
      narration: "中村取締役が少しリラックスしてきた。紹介者の話から、自分たちの話題に移りつつある。",
      customerLine: "鈴木さんの紹介ということで会いましたが、正直うちに合うかはまだわからないですよね。",
      choices: [
        { id: "rf-r2-a", label: "正直に認めて信頼を築く", icon: "🤝", salesTalk: "おっしゃる通りです。紹介とはいえ、御社に合うかは今日のお話次第だと思っています。合わなければ遠慮なくお断りください。合うかどうか、一緒に確認させていただけませんか？", customerResponse: "…（少し驚いた顔で）そう言ってくれると安心しますね。じゃあ、率直にお話しましょう。", score: 10, emotionDelta: 10, technique: "先回り＋誠実対応", quality: "excellent", hint: "紹介に頼らず、自分の力で信頼を勝ち取る姿勢を見せる" },
        { id: "rf-r2-b", label: "「だからこそヒアリングさせてください」と提案", icon: "🔍", salesTalk: "だからこそ、まずは御社の状況をしっかり聞かせていただきたいんです。その上で合うかどうか、一緒に判断しましょう。", customerResponse: "それは理にかなってますね。何を聞きたいですか？", score: 7, emotionDelta: 5, technique: "ゴール共有", quality: "good" },
        { id: "rf-r2-c", label: "「鈴木さんが太鼓判を押してるので大丈夫」と言う", icon: "👍", salesTalk: "鈴木社長が自信を持ってご紹介してくださったので、きっと御社にも合うと思いますよ！", customerResponse: "…鈴木さんを信じてないわけじゃないですけど、自分の目で判断したいんです。", score: 0, emotionDelta: -3, quality: "neutral" },
        { id: "rf-r2-d", label: "「紹介だから特別価格で」と値引きを持ち出す", icon: "💴", salesTalk: "鈴木社長のご紹介ですから、特別にお値引きさせていただきますよ。", customerResponse: "いえ、値段の話はまだ早いでしょう。そもそも何ができるのか聞いてないですし。", score: -4, emotionDelta: -7, quality: "bad" },
      ],
    },

    /* ══════════════════════════════════════════════════════════
       Phase 2: ヒアリング（2 nodes）
    ══════════════════════════════════════════════════════════ */
    {
      id: "rf-hear-1", phase: 2, phaseLabel: "ヒアリング",
      narration: "関係構築ができてきた。中村取締役は本音を話し始めている。",
      customerLine: "実はうち、去年エンジニアの離職率が20%を超えたんですよ。研修体制の不備が一因だと思っています。",
      choices: [
        { id: "rf-h1-a", label: "数字を拾って深掘りする", icon: "📉", salesTalk: "20%ですか…かなり深刻な数字ですね。離職された方は入社何年目の方が多いですか？ また、退職理由で多かったものは何でしょう？", customerResponse: "入社1〜2年目が多いですね。「スキルアップの機会がない」「放置されてる感じがした」って声がありました。（ため息）", score: 8, emotionDelta: 7, technique: "数字深掘り＋具体化", quality: "excellent", hint: "相手が出した数字を拾い、さらに具体的に掘り下げる" },
        { id: "rf-h1-b", label: "共感しつつ背景を聞く", icon: "💭", salesTalk: "それは経営として辛い状況ですね…。採用コストも相当かかっていらっしゃるのでは？", customerResponse: "そうなんです。1人採用するのに200万近くかかるので、5人辞めたら1,000万の損失ですよ。", score: 6, emotionDelta: 5, technique: "共感＋コスト換算", quality: "good" },
        { id: "rf-h1-c", label: "「うちのプラットフォームなら解決できます」と即答", icon: "✅", salesTalk: "それならまさに弊社のプラットフォームがぴったりです！ 離職率改善の実績もたくさんあります。", customerResponse: "…まだ詳しい状況を話してないのに「ぴったり」って言われても。もう少し聞いてもらえますか。", score: -2, emotionDelta: -5, quality: "neutral" },
        { id: "rf-h1-d", label: "「IT企業なら自社で研修システム作れませんか？」と聞く", icon: "💻", salesTalk: "ちなみに御社はIT企業ですよね？ 自社で研修システムを作るという選択肢はなかったんですか？", customerResponse: "…（表情が曇る）それができれば苦労しませんよ。エンジニアのリソースは開発で手一杯です。", score: -4, emotionDelta: -6, quality: "bad" },
      ],
    },
    {
      id: "rf-hear-2", phase: 2, phaseLabel: "ヒアリング",
      narration: "中村取締役の表情が真剣になってきた。本質的な課題が見え始めている。",
      customerLine: "新人を育てたい気持ちはあるんですが、先輩エンジニアも忙しくて教える余裕がないんです。",
      specialEvent: "silence",
      choices: [
        { id: "rf-h2-a", label: "理想の状態を聞いて課題を明確化する", icon: "🌟", salesTalk: "もし理想的な研修体制が整ったら、新人の方にはどんな状態になってほしいですか？", customerResponse: "…入社3ヶ月で基本的な開発業務を回せるようになってほしいです。今は半年かかってますし、途中で辞める子もいて…。", score: 8, emotionDelta: 8, technique: "理想状態ヒアリング", quality: "excellent", hint: "問題ではなく理想を聞くことで、前向きな議論に導く" },
        { id: "rf-h2-b", label: "「それは何人分の工数ですか？」と定量化", icon: "📊", salesTalk: "先輩エンジニアの方が新人教育に使っている時間は、週何時間くらいですか？", customerResponse: "1人あたり週5〜6時間くらいですかね。メンターが3人いるので、合計で週15時間以上…。かなりの負担です。", score: 7, emotionDelta: 5, technique: "定量化ヒアリング", quality: "good" },
        { id: "rf-h2-c", label: "「鈴木社長のところも同じでした」と事例を出す", icon: "👥", salesTalk: "実は鈴木社長のところも最初は同じ悩みを抱えていらっしゃいました。", customerResponse: "あ、そうなんですか？ …でも製造業とITじゃ事情が違うと思いますけど。", score: 3, emotionDelta: 0, quality: "neutral" },
        { id: "rf-h2-d", label: "「そろそろ提案に移りましょう」と急ぐ", icon: "➡️", salesTalk: "なるほど、課題は理解しました。それでは具体的な提案をさせてください。", customerResponse: "…もう少し状況を聞いてもらえると思ったんですが。まあ、聞きましょう。", score: -2, emotionDelta: -4, quality: "bad" },
      ],
    },

    /* ══════════════════════════════════════════════════════════
       Phase 3: プレゼン（2 nodes）
    ══════════════════════════════════════════════════════════ */
    {
      id: "rf-present-1", phase: 3, phaseLabel: "プレゼン",
      narration: "課題が明確になった。いよいよ提案だ。ヒアリングで得た情報をどう活かすかが勝負。",
      customerLine: "で、具体的にどうやって解決できるんですか？",
      specialEvent: "document_timing",
      choices: [
        { id: "rf-p1-a", label: "課題に紐づけて段階的に提案する", icon: "📋", salesTalk: "先ほどの「3ヶ月で戦力化」というゴールに対して、弊社プラットフォームでは3つのステップで実現します。まず、基礎スキルのeラーニングで先輩の教育負担を80%削減。次に、実践課題でアウトプット力を鍛える。最後に、進捗ダッシュボードで上司が成長を可視化できます。", customerResponse: "…なるほど。（メモを取り始める）特に先輩の負担軽減は大きいですね。80%ってどういう計算ですか？", score: 10, emotionDelta: 10, technique: "課題接続＋段階提案", quality: "excellent", hint: "ヒアリングで聞いた相手の言葉を使って提案に接続する" },
        { id: "rf-p1-b", label: "鈴木社長での成功事例を軸に説明する", icon: "📈", salesTalk: "鈴木社長の会社では、導入6ヶ月で新人の立ち上がりが2ヶ月短縮されました。（タブレットで事例を見せる）こちらがビフォーアフターの比較データです。", customerResponse: "数字で見ると説得力ありますね。でもうちはIT企業だから、コンテンツが合うかどうか…。", score: 7, emotionDelta: 6, technique: "紹介元事例＋データ提示", quality: "good" },
        { id: "rf-p1-c", label: "機能を網羅的に紹介する", icon: "🖥️", salesTalk: "弊社のプラットフォームには、eラーニング、テスト機能、動画研修、メンター管理、分析ダッシュボード、社内Wiki、チャット機能…", customerResponse: "（目が泳ぐ）…ちょっと情報が多すぎます。うちの課題に関係するところだけ教えてもらえますか？", score: 1, emotionDelta: -3, quality: "neutral" },
        { id: "rf-p1-d", label: "「他社も皆導入してます」と同調圧力をかける", icon: "🌍", salesTalk: "IT業界では大手のA社もB社も導入済みです。御社だけ遅れるわけにはいかないですよね。", customerResponse: "…他社が使ってるから導入するって発想はないです。うちに必要かどうかで判断します。", score: -5, emotionDelta: -8, quality: "bad" },
      ],
    },
    {
      id: "rf-present-2", phase: 3, phaseLabel: "プレゼン",
      narration: "中村取締役がメモを取っている。関心は確実に高まっている。",
      customerLine: "面白い仕組みですね…。ただ、現場のエンジニアが使ってくれるか心配です。",
      choices: [
        { id: "rf-p2-a", label: "導入プロセスの安心感を伝える", icon: "🛡️", salesTalk: "ごもっともです。だからこそ弊社では「導入サポートチーム」が最初の3ヶ月間、現場に入って定着を支援します。管理画面の操作説明から、コンテンツ設計まで伴走します。使われなければ意味がないですからね。", customerResponse: "3ヶ月もサポートがつくんですか？ それなら現場も安心かも。（うなずく）", score: 8, emotionDelta: 8, technique: "不安払拭＋伴走提案", quality: "excellent", hint: "相手の不安に対して具体的な解決策を提示し安心させる" },
        { id: "rf-p2-b", label: "UIの簡単さをデモで見せる", icon: "📱", salesTalk: "（タブレットを渡す）実際に触ってみてください。3ステップで研修コースが作れます。エンジニアの方ならすぐ使いこなせますよ。", customerResponse: "（操作してみて）あ、意外と直感的ですね。これならうちのメンバーも使えそう。", score: 7, emotionDelta: 6, technique: "体験型デモ", quality: "good" },
        { id: "rf-p2-c", label: "「慣れれば大丈夫です」と軽く流す", icon: "👌", salesTalk: "最初は戸惑うかもしれませんが、使っていけば慣れますよ。皆さんそうおっしゃいます。", customerResponse: "…「慣れる」で片づけられると不安なんですけど。具体的にどうサポートしてくれるんですか？", score: 0, emotionDelta: -3, quality: "neutral" },
        { id: "rf-p2-d", label: "「使わない人は評価に反映すれば」と提案", icon: "⚠️", salesTalk: "使わないエンジニアには評価に反映するようにすれば、嫌でも使うようになりますよ。", customerResponse: "…そういう強制は弊社の文化に合いません。（明らかに不快な表情）", score: -5, emotionDelta: -10, quality: "bad" },
      ],
    },

    /* ══════════════════════════════════════════════════════════
       Phase 4: クロージング（1 node）
    ══════════════════════════════════════════════════════════ */
    {
      id: "rf-close-1", phase: 4, phaseLabel: "クロージング",
      narration: "中村取締役の表情は好意的だ。しかしまだ最後の一押しが必要。",
      customerLine: "話はよくわかりました。前向きに検討したいんですが…社内の合意も必要なので。",
      choices: [
        { id: "rf-c1-a", label: "次のステップを具体的に提案する", icon: "📅", salesTalk: "ぜひお願いします。では具体的に、来週CTO様も交えた30分のデモミーティングを設定させていただけませんか？ 中村様から社内に説明する際の資料もこちらで準備します。", customerResponse: "そこまでしてくれるんですか。それなら来週水曜の午後はどうでしょう。CTOの山田にも声をかけておきます。", score: 10, emotionDelta: 8, technique: "具体的ネクストステップ", quality: "excellent", hint: "「検討します」で終わらせず、次の具体的行動を提示する" },
        { id: "rf-c1-b", label: "無料トライアルを提案する", icon: "🏁", salesTalk: "まずは2週間の無料トライアルから始めませんか？ 実際に使ってみて、合わなければ辞めていただいて大丈夫です。", customerResponse: "無料なら試しやすいですね。社内にも説明しやすいです。", score: 7, emotionDelta: 5, technique: "ステップダウン", quality: "good" },
        { id: "rf-c1-c", label: "「ぜひご検討ください」と引く", icon: "🙏", salesTalk: "ありがとうございます。ぜひ社内でご検討ください。何かあればいつでもご連絡を。", customerResponse: "はい…（このまま流れそうだな）検討しておきます。", score: -2, emotionDelta: -3, quality: "neutral" },
        { id: "rf-c1-d", label: "「鈴木社長にも後押ししてもらいます」と圧力をかける", icon: "📞", salesTalk: "鈴木社長にも御社に連絡してもらいましょうか？ 「導入した方がいい」って言ってもらえれば——", customerResponse: "…それはやめてください。紹介してもらったのは感謝してますが、鈴木さんの顔で決めるつもりはありません。", score: -5, emotionDelta: -10, quality: "bad" },
      ],
    },

    /* ══════════════════════════════════════════════════════════
       Phase 5: 紹介連鎖（2 nodes）
    ══════════════════════════════════════════════════════════ */
    {
      id: "rf-chain-1", phase: 5, phaseLabel: "紹介連鎖",
      narration: "商談は良い方向に進んでいる。ここからが紹介営業の真骨頂——次の紹介を獲得できるかどうかだ。",
      customerLine: "（商談が一段落して）いいお話が聞けました。鈴木さんに紹介してもらって良かったです。",
      choices: [
        { id: "rf-ch1-a", label: "価値提供を先にしてから紹介を依頼", icon: "💎", salesTalk: "ありがとうございます。ところで、先ほどの研修設計のノウハウ資料、社内共有用に別途お送りしますね。あと…もし中村様のお知り合いで、同じように人材育成でお困りの方がいらっしゃれば、ぜひご紹介いただけると嬉しいです。", customerResponse: "資料ありがとうございます、助かります。紹介…そうですね、1社心当たりがあります。同業のグロース社の佐藤さん。同じ悩みを抱えていたような。", score: 10, emotionDelta: 8, technique: "価値先行＋紹介依頼", quality: "excellent", hint: "先に価値を提供してから紹介を依頼する。Give firstの精神" },
        { id: "rf-ch1-b", label: "率直に紹介をお願いする", icon: "🙏", salesTalk: "お力になれそうで嬉しいです。実は弊社は紹介でのご縁を大切にしておりまして…もし同じようなお悩みをお持ちの方がいらっしゃれば、ご紹介いただけないでしょうか。", customerResponse: "そうですね…。まだ導入を決めたわけではないですが、話を聞く価値はあると思うので。1人思い当たる方がいます。", score: 7, emotionDelta: 5, technique: "直接紹介依頼", quality: "good" },
        { id: "rf-ch1-c", label: "紹介のお願いは控える", icon: "🤐", salesTalk: "こちらこそ、貴重なお時間をいただきありがとうございました。今後ともよろしくお願いいたします。", customerResponse: "はい、こちらこそ。（紹介の話は出ないか…まあいいけど）", score: 2, emotionDelta: 0, quality: "neutral" },
        { id: "rf-ch1-d", label: "「紹介が義務」のように伝える", icon: "📢", salesTalk: "弊社では紹介制度がありまして、ご紹介いただくと中村様にもメリットがあるんです。ノルマじゃないですけど、2〜3名ご紹介いただけると——", customerResponse: "…ノルマじゃないと言いつつ、プレッシャーを感じますね。ちょっとそういうのは苦手です。", score: -5, emotionDelta: -8, quality: "bad" },
      ],
    },
    {
      id: "rf-chain-2", phase: 5, phaseLabel: "紹介連鎖",
      narration: "商談の最終局面。別れ際の一言が、今後の関係を決定づける。",
      customerLine: "今日はいい話が聞けました。それでは、また来週。",
      choices: [
        { id: "rf-ch2-a", label: "紹介者への報告と感謝を約束する", icon: "💌", salesTalk: "ありがとうございます。本日の内容は私から鈴木社長にもお礼と共にご報告させていただきますね。中村様にお会いできて良い商談ができました、と。来週お目にかかれるのを楽しみにしています。", customerResponse: "（笑顔で）ぜひそうしてください。鈴木さんにもよろしくお伝えください。来週、楽しみにしています。", score: 10, emotionDelta: 10, technique: "紹介者ケア＋関係継続", quality: "excellent", hint: "紹介者への敬意を示すことで、紹介の連鎖が生まれる信頼関係を築く" },
        { id: "rf-ch2-b", label: "議事録と次回アジェンダを送ると伝える", icon: "📧", salesTalk: "本日中に議事録と来週のアジェンダをメールでお送りします。事前にCTO様にも共有いただけると、来週がスムーズになります。", customerResponse: "準備がいいですね。助かります。山田にも転送しておきます。", score: 7, emotionDelta: 5, technique: "アフターフォロー宣言", quality: "good" },
        { id: "rf-ch2-c", label: "「何かあればご連絡ください」と言って帰る", icon: "🚶", salesTalk: "本日はありがとうございました。何かご不明点があればいつでもご連絡ください。", customerResponse: "はい。ありがとうございました。（普通に終わったな…）", score: 2, emotionDelta: 0, quality: "neutral" },
        { id: "rf-ch2-d", label: "「契約書も持ってきてるんですが」と粘る", icon: "📝", salesTalk: "あ、ちなみに今日お決めいただければ、契約書はこちらに用意してあるんですが…。", customerResponse: "…今日は検討すると言いましたよね。そういう押し方は好きじゃないです。（冷めた表情で立ち上がる）", score: -5, emotionDelta: -8, quality: "bad" },
      ],
    },
  ],
  getEnding(totalScore, emotion) {
    if (totalScore >= 65 && emotion >= 60)
      return {
        id: "referral-chain",
        title: "紹介連鎖成功！",
        emoji: "🏆",
        description: "見事！商談を成約に導いただけでなく、新たな紹介先まで獲得しました。紹介者の信頼を活かしつつ自分自身の価値を証明し、紹介の連鎖を生み出す理想的な営業ができています。",
        grade: "S",
      };
    if (totalScore >= 45 && emotion >= 40)
      return {
        id: "deal-closed",
        title: "成約＋好印象",
        emoji: "📈",
        description: "商談を成約に導きました。中村取締役からの信頼も獲得できています。紹介連鎖には至りませんでしたが、次回のフォローで紹介を得られる可能性は十分あります。",
        grade: "A",
      };
    if (totalScore >= 25 && emotion >= 20)
      return {
        id: "under-review",
        title: "検討中",
        emoji: "🤔",
        description: "話は聞いてもらえましたが、強い関心は引き出せませんでした。紹介の信頼に頼りすぎず、相手固有の課題をもっと深掘りすると、より良い結果に繋がります。",
        grade: "B",
      };
    return {
      id: "referral-damaged",
      title: "紹介者の顔に泥",
      emoji: "😥",
      description: "紹介者である鈴木社長の信頼まで損なう結果に。紹介営業では自分の評価が紹介者の評価にも直結します。まずは基本的な礼儀とヒアリングを大切にしましょう。",
      grade: "C",
    };
  },
};
