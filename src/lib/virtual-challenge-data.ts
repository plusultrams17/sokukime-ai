/* ═══════════════════════════════════════════════════════════════
   3D バーチャル商談チャレンジ — ゲームデータ
   店舗入場 → アプローチ → ヒアリング → プレゼン → クロージング → 反論処理
═══════════════════════════════════════════════════════════════ */

export type Phase = 0 | 1 | 2 | 3 | 4 | 5;
export type ChoiceQuality = "excellent" | "good" | "neutral" | "bad";

export interface IntroScene {
  id: string;
  text: string;
  subText?: string;
  duration: number;
}

export interface GameChoice {
  id: string;
  label: string;
  icon: string;
  salesTalk: string;
  customerResponse: string;
  score: number;
  emotionDelta: number;
  technique?: string;
  quality: ChoiceQuality;
}

export interface GameNode {
  id: string;
  phase: Phase;
  phaseLabel: string;
  narration?: string;
  customerLine?: string;
  choices: GameChoice[];
}

export interface Ending {
  id: string;
  title: string;
  emoji: string;
  description: string;
  grade: string;
}

export const PHASE_LABELS = [
  "入場",
  "アプローチ",
  "ヒアリング",
  "プレゼン",
  "クロージング",
  "反論処理",
];

export const INTRO_SCENES: IntroScene[] = [
  {
    id: "intro-1",
    text: "株式会社 田中金属工業",
    subText: "本社ビル 3階・社長室",
    duration: 2500,
  },
  {
    id: "intro-2",
    text: "受付で名前を伝え\n社長室へ案内される",
    subText: "ドアの前で一呼吸置いて——",
    duration: 2500,
  },
  {
    id: "intro-3",
    text: "（コンコン）\n失礼します——",
    duration: 2000,
  },
];

export const GAME_NODES: GameNode[] = [
  /* ═══ PHASE 0: 入場 ═══ */
  {
    id: "enter-1",
    phase: 0,
    phaseLabel: "入場",
    narration: "オフィスビルのエントランスに到着した。ガラス越しに受付が見える。",
    customerLine: undefined,
    choices: [
      {
        id: "e1-a",
        label: "身だしなみを最終チェック",
        icon: "👔",
        salesTalk:
          "（スーツのシワを伸ばし、ネクタイを整える。名刺入れと資料を確認。深呼吸してからビルへ向かう）",
        customerResponse:
          "受付「お待ちしておりました。3階の社長室へどうぞ。エレベーターはあちらです。」",
        score: 5,
        emotionDelta: 3,
        technique: "事前準備",
        quality: "excellent",
      },
      {
        id: "e1-b",
        label: "受付に向かう",
        icon: "🚶",
        salesTalk: "「お世話になります。14時にお約束をいただいている〇〇会社の△△です。」",
        customerResponse: "受付「はい、伺っております。3階へどうぞ。」",
        score: 3,
        emotionDelta: 0,
        quality: "good",
      },
      {
        id: "e1-c",
        label: "スマホで会社情報を確認する",
        icon: "📱",
        salesTalk:
          "（歩きスマホで田中金属工業のHPを見る。最近のニュースをチェック…）",
        customerResponse:
          "受付「…あの、すみません。ご用件は？」（スマホに夢中で気づかなかった）",
        score: 0,
        emotionDelta: -2,
        quality: "neutral",
      },
      {
        id: "e1-d",
        label: "電話しながら入る",
        icon: "📞",
        salesTalk:
          "「はいはい、次の商談終わったら連絡しますー」（電話しながらビルに入る）",
        customerResponse:
          "受付「…（この人大丈夫かな）」社長室に案内されるが、やや冷たい対応。",
        score: -3,
        emotionDelta: -5,
        quality: "bad",
      },
    ],
  },

  /* ═══ PHASE 1: アプローチ ═══ */
  {
    id: "approach-1",
    phase: 1,
    phaseLabel: "アプローチ",
    narration: "社長室のドアを開けると、社長が顔を上げた。",
    customerLine:
      "あ、どうぞどうぞ。座ってください。えーと…どちら様でしたっけ？",
    choices: [
      {
        id: "a1-a",
        label: "オフィスを褒めてから名乗る",
        icon: "✨",
        salesTalk:
          "わあ、すごく整った社長室ですね！ 訪問した企業の中でもダントツです。はじめまして、〇〇会社の△△と申します。",
        customerResponse:
          "えっ、そうですか？（少し嬉しそうに）…まあ掃除しただけですけどね。ハハ。で、△△さん、今日はなんのお話で？",
        score: 8,
        emotionDelta: 10,
        technique: "褒め（比較褒め）",
        quality: "excellent",
      },
      {
        id: "a1-b",
        label: "名刺を渡して丁寧に自己紹介",
        icon: "🤝",
        salesTalk:
          "はじめまして、〇〇会社の△△と申します。（名刺を両手で差し出す）本日はお忙しいところお時間いただきありがとうございます。",
        customerResponse:
          "あ、はい。田中です。（名刺を受け取る）…で、今日はどういうご用件ですか？",
        score: 5,
        emotionDelta: 3,
        technique: "名刺交換",
        quality: "good",
      },
      {
        id: "a1-c",
        label: "「お忙しいところすみません…」と謝る",
        icon: "🙇",
        salesTalk:
          "お忙しいところ本当に申し訳ございません…お時間取らせてしまって…",
        customerResponse:
          "いや、別にいいけど…（頼りなさそうだな）早めに終わらせてくださいね。",
        score: 1,
        emotionDelta: -3,
        quality: "neutral",
      },
      {
        id: "a1-d",
        label: "いきなり資料を出す",
        icon: "📋",
        salesTalk:
          "さっそくですが、こちらの資料をご覧ください。弊社のSaaSサービスが——",
        customerResponse:
          "ちょっと待って。まだ名前も聞いてないんだけど…。もうちょっと順序ってもんがあるでしょ。",
        score: -5,
        emotionDelta: -10,
        quality: "bad",
      },
    ],
  },
  {
    id: "approach-2",
    phase: 1,
    phaseLabel: "アプローチ",
    narration:
      "席に着いた。社長が「で、用件は？」と聞いている。この一言が商談全体の方向を決める。",
    customerLine:
      "それで、今日はどんなお話を持ってきてくれたんですか？",
    choices: [
      {
        id: "a2-a",
        label: "ゴール共有＋先回りで安心させる",
        icon: "🎯",
        salesTalk:
          "今日は業務効率化のご提案なんですが——もし気に入らなければ遠慮なくお断りください。気に入っていただけたら、その時はスタートしてもらえたら嬉しいです。",
        customerResponse:
          "あ、そう言ってもらえると気が楽だな。…まあ、話だけは聞きますよ。",
        score: 10,
        emotionDelta: 10,
        technique: "ゴール共有＋先回り",
        quality: "excellent",
      },
      {
        id: "a2-b",
        label: "「御社のHPを拝見しまして」と関心を示す",
        icon: "🔍",
        salesTalk:
          "御社のホームページ拝見しまして、創業40年の実績、本当にすごいですね。田中社長が二代目で——",
        customerResponse:
          "おっ、ちゃんと調べてきてくれたの？（少し前のめり）うん、親父の代からやってるんだけどね。",
        score: 6,
        emotionDelta: 7,
        technique: "事前リサーチ＋褒め",
        quality: "good",
      },
      {
        id: "a2-c",
        label: "「早速ですが弊社の商品を…」と説明開始",
        icon: "📊",
        salesTalk:
          "早速ですが、弊社の業務効率化SaaSについてご説明させてください。",
        customerResponse:
          "うーん…まあ聞くけど。（また売り込みか…）手短にお願いしますよ。",
        score: -3,
        emotionDelta: -5,
        quality: "neutral",
      },
      {
        id: "a2-d",
        label: "世間話を続ける",
        icon: "💬",
        salesTalk:
          "そういえば、最近このあたりも開発が進んでますよね。お昼どこで食べてます？",
        customerResponse:
          "…いや、雑談はいいから。用件は何？（少し苛立ちを見せる）",
        score: -2,
        emotionDelta: -4,
        quality: "bad",
      },
    ],
  },

  /* ═══ PHASE 2: ヒアリング ═══ */
  {
    id: "hearing-1",
    phase: 2,
    phaseLabel: "ヒアリング",
    narration:
      "社長が話を聞く姿勢を見せている。ここからお客さんの本音を引き出すフェーズだ。",
    customerLine: "まあ、話は聞きますよ。で、業務効率化って具体的に何なの？",
    choices: [
      {
        id: "h1-a",
        label: "第三者話法で悩みを引き出す",
        icon: "👥",
        salesTalk:
          "同業の製造業さんで「事務作業に時間を取られて現場に出られない」と悩んでいる社長さんが多いんですが…田中社長はいかがですか？",
        customerResponse:
          "…あー、それはうちも同じだわ。正直、見積書作るだけで半日潰れることもあってさ。",
        score: 8,
        emotionDelta: 8,
        technique: "第三者話法",
        quality: "excellent",
      },
      {
        id: "h1-b",
        label: "直接「お困りのことは？」と聞く",
        icon: "❓",
        salesTalk:
          "田中社長の会社で、今一番お困りのことって何ですか？",
        customerResponse:
          "困ってること…まあ色々あるけど。人手不足かな。",
        score: 4,
        emotionDelta: 2,
        quality: "good",
      },
      {
        id: "h1-c",
        label: "「うちのシステムなら全部解決」と断言",
        icon: "💪",
        salesTalk:
          "業務効率化というのは、うちのSaaSシステムを導入すれば全部解決できるんです！",
        customerResponse:
          "（腕組み）…はぁ。まだ何も聞いてないのに「解決できる」って、ちょっと信用できないんだけど。",
        score: -5,
        emotionDelta: -8,
        quality: "bad",
      },
      {
        id: "h1-d",
        label: "「従業員は何名ですか？」と基本情報を聞く",
        icon: "📝",
        salesTalk:
          "ちなみに御社は従業員何名くらいいらっしゃいますか？",
        customerResponse:
          "15人。事務が3人で、あとは現場。それがどうしたの？",
        score: 3,
        emotionDelta: 0,
        quality: "neutral",
      },
    ],
  },
  {
    id: "hearing-2",
    phase: 2,
    phaseLabel: "ヒアリング",
    narration:
      "社長が少し本音を話し始めた。もっと深く掘り下げるチャンスだ。",
    customerLine:
      "まあ、事務作業の多さは前から気になってたんだけどね…",
    choices: [
      {
        id: "h2-a",
        label: "「具体的に」と深掘りする",
        icon: "🔍",
        salesTalk:
          "具体的に、一番時間がかかっているのはどんな業務ですか？",
        customerResponse:
          "見積書と請求書かな…Excelでやってるんだけど、毎月月末は地獄だよ。夜10時まで残ってることもある。",
        score: 8,
        emotionDelta: 5,
        technique: "深掘り「具体的に」",
        quality: "excellent",
      },
      {
        id: "h2-b",
        label: "「いつ頃からですか？」と時間軸で聞く",
        icon: "📅",
        salesTalk: "それはいつ頃からのお悩みですか？",
        customerResponse:
          "もう5年くらいかな。前は2人でやってたけど、1人辞めてからずっとキツいんだよね。",
        score: 7,
        emotionDelta: 5,
        technique: "時間軸計算",
        quality: "good",
      },
      {
        id: "h2-c",
        label: "共感して気持ちを引き出す",
        icon: "💭",
        salesTalk:
          "それは大変ですよね…。社長ご自身はどんなお気持ちでしたか？",
        customerResponse:
          "正直しんどいよ。社長なのに経理みたいな仕事してるし…。本当は営業に出たいんだけどね。",
        score: 6,
        emotionDelta: 7,
        technique: "感情引出し",
        quality: "good",
      },
      {
        id: "h2-d",
        label: "「では提案に移りましょう」と切り上げる",
        icon: "➡️",
        salesTalk:
          "なるほど、よくわかりました。では弊社の提案を説明させてください。",
        customerResponse:
          "…え、もう？（まだ全部話してないんだけどな…）まあ、いいですけど。",
        score: -2,
        emotionDelta: -4,
        quality: "neutral",
      },
    ],
  },

  /* ═══ PHASE 3: プレゼン ═══ */
  {
    id: "present-1",
    phase: 3,
    phaseLabel: "プレゼン",
    narration:
      "ヒアリングで課題が見えてきた。いよいよ提案だ。資料を出すタイミングに注意。",
    customerLine:
      "で、具体的にどうやって解決してくれるの？",
    choices: [
      {
        id: "p1-a",
        label: "課題に接続して利点を伝える",
        icon: "📊",
        salesTalk:
          "先ほどの見積書作成の件ですが、弊社のSaaSなら自動作成できるので月末の残業がゼロに。つまり、社長が営業に出られる時間が生まれるんです。",
        customerResponse:
          "へえ…自動で？（身を乗り出す）それ、うちの見積フォーマットでもできるの？",
        score: 10,
        emotionDelta: 10,
        technique: "課題接続＋利点話法",
        quality: "excellent",
      },
      {
        id: "p1-b",
        label: "導入事例資料を見せる",
        icon: "📋",
        salesTalk:
          "（カバンから事例資料を取り出す）こちら、同じ製造業の〇〇工業さんの事例です。導入後、事務工数が60%削減されました。",
        customerResponse:
          "〇〇工業？知ってるよ。あそこが使ってるの？…ちょっと見せて。",
        score: 7,
        emotionDelta: 7,
        technique: "第三者事例＋資料提示",
        quality: "good",
      },
      {
        id: "p1-c",
        label: "機能一覧を説明する",
        icon: "💻",
        salesTalk:
          "弊社のSaaSには、見積管理、請求管理、顧客管理、在庫管理、勤怠管理など全15機能が——",
        customerResponse:
          "（目が泳ぐ）…いや、全部は使わないと思うけど。うちに必要な機能だけ教えてよ。",
        score: 2,
        emotionDelta: -3,
        quality: "neutral",
      },
      {
        id: "p1-d",
        label: "いきなり見積書を出す",
        icon: "💰",
        salesTalk:
          "（カバンから見積書を取り出す）月額3万円で全機能使い放題です。他社さんより2割お安いです。",
        customerResponse:
          "…いや、まだ何ができるか聞いてないのに値段言われても。安いから良いってもんじゃないでしょ。",
        score: -5,
        emotionDelta: -8,
        quality: "bad",
      },
    ],
  },
  {
    id: "present-2",
    phase: 3,
    phaseLabel: "プレゼン",
    narration:
      "社長の関心が高まっている。もう一押しで確信に変わりそうだ。",
    customerLine: "なるほどね…でも本当にうちに合うのかな？",
    choices: [
      {
        id: "p2-a",
        label: "「導入したら」で理想の未来を描く",
        icon: "🌟",
        salesTalk:
          "導入したら月末の残業がなくなって、その分営業に出られますよね。田中社長が現場に出れば、売上もっと伸びると思いませんか？",
        customerResponse:
          "…確かにな。俺が営業出たら、去年の2倍は取れるんだけどね。（表情が明るくなる）",
        score: 8,
        emotionDelta: 8,
        technique: "天国IF",
        quality: "excellent",
      },
      {
        id: "p2-b",
        label: "3つの利点を畳みかける",
        icon: "🔥",
        salesTalk:
          "しかも！見積書だけじゃなく、請求書も自動化できます。さらに！顧客データも一元管理。おまけにスマホからも操作可能なんです。",
        customerResponse:
          "おお…そこまでできるの？（前のめり）ちなみにスマホって、現場からも使える？",
        score: 7,
        emotionDelta: 6,
        technique: "SP3連発",
        quality: "good",
      },
      {
        id: "p2-c",
        label: "「このまま放置すると」リスクを伝える",
        icon: "⚠️",
        salesTalk:
          "逆にこのまま5年続けると…月40時間×12ヶ月×5年で2,400時間。社長の時給で換算すると、かなりの損失ですよね。",
        customerResponse:
          "…2,400時間か。（顔が曇る）確かに、もったいないな。",
        score: 6,
        emotionDelta: 3,
        technique: "地獄IF＋時間軸",
        quality: "good",
      },
      {
        id: "p2-d",
        label: "「他社より安い」と価格で押す",
        icon: "💴",
        salesTalk:
          "正直、この品質でこの価格は他にないですよ。今なら初月無料キャンペーンもやってます。",
        customerResponse:
          "うーん…値段で決めるつもりはないんだけどね。もうちょっとうちに合うかどうかを知りたい。",
        score: -1,
        emotionDelta: -2,
        quality: "neutral",
      },
    ],
  },

  /* ═══ PHASE 4: クロージング ═══ */
  {
    id: "closing-1",
    phase: 4,
    phaseLabel: "クロージング",
    narration:
      "社長は関心を持っている。いよいよクロージングだ。ここでの一言が成約を左右する。",
    customerLine: "まあ…話はわかった。で、どうすればいいの？",
    choices: [
      {
        id: "c1-a",
        label: "「ぜひ導入してください。」と言い切る",
        icon: "🎯",
        salesTalk:
          "田中社長、ぜひ導入してください。社長が営業に出られる環境を、一緒に作りましょう。",
        customerResponse:
          "…（少し驚いた顔）はっきり言うね。…うーん、でもちょっと考えさせてくれ。",
        score: 10,
        emotionDelta: 5,
        technique: "言い切り訴求",
        quality: "excellent",
      },
      {
        id: "c1-b",
        label: "一貫性を通す（最初の目標に戻る）",
        icon: "🔄",
        salesTalk:
          "最初に「営業に出たい」とおっしゃっていましたよね。このSaaSで事務作業から解放されれば、それが実現できます。",
        customerResponse:
          "…確かに、俺そう言ったな。（うなずく）まあ、一理あるよ。",
        score: 8,
        emotionDelta: 7,
        technique: "一貫性通し",
        quality: "good",
      },
      {
        id: "c1-c",
        label: "「いかがでしょうか？」と聞く",
        icon: "🤔",
        salesTalk: "…いかがでしょうか？ご検討いただけますか？",
        customerResponse:
          "うーん…まあ検討はしますけど。（決め手がないな…）",
        score: -3,
        emotionDelta: -3,
        technique: "NGワード",
        quality: "bad",
      },
      {
        id: "c1-d",
        label: "「みなさん導入されてます」と社会的証明",
        icon: "👥",
        salesTalk:
          "実は同業の会社さんで、この半年で10社以上ご導入いただいてるんです。皆さん同じ悩みを持ってらっしゃいました。",
        customerResponse:
          "10社も？…そんなに使われてるんだ。（少し安心した表情）",
        score: 7,
        emotionDelta: 6,
        technique: "過半数＋社会的証明",
        quality: "good",
      },
    ],
  },

  /* ═══ PHASE 5: 反論処理 ═══ */
  {
    id: "objection-1",
    phase: 5,
    phaseLabel: "反論処理",
    narration: "社長が考え込んでいる。ここが正念場だ——引くか、切り返すか。",
    customerLine:
      "うーん…いい話だとは思うけど、ちょっと検討させてもらっていいかな？",
    choices: [
      {
        id: "o1-a",
        label: "感謝＋フックで切り返す",
        icon: "🙏",
        salesTalk:
          "ありがとうございます、真剣に考えていただけて嬉しいです。ちなみに——商品自体は良いなと思っていただけましたか？",
        customerResponse:
          "…うん、商品はいいと思うよ。ただ、タイミングというか…。",
        score: 10,
        emotionDelta: 8,
        technique: "感謝＋フック",
        quality: "excellent",
      },
      {
        id: "o1-b",
        label: "「何が引っかかりますか？」と深掘る",
        icon: "🔍",
        salesTalk:
          "もちろんです。差し支えなければ、具体的にどのあたりが引っかかっていますか？",
        customerResponse:
          "うちのスタッフが使えるかなって…。パソコン苦手な人もいるし。",
        score: 7,
        emotionDelta: 5,
        technique: "深掘り",
        quality: "good",
      },
      {
        id: "o1-c",
        label: "「わかりました」と引き下がる",
        icon: "🚶",
        salesTalk:
          "わかりました。では資料だけ置いていきますので、ご検討よろしくお願いします。",
        customerResponse:
          "…あ、はい。（もう帰るの？ まあいいか…）",
        score: -5,
        emotionDelta: -5,
        quality: "bad",
      },
      {
        id: "o1-d",
        label: "他のお客さんの声を伝える",
        icon: "💬",
        salesTalk:
          "導入された社長さんから「もっと早くやればよかった」というお声を本当によくいただくんです。検討している間も、時間は過ぎていきますので…",
        customerResponse:
          "…それは確かにそうだな。（少し焦りを感じた表情）",
        score: 8,
        emotionDelta: 6,
        technique: "カギカッコ＋緊急性",
        quality: "good",
      },
    ],
  },
  {
    id: "objection-2",
    phase: 5,
    phaseLabel: "反論処理",
    narration: "社長は揺れている。最後のひと押しが結果を左右する——",
    customerLine: "まあ…悪くはないと思うんだけどね。",
    choices: [
      {
        id: "o2-a",
        label: "最初の夢に立ち返る",
        icon: "🎯",
        salesTalk:
          "田中社長、最初に「営業に出たい」っておっしゃってましたよね。その夢を一緒に実現しませんか？まずは1ヶ月、お試しからでも。",
        customerResponse:
          "…（長い沈黙の後、笑顔で）わかった。じゃあ、やってみるか。",
        score: 10,
        emotionDelta: 10,
        technique: "目的振返り＋ステップダウン",
        quality: "excellent",
      },
      {
        id: "o2-b",
        label: "無料トライアルを提案する",
        icon: "🆓",
        salesTalk:
          "まずは1週間の無料トライアルからいかがですか？合わなければお断りいただいてOKです。",
        customerResponse:
          "無料ならリスクないか…。じゃあ試してみようかな。",
        score: 7,
        emotionDelta: 7,
        technique: "ステップダウン",
        quality: "good",
      },
      {
        id: "o2-c",
        label: "「今月中なら割引」と特典を出す",
        icon: "🏷️",
        salesTalk:
          "実は今月中にお申し込みいただければ、初期費用無料のキャンペーンがありまして…",
        customerResponse:
          "キャンペーン…（少し冷めた目）そういうのは別にいいから。内容で判断するよ。",
        score: 2,
        emotionDelta: -2,
        quality: "neutral",
      },
      {
        id: "o2-d",
        label: "「今すぐ決めてください」と迫る",
        icon: "⏰",
        salesTalk:
          "正直、今が一番のタイミングです。今日この場で決めていただけませんか？",
        customerResponse:
          "…いや、急かされるのは好きじゃないんだよね。（腕組み）もう少し考えるわ。",
        score: -3,
        emotionDelta: -5,
        quality: "bad",
      },
    ],
  },
];

export const NODE_ORDER = [
  "enter-1",
  "approach-1",
  "approach-2",
  "hearing-1",
  "hearing-2",
  "present-1",
  "present-2",
  "closing-1",
  "objection-1",
  "objection-2",
];

export function getEnding(totalScore: number, emotion: number): Ending {
  if (totalScore >= 65 && emotion >= 60) {
    return {
      id: "instant-close",
      title: "即決成約！",
      emoji: "🏆",
      description:
        "見事！社長の心を掴み、その場で契約を勝ち取りました。アプローチからクロージングまで営業の型を的確に実行できています。",
      grade: "S",
    };
  }
  if (totalScore >= 45 && emotion >= 40) {
    return {
      id: "appointment",
      title: "次回アポ獲得",
      emoji: "📅",
      description:
        "社長は興味を持ってくれました。「来週もう一度来て」と次回アポを獲得。あと一歩でその場で決められたかも？",
      grade: "A",
    };
  }
  if (totalScore >= 25 && emotion >= 20) {
    return {
      id: "consider",
      title: "「検討します」",
      emoji: "🤔",
      description:
        "話は聞いてもらえましたが強い関心は引き出せず。ヒアリングでお客さんの本音を深掘りすると、もっと良い結果に繋がります。",
      grade: "B",
    };
  }
  return {
    id: "rejected",
    title: "門前払い",
    emoji: "🚪",
    description:
      "社長の信頼を得られず早々に商談終了。まずはアプローチで信頼を築き、お客さんのペースに合わせましょう。",
    grade: "C",
  };
}
