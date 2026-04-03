"use client";

import { InsightProgress } from "./InsightProgress";
import { IndustrySelector } from "./IndustrySelector";

interface DailyBriefingHeaderProps {
  date: string;
  industries: { slug: string; label: string }[];
  selectedIndustry: string;
  onSelectIndustry: (slug: string) => void;
  viewedCount: number;
  totalCount: number;
}

export function DailyBriefingHeader({
  date,
  industries,
  selectedIndustry,
  onSelectIndustry,
  viewedCount,
  totalCount,
}: DailyBriefingHeaderProps) {
  const formatted = new Date(date).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short",
  });

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "おはようございます" : hour < 18 ? "こんにちは" : "お疲れ様です";

  return (
    <div className="mb-8">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs text-muted">{formatted}</p>
          <h1 className="text-2xl font-bold">
            {greeting}、今日のインサイト
          </h1>
        </div>
        <InsightProgress viewed={viewedCount} total={totalCount} />
      </div>
      <IndustrySelector
        industries={industries}
        selected={selectedIndustry}
        onSelect={onSelectIndustry}
      />
    </div>
  );
}
