import Link from "next/link";
import { Header } from "@/components/header";

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-3xl px-6 py-16">{children}</main>

      <footer className="border-t border-card-border px-6 py-8">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
            <div className="text-sm text-muted">
              &copy; {new Date().getFullYear()} 成約コーチAI. All rights reserved.
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
