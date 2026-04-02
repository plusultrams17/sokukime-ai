"use client";

import { useState } from "react";

interface ToolEmailGateProps {
  toolName: string;
  onUnlock: () => void;
}

/**
 * Email capture gate for free tools.
 * Shows after quiz/tool completion, gates the detailed results behind email.
 * Stores leads in beta_signups table (reused for all lead capture).
 */
export function ToolEmailGate({ toolName, onUnlock }: ToolEmailGateProps) {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/lead-capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), source: toolName }),
      });

      if (res.ok) {
        localStorage.setItem("tool_email_captured", "true");
        onUnlock();
      } else {
        const data = await res.json();
        if (data.alreadyExists) {
          localStorage.setItem("tool_email_captured", "true");
          onUnlock();
        } else {
          setError("送信に失敗しました。もう一度お試しください。");
        }
      }
    } catch {
      setError("通信エラーが発生しました。");
    }
    setSubmitting(false);
  }

  return (
    <div className="rounded-2xl border-2 border-accent/30 bg-gradient-to-b from-accent/5 to-transparent p-8 text-center">
      <div className="mb-3 text-4xl">📊</div>
      <h3 className="mb-2 text-lg font-bold text-foreground">
        詳細な診断結果を見る
      </h3>
      <p className="mb-6 text-sm text-muted leading-relaxed">
        カテゴリ別スコア・改善ポイント・おすすめ練習法を
        <br />
        メールアドレスの入力で無料で確認できます。
      </p>

      <form onSubmit={handleSubmit} className="mx-auto max-w-sm">
        <div className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            className="flex-1 rounded-lg border border-card-border bg-white px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted/50 focus:border-accent"
          />
          <button
            type="submit"
            disabled={submitting}
            className="shrink-0 rounded-lg bg-accent px-5 py-3 text-sm font-bold text-white transition hover:bg-accent-hover disabled:opacity-50"
          >
            {submitting ? "..." : "結果を見る"}
          </button>
        </div>
        {error && (
          <p className="mt-2 text-xs text-red-500">{error}</p>
        )}
      </form>

      <p className="mt-4 text-[11px] text-muted">
        営業力向上に役立つ情報をお届けします。いつでも配信停止できます。
      </p>
    </div>
  );
}
