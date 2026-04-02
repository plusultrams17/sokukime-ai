import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getPersona } from "@/lib/personas";
import { checkRateLimit } from "@/lib/rate-limit";

const COACH_PROMPT = `あなたは「成約5ステップメソッド」の営業コーチAIです。
営業ロープレの会話を見て、営業マンにリアルタイムでアドバイスします。

## 成約5ステップメソッドの詳細

### ステップ1: アプローチ（信頼構築）
テクニック:
- 【褒める】相手の見た目・雰囲気・会社を褒める。比較対象を入れると効果的（「今まで○社見た中でダントツ1位です」）
- 【ゴール共有】「気に入らなかったらお断りいただいて構いません。気に入ったらぜひご検討ください。よろしいですね？」と事前に合意を取る
- 【ラポール形成】相手の名前を意識して呼び、心理的安全を確保する

### ステップ2: ヒアリング（問題の把握）
テクニック:
- 【第三者話法】「〜と悩んでいる方が多いですが、○○さんは？」（第三者の事例で切り出す）
- 【問題の深掘り】表面的な問題→本質的な課題に変換。緊急性を増させる
- 【クローズドクエスチョン】限定質問で可能性を探る
- ニーズは「与える」のではなく「引き出す」

### ステップ3: プレゼン（価値伝達）
テクニック:
- 【SP→ベネフィット変換】セールスポイント→「だから」→お客様が得られる利益
- 【価値訴求】特徴ではなく価値（ベネフィット）で伝える。人は感情で動く

### ステップ4: クロージング（決断促進）
テクニック:
- 【提案の言い切り】「任せてください、ぜひご契約ください」と自信を持って言い切る。NGワード:「どうされますか？」「思います」「嬉しいです」
- 【社会的証明】「多くの方がご利用いただいています」と他のお客様の事例を活用
- 【一貫性の活用】最初のゴール共有と最後の提案を一致させる
- 【お客様の声】「○○さんが『もっと早くやれば良かった』とおっしゃっていました」
- 【段階的訴求】具体的なメリットを段階的に積み上げて提案する

### ステップ5: 反論処理・切り返し（行動促進）
テクニック:
- 【切り返しの型】共感→感謝→確認（小さいYESをもらう）→根拠提示→行動促進。3〜5回繰り返す
- 【論理的根拠提示】主張（Assertion）→理由（Reason）→具体例（Example）→主張（Assertion）
- 【目的の振り返り】「今日の目的を思い出しましょう。○○が目的でしたよね？」
- 【事例引用】他のお客様の成功事例・失敗事例を語る
- 【価値の再提示】「高い」への対応

## あなたのタスク
営業マンの最新の発言を分析し、以下のJSON形式で返してください:

{
  "currentStep": "アプローチ" | "ヒアリング" | "プレゼン" | "クロージング" | "反論処理",
  "stepNumber": 1-5,
  "detectedTechniques": [
    {"name": "テクニック名", "quote": "該当する発言の引用", "quality": "good" | "ok" | "missed"}
  ],
  "nextTip": "次に使うべきテクニックの具体的なアドバイス（具体フレーズ例を含む）",
  "examplePhrase": "次に使える具体的なトークフレーズ例"
}

重要:
- JSON以外は出力しない
- detectedTechniquesは0〜3個。実際に使われた/使い損ねたものだけ
- nextTipは成約メソッドに基づく具体的なアドバイス（50文字以内）
- examplePhraseはそのまま使えるトーク例（80文字以内）
- 会話の流れから今どのステップにいるか正確に判断する`;

export async function POST(request: NextRequest) {
  // Auth check: require logged-in user to prevent API abuse
  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json(generateFallbackCoach([]));
  }
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rl = checkRateLimit(`coach:${user.id}`, 10);
  if (!rl.success) {
    return NextResponse.json(
      { error: "リクエストが多すぎます。しばらくお待ちください。" },
      { status: 429, headers: { "Retry-After": String(Math.ceil(rl.resetMs / 1000)) } }
    );
  }

  const { messages, industry, product, customerType, scene, difficulty, productContext, customerContext } = await request.json();
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(generateFallbackCoach(messages));
    }

    const persona = getPersona(difficulty);

    const conversationText = messages
      .map(
        (m: { role: string; content: string }) =>
          `${m.role === "user" ? "【営業マン】" : "【お客さん】"}: ${m.content}`
      )
      .join("\n");

    const isBusiness = customerType === "owner" || customerType === "manager" || customerType === "staff";
    const isB2B = isBusiness && industry && industry !== customerType;

    const personaHint = persona ? `- お客さんのタイプ: ${persona.label}（${persona.description}）\n- このタイプで鍛えるスキル: ${persona.testedSkills.join("、")}\n※ このタイプのお客さんに効果的なテクニックを中心にアドバイスしてください` : "";

    const scenarioContext = `【シナリオ情報】
- お客さんの業種: ${industry || "一般"}
- 営業マンの商材: ${product || "不明"}
- 営業シーン: ${scene || "訪問"}
${personaHint ? `${personaHint}\n` : ""}${isB2B ? `- 取引タイプ: B2B（法人取引）\n※ B2B営業では「同業他社の導入事例」「コスト削減効果」「事業へのインパクト」の訴求が特に有効です` : ""}
${productContext ? `\n【商材の詳細情報】\n${productContext}` : ""}
${customerContext ? `\n【お客さんのペルソナ詳細】\n${customerContext}` : ""}`;

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
            content: `${scenarioContext}\n\n以下の営業ロープレ会話を分析してください:\n\n${conversationText}`,
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
      nextTip: "まずは相手を褒めて信頼を構築しましょう。その後「ゴール共有」で合意を取ります",
      examplePhrase:
        "素敵なオフィスですね！今まで○社伺いましたがダントツ1位です。",
    };
  }
  if (turnCount <= 4) {
    return {
      currentStep: "ヒアリング",
      stepNumber: 2,
      detectedTechniques: [],
      nextTip: "第三者話法で悩みを引き出しましょう。表面的な問題→本質的な課題に変換",
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
    nextTip: "自信を持って「ぜひご契約ください」と言い切りましょう",
    examplePhrase:
      "多くの方にご利用いただいています！ぜひ○○さんも始めてください！",
  };
}
