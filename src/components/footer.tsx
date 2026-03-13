import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-card-border bg-background px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">🔥</span>
              <span className="font-bold">即キメAI</span>
            </div>
            <p className="text-sm text-muted leading-relaxed">
              AI × 即決営業メソッドで<br />営業力を鍛える
            </p>
          </div>
          {/* Product */}
          <div>
            <h4 className="mb-3 text-sm font-semibold">プロダクト</h4>
            <nav className="flex flex-col gap-2 text-sm text-muted">
              <Link href="/pricing" className="transition hover:text-foreground">料金プラン</Link>
              <Link href="/features" className="transition hover:text-foreground">機能紹介</Link>
              <Link href="/worksheet" className="transition hover:text-foreground">ワークシート</Link>
              <Link href="/use-cases" className="transition hover:text-foreground">活用シーン</Link>
              <Link href="/blog" className="transition hover:text-foreground">ブログ</Link>
            </nav>
          </div>
          {/* Company */}
          <div>
            <h4 className="mb-3 text-sm font-semibold">会社情報</h4>
            <nav className="flex flex-col gap-2 text-sm text-muted">
              <Link href="/about" className="transition hover:text-foreground">即キメAIについて</Link>
            </nav>
          </div>
          {/* Legal */}
          <div>
            <h4 className="mb-3 text-sm font-semibold">法的情報</h4>
            <nav className="flex flex-col gap-2 text-sm text-muted">
              <Link href="/legal/terms" className="transition hover:text-foreground">利用規約</Link>
              <Link href="/legal/privacy" className="transition hover:text-foreground">プライバシーポリシー</Link>
              <Link href="/legal/tokushoho" className="transition hover:text-foreground">特定商取引法に基づく表記</Link>
            </nav>
          </div>
        </div>
        <div className="mt-8 border-t border-card-border pt-6 text-center text-sm text-muted">
          &copy; {new Date().getFullYear()} 即キメAI. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
