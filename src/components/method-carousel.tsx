"use client";

import { useRef, useState, useEffect, useCallback } from "react";

interface MethodCarouselProps {
  children: React.ReactNode;
}

export function MethodCarousel({ children }: MethodCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const [duration, setDuration] = useState(30);

  // Calculate animation duration based on content width so speed is consistent
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    // Half width = one set of cards. Target ~30px/s.
    const halfWidth = track.scrollWidth / 2;
    const pxPerSecond = 30;
    setDuration(Math.max(10, halfWidth / pxPerSecond));
  }, [children]);

  const scroll = useCallback((dir: "left" | "right") => {
    const track = trackRef.current;
    if (!track) return;
    const parent = track.parentElement;
    if (!parent) return;
    const cardWidth = 312;
    parent.scrollBy({ left: dir === "left" ? -cardWidth : cardWidth, behavior: "smooth" });
  }, []);

  return (
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
          style={{
            animationDuration: `${duration}s`,
            animationPlayState: paused ? "paused" : "running",
          }}
        >
          {children}
          {children}
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
  );
}
