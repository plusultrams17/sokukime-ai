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

export default function TeamPage() {
  const [teamData, setTeamData] = useState<TeamData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviting, setInviting] = useState(false);
  const [inviteResult, setInviteResult] = useState<{ url?: string; error?: string } | null>(null);
  const [creating, setCreating] = useState(false);
  const [orgName, setOrgName] = useState("");

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
    try {
      const res = await fetch("/api/team/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: orgName }),
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
      <div className="mx-auto max-w-4xl px-6 py-12">
        <h1 className="mb-2 text-3xl font-bold">チーム管理</h1>
        <p className="mb-8 text-muted">法人チームプランの管理ダッシュボード</p>

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

        {/* No team — show creation form */}
        {!loading && !teamData && (
          <div className="rounded-2xl border border-card-border bg-card p-8 text-center">
            <h2 className="mb-2 text-xl font-bold">チームを作成</h2>
            <p className="mb-6 text-sm text-muted">
              法人チームプラン（¥20,000/月・5名まで）でチーム全員の営業力を底上げしましょう。
            </p>
            <div className="mx-auto flex max-w-md items-center gap-3">
              <input
                type="text"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                placeholder="チーム名（例：営業部）"
                className="h-11 flex-1 rounded-xl border border-card-border bg-background px-4 text-sm text-foreground placeholder:text-muted/50 focus:border-accent focus:outline-none"
              />
              <button
                onClick={handleCreateTeam}
                disabled={creating || !orgName.trim()}
                className="h-11 rounded-xl bg-accent px-6 text-sm font-bold text-white transition hover:bg-accent-hover disabled:opacity-50"
              >
                {creating ? "作成中..." : "作成して決済へ"}
              </button>
            </div>
            <p className="mt-4 text-xs text-muted">
              Stripeで安全に決済。いつでも解約可能。
            </p>
          </div>
        )}

        {/* Team exists */}
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
