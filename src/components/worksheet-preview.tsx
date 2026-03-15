"use client";

import { useState } from "react";

const phases = [
  {
    name: "アプローチ",
    description: "信頼構築と心理的安全の確保",
    fields: [
      { label: "顧客の業種", value: "不動産仲介" },
      { label: "商材・サービス", value: "投資用マンション" },
      { label: "顧客の状況", value: "30代後半、年収800万、資産形成に興味あり" },
      { label: "信頼構築のポイント", value: "相手の時間を尊重し、共通話題で距離を縮める" },
    ],
  },
  {
    name: "ヒアリング",
    description: "質問でニーズを引き出し、問題を深掘り",
    fields: [
      { label: "現状把握の質問", value: "現在、資産運用はされていますか？" },
      { label: "ニーズ深掘り", value: "将来的にどのくらいの資産を目指していますか？" },
      { label: "課題の発見", value: "資産形成で一番不安に感じることは？" },
      { label: "優先順位の確認", value: "安全性と収益性、どちらを重視しますか？" },
    ],
  },
  {
    name: "プレゼン",
    description: "特徴ではなくベネフィットで伝える",
    fields: [
      { label: "特徴→ベネフィット変換", value: "駅徒歩5分 → 空室リスク低・安定家賃収入" },
      { label: "数値根拠", value: "入居率98.5%、平均利回り5.2%" },
      { label: "課題への解決策", value: "管理は全て代行。手間なく資産形成が可能" },
    ],
  },
  {
    name: "クロージング",
    description: "社会的証明と段階的訴求",
    fields: [
      { label: "テストクロージング", value: "ここまでのご説明で不明点はありますか？" },
      { label: "社会的証明", value: "同年代で既に3件お持ちの方もいらっしゃいます" },
      { label: "行動促進", value: "今月末までのご契約で初期費用10万円引き" },
    ],
  },
  {
    name: "反論処理",
    description: "共感→確認→根拠→行動促進の4ステップ",
    fields: [
      { label: "1. 共感", value: "大きな決断ですから、慎重になるのは当然です" },
      { label: "2. 確認", value: "具体的にどの点が気になっていますか？" },
      { label: "3. 根拠提示", value: "検討された方の70%が最終的にご購入されています" },
      { label: "4. 行動促進", value: "まずは資料をお持ちになりませんか？" },
    ],
  },
];

export function WorksheetPreview() {
  const [active, setActive] = useState(0);
  const phase = phases[active];

  return (
    <div className="mx-auto max-w-3xl">
      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto pb-1 sm:justify-center">
        {phases.map((p, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setActive(i)}
            className={`flex flex-shrink-0 items-center gap-1.5 rounded-t-lg px-3 py-2.5 text-sm font-semibold transition-colors sm:px-4 ${
              i === active
                ? "bg-accent text-white"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700"
            }`}
          >
            <span
              className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${
                i === active ? "bg-white/20 text-white" : "bg-gray-300/50 text-gray-500"
              }`}
            >
              {i + 1}
            </span>
            <span className="hidden sm:inline">{p.name}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="rounded-b-2xl rounded-tr-2xl border-2 border-accent/20 bg-white p-5 shadow-lg sm:p-8">
        <div className="mb-5">
          <h3 className="text-lg font-bold text-foreground">
            Phase {active + 1}: {phase.name}
          </h3>
          <p className="mt-1 text-sm text-muted">{phase.description}</p>
        </div>
        <div className="space-y-3">
          {phase.fields.map((field, i) => (
            <div key={i}>
              <label className="text-xs font-semibold uppercase tracking-wider text-accent">
                {field.label}
              </label>
              <div className="mt-1 rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-foreground">
                {field.value}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 text-center">
          <a
            href="/worksheet"
            className="inline-flex items-center gap-1 text-sm font-semibold text-accent transition hover:underline"
          >
            ワークシートを使ってみる
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
