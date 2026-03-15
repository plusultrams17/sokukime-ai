"use client";

import Link from "next/link";
import { RadarChart } from "@/components/radar-chart";
import { ReferralPrompt } from "@/components/referral-prompt";
import type { ScoreResult } from "./page";
import { trackCTAClick } from "@/lib/tracking";

interface ScoreCardProps {
  score: ScoreResult;
  onRetry: () => void;
  plan?: "free" | "pro";
  onUpgrade?: () => void;
}

function getScoreColor(score: number) {
  if (score >= 80) return "text-green-600";
  if (score >= 60) return "text-yellow-600";
  if (score >= 40) return "text-orange-500";
  return "text-red-500";
}

function getScoreBarColor(score: number) {
  if (score >= 80) return "bg-green-500";
  if (score >= 60) return "bg-yellow-500";
  if (score >= 40) return "bg-orange-400";
  return "bg-red-400";
}

function getGrade(score: number) {
  if (score >= 90) return "S";
  if (score >= 80) return "A";
  if (score >= 70) return "B";
  if (score >= 60) return "C";
  if (score >= 40) return "D";
  return "E";
}

// Number of categories visible to free users
const FREE_VISIBLE_CATEGORIES = 1;

export function ScoreCard({ score, onRetry, plan, onUpgrade }: ScoreCardProps) {
  const shareText = `成約コーチ AIでスコア${score.overall}点（ランク${getGrade(score.overall)}）を獲得しました！ #成約コーチAI #営業ロープレ`;
  const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;

  const isFree = plan === "free";
  const visibleCategories = isFree
    ? score.categories.slice(0, FREE_VISIBLE_CATEGORIES)
    : score.categories;
  const lockedCategories = isFree
    ? score.categories.slice(FREE_VISIBLE_CATEGORIES)
    : [];

  return (
    <div className="flex flex-1 items-start justify-center overflow-y-auto px-4 py-12">
      <div className="w-full max-w-2xl animate-fade-in-up">
        {/* Overall Score */}
        <div className="mb-8 rounded-2xl border border-card-border bg-card p-8 text-center">
          <div className="mb-2 text-sm text-muted">営業スコア</div>
          <div className="flex items-center justify-center gap-4">
            <span className={`text-7xl font-black ${getScoreColor(score.overall)}`}>
              {score.overall}
            </span>
            <span className="text-5xl font-black text-muted/30">
              / 100
            </span>
          </div>
          <div
            className={`mt-2 text-2xl font-bold ${getScoreColor(score.overall)}`}
          >
            ランク {getGrade(score.overall)}
          </div>
        </div>

        {/* Radar Chart */}
        <div className="mb-8 rounded-2xl border border-card-border bg-card p-6">
          <h3 className="mb-4 text-sm font-medium text-muted">5ステップ分析</h3>
          <RadarChart categories={score.categories} size={220} />
        </div>

        {/* Category Scores - visible */}
        <div className="mb-4 rounded-2xl border border-card-border bg-card p-6">
          <h3 className="mb-4 text-sm font-medium text-muted">カテゴリ別スコア</h3>
          <div className="space-y-4">
            {visibleCategories.map((cat) => (
              <div key={cat.name}>
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-sm font-medium">{cat.name}</span>
                  <span className={`text-sm font-bold ${getScoreColor(cat.score)}`}>
                    {cat.score}
                  </span>
                </div>
                <div className="mb-2 h-2 overflow-hidden rounded-full bg-card-border">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${getScoreBarColor(cat.score)}`}
                    style={{ width: `${cat.score}%` }}
                  />
                </div>
                <p className="text-xs leading-relaxed text-muted">{cat.feedback}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Locked Categories for Free users */}
        {isFree && lockedCategories.length > 0 && (
          <div className="relative mb-8">
            {/* Blurred locked content */}
            <div className="rounded-2xl border border-card-border bg-card p-6 select-none">
              <div className="space-y-4 blur-sm pointer-events-none" aria-hidden>
                {lockedCategories.map((cat) => (
                  <div key={cat.name}>
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-sm font-medium">{cat.name}</span>
                      <span className="text-sm font-bold text-muted">??</span>
                    </div>
                    <div className="mb-2 h-2 overflow-hidden rounded-full bg-card-border">
                      <div
                        className="h-full rounded-full bg-muted/30"
                        style={{ width: "50%" }}
                      />
                    </div>
                    <p className="text-xs text-muted">詳細なフィードバックはProプランで確認できます</p>
                  </div>
                ))}
              </div>

              {/* Lock overlay */}
              <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-background/60 backdrop-blur-[2px]">
                <div className="text-center">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-xl">
                    🔒
                  </div>
                  <p className="mb-1 text-sm font-bold">
                    残り{lockedCategories.length}カテゴリの詳細スコア
                  </p>
                  <p className="mb-4 text-xs text-muted">
                    各カテゴリの点数とAI改善アドバイスを確認できます
                  </p>
                  <button
                    onClick={() => {
                      trackCTAClick("scorecard_unlock", "score_card", "/pricing");
                      onUpgrade?.();
                    }}
                    className="inline-flex h-10 items-center rounded-lg bg-accent px-6 text-sm font-bold text-white transition hover:bg-accent-hover"
                  >
                    Proで全スコアを見る
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* If Pro, show the rest of the categories in the same card flow */}
        {!isFree && (
          <div className="mb-4 h-0" /> /* spacer for consistent layout */
        )}

        {/* Summary - locked for free */}
        {isFree ? (
          <div className="relative mb-8">
            <div className="rounded-2xl border border-card-border bg-card p-6 select-none">
              <h3 className="mb-3 text-sm font-medium text-muted">総評</h3>
              <div className="blur-sm pointer-events-none" aria-hidden>
                <p className="text-sm leading-relaxed text-muted">
                  Proプランにアップグレードすると、AIによる詳細な総評と具体的な改善アドバイスを確認できます。あなたの営業スキルの強みと弱みを分析し、効果的な練習方法を提案します。
                </p>
              </div>
              <div className="absolute inset-0 flex items-center justify-center rounded-2xl">
                <div className="rounded-full border border-card-border bg-card/90 px-4 py-2 text-xs font-medium text-muted backdrop-blur-sm">
                  🔒 Proプランで総評を見る
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-8 rounded-2xl border border-card-border bg-card p-6">
            <h3 className="mb-3 text-sm font-medium text-muted">総評</h3>
            <p className="text-sm leading-relaxed">{score.summary}</p>
          </div>
        )}

        {/* Strengths & Improvements - locked for free */}
        {isFree ? (
          <div className="relative mb-8">
            <div className="grid gap-4 sm:grid-cols-2 select-none">
              <div className="rounded-2xl border border-card-border bg-card p-6">
                <h3 className="mb-3 text-sm font-medium text-green-600">💪 良かった点</h3>
                <div className="blur-sm pointer-events-none" aria-hidden>
                  <ul className="space-y-2">
                    <li className="text-sm text-muted">・詳細はProプランで確認できます</li>
                    <li className="text-sm text-muted">・詳細はProプランで確認できます</li>
                    <li className="text-sm text-muted">・詳細はProプランで確認できます</li>
                  </ul>
                </div>
              </div>
              <div className="rounded-2xl border border-card-border bg-card p-6">
                <h3 className="mb-3 text-sm font-medium text-accent">📈 改善ポイント</h3>
                <div className="blur-sm pointer-events-none" aria-hidden>
                  <ul className="space-y-2">
                    <li className="text-sm text-muted">・詳細はProプランで確認できます</li>
                    <li className="text-sm text-muted">・詳細はProプランで確認できます</li>
                    <li className="text-sm text-muted">・詳細はProプランで確認できます</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="rounded-full border border-card-border bg-card/90 px-4 py-2 text-xs font-medium text-muted backdrop-blur-sm">
                🔒 Proプランで詳細フィードバックを見る
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-card-border bg-card p-6">
              <h3 className="mb-3 text-sm font-medium text-green-600">💪 良かった点</h3>
              <ul className="space-y-2">
                {score.strengths.map((s, i) => (
                  <li key={i} className="text-sm leading-relaxed text-muted">
                    ・{s}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-card-border bg-card p-6">
              <h3 className="mb-3 text-sm font-medium text-accent">📈 改善ポイント</h3>
              <ul className="space-y-2">
                {score.improvements.map((s, i) => (
                  <li key={i} className="text-sm leading-relaxed text-muted">
                    ・{s}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            onClick={() => {
              trackCTAClick("scorecard_retry", "score_card", "/roleplay");
              onRetry();
            }}
            className="flex h-12 flex-1 items-center justify-center rounded-xl bg-accent text-base font-bold text-white transition hover:bg-accent-hover"
          >
            🔄 もう一度ロープレする
          </button>
          <a
            href={shareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-12 flex-1 items-center justify-center rounded-xl border border-card-border text-sm text-muted transition hover:text-foreground"
          >
            𝕏 でシェアする
          </a>
          <Link
            href="/"
            className="flex h-12 flex-1 items-center justify-center rounded-xl border border-card-border text-sm text-muted transition hover:text-foreground"
          >
            トップに戻る
          </Link>
        </div>

        {/* Upgrade CTA for free users - bottom */}
        {isFree && (
          <div className="mt-6 rounded-2xl border border-accent/30 bg-accent/5 p-6 text-center">
            <p className="mb-1 text-sm font-bold">
              全カテゴリの詳細スコアと改善アドバイスを見ませんか？
            </p>
            <p className="mb-4 text-xs text-muted">
              Proプランなら無制限ロープレ + 全5カテゴリの詳細フィードバック
            </p>
            <button
              onClick={() => {
                trackCTAClick("scorecard_upgrade", "score_card", "/pricing");
                onUpgrade?.();
              }}
              className="inline-flex h-10 items-center rounded-lg bg-accent px-6 text-sm font-bold text-white transition hover:bg-accent-hover"
            >
              Proプランにアップグレード ¥2,980/月
            </button>
            <p className="mt-2 text-[11px] text-muted">
              いつでも解約OK・Stripe安全決済
            </p>
          </div>
        )}
      </div>

      {/* 紹介プロンプト（スコア80点以上で表示） */}
      {!isFree && <ReferralPrompt score={score.overall} />}
    </div>
  );
}
