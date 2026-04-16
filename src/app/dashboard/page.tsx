"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { SalesTriviaCard } from "@/components/sales-trivia-card";
import { RadarChart } from "@/components/radar-chart";
import { getGradeInfo } from "@/lib/grade";
import { getAllLessons } from "@/lib/lessons";

interface DashboardData {
  totalSessions: number;
  totalScored: number;
  bestScore: number;
  avgScore: number;
  latestScore: number;
  scoreTrend: number;
  firstScore: number | null;
  weakestCategory: { name: string; score: number } | null;
  latestCategories: { name: string; score: number }[];
  history: { score: number; date: string; difficulty: string }[];
  plan: "free" | "starter" | "pro" | "master";
  streak: number;
  // Soul System
  soulLevel: number;
  totalSouls: number;
  soulsToNext: number;
  soulProgress: number;
  bonfireCount: number;
  parryRate: number;
}

interface ExamResultEntry {
  date: string;
  score: number;
  total: number;
  passed: boolean;
  durationMs?: number;
}

interface LearnProgress {
  completedLessons: string[];
  quizScores: Record<string, number>;
  examResults?: ExamResultEntry[];
  certified?: boolean;
  certifiedDate?: string;
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

  // Find best score and its index for annotation
  const bestIdx = history.reduce((best, h, i) => h.score > history[best].score ? i : best, 0);
  const firstScore = history[0].score;
  const latestScore = history[history.length - 1].score;
  const totalGrowth = latestScore - firstScore;

  return (
    <div className="w-full overflow-x-auto">
      {/* Growth summary row */}
      {history.length > 1 && (
        <div className="flex items-center gap-3 mb-3">
          <div className="flex-1 rounded-lg bg-background/50 px-3 py-1.5 text-center">
            <div className="text-[10px] text-muted">初回</div>
            <div className="text-sm font-bold">{firstScore}点</div>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          <div className="flex-1 rounded-lg bg-background/50 px-3 py-1.5 text-center">
            <div className="text-[10px] text-muted">最新</div>
            <div className="text-sm font-bold">{latestScore}点</div>
          </div>
          <div className={`flex-shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${totalGrowth > 0 ? "bg-green-500/10 text-green-500" : totalGrowth < 0 ? "bg-red-500/10 text-red-400" : "bg-card-border/30 text-muted"}`}>
            {totalGrowth > 0 ? "+" : ""}{totalGrowth}pt
          </div>
        </div>
      )}

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
          {/* Area fill under the line */}
          {history.length > 1 && (
            <polygon
              fill="url(#scoreGradient)"
              opacity="0.15"
              points={[
                `0,${height}`,
                ...history.map((h, i) => {
                  const x = (i / (history.length - 1)) * width;
                  const y = height - (h.score / maxScore) * height;
                  return `${x},${y}`;
                }),
                `${width},${height}`,
              ].join(" ")}
            />
          )}
          <defs>
            <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--accent)" />
              <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
            </linearGradient>
          </defs>
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
            const isBest = i === bestIdx && history.length > 2;
            return (
              <g key={i}>
                <circle cx={x} cy={y} r={isBest ? "3" : "2"} fill={isBest ? "#22c55e" : "var(--accent)"} />
                {isBest && (
                  <text x={x} y={y - 6} textAnchor="middle" fontSize="4" fill="#22c55e" fontWeight="bold">
                    BEST
                  </text>
                )}
              </g>
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
          <div className="flex flex-wrap justify-center gap-1.5">
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

interface ReferralData {
  code: string;
  shareUrl: string;
  bonusCredits: number;
  stats: {
    totalReferrals: number;
    convertedToPro: number;
    totalRewardsEarned: number;
    pendingRewards: number;
  };
}

function ReferralCard() {
  const [referral, setReferral] = useState<ReferralData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch("/api/referral/code")
      .then((res) => {
        if (!res.ok) throw new Error("Failed");
        return res.json();
      })
      .then((data) => setReferral(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="mb-6 rounded-xl border border-card-border bg-card p-5">
        <div className="h-6 w-40 animate-pulse rounded bg-card-border" />
      </div>
    );
  }

  if (!referral) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referral.shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const input = document.createElement("input");
      input.value = referral.shareUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareText = encodeURIComponent(
    "成約コーチAI -- AIで営業力をスコア化して弱点がわかる。無料で試せます"
  );
  const shareUrlEncoded = encodeURIComponent(referral.shareUrl);
  const xShareUrl = `https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrlEncoded}`;
  const lineShareUrl = `https://social-plugins.line.me/lineit/share?url=${shareUrlEncoded}`;

  return (
    <div className="mb-6 rounded-xl border border-card-border bg-card p-5">
      <h2 className="mb-1 text-sm font-bold">友達を紹介する</h2>
      <p className="mb-4 text-xs text-muted leading-relaxed">
        紹介した友達が登録すると、あなたに
        <span className="font-bold text-accent">+5回分のボーナスクレジット</span>
        が付与されます。
      </p>

      {/* 紹介コード */}
      <div className="mb-3 flex items-center gap-2">
        <div className="flex-1 rounded-lg border border-card-border bg-background px-4 py-2.5 text-sm font-mono font-bold tracking-wider">
          {referral.code}
        </div>
      </div>

      {/* Share URL + コピーボタン */}
      <div className="mb-4 flex items-stretch gap-2">
        <div className="flex-1 overflow-hidden rounded-lg border border-card-border bg-background px-3 py-2 text-xs text-muted truncate leading-relaxed">
          {referral.shareUrl}
        </div>
        <button
          onClick={handleCopy}
          className={`flex-shrink-0 rounded-lg px-4 py-2 text-xs font-bold transition ${
            copied
              ? "bg-green-500/10 text-green-400 border border-green-500/30"
              : "bg-accent/10 text-accent border border-accent/30 hover:bg-accent/20"
          }`}
        >
          {copied ? "コピー済み" : "コピー"}
        </button>
      </div>

      {/* SNS共有ボタン */}
      <div className="mb-4 flex gap-2">
        <a
          href={xShareUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-10 flex-1 items-center justify-center gap-2 rounded-lg border border-card-border bg-background text-xs font-medium text-muted transition hover:text-foreground hover:border-foreground/30"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          Xで共有
        </a>
        <a
          href={lineShareUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-10 flex-1 items-center justify-center gap-2 rounded-lg border border-card-border bg-background text-xs font-medium text-muted transition hover:text-foreground hover:border-foreground/30"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
          </svg>
          LINEで共有
        </a>
      </div>

      {/* 紹介実績 */}
      <div className="mb-4 grid grid-cols-3 gap-2">
        <div className="rounded-lg border border-card-border bg-background py-2.5 text-center">
          <div className="text-[10px] text-muted mb-0.5">紹介人数</div>
          <div className="text-lg font-bold">{referral.stats.totalReferrals}<span className="text-xs text-muted ml-0.5">人</span></div>
        </div>
        <div className="rounded-lg border border-card-border bg-background py-2.5 text-center">
          <div className="text-[10px] text-muted mb-0.5">有料転換</div>
          <div className="text-lg font-bold">{referral.stats.convertedToPro}<span className="text-xs text-muted ml-0.5">人</span></div>
        </div>
        <div className="rounded-lg border border-card-border bg-background py-2.5 text-center">
          <div className="text-[10px] text-muted mb-0.5">獲得ボーナス</div>
          <div className="text-lg font-bold text-accent">+{referral.bonusCredits}<span className="text-xs text-muted ml-0.5">回</span></div>
        </div>
      </div>

      {/* Tiered rewards */}
      <div className="rounded-lg border border-card-border bg-background p-3">
        <div className="mb-2 text-[10px] font-bold uppercase tracking-wider text-muted">紹介ティア報酬</div>
        <div className="space-y-1.5">
          {([
            { min: 1, label: "Bronze", reward: "+5回/人", active: referral.stats.totalReferrals >= 1 },
            { min: 5, label: "Silver", reward: "+7回/人", active: referral.stats.totalReferrals >= 5 },
            { min: 10, label: "Gold", reward: "+10回/人", active: referral.stats.totalReferrals >= 10 },
          ] as const).map((tier) => (
            <div key={tier.label} className={`flex items-center justify-between text-xs ${tier.active ? "text-accent" : "text-muted"}`}>
              <span>{tier.label} ({tier.min}人〜)</span>
              <span className="font-bold">{tier.reward}</span>
            </div>
          ))}
        </div>
        {referral.stats.totalReferrals < 10 && (
          <div className="mt-2">
            <div className="h-1.5 rounded-full bg-card-border overflow-hidden">
              <div
                className="h-full rounded-full bg-accent transition-all"
                style={{ width: `${Math.min(100, (referral.stats.totalReferrals / 10) * 100)}%` }}
              />
            </div>
            <div className="mt-1 text-[10px] text-muted text-right">
              Goldまであと{Math.max(0, 10 - referral.stats.totalReferrals)}人
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface UsageInfo {
  used: number;
  limit: number;
  plan: string;
  canStart: boolean;
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [learnProgress, setLearnProgress] = useState<LearnProgress | null>(null);
  const [usage, setUsage] = useState<UsageInfo | null>(null);

  const totalLessons = useMemo(() => getAllLessons().length, []);

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
    // Fetch usage info
    fetch("/api/usage")
      .then((r) => r.json())
      .then((d) => { if (!d.error) setUsage(d); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem("seiyaku-learn-progress");
      setLearnProgress(
        raw ? JSON.parse(raw) : { completedLessons: [], quizScores: {} }
      );
    } catch {
      setLearnProgress({ completedLessons: [], quizScores: {} });
    }
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
                  <p className="text-xs text-muted">レッスンで基本を把握</p>
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

      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-10">

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
          {/* Usage remaining badge */}
          {usage && Number.isFinite(usage.limit) && (() => {
            const remaining = Math.max(0, usage.limit - usage.used);
            const lowCredit = usage.plan === "starter" && remaining <= 5 && remaining > 0;
            const canUpgrade = usage.plan === "starter" && remaining <= 10;
            return (
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center gap-2 rounded-full border border-card-border bg-card px-4 py-1.5">
                  <span className="text-xs text-muted">
                    {usage.plan === "free" ? "残り" : "今月残り"}
                  </span>
                  <span className={`text-sm font-bold ${lowCredit ? "text-amber-400" : usage.canStart ? "text-accent" : "text-red-500"}`}>
                    {remaining}/{usage.limit}回
                  </span>
                  {usage.plan !== "free" && (
                    <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-bold text-accent">
                      {usage.plan === "master" ? "Master" : usage.plan === "pro" ? "Pro" : "Starter"}
                    </span>
                  )}
                </div>
                {canUpgrade && (
                  <Link
                    href="/pricing"
                    className="inline-flex items-center gap-1 rounded-full border border-accent/30 bg-accent/5 px-3 py-1.5 text-[11px] font-bold text-accent transition hover:bg-accent/10"
                  >
                    Proに増量（月60回）→
                  </Link>
                )}
              </div>
            );
          })()}

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

        {/* Streak — compact inline badge */}
        {data.streak > 0 && (
          <div className="mb-6 rounded-xl border border-accent/20 bg-accent/5 px-5 py-3 flex items-center gap-3">
            <span className="inline-block h-5 w-5 rounded-full bg-accent" />
            <div className="text-sm font-bold text-accent">{data.streak}日連続トレーニング中</div>
          </div>
        )}

        {/* 今日のおすすめアクション — ユーザーの状態に応じてパーソナライズ */}
        {(() => {
          const action = (() => {
            if (!hasScores) {
              return { label: "最初のロープレに挑戦", desc: "3分のAIロープレで現在地がわかります", href: "/roleplay", cta: "ロープレを始める" };
            }
            if (data.weakestCategory && data.weakestCategory.score < 50) {
              return { label: `${data.weakestCategory.name}を重点練習`, desc: `${data.weakestCategory.name}が${data.weakestCategory.score}点 — 集中練習でスコアUPが期待できます`, href: "/roleplay", cta: "弱点を練習する" };
            }
            if (data.totalScored < 3) {
              return { label: "あと数回ロープレしよう", desc: "3回以上スコアを取ると弱点パターンが見えてきます", href: "/roleplay", cta: "ロープレを始める" };
            }
            if (learnProgress && learnProgress.completedLessons.length < totalLessons) {
              return { label: "レッスンで型を学ぶ", desc: `${totalLessons - learnProgress.completedLessons.length}レッスン残り — 型を知るとスコアが伸びやすくなります`, href: "/learn", cta: "レッスンを続ける" };
            }
            if (data.streak === 0) {
              return { label: "今日もロープレしよう", desc: "毎日練習するとスコアの伸びが加速します", href: "/roleplay", cta: "ロープレを始める" };
            }
            return null;
          })();

          if (!action) return null;
          return (
            <div className="mb-6 rounded-xl border border-card-border bg-card p-4">
              <div className="text-[10px] font-bold uppercase tracking-wider text-muted mb-2">今日のおすすめ</div>
              <div className="flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold mb-0.5">{action.label}</div>
                  <div className="text-xs text-muted">{action.desc}</div>
                </div>
                <Link
                  href={action.href}
                  className="flex-shrink-0 inline-flex h-9 items-center rounded-lg bg-accent px-4 text-xs font-bold text-white transition hover:bg-accent-hover"
                >
                  {action.cta}
                </Link>
              </div>
            </div>
          );
        })()}

        {/* 今日の営業豆知識 — 新規ユーザーのみ */}
        {!hasScores && (
          <div className="mb-6">
            <SalesTriviaCard />
          </div>
        )}

        {/* Soul Level Card -- Dark Souls inspired */}
        {hasScores && (() => {
          const rank = getRankProgress(data.avgScore);
          const gradeInfo = getGradeInfo(data.avgScore);
          return (
            <div className="mb-6 rounded-xl border border-card-border bg-card p-5">
              <div className="flex items-center gap-4 mb-4">
                {/* Soul Level badge */}
                <div className="flex flex-col items-center">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-accent mb-1">Soul Lv.</div>
                  <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-accent bg-accent/10">
                    <span className="text-2xl font-black text-accent">{data.soulLevel ?? 0}</span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-2xl font-black ${gradeInfo.color}`}>{rank.grade}</span>
                    <span className="text-sm font-bold text-foreground">ランク</span>
                    <span className="text-xs text-muted">平均 {data.avgScore}点</span>
                  </div>
                  {/* Soul progress bar */}
                  <div className="h-2 overflow-hidden rounded-full bg-card-border mb-1">
                    <div
                      className="h-full rounded-full bg-accent transition-all duration-700"
                      style={{ width: `${data.soulProgress ?? 0}%` }}
                    />
                  </div>
                  <div className="text-xs text-muted">
                    次のソウルレベルまで {data.soulsToNext ?? 0} ソウル
                  </div>
                </div>
              </div>

              {/* Soul Stats row */}
              <div className="grid grid-cols-3 gap-2">
                <div className="rounded-lg border border-card-border bg-background/40 py-2 text-center">
                  <div className="text-[10px] text-muted mb-0.5">累計ソウル</div>
                  <div className="text-sm font-bold text-accent">{(data.totalSouls ?? 0).toLocaleString()}</div>
                </div>
                <div className="rounded-lg border border-accent/20 bg-accent/5 py-2 text-center">
                  <div className="text-[10px] text-accent mb-0.5">灯した篝火</div>
                  <div className="text-sm font-bold text-accent">{data.bonfireCount ?? 0}</div>
                </div>
                <div className="rounded-lg border border-card-border bg-background/40 py-2 text-center">
                  <div className="text-[10px] text-muted mb-0.5">パリィ成功率</div>
                  <div className="text-sm font-bold">{data.parryRate ?? 0}%</div>
                </div>
              </div>
            </div>
          );
        })()}

        {/* Stats -- 3 cards max, only when scores exist */}
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
              <div className="text-[10px] text-muted mb-1 sm:text-xs">セッション</div>
              <div className="text-xl font-bold sm:text-2xl">{data.totalSessions}</div>
              <div className="text-[10px] text-muted sm:text-[11px]">回</div>
            </div>
          </div>
        )}

        {/* Lesson Progress Card — 学習進捗 */}
        {learnProgress && (() => {
          const completedCount = learnProgress.completedLessons.length;
          const completionPct = Math.round((completedCount / totalLessons) * 100);
          const quizValues = Object.values(learnProgress.quizScores);
          const quizAvg =
            quizValues.length > 0
              ? Math.round(
                  (quizValues.reduce((a, b) => a + b, 0) / quizValues.length) * 10
                ) / 10
              : null;
          const examEligible = completedCount >= totalLessons;
          const remaining = Math.max(totalLessons - completedCount, 0);
          return (
            <div className="mb-6 rounded-xl border border-card-border bg-card p-5">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-medium text-muted">レッスン学習進捗</h2>
                <span className="text-xs font-bold text-accent">
                  {completedCount} / {totalLessons}
                </span>
              </div>
              <div className="mb-3 h-2 overflow-hidden rounded-full bg-card-border">
                <div
                  className="h-full rounded-full bg-accent transition-all duration-700"
                  style={{ width: `${completionPct}%` }}
                />
              </div>
              <div className="mb-4 grid grid-cols-2 gap-3">
                <div>
                  <div className="text-[11px] text-muted mb-0.5">完了率</div>
                  <div className="text-lg font-bold">{completionPct}%</div>
                </div>
                <div>
                  <div className="text-[11px] text-muted mb-0.5">クイズ平均</div>
                  <div className={`text-lg font-bold ${quizAvg !== null ? getScoreColor(quizAvg) : ""}`}>
                    {quizAvg !== null ? `${quizAvg}点` : "—"}
                  </div>
                </div>
              </div>
              <div
                className={`mb-4 flex items-center justify-between rounded-lg border px-3 py-2 ${
                  examEligible
                    ? "border-accent/40 bg-accent/5"
                    : "border-card-border bg-background/40"
                }`}
              >
                <span className="text-xs font-medium">
                  {examEligible ? "認定試験 受験可能" : `認定試験まで残り ${remaining} レッスン`}
                </span>
                <span
                  className={`text-[11px] font-bold ${
                    examEligible ? "text-accent" : "text-muted"
                  }`}
                >
                  {examEligible ? "OK" : "未達成"}
                </span>
              </div>
              <Link
                href="/learn"
                className="inline-flex h-9 items-center justify-center rounded-lg border border-card-border px-4 text-xs font-medium text-muted transition hover:text-foreground"
              >
                {completedCount === 0 ? "レッスンを始める" : "レッスンを続ける"}
              </Link>
            </div>
          );
        })()}

        {/* Exam Card — 認定試験 */}
        {learnProgress && (() => {
          const examResults = learnProgress.examResults ?? [];
          const attempts = examResults.length;
          const passedCount = examResults.filter((r) => r.passed).length;
          const latest = examResults[0] ?? null;
          const bestResult =
            examResults.length > 0
              ? examResults.reduce((best, r) =>
                  r.score / r.total > best.score / best.total ? r : best
                )
              : null;
          const isCertified = learnProgress.certified === true;

          return (
            <div
              className={`mb-6 rounded-xl border p-5 ${
                isCertified
                  ? "border-accent/40 bg-accent/5"
                  : "border-card-border bg-card"
              }`}
            >
              <div className="mb-3 flex items-center justify-between">
                <h2 className={`text-sm font-medium ${isCertified ? "text-accent" : "text-muted"}`}>
                  認定試験
                </h2>
                {isCertified && (
                  <span className="rounded-full border border-accent/40 bg-accent/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent">
                    Certified
                  </span>
                )}
              </div>

              {attempts === 0 ? (
                <>
                  <div className="mb-1 text-base font-bold">まだ受験していません</div>
                  <p className="mb-4 text-xs text-muted leading-relaxed">
                    全{totalLessons}レッスンを完了すると、成約メソッド認定試験を受験できます。
                  </p>
                  <Link
                    href="/learn/exam"
                    className="inline-flex h-9 items-center justify-center rounded-lg bg-accent px-4 text-xs font-bold text-white transition hover:bg-accent-hover"
                  >
                    試験ページへ
                  </Link>
                </>
              ) : (
                <>
                  {isCertified ? (
                    <div className="mb-4">
                      <div className="mb-1 text-base font-bold text-foreground">
                        成約メソッド認定 取得済み
                      </div>
                      {learnProgress.certifiedDate && (
                        <div className="text-[11px] text-muted">
                          合格日:{" "}
                          {new Date(learnProgress.certifiedDate).toLocaleDateString("ja-JP")}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="mb-4">
                      <div className="mb-1 text-base font-bold text-foreground">
                        もう一息で合格
                      </div>
                      <div className="text-[11px] text-muted">
                        合格ライン 80% — 再挑戦で認定を目指しましょう
                      </div>
                    </div>
                  )}

                  {latest && (
                    <div className="mb-4 rounded-lg border border-card-border bg-background/40 px-3 py-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] text-muted">最新結果</span>
                        <span
                          className={`text-xs font-bold ${
                            latest.passed ? "text-green-400" : "text-red-400"
                          }`}
                        >
                          {latest.score}/{latest.total}（
                          {Math.round((latest.score / latest.total) * 100)}%）
                          {latest.passed ? " 合格" : " 不合格"}
                        </span>
                      </div>
                      <div className="mt-0.5 text-[10px] text-muted">
                        {new Date(latest.date).toLocaleDateString("ja-JP")}
                      </div>
                    </div>
                  )}

                  <div className="mb-4 grid grid-cols-3 gap-2 text-center">
                    <div className="rounded-lg border border-card-border bg-background/40 py-2">
                      <div className="text-[10px] text-muted mb-0.5">受験回数</div>
                      <div className="text-sm font-bold">{attempts}回</div>
                    </div>
                    <div className="rounded-lg border border-card-border bg-background/40 py-2">
                      <div className="text-[10px] text-muted mb-0.5">最高</div>
                      <div className="text-sm font-bold">
                        {bestResult ? `${bestResult.score}/${bestResult.total}` : "—"}
                      </div>
                    </div>
                    <div className="rounded-lg border border-card-border bg-background/40 py-2">
                      <div className="text-[10px] text-muted mb-0.5">合格</div>
                      <div className="text-sm font-bold">{passedCount}回</div>
                    </div>
                  </div>

                  <Link
                    href="/learn/exam"
                    className="inline-flex h-9 items-center justify-center rounded-lg bg-accent px-4 text-xs font-bold text-white transition hover:bg-accent-hover"
                  >
                    {isCertified ? "試験ページへ" : "もう一度挑戦する"}
                  </Link>
                </>
              )}
            </div>
          );
        })()}

        {/* Score History Chart — compact */}
        {hasScores && data.history.length > 1 && (
          <div className="mb-6 rounded-xl border border-card-border bg-card p-5">
            <h2 className="mb-3 text-sm font-medium text-muted">スコア推移</h2>
            <ScoreChart history={data.history} />
          </div>
        )}

        {/* Category Scores — radar chart + weakest category CTA */}
        {hasScores && data.weakestCategory && (
          <div className="mb-6 rounded-xl border border-accent/20 bg-accent/5 p-5">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-medium text-accent">カテゴリ別スコア</h2>
              <span className={`text-sm font-bold ${getScoreColor(data.weakestCategory.score)}`}>
                最弱 {data.weakestCategory.score}点
              </span>
            </div>

            {data.latestCategories.length > 0 && (
              <div className="mb-4 flex justify-center">
                <div className="w-full max-w-[260px]">
                  <RadarChart categories={data.latestCategories} size={240} />
                </div>
              </div>
            )}

            <div className="mb-2 text-[11px] uppercase tracking-wider text-accent">弱点</div>
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

        {/* Paid CTA — Freeユーザー向け、スコア実績に基づくパーソナライズ */}
        {data.plan === "free" && hasScores && (
          <div className="mb-6 rounded-2xl border border-accent/20 bg-gradient-to-br from-accent/5 to-transparent p-5">
            <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-2.5 py-0.5 text-[10px] font-bold text-accent">
              あなたの伸びしろ
            </div>
            <h3 className="mb-1.5 text-base font-bold text-foreground">
              {data.avgScore >= 60
                ? `スコア${data.avgScore}点 — もう一段伸ばすなら`
                : data.weakestCategory
                  ? `${data.weakestCategory.name}を集中練習して底上げ`
                  : "練習量を増やして型を固める"}
            </h3>
            <p className="mb-3 text-xs leading-relaxed text-muted">
              有料プランなら<span className="font-semibold text-foreground">月30〜200回</span>のロープレ、<span className="font-semibold text-foreground">全5カテゴリのAIフィードバック</span>、全22レッスンが使えます。商談前の最終リハにも。
            </p>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <Link
                href="/pricing"
                className="inline-flex h-10 items-center justify-center rounded-lg bg-accent px-4 text-xs font-bold text-white transition hover:bg-accent-hover"
              >
                プランを見る →
              </Link>
              <span className="text-[11px] text-muted">Starter ¥990〜 / 1日あたり約33円</span>
            </div>
          </div>
        )}

        {/* NPS Survey */}
        <div className="mb-6">
          <NPSInline />
        </div>

        {/* 紹介プログラム */}
        <ReferralCard />
      </div>

      <Footer />
    </div>
  );
}
