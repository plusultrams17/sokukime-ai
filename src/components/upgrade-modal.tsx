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
  const [billing, setBilling] = useState<"monthly" | "annual">("annual");
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
    trackCTAClick("upgrade_modal_pro", "upgrade_modal", "/api/stripe/checkout");
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
        body: JSON.stringify({ billing, utm: getStoredUTM() }),
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
              このまま練習を止めますか？
            </h2>
            <p className="mb-5 text-center text-sm text-muted">
              明日まで待つと、今日の練習で掴んだ感覚が薄れます。
              <br />
              <span className="font-medium text-foreground">Proなら今すぐ続きを練習できます。</span>
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
              <span className="font-medium text-foreground">集中練習でスコアが2倍速く改善します。</span>
            </p>
          </>
        )}
        {trigger === "feature" && (
          <>
            <h2 className="mb-2 text-center text-xl font-bold">
              この機能はProプラン限定です
            </h2>
            <p className="mb-5 text-center text-sm text-muted">
              全機能を使って営業力を最大限に鍛えましょう
            </p>
          </>
        )}

        {/* Pro features */}
        <div className="mb-5 space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <svg className="h-4 w-4 flex-shrink-0 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
            <span>ロープレ<span className="font-bold text-accent">無制限</span></span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <svg className="h-4 w-4 flex-shrink-0 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
            <span>全5カテゴリの<span className="font-bold text-accent">詳細スコア</span></span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <svg className="h-4 w-4 flex-shrink-0 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
            <span>AI<span className="font-bold text-accent">改善アドバイス</span></span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <svg className="h-4 w-4 flex-shrink-0 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
            <span>全ワークシート・全シーン</span>
          </div>
        </div>

        {/* Billing toggle */}
        <div className="mb-3 flex items-center justify-center gap-1 rounded-xl bg-background p-1">
          <button
            onClick={() => setBilling("monthly")}
            className={`flex-1 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
              billing === "monthly"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted hover:text-foreground"
            }`}
          >
            月払い
          </button>
          <button
            onClick={() => setBilling("annual")}
            className={`flex-1 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
              billing === "annual"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted hover:text-foreground"
            }`}
          >
            年払い
            <span className="ml-1 text-green-500">2ヶ月無料</span>
          </button>
        </div>

        {/* Price comparison */}
        <div className="mb-4 rounded-xl border border-accent/30 bg-accent/5 p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm text-muted">営業研修1回</span>
            <span className="text-sm text-muted line-through">¥50,000〜</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-accent">成約コーチAI Pro</span>
            {billing === "monthly" ? (
              <span className="text-lg font-bold text-accent">
                ¥2,980<span className="text-xs font-normal text-muted">/月</span>
              </span>
            ) : (
              <div className="text-right">
                <span className="text-lg font-bold text-accent">
                  ¥29,800<span className="text-xs font-normal text-muted">/年</span>
                </span>
                <div className="text-[10px] text-green-500">実質¥2,483/月</div>
              </div>
            )}
          </div>
        </div>

        <div className="mb-3 text-center text-xs text-muted">
          14日間返金保証・いつでも解約OK・違約金なし
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
            {isLoading ? "処理中..." : "無料で7日間すべての機能を使う"}
          </button>
          {errorMsg && (
            <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2 text-xs text-red-400 text-center">
              {errorMsg}
            </div>
          )}
          <div className="text-center text-[11px] text-muted">
            今日スタート → {new Date(Date.now() + 7 * 86400000).toLocaleDateString("ja-JP", { month: "long", day: "numeric" })}まで全機能無料 ・ いつでも解約OK
          </div>
          <button
            onClick={onClose}
            className="text-sm text-muted transition hover:text-foreground"
          >
            {trigger === "limit" ? "明日まで練習を止める" : "今はスキップ"}
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
