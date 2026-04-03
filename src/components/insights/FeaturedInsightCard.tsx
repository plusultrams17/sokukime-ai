"use client";

import type { Insight } from "@/types/insights";

interface FeaturedInsightCardProps {
  insight: Insight;
  onConvert: (insight: Insight) => void;
  onSave: (insight: Insight) => void;
  isPro: boolean;
}

export function FeaturedInsightCard({
  insight,
  onConvert,
  onSave,
  isPro,
}: FeaturedInsightCardProps) {
  return (
    <div className="rounded-xl border border-accent/20 bg-accent/5 p-6">
      <div className="mb-3 flex items-center gap-3">
        <span className="rounded-full bg-accent/10 px-3 py-0.5 text-xs font-medium text-accent">
          注目
        </span>
        <span className="text-xs text-muted">{insight.source_name}</span>
        <span className="text-xs text-muted">
          {insight.reading_time_min}分で読める
        </span>
      </div>
      <h2 className="mb-2 text-xl font-bold text-foreground">
        {insight.title_ja}
      </h2>
      <p className="mb-4 text-sm leading-relaxed text-muted">
        {insight.summary_ja}
      </p>
      {/* Sales angle highlight */}
      <div className="mb-5 rounded-lg border border-accent/20 bg-accent/5 px-4 py-3">
        <p className="mb-1 text-xs font-bold text-accent">営業への活かし方</p>
        <p className="text-sm text-foreground">{insight.sales_angle}</p>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={() => onConvert(insight)}
          className="rounded-lg bg-accent px-5 py-2.5 text-sm font-bold text-white transition hover:bg-accent-hover"
        >
          営業トークに変換する
        </button>
        <button
          onClick={() => onSave(insight)}
          className="rounded-lg border border-card-border px-4 py-2.5 text-sm text-muted transition hover:border-accent/30 hover:text-foreground"
        >
          保存する
        </button>
        <a
          href={insight.source_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-muted transition hover:text-accent"
        >
          元記事を読む &rarr;
        </a>
      </div>
    </div>
  );
}
