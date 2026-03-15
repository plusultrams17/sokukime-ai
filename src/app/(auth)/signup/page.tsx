"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { trackSignupStarted, trackSignupCompleted } from "@/lib/tracking";

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

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/roleplay";
  const refCode = searchParams.get("ref") || "";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [referralValid, setReferralValid] = useState<boolean | null>(null);

  // 紹介コードの検証
  useEffect(() => {
    if (!refCode) return;
    fetch(`/api/referral/validate?code=${encodeURIComponent(refCode)}`)
      .then((r) => r.json())
      .then((data) => setReferralValid(data.valid))
      .catch(() => setReferralValid(false));
  }, [refCode]);

  async function handleGoogleSignup() {
    setError("");
    setIsGoogleLoading(true);
    trackSignupStarted("google");

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
      setError("Google登録に失敗しました。もう一度お試しください。");
      setIsGoogleLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    trackSignupStarted("email");

    setIsLoading(true);

    const supabase = createClient();
    if (!supabase) {
      setError("サービスが一時的に利用できません");
      setIsLoading(false);
      return;
    }
    const emailCallbackUrl = new URL("/auth/callback", window.location.origin);
    emailCallbackUrl.searchParams.set("redirect", redirect);
    if (refCode) emailCallbackUrl.searchParams.set("ref", refCode);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: emailCallbackUrl.toString(),
      },
    });

    if (error) {
      setError(error.message === "User already registered"
        ? "このメールアドレスは既に登録されています"
        : "登録に失敗しました。もう一度お試しください");
      setIsLoading(false);
      return;
    }

    trackSignupCompleted("email");
    setSuccess(true);
    setIsLoading(false);
  }

  if (success) {
    return (
      <div className="rounded-2xl border border-card-border bg-card p-6 text-center space-y-4">
        <div className="text-4xl">📧</div>
        <h2 className="text-lg font-bold">確認メールを送信しました</h2>
        <p className="text-sm text-muted">
          <span className="font-medium text-foreground">{email}</span>{" "}
          に確認メールを送りました。
          <br />
          メール内のリンクをクリックして登録を完了してください。
        </p>
        <p className="text-xs text-muted">
          メールが届かない場合は、迷惑メールフォルダもご確認ください。
        </p>
        <Link
          href={`/login${redirect !== "/roleplay" ? `?redirect=${encodeURIComponent(redirect)}` : ""}`}
          className="inline-block text-sm text-accent hover:underline"
        >
          ログインページへ
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="rounded-2xl border border-card-border bg-card p-6 space-y-4">
        <h2 className="text-lg font-bold">新規登録</h2>
        <p className="text-xs text-muted">
          無料アカウントで1日1回ロープレできます
        </p>

        {referralValid && (
          <div className="rounded-lg border border-accent/30 bg-accent/5 px-4 py-3 text-center">
            <div className="text-xs font-bold text-accent">
              🎁 紹介コード適用済み
            </div>
            <div className="text-[10px] text-muted">
              Proプラン登録時に ¥1,000 OFF が適用されます
            </div>
          </div>
        )}

        {error && (
          <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Google OAuth - Primary */}
        <button
          type="button"
          onClick={handleGoogleSignup}
          disabled={isGoogleLoading}
          className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border-2 border-accent bg-accent/5 text-sm font-bold text-accent transition hover:bg-accent/10 disabled:opacity-60"
        >
          {isGoogleLoading ? (
            "接続中..."
          ) : (
            <>
              <GoogleIcon />
              Googleで始める（推奨）
            </>
          )}
        </button>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-card-border" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-card px-3 text-muted">またはメールで登録</span>
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted">
            メールアドレス
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
            className="w-full rounded-lg border border-card-border bg-background px-4 py-3 text-sm outline-none placeholder:text-muted/50 focus:border-accent"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted">
            パスワード
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              placeholder="6文字以上"
              className="w-full rounded-lg border border-card-border bg-background px-4 py-3 pr-12 text-sm outline-none placeholder:text-muted/50 focus:border-accent"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded px-1.5 py-1 text-xs font-medium text-muted transition hover:text-foreground"
            >
              {showPassword ? "隠す" : "表示"}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="flex h-12 w-full items-center justify-center rounded-xl bg-accent text-base font-bold text-white transition hover:bg-accent-hover disabled:opacity-60"
        >
          {isLoading ? "登録中..." : "メールで登録する"}
        </button>

        <div className="rounded-xl border border-card-border bg-card/50 p-4 space-y-2">
          <div className="text-xs font-medium text-muted mb-2">無料アカウントに含まれるもの:</div>
          {["AIロープレ（1日1回）", "成約5ステップ採点", "リアルタイムAIコーチ", "クレジットカード不要"].map(item => (
            <div key={item} className="flex items-center gap-2 text-xs text-muted">
              <span className="text-accent">✓</span> {item}
            </div>
          ))}
        </div>
      </div>

      <p className="text-center text-sm text-muted">
        既にアカウントをお持ちの方は{" "}
        <Link
          href={`/login${redirect !== "/roleplay" ? `?redirect=${encodeURIComponent(redirect)}` : ""}`}
          className="text-accent hover:underline"
        >
          ログイン
        </Link>
      </p>
    </form>
  );
}

export default function SignupPage() {
  return (
    <Suspense>
      <SignupForm />
    </Suspense>
  );
}
