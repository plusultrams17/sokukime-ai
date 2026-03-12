"use client";

import Link from "next/link";
import type { ScoreResult } from "./page";

interface ScoreCardProps {
  score: ScoreResult;
  onRetry: () => void;
}

function getScoreColor(score: number) {
  if (score >= 80) return "text-green-400";
  if (score >= 60) return "text-yellow-400";
  if (score >= 40) return "text-orange-400";
  return "text-red-400";
}

function getScoreBarColor(score: number) {
  if (score >= 80) return "bg-green-400";
  if (score >= 60) return "bg-yellow-400";
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

export function ScoreCard({ score, onRetry }: ScoreCardProps) {
  return (
    <div className="flex flex-1 items-start justify-center overflow-y-auto px-4 py-12">
      <div className="w-full max-w-2xl animate-fade-in-up">
        {/* Overall Score */}
        <div className="mb-8 rounded-2xl border border-card-border bg-card p-8 text-center">
          <div className="mb-2 text-sm text-muted">即決営業スコア</div>
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

        {/* Category Scores */}
        <div className="mb-8 rounded-2xl border border-card-border bg-card p-6">
          <h3 className="mb-4 text-sm font-medium text-muted">カテゴリ別スコア</h3>
          <div className="space-y-4">
            {score.categories.map((cat) => (
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

        {/* Summary */}
        <div className="mb-8 rounded-2xl border border-card-border bg-card p-6">
          <h3 className="mb-3 text-sm font-medium text-muted">総評</h3>
          <p className="text-sm leading-relaxed">{score.summary}</p>
        </div>

        {/* Strengths & Improvements */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-card-border bg-card p-6">
            <h3 className="mb-3 text-sm font-medium text-green-400">💪 良かった点</h3>
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

        {/* Actions */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            onClick={onRetry}
            className="flex h-12 flex-1 items-center justify-center rounded-xl bg-accent text-base font-bold text-white transition hover:bg-accent-hover"
          >
            🔄 もう一度ロープレする
          </button>
          <Link
            href="/"
            className="flex h-12 flex-1 items-center justify-center rounded-xl border border-card-border text-sm text-muted transition hover:text-foreground"
          >
            トップに戻る
          </Link>
        </div>
      </div>
    </div>
  );
}
