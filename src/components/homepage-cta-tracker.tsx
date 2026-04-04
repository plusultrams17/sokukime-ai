"use client";

import { useEffect } from "react";
import { trackCTAClick } from "@/lib/tracking";

/**
 * Attaches click tracking to all CTA links on the homepage.
 * Detects .lp-cta-btn clicks and classifies by section position.
 */
export function HomepageCTATracker() {
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = e.target as HTMLElement;
      const link = target.closest("a.lp-cta-btn") as HTMLAnchorElement | null;
      if (!link) return;

      const section = link.closest("section");
      if (!section) return;

      const allSections = document.querySelectorAll("section");
      const idx = Array.from(allSections).indexOf(section);
      const href = link.getAttribute("href") || "/learn";

      if (idx === 0) {
        trackCTAClick("hero_learn", "homepage_hero", href);
      } else if (idx <= 2) {
        trackCTAClick("solution_learn", "homepage_solution", href);
      } else {
        trackCTAClick("final_learn", "homepage_final_cta", href);
      }
    }

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return null;
}
