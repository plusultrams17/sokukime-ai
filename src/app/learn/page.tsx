"use client";

import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { getLessonsByLevel, getAllLessons } from "@/lib/lessons";
import { LessonScene } from "@/components/lesson-scenes";
import {
  isLessonAccessibleForTier,
  type AccessTier,
} from "@/lib/lessons/access";

interface Progress {
  completedLessons: string[];
  quizScores: Record<string, number>;
  certified?: boolean;
  certifiedDate?: string;
}

const LEVELS = [
  {
    key: "beginner" as const,
    label: "初級",
    subtitle: "アプローチ・ヒアリング・プレゼン",
    description:
      "信頼構築から価値提案までの基礎技術を学びます。営業の土台となるマインドセット、褒める技術、ゴール共有、伝え方の法則、ニーズ発掘、利点話法を習得します。",
    color: "#0F6E56",
    bgGradient: "from-emerald-50 to-teal-50",
  },
  {
    key: "intermediate" as const,
    label: "中級",
    subtitle: "クロージング",
    description:
      "お客様の決断を後押しするクロージング技術を学びます。社会的証明、一貫性の活用、第三者話法、ポジティブ/ネガティブクロージング、欲求パターンを習得します。",
    color: "#2563EB",
    bgGradient: "from-orange-50 to-amber-50",
  },
  {
    key: "advanced" as const,
    label: "上級",
    subtitle: "反論処理・切り返し",
    description:
      "「考えたい」「高い」等の反論に対する切り返し技術を学びます。共感→フック→切り返しの公式、5つの切り返し技法を実践的に習得します。",
    color: "#7C3AED",
    bgGradient: "from-red-50 to-rose-50",
  },
];

function getProgress(): Progress {
  if (typeof window === "undefined")
    return { completedLessons: [], quizScores: {} };
  try {
    const raw = localStorage.getItem("seiyaku-learn-progress");
    if (raw) return JSON.parse(raw);
  } catch {}
  return { completedLessons: [], quizScores: {} };
}

export default function LearnPage() {
  const [progress, setProgress] = useState<Progress>({
    completedLessons: [],
    quizScores: {},
  });
  const [activeCard, setActiveCard] = useState<string | null>(null);
  const [tier, setTier] = useState<AccessTier | null>(null);

  useEffect(() => {
    setProgress(getProgress());
    fetch("/api/program/status")
      .then((r) => r.json())
      .then((d) => setTier(d.tier ?? null))
      .catch(() => {});
  }, []);

  const handleCardTap = useCallback(
    (e: React.MouseEvent, slug: string) => {
      // On touch devices, first tap reveals overlay, second tap navigates
      if (window.matchMedia("(hover: none)").matches) {
        if (activeCard !== slug) {
          e.preventDefault();
          setActiveCard(slug);
        }
        // If already active, allow the Link to navigate
      }
    },
    [activeCard],
  );

  const totalLessons = getAllLessons().length;
  const totalCompleted = progress.completedLessons.length;

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero */}
      <section className="border-b border-gray-200 pt-20 pb-8 px-4 sm:pt-28 sm:pb-10 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm font-medium text-accent mb-3 tracking-wide">
            営業メソッド学習プログラム
          </p>
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl md:text-4xl leading-tight mb-4">
            成約5ステップを
            <br className="sm:hidden" />
            体系的に学ぶ
          </h1>
          <p className="text-base text-muted leading-relaxed max-w-2xl">
            全{totalLessons}レッスン、3レベル構成。各レッスンは
            <strong className="text-foreground">理論解説</strong>、
            <strong className="text-foreground">トーク例</strong>、
            <strong className="text-foreground">確認クイズ</strong>、
            <strong className="text-foreground">実践練習</strong>
            の4ステップで構成されています。
          </p>

          {/* Overall progress */}
          {totalCompleted > 0 && (
            <div className="mt-6 flex items-center gap-4 max-w-md">
              <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent rounded-full transition-all duration-500"
                  style={{
                    width: `${(totalCompleted / totalLessons) * 100}%`,
                  }}
                />
              </div>
              <span className="text-sm text-muted whitespace-nowrap">
                {totalCompleted}/{totalLessons} 完了
              </span>
            </div>
          )}
        </div>
      </section>

      {/* Levels with Card Grid */}
      <section className="px-4 py-8 sm:px-6 sm:py-12">
        <div className="mx-auto max-w-5xl space-y-16">
          {LEVELS.map((level) => {
            const lessons = getLessonsByLevel(level.key);
            const completedCount = lessons.filter((l) =>
              progress.completedLessons.includes(l.slug),
            ).length;
            const progressPercent =
              lessons.length > 0
                ? Math.round((completedCount / lessons.length) * 100)
                : 0;

            return (
              <div key={level.key} id={level.key}>
                {/* Level heading */}
                <div className="mb-8">
                  <div className="flex items-baseline gap-3 mb-1">
                    <span
                      className="text-xs font-bold tracking-widest uppercase"
                      style={{ color: level.color }}
                    >
                      {level.label}
                    </span>
                    <span className="text-xs text-muted">
                      {completedCount}/{lessons.length} 完了
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-foreground mb-2">
                    {level.subtitle}
                  </h2>
                  <p className="text-sm text-muted leading-relaxed max-w-2xl">
                    {level.description}
                  </p>

                  {/* Progress bar */}
                  <div className="mt-3 h-1 bg-gray-100 rounded-full overflow-hidden max-w-md">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${progressPercent}%`,
                        backgroundColor: level.color,
                      }}
                    />
                  </div>
                </div>

                {/* Card Grid */}
                <div className="lesson-card-grid">
                  {lessons.map((lesson) => {
                    const isCompleted =
                      progress.completedLessons.includes(lesson.slug);
                    const score = progress.quizScores[lesson.slug];
                    const locked = !isLessonAccessibleForTier(
                      lesson.slug,
                      tier,
                    );

                    return (
                      <Link
                        key={lesson.slug}
                        href={locked ? "/program" : `/learn/${lesson.slug}`}
                        onClick={(e) => {
                          if (!locked) handleCardTap(e, lesson.slug);
                        }}
                        className={`lesson-card${activeCard === lesson.slug ? " is-active" : ""}${locked ? " pointer-events-auto" : ""}`}
                      >
                        {/* Scene illustration (fills entire card) */}
                        <div className="lesson-card__figure">
                          <LessonScene slug={lesson.slug} />
                        </div>

                        {/* Lock overlay for paid lessons */}
                        {locked && (
                          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/50 rounded-[inherit]">
                            <svg className="inline-block h-6 w-6 text-white/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                            <p className="text-xs font-medium text-white/90 mt-2 text-center px-3 leading-snug">
                              {lesson.title}
                            </p>
                          </div>
                        )}

                        {/* Badge: always visible */}
                        <span
                          className="lesson-card__badge"
                          style={{ backgroundColor: level.color }}
                        >
                          {level.label} {lesson.order}
                        </span>

                        {/* Score: always visible */}
                        {score !== undefined && !locked && (
                          <span
                            className="lesson-card__score"
                            style={{ color: level.color }}
                          >
                            {score}/3
                          </span>
                        )}

                        {/* Completed check */}
                        {isCompleted && !locked && (
                          <div
                            className="lesson-card__check"
                            style={{ backgroundColor: level.color }}
                          >
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="3"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          </div>
                        )}

                        {/* Detail overlay: appears on hover/tap */}
                        {!locked && (
                          <div className="lesson-card__overlay">
                            <p className="lesson-card__title">
                              {lesson.title}
                            </p>
                            <p className="lesson-card__desc">
                              {lesson.description}
                            </p>
                          </div>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Certification Exam */}
      <section className="px-4 pb-8 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <ExamCard progress={progress} purchased={tier === "full"} />
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-gray-200 px-4 py-10 sm:px-6 sm:py-12">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="text-lg font-bold text-foreground mb-2">
            今学んだ技術を、AIロープレで実践しよう
          </h2>
          <p className="text-sm text-muted mb-6">
            知識だけでは商談は変わりません。AIが本番さながらのお客さん役を演じます。無料・登録不要で今すぐ体験。
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/roleplay"
              className="rounded-lg bg-accent px-6 py-3 text-sm font-bold text-white transition hover:bg-accent-hover"
            >
              無料でAIロープレを試す
            </Link>
          </div>
          <p className="mt-3 text-xs text-muted">
            &#10003; 無料で体験&ensp;&#10003; 登録不要&ensp;&#10003; 3分で完了
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}

/* ── Exam Section ─────────────────────────────── */

function ExamCard({ progress, purchased }: { progress: Progress; purchased: boolean }) {
  const totalLessons = getAllLessons().length;
  const completedCount = progress.completedLessons.length;
  const allCompleted = completedCount >= totalLessons;
  const remaining = totalLessons - completedCount;

  if (!purchased) {
    return (
      <div className="border-t-2 border-accent pt-8 relative">
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-white/80 rounded-xl">
          <svg className="inline-block h-10 w-10 text-muted mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
          <p className="text-sm font-bold text-foreground mb-2">
            認定試験はプログラム購入後にご利用いただけます
          </p>
          <Link
            href="/program"
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-hover"
          >
            教材プログラムを購入する
          </Link>
        </div>
        <div className="opacity-30 pointer-events-none">
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-xs font-bold tracking-widest uppercase text-accent">
              認定試験
            </span>
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">
            成約メソッド認定試験
          </h2>
          <p className="text-sm text-muted leading-relaxed mb-4">
            全レッスンの学習を完了し、認定試験に合格すると認定証を取得できます。
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="border-t-2 border-accent pt-8">
      <div className="flex items-baseline gap-2 mb-1">
        <span className="text-xs font-bold tracking-widest uppercase text-accent">
          認定試験
        </span>
        {progress.certified && (
          <span className="text-xs font-bold text-green-700">
            認定済
          </span>
        )}
      </div>
      <h2 className="text-xl font-bold text-foreground mb-2">
        成約メソッド認定試験
      </h2>
      <p className="text-sm text-muted leading-relaxed mb-4">
        全レッスンの学習を完了し、認定試験に合格すると認定証を取得できます。
        20問中16問以上の正答（80%）で合格です。
      </p>

      {/* Progress */}
      <div className="flex items-center gap-4 mb-4 max-w-md">
        <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-accent rounded-full transition-all duration-500"
            style={{ width: `${(completedCount / totalLessons) * 100}%` }}
          />
        </div>
        <span className="text-sm text-muted whitespace-nowrap">
          {completedCount}/{totalLessons} レッスン完了
        </span>
      </div>

      {!allCompleted && (
        <p className="text-sm text-muted mb-4">
          受験するにはあと{" "}
          <strong className="text-foreground">{remaining}レッスン</strong>{" "}
          の完了が必要です
        </p>
      )}

      <Link
        href="/learn/exam"
        className={`inline-flex items-center gap-2 text-sm font-semibold transition ${
          allCompleted
            ? "text-accent hover:underline"
            : "text-gray-300 cursor-default"
        }`}
      >
        {progress.certified ? "再受験する" : "試験を受ける"}
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </Link>
    </div>
  );
}
