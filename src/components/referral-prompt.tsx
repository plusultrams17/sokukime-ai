"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const DISMISS_KEY = "referral-prompt-dismissed";
const DISMISS_DAYS = 7;

interface ReferralPromptProps {
  score: number;
}

export function ReferralPrompt({ score }: ReferralPromptProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (score < 70) return;

    // 非表示期間中かチェック
    const dismissed = localStorage.getItem(DISMISS_KEY);
    if (dismissed) {
      const dismissedAt = new Date(dismissed).getTime();
      const now = Date.now();
      if (now - dismissedAt < DISMISS_DAYS * 24 * 60 * 60 * 1000) {
        return;
      }
    }

    // 少し遅延して表示（スコア表示後に自然に現れるように）
    const timer = setTimeout(() => setVisible(true), 2000);
    return () => clearTimeout(timer);
  }, [score]);

  function handleDismiss() {
    localStorage.setItem(DISMISS_KEY, new Date().toISOString());
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-40 w-80 animate-fade-in-up">
      <div className="rounded-2xl border border-accent/30 bg-card p-5 shadow-xl">
        <button
          onClick={handleDismiss}
          className="absolute right-3 top-3 text-muted hover:text-foreground"
          aria-label="閉じる"
        >
          &times;
        </button>

        <div className="mb-2 text-lg">🎉</div>
        <h3 className="mb-1 text-sm font-bold">素晴らしいスコアです！</h3>
        <p className="mb-3 text-xs text-muted">
          友達に紹介して、お互い ¥1,000 OFF で営業力アップしませんか？
        </p>
        <Link
          href="/referral"
          className="flex h-9 w-full items-center justify-center rounded-lg bg-accent text-xs font-bold text-white transition hover:bg-accent-hover"
        >
          紹介プログラムを見る
        </Link>
      </div>
    </div>
  );
}
