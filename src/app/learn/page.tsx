"use client";

import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { getLessonsByLevel, getAllLessons } from "@/lib/lessons";
import { LessonScene } from "@/components/lesson-scenes";
import { PdfExportButton } from "@/components/pdf/PdfExportButton";
import WorksheetPdfContent from "@/components/pdf/WorksheetPdfContent";
import { loadCompanyContext, hasCompanyContext } from "@/lib/company-context";

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
      "信頼構築から価値提案までの基礎技術を学びます。営業の土台となるマインドセット、褒める技術、前提設定、伝え方の法則、ニーズ発掘、利点話法を習得します。",
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
      "「考えたい」「高い」等の反論に対する切り返し技術を学びます。共感→フック→AREA話法の型、5つの切り返し技法を実践的に習得します。",
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

  useEffect(() => {
    setProgress(getProgress());
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
      <section className="border-b border-gray-200 pt-28 pb-10 px-6">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm font-medium text-accent mb-3 tracking-wide">
            営業メソッド学習プログラム
          </p>
          <h1 className="text-3xl font-bold text-foreground sm:text-4xl leading-tight mb-4">
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
      <section className="px-6 py-12">
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

                    return (
                      <Link
                        key={lesson.slug}
                        href={`/learn/${lesson.slug}`}
                        onClick={(e) => handleCardTap(e, lesson.slug)}
                        className={`lesson-card${activeCard === lesson.slug ? " is-active" : ""}`}
                      >
                        {/* Scene illustration (fills entire card) */}
                        <div className="lesson-card__figure">
                          <LessonScene slug={lesson.slug} />
                        </div>

                        {/* Badge: always visible */}
                        <span
                          className="lesson-card__badge"
                          style={{ backgroundColor: level.color }}
                        >
                          {level.label} {lesson.order}
                        </span>

                        {/* Score: always visible */}
                        {score !== undefined && (
                          <span
                            className="lesson-card__score"
                            style={{ color: level.color }}
                          >
                            {score}/3
                          </span>
                        )}

                        {/* Completed check */}
                        {isCompleted && (
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
                        <div className="lesson-card__overlay">
                          <p className="lesson-card__title">
                            {lesson.title}
                          </p>
                          <p className="lesson-card__desc">
                            {lesson.description}
                          </p>
                        </div>
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
      <section className="px-6 pb-8">
        <div className="mx-auto max-w-5xl">
          <ExamCard progress={progress} />
        </div>
      </section>

      {/* Full Worksheet PDF Export */}
      <section className="border-t border-gray-200 px-6 py-10">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 sm:p-6 border border-gray-200 rounded-xl bg-gray-50/50">
            <div>
              <h3 className="text-base font-bold text-foreground mb-1">
                営業準備ワークシート（完全版）
              </h3>
              <p className="text-sm text-muted leading-relaxed">
                全レッスンで記入したワークシートを1つのPDFにまとめて保存。商談前の確認資料として活用できます。
              </p>
            </div>
            <PdfExportButton
              filename="営業準備ワークシート_完全版.pdf"
              renderContent={(ref) => {
                let phaseData: Record<string, string>[] = [{}, {}, {}, {}, {}];
                let previews: string[] = ["", "", "", "", ""];
                let industry = "";
                try {
                  const saved = localStorage.getItem("worksheet-v2-data");
                  if (saved) {
                    const parsed = JSON.parse(saved);
                    if (parsed.phaseData) phaseData = parsed.phaseData;
                    if (parsed.previews) previews = parsed.previews;
                    if (parsed.industry) industry = parsed.industry;
                  }
                } catch {}
                const ctx = loadCompanyContext();
                if (!industry && ctx.industry) industry = ctx.industry;
                const productInfo = hasCompanyContext(ctx)
                  ? {
                      productName: ctx.productName,
                      industry: ctx.industry,
                      targetAudience: ctx.targetAudience,
                      keyFeatures: ctx.keyFeatures,
                      priceRange: ctx.priceRange,
                      advantages: ctx.advantages,
                      challenges: ctx.challenges,
                    }
                  : null;
                return (
                  <WorksheetPdfContent
                    ref={ref}
                    industry={industry}
                    productInfo={productInfo}
                    phaseData={phaseData}
                    previews={previews}
                  />
                );
              }}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-foreground transition hover:border-foreground shrink-0"
            >
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
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              完全版PDFをダウンロード
            </PdfExportButton>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-gray-200 px-6 py-12">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="text-lg font-bold text-foreground mb-2">
            学んだ技術を実践で磨く
          </h2>
          <p className="text-sm text-muted mb-6">
            理論を学んだら、AIロープレで実践練習。各レッスンのワークシートで商談準備も万全に。
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/roleplay"
              className="rounded-lg bg-accent px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-hover"
            >
              AIロープレで練習する
            </Link>
            <Link
              href="/lp/roleplay"
              className="rounded-lg border border-gray-300 px-6 py-2.5 text-sm font-medium text-foreground transition hover:border-foreground"
            >
              営業分析を試す（無料）
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

/* ── Exam Section ─────────────────────────────── */

function ExamCard({ progress }: { progress: Progress }) {
  const totalLessons = getAllLessons().length;
  const completedCount = progress.completedLessons.length;
  const allCompleted = completedCount >= totalLessons;
  const remaining = totalLessons - completedCount;

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
        全レッスンの学習を完了し、認定試験に合格して認定証を取得しましょう。
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
