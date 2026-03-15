"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { TEAM_DISCOUNT_TIERS } from "@/lib/referral";
import type { ReferralStats } from "@/lib/referral";
import {
  trackReferralCodeCopied,
  trackReferralShareClicked,
} from "@/lib/tracking";

export default function ReferralPage() {
  const [code, setCode] = useState<string | null>(null);
  const [shareUrl, setShareUrl] = useState("");
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/referral/code")
      .then((r) => r.json())
      .then((data) => {
        if (data.code) {
          setCode(data.code);
          setShareUrl(data.shareUrl);
          setStats(data.stats);
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  function handleCopy() {
    if (!shareUrl) return;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    trackReferralCodeCopied();
    setTimeout(() => setCopied(false), 2000);
  }

  const shareText =
    "成約コーチ AIで営業スキルアップ中！今なら紹介特典で¥1,000 OFFで始められます";

  function handleShareLine() {
    trackReferralShareClicked("line");
    window.open(
      `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
      "_blank"
    );
  }

  function handleShareX() {
    trackReferralShareClicked("x");
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      "_blank"
    );
  }

  function handleShareLinkedIn() {
    trackReferralShareClicked("linkedin");
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      "_blank"
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="animate-fade-in-up text-center">
          <div className="mb-2 text-lg font-bold">読み込み中...</div>
        </div>
      </div>
    );
  }

  if (!code) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="w-full max-w-md animate-fade-in-up text-center">
          <div className="rounded-2xl border border-card-border bg-card p-8">
            <div className="mb-4 text-4xl">🔒</div>
            <h2 className="mb-2 text-lg font-bold">ログインが必要です</h2>
            <p className="mb-6 text-sm text-muted">
              紹介プログラムを利用するにはログインしてください
            </p>
            <Link
              href="/login?redirect=/referral"
              className="inline-flex h-10 items-center rounded-lg bg-accent px-6 text-sm font-bold text-white transition hover:bg-accent-hover"
            >
              ログイン
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-card-border bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-accent text-xs font-bold text-white">
              SC
            </span>
            <span className="font-bold text-foreground">成約コーチ AI</span>
          </Link>
          <Link
            href="/roleplay"
            className="rounded-lg border border-card-border px-3 py-1.5 text-xs text-muted transition hover:text-foreground"
          >
            ロープレに戻る
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-12">
        <div className="animate-fade-in-up space-y-8">
          {/* Title */}
          <div className="text-center">
            <h1 className="mb-2 text-2xl font-bold">紹介プログラム</h1>
            <p className="text-sm text-muted">
              友達を紹介して、お互い ¥1,000 OFF で営業力アップ
            </p>
          </div>

          {/* Referral Code Card */}
          <div className="rounded-2xl border border-accent/30 bg-accent/5 p-6">
            <div className="mb-4 text-center">
              <div className="mb-1 text-xs text-muted">あなたの紹介コード</div>
              <div className="text-3xl font-black tracking-wider text-accent">
                {code}
              </div>
            </div>

            <div className="mb-4 flex items-center gap-2 rounded-xl border border-card-border bg-card px-4 py-3">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="flex-1 bg-transparent text-xs text-muted outline-none"
              />
              <button
                onClick={handleCopy}
                className="shrink-0 rounded-lg bg-accent px-3 py-1.5 text-xs font-bold text-white transition hover:bg-accent-hover"
              >
                {copied ? "コピー済み!" : "コピー"}
              </button>
            </div>

            {/* SNS Share Buttons */}
            <div className="flex gap-2">
              <button
                onClick={handleShareLine}
                className="flex h-10 flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#06C755] text-xs font-bold text-white transition hover:opacity-90"
              >
                LINE
              </button>
              <button
                onClick={handleShareX}
                className="flex h-10 flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#0f1419] text-xs font-bold text-white transition hover:opacity-90"
              >
                𝕏
              </button>
              <button
                onClick={handleShareLinkedIn}
                className="flex h-10 flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#0A66C2] text-xs font-bold text-white transition hover:opacity-90"
              >
                LinkedIn
              </button>
            </div>
          </div>

          {/* Stats Card */}
          {stats && (
            <div className="rounded-2xl border border-card-border bg-card p-6">
              <h2 className="mb-4 text-sm font-medium text-muted">
                紹介の成果
              </h2>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-accent">
                    {stats.totalReferrals}
                  </div>
                  <div className="text-[10px] text-muted">紹介した人数</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-accent">
                    {stats.convertedToPro}
                  </div>
                  <div className="text-[10px] text-muted">Pro変換</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-accent">
                    ¥{stats.totalRewardsEarned.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-muted">獲得報酬</div>
                </div>
              </div>
            </div>
          )}

          {/* How It Works */}
          <div className="rounded-2xl border border-card-border bg-card p-6">
            <h2 className="mb-4 text-sm font-medium text-muted">仕組み</h2>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-lg">
                  1
                </div>
                <div className="text-xs font-medium">コードをシェア</div>
                <div className="mt-1 text-[10px] text-muted">
                  紹介リンクを友達に送る
                </div>
              </div>
              <div>
                <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-lg">
                  2
                </div>
                <div className="text-xs font-medium">友達が登録</div>
                <div className="mt-1 text-[10px] text-muted">
                  リンクから無料登録
                </div>
              </div>
              <div>
                <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-lg">
                  3
                </div>
                <div className="text-xs font-medium">両方 ¥1,000 OFF</div>
                <div className="mt-1 text-[10px] text-muted">
                  Pro登録時に自動適用
                </div>
              </div>
            </div>
          </div>

          {/* Incentive Details */}
          <div className="rounded-2xl border border-card-border bg-card p-6">
            <h2 className="mb-4 text-sm font-medium text-muted">特典詳細</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/10 text-[10px] text-accent">
                  A
                </span>
                <div>
                  <div className="font-medium">あなた（紹介者）</div>
                  <div className="text-xs text-muted">
                    紹介した友達がProプランに登録すると、次月 ¥1,000 OFF
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/10 text-[10px] text-accent">
                  B
                </span>
                <div>
                  <div className="font-medium">友達（被紹介者）</div>
                  <div className="text-xs text-muted">
                    Proプラン初月が ¥1,000 OFF（¥1,980で利用開始）
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Team Discount Section */}
          <div className="rounded-2xl border border-card-border bg-card p-6">
            <h2 className="mb-2 text-sm font-medium text-muted">
              チーム導入割引
            </h2>
            <p className="mb-4 text-xs text-muted">
              営業チームでの導入なら、さらにお得な割引が適用されます
            </p>
            <div className="space-y-2">
              {TEAM_DISCOUNT_TIERS.map((tier) => (
                <div
                  key={tier.label}
                  className="flex items-center justify-between rounded-xl border border-card-border px-4 py-3"
                >
                  <div>
                    <div className="text-sm font-medium">{tier.label}</div>
                    <div className="text-[10px] text-muted">
                      {tier.min}〜{tier.max === Infinity ? "" : tier.max}
                      人
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-accent">
                      ¥{tier.pricePerPerson.toLocaleString()}/人
                    </div>
                    <div className="text-[10px] text-muted">
                      {tier.discount}% OFF
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Back to roleplay */}
          <div className="text-center">
            <Link
              href="/roleplay"
              className="inline-flex h-12 items-center rounded-xl bg-accent px-8 text-base font-bold text-white transition hover:bg-accent-hover"
            >
              ロープレに戻る
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
