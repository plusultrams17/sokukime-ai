"use client";

import type { PhaseConfig } from "@/types/worksheet";
import { ProgressBadge } from "./ProgressBadge";

interface TabBarProps {
  phases: PhaseConfig[];
  activePhase: number;
  onPhaseChange: (index: number) => void;
  phaseData: Record<string, string>[];
}

export function TabBar({ phases, activePhase, onPhaseChange, phaseData }: TabBarProps) {
  return (
    <div className="flex gap-1 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
      {phases.map((phase, i) => {
        const isActive = i === activePhase;
        return (
          <button
            key={i}
            onClick={() => onPhaseChange(i)}
            className={`relative min-w-0 flex-1 rounded-xl px-2 py-2.5 text-center transition-all duration-200 sm:px-3 sm:py-3 ${
              isActive ? "bg-white shadow-sm" : "hover:bg-white/50"
            }`}
            style={{
              border: isActive
                ? `2px solid ${phase.color}`
                : "2px solid transparent",
            }}
          >
            {isActive && (
              <div
                className="absolute -top-[1px] left-1/2 h-[3px] w-9 -translate-x-1/2 rounded-full"
                style={{ background: phase.color }}
              />
            )}
            <ProgressBadge
              phaseIndex={i}
              phaseData={phaseData[i] || {}}
              color={phase.color}
            />
            <span
              className="block text-[10px] font-semibold sm:text-xs"
              style={{ color: isActive ? phase.color : "#B4B2A9" }}
            >
              {phase.num}
            </span>
            <span
              className={`block text-xs font-bold sm:text-sm ${
                isActive ? "text-[#1E293B]" : "text-[#9CA3AF]"
              }`}
            >
              {phase.name}
            </span>
            <span
              className="mt-0.5 hidden text-[10px] sm:block"
              style={{ color: isActive ? phase.color : "#B4B2A9" }}
            >
              {phase.sub}
            </span>
          </button>
        );
      })}
    </div>
  );
}
