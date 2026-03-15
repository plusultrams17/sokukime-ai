"use client";

import { useEffect } from "react";
import { trackCTAClick } from "@/lib/tracking";

/**
 * Attaches click tracking to all CTA links on the homepage.
 * Uses event delegation on .morph-btn (hero/before-after/final CTAs),
 * .plan .button (beta CTA), and pricing link.
 */
export function HomepageCTATracker() {
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = e.target as HTMLElement;
      const link = target.closest("a, button") as HTMLElement | null;
      if (!link) return;

      // Hero CTA (morph-btn inside [data-hero-cta])
      if (link.closest("[data-hero-cta]") && link.classList.contains("morph-btn")) {
        trackCTAClick("hero_roleplay", "homepage_hero", "/roleplay");
        return;
      }

      // morph-btn in Before/After section
      const baSection = link.closest("section");
      if (link.classList.contains("morph-btn") && baSection && !link.closest("[data-hero-cta]")) {
        // Check if it's the before/after section CTA or the final CTA
        const allSections = document.querySelectorAll("section");
        const sectionIndex = Array.from(allSections).indexOf(baSection);
        if (sectionIndex <= 3) {
          trackCTAClick("before_after_roleplay", "homepage_before_after", "/roleplay");
        } else {
          trackCTAClick("final_roleplay", "homepage_final_cta", "/roleplay");
        }
        return;
      }

      // Beta test section CTA
      if (link.classList.contains("button") && link.closest(".plan")) {
        trackCTAClick("beta_roleplay", "homepage_beta_section", "/roleplay");
        return;
      }

      // Pricing link at bottom
      const href = link.getAttribute("href");
      if (href === "/pricing" && link.closest("section")) {
        trackCTAClick("pricing_link", "homepage_final_cta", "/pricing");
        return;
      }

      // Service category cards
      if (link.classList.contains("continue-application") && href) {
        const name = href.replace("/", "");
        trackCTAClick(`service_${name}`, "homepage_services", href);
      }
    }

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return null;
}
