"use client";

/* ═══════════════════════════════════════════════════════════════════════════
   成約コーチAI — Game HUD Components
   React + TypeScript + Tailwind CSS 4
   Dark theme / glassmorphism / mobile-first
   All text in Japanese.
═══════════════════════════════════════════════════════════════════════════ */

import {
  useState,
  useEffect,
  useRef,
  useMemo,
  type FC,
} from "react";

import type {
  StatusEffect,
  Achievement,
  AchievementRarity,
  GameEvent,
  DifficultyConfig,
} from "@/lib/game/systems";

import { RARITY_META } from "@/lib/game/systems";

// ─────────────────────────────────────────────────────────────
// Shared keyframe styles — injected once
// ─────────────────────────────────────────────────────────────
const HUD_KEYFRAMES = `
@keyframes hud-shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
  20%, 40%, 60%, 80% { transform: translateX(2px); }
}
@keyframes hud-pulse-ring {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}
@keyframes hud-flash-red {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}
@keyframes hud-fade-in {
  from { opacity: 0; transform: translateY(-4px) scale(0.95); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}
@keyframes hud-fade-out {
  from { opacity: 1; transform: translateY(0) scale(1); }
  to   { opacity: 0; transform: translateY(4px) scale(0.9); }
}
@keyframes hud-slide-down-bounce {
  0%   { opacity: 0; transform: translateY(-80px) scale(0.8); }
  60%  { opacity: 1; transform: translateY(8px) scale(1.03); }
  80%  { transform: translateY(-3px) scale(0.99); }
  100% { transform: translateY(0) scale(1); }
}
@keyframes hud-slide-up-fade {
  from { opacity: 1; transform: translateY(0); }
  to   { opacity: 0; transform: translateY(-60px); }
}
@keyframes hud-scale-blur-in {
  0%   { opacity: 0; transform: scale(0.5); filter: blur(12px); }
  100% { opacity: 1; transform: scale(1);   filter: blur(0); }
}
@keyframes hud-scale-blur-out {
  0%   { opacity: 1; transform: scale(1);   filter: blur(0); }
  100% { opacity: 0; transform: scale(0.7); filter: blur(8px); }
}
@keyframes hud-typewriter-cursor {
  0%, 100% { border-right-color: #f97316; }
  50%      { border-right-color: transparent; }
}
@keyframes hud-float-up {
  0%   { opacity: 1; transform: translateY(0); }
  100% { opacity: 0; transform: translateY(-32px); }
}
@keyframes hud-count-up-pop {
  0%   { transform: scale(0.5); opacity: 0; }
  70%  { transform: scale(1.1); }
  100% { transform: scale(1); opacity: 1; }
}
@keyframes hud-glow-pulse {
  0%, 100% { box-shadow: 0 0 8px rgba(249,115,22,0.3); }
  50%      { box-shadow: 0 0 20px rgba(249,115,22,0.7); }
}
@keyframes hud-fire-flicker {
  0%, 100% { text-shadow: 0 0 4px #f97316, 0 0 8px #ef4444; }
  25%      { text-shadow: 0 0 8px #f97316, 0 0 16px #ef4444; }
  50%      { text-shadow: 0 0 6px #fb923c, 0 0 12px #f97316; }
  75%      { text-shadow: 0 0 10px #f97316, 0 0 20px #dc2626; }
}
@keyframes hud-electric {
  0%, 100% { text-shadow: 0 0 4px #38bdf8, 0 0 8px #3b82f6; }
  20%      { text-shadow: 0 0 12px #38bdf8, 0 0 24px #6366f1; }
  40%      { text-shadow: 0 0 6px #818cf8, 0 0 10px #3b82f6; }
  60%      { text-shadow: 0 0 14px #38bdf8, 0 0 28px #8b5cf6; }
  80%      { text-shadow: 0 0 8px #3b82f6, 0 0 16px #38bdf8; }
}
@keyframes hud-heart-pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.25); }
}
@keyframes hud-sparkle {
  0%, 100% { opacity: 0; transform: scale(0) rotate(0deg); }
  50%      { opacity: 1; transform: scale(1) rotate(180deg); }
}
@keyframes hud-grade-entrance {
  0%   { transform: scale(3) rotate(-10deg); opacity: 0; }
  50%  { transform: scale(0.9) rotate(2deg); opacity: 1; }
  70%  { transform: scale(1.05) rotate(-1deg); }
  100% { transform: scale(1) rotate(0deg); }
}
@keyframes hud-stat-bar-fill {
  from { width: 0%; }
}
@keyframes hud-difficulty-glow {
  0%, 100% { box-shadow: 0 0 0 2px currentColor; }
  50% { box-shadow: 0 0 16px 2px currentColor; }
}
`;

/** Inject global keyframes once into the document head. */
function useHudStyles() {
  useEffect(() => {
    const id = "__hud-keyframes__";
    if (typeof document !== "undefined" && !document.getElementById(id)) {
      const style = document.createElement("style");
      style.id = id;
      style.textContent = HUD_KEYFRAMES;
      document.head.appendChild(style);
    }
  }, []);
}

// ═══════════════════════════════════════════════════════════════
//  1. CountdownTimer
// ═══════════════════════════════════════════════════════════════

interface CountdownTimerProps {
  remaining: number;
  total: number;
  multiplierLabel: string;
  isExpired: boolean;
}

export const CountdownTimer: FC<CountdownTimerProps> = ({
  remaining,
  total,
  multiplierLabel,
  isExpired,
}) => {
  useHudStyles();

  const pct = total > 0 ? remaining / total : 0;
  const displaySeconds = Math.ceil(Math.max(0, remaining));

  // Color transitions based on percentage
  const ringColor = useMemo(() => {
    if (isExpired || pct <= 0) return "#ef4444";
    if (pct > 0.66) return "#22c55e";
    if (pct > 0.33) return "#eab308";
    return "#ef4444";
  }, [pct, isExpired]);

  const isFlashing = pct < 0.15 && pct > 0 && !isExpired;
  const isShaking = remaining < 5 && remaining > 0 && !isExpired;

  // SVG circular progress
  const size = 72; // desktop size, scaled via CSS
  const strokeWidth = 5;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - pct);

  return (
    <div
      className={`relative flex flex-col items-center ${
        isShaking ? "" : ""
      }`}
      style={{
        animation: isShaking ? "hud-shake 0.3s infinite" : undefined,
      }}
    >
      {/* SVG Ring */}
      <div className="relative w-14 h-14 sm:w-[72px] sm:h-[72px]">
        <svg
          className="w-full h-full -rotate-90"
          viewBox={`0 0 ${size} ${size}`}
        >
          {/* Background ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth={strokeWidth}
          />
          {/* Progress ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={ringColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{
              transition: "stroke-dashoffset 0.1s linear, stroke 0.3s ease",
              animation:
                isFlashing
                  ? "hud-flash-red 0.5s infinite"
                  : "hud-pulse-ring 2s ease-in-out infinite",
            }}
          />
        </svg>

        {/* Inner number */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="text-lg sm:text-2xl font-bold tabular-nums"
            style={{ color: ringColor, transition: "color 0.3s ease" }}
          >
            {isExpired ? "0" : displaySeconds}
          </span>
        </div>
      </div>

      {/* Multiplier label */}
      {multiplierLabel && (
        <span
          className="mt-0.5 text-[10px] sm:text-xs font-bold tracking-wide"
          style={{ color: ringColor }}
        >
          {multiplierLabel}
        </span>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
//  2. StatusBar
// ═══════════════════════════════════════════════════════════════

interface StatusBarProps {
  effects: StatusEffect[];
}

export const StatusBar: FC<StatusBarProps> = ({ effects }) => {
  useHudStyles();

  // Track which effects are exiting
  const [visibleEffects, setVisibleEffects] = useState<
    (StatusEffect & { exiting?: boolean })[]
  >([]);
  const prevEffectsRef = useRef<StatusEffect[]>([]);

  useEffect(() => {
    const prevIds = new Set(prevEffectsRef.current.map((e) => e.id));
    const currentIds = new Set(effects.map((e) => e.id));

    // Mark removed effects as exiting
    const exitingEffects = prevEffectsRef.current
      .filter((e) => !currentIds.has(e.id))
      .map((e) => ({ ...e, exiting: true }));

    // Current effects (alive)
    const activeEffects = effects.map((e) => ({
      ...e,
      exiting: false,
    }));

    setVisibleEffects([...activeEffects, ...exitingEffects]);

    // Remove exiting effects after animation completes
    if (exitingEffects.length > 0) {
      const timeout = setTimeout(() => {
        setVisibleEffects((prev) => prev.filter((e) => !e.exiting));
      }, 400);
      return () => clearTimeout(timeout);
    }

    prevEffectsRef.current = effects;
  }, [effects]);

  // Keep prevEffectsRef updated outside the cleanup-prone effect
  useEffect(() => {
    prevEffectsRef.current = effects;
  }, [effects]);

  const [hoveredId, setHoveredId] = useState<string | null>(null);

  if (visibleEffects.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1.5 sm:gap-2">
      {visibleEffects.map((eff) => {
        const isBuff = eff.type === "buff";
        const glowColor = isBuff
          ? "rgba(34,197,94,0.4)"
          : "rgba(239,68,68,0.4)";
        const borderColor = isBuff
          ? "border-green-500/40"
          : "border-red-500/40";
        const isHovered = hoveredId === eff.id;

        return (
          <div
            key={eff.id}
            className="relative"
            onMouseEnter={() => setHoveredId(eff.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            {/* Pill */}
            <div
              className={`
                flex items-center gap-1 px-1.5 py-0.5 sm:px-2 sm:py-1
                rounded-full border ${borderColor}
                bg-black/60 backdrop-blur-sm
                text-[10px] sm:text-xs font-medium
                cursor-default select-none
              `}
              style={{
                boxShadow: `0 0 8px ${glowColor}`,
                animation: eff.exiting
                  ? "hud-fade-out 0.4s ease-out forwards"
                  : "hud-fade-in 0.3s ease-out",
              }}
            >
              <span className="text-sm sm:text-base">{eff.icon}</span>
              {/* Name visible on desktop, hidden on mobile */}
              <span className="hidden sm:inline text-white/90">{eff.name}</span>
              <span
                className={`tabular-nums ${
                  isBuff ? "text-green-400" : "text-red-400"
                }`}
              >
                {eff.duration}
              </span>
            </div>

            {/* Tooltip on hover */}
            {isHovered && !eff.exiting && (
              <div
                className="
                  absolute bottom-full left-1/2 -translate-x-1/2 mb-2
                  w-48 p-2 rounded-lg
                  bg-black/80 backdrop-blur-md border border-white/10
                  text-[11px] text-white/90 z-50
                  pointer-events-none
                "
                style={{ animation: "hud-fade-in 0.15s ease-out" }}
              >
                <div className="font-bold mb-0.5">
                  {eff.icon} {eff.name}
                </div>
                <div className="text-white/60 mb-1">{eff.description}</div>
                <div className="flex flex-col gap-0.5 text-[10px]">
                  {eff.effect.scoreMultiplier && eff.effect.scoreMultiplier !== 1 && (
                    <span>
                      スコア: x{eff.effect.scoreMultiplier.toFixed(1)}
                    </span>
                  )}
                  {eff.effect.emotionMultiplier && eff.effect.emotionMultiplier !== 1 && (
                    <span>
                      感情: x{eff.effect.emotionMultiplier.toFixed(1)}
                    </span>
                  )}
                  {eff.effect.timerExtension && eff.effect.timerExtension !== 0 && (
                    <span>
                      タイマー:{" "}
                      {eff.effect.timerExtension > 0 ? "+" : ""}
                      {eff.effect.timerExtension}秒
                    </span>
                  )}
                  <span className="text-white/40">
                    残り {eff.duration} ターン
                  </span>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
//  3. AchievementToast
// ═══════════════════════════════════════════════════════════════

interface AchievementToastProps {
  achievement: Achievement;
  onDone: () => void;
}

const RARITY_BORDER_COLORS: Record<AchievementRarity, string> = {
  common: "border-white/40",
  rare: "border-blue-400",
  epic: "border-purple-400",
  legendary: "border-amber-400",
};

const RARITY_GLOW: Record<AchievementRarity, string> = {
  common: "0 0 12px rgba(255,255,255,0.2)",
  rare: "0 0 16px rgba(59,130,246,0.5)",
  epic: "0 0 16px rgba(168,85,247,0.5)",
  legendary: "0 0 24px rgba(245,158,11,0.6), 0 0 48px rgba(245,158,11,0.3)",
};

export const AchievementToast: FC<AchievementToastProps> = ({
  achievement,
  onDone,
}) => {
  useHudStyles();

  const [phase, setPhase] = useState<"enter" | "visible" | "exit">("enter");

  useEffect(() => {
    // Enter -> visible
    const enterTimer = setTimeout(() => setPhase("visible"), 500);
    // Visible -> exit after 2.5s total
    const exitTimer = setTimeout(() => setPhase("exit"), 2000);
    // Done
    const doneTimer = setTimeout(() => onDone(), 2500);

    return () => {
      clearTimeout(enterTimer);
      clearTimeout(exitTimer);
      clearTimeout(doneTimer);
    };
  }, [onDone]);

  const rarity = achievement.rarity;
  const rarityMeta = RARITY_META[rarity];

  return (
    <div
      className={`
        fixed top-4 right-4 z-[100]
        max-w-[320px] w-full
        rounded-xl border-2 ${RARITY_BORDER_COLORS[rarity]}
        bg-black/80 backdrop-blur-md
        p-3 sm:p-4
      `}
      style={{
        boxShadow: RARITY_GLOW[rarity],
        animation:
          phase === "exit"
            ? "hud-slide-up-fade 0.6s ease-in forwards"
            : "hud-slide-down-bounce 0.6s ease-out",
      }}
    >
      {/* Header row */}
      <div className="flex items-center gap-3">
        {/* Icon */}
        <div className="text-3xl sm:text-4xl flex-shrink-0">
          {achievement.icon}
        </div>

        <div className="flex-1 min-w-0">
          {/* Rarity badge */}
          <span
            className="
              inline-block px-1.5 py-0.5 rounded text-[9px] sm:text-[10px]
              font-bold uppercase tracking-wider mb-0.5
            "
            style={{
              backgroundColor: rarityMeta.color + "30",
              color: rarityMeta.color,
              border: `1px solid ${rarityMeta.color}60`,
            }}
          >
            {rarityMeta.label}
          </span>

          {/* Title */}
          <div className="text-sm sm:text-base font-bold text-white truncate">
            {achievement.title}
          </div>

          {/* Description */}
          <div className="text-[11px] sm:text-xs text-white/60 leading-snug">
            {achievement.description}
          </div>
        </div>
      </div>

      {/* Unlock banner */}
      <div
        className="mt-2 text-center text-[10px] sm:text-xs font-bold tracking-widest"
        style={{ color: "#f97316" }}
      >
        ACHIEVEMENT UNLOCKED
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
//  4. EventPopup
// ═══════════════════════════════════════════════════════════════

interface EventPopupProps {
  event: GameEvent;
  onDismiss: () => void;
}

export const EventPopup: FC<EventPopupProps> = ({ event, onDismiss }) => {
  useHudStyles();

  const [phase, setPhase] = useState<"enter" | "visible" | "exit">("enter");
  const [revealedTitle, setRevealedTitle] = useState("");
  const titleRef = useRef(0);

  // Typewriter effect for title
  useEffect(() => {
    const chars = [...event.title];
    let idx = 0;
    setRevealedTitle("");

    const interval = setInterval(() => {
      idx++;
      setRevealedTitle(chars.slice(0, idx).join(""));
      if (idx >= chars.length) {
        clearInterval(interval);
      }
    }, 35);

    titleRef.current = window.setTimeout(() => {
      // nothing, just a ref
    }, 0);

    return () => clearInterval(interval);
  }, [event.title]);

  // Phase transitions
  useEffect(() => {
    const enterTimer = setTimeout(() => setPhase("visible"), 500);
    const exitStart = Math.max(event.duration - 500, 1000);
    const exitTimer = setTimeout(() => setPhase("exit"), exitStart);
    const doneTimer = setTimeout(() => onDismiss(), event.duration);

    return () => {
      clearTimeout(enterTimer);
      clearTimeout(exitTimer);
      clearTimeout(doneTimer);
    };
  }, [event.duration, onDismiss]);

  const eff = event.effect;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center pointer-events-none">
      {/* Dim overlay */}
      <div
        className="absolute inset-0 bg-black/40"
        style={{
          animation:
            phase === "exit"
              ? "hud-fade-out 0.5s ease-out forwards"
              : "hud-fade-in 0.3s ease-out",
        }}
      />

      {/* Event card */}
      <div
        className="
          relative w-[90%] max-w-md mx-auto
          bg-black/80 backdrop-blur-lg
          border border-white/10 rounded-2xl
          p-5 sm:p-6 text-center
          pointer-events-auto
        "
        style={{
          animation:
            phase === "exit"
              ? "hud-scale-blur-out 0.5s ease-in forwards"
              : "hud-scale-blur-in 0.5s ease-out",
        }}
      >
        {/* Icon */}
        <div
          className="text-5xl sm:text-6xl mb-3"
          style={{ animation: "hud-count-up-pop 0.6s ease-out" }}
        >
          {event.icon}
        </div>

        {/* Title with typewriter */}
        <h2
          className="text-xl sm:text-2xl font-black text-white mb-2 min-h-[2em]"
          style={{
            borderRight: revealedTitle.length < event.title.length
              ? "2px solid #f97316"
              : "2px solid transparent",
            animation:
              revealedTitle.length < event.title.length
                ? "hud-typewriter-cursor 0.6s step-end infinite"
                : undefined,
            display: "inline-block",
          }}
        >
          {revealedTitle}
        </h2>

        {/* Description */}
        <p className="text-sm sm:text-base text-white/70 leading-relaxed mb-4">
          {event.description}
        </p>

        {/* Effect indicators */}
        <div className="flex flex-wrap justify-center gap-2">
          {eff.emotionDelta !== undefined && eff.emotionDelta !== 0 && (
            <EffectBadge
              value={eff.emotionDelta}
              label="好感度"
              positive={eff.emotionDelta > 0}
            />
          )}
          {eff.scoreDelta !== undefined && eff.scoreDelta !== 0 && (
            <EffectBadge
              value={eff.scoreDelta}
              label="スコア"
              positive={eff.scoreDelta > 0}
            />
          )}
          {eff.timerDelta !== undefined && eff.timerDelta !== 0 && (
            <EffectBadge
              value={eff.timerDelta}
              label="秒"
              positive={eff.timerDelta > 0}
            />
          )}
          {eff.statusEffect && (
            <span
              className="
                inline-flex items-center gap-1 px-2.5 py-1 rounded-full
                text-xs font-bold
                border
              "
              style={{
                backgroundColor:
                  eff.statusEffect.type === "buff"
                    ? "rgba(34,197,94,0.15)"
                    : "rgba(239,68,68,0.15)",
                borderColor:
                  eff.statusEffect.type === "buff"
                    ? "rgba(34,197,94,0.4)"
                    : "rgba(239,68,68,0.4)",
                color:
                  eff.statusEffect.type === "buff" ? "#4ade80" : "#f87171",
              }}
            >
              <span>{eff.statusEffect.icon}</span>
              <span>{eff.statusEffect.name}</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

/** Small badge showing +/- values on event popups. */
const EffectBadge: FC<{
  value: number;
  label: string;
  positive: boolean;
}> = ({ value, label, positive }) => (
  <span
    className="
      inline-flex items-center gap-0.5 px-2.5 py-1
      rounded-full text-xs font-bold
    "
    style={{
      backgroundColor: positive
        ? "rgba(34,197,94,0.15)"
        : "rgba(239,68,68,0.15)",
      color: positive ? "#4ade80" : "#f87171",
    }}
  >
    {positive ? "+" : ""}
    {value} {label}
  </span>
);

// ═══════════════════════════════════════════════════════════════
//  5. RelationshipMeter
// ═══════════════════════════════════════════════════════════════

interface RelationshipMeterProps {
  emotion: number;
  prevEmotion: number;
}

const MILESTONES: { min: number; label: string }[] = [
  { min: 80, label: "完全信頼" },
  { min: 60, label: "信頼" },
  { min: 40, label: "好印象" },
  { min: 20, label: "普通" },
  { min: 1, label: "冷淡" },
  { min: 0, label: "警戒" },
];

function getMilestoneLabel(value: number): string {
  for (const ms of MILESTONES) {
    if (value >= ms.min) return ms.label;
  }
  return "警戒";
}

function getMeterGradient(value: number): string {
  // Red -> Orange -> Yellow -> Green -> Gold
  if (value <= 20) return "linear-gradient(90deg, #ef4444, #f97316)";
  if (value <= 40) return "linear-gradient(90deg, #f97316, #eab308)";
  if (value <= 60) return "linear-gradient(90deg, #eab308, #84cc16)";
  if (value <= 80) return "linear-gradient(90deg, #22c55e, #4ade80)";
  return "linear-gradient(90deg, #f59e0b, #fbbf24)";
}

export const RelationshipMeter: FC<RelationshipMeterProps> = ({
  emotion,
  prevEmotion,
}) => {
  useHudStyles();

  const delta = emotion - prevEmotion;
  const [showDelta, setShowDelta] = useState(false);
  const [heartPulse, setHeartPulse] = useState(false);
  const deltaKeyRef = useRef(0);

  useEffect(() => {
    if (delta !== 0) {
      deltaKeyRef.current++;
      setShowDelta(true);
      const timer = setTimeout(() => setShowDelta(false), 1200);

      if (delta > 0) {
        setHeartPulse(true);
        const hTimer = setTimeout(() => setHeartPulse(false), 600);
        return () => {
          clearTimeout(timer);
          clearTimeout(hTimer);
        };
      }
      return () => clearTimeout(timer);
    }
  }, [emotion, delta]);

  const clampedEmotion = Math.max(0, Math.min(100, emotion));
  const milestoneLabel = getMilestoneLabel(clampedEmotion);
  const isHighValue = clampedEmotion >= 70;

  return (
    <div className="flex items-center gap-2 w-full max-w-[200px] sm:max-w-[260px]">
      {/* Heart icon */}
      <div
        className="text-lg sm:text-xl flex-shrink-0"
        style={{
          animation: heartPulse ? "hud-heart-pulse 0.3s ease-out 2" : undefined,
        }}
      >
        {clampedEmotion >= 80 ? "💛" : clampedEmotion >= 40 ? "❤️" : "💔"}
      </div>

      {/* Bar container */}
      <div className="flex-1 relative">
        {/* Track */}
        <div
          className="h-3 sm:h-4 rounded-full bg-white/10 overflow-hidden relative"
          style={{
            boxShadow: isHighValue
              ? "0 0 12px rgba(245,158,11,0.3)"
              : undefined,
          }}
        >
          {/* Fill */}
          <div
            className="h-full rounded-full"
            style={{
              width: `${clampedEmotion}%`,
              background: getMeterGradient(clampedEmotion),
              transition: "width 0.5s ease-out",
              boxShadow: isHighValue
                ? "0 0 8px rgba(251,191,36,0.5)"
                : undefined,
            }}
          />
        </div>

        {/* Delta popup */}
        {showDelta && delta !== 0 && (
          <span
            key={deltaKeyRef.current}
            className="absolute -top-5 right-0 text-xs sm:text-sm font-bold"
            style={{
              color: delta > 0 ? "#4ade80" : "#f87171",
              animation: "hud-float-up 1.2s ease-out forwards",
            }}
          >
            {delta > 0 ? "+" : ""}
            {delta}
          </span>
        )}

        {/* Milestone label + value */}
        <div className="flex justify-between mt-0.5">
          <span className="text-[10px] sm:text-xs text-white/50">
            {milestoneLabel}
          </span>
          <span className="text-[10px] sm:text-xs text-white/70 tabular-nums font-medium">
            {clampedEmotion}
          </span>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
//  6. ScoreMultiplierDisplay
// ═══════════════════════════════════════════════════════════════

interface ScoreMultiplierDisplayProps {
  timerMultiplier: number;
  statusMultiplier: number;
  difficultyMultiplier: number;
  comboCount: number;
}

export const ScoreMultiplierDisplay: FC<ScoreMultiplierDisplayProps> = ({
  timerMultiplier,
  statusMultiplier,
  difficultyMultiplier,
  comboCount,
}) => {
  useHudStyles();

  const combined = useMemo(
    () => timerMultiplier * statusMultiplier * difficultyMultiplier,
    [timerMultiplier, statusMultiplier, difficultyMultiplier],
  );

  const [showBreakdown, setShowBreakdown] = useState(false);
  const [prevCombined, setPrevCombined] = useState(combined);
  const [animateMultiplier, setAnimateMultiplier] = useState(false);

  useEffect(() => {
    if (combined !== prevCombined) {
      setAnimateMultiplier(true);
      const timer = setTimeout(() => setAnimateMultiplier(false), 400);
      setPrevCombined(combined);
      return () => clearTimeout(timer);
    }
  }, [combined, prevCombined]);

  const comboEffect = useMemo(() => {
    if (comboCount >= 5) return "electric";
    if (comboCount >= 3) return "fire";
    return "none";
  }, [comboCount]);

  return (
    <div
      className="relative inline-flex items-center gap-2"
      onMouseEnter={() => setShowBreakdown(true)}
      onMouseLeave={() => setShowBreakdown(false)}
    >
      {/* Combined multiplier */}
      <div
        className="
          px-2 py-0.5 sm:px-3 sm:py-1 rounded-lg
          bg-black/60 backdrop-blur-sm border border-white/10
          text-sm sm:text-base font-black text-white tabular-nums
          cursor-default
        "
        style={{
          animation: animateMultiplier
            ? "hud-count-up-pop 0.4s ease-out"
            : undefined,
          color: combined >= 1.5 ? "#f97316" : combined < 1 ? "#f87171" : "#fff",
        }}
      >
        x{combined.toFixed(1)}
      </div>

      {/* Combo counter */}
      {comboCount > 0 && (
        <div
          className="
            flex items-center gap-0.5
            px-1.5 py-0.5 sm:px-2 rounded-lg
            bg-black/60 backdrop-blur-sm border border-white/10
            text-xs sm:text-sm font-bold
          "
          style={{
            animation:
              comboEffect === "fire"
                ? "hud-fire-flicker 1s ease-in-out infinite"
                : comboEffect === "electric"
                  ? "hud-electric 0.8s ease-in-out infinite"
                  : undefined,
            color:
              comboEffect === "electric"
                ? "#38bdf8"
                : comboEffect === "fire"
                  ? "#f97316"
                  : "#fff",
          }}
        >
          <span>
            {comboEffect === "electric"
              ? "⚡"
              : comboEffect === "fire"
                ? "🔥"
                : ""}
          </span>
          <span>{comboCount}</span>
          <span className="text-white/50 text-[10px] ml-0.5">COMBO</span>
        </div>
      )}

      {/* Breakdown tooltip */}
      {showBreakdown && (
        <div
          className="
            absolute top-full left-0 mt-2 z-50
            w-44 p-2.5 rounded-lg
            bg-black/85 backdrop-blur-md border border-white/10
            text-[11px] text-white/80
          "
          style={{ animation: "hud-fade-in 0.15s ease-out" }}
        >
          <div className="font-bold text-white/90 mb-1.5 text-xs">
            倍率内訳
          </div>
          <div className="flex justify-between mb-0.5">
            <span className="text-white/50">タイマー</span>
            <span className="tabular-nums">x{timerMultiplier.toFixed(1)}</span>
          </div>
          <div className="flex justify-between mb-0.5">
            <span className="text-white/50">ステータス</span>
            <span className="tabular-nums">
              x{statusMultiplier.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between mb-0.5">
            <span className="text-white/50">難易度</span>
            <span className="tabular-nums">
              x{difficultyMultiplier.toFixed(1)}
            </span>
          </div>
          <div className="border-t border-white/10 mt-1.5 pt-1.5 flex justify-between font-bold text-white">
            <span>合計</span>
            <span className="tabular-nums">x{combined.toFixed(2)}</span>
          </div>
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
//  7. DifficultySelector
// ═══════════════════════════════════════════════════════════════

interface DifficultySelectorProps {
  selected: string;
  onSelect: (difficulty: string) => void;
  difficulties: Record<string, DifficultyConfig>;
}

const DIFFICULTY_ICONS: Record<string, string> = {
  easy: "🟢",
  normal: "🟠",
  hard: "🔥",
};

const DIFFICULTY_TINTS: Record<string, { border: string; bg: string; glow: string }> = {
  easy: {
    border: "border-green-500",
    bg: "rgba(34,197,94,0.08)",
    glow: "rgba(34,197,94,0.5)",
  },
  normal: {
    border: "border-orange-500",
    bg: "rgba(249,115,22,0.08)",
    glow: "rgba(249,115,22,0.5)",
  },
  hard: {
    border: "border-red-500",
    bg: "rgba(239,68,68,0.08)",
    glow: "rgba(239,68,68,0.5)",
  },
};

export const DifficultySelector: FC<DifficultySelectorProps> = ({
  selected,
  onSelect,
  difficulties,
}) => {
  useHudStyles();

  const keys = Object.keys(difficulties);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 w-full max-w-2xl mx-auto">
      {keys.map((key) => {
        const config = difficulties[key];
        const isSelected = selected === key;
        const tint = DIFFICULTY_TINTS[key] ?? DIFFICULTY_TINTS.normal;
        const icon = DIFFICULTY_ICONS[key] ?? "🟠";

        return (
          <button
            key={key}
            onClick={() => onSelect(key)}
            className={`
              relative rounded-xl border-2 p-4 sm:p-5
              bg-black/60 backdrop-blur-sm
              text-left transition-all duration-200
              hover:scale-[1.02] active:scale-[0.98]
              cursor-pointer
              ${isSelected ? tint.border : "border-white/10"}
            `}
            style={{
              backgroundColor: isSelected ? tint.bg : undefined,
              boxShadow: isSelected
                ? `0 0 20px ${tint.glow}, inset 0 0 20px ${tint.bg}`
                : undefined,
              animation: isSelected
                ? "hud-difficulty-glow 2s ease-in-out infinite"
                : undefined,
              color: isSelected ? tint.glow : undefined,
            }}
          >
            {/* Icon + Label */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{icon}</span>
              <span className="text-lg sm:text-xl font-black text-white">
                {config.label}
              </span>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-white/60 mb-3 leading-relaxed">
              {config.description}
            </p>

            {/* Stats */}
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] sm:text-xs">
              <div className="flex items-center gap-1">
                <span className="text-white/40">制限時間</span>
                <span className="font-bold text-white/80">
                  {config.timerDuration}秒
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-white/40">スコア</span>
                <span className="font-bold text-white/80">
                  x{config.scoreMultiplier.toFixed(1)}
                </span>
              </div>
            </div>

            {/* Selected indicator */}
            {isSelected && (
              <div
                className="
                  absolute top-2 right-2
                  w-5 h-5 rounded-full
                  flex items-center justify-center
                  text-[10px] font-bold text-black
                "
                style={{ backgroundColor: tint.glow }}
              >
                ✓
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
//  8. GameOverStats
// ═══════════════════════════════════════════════════════════════

interface GameOverStatsProps {
  totalScore: number;
  emotion: number;
  maxCombo: number;
  grade: string;
  timerBonus: number;
  excellentCount: number;
  goodCount: number;
  badCount: number;
  achievements: Achievement[];
  timeSpent: number;
}

const GRADE_COLORS: Record<string, string> = {
  S: "#f59e0b",
  A: "#22c55e",
  B: "#3b82f6",
  C: "#9ca3af",
};

const GRADE_SHADOWS: Record<string, string> = {
  S: "0 0 40px rgba(245,158,11,0.6), 0 0 80px rgba(245,158,11,0.3)",
  A: "0 0 30px rgba(34,197,94,0.5)",
  B: "0 0 20px rgba(59,130,246,0.4)",
  C: "0 0 10px rgba(156,163,175,0.3)",
};

function useCountUp(target: number, duration: number = 1500, delay: number = 0): number {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const delayTimer = setTimeout(() => {
      const startTime = Date.now();
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease-out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        setValue(Math.round(target * eased));
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      requestAnimationFrame(animate);
    }, delay);

    return () => clearTimeout(delayTimer);
  }, [target, duration, delay]);

  return value;
}

export const GameOverStats: FC<GameOverStatsProps> = ({
  totalScore,
  emotion,
  maxCombo,
  grade,
  timerBonus,
  excellentCount,
  goodCount,
  badCount,
  achievements,
  timeSpent,
}) => {
  useHudStyles();

  // Staggered count-up animations
  const animScore = useCountUp(totalScore, 1500, 200);
  const animEmotion = useCountUp(emotion, 1200, 400);
  const animCombo = useCountUp(maxCombo, 800, 600);
  const animTimerBonus = useCountUp(timerBonus, 800, 800);
  const animExcellent = useCountUp(excellentCount, 800, 1000);
  const animGood = useCountUp(goodCount, 800, 1100);
  const animBad = useCountUp(badCount, 800, 1200);

  const [showGrade, setShowGrade] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setShowGrade(true), 1600);
    return () => clearTimeout(timer);
  }, []);

  const totalChoices = excellentCount + goodCount + badCount;

  // Star rating derived from grade
  const stars = useMemo(() => {
    switch (grade) {
      case "S": return 5;
      case "A": return 4;
      case "B": return 3;
      default: return 2;
    }
  }, [grade]);

  const formattedTime = useMemo(() => {
    const m = Math.floor(timeSpent / 60);
    const s = timeSpent % 60;
    return m > 0 ? `${m}分${s}秒` : `${s}秒`;
  }, [timeSpent]);

  return (
    <div className="w-full max-w-lg mx-auto space-y-4 sm:space-y-6">
      {/* ── Grade Display ── */}
      <div className="text-center">
        {showGrade ? (
          <div
            className="inline-block"
            style={{ animation: "hud-grade-entrance 0.8s ease-out" }}
          >
            <div
              className="text-7xl sm:text-8xl font-black"
              style={{
                color: GRADE_COLORS[grade] ?? GRADE_COLORS.C,
                textShadow: GRADE_SHADOWS[grade] ?? GRADE_SHADOWS.C,
              }}
            >
              {grade}
            </div>
            <div className="text-sm sm:text-base text-white/50 font-medium -mt-1">
              ランク
            </div>
          </div>
        ) : (
          <div className="h-24 sm:h-28" /> // placeholder
        )}

        {/* Stars */}
        {showGrade && (
          <div
            className="flex justify-center gap-1 mt-2"
            style={{ animation: "hud-fade-in 0.5s ease-out 0.4s both" }}
          >
            {Array.from({ length: 5 }, (_, i) => (
              <span
                key={i}
                className="text-xl sm:text-2xl"
                style={{
                  opacity: i < stars ? 1 : 0.2,
                  animation:
                    i < stars
                      ? `hud-count-up-pop 0.3s ease-out ${0.1 * i}s both`
                      : undefined,
                }}
              >
                ★
              </span>
            ))}
          </div>
        )}
      </div>

      {/* ── Stat Grid ── */}
      <div
        className="
          grid grid-cols-2 gap-2 sm:gap-3
          bg-black/50 backdrop-blur-sm rounded-2xl
          border border-white/10 p-3 sm:p-4
        "
      >
        <StatCell label="スコア" value={animScore} color="#f97316" delay={200} />
        <StatCell label="好感度" value={animEmotion} suffix="%" color="#f59e0b" delay={400} />
        <StatCell label="最大コンボ" value={animCombo} color="#3b82f6" delay={600} />
        <StatCell label="タイマーボーナス" value={animTimerBonus} suffix="pt" color="#22c55e" delay={800} />
      </div>

      {/* ── Choice Breakdown ── */}
      <div
        className="
          bg-black/50 backdrop-blur-sm rounded-2xl
          border border-white/10 p-3 sm:p-4
        "
      >
        <h3 className="text-xs sm:text-sm font-bold text-white/70 mb-3">
          選択内訳
        </h3>
        <div className="space-y-2">
          <BreakdownBar
            label="エクセレント"
            count={animExcellent}
            total={totalChoices}
            color="#22c55e"
            delay={1000}
          />
          <BreakdownBar
            label="グッド"
            count={animGood}
            total={totalChoices}
            color="#3b82f6"
            delay={1100}
          />
          <BreakdownBar
            label="NG行動"
            count={animBad}
            total={totalChoices}
            color="#ef4444"
            delay={1200}
          />
        </div>

        {/* Time */}
        <div className="mt-3 pt-3 border-t border-white/10 flex justify-between text-xs text-white/50">
          <span>クリア時間</span>
          <span className="font-medium text-white/70">{formattedTime}</span>
        </div>
      </div>

      {/* ── Achievements ── */}
      {achievements.length > 0 && (
        <div
          className="
            bg-black/50 backdrop-blur-sm rounded-2xl
            border border-white/10 p-3 sm:p-4
          "
          style={{ animation: "hud-fade-in 0.5s ease-out 1.5s both" }}
        >
          <h3 className="text-xs sm:text-sm font-bold text-white/70 mb-3">
            獲得実績
          </h3>
          <div className="space-y-2">
            {achievements.map((ach, idx) => {
              const rarityMeta = RARITY_META[ach.rarity];
              return (
                <div
                  key={ach.id}
                  className="
                    flex items-center gap-2.5 p-2 rounded-lg
                    bg-white/5 border border-white/5
                  "
                  style={{
                    animation: `hud-fade-in 0.4s ease-out ${1.6 + idx * 0.15}s both`,
                  }}
                >
                  <span className="text-xl sm:text-2xl flex-shrink-0">
                    {ach.icon}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs sm:text-sm font-bold text-white truncate">
                        {ach.title}
                      </span>
                      <span
                        className="
                          inline-block px-1 py-0.5 rounded
                          text-[8px] sm:text-[9px] font-bold uppercase
                        "
                        style={{
                          backgroundColor: rarityMeta.color + "25",
                          color: rarityMeta.color,
                        }}
                      >
                        {rarityMeta.label}
                      </span>
                    </div>
                    <div className="text-[10px] sm:text-[11px] text-white/50 truncate">
                      {ach.description}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

/** Single stat cell for the results grid. */
const StatCell: FC<{
  label: string;
  value: number;
  suffix?: string;
  color: string;
  delay: number;
}> = ({ label, value, suffix = "", color, delay }) => (
  <div
    className="text-center p-2 sm:p-3 rounded-xl bg-white/5"
    style={{ animation: `hud-count-up-pop 0.5s ease-out ${delay}ms both` }}
  >
    <div className="text-[10px] sm:text-xs text-white/50 mb-1">{label}</div>
    <div
      className="text-2xl sm:text-3xl font-black tabular-nums"
      style={{ color }}
    >
      {value}
      {suffix && (
        <span className="text-sm sm:text-base font-bold ml-0.5">{suffix}</span>
      )}
    </div>
  </div>
);

/** Breakdown bar with animated fill. */
const BreakdownBar: FC<{
  label: string;
  count: number;
  total: number;
  color: string;
  delay: number;
}> = ({ label, count, total, color, delay }) => {
  const pct = total > 0 ? (count / total) * 100 : 0;
  const [fillReady, setFillReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setFillReady(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] sm:text-xs text-white/60 w-24 sm:w-28 flex-shrink-0">
        {label}
      </span>
      <div className="flex-1 h-2.5 sm:h-3 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{
            width: fillReady ? `${pct}%` : "0%",
            backgroundColor: color,
            transition: "width 0.8s ease-out",
          }}
        />
      </div>
      <span
        className="text-xs sm:text-sm font-bold tabular-nums w-6 text-right"
        style={{ color }}
      >
        {count}
      </span>
    </div>
  );
};
