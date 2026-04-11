"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { createClient } from "@/lib/supabase/client";

type Status =
  | "loading"
  | "needs-login"
  | "ready"
  | "activating"
  | "success"
  | "already"
  | "error";

type AccessTier = "basic" | "intermediate" | "full";

interface CodeInfo {
  code: string;
  description: string;
  durationDays: number | null;
  accessTier: AccessTier;
}

const TIER_FEATURES: Record<
  AccessTier,
  { label: string; items: string[] }
> = {
  basic: {
    label: "ベーシックプラン",
    items: [
      "AIロープレ無制限",
      "学習コース: 初級1〜3（3レッスン）",
      "スコア・AI改善アドバイス",
    ],
  },
  intermediate: {
    label: "プロプラン",
    items: [
      "AIロープレ無制限",
      "学習コース: 初級1〜8 + 中級1〜7（15レッスン）",
      "全5カテゴリの詳細スコア",
      "AI改善アドバイス + テンプレート",
    ],
  },
  full: {
    label: "プラチナプラン",
    items: [
      "AIロープレ無制限",
      "全22レッスンの学習コース（初級・中級・上級）",
      "全5カテゴリの詳細スコア",
      "AI改善アドバイス + テンプレート30パターン",
    ],
  },
};

function ActivateForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialCode = (searchParams.get("code") || "").trim().toUpperCase();
  const [codeInput, setCodeInput] = useState(initialCode);
  const [status, setStatus] = useState<Status>("loading");
  const [errorMsg, setErrorMsg] = useState("");
  const [codeInfo, setCodeInfo] = useState<CodeInfo | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check auth state on mount
  useEffect(() => {
    let cancelled = false;
    async function init() {
      const supabase = createClient();
      if (!supabase) {
        setStatus("error");
        setErrorMsg("サービスが一時的に利用できません");
        return;
      }
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (cancelled) return;
      const loggedIn = !!user;
      setIsLoggedIn(loggedIn);

      // If a code is in the URL and the user is logged in, validate then auto-activate
      if (initialCode) {
        try {
          const res = await fetch(
            `/api/activate?code=${encodeURIComponent(initialCode)}`
          );
          const data = await res.json();
          if (!data.valid) {
            setStatus("error");
            setErrorMsg(data.error || "コードが無効です");
            return;
          }
          setCodeInfo({
            code: data.code,
            description: data.description,
            durationDays: data.durationDays,
            accessTier: (data.accessTier as AccessTier) || "full",
          });
          setStatus(loggedIn ? "ready" : "needs-login");
        } catch {
          setStatus("error");
          setErrorMsg("コードの検証に失敗しました");
        }
      } else {
        // No code in URL — show input form
        setStatus(loggedIn ? "ready" : "needs-login");
      }
    }
    init();
    return () => {
      cancelled = true;
    };
  }, [initialCode]);

  async function handleValidateInput() {
    const code = codeInput.trim().toUpperCase();
    if (!code) {
      setErrorMsg("コードを入力してください");
      return;
    }
    setErrorMsg("");
    try {
      const res = await fetch(`/api/activate?code=${encodeURIComponent(code)}`);
      const data = await res.json();
      if (!data.valid) {
        setErrorMsg(data.error || "コードが無効です");
        return;
      }
      setCodeInfo({
        code: data.code,
        description: data.description,
        durationDays: data.durationDays,
        accessTier: (data.accessTier as AccessTier) || "full",
      });
    } catch {
      setErrorMsg("コードの検証に失敗しました");
    }
  }

  async function handleActivate() {
    const code = (codeInfo?.code || codeInput || initialCode).trim().toUpperCase();
    if (!code) {
      setErrorMsg("コードが指定されていません");
      return;
    }
    setStatus("activating");
    setErrorMsg("");
    try {
      const res = await fetch("/api/activate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setErrorMsg(data.error || "アクティベーションに失敗しました");
        return;
      }

      if (data.alreadyRedeemed) {
        setExpiresAt(data.expiresAt || null);
        setStatus("already");
        return;
      }

      setExpiresAt(data.expiresAt || null);
      setStatus("success");
    } catch {
      setStatus("error");
      setErrorMsg("アクティベーションに失敗しました。再度お試しください。");
    }
  }

  async function handleGoogleLogin() {
    const supabase = createClient();
    if (!supabase) {
      setErrorMsg("サービスが一時的に利用できません");
      return;
    }
    const code = (codeInfo?.code || codeInput || initialCode).trim().toUpperCase();
    const callbackUrl = new URL("/auth/callback", window.location.origin);
    // ログイン後にこの /activate?code=XXX に戻ってくるようにする
    callbackUrl.searchParams.set(
      "redirect",
      `/activate${code ? `?code=${encodeURIComponent(code)}` : ""}`
    );

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: callbackUrl.toString(),
      },
    });
    if (error) {
      setErrorMsg("Googleログインに失敗しました");
    }
  }

  function formatExpiry(iso: string | null): string {
    if (!iso) return "無期限";
    const date = new Date(iso);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yyyy}年${mm}月${dd}日まで`;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="mx-auto max-w-lg px-6 py-16">
        <div className="rounded-2xl border border-card-border bg-card p-8">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-accent/10 text-3xl">
              🎟️
            </div>
            <h1 className="mb-2 text-2xl font-bold">キャンペーンコード</h1>
            <p className="text-sm text-muted">
              コードを入力して、Proプランの全機能を期間限定で解放できます
            </p>
          </div>

          {status === "loading" && (
            <div className="flex justify-center py-10">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
            </div>
          )}

          {status === "needs-login" && (
            <div className="space-y-5">
              {codeInfo ? (
                <div className="rounded-xl border border-accent/30 bg-accent/5 px-4 py-3">
                  <p className="text-xs text-muted">キャンペーンコード</p>
                  <p className="text-lg font-bold text-accent">{codeInfo.code}</p>
                  <p className="mt-1 text-xs text-foreground">
                    {codeInfo.description}
                  </p>
                  <p className="mt-1 text-[11px] text-muted">
                    有効期間:{" "}
                    {codeInfo.durationDays === null
                      ? "無期限"
                      : `${codeInfo.durationDays}日間`}
                  </p>
                </div>
              ) : (
                <div>
                  <label className="mb-2 block text-xs font-medium text-muted">
                    キャンペーンコード
                  </label>
                  <input
                    type="text"
                    value={codeInput}
                    onChange={(e) => setCodeInput(e.target.value)}
                    placeholder="例: TRIAL14DAY"
                    className="h-12 w-full rounded-xl border border-card-border bg-background px-4 text-base font-bold uppercase tracking-wider text-foreground focus:border-accent focus:outline-none"
                  />
                </div>
              )}

              {errorMsg && (
                <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
                  {errorMsg}
                </div>
              )}

              <p className="text-center text-sm text-muted">
                キャンペーンコードを使うには、まずGoogleログインが必要です
              </p>

              <button
                onClick={handleGoogleLogin}
                className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border-2 border-accent bg-accent/5 text-sm font-bold text-accent transition hover:bg-accent/10"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Googleでログイン
              </button>

              <p className="text-center text-[11px] text-muted">
                ログイン後、自動的にこのページに戻って有効化されます
              </p>
            </div>
          )}

          {status === "ready" && (
            <div className="space-y-5">
              {codeInfo ? (
                <div className="rounded-xl border border-accent/30 bg-accent/5 px-4 py-3">
                  <p className="text-xs text-muted">キャンペーンコード</p>
                  <p className="text-lg font-bold text-accent">{codeInfo.code}</p>
                  <p className="mt-1 text-xs text-foreground">
                    {codeInfo.description}
                  </p>
                  <p className="mt-1 text-[11px] text-muted">
                    有効期間:{" "}
                    {codeInfo.durationDays === null
                      ? "無期限"
                      : `${codeInfo.durationDays}日間`}
                  </p>
                </div>
              ) : (
                <div>
                  <label className="mb-2 block text-xs font-medium text-muted">
                    キャンペーンコード
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={codeInput}
                      onChange={(e) =>
                        setCodeInput(e.target.value.toUpperCase())
                      }
                      placeholder="例: TRIAL14DAY"
                      className="h-12 flex-1 rounded-xl border border-card-border bg-background px-4 text-base font-bold uppercase tracking-wider text-foreground focus:border-accent focus:outline-none"
                    />
                    <button
                      onClick={handleValidateInput}
                      className="h-12 rounded-xl border border-card-border bg-card px-4 text-sm font-medium text-muted transition hover:text-foreground"
                    >
                      確認
                    </button>
                  </div>
                </div>
              )}

              {errorMsg && (
                <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
                  {errorMsg}
                </div>
              )}

              <button
                onClick={handleActivate}
                disabled={!codeInfo}
                className="h-12 w-full rounded-xl bg-accent text-base font-bold text-white transition hover:bg-accent-hover disabled:opacity-50"
              >
                Proプランを有効化する
              </button>

              {!codeInfo && (
                <p className="text-center text-[11px] text-muted">
                  コードを入力して「確認」を押してください
                </p>
              )}
            </div>
          )}

          {status === "activating" && (
            <div className="flex flex-col items-center gap-4 py-10">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
              <p className="text-sm text-muted">有効化中...</p>
            </div>
          )}

          {(status === "success" || status === "already") && (
            <div className="space-y-5 py-4 text-center">
              <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10 text-3xl">
                ✅
              </div>
              <div>
                <h2 className="mb-2 text-xl font-bold text-green-500">
                  {status === "already"
                    ? "既に有効化済みです"
                    : "Proプランが有効化されました！"}
                </h2>
                <p className="text-sm text-muted">
                  {codeInfo?.description || ""}
                </p>
                <p className="mt-2 text-xs text-foreground">
                  有効期限: <span className="font-bold">{formatExpiry(expiresAt)}</span>
                </p>
              </div>

              <div className="rounded-xl border border-card-border bg-card/50 p-4 text-left">
                <p className="mb-2 text-xs font-bold text-foreground">
                  {TIER_FEATURES[codeInfo?.accessTier || "full"].label} で利用できる機能:
                </p>
                <ul className="space-y-1.5 text-xs text-muted">
                  {TIER_FEATURES[codeInfo?.accessTier || "full"].items.map(
                    (item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span className="text-accent">•</span>
                        {item}
                      </li>
                    ),
                  )}
                </ul>
              </div>

              <button
                onClick={() => router.push("/roleplay")}
                className="h-12 w-full rounded-xl bg-accent text-base font-bold text-white transition hover:bg-accent-hover"
              >
                ロープレを始める
              </button>
              <Link
                href="/dashboard"
                className="block text-xs text-muted transition hover:text-foreground"
              >
                ダッシュボードへ
              </Link>
            </div>
          )}

          {status === "error" && (
            <div className="space-y-4 py-4 text-center">
              <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 text-3xl">
                ❌
              </div>
              <h2 className="text-xl font-bold text-red-400">
                有効化できませんでした
              </h2>
              <p className="text-sm text-muted">{errorMsg}</p>
              <div className="flex flex-col gap-2 pt-2">
                <button
                  onClick={() => {
                    setStatus(isLoggedIn ? "ready" : "needs-login");
                    setErrorMsg("");
                    setCodeInfo(null);
                  }}
                  className="h-10 w-full rounded-xl border border-card-border bg-card text-sm font-medium text-muted transition hover:text-foreground"
                >
                  別のコードを試す
                </button>
                <Link
                  href="/"
                  className="text-xs text-muted transition hover:text-foreground"
                >
                  トップへ戻る
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default function ActivatePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background">
          <Header />
          <div className="mx-auto max-w-lg px-6 py-20">
            <div className="flex justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
            </div>
          </div>
          <Footer />
        </div>
      }
    >
      <ActivateForm />
    </Suspense>
  );
}
