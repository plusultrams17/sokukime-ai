"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function GoogleIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

function LoginForm() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/roleplay";
  const refCode = searchParams.get("ref") || "";

  const [error, setError] = useState(searchParams.get("error") || "");
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [stats, setStats] = useState<{ totalUsers: number; totalSessions: number } | null>(null);

  useEffect(() => {
    fetch("/api/stats")
      .then((res) => res.json())
      .then((data) => { if (data.totalUsers > 0) setStats(data); })
      .catch(() => {});
  }, []);

  async function handleGoogleLogin() {
    setError("");
    setIsGoogleLoading(true);

    const supabase = createClient();
    if (!supabase) {
      setError("サービスが一時的に利用できません");
      setIsGoogleLoading(false);
      return;
    }

    const callbackUrl = new URL("/auth/callback", window.location.origin);
    callbackUrl.searchParams.set("redirect", redirect);
    if (refCode) callbackUrl.searchParams.set("ref", refCode);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: callbackUrl.toString(),
      },
    });

    if (error) {
      setError("Googleログインに失敗しました。もう一度お試しください。");
      setIsGoogleLoading(false);
    }
  }

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-card-border bg-card p-6 space-y-4">
        <h2 className="text-lg font-bold text-center">ログイン / 新規登録</h2>
        <p className="text-xs text-muted text-center">
          10秒で始められます
        </p>

        {/* 7日間無料トライアル訴求（強化版） */}
        <div className="rounded-xl border-2 border-accent bg-gradient-to-br from-accent/10 to-accent/5 px-5 py-4 text-center">
          <div className="text-2xl mb-1" aria-hidden="true"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{display:"inline"}}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg></div>
          <p className="text-base font-extrabold text-accent mb-1">
            Proの全機能を <span className="text-lg">7日間無料</span> で試せる
          </p>
          <p className="text-[11px] text-muted">
            登録だけで開始・いつでもキャンセル可能・カード不要
          </p>
        </div>

        {error && (
          <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* 認証ボタン群（Google と Email を同等サイズで並列表示） */}
        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isGoogleLoading}
            className="flex h-14 w-full items-center justify-center gap-3 rounded-xl border-2 border-accent bg-accent/5 text-sm font-bold text-accent transition hover:bg-accent/10 disabled:opacity-60"
          >
            {isGoogleLoading ? (
              "接続中..."
            ) : (
              <>
                <GoogleIcon />
                Googleで続ける
              </>
            )}
          </button>

        </div>

        {/* Free Plan 価値訴求（強化版） */}
        <div className="rounded-xl border border-card-border bg-card/50 p-4 space-y-2">
          <div className="text-xs font-bold text-foreground mb-2">無料アカウントに含まれるもの:</div>
          <ul className="space-y-1.5">
            {[
              "毎日1回のAIロープレ（3日で現在地のスコアが確定）",
              "5カテゴリ別の詳細スコアリング",
              "リアルタイムAIコーチング",
              "クレジットカード不要",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 text-xs text-muted leading-relaxed">
                <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {stats && (
        <p className="text-center text-xs text-muted">
          <span className="font-bold text-foreground">{stats.totalUsers.toLocaleString()}人</span>のユーザーが利用中・累計<span className="font-bold text-foreground">{stats.totalSessions.toLocaleString()}回</span>のロープレ実績
        </p>
      )}
      <p className="text-center text-xs text-muted">
        Googleアカウントでログインすると、初回は自動的にアカウントが作成されます。
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
