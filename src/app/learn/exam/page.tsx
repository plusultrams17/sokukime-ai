"use client";

import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { getAllLessons } from "@/lib/lessons";

const TOTAL_QUESTIONS = 20;
const PASS_THRESHOLD = 0.8;
const PASS_SCORE = Math.ceil(TOTAL_QUESTIONS * PASS_THRESHOLD);

interface ExamQuestion {
  question: string;
  options: string[];
  answer: number;
  lessonSlug: string;
  lessonTitle: string;
  level: string;
}

interface ExamResult {
  date: string;
  score: number;
  total: number;
  passed: boolean;
}

interface Progress {
  completedLessons: string[];
  quizScores: Record<string, number>;
  examResults?: ExamResult[];
  certified?: boolean;
  certifiedDate?: string;
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

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generateExamQuestions(): ExamQuestion[] {
  const lessons = getAllLessons();
  const pool: ExamQuestion[] = [];

  for (const lesson of lessons) {
    const randomQ = lesson.quiz[Math.floor(Math.random() * lesson.quiz.length)];
    pool.push({
      question: randomQ.question,
      options: randomQ.options,
      answer: randomQ.answer,
      lessonSlug: lesson.slug,
      lessonTitle: lesson.title,
      level: lesson.level,
    });
  }

  return shuffleArray(pool).slice(0, TOTAL_QUESTIONS);
}

type ExamState = "intro" | "inProgress" | "result";

export default function ExamPage() {
  const [progress, setProgress] = useState<Progress>({
    completedLessons: [],
    quizScores: {},
  });
  const [examState, setExamState] = useState<ExamState>("intro");
  const [questions, setQuestions] = useState<ExamQuestion[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [selected, setSelected] = useState<number | null>(null);

  const allLessons = useMemo(() => getAllLessons(), []);
  const totalLessons = allLessons.length;

  useEffect(() => {
    setProgress(getProgress());
  }, []);

  const completedCount = progress.completedLessons.length;
  const allCompleted = completedCount >= totalLessons;
  const incompleteLessons = allLessons.filter(
    (l) => !progress.completedLessons.includes(l.slug),
  );

  function startExam() {
    const qs = generateExamQuestions();
    setQuestions(qs);
    setAnswers(new Array(qs.length).fill(null));
    setCurrentQ(0);
    setSelected(null);
    setExamState("inProgress");
  }

  function submitAnswer() {
    if (selected === null) return;
    const newAnswers = [...answers];
    newAnswers[currentQ] = selected;
    setAnswers(newAnswers);

    if (currentQ < questions.length - 1) {
      setCurrentQ((q) => q + 1);
      setSelected(null);
    } else {
      // Calculate score
      let score = 0;
      for (let i = 0; i < questions.length; i++) {
        const ans = i === currentQ ? selected : newAnswers[i];
        if (ans === questions[i].answer) score++;
      }

      const passed = score >= PASS_SCORE;
      const result: ExamResult = {
        date: new Date().toISOString(),
        score,
        total: questions.length,
        passed,
      };

      const p = getProgress();
      if (!p.examResults) p.examResults = [];
      p.examResults.push(result);
      if (passed && !p.certified) {
        p.certified = true;
        p.certifiedDate = new Date().toISOString();
      }
      saveProgress(p);
      setProgress(p);
      setExamState("result");
    }
  }

  // Calculate result
  const finalScore = useMemo(() => {
    if (examState !== "result") return 0;
    let s = 0;
    for (let i = 0; i < questions.length; i++) {
      if (answers[i] === questions[i].answer) s++;
    }
    return s;
  }, [examState, questions, answers]);

  const passed = finalScore >= PASS_SCORE;

  // Weakness analysis
  const weaknessByLevel = useMemo(() => {
    if (examState !== "result") return { beginner: { wrong: 0, total: 0 }, intermediate: { wrong: 0, total: 0 }, advanced: { wrong: 0, total: 0 } };
    const levels: Record<string, { wrong: number; total: number }> = {
      beginner: { wrong: 0, total: 0 },
      intermediate: { wrong: 0, total: 0 },
      advanced: { wrong: 0, total: 0 },
    };
    for (let i = 0; i < questions.length; i++) {
      const lvl = questions[i].level;
      if (levels[lvl]) {
        levels[lvl].total++;
        if (answers[i] !== questions[i].answer) levels[lvl].wrong++;
      }
    }
    return levels;
  }, [examState, questions, answers]);

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
            <span className="text-foreground">認定試験</span>
          </nav>

          {/* ── Intro State ── */}
          {examState === "intro" && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/10 text-accent mb-4">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="8" r="6" />
                    <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold text-foreground mb-2">
                  成約メソッド認定試験
                </h1>
                <p className="text-muted max-w-lg mx-auto">
                  全22レッスンの内容から出題される認定試験です。
                  {PASS_THRESHOLD * 100}%以上の正答で認定証を取得できます。
                </p>
              </div>

              {/* Exam info cards */}
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-card-border bg-white p-5 text-center">
                  <p className="text-2xl font-bold text-foreground">{TOTAL_QUESTIONS}</p>
                  <p className="text-xs text-muted mt-1">出題数</p>
                </div>
                <div className="rounded-xl border border-card-border bg-white p-5 text-center">
                  <p className="text-2xl font-bold text-foreground">制限なし</p>
                  <p className="text-xs text-muted mt-1">制限時間</p>
                </div>
                <div className="rounded-xl border border-card-border bg-white p-5 text-center">
                  <p className="text-2xl font-bold text-foreground">{PASS_SCORE}/{TOTAL_QUESTIONS}</p>
                  <p className="text-xs text-muted mt-1">合格ライン（{PASS_THRESHOLD * 100}%）</p>
                </div>
              </div>

              {/* Requirements */}
              <div className="rounded-2xl border border-card-border bg-white p-6 sm:p-8">
                <h2 className="text-lg font-bold text-foreground mb-4">受験要件</h2>
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-accent transition-all duration-500"
                      style={{ width: `${(completedCount / totalLessons) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-foreground whitespace-nowrap">
                    {completedCount}/{totalLessons} レッスン完了
                  </span>
                </div>

                {allCompleted ? (
                  <p className="text-sm text-green-700 bg-green-50 rounded-lg p-3">
                    全レッスンのクイズを完了しました。認定試験を受験できます。
                  </p>
                ) : (
                  <div>
                    <p className="text-sm text-muted mb-3">
                      認定試験を受験するには、全レッスンのクイズを完了する必要があります。
                      あと <strong className="text-foreground">{totalLessons - completedCount}レッスン</strong> 残っています。
                    </p>
                    <div className="space-y-1.5 max-h-48 overflow-y-auto">
                      {incompleteLessons.map((l) => (
                        <Link
                          key={l.slug}
                          href={`/learn/${l.slug}`}
                          className="flex items-center gap-2 text-sm text-muted hover:text-accent transition p-1.5 rounded-lg hover:bg-gray-50"
                        >
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-100 text-[10px] font-bold text-muted">
                            {l.order}
                          </span>
                          <span>{l.title}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Past results */}
              {progress.examResults && progress.examResults.length > 0 && (
                <div className="rounded-2xl border border-card-border bg-white p-6">
                  <h3 className="text-sm font-bold text-foreground mb-3">過去の受験履歴</h3>
                  <div className="space-y-2">
                    {[...progress.examResults].reverse().slice(0, 5).map((r, i) => (
                      <div key={i} className="flex items-center justify-between text-sm py-1.5 border-b border-gray-50 last:border-0">
                        <span className="text-muted">
                          {new Date(r.date).toLocaleDateString("ja-JP")}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-foreground">
                            {r.score}/{r.total}
                          </span>
                          <span
                            className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                              r.passed
                                ? "bg-green-50 text-green-700"
                                : "bg-red-50 text-red-600"
                            }`}
                          >
                            {r.passed ? "合格" : "不合格"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Start button */}
              <div className="text-center pt-4">
                <button
                  onClick={startExam}
                  disabled={!allCompleted}
                  className={`rounded-xl px-10 py-3.5 text-sm font-bold text-white transition ${
                    allCompleted
                      ? "bg-accent hover:bg-accent-hover shadow-sm"
                      : "bg-gray-300 cursor-not-allowed"
                  }`}
                >
                  試験を開始する
                </button>
              </div>
            </div>
          )}

          {/* ── In Progress State ── */}
          {examState === "inProgress" && questions.length > 0 && (
            <div>
              {/* Progress bar */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-foreground">
                    成約メソッド認定試験
                  </span>
                  <span className="text-xs text-muted">
                    {currentQ + 1} / {questions.length}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-accent transition-all duration-300"
                    style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Question card */}
              <div className="rounded-2xl border border-card-border bg-white p-6 sm:p-8 mb-6">
                <p className="text-xs text-muted mb-1">
                  出典: {questions[currentQ].lessonTitle}
                </p>
                <h3 className="text-lg font-bold text-foreground mb-6">
                  {questions[currentQ].question}
                </h3>

                <div className="space-y-3">
                  {questions[currentQ].options.map((option, i) => (
                    <button
                      key={i}
                      onClick={() => setSelected(i)}
                      className={`w-full text-left rounded-xl border-2 p-4 transition hover:border-accent cursor-pointer ${
                        i === selected
                          ? "border-accent bg-accent/5"
                          : "border-card-border bg-white"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold ${
                            i === selected
                              ? "border-accent bg-accent text-white"
                              : "border-gray-300 text-gray-400"
                          }`}
                        >
                          {String.fromCharCode(65 + i)}
                        </div>
                        <span className="text-sm text-foreground">{option}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit / Next */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted">
                  {currentQ < questions.length - 1
                    ? "回答は後から変更できません"
                    : "最後の問題です"}
                </span>
                <button
                  onClick={submitAnswer}
                  disabled={selected === null}
                  className={`rounded-xl px-8 py-3 text-sm font-semibold text-white transition ${
                    selected === null
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-accent hover:bg-accent-hover"
                  }`}
                >
                  {currentQ < questions.length - 1 ? "次の問題へ" : "試験を終了する"}
                </button>
              </div>
            </div>
          )}

          {/* ── Result State ── */}
          {examState === "result" && (
            <div className="space-y-6">
              {/* Score display */}
              <div className="text-center py-8">
                <div
                  className={`inline-flex h-24 w-24 items-center justify-center rounded-full text-4xl mb-4 ${
                    passed ? "bg-green-50" : "bg-red-50"
                  }`}
                >
                  {passed ? "\u{1F3C6}" : "\u{1F4DA}"}
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  {passed ? "合格おめでとうございます！" : "もう少しです！"}
                </h2>
                <p
                  className={`text-4xl font-bold mb-1 ${
                    passed ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {finalScore} / {questions.length}
                </p>
                <p className="text-muted">
                  正答率: {Math.round((finalScore / questions.length) * 100)}% （合格ライン: {PASS_THRESHOLD * 100}%）
                </p>
              </div>

              {/* Certificate card (pass only) */}
              {passed && (
                <div className="rounded-2xl border-2 border-accent bg-white p-8 sm:p-10 text-center relative overflow-hidden">
                  {/* Decorative corner elements */}
                  <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-accent/20 rounded-tl-2xl" />
                  <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-accent/20 rounded-tr-2xl" />
                  <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-accent/20 rounded-bl-2xl" />
                  <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-accent/20 rounded-br-2xl" />

                  <div className="relative z-10">
                    <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-accent/10 text-accent mb-4">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="8" r="6" />
                        <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
                      </svg>
                    </div>
                    <p className="text-xs text-accent font-bold tracking-widest uppercase mb-2">
                      Certificate of Achievement
                    </p>
                    <h3 className="text-xl font-bold text-foreground mb-1">
                      成約メソッド認定
                    </h3>
                    <p className="text-sm text-muted mb-4">
                      営業メソッド学習コース 全課程修了
                    </p>
                    <div className="flex items-center justify-center gap-6 text-sm text-muted">
                      <div>
                        <p className="text-xs text-muted">取得日</p>
                        <p className="font-medium text-foreground">
                          {new Date().toLocaleDateString("ja-JP")}
                        </p>
                      </div>
                      <div className="w-px h-8 bg-card-border" />
                      <div>
                        <p className="text-xs text-muted">スコア</p>
                        <p className="font-medium text-foreground">
                          {finalScore}/{questions.length}（{Math.round((finalScore / questions.length) * 100)}%）
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Weakness analysis (fail only) */}
              {!passed && (
                <div className="rounded-2xl border border-card-border bg-white p-6 sm:p-8">
                  <h3 className="text-lg font-bold text-foreground mb-4">弱点分析</h3>
                  <div className="space-y-4">
                    {([
                      { key: "beginner", label: "初級（アプローチ・ヒアリング・プレゼン）", color: "#0F6E56", bg: "#E0F2ED" },
                      { key: "intermediate", label: "中級（クロージング）", color: "#993C1D", bg: "#FDF0D5" },
                      { key: "advanced", label: "上級（反論処理・切り返し）", color: "#A32D2D", bg: "#FCE8E8" },
                    ] as const).map(({ key, label, color, bg }) => {
                      const data = weaknessByLevel[key];
                      if (data.total === 0) return null;
                      const correctRate = Math.round(((data.total - data.wrong) / data.total) * 100);
                      return (
                        <div key={key}>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-sm font-medium text-foreground">{label}</span>
                            <span className="text-xs text-muted">
                              {data.total - data.wrong}/{data.total} 正解（{correctRate}%）
                            </span>
                          </div>
                          <div className="h-2.5 rounded-full bg-gray-100 overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all"
                              style={{
                                width: `${correctRate}%`,
                                backgroundColor: data.wrong > 0 ? color : color,
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <p className="text-sm text-muted mt-4">
                    正答率が低い分野のレッスンを重点的に復習しましょう。
                  </p>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
                <button
                  onClick={() => {
                    setExamState("intro");
                    setQuestions([]);
                    setAnswers([]);
                    setSelected(null);
                    setCurrentQ(0);
                  }}
                  className={`rounded-xl px-8 py-3 text-sm font-semibold transition ${
                    passed
                      ? "border border-card-border text-foreground hover:border-accent"
                      : "bg-accent text-white hover:bg-accent-hover"
                  }`}
                >
                  {passed ? "もう一度受験する" : "再挑戦する"}
                </button>
                <Link
                  href="/learn"
                  className="rounded-xl border border-card-border px-8 py-3 text-sm font-medium text-foreground transition hover:border-accent"
                >
                  学習コースに戻る
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
