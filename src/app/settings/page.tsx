"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Footer } from "@/components/footer";

export default function SettingsPage() {
  const [email, setEmail] = useState<string | null>(null);
  const [plan, setPlan] = useState<"free" | "pro">("free");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [saving, setSaving] = useState(false);
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
        .select("plan, email_notifications")
        .eq("id", user.id)
        .single();
      if (profile) {
        setPlan(profile.plan as "free" | "pro");
        setEmailNotifications(profile.email_notifications !== false);
      }
      setLoading(false);
    }
    load();
  }, []);

  async function handleToggleNotifications() {
    setSaving(true);
    const supabase = createClient();
    if (!supabase) return;
    const newVal = !emailNotifications;
    setEmailNotifications(newVal);
    await supabase
      .from("profiles")
      .update({ email_notifications: newVal })
      .eq("id", (await supabase.auth.getUser()).data.user?.id || "");
    setSaving(false);
  }

  async function handleManageSubscription() {
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      // ignore
    }
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
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-6">
          <Link href="/" className="text-lg font-bold">
            成約コーチ AI
          </Link>
          <Link
            href="/dashboard"
            className="rounded-lg border border-card-border px-4 py-2 text-sm text-muted transition hover:text-foreground"
          >
            ダッシュボード
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-2xl px-6 py-10">
        <h1 className="mb-2 text-2xl font-bold">設定</h1>
        <p className="mb-8 text-sm text-muted">アカウントと通知の設定を管理します</p>

        {/* Account Info */}
        <div className="mb-6 rounded-xl border border-card-border bg-card p-6">
          <h2 className="mb-4 text-sm font-semibold text-muted">アカウント情報</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted">メールアドレス</span>
              <span className="text-sm font-medium">{email}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted">プラン</span>
              <span className={`text-sm font-bold ${plan === "pro" ? "text-accent" : "text-muted"}`}>
                {plan === "pro" ? "Pro プラン" : "無料プラン"}
              </span>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="mb-6 rounded-xl border border-card-border bg-card p-6">
          <h2 className="mb-4 text-sm font-semibold text-muted">メール通知</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">メール配信</p>
              <p className="text-xs text-muted">学習リマインダー・新機能の通知など</p>
            </div>
            <button
              onClick={handleToggleNotifications}
              disabled={saving}
              className={`relative h-7 w-12 rounded-full transition-colors ${
                emailNotifications ? "bg-accent" : "bg-card-border"
              }`}
            >
              <span
                className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform ${
                  emailNotifications ? "translate-x-5" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Billing */}
        <div className="mb-6 rounded-xl border border-card-border bg-card p-6">
          <h2 className="mb-4 text-sm font-semibold text-muted">お支払い・請求</h2>
          {plan === "pro" ? (
            <div className="space-y-3">
              <p className="text-sm text-muted">
                Stripeの管理画面で、請求書・領収書のダウンロード、支払い方法の変更、プランの解約ができます。
              </p>
              <button
                onClick={handleManageSubscription}
                className="inline-flex h-10 items-center rounded-lg bg-accent px-5 text-sm font-bold text-white transition hover:bg-accent-hover"
              >
                請求・サブスクリプション管理
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-muted">
                Proプランにアップグレードすると、無制限ロープレ・AIコーチング・詳細分析が利用できます。
              </p>
              <Link
                href="/pricing"
                className="inline-flex h-10 items-center rounded-lg bg-accent px-5 text-sm font-bold text-white transition hover:bg-accent-hover"
              >
                Proプランを見る
              </Link>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
