import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CHALLENGES } from "@/lib/challenges";

export const metadata: Metadata = {
  title: "60秒チャレンジ｜営業の切り返し力を試す - 成約コーチAI",
  description:
    "60秒で1つの反論を切り返せ。「高いですね」「検討します」「他社と比較中」— あなたの切り返し力を即採点。",
};

export default function ChallengePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <section className="relative overflow-hidden bg-gradient-to-b from-[#1a0a00] to-[#2d1810] px-6 pt-24 pb-16 sm:pt-32 sm:pb-20">
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent">
            60秒1本勝負
          </div>
          <h1 className="mb-4 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            <span className="text-accent">切り返し</span>チャレンジ
          </h1>
          <p className="mx-auto max-w-2xl text-base text-white/70 leading-relaxed sm:text-lg">
            お客さんの反論に、60秒以内に切り返せ。即座に採点＋模範トークを表示。
          </p>
        </div>
      </section>

      <section className="px-6 py-12 sm:py-16">
        <div className="mx-auto max-w-3xl">
          <div className="grid gap-4">
            {CHALLENGES.map((c) => (
              <Link
                key={c.id}
                href={`/challenge/${c.id}`}
                className="group rounded-2xl border border-card-border bg-card p-6 transition hover:border-accent/40 hover:shadow-lg"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <h2 className="mb-1 text-lg font-bold text-foreground transition group-hover:text-accent">
                      {c.title}
                    </h2>
                    <p className="mb-3 text-sm text-muted">{c.description}</p>
                    <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 px-4 py-3">
                      <p className="mb-1 text-xs font-bold text-blue-400">
                        お客さん:
                      </p>
                      <p className="text-sm italic text-foreground">
                        「{c.customerLine}」
                      </p>
                    </div>
                  </div>
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent transition group-hover:bg-accent group-hover:text-white">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
