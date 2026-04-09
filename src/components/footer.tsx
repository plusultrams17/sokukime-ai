import Link from "next/link";
import { Logo } from "@/components/logo";

export function Footer() {
  return (
    <footer className="border-t border-card-border bg-white px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-6 sm:gap-8 sm:grid-cols-2 md:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="mb-3">
              <Logo />
            </div>
            <p className="text-sm text-muted leading-relaxed">
              AI × 成約メソッドで<br />営業力を鍛える
            </p>
          </div>
          {/* Product */}
          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground">サービス</h4>
            <nav className="flex flex-col gap-2 text-sm text-muted">
              <Link href="/learn" className="transition hover:text-foreground">学習コース</Link>
              <Link href="/roleplay" className="transition hover:text-foreground">AIロープレ</Link>
              <Link href="/tools" className="transition hover:text-foreground">無料ツール</Link>
              <Link href="/diagnose" className="transition hover:text-foreground">営業力診断</Link>
              <Link href="/pricing" className="transition hover:text-foreground">料金プラン</Link>
              <Link href="/blog" className="transition hover:text-foreground">ブログ</Link>
            </nav>
          </div>
          {/* Resources */}
          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground">リソース</h4>
            <nav className="flex flex-col gap-2 text-sm text-muted">
              <Link href="/industry" className="transition hover:text-foreground">業種別ロープレ</Link>
              <Link href="/use-cases" className="transition hover:text-foreground">活用シーン</Link>
              <Link href="/faq" className="transition hover:text-foreground">よくある質問</Link>
              <Link href="/about" className="transition hover:text-foreground">成約コーチAIについて</Link>
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
          &copy; {new Date().getFullYear()} 成約コーチAI. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
