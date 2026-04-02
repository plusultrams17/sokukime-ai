"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getActivePromotion, getCampaignTimeRemaining, type Promotion } from "@/lib/promotions";
import { useProCheck } from "@/hooks/useProCheck";

const STORAGE_KEY = "promo_banner_dismissed";

export function PromoBanner() {
  const [promo, setPromo] = useState<Promotion | null>(null);
  const [dismissed, setDismissed] = useState(true); // Start hidden to avoid flash
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const isPro = useProCheck();

  useEffect(() => {
    // Wait for Pro check to resolve
    if (isPro === null) return;
    // Don't show to Pro users
    if (isPro) return;

    const active = getActivePromotion();
    if (!active) return;

    // Check if dismissed for this specific campaign
    const dismissedId = localStorage.getItem(STORAGE_KEY);
    if (dismissedId === active.id) return;

    setPromo(active);
    setDismissed(false);
    setTimeLeft(getCampaignTimeRemaining(active.endDate));
  }, [isPro]);

  // Countdown timer
  useEffect(() => {
    if (!promo || dismissed) return;

    const interval = setInterval(() => {
      const remaining = getCampaignTimeRemaining(promo.endDate);
      setTimeLeft(remaining);
      // Auto-hide when campaign ends
      if (remaining.days === 0 && remaining.hours === 0 && remaining.minutes === 0 && remaining.seconds === 0) {
        setDismissed(true);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [promo, dismissed]);

  if (dismissed || !promo) return null;

  function handleDismiss() {
    setDismissed(true);
    if (promo) {
      localStorage.setItem(STORAGE_KEY, promo.id);
    }
  }

  return (
    <div className="relative bg-gradient-to-r from-accent to-orange-600 px-4 py-2.5 text-center text-white">
      <div className="mx-auto flex max-w-4xl items-center justify-center gap-3 text-sm">
        <span className="font-bold">{promo.message}</span>
        <span className="hidden sm:inline text-white/80">|</span>
        <span className="hidden sm:inline text-xs text-white/90">
          残り {timeLeft.days}日 {String(timeLeft.hours).padStart(2, "0")}:{String(timeLeft.minutes).padStart(2, "0")}:{String(timeLeft.seconds).padStart(2, "0")}
        </span>
        <Link
          href={promo.ctaUrl}
          className="rounded-md bg-white/20 px-3 py-1 text-xs font-bold text-white transition hover:bg-white/30"
        >
          {promo.ctaText}
        </Link>
      </div>
      <button
        onClick={handleDismiss}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-white/60 transition hover:text-white"
        aria-label="バナーを閉じる"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  );
}
