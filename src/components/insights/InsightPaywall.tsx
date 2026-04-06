"use client";

interface InsightPaywallProps {
  onUpgrade: () => void;
}

export function InsightPaywall({ onUpgrade }: InsightPaywallProps) {
  return (
    <div className="relative overflow-hidden rounded-xl">
      {/* Blur overlay */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-gradient-to-t from-background via-background/80 to-transparent backdrop-blur-sm">
        <div className="text-center">
          <div className="mb-2"><svg className="mx-auto h-8 w-8 text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg></div>
          <p className="mb-1 text-sm font-bold text-foreground">
            Proプランで全記事を読む
          </p>
          <p className="mb-4 text-xs text-muted">
            無制限のインサイト + 営業トーク変換
          </p>
          <button
            onClick={onUpgrade}
            className="rounded-lg bg-accent px-6 py-2.5 text-sm font-bold text-white transition hover:bg-accent-hover"
          >
            Proにアップグレード
          </button>
        </div>
      </div>
    </div>
  );
}
