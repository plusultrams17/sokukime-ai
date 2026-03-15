"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useExitIntent } from "@/hooks/useExitIntent";
import {
  canShowPopup,
  markPopupDismissed,
  markPopupShownInSession,
} from "@/lib/popup-rules";

const POPUP_ID = "worksheet-exit";

interface WorksheetExitPopupProps {
  progressPercent: number;
  filledCount: number;
  totalCount: number;
}

export function WorksheetExitPopup({
  progressPercent,
  filledCount,
  totalCount,
}: WorksheetExitPopupProps) {
  const [open, setOpen] = useState(false);
  const [allowed, setAllowed] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<Element | null>(null);

  const remaining = totalCount - filledCount;

  useEffect(() => {
    setAllowed(canShowPopup(POPUP_ID));
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
    const cta = dialogRef.current?.querySelector<HTMLElement>("button");
    cta?.focus();
  }, [open]);

  const handleClose = useCallback(() => {
    markPopupDismissed(POPUP_ID);
    setOpen(false);
    if (previousFocus.current instanceof HTMLElement) {
      previousFocus.current.focus();
    }
  }, []);

  const handleContinue = useCallback(() => {
    // Just close popup — user stays on the page
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
      aria-labelledby="worksheet-exit-heading"
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
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>

        {/* Headline */}
        <h2
          id="worksheet-exit-heading"
          className="mb-2 text-center text-xl font-bold text-foreground"
        >
          入力途中のデータがあります
        </h2>

        {/* Body */}
        <p className="mb-4 text-center text-sm text-muted">
          あと <span className="font-bold text-accent">{remaining}項目</span>{" "}
          でAIがトークスクリプトを自動生成します！
        </p>

        {/* Progress bar */}
        <div className="mb-6 rounded-xl border border-card-border bg-background p-4">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="font-medium text-foreground">進捗</span>
            <span className="font-bold text-accent">
              {filledCount}/{totalCount} 項目
            </span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-card-border">
            <div
              className="h-full rounded-full bg-accent transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="mt-2 text-center text-xs text-muted">
            {progressPercent}% 完了
          </p>
        </div>

        {/* Primary CTA — stay on page */}
        <button
          onClick={handleContinue}
          className="flex h-12 w-full items-center justify-center rounded-xl bg-accent text-base font-bold text-white transition hover:bg-accent-hover"
        >
          続きを入力する
        </button>

        {/* Secondary — close with reassurance */}
        <button
          onClick={handleClose}
          className="mt-4 block w-full text-center text-sm text-muted transition hover:text-foreground"
        >
          保存して後で続ける
        </button>
        <p className="mt-1 text-center text-[11px] text-muted">
          &#10003; 入力データは自動保存されています
        </p>
      </div>
    </div>
  );
}
