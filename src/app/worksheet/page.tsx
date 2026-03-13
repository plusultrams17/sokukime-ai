"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

/* ─── Constants ────────────────────────────────── */

const INDUSTRY_PRESETS = [
  "外壁塗装",
  "生命保険",
  "不動産売買",
  "法人向けSaaS",
  "学習塾",
  "太陽光パネル",
  "リフォーム",
  "人材紹介",
  "自動車販売",
  "美容・ダイエット",
];

type WorksheetTypeId = "needs" | "strengths" | "competitors" | "objections";

const WORKSHEET_TYPES: {
  id: WorksheetTypeId;
  number: string;
  icon: string;
  title: string;
  description: string;
  gridLabel: string;
}[] = [
  {
    id: "needs",
    number: "04",
    icon: "🎯",
    title: "引き出しシート（限定質問）",
    description: "お客さんのニーズ・お悩みを把握できているか",
    gridLabel: "ニーズ（お悩み・問題）",
  },
  {
    id: "strengths",
    number: "02",
    icon: "💪",
    title: "自社分析シート",
    description: "自社の強み・特徴を言語化できているか",
    gridLabel: "自社の強み・特徴",
  },
  {
    id: "competitors",
    number: "03",
    icon: "⚔️",
    title: "競合比較シート",
    description: "競合との違い・比較ポイントを把握しているか",
    gridLabel: "お客さんの比較ポイント",
  },
  {
    id: "objections",
    number: "05",
    icon: "🛡️",
    title: "反論処理シート",
    description: "よくある断り文句を事前に把握しているか",
    gridLabel: "よくある反論・断り文句",
  },
];

/* ─── Types ────────────────────────────────────── */

interface AiResult {
  phraseKeyword: string;
  items: string[];
}

/* ─── Component ────────────────────────────────── */

export default function WorksheetPage() {
  const [industry, setIndustry] = useState("");
  const [wsType, setWsType] = useState<WorksheetTypeId | null>(null);
  const [mode, setMode] = useState<"self" | "ai" | null>(null);
  const [grid, setGrid] = useState<string[]>(Array(12).fill(""));
  const [phraseKeyword, setPhraseKeyword] = useState("");
  const [aiResult, setAiResult] = useState<AiResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showComparison, setShowComparison] = useState(false);

  const filledCount = grid.filter((v) => v.trim()).length;
  const currentWs = WORKSHEET_TYPES.find((w) => w.id === wsType);

  /* ─── Handlers ─────────────────────────────── */

  const handleGenerate = useCallback(async () => {
    if (!industry.trim() || !wsType) return;
    setIsGenerating(true);
    try {
      const res = await fetch("/api/worksheet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ industry: industry.trim(), type: wsType }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        if (res.status === 401) {
          alert("ログインが必要です。ログイン後にもう一度お試しください。");
          return;
        }
        throw new Error(err.error || "API error");
      }
      const data: AiResult = await res.json();
      setAiResult(data);

      if (mode === "ai") {
        setGrid(
          data.items
            .slice(0, 12)
            .concat(Array(12).fill(""))
            .slice(0, 12),
        );
        if (data.phraseKeyword) setPhraseKeyword(data.phraseKeyword);
      } else {
        setShowComparison(true);
      }
    } catch {
      alert("生成に失敗しました。もう一度お試しください。");
    } finally {
      setIsGenerating(false);
    }
  }, [industry, wsType, mode]);

  const handleReset = () => {
    setGrid(Array(12).fill(""));
    setPhraseKeyword("");
    setAiResult(null);
    setShowComparison(false);
  };

  const handleModeSelect = (m: "self" | "ai") => {
    setMode(m);
    handleReset();
  };

  const handleTypeSelect = (id: WorksheetTypeId) => {
    setWsType(id);
    setMode(null);
    handleReset();
  };

  const getGrade = () => {
    if (filledCount >= 11) return { grade: "S", color: "text-green-400", msg: "素晴らしい！お客さんの状況を深く理解できています。この知識をロープレで活かしましょう。" };
    if (filledCount >= 9) return { grade: "A", color: "text-green-400", msg: "高い理解度です。AIの提案も参考に、さらに知識を深めましょう。" };
    if (filledCount >= 6) return { grade: "B", color: "text-yellow-400", msg: "基本は把握できています。空欄の部分はAIの提案を参考に学びましょう。" };
    if (filledCount >= 3) return { grade: "C", color: "text-orange-400", msg: "まだ理解が浅い状態です。AIの提案を参考に、もっとリサーチしましょう。" };
    return { grade: "D", color: "text-red-400", msg: "業界・商材のリサーチが必要です。AIの提案をヒントに知識をインプットしましょう。" };
  };

  /* ─── Render ───────────────────────────────── */

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Title */}
      <section className="px-6 pt-32 pb-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-3 inline-block rounded-full bg-accent/10 px-4 py-1 text-xs font-bold text-accent">
            営業準備ツール
          </div>
          <h1 className="mb-3 text-3xl font-bold">営業準備ワークシート</h1>
          <p className="text-sm text-muted leading-relaxed">
            営業に必要な知識をどれだけインプットできていますか？
            <br />
            業界理解・自社理解を自己チェックしましょう。
          </p>
        </div>
      </section>

      {/* Industry Input */}
      <section className="px-6 pb-6">
        <div className="mx-auto max-w-3xl">
          <label className="mb-2 block text-sm font-bold">
            1. 商材・業種を入力
          </label>
          <input
            type="text"
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            placeholder="例: 外壁塗装、生命保険、SaaSツール..."
            className="w-full rounded-xl border border-card-border bg-card px-4 py-3 text-sm outline-none transition focus:border-accent"
          />
          <div className="mt-3 flex flex-wrap gap-2">
            {INDUSTRY_PRESETS.map((p) => (
              <button
                key={p}
                onClick={() => setIndustry(p)}
                className={`rounded-full border px-3 py-1 text-xs transition ${
                  industry === p
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-card-border text-muted hover:border-accent hover:text-foreground"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Worksheet Type */}
      {industry.trim() && (
        <section className="px-6 pb-6">
          <div className="mx-auto max-w-3xl">
            <label className="mb-3 block text-sm font-bold">
              2. ワークシートを選択
            </label>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {WORKSHEET_TYPES.map((w) => (
                <button
                  key={w.id}
                  onClick={() => handleTypeSelect(w.id)}
                  className={`rounded-xl border p-4 text-left transition ${
                    wsType === w.id
                      ? "border-accent bg-accent/5"
                      : "border-card-border bg-card hover:border-accent/50"
                  }`}
                >
                  <div className="text-2xl mb-2">{w.icon}</div>
                  <div className="text-xs font-bold leading-tight">
                    {w.title}
                  </div>
                  <p className="mt-1 text-[10px] text-muted leading-tight">
                    {w.description}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Mode Selection */}
      {wsType && (
        <section className="px-6 pb-8">
          <div className="mx-auto max-w-3xl">
            <label className="mb-3 block text-sm font-bold">
              3. モードを選択
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleModeSelect("self")}
                className={`rounded-xl border p-5 text-left transition ${
                  mode === "self"
                    ? "border-accent bg-accent/5"
                    : "border-card-border bg-card hover:border-accent/50"
                }`}
              >
                <div className="text-lg font-bold mb-1">✍️ 自分で記入</div>
                <p className="text-xs text-muted">
                  知識チェック。自分の理解度を確認してからAIと答え合わせ。
                </p>
              </button>
              <button
                onClick={() => handleModeSelect("ai")}
                className={`rounded-xl border p-5 text-left transition ${
                  mode === "ai"
                    ? "border-accent bg-accent/5"
                    : "border-card-border bg-card hover:border-accent/50"
                }`}
              >
                <div className="text-lg font-bold mb-1">🤖 AIに依頼</div>
                <p className="text-xs text-muted">
                  AIが業界知識を自動生成。リサーチ・学習のベースに。
                </p>
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Worksheet Grid */}
      {mode && currentWs && (
        <section className="px-6 pb-8">
          <div className="mx-auto max-w-3xl">
            {/* Template Header */}
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{currentWs.icon}</span>
                <div>
                  <div className="text-sm font-bold">{currentWs.title}</div>
                  <div className="text-[10px] text-muted">
                    即決営業テンプレート {currentWs.number}
                  </div>
                </div>
              </div>
              <div className="rounded-full bg-accent/10 px-3 py-1 text-xs font-bold text-accent">
                {industry}
              </div>
            </div>

            {/* Phrase Template (needs type only) */}
            {wsType === "needs" && (
              <div className="mb-6 rounded-xl border border-card-border bg-card p-5">
                <div className="mb-2 text-xs font-bold text-accent">
                  引き出しフレーズ
                </div>
                <div className="flex flex-wrap items-center gap-1 text-sm">
                  <span className="text-muted">「</span>
                  {mode === "self" ? (
                    <input
                      value={phraseKeyword}
                      onChange={(e) => setPhraseKeyword(e.target.value)}
                      placeholder="キーワード"
                      className="w-32 border-b border-accent/30 bg-transparent px-1 py-0.5 text-center text-accent outline-none transition focus:border-accent"
                    />
                  ) : (
                    <span className="min-w-[80px] border-b border-accent/30 px-2 py-0.5 text-center text-accent">
                      {phraseKeyword || "___"}
                    </span>
                  )}
                  <span className="text-muted">
                    で悩んでいる人が多いですが、
                  </span>
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-1 text-sm">
                  <span className="text-muted">○○さんは</span>
                  <span className="min-w-[80px] border-b border-card-border px-2 py-0.5 text-center text-muted">
                    {phraseKeyword || "___"}
                  </span>
                  <span className="text-muted">
                    でのお悩みなどはないですか？」
                  </span>
                </div>
              </div>
            )}

            {/* Grid */}
            <div className="mb-4">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-bold">{currentWs.gridLabel}</h2>
                {mode === "self" && (
                  <span className="text-xs text-muted">
                    {filledCount}/12 記入済み
                  </span>
                )}
              </div>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
                {grid.map((value, i) => (
                  <div key={i}>
                    {mode === "self" ? (
                      <input
                        value={value}
                        onChange={(e) => {
                          const next = [...grid];
                          next[i] = e.target.value;
                          setGrid(next);
                        }}
                        placeholder={`${i + 1}`}
                        className="w-full rounded-lg border border-card-border bg-card px-3 py-3 text-sm outline-none transition focus:border-accent placeholder:text-muted/30"
                      />
                    ) : (
                      <div className="min-h-[44px] rounded-lg border border-card-border bg-card px-3 py-3 text-sm">
                        {value || (
                          <span className="text-muted/30">{i + 1}</span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3">
              {mode === "self" && !showComparison && (
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating || filledCount === 0}
                  className="inline-flex h-11 items-center justify-center rounded-xl bg-accent px-6 font-bold text-white transition hover:bg-accent-hover disabled:opacity-50"
                >
                  {isGenerating ? (
                    <>
                      <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      分析中...
                    </>
                  ) : (
                    "AIと答え合わせ"
                  )}
                </button>
              )}
              {mode === "ai" && !aiResult && (
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="inline-flex h-11 items-center justify-center rounded-xl bg-accent px-6 font-bold text-white transition hover:bg-accent-hover disabled:opacity-50"
                >
                  {isGenerating ? (
                    <>
                      <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      生成中...
                    </>
                  ) : (
                    "AIで生成する"
                  )}
                </button>
              )}
              {(filledCount > 0 || aiResult) && (
                <button
                  onClick={handleReset}
                  className="inline-flex h-11 items-center justify-center rounded-xl border border-card-border px-6 text-sm text-muted transition hover:border-accent hover:text-foreground"
                >
                  リセット
                </button>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Comparison Result (self mode) */}
      {showComparison && aiResult && (
        <section className="px-6 pb-8">
          <div className="mx-auto max-w-3xl">
            <div className="rounded-2xl border border-accent/30 bg-accent/5 p-6">
              <h3 className="mb-5 text-lg font-bold">知識チェック結果</h3>

              {/* Score */}
              <div className="mb-6 grid grid-cols-3 gap-4 text-center">
                <div className="rounded-xl bg-background/50 p-4">
                  <div className="text-3xl font-black text-accent">
                    {filledCount}
                    <span className="text-base font-normal text-muted">
                      /12
                    </span>
                  </div>
                  <div className="mt-1 text-xs text-muted">記入数</div>
                </div>
                <div className="rounded-xl bg-background/50 p-4">
                  <div className={`text-3xl font-black ${getGrade().color}`}>
                    {getGrade().grade}
                  </div>
                  <div className="mt-1 text-xs text-muted">理解度</div>
                </div>
                <div className="rounded-xl bg-background/50 p-4">
                  <div className="text-3xl font-black text-accent">
                    {Math.round((filledCount / 12) * 100)}
                    <span className="text-base font-normal text-muted">%</span>
                  </div>
                  <div className="mt-1 text-xs text-muted">カバー率</div>
                </div>
              </div>

              {/* Feedback */}
              <p className="mb-6 rounded-lg bg-background/50 p-4 text-sm text-muted leading-relaxed">
                {getGrade().msg}
              </p>

              {/* AI phrase keyword */}
              {wsType === "needs" && aiResult.phraseKeyword && (
                <div className="mb-4">
                  <div className="mb-2 text-xs font-bold text-accent">
                    AIの提案キーワード
                  </div>
                  <div className="rounded-lg bg-background/50 px-4 py-2 text-sm">
                    「
                    <span className="font-bold text-accent">
                      {aiResult.phraseKeyword}
                    </span>
                    で悩んでいる人が多いですが...」
                  </div>
                </div>
              )}

              {/* AI items */}
              <div>
                <div className="mb-3 text-xs font-bold text-accent">
                  AIの提案する{currentWs?.gridLabel}：
                </div>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
                  {aiResult.items.map((item, i) => {
                    const userHas = grid.some(
                      (g) =>
                        g.trim() &&
                        (g.includes(item) ||
                          item.includes(g) ||
                          g.trim() === item.trim()),
                    );
                    return (
                      <div
                        key={i}
                        className={`rounded-lg border px-3 py-2 text-sm ${
                          userHas
                            ? "border-green-500/30 bg-green-500/10 text-green-400"
                            : "border-card-border bg-background/50"
                        }`}
                      >
                        {userHas && (
                          <span className="mr-1 text-green-400">✓</span>
                        )}
                        {item}
                      </div>
                    );
                  })}
                </div>
                <p className="mt-3 text-[11px] text-muted">
                  ✓ はあなたの回答と一致・類似した項目です
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="border-t border-card-border px-6 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-3 text-xl font-bold">
            準備ができたら、ロープレで実践しよう
          </h2>
          <p className="mb-6 text-sm text-muted">
            ワークシートで整理した知識をAIロープレで実践練習
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/roleplay"
              className="inline-flex h-12 items-center justify-center rounded-xl bg-accent px-8 font-bold text-white transition hover:bg-accent-hover"
            >
              ロープレを始める
            </Link>
            <Link
              href="/features"
              className="inline-flex h-12 items-center justify-center rounded-xl border border-card-border px-8 text-sm font-medium text-muted transition hover:border-accent hover:text-foreground"
            >
              他の機能を見る
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
