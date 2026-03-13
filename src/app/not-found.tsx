import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <div className="text-6xl font-black text-accent">404</div>
        <h1 className="mt-4 text-2xl font-bold">
          ページが見つかりません
        </h1>
        <p className="mt-2 text-sm text-muted">
          お探しのページは存在しないか、移動した可能性があります。
        </p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex h-12 items-center justify-center rounded-xl bg-accent px-8 font-bold text-white transition hover:bg-accent-hover"
          >
            トップページへ
          </Link>
          <Link
            href="/features"
            className="inline-flex h-12 items-center justify-center rounded-xl border border-card-border px-8 font-medium text-muted transition hover:border-accent hover:text-foreground"
          >
            機能を見る
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
