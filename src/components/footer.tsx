import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-card-border bg-white px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="header-logo">
                <path d="M8 38c2-1 5-2 9-2s7 1 9 3" stroke="var(--accent)" strokeWidth="3.5" strokeLinecap="round" />
                <path d="M17 36c2-1.5 4-2 6-1.5 2.5 0.8 4 2.5 5 4.5 0.8 1.5 0.5 3-0.5 4s-2.5 1.5-4 1" stroke="var(--accent)" strokeWidth="3.5" strokeLinecap="round" />
                <path d="M56 38c-2-1-5-2-9-2s-7 1-9 3" stroke="var(--accent)" strokeWidth="3.5" strokeLinecap="round" />
                <path d="M47 36c-2-1.5-4-2-6-1.5-2.5 0.8-4 2.5-5 4.5-0.8 1.5-0.5 3 0.5 4s2.5 1.5 4 1" stroke="var(--accent)" strokeWidth="3.5" strokeLinecap="round" />
                <path d="M27 39c1.5-2 3.5-3 5-3s3.5 1 5 3c1 1.5 1 3 0 4s-2.5 1.5-5 1.5-4-0.5-5-1.5-1-2.5 0-4z" stroke="var(--accent)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M25.5 38.5c1-1 2-1.2 3-0.8 1.2 0.4 1.8 1.5 1.5 2.8" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M38.5 38.5c-1-1-2-1.2-3-0.8-1.2 0.4-1.8 1.5-1.5 2.8" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" />
                <circle cx="32" cy="24" r="2" fill="var(--accent)" opacity="0.7" />
                <circle cx="24" cy="27" r="1.3" fill="var(--accent)" opacity="0.6" />
                <circle cx="40" cy="27" r="1.3" fill="var(--accent)" opacity="0.6" />
                <path d="M32 28v-5" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
                <path d="M27 30l-2-3" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
                <path d="M37 30l2-3" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
              </svg>
              <span className="header-wave-text" aria-label="成約コーチ AI">
                <span className="header-wave-text__outline">成約コーチ AI</span>
                <span className="header-wave-text__fill">成約コーチ AI</span>
              </span>
            </div>
            <p className="text-sm text-muted leading-relaxed">
              AI × 成約メソッドで<br />営業力を鍛える
            </p>
          </div>
          {/* Product */}
          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground">プロダクト</h4>
            <nav className="flex flex-col gap-2 text-sm text-muted">
              <Link href="/pricing" className="transition hover:text-foreground">料金プラン</Link>
              <Link href="/features" className="transition hover:text-foreground">機能紹介</Link>
              <Link href="/worksheet" className="transition hover:text-foreground">ワークシート</Link>
              <Link href="/learn" className="transition hover:text-foreground">学習コース</Link>
              <Link href="/use-cases" className="transition hover:text-foreground">活用シーン</Link>
              <Link href="/blog" className="transition hover:text-foreground">ブログ</Link>
            </nav>
          </div>
          {/* Company */}
          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground">会社情報</h4>
            <nav className="flex flex-col gap-2 text-sm text-muted">
              <Link href="/about" className="transition hover:text-foreground">成約コーチ AIについて</Link>
            </nav>
          </div>
          {/* Legal */}
          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground">法的情報</h4>
            <nav className="flex flex-col gap-2 text-sm text-muted">
              <Link href="/legal/terms" className="transition hover:text-foreground">利用規約</Link>
              <Link href="/legal/privacy" className="transition hover:text-foreground">プライバシーポリシー</Link>
              <Link href="/legal/tokushoho" className="transition hover:text-foreground">特定商取引法に基づく表記</Link>
            </nav>
          </div>
        </div>
        <div className="mt-8 border-t border-card-border pt-6 text-center text-sm text-muted">
          &copy; {new Date().getFullYear()} 成約コーチ AI. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
