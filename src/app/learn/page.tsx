"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { getLessonsByLevel, getAllLessons } from "@/lib/lessons";
import type { Lesson } from "@/lib/lessons";

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
    description: "信頼構築から価値提案までの基礎技術を学びます。営業の土台となるマインドセット、褒める技術、前提設定、伝え方の法則、ニーズ発掘、利点話法を習得します。",
    color: "#0F6E56",
    bgColor: "#E0F2ED",
  },
  {
    key: "intermediate" as const,
    label: "中級",
    subtitle: "クロージング",
    description: "お客様の決断を後押しするクロージング技術を学びます。社会的証明、一貫性の活用、第三者話法、ポジティブ/ネガティブクロージング、欲求パターンを習得します。",
    color: "#993C1D",
    bgColor: "#FDF0D5",
  },
  {
    key: "advanced" as const,
    label: "上級",
    subtitle: "反論処理・切り返し",
    description: "「考えたい」「高い」等の反論に対する切り返し技術を学びます。共感→フック→AREA話法の型、5つの切り返し技法を実践的に習得します。",
    color: "#A32D2D",
    bgColor: "#FCE8E8",
  },
];

function getProgress(): Progress {
  if (typeof window === "undefined") return { completedLessons: [], quizScores: {} };
  try {
    const raw = localStorage.getItem("seiyaku-learn-progress");
    if (raw) return JSON.parse(raw);
  } catch {}
  return { completedLessons: [], quizScores: {} };
}

export default function LearnPage() {
  const [progress, setProgress] = useState<Progress>({ completedLessons: [], quizScores: {} });

  useEffect(() => {
    setProgress(getProgress());
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-16 px-6">
        <div className="blob blob-teal" style={{ width: 300, height: 300, top: -60, right: -80 }} />
        <div className="blob blob-cream" style={{ width: 250, height: 250, bottom: -40, left: -60 }} />
        <div className="mx-auto max-w-4xl text-center relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-card-border bg-white px-4 py-1.5 text-sm text-muted mb-6">
            <span>22レッスン</span>
            <span className="text-card-border">|</span>
            <span>3レベル</span>
            <span className="text-card-border">|</span>
            <span>理論+実践</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground sm:text-4xl mb-4">
            営業メソッド学習コース
          </h1>
          <p className="text-muted leading-relaxed max-w-2xl mx-auto">
            成約率を高める5ステップ営業メソッドを体系的に学習。
            各レッスンは「理論解説 → トーク例 → 確認クイズ → 実践練習」の4ステップで構成されています。
          </p>
        </div>
      </section>

      {/* Levels */}
      <section className="px-6 pb-20">
        <div className="mx-auto max-w-4xl space-y-10">
          {LEVELS.map((level) => {
            const lessons = getLessonsByLevel(level.key);
            const completedCount = lessons.filter((l) =>
              progress.completedLessons.includes(l.slug),
            ).length;
            const progressPercent = lessons.length > 0 ? Math.round((completedCount / lessons.length) * 100) : 0;

            return (
              <div key={level.key} className="rounded-2xl border border-card-border bg-white overflow-hidden">
                {/* Level Header */}
                <div className="p-6 sm:p-8" style={{ borderBottom: `3px solid ${level.color}` }}>
                  <div className="flex items-start gap-4">
                    <div
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white text-sm font-bold"
                      style={{ backgroundColor: level.color }}
                    >
                      {level.label}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-xl font-bold text-foreground">
                        {level.label}：{level.subtitle}
                      </h2>
                      <p className="mt-1 text-sm text-muted leading-relaxed">
                        {level.description}
                      </p>
                      {/* Progress Bar */}
                      <div className="mt-3 flex items-center gap-3">
                        <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${progressPercent}%`,
                              backgroundColor: level.color,
                            }}
                          />
                        </div>
                        <span className="text-xs text-muted whitespace-nowrap">
                          {completedCount}/{lessons.length} 完了
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Lesson List */}
                <div className="divide-y divide-gray-50">
                  {lessons.map((lesson) => {
                    const isCompleted = progress.completedLessons.includes(lesson.slug);
                    const score = progress.quizScores[lesson.slug];

                    return (
                      <Link
                        key={lesson.slug}
                        href={`/learn/${lesson.slug}`}
                        className="flex items-center gap-4 px-6 sm:px-8 py-4 transition hover:bg-gray-50 group"
                      >
                        {/* Order Number */}
                        <div
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                          style={{
                            backgroundColor: isCompleted ? level.color : level.bgColor,
                            color: isCompleted ? "#fff" : level.color,
                          }}
                        >
                          {isCompleted ? (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          ) : (
                            lesson.order
                          )}
                        </div>

                        {/* Lesson Info */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-foreground group-hover:text-accent transition truncate">
                            {lesson.title}
                          </p>
                          <p className="text-xs text-muted truncate mt-0.5">
                            {lesson.description}
                          </p>
                        </div>

                        {/* Score Badge */}
                        {score !== undefined && (
                          <span
                            className="text-xs font-medium px-2 py-0.5 rounded-full"
                            style={{
                              backgroundColor: level.bgColor,
                              color: level.color,
                            }}
                          >
                            {score}/3
                          </span>
                        )}

                        {/* Arrow */}
                        <svg className="w-4 h-4 text-muted group-hover:text-accent transition shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="9 18 15 12 9 6" />
                        </svg>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Certification Exam Card */}
      <section className="px-6 pb-10">
        <div className="mx-auto max-w-4xl">
          <ExamCard progress={progress} />
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-20">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-2xl border border-card-border bg-white p-8 sm:p-10 text-center">
            <h2 className="text-xl font-bold text-foreground mb-3">
              学んだ技術を実践で磨こう
            </h2>
            <p className="text-sm text-muted mb-6 max-w-lg mx-auto leading-relaxed">
              理論を学んだら、AIロープレで実践練習。ワークシートで商談準備も万全に。
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/roleplay"
                className="rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-accent-hover"
              >
                AIロープレで練習する
              </Link>
              <Link
                href="/worksheet"
                className="rounded-xl border border-card-border px-6 py-3 text-sm font-medium text-foreground transition hover:border-accent"
              >
                ワークシートで準備する
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

/* ── Exam CTA Card ─────────────────────────────── */

function ExamCard({ progress }: { progress: Progress }) {
  const totalLessons = getAllLessons().length;
  const completedCount = progress.completedLessons.length;
  const allCompleted = completedCount >= totalLessons;
  const remaining = totalLessons - completedCount;

  return (
    <div className="rounded-2xl border-2 border-accent/30 bg-white overflow-hidden">
      <div className="p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="8" r="6" />
              <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-xl font-bold text-foreground">
                成約メソッド認定試験
              </h2>
              {progress.certified && (
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-green-50 text-green-700">
                  認定済
                </span>
              )}
            </div>
            <p className="text-sm text-muted leading-relaxed mb-4">
              全レッスンの学習を完了し、認定試験に合格して認定証を取得しましょう。
              20問中16問以上の正答（80%）で合格です。
            </p>

            {/* Progress */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-accent transition-all duration-500"
                  style={{ width: `${(completedCount / totalLessons) * 100}%` }}
                />
              </div>
              <span className="text-xs text-muted whitespace-nowrap">
                {completedCount}/{totalLessons} レッスン完了
              </span>
            </div>

            {!allCompleted && (
              <p className="text-xs text-muted mb-4">
                受験するにはあと <strong className="text-foreground">{remaining}レッスン</strong> の完了が必要です
              </p>
            )}

            <Link
              href="/learn/exam"
              className={`inline-flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold transition ${
                allCompleted
                  ? "bg-accent text-white hover:bg-accent-hover shadow-sm"
                  : "bg-gray-100 text-muted cursor-default"
              }`}
            >
              {progress.certified ? "再受験する" : "試験を受ける"}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
