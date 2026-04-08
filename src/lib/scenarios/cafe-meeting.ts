import type { ScenarioConfig } from "./types";

export const cafeMeeting: ScenarioConfig = {
  meta: {
    id: "cafe-meeting",
    title: "カフェ商談 — 紹介先との初回面談",
    shortTitle: "カフェ商談",
    emoji: "☕",
    description: "知人の紹介でカフェで初対面の経営者と面談。リラックスした雰囲気の中、自然に信頼関係を構築せよ。",
    location: "渋谷 高級カフェ",
    customerType: "30代女性 / 美容サロン経営者 / 興味はあるが警戒",
    product: "予約管理＋集客支援SaaS",
    sceneType: "cafe",
    difficulty: "beginner",
  },
  phaseLabels: ["到着", "アイスブレイク", "ヒアリング", "提案", "クロージング", "フォロー"],
  initialEmotion: 40,
  introScenes: [
    { id: "cm-intro-1", text: "渋谷 高級カフェ", subText: "知人・佐藤さんからの紹介で初対面の面談", duration: 2500 },
    { id: "cm-intro-2", text: "美容サロン経営者の\n鈴木さんと待ち合わせ", subText: "落ち着いた店内にジャズが流れている——", duration: 2500 },
    { id: "cm-intro-3", text: "窓際の席に\n女性が座っている——", duration: 2000 },
  ],
  nodeOrder: [
    "cm-arrive-1", "cm-ice-1", "cm-ice-2",
    "cm-hear-1", "cm-hear-2", "cm-propose-1",
    "cm-propose-2", "cm-close-1", "cm-follow-1", "cm-follow-2",
  ],
  gameNodes: [
    {
      id: "cm-arrive-1", phase: 0, phaseLabel: "到着",
      narration: "カフェの入り口に着いた。窓際の席に、紹介先の鈴木さんらしき女性が座っている。",
      choices: [
        { id: "cm-a1-a", label: "笑顔で挨拶＋紹介者の名前を出す", icon: "😊", salesTalk: "はじめまして！佐藤さんからご紹介いただきました△△です。今日はお時間いただきありがとうございます。", customerResponse: "あ、佐藤さんの！はい、鈴木です。聞いてますよ。どうぞ座ってください。", score: 8, emotionDelta: 8, technique: "紹介者活用＋笑顔", quality: "excellent", hint: "紹介者の名前を出すと一気に警戒が解ける" },
        { id: "cm-a1-b", label: "丁寧に名刺を渡して自己紹介", icon: "🤝", salesTalk: "はじめまして、〇〇会社の△△と申します。（名刺を差し出す）本日はよろしくお願いいたします。", customerResponse: "あ、はい…鈴木です。（名刺を受け取る）…カフェで名刺交換ってちょっと堅いですね（笑）", score: 4, emotionDelta: 2, quality: "good" },
        { id: "cm-a1-c", label: "先にドリンクを注文してから声をかける", icon: "☕", salesTalk: "（カウンターでコーヒーを注文してから）…お待たせしました。△△です。", customerResponse: "…あ、先に注文されてたんですね。（10分も待ったんだけど…）はい、鈴木です。", score: 0, emotionDelta: -3, quality: "neutral" },
        { id: "cm-a1-d", label: "遅刻して焦りながら到着", icon: "💦", salesTalk: "すみません！道に迷っちゃって！はぁはぁ…△△です！", customerResponse: "…あ、はい。（15分遅刻か…佐藤さんの紹介じゃなかったら帰ってたわ）", score: -5, emotionDelta: -8, quality: "bad" },
      ],
    },
    {
      id: "cm-ice-1", phase: 1, phaseLabel: "アイスブレイク",
      narration: "席に着いた。鈴木さんはカフェラテを飲みながらこちらを見ている。まずは雰囲気を和ませたい。",
      customerLine: "佐藤さんから「面白い人がいる」って聞いたんですけど、どんなお仕事されてるんですか？",
      choices: [
        { id: "cm-i1-a", label: "相手のサロンを褒めてから答える", icon: "✨", salesTalk: "お仕事の前に——鈴木さんのサロン、Instagramで見ました！内装がすごくおしゃれで。あの世界観、鈴木さんがデザインされたんですか？", customerResponse: "え、見てくれたんですか！？（パッと表情が明るくなる）そうなんです！自分でこだわって…って、嬉しい！", score: 10, emotionDelta: 12, technique: "褒め＋事前リサーチ", quality: "excellent", hint: "相手の仕事を事前に調べて褒めると距離が一気に縮まる" },
        { id: "cm-i1-b", label: "簡潔に自社サービスを説明", icon: "💼", salesTalk: "美容サロンさん向けの予約管理と集客をお手伝いするサービスをやっています。佐藤さんにも以前ご紹介いただいて。", customerResponse: "あー、そういうサービスなんですね。（ふーん…営業されるのかな）", score: 4, emotionDelta: 0, quality: "good" },
        { id: "cm-i1-c", label: "「佐藤さんとは仲いいんですか？」と聞く", icon: "💬", salesTalk: "ちなみに鈴木さんと佐藤さんはどういうご関係なんですか？", customerResponse: "大学の同期です。…で、今日はどういうお話なんですか？（早く本題に入りたそう）", score: 2, emotionDelta: -2, quality: "neutral" },
        { id: "cm-i1-d", label: "いきなりパンフレットを出す", icon: "📄", salesTalk: "早速なんですが（カバンからパンフレットを出す）、弊社のサービスについてご説明させてください。", customerResponse: "…え、もう営業ですか？（引いた表情）カフェで資料広げるのはちょっと…", score: -5, emotionDelta: -10, quality: "bad" },
      ],
    },
    {
      id: "cm-ice-2", phase: 1, phaseLabel: "アイスブレイク",
      narration: "会話が少し弾んできた。鈴木さんがサロンの話をしてくれている。",
      customerLine: "うちのサロン、おかげさまで3年目なんですけど…最近ちょっと伸び悩んでて。",
      choices: [
        { id: "cm-i2-a", label: "共感＋ゴール共有で安心感を作る", icon: "🎯", salesTalk: "3年続けてるってすごいですよ。今日は売り込みじゃなくて、鈴木さんの悩みを聞かせてもらえたらって思ってます。もし役に立てそうなら提案しますし、合わなければ遠慮なく言ってください。", customerResponse: "…ありがとうございます。そう言ってもらえると話しやすいです。（肩の力が抜けた表情）", score: 10, emotionDelta: 10, technique: "ゴール共有＋先回り", quality: "excellent", hint: "「売り込みじゃない」と先に宣言すると警戒が解ける" },
        { id: "cm-i2-b", label: "「伸び悩み」について深掘りする", icon: "🔍", salesTalk: "伸び悩みっていうのは、具体的にどのあたりですか？集客ですか、リピート率ですか？", customerResponse: "んー…両方かな。新規も来るんですけど、リピーターがなかなか定着しなくて。", score: 6, emotionDelta: 5, quality: "good" },
        { id: "cm-i2-c", label: "「うちのサービスがお役に立てます」", icon: "💪", salesTalk: "それなら弊社のサービスがぴったりですよ！集客もリピートも全部解決できます。", customerResponse: "（少し引いた表情）…まだ具体的に何も言ってないのに「ぴったり」って言われても…", score: -3, emotionDelta: -5, quality: "neutral" },
        { id: "cm-i2-d", label: "「3年で伸び悩みって厳しいですね」", icon: "😥", salesTalk: "3年目で伸び悩みかぁ…それは厳しいですね。このままだと危ないかもしれませんよ。", customerResponse: "…え？（ムッとした表情）別に潰れそうとは言ってませんけど。", score: -5, emotionDelta: -10, quality: "bad" },
      ],
    },
    {
      id: "cm-hear-1", phase: 2, phaseLabel: "ヒアリング",
      narration: "鈴木さんが少しずつ本音を話し始めた。ここが勝負どころだ。",
      customerLine: "予約の管理がけっこう大変で…電話とLINEとホットペッパーがバラバラなんですよね。",
      choices: [
        { id: "cm-h1-a", label: "第三者話法で共感を広げる", icon: "👥", salesTalk: "実は他のサロンオーナーさんも同じことおっしゃるんです。「予約のダブルブッキングが怖くて夜も確認してる」って。鈴木さんもそういうことありますか？", customerResponse: "あります！この前もダブルブッキングしちゃって…お客様に謝って。もう本当に冷や汗もので。", score: 8, emotionDelta: 8, technique: "第三者話法", quality: "excellent", hint: "同業者の具体的な悩みを出すと「自分だけじゃない」と安心する" },
        { id: "cm-h1-b", label: "「具体的にどう管理してますか？」", icon: "📋", salesTalk: "ちなみに今は具体的にどうやって管理されてるんですか？紙ですか、アプリですか？", customerResponse: "紙の予約帳とスマホのメモと…あとExcelも使ったり。バラバラなんですよね。", score: 5, emotionDelta: 3, quality: "good" },
        { id: "cm-h1-c", label: "「ホットペッパーは辞めた方がいいですよ」", icon: "❌", salesTalk: "ホットペッパーは手数料高いですからね。正直、辞めた方がいいと思いますよ。", customerResponse: "…でも新規のお客様はほとんどホットペッパー経由なんで、簡単には辞められないです。", score: -2, emotionDelta: -5, quality: "neutral" },
        { id: "cm-h1-d", label: "「それは効率悪いですね」と指摘する", icon: "⚠️", salesTalk: "それは効率悪いですね。なんでもっと早くシステム入れなかったんですか？", customerResponse: "…（表情が固まる）いや、そう言われても…忙しくて調べる暇もなかったんで。", score: -5, emotionDelta: -8, quality: "bad" },
      ],
    },
    {
      id: "cm-hear-2", phase: 2, phaseLabel: "ヒアリング",
      narration: "鈴木さんの表情が真剣になってきた。悩みが深いことが伝わってくる。",
      customerLine: "あと、新規集客も…Instagramは頑張ってるんですけど、フォロワーが増えても予約に繋がらなくて。",
      specialEvent: "silence",
      choices: [
        { id: "cm-h2-a", label: "沈黙を使って鈴木さんの本音を引き出す", icon: "🤫", salesTalk: "（静かにうなずきながら、鈴木さんの言葉を待つ）…。", customerResponse: "…正直、一人で全部やるのが限界で。施術もして、集客もして、経理もして。夜中まで作業してる日もあって…（目が潤む）", score: 10, emotionDelta: 10, technique: "沈黙＋傾聴", quality: "excellent", hint: "沈黙は最高のヒアリングスキル。相手が自ら深い悩みを話し出す" },
        { id: "cm-h2-b", label: "「投稿頻度はどのくらいですか？」と聞く", icon: "📱", salesTalk: "Instagramの投稿頻度はどのくらいですか？週に何回くらい投稿されてます？", customerResponse: "週3回くらいですかね。写真撮って加工して投稿して…1投稿に1時間くらいかかるんです。", score: 5, emotionDelta: 3, technique: "時間軸計算", quality: "good" },
        { id: "cm-h2-c", label: "「SNS集客のコツ教えましょうか？」", icon: "📚", salesTalk: "SNS集客にはコツがあるんですよ。ハッシュタグの使い方とか、投稿時間とか…", customerResponse: "（少しうんざり）…それはネットにも書いてあるし。具体的にうちに合う方法が知りたいんです。", score: 1, emotionDelta: -3, quality: "neutral" },
        { id: "cm-h2-d", label: "「フォロワー数が少ないのが原因ですよ」", icon: "📉", salesTalk: "フォロワーが少ないのが原因ですね。まずは1万人くらいまで増やさないと。", customerResponse: "…1万人って簡単に言いますけど。（イラッとした表情）そういう話を聞きたいんじゃないです。", score: -5, emotionDelta: -8, quality: "bad" },
      ],
    },
    {
      id: "cm-propose-1", phase: 3, phaseLabel: "提案",
      narration: "鈴木さんの課題が見えてきた。予約管理の煩雑さと、集客の伸び悩み。ここから提案に入る。",
      customerLine: "…で、△△さんのサービスって、具体的に何をしてくれるんですか？",
      choices: [
        { id: "cm-p1-a", label: "課題に接続して未来像を描く", icon: "🌟", salesTalk: "さっきの「予約がバラバラで怖い」という件ですが、うちのSaaSなら全チャネルの予約を一画面に自動統合できます。つまり、ダブルブッキングの心配がゼロに。その分、鈴木さんが施術に集中できる時間が増えますよね。", customerResponse: "一画面で全部見れるの…？（目を輝かせて）ホットペッパーの予約も自動で入るんですか？", score: 10, emotionDelta: 10, technique: "課題接続＋利点話法", quality: "excellent", hint: "課題→解決→未来像の順で伝えると刺さる" },
        { id: "cm-p1-b", label: "同業の導入事例を紹介する", icon: "📊", salesTalk: "実は渋谷の美容サロン「Bloom」さんに導入いただいてるんですが、予約管理の時間が月20時間削減されたそうです。", customerResponse: "Bloom？知ってる！あそこ最近伸びてるなって思ってたけど、このサービス使ってたんだ…", score: 7, emotionDelta: 7, technique: "第三者事例", quality: "good" },
        { id: "cm-p1-c", label: "機能を全部リストアップする", icon: "📝", salesTalk: "予約管理、顧客管理、売上分析、Instagram連携、LINE配信、クーポン管理、スタッフシフト管理、口コミ管理——全部で12機能あります。", customerResponse: "（目が泳ぐ）…そんなにあっても全部は使わないと思うんですけど。", score: 1, emotionDelta: -3, quality: "neutral" },
        { id: "cm-p1-d", label: "「今のやり方じゃダメですよ」と否定する", icon: "🚫", salesTalk: "正直、紙とExcelで管理してる時点で時代遅れです。このままだとお客さん逃げますよ。", customerResponse: "…（カチンときた表情）3年これでやってきたんですけど。ちょっと失礼じゃないですか？", score: -5, emotionDelta: -10, quality: "bad" },
      ],
    },
    {
      id: "cm-propose-2", phase: 3, phaseLabel: "提案",
      narration: "鈴木さんの興味が高まっている。集客面の提案もしたい。",
      customerLine: "予約管理はわかったけど…集客のほうはどうなんですか？",
      specialEvent: "document_timing",
      choices: [
        { id: "cm-p2-a", label: "スマホでデモを見せながら説明", icon: "📱", salesTalk: "（スマホで管理画面を見せる）ここを見てください。Instagramの投稿からワンタップで予約ページに飛べるんです。しかも来店後に自動でお礼LINEを送って、リピート予約を促進。フォロワーが予約に変わる仕組みです。", customerResponse: "えっ！これすごい…！自動でLINE送ってくれるの？（身を乗り出す）実際にどのくらいリピート率上がるんですか？", score: 10, emotionDelta: 8, technique: "デモ＋利点話法", quality: "excellent", hint: "百聞は一見にしかず。デモは最強の提案ツール" },
        { id: "cm-p2-b", label: "リピート率の数字を伝える", icon: "📈", salesTalk: "導入サロンさんの平均で、リピート率が23%アップしてます。自動リマインドとクーポン配信で離脱を防ぐんです。", customerResponse: "23%も？…それは大きいな。うちのリピート率40%くらいだから、60%になったらかなり変わる。", score: 7, emotionDelta: 6, technique: "数値訴求", quality: "good" },
        { id: "cm-p2-c", label: "「SNSコンサルもやってます」と別サービスを提案", icon: "💼", salesTalk: "集客に関してはSNSコンサルティングも別途やってまして、月額5万円で——", customerResponse: "…え、別料金？（急に冷めた表情）まだ本体の話も終わってないのに追加営業ですか？", score: -3, emotionDelta: -6, quality: "neutral" },
        { id: "cm-p2-d", label: "「広告費にいくら使ってます？」と費用を聞く", icon: "💰", salesTalk: "ちなみに今、ホットペッパーとか広告費にいくらくらい使ってます？", customerResponse: "…それはちょっと答えたくないです。（プライベートな数字は言いたくない）", score: -2, emotionDelta: -5, quality: "bad" },
      ],
    },
    {
      id: "cm-close-1", phase: 4, phaseLabel: "クロージング",
      narration: "鈴木さんの表情は明るい。関心を持ってくれている。クロージングのタイミングだ。",
      customerLine: "なるほど…いいサービスだとは思うんですけど。おいくらなんですか？",
      choices: [
        { id: "cm-c1-a", label: "価値を確認してから価格を伝える", icon: "🎯", salesTalk: "その前に一つだけ。もし予約管理の手間がなくなって、リピート率も上がったら、鈴木さんにとってどのくらいの価値がありますか？", customerResponse: "…そうですね。月10万円くらいは売上増えそうかな。あとストレスが減る分のプライスレスも（笑）", score: 10, emotionDelta: 8, technique: "価値確認＋クロージング", quality: "excellent", hint: "価格の前に価値を認識させると「安い」と感じてもらえる" },
        { id: "cm-c1-b", label: "月額と無料トライアルをセットで伝える", icon: "💳", salesTalk: "月額9,800円で全機能使えます。ただ、まずは2週間無料でお試しいただけるので、合わなければやめていただいてOKです。", customerResponse: "2週間無料なら試してみてもいいかも…。9,800円は…まあ、効果が出れば安いですよね。", score: 7, emotionDelta: 5, technique: "ステップダウン＋リスクリバーサル", quality: "good" },
        { id: "cm-c1-c", label: "「他社より安いです」と価格比較する", icon: "📊", salesTalk: "他社さんだと月2万円くらいするんですが、うちは9,800円なので半額以下です。", customerResponse: "安いのはわかったけど…安かろう悪かろうじゃないですよね？", score: 2, emotionDelta: -2, quality: "neutral" },
        { id: "cm-c1-d", label: "「今月中なら特別価格です」と焦らせる", icon: "⏰", salesTalk: "今月中にお申込みいただければ、初月半額の4,900円です。来月になると通常料金になってしまうので——", customerResponse: "…いや、焦らされるのは好きじゃないので。しっかり考えてから決めたいです。", score: -3, emotionDelta: -5, quality: "bad" },
      ],
    },
    {
      id: "cm-follow-1", phase: 5, phaseLabel: "フォロー",
      narration: "鈴木さんは興味を持ちつつも、まだ迷っている様子だ。",
      customerLine: "いいなとは思うんですけど…やっぱり一人で全部管理するの大変かなって。使いこなせるか不安で。",
      choices: [
        { id: "cm-f1-a", label: "不安に共感＋サポート体制を伝える", icon: "🤝", salesTalk: "そのお気持ち、すごくわかります。他のオーナーさんも最初は同じこと言ってました。でも安心してください——専任のサポート担当がついて、初期設定も一緒にやります。鈴木さんが使いこなせるまで伴走します。", customerResponse: "…一緒にやってくれるんですか？（安堵の表情）それなら…ちょっと安心かも。", score: 10, emotionDelta: 8, technique: "共感＋安心材料＋カギカッコ話法", quality: "excellent", hint: "不安は否定せず共感し、具体的な安心材料を提示する" },
        { id: "cm-f1-b", label: "「スマホだけで完結します」と簡単さを伝える", icon: "📱", salesTalk: "実はパソコン不要で、スマホだけで全部操作できるんです。LINEが使えれば大丈夫ですよ。", customerResponse: "スマホだけでいいの？…それなら私でもできそうかな。", score: 7, emotionDelta: 5, quality: "good" },
        { id: "cm-f1-c", label: "「操作は簡単です」と言い切る", icon: "👌", salesTalk: "簡単ですよ！誰でも使えます。全然心配いりません。", customerResponse: "簡単って言われても…具体的にどう簡単なのか知りたいです。", score: 1, emotionDelta: -2, quality: "neutral" },
        { id: "cm-f1-d", label: "「使えない人いませんでしたよ」と経験を押す", icon: "💪", salesTalk: "今まで使えなかった人いませんよ。鈴木さんも大丈夫です。絶対。", customerResponse: "…絶対って。（そんなの根拠ないでしょ）ちょっと押しが強い気がします。", score: -3, emotionDelta: -5, quality: "bad" },
      ],
    },
    {
      id: "cm-follow-2", phase: 5, phaseLabel: "フォロー",
      narration: "カフェラテも2杯目になった。鈴木さんは前向きに検討している。最後のひと押しだ。",
      customerLine: "…うーん、やってみたい気持ちはあるんですけどね。",
      choices: [
        { id: "cm-f2-a", label: "鈴木さんの夢に立ち返る", icon: "💫", salesTalk: "鈴木さん、さっき「一人で全部やるのが限界」っておっしゃってましたよね。このサービスは、鈴木さんの「もう一人の右腕」になれると思うんです。まずは無料トライアルで、その実感を味わってみませんか？", customerResponse: "…右腕か。（笑顔になって）うん、確かにそういうの欲しかった。…よし、試してみます！", score: 10, emotionDelta: 10, technique: "目的振返り＋比喩＋ステップダウン", quality: "excellent", hint: "相手の言葉を使って夢に立ち返ると心に響く" },
        { id: "cm-f2-b", label: "紹介者・佐藤さんの推薦を伝える", icon: "👥", salesTalk: "佐藤さんも「鈴木さんなら絶対活用できる」っておっしゃってましたよ。信頼している方からの推薦って心強いですよね。", customerResponse: "佐藤さんがそう言ってくれてたんだ…。（嬉しそう）じゃあ、前向きに考えますね。", score: 7, emotionDelta: 6, technique: "紹介者活用＋社会的証明", quality: "good" },
        { id: "cm-f2-c", label: "「資料だけ置いていきます」と引く", icon: "📄", salesTalk: "では資料だけお渡ししますね。ご検討いただけたら嬉しいです。", customerResponse: "あ、はい…ありがとうございます。（もう帰るんだ…まあいいか）", score: -1, emotionDelta: -3, quality: "neutral" },
        { id: "cm-f2-d", label: "「他のサロンは即決でしたよ」と比較する", icon: "⚡", salesTalk: "他のサロンオーナーさんはその場で申し込まれる方がほとんどなんですけどね。", customerResponse: "…（カチン）他の人と比べられても。私は私のペースで決めますので。", score: -5, emotionDelta: -8, quality: "bad" },
      ],
    },
  ],
  getEnding(totalScore, emotion) {
    if (totalScore >= 65 && emotion >= 60) return { id: "trial-start", title: "トライアル即開始！", emoji: "🏆", description: "見事！鈴木さんの信頼を勝ち取り、その場でトライアル開始。紹介営業の理想形を実現できています。", grade: "S" };
    if (totalScore >= 45 && emotion >= 40) return { id: "next-meeting", title: "次回デモ予約獲得", emoji: "📅", description: "鈴木さんは前向きです。「サロンで実際の画面を見せてほしい」と次回アポを獲得。あと一歩で即決だったかも？", grade: "A" };
    if (totalScore >= 25 && emotion >= 20) return { id: "line-exchange", title: "LINE交換のみ", emoji: "📱", description: "話は聞いてもらえましたがLINE交換止まり。アイスブレイクで信頼関係を深め、ヒアリングでもっと本音を引き出しましょう。", grade: "B" };
    return { id: "no-interest", title: "興味なし", emoji: "😞", description: "鈴木さんの警戒を解けず、商談は不発に。紹介者の信頼も損ねてしまいました。まずは相手のペースに合わせることを意識しましょう。", grade: "C" };
  },
};
