"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { getLessonBySlug, getAdjacentLessons } from "@/lib/lessons";
import type { QuizQuestion } from "@/lib/lessons";

const TABS = [
  { name: "理論", icon: "\u{1F4D6}" },
  { name: "トーク例", icon: "\u{1F4AC}" },
  { name: "確認クイズ", icon: "\u2705" },
  { name: "実践練習", icon: "\u{1F3AF}" },
];

const LEVEL_COLORS: Record<string, { color: string; bgColor: string }> = {
  beginner: { color: "#0F6E56", bgColor: "#E0F2ED" },
  intermediate: { color: "#993C1D", bgColor: "#FDF0D5" },
  advanced: { color: "#A32D2D", bgColor: "#FCE8E8" },
};

interface Progress {
  completedLessons: string[];
  quizScores: Record<string, number>;
}

function getProgress(): Progress {
  if (typeof window === "undefined") return { completedLessons: [], quizScores: {} };
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

  // Quiz state
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  // Reset quiz when slug changes
  useEffect(() => {
    setActiveTab(0);
    setCurrentQ(0);
    setSelected(null);
    setSubmitted(false);
    setScore(0);
    setQuizCompleted(false);
  }, [slug]);

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
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-32 px-6 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            レッスンが見つかりません
          </h1>
          <Link href="/learn" className="text-accent hover:underline">
            学習コースに戻る
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const colors = LEVEL_COLORS[lesson.level];

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
    <div className="min-h-screen bg-background">
      <Header />

      <div className="pt-24 px-6 pb-20">
        <div className="mx-auto max-w-3xl">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted mb-6">
            <Link href="/learn" className="hover:text-foreground transition">
              学習コース
            </Link>
            <span>/</span>
            <span
              className="font-medium px-2 py-0.5 rounded-full text-xs"
              style={{ backgroundColor: colors.bgColor, color: colors.color }}
            >
              {lesson.levelLabel}
            </span>
            <span>/</span>
            <span className="text-foreground truncate">Lesson {lesson.order}</span>
          </nav>

          {/* Lesson Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <span
                className="flex h-10 w-10 items-center justify-center rounded-xl text-white text-sm font-bold"
                style={{ backgroundColor: colors.color }}
              >
                {lesson.order}
              </span>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  {lesson.title}
                </h1>
                <p className="text-sm text-muted mt-0.5">{lesson.description}</p>
              </div>
            </div>
          </div>

          {/* Learning Objectives */}
          {lesson.objectives && lesson.objectives.length > 0 && (
            <div
              className="mb-8 rounded-xl border bg-white p-5 sm:p-6"
              style={{ borderLeftWidth: 4, borderLeftColor: colors.color }}
            >
              <p className="text-sm font-semibold text-foreground mb-3">
                このレッスンを修了すると、以下ができるようになります：
              </p>
              <ul className="space-y-2">
                {lesson.objectives.map((obj, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted">
                    <svg
                      className="w-4 h-4 mt-0.5 shrink-0"
                      style={{ color: colors.color }}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tab Bar */}
          <div className="sticky top-16 z-40 bg-background border-b border-card-border mb-8">
            <div className="flex">
              {TABS.map((tab, i) => (
                <button
                  key={tab.name}
                  onClick={() => setActiveTab(i)}
                  className={`flex-1 py-3 text-center text-sm font-medium transition relative ${
                    activeTab === i
                      ? "text-foreground"
                      : "text-muted hover:text-foreground"
                  }`}
                >
                  <span className="hidden sm:inline mr-1">{tab.icon}</span>
                  {tab.name}
                  {activeTab === i && (
                    <div
                      className="absolute bottom-0 left-0 right-0 h-0.5"
                      style={{ backgroundColor: colors.color }}
                    />
                  )}
                </button>
              ))}
            </div>
            {/* Step progress */}
            <div className="h-1 bg-gray-100 -mb-px">
              <div
                className="h-full transition-all duration-300"
                style={{
                  width: `${((activeTab + 1) / TABS.length) * 100}%`,
                  backgroundColor: colors.color,
                }}
              />
            </div>
          </div>

          {/* Tab Content */}
          <div className="animate-fade-in-up">
            {/* Theory Tab */}
            {activeTab === 0 && (
              <div
                className="blog-content"
                dangerouslySetInnerHTML={{ __html: lesson.theory }}
              />
            )}

            {/* Examples Tab */}
            {activeTab === 1 && (
              <div>
                <div
                  className="blog-content"
                  dangerouslySetInnerHTML={{ __html: lesson.examples }}
                />
                <div className="mt-8 p-4 rounded-xl bg-gray-50 border border-card-border">
                  <p className="text-sm text-muted">
                    <strong className="text-foreground">ポイント：</strong>
                    トーク例はそのまま暗記するのではなく、自分の言葉でアレンジして使いましょう。
                    大切なのは「型」を身につけることです。
                  </p>
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
                colors={colors}
              />
            )}

            {/* Practice Tab */}
            {activeTab === 3 && (
              <div className="space-y-6">
                <div className="rounded-2xl border border-card-border bg-white p-6 sm:p-8">
                  <h2 className="text-lg font-bold text-foreground mb-3">
                    実践練習のテーマ
                  </h2>
                  <p className="text-muted leading-relaxed">
                    {lesson.practicePrompt}
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Link
                    href="/roleplay"
                    className="flex flex-col items-center gap-3 rounded-2xl border border-card-border bg-white p-6 transition hover:border-accent hover:shadow-sm group"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent text-xl">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                      </svg>
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-foreground group-hover:text-accent transition">
                        AIロープレで練習する
                      </p>
                      <p className="text-xs text-muted mt-1">
                        学んだ技術をAI相手に実践
                      </p>
                    </div>
                  </Link>

                  <Link
                    href="/worksheet"
                    className="flex flex-col items-center gap-3 rounded-2xl border border-card-border bg-white p-6 transition hover:border-accent hover:shadow-sm group"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent text-xl">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="16" y1="13" x2="8" y2="13" />
                        <line x1="16" y1="17" x2="8" y2="17" />
                      </svg>
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-foreground group-hover:text-accent transition">
                        ワークシートで準備する
                      </p>
                      <p className="text-xs text-muted mt-1">
                        商談準備を体系的に行う
                      </p>
                    </div>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Prev / Next Navigation */}
          <div className="mt-12 flex items-center justify-between border-t border-card-border pt-6">
            {prev ? (
              <Link
                href={`/learn/${prev.slug}`}
                className="flex items-center gap-2 text-sm text-muted hover:text-foreground transition group"
              >
                <svg className="w-4 h-4 transition group-hover:-translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
                <div className="text-right">
                  <p className="text-xs text-muted">前のレッスン</p>
                  <p className="font-medium text-foreground">{prev.title}</p>
                </div>
              </Link>
            ) : (
              <div />
            )}
            {next ? (
              <Link
                href={`/learn/${next.slug}`}
                className="flex items-center gap-2 text-sm text-muted hover:text-foreground transition group text-right"
              >
                <div>
                  <p className="text-xs text-muted">次のレッスン</p>
                  <p className="font-medium text-foreground">{next.title}</p>
                </div>
                <svg className="w-4 h-4 transition group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </Link>
            ) : (
              <Link
                href="/learn"
                className="flex items-center gap-2 text-sm font-medium text-accent hover:underline"
              >
                コース一覧に戻る
              </Link>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

/* ── Quiz Component (Google Skillshop style) ─────── */

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
  colors,
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
  colors: { color: string; bgColor: string };
}) {
  const [showExplanation, setShowExplanation] = useState(false);

  // Reset explanation toggle when question changes
  useEffect(() => {
    setShowExplanation(false);
  }, [currentQ]);

  if (quizCompleted) {
    const perfect = score === quiz.length;
    return (
      <div className="text-center py-8">
        <div
          className="inline-flex h-20 w-20 items-center justify-center rounded-full text-3xl mb-4"
          style={{ backgroundColor: colors.bgColor }}
        >
          {perfect ? "\u{1F389}" : "\u{1F4AA}"}
        </div>
        <h2 className="text-xl font-bold text-foreground mb-2">
          クイズ完了！
        </h2>
        <p className="text-3xl font-bold mb-2" style={{ color: colors.color }}>
          {score} / {quiz.length}
        </p>
        <p className="text-muted mb-6">
          {perfect
            ? "全問正解！素晴らしいです！"
            : score >= 2
              ? "よくできました！復習して満点を目指しましょう。"
              : "もう一度理論を復習してからチャレンジしてみましょう。"}
        </p>
        <button
          onClick={onRetry}
          className="rounded-xl border border-card-border px-6 py-2.5 text-sm font-medium text-foreground transition hover:border-accent"
        >
          もう一度挑戦する
        </button>
      </div>
    );
  }

  const q = quiz[currentQ];
  const isCorrect = selected === q.answer;

  return (
    <div>
      {/* Progress */}
      <div className="flex items-center justify-between mb-6">
        <span className="text-sm font-medium text-foreground">
          知識の確認
        </span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted">
            {currentQ + 1} / {quiz.length}
          </span>
          <div className="flex gap-1.5">
            {quiz.map((_, i) => (
              <div
                key={i}
                className="h-2 w-8 rounded-full transition-colors"
                style={{
                  backgroundColor:
                    i < currentQ
                      ? colors.color
                      : i === currentQ
                        ? colors.color + "80"
                        : "#E5E7EB",
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Question */}
      <div className="rounded-2xl border border-card-border bg-white p-6 sm:p-8 mb-4">
        <p className="text-xs text-muted mb-2 uppercase tracking-wide">
          レッスンを完了するには、この設問に正解する必要があります。
        </p>
        <h3 className="text-lg font-bold text-foreground mb-6">{q.question}</h3>

        <p className="text-xs text-muted mb-3">適切なものを選択してください。</p>
        <div className="space-y-3">
          {q.options.map((option, i) => {
            let borderColor = "border-card-border";
            let bgColor = "bg-white";
            let textColor = "text-foreground";

            if (submitted) {
              if (i === q.answer) {
                borderColor = "border-green-500";
                bgColor = "bg-green-50";
                textColor = "text-green-800";
              } else if (i === selected && i !== q.answer) {
                borderColor = "border-red-400";
                bgColor = "bg-red-50";
                textColor = "text-red-800";
              } else {
                textColor = "text-muted";
              }
            } else if (i === selected) {
              borderColor = "border-accent";
              bgColor = "bg-accent/5";
            }

            return (
              <button
                key={i}
                onClick={() => onSelect(i)}
                disabled={submitted}
                className={`w-full text-left rounded-xl border-2 ${borderColor} ${bgColor} p-4 transition ${
                  !submitted ? "hover:border-accent cursor-pointer" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold ${
                      submitted && i === q.answer
                        ? "border-green-500 bg-green-500 text-white"
                        : submitted && i === selected && i !== q.answer
                          ? "border-red-400 bg-red-400 text-white"
                          : i === selected && !submitted
                            ? "border-accent bg-accent text-white"
                            : "border-gray-300 text-gray-400"
                    }`}
                  >
                    {submitted && i === q.answer ? (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ) : submitted && i === selected && i !== q.answer ? (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    ) : (
                      String.fromCharCode(65 + i)
                    )}
                  </div>
                  <span className={`text-sm ${textColor}`}>{option}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Submit / Feedback / Next */}
      <div className="space-y-4">
        {/* Submit Button */}
        {!submitted && (
          <div className="text-center">
            <button
              onClick={onSubmit}
              disabled={selected === null}
              className={`rounded-xl px-8 py-3 text-sm font-semibold text-white transition ${
                selected === null
                  ? "bg-gray-300 cursor-not-allowed"
                  : "hover:opacity-90"
              }`}
              style={selected !== null ? { backgroundColor: colors.color } : undefined}
            >
              送信
            </button>
          </div>
        )}

        {/* Result feedback */}
        {submitted && (
          <div className="animate-fade-in-up">
            {/* Correct/Incorrect banner */}
            <div
              className={`rounded-xl p-4 mb-4 ${
                isCorrect
                  ? "bg-green-50 border border-green-200"
                  : "bg-red-50 border border-red-200"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                {isCorrect ? (
                  <svg className="w-5 h-5 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="15" y1="9" x2="9" y2="15" />
                    <line x1="9" y1="9" x2="15" y2="15" />
                  </svg>
                )}
                <span className={`font-bold text-sm ${isCorrect ? "text-green-700" : "text-red-600"}`}>
                  {isCorrect ? "正解！" : "不正解"}
                </span>
              </div>
            </div>

            {/* Toggle explanation */}
            <button
              onClick={() => setShowExplanation(!showExplanation)}
              className="flex items-center gap-1.5 text-sm text-accent font-medium hover:underline mb-4"
            >
              <svg
                className={`w-3 h-3 transition-transform ${showExplanation ? "rotate-90" : ""}`}
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <polygon points="6 3 20 12 6 21" />
              </svg>
              フィードバックを表示
            </button>
            {showExplanation && (
              <div className="p-4 rounded-xl bg-gray-50 border border-card-border mb-4 animate-fade-in-up">
                <p className="text-sm text-muted leading-relaxed">{q.explanation}</p>
              </div>
            )}

            {/* Next button */}
            <div className="text-center">
              <button
                onClick={onNext}
                className="rounded-xl px-8 py-3 text-sm font-semibold text-white transition hover:opacity-90"
                style={{ backgroundColor: colors.color }}
              >
                {currentQ < quiz.length - 1 ? "次の問題" : "結果を見る"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
