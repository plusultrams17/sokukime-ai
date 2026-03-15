"use client";

import { useEffect, useState } from "react";

interface PhaseCompletionCelebrationProps {
  phaseIndex: number;
  phaseName: string;
  phaseColor: string;
}

const PARTICLES = Array.from({ length: 10 }, (_, i) => {
  const angle = (i / 10) * Math.PI * 2;
  const distance = 40 + Math.random() * 30;
  return {
    tx: `${Math.cos(angle) * distance}px`,
    ty: `${Math.sin(angle) * distance - 20}px`,
    tr: `${Math.random() * 360}deg`,
    delay: `${i * 0.05}s`,
    size: 4 + Math.random() * 4,
  };
});

export function PhaseCompletionCelebration({
  phaseIndex,
  phaseName,
  phaseColor,
}: PhaseCompletionCelebrationProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
      {/* Confetti particles */}
      {PARTICLES.map((p, i) => (
        <div
          key={i}
          className="confetti-particle absolute rounded-full"
          style={{
            "--tx": p.tx,
            "--ty": p.ty,
            "--tr": p.tr,
            width: p.size,
            height: p.size,
            background: i % 2 === 0 ? phaseColor : "#22C55E",
            animationDelay: p.delay,
          } as React.CSSProperties}
        />
      ))}

      {/* Central badge */}
      <div className="animate-celebrate-check flex flex-col items-center gap-1.5 rounded-2xl bg-white/95 px-6 py-4 shadow-lg backdrop-blur-sm">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-full"
          style={{ background: phaseColor }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <span className="text-sm font-bold text-[#1E293B]">
          Step {phaseIndex + 1} 完了!
        </span>
        <span className="text-xs text-[#6B7280]">{phaseName}シート</span>
      </div>
    </div>
  );
}
