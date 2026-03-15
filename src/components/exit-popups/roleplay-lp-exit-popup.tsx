"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useExitIntent } from "@/hooks/useExitIntent";
import {
  canShowPopup,
  markPopupDismissed,
  markPopupShownInSession,
} from "@/lib/popup-rules";

const POPUP_ID = "roleplay-lp-exit";

export function RoleplayLpExitPopup() {
  const [open, setOpen] = useState(false);
  const [allowed, setAllowed] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<Element | null>(null);

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
      aria-labelledby="roleplay-lp-exit-heading"
    >
      <div
        ref={dialogRef}
        className="w-full max-w-md animate-fade-in-up rounded-2xl border border-card-border bg-card p-8"
      >
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

        <div className="mb-4 text-center" aria-hidden="true">
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
              d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
            />
          </svg>
        </div>

        <h2
          id="roleplay-lp-exit-heading"
          className="mb-2 text-center text-xl font-bold text-foreground"
        >
          営業ロープレ、やらずに帰りますか？
        </h2>

        <p className="mb-2 text-center text-sm text-muted">
          たった3分でAIがあなたの営業力を5項目で採点します。
        </p>

        <p className="mb-6 text-center text-xs text-muted">
          &#10003; 登録不要 &#10003; 完全無料 &#10003; 60秒で開始
        </p>

        <Link
          href="/roleplay"
          className="flex h-12 w-full items-center justify-center rounded-xl bg-accent text-base font-bold text-white transition hover:bg-accent-hover"
          onClick={() => {
            markPopupDismissed(POPUP_ID);
          }}
        >
          無料でAIとロープレする
        </Link>

        <p className="mt-3 text-center text-xs text-muted">
          今月 128人 がAIロープレを体験しました
        </p>

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
