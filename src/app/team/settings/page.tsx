"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

interface TeamData {
  org: {
    id: string;
    name: string;
    maxMembers: number;
    hasSubscription: boolean;
  };
  currentUserRole: string;
}

export default function TeamSettingsPage() {
  const router = useRouter();
  const [teamData, setTeamData] = useState<TeamData | null>(null);
  const [loading, setLoading] = useState(true);
  const [portalLoading, setPortalLoading] = useState(false);

  useEffect(() => {
    fetch("/api/team/members")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data) setTeamData(data);
        else router.push("/team");
      })
      .catch(() => router.push("/team"))
      .finally(() => setLoading(false));
  }, [router]);

  async function handleManageBilling() {
    setPortalLoading(true);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      // ignore
    }
    setPortalLoading(false);
  }

  const isOwner = teamData?.currentUserRole === "owner";

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="mx-auto max-w-2xl px-6 py-12">
        <h1 className="mb-2 text-3xl font-bold">チーム設定</h1>
        <p className="mb-8 text-muted">チームの管理・請求設定</p>

        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
          </div>
        )}

        {teamData && (
          <div className="space-y-6">
            {/* Team Info */}
            <div className="rounded-2xl border border-card-border bg-card p-6">
              <h2 className="mb-4 text-lg font-bold">チーム情報</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted">チーム名</span>
                  <span className="font-medium">{teamData.org.name}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted">プラン</span>
                  <span className="font-medium text-accent">
                    法人チームプラン（{teamData.org.maxMembers}名）
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted">サブスクリプション</span>
                  <span className={`font-medium ${teamData.org.hasSubscription ? "text-green-500" : "text-red-400"}`}>
                    {teamData.org.hasSubscription ? "有効" : "未払い"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted">あなたの権限</span>
                  <span className="font-medium">
                    {teamData.currentUserRole === "owner" ? "オーナー" : teamData.currentUserRole === "admin" ? "管理者" : "メンバー"}
                  </span>
                </div>
              </div>
            </div>

            {/* Billing Management */}
            {isOwner && (
              <div className="rounded-2xl border border-card-border bg-card p-6">
                <h2 className="mb-2 text-lg font-bold">請求管理</h2>
                <p className="mb-4 text-sm text-muted">
                  Stripeの管理ポータルで支払い方法の変更、請求書のダウンロード、プランの変更ができます。
                </p>
                <button
                  onClick={handleManageBilling}
                  disabled={portalLoading}
                  className="inline-flex h-10 items-center rounded-xl border border-card-border px-5 text-sm font-medium text-foreground transition hover:border-accent/30 disabled:opacity-50"
                >
                  {portalLoading ? "読み込み中..." : "請求ポータルを開く"}
                </button>
              </div>
            )}

            {/* Plan Details */}
            <div className="rounded-2xl border border-accent/20 bg-accent/5 p-6">
              <h2 className="mb-3 text-lg font-bold">プラン内容</h2>
              <ul className="space-y-2 text-sm text-muted">
                <li className="flex items-center gap-2">
                  <span className="text-accent">&#10003;</span>
                  全メンバー無制限ロープレ
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-accent">&#10003;</span>
                  全5カテゴリの詳細スコア
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-accent">&#10003;</span>
                  AI改善アドバイス
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-accent">&#10003;</span>
                  チーム管理ダッシュボード
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-accent">&#10003;</span>
                  メンバー招待管理
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-accent">&#10003;</span>
                  請求書払い対応
                </li>
              </ul>
            </div>

            {/* Back */}
            <button
              onClick={() => router.push("/team")}
              className="text-sm text-muted transition hover:text-foreground"
            >
              ← チームダッシュボードに戻る
            </button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
