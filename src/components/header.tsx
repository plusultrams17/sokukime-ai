import Link from "next/link";

interface HeaderProps {
  user?: { isLoggedIn: boolean };
}

export function Header({ user }: HeaderProps) {
  const isLoggedIn = user?.isLoggedIn ?? false;
  return (
    <header className="fixed top-0 z-50 w-full border-b border-card-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">🔥</span>
          <span className="text-lg font-bold">即キメAI</span>
        </Link>
        <nav className="flex items-center gap-4">
          <Link href="/worksheet" className="hidden text-sm text-muted transition hover:text-foreground sm:block">
            ワークシート
          </Link>
          <Link href="/blog" className="hidden text-sm text-muted transition hover:text-foreground sm:block">
            ブログ
          </Link>
          <Link href="/pricing" className="text-sm text-muted transition hover:text-foreground">
            料金プラン
          </Link>
          {isLoggedIn ? (
            <Link href="/roleplay" className="rounded-lg bg-accent px-5 py-2 text-sm font-semibold text-white transition hover:bg-accent-hover">
              ロープレを始める
            </Link>
          ) : (
            <>
              <Link href="/login" className="text-sm text-muted transition hover:text-foreground">
                ログイン
              </Link>
              <Link href="/roleplay" className="rounded-lg bg-accent px-5 py-2 text-sm font-semibold text-white transition hover:bg-accent-hover">
                無料で試す
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
