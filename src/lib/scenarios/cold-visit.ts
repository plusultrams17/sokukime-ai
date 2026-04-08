import type { ScenarioConfig } from "./types";

export const coldVisit: ScenarioConfig = {
  meta: {
    id: "cold-visit",
    title: "飛び込み営業 — 商店街の店舗開拓",
    shortTitle: "飛び込み営業",
    emoji: "🚪",
    description: "アポなしで商店街の飲食店を訪問。忙しい店長の警戒を解き、POSレジの導入を提案せよ。",
    location: "下北沢 商店街 居酒屋「鳥源」",
    customerType: "50代男性 / 居酒屋店長 / 忙しい・迷惑そう",
    product: "クラウドPOSレジ",
    sceneType: "restaurant",
    difficulty: "advanced",
  },
  phaseLabels: ["入店", "声かけ", "ヒアリング", "提案", "クロージング", "粘り"],
  initialEmotion: 15,
  introScenes: [
    { id: "cv-intro-1", text: "下北沢 商店街", subText: "午後3時——ランチと夕方の仕込みの合間を狙う", duration: 2500 },
    { id: "cv-intro-2", text: "居酒屋「鳥源」の外観を確認", subText: "暖簾の奥からまな板を叩く音が聞こえる", duration: 2500 },
    { id: "cv-intro-3", text: "深呼吸して——\nガラリと引き戸を開ける", duration: 2000 },
  ],
  nodeOrder: [
    "cv-enter-1", "cv-call-1", "cv-call-2",
    "cv-hear-1", "cv-hear-2", "cv-propose-1",
    "cv-propose-2", "cv-close-1", "cv-grit-1", "cv-grit-2",
  ],
  gameNodes: [
    /* ─── Phase 0: 入店 ─── */
    {
      id: "cv-enter-1", phase: 0, phaseLabel: "入店",
      narration: "下北沢の商店街。居酒屋「鳥源」の前に立っている。ランチのピークは過ぎたが、店内では夕方の仕込みが始まっている。店長は包丁を握っている。",
      choices: [
        { id: "cv-e1-a", label: "仕込みの合間を見て静かに入店", icon: "⏰", salesTalk: "（スーツの上着を脱ぎ、カバンを小さく持ち直す。営業感を消してから引き戸をそっと開ける）すみません、今ちょっとだけお時間よろしいですか？", customerResponse: "店長「（包丁の手を止めて）…ん？客じゃないな。なんだ、営業か。まあ今ならちょっとだけなら聞くよ。仕込みあるから手短にな。」", score: 8, emotionDelta: 5, technique: "タイミング選定＋外見調整", quality: "excellent", hint: "飛び込みはタイミングが命。忙しくない時間を選ぶだけで門前払い率が激減する" },
        { id: "cv-e1-b", label: "まず客として入って焼き鳥を注文", icon: "🍗", salesTalk: "「すみません、やってますか？焼き鳥、2本ほどお願いできます？」（まずは客として入り、店の空気を掴む）", customerResponse: "店長「あいよ！ねぎまとつくねでいいか？…（焼き台に向かう）座んな座んな。」", score: 5, emotionDelta: 3, quality: "good" },
        { id: "cv-e1-c", label: "ランチの片づけ中に入る", icon: "🚶", salesTalk: "（12時半過ぎ。客が帰り始めるタイミングでスーツ姿のまま入店）「お忙しいところすみません、〇〇会社の——」", customerResponse: "店長「今片づけで忙しいんだ！見りゃわかるだろ。後にしてくれ！」（テーブルを拭きながら怒鳴る）", score: 0, emotionDelta: -4, quality: "neutral" },
        { id: "cv-e1-d", label: "ピーク時間帯にカタログを持って突撃", icon: "💼", salesTalk: "（12時。満席の店にビジネスバッグとカタログを抱えて入る）「店長さんいらっしゃいますかー！」", customerResponse: "店長「バカ野郎！今満席だぞ！お客さんの邪魔すんな！出てけ！！」（怒りMAX）", score: -5, emotionDelta: -10, quality: "bad" },
      ],
    },

    /* ─── Phase 1: 声かけ ─── */
    {
      id: "cv-call-1", phase: 1, phaseLabel: "声かけ",
      narration: "店長がカウンター越しに腕を組んでいる。目つきは鋭く、完全に警戒モードだ。第一声が全てを決める——。",
      customerLine: "…で？何の用だ。営業だったら10秒で帰れよ。忙しいんだから。",
      choices: [
        { id: "cv-c1-a", label: "商店街の評判を伝えて距離を縮める", icon: "👨‍🍳", salesTalk: "実は2軒隣の八百屋の中村さんから「鳥源さんの焼き鳥は下北で一番だ」って聞いて、どうしても店長さんにお会いしたくて来たんです。すごくいい匂いしますね。", customerResponse: "…中村のおっさんが？（わずかに表情が緩む）まあ、うちの焼き鳥は朝から備長炭で焼いてるからな。…で、何の用なの？", score: 9, emotionDelta: 10, technique: "第三者褒め＋地域密着", quality: "excellent", hint: "飛び込みでは「売りに来た」ではなく「話を聞きに来た」感覚が大事" },
        { id: "cv-c1-b", label: "正直に名乗って1分だけお願いする", icon: "🤝", salesTalk: "〇〇会社の△△と申します。POSレジのご案内で商店街を回ってるんですが、1分だけお時間いただけませんか？", customerResponse: "POSレジ？…1分だけだぞ。1分過ぎたら追い出すからな。", score: 5, emotionDelta: 2, quality: "good" },
        { id: "cv-c1-c", label: "「近くを回ってたので」と曖昧に切り出す", icon: "🚶", salesTalk: "この辺りを回ってまして、ちょっとご挨拶だけでもと思って寄らせていただきました。", customerResponse: "挨拶？用もないのに来んなよ。こっちは仕込み中なんだ。", score: 0, emotionDelta: -3, quality: "neutral" },
        { id: "cv-c1-d", label: "いきなりタブレットで説明を始める", icon: "📱", salesTalk: "（カウンターにタブレットを置いて）こちらの最新クラウドPOSレジなんですが——", customerResponse: "おい！カウンターに物置くな！焼き鳥に油が飛ぶだろ！（怒り爆発）もう帰れ！！", score: -5, emotionDelta: -10, quality: "bad" },
      ],
    },
    {
      id: "cv-call-2", phase: 1, phaseLabel: "声かけ",
      narration: "店長は腕組みしたまま、まだ警戒している。ここでもうひと押しできるかが分かれ目だ。",
      customerLine: "POSレジねぇ…。うちは手書き伝票と電卓で30年やってきたんだ。必要ないよ。",
      choices: [
        { id: "cv-c2-a", label: "「30年」を敬いつつ自然に課題を引き出す", icon: "💪", salesTalk: "30年！ それはすごいですね、この激戦区で30年続けてるお店ってほとんどないですよ。…ちなみに素朴な疑問なんですが、月末の売上計算ってどうされてますか？手書きだと結構大変じゃないですか。", customerResponse: "…まあ、確かに月末は地獄だよ。嫁と二人で電卓叩いて朝3時までかかることもある。間違いも多くてさ…", score: 9, emotionDelta: 8, technique: "敬意＋自然な質問", quality: "excellent", hint: "相手のやり方を否定せず、敬意を示してから自然に困りごとを引き出す" },
        { id: "cv-c2-b", label: "「同じ商店街のお店も使ってます」と実績を出す", icon: "🏪", salesTalk: "実はこの商店街の居酒屋「和楽」さんにも導入いただいてるんですよ。", customerResponse: "和楽が？…あいつのとこ使ってんのか。（少し興味を示す）で、いくらなの？", score: 6, emotionDelta: 5, technique: "身近な事例", quality: "good" },
        { id: "cv-c2-c", label: "「手書きは時代に合ってませんよ」と指摘", icon: "📉", salesTalk: "正直、手書き伝票と電卓っていうのは今の時代ちょっと…。効率面でかなり損してると思いますよ。", customerResponse: "…（ムッとした顔）うちのやり方に文句つけんのか？30年これでやってきたんだよ。", score: -1, emotionDelta: -4, quality: "neutral" },
        { id: "cv-c2-d", label: "「インボイスで手書きは通用しませんよ」と脅す", icon: "⚠️", salesTalk: "インボイス制度も始まってますし、手書き伝票だと税務署に指摘されるリスクありますよ。早く変えないとまずいです。", customerResponse: "はぁ？脅してんのか？うちの税理士がちゃんとやってんだ。余計なお世話だ！帰れ！", score: -5, emotionDelta: -10, quality: "bad" },
      ],
    },

    /* ─── Phase 2: ヒアリング ─── */
    {
      id: "cv-hear-1", phase: 2, phaseLabel: "ヒアリング",
      narration: "店長が少しだけ口を開き始めた。警戒心の壁に小さな隙間ができている——ここを逃すな。",
      customerLine: "まあ確かに、月末の集計は正直しんどいんだよな…。嫁にも文句言われるし。",
      specialEvent: "silence",
      choices: [
        { id: "cv-h1-a", label: "沈黙を守り、店長の本音を待つ", icon: "🤫", salesTalk: "（真剣な表情でうなずく。何も言わずに店長の顔を見つめる）", customerResponse: "…（10秒の長い沈黙。店長が大きくため息をつく）実はさ、嫁が「もういい加減にして」って言い始めてんだ。毎月ケンカだよ。日曜も帳簿つけてて、子供の運動会も行けなかった。…何のために店やってんだかわからなくなる時があるよ。", score: 10, emotionDelta: 10, technique: "沈黙の活用", quality: "excellent", hint: "飛び込みで信頼を得た後の沈黙は、相手が本音を語り出す最強のきっかけ" },
        { id: "cv-h1-b", label: "「奥様も大変ですよね」と共感する", icon: "💭", salesTalk: "奥様も一緒に集計されてるんですか？ それは大変ですよね…。お二人で深夜までって、体にも堪えますよね。", customerResponse: "そうだよ。嫁は腰も悪くてさ、座りっぱなしの集計がキツいんだ。でも人雇う余裕もないし…。", score: 7, emotionDelta: 6, technique: "共感＋家族への配慮", quality: "good" },
        { id: "cv-h1-c", label: "「月の売上っていくらくらいですか？」と聞く", icon: "📝", salesTalk: "ちなみに月の売上ってどれくらいですか？規模感を教えていただけると——", customerResponse: "…初対面で売上聞くなよ。失礼だろ。そんなの教えるわけないだろ。", score: 1, emotionDelta: -3, quality: "neutral" },
        { id: "cv-h1-d", label: "「それなら今すぐPOSレジですよ！」と畳みかける", icon: "💰", salesTalk: "それならまさにPOSレジが解決しますよ！月末の集計が自動化されて——", customerResponse: "おい、こっちは愚痴言っただけだ。売り込みはもういいから。", score: -3, emotionDelta: -6, quality: "bad" },
      ],
    },
    {
      id: "cv-hear-2", phase: 2, phaseLabel: "ヒアリング",
      narration: "店長の声が少し小さくなった。仕込み中の手も止まっている。核心に近づいている——。",
      customerLine: "正直さ…売上は悪くないんだ。でも何にどれだけ儲かってるかがわからないんだよ。",
      choices: [
        { id: "cv-h2-a", label: "「メニュー別の利益」を切り口に深掘り", icon: "📊", salesTalk: "それはすごく大事なポイントですね。例えば焼き鳥とお酒、どっちが利益率高いかって把握されてますか？", customerResponse: "…正直、わかんない。なんとなく酒の方が儲かってるとは思うけど。焼き鳥は原価もかかるし、手間もかかるしな…。あー、ちゃんと数字見えたらなぁ。", score: 9, emotionDelta: 7, technique: "課題の具体化＋自覚促進", quality: "excellent", hint: "「わからない」を「わかりたい」に変える質問が刺さる" },
        { id: "cv-h2-b", label: "「同じ悩みの飲食店、多いですよ」と安心させる", icon: "👥", salesTalk: "実はそういう悩み、個人の飲食店さんで一番多いんです。売上はあるのに利益が見えない。店長だけじゃないですよ。", customerResponse: "そうなの？…まあ、うちみたいな昔ながらの店はみんなそうだよな。でも、どうすりゃいいんだ？", score: 6, emotionDelta: 5, technique: "第三者話法＋安心感", quality: "good" },
        { id: "cv-h2-c", label: "「原価率の計算はしてますか？」と確認", icon: "🧮", salesTalk: "ちなみに食材の原価率って計算されてますか？一般的に居酒屋だと30〜35%が理想ですが。", customerResponse: "原価率？…計算はしてないな。税理士に任せてるから、確定申告の時にしかわからん。", score: 3, emotionDelta: 0, quality: "neutral" },
        { id: "cv-h2-d", label: "「それは経営として危険ですよ」と警告", icon: "🚨", salesTalk: "利益がわからないまま営業を続けるのは、正直かなり危険ですよ。気づいたら赤字ってこともあり得ます。", customerResponse: "…（顔が強張る）赤字って…脅かすなよ。うちは30年やってんだ。素人みたいなこと言うな。", score: -4, emotionDelta: -7, quality: "bad" },
      ],
    },

    /* ─── Phase 3: 提案 ─── */
    {
      id: "cv-propose-1", phase: 3, phaseLabel: "提案",
      narration: "店長がカウンターに肘をつきながら考え込んでいる。ここがPOSレジの提案に入るチャンスだ——重い資料より、スマホの画面が効く。",
      customerLine: "…まあ、数字が見えた方がいいのはわかるけどさ。うちみたいな小さい店にPOSレジなんて大げさだろ。",
      choices: [
        { id: "cv-p1-a", label: "スマホで実機画面を見せてピンポイント提案", icon: "📱", salesTalk: "大げさじゃないんです。（スマホで実際の画面を見せる）これ、タブレット1台でできるんです。メニューをタップするだけで注文入力、お会計もタップ1つ。しかも毎日の売上がグラフで出るから、焼き鳥とお酒どっちが稼いでるか一目でわかりますよ。", customerResponse: "（スマホの画面を覗き込む）へえ…タブレット1台で？こんなシンプルなのか。…グラフって、メニュー別に出るの？", score: 10, emotionDelta: 10, technique: "ビジュアル提示＋課題接続", quality: "excellent", hint: "飛び込みでは重い資料よりスマホの画面。「見せる」が最強の提案" },
        { id: "cv-p1-b", label: "同規模の居酒屋の導入事例を話す", icon: "🍺", salesTalk: "高円寺の居酒屋「とり平」さん、知ってます？同じくらいの席数で導入されて、月末の集計が30分で終わるようになったそうです。奥さんと喧嘩しなくなったって笑ってました。", customerResponse: "とり平？聞いたことあるな…。30分で終わるのか。（少し前のめりになる）うちだと3時間かかるのに。", score: 7, emotionDelta: 6, technique: "同業事例＋感情訴求", quality: "good" },
        { id: "cv-p1-c", label: "カタログを出して機能を説明する", icon: "📖", salesTalk: "（カバンからカタログを取り出して）弊社のPOSレジは5つのプランがありまして。スタンダードプラン、プレミアムプラン、エンタープライズプラン——", customerResponse: "（チラッと見て）…字が多くてわかんねえよ。どれがうちに合うのか教えてくれ。5つもいらないから。", score: 2, emotionDelta: -1, quality: "neutral" },
        { id: "cv-p1-d", label: "「最新のAI搭載モデルです！」と高機能を推す", icon: "🤖", salesTalk: "弊社のPOSレジはAI搭載で、需要予測から在庫管理まで自動でやってくれるんです！月額5万円で——", customerResponse: "AI？5万円？…バカ言うな。うちみたいな10席の居酒屋にAIなんかいらねえよ。帰ってくれ。", score: -5, emotionDelta: -8, quality: "bad" },
      ],
    },
    {
      id: "cv-propose-2", phase: 3, phaseLabel: "提案",
      narration: "店長がスマホの画面をまじまじと見ている。「こんなの使えるのか…」という顔だ。背中を押すもうひと言が必要だ。",
      customerLine: "まあ、便利そうなのはわかるけどさ…。いくらすんの？高いんだろ？",
      choices: [
        { id: "cv-p2-a", label: "日割り換算で「焼き鳥1本分」と伝える", icon: "💴", salesTalk: "月額9,800円です。1日に換算すると約330円。焼き鳥1本分です。焼き鳥1本で毎月の集計が30分で終わって、奥様と朝3時まで電卓叩かなくて済むなら——安いと思いませんか？", customerResponse: "…焼き鳥1本分か。（腕組みを解いて、焼き台を見る）…1本で嫁が楽になるなら…そうだな。", score: 9, emotionDelta: 8, technique: "日割り換算＋感情接続", quality: "excellent", hint: "相手の商材に置き換えて金額を伝えると「高い」が「安い」に変わる" },
        { id: "cv-p2-b", label: "初期費用ゼロで始められると伝える", icon: "🆓", salesTalk: "タブレットは無料レンタルなので、初期費用はゼロです。月額だけで始められますよ。", customerResponse: "タダで始められるのか？…まあ、リスクは少ないな。でも本当に使いこなせるかなぁ。", score: 6, emotionDelta: 4, quality: "good" },
        { id: "cv-p2-c", label: "「レジ買い替えよりずっと安いです」と比較", icon: "🏷️", salesTalk: "従来型のレジだと安くても30万はかかりますけど、クラウド型なら月額1万円以下で済みますよ。", customerResponse: "そりゃそうだけど…月額ってずっと払い続けるんだろ？トータルでいくらになるんだよ。", score: 3, emotionDelta: 0, quality: "neutral" },
        { id: "cv-p2-d", label: "「今月中なら半額キャンペーンです！」と煽る", icon: "🔥", salesTalk: "実は今月末までの申し込みで初月半額キャンペーンやってるんです！このチャンスを逃すと——", customerResponse: "…（冷めた目）出た、「今月だけ」ってやつ。営業マンは皆それ言うんだよな。もういいよ。", score: -3, emotionDelta: -6, quality: "bad" },
      ],
    },

    /* ─── Phase 4: クロージング ─── */
    {
      id: "cv-close-1", phase: 4, phaseLabel: "クロージング",
      narration: "店長の表情が変わった。警戒心がかなり薄れ、真剣に考え始めている。飛び込みでここまで来れたのは大きい——クロージングのチャンスだ。",
      customerLine: "うーん…悪くはないな。でもよ、今すぐ決められるもんじゃないだろ。",
      choices: [
        { id: "cv-cl-a", label: "「まず実物を触ってください」と体験を提案", icon: "👀", salesTalk: "もちろん、今日決める必要はないです。一つだけお願いがあるんですが——来週、タブレットを1台お持ちしていいですか？実際に今日のメニューを入力して、お会計まで試してみてください。5分で終わりますから。", customerResponse: "…持ってくるの？（驚いた顔）まあ、触るだけならいいけど。…木曜の3時過ぎなら暇だから。", score: 10, emotionDelta: 8, technique: "体験提案＋具体日程確定", quality: "excellent", hint: "「見積を出します」より「実物を触ってみてください」の方が次につながる" },
        { id: "cv-cl-b", label: "見積だけでも出させてほしいと提案", icon: "📄", salesTalk: "では、まずお見積りだけ出させてもらっていいですか？金額を見てから判断していただければ。", customerResponse: "見積か…。タダなら見るよ。いつ届くんだ？", score: 6, emotionDelta: 4, quality: "good" },
        { id: "cv-cl-c", label: "「チラシ置いていきますね」と引く", icon: "📑", salesTalk: "では、こちらのチラシだけ置いていきますね。ご検討いただけたら嬉しいです。", customerResponse: "ああ。（チラシを受け取ってレジ横に置く）気が向いたら見るわ。", score: 1, emotionDelta: -2, quality: "neutral" },
        { id: "cv-cl-d", label: "「今日申し込めば特別割引です！」と迫る", icon: "🏷️", salesTalk: "今日この場で申し込んでいただけたら、3ヶ月分無料にしますよ！この場限りの特別オファーです！", customerResponse: "おいおい、初めて来た営業に「今日決めろ」って言われて決めるやつがどこにいるんだ。もういいわ。", score: -5, emotionDelta: -8, quality: "bad" },
      ],
    },

    /* ─── Phase 5: 粘り ─── */
    {
      id: "cv-grit-1", phase: 5, phaseLabel: "粘り",
      narration: "店長が急に腕を組み直した。最後の反論が来る——飛び込み営業の最大の山場だ。",
      customerLine: "でもな…正直、機械が苦手なんだよ。スマホもろくに使えねえのに、POSレジなんて無理だろ。",
      choices: [
        { id: "cv-g1-a", label: "「注文は指1本です」と安心させる", icon: "☝️", salesTalk: "店長、スマホが苦手でも大丈夫です。実は導入店の半分以上が「機械苦手」って言ってた方なんです。操作はこれだけ——（スマホで画面を見せる）「焼き鳥」をタップ、本数を選ぶ、以上。指1本です。注文取るより簡単ですよ。", customerResponse: "…これだけ？（画面を見ながら）タップするだけか。…確かにこれならバカでもできそうだな。", score: 10, emotionDelta: 8, technique: "不安解消＋実証デモ＋統計", quality: "excellent", hint: "「苦手」への答えは説得ではなく実物を見せること" },
        { id: "cv-g1-b", label: "「設定は全部こちらでやります」と保証", icon: "🛠️", salesTalk: "初期設定はメニュー登録まで全部うちでやりますから、店長は触るだけです。操作研修も無料でつきます。", customerResponse: "全部やってくれるの？…まあ、それなら少しは安心か。でもトラブった時はどうすんの？", score: 7, emotionDelta: 5, technique: "サポート保証", quality: "good" },
        { id: "cv-g1-c", label: "「マニュアルがありますよ」と説明", icon: "📘", salesTalk: "操作マニュアルを完備してますので、見ながらやれば大丈夫ですよ。オンラインの動画講座もあります。", customerResponse: "マニュアルぅ？…読んでる暇なんかねえよ。動画もスマホで見れない俺に言われても。", score: 2, emotionDelta: -2, quality: "neutral" },
        { id: "cv-g1-d", label: "「今の時代、機械使えないと厳しいですよ」と指摘", icon: "📢", salesTalk: "正直、今の時代に機械が使えないのは経営者として厳しいですよ。若い世代はみんなデジタルですから。", customerResponse: "…はぁ？50年飲食業やってきた俺に説教か？もういい、帰ってくれ。", score: -5, emotionDelta: -10, quality: "bad" },
      ],
    },
    {
      id: "cv-grit-2", phase: 5, phaseLabel: "粘り",
      narration: "店長がチラッと時計を見た。夕方の仕込みが迫っている。最後のひと言が全てを決める——。",
      customerLine: "まあ、話はわかったよ。…でもな、忙しいんだ。考えてる暇もないし、来週も再来週も忙しい。",
      choices: [
        { id: "cv-g2-a", label: "「忙しいからこそ」と逆転＋家族の話に戻る", icon: "🔄", salesTalk: "店長、忙しいからこそなんです。POSレジが来たら月末の集計が30分で終わる。その分、日曜日にお子さんの試合を観に行けるかもしれない。…さっき「何のために店やってんだか」っておっしゃいましたよね。家族のためでしょう？", customerResponse: "…（長い沈黙。店長の目が少し潤む）……覚えてんのか、そんなこと。…わかった、来週持ってこい。木曜の3時な。ただし、気に入らなかったら二度と来るなよ。", score: 10, emotionDelta: 10, technique: "逆転発想＋感情訴求＋伏線回収", quality: "excellent", hint: "相手が語った言葉を覚えて返す。それだけで「この人は本気で聞いてくれてる」と伝わる" },
        { id: "cv-g2-b", label: "「5分のデモだけ」を約束して食い下がる", icon: "⏱️", salesTalk: "来週5分だけ時間をください。タブレットを持ってきます。5分触って「いらない」と思ったら、二度と来ません。約束します。", customerResponse: "5分だけだぞ…。まあ、そこまで言うなら見てやるよ。でも本当に5分だからな。", score: 7, emotionDelta: 6, technique: "時間限定＋撤退保証", quality: "good" },
        { id: "cv-g2-c", label: "名刺だけ渡して丁寧に帰る", icon: "📇", salesTalk: "わかりました、お忙しいところありがとうございました。名刺だけ置かせてください。もしお時間できたらいつでもご連絡ください。", customerResponse: "…ああ。（名刺をポケットに入れる。連絡することはないだろうな…）", score: 1, emotionDelta: -2, quality: "neutral" },
        { id: "cv-g2-d", label: "「逃げてるだけじゃないですか」と挑発", icon: "🔥", salesTalk: "店長、「忙しい」って本当は変わるのが怖いだけじゃないですか？このままだと奥さんとの関係もどんどん——", customerResponse: "はあ!? うちの家庭のこと口出すな！！二度と来るな！！（ドアを指差す）", score: -5, emotionDelta: -10, quality: "bad" },
      ],
    },
  ],
  getEnding(totalScore, emotion) {
    if (totalScore >= 65 && emotion >= 60) return { id: "demo-confirmed", title: "デモ訪問を即約束！", emoji: "🏆", description: "アポなし飛び込みから驚異のデモ約束獲得！最初は敵意むき出しだった店長の心を完全に溶かし、信頼を勝ち取りました。飛び込み営業の理想形です。", grade: "S" };
    if (totalScore >= 45 && emotion >= 40) return { id: "next-visit-ok", title: "「来週持ってこい」", emoji: "📅", description: "「来週持ってこい」と後日訪問の約束を獲得。飛び込みで次回アポを取れたのは大きな成果です。デモ当日が本当の勝負ですよ。", grade: "A" };
    if (totalScore >= 25 && emotion >= 20) return { id: "flyer-accepted", title: "チラシだけ受け取る", emoji: "📄", description: "チラシは受け取ってもらえましたが、それ以上の進展はなし。店長の困りごとにもう少し寄り添えると、結果が変わります。", grade: "B" };
    return { id: "kicked-out", title: "「二度と来るな！」", emoji: "😵", description: "店長の怒りを買い、追い返されてしまいました。飛び込みではまず警戒心を解くことが最優先。売り込みは後回しにして、まず相手を知ることから始めましょう。", grade: "C" };
  },
};
