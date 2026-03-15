"use client";

import type { PhaseConfig } from "@/types/worksheet";

interface NavButtonsProps {
  phases: PhaseConfig[];
  activePhase: number;
  onNavigate: (direction: number) => void;
}

export function NavButtons({
  phases,
  activePhase,
  onNavigate,
}: NavButtonsProps) {
  const isFirst = activePhase === 0;
  const isLast = activePhase === phases.length - 1;

  return (
    <div className="mt-8 flex items-center justify-between">
      <button
        onClick={() => onNavigate(-1)}
        disabled={isFirst}
        className="rounded-xl border border-[#E5E0D8] bg-white px-5 py-2.5 text-sm font-semibold text-[#6B7280] transition-all hover:border-[#9CA3AF] hover:text-[#1E293B] disabled:cursor-not-allowed disabled:opacity-40"
      >
        ← 前のステップ
      </button>
      <span className="text-sm font-medium text-[#9CA3AF]">
        {activePhase + 1} / {phases.length}
      </span>
      <button
        onClick={() => onNavigate(1)}
        disabled={isLast}
        className="rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        style={{
          background: !isLast ? phases[activePhase + 1].color : "#D1D5DB",
        }}
      >
        次のステップ →
      </button>
    </div>
  );
}
