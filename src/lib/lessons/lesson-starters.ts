/**
 * Lesson-specific roleplay starter messages.
 *
 * Every lesson has a pre-populated "opening customer message" so the user
 * can practice the exact technique taught in the lesson from turn 1 — no
 * wasted turns getting into position.
 *
 * - Approach-phase lessons (sales-mindset, praise-technique, premise-setting,
 *   mehrabian-rule): the customer opens with a mild/dismissive greeting that
 *   sets up the salesperson's first technique (praise, goal-share, etc.)
 * - Hearing-phase lessons (drawer-phrases, deepening): customer gives a
 *   shallow "no problem" answer that demands drawer phrases or deeper probing
 * - Presentation-phase lessons (benefit-method, comparison-if): customer
 *   asks "what's the point?" or "how does this compare to X?"
 * - Closing-phase lessons (closing-intro, social-proof, consistency, quotation,
 *   positive/negative closing, desire-patterns): customer hesitates after
 *   presentation
 * - Rebuttal-phase lessons (rebuttal-basics, rebuttal-pattern, purpose-recall,
 *   third-party, positive-shower, reframe, value-stacking): customer objects
 *   (高い/検討します/他も見る/疑心暗鬼)
 */

export interface LessonStarter {
  /** The opening line spoken by the AI customer (pre-populated before turn 1). */
  openingMessage: string;
  /** Short label shown at the top of the roleplay screen (e.g. "【プレゼン後】高いですねの反論処理"). */
  contextLabel: string;
  /** Hint displayed to the user describing what technique to practice. */
  userHint: string;
  /** Which of the 5 sales steps this starter lands on. Defaults to 5 (反論処理) if omitted. */
  initialStep?: 1 | 2 | 3 | 4 | 5;
  /** Initial coach tip shown before the user's first message. */
  initialCoachTip?: string;
  /** Example first reply the user might try (shown in coach panel). */
  initialExamplePhrase?: string;
}

export const LESSON_STARTERS: Partial<Record<string, LessonStarter>> = {
  // ════════════════════════════════════════════════════
  // BEGINNER (Lessons 1-8) — アプローチ / ヒアリング / プレゼン
  // ════════════════════════════════════════════════════

  // ── Lesson 1: 営業マインドセット ──
  // 心が折れやすいシーン（冷たい第一声）で、マインドセットを保てるかを試す
  "sales-mindset": {
    openingMessage:
      "あー、セールスですか？ちょっと今忙しいんで、興味ないです。他当たってください。",
    contextLabel: "【アプローチ直後】冷たくあしらわれた場面",
    userHint:
      "「興味ない」で心折れず、営業マインドセットで自信を持って切り返しましょう。弱気になったら負けです。",
    initialStep: 1,
    initialCoachTip:
      "NG反応：「すみません」と引き下がる／「お時間ありますか？」と弱気。OK反応：明るく笑顔の言葉選びで、「1分だけ」と堂々とお願いする。マインドが「売り込み」ではなく「お客さんの役に立ちに来た」に切り替わっているかが鍵。",
    initialExamplePhrase:
      "お忙しいところ本当に申し訳ございません！ただ、今日○○様に絶対にお得な話をお持ちしたので、1分だけ、本当に1分だけお時間いただけませんか？1分でピンと来なければ潔く帰ります！",
  },

  // ── Lesson 2: 褒める技術 ──
  // お客さんがニュートラルな応答をする → 営業マンは開口一番で褒められるか
  "praise-technique": {
    openingMessage:
      "はい、どうぞおかけください。今日はどのようなご用件でしょうか？",
    contextLabel: "【アプローチ】応接室に通された直後の場面",
    userHint:
      "いきなり本題ではなく、まず「2度褒め」で心理的安全を確保しましょう。お客さん・会社・場所など、具体的なポイントを褒めます。",
    initialStep: 1,
    initialCoachTip:
      "ありがちなNG：「お時間ありがとうございます、早速ですが商材のご紹介を…」と本題へ急ぐ。OK：まず相手や会社を具体的に褒める＋2度目はもっと具体的に褒める。抽象的な「素敵ですね」では響かないので、1点に絞って深掘り褒めを。",
    initialExamplePhrase:
      "ありがとうございます！それにしても、本当に素敵な会社ですね…入り口からオフィスの雰囲気まで、今まで○社お伺いしましたが、ダントツで活気がある空気感です。特にスタッフの皆さんの表情が明るくて、○○様が作られた雰囲気なんでしょうね。",
  },

  // ── Lesson 3: 先回り（前提設定） ──
  // 「聞くだけ」とジャブを打たれた状態 → ゴール共有で主導権を取り戻す
  "premise-setting": {
    openingMessage:
      "じゃあ簡単に話聞かせてもらいますね。とりあえず聞くだけですけどね。買う気は正直ないんで、そこは先に言っておきますね。",
    contextLabel: "【アプローチ後半】「聞くだけ」スタンスを取られた場面",
    userHint:
      "「聞くだけ」というフレームを、最初のゴール共有で崩しましょう。「気に入らなかったら断ってOK、気に入ったら始める」で決断の土俵を作ります。",
    initialStep: 1,
    initialCoachTip:
      "「聞くだけ」を受け入れたら、最後に必ず「検討します」で終わります。ゴール共有で「今日この場で気に入るか気に入らないかを決めてほしい」を明確にするのが先回りの本質。笑顔で、押し付けずに、でも言い切ること。",
    initialExamplePhrase:
      "ありがとうございます！一つだけお願いがあって——もし今日お話を聞いて「いいな」と思っていただけたらぜひ始めていただきたいですし、逆に「ちょっと違うな」と思われたら全然遠慮なく断ってください。僕も○○様にとって必要なければ無理にお勧めしませんので。そのスタンスで聞いていただいて大丈夫ですか？",
  },

  // ── Lesson 4: メラビアンの法則 ──
  // 反応が薄い相手 → 言葉選びとトーンで温度を上げられるか
  "mehrabian-rule": {
    openingMessage:
      "…はい、どうも。ええと、何の話でしたっけ？",
    contextLabel: "【アプローチ】反応が薄く冷めた空気の場面",
    userHint:
      "メラビアンの法則：言葉の内容より「トーン・表情・振る舞い」が伝わる情報の9割以上。テキストでも「短く歯切れ良く・明るく・自信のある言葉選び」で温度を上げましょう。",
    initialStep: 1,
    initialCoachTip:
      "長いダラダラした言葉はNG。短く・区切って・元気よく。語尾は「です」「ます」で言い切り、「〜かなぁと…」「〜かもしれません」のような弱い語尾を完全排除。明るい形容詞（素敵、すごい、嬉しい）を多めに。",
    initialExamplePhrase:
      "あ、ありがとうございます！今日は○○様に、本当にお得な話を持ってきました！短く、ポイントだけお伝えしますね。3分だけお時間ください、絶対に後悔させません！",
  },

  // ── Lesson 5: 引き出しフレーズ ──
  // ヒアリングで「特に困ってない」と返された場面 → 引き出しフレーズで悩みを引き出す
  "drawer-phrases": {
    openingMessage:
      "いや、今は特に困ってることはないですね。まあ普通にやれてますし、現状で満足してますよ。",
    contextLabel: "【ヒアリング】「困っていない」と返された場面",
    userHint:
      "「困ってない」で諦めず、引き出しフレーズ（例えば／仮に／もし〜だったら）で潜在ニーズを浮き彫りにしましょう。",
    initialStep: 2,
    initialCoachTip:
      "ダメな引き下がり：「そうですか、では失礼します」。引き出しフレーズの型：「例えば○○な場面ってありませんか？」「仮に今より○○になったらどうですか？」「もし○○が解決できるとしたら嬉しいですか？」の3パターンを使い分け。",
    initialExamplePhrase:
      "そうでございますか、今は順調なんですね！それは何よりです。ただ一つだけ聞かせていただきたくて——例えばですが、今より○○がラクになったら嬉しいなとか、もし○○の時間が減らせたら他のことに回せるなとか、そういう「理想」ってありますか？",
  },

  // ── Lesson 6: 深掘りの技術 ──
  // 表面的な答えを返された場面 → 具体化＋いつからで深掘り
  "deepening": {
    openingMessage:
      "まあ、強いて言えば最近ちょっと忙しいくらいですかね。でも普通ですよ、どこも同じだと思いますし。",
    contextLabel: "【ヒアリング】表面的な答えで流された場面",
    userHint:
      "「具体的には？」「いつから？」「それによって何が困ってる？」で深掘りし、本当の課題を引き出しましょう。",
    initialStep: 2,
    initialCoachTip:
      "深掘りの3段階：①具体化（どんな風に忙しい？）→ ②時期（いつから？きっかけは？）→ ③影響（それによって何が犠牲になってる？）。1回の質問で終わらず、答えが出たら必ずもう一段掘る。",
    initialExamplePhrase:
      "ありがとうございます！最近お忙しいとのことですが、具体的にはどんな部分が一番お忙しいですか？それっていつ頃からでしょう？——なるほど、それによって例えば家族との時間とか、趣味の時間って減ってしまったりしてないですか？",
  },

  // ── Lesson 7: 利点話法（ベネフィット変換） ──
  // 「で、何がいいの？」と聞かれた場面 → SP→ベネフィットで答える
  "benefit-method": {
    openingMessage:
      "うーん、話はわかったんですけど…結局、これの何がいいんですか？他の商品と何が違うんでしょう？",
    contextLabel: "【プレゼン中盤】「何がいいの？」と聞かれた場面",
    userHint:
      "SP（商品の特徴）だけで答えず、必ず「SP → だから → ベネフィット（お客さんにとっての価値）」の型で答えましょう。",
    initialStep: 3,
    initialCoachTip:
      "NG：「この商品は○○機能があります」で止まる（特徴だけ）。OK：「○○機能があります、だから○○様にとっては○○の時間が減って、結果的に○○が手に入るんです」とベネフィットまで繋げる。自分語りではなくお客さん主語で。",
    initialExamplePhrase:
      "ありがとうございます、すごくいい質問です！この商品の一番の特徴は○○なんです。だから何がいいかというと——○○様にとって、今まで○○に使っていた時間が半分になって、その分を家族や自分の時間に使えるようになるんです。単なる機能じゃなくて、○○様の生活そのものが変わります。",
  },

  // ── Lesson 8: 比較話法・IF活用 ──
  // 他社比較をされた場面 → 比較話法＋IFで差別化
  "comparison-if": {
    openingMessage:
      "他の会社の商品とどう違うんですか？正直、他社のほうが安いところもあるって聞いたんですけど。",
    contextLabel: "【プレゼン〜クロージング手前】他社比較を持ち出された場面",
    userHint:
      "比較話法で「安い商品との違い」を明確化し、IF話法で「もし安い方を選んだらどうなるか」を想像させましょう。",
    initialStep: 3,
    initialCoachTip:
      "NG：他社を直接けなす。OK：比較軸を変える（「価格だけで見れば確かに安いです。ただ○○の観点だとどうでしょう？」）＋IF話法で失敗シナリオを想像させる（「もし3年後○○になったら？」）。",
    initialExamplePhrase:
      "いい質問ありがとうございます！確かに価格だけで見れば他社さんの方が安いところもあります。ただ一つだけ想像してみてほしくて——もし3年後、安いのを選んで○○のトラブルが起きたらどう感じますか？うちの商品は○○な点で、長期で見ると結果的にお得になるんです。",
  },

  // ════════════════════════════════════════════════════
  // ADVANCED (Lesson 22) — 反論処理
  // ════════════════════════════════════════════════════

  // ── Lesson 22: 技法5 価値の上乗せ ──
  // 「高い」反論への対応を直接練習できるよう、プレゼン終了直後に
  // お客さんが「高い」と言う状態からスタートする。
  "value-stacking": {
    openingMessage:
      "プレゼンありがとうございました。内容自体は悪くないと思うんですけど…うーん、ちょっと高いですね。正直、この金額はうちには厳しいかなぁ…。もう少し安くなりませんか？",
    contextLabel: "【プレゼン直後・反論処理フェーズ】お客さんが「高い」と言った場面",
    userHint:
      "「高い」に共感せず、驚き → 謝る → AREA → 訴求 の順で価値を上乗せしましょう。",
    initialStep: 5,
    initialCoachTip:
      "初動は「えっ、高いですか！」と驚き、「高く思わせてしまって申し訳ございません。私の伝え方が悪かっただけなんです」と謝ります。共感は絶対NG。続けてSP＋ベネフィットを3連発でAREA話法に入りましょう。",
    initialExamplePhrase:
      "えっ、高いですか！そうでございますか…！高く思わせてしまって申し訳ございません。私の伝え方が悪かっただけなんです。実は、みなっさん『安いよねー』っておっしゃってくれているんです。なぜなら——",
  },

  // ── Lesson 21: 技法4 すり替え ──
  "reframe": {
    openingMessage:
      "うーん、提案内容はわかりました。ただ、他の会社も見てから決めたいんですよね。いくつか相見積もり取って、比較してから決めようかなって。",
    contextLabel: "【反論処理】「他も見てから決めたい」と言われた場面",
    userHint:
      "「○○様に限って当てはまらないですが」と敬意を先に示し、否定誘導＋補正（褒める）ですり替えましょう。",
    initialStep: 5,
    initialCoachTip:
      "まず敬意を示し、「他と比較する」=「迷っている」=「問題の先送り」へすり替え。補正（褒め）で自尊心をくすぐることも忘れずに。",
    initialExamplePhrase:
      "○○様に限っては絶対に当てはまらないんですが、実は『他も見てから』とおっしゃる方の9割は、ただ迷っているだけなんです。でも○○様はそういう方じゃなくて、ちゃんと決断できる方だと思っているから、あえて申し上げているんです。",
  },

  // ── Lesson 20: 技法3 プラスのシャワー ──
  "positive-shower": {
    openingMessage:
      "……さっきからずっと良いことばかり言ってますけど、本当にそうなんですか？正直、営業トークに聞こえるんですよね。",
    contextLabel: "【反論処理】お客さんが対立的・疑心暗鬼になった場面",
    userHint:
      "YES+質問を3回繰り返して、お客さん自身の口からプラスを語らせましょう。",
    initialStep: 5,
    initialCoachTip:
      "まず共感→感謝で空気を和らげ、①サービス自体は良いと思いますか？ → ②どこが良いと思いますか？ → ③なぜそれが良いと思いますか？の順でYES+を引き出します。",
    initialExamplePhrase:
      "そう感じさせてしまっていたら本当に申し訳ございません。真剣に聞いていただいているからこそ、そう思われるんだと思います。ありがとうございます。一つだけ確認させてください——サービス自体は、良いと思ってくださっていますか？",
  },

  // ── Lesson 19: 技法2 第三者アタック ──
  "third-party-attack": {
    openingMessage:
      "うーん、良いとは思うんですけどね。もう少し検討してから決めたいんですよね。",
    contextLabel: "【反論処理】「検討してから決めたい」と言われた場面",
    userHint:
      "天国・地獄エピソードで第三者アタック。地獄の前には必ず敬意を示しましょう。",
    initialStep: 5,
    initialCoachTip:
      "「○○様に限っては絶対に当てはまらないんですが」と敬意を先に示し、過去のお客さまの地獄エピソードを語ります。感情を入れて臨場感を出すのがコツ。",
    initialExamplePhrase:
      "そうですよね、じっくり考えたいお気持ち、よくわかります。○○様に限っては絶対に当てはまらないんですが、実は以前、似た状況で『検討します』とおっしゃった方がいて——僕も後悔してるんですけど、その方が半年後に…",
  },

  // ── Lesson 18: 技法1 目的の振り返り ──
  "purpose-recall": {
    openingMessage:
      "内容は良いのはわかったんですけど…正直、金額がネックですね。この金額はちょっと出せないなぁ。",
    contextLabel: "【反論処理】価格でつまずいて目的を見失った場面",
    userHint:
      "「木を見て森を見ず」状態です。最初に話した目的を思い出させて、森に戻しましょう。",
    initialStep: 5,
    initialCoachTip:
      "価格に反応せず、「今日お話を聞いていただいた目的は○○でしたよね？」と目的を振り返らせます。その後「○○が目的であれば、絶対に今決断するべきです」と力強く訴求。",
    initialExamplePhrase:
      "ちょっとだけ立ち止まって考えさせてください。今日、最初にお話しいただいた目的は『○○』でしたよね？——この目的を達成するために、今この金額を出さない選択肢って、本当にあるんでしょうか。",
  },

  // ── Lesson 17: AREA話法 ──
  "rebuttal-pattern": {
    openingMessage:
      "うーん、もう少し検討したいんですよね。今日決めるのはちょっと…。",
    contextLabel: "【反論処理】「検討したい」と言われた場面",
    userHint:
      "共感→感謝→フック→AREA話法（主張→理由→例えば→だから）で切り返しましょう。",
    initialStep: 5,
    initialCoachTip:
      "まず共感と感謝で受け止め、フックで小さなYESを取ってから、AREA話法で論理的に切り返します。具体例は臨場感のあるものを。",
    initialExamplePhrase:
      "そうですよね、大きな決断ですもんね。真剣に考えていただいて、本当にありがとうございます。一つだけ確認させてください——商品自体は、良いと思ってくださっていますよね？",
  },

  // ── Lesson 16: 切り返し導入 ──
  "rebuttal-basics": {
    openingMessage:
      "ありがとうございました。いったん持ち帰って、考えさせてもらえますか？",
    contextLabel: "【反論処理】「考えさせてください」と言われた場面",
    userHint:
      "共感→フック→AREA→訴求を最低3回以上粘り強く繰り返しましょう。",
    initialStep: 5,
    initialCoachTip:
      "1回の切り返しで諦めたらD評価です。共感→感謝→フックで小さなYESを取り、AREA→訴求を3回以上繰り返せているかが勝負所。",
    initialExamplePhrase:
      "お時間いただいて本当にありがとうございます。真剣に考えていただいているからこそのお言葉だと思います。一つだけ確認させてください——商品自体は良いと思ってくださっていますよね？",
  },

  // ── Lesson 15: クロージング実践パターン ──
  "desire-patterns": {
    openingMessage:
      "プレゼンありがとうございました。良さそうなのはわかったんですけど…うーん、まだ迷ってるんですよね。",
    contextLabel: "【クロージングフェーズ】最終決断の手前で迷っている場面",
    userHint:
      "過半数・一貫性通し・カギカッコの基本3技術を組み合わせてクロージングしましょう。",
    initialStep: 4,
    initialCoachTip:
      "1つの技術だけでは弱いです。過半数＋一貫性通し＋カギカッコを組み合わせ、「。」で言い切ってNGワードを完全排除。",
    initialExamplePhrase:
      "そうですよね、迷うお気持ちわかります。ただ、先ほど『良いと思う』とおっしゃっていましたよね。実際にみなっさん『やって良かった』と——",
  },

  // ── Lesson 14: ネガティブクロージング ──
  "negative-closing": {
    openingMessage:
      "良いのはわかるんですけど、今すぐじゃなくてもいいかなって。また今度タイミング見て考えますね。",
    contextLabel: "【クロージングフェーズ】先送りしようとしている場面",
    userHint:
      "敬意を先に示してから、逆SP→逆ベネフィットでゆさぶりましょう。",
    initialStep: 4,
    initialCoachTip:
      "敬意なしのネガティブは失礼な印象になります。「○○様に限って当てはまらないですが」を必ず先に。ネガティブ→ポジティブの順で締めます。",
    initialExamplePhrase:
      "○○様に限っては絶対に当てはまらないんですが、実は『今度考える』とおっしゃった方の多くが、1年後も同じ状況で悩まれているんです——",
  },

  // ── Lesson 13: ポジティブクロージング ──
  "positive-closing": {
    openingMessage:
      "プレゼンありがとうございました。内容は良いなと思いました。どんな感じで進むんですか？",
    contextLabel: "【クロージングフェーズ】興味を持ってくれた場面",
    userHint:
      "ポジティブシングル（もし〜）やポジティブトリプル（しかも！さらに！）でワクワクさせましょう。",
    initialStep: 4,
    initialCoachTip:
      "「どこが良かったですか？」で具体的なポイントを引き出し、もし〜なら？で想像させて3倍リアクション。トリプルなら3連発でリズムよく。",
    initialExamplePhrase:
      "ありがとうございます！具体的にどのあたりが良いと感じていただけましたか？——なるほど！もしそれが本当にそうなったら、気分はどうですか？",
  },

  // ── Lesson 12: カギカッコ（第三者話法）──
  "quotation-method": {
    openingMessage:
      "うーん、良さそうなのはわかるんですけど、実際に使っている人ってどうなんですか？",
    contextLabel: "【クロージングフェーズ】実績を気にしている場面",
    userHint:
      "お客さまの声をカギカッコでそのまま引用して、臨場感を出しましょう。",
    initialStep: 4,
    initialCoachTip:
      "「良い商品です」ではなく「お客さまから『○○で良かった！』と言われています」とカギカッコで直接引用。前後に間を取ると効果倍増。",
    initialExamplePhrase:
      "ありがとうございます。実は、みなっさん『○○が変わった』とおっしゃってくださっていて——例えば先月契約いただいた○○様からは、先日わざわざ電話で『本当にやって良かった』と——",
  },

  // ── Lesson 11: 一貫性通し ──
  "consistency": {
    openingMessage:
      "プレゼン聞かせてもらいました。良さそうですね。ちょっと考えてみます。",
    contextLabel: "【クロージングフェーズ】持ち帰ろうとしている場面",
    userHint:
      "先ほどの発言を引用して一貫性通し。「。」で言い切って間を取りましょう。",
    initialStep: 4,
    initialCoachTip:
      "お客さまが「良い」と言った事実を引用し、「先ほど良いとおっしゃっていましたよね」と一貫性を通す。誘導尋問（〜ですよね？）はNG。",
    initialExamplePhrase:
      "ありがとうございます。先ほど『○○が魅力的』とおっしゃっていましたよね。だったら、今始めない理由って、本当にありますか？——",
  },

  // ── Lesson 10: 過半数の技術 ──
  "social-proof": {
    openingMessage:
      "うーん、良さそうなのはわかるんですけど…他の方ってどうしているんですか？",
    contextLabel: "【クロージングフェーズ】他の人の動向が気になっている場面",
    userHint:
      "「みなっさん」を強調して過半数の技術＋訴求でクロージングしましょう。",
    initialStep: 4,
    initialCoachTip:
      "「みなさん」と普通に言うのではなく「みなっっさん」と力強く言い切るのがコツ。力強さが社会的証明の効果を倍増させます。",
    initialExamplePhrase:
      "ご質問ありがとうございます。実は、みなっっさんがもうこちらを選ばれているんです。だからこそ、○○様にも自信を持っておすすめしています——",
  },

  // ── Lesson 9: クロージング導入 ──
  "closing-intro": {
    openingMessage:
      "プレゼンありがとうございました。良いのはわかるんですけど…どうしようかな、ちょっと考えます。",
    contextLabel: "【クロージングフェーズ】決断を先送りしようとしている場面",
    userHint:
      "「理由＋訴求」の公式で言い切り、NGワード（どうされますか？/思います）を完全排除しましょう。",
    initialStep: 4,
    initialCoachTip:
      "「ご検討ください」と言った瞬間に熱が冷めます（映画理論）。強い理由＋「だから始めるべきです」と言い切るのがクロージングの公式。",
    initialExamplePhrase:
      "一度立ち止まらせてください。今日お話を聞いていただいた目的は○○でしたよね。だからこそ、今日決めるべきなんです。一緒に始めましょう！",
  },
};

export function getLessonStarter(slug: string): LessonStarter | null {
  return LESSON_STARTERS[slug] ?? null;
}
