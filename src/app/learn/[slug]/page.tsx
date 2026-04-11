"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useEffect, useCallback, useRef } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { getLessonBySlug, getAdjacentLessons } from "@/lib/lessons";
import type { QuizQuestion } from "@/lib/lessons";
import { getSectionDiagram } from "@/components/lesson-diagrams";
import { LessonScene } from "@/components/lesson-scenes";
import { LessonPractice } from "@/components/lesson-practice";
import {
  isLessonAccessibleForTier,
  FREE_LESSON_SLUGS,
  type AccessTier,
} from "@/lib/lessons/access";
import { processExamplesHtml } from "@/lib/lessons/process-html";

const TABS = ["理論", "トーク例", "確認クイズ", "実践練習"];

const LEVEL_COLORS: Record<string, string> = {
  beginner: "#0F6E56",
  intermediate: "#2563EB",
  advanced: "#7C3AED",
};

interface Progress {
  completedLessons: string[];
  quizScores: Record<string, number>;
}

function getProgress(): Progress {
  if (typeof window === "undefined")
    return { completedLessons: [], quizScores: {} };
  try {
    const raw = localStorage.getItem("seiyaku-learn-progress");
    if (raw) return JSON.parse(raw);
  } catch {}
  return { completedLessons: [], quizScores: {} };
}

function saveProgress(progress: Progress) {
  localStorage.setItem("seiyaku-learn-progress", JSON.stringify(progress));
}

export default function LessonPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const lesson = getLessonBySlug(slug);
  const { prev, next } = getAdjacentLessons(slug);

  const [activeTab, setActiveTab] = useState(0);
  const [tier, setTier] = useState<AccessTier | null>(null);
  const [statusLoaded, setStatusLoaded] = useState(false);

  // Learning flow state
  const [visitedTabs, setVisitedTabs] = useState<Set<number>>(new Set([0]));
  const [practiceHighlight, setPracticeHighlight] = useState(false);
  const tabContentRef = useRef<HTMLDivElement>(null);

  // Quiz state
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  // Check purchase status
  useEffect(() => {
    fetch("/api/program/status")
      .then((r) => r.json())
      .then((d) => {
        setTier(d.tier ?? null);
        setStatusLoaded(true);
      })
      .catch(() => setStatusLoaded(true));
  }, []);

  // Reset quiz when slug changes
  useEffect(() => {
    setActiveTab(0);
    setVisitedTabs(new Set([0]));
    setPracticeHighlight(false);
    setCurrentQ(0);
    setSelected(null);
    setSubmitted(false);
    setScore(0);
    setQuizCompleted(false);
  }, [slug]);

  /** Switch tab with visited tracking + smooth scroll */
  const switchToTab = useCallback((tabIndex: number) => {
    setActiveTab(tabIndex);
    setVisitedTabs((prev) => new Set(prev).add(tabIndex));
    // Smooth scroll to tab content
    setTimeout(() => {
      tabContentRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  }, []);

  /** Get the next recommended (unvisited) tab index, or -1 if all visited */
  function getNextRecommendedTab(): number {
    for (let i = 0; i < TABS.length; i++) {
      if (!visitedTabs.has(i)) return i;
    }
    return -1;
  }

  const locked = statusLoaded && !isLessonAccessibleForTier(slug, tier);

  const markCompleted = useCallback(
    (finalScore: number) => {
      const progress = getProgress();
      if (!progress.completedLessons.includes(slug)) {
        progress.completedLessons.push(slug);
      }
      progress.quizScores[slug] = finalScore;
      saveProgress(progress);
    },
    [slug],
  );

  if (!lesson) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="pt-32 px-6 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            レッスンが見つかりません
          </h1>
          <Link href="/learn" className="text-accent hover:underline text-sm">
            学習コースに戻る
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  // Show purchase gate for locked lessons
  if (locked) {
    const freeLessons = FREE_LESSON_SLUGS.map((s) => getLessonBySlug(s)).filter(Boolean);
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="pt-24 px-6 pb-20">
          <div className="mx-auto max-w-3xl">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-muted mb-8">
              <Link href="/learn" className="hover:text-foreground hover:underline transition">
                学習コース
              </Link>
              <span className="text-gray-300">/</span>
              <span style={{ color: LEVEL_COLORS[lesson.level] }} className="font-medium">
                {lesson.levelLabel}
              </span>
              <span className="text-gray-300">/</span>
              <span className="text-foreground">Lesson {lesson.order}</span>
            </nav>

            {/* Lesson header (visible) */}
            <div className="mb-8 rounded-2xl overflow-hidden border border-card-border">
              <div className="w-full relative">
                <LessonScene slug={slug} />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <svg className="inline-block h-12 w-12 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                </div>
              </div>
              <div className="p-5 sm:p-6">
                <p
                  className="text-xs font-bold tracking-widest uppercase mb-2"
                  style={{ color: LEVEL_COLORS[lesson.level] }}
                >
                  Lesson {lesson.order}
                </p>
                <h1 className="text-2xl font-bold text-foreground sm:text-3xl mb-2">
                  {lesson.title}
                </h1>
                <p className="text-base text-muted">{lesson.description}</p>
              </div>
            </div>

            {/* Purchase gate */}
            <div className="border border-gray-200 rounded-xl p-8 text-center mb-10">
              <svg className="inline-block h-10 w-10 text-muted mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
              <h2 className="text-lg font-bold text-foreground mb-2">
                このレッスンは有料プラン限定です
              </h2>
              <p className="text-sm text-muted mb-6 max-w-md mx-auto">
                Starter（¥990/月30回）・Pro（¥1,980/月60回）・Master（¥4,980/月200回）のいずれかに登録すると、全22レッスン＋認定試験にアクセスできます。
              </p>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 rounded-lg bg-accent px-8 py-3 text-sm font-bold text-white transition hover:bg-accent-hover"
              >
                Proプランを見る
              </Link>
            </div>

            {/* Free lessons intro */}
            <div className="border-t border-gray-200 pt-8">
              <h3 className="text-sm font-bold text-foreground mb-4">
                無料で学べるレッスン
              </h3>
              <div className="space-y-2">
                {freeLessons.map((fl) => fl && (
                  <Link
                    key={fl.slug}
                    href={`/learn/${fl.slug}`}
                    className="flex items-center gap-3 py-3 border-b border-gray-100 text-sm text-muted hover:text-foreground transition group"
                  >
                    <span className="text-xs font-bold text-gray-400 w-5 text-right">
                      {fl.order}
                    </span>
                    <span className="group-hover:underline">{fl.title}</span>
                    <span className="ml-auto text-xs text-green-600 font-medium">無料</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const color = LEVEL_COLORS[lesson.level];
  const nextRecommended = getNextRecommendedTab();

  function handleSelect(optionIndex: number) {
    if (submitted) return;
    setSelected(optionIndex);
  }

  function handleSubmit() {
    if (selected === null || submitted) return;
    setSubmitted(true);
    if (selected === lesson!.quiz[currentQ].answer) {
      setScore((s) => s + 1);
    }
  }

  function handleNext() {
    if (currentQ < lesson!.quiz.length - 1) {
      setCurrentQ((q) => q + 1);
      setSelected(null);
      setSubmitted(false);
    } else {
      setQuizCompleted(true);
      markCompleted(score);
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="pt-24 px-6 pb-20">
        <div className="mx-auto max-w-3xl">
          {/* Top Section */}
          <div>
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-muted mb-8">
              <Link
                href="/learn"
                className="hover:text-foreground hover:underline transition"
              >
                学習コース
              </Link>
              <span className="text-gray-300">/</span>
              <span style={{ color }} className="font-medium">
                {lesson.levelLabel}
              </span>
              <span className="text-gray-300">/</span>
              <span className="text-foreground">Lesson {lesson.order}</span>
            </nav>

            {/* Scene Banner */}
            <div className="mb-8 rounded-2xl overflow-hidden border border-card-border">
              <div className="w-full">
                <LessonScene slug={slug} />
              </div>
              <div className="p-5 sm:p-6">
                <p
                  className="text-xs font-bold tracking-widest uppercase mb-2"
                  style={{ color }}
                >
                  Lesson {lesson.order}
                </p>
                <h1 className="text-2xl font-bold text-foreground sm:text-3xl mb-2">
                  {lesson.title}
                </h1>
                <p className="text-base text-muted">{lesson.description}</p>
              </div>
            </div>

            {/* Learning Objectives */}
            {lesson.objectives && lesson.objectives.length > 0 && (
              <div
                className="mb-10 border-l-4 pl-5 py-1"
                style={{ borderColor: color }}
              >
                <p className="text-sm font-bold text-foreground mb-3">
                  このレッスンの学習目標
                </p>
                <ul className="space-y-1.5">
                  {lesson.objectives.map((obj, i) => (
                    <li
                      key={i}
                      className="text-sm text-muted leading-relaxed pl-4 relative before:content-[''] before:absolute before:left-0 before:top-[9px] before:w-1.5 before:h-1.5 before:rounded-full"
                      style={
                        {
                          "--tw-before-bg": color,
                        } as React.CSSProperties
                      }
                    >
                      <span
                        className="absolute left-0 top-[9px] w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: color }}
                      />
                      {obj}
                    </li>
                  ))}
                </ul>
              </div>
            )}

          </div>

          {/* Tab + Content */}
          <div>
              {/* Tab Bar with progress indicators */}
              <div ref={tabContentRef} className="sticky top-16 z-40 bg-white border-b border-gray-200 mb-10">
                <div className="flex">
                  {TABS.map((tab, i) => {
                    const isActive = activeTab === i;
                    const isVisited = visitedTabs.has(i) && !isActive;
                    const isRecommended = nextRecommended === i && !isActive;

                    return (
                      <button
                        key={tab}
                        onClick={() => switchToTab(i)}
                        className={`flex-1 py-3.5 text-center text-sm transition relative flex items-center justify-center gap-1.5 ${
                          isActive
                            ? "font-bold text-foreground"
                            : "font-medium text-muted hover:text-foreground"
                        } ${isRecommended ? "animate-gentle-pulse" : ""}`}
                        style={isRecommended ? { borderColor: color } as React.CSSProperties : undefined}
                      >
                        {/* Tab number or check indicator */}
                        {isActive ? (
                          <span
                            className="inline-flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold text-white shrink-0"
                            style={{ backgroundColor: color }}
                          >
                            {i + 1}
                          </span>
                        ) : isVisited ? (
                          <svg className="w-4 h-4 text-green-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        ) : (
                          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-gray-300 text-[11px] font-medium text-gray-400 shrink-0">
                            {i + 1}
                          </span>
                        )}
                        <span className="hidden sm:inline">{tab}</span>
                        {isActive && (
                          <div
                            className="absolute bottom-0 left-0 right-0 h-[3px]"
                            style={{ backgroundColor: color }}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Tab Content */}
              <div>
                {/* Theory Tab */}
                {activeTab === 0 && (
                  <div>
                    <TheoryContent slug={slug} theory={lesson.theory} />
                    {/* Next step button */}
                    <div className="mt-10 flex justify-center">
                      <button
                        onClick={() => switchToTab(1)}
                        className="inline-flex h-12 items-center justify-center rounded-xl px-8 text-sm font-bold text-white transition hover:opacity-90"
                        style={{ backgroundColor: color }}
                      >
                        トーク例を見る →
                      </button>
                    </div>
                  </div>
                )}

                {/* Examples Tab */}
                {activeTab === 1 && (
                  <div>
                    <div
                      className="blog-content"
                      dangerouslySetInnerHTML={{ __html: processExamplesHtml(lesson.examples) }}
                    />
                    <div className="mt-8 border-l-4 border-gray-300 pl-5 py-2">
                      <p className="text-sm text-muted">
                        <strong className="text-foreground">ポイント：</strong>
                        トーク例はそのまま暗記するのではなく、自分の言葉でアレンジして使いましょう。
                        大切なのは「型」を身につけることです。
                      </p>
                    </div>
                    {/* Next step button */}
                    <div className="mt-10 flex justify-center">
                      <button
                        onClick={() => switchToTab(2)}
                        className="inline-flex h-12 items-center justify-center rounded-xl px-8 text-sm font-bold text-white transition hover:opacity-90"
                        style={{ backgroundColor: color }}
                      >
                        確認クイズに挑戦 →
                      </button>
                    </div>
                  </div>
                )}

                {/* Quiz Tab */}
                {activeTab === 2 && (
                  <QuizSection
                    quiz={lesson.quiz}
                    currentQ={currentQ}
                    selected={selected}
                    submitted={submitted}
                    score={score}
                    quizCompleted={quizCompleted}
                    onSelect={handleSelect}
                    onSubmit={handleSubmit}
                    onNext={handleNext}
                    onRetry={() => {
                      setCurrentQ(0);
                      setSelected(null);
                      setSubmitted(false);
                      setScore(0);
                      setQuizCompleted(false);
                    }}
                    onGoToPractice={() => {
                      setPracticeHighlight(true);
                      switchToTab(3);
                    }}
                    color={color}
                  />
                )}

                {/* Practice Tab — Inline Roleplay */}
                {activeTab === 3 && (
                  <LessonPractice
                    slug={slug}
                    lesson={lesson}
                    color={color}
                    practiceHighlight={practiceHighlight}
                  />
                )}
              </div>
          </div>

          {/* Prev / Next Navigation */}
          <div className="mt-16 border-t border-gray-200 pt-8">
            <div className="flex items-center justify-between gap-4">
              {prev ? (
                <Link
                  href={`/learn/${prev.slug}`}
                  className="group flex items-center gap-3 min-w-0"
                >
                  <svg className="w-5 h-5 text-gray-300 group-hover:text-foreground transition shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
                  <div className="min-w-0">
                    <p className="text-xs text-muted mb-0.5">前のレッスン</p>
                    <p className="text-sm font-bold text-foreground group-hover:underline truncate">
                      {prev.title}
                    </p>
                  </div>
                </Link>
              ) : (
                <div />
              )}
              {next ? (
                <Link
                  href={`/learn/${next.slug}`}
                  className="lesson-next-btn group"
                  style={{ "--level-color": color } as React.CSSProperties}
                >
                  <div className="text-right min-w-0">
                    <p className="text-xs text-white/70 mb-0.5">次のレッスン</p>
                    <p className="text-sm font-bold text-white truncate">
                      {next.title}
                    </p>
                  </div>
                  <svg className="lesson-next-btn__arrows" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 66 43">
                    <polygon points="39.58,4.46 44.11,0 66,21.5 44.11,43 39.58,38.54 56.94,21.5" />
                    <polygon points="19.79,4.46 24.32,0 46.21,21.5 24.32,43 19.79,38.54 37.15,21.5" />
                    <polygon points="0,4.46 4.53,0 26.42,21.5 4.53,43 0,38.54 17.36,21.5" />
                  </svg>
                </Link>
              ) : (
                <Link
                  href="/learn"
                  className="lesson-next-btn group"
                  style={{ "--level-color": color } as React.CSSProperties}
                >
                  <div className="text-right min-w-0">
                    <p className="text-xs text-white/70 mb-0.5">全レッスン完了</p>
                    <p className="text-sm font-bold text-white truncate">
                      コース一覧に戻る
                    </p>
                  </div>
                  <svg className="lesson-next-btn__arrows" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 66 43">
                    <polygon points="39.58,4.46 44.11,0 66,21.5 44.11,43 39.58,38.54 56.94,21.5" />
                    <polygon points="19.79,4.46 24.32,0 46.21,21.5 24.32,43 19.79,38.54 37.15,21.5" />
                    <polygon points="0,4.46 4.53,0 26.42,21.5 4.53,43 0,38.54 17.36,21.5" />
                  </svg>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

/* ── Theory with inline diagrams ─────────────────── */

function TheoryContent({ slug, theory }: { slug: string; theory: string }) {
  return <TheorySegment slug={slug} html={theory} keyPrefix="t" />;
}

function TheorySegment({ slug, html, keyPrefix }: { slug: string; html: string; keyPrefix: string }) {
  const parts = html.split(/<!-- DIAGRAM:([\w-]+) -->/);

  if (parts.length === 1) {
    return html.trim() ? (
      <div
        className="blog-content"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    ) : null;
  }

  return (
    <>
      {parts.map((part, i) => {
        if (i % 2 === 0) {
          return part.trim() ? (
            <div
              key={`${keyPrefix}-${i}`}
              className="blog-content"
              dangerouslySetInnerHTML={{ __html: part }}
            />
          ) : null;
        }
        const Comp = getSectionDiagram(slug, part);
        return Comp ? <Comp key={`${keyPrefix}-d-${i}`} /> : null;
      })}
    </>
  );
}

/* ── Quiz Component ─────────────────────────────── */

function QuizSection({
  quiz,
  currentQ,
  selected,
  submitted,
  score,
  quizCompleted,
  onSelect,
  onSubmit,
  onNext,
  onRetry,
  onGoToPractice,
  color,
}: {
  quiz: QuizQuestion[];
  currentQ: number;
  selected: number | null;
  submitted: boolean;
  score: number;
  quizCompleted: boolean;
  onSelect: (i: number) => void;
  onSubmit: () => void;
  onNext: () => void;
  onRetry: () => void;
  onGoToPractice: () => void;
  color: string;
}) {
  const [showExplanation, setShowExplanation] = useState(false);

  useEffect(() => {
    setShowExplanation(false);
  }, [currentQ]);

  if (quizCompleted) {
    const perfect = score === quiz.length;
    return (
      <div className="py-8">
        <p
          className="text-5xl font-bold mb-3"
          style={{ color }}
        >
          {score}/{quiz.length}
        </p>
        <h2 className="text-xl font-bold text-foreground mb-2">
          {perfect ? "全問正解" : "クイズ完了"}
        </h2>
        <p className="text-muted mb-6 text-sm">
          {perfect
            ? "全問正解です。学んだ技術を実践してみましょう。"
            : score >= 2
              ? "あと少しです。実践で復習すると定着します。"
              : "もう一度理論を確認してから再チャレンジしてみてください。"}
        </p>
        <div className="space-y-3">
          <div>
            <button
              onClick={onGoToPractice}
              className="inline-flex h-12 items-center justify-center rounded-xl px-8 text-sm font-bold text-white transition hover:opacity-90"
              style={{ backgroundColor: color }}
            >
              学んだ技術を実践する →
            </button>
          </div>
          <div>
            <button
              onClick={onRetry}
              className="text-sm font-semibold text-accent hover:underline"
            >
              もう一度挑戦する
            </button>
          </div>
        </div>
      </div>
    );
  }

  const q = quiz[currentQ];
  const isCorrect = selected === q.answer;

  return (
    <div>
      {/* Progress indicator */}
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs text-muted uppercase tracking-wide font-medium">
          知識の確認
        </p>
        <p className="text-xs text-muted">
          {currentQ + 1} / {quiz.length}
        </p>
      </div>

      {/* Progress dots */}
      <div className="flex gap-1.5 mb-8">
        {quiz.map((_, i) => (
          <div
            key={i}
            className="h-1 flex-1"
            style={{
              backgroundColor:
                i < currentQ ? color : i === currentQ ? color + "60" : "#E5E7EB",
            }}
          />
        ))}
      </div>

      {/* Question */}
      <div className="mb-8">
        <p className="text-xs text-muted mb-4">
          レッスンを完了するには、この設問に正解する必要があります。
        </p>
        <h3 className="text-lg font-bold text-foreground mb-6 leading-relaxed">
          {q.question}
        </h3>

        <p className="text-xs text-muted mb-3 font-medium">
          適切なものを選択してください。
        </p>
        <div className="space-y-2">
          {q.options.map((option, i) => {
            let borderStyle = "border-gray-200";
            let bgStyle = "";
            let textStyle = "text-foreground";
            let indicatorStyle =
              "border-gray-300 text-gray-400 bg-white";

            if (submitted) {
              if (i === q.answer) {
                borderStyle = "border-green-600";
                bgStyle = "bg-green-50";
                textStyle = "text-green-900";
                indicatorStyle =
                  "border-green-600 bg-green-600 text-white";
              } else if (i === selected && i !== q.answer) {
                borderStyle = "border-red-500";
                bgStyle = "bg-red-50";
                textStyle = "text-red-900";
                indicatorStyle =
                  "border-red-500 bg-red-500 text-white";
              } else {
                textStyle = "text-muted";
              }
            } else if (i === selected) {
              borderStyle = "border-foreground";
              indicatorStyle =
                "border-foreground bg-foreground text-white";
            }

            return (
              <button
                key={i}
                onClick={() => onSelect(i)}
                disabled={submitted}
                className={`w-full text-left border-2 ${borderStyle} ${bgStyle} p-4 transition ${
                  !submitted ? "hover:border-gray-400 cursor-pointer" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold ${indicatorStyle}`}
                  >
                    {submitted && i === q.answer ? (
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ) : submitted && i === selected && i !== q.answer ? (
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    ) : (
                      String.fromCharCode(65 + i)
                    )}
                  </div>
                  <span className={`text-sm ${textStyle}`}>{option}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Submit / Feedback / Next */}
      {!submitted && (
        <div>
          <button
            onClick={onSubmit}
            disabled={selected === null}
            className={`px-8 py-3 text-sm font-bold text-white transition ${
              selected === null
                ? "bg-gray-200 cursor-not-allowed text-gray-400"
                : "bg-foreground hover:bg-foreground/90"
            }`}
            style={
              selected !== null ? { backgroundColor: color } : undefined
            }
          >
            送信
          </button>
        </div>
      )}

      {submitted && (
        <div>
          {/* Result banner */}
          <div
            className={`border-l-4 px-4 py-3 mb-4 ${
              isCorrect
                ? "border-green-600 bg-green-50"
                : "border-red-500 bg-red-50"
            }`}
          >
            <p
              className={`text-sm font-bold ${
                isCorrect ? "text-green-800" : "text-red-700"
              }`}
            >
              {isCorrect ? "正解" : "不正解"}
            </p>
          </div>

          {/* Toggle explanation */}
          <button
            onClick={() => setShowExplanation(!showExplanation)}
            className="flex items-center gap-1.5 text-sm font-medium text-muted hover:text-foreground mb-4"
          >
            <svg
              className={`w-3 h-3 transition-transform ${
                showExplanation ? "rotate-90" : ""
              }`}
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <polygon points="6 3 20 12 6 21" />
            </svg>
            フィードバックを表示
          </button>
          {showExplanation && (
            <div className="border-l-4 border-gray-200 pl-4 mb-6">
              <p className="text-sm text-muted leading-relaxed">
                {q.explanation}
              </p>
            </div>
          )}

          {/* Next button */}
          <button
            onClick={onNext}
            className="px-8 py-3 text-sm font-bold text-white transition hover:opacity-90"
            style={{ backgroundColor: color }}
          >
            {currentQ < quiz.length - 1 ? "次の問題" : "結果を見る"}
          </button>
        </div>
      )}
    </div>
  );
}
