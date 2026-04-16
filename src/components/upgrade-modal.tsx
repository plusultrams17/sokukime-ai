"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { trackCTAClick, trackCheckoutStarted } from "@/lib/tracking";
import { createClient } from "@/lib/supabase/client";
import { getStoredUTM } from "@/components/utm-tracker";

interface UpgradeModalProps {
  open: boolean;
  onClose: () => void;
  /** Current session score (if available) */
  currentScore?: number;
  /** Previous session score (if available) */
  previousScore?: number;
  /** Trigger context for copy variation */
  trigger?: "limit" | "score" | "feature";
}

export function UpgradeModal({
  open,
  onClose,
  currentScore,
  previousScore,
  trigger = "limit",
}: UpgradeModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [billing] = useState<"monthly" | "annual">("monthly");
  const [selectedTier, setSelectedTier] = useState<"starter" | "pro" | "master">("pro");
  const [stats, setStats] = useState<{ totalUsers: number; totalSessions: number } | null>(null);

  useEffect(() => {
    fetch("/api/stats")
      .then((res) => res.json())
      .then((data) => {
        if (data.totalUsers > 0) setStats(data);
      })
      .catch(() => {});
  }, []);

  if (!open) return null;

  async function handleUpgrade() {
    setIsLoading(true);
    setErrorMsg("");
    trackCTAClick(`upgrade_modal_${selectedTier}`, "upgrade_modal", "/api/stripe/checkout");
    trackCheckoutStarted();

    // Client-side auth check
    const supabase = createClient();
    if (supabase) {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = "/login?redirect=/pricing";
        return;
      }
    }

    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ billing, tier: selectedTier, utm: getStoredUTM() }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      if (data.error === "Unauthorized") {
        window.location.href = "/login?redirect=/pricing";
        return;
      }
      setErrorMsg(data.error || "エラーが発生しました。もう一度お試しください。");
    } catch {
      setErrorMsg("チェックアウトの開始に失敗しました。もう一度お試しください。");
    }
    setIsLoading(false);
  }

  const scoreDiff =
    currentScore !== undefined && previousScore !== undefined
      ? currentScore - previousScore
      : null;
  const hasScoreGrowth = scoreDiff !== null && scoreDiff > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-md animate-fade-in-up rounded-2xl border border-card-border bg-card p-8">
        {/* Score progress section */}
        {currentScore !== undefined && (
          <div className="mb-6 rounded-xl border border-accent/20 bg-accent/5 p-4 text-center">
            {hasScoreGrowth ? (
              <>
                <div className="mb-1 text-xs text-muted">今日のスコア推移</div>
                <div className="flex items-center justify-center gap-2 text-lg">
                  <span className="text-muted">{previousScore}点</span>
                  <span className="text-accent">→</span>
                  <span className="font-bold text-accent">{currentScore}点</span>
                  <span className="rounded-full bg-green-500/10 px-2 py-0.5 text-xs font-bold text-green-500">
                    +{scoreDiff}pt
                  </span>
                </div>
                <p className="mt-2 text-xs text-muted">
                  練習するほどスコアは上がります
                </p>
              </>
            ) : (
              <>
                <div className="mb-1 text-xs text-muted">今回のスコア</div>
                <div className="text-3xl font-black text-accent">
                  {currentScore}
                  <span className="text-lg font-normal text-muted"> / 100</span>
                </div>
              </>
            )}
          </div>
        )}

        {/* Headline */}
        {trigger === "limit" && (
          <>
            <h2 className="mb-2 text-center text-xl font-bold">
              無料枠の5回を使い切りました
            </h2>
            <p className="mb-5 text-center text-sm text-muted">
              今つかんだ感覚を、そのまま伸ばしませんか？
              <br />
              <span className="font-medium text-foreground">有料プランなら月30〜200回まで練習を続けられます。</span>
            </p>
          </>
        )}
        {trigger === "score" && (
          <>
            <h2 className="mb-2 text-center text-xl font-bold">
              あと少しでスコアが伸びるのに、ここで止めますか？
            </h2>
            <p className="mb-5 text-center text-sm text-muted">
              Proなら全5カテゴリの弱点がわかり、
              <br />
              <span className="font-medium text-foreground">集中練習で効率的にスコアを伸ばせます。</span>
            </p>
          </>
        )}
        {trigger === "feature" && (
          <>
            <h2 className="mb-2 text-center text-xl font-bold">
              この機能はProプラン限定です
            </h2>
            <p className="mb-5 text-center text-sm text-muted">
              Proプランで営業力を最大限に鍛えましょう
            </p>
          </>
        )}

        {/* 3-plan comparison */}
        <div className="mb-4 grid grid-cols-3 gap-2">
          {([
            { tier: "starter" as const, label: "Starter", price: 990, credits: 30 },
            { tier: "pro" as const, label: "Pro", price: 1980, credits: 60, recommended: true },
            { tier: "master" as const, label: "Master", price: 4980, credits: 200 },
          ]).map((p) => (
            <button
              key={p.tier}
              onClick={() => setSelectedTier(p.tier)}
              className={`relative rounded-xl border p-3 text-left transition ${
                selectedTier === p.tier
                  ? "border-accent bg-accent/5"
                  : "border-card-border hover:border-accent/30"
              }`}
            >
              {p.recommended && (
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-accent px-2 py-0.5 text-[9px] font-bold text-white">
                  人気
                </span>
              )}
              <div className="mb-1 text-[10px] font-bold text-muted">{p.label}</div>
              <div className="text-sm font-bold text-accent">&yen;{p.price.toLocaleString()}</div>
              <div className="text-[10px] text-muted">/月</div>
              <div className="mt-1.5 text-[10px] text-muted">月{p.credits}回</div>
            </button>
          ))}
        </div>

        {/* Shared features */}
        <div className="mb-4 space-y-1.5">
          {["全5カテゴリ詳細スコア", "AI改善アドバイス", "全22レッスン・全シーン"].map((f) => (
            <div key={f} className="flex items-center gap-2 text-xs">
              <svg className="h-3.5 w-3.5 flex-shrink-0 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
              <span>{f}</span>
            </div>
          ))}
        </div>

        <div className="mb-3 text-center text-xs text-muted">
          いつでも解約OK・違約金なし・Stripe安全決済
        </div>

        {stats && (
          <div className="mb-4 text-center text-xs text-muted">
            <span className="font-bold text-foreground">{stats.totalUsers.toLocaleString()}人</span>が利用中・累計<span className="font-bold text-foreground">{stats.totalSessions.toLocaleString()}回</span>のロープレ実績
          </div>
        )}

        {/* CTA */}
        <div className="flex flex-col gap-3">
          <button
            onClick={handleUpgrade}
            disabled={isLoading}
            className="flex h-12 w-full items-center justify-center rounded-xl bg-accent text-base font-bold text-white transition hover:bg-accent-hover disabled:opacity-60"
          >
            {isLoading ? "処理中..." : `${selectedTier === "master" ? "Master" : selectedTier === "starter" ? "Starter" : "Pro"}にアップグレード`}
          </button>
          {errorMsg && (
            <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2 text-xs text-red-400 text-center">
              {errorMsg}
            </div>
          )}
          <button
            onClick={onClose}
            className="text-sm text-muted transition hover:text-foreground"
          >
            今はスキップ
          </button>
          <Link
            href="/pricing"
            className="text-center text-xs text-muted transition hover:text-accent"
          >
            料金プランの詳細を見る →
          </Link>
        </div>
      </div>
    </div>
  );
}
