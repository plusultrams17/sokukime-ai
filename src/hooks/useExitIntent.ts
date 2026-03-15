"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface UseExitIntentOptions {
  enabled?: boolean;
  desktopMinStayMs?: number;
  mobileMinStayMs?: number;
  mobileScrollThreshold?: number; // px/sec
}

interface UseExitIntentReturn {
  triggered: boolean;
  reset: () => void;
}

export function useExitIntent(
  options: UseExitIntentOptions = {},
): UseExitIntentReturn {
  const {
    enabled = true,
    desktopMinStayMs = 5000,
    mobileMinStayMs = 15000,
    mobileScrollThreshold = 800,
  } = options;

  const [triggered, setTriggered] = useState(false);
  const mountedAt = useRef(Date.now());
  const firedRef = useRef(false);

  const reset = useCallback(() => {
    setTriggered(false);
    firedRef.current = false;
  }, []);

  useEffect(() => {
    if (!enabled || firedRef.current) return;

    mountedAt.current = Date.now();
    const isMobile = "ontouchstart" in window;

    const fire = () => {
      if (firedRef.current) return;
      firedRef.current = true;
      setTriggered(true);
    };

    if (!isMobile) {
      // Desktop: mouseleave toward top of viewport
      const handleMouseLeave = (e: MouseEvent) => {
        if (e.clientY > 0) return;
        if (Date.now() - mountedAt.current < desktopMinStayMs) return;
        fire();
      };

      document.documentElement.addEventListener("mouseleave", handleMouseLeave);
      return () => {
        document.documentElement.removeEventListener(
          "mouseleave",
          handleMouseLeave,
        );
      };
    } else {
      // Mobile: rapid scroll-up detection
      let lastScrollY = window.scrollY;
      let lastTime = Date.now();
      let rafId: number | null = null;

      const handleScroll = () => {
        if (rafId !== null) return;
        rafId = requestAnimationFrame(() => {
          rafId = null;
          const now = Date.now();
          const dt = (now - lastTime) / 1000; // seconds
          const dy = lastScrollY - window.scrollY; // positive = scrolling up

          if (
            dt > 0 &&
            dy / dt > mobileScrollThreshold &&
            now - mountedAt.current >= mobileMinStayMs
          ) {
            fire();
          }

          lastScrollY = window.scrollY;
          lastTime = now;
        });
      };

      window.addEventListener("scroll", handleScroll, { passive: true });
      return () => {
        window.removeEventListener("scroll", handleScroll);
        if (rafId !== null) cancelAnimationFrame(rafId);
      };
    }
  }, [
    enabled,
    desktopMinStayMs,
    mobileMinStayMs,
    mobileScrollThreshold,
  ]);

  return { triggered, reset };
}
