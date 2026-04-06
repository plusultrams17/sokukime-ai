"use client";

import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { getAllLessons } from "@/lib/lessons";
import { FREE_LESSON_SLUGS } from "@/lib/lessons/access";
import { getLessonBySlug } from "@/lib/lessons";

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
    const randomQ =
      lesson.quiz[Math.floor(Math.random() * lesson.quiz.length)];
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
  const [purchased, setPurchased] = useState(false);
  const [statusLoaded, setStatusLoaded] = useState(false);

  const allLessons = useMemo(() => getAllLessons(), []);
  const totalLessons = allLessons.length;

  useEffect(() => {
    setProgress(getProgress());
    fetch("/api/program/status")
      .then((r) => r.json())
      .then((d) => {
        setPurchased(d.purchased);
        setStatusLoaded(true);
      })
      .catch(() => setStatusLoaded(true));
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
      let sc = 0;
      for (let i = 0; i < questions.length; i++) {
        const ans = i === currentQ ? selected : newAnswers[i];
        if (ans === questions[i].answer) sc++;
      }

      const passed = sc >= PASS_SCORE;
      const result: ExamResult = {
        date: new Date().toISOString(),
        score: sc,
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

  const finalScore = useMemo(() => {
    if (examState !== "result") return 0;
    let s = 0;
    for (let i = 0; i < questions.length; i++) {
      if (answers[i] === questions[i].answer) s++;
    }
    return s;
  }, [examState, questions, answers]);

  const passed = finalScore >= PASS_SCORE;

  const weaknessByLevel = useMemo(() => {
    if (examState !== "result")
      return {
        beginner: { wrong: 0, total: 0 },
        intermediate: { wrong: 0, total: 0 },
        advanced: { wrong: 0, total: 0 },
      };
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
    <div className="min-h-screen bg-white">
      <Header />

      <div className="pt-24 px-6 pb-20">
        <div className="mx-auto max-w-3xl">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted mb-8">
            <Link
              href="/learn"
              className="hover:text-foreground hover:underline transition"
            >
              学習コース
            </Link>
            <span className="text-gray-300">/</span>
            <span className="text-foreground">認定試験</span>
          </nav>

          {/* ── Purchase Gate ── */}
          {statusLoaded && !purchased && (
            <div>
              <div className="border border-gray-200 rounded-xl p-8 text-center mb-10">
                <svg className="inline-block h-10 w-10 text-muted mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                <h2 className="text-lg font-bold text-foreground mb-2">
                  認定試験はプログラム購入後にご利用いただけます
                </h2>
                <p className="text-sm text-muted mb-6 max-w-md mx-auto">
                  教材プログラム（全22レッスン＋認定試験）を購入すると、認定試験を受験できます。
                </p>
                <Link
                  href="/program"
                  className="inline-flex items-center gap-2 rounded-lg bg-accent px-8 py-3 text-sm font-bold text-white transition hover:bg-accent-hover"
                >
                  教材プログラムを購入する
                </Link>
              </div>

              {/* Free lessons intro */}
              <div className="border-t border-gray-200 pt-8">
                <h3 className="text-sm font-bold text-foreground mb-4">
                  無料で学べるレッスン
                </h3>
                <div className="space-y-2">
                  {FREE_LESSON_SLUGS.map((s) => {
                    const fl = getLessonBySlug(s);
                    if (!fl) return null;
                    return (
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
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ── Intro State ── */}
          {purchased && examState === "intro" && (
            <div>
              <p className="text-xs font-bold tracking-widest uppercase text-accent mb-2">
                認定試験
              </p>
              <h1 className="text-2xl font-bold text-foreground sm:text-3xl mb-3">
                成約メソッド認定試験
              </h1>
              <p className="text-base text-muted mb-8 max-w-lg">
                全{totalLessons}
                レッスンの内容から出題される認定試験です。
                {PASS_THRESHOLD * 100}
                %以上の正答で認定証を取得できます。
              </p>

              {/* Exam specs */}
              <div className="border-t border-b border-gray-200 py-4 mb-8">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-foreground">
                      {TOTAL_QUESTIONS}
                    </p>
                    <p className="text-xs text-muted mt-0.5">出題数</p>
                  </div>
                  <div className="border-l border-r border-gray-200">
                    <p className="text-2xl font-bold text-foreground">
                      制限なし
                    </p>
                    <p className="text-xs text-muted mt-0.5">制限時間</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">
                      {PASS_SCORE}/{TOTAL_QUESTIONS}
                    </p>
                    <p className="text-xs text-muted mt-0.5">
                      合格ライン（{PASS_THRESHOLD * 100}%）
                    </p>
                  </div>
                </div>
              </div>

              {/* Requirements */}
              <div className="mb-8">
                <h2 className="text-sm font-bold text-foreground mb-4">
                  受験要件
                </h2>
                <div className="flex items-center gap-4 mb-3">
                  <div className="flex-1 h-1.5 bg-gray-100 overflow-hidden">
                    <div
                      className="h-full bg-accent transition-all duration-500"
                      style={{
                        width: `${(completedCount / totalLessons) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium text-foreground whitespace-nowrap">
                    {completedCount}/{totalLessons}
                  </span>
                </div>

                {allCompleted ? (
                  <p className="text-sm text-green-700 border-l-4 border-green-600 pl-4 py-2">
                    全レッスンのクイズを完了しました。認定試験を受験できます。
                  </p>
                ) : (
                  <div>
                    <p className="text-sm text-muted mb-3">
                      認定試験を受験するには、全レッスンのクイズを完了する必要があります。あと{" "}
                      <strong className="text-foreground">
                        {totalLessons - completedCount}レッスン
                      </strong>{" "}
                      残っています。
                    </p>
                    <div className="border-t border-gray-100">
                      {incompleteLessons.map((l) => (
                        <Link
                          key={l.slug}
                          href={`/learn/${l.slug}`}
                          className="flex items-center gap-3 py-2.5 border-b border-gray-100 text-sm text-muted hover:text-foreground hover:underline transition"
                        >
                          <span className="text-xs font-bold text-gray-400 w-5 text-right">
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
                <div className="mb-8">
                  <h3 className="text-sm font-bold text-foreground mb-3">
                    過去の受験履歴
                  </h3>
                  <div className="border-t border-gray-200">
                    {[...progress.examResults]
                      .reverse()
                      .slice(0, 5)
                      .map((r, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between text-sm py-3 border-b border-gray-100"
                        >
                          <span className="text-muted">
                            {new Date(r.date).toLocaleDateString("ja-JP")}
                          </span>
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-foreground">
                              {r.score}/{r.total}
                            </span>
                            <span
                              className={`text-xs font-bold ${
                                r.passed ? "text-green-700" : "text-red-600"
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
              <button
                onClick={startExam}
                disabled={!allCompleted}
                className={`px-8 py-3 text-sm font-bold text-white transition ${
                  allCompleted
                    ? "bg-accent hover:bg-accent-hover"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                試験を開始する
              </button>
            </div>
          )}

          {/* ── In Progress State ── */}
          {purchased && examState === "inProgress" && questions.length > 0 && (
            <div>
              {/* Progress */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-bold text-foreground">
                    成約メソッド認定試験
                  </p>
                  <p className="text-xs text-muted">
                    {currentQ + 1} / {questions.length}
                  </p>
                </div>
                <div className="h-1.5 bg-gray-100 overflow-hidden">
                  <div
                    className="h-full bg-accent transition-all duration-300"
                    style={{
                      width: `${((currentQ + 1) / questions.length) * 100}%`,
                    }}
                  />
                </div>
              </div>

              {/* Question */}
              <div className="mb-8">
                <p className="text-xs text-muted mb-2">
                  出典: {questions[currentQ].lessonTitle}
                </p>
                <h3 className="text-lg font-bold text-foreground mb-6 leading-relaxed">
                  {questions[currentQ].question}
                </h3>

                <div className="space-y-2">
                  {questions[currentQ].options.map((option, i) => (
                    <button
                      key={i}
                      onClick={() => setSelected(i)}
                      className={`w-full text-left border-2 p-4 transition hover:border-gray-400 cursor-pointer ${
                        i === selected
                          ? "border-foreground"
                          : "border-gray-200"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold ${
                            i === selected
                              ? "border-foreground bg-foreground text-white"
                              : "border-gray-300 text-gray-400"
                          }`}
                        >
                          {String.fromCharCode(65 + i)}
                        </div>
                        <span className="text-sm text-foreground">
                          {option}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit */}
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted">
                  {currentQ < questions.length - 1
                    ? "回答は後から変更できません"
                    : "最後の問題です"}
                </p>
                <button
                  onClick={submitAnswer}
                  disabled={selected === null}
                  className={`px-8 py-3 text-sm font-bold text-white transition ${
                    selected === null
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-accent hover:bg-accent-hover"
                  }`}
                >
                  {currentQ < questions.length - 1
                    ? "次の問題へ"
                    : "試験を終了する"}
                </button>
              </div>
            </div>
          )}

          {/* ── Result State ── */}
          {purchased && examState === "result" && (
            <div>
              {/* Score */}
              <div className="border-b border-gray-200 pb-8 mb-8">
                <p className="text-xs font-bold tracking-widest uppercase text-accent mb-2">
                  試験結果
                </p>
                <p
                  className={`text-5xl font-bold mb-2 ${
                    passed ? "text-green-700" : "text-red-600"
                  }`}
                >
                  {finalScore}/{questions.length}
                </p>
                <p className="text-lg font-bold text-foreground mb-1">
                  {passed ? "合格" : "不合格"}
                </p>
                <p className="text-sm text-muted">
                  正答率:{" "}
                  {Math.round((finalScore / questions.length) * 100)}%
                  （合格ライン: {PASS_THRESHOLD * 100}%）
                </p>
              </div>

              {/* Certificate (pass only) */}
              {passed && (
                <div className="border-2 border-accent p-8 sm:p-10 text-center mb-8">
                  <p className="text-xs font-bold tracking-[0.2em] uppercase text-accent mb-4">
                    Certificate of Achievement
                  </p>
                  <h3 className="text-2xl font-bold text-foreground mb-1">
                    成約メソッド認定
                  </h3>
                  <p className="text-sm text-muted mb-6">
                    営業メソッド学習コース 全課程修了
                  </p>
                  <div className="flex items-center justify-center gap-8 text-sm">
                    <div>
                      <p className="text-xs text-muted mb-0.5">取得日</p>
                      <p className="font-bold text-foreground">
                        {new Date().toLocaleDateString("ja-JP")}
                      </p>
                    </div>
                    <div className="w-px h-8 bg-gray-200" />
                    <div>
                      <p className="text-xs text-muted mb-0.5">スコア</p>
                      <p className="font-bold text-foreground">
                        {finalScore}/{questions.length}（
                        {Math.round(
                          (finalScore / questions.length) * 100,
                        )}
                        %）
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Weakness analysis (fail only) */}
              {!passed && (
                <div className="mb-8">
                  <h3 className="text-sm font-bold text-foreground mb-4">
                    分野別の正答率
                  </h3>
                  <div className="space-y-5">
                    {(
                      [
                        {
                          key: "beginner",
                          label: "初級（アプローチ・ヒアリング・プレゼン）",
                          color: "#0F6E56",
                        },
                        {
                          key: "intermediate",
                          label: "中級（クロージング）",
                          color: "#2563EB",
                        },
                        {
                          key: "advanced",
                          label: "上級（反論処理・切り返し）",
                          color: "#7C3AED",
                        },
                      ] as const
                    ).map(({ key, label, color }) => {
                      const data = weaknessByLevel[key];
                      if (data.total === 0) return null;
                      const correctRate = Math.round(
                        ((data.total - data.wrong) / data.total) * 100,
                      );
                      return (
                        <div key={key}>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-sm text-foreground">
                              {label}
                            </span>
                            <span className="text-xs text-muted">
                              {data.total - data.wrong}/{data.total} 正解（
                              {correctRate}%）
                            </span>
                          </div>
                          <div className="h-1.5 bg-gray-100 overflow-hidden">
                            <div
                              className="h-full transition-all"
                              style={{
                                width: `${correctRate}%`,
                                backgroundColor: color,
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <p className="text-sm text-muted mt-4">
                    正答率が低い分野のレッスンを重点的に復習すると効果的です。
                  </p>
                </div>
              )}

              {/* Pro CTA after pass */}
              {passed && (
                <div className="border border-accent/30 bg-accent/5 rounded-xl p-6 mb-8">
                  <p className="text-sm font-bold text-foreground mb-2">
                    学習完了 -- 次はAIロープレで実践できます
                  </p>
                  <p className="text-xs text-muted mb-4 leading-relaxed">
                    メソッドを学んだ今が、一番伸びるタイミングです。<br />
                    Proプランなら無制限でAIロープレ＆詳細スコアが使えます。
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Link
                      href="/roleplay"
                      className="inline-block bg-accent text-white text-sm font-bold px-6 py-2.5 rounded-lg hover:bg-accent-hover transition"
                    >
                      AIロープレで実践する →
                    </Link>
                    <Link
                      href="/pricing"
                      className="inline-block border border-accent/40 text-accent text-sm font-bold px-6 py-2.5 rounded-lg hover:bg-accent/10 transition"
                    >
                      Pro 7日間無料トライアル
                    </Link>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => {
                    setExamState("intro");
                    setQuestions([]);
                    setAnswers([]);
                    setSelected(null);
                    setCurrentQ(0);
                  }}
                  className={`px-8 py-3 text-sm font-bold transition ${
                    passed
                      ? "border-2 border-gray-300 text-foreground hover:border-foreground"
                      : "bg-accent text-white hover:bg-accent-hover"
                  }`}
                >
                  {passed ? "もう一度受験する" : "再挑戦する"}
                </button>
                <Link
                  href="/learn"
                  className="text-sm font-semibold text-muted hover:text-foreground hover:underline transition"
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
