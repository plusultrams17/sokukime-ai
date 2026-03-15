"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  hasShownSlideInThisSession,
  markSlideInShownInSession,
} from "@/lib/popup-rules";

interface ScrollSlideInProps {
  children: React.ReactNode;
  scrollThreshold?: number;
  autoDismissMs?: number;
  sessionKey: string;
}

export function ScrollSlideIn({
  children,
  scrollThreshold = 0.5,
  autoDismissMs = 15000,
  sessionKey,
}: ScrollSlideInProps) {
  const [visible, setVisible] = useState(false);
  const [dismissing, setDismissing] = useState(false);
  const hasTriggered = useRef(false);

  const dismiss = useCallback(() => {
    setDismissing(true);
    markSlideInShownInSession(sessionKey);
    setTimeout(() => {
      setVisible(false);
      setDismissing(false);
    }, 300);
  }, [sessionKey]);

  // Scroll depth detection
  useEffect(() => {
    if (hasShownSlideInThisSession(sessionKey)) return;

    const handleScroll = () => {
      if (hasTriggered.current) return;
      const scrollHeight = document.body.scrollHeight - window.innerHeight;
      if (scrollHeight <= 0) return;
      const ratio = window.scrollY / scrollHeight;
      if (ratio >= scrollThreshold) {
        hasTriggered.current = true;
        setVisible(true);
        markSlideInShownInSession(sessionKey);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrollThreshold, sessionKey]);

  // Auto-dismiss timer
  useEffect(() => {
    if (!visible || dismissing) return;
    const timer = setTimeout(dismiss, autoDismissMs);
    return () => clearTimeout(timer);
  }, [visible, dismissing, autoDismissMs, dismiss]);

  if (!visible) return null;

  return (
    <div
      className={`fixed bottom-20 right-4 z-30 max-w-xs sm:bottom-6 sm:right-6 ${
        dismissing ? "animate-slide-out-right" : "animate-slide-in-right"
      }`}
    >
      <div className="relative rounded-xl border border-card-border bg-card p-4 shadow-lg">
        {/* Close button */}
        <button
          onClick={dismiss}
          className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full text-muted transition hover:bg-gray-100 hover:text-foreground"
          aria-label="閉じる"
        >
          <svg
            className="h-3.5 w-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {children}
      </div>
    </div>
  );
}
