import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const PHASE_PROMPTS: Record<number, string> = {
  0: `以下の業種の営業マンが使える「信頼構築シート」の内容を生成してください。

生成する内容：
1. 褒めポイント3つ（比較対象付き）
   - praise1: 外見・雰囲気を褒める一言（比較で強調：「今まで○社見た中で一番〜」等）
   - praise2: 会社・店舗・オフィスの雰囲気を褒める一言
   - praise3: 実績・評判を褒める一言
2. ゴール共有スクリプト（premise）：
   「①精一杯ご説明させていただきます → ②気に入らなければお断りOK → ③気に入ったらスタートしてください → ④よろしいですか？」の流れで事前合意を取る文
3. 上記を組み合わせた完成トーク例文（preview: 挨拶→褒め→2度褒め→ゴール共有の流れ、150文字以上）

JSON形式で返してください：
{ "praise1": "...", "praise2": "...", "praise3": "...", "premise": "...", "preview": "..." }`,

  1: `以下の業種の営業マンが使える「課題発掘シート」の内容を生成してください。

生成する内容：
1. 想定されるお客様のニーズ3つ（need1, need2, need3）
2. ニーズ発掘フレーズ3つ（第三者話法＋質問の形式）
   - drawer1: 「〇〇と悩んでいる方が多いのですが、○○さんは〜のお悩みなどないですか？」形式（need1に対応）
   - drawer2: 同形式（need2に対応）
   - drawer3: 同形式（need3に対応）
   ※1行目は第三者がしゃべったように口語で、2行目は文語で質問
3. 深掘り質問チェーン5つ：
   - cause: 原因を探る質問（「何が原因だと感じていますか？」）
   - since: いつからか時間軸を確認する質問＋金額換算（「いつ頃から？」「月○万の損失が年間で○万に…」）
   - concrete: 具体的な影響を引き出す質問（「具体的にどんな問題が起きていますか？」）
   - neglect: 放置した場合の結末を考えさせる質問（「このまま放置すると具体的にどうなりますか？」）
   - feeling: 感情を引き出す質問（「気分はどうですか？」※答えをお客様の口から言ってもらう）
4. 上記を組み合わせたヒアリングスクリプト例（preview、200文字以上）

JSON形式で返してください：
{ "need1": "...", "need2": "...", "need3": "...", "drawer1": "...", "drawer2": "...", "drawer3": "...", "cause": "...", "since": "...", "concrete": "...", "neglect": "...", "feeling": "...", "preview": "..." }`,

  2: `以下の業種の営業マンが使える「価値提案シート」の内容を生成してください。

生成する内容：
1. セールスポイント→ベネフィット変換3組（利点話法）
   - feature1→benefit1, feature2→benefit2, feature3→benefit3
   ※「だから」で繋いで、お客様の得られる利益を明確にする
2. 競合比較1セット（比較話法）
   - compCompetitor: 他社の弱み（「他社だと○○」「このままだと○○」）
   - compOurs: 自社の強み
   - compBenefit: だからお客様のメリット
3. IF活用（想像させるフレーズ）
   - heavenIf: 天国IF「もし○○になったら気分はどうですか？」（ポジティブ想像）
   - hellIf: 地獄IF「もし○○になってしまったら気分はどうですか？」（ネガティブ想像、天国の2倍の訴求力）
4. プレゼントーク例（preview: 利点話法+比較+IF活用を組み込んだ完成トーク、200文字以上）

JSON形式で返してください：
{ "feature1": "...", "benefit1": "...", "feature2": "...", "benefit2": "...", "feature3": "...", "benefit3": "...", "compCompetitor": "...", "compOurs": "...", "compBenefit": "...", "heavenIf": "...", "hellIf": "...", "preview": "..." }`,

  3: `以下の業種の営業マンが使える「クロージングシート」の内容を生成してください。

【基本3技術】
1. 証言引用（第三者話法）
   - quote1: お客様の声①（「もっと早くやればよかった」等、引用形式でそのまま使えるセリフ）
   - quote2: お客様の声②（別の切り口のポジティブな声）
2. 社会的証明（多数派）
   - socialProof: 「みなっっっさん」を強調した多数派フレーズ（「みなっさんが選ばれている○○をぜひ！」形式）
3. 一貫性通し
   - consistency: 前提条件の振り返り＋訴求（「最初にお伝えした通り、良いと思ったらスタートしてください。」形式）

【ポジティブクロージング】
4. ポジティブシングル（SP→ベネフィット→天国想像→証言引用→訴求）
   - posIf: 天国IF想像フレーズ（「もし○○になったら気分はどうですか？」→3倍リアクション→オウム返し）
5. ポジティブトリプル（3連発のリズム）
   - posTriple1: SP→ベネフィット①
   - posTriple2: 「しかも！」SP→ベネフィット②
   - posTriple3: 「さらに！」SP→ベネフィット③
   ※3つともコンパクトに長さを揃える、リズム重視

【ネガティブクロージング（ゆさぶり）】
6. ネガティブシングル（逆SP→逆ベネフィット→地獄想像）
   - negReverseSP: 逆セールスポイント（「○○じゃないと」「このままだと」「他社だと」形式）
   - negReverseBenefit: 逆ベネフィット（「○○できない」「○○にならない」、お客様が嫌がるフレーズ）
   - negIf: 地獄IF想像フレーズ（「もし○○になってしまったら気分はどうですか？」）
   ※必ず敬意を添える：「○○様に限って当てはまらないですが」
7. ネガティブトリプル（ゆさぶり3連発のリズム）
   - negTriple1: ゆさぶり①
   - negTriple2: ゆさぶり②
   - negTriple3: ゆさぶり③

【欲求パターン】
8. 積極的欲求と消極的欲求
   - activeDesire: 積極的欲求フレーズ（「○○したい」「○○になりたい」形式）
   - passiveDesire: 消極的欲求フレーズ（「○○したくない」「○○と思われたくない」形式、こちらの方が強い）

9. 訴求フレーズ（appealPhrase）：証言引用＋一貫性通しor多数派＋訴求の組み合わせ
10. クロージングトーク例（preview：ポジティブ→ネガティブ→訴求の流れ、250文字以上）

JSON形式で返してください：
{ "quote1": "...", "quote2": "...", "socialProof": "...", "consistency": "...", "posIf": "...", "posTriple1": "...", "posTriple2": "...", "posTriple3": "...", "negReverseSP": "...", "negReverseBenefit": "...", "negIf": "...", "negTriple1": "...", "negTriple2": "...", "negTriple3": "...", "activeDesire": "...", "passiveDesire": "...", "appealPhrase": "...", "preview": "..." }`,

  4: `以下の業種の営業マンが使える「反論処理シート」の内容を生成してください。

【想定される反論（4大パターン）】
お客様が「考えます」と言う時の4つの代表的なパターンを事前準備する。
1. 意思決定の壁（上司や家族に相談しないと決められない）
   - obj1Script: お客様の想定セリフ（「上司に相談しないと…」「家族に聞いてみないと…」等）
   - obj1Rebuttal: あなたの切り返し（共感→フック→提案の流れ）
2. 比較検討（他社も見てから決めたい）
   - obj2Script: お客様の想定セリフ（「他社も見てから決めたい」「もう少し調べたい」等）
   - obj2Rebuttal: あなたの切り返し（共感→すり替え→価値提示の流れ）
3. 予算の壁（価格が高い・予算がない）
   - obj3Script: お客様の想定セリフ（「ちょっと高いかな…」「予算的に厳しい」等）
   - obj3Rebuttal: あなたの切り返し（驚き→謝罪→価値の再提示の流れ）
4. タイミングの壁（今じゃなくてもいい）
   - obj4Script: お客様の想定セリフ（「今はまだいいかな」「来月以降で…」等）
   - obj4Rebuttal: あなたの切り返し（共感→緊急性提示→行動促進の流れ）

【切り返しの型（全技法共通）】
5. 共通パターン（全ての切り返しの冒頭で使用）
   - empathy: 共感フレーズ（「あーそうですよねー、考えたいですよねー、わかりますー」形式）
   - gratitude: 感謝フレーズ（「真剣に考えていただいて、ありがとうございます」形式）
   - hook: フックYES質問（「商品自体は良いと思ってくださってますか？」等、小さなYESを取る質問）

【切り返し5技法】
6. 技法①「目的の振り返り」（考えたい・検討したいケースに有効）
   - tech1Recall: 目的の振り返り（「今日の目的は○○でしたよね？」→視野が狭くなった顧客を森に戻す）
   - tech1Area: 切り返しの公式（A:「○○が目的であれば絶対今決断すべきです」R: 理由 E: 例え A: 繰り返し）

7. 技法②「第三者アタック」（考えたい・検討したいケースに有効）
   - tech2Episode: 第三者エピソード（天国or地獄のストーリー。多少長くてもOK、具体的に。自分の感情を入れてもOK）

8. 技法③「YESの積み上げ」（バトルっぽく熱くなったケースに有効）
   - tech3YesPlus: YES+質問の流れ（「どのポイントが良いですか？」→「なぜそのポイントが良い？」→お客様自身にプラスを語らせる）

9. 技法④「すり替え」（他社比較・他者相談・今じゃなくてもいいに有効）
   - tech4Reframe: すり替えフレーズ（「他を見たい方は実は迷っているだけ」「考えますは問題の先送り」等、相手の主張を別の角度から指摘）
   - tech4Correction: 補正フレーズ（「○○なんですから」と褒めて否定誘導とセットで使う）
   ※必ず敬意を先に：「○○様に限っては決して当てはまらないですが」

10. 技法⑤「価値の再提示」（価格が高いと言われたケースに有効）
   - tech5Apology: 驚き＋謝罪（「高いですか！高く思わせてしまって申し訳ございません。私の伝え方が悪かっただけなんです」）
   - tech5Value: SP+ベネフィット3連発で価値を再提示（「みなっさん安いよねーとおっしゃってくださる理由は〜」形式）

11. 完成された反論処理フロー例（preview：共感→感謝→フック→いずれかの技法→切り返しの公式→訴求の流れ、250文字以上）

JSON形式で返してください：
{ "obj1Script": "...", "obj1Rebuttal": "...", "obj2Script": "...", "obj2Rebuttal": "...", "obj3Script": "...", "obj3Rebuttal": "...", "obj4Script": "...", "obj4Rebuttal": "...", "empathy": "...", "gratitude": "...", "hook": "...", "tech1Recall": "...", "tech1Area": "...", "tech2Episode": "...", "tech3YesPlus": "...", "tech4Reframe": "...", "tech4Correction": "...", "tech5Apology": "...", "tech5Value": "...", "preview": "..." }`,
};

// Max tokens per phase (phases 3-4 need more due to more fields)
const PHASE_MAX_TOKENS: Record<number, number> = {
  0: 800,
  1: 1000,
  2: 1000,
  3: 2500,
  4: 2500,
};

let anthropicClient: Anthropic | null = null;
function getAnthropicClient(): Anthropic | null {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;
  if (!anthropicClient) {
    anthropicClient = new Anthropic({ apiKey });
  }
  return anthropicClient;
}

export async function POST(request: NextRequest) {
  try {
    const { industry, phase, productInfo, targetInfo } = await request.json();

    if (!industry || phase === undefined || !PHASE_PROMPTS[phase]) {
      return NextResponse.json(
        { error: "industry and valid phase (0-4) are required" },
        { status: 400 },
      );
    }

    const client = getAnthropicClient();
    if (!client) {
      return NextResponse.json(
        { error: "AI API key not configured" },
        { status: 500 },
      );
    }

    const detailContext = productInfo
      ? `\n【自社・商材情報】\n商材名: ${productInfo.productName || "不明"}\nターゲット層: ${productInfo.targetAudience || "不明"}\n主な特徴: ${productInfo.keyFeatures || "不明"}\n価格帯: ${productInfo.priceRange || "不明"}\n競合優位性: ${productInfo.advantages || "不明"}\n課題: ${productInfo.challenges || "不明"}`
      : "";

    const targetContext = targetInfo
      ? `\n【ターゲット（営業先）情報】\n企業名: ${targetInfo.targetCompanyName || "不明"}\n業種: ${targetInfo.targetIndustry || "不明"}\n担当者役職: ${targetInfo.targetPosition || "不明"}\n企業規模: ${targetInfo.targetScale || "不明"}\n想定ニーズ: ${targetInfo.targetNeeds || "不明"}\n想定予算: ${targetInfo.targetBudget || "不明"}\n導入時期: ${targetInfo.targetTimeline || "不明"}`
      : "";

    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: PHASE_MAX_TOKENS[phase] || 1000,
      system: `あなたは営業のプロフェッショナルです。営業準備ワークシートの内容を生成してください。
- 各項目は具体的でリアルな内容にしてください
- その業種ならではの表現を使ってください
- ターゲット情報がある場合は、そのターゲット企業・担当者に合わせた具体的な内容にしてください
- previewはそのまま商談で使えるトーク例にしてください
- 必ず指定されたJSON形式で返してください
- JSON以外のテキストは出力しないでください`,
      messages: [
        {
          role: "user",
          content: `業種・商材: ${industry}${detailContext}${targetContext}\n\n${PHASE_PROMPTS[phase]}`,
        },
      ],
    });

    const content = response.content[0]?.type === "text" ? response.content[0].text : "";
    const jsonMatch = content.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      return NextResponse.json({ error: "Invalid AI response" }, { status: 500 });
    }

    return NextResponse.json(JSON.parse(jsonMatch[0]));
  } catch (error) {
    console.error("Phase generation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
