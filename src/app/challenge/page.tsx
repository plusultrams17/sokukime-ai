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
  beginner: { label: "初級", stars: "★", color: "bg-emerald-600 text-white border-emerald-400/50 shadow-[0_0_8px_rgba(16,185,129,0.4)]" },
  intermediate: { label: "中級", stars: "★★", color: "bg-amber-600 text-white border-amber-400/50 shadow-[0_0_8px_rgba(245,158,11,0.4)]" },
  advanced: { label: "上級", stars: "★★★", color: "bg-red-600 text-white border-red-400/50 shadow-[0_0_8px_rgba(239,68,68,0.4)]" },
};

export default function ChallengePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0c0c10] to-[#1a1a24] px-6 pt-24 pb-10 sm:pt-32 sm:pb-14">
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          {/* Fire embers (decorative floating particles) */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            {[...Array(8)].map((_, i) => (
              <span
                key={i}
                className="fire-ember"
                style={{
                  left: `${15 + i * 10}%`,
                  bottom: '40%',
                  animationDelay: `${i * 0.3}s`,
                  animationDuration: `${1.2 + (i % 3) * 0.4}s`,
                  width: `${3 + (i % 3)}px`,
                  height: `${3 + (i % 3)}px`,
                  background: i % 2 === 0 ? '#f97316' : '#fbbf24',
                }}
              />
            ))}
          </div>

          <div className="fire-badge mb-4 inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/15 px-4 py-1.5 text-sm font-bold text-accent">
            営業力トレーニング
          </div>
          <h1 className="fire-text mb-4 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            <span className="fire-text-accent">営業</span>チャレンジ
          </h1>
          <p className="mx-auto max-w-2xl text-base text-white/85 leading-relaxed sm:text-lg mb-10">
            <span className="fire-text" style={{ animationDelay: '0.5s' }}>3Dバーチャル<br className="sm:hidden" />商談で実戦トレーニング。</span><br className="hidden sm:inline" />
            <span className="fire-text" style={{ animationDelay: '1s' }}>60秒切り返しで瞬発力を鍛えよう。</span>
          </p>

          {/* Hero Image — animated HUD frame */}
          <div className="relative mx-auto max-w-4xl overflow-hidden rounded-xl aspect-[16/7]">
            {/* Background image with drift */}
            <Image
              src="/images/challenges/challenge-hero.png"
              alt="営業チャレンジ — 3Dバーチャル商談イメージ"
              fill
              priority
              className="object-cover animate-[hero-drift_20s_ease-in-out_infinite_alternate]"
              style={{ objectPosition: "center 40%" }}
            />
            {/* Vignette */}
            <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_80px_rgba(0,0,0,0.6)]" />

            {/* ── Animated corner brackets ── */}
            {/* Top-left */}
            <div className="pointer-events-none absolute top-3 left-3 h-8 w-8 sm:top-5 sm:left-5 sm:h-10 sm:w-10">
              <span className="absolute top-0 left-0 h-full w-[2px] bg-lp-cta animate-[corner-pulse_2s_ease-in-out_infinite]" />
              <span className="absolute top-0 left-0 h-[2px] w-full bg-lp-cta animate-[corner-pulse_2s_ease-in-out_infinite]" />
            </div>
            {/* Top-right */}
            <div className="pointer-events-none absolute top-3 right-3 h-8 w-8 sm:top-5 sm:right-5 sm:h-10 sm:w-10">
              <span className="absolute top-0 right-0 h-full w-[2px] bg-lp-cta animate-[corner-pulse_2s_ease-in-out_infinite_0.5s]" />
              <span className="absolute top-0 right-0 h-[2px] w-full bg-lp-cta animate-[corner-pulse_2s_ease-in-out_infinite_0.5s]" />
            </div>
            {/* Bottom-left */}
            <div className="pointer-events-none absolute bottom-3 left-3 h-8 w-8 sm:bottom-5 sm:left-5 sm:h-10 sm:w-10">
              <span className="absolute bottom-0 left-0 h-full w-[2px] bg-lp-cta animate-[corner-pulse_2s_ease-in-out_infinite_1s]" />
              <span className="absolute bottom-0 left-0 h-[2px] w-full bg-lp-cta animate-[corner-pulse_2s_ease-in-out_infinite_1s]" />
            </div>
            {/* Bottom-right */}
            <div className="pointer-events-none absolute bottom-3 right-3 h-8 w-8 sm:bottom-5 sm:right-5 sm:h-10 sm:w-10">
              <span className="absolute bottom-0 right-0 h-full w-[2px] bg-lp-cta animate-[corner-pulse_2s_ease-in-out_infinite_1.5s]" />
              <span className="absolute bottom-0 right-0 h-[2px] w-full bg-lp-cta animate-[corner-pulse_2s_ease-in-out_infinite_1.5s]" />
            </div>

            {/* ── Horizontal scan line ── */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <div className="absolute left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-lp-cta/40 to-transparent animate-[scan-line_4s_linear_infinite]" />
            </div>

            {/* ── Corner glow dots ── */}
            <div className="pointer-events-none absolute top-3 left-3 h-1.5 w-1.5 rounded-full bg-lp-cta animate-[dot-blink_1.5s_ease-in-out_infinite] sm:top-5 sm:left-5" />
            <div className="pointer-events-none absolute top-3 right-3 h-1.5 w-1.5 rounded-full bg-lp-cta animate-[dot-blink_1.5s_ease-in-out_infinite_0.4s] sm:top-5 sm:right-5" />
            <div className="pointer-events-none absolute bottom-3 left-3 h-1.5 w-1.5 rounded-full bg-lp-cta animate-[dot-blink_1.5s_ease-in-out_infinite_0.8s] sm:bottom-5 sm:left-5" />
            <div className="pointer-events-none absolute bottom-3 right-3 h-1.5 w-1.5 rounded-full bg-lp-cta animate-[dot-blink_1.5s_ease-in-out_infinite_1.2s] sm:bottom-5 sm:right-5" />
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
                        <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-bold backdrop-blur-sm ${badge.color}`}>
                          <span className="text-[9px] tracking-tight opacity-90">{badge.stars}</span>
                          {badge.label}
                        </span>
                      </div>
                      <div className="absolute inset-x-0 bottom-0 flex flex-col p-4">
                        <h3 className="mb-1 text-base font-bold text-white transition group-hover:text-lp-cta">
                          {s.shortTitle}
                        </h3>
                        <p className="mb-3 flex-1 text-xs leading-relaxed text-white/80">
                          {s.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-white/60">{s.customerType}</span>
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/30 text-accent backdrop-blur-sm transition group-hover:bg-lp-cta group-hover:text-white">
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
                    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-bold ${badge.color}`}>
                      <span className="text-[9px] tracking-tight opacity-90">{badge.stars}</span>
                      {badge.label}
                    </span>
                  </div>
                  <h3 className="mb-1 text-base font-bold text-white transition group-hover:text-lp-cta">
                    {s.shortTitle}
                  </h3>
                  <p className="mb-3 flex-1 text-xs leading-relaxed text-white/70">
                    {s.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-white/50">{s.customerType}</span>
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/20 text-accent transition group-hover:bg-lp-cta group-hover:text-white">
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
                    <h2 className="mb-1 text-lg font-bold text-foreground transition group-hover:text-lp-cta">
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
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent transition group-hover:bg-lp-cta group-hover:text-white">
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
