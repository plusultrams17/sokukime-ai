"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useExitIntent } from "@/hooks/useExitIntent";
import {
  canShowPopup,
  markPopupDismissed,
  markPopupShownInSession,
} from "@/lib/popup-rules";

const POPUP_ID = "home-exit";

export function HomeExitPopup() {
  const [open, setOpen] = useState(false);
  const [allowed, setAllowed] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<Element | null>(null);

  // Check if we can show on mount
  useEffect(() => {
    setAllowed(canShowPopup(POPUP_ID));
  }, []);

  const { triggered } = useExitIntent({ enabled: allowed });

  // Show popup when exit intent triggers
  useEffect(() => {
    if (triggered && allowed) {
      previousFocus.current = document.activeElement;
      setOpen(true);
      markPopupShownInSession();
    }
  }, [triggered, allowed]);

  // Focus trap: focus CTA on open
  useEffect(() => {
    if (!open) return;
    const cta = dialogRef.current?.querySelector<HTMLElement>("a, button");
    cta?.focus();
  }, [open]);

  const handleClose = useCallback(() => {
    markPopupDismissed(POPUP_ID);
    setOpen(false);
    if (previousFocus.current instanceof HTMLElement) {
      previousFocus.current.focus();
    }
  }, []);

  // ESC key to close
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, handleClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="home-exit-heading"
    >
      <div
        ref={dialogRef}
        className="w-full max-w-md animate-fade-in-up rounded-2xl border border-card-border bg-card p-8"
      >
        {/* Close X */}
        <div className="mb-2 flex justify-end">
          <button
            onClick={handleClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-muted transition hover:bg-gray-100 hover:text-foreground"
            aria-label="閉じる"
          >
            <svg
              className="h-4 w-4"
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
        </div>

        {/* Icon */}
        <div className="mb-4 text-center text-4xl" aria-hidden="true">
          <svg
            className="mx-auto h-14 w-14 text-accent"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
        </div>

        {/* Headline */}
        <h2
          id="home-exit-heading"
          className="mb-2 text-center text-xl font-bold text-foreground"
        >
          あなたの営業力、今すぐ診断しませんか？
        </h2>

        {/* Body */}
        <p className="mb-2 text-center text-sm text-muted">
          たった3分のAIロープレで、5項目のスコアがわかります。
        </p>

        {/* Trust badges */}
        <p className="mb-6 text-center text-xs text-muted">
          &#10003; 登録不要 &#10003; 完全無料 &#10003; 60秒で開始
        </p>

        {/* CTA */}
        <Link
          href="/roleplay"
          className="flex h-12 w-full items-center justify-center rounded-xl bg-accent text-base font-bold text-white transition hover:bg-accent-hover"
          onClick={() => {
            markPopupDismissed(POPUP_ID);
          }}
        >
          無料で営業力診断する
        </Link>

        {/* Social proof */}
        <p className="mt-3 text-center text-xs text-muted">
          今月 128人 が営業力診断を受けました
        </p>

        {/* Decline */}
        <button
          onClick={handleClose}
          className="mt-4 block w-full text-center text-sm text-muted transition hover:text-foreground"
        >
          今はやめておく
        </button>
      </div>
    </div>
  );
}
