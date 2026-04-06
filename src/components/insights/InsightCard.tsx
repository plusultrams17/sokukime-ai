"use client";

import type { Insight } from "@/types/insights";

interface InsightCardProps {
  insight: Insight;
  onConvert: (insight: Insight) => void;
  onSave: (insight: Insight) => void;
  isPro: boolean;
  isLocked: boolean;
}

export function InsightCard({
  insight,
  onConvert,
  onSave,
  isPro,
  isLocked,
}: InsightCardProps) {
  const isResearch = insight.source_type === "research";

  return (
    <div className="relative">
      <div
        className={`rounded-xl border p-5 transition ${
          isResearch
            ? "border-violet-500/20 bg-violet-500/10"
            : "border-card-border bg-card"
        } ${isLocked ? "select-none" : "hover:border-accent/30"}`}
        style={isLocked ? { filter: "blur(8px)" } : undefined}
      >
        <div className="mb-2 flex items-center gap-2">
          {isResearch && (
            <span className="rounded-full bg-violet-500/10 px-2 py-0.5 text-[10px] font-medium text-violet-400">
              研究
            </span>
          )}
          <span className="text-xs text-muted">{insight.source_name}</span>
          <span className="text-xs text-muted">
            {insight.reading_time_min}分
          </span>
        </div>
        <h3 className="mb-2 text-base font-bold text-foreground line-clamp-2">
          {insight.title_ja}
        </h3>
        <p className="mb-3 text-sm text-muted line-clamp-3">
          {insight.summary_ja}
        </p>
        <p className="mb-4 text-xs text-accent line-clamp-2">
          {insight.sales_angle}
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onConvert(insight)}
            disabled={isLocked}
            className="rounded-lg bg-accent px-4 py-1.5 text-xs font-bold text-white transition hover:bg-accent-hover disabled:opacity-50"
          >
            トークに変換
          </button>
          <button
            onClick={() => onSave(insight)}
            disabled={isLocked}
            className="rounded-lg border border-card-border px-3 py-1.5 text-xs text-muted transition hover:border-accent/30 hover:text-foreground disabled:opacity-50"
          >
            保存
          </button>
        </div>
      </div>
      {/* Lock overlay */}
      {isLocked && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-background/60">
          <div className="text-center">
            <div className="mb-1"><svg className="mx-auto h-6 w-6 text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg></div>
            <p className="text-xs font-medium text-muted">Pro限定</p>
          </div>
        </div>
      )}
    </div>
  );
}
