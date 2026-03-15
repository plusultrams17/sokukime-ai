"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { trackScrollDepth, resetScrollTracking } from "@/lib/tracking";

const THRESHOLDS = [25, 50, 75, 100];

export function ScrollDepthTracker() {
  const pathname = usePathname();

  useEffect(() => {
    resetScrollTracking();

    function handleScroll() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;

      const percent = Math.round((scrollTop / docHeight) * 100);

      for (const threshold of THRESHOLDS) {
        if (percent >= threshold) {
          trackScrollDepth(threshold, pathname);
        }
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  return null;
}
