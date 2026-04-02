"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function NPSContent() {
  const searchParams = useSearchParams();
  const scoreParam = searchParams.get("score");
  const score = scoreParam ? parseInt(scoreParam, 10) : null;
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (score !== null && score >= 0 && score <= 10) {
      // Record the NPS score immediately
      fetch("/api/nps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ score }),
      }).catch(() => {});
    }
  }, [score]);

  const handleSubmitFeedback = async () => {
    if (!feedback.trim()) {
      setSubmitted(true);
      return;
    }
    setSubmitting(true);
    try {
      await fetch("/api/nps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ score, feedback }),
      });
    } catch { /* ignore */ }
    setSubmitted(true);
    setSubmitting(false);
  };

  if (score === null || isNaN(score) || score < 0 || score > 10) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-6">
        <div className="text-center">
          <p className="text-sm text-muted mb-4">無効なリンクです</p>
          <Link href="/" className="text-sm text-accent hover:underline">トップに戻る</Link>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-6">
        <div className="mx-auto max-w-md text-center">
          <div className="mb-4 text-5xl">🙏</div>
          <h1 className="mb-2 text-xl font-bold">ご回答ありがとうございます！</h1>
          <p className="mb-6 text-sm text-muted">
            いただいたフィードバックは、サービス改善に活用させていただきます。
          </p>
          <Link
            href="/roleplay"
            className="inline-flex h-12 items-center justify-center rounded-xl bg-accent px-8 text-sm font-bold text-white transition hover:bg-accent-hover"
          >
            ロープレを始める
          </Link>
        </div>
      </div>
    );
  }

  const category = score <= 6 ? "detractor" : score <= 8 ? "passive" : "promoter";
  const followUp = {
    detractor: "改善すべき点を教えてください。",
    passive: "もっと良くするために何ができるでしょうか？",
    promoter: "特に気に入っている点を教えてください！",
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="mx-auto max-w-md w-full">
        <div className="rounded-2xl border border-card-border bg-card p-8">
          <div className="mb-4 text-center">
            <span className={`inline-flex h-16 w-16 items-center justify-center rounded-full text-2xl font-bold ${
              category === "promoter" ? "bg-green-100 text-green-600" :
              category === "passive" ? "bg-yellow-100 text-yellow-600" :
              "bg-red-100 text-red-600"
            }`}>
              {score}
            </span>
          </div>
          <h1 className="mb-2 text-lg font-bold text-center">ご回答ありがとうございます</h1>
          <p className="mb-6 text-sm text-muted text-center">
            {followUp[category]}（任意）
          </p>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="自由にご記入ください..."
            rows={4}
            className="w-full rounded-lg border border-card-border bg-background px-4 py-3 text-sm focus:border-accent focus:outline-none resize-none"
          />
          <button
            onClick={handleSubmitFeedback}
            disabled={submitting}
            className="mt-3 w-full rounded-lg bg-accent py-3 text-sm font-bold text-white transition hover:bg-accent-hover disabled:opacity-50"
          >
            {submitting ? "送信中..." : feedback.trim() ? "フィードバックを送信" : "スキップ"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function NPSPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-sm text-muted animate-pulse">読み込み中...</div>
      </div>
    }>
      <NPSContent />
    </Suspense>
  );
}
