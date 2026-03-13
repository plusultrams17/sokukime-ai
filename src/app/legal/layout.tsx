import Link from "next/link";

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-card-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🔥</span>
            <span className="text-lg font-bold">即キメAI</span>
          </Link>
          <Link
            href="/pricing"
            className="rounded-lg bg-accent px-5 py-2 text-sm font-semibold text-white transition hover:bg-accent-hover"
          >
            無料で試す
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-16">{children}</main>

      <footer className="border-t border-card-border px-6 py-8">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
            <div className="text-sm text-muted">
              &copy; {new Date().getFullYear()} 即キメAI. All rights reserved.
            </div>
            <nav className="flex gap-6 text-sm text-muted">
              <Link
                href="/legal/terms"
                className="transition hover:text-foreground"
              >
                利用規約
              </Link>
              <Link
                href="/legal/privacy"
                className="transition hover:text-foreground"
              >
                プライバシーポリシー
              </Link>
              <Link
                href="/legal/tokushoho"
                className="transition hover:text-foreground"
              >
                特定商取引法
              </Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}
