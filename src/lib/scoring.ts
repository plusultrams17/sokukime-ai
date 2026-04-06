import Anthropic from "@anthropic-ai/sdk";

export interface ScoreInput {
  messages: { role: string; content: string }[];
  industry: string;
  product: string;
  difficulty: string;
  scene: string;
  customerType: string;
  productContext?: string;
  customerContext?: string;
}

export interface ScoreResult {
  overall: number;
  categories: {
    name: string;
    score: number;
    feedback: string;
  }[];
  summary: string;
  strengths: string[];
  improvements: string[];
}

const SCORING_PROMPT = `あなたは「成約5ステップメソッド」公認の営業スキル採点AIです。
以下のルーブリックに厳格に従い、営業ロープレ会話を採点してください。

## 採点手順（必ずこの順序で実行）
1. 会話全体を通読し、各カテゴリの評価テクニックが使われている箇所を特定
2. カテゴリごとに「行動チェックリスト」の該当項目を数え、行動アンカーに照らしてレベルを判定
3. <reasoning>タグ内に、各カテゴリの「検出したテクニック」「該当レベル」「判定根拠」を記述
4. JSON形式で結果を出力

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## カテゴリ1: アプローチ（信頼構築）

【行動チェックリスト】各項目の実行有無を判定
□ T1-褒め: 比較対象を入れた褒め（「今まで○社見た中でダントツ」等）。表面的な社交辞令はカウントしない
□ T2-2度褒め: 相手の謙遜を受けて2回目の褒めを重ねている
□ T3-先回り: 前提条件設定（「気に入らなかったらお断りいただいて構いません」→「もし気に入ったらスタートしてください」→「よろしいですか？」）
□ T4-名前呼び: お客さんの名前を会話中に2回以上呼んでいる
□ T5-専門家ポジション: 業界知識や実績を示して信頼性を確立

【行動アンカー】
S(81-100): T3先回りの型を正しい順序で実行＋T1/T2の比較褒めが自然＋T4/T5も実行。お客さんの反応に合わせてアドリブができている
A(61-80): T3先回りの型を実行＋T1比較褒めがある。型に沿えているが応用は限定的
B(41-60): T1褒め又はT3先回りのどちらか一方を不完全ながら実行。型の一部のみ
C(21-40): 挨拶や自己紹介はあるがT1-T5のどれも正しく実行できていない
D(0-20): 信頼構築なしにいきなり商品説明に入っている

【減点指標】曖昧語の使用（「〜と思います」「〜かもしれません」）は-5点

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## カテゴリ2: ヒアリング（問題の把握）

【行動チェックリスト】
□ T1-第三者話法: 「〜と悩んでいる方が多いですが○○さんは？」の型で質問
□ T2-口語→文語切替: 口語の第三者話法→文語の質問への自然な切り替え
□ T3-深掘り「具体的に」: 「具体的に」を2回以上繰り返して表面→本質に掘り下げ
□ T4-時間軸計算: 「いつから？」→月×年で損失を数値化（例:「月1万×3年=36万の損失」）
□ T5-感情引出し: 「気分はどうですか？」で相手の口から感情を言わせている
□ T6-ニーズ引出し: ニーズを「与える」のではなく質問で「引き出して」いる

【行動アンカー】
S(81-100): T1第三者話法＋T3深掘り2回以上＋T5感情引出しの3点セットが自然に連動。T4時間軸計算やT2切替も使えている
A(61-80): T1第三者話法＋T3深掘りを実行。問題を掘り下げられているが感情引出しや数値化は不十分
B(41-60): 質問はしているがT1-T6の型を使えていない。オープン/クローズドの使い分けは部分的にできている
C(21-40): 質問が少なく浅い。相手の答えに対して深掘りせずすぐ次の話題に移っている
D(0-20): ほぼ質問なしで一方的に話している

【減点指標】誘導尋問（「困りますよね？」「必要ですよね？」）は-5点。費用を聞かれて価値説明前に即回答は-5点

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## カテゴリ3: プレゼン（価値伝達）

【行動チェックリスト】
□ T1-利点話法: SP（セールスポイント）＋「だから」＋ベネフィット（感情的価値）への変換
□ T2-問題接続: ヒアリングで出た相手の問題に対する解決策として商品を提示
□ T3-比較話法: 敬意前置き（「悪口ではないですが」）＋勝てる部分での比較
□ T4-天国IF: 「もしこの問題が解決したら、気分はどうですか？」で肯定的未来を想像させる
□ T5-地獄IF: 「もしこのまま放置したら…」で否定的未来を想像させる（訴求力2倍）
□ T6-3連発: SP→ベネフィットを「しかも！」「さらに！」で3つ連続提示

【行動アンカー】
S(81-100): T1利点話法を正確に実行＋T2問題接続＋T4/T5のIF活用。3連発のリズムがあり相手の反応に合わせた提示ができている
A(61-80): T1利点話法＋T2問題接続ができている。IFや比較は1種類のみ
B(41-60): 商品説明はしているが「だから」のベネフィット変換が不十分。特徴羅列に近い
C(21-40): 商品の特徴だけ述べてベネフィットに変換していない。相手の問題との接続なし
D(0-20): プレゼンがほぼ行われていない

【減点指標】ヒアリングで出た問題を完全に無視した提案は-10点

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## カテゴリ4: クロージング（決断促進）

【行動チェックリスト】
□ T1-言い切り訴求: 「。」で言い切って提案（「始めるべきです。」）。NGワード不使用
□ T2-過半数: 「みなさん」等の社会的証明を力強く提示
□ T3-一貫性通し: アプローチの先回り（事前告知）と最後の提案が矛盾なく対応
□ T4-カギカッコ: お客様の声をそのまま引用（「『もっと早くやればよかった』とおっしゃる方が多いです」）
□ T5-ポジティブクロージング: SP→ベネフィット→「もし〜なら気分は？」→3倍リアクション→訴求
□ T6-ネガティブクロージング: 敬意＋逆SP→逆ベネフィットで損失回避心理を活用
□ T7-技術組合せ: カギカッコ＋一貫性＋過半数等の複数技術の連携

【行動アンカー】
S(81-100): T1言い切り＋T2/T3/T4の基本3技術を組み合わせ＋T5又はT6で感情を動かしている。NGワード完全排除
A(61-80): T1言い切り＋T2/T3/T4のうち2つを実行。基本の型に沿えている
B(41-60): 提案はしているがT1の言い切りが弱い。T2-T4のうち1つを部分的に実行
C(21-40): 提案が曖昧。「いかがでしょうか」「ご検討ください」等の弱いクロージング
D(0-20): 明確な提案・訴求がない。会話が自然消滅

【NGワード検出】以下の使用は即-10点: 「どうされますか？」「思います」「嬉しいです」「幸いです」「いかがでしょうか」

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## カテゴリ5: 反論処理・切り返し（行動促進）

【行動チェックリスト】
□ T1-共感: 「そうですよね」等の自然な共感（納得はしない）
□ T2-感謝: 「真剣に考えていただいてありがとうございます」
□ T3-フック: 「商品自体は良いと思っていますよね？」で小さなYESを獲得
□ T4-AREA話法: 主張(A)→理由(R)→具体例(E)→再主張(A)の論理構成
□ T5-目的振返り: 「今日の目的を思い出しましょう」で本来の目的に立ち返らせる
□ T6-第三者アタック: 天国/地獄エピソードを敬意を持って提示
□ T7-すり替え: 外（肯定）→内（恥）への論点変換＋褒めで補正
□ T8-価値上乗せ: 「高い」に対して驚き→謝罪→SP3連発で価値を積む
□ T9-切返し回数: 1回の反論に対して諦めず3回以上切り返している

【行動アンカー】
S(81-100): T1-T3の基本型＋T4のAREA話法を正確に実行＋T5-T8の応用技法から2つ以上を場面に合わせて使用。T9で3回以上粘っている
A(61-80): T1-T3の基本型＋T4のAREA話法を実行。応用技法は1つ程度
B(41-60): 共感(T1)はできているがT3フックやT4 AREAが不完全。論理的な切り返しになっていない
C(21-40): 反論に対して「そうですか…」と受け入れてしまう。切り返しの意志はあるが型がない
D(0-20): 反論に対して「わかりました」と即座に引き下がる。又は反論場面自体がない

【加点指標】切り返し3回以上で+5点。5回以上で+10点（成約率80%の根拠）

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## overall（総合スコア）の算出
overall = (アプローチ + ヒアリング + プレゼン + クロージング + 反論処理) ÷ 5
※ 小数点以下は四捨五入。加点・減点適用後の各カテゴリスコアは0-100の範囲にクランプ

## 厳格採点ルール
- 「なんとなくできている」はBを超えない。型の正確な実行がA以上の条件
- 会話が短い（5ターン以下）場合、実行機会がなかったカテゴリは最大30点
- テクニック名を知っているだけでは加点しない。会話内で実際に実行された行動のみ評価
- 各カテゴリのfeedbackでは「検出したテクニック」と「次回実践すべき具体的アクション」を必ず含める
- improvementsは「次のロープレで〜と言ってみてください」のように即実践可能な形で書く

## 出力形式
まず <reasoning> タグ内で、カテゴリごとに以下を記述：
- 検出テクニック: T1,T3等（チェックリスト番号）
- 該当レベル: S/A/B/C/D
- 加減点: あれば理由と点数
- 最終スコア: 点数

その後、以下のJSON形式のみを出力してください。

<reasoning>
（ここに各カテゴリの詳細分析を記述）
</reasoning>

{
  "overall": 0-100の総合スコア,
  "categories": [
    {"name": "アプローチ", "score": 0-100, "feedback": "具体的なフィードバック"},
    {"name": "ヒアリング", "score": 0-100, "feedback": "具体的なフィードバック"},
    {"name": "プレゼン", "score": 0-100, "feedback": "具体的なフィードバック"},
    {"name": "クロージング", "score": 0-100, "feedback": "具体的なフィードバック"},
    {"name": "反論処理", "score": 0-100, "feedback": "具体的なフィードバック"}
  ],
  "summary": "200文字程度の総評",
  "strengths": ["良かった点1", "良かった点2", "良かった点3"],
  "improvements": ["改善点1", "改善点2", "改善点3"]
}`;

const customerTypeLabels: Record<string, string> = {
  individual: "個人のお客さん",
  owner: "会社オーナー・社長",
  manager: "部長・課長クラス",
  staff: "担当者・一般社員",
};

const sceneLabels: Record<string, string> = {
  phone: "電話営業",
  visit: "訪問営業",
  inbound: "問い合わせ対応",
};

export function generateFallbackScore(): ScoreResult {
  return {
    overall: 55,
    categories: [
      {
        name: "アプローチ",
        score: 60,
        feedback:
          "会話の入り方は自然でしたが、ゴール共有（事前に合意を取る）のテクニックを意識するとさらに良くなります。",
      },
      {
        name: "ヒアリング",
        score: 50,
        feedback:
          "お客さんの状況を聞く姿勢はありましたが、表面的な問題を本質的な課題に掘り下げる質問力を磨きましょう。",
      },
      {
        name: "プレゼン",
        score: 55,
        feedback:
          "商品説明はできていますが、セールスポイント→「だから」→ベネフィットの変換を意識しましょう。",
      },
      {
        name: "クロージング",
        score: 50,
        feedback:
          "自信を持って提案を言い切る力を高めましょう。「どうされますか？」はNGワードです。",
      },
      {
        name: "反論処理",
        score: 45,
        feedback:
          "お客さんの「考えます」に対する切り返しの型（共感→確認→根拠提示→行動促進）を練習しましょう。",
      },
    ],
    summary:
      "基本的な会話力はありますが、成約メソッドの「型」をより意識的に使うことで成約率が大幅に上がります。特に「ゴール共有」「提案の言い切り」「切り返しの型」を重点的に練習しましょう。",
    strengths: [
      "自然な会話の入り方ができている",
      "お客さんの話を聞く姿勢がある",
      "商品への知識がある",
    ],
    improvements: [
      "ゴール共有のテクニックを使って事前に合意を取る練習をする",
      "クロージングで自信を持って提案を言い切る練習をする",
      "反論に対して根拠を論理的に提示して切り返す",
    ],
  };
}

let anthropicClient: Anthropic | null = null;
function getAnthropicClient(): Anthropic | null {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;
  if (!anthropicClient) {
    anthropicClient = new Anthropic({ apiKey });
  }
  return anthropicClient;
}

export async function scoreConversation(input: ScoreInput): Promise<ScoreResult> {
  const { getPersona } = await import("@/lib/personas");
  const { messages, industry, product, difficulty, scene, customerType, productContext, customerContext } = input;
  const persona = getPersona(difficulty);

  const conversationText = messages
    .map(
      (m) =>
        `${m.role === "user" ? "【営業マン】" : "【お客さん】"}: ${m.content}`
    )
    .join("\n\n");

  const client = getAnthropicClient();
  if (!client) {
    return generateFallbackScore();
  }

  const isBusiness = customerType === "owner" || customerType === "manager" || customerType === "staff";
  const isB2B = isBusiness && industry && industry !== customerType;

  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 3000,
    temperature: 0,
    system: SCORING_PROMPT,
    messages: [
      {
        role: "user",
        content: `以下の営業ロープレ会話を採点してください。

【シナリオ情報】
業種: ${industry}
商材: ${product}
お客さんのタイプ: ${persona?.label || difficulty}
お客さんの属性: ${customerTypeLabels[customerType] || "個人"}
営業シーン: ${sceneLabels[scene] || "訪問営業"}
${isB2B ? `取引タイプ: B2B（法人取引）─ 「${product}」を「${industry}」事業者に提案\n※ B2B営業の観点も含めて採点してください（事業課題の把握、ROI訴求、同業他社事例の活用など）` : ""}
${productContext ? `\n【商材の詳細情報】\n${productContext}` : ""}
${customerContext ? `\n【お客さんのペルソナ詳細】\n${customerContext}` : ""}

--- 会話内容 ---
${conversationText}
--- 会話ここまで ---

上記の会話を成約5ステップメソッドで採点し、JSON形式で返してください。`,
      },
    ],
  });

  const text = response.content[0]?.type === "text" ? response.content[0].text : "";

  // <reasoning>タグを除去してからJSONを抽出（CoT内の {} 誤マッチ防止）
  const withoutReasoning = text.replace(/<reasoning>[\s\S]*?<\/reasoning>/g, "");
  const jsonMatch = withoutReasoning.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    const parsed = JSON.parse(jsonMatch[0]) as ScoreResult;
    // overall をサーバー側で確定計算（LLM出力に依存しない）
    if (parsed.categories && parsed.categories.length > 0) {
      parsed.overall = Math.round(
        parsed.categories.reduce((sum, c) => sum + c.score, 0) / parsed.categories.length
      );
    }
    return parsed;
  }

  return generateFallbackScore();
}
