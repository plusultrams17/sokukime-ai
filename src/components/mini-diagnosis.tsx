"use client";

import { useState } from "react";
import Link from "next/link";

const QUESTION = {
  text: "お客さんに「考えます」と言われたら、あなたはどうしますか？",
  choices: [
    { label: "「わかりました」と引き下がる", type: "withdraw" },
    { label: "もう一度メリットを説明する", type: "repeat" },
    { label: "何について考えたいか確認する", type: "confirm" },
    { label: "期限を切って決断を促す", type: "pressure" },
  ],
  results: {
    withdraw: {
      title: "受容型",
      message: "お客さんの気持ちに寄り添えるタイプ。ただ、引き下がるだけでは成約につながりにくい場面も。切り返しの「型」を身につけると、成約率の向上が期待できます。",
    },
    repeat: {
      title: "押し込み型",
      message: "熱意は伝わりますが、お客さんが聞きたいのは「自分の課題が解決するか」。ヒアリング力を磨くと、提案の刺さり方が変わります。",
    },
    confirm: {
      title: "深掘り型",
      message: "お客さんの本音を引き出���力があります。この力をさらに磨けば、反論処理のプロになれるポテンシャルがあります。",
    },
    pressure: {
      title: "クロージング重視型",
      message: "決断を後押しする力がありますが、信頼構築が不十分だと逆効果になることも。アプローチとヒアリングの精度を上げるとバランスが取れます。",
    },
  } as Record<string, { title: string; message: string }>,
};

export function MiniDiagnosis() {
  const [selected, setSelected] = useState<string | null>(null);

  if (selected) {
    const result = QUESTION.results[selected];
    return (
      <section className="border-t border-card-border bg-gradient-to-b from-background to-white py-12 sm:py-16">
        <div className="mx-auto max-w-lg px-4 sm:px-6 text-center">
          <div className="mb-6 rounded-2xl border border-accent/30 bg-card p-6">
            <div className="mb-2 text-xs font-bold uppercase tracking-wider text-accent">あなたのタイプ</div>
            <div className="mb-3 text-xl font-bold text-foreground">{result.title}</div>
            <p className="text-sm text-muted leading-relaxed">{result.message}</p>
          </div>
          <Link
            href="/diagnose"
            className="lp-cta-btn inline-flex"
          >
            5問の本格診断で詳しく分析する（無料）
          </Link>
          <p className="mt-3 text-xs text-muted">30秒で完了・登録不要</p>
        </div>
      </section>
    );
  }

  return (
    <section className="border-t border-card-border bg-gradient-to-b from-background to-white py-12 sm:py-16">
      <div className="mx-auto max-w-lg px-4 sm:px-6">
        <p className="mb-2 text-center text-xs font-bold uppercase tracking-wider text-accent">
          1問でわかる営業タイプ
        </p>
        <p className="mb-6 text-center text-lg font-bold text-foreground sm:text-xl">
          {QUESTION.text}
        </p>
        <div className="space-y-3">
          {QUESTION.choices.map((choice) => (
            <button
              key={choice.type}
              onClick={() => setSelected(choice.type)}
              className="w-full rounded-xl border border-card-border bg-card px-5 py-4 text-left text-sm font-medium text-foreground transition hover:border-accent hover:bg-accent/5"
            >
              {choice.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
