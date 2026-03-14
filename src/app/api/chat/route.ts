import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `あなたは営業ロープレ用の「お客さん役」AIです。
ユーザーが営業マンとして商談の練習をしています。以下のルールに従ってリアルなお客さんを演じてください。

## あなたの役割
- 業種や商材に合わせた、リアルなお客さんとして自然に会話する
- お客さんの名前、会社名、状況は自然に設定してください
- 最初の発言でシチュエーションを自然に始めてください（電話を取る、来客を迎える等）

## 難易度別の振る舞い
- easy（素直）: 比較的前向き。質問には素直に答える。ただし最後は少し迷う
- normal（慎重）: 「考えます」「主人/上に相談します」と言いがち。即決を避けようとする
- hard（手強い）: 「今は必要ない」「他社と比較したい」「高い」など反論が多い。簡単には落ちない

## 会話のリアルさ
- 一般的な顧客の心理を再現する：最初は警戒、徐々に関心、悩み、決断という流れ
- 営業マンの「前提設定」「褒め」がうまければ心を開く
- ヒアリングで深い問題を引き出されたら、本音を話し始める
- クロージングで提案されたら、悩む様子を見せる
- 自然な長さで返答する（長すぎず短すぎず、2-4文程度）

## 重要
- あなたは「お客さん」です。営業のアドバイスは絶対にしないでください
- 営業メソッドの解説はしないでください
- 自然な会話として返答してください
- 日本語の口語体で話してください`;

export async function POST(request: NextRequest) {
  try {
    const { messages, industry, product, difficulty, scene, customerType, isFirstMessage } =
      await request.json();

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { message: getDefaultFirstMessage(industry, product) },
        { status: 200 }
      );
    }

    const difficultyMap: Record<string, string> = {
      easy: "素直なお客さん（比較的前向き）",
      normal: "慎重なお客さん（即決を避けたがる）",
      hard: "手強いお客さん（反論が多い）",
    };

    const sceneMap: Record<string, string> = {
      phone: "電話での商談（営業マンが電話をかけてきた）",
      visit: "訪問営業（営業マンが自分の会社/自宅に来た）",
      inbound: "問い合わせ対応（自分から問い合わせた）",
    };

    const customerTypeMap: Record<string, string> = {
      individual: "個人のお客さん（一般消費者）",
      owner: "会社オーナー・社長",
      manager: "部長・課長クラスの決裁者",
      staff: "担当者・一般社員（上に確認が必要）",
    };

    const isBusiness = customerType === "owner" || customerType === "manager" || customerType === "staff";
    const hasCustomIndustry = industry && industry !== customerType;
    const isB2B = isBusiness && hasCustomIndustry;

    const b2bContext = isB2B ? `
## 重要：B2B（法人対法人）シナリオ
- あなたは「${industry}」の事業を運営しているプロの経営者・担当者です
- 営業マンは「${product}」をあなたの事業向けに提案しています
- あなたは「個人として商品を買う」のではなく、「自分の事業のために導入を検討」しています
- あなたの関心事：コスト削減、品質向上、納期、アフターサポート、取引実績、自社ビジネスへのインパクト
- 業界のプロとして専門的な質問をしてください（素人ではありません）
- 「うちの事業に合うか」「利益が出るか」「他社製品と比べてどうか」が判断基準です` : "";

    const systemContent = `${SYSTEM_PROMPT}
${b2bContext}

## 今回のシナリオ
- お客さんの属性: ${customerTypeMap[customerType] || "個人のお客さん"}
- お客さんの業種/背景: ${industry || "一般的な顧客"}
- 営業シーン: ${sceneMap[scene] || sceneMap.visit}
- 営業マンの商材: ${product}
- 難易度: ${difficultyMap[difficulty] || difficultyMap.normal}
${isB2B ? `- 取引タイプ: B2B（法人取引）─ 営業マンの「${product}」を、あなたの「${industry}」事業に導入するかの商談` : `- 取引タイプ: B2C（個人取引）─ 営業マンの「${product}」を個人のお客さんに提案`}
${isFirstMessage ? `\nまずはお客さんとして最初の場面を始めてください。営業シーンは「${sceneMap[scene] || "訪問"}」です。そのシーンに合った自然な第一声をしてください。${isB2B ? `あなたは「${industry}」の事業者として、業界のプロの立場で対応してください。` : ""}` : ""}`;

    const openaiMessages = [
      { role: "system", content: systemContent },
      ...(isFirstMessage
        ? [
            {
              role: "user" as const,
              content:
                "ロープレを開始してください。お客さん役として最初の発言をしてください。",
            },
          ]
        : messages.map((m: { role: string; content: string }) => ({
            role: m.role === "assistant" ? ("assistant" as const) : ("user" as const),
            content: m.content,
          }))),
    ];

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        max_tokens: 300,
        messages: openaiMessages,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("OpenAI API error:", errText);
      return NextResponse.json(
        { message: getDefaultFirstMessage(industry, product) },
        { status: 200 }
      );
    }

    const data = await response.json();
    const assistantMessage =
      data.choices?.[0]?.message?.content ||
      getDefaultFirstMessage(industry, product);

    return NextResponse.json({ message: assistantMessage });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { message: "すみません、少々お待ちください...（通信エラー）" },
      { status: 200 }
    );
  }
}

function getDefaultFirstMessage(industry: string, product: string): string {
  return `はい、お電話ありがとうございます。${industry}の田中と申します。本日はどのようなご用件でしょうか？あ、${product}の件ですか。ちょうど今、いろいろ検討しているところなんですが...`;
}
