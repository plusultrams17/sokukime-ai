"use client";

import Link from "next/link";
import { getOverallProgress } from "@/lib/worksheet-progress";

interface CompletionSummaryProps {
  phaseData: Record<string, string>[];
}

export function CompletionSummary({ phaseData }: CompletionSummaryProps) {
  const { filled, total } = getOverallProgress(phaseData);

  return (
    <div className="animate-fade-in-up mt-8 rounded-2xl border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 p-6 text-center shadow-sm sm:p-8">
      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-500 animate-celebrate-check">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      <h3 className="mb-1 text-lg font-bold text-[#1E293B]">
        準備完了!
      </h3>
      <p className="mb-2 text-sm text-[#6B7280]">
        全5ステップ・{filled}/{total}項目のトークスクリプトが完成しました
      </p>
      <p className="mb-6 text-xs text-[#9CA3AF]">
        ワークシートで整理した知識をAIロープレで実践練習しましょう
      </p>
      <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <Link
          href="/roleplay"
          className="inline-flex h-12 items-center justify-center rounded-xl bg-accent px-8 font-bold text-white transition hover:bg-accent-hover"
        >
          ロープレで実践練習する
        </Link>
      </div>
    </div>
  );
}
