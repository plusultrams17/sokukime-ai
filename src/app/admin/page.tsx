"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

interface Metrics {
  timestamp: string;
  users: {
    total: number;
    pro: number;
    trial: number;
    free: number;
    canceled: number;
    pastDue: number;
    newThisWeek: number;
  };
  activity: {
    weeklyActive: number;
    monthlyActive: number;
    totalRoleplays: number;
    totalScores: number;
    platformAvgScore: number;
  };
  revenue: {
    mrr: number;
    arr: number;
    revenuePerUser: number;
    conversionRate: number;
    churnRate: number;
    paymentFailures: number;
  };
  referrals: {
    totalCodes: number;
    totalConversions: number;
  };
  emails: Record<string, number>;
}

function MetricCard({ label, value, sub, color }: { label: string; value: string | number; sub?: string; color?: string }) {
  return (
    <div className="rounded-xl border border-card-border bg-card p-4">
      <div className="text-xs text-muted mb-1">{label}</div>
      <div className={`text-2xl font-bold ${color || "text-foreground"}`}>{value}</div>
      {sub && <div className="text-[11px] text-muted mt-0.5">{sub}</div>}
    </div>
  );
}

function EmailRow({ type, count }: { type: string; count: number }) {
  const labels: Record<string, string> = {
    pro_welcome: "Pro Welcome",
    inactive_reminder: "非アクティブ",
    no_roleplay_day3: "未ロープレDay3",
    power_user_upgrade: "パワーユーザー",
    referral_nudge: "紹介ナッジ",
    payment_failed: "支払い失敗",
    payment_failed_day4: "支払いDay4",
    payment_failed_day7: "支払いDay7",
    subscription_canceled: "解約",
    winback_7days: "WB 7日",
    winback_30days: "WB 30日",
    weekly_digest: "週次ダイジェスト",
    pro_onboarding_day1: "Pro Day1",
    pro_onboarding_day3: "Pro Day3",
    pro_onboarding_day7: "Pro Day7",
    pause_resuming_3days: "一時停止再開",
    checkout_abandoned: "チェックアウト離脱",
    nps_survey: "NPS調査",
  };
  return (
    <div className="flex items-center justify-between py-2 border-b border-card-border last:border-0">
      <span className="text-sm">{labels[type] || type}</span>
      <span className="text-sm font-bold text-accent">{count}</span>
    </div>
  );
}

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [secret, setSecret] = useState("");
  const [authed, setAuthed] = useState(false);

  const loadMetrics = useCallback(async (s: string) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/metrics?secret=${encodeURIComponent(s)}`);
      if (res.status === 401) {
        setError("認証エラー: ADMIN_SECRETが正しくありません");
        setAuthed(false);
        return;
      }
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setMetrics(data);
      setAuthed(true);
      setError("");
    } catch {
      setError("データの読み込みに失敗しました");
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-load if secret is in URL hash (e.g., /admin#mysecret)
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) {
      setSecret(hash);
      loadMetrics(hash);
    }
  }, [loadMetrics]);

  if (!authed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="w-full max-w-sm p-6">
          <h1 className="mb-6 text-xl font-bold text-center">Admin Dashboard</h1>
          {error && <p className="mb-4 text-sm text-red-500 text-center">{error}</p>}
          <form onSubmit={(e) => { e.preventDefault(); loadMetrics(secret); }}>
            <input
              type="password"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              placeholder="ADMIN_SECRET"
              className="w-full rounded-lg border border-card-border bg-card px-4 py-3 text-sm focus:border-accent focus:outline-none"
            />
            <button
              type="submit"
              className="mt-3 w-full rounded-lg bg-accent py-3 text-sm font-bold text-white transition hover:bg-accent-hover"
            >
              ログイン
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-sm text-muted animate-pulse">読み込み中...</div>
      </div>
    );
  }

  if (!metrics) return null;

  const sortedEmails = Object.entries(metrics.emails).sort((a, b) => b[1] - a[1]);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-card-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="text-lg font-bold">成約コーチAI</Link>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted">
              {new Date(metrics.timestamp).toLocaleString("ja-JP")}
            </span>
            <button
              onClick={() => loadMetrics(secret)}
              className="rounded-lg bg-accent/10 px-3 py-1.5 text-xs font-bold text-accent transition hover:bg-accent/20"
            >
              更新
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        <h1 className="mb-2 text-2xl font-bold">Revenue Dashboard</h1>
        <p className="mb-4 text-sm text-muted">収益・ユーザー・自動化メトリクスの一覧</p>

        {/* Quick Links */}
        <div className="mb-8">
          <Link
            href={`/admin/kpi#${secret}`}
            className="inline-flex items-center gap-2 rounded-lg bg-accent/10 px-4 py-2.5 text-sm font-bold text-accent transition hover:bg-accent/20"
          >
            KPI Analytics Dashboard →
          </Link>
        </div>

        {/* Revenue */}
        <h2 className="mb-3 text-sm font-bold text-accent">Revenue</h2>
        <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <MetricCard label="MRR" value={`¥${metrics.revenue.mrr.toLocaleString()}`} color="text-accent" />
          <MetricCard label="ARR" value={`¥${metrics.revenue.arr.toLocaleString()}`} />
          <MetricCard label="CVR (30日)" value={`${metrics.revenue.conversionRate}%`} sub="Free→Pro" color={metrics.revenue.conversionRate >= 5 ? "text-green-500" : "text-yellow-500"} />
          <MetricCard label="Churn (30日)" value={`${metrics.revenue.churnRate}%`} color={metrics.revenue.churnRate <= 5 ? "text-green-500" : "text-red-500"} />
        </div>

        {/* Users */}
        <h2 className="mb-3 text-sm font-bold text-accent">Users</h2>
        <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          <MetricCard label="Total" value={metrics.users.total} />
          <MetricCard label="Pro" value={metrics.users.pro} color="text-accent" />
          <MetricCard label="Trial" value={metrics.users.trial} color="text-blue-500" />
          <MetricCard label="Free" value={metrics.users.free} />
          <MetricCard label="Past Due" value={metrics.users.pastDue} color={metrics.users.pastDue > 0 ? "text-red-500" : "text-green-500"} />
          <MetricCard label="Canceled" value={metrics.users.canceled} />
          <MetricCard label="New (7日)" value={metrics.users.newThisWeek} color="text-green-500" />
        </div>

        {/* Activity */}
        <h2 className="mb-3 text-sm font-bold text-accent">Activity</h2>
        <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-5">
          <MetricCard label="WAU" value={metrics.activity.weeklyActive} sub="Weekly Active" />
          <MetricCard label="MAU" value={metrics.activity.monthlyActive} sub="Monthly Active" />
          <MetricCard label="総ロープレ数" value={metrics.activity.totalRoleplays.toLocaleString()} />
          <MetricCard label="総スコア数" value={metrics.activity.totalScores.toLocaleString()} />
          <MetricCard label="平均スコア" value={metrics.activity.platformAvgScore} />
        </div>

        {/* Revenue Health */}
        <h2 className="mb-3 text-sm font-bold text-accent">Revenue Health</h2>
        <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <MetricCard label="ARPU" value={`¥${metrics.revenue.revenuePerUser.toLocaleString()}`} sub="Pro会員あたり" />
          <MetricCard label="支払い失敗" value={metrics.revenue.paymentFailures} sub="過去30日" color={metrics.revenue.paymentFailures > 0 ? "text-red-500" : "text-green-500"} />
          <MetricCard label="紹介コード" value={metrics.referrals.totalCodes} />
          <MetricCard label="紹介成約" value={metrics.referrals.totalConversions} color="text-green-500" />
        </div>

        {/* Email Automation Performance */}
        <h2 className="mb-3 text-sm font-bold text-accent">Email Automation (過去30日)</h2>
        <div className="mb-8 rounded-xl border border-card-border bg-card p-5">
          {sortedEmails.length > 0 ? (
            sortedEmails.map(([type, count]) => (
              <EmailRow key={type} type={type} count={count} />
            ))
          ) : (
            <p className="text-sm text-muted text-center py-4">まだメール送信記録がありません</p>
          )}
        </div>

        {/* Revenue Milestones */}
        <h2 className="mb-3 text-sm font-bold text-accent">Revenue Milestones</h2>
        <div className="mb-8 rounded-xl border border-card-border bg-card p-5">
          {[
            { target: 10000, label: "¥10,000 MRR", users: 4 },
            { target: 30000, label: "¥30,000 MRR", users: 10 },
            { target: 100000, label: "¥100,000 MRR", users: 34 },
            { target: 300000, label: "¥300,000 MRR", users: 101 },
            { target: 1000000, label: "¥1,000,000 MRR", users: 336 },
          ].map((milestone) => {
            const progress = Math.min(100, Math.round((metrics.revenue.mrr / milestone.target) * 100));
            const reached = metrics.revenue.mrr >= milestone.target;
            return (
              <div key={milestone.target} className="mb-3 last:mb-0">
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-sm font-bold ${reached ? "text-green-500" : "text-foreground"}`}>
                    {reached ? "✓ " : ""}{milestone.label}
                  </span>
                  <span className="text-xs text-muted">{milestone.users}人 Pro | {progress}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-card-border">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${reached ? "bg-green-500" : "bg-accent"}`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Automation System Status */}
        <h2 className="mb-3 text-sm font-bold text-accent">Automation Systems</h2>
        <div className="mb-8 grid gap-3 sm:grid-cols-2">
          {[
            { name: "Email Lifecycle (11 types)", status: "active", desc: "Trial/Inactive/Dunning/Winback/Pro Onboarding" },
            { name: "Stripe Webhook (8 events)", status: "active", desc: "Checkout/Sub/Invoice/Trial/Abandonment" },
            { name: "Referral + Coupon", status: "active", desc: "¥1,000 OFF 自動適用" },
            { name: "Cancel Flow + Save Offer", status: "active", desc: "一時停止/割引/理由収集" },
            { name: "GA4 + Engagement Tracking", status: "active", desc: "30+ custom events" },
            { name: "Cookie Consent", status: "active", desc: "APPI準拠" },
            { name: "Rate Limiting", status: "active", desc: "AI API コスト保護" },
            { name: "Social Proof Stats", status: "active", desc: "動的ユーザー数表示" },
            { name: "Score Sharing (X/LINE/LinkedIn)", status: "active", desc: "バイラル拡散" },
            { name: "Exit Popups", status: "active", desc: "離脱防止" },
            { name: "NPS Survey (Cron)", status: "active", desc: "Pro 14日目自動送信" },
            { name: "Admin Metrics API", status: "active", desc: "リアルタイムKPI" },
          ].map((sys) => (
            <div key={sys.name} className="flex items-start gap-3 rounded-xl border border-card-border bg-card p-4">
              <div className="mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full bg-green-500" />
              <div>
                <div className="text-sm font-bold">{sys.name}</div>
                <div className="text-xs text-muted">{sys.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
