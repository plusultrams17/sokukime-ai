/**
 * Lesson-specific roleplay starter messages.
 *
 * By default, /roleplay starts from approach phase (user speaks first).
 * But for lessons that practice mid- or late-stage techniques
 * (e.g. 技法5「価値の上乗せ」 = handling "高い"), waiting until the
 * customer says "高い" wastes turns and diffuses the practice focus.
 *
 * This map defines an optional "pre-populated customer message" per
 * lesson. When present, the AI customer opens the conversation at a
 * specific stage (e.g. post-presentation objection) so the user can
 * practice the exact technique taught in the lesson from turn 1.
 *
 * Lessons NOT in this map still start from approach (user first).
 * Early-stage lessons (sales-mindset, praise-technique, premise-setting,
 * mehrabian-rule) intentionally keep the approach-phase start.
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
