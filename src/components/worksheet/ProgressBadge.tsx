"use client";

import { getPhaseProgress } from "@/lib/worksheet-progress";

interface ProgressBadgeProps {
  phaseIndex: number;
  phaseData: Record<string, string>;
  color: string;
}

export function ProgressBadge({ phaseIndex, phaseData, color }: ProgressBadgeProps) {
  const { percent } = getPhaseProgress(phaseIndex, phaseData);

  if (percent === 0) return null;

  if (percent === 100) {
    return (
      <span className="absolute -right-1 -top-1 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-green-500 animate-badge-pop">
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </span>
    );
  }

  return (
    <span
      className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full px-1 text-[9px] font-bold text-white animate-badge-pop"
      style={{ background: color }}
    >
      {percent}%
    </span>
  );
}
