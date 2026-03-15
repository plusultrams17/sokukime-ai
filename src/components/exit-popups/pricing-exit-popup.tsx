"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useExitIntent } from "@/hooks/useExitIntent";
import {
  canShowPopup,
  markPopupDismissed,
  markPopupShownInSession,
} from "@/lib/popup-rules";

const POPUP_ID = "pricing-exit";

export function PricingExitPopup() {
  const [open, setOpen] = useState(false);
  const [allowed, setAllowed] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<Element | null>(null);

  useEffect(() => {
    setAllowed(canShowPopup(POPUP_ID, 14)); // 14-day cooldown for pricing
  }, []);

  const { triggered } = useExitIntent({ enabled: allowed });

  useEffect(() => {
    if (triggered && allowed) {
      previousFocus.current = document.activeElement;
      setOpen(true);
      markPopupShownInSession();
    }
  }, [triggered, allowed]);

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
      aria-labelledby="pricing-exit-heading"
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

        {/* Headline */}
        <h2
          id="pricing-exit-heading"
          className="mb-2 text-center text-xl font-bold text-foreground"
        >
          まだ迷っていますか？
        </h2>

        {/* Body */}
        <p className="mb-5 text-center text-sm text-muted">
          まずは無料で1回試してみてください。
          <br />
          気に入らなければ、それまでです。
        </p>

        {/* Testimonial card */}
        <div className="mb-6 rounded-xl border border-card-border bg-background p-4">
          <div className="mb-3 flex items-start justify-between">
            <div>
              <p className="text-sm font-bold text-foreground">T.S.</p>
              <p className="text-xs text-muted">不動産営業 / 入社2年目</p>
            </div>
            <div className="flex flex-col items-center rounded-lg bg-accent/10 px-2.5 py-1">
              <span className="text-[10px] text-muted">スコア</span>
              <span className="text-base font-bold text-accent">78</span>
            </div>
          </div>
          <p className="text-sm leading-relaxed text-muted">
            &ldquo;毎日練習できるから、クロージングに自信がついた。&rdquo;
          </p>
        </div>

        {/* Risk removal */}
        <p className="mb-4 text-center text-xs text-muted">
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
          まずは無料で試してみる
        </Link>

        {/* Decline */}
        <button
          onClick={handleClose}
          className="mt-4 block w-full text-center text-sm text-muted transition hover:text-foreground"
        >
          もう少し検討する
        </button>
      </div>
    </div>
  );
}
