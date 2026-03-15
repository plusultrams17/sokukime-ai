"use client";

import { useState, useCallback } from "react";
import Link from "next/link";

interface SellingPoint {
  title: string;
  phrase: string;
  psychology: string;
}

interface CompetitorAnalysis {
  positioning: string;
  differentiators: string[];
  counterPhrase: string;
}

interface ClosingScript {
  situation: string;
  script: string;
  step: string;
}

interface AnalysisResult {
  productSummary: string;
  sellingPoints: SellingPoint[];
  competitorAnalysis: CompetitorAnalysis;
  closingScripts: ClosingScript[];
}

const STEP_COLORS: Record<string, string> = {
  "アプローチ": "#0F6E56",
  "ヒアリング": "#0F6E56",
  "プレゼン": "#0F6E56",
  "クロージング": "#2563EB",
  "反論処理": "#7C3AED",
};

export function SalesAnalyzer() {
  const [mode, setMode] = useState<"url" | "manual">("url");
  const [url, setUrl] = useState("");
  const [productName, setProductName] = useState("");
  const [industry, setIndustry] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleAnalyze = useCallback(async () => {
    setError("");
    setResult(null);
    setLoading(true);

    try {
      const body =
        mode === "url"
          ? { url }
          : { productName, industry };

      const res = await fetch("/api/sales-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "分析に失敗しました");
        return;
      }

      setResult(data.analysis);
    } catch {
      setError("通信エラーが発生しました");
    } finally {
      setLoading(false);
    }
  }, [mode, url, productName, industry]);

  const canSubmit =
    mode === "url" ? url.trim().length > 0 : productName.trim().length > 0;

  return (
    <div className="w-full">
      {/* Input Form */}
      {!result && (
        <div className="mx-auto max-w-xl">
          {/* Mode Toggle */}
          <div className="mb-4 flex justify-center gap-1 rounded-xl bg-white/10 p-1 backdrop-blur-sm">
            <button
              type="button"
              onClick={() => setMode("url")}
              className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition ${
                mode === "url"
                  ? "bg-white text-foreground shadow-sm"
                  : "text-white/70 hover:text-white"
              }`}
            >
              URLから分析
            </button>
            <button
              type="button"
              onClick={() => setMode("manual")}
              className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition ${
                mode === "manual"
                  ? "bg-white text-foreground shadow-sm"
                  : "text-white/70 hover:text-white"
              }`}
            >
              商材名を入力
            </button>
          </div>

          {/* URL Input */}
          {mode === "url" && (
            <div className="mb-4">
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://your-product.com"
                className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3.5 text-base text-white placeholder-white/40 outline-none backdrop-blur-sm transition focus:border-accent focus:ring-2 focus:ring-accent/30"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && canSubmit && !loading) handleAnalyze();
                }}
              />
              <p className="mt-2 text-xs text-white/40">
                商材・サービスのWebページURLを入力してください
              </p>
            </div>
          )}

          {/* Manual Input */}
          {mode === "manual" && (
            <div className="mb-4 space-y-3">
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="例: 外壁塗装、法人向けSaaS、生命保険..."
                className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3.5 text-base text-white placeholder-white/40 outline-none backdrop-blur-sm transition focus:border-accent focus:ring-2 focus:ring-accent/30"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && canSubmit && !loading) handleAnalyze();
                }}
              />
              <input
                type="text"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                placeholder="業種（任意）: 不動産、IT、教育..."
                className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3.5 text-base text-white placeholder-white/40 outline-none backdrop-blur-sm transition focus:border-accent focus:ring-2 focus:ring-accent/30"
              />
            </div>
          )}

          {/* Submit Button */}
          <button
            type="button"
            onClick={handleAnalyze}
            disabled={!canSubmit || loading}
            className="flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-accent text-base font-bold text-white shadow-lg transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <>
                <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
                  <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="opacity-75" />
                </svg>
                AIが分析中...（10秒ほどお待ちください）
              </>
            ) : (
              <>
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
                </svg>
                無料で営業武器を作成する
              </>
            )}
          </button>

          {error && (
            <p className="mt-3 text-center text-sm text-red-400">{error}</p>
          )}

          <p className="mt-4 text-center text-xs text-white/40">
            &#10003; 無料 &#10003; 登録不要 &#10003; 入力情報は保存されません
          </p>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="mx-auto max-w-4xl animate-fade-in-up">
          {/* Summary Header */}
          <div className="mb-8 text-center">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-accent/20 px-4 py-1.5 text-sm font-medium text-accent">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              分析完了
            </div>
            <p className="text-lg font-bold text-foreground">{result.productSummary}</p>
          </div>

          {/* Selling Points */}
          <div className="mb-8">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-foreground">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 text-sm text-accent">1</span>
              セリングポイント分析
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {result.sellingPoints.map((sp, i) => (
                <div key={i} className="rounded-2xl border border-card-border bg-white p-5 shadow-sm">
                  <p className="mb-2 text-sm font-bold text-accent">{sp.title}</p>
                  <p className="mb-3 text-sm leading-relaxed text-foreground">
                    &ldquo;{sp.phrase}&rdquo;
                  </p>
                  <p className="text-xs leading-relaxed text-muted">
                    <span className="font-medium">心理効果:</span> {sp.psychology}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Competitor Analysis */}
          <div className="mb-8">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-foreground">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 text-sm text-accent">2</span>
              競合分析・差別化
            </h3>
            <div className="rounded-2xl border border-card-border bg-white p-6 shadow-sm">
              <p className="mb-4 text-sm leading-relaxed text-foreground">
                <span className="font-bold text-accent">ポジショニング:</span> {result.competitorAnalysis.positioning}
              </p>
              <div className="mb-4 space-y-2">
                {result.competitorAnalysis.differentiators.map((d, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    <span className="text-sm text-foreground">{d}</span>
                  </div>
                ))}
              </div>
              <div className="rounded-xl bg-accent/5 p-4">
                <p className="text-xs font-medium text-muted">競合比較された時の切り返し:</p>
                <p className="mt-1 text-sm font-medium leading-relaxed text-foreground">
                  &ldquo;{result.competitorAnalysis.counterPhrase}&rdquo;
                </p>
              </div>
            </div>
          </div>

          {/* Closing Scripts */}
          <div className="mb-8">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-foreground">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 text-sm text-accent">3</span>
              即決営業トークスクリプト
            </h3>
            <div className="space-y-4">
              {result.closingScripts.map((cs, i) => {
                const color = STEP_COLORS[cs.step] || "#0F6E56";
                return (
                  <div key={i} className="rounded-2xl border border-card-border bg-white p-5 shadow-sm">
                    <div className="mb-3 flex items-center gap-2">
                      <span
                        className="rounded-full px-3 py-0.5 text-xs font-bold text-white"
                        style={{ backgroundColor: color }}
                      >
                        {cs.step}
                      </span>
                      <span className="text-sm font-medium text-foreground">{cs.situation}</span>
                    </div>
                    <div className="rounded-xl bg-gray-50 p-4">
                      <p className="text-sm leading-relaxed text-foreground whitespace-pre-line">
                        &ldquo;{cs.script}&rdquo;
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Next Steps CTA */}
          <div className="rounded-2xl border-2 border-accent/30 bg-accent/5 p-8 text-center">
            <p className="mb-2 text-lg font-bold text-foreground">
              この営業トークを実践で使いこなすには？
            </p>
            <p className="mb-6 text-sm text-muted">
              成約5ステップメソッドを学んで、AIとロープレ練習すれば、本番で自然に使えるようになります
            </p>
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/learn"
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-accent px-6 text-base font-bold text-white transition hover:bg-accent-hover sm:w-auto"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342" />
                </svg>
                営業の型を学ぶ（無料）
              </Link>
              <Link
                href="/roleplay"
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border-2 border-accent px-6 text-base font-bold text-accent transition hover:bg-accent hover:text-white sm:w-auto"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
                </svg>
                AIとロープレ練習する
              </Link>
            </div>

            <button
              type="button"
              onClick={() => {
                setResult(null);
                setUrl("");
                setProductName("");
                setIndustry("");
              }}
              className="mt-4 text-sm text-muted transition hover:text-accent"
            >
              別の商材を分析する
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
