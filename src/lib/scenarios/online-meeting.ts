import type { ScenarioConfig } from "./types";

export const onlineMeeting: ScenarioConfig = {
  meta: {
    id: "online-meeting",
    title: "オンライン商談 — Zoom初回プレゼン",
    shortTitle: "オンライン商談",
    emoji: "💻",
    description: "Zoomでの初回オンライン商談。画面共有で資料を見せながら、画面越しに相手の反応を読み取れ。",
    location: "Zoom オンラインミーティング",
    customerType: "40代男性 / 不動産会社 営業部長 / データ重視・慎重派",
    product: "営業支援CRM",
    sceneType: "online",
    difficulty: "intermediate",
  },
  phaseLabels: ["接続", "自己紹介", "ヒアリング", "画面共有", "クロージング", "次回設定"],
  initialEmotion: 35,
  introScenes: [
    { id: "on-intro-1", text: "Zoom オンラインミーティング", subText: "開始5分前——PCの前で準備を整える", duration: 2500 },
    { id: "on-intro-2", text: "画面に参加者が表示された", subText: "不動産会社 営業部長・佐藤さんが入室してきた", duration: 2500 },
    { id: "on-intro-3", text: "「お世話になります——」\n画面越しの商談が始まる", duration: 2000 },
  ],
  nodeOrder: [
    "on-connect-1", "on-intro-1", "on-intro-2",
    "on-hear-1", "on-hear-2", "on-share-1",
    "on-share-2", "on-close-1", "on-next-1", "on-next-2",
  ],
  gameNodes: [
    /* ─── Phase 0: 接続 ─── */
    {
      id: "on-connect-1", phase: 0, phaseLabel: "接続",
      narration: "Zoomの開始時刻5分前。カメラとマイクの確認、背景、照明——オンラインならではの準備が成否を分ける。",
      choices: [
        { id: "on-c1-a", label: "カメラ・マイク・背景・照明を全チェック", icon: "🎥", salesTalk: "（カメラ位置を目線の高さに調整。リングライトで顔を明るく照らし、バーチャル背景をオフにして整理された棚を映す。マイクテストも完了。名前表示を「〇〇会社 △△」に変更）", customerResponse: "（佐藤が入室）おっ、画面きれいですね。声もクリアだ。——よろしくお願いします。", score: 8, emotionDelta: 5, technique: "オンライン事前準備", quality: "excellent", hint: "オンラインは映像と音声が第一印象。準備が信頼を作る" },
        { id: "on-c1-b", label: "マイクとカメラだけ確認して待機", icon: "🎤", salesTalk: "（マイクON、カメラON。バーチャル背景を適当にセット。資料は後で開く）", customerResponse: "（佐藤が入室）お世話になります。…あ、ちょっとバーチャル背景ずれてますよ。", score: 3, emotionDelta: 0, quality: "good" },
        { id: "on-c1-c", label: "時間ちょうどに慌てて入室", icon: "⏰", salesTalk: "（開始時刻になってからZoomを立ち上げる。あれ、URLどこだっけ…。カメラONにして——）", customerResponse: "（佐藤が待機中）…あ、入りましたか。お待ちしてました。（ちょっと遅れたな…）", score: 0, emotionDelta: -3, quality: "neutral" },
        { id: "on-c1-d", label: "散らかった部屋のまま参加", icon: "🏠", salesTalk: "（背後に洗濯物と散らかった棚が映っている。マイクにはエアコンのノイズ。暗い照明で顔がほぼ見えない）", customerResponse: "…えーと、ちょっと画面見にくいですね。（この人、大丈夫かな…）", score: -5, emotionDelta: -7, quality: "bad" },
      ],
    },

    /* ─── Phase 1: 自己紹介 ─── */
    {
      id: "on-intro-1", phase: 1, phaseLabel: "自己紹介",
      narration: "佐藤部長が画面に映っている。表情はフラットで、まだ様子見の雰囲気だ。",
      customerLine: "はい、よろしくお願いします。えーと、CRMのご提案ということでしたが。",
      choices: [
        { id: "on-i1-a", label: "画面越しにアイスブレイク＋ゴール共有", icon: "🎯", salesTalk: "よろしくお願いします！佐藤部長、実は御社のHPで社員紹介を拝見しまして、営業部が20名もいらっしゃるんですね。今日は30分で、御社の営業課題をお聞きした上で、弊社CRMがお役に立てるかご判断いただければと思います。もし合わなければ遠慮なくおっしゃってください。", customerResponse: "（少し表情が和らぐ）あ、ちゃんと調べてくれてるんだ。合わなければ断っていいんですね。…わかりました、じゃあ率直にお話しします。", score: 10, emotionDelta: 10, technique: "事前リサーチ＋ゴール共有＋先回り", quality: "excellent", hint: "オンラインは最初の1分で空気が決まる。安心感を与えて本音を引き出す" },
        { id: "on-i1-b", label: "簡潔に自己紹介してから本題へ", icon: "🤝", salesTalk: "改めまして、〇〇会社の△△と申します。営業支援CRMの提案を担当しております。本日はお時間30分いただいておりますので、早速ですがお話しさせてください。", customerResponse: "はい、△△さんですね。（手元にメモを取りながら）で、どんなシステムなんですか？", score: 5, emotionDelta: 2, quality: "good" },
        { id: "on-i1-c", label: "会社紹介スライドから始める", icon: "📊", salesTalk: "まず弊社についてご紹介させてください。（スライド共有）弊社は2015年創業で、従業員は120名——", customerResponse: "…（時計を見る）すみません、30分しかないので、会社紹介は簡潔にお願いできますか？", score: 1, emotionDelta: -3, quality: "neutral" },
        { id: "on-i1-d", label: "いきなりデモ画面を共有する", icon: "💻", salesTalk: "早速画面共有しますね！（いきなりCRMのデモ画面を映す）これが弊社のダッシュボードでして——", customerResponse: "ちょっと待ってください。まだ自己紹介も聞いてないし、うちの課題も話してないんですが。", score: -4, emotionDelta: -8, quality: "bad" },
      ],
    },
    {
      id: "on-intro-2", phase: 1, phaseLabel: "自己紹介",
      narration: "佐藤部長が少し前のめりになった。オンラインでも微妙な表情の変化を見逃すな。",
      customerLine: "うちの営業部は20人いるんですけど、正直マネジメントに手が回ってなくてね。",
      choices: [
        { id: "on-i2-a", label: "画面越しの表情を読んで共感する", icon: "👀", salesTalk: "佐藤部長、今ちょっと苦い表情をされましたね。20人のマネジメントって、本当に大変ですよね。同じ規模の不動産会社さんだと「部下の行動が見えない」という悩みが一番多いんですが…。", customerResponse: "…え、わかります？（驚いた表情）まさにそれなんです。誰が何件回ってるのか、日報見るまでわからなくて。", score: 9, emotionDelta: 8, technique: "表情読み＋第三者話法", quality: "excellent", hint: "オンラインでも相手の表情変化を言語化すると距離が縮まる" },
        { id: "on-i2-b", label: "「20人は大変ですね」と共感", icon: "💭", salesTalk: "20人を一人で見てらっしゃるんですか。それはかなりの負荷ですよね。", customerResponse: "ええ、副部長はいるんですけどね。実務に追われてマネジメントまで手が回らない状態です。", score: 5, emotionDelta: 3, quality: "good" },
        { id: "on-i2-c", label: "「CRMで解決できますよ」とすぐ提案", icon: "💪", salesTalk: "それこそ弊社のCRMで一発解決です！リアルタイムで部下の活動が見える化されますので。", customerResponse: "…まだ詳しく話してないのに「一発解決」って。オンラインだと特に信用しにくいんだよね。", score: -2, emotionDelta: -5, quality: "neutral" },
        { id: "on-i2-d", label: "「マネジメントは部長の責任ですからね」", icon: "📋", salesTalk: "マネジメントの問題は、結局は管理者の意識次第ですからね。ツールがあっても使いこなせないと意味がないですし。", customerResponse: "…（ムッとした表情）それは部長の責任だと言いたいんですか？ずいぶん失礼ですね。", score: -5, emotionDelta: -10, quality: "bad" },
      ],
    },

    /* ─── Phase 2: ヒアリング ─── */
    {
      id: "on-hear-1", phase: 2, phaseLabel: "ヒアリング",
      narration: "佐藤部長が具体的な課題を語り始めた。データ重視の相手には数字で切り込むのが有効だ。",
      customerLine: "日報はExcelで管理してるんだけど、月末にまとめて入力する奴が多くてね。リアルタイムで把握できないんだよ。",
      choices: [
        { id: "on-h1-a", label: "数字で深掘り＋損失を可視化", icon: "📊", salesTalk: "なるほど。ちなみに月末まとめ入力だと、例えば大型案件のフォロー漏れって発生していませんか？20人の部下で、月に何件くらいの商談を管理されていますか？", customerResponse: "…正直、フォロー漏れはある。先月も2件失注したのは、追客が遅れたのが原因だった。月に大体200件くらいの商談を回してるんだけど、全部は追えない。", score: 9, emotionDelta: 7, technique: "数字深掘り＋損失可視化", quality: "excellent", hint: "データ重視の相手には数字で切り込む。損失を具体化して痛みを自覚させる" },
        { id: "on-h1-b", label: "「いつからExcel管理ですか？」と経緯を聞く", icon: "📅", salesTalk: "Excel管理はいつ頃から続けていらっしゃるんですか？何か変えようとしたことは？", customerResponse: "もう5年くらいかな。一度別のツール試したけど、定着しなかったんだよね。現場が使わないと意味がないから。", score: 6, emotionDelta: 4, technique: "時間軸＋過去の経験確認", quality: "good" },
        { id: "on-h1-c", label: "「Excelは限界ありますよね」と同意", icon: "💻", salesTalk: "Excelだとどうしても限界がありますよね。リアルタイム共有ができないし、データの重複も発生しやすいですし。", customerResponse: "まあ、そうなんだけど…。Excelのいいところもあるんだよね。カスタマイズしやすいし。", score: 3, emotionDelta: 0, quality: "neutral" },
        { id: "on-h1-d", label: "「それは非効率ですね」と断じる", icon: "⚠️", salesTalk: "Excel管理で月200件の商談を追うのは、はっきり言って時代遅れです。他社はとっくにCRMに移行してますよ。", customerResponse: "…時代遅れって言われてもな。（不快そうに腕を組む）うちにはうちのやり方があるんですが。", score: -4, emotionDelta: -7, quality: "bad" },
      ],
    },
    {
      id: "on-hear-2", phase: 2, phaseLabel: "ヒアリング",
      narration: "佐藤部長の口から「失注」という言葉が出た。痛みが見えてきた——もう一段深く掘り下げろ。",
      customerLine: "先月の失注2件、合わせたら仲介手数料500万くらいの損失だったんだよね…。",
      choices: [
        { id: "on-h2-a", label: "年間損失を計算して提示", icon: "🧮", salesTalk: "月500万の損失が仮に毎月続くと、年間6,000万円。実際はもっと少ないとしても、年2,000〜3,000万の機会損失が発生している可能性がありますよね。佐藤部長、この数字、経営層にも報告されてますか？", customerResponse: "…6,000万か。（画面上で明らかに表情が変わる）いや、そこまでは報告してない。感覚ではわかってたんだけど、数字にすると重いな…。", score: 10, emotionDelta: 8, technique: "損失年間換算＋経営視点", quality: "excellent", hint: "データ重視の相手には計算で見せる。自分で気づかせるのが最強" },
        { id: "on-h2-b", label: "「それは悔しいですね」と共感", icon: "💭", salesTalk: "500万…。それは悔しいですよね。防げた失注だっただけに。", customerResponse: "ああ、本当に悔しい。あの案件、1週間早くフォローしてれば取れてたんだ。", score: 6, emotionDelta: 5, technique: "感情共感", quality: "good" },
        { id: "on-h2-c", label: "「失注の原因を分析しましたか」と質問", icon: "🔍", salesTalk: "ちなみにその失注の原因分析はされましたか？何が足りなかったんでしょう。", customerResponse: "分析…まあ、追客のスピードだよね。わかってるんだけど、仕組みがなくてさ。", score: 4, emotionDelta: 2, quality: "neutral" },
        { id: "on-h2-d", label: "「500万は大きいですね」で流す", icon: "📝", salesTalk: "500万円は大きいですね。では次の提案に移りますが——", customerResponse: "…え、もうヒアリング終わり？（もっと聞いてくれると思ったのに）", score: -2, emotionDelta: -4, quality: "bad" },
      ],
    },

    /* ─── Phase 3: 画面共有 ─── */
    {
      id: "on-share-1", phase: 3, phaseLabel: "画面共有",
      narration: "いよいよ画面共有で資料を見せる場面だ。オンラインではスライドの見せ方が成約を左右する。",
      customerLine: "…なるほどね。で、御社のCRMだとどう変わるの？具体的に見せてもらえる？",
      specialEvent: "document_timing",
      choices: [
        { id: "on-s1-a", label: "課題に接続した3枚だけを画面共有", icon: "📊", salesTalk: "はい、画面共有しますね。（共有開始）佐藤部長、今日は全スライドではなく、先ほどの課題に関連する3枚だけお見せします。1枚目——リアルタイム案件ボードです。これで20人の商談状況が一画面で把握できます。月末まとめ入力が不要になります。", customerResponse: "（画面を食い入るように見る）おお…これ、各営業マンの進捗がリアルタイムで見えるのか。しかもスマホからも入力できる？ これなら現場も使うかもしれない。", score: 10, emotionDelta: 10, technique: "課題接続＋絞り込みプレゼン", quality: "excellent", hint: "オンラインでは全スライドを見せない。課題に直結する画面だけを絞って見せる" },
        { id: "on-s1-b", label: "デモ画面を操作しながら説明", icon: "🖥️", salesTalk: "（画面共有でCRMのデモ環境を開く）実際の画面をお見せしますね。ここが案件一覧で、ステータス別にフィルタリングできます。日報もここからワンクリックで入力できます。", customerResponse: "ふむ、操作画面を見ると具体的にイメージしやすいな。入力は簡単そうだけど、うちのフォーマットに合わせられるの？", score: 7, emotionDelta: 6, technique: "デモ実演", quality: "good" },
        { id: "on-s1-c", label: "全20ページのスライドを順に説明", icon: "📑", salesTalk: "では資料を共有します。（20枚のスライドが表示される）まず弊社の沿革から——次に機能一覧、料金表、導入事例、FAQ——", customerResponse: "（10分後、明らかに集中力が切れている）…すみません、あと何枚ありますか？ちょっと時間が…。", score: 1, emotionDelta: -4, quality: "neutral" },
        { id: "on-s1-d", label: "画面共有せず口頭だけで説明", icon: "🗣️", salesTalk: "画面共有はちょっと準備が…。口頭でご説明しますね。弊社CRMには案件管理、日報管理、顧客分析の3つの機能がありまして——", customerResponse: "（困惑した表情）…いや、オンラインなんだから画面で見せてくれないと。口頭だけじゃ判断できないですよ。", score: -5, emotionDelta: -8, quality: "bad" },
      ],
    },
    {
      id: "on-share-2", phase: 3, phaseLabel: "画面共有",
      narration: "佐藤部長が食いついている。データ重視の相手には、数字で裏付けを示すのが有効だ。",
      customerLine: "なるほど…。でも、うちみたいな不動産会社でも本当に使えるの？ITリテラシー低い営業マンもいるんだけど。",
      choices: [
        { id: "on-s2-a", label: "不動産業界の導入事例を数字で提示", icon: "📈", salesTalk: "（画面で事例スライドに切替）実は不動産業界の導入実績が一番多いんです。こちら——同規模の仲介会社で、導入3ヶ月で追客速度が2.5倍、失注率が35%改善されました。ITが苦手な50代の営業マンでも、スマホから3タップで日報入力できるのがポイントです。", customerResponse: "追客2.5倍、失注率35%改善…（メモを取っている）。50代でも使えるのか。…ちなみにこの会社、紹介してもらえたりする？", score: 9, emotionDelta: 8, technique: "業界特化事例＋数値証拠", quality: "excellent", hint: "同業種の実績は最強のエビデンス。紹介依頼は信頼の証" },
        { id: "on-s2-b", label: "操作の簡単さをデモで見せる", icon: "📱", salesTalk: "実際にスマホ画面をお見せしますね。（スマホ画面を画面共有）訪問先で…このボタンを押して…3タップで完了。これだけです。", customerResponse: "3タップか。確かにこれなら使えそうだな。あの田中でも…いや、やってみないとわからないか。", score: 7, emotionDelta: 5, technique: "操作デモ＋簡易性訴求", quality: "good" },
        { id: "on-s2-c", label: "「研修もつけます」とサポートを強調", icon: "📚", salesTalk: "導入時には研修を3回実施しますので、ITが苦手な方でも安心です。マニュアルも完備しています。", customerResponse: "研修3回か…。まあ無いよりはいいけど、それで本当に定着するかな。", score: 3, emotionDelta: 1, quality: "neutral" },
        { id: "on-s2-d", label: "「ITリテラシーは個人の問題」と返す", icon: "🤷", salesTalk: "ITリテラシーは正直、個人の努力次第ですね。どんなツールでも使う気があれば使えますよ。", customerResponse: "…それを言われるとねえ。（現場のことわかってないな）うちの状況をわかってくれてない気がする。", score: -3, emotionDelta: -6, quality: "bad" },
      ],
    },

    /* ─── Phase 4: クロージング ─── */
    {
      id: "on-close-1", phase: 4, phaseLabel: "クロージング",
      narration: "残り時間は10分。佐藤部長は興味を示しているが、慎重派だ。ここで次のステップに持ち込めるか。",
      customerLine: "話はわかった。…ただ、うちは過去にツール導入に失敗してるから、慎重にならざるを得ないんだよね。",
      choices: [
        { id: "on-cl-a", label: "過去の失敗原因を聞いて安心させる", icon: "🔍", salesTalk: "過去の導入で失敗されたんですね。差し支えなければ、何が原因で定着しなかったか教えていただけますか？同じ轍を踏まないよう、一緒に対策を考えたいんです。", customerResponse: "…前のツールは多機能すぎて誰も使わなかったんだよ。研修も1回だけで。（少し安心した表情）…一緒に対策を考えてくれるの？", score: 10, emotionDelta: 8, technique: "失敗原因ヒアリング＋伴走姿勢", quality: "excellent", hint: "過去の痛みに寄り添い、同じ失敗を防ぐ姿勢が信頼を勝ち取る" },
        { id: "on-cl-b", label: "「まずは無料トライアルから」と提案", icon: "🆓", salesTalk: "慎重に進めたいお気持ち、わかります。まずは2週間の無料トライアルで、佐藤部長と数名だけで試してみませんか？合わなければそのまま終了で大丈夫です。", customerResponse: "無料で試せるなら…リスクはないか。まあ、やってみてもいいかもしれない。", score: 7, emotionDelta: 5, technique: "ステップダウン＋ノーリスク提案", quality: "good" },
        { id: "on-cl-c", label: "「他社さんはすぐ決めてます」と急かす", icon: "⏰", salesTalk: "他の不動産会社さんは初回ミーティングですぐ導入を決められることが多いですよ。早い方がいいと思いますが。", customerResponse: "…他社は他社でしょ。うちはうちのペースがあるんだ。（急かされると逆に引く）", score: -2, emotionDelta: -5, quality: "neutral" },
        { id: "on-cl-d", label: "「導入しないと損失は増え続けますよ」と脅す", icon: "💀", salesTalk: "率直に言うと、導入しなければ年間数千万の機会損失が続くわけです。検討している場合じゃないと思いますが。", customerResponse: "…脅しみたいな言い方はやめてください。（画面越しでも不快感が伝わる）もういいです。", score: -5, emotionDelta: -10, quality: "bad" },
      ],
    },

    /* ─── Phase 5: 次回設定 ─── */
    {
      id: "on-next-1", phase: 5, phaseLabel: "次回設定",
      narration: "商談の終盤。オンラインでは「また連絡します」で消えるリスクが高い。次回を確定できるかが鍵だ。",
      customerLine: "まあ、前向きに検討するよ。社内でも少し相談してみる。",
      choices: [
        { id: "on-n1-a", label: "画面共有で候補日をその場で確定", icon: "📅", salesTalk: "ありがとうございます！では来週、トライアル開始の打合せを設定させてください。（Googleカレンダーを画面共有）来週の火曜14時か、水曜15時はいかがですか？佐藤部長の画面からそのまま招待を送りますね。", customerResponse: "（カレンダーを見ながら）水曜15時なら空いてる。じゃあ水曜日で。…カレンダー共有で日程決めるの、わかりやすくていいね。", score: 10, emotionDelta: 7, technique: "画面共有アポ設定＋選択肢提示", quality: "excellent", hint: "オンラインの武器はカレンダー共有。その場で確定させれば消えない" },
        { id: "on-n1-b", label: "「メールで候補日を送ります」と伝える", icon: "📧", salesTalk: "では本日中にメールで来週の候補日をお送りします。トライアル用のアカウントも一緒にご用意しますね。", customerResponse: "わかった、メール待ってます。…忙しいから返信遅れるかもしれないけど。", score: 5, emotionDelta: 2, quality: "good" },
        { id: "on-n1-c", label: "「ご検討よろしくお願いします」で締める", icon: "🙏", salesTalk: "ご検討のほど、よろしくお願いいたします。何かご質問があればいつでもご連絡ください。", customerResponse: "はい、ありがとうございます。（自分からは連絡しないだろうな…）", score: 1, emotionDelta: -2, quality: "neutral" },
        { id: "on-n1-d", label: "次のアクションを決めずに退出", icon: "👋", salesTalk: "今日はありがとうございました！ではまたご縁がありましたら！（退出ボタンを押す）", customerResponse: "…あ、もう切れた。（結局何も決まらなかったな…）まあいいか。", score: -4, emotionDelta: -6, quality: "bad" },
      ],
    },
    {
      id: "on-next-2", phase: 5, phaseLabel: "次回設定",
      narration: "退出前の最後の瞬間。オンライン商談の締め方が次回の温度感を決める。",
      customerLine: "じゃあ、今日はこのへんで。ありがとうございました。",
      choices: [
        { id: "on-n2-a", label: "チャットにまとめを送って退出", icon: "📝", salesTalk: "ありがとうございました！最後に——本日の要点をZoomチャットに残しておきますね。（チャットに「①現状課題：リアルタイム把握不可 ②損失：年間推定2,000万〜 ③次回：水曜15時トライアル打合せ」と送信）次回もよろしくお願いします！", customerResponse: "おお、チャットにまとめてくれるの？ 助かるよ、これ上にもそのまま転送できる。（きちんとした人だな…）水曜日、楽しみにしてます。", score: 10, emotionDelta: 8, technique: "議事録チャット＋次回確認", quality: "excellent", hint: "オンラインの武器をフル活用。チャットメモは「忘れない仕組み」になる" },
        { id: "on-n2-b", label: "笑顔でお礼を言って丁寧に退出", icon: "😊", salesTalk: "佐藤部長、本日は貴重なお時間ありがとうございました。来週の水曜日、改めてよろしくお願いします！失礼します。", customerResponse: "こちらこそ。来週よろしく。（感じのいい人だったな）", score: 6, emotionDelta: 4, quality: "good" },
        { id: "on-n2-c", label: "「資料を後で送ります」と言って退出", icon: "📎", salesTalk: "本日の資料はメールでお送りしますので、ご確認ください。では失礼します。", customerResponse: "はい。（資料は届くだろうけど、見るかどうか…）", score: 2, emotionDelta: 0, quality: "neutral" },
        { id: "on-n2-d", label: "無言で退出ボタンを押す", icon: "🔇", salesTalk: "（「退出」ボタンをクリック。挨拶なしで画面が消える）", customerResponse: "…あれ、切れた？ さようならも言わずに？（最後の最後で印象が悪くなったな…）", score: -3, emotionDelta: -5, quality: "bad" },
      ],
    },
  ],
  getEnding(totalScore, emotion) {
    if (totalScore >= 65 && emotion >= 60) return { id: "trial-confirmed", title: "トライアル即決！", emoji: "🏆", description: "佐藤部長の信頼を完全に勝ち取り、その場でトライアル開始が確定！画面越しでも相手の表情を読み取り、データで裏付けた提案が決め手でした。", grade: "S" };
    if (totalScore >= 45 && emotion >= 40) return { id: "next-meeting", title: "次回ミーティング確定", emoji: "📅", description: "佐藤部長は興味を持ち、次回の打合せを確定してくれました。オンラインならではの画面共有を活用し、信頼関係を構築できています。", grade: "A" };
    if (totalScore >= 25 && emotion >= 20) return { id: "email-pending", title: "「メールで検討します」", emoji: "📧", description: "話は聞いてもらえましたが、具体的な次のアクションが曖昧なまま終了。オンラインでは「メールします」は消える合図。その場で次回を確定させましょう。", grade: "B" };
    return { id: "zoom-ended", title: "通話終了…反応なし", emoji: "🖥️", description: "佐藤部長の信頼を得られず、商談は不発に。オンラインでは準備・画面共有・表情の読み取りが対面以上に重要です。基本を見直しましょう。", grade: "C" };
  },
};
