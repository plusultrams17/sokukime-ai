"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { SalesTriviaCard } from "@/components/sales-trivia-card";
import { getGradeInfo } from "@/lib/grade";

interface DashboardData {
  totalSessions: number;
  totalScored: number;
  bestScore: number;
  avgScore: number;
  latestScore: number;
  scoreTrend: number;
  firstScore: number | null;
  weakestCategory: { name: string; score: number } | null;
  history: { score: number; date: string; difficulty: string }[];
  plan: "free" | "pro";
  streak: number;
  trialDaysRemaining: number | null;
}

function getScoreColor(score: number) {
  return getGradeInfo(score).color;
}

/** Rank thresholds aligned with src/lib/grade.ts GRADES */
const RANK_THRESHOLDS = [
  { min: 81, grade: "S" as const, next: null },
  { min: 61, grade: "A" as const, next: "S" as const },
  { min: 41, grade: "B" as const, next: "A" as const },
  { min: 21, grade: "C" as const, next: "B" as const },
  { min: 0,  grade: "D" as const, next: "C" as const },
];

function getRankProgress(score: number) {
  for (let i = 0; i < RANK_THRESHOLDS.length; i++) {
    const t = RANK_THRESHOLDS[i];
    if (score >= t.min) {
      if (!t.next) {
        return { grade: t.grade, nextGrade: null, pointsToNext: 0, progress: 100 };
      }
      const nextMin = RANK_THRESHOLDS[i - 1].min;
      const rangeSize = nextMin - t.min;
      const pointsInRange = score - t.min;
      return {
        grade: t.grade,
        nextGrade: t.next,
        pointsToNext: nextMin - score,
        progress: Math.round((pointsInRange / rangeSize) * 100),
      };
    }
  }
  return { grade: "D" as const, nextGrade: "C" as const, pointsToNext: 21 - score, progress: 0 };
}

/** Map scoring categories to learning course levels */
const CATEGORY_LESSON_MAP: Record<string, { level: string; label: string }> = {
  "アプローチ": { level: "beginner", label: "初級：信頼構築" },
  "ヒアリング": { level: "beginner", label: "初級：問題の把握" },
  "プレゼン": { level: "beginner", label: "初級：価値伝達" },
  "クロージング": { level: "intermediate", label: "中級：決断促進" },
  "反論処理": { level: "advanced", label: "上級：切り返し" },
};

function ScoreChart({ history }: { history: { score: number; date: string }[] }) {
  if (history.length === 0) return null;

  const maxScore = 100;
  const height = 120;
  const width = history.length > 1 ? 100 : 50;

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[240px] sm:min-w-[280px]" style={{ height: `${height + 24}px` }}>
        <svg viewBox={`0 0 ${width} ${height + 20}`} className="w-full h-full" preserveAspectRatio="none">
          {[40, 80].map((v) => (
            <line
              key={v}
              x1="0" y1={height - (v / maxScore) * height}
              x2={width} y2={height - (v / maxScore) * height}
              stroke="var(--card-border)" strokeWidth="0.3" strokeDasharray="2,2"
            />
          ))}
          {history.length > 1 && (
            <polyline
              fill="none"
              stroke="var(--accent)"
              strokeWidth="1.5"
              strokeLinejoin="round"
              strokeLinecap="round"
              points={history.map((h, i) => {
                const x = (i / (history.length - 1)) * width;
                const y = height - (h.score / maxScore) * height;
                return `${x},${y}`;
              }).join(" ")}
            />
          )}
          {history.map((h, i) => {
            const x = history.length > 1 ? (i / (history.length - 1)) * width : width / 2;
            const y = height - (h.score / maxScore) * height;
            return (
              <circle
                key={i}
                cx={x} cy={y} r="2"
                fill="var(--accent)"
              />
            );
          })}
        </svg>
        <div className="flex justify-between text-[10px] text-muted mt-1 px-1">
          {history.length > 0 && (
            <>
              <span>{new Date(history[0].date).toLocaleDateString("ja-JP", { month: "short", day: "numeric" })}</span>
              {history.length > 1 && (
                <span>{new Date(history[history.length - 1].date).toLocaleDateString("ja-JP", { month: "short", day: "numeric" })}</span>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function NPSInline() {
  const [selectedScore, setSelectedScore] = useState<number | null>(null);
  const [feedback, setFeedback] = useState("");
  const [phase, setPhase] = useState<"ask" | "followup" | "done">("ask");
  const [submitting, setSubmitting] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("nps_answered")) setDismissed(true);
  }, []);

  if (dismissed || phase === "done") return null;

  const handleScore = (score: number) => {
    setSelectedScore(score);
    setPhase("followup");
  };

  const handleFollowup = async () => {
    setSubmitting(true);
    try {
      await fetch("/api/nps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          score: selectedScore,
          feedback: feedback.trim() || null,
        }),
      });
    } catch { /* ignore */ }
    localStorage.setItem("nps_answered", "1");
    setPhase("done");
  };

  const category = selectedScore !== null
    ? selectedScore <= 6 ? "detractor" : selectedScore <= 8 ? "passive" : "promoter"
    : null;

  const followUpText: Record<string, string> = {
    detractor: "改善すべき点を教えてください。",
    passive: "もっと良くするために何ができるでしょうか？",
    promoter: "特に気に入っている点を教えてください！",
  };

  return (
    <div className="rounded-xl border border-card-border bg-card p-5">
      {phase === "ask" && (
        <>
          <p className="mb-1 text-sm font-bold text-center">
            このサービスを友人・同僚に薦める可能性はどのくらいですか？
          </p>
          <p className="mb-4 text-xs text-muted text-center">
            0（全く薦めない）〜 10（強く薦める）
          </p>
          <div className="flex justify-center gap-1.5">
            {Array.from({ length: 11 }, (_, i) => (
              <button
                key={i}
                onClick={() => handleScore(i)}
                className={`h-9 w-9 rounded-lg text-sm font-bold transition ${
                  i <= 6
                    ? "border border-card-border hover:border-red-400 hover:bg-red-400/10 hover:text-red-400"
                    : i <= 8
                    ? "border border-card-border hover:border-yellow-500 hover:bg-yellow-500/10 hover:text-yellow-500"
                    : "border border-card-border hover:border-green-500 hover:bg-green-500/10 hover:text-green-500"
                }`}
              >
                {i}
              </button>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-[10px] text-muted px-0.5">
            <span>全く薦めない</span>
            <span>強く薦める</span>
          </div>
        </>
      )}

      {phase === "followup" && category && (
        <>
          <p className="mb-3 text-sm text-center text-muted">
            {followUpText[category]}（任意）
          </p>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="自由にご記入ください..."
            rows={3}
            className="w-full rounded-lg border border-card-border bg-background px-4 py-3 text-sm focus:border-accent focus:outline-none resize-none mb-3"
          />
          <button
            onClick={handleFollowup}
            disabled={submitting}
            className="w-full rounded-lg bg-accent py-2.5 text-sm font-bold text-white transition hover:bg-accent-hover disabled:opacity-50"
          >
            {feedback.trim() ? "送信する" : "スキップ"}
          </button>
        </>
      )}
    </div>
  );
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        const res = await fetch("/api/dashboard");
        if (res.status === 401) {
          window.location.href = "/login?redirect=/dashboard";
          return;
        }
        if (!res.ok) throw new Error("Failed to load");
        const json = await res.json();
        setData(json);
      } catch {
        setError("データの読み込みに失敗しました");
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-sm text-muted animate-pulse">読み込み中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-sm text-muted mb-4">{error}</p>
          <Link href="/roleplay" className="text-sm text-accent hover:underline">ロープレを始める</Link>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="w-full max-w-md text-center">
          <div className="mb-6 text-5xl" aria-hidden="true"><span className="inline-block h-10 w-10 rounded-full bg-accent" /></div>
          <h2 className="mb-3 text-xl font-bold text-foreground">まだデータがありません</h2>
          <p className="mb-6 text-sm text-muted leading-relaxed">
            最初のロープレを完了すると、ここにあなたの営業力データが表示されます。
            <br />3分で最初のスコアがわかります。
          </p>
          <div className="mb-6 rounded-xl border border-card-border bg-card p-5 text-left">
            <p className="mb-3 text-xs font-bold text-muted">おすすめの始め方：</p>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-accent/10 text-xs font-bold text-accent">1</span>
                <div>
                  <p className="text-sm font-medium text-foreground">営業の型を学ぶ（5分）</p>
                  <p className="text-xs text-muted">22レッスンで基本を把握</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-accent/10 text-xs font-bold text-accent">2</span>
                <div>
                  <p className="text-sm font-medium text-foreground">AIとロープレ（3分）</p>
                  <p className="text-xs text-muted">あなたの商材でリアルな営業練習</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-accent/10 text-xs font-bold text-accent">3</span>
                <div>
                  <p className="text-sm font-medium text-foreground">スコアで弱点を発見</p>
                  <p className="text-xs text-muted">5カテゴリの定量評価で改善点が明確に</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/learn"
              className="inline-flex h-12 items-center justify-center rounded-xl border-2 border-accent/30 px-6 text-sm font-bold text-accent transition hover:bg-accent/5"
            >
              まず型を学ぶ
            </Link>
            <Link
              href="/roleplay"
              className="inline-flex h-12 items-center justify-center rounded-xl bg-accent px-6 text-sm font-bold text-white transition hover:bg-accent-hover"
            >
              すぐにロープレを始める
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const hasScores = data.totalScored > 0;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="mx-auto max-w-4xl px-6 py-10">

        {/* Hero: Quick Actions */}
        <div className="mb-8">
          <h1 className="mb-1 text-2xl font-bold">
            {hasScores ? "今日も練習しよう" : "営業力をスコア化しよう"}
          </h1>
          <p className="mb-5 text-sm text-muted">
            {hasScores
              ? `最新スコア ${data.latestScore}点${data.scoreTrend > 0 ? `（+${data.scoreTrend}）` : ""} -- ${data.weakestCategory ? `${data.weakestCategory.name}を重点的に` : "この調子で続けましょう"}`
              : "3分のAIロープレであなたの営業力が5段階でわかります"}
          </p>
          {!hasScores ? (
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <Link
                href="/roleplay"
                className="inline-flex h-12 items-center justify-center rounded-xl bg-accent px-8 text-sm font-bold text-white transition hover:bg-accent-hover"
              >
                AIロープレを始める
              </Link>
              <Link
                href="/learn"
                className="text-sm text-muted hover:text-accent transition ml-1"
              >
                まずレッスンで学ぶ →
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/roleplay"
                className="inline-flex h-12 items-center justify-center rounded-xl bg-accent px-8 text-sm font-bold text-white transition hover:bg-accent-hover"
              >
                AIロープレを始める
              </Link>
              <Link
                href="/learn"
                className="inline-flex h-12 items-center justify-center rounded-xl border-2 border-accent/30 px-8 text-sm font-bold text-accent transition hover:bg-accent/5"
              >
                レッスンで学ぶ
              </Link>
            </div>
          )}
        </div>

        {/* Trial Banner — compact, essential for conversion */}
        {data.trialDaysRemaining !== null && data.trialDaysRemaining > 0 && (
          <div className="mb-6 rounded-xl border border-accent/30 bg-gradient-to-r from-accent/10 to-accent/5 px-5 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="inline-block h-5 w-5 rounded-full bg-accent" />
                <div>
                  <div className="text-sm font-bold text-accent">
                    Pro体験中 -- 残り{data.trialDaysRemaining}日
                  </div>
                  <div className="text-xs text-muted">
                    無制限ロープレ・AIコーチ・詳細スコアが無料で使えます
                  </div>
                </div>
              </div>
              <Link
                href="/pricing"
                className="shrink-0 rounded-lg bg-accent px-4 py-2 text-xs font-bold text-white transition hover:bg-accent-hover"
              >
                Proプランを見る
              </Link>
            </div>
          </div>
        )}

        {/* Streak — compact inline badge */}
        {data.streak > 0 && (
          <div className="mb-6 rounded-xl border border-accent/20 bg-accent/5 px-5 py-3 flex items-center gap-3">
            <span className="inline-block h-5 w-5 rounded-full bg-accent" />
            <div className="text-sm font-bold text-accent">{data.streak}日連続トレーニング中</div>
          </div>
        )}

        {/* 今日の営業豆知識 — 新規ユーザーのみ */}
        {!hasScores && (
          <div className="mb-6">
            <SalesTriviaCard />
          </div>
        )}

        {/* Rank Card — 既存ユーザーのみ */}
        {hasScores && (() => {
          const rank = getRankProgress(data.avgScore);
          const gradeInfo = getGradeInfo(data.avgScore);
          return (
            <div className="mb-6 rounded-xl border border-card-border bg-card p-5">
              <div className="flex items-center gap-4">
                <div className={`text-5xl font-black ${gradeInfo.color}`}>
                  {rank.grade}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold mb-1">
                    {rank.grade} ランク
                    <span className="ml-2 text-xs font-normal text-muted">
                      平均 {data.avgScore}点
                    </span>
                  </div>
                  {rank.nextGrade ? (
                    <>
                      <div className="h-2 overflow-hidden rounded-full bg-card-border mb-1">
                        <div
                          className={`h-full rounded-full ${gradeInfo.barClass} transition-all duration-700`}
                          style={{ width: `${rank.progress}%` }}
                        />
                      </div>
                      <div className="text-xs text-muted">
                        {rank.nextGrade}ランクまであと{rank.pointsToNext}点
                      </div>
                    </>
                  ) : (
                    <div className="text-sm font-medium text-green-400">
                      最高ランク達成
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })()}

        {/* Stats — 3 cards max, only when scores exist */}
        {hasScores && (
          <div className="mb-6 grid grid-cols-3 gap-2 sm:gap-3">
            <div className="rounded-xl border border-card-border bg-card p-3 text-center sm:p-4">
              <div className="text-[10px] text-muted mb-1 sm:text-xs">ベスト</div>
              <div className={`text-xl font-bold sm:text-2xl ${getScoreColor(data.bestScore)}`}>
                {data.bestScore}
              </div>
              <div className="text-[10px] text-muted sm:text-[11px]">ランク {getGradeInfo(data.bestScore).grade}</div>
            </div>
            <div className="rounded-xl border border-card-border bg-card p-3 text-center sm:p-4">
              <div className="text-[10px] text-muted mb-1 sm:text-xs">最新</div>
              <div className={`text-xl font-bold sm:text-2xl ${getScoreColor(data.latestScore)}`}>
                {data.latestScore}
              </div>
              {data.scoreTrend !== 0 && (
                <div className={`text-[11px] font-medium ${data.scoreTrend > 0 ? "text-green-500" : "text-red-400"}`}>
                  {data.scoreTrend > 0 ? "+" : ""}{data.scoreTrend}点
                </div>
              )}
            </div>
            <div className="rounded-xl border border-card-border bg-card p-3 text-center sm:p-4">
              <div className="text-[10px] text-muted mb-1 sm:text-xs">練習回数</div>
              <div className="text-xl font-bold sm:text-2xl">{data.totalSessions}</div>
              <div className="text-[10px] text-muted sm:text-[11px]">セッション</div>
            </div>
          </div>
        )}

        {/* Score History Chart — compact */}
        {hasScores && data.history.length > 1 && (
          <div className="mb-6 rounded-xl border border-card-border bg-card p-5">
            <h2 className="mb-3 text-sm font-medium text-muted">スコア推移</h2>
            <ScoreChart history={data.history} />
          </div>
        )}

        {/* Weakest Category — actionable recommendation */}
        {hasScores && data.weakestCategory && (
          <div className="mb-6 rounded-xl border border-accent/20 bg-accent/5 p-5">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-medium text-accent">改善ポイント</h2>
              <span className={`text-sm font-bold ${getScoreColor(data.weakestCategory.score)}`}>
                {data.weakestCategory.score}点
              </span>
            </div>
            <div className="mb-2 text-base font-bold">{data.weakestCategory.name}</div>
            <div className="mb-3 h-1.5 overflow-hidden rounded-full bg-card-border">
              <div
                className="h-full rounded-full bg-accent transition-all duration-700"
                style={{ width: `${data.weakestCategory.score}%` }}
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Link
                href="/roleplay"
                className="flex h-9 items-center justify-center rounded-lg bg-accent px-4 text-xs font-bold text-white transition hover:bg-accent-hover"
              >
                重点練習する
              </Link>
              {CATEGORY_LESSON_MAP[data.weakestCategory.name] && (
                <Link
                  href={`/learn#${CATEGORY_LESSON_MAP[data.weakestCategory.name].level}`}
                  className="flex h-9 items-center justify-center rounded-lg border border-card-border px-4 text-xs text-muted transition hover:text-foreground"
                >
                  {CATEGORY_LESSON_MAP[data.weakestCategory.name].label}を復習
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Pro CTA — 既存フリーユーザーのみ、控えめ表示 */}
        {data.plan === "free" && hasScores && (
          <div className="mb-6 text-center text-sm text-muted">
            Proなら無制限ロープレ + AIコーチ（7日間無料）
            <Link href="/pricing" className="ml-1 text-accent hover:underline font-medium">
              詳しく見る →
            </Link>
          </div>
        )}

        {/* NPS Survey — ページ最下部 */}
        <div className="mb-6">
          <NPSInline />
        </div>
      </div>

      <Footer />
    </div>
  );
}
