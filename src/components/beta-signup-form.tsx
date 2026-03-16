"use client";

import { useState, useEffect, FormEvent } from "react";

interface BetaSignupFormProps {
  position: "hero" | "main" | "footer";
}

export function BetaSignupForm({ position }: BetaSignupFormProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/beta/signup")
      .then((res) => res.json())
      .then((data) => setRemaining(data.remaining))
      .catch(() => {});
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setStatus("error");
      setErrorMessage("有効なメールアドレスを入力してください");
      return;
    }

    try {
      const res = await fetch("/api/beta/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setErrorMessage(data.error || "エラーが発生しました");
        return;
      }

      setStatus("success");
      if (data.remaining !== undefined) {
        setRemaining(data.remaining);
      }
    } catch {
      setStatus("error");
      setErrorMessage(
        "ネットワークエラーが発生しました。もう一度お試しください。"
      );
    }
  }

  if (status === "success") {
    return (
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent/20">
          <svg
            className="h-8 w-8 text-accent"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <p className="text-lg font-bold text-foreground">
          登録ありがとうございます！
        </p>
        <p className="mt-2 text-sm text-muted">
          ベータ版の準備ができ次第、ご登録のメールアドレスに招待をお送りします。
        </p>
      </div>
    );
  }

  const isHero = position === "hero";

  return (
    <form onSubmit={handleSubmit} className="mx-auto w-full max-w-md">
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="メールアドレスを入力"
          required
          className={`flex-1 rounded-xl border px-4 py-3 text-sm placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/20 ${
            isHero
              ? "border-white/20 bg-white/10 text-white placeholder:text-white/50 focus:border-white/40"
              : "border-card-border bg-white text-foreground focus:border-accent"
          }`}
          disabled={status === "loading"}
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="rounded-xl bg-accent px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-accent-hover disabled:opacity-50"
        >
          {status === "loading" ? "送信中..." : "無料で登録する"}
        </button>
      </div>

      {status === "error" && (
        <p className="mt-2 text-sm text-red-500">{errorMessage}</p>
      )}

      {remaining !== null && (
        <div
          className={`mt-3 flex items-center justify-center gap-2 text-sm ${
            isHero ? "text-white/70" : "text-muted"
          }`}
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent" />
          </span>
          残り{remaining}名
        </div>
      )}
    </form>
  );
}
