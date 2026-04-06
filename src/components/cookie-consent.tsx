"use client";

import { useState, useEffect } from "react";

const CONSENT_KEY = "cookie_consent";
export const CONSENT_CHANGE_EVENT = "cookie_consent_change";

export type ConsentStatus = "accepted" | "declined" | null;

export function getConsentStatus(): ConsentStatus {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(CONSENT_KEY) as ConsentStatus;
}

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!getConsentStatus()) setVisible(true);
  }, []);

  function handleAccept() {
    localStorage.setItem(CONSENT_KEY, "accepted");
    setVisible(false);
    window.dispatchEvent(new Event(CONSENT_CHANGE_EVENT));
  }

  function handleDecline() {
    localStorage.setItem(CONSENT_KEY, "declined");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-card-border bg-card/95 backdrop-blur-md p-4 shadow-xl">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-3 sm:flex-row sm:justify-between">
        <p className="text-sm text-muted text-center sm:text-left">
          当サイトではサービス改善のためCookieを使用しています。
          <a href="/legal/privacy" className="text-accent underline ml-1">詳細</a>
        </p>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={handleDecline}
            className="rounded-lg border border-card-border px-4 py-2 text-sm text-muted transition hover:text-foreground"
          >
            拒否
          </button>
          <button
            onClick={handleAccept}
            className="rounded-lg bg-accent px-4 py-2 text-sm font-bold text-white transition hover:bg-accent-hover"
          >
            同意する
          </button>
        </div>
      </div>
    </div>
  );
}
