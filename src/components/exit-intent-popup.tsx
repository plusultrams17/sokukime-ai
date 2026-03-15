"use client";

import { useState, useEffect, useRef, useCallback, type ReactNode } from "react";
import { useExitIntent } from "@/hooks/useExitIntent";
import { useProCheck } from "@/hooks/useProCheck";
import {
  canShowPopup,
  markPopupDismissed,
  markPopupShownInSession,
} from "@/lib/popup-rules";

/** Actions passed to children render function */
export interface PopupActions {
  /** Close the popup without setting cooldown */
  close: () => void;
  /** Close the popup AND set cooldown (dismiss for N days) */
  dismiss: () => void;
}

interface ExitIntentPopupProps {
  /** Unique ID for cooldown/session tracking */
  popupId: string;
  /** Dismiss cooldown in days (default: 7) */
  cooldownDays?: number;
  /** Minimum time on page before triggering (desktop, ms) */
  desktopMinStayMs?: number;
  /** Minimum time on page before triggering (mobile, ms) */
  mobileMinStayMs?: number;
  /** Additional condition — popup only fires if true */
  extraCondition?: boolean;
  /** aria-labelledby ID for the heading */
  headingId: string;
  /** Render function receiving close/dismiss actions */
  children: ReactNode | ((actions: PopupActions) => ReactNode);
}

/**
 * Shared exit-intent popup shell.
 *
 * Features:
 * - Exit-intent trigger (desktop: mouse leave top / mobile: fast scroll up)
 * - 1 popup per session
 * - Configurable cooldown (default 7 days)
 * - Pro user exclusion
 * - ESC key to close
 * - Click-outside to close
 * - Focus trap (focuses first interactive element on open)
 * - prefers-reduced-motion: handled globally in globals.css
 */
export function ExitIntentPopup({
  popupId,
  cooldownDays = 7,
  desktopMinStayMs = 5000,
  mobileMinStayMs = 15000,
  extraCondition = true,
  headingId,
  children,
}: ExitIntentPopupProps) {
  const [open, setOpen] = useState(false);
  const [allowed, setAllowed] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<Element | null>(null);
  const isPro = useProCheck();

  // Check if we can show on mount (and when isPro resolves)
  useEffect(() => {
    if (isPro === null) return; // still loading
    if (isPro) {
      setAllowed(false);
      return;
    }
    setAllowed(canShowPopup(popupId, cooldownDays) && extraCondition);
  }, [isPro, popupId, cooldownDays, extraCondition]);

  const { triggered } = useExitIntent({
    enabled: allowed,
    desktopMinStayMs,
    mobileMinStayMs,
  });

  // Show popup when exit intent triggers
  useEffect(() => {
    if (triggered && allowed) {
      previousFocus.current = document.activeElement;
      setOpen(true);
      markPopupShownInSession();
    }
  }, [triggered, allowed]);

  // Focus trap: focus first interactive element on open
  useEffect(() => {
    if (!open) return;
    const el = dialogRef.current?.querySelector<HTMLElement>("a, button");
    el?.focus();
  }, [open]);

  const restoreFocus = useCallback(() => {
    if (previousFocus.current instanceof HTMLElement) {
      previousFocus.current.focus();
    }
  }, []);

  /** Close without setting cooldown */
  const close = useCallback(() => {
    setOpen(false);
    restoreFocus();
  }, [restoreFocus]);

  /** Close and set cooldown (dismiss for N days) */
  const dismiss = useCallback(() => {
    markPopupDismissed(popupId);
    setOpen(false);
    restoreFocus();
  }, [popupId, restoreFocus]);

  // ESC key to close (treats as dismiss)
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismiss();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, dismiss]);

  if (!open) return null;

  const actions: PopupActions = { close, dismiss };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) dismiss();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby={headingId}
    >
      <div
        ref={dialogRef}
        className="w-full max-w-md animate-fade-in-up rounded-2xl border border-card-border bg-card p-8"
      >
        {/* Close X */}
        <div className="mb-2 flex justify-end">
          <button
            onClick={dismiss}
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

        {typeof children === "function" ? children(actions) : children}
      </div>
    </div>
  );
}
