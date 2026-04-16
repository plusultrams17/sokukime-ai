"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

interface Member {
  id: string;
  userId: string;
  email: string;
  role: "owner" | "admin" | "member";
  joinedAt: string;
}

interface Invitation {
  id: string;
  email: string;
  status: string;
  created_at: string;
  expires_at: string;
}

interface TeamData {
  org: {
    id: string;
    name: string;
    maxMembers: number;
    hasSubscription: boolean;
    createdAt: string;
  };
  members: Member[];
  invitations: Invitation[];
  currentUserRole: string;
}

interface TeamActivity {
  totalSessions: number;
  avgScore: number | null;
  activeMembers: number;
  lessonsCompleted: number;
}

/* ── チームプラン定義 (plans.tsと同期) ── */
const TEAM_TIERS = [
  {
    tier: "team_5",
    name: "Team",
    minMembers: 5,
    maxMembers: 9,
    pricePerUser: 1980,
    annualPricePerUser: 1584,
    credits: "月60回/人",
  },
  {
    tier: "team_10",
    name: "Business",
    minMembers: 10,
    maxMembers: 29,
    pricePerUser: 1480,
    annualPricePerUser: 1184,
    credits: "月60回/人",
  },
  {
    tier: "team_30",
    name: "Enterprise",
    minMembers: 30,
    maxMembers: 49,
    pricePerUser: 980,
    annualPricePerUser: 784,
    credits: "月100回/人",
  },
  {
    tier: "team_50",
    name: "Enterprise+",
    minMembers: 50,
    maxMembers: null,
    pricePerUser: 780,
    annualPricePerUser: 624,
    credits: "無制限",
  },
] as const;

function getRecommendedTier(count: number) {
  for (let i = TEAM_TIERS.length - 1; i >= 0; i--) {
    if (count >= TEAM_TIERS[i].minMembers) return TEAM_TIERS[i];
  }
  return TEAM_TIERS[0];
}

export default function TeamPage() {
  const [teamData, setTeamData] = useState<TeamData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [bulkEmails, setBulkEmails] = useState("");
  const [showBulkInvite, setShowBulkInvite] = useState(false);
  const [inviting, setInviting] = useState(false);
  const [inviteResult, setInviteResult] = useState<{ url?: string; error?: string; bulkResults?: { email: string; ok: boolean }[] } | null>(null);
  const [teamActivity, setTeamActivity] = useState<TeamActivity | null>(null);

  // Plan selection state
  const [orgName, setOrgName] = useState("");
  const [memberCount, setMemberCount] = useState(5);
  const [billing, setBilling] = useState<"monthly" | "annual">("monthly");
  const [creating, setCreating] = useState(false);
  const [startingTrial, setStartingTrial] = useState(false);

  const selectedTier = getRecommendedTier(memberCount);
  const unitPrice = billing === "annual" ? selectedTier.annualPricePerUser : selectedTier.pricePerUser;
  const totalMonthly = unitPrice * memberCount;

  const fetchTeam = useCallback(async () => {
    try {
      const res = await fetch("/api/team/members");
      if (res.status === 404) {
        setTeamData(null);
        setLoading(false);
        return;
      }
      if (!res.ok) throw new Error("Failed to load");
      const data = await res.json();
      setTeamData(data);

      // Fetch team activity summary (best-effort)
      try {
        const actRes = await fetch("/api/team/activity");
        if (actRes.ok) {
          const actData = await actRes.json();
          setTeamActivity(actData);
        }
      } catch {
        // ignore — activity is optional
      }
    } catch {
      setError("チーム情報の読み込みに失敗しました");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTeam();
  }, [fetchTeam]);

  async function handleCreateTeam() {
    if (!orgName.trim()) return;
    setCreating(true);
    setError("");
    try {
      const res = await fetch("/api/team/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: orgName, memberCount, billing }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else if (data.error) {
        setError(data.error);
      }
    } catch {
      setError("チームの作成に失敗しました");
    }
    setCreating(false);
  }

  async function handleStartTrial() {
    if (!orgName.trim()) return;
    setStartingTrial(true);
    setError("");
    try {
      const res = await fetch("/api/team/trial", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: orgName }),
      });
      const data = await res.json();
      if (data.success) {
        window.location.reload();
      } else if (data.error) {
        setError(data.error);
      }
    } catch {
      setError("トライアルの開始に失敗しました");
    }
    setStartingTrial(false);
  }

  async function handleInvite() {
    if (!inviteEmail.trim()) return;
    setInviting(true);
    setInviteResult(null);
    try {
      const res = await fetch("/api/team/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: inviteEmail }),
      });
      const data = await res.json();
      if (data.success) {
        setInviteResult({ url: data.inviteUrl });
        setInviteEmail("");
        fetchTeam();
      } else {
        setInviteResult({ error: data.error });
      }
    } catch {
      setInviteResult({ error: "招待の送信に失敗しました" });
    }
    setInviting(false);
  }

  async function handleBulkInvite() {
    const emails = bulkEmails
      .split(/[\n,;]+/)
      .map((e) => e.trim())
      .filter((e) => e.includes("@"));
    if (emails.length === 0) return;
    setInviting(true);
    setInviteResult(null);
    const results: { email: string; ok: boolean }[] = [];
    for (const email of emails) {
      try {
        const res = await fetch("/api/team/invite", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        const data = await res.json();
        results.push({ email, ok: !!data.success });
      } catch {
        results.push({ email, ok: false });
      }
    }
    setInviteResult({ bulkResults: results });
    setBulkEmails("");
    fetchTeam();
    setInviting(false);
  }

  async function handleRemoveMember(memberId: string) {
    if (!confirm("このメンバーをチームから削除しますか？")) return;
    try {
      await fetch(`/api/team/members?memberId=${memberId}`, { method: "DELETE" });
      fetchTeam();
    } catch {
      // ignore
    }
  }

  async function handleCancelInvite(invitationId: string) {
    try {
      await fetch(`/api/team/members?invitationId=${invitationId}`, { method: "DELETE" });
      fetchTeam();
    } catch {
      // ignore
    }
  }

  const isAdmin = teamData?.currentUserRole === "owner" || teamData?.currentUserRole === "admin";

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
        <h1 className="mb-2 text-3xl font-bold">法人チームプラン</h1>
        <p className="mb-8 text-muted">チーム全員の営業力を効率的に強化</p>

        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/5 p-4 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* ── No team: Show pricing & creation ── */}
        {!loading && !teamData && (
          <>
            {/* Pricing Table */}
            <div className="mb-8">
              <h2 className="mb-6 text-xl font-bold">料金プラン</h2>

              {/* Billing Toggle */}
              <div className="mb-6 flex items-center justify-center gap-3">
                <button
                  onClick={() => setBilling("monthly")}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                    billing === "monthly"
                      ? "bg-accent text-white"
                      : "border border-card-border text-muted hover:text-foreground"
                  }`}
                >
                  月払い
                </button>
                <button
                  onClick={() => setBilling("annual")}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                    billing === "annual"
                      ? "bg-accent text-white"
                      : "border border-card-border text-muted hover:text-foreground"
                  }`}
                >
                  年払い
                  <span className="ml-1.5 rounded bg-green-500/10 px-1.5 py-0.5 text-xs text-green-500">
                    20%OFF
                  </span>
                </button>
              </div>

              {/* Plan Cards */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {TEAM_TIERS.map((t) => {
                  const isSelected = t.tier === selectedTier.tier;
                  const price = billing === "annual" ? t.annualPricePerUser : t.pricePerUser;
                  return (
                    <div
                      key={t.tier}
                      className={`rounded-2xl border p-5 transition ${
                        isSelected
                          ? "border-accent bg-accent/5"
                          : "border-card-border bg-card"
                      }`}
                    >
                      <h3 className="mb-1 text-lg font-bold">{t.name}</h3>
                      <p className="mb-3 text-xs text-muted">
                        {t.minMembers}{t.maxMembers ? `-${t.maxMembers}` : "+"}名
                      </p>
                      <p className="mb-1 text-2xl font-bold">
                        <span className="text-accent">&yen;{price.toLocaleString()}</span>
                        <span className="text-sm font-normal text-muted">/人/月</span>
                      </p>
                      {billing === "annual" && (
                        <p className="mb-3 text-xs text-muted line-through">
                          &yen;{t.pricePerUser.toLocaleString()}/人/月
                        </p>
                      )}
                      <p className="mb-4 text-sm text-muted">
                        AIロープレ {t.credits}
                      </p>
                      {isSelected && (
                        <span className="inline-block rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
                          選択中
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Member Count Slider */}
            <div className="mb-8 rounded-2xl border border-card-border bg-card p-6">
              <h3 className="mb-4 text-lg font-bold">人数を選択</h3>
              <div className="mb-4 flex items-center gap-4">
                <input
                  type="range"
                  min={5}
                  max={200}
                  step={1}
                  value={memberCount}
                  onChange={(e) => setMemberCount(parseInt(e.target.value))}
                  className="h-2 flex-1 cursor-pointer appearance-none rounded-lg bg-card-border accent-accent"
                />
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={5}
                    max={200}
                    value={memberCount}
                    onChange={(e) => {
                      const v = parseInt(e.target.value);
                      if (v >= 5 && v <= 200) setMemberCount(v);
                    }}
                    className="h-10 w-20 rounded-lg border border-card-border bg-background px-3 text-center text-sm text-foreground focus:border-accent focus:outline-none"
                  />
                  <span className="text-sm text-muted">名</span>
                </div>
              </div>

              {/* Summary */}
              <div className="flex items-center justify-between rounded-xl bg-background p-4">
                <div>
                  <p className="text-sm text-muted">
                    {selectedTier.name}プラン
                    <span className="mx-1 text-foreground">|</span>
                    {memberCount}名
                    <span className="mx-1 text-foreground">|</span>
                    {billing === "annual" ? "年払い" : "月払い"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-accent">
                    &yen;{totalMonthly.toLocaleString()}
                    <span className="text-sm font-normal text-muted">/月</span>
                  </p>
                  <p className="text-xs text-muted">
                    (@&yen;{unitPrice.toLocaleString()}/人/月)
                  </p>
                </div>
              </div>
            </div>

            {/* Team Creation Form */}
            <div className="rounded-2xl border border-accent/20 bg-accent/5 p-6">
              <h3 className="mb-4 text-lg font-bold">チームを作成</h3>
              <div className="mb-4">
                <input
                  type="text"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  placeholder="チーム名（例：営業部）"
                  className="h-11 w-full rounded-xl border border-card-border bg-background px-4 text-sm text-foreground placeholder:text-muted/50 focus:border-accent focus:outline-none"
                />
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={handleCreateTeam}
                  disabled={creating || !orgName.trim()}
                  className="h-11 flex-1 rounded-xl bg-accent px-6 text-sm font-bold text-white transition hover:bg-accent-hover disabled:opacity-50"
                >
                  {creating ? "作成中..." : `${selectedTier.name}プランで始める`}
                </button>
                <button
                  onClick={handleStartTrial}
                  disabled={startingTrial || !orgName.trim()}
                  className="h-11 rounded-xl border border-accent/30 px-6 text-sm font-medium text-accent transition hover:bg-accent/5 disabled:opacity-50"
                >
                  {startingTrial ? "開始中..." : "14日間無料トライアル"}
                </button>
              </div>
              <p className="mt-3 text-xs text-muted">
                トライアル: 10名まで・CC不要・全機能利用可。有料プランはStripeで安全に決済。
              </p>
            </div>
          </>
        )}

        {/* ── Team exists: Dashboard ── */}
        {teamData && (
          <>
            {/* Team Overview */}
            <div className="mb-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-card-border bg-card p-5">
                <p className="mb-1 text-xs text-muted">チーム名</p>
                <p className="text-lg font-bold">{teamData.org.name}</p>
              </div>
              <div className="rounded-xl border border-card-border bg-card p-5">
                <p className="mb-1 text-xs text-muted">メンバー数</p>
                <p className="text-lg font-bold">
                  <span className="text-accent">{teamData.members.length}</span>
                  <span className="text-muted"> / {teamData.org.maxMembers}</span>
                </p>
              </div>
              <div className="rounded-xl border border-card-border bg-card p-5">
                <p className="mb-1 text-xs text-muted">プラン状態</p>
                <p className="text-lg font-bold">
                  {teamData.org.hasSubscription ? (
                    <span className="text-green-500">有効</span>
                  ) : (
                    <span className="text-red-400">未払い</span>
                  )}
                </p>
              </div>
            </div>

            {/* Team Activity Summary */}
            {teamActivity && (
              <div className="mb-8 rounded-2xl border border-card-border bg-card p-6">
                <h2 className="mb-4 text-lg font-bold">チーム活動サマリー（今月）</h2>
                <div className="grid gap-3 sm:grid-cols-4">
                  <div className="rounded-xl bg-background p-4 text-center">
                    <p className="text-2xl font-bold text-accent">{teamActivity.totalSessions}</p>
                    <p className="text-xs text-muted">総ロープレ数</p>
                  </div>
                  <div className="rounded-xl bg-background p-4 text-center">
                    <p className="text-2xl font-bold text-accent">{teamActivity.avgScore ?? "—"}</p>
                    <p className="text-xs text-muted">平均スコア</p>
                  </div>
                  <div className="rounded-xl bg-background p-4 text-center">
                    <p className="text-2xl font-bold text-accent">{teamActivity.activeMembers}</p>
                    <p className="text-xs text-muted">アクティブメンバー</p>
                  </div>
                  <div className="rounded-xl bg-background p-4 text-center">
                    <p className="text-2xl font-bold text-accent">{teamActivity.lessonsCompleted}</p>
                    <p className="text-xs text-muted">レッスン完了数</p>
                  </div>
                </div>
              </div>
            )}

            {/* Members List */}
            <div className="mb-8 rounded-2xl border border-card-border bg-card">
              <div className="border-b border-card-border px-6 py-4">
                <h2 className="text-lg font-bold">メンバー一覧</h2>
              </div>
              <div className="divide-y divide-card-border">
                {teamData.members.map((member) => (
                  <div key={member.id} className="flex items-center justify-between px-6 py-4">
                    <div>
                      <p className="text-sm font-medium">{member.email}</p>
                      <p className="text-xs text-muted">
                        {member.role === "owner" ? "オーナー" : member.role === "admin" ? "管理者" : "メンバー"}
                        {" "}・ {new Date(member.joinedAt).toLocaleDateString("ja-JP")} 参加
                      </p>
                    </div>
                    {isAdmin && member.role !== "owner" && (
                      <button
                        onClick={() => handleRemoveMember(member.id)}
                        className="rounded-lg border border-red-500/30 px-3 py-1.5 text-xs text-red-400 transition hover:bg-red-500/10"
                      >
                        削除
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Pending Invitations */}
            {teamData.invitations.length > 0 && (
              <div className="mb-8 rounded-2xl border border-card-border bg-card">
                <div className="border-b border-card-border px-6 py-4">
                  <h2 className="text-lg font-bold">招待中</h2>
                </div>
                <div className="divide-y divide-card-border">
                  {teamData.invitations.map((inv) => (
                    <div key={inv.id} className="flex items-center justify-between px-6 py-4">
                      <div>
                        <p className="text-sm font-medium">{inv.email}</p>
                        <p className="text-xs text-muted">
                          {new Date(inv.expires_at).toLocaleDateString("ja-JP")} まで有効
                        </p>
                      </div>
                      {isAdmin && (
                        <button
                          onClick={() => handleCancelInvite(inv.id)}
                          className="rounded-lg border border-card-border px-3 py-1.5 text-xs text-muted transition hover:text-foreground"
                        >
                          取消
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Invite Form */}
            {isAdmin && teamData.members.length < teamData.org.maxMembers && (
              <div className="mb-8 rounded-2xl border border-accent/20 bg-accent/5 p-6">
                <h3 className="mb-3 text-lg font-bold">メンバーを招待</h3>
                <div className="flex items-center gap-3">
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="メールアドレス"
                    className="h-11 flex-1 rounded-xl border border-card-border bg-background px-4 text-sm text-foreground placeholder:text-muted/50 focus:border-accent focus:outline-none"
                    onKeyDown={(e) => e.key === "Enter" && handleInvite()}
                  />
                  <button
                    onClick={handleInvite}
                    disabled={inviting || !inviteEmail.trim()}
                    className="h-11 rounded-xl bg-accent px-6 text-sm font-bold text-white transition hover:bg-accent-hover disabled:opacity-50"
                  >
                    {inviting ? "送信中..." : "招待する"}
                  </button>
                </div>

                {inviteResult?.url && (
                  <div className="mt-4 rounded-xl border border-green-500/30 bg-green-500/5 p-4">
                    <p className="mb-2 text-sm font-bold text-green-500">招待リンクを作成しました</p>
                    <p className="break-all text-xs text-muted">{inviteResult.url}</p>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(inviteResult.url!);
                      }}
                      className="mt-2 rounded-lg border border-green-500/30 px-3 py-1.5 text-xs text-green-500 transition hover:bg-green-500/10"
                    >
                      リンクをコピー
                    </button>
                  </div>
                )}

                {inviteResult?.error && (
                  <p className="mt-3 text-sm text-red-400">{inviteResult.error}</p>
                )}

                {/* Bulk invite results */}
                {inviteResult?.bulkResults && (
                  <div className="mt-4 space-y-1">
                    {inviteResult.bulkResults.map((r) => (
                      <div key={r.email} className={`flex items-center gap-2 text-xs ${r.ok ? "text-green-500" : "text-red-400"}`}>
                        <span>{r.ok ? "+" : "x"}</span>
                        <span>{r.email}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Bulk invite toggle */}
                <div className="mt-4 border-t border-card-border pt-4">
                  <button
                    onClick={() => setShowBulkInvite(!showBulkInvite)}
                    className="text-xs text-accent hover:underline"
                  >
                    {showBulkInvite ? "一括招待を閉じる" : "メールアドレスを一括で招待する"}
                  </button>
                  {showBulkInvite && (
                    <div className="mt-3">
                      <textarea
                        value={bulkEmails}
                        onChange={(e) => setBulkEmails(e.target.value)}
                        placeholder={"1行に1つのメールアドレスを入力\nuser1@example.com\nuser2@example.com"}
                        rows={4}
                        className="mb-3 w-full rounded-xl border border-card-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted/50 focus:border-accent focus:outline-none"
                      />
                      <button
                        onClick={handleBulkInvite}
                        disabled={inviting || !bulkEmails.trim()}
                        className="h-10 rounded-xl bg-accent px-6 text-sm font-bold text-white transition hover:bg-accent-hover disabled:opacity-50"
                      >
                        {inviting ? "送信中..." : "一括招待する"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Settings Link */}
            {isAdmin && (
              <div className="flex items-center gap-4">
                <Link
                  href="/team/settings"
                  className="inline-flex h-10 items-center rounded-xl border border-card-border px-5 text-sm text-muted transition hover:text-foreground hover:border-accent/30"
                >
                  チーム設定
                </Link>
              </div>
            )}
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}
