"use client";

import { useState } from "react";
import Link from "next/link";

interface UpgradeModalProps {
  open: boolean;
  onClose: () => void;
}

export function UpgradeModal({ open, onClose }: UpgradeModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  if (!open) return null;

  async function handleUpgrade() {
    setIsLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      setIsLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-md animate-fade-in-up rounded-2xl border border-card-border bg-card p-8">
        <div className="mb-4 text-center text-4xl">📈</div>
        <h2 className="mb-2 text-center text-xl font-bold">
          もっと練習して、もっと売れる営業マンへ
        </h2>
        <p className="mb-6 text-center text-sm text-muted">
          トップ営業マンは「練習量」が違います。
          <br />
          Proプランで毎日無制限にロープレしましょう。
        </p>

        <div className="mb-4 rounded-xl border border-accent/30 bg-accent/5 p-4">
          <div className="mb-3 text-xs text-muted text-center">比べてみてください</div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted">営業研修1回</span>
            <span className="text-sm text-muted line-through">¥50,000〜</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-accent">即キメAI Pro</span>
            <span className="text-lg font-bold text-accent">¥2,980<span className="text-xs font-normal text-muted">/月</span></span>
          </div>
        </div>

        <div className="mb-4 text-center text-xs text-muted">
          <span className="text-accent font-medium">500+</span> 人の営業マンがProで練習中
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={handleUpgrade}
            disabled={isLoading}
            className="flex h-12 w-full items-center justify-center rounded-xl bg-accent text-base font-bold text-white transition hover:bg-accent-hover disabled:opacity-60"
          >
            {isLoading ? "処理中..." : "Proプランにアップグレード"}
          </button>
          <div className="text-center text-[11px] text-muted">
            ✓ いつでも解約OK ✓ Stripe安全決済
          </div>
          <button
            onClick={onClose}
            className="text-sm text-muted transition hover:text-foreground"
          >
            無料プランを続ける
          </button>
          <Link
            href="/pricing"
            className="text-center text-xs text-muted transition hover:text-accent"
          >
            料金プランの詳細を見る →
          </Link>
        </div>
      </div>
    </div>
  );
}
