"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export function StickyCTA({ href }: { href: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const heroBtn = document.querySelector("[data-hero-cta]");
    if (!heroBtn) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(heroBtn);
    return () => observer.disconnect();
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 z-40 w-full border-t border-card-border bg-white/95 backdrop-blur-md px-6 py-3 animate-fade-in-up shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <div className="hidden sm:block">
          <span className="text-sm font-bold text-foreground">即キメAI</span>
          <span className="ml-2 text-xs text-muted">
            無料でロープレを体験
          </span>
        </div>
        <Link
          href={href}
          className="flex h-10 w-full items-center justify-center rounded-xl bg-accent px-6 text-sm font-bold text-white shadow-sm transition hover:bg-accent-hover sm:w-auto"
        >
          無料で試す
        </Link>
      </div>
    </div>
  );
}
