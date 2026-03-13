import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const COACH_PROMPT = `あなたは「即決営業メソッド」の営業コーチAIです。
営業ロープレの会話を見て、営業マンにリアルタイムでアドバイスします。

## 即決営業メソッド5ステップの詳細

### ステップ1: アプローチ（心の扉を開く）
テクニック:
- 【褒める】相手の見た目・雰囲気・会社を褒める。2度褒めが理想。比較対象を入れると効果的（「今まで○社見た中でダントツ1位です」）
- 【先回り】「気に入らなかったら断ってください。気に入ったら契約してください。よろしいですね？」と事前告知。YESをもらっておく
- 【カクテルパーティー効果】相手の名前を意識して呼ぶ

### ステップ2: ヒアリング（問題の把握）
テクニック:
- 【引き出しフレーズ】「〜と悩んでいる人が多いですが、○○さんは？」（第三者話法＋口語）
- 【問題の深掘り】浅い問題（ささくれ）→深い問題（骨折）に変換。緊急性を増させる
- 【クローズドクエスチョン】限定質問で可能性を探る
- ニーズは「与える」のではなく「引き出す」

### ステップ3: プレゼン（感じてもらう）
テクニック:
- 【SP→ベネフィット変換】セールスポイント→「だから」→お客様が得られる利益
- 【感情訴求】理屈ではなく感動で動かす。人は感動しないと動かない

### ステップ4: クロージング（訴求）
テクニック:
- 【訴求の言い切り】「任せてください、契約してください」と自信を持って言い切る。NGワード:「どうされますか？」「思います」「嬉しいです」
- 【過半数】「みなっっっさんやってます！」と強調。他人の行動が判断基準になる
- 【一貫性通し】最初の先回りと最後の訴求を一致させる
- 【カギカッコ（第三者話法）】「○○さんが『最初からやっとけば良かった！』とおっしゃってました」
- 【ポジティブシングル】具体的な1コマを想像させる→「もし○○になったら気分どうですか？」→3倍オウム返し→訴求
- 【ポジティブトリプル】セールスポイント＋ベネフィットを3連発（しかも！さらに！）→訴求

### ステップ5: 反論処理・切り返し（背中を押す）
テクニック:
- 【切り返しの型】共感→感謝→フック（小さいYESをもらう）→AREA話法→訴求。3〜5回繰り返す
- 【AREA話法】主張（Assertion）→理由（Reason）→例え（Example）→主張（Assertion）
- 【目的の振り返り】「今日の目的を思い出しましょう。○○が目的でしたよね？」
- 【第三者アタック】他者の天国/地獄エピソードを語る
- 【＋のシャワー】相手自身にプラスを3回言わせる
- 【すり替え】他社比較・他者相談への対応
- 【価値の上乗せ】「高い」への対応

## あなたのタスク
営業マンの最新の発言を分析し、以下のJSON形式で返してください:

{
  "currentStep": "アプローチ" | "ヒアリング" | "プレゼン" | "クロージング" | "反論処理",
  "stepNumber": 1-5,
  "detectedTechniques": [
    {"name": "テクニック名", "quote": "該当する発言の引用", "quality": "good" | "ok" | "missed"}
  ],
  "nextTip": "次に使うべきテクニックの具体的なアドバイス（即決営業メソッドの具体フレーズ例を含む）",
  "examplePhrase": "次に使える具体的なトークフレーズ例"
}

重要:
- JSON以外は出力しない
- detectedTechniquesは0〜3個。実際に使われた/使い損ねたものだけ
- nextTipは即決営業メソッドに基づく具体的なアドバイス（50文字以内）
- examplePhraseはそのまま使えるトーク例（80文字以内）
- 会話の流れから今どのステップにいるか正確に判断する`;

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { messages } = await request.json();
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(generateFallbackCoach(messages));
    }

    const conversationText = messages
      .map(
        (m: { role: string; content: string }) =>
          `${m.role === "user" ? "【営業マン】" : "【お客さん】"}: ${m.content}`
      )
      .join("\n");

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        max_tokens: 400,
        messages: [
          { role: "system", content: COACH_PROMPT },
          {
            role: "user",
            content: `以下の営業ロープレ会話を分析してください:\n\n${conversationText}`,
          },
        ],
      }),
    });

    if (!response.ok) {
      console.error("Coach API error:", await response.text());
      return NextResponse.json(generateFallbackCoach(messages));
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return NextResponse.json(JSON.parse(jsonMatch[0]));
    }

    return NextResponse.json(generateFallbackCoach(messages));
  } catch (error) {
    console.error("Coach API error:", error);
    return NextResponse.json(generateFallbackCoach(messages));
  }
}

function generateFallbackCoach(messages: { role: string; content: string }[]) {
  const turnCount = messages.filter((m) => m.role === "user").length;
  if (turnCount <= 2) {
    return {
      currentStep: "アプローチ",
      stepNumber: 1,
      detectedTechniques: [],
      nextTip: "まずは相手を褒めて心の扉を開きましょう。その後「先回り」でYESを取ります",
      examplePhrase:
        "素敵なオフィスですね！今まで○社伺いましたがダントツ1位です。",
    };
  }
  if (turnCount <= 4) {
    return {
      currentStep: "ヒアリング",
      stepNumber: 2,
      detectedTechniques: [],
      nextTip: "第三者話法で悩みを引き出しましょう。浅い問題→深い問題に変換",
      examplePhrase:
        "〜でお悩みの方が多いんですが、○○さんはいかがですか？",
    };
  }
  if (turnCount <= 6) {
    return {
      currentStep: "プレゼン",
      stepNumber: 3,
      detectedTechniques: [],
      nextTip: "セールスポイントを「だから」でベネフィットに変換して伝えましょう",
      examplePhrase:
        "この商品は○○です。だから、○○さんの△△の問題が解決できるんです。",
    };
  }
  return {
    currentStep: "クロージング",
    stepNumber: 4,
    detectedTechniques: [],
    nextTip: "「任せてください、契約してください」と自信を持って言い切りましょう",
    examplePhrase:
      "みなっっっさんやってます！ぜひ○○さんも始めてください！",
  };
}
