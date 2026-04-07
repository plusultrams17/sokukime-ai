"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { trackCTAClick } from "@/lib/tracking";

interface StickyCTAProps {
  ctaText?: string;
  ctaHref?: string;
  subtitle?: string;
  brandName?: string;
  trackingId?: string;
  onCtaClick?: () => void;
}

export function StickyCTA({
  ctaText = "30秒で診断する",
  ctaHref = "/diagnose",
  subtitle = "30秒で営業力を無料診断",
  brandName = "成約コーチAI",
  trackingId = "sticky_diagnosis",
  onCtaClick,
}: StickyCTAProps) {
  const [pastHero, setPastHero] = useState(false);
  const [footerVisible, setFooterVisible] = useState(false);

  useEffect(() => {
    const heroBtn = document.querySelector("[data-hero-cta]");
    if (!heroBtn) return;
    const observer = new IntersectionObserver(
      ([entry]) => setPastHero(!entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(heroBtn);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const footer = document.querySelector("footer");
    if (!footer) return;
    const observer = new IntersectionObserver(
      ([entry]) => setFooterVisible(entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  const visible = pastHero && !footerVisible;

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 z-40 w-full border-t border-card-border bg-white/95 backdrop-blur-md px-6 py-3 animate-fade-in-up shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
        <div className="hidden sm:block">
          <span className="text-sm font-bold text-foreground">{brandName}</span>
          <span className="ml-2 text-xs text-muted">
            {subtitle}
          </span>
        </div>
        <div className="flex w-full items-center justify-center gap-3 sm:w-auto">
          <Link
            href="/roleplay"
            scroll={true}
            className="hidden text-xs font-bold text-accent transition hover:underline sm:inline-flex"
          >
            AIで練習する
          </Link>
          <div className="flex flex-col items-center sm:flex-row sm:gap-3">
            <span className="mb-1 text-[10px] text-muted sm:hidden">{subtitle}</span>
            <Link
              href={ctaHref}
              scroll={true}
              onClick={(e) => {
                trackCTAClick(trackingId, "sticky_cta", ctaHref);
                if (onCtaClick) {
                  e.preventDefault();
                  onCtaClick();
                }
              }}
              className="flex h-10 w-full items-center justify-center rounded-xl bg-accent px-5 text-sm font-bold text-white shadow-sm transition hover:bg-accent-hover sm:w-auto"
            >
              {ctaText}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
