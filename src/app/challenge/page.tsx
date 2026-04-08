import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CHALLENGES } from "@/lib/challenges";
import { SCENARIO_LIST } from "@/lib/scenarios";

export const metadata: Metadata = {
  title: "営業チャレンジ｜切り返し＆3D商談で営業力を試す - 成約コーチAI",
  description:
    "60秒で反論を切り返せ。3Dバーチャル空間でAI商談に挑め。「高いですね」「検討します」「他社と比較中」— あなたの営業力を即採点。",
};

const difficultyBadge = {
  beginner: { label: "初級", color: "bg-green-500/20 text-green-400 border-green-500/30" },
  intermediate: { label: "中級", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
  advanced: { label: "上級", color: "bg-red-500/20 text-red-400 border-red-500/30" },
};

export default function ChallengePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0c0c10] to-[#1a1a24] px-6 pt-24 pb-10 sm:pt-32 sm:pb-14">
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/15 px-4 py-1.5 text-sm font-bold text-accent">
            営業力トレーニング
          </div>
          <h1 className="mb-4 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            <span className="text-accent">営業</span>チャレンジ
          </h1>
          <p className="mx-auto max-w-2xl text-base text-white/85 leading-relaxed sm:text-lg mb-10">
            3Dバーチャル商談で実戦トレーニング。60秒切り返しで瞬発力を鍛えよう。
          </p>

          {/* Hero Video */}
          <div className="relative mx-auto max-w-4xl">
            <video
              src="/images/challenges/challenge-hero.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="w-full rounded-xl"
            />
          </div>
        </div>
      </section>

      {/* ─── 3D Virtual Roleplay Scenarios ─── */}
      <section className="px-4 pt-10 sm:px-6 sm:pt-14">
        <div className="mx-auto max-w-4xl">
          <div className="mb-6 flex items-center gap-3">
            <h2 className="text-lg font-bold text-foreground sm:text-xl">
              3Dバーチャル商談チャレンジ
            </h2>
            <span className="rounded-full bg-accent/20 px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-accent sm:text-xs">
              NEW — 3D体験
            </span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SCENARIO_LIST.map((s) => {
              const badge = difficultyBadge[s.difficulty];

              if (s.image) {
                return (
                  <Link
                    key={s.id}
                    href={`/challenge/virtual-roleplay?scenario=${s.id}`}
                    className="group relative flex flex-col overflow-hidden rounded-2xl border border-card-border transition hover:border-accent/40 hover:shadow-xl hover:shadow-accent/10"
                  >
                    <div className="relative aspect-[3/4]">
                      <Image
                        src={s.image}
                        alt={s.shortTitle}
                        fill
                        className="object-cover transition duration-500 group-hover:scale-105"
                      />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                      <div className="absolute top-3 right-3">
                        <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold backdrop-blur-sm ${badge.color}`}>
                          {badge.label}
                        </span>
                      </div>
                      <div className="absolute inset-x-0 bottom-0 flex flex-col p-4">
                        <h3 className="mb-1 text-base font-bold text-white transition group-hover:text-accent">
                          {s.shortTitle}
                        </h3>
                        <p className="mb-3 flex-1 text-xs leading-relaxed text-white/80">
                          {s.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-white/60">{s.customerType}</span>
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/30 text-accent backdrop-blur-sm transition group-hover:bg-accent group-hover:text-white">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <polygon points="5 3 19 12 5 21 5 3" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              }

              return (
                <Link
                  key={s.id}
                  href={`/challenge/virtual-roleplay?scenario=${s.id}`}
                  className="group relative flex flex-col overflow-hidden rounded-2xl border border-card-border bg-gradient-to-br from-[#0f1729] to-[#1a2744] p-5 transition hover:border-accent/40 hover:shadow-xl hover:shadow-accent/10"
                >
                  <div className="mb-3 flex items-start justify-between">
                    <span className="text-3xl">{s.emoji}</span>
                    <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${badge.color}`}>
                      {badge.label}
                    </span>
                  </div>
                  <h3 className="mb-1 text-base font-bold text-white transition group-hover:text-accent">
                    {s.shortTitle}
                  </h3>
                  <p className="mb-3 flex-1 text-xs leading-relaxed text-white/70">
                    {s.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-white/50">{s.customerType}</span>
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/20 text-accent transition group-hover:bg-accent group-hover:text-white">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="5 3 19 12 5 21 5 3" />
                      </svg>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── 60-Second Challenges ─── */}
      <section className="px-4 py-10 sm:px-6 sm:py-14">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-4 text-lg font-bold text-foreground sm:text-xl">
            60秒 切り返しチャレンジ
          </h2>
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
