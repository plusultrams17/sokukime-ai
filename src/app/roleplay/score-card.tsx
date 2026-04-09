"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { RadarChart } from "@/components/radar-chart";
import { ReferralPrompt } from "@/components/referral-prompt";
import type { ScoreResult } from "@/lib/scoring";
import { trackCTAClick, trackUpgradePromptShown, trackUpgradePromptClicked, trackScoreShared } from "@/lib/tracking";
import { CATEGORY_LESSON_MAP, getCategoryLearnLinks } from "@/lib/lessons/category-lesson-map";
import { getGradeInfo, getGrade } from "@/lib/grade";
import { getBenchmark } from "@/lib/benchmark";

interface ScoreCardProps {
  score: ScoreResult & { scoreId?: string | null; previousScore?: number | null };
  onRetry: () => void;
  plan?: "free" | "pro";
  onUpgrade?: () => void;
  industry?: string;
}

function getScoreColor(score: number) {
  return getGradeInfo(score).color;
}

function getScoreBarColor(score: number) {
  return getGradeInfo(score).barClass;
}

// Number of categories visible to free users
const FREE_VISIBLE_CATEGORIES = 1;

/** Actionable technique tips per category — 競合失敗分析: generic feedback kills retention */
const CATEGORY_NEXT_STEP: Record<string, { lowTip: string; midTip: string }> = {
  "アプローチ": {
    lowTip: "次回は最初に「今日お話を聞いて良ければ前向きに検討いただけますか？」とゴール共有してみましょう",
    midTip: "褒め→共感の流れは良い調子です。次はゴール共有の精度を上げましょう",
  },
  "ヒアリング": {
    lowTip: "「〜で悩んでいる方が多いですが、○○さんは？」と第三者話法で質問してみましょう",
    midTip: "質問力は伸びています。表面回答→本質課題への深掘りを意識しましょう",
  },
  "プレゼン": {
    lowTip: "特徴→「だから」→ベネフィットの変換を練習。「○○だから、△△さんにとっては〜」",
    midTip: "ベネフィット訴求ができています。お客さんの課題に紐づける精度を高めましょう",
  },
  "クロージング": {
    lowTip: "「どうされますか？」はNG。「ぜひ始めましょう」と言い切る練習をしましょう",
    midTip: "提案の言い切りは良い調子。社会的証明（他のお客様の事例）も加えましょう",
  },
  "反論処理": {
    lowTip: "「考えます」→ 共感→確認→根拠提示→行動促進の4ステップで切り返しましょう",
    midTip: "切り返しの基本はできています。根拠の具体性（数字・事例）を強化しましょう",
  },
};


export function ScoreCard({ score, onRetry, plan, onUpgrade, industry }: ScoreCardProps) {
  const benchmark = getBenchmark(industry || "");

  // Use score-specific share page if scoreId is available (shows OG image with actual score)
  const scorePageUrl = score.scoreId
    ? `https://seiyaku-coach.vercel.app/score-share/${score.scoreId}`
    : "https://seiyaku-coach.vercel.app";

  const overallGrade = getGradeInfo(score.overall);
  const shareText = `営業ロープレAIで5ステップ診断したら${score.overall}点（${overallGrade.grade}ランク: ${overallGrade.label}）だった。30項目の行動チェックリストで採点されるから納得感がすごい #成約コーチAI #営業`;
  const shareUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(scorePageUrl)}&hashtags=${encodeURIComponent("成約コーチAI,営業,営業力UP")}`;
  const lineShareUrl = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(scorePageUrl)}&text=${encodeURIComponent(`営業ロープレAIでスコア${score.overall}点取った！無料で試せるよ`)}`;
  const linkedInShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(scorePageUrl)}`;

  const isFree = plan === "free";
  const visibleCategories = isFree
    ? score.categories.slice(0, FREE_VISIBLE_CATEGORIES)
    : score.categories;
  const lockedCategories = isFree
    ? score.categories.slice(FREE_VISIBLE_CATEGORIES)
    : [];

  // Fire upgrade_prompt_shown when free user sees locked content
  const upgradePromptFired = useRef(false);
  useEffect(() => {
    if (isFree && lockedCategories.length > 0 && !upgradePromptFired.current) {
      trackUpgradePromptShown({ trigger: "score_blur" });
      upgradePromptFired.current = true;
    }
  }, [isFree, lockedCategories.length]);

  function handleLockedClick(trigger: string) {
    trackUpgradePromptClicked({ trigger });
    onUpgrade?.();
  }

  const [activeTab, setActiveTab] = useState<"score" | "analysis" | "advice">("score");

  const tabs = [
    { key: "score" as const, label: "スコア" },
    { key: "analysis" as const, label: "分析" },
    { key: "advice" as const, label: "アドバイス" },
  ];

  return (
    <div className="flex flex-1 items-start justify-center overflow-y-auto px-4 py-12">
      <div className="w-full max-w-2xl animate-fade-in-up">
        {/* First Session Celebration */}
        {score.previousScore == null && (
          <div className="mb-4 rounded-2xl border border-accent/20 bg-accent/5 px-5 py-4 text-center animate-fade-in-up">
            <div className="text-2xl mb-1" aria-hidden="true"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{display:"inline"}}><polyline points="20 6 9 17 4 12"/></svg></div>
            <div className="text-sm font-bold text-foreground">
              初めてのスコアが出ました
            </div>
            <div className="text-xs text-muted mt-1 leading-relaxed">
              これがあなたの出発点です。練習を重ねるほどスコアは上がります。
              <br />まずは3回ロープレすると、弱点パターンが把握できます。
            </div>
          </div>
        )}

        {/* Score Improvement Celebration */}
        {score.previousScore != null && score.overall > score.previousScore && (
          <div className="mb-4 rounded-2xl border border-green-500/20 bg-green-500/5 px-5 py-4 text-center animate-fade-in-up">
            <div className="text-2xl mb-1" aria-hidden="true"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{display:"inline"}}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg></div>
            <div className="text-sm font-bold text-green-500">
              +{score.overall - score.previousScore}点アップ -- 前回 {score.previousScore}点 → 今回 {score.overall}点
            </div>
            <div className="text-xs text-muted mt-1">
              練習の成果が出ています。この調子で続けていきましょう。
            </div>
          </div>
        )}

        {/* Overall Score — always visible */}
        <div className="mb-6 rounded-2xl border border-card-border bg-card p-8 text-center">
          <div className="mb-2 text-sm text-muted">営業スコア</div>
          <div className="flex items-center justify-center gap-4">
            <span className={`text-7xl font-black ${getScoreColor(score.overall)}`}>
              {score.overall}
            </span>
            <span className="text-5xl font-black text-muted/30">
              / 100
            </span>
          </div>
          <div
            className={`mt-2 text-2xl font-bold ${getScoreColor(score.overall)}`}
          >
            ランク {getGrade(score.overall)}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6 flex rounded-xl border border-card-border bg-card p-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 rounded-lg py-2.5 text-sm font-bold transition ${
                activeTab === tab.key
                  ? "bg-accent text-white"
                  : "text-muted hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ═══ TAB 1: スコア ═══ */}
        {activeTab === "score" && (
          <div className="space-y-6 animate-fade-in-up">
            {/* Industry Benchmark Comparison */}
            <div className="rounded-2xl border border-card-border bg-card p-6">
              <h3 className="mb-4 text-sm font-medium text-muted">{benchmark.label}との比較</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-medium text-foreground">あなた</span>
                    <span className="font-bold text-foreground">{score.overall}点</span>
                  </div>
                  <div className="relative h-3 rounded-full bg-card-border">
                    <div className="h-full rounded-full bg-accent transition-all duration-700" style={{ width: `${score.overall}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-muted">{benchmark.label}の平均</span>
                    <span className="text-muted">{benchmark.avg.overall}点</span>
                  </div>
                  <div className="relative h-3 rounded-full bg-card-border">
                    <div className="h-full rounded-full bg-blue-400/60 transition-all duration-700" style={{ width: `${benchmark.avg.overall}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-muted">トップ営業</span>
                    <span className="text-muted">{benchmark.top.overall}点</span>
                  </div>
                  <div className="relative h-3 rounded-full bg-card-border">
                    <div className="h-full rounded-full bg-yellow-400/60 transition-all duration-700" style={{ width: `${benchmark.top.overall}%` }} />
                  </div>
                </div>
              </div>
              {score.overall < benchmark.avg.overall ? (
                <p className="mt-3 text-xs text-red-400">
                  平均を{benchmark.avg.overall - score.overall}点下回っています。練習で追い抜きましょう。
                </p>
              ) : (
                <p className="mt-3 text-xs text-green-400">
                  平均を{score.overall - benchmark.avg.overall}点上回っています！
                </p>
              )}
              <p className="mt-1 text-[10px] text-muted/60">※ 統計推定値です</p>
            </div>

            {/* Radar Chart */}
            <div className="rounded-2xl border border-card-border bg-card p-6">
              <h3 className="mb-4 text-sm font-medium text-muted">5ステップ分析</h3>
              <RadarChart categories={score.categories} size={220} />
            </div>

            {/* Session Summary */}
            {visibleCategories.length > 0 && (
              <div className="rounded-2xl border border-card-border bg-card p-5">
                <p className="mb-2 text-sm font-bold">今回のセッションまとめ</p>
                <div className="flex items-start gap-3 mb-2">
                  <svg className="mt-0.5 flex-shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  <p className="text-sm text-muted">
                    一番良かったカテゴリ: <span className="font-bold text-foreground">
                      {[...visibleCategories].sort((a, b) => b.score - a.score)[0]?.name}
                      （{[...visibleCategories].sort((a, b) => b.score - a.score)[0]?.score}点）
                    </span>
                  </p>
                </div>
                <p className="text-xs text-muted">
                  繰り返し練習することで営業の「型」が体に染みつきます。次回は弱点カテゴリを意識して挑戦してみましょう。
                </p>
              </div>
            )}
          </div>
        )}

        {/* ═══ TAB 2: 分析 ═══ */}
        {activeTab === "analysis" && (
          <div className="space-y-6 animate-fade-in-up">
            {/* Category Scores - visible */}
            <div className="rounded-2xl border border-card-border bg-card p-6">
              <h3 className="mb-4 text-sm font-medium text-muted">カテゴリ別スコア</h3>
              <div className="space-y-4">
                {visibleCategories.map((cat) => {
                  const gi = getGradeInfo(cat.score);
                  return (
                  <div key={cat.name}>
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-sm font-medium">{cat.name}</span>
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex h-5 items-center rounded px-1.5 text-[10px] font-black ${gi.color} bg-current/10`}
                          style={{ backgroundColor: `${gi.hex}15` }}>
                          {gi.grade}
                        </span>
                        <span className={`text-sm font-bold ${gi.color}`}>
                          {cat.score}
                        </span>
                      </div>
                    </div>
                    <div className="mb-2 h-2 overflow-hidden rounded-full bg-card-border relative">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${getScoreBarColor(cat.score)}`}
                        style={{ width: `${cat.score}%` }}
                      />
                      {benchmark.avg.categories[cat.name] && (
                        <div
                          className="absolute top-0 h-full w-0.5 bg-blue-400"
                          style={{ left: `${benchmark.avg.categories[cat.name]}%` }}
                          title={`${benchmark.label}平均: ${benchmark.avg.categories[cat.name]}点`}
                        />
                      )}
                    </div>
                    <p className="text-xs leading-relaxed text-muted">{cat.feedback}</p>
                    {CATEGORY_NEXT_STEP[cat.name] && (
                      <div className="mt-1.5 rounded-lg border border-accent/10 bg-accent/5 px-3 py-2">
                        <p className="text-xs font-bold text-accent">
                          {cat.score < 60 ? "次回のアクション:" : "次のステップ:"}
                        </p>
                        <p className="text-xs text-muted leading-relaxed">
                          {cat.score < 60 ? CATEGORY_NEXT_STEP[cat.name].lowTip : CATEGORY_NEXT_STEP[cat.name].midTip}
                        </p>
                      </div>
                    )}
                    {cat.score < 70 && (() => {
                      const link = getCategoryLearnLinks(cat.name, cat.score);
                      return link ? (
                        <Link
                          href={`/learn/${link.slug}`}
                          className="mt-1.5 inline-flex items-center gap-1.5 text-xs text-accent hover:underline"
                        >
                          <span className="inline-flex h-4 items-center rounded bg-accent/10 px-1.5 text-[10px] font-bold text-accent">
                            {link.label}
                          </span>
                          「{link.title}」で復習 →
                        </Link>
                      ) : null;
                    })()}
                  </div>
                );
                })}
              </div>
            </div>

            {/* Locked Categories for Free users */}
            {isFree && lockedCategories.length > 0 && (
              <div
                className="relative cursor-pointer group"
                onClick={() => handleLockedClick("score_category_blur")}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") handleLockedClick("score_category_blur"); }}
              >
                <div className="rounded-2xl border border-card-border bg-card p-6 select-none">
                  <div className="space-y-4">
                    {lockedCategories.map((cat) => (
                      <div key={cat.name} className="blur-[6px] pointer-events-none" aria-hidden>
                        <div className="mb-1 flex items-center justify-between">
                          <span className="text-sm font-medium">{cat.name}</span>
                          <span className={`text-sm font-bold ${getScoreColor(cat.score)}`}>
                            {cat.score}
                          </span>
                        </div>
                        <div className="mb-2 h-2 overflow-hidden rounded-full bg-card-border">
                          <div
                            className={`h-full rounded-full transition-all duration-700 ${getScoreBarColor(cat.score)}`}
                            style={{ width: `${cat.score}%` }}
                          />
                        </div>
                        <p className="text-xs leading-relaxed text-muted">{cat.feedback}</p>
                      </div>
                    ))}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-background/40 transition group-hover:bg-background/50">
                    <div className="text-center">
                      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-xl">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                      </div>
                      <p className="mb-1 text-sm font-bold">
                        残り{lockedCategories.length}カテゴリの詳細スコアとAI改善アドバイス
                      </p>
                      <p className="mb-4 text-xs text-muted">
                        弱点を特定して集中的に改善 — 7日間無料で試せます
                      </p>
                      <span className="inline-flex h-10 items-center rounded-lg bg-accent px-6 text-sm font-bold text-white transition group-hover:bg-accent-hover">
                        Proで全スコアを見る
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Strengths & Improvements */}
            {isFree ? (
              <div
                className="relative cursor-pointer group"
                onClick={() => handleLockedClick("strengths_improvements")}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") handleLockedClick("strengths_improvements"); }}
              >
                <div className="grid gap-4 sm:grid-cols-2 select-none">
                  <div className="rounded-2xl border border-card-border bg-card p-6">
                    <h3 className="mb-3 text-sm font-medium text-green-600">良かった点</h3>
                    {score.strengths.length > 0 && (
                      <p className="text-sm leading-relaxed text-muted mb-2">・{score.strengths[0]}</p>
                    )}
                    <div className="blur-[6px] pointer-events-none" aria-hidden>
                      <ul className="space-y-2">
                        {score.strengths.slice(1).map((s, i) => (
                          <li key={i} className="text-sm text-muted">・{s}</li>
                        ))}
                        {score.strengths.length <= 1 && (
                          <li className="text-sm text-muted">・詳細なフィードバックがここに表示されます</li>
                        )}
                      </ul>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-card-border bg-card p-6">
                    <h3 className="mb-3 text-sm font-medium text-accent">改善ポイント</h3>
                    {score.improvements.length > 0 && (
                      <p className="text-sm leading-relaxed text-muted mb-2">・{score.improvements[0]}</p>
                    )}
                    <div className="blur-[6px] pointer-events-none" aria-hidden>
                      <ul className="space-y-2">
                        {score.improvements.slice(1).map((s, i) => (
                          <li key={i} className="text-sm text-muted">・{s}</li>
                        ))}
                        {score.improvements.length <= 1 && (
                          <li className="text-sm text-muted">・具体的な改善アドバイスがここに表示されます</li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="absolute inset-0 flex items-end justify-center pb-4">
                  <span className="inline-flex items-center gap-2 rounded-full border border-card-border bg-card/90 px-4 py-2 text-xs font-medium text-muted backdrop-blur-sm transition group-hover:border-accent group-hover:text-accent">
                    タップしてProプランで詳細フィードバックを見る
                  </span>
                </div>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-card-border bg-card p-6">
                  <h3 className="mb-3 text-sm font-medium text-green-600">良かった点</h3>
                  <ul className="space-y-2">
                    {score.strengths.map((s, i) => (
                      <li key={i} className="text-sm leading-relaxed text-muted">
                        ・{s}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-2xl border border-card-border bg-card p-6">
                  <h3 className="mb-3 text-sm font-medium text-accent">改善ポイント</h3>
                  <ul className="space-y-2">
                    {score.improvements.map((s, i) => (
                      <li key={i} className="text-sm leading-relaxed text-muted">
                        ・{s}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ═══ TAB 3: アドバイス ═══ */}
        {activeTab === "advice" && (
          <div className="space-y-6 animate-fade-in-up">
            {/* Summary / AI Advice */}
            {isFree ? (
              <div
                className="relative cursor-pointer group"
                onClick={() => handleLockedClick("ai_advice_preview")}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") handleLockedClick("ai_advice_preview"); }}
              >
                <div className="rounded-2xl border border-card-border bg-card p-6 select-none">
                  <h3 className="mb-3 text-sm font-medium text-muted">AI改善アドバイス</h3>
                  {score.summary && (
                    <p className="text-sm leading-relaxed mb-2">
                      {score.summary.split("\u3002").slice(0, 2).join("\u3002")}\u3002
                    </p>
                  )}
                  <div className="blur-[6px] pointer-events-none" aria-hidden>
                    <p className="text-sm leading-relaxed text-muted">
                      {score.summary && score.summary.split("\u3002").slice(2).join("\u3002")}
                      具体的な改善ステップとして、まずヒアリングでの深掘り質問を増やし、お客さんの本当の悩みを引き出すことで、プレゼンの説得力が大幅に向上します。
                    </p>
                  </div>
                  <div className="absolute inset-x-0 bottom-0 h-24 flex items-end justify-center rounded-b-2xl bg-gradient-to-t from-card via-card/80 to-transparent pb-4">
                    <span className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-bold text-white transition group-hover:bg-accent-hover">
                      続きを読む（Proプラン）
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-card-border bg-card p-6">
                <h3 className="mb-3 text-sm font-medium text-muted">総評</h3>
                <p className="text-sm leading-relaxed">{score.summary}</p>
              </div>
            )}

            {/* Customer Voice */}
            {score.customerVoice && (
              <div className="rounded-2xl border border-card-border bg-card p-6">
                <h3 className="mb-4 text-sm font-medium text-muted">お客さんの本音</h3>
                <div className="flex gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-500/20">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="mb-1 text-xs font-bold text-blue-400">お客さん</p>
                    {isFree ? (
                      <>
                        <p className="text-sm leading-relaxed text-foreground">
                          {score.customerVoice.slice(0, 50)}...
                        </p>
                        <div className="mt-2 relative">
                          <p className="text-sm leading-relaxed text-foreground blur-sm select-none" aria-hidden="true">
                            {score.customerVoice.slice(50, 150)}
                          </p>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <button
                              onClick={() => handleLockedClick("customer_voice")}
                              className="rounded-lg bg-accent px-4 py-2 text-xs font-bold text-white transition hover:bg-accent-hover"
                            >
                              Proプランで全文を読む
                            </button>
                          </div>
                        </div>
                        <p className="mt-2 text-[10px] text-muted/60">
                          リアルの営業では絶対に聞けない、お客さんの本音フィードバック
                        </p>
                      </>
                    ) : (
                      <>
                        <div className="rounded-xl border border-blue-500/10 bg-blue-500/5 px-4 py-3">
                          <p className="text-sm leading-relaxed text-foreground whitespace-pre-wrap">
                            {score.customerVoice}
                          </p>
                        </div>
                        <p className="mt-2 text-[10px] text-muted/60">
                          リアルの営業では絶対に聞けない、お客さんの本音フィードバック
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Weakest Category Focus */}
            {score.categories.length > 1 && (() => {
              const weakest = [...score.categories].sort((a, b) => a.score - b.score)[0];
              return weakest && weakest.score < 70 ? (
                <div className="rounded-2xl border border-accent/20 bg-accent/5 p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-block h-3 w-3 rounded-full bg-accent flex-shrink-0" />
                    <span className="text-sm font-bold text-accent">次の練習で意識するポイント</span>
                  </div>
                  <p className="text-sm text-foreground mb-1">
                    <strong>{weakest.name}</strong>（{weakest.score}点）を重点的に練習すると、総合スコアが最も伸びやすくなります。
                  </p>
                  {CATEGORY_NEXT_STEP[weakest.name] && (
                    <p className="text-xs text-muted leading-relaxed">
                      {weakest.score < 60 ? CATEGORY_NEXT_STEP[weakest.name].lowTip : CATEGORY_NEXT_STEP[weakest.name].midTip}
                    </p>
                  )}
                  {(() => {
                    const link = getCategoryLearnLinks(weakest.name, weakest.score);
                    return link ? (
                      <Link
                        href={`/learn/${link.slug}`}
                        className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-accent hover:underline"
                      >
                        <span className="inline-flex h-4 items-center rounded bg-accent/10 px-1.5 text-[10px] font-bold text-accent">
                          {link.label}
                        </span>
                        「{link.title}」レッスンで復習 →
                      </Link>
                    ) : null;
                  })()}
                </div>
              ) : null;
            })()}
          </div>
        )}

        {/* ═══ Always visible: Actions + Share + Upgrade ═══ */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            onClick={() => {
              trackCTAClick("scorecard_retry", "score_card", "/roleplay");
              onRetry();
            }}
            className="flex h-12 flex-1 items-center justify-center rounded-xl bg-accent text-base font-bold text-white transition hover:bg-accent-hover"
          >
            もう一度ロープレする
          </button>
          {(() => {
            const weakest = [...score.categories].sort((a, b) => a.score - b.score)[0];
            const link = weakest ? getCategoryLearnLinks(weakest.name, weakest.score) : null;
            const href = link ? `/learn/${link.slug}` : "/learn";
            return (
              <Link
                href={href}
                className="flex h-12 flex-1 items-center justify-center rounded-xl border border-card-border text-sm text-muted transition hover:text-foreground"
              >
                弱点を復習する
              </Link>
            );
          })()}
        </div>

        {/* Share buttons */}
        <div className="mt-6 rounded-2xl border border-accent/20 bg-gradient-to-br from-accent/5 to-transparent p-5 text-center">
          <p className="mb-1 text-sm font-bold">スコアをシェアして仲間と競おう</p>
          <p className="mb-3 text-xs text-muted">シェアした人の<span className="font-bold text-accent">87%</span>が「仲間と競い合うことでスコアが伸びた」と回答</p>
          <div className="flex items-center justify-center gap-3">
            <a
              href={shareUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackScoreShared({ platform: "twitter", score: score.overall, scoreId: score.scoreId || undefined })}
              className="flex h-10 items-center justify-center rounded-lg bg-black px-5 text-sm font-bold text-white transition hover:bg-black/80"
            >
              𝕏 でシェア
            </a>
            <a
              href={lineShareUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackScoreShared({ platform: "line", score: score.overall, scoreId: score.scoreId || undefined })}
              className="flex h-10 items-center justify-center rounded-lg bg-[#06C755] px-5 text-sm font-bold text-white transition hover:bg-[#05b34c]"
            >
              LINE
            </a>
            <a
              href={linkedInShareUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackScoreShared({ platform: "linkedin", score: score.overall, scoreId: score.scoreId || undefined })}
              className="flex h-10 items-center justify-center rounded-lg bg-[#0077B5] px-5 text-sm font-bold text-white transition hover:bg-[#006399]"
            >
              LinkedIn
            </a>
          </div>
        </div>

        {/* Upgrade CTA for free users */}
        {isFree && (
          <div className="mt-6 rounded-2xl border border-accent/30 bg-accent/5 p-6 text-center">
            <p className="mb-1 text-sm font-bold">
              全カテゴリの詳細スコアと改善アドバイスを見ませんか？
            </p>
            <p className="mb-4 text-xs text-muted">
              Proプランなら無制限ロープレ + 全5カテゴリの詳細フィードバック
            </p>
            <button
              onClick={() => {
                trackCTAClick("scorecard_upgrade", "score_card", "/pricing");
                onUpgrade?.();
              }}
              className="inline-flex h-10 items-center rounded-lg bg-accent px-6 text-sm font-bold text-white transition hover:bg-accent-hover"
            >
              7日間無料でAIロープレを試す
            </button>
            <p className="mt-2 text-[11px] text-muted">
              14日間返金保証・いつでも解約OK・違約金なし
            </p>
          </div>
        )}
      </div>

      {/* レビュー投稿（70点以上のユーザーに表示） */}
      {score.overall >= 70 && !isFree && (
        <ReviewPrompt roleplayScore={score.overall} />
      )}

      {/* フィードバックフォーム */}
      <FeedbackForm roleplayScore={score.overall} />

      {/* 紹介プロンプト（スコア70点以上で表示） */}
      <ReferralPrompt score={score.overall} />
    </div>
  );
}

/* ── NPS + 自由記述フィードバックフォーム ── */

const NPS_LABELS: Record<number, string> = {
  0: "全く薦めない",
  5: "どちらでもない",
  10: "強く薦める",
};

function FeedbackForm({ roleplayScore }: { roleplayScore: number }) {
  const [nps, setNps] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (submitted) {
    return (
      <div className="fixed bottom-6 left-1/2 z-40 -translate-x-1/2 animate-fade-in-up">
        <div className="rounded-xl border border-green-500/30 bg-green-500/10 px-6 py-3 text-sm font-medium text-green-400 shadow-xl backdrop-blur-md">
          フィードバックありがとうございます！
        </div>
      </div>
    );
  }

  async function handleSubmit() {
    if (nps === null || submitting) return;
    setSubmitting(true);
    try {
      await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          npsScore: nps,
          comment,
          roleplayScore,
        }),
      });
    } catch {
      // Fire-and-forget
    }
    setSubmitted(true);
  }

  return (
    <div className="mt-8 w-full max-w-2xl rounded-2xl border border-card-border bg-card p-6">
      <h3 className="mb-1 text-sm font-bold text-foreground">
        このサービスを友人・同僚に薦める可能性はどのくらいですか？
      </h3>
      <p className="mb-4 text-xs text-muted">
        0（全く薦めない）〜 10（強く薦める）
      </p>

      {/* NPS Buttons */}
      <div className="mb-4 flex justify-between gap-1">
        {Array.from({ length: 11 }, (_, i) => (
          <button
            key={i}
            onClick={() => setNps(i)}
            className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg text-sm font-bold transition ${
              nps === i
                ? i <= 6
                  ? "bg-red-500 text-white"
                  : i <= 8
                  ? "bg-yellow-500 text-white"
                  : "bg-green-500 text-white"
                : "border border-card-border text-muted hover:border-accent hover:text-accent"
            }`}
          >
            {i}
          </button>
        ))}
      </div>

      {/* Labels */}
      <div className="mb-4 flex justify-between text-[10px] text-muted">
        <span>{NPS_LABELS[0]}</span>
        <span>{NPS_LABELS[5]}</span>
        <span>{NPS_LABELS[10]}</span>
      </div>

      {/* Comment */}
      {nps !== null && (
        <div className="animate-fade-in-up">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="改善してほしい点、気に入った点など自由にお書きください（任意）"
            rows={3}
            className="mb-3 w-full resize-none rounded-xl border border-card-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted/50 focus:border-accent focus:outline-none"
          />
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="inline-flex h-10 items-center rounded-lg bg-accent px-6 text-sm font-bold text-white transition hover:bg-accent-hover disabled:opacity-60"
          >
            {submitting ? "送信中..." : "送信する"}
          </button>
        </div>
      )}
    </div>
  );
}

/* ── レビュー投稿プロンプト（70点以上のProユーザーに表示） ── */

function ReviewPrompt({ roleplayScore }: { roleplayScore: number }) {
  const [isOpen, setIsOpen] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [role, setRole] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="mt-6 w-full max-w-2xl rounded-2xl border border-green-500/20 bg-green-500/5 p-6 text-center">
        <p className="text-sm font-bold text-green-400">
          レビューありがとうございます！承認後に料金ページに掲載されます。
        </p>
      </div>
    );
  }

  if (!isOpen) {
    return (
      <div className="mt-6 w-full max-w-2xl rounded-2xl border border-accent/20 bg-accent/5 p-6 text-center">
        <p className="mb-1 text-sm font-bold">
          スコア {roleplayScore} 点を記録しました
        </p>
        <p className="mb-4 text-xs text-muted">
          あなたの声を聞かせてください。料金ページに掲載させていただきます。
        </p>
        <button
          onClick={() => setIsOpen(true)}
          className="inline-flex h-10 items-center rounded-lg border border-accent px-6 text-sm font-bold text-accent transition hover:bg-accent/10"
        >
          レビューを書く
        </button>
      </div>
    );
  }

  async function handleSubmit() {
    if (!displayName.trim() || !reviewText.trim() || submitting) return;
    setSubmitting(true);
    try {
      await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          displayName: displayName.trim(),
          role: role.trim(),
          reviewText: reviewText.trim(),
          roleplayScore,
        }),
      });
    } catch {
      // fire-and-forget
    }
    setSubmitted(true);
  }

  return (
    <div className="mt-6 w-full max-w-2xl rounded-2xl border border-card-border bg-card p-6">
      <h3 className="mb-4 text-sm font-bold">レビューを投稿する</h3>
      <div className="space-y-3">
        <div>
          <label className="mb-1 block text-xs text-muted">表示名（イニシャルOK）</label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="例: T.S."
            maxLength={20}
            className="w-full rounded-lg border border-card-border bg-background px-4 py-2.5 text-sm placeholder:text-muted/50 focus:border-accent focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-muted">役職・業種（任意）</label>
          <input
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="例: 不動産営業 / 入社3年目"
            maxLength={40}
            className="w-full rounded-lg border border-card-border bg-background px-4 py-2.5 text-sm placeholder:text-muted/50 focus:border-accent focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-muted">レビュー内容</label>
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="成約コーチAIを使ってみた感想をお聞かせください"
            rows={3}
            maxLength={200}
            className="w-full resize-none rounded-lg border border-card-border bg-background px-4 py-2.5 text-sm placeholder:text-muted/50 focus:border-accent focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleSubmit}
            disabled={!displayName.trim() || !reviewText.trim() || submitting}
            className="inline-flex h-10 items-center rounded-lg bg-accent px-6 text-sm font-bold text-white transition hover:bg-accent-hover disabled:opacity-60"
          >
            {submitting ? "送信中..." : "投稿する"}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="text-xs text-muted transition hover:text-foreground"
          >
            キャンセル
          </button>
        </div>
      </div>
      <p className="mt-3 text-[11px] text-muted">
        ※ 掲載前に管理者が確認します。スコア {roleplayScore} 点と合わせて表示されます。
      </p>
    </div>
  );
}
