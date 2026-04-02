"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { RadarChart } from "@/components/radar-chart";
import { ReferralPrompt } from "@/components/referral-prompt";
import type { ScoreResult } from "./page";
import { trackCTAClick, trackUpgradePromptShown, trackUpgradePromptClicked, trackScoreShared } from "@/lib/tracking";

interface ScoreCardProps {
  score: ScoreResult & { scoreId?: string | null; previousScore?: number | null };
  onRetry: () => void;
  plan?: "free" | "pro";
  onUpgrade?: () => void;
}

function getScoreColor(score: number) {
  if (score >= 80) return "text-green-600";
  if (score >= 60) return "text-yellow-600";
  if (score >= 40) return "text-orange-500";
  return "text-red-500";
}

function getScoreBarColor(score: number) {
  if (score >= 80) return "bg-green-500";
  if (score >= 60) return "bg-yellow-500";
  if (score >= 40) return "bg-orange-400";
  return "bg-red-400";
}

function getGrade(score: number) {
  if (score >= 90) return "S";
  if (score >= 80) return "A";
  if (score >= 70) return "B";
  if (score >= 60) return "C";
  if (score >= 40) return "D";
  return "E";
}

// Number of categories visible to free users
const FREE_VISIBLE_CATEGORIES = 1;

/** Map scoring categories to learn page course levels */
const CATEGORY_LEARN_LINK: Record<string, { href: string; label: string }> = {
  "アプローチ": { href: "/learn#beginner", label: "初級コースで復習" },
  "ヒアリング": { href: "/learn#beginner", label: "初級コースで復習" },
  "プレゼン": { href: "/learn#beginner", label: "初級コースで復習" },
  "クロージング": { href: "/learn#intermediate", label: "中級コースで復習" },
  "反論処理": { href: "/learn#advanced", label: "上級コースで復習" },
};

export function ScoreCard({ score, onRetry, plan, onUpgrade }: ScoreCardProps) {
  // Use score-specific share page if scoreId is available (shows OG image with actual score)
  const scorePageUrl = score.scoreId
    ? `https://seiyaku-coach.com/score-share/${score.scoreId}`
    : "https://seiyaku-coach.com";

  const shareText = `成約コーチ AIで営業ロープレしたらスコア${score.overall}点（ランク${getGrade(score.overall)}）だった。AIコーチのフィードバックが的確すぎる… #成約コーチAI #営業 #営業ロープレ`;
  const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(scorePageUrl)}`;
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

  return (
    <div className="flex flex-1 items-start justify-center overflow-y-auto px-4 py-12">
      <div className="w-full max-w-2xl animate-fade-in-up">
        {/* Score Improvement Celebration */}
        {score.previousScore != null && score.overall > score.previousScore && (
          <div className="mb-4 rounded-2xl border border-green-500/20 bg-green-500/5 px-5 py-4 text-center animate-fade-in-up">
            <div className="text-2xl mb-1">📈</div>
            <div className="text-sm font-bold text-green-500">
              +{score.overall - score.previousScore}点アップ！前回 {score.previousScore}点 → 今回 {score.overall}点
            </div>
            <div className="text-xs text-muted mt-1">
              練習の成果が出ています。この調子で続けましょう！
            </div>
          </div>
        )}

        {/* Overall Score */}
        <div className="mb-8 rounded-2xl border border-card-border bg-card p-8 text-center">
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

        {/* Radar Chart */}
        <div className="mb-8 rounded-2xl border border-card-border bg-card p-6">
          <h3 className="mb-4 text-sm font-medium text-muted">5ステップ分析</h3>
          <RadarChart categories={score.categories} size={220} />
        </div>

        {/* Category Scores - visible */}
        <div className="mb-4 rounded-2xl border border-card-border bg-card p-6">
          <h3 className="mb-4 text-sm font-medium text-muted">カテゴリ別スコア</h3>
          <div className="space-y-4">
            {visibleCategories.map((cat) => (
              <div key={cat.name}>
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
                {cat.score < 60 && CATEGORY_LEARN_LINK[cat.name] && (
                  <Link
                    href={CATEGORY_LEARN_LINK[cat.name].href}
                    className="mt-1 inline-block text-xs text-accent hover:underline"
                  >
                    {CATEGORY_LEARN_LINK[cat.name].label} →
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Locked Categories for Free users — blurred but visible scores */}
        {isFree && lockedCategories.length > 0 && (
          <div
            className="relative mb-8 cursor-pointer group"
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

              {/* Tap-to-unlock overlay */}
              <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-background/40 transition group-hover:bg-background/50">
                <div className="text-center">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-xl">
                    🔒
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

        {/* If Pro, show the rest of the categories in the same card flow */}
        {!isFree && (
          <div className="mb-4 h-0" /> /* spacer for consistent layout */
        )}

        {/* Summary / AI Advice — show preview for free */}
        {isFree ? (
          <div
            className="relative mb-8 cursor-pointer group"
            onClick={() => handleLockedClick("ai_advice_preview")}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") handleLockedClick("ai_advice_preview"); }}
          >
            <div className="rounded-2xl border border-card-border bg-card p-6 select-none">
              <h3 className="mb-3 text-sm font-medium text-muted">AI改善アドバイス</h3>
              {/* Show first 1-2 lines of summary as preview */}
              {score.summary && (
                <p className="text-sm leading-relaxed mb-2">
                  {score.summary.split("。").slice(0, 2).join("。")}。
                </p>
              )}
              {/* Blurred remainder */}
              <div className="blur-[6px] pointer-events-none" aria-hidden>
                <p className="text-sm leading-relaxed text-muted">
                  {score.summary && score.summary.split("。").slice(2).join("。")}
                  具体的な改善ステップとして、まずヒアリングでの深掘り質問を増やし、お客さんの本当の悩みを引き出すことで、プレゼンの説得力が大幅に向上します。
                </p>
              </div>
              <div className="absolute inset-x-0 bottom-0 h-24 flex items-end justify-center rounded-b-2xl bg-gradient-to-t from-card via-card/80 to-transparent pb-4">
                <span className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-bold text-white transition group-hover:bg-accent-hover">
                  🔓 続きを読む（Proプラン）
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-8 rounded-2xl border border-card-border bg-card p-6">
            <h3 className="mb-3 text-sm font-medium text-muted">総評</h3>
            <p className="text-sm leading-relaxed">{score.summary}</p>
          </div>
        )}

        {/* Strengths & Improvements - blurred preview for free */}
        {isFree ? (
          <div
            className="relative mb-8 cursor-pointer group"
            onClick={() => handleLockedClick("strengths_improvements")}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") handleLockedClick("strengths_improvements"); }}
          >
            <div className="grid gap-4 sm:grid-cols-2 select-none">
              <div className="rounded-2xl border border-card-border bg-card p-6">
                <h3 className="mb-3 text-sm font-medium text-green-600">💪 良かった点</h3>
                {/* Show first item visible, rest blurred */}
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
                <h3 className="mb-3 text-sm font-medium text-accent">📈 改善ポイント</h3>
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
                🔒 タップしてProプランで詳細フィードバックを見る
              </span>
            </div>
          </div>
        ) : (
          <div className="mb-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-card-border bg-card p-6">
              <h3 className="mb-3 text-sm font-medium text-green-600">💪 良かった点</h3>
              <ul className="space-y-2">
                {score.strengths.map((s, i) => (
                  <li key={i} className="text-sm leading-relaxed text-muted">
                    ・{s}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-card-border bg-card p-6">
              <h3 className="mb-3 text-sm font-medium text-accent">📈 改善ポイント</h3>
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

        {/* Session Summary — Peak-End Rule: end positively (Kahneman 1993) */}
        {visibleCategories.length > 0 && (
          <div className="mb-6 rounded-2xl border border-card-border bg-card p-5">
            <p className="mb-2 text-sm font-bold">今回のセッションまとめ</p>
            <div className="flex items-start gap-3 mb-2">
              <span className="text-green-500 mt-0.5">💪</span>
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

        {/* Actions */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            onClick={() => {
              trackCTAClick("scorecard_retry", "score_card", "/roleplay");
              onRetry();
            }}
            className="flex h-12 flex-1 items-center justify-center rounded-xl bg-accent text-base font-bold text-white transition hover:bg-accent-hover"
          >
            もう一度ロープレする
          </button>
          <Link
            href="/learn"
            className="flex h-12 flex-1 items-center justify-center rounded-xl border border-card-border text-sm text-muted transition hover:text-foreground"
          >
            営業の型を復習する
          </Link>
        </div>

        {/* Share buttons — prominent placement drives organic growth */}
        <div className="mt-6 rounded-2xl border border-card-border bg-card p-5 text-center">
          <p className="mb-1 text-sm font-bold">スコアを同僚にシェアしよう</p>
          <p className="mb-3 text-xs text-muted">一緒に練習する仲間がいると、スコアの伸びが加速します</p>
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

        {/* Upgrade CTA for free users - bottom */}
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
              7日間無料で全機能を試す
            </button>
            <p className="mt-2 text-[11px] text-muted">
              7日間完全無料 → ¥2,980/月・いつでも解約OK
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
          スコア {roleplayScore} 点、お見事です！
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
            placeholder="成約コーチ AIを使ってみた感想をお聞かせください"
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
