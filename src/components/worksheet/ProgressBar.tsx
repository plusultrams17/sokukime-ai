import type { PhaseConfig } from "@/types/worksheet";
import { getPhaseProgress } from "@/lib/worksheet-progress";

interface ProgressBarProps {
  phases: PhaseConfig[];
  activePhase: number;
  phaseData: Record<string, string>[];
}

export function ProgressBar({ phases, phaseData }: ProgressBarProps) {
  return (
    <div className="mt-2 flex gap-1">
      {phases.map((phase, i) => {
        const { percent } = getPhaseProgress(i, phaseData[i] || {});
        return (
          <div
            key={i}
            className="h-1.5 flex-1 overflow-hidden rounded-full bg-black/[0.04]"
          >
            <div
              className="h-full rounded-full transition-all duration-700 ease-out"
              style={{
                width: `${percent}%`,
                background: phase.color,
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
