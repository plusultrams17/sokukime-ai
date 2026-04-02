import Link from "next/link";
import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "購入完了｜成約5ステップ完全攻略プログラム",
  robots: { index: false },
};

export default function ProgramSuccessPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="px-6 py-24 sm:py-32">
        <div className="mx-auto max-w-2xl text-center">
          {/* Success icon */}
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <svg className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl">
            ご購入ありがとうございます！
          </h1>
          <p className="mb-8 text-base text-muted leading-relaxed sm:text-lg">
            「成約5ステップ完全攻略プログラム」のお支払いが完了しました。
            <br />
            さっそく学習を始めましょう。
          </p>

          <div className="rounded-2xl border border-card-border bg-white p-6 sm:p-8 text-left">
            <h2 className="mb-4 text-lg font-bold text-foreground">次のステップ</h2>
            <ol className="space-y-4 text-sm text-muted">
              <li className="flex gap-3">
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-accent text-xs font-bold text-white">1</span>
                <span><strong className="text-foreground">学習コースを始める</strong> — 22レッスンを順番に進めましょう。1レッスン約5分で完了します。</span>
              </li>
              <li className="flex gap-3">
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-accent text-xs font-bold text-white">2</span>
                <span><strong className="text-foreground">AIロープレで実践</strong> — 各ステップを学んだら、すぐにAIロープレで実践練習しましょう。</span>
              </li>
              <li className="flex gap-3">
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-accent text-xs font-bold text-white">3</span>
                <span><strong className="text-foreground">スコアで成長を実感</strong> — ロープレ後のスコアで弱点を発見し、集中的に改善しましょう。</span>
              </li>
            </ol>
          </div>

          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/learn"
              className="inline-flex h-12 items-center justify-center rounded-xl bg-accent px-8 text-base font-bold text-white transition hover:bg-accent-hover"
            >
              学習を始める
            </Link>
            <Link
              href="/roleplay"
              className="inline-flex h-12 items-center justify-center rounded-xl border-2 border-accent/30 bg-accent/5 px-8 text-base font-bold text-accent transition hover:bg-accent/10"
            >
              AIロープレで練習する
            </Link>
          </div>

          <p className="mt-6 text-xs text-muted">
            ご不明な点がありましたら、お気軽にお問い合わせください。
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
