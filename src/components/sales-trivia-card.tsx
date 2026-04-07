"use client";

import { getTodayTrivia } from "@/lib/sales-trivia";

const CATEGORY_COLORS: Record<string, string> = {
  "心理学": "bg-purple-500/15 text-purple-400",
  "見た目": "bg-blue-500/15 text-blue-400",
  "コミュニケーション": "bg-emerald-500/15 text-emerald-400",
  "データ": "bg-amber-500/15 text-amber-400",
  "交渉術": "bg-rose-500/15 text-rose-400",
};

export function SalesTriviaCard() {
  const trivia = getTodayTrivia();
  const colorClass = CATEGORY_COLORS[trivia.category] || "bg-muted/15 text-muted";

  return (
    <div className="rounded-xl border border-card-border bg-card p-5">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--accent)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="shrink-0"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <span className="text-xs font-bold text-muted">
            今日の営業豆知識
          </span>
        </div>
        <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${colorClass}`}>
          {trivia.category}
        </span>
      </div>
      <p className="mb-2 text-sm leading-relaxed text-foreground">
        {trivia.fact}
      </p>
      <p className="text-[11px] leading-snug text-muted">
        {trivia.source}
      </p>
    </div>
  );
}
