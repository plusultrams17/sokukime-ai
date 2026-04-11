"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Logo } from "@/components/logo";

export default function SettingsPage() {
  const [email, setEmail] = useState<string | null>(null);
  const [plan, setPlan] = useState<"free" | "starter" | "pro" | "master">("free");
  const [loading, setLoading] = useState(true);

  const isPaid = plan === "starter" || plan === "pro" || plan === "master";
  const planLabel =
    plan === "master" ? "Master" : plan === "pro" ? "Pro" : plan === "starter" ? "Starter" : "Free";

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
        const raw = profile.plan;
        if (raw === "starter" || raw === "pro" || raw === "master" || raw === "free") {
          setPlan(raw);
        } else {
          setPlan("free");
        }
      }
      setLoading(false);
    }
    load();
  }, []);

  const [actionLoading, setActionLoading] = useState<"billing" | "logout" | null>(null);

  async function handleManageSubscription() {
    if (actionLoading) return;
    setActionLoading("billing");
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.url) {
        window.location.href = data.url;
        return;
      }
      console.error("[settings] stripe portal failed:", res.status, data);
      alert(
        "サブスクリプション管理画面を開けませんでした。時間をおいて再度お試しください。\n問題が続く場合は support@seiyaku-coach.com までご連絡ください。"
      );
      setActionLoading(null);
    } catch (err) {
      console.error("[settings] stripe portal error:", err);
      alert("サブスクリプション管理画面を開けませんでした。もう一度お試しください。");
      setActionLoading(null);
    }
  }

  async function handleLogout() {
    if (actionLoading) return;
    setActionLoading("logout");
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
        <div className="mx-auto flex h-14 max-w-2xl items-center justify-between px-4 sm:px-6">
          <Logo size="sm" />
          <Link
            href="/dashboard"
            className="rounded-lg border border-card-border px-4 py-1.5 text-sm text-muted transition hover:text-foreground"
          >
            ダッシュボード
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6 sm:py-8">
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
              <span className={`text-sm font-bold ${isPaid ? "text-accent" : "text-muted"}`}>
                {planLabel}
              </span>
            </div>
          </div>
        </div>

        {/* Billing */}
        <div className="mb-4 rounded-xl border border-card-border bg-card p-5">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">お支払い</h2>
          {isPaid ? (
            <button
              onClick={handleManageSubscription}
              disabled={actionLoading === "billing"}
              className="inline-flex h-9 items-center rounded-lg bg-accent px-4 text-sm font-bold text-white transition hover:bg-accent-hover disabled:opacity-60"
            >
              {actionLoading === "billing" ? "読み込み中..." : "請求・サブスクリプション管理"}
            </button>
          ) : (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted">有料プランなら月30回〜ロープレ</span>
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
          disabled={actionLoading === "logout"}
          className="w-full rounded-xl border border-card-border bg-card p-4 text-sm text-muted transition hover:text-red-500 hover:border-red-200 disabled:opacity-60"
        >
          {actionLoading === "logout" ? "ログアウト中..." : "ログアウト"}
        </button>
      </div>
    </div>
  );
}
