"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Footer } from "@/components/footer";
import { OnboardingChecklist } from "@/components/onboarding-checklist";

interface DashboardData {
  totalSessions: number;
  totalScored: number;
  bestScore: number;
  avgScore: number;
  latestScore: number;
  scoreTrend: number;
  weakestCategory: { name: string; score: number } | null;
  history: { score: number; date: string; difficulty: string }[];
  plan: "free" | "pro";
  streak: number;
  trialDaysRemaining: number | null;
}

function getScoreColor(score: number) {
  if (score >= 80) return "text-green-500";
  if (score >= 60) return "text-yellow-500";
  if (score >= 40) return "text-orange-500";
  return "text-red-500";
}

function getGrade(score: number) {
  if (score >= 90) return "S";
  if (score >= 80) return "A";
  if (score >= 70) return "B";
  if (score >= 60) return "C";
  if (score >= 40) return "D";
  return "E";
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
  const height = 160;
  const width = history.length > 1 ? 100 : 50;

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[300px]" style={{ height: `${height + 30}px` }}>
        <svg viewBox={`0 0 ${width} ${height + 20}`} className="w-full h-full" preserveAspectRatio="none">
          {/* Grid lines */}
          {[20, 40, 60, 80].map((v) => (
            <line
              key={v}
              x1="0" y1={height - (v / maxScore) * height}
              x2={width} y2={height - (v / maxScore) * height}
              stroke="var(--card-border)" strokeWidth="0.3" strokeDasharray="2,2"
            />
          ))}
          {/* Line */}
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
          {/* Dots */}
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

  if (error || !data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-sm text-muted mb-4">{error || "データがありません"}</p>
          <Link href="/roleplay" className="text-sm text-accent hover:underline">ロープレを始める</Link>
        </div>
      </div>
    );
  }

  const hasScores = data.totalScored > 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-card-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-6">
          <Link href="/" className="text-lg font-bold">
            成約コーチ AI
          </Link>
          <Link
            href="/roleplay"
            className="rounded-lg bg-accent px-5 py-2 text-sm font-semibold text-white transition hover:bg-accent-hover"
          >
            ロープレを始める
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-6 py-10">
        <h1 className="mb-2 text-2xl font-bold">マイダッシュボード</h1>
        <p className="mb-8 text-sm text-muted">あなたの営業トレーニング進捗</p>

        {/* Onboarding Checklist for new users — auto-detects progress from data */}
        {data.totalSessions < 5 && (
          <OnboardingChecklist
            data={{
              totalSessions: data.totalSessions,
              totalScored: data.totalScored,
              weakestCategory: data.weakestCategory,
            }}
          />
        )}

        {/* Reverse Trial Banner */}
        {data.trialDaysRemaining !== null && data.trialDaysRemaining > 0 && (
          <div className="mb-6 rounded-xl border border-accent/30 bg-gradient-to-r from-accent/10 to-accent/5 px-5 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🎁</span>
                <div>
                  <div className="text-sm font-bold text-accent">
                    Pro体験中 — 残り{data.trialDaysRemaining}日
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

        {/* Streak */}
        {data.streak > 0 && (
          <div className="mb-6 rounded-xl border border-accent/20 bg-accent/5 px-5 py-4 flex items-center gap-3">
            <span className="text-3xl">🔥</span>
            <div className="flex-1">
              <div className="text-lg font-bold text-accent">{data.streak}日連続</div>
              <div className="text-xs text-muted">
                {data.streak >= 7 ? "素晴らしい！習慣化されています" : data.streak >= 3 ? "いい調子！継続は力なり" : "連続記録を伸ばそう！"}
              </div>
            </div>
            {data.plan === "pro" && (
              <div className="shrink-0 rounded-full bg-accent/10 px-3 py-1 text-[10px] font-medium text-accent">
                ストリークシールド ON
              </div>
            )}
            {data.plan === "free" && data.streak >= 3 && (
              <Link href="/pricing" className="shrink-0 rounded-full bg-accent/10 px-3 py-1 text-[10px] font-medium text-accent transition hover:bg-accent/20">
                Pro: 1日休んでもOK →
              </Link>
            )}
          </div>
        )}

        {/* Milestone Celebration */}
        {hasScores && data.bestScore >= 80 && (
          <div className="mb-6 rounded-xl border border-green-500/20 bg-green-500/5 px-5 py-4">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">🏆</span>
              <div className="text-base font-bold text-green-500">
                Aランク達成！上位プレイヤーの仲間入りです
              </div>
            </div>
            <p className="text-xs text-muted mb-3">
              スコア{data.bestScore}点はAランク。ここからさらに磨けばSランクも目前です。
            </p>
            {data.plan === "free" ? (
              <Link
                href="/pricing"
                className="inline-flex h-9 items-center rounded-lg bg-accent px-4 text-xs font-bold text-white transition hover:bg-accent-hover"
              >
                Proで毎日練習してSランクへ →
              </Link>
            ) : (
              <Link
                href="/referral"
                className="inline-flex h-9 items-center rounded-lg bg-green-500/10 px-4 text-xs font-bold text-green-500 transition hover:bg-green-500/20"
              >
                この成果を同僚にシェアして ¥1,000 OFF →
              </Link>
            )}
          </div>
        )}

        {/* Power User Upgrade Nudge */}
        {data.totalSessions >= 10 && data.plan === "free" && data.bestScore < 80 && (
          <div className="mb-6 rounded-xl border border-accent/20 bg-accent/5 px-5 py-4">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">⚡</span>
              <div className="text-sm font-bold">
                {data.totalSessions}回の練習、素晴らしい行動力です！
              </div>
            </div>
            <p className="text-xs text-muted mb-3">
              毎日の練習を続けているあなたは上位ユーザー。Proなら無制限で集中練習でき、スコアアップが加速します。
            </p>
            <Link
              href="/pricing"
              className="inline-flex h-9 items-center rounded-lg bg-accent px-4 text-xs font-bold text-white transition hover:bg-accent-hover"
            >
              7日間無料でProを試す →
            </Link>
          </div>
        )}

        {/* Endowed Progress — Nunes & Dreze (2006): starting at non-zero increases completion 79% */}
        <div className="mb-6 rounded-xl border border-card-border bg-card p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold">営業力レベル</span>
            <span className="text-xs text-accent font-bold">
              {data.totalScored === 0 ? "Lv.1 入門" : data.avgScore >= 80 ? "Lv.5 達人" : data.avgScore >= 60 ? "Lv.4 上級" : data.avgScore >= 40 ? "Lv.3 中級" : data.totalScored >= 3 ? "Lv.2 初級" : "Lv.1 入門"}
            </span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-card-border">
            <div
              className="h-full rounded-full bg-accent transition-all duration-1000"
              style={{
                width: `${Math.max(20, data.totalScored === 0 ? 20 : data.avgScore >= 80 ? 100 : data.avgScore >= 60 ? 80 : data.avgScore >= 40 ? 60 : data.totalScored >= 3 ? 40 : 20)}%`,
              }}
            />
          </div>
          <div className="mt-2 text-[11px] text-muted">
            {data.totalScored === 0
              ? "ロープレを始めるとレベルが上がります"
              : data.avgScore >= 80
              ? "トップレベル！Sランクを目指しましょう"
              : `次のレベルまで：平均スコアを${data.avgScore >= 60 ? 80 : data.avgScore >= 40 ? 60 : 40}点以上に`}
          </div>
        </div>

        {/* Pro Value Reinforcement — reduces churn by showing ROI */}
        {data.plan === "pro" && data.totalSessions > 0 && (
          <div className="mb-6 rounded-xl border border-accent/15 bg-accent/5 px-5 py-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-muted">今月の利用価値</div>
                <div className="text-lg font-bold text-accent">
                  ¥{(data.totalSessions * 3000).toLocaleString()}相当
                </div>
                <div className="text-[11px] text-muted">
                  {data.totalSessions}回の練習 × 研修換算¥3,000 = <span className="font-medium text-foreground">¥2,980で{data.totalSessions}回利用</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-black text-accent">
                  {Math.round((data.totalSessions * 3000) / 2980 * 100)}%
                </div>
                <div className="text-[10px] text-muted">コスパ</div>
              </div>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-xl border border-card-border bg-card p-4">
            <div className="text-xs text-muted mb-1">総セッション数</div>
            <div className="text-2xl font-bold">{data.totalSessions}</div>
          </div>
          <div className="rounded-xl border border-card-border bg-card p-4">
            <div className="text-xs text-muted mb-1">ベストスコア</div>
            <div className={`text-2xl font-bold ${hasScores ? getScoreColor(data.bestScore) : "text-muted"}`}>
              {hasScores ? data.bestScore : "—"}
            </div>
            {hasScores && (
              <div className="text-[11px] text-muted">ランク {getGrade(data.bestScore)}</div>
            )}
          </div>
          <div className="rounded-xl border border-card-border bg-card p-4">
            <div className="text-xs text-muted mb-1">平均スコア</div>
            <div className={`text-2xl font-bold ${hasScores ? getScoreColor(data.avgScore) : "text-muted"}`}>
              {hasScores ? data.avgScore : "—"}
            </div>
          </div>
          <div className="rounded-xl border border-card-border bg-card p-4">
            <div className="text-xs text-muted mb-1">最新スコア</div>
            <div className={`text-2xl font-bold ${hasScores ? getScoreColor(data.latestScore) : "text-muted"}`}>
              {hasScores ? data.latestScore : "—"}
            </div>
            {data.scoreTrend !== 0 && (
              <div className={`text-[11px] font-medium ${data.scoreTrend > 0 ? "text-green-500" : "text-red-400"}`}>
                {data.scoreTrend > 0 ? "+" : ""}{data.scoreTrend}点
              </div>
            )}
          </div>
        </div>

        {/* Score History Chart */}
        {hasScores && data.history.length > 0 && (
          <div className="mb-8 rounded-2xl border border-card-border bg-card p-6">
            <h2 className="mb-4 text-sm font-medium text-muted">スコア推移</h2>
            <ScoreChart history={data.history} />
          </div>
        )}

        {/* Weakest Category + Recommendation */}
        {hasScores && data.weakestCategory && (
          <div className="mb-8 rounded-2xl border border-accent/20 bg-accent/5 p-6">
            <h2 className="mb-2 text-sm font-medium text-accent">改善推奨カテゴリ</h2>
            <div className="flex items-center justify-between mb-3">
              <span className="text-base font-bold">{data.weakestCategory.name}</span>
              <span className={`text-lg font-bold ${getScoreColor(data.weakestCategory.score)}`}>
                {data.weakestCategory.score}点
              </span>
            </div>
            <div className="mb-1 h-2 overflow-hidden rounded-full bg-card-border">
              <div
                className="h-full rounded-full bg-accent transition-all duration-700"
                style={{ width: `${data.weakestCategory.score}%` }}
              />
            </div>
            <p className="mt-3 text-xs text-muted">
              このカテゴリを集中的に練習することで、総合スコアの大幅な改善が期待できます。
              {CATEGORY_LESSON_MAP[data.weakestCategory.name] && (
                <> 学習コースの「{CATEGORY_LESSON_MAP[data.weakestCategory.name].label}」で基礎を確認しましょう。</>
              )}
            </p>
            <div className="mt-4 flex flex-col sm:flex-row gap-2">
              <Link
                href="/roleplay"
                className="flex h-10 items-center justify-center rounded-lg bg-accent px-5 text-sm font-bold text-white transition hover:bg-accent-hover"
              >
                このカテゴリを重点練習する
              </Link>
              <Link
                href={CATEGORY_LESSON_MAP[data.weakestCategory.name] ? `/learn#${CATEGORY_LESSON_MAP[data.weakestCategory.name].level}` : "/learn"}
                className="flex h-10 items-center justify-center rounded-lg border border-card-border px-5 text-sm text-muted transition hover:text-foreground"
              >
                {CATEGORY_LESSON_MAP[data.weakestCategory.name]
                  ? `${CATEGORY_LESSON_MAP[data.weakestCategory.name].label}を復習`
                  : "営業の型を復習する"}
              </Link>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!hasScores && (
          <div className="mb-8 rounded-2xl border border-card-border bg-card p-8 text-center">
            <div className="mb-3 text-4xl">📊</div>
            <h2 className="mb-2 text-lg font-bold">まだスコアデータがありません</h2>
            <p className="mb-6 text-sm text-muted">
              ロープレを行うとスコアがここに記録され、<br />
              あなたの成長を可視化できます。
            </p>
            <Link
              href="/roleplay"
              className="inline-flex h-12 items-center justify-center rounded-xl bg-accent px-8 text-base font-bold text-white transition hover:bg-accent-hover"
            >
              最初のロープレを始める
            </Link>
          </div>
        )}

        {/* Pro Upgrade CTA for free users */}
        {data.plan === "free" && (
          <div className="mb-8 rounded-2xl border border-accent/30 bg-gradient-to-br from-accent/5 to-transparent p-6 text-center">
            <p className="mb-1 text-sm font-bold">全5カテゴリの詳細フィードバックで効率的に改善</p>
            <p className="mb-4 text-xs text-muted">
              Proプランなら無制限ロープレ + AI改善アドバイスで短期間でスコアアップ
            </p>
            <Link
              href="/pricing"
              className="inline-flex h-10 items-center rounded-lg bg-accent px-6 text-sm font-bold text-white transition hover:bg-accent-hover"
            >
              7日間無料でProを試す
            </Link>
            <p className="mt-2 text-[11px] text-muted">7日間完全無料 → ¥2,980/月 ・ いつでも解約OK</p>
          </div>
        )}

        {/* Invoice Link for Pro Users */}
        {data.plan === "pro" && (
          <div className="mb-8 rounded-xl border border-card-border bg-card p-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-bold">領収書・請求書</div>
                <div className="text-xs text-muted">Stripeの管理画面で領収書のダウンロードが可能です</div>
              </div>
              <button
                onClick={async () => {
                  try {
                    const res = await fetch("/api/stripe/portal", { method: "POST" });
                    const d = await res.json();
                    if (d.url) window.location.href = d.url;
                  } catch { /* ignore */ }
                }}
                className="rounded-lg bg-accent/10 px-4 py-2 text-sm font-bold text-accent transition hover:bg-accent/20"
              >
                領収書を見る
              </button>
            </div>
          </div>
        )}

        {/* Quick Links */}
        <div className="grid gap-3 sm:grid-cols-3">
          <Link
            href="/roleplay"
            className="rounded-xl border border-card-border bg-card p-4 text-center transition hover:border-accent/30"
          >
            <div className="mb-1 text-xl">🎯</div>
            <div className="text-sm font-bold">ロープレ</div>
            <div className="text-[11px] text-muted">AIと営業練習</div>
          </Link>
          <Link
            href="/learn"
            className="rounded-xl border border-card-border bg-card p-4 text-center transition hover:border-accent/30"
          >
            <div className="mb-1 text-xl">📚</div>
            <div className="text-sm font-bold">学習</div>
            <div className="text-[11px] text-muted">成約5ステップ</div>
          </Link>
          <Link
            href="/referral"
            className="rounded-xl border border-card-border bg-card p-4 text-center transition hover:border-accent/30"
          >
            <div className="mb-1 text-xl">🎁</div>
            <div className="text-sm font-bold">友達紹介</div>
            <div className="text-[11px] text-muted">¥1,000 OFFクーポン</div>
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}
