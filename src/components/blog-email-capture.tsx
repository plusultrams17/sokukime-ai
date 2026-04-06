"use client";

import { useState } from "react";
import { trackCTAClick } from "@/lib/tracking";

export function BlogEmailCapture() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || status === "loading") return;

    setStatus("loading");
    trackCTAClick("blog_email_subscribe", "blog_inline", "/api/beta/signup");

    try {
      const res = await fetch("/api/beta/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || "登録に失敗しました");
        setStatus("error");
        return;
      }

      setStatus("success");
    } catch {
      setErrorMessage("通信エラーが発生しました");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="my-10 rounded-2xl border border-green-500/30 bg-green-500/5 p-6 text-center sm:p-8">
        <div className="mb-2"><svg className="mx-auto h-7 w-7 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg></div>
        <p className="font-bold text-green-400">登録ありがとうございます！</p>
        <p className="mt-1 text-sm text-muted">
          営業ノウハウや新機能の情報をお届けします。
        </p>
      </div>
    );
  }

  return (
    <div className="my-10 rounded-2xl border border-accent/30 bg-accent/5 p-6 sm:p-8">
      <h3 className="mb-2 text-center text-lg font-bold">
        営業ノウハウを受け取る
      </h3>
      <p className="mb-5 text-center text-sm text-muted">
        成約率を上げるテクニックや新機能情報を無料でお届け。
        <br className="hidden sm:block" />
        いつでも解除できます。
      </p>
      <form onSubmit={handleSubmit} className="mx-auto flex max-w-md gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status === "error") setStatus("idle");
          }}
          placeholder="メールアドレスを入力"
          required
          className="h-11 flex-1 rounded-xl border border-card-border bg-background px-4 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="h-11 shrink-0 rounded-xl bg-accent px-5 text-sm font-bold text-white transition hover:bg-accent-hover disabled:opacity-60"
        >
          {status === "loading" ? "送信中..." : "登録する"}
        </button>
      </form>
      {status === "error" && (
        <p className="mt-2 text-center text-xs text-red-400">{errorMessage}</p>
      )}
    </div>
  );
}
