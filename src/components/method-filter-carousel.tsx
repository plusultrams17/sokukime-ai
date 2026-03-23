"use client";

import { useRef, useState, useEffect, useCallback } from "react";

interface Method {
  name: string;
  desc: string;
  level: string;
}

interface MethodFilterCarouselProps {
  methods: Method[];
  levelColors: Record<string, string>;
}

/* ─── Method Step SVG Illustrations ─── */

function MethodScene({ step }: { step: number }) {
  const cls = "w-20 h-20";
  switch (step) {
    case 0:
      return (
        <svg viewBox="0 0 64 56" className={cls} fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
          <circle cx="18" cy="14" r="6" fill="white" />
          <path d="M18 20v14M18 26l-8-5M18 26l8 5" />
          <path d="M18 34l-5 14M18 34l5 14" />
          <circle cx="46" cy="14" r="6" fill="white" />
          <path d="M46 20v14M46 26l8-5M46 26l-8 5" />
          <path d="M46 34l-5 14M46 34l5 14" />
          <path d="M32 4l-2 4h4z" fill="white" stroke="none" />
          <path d="M32 2v3M29 5h6" strokeWidth="1.5" />
        </svg>
      );
    case 1:
      return (
        <svg viewBox="0 0 48 48" className={cls} fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
          <path d="M18 10a12 12 0 0 1 6 22c-2 2-3 4-3 6" />
          <path d="M18 10c-5 0-10 5-10 12s5 12 10 12" />
          <path d="M30 18a5 5 0 0 1 0 8" />
          <path d="M34 14a9 9 0 0 1 0 16" />
          <path d="M38 10a13 13 0 0 1 0 24" opacity="0.5" />
        </svg>
      );
    case 2:
      return (
        <svg viewBox="0 0 48 48" className={cls} fill="white" stroke="none" aria-hidden="true">
          <rect x="4" y="32" width="9" height="12" rx="1" />
          <rect x="17" y="24" width="9" height="20" rx="1" />
          <rect x="30" y="14" width="9" height="30" rx="1" />
          <path d="M6 30L22 18l14-8" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" />
          <polygon points="38,8 42,14 34,14" />
        </svg>
      );
    case 3:
      return (
        <svg viewBox="0 0 48 40" className={cls} fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M4 24l8-10 8 4 4-6" />
          <path d="M44 24l-8-10-8 4-4-6" />
          <path d="M12 24l6 6 5-3 5 5" />
          <path d="M36 24l-6 6-5-3-3 3" />
        </svg>
      );
    case 4:
      return (
        <svg viewBox="0 0 48 48" className={cls} fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M24 4L6 12v12c0 10 8 16 18 20 10-4 18-10 18-20V12L24 4z" />
          <path d="M16 24l5 5 10-10" strokeWidth="3" />
        </svg>
      );
    default:
      return null;
  }
}

export function MethodFilterCarousel({
  methods,
  levelColors,
}: MethodFilterCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const [duration, setDuration] = useState(30);
  const [activeLevel, setActiveLevel] = useState<string | null>(null);

  const levels = Object.keys(levelColors);
  const filtered = activeLevel
    ? methods.filter((m) => m.level === activeLevel)
    : methods;

  // Recalculate animation duration when filtered cards change
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    requestAnimationFrame(() => {
      const halfWidth = track.scrollWidth / 2;
      const pxPerSecond = 30;
      setDuration(Math.max(10, halfWidth / pxPerSecond));
    });
  }, [activeLevel]);

  const scroll = useCallback((dir: "left" | "right") => {
    const track = trackRef.current;
    if (!track) return;
    const parent = track.parentElement;
    if (!parent) return;
    const cardWidth = 312;
    parent.scrollBy({
      left: dir === "left" ? -cardWidth : cardWidth,
      behavior: "smooth",
    });
  }, []);

  function renderCards(prefix: string) {
    return filtered.map((m) => {
      const i = methods.indexOf(m);
      const color = levelColors[m.level] || "#0F6E56";
      return (
        <div key={`${prefix}-${m.name}`} className="comic-card" style={{ "--level-color": color } as React.CSSProperties}>
          <div className="card-header">
            <div className="card-avatar">{i + 1}</div>
            <div className="card-user-info">
              <p className="card-username">{m.name}</p>
              <p className="card-handle" style={{ color }}>{m.level}</p>
            </div>
          </div>
          <div className="card-content">
            <div className="card-image-container">
              <MethodScene step={i} />
            </div>
            <p className="card-caption">{m.desc}</p>
          </div>
        </div>
      );
    });
  }

  return (
    <>
      {/* Level filter buttons */}
      <div className="mx-auto mb-8 flex max-w-6xl flex-wrap items-center justify-center gap-3 px-6">
        <button
          type="button"
          onClick={() => setActiveLevel(null)}
          className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-bold transition-all duration-200 cursor-pointer"
          style={{
            backgroundColor: activeLevel === null ? "#f97316" : "rgba(249,115,22,0.15)",
            color: activeLevel === null ? "#fff" : "#f97316",
            boxShadow: activeLevel === null ? "0 4px 14px rgba(249,115,22,0.4)" : "none",
          }}
        >
          すべて
        </button>
        {levels.map((label) => {
          const color = levelColors[label];
          const isActive = activeLevel === label;
          return (
            <button
              key={label}
              type="button"
              onClick={() => setActiveLevel(label)}
              className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-bold transition-all duration-200 cursor-pointer"
              style={{
                backgroundColor: isActive ? color : `${color}22`,
                color: isActive ? "#fff" : color,
                boxShadow: isActive ? `0 4px 14px ${color}66` : "none",
              }}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Carousel */}
      {activeLevel ? (
        /* Filtered: static grid, no scroll */
        <div className="mx-auto flex max-w-6xl flex-wrap justify-center gap-8 px-6">
          {renderCards("a")}
        </div>
      ) : (
        /* All: infinite scroll carousel */
        <div
          className="method-carousel"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onTouchStart={() => setPaused(true)}
          onTouchEnd={() => setPaused(false)}
        >
          <button
            type="button"
            className="method-carousel__btn method-carousel__btn--left"
            onClick={() => scroll("left")}
            aria-label="前へ"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          <div className="method-carousel__viewport">
            <div
              ref={trackRef}
              className="method-carousel__track"
              key="all"
              style={{
                animationDuration: `${duration}s`,
                animationPlayState: paused ? "paused" : "running",
              }}
            >
              {renderCards("a")}
              {renderCards("b")}
            </div>
          </div>

          <button
            type="button"
            className="method-carousel__btn method-carousel__btn--right"
            onClick={() => scroll("right")}
            aria-label="次へ"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 6 15 12 9 18" />
            </svg>
          </button>
        </div>
      )}
    </>
  );
}
