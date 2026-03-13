"use client";

import Link from "next/link";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center">
      <div className="text-5xl">⚠️</div>
      <h1 className="mt-4 text-2xl font-bold">
        エラーが発生しました
      </h1>
      <p className="mt-2 text-sm text-muted">
        一時的な問題が発生しています。しばらくしてからもう一度お試しください。
      </p>
      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
        <button
          onClick={reset}
          className="inline-flex h-12 items-center justify-center rounded-xl bg-accent px-8 font-bold text-white transition hover:bg-accent-hover"
        >
          もう一度試す
        </button>
        <Link
          href="/"
          className="inline-flex h-12 items-center justify-center rounded-xl border border-card-border px-8 font-medium text-muted transition hover:border-accent hover:text-foreground"
        >
          トップページへ
        </Link>
      </div>
    </div>
  );
}
