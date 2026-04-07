"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function SettingsPage() {
  const [email, setEmail] = useState<string | null>(null);
  const [plan, setPlan] = useState<"free" | "pro">("free");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      if (!supabase) return;
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = "/login?redirect=/settings";
        return;
      }
      setEmail(user.email || null);
      const { data: profile } = await supabase
        .from("profiles")
        .select("plan")
        .eq("id", user.id)
        .single();
      if (profile) {
        setPlan(profile.plan as "free" | "pro");
      }
      setLoading(false);
    }
    load();
  }, []);

  async function handleManageSubscription() {
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      alert("サブスクリプション管理画面を開けませんでした。もう一度お試しください。");
    }
  }

  async function handleLogout() {
    const supabase = createClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
    window.location.href = "/";
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-sm text-muted animate-pulse">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-card-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-2xl items-center justify-between px-6">
          <Link href="/" className="text-lg font-bold">
            成約コーチAI
          </Link>
          <Link
            href="/dashboard"
            className="rounded-lg border border-card-border px-4 py-1.5 text-sm text-muted transition hover:text-foreground"
          >
            ダッシュボード
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-2xl px-6 py-8">
        <h1 className="mb-6 text-xl font-bold">設定</h1>

        {/* Account */}
        <div className="mb-4 rounded-xl border border-card-border bg-card p-5">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">アカウント</h2>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted">メール</span>
              <span className="text-sm font-medium">{email}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted">プラン</span>
              <span className={`text-sm font-bold ${plan === "pro" ? "text-accent" : "text-muted"}`}>
                {plan === "pro" ? "Pro" : "Free"}
              </span>
            </div>
          </div>
        </div>

        {/* Billing */}
        <div className="mb-4 rounded-xl border border-card-border bg-card p-5">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">お支払い</h2>
          {plan === "pro" ? (
            <button
              onClick={handleManageSubscription}
              className="inline-flex h-9 items-center rounded-lg bg-accent px-4 text-sm font-bold text-white transition hover:bg-accent-hover"
            >
              請求・サブスクリプション管理
            </button>
          ) : (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted">Proプランで無制限ロープレ</span>
              <Link
                href="/pricing"
                className="text-sm font-bold text-accent transition hover:underline"
              >
                プランを見る
              </Link>
            </div>
          )}
        </div>

        {/* Referral */}
        <Link
          href="/referral"
          className="mb-4 flex items-center justify-between rounded-xl border border-card-border bg-card p-5 transition hover:border-accent/30"
        >
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wide text-muted mb-1">紹介プログラム</h2>
            <span className="text-sm text-muted">友達を紹介してお互い ¥1,000 OFF</span>
          </div>
          <span className="text-accent text-sm font-bold">→</span>
        </Link>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full rounded-xl border border-card-border bg-card p-4 text-sm text-muted transition hover:text-red-500 hover:border-red-200"
        >
          ログアウト
        </button>
      </div>
    </div>
  );
}
