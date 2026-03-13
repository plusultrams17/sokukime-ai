"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    setIsLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message === "User already registered"
        ? "このメールアドレスは既に登録されています"
        : "登録に失敗しました。もう一度お試しください");
      setIsLoading(false);
      return;
    }

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
        <Link
          href="/login"
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

        {error && (
          <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

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
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            placeholder="6文字以上"
            className="w-full rounded-lg border border-card-border bg-background px-4 py-3 text-sm outline-none placeholder:text-muted/50 focus:border-accent"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="flex h-12 w-full items-center justify-center rounded-xl bg-accent text-base font-bold text-white transition hover:bg-accent-hover disabled:opacity-60"
        >
          {isLoading ? "登録中..." : "無料で登録する"}
        </button>

        <div className="rounded-xl border border-card-border bg-card/50 p-4 space-y-2">
          <div className="text-xs font-medium text-muted mb-2">無料アカウントに含まれるもの:</div>
          {["AIロープレ（1日1回）", "即決営業5ステップ採点", "リアルタイムAIコーチ", "クレジットカード不要"].map(item => (
            <div key={item} className="flex items-center gap-2 text-xs text-muted">
              <span className="text-accent">✓</span> {item}
            </div>
          ))}
        </div>
      </div>

      <p className="text-center text-sm text-muted">
        既にアカウントをお持ちの方は{" "}
        <Link href="/login" className="text-accent hover:underline">
          ログイン
        </Link>
      </p>
    </form>
  );
}
