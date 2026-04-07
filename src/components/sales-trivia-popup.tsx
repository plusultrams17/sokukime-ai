"use client";

import { useState, useEffect } from "react";
import { getTodayTrivia } from "@/lib/sales-trivia";

const CATEGORY_COLORS: Record<string, string> = {
  "心理学": "bg-purple-500/15 text-purple-300",
  "見た目": "bg-blue-500/15 text-blue-300",
  "コミュニケーション": "bg-emerald-500/15 text-emerald-300",
  "データ": "bg-amber-500/15 text-amber-300",
  "交渉術": "bg-rose-500/15 text-rose-300",
};

const STORAGE_KEY = "trivia-dismissed";

export function SalesTriviaPopup() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const today = new Date().toDateString();
    if (sessionStorage.getItem(STORAGE_KEY) === today) return;

    const timer = setTimeout(() => setVisible(true), 4000);
    return () => clearTimeout(timer);
  }, []);

  function dismiss() {
    setVisible(false);
    sessionStorage.setItem(STORAGE_KEY, new Date().toDateString());
  }

  if (!visible) return null;

  const trivia = getTodayTrivia();
  const colorClass = CATEGORY_COLORS[trivia.category] || "bg-white/10 text-white/60";

  return (
    <div
      className="fixed right-4 bottom-4 z-50 w-[340px] max-w-[calc(100vw-2rem)] animate-slide-up"
    >
      <div
        className="rounded-2xl border border-white/10 p-4 shadow-2xl backdrop-blur-xl"
        style={{ background: "rgba(20, 20, 25, 0.92)" }}
      >
        {/* Header */}
        <div className="mb-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className="flex h-6 w-6 items-center justify-center rounded-full"
              style={{ background: "rgba(249, 115, 22, 0.15)" }}
            >
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#f97316"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M12 2a7 7 0 0 1 7 7c0 2.4-1.2 4.5-3 5.7V17a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-2.3C6.2 13.5 5 11.4 5 9a7 7 0 0 1 7-7z" />
                <line x1="9" y1="21" x2="15" y2="21" />
              </svg>
            </span>
            <span className="text-xs font-bold text-white/70">今日の営業豆知識</span>
          </div>
          <button
            onClick={dismiss}
            className="flex h-6 w-6 items-center justify-center rounded-full text-white/30 transition hover:bg-white/10 hover:text-white/60"
            aria-label="閉じる"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <p className="mb-2 text-[13px] leading-relaxed text-white/90">
          {trivia.fact}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-white/35">{trivia.source}</span>
          <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${colorClass}`}>
            {trivia.category}
          </span>
        </div>
      </div>
    </div>
  );
}
