"use client";

import { useState } from "react";
import Link from "next/link";
import { trackCTAClick, trackCheckoutStarted } from "@/lib/tracking";

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

  if (!open) return null;

  async function handleUpgrade() {
    setIsLoading(true);
    trackCTAClick("upgrade_modal_pro", "upgrade_modal", "/api/stripe/checkout");
    trackCheckoutStarted();
    try {
      const res = await fetch("/api/stripe/checkout", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      setIsLoading(false);
    }
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
              本日のロープレ上限に達しました
            </h2>
            <p className="mb-5 text-center text-sm text-muted">
              Proプランなら回数無制限。
              <br />
              練習量が成約率を変えます。
            </p>
          </>
        )}
        {trigger === "score" && (
          <>
            <h2 className="mb-2 text-center text-xl font-bold">
              もっとスコアを伸ばしませんか？
            </h2>
            <p className="mb-5 text-center text-sm text-muted">
              Proユーザーの平均：初月68点 → 3ヶ月後85点
              <br />
              毎日3回以上練習する人のスコアは平均2.3倍速く改善
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
            <span className="text-accent">✓</span>
            <span>ロープレ<span className="font-bold text-accent">無制限</span></span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-accent">✓</span>
            <span>全5カテゴリの<span className="font-bold text-accent">詳細スコア</span></span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-accent">✓</span>
            <span>AI<span className="font-bold text-accent">改善アドバイス</span></span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-accent">✓</span>
            <span>全ワークシート・全シーン</span>
          </div>
        </div>

        {/* Price comparison */}
        <div className="mb-4 rounded-xl border border-accent/30 bg-accent/5 p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm text-muted">営業研修1回</span>
            <span className="text-sm text-muted line-through">¥50,000〜</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-accent">成約コーチ AI Pro</span>
            <span className="text-lg font-bold text-accent">
              ¥2,980<span className="text-xs font-normal text-muted">/月</span>
            </span>
          </div>
        </div>

        <div className="mb-4 text-center text-xs text-muted">
          いつでも解約OK・即日反映・違約金なし
        </div>

        {/* CTA */}
        <div className="flex flex-col gap-3">
          <button
            onClick={handleUpgrade}
            disabled={isLoading}
            className="flex h-12 w-full items-center justify-center rounded-xl bg-accent text-base font-bold text-white transition hover:bg-accent-hover disabled:opacity-60"
          >
            {isLoading ? "処理中..." : "Proプランにアップグレード"}
          </button>
          <div className="text-center text-[11px] text-muted">
            ✓ いつでも解約OK ✓ Stripe安全決済
          </div>
          <button
            onClick={onClose}
            className="text-sm text-muted transition hover:text-foreground"
          >
            {trigger === "limit" ? "明日また練習する" : "今はスキップ"}
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
