"use client";

import { useRef, useEffect, useCallback } from "react";

interface MethodCarouselProps {
  children: React.ReactNode;
}

export function MethodCarousel({ children }: MethodCarouselProps) {
  const viewportRef = useRef<HTMLDivElement>(null);

  // Auto-scroll — never stops
  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    let raf: number;
    let last = 0;
    const speed = 0.5; // px per frame (~30px/s at 60fps)

    const tick = (ts: number) => {
      if (last) {
        viewport.scrollLeft += speed;
        // loop: when scrolled past halfway (duplicated content), jump back
        const half = viewport.scrollWidth / 2;
        if (viewport.scrollLeft >= half) {
          viewport.scrollLeft -= half;
        }
      }
      last = ts;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const scroll = useCallback((dir: "left" | "right") => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const cardWidth = 312; // ~18em + gap
    viewport.scrollBy({ left: dir === "left" ? -cardWidth : cardWidth, behavior: "smooth" });
  }, []);

  return (
    <div className="method-carousel">
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

      <div className="method-carousel__viewport" ref={viewportRef}>
        <div className="method-carousel__track">
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
