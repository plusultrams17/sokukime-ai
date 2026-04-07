"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChatUI } from "@/app/roleplay/chat-ui";
import { createClient } from "@/lib/supabase/client";
import { getPracticeDefaults } from "@/lib/lessons/practice-defaults";
import {
  loadPracticeProfile,
  savePracticeProfile,
  clearPracticeProfile,
} from "@/lib/practice-profile";
import type { PracticeProfile } from "@/lib/practice-profile";
import type { Lesson } from "@/lib/lessons/types";
import type { ScoreResult } from "@/lib/scoring";
import { getAdjacentLessons } from "@/lib/lessons";
import { LESSON_FOCUS_MAP } from "@/lib/lessons/focus-instructions";

type Phase = "ready" | "chat" | "score";

interface LessonPracticeProps {
  slug: string;
  lesson: Lesson;
  color: string;
  practiceHighlight: boolean;
}

const SCENE_OPTIONS = [
  { value: "visit", label: "訪問営業" },
  { value: "phone", label: "電話営業" },
  { value: "inbound", label: "問い合わせ対応" },
] as const;

const CUSTOMER_TYPE_OPTIONS = [
  { value: "individual", label: "個人" },
  { value: "owner", label: "社長・オーナー" },
  { value: "manager", label: "部長・課長" },
  { value: "staff", label: "担当者" },
] as const;

const DIFFICULTY_OPTIONS = [
  { value: "friendly", label: "やさしい", desc: "友好的で前向き", color: "bg-green-100 text-green-700 border-green-300" },
  { value: "talkative", label: "やさしい", desc: "おしゃべり好き", color: "bg-green-100 text-green-700 border-green-300" },
  { value: "cautious", label: "ふつう", desc: "慎重で比較検討する", color: "bg-yellow-100 text-yellow-700 border-yellow-300" },
  { value: "silent", label: "ふつう", desc: "無口で反応薄い", color: "bg-yellow-100 text-yellow-700 border-yellow-300" },
  { value: "low-energy", label: "ふつう", desc: "面倒くさがり", color: "bg-yellow-100 text-yellow-700 border-yellow-300" },
  { value: "skeptical", label: "むずかしい", desc: "疑り深く警戒心が強い", color: "bg-red-100 text-red-700 border-red-300" },
  { value: "aggressive", label: "むずかしい", desc: "押しが強く値引き要求", color: "bg-red-100 text-red-700 border-red-300" },
] as const;

function getDifficultyLabel(value: string): string {
  const opt = DIFFICULTY_OPTIONS.find((o) => o.value === value);
  if (opt) return `${opt.label}（${opt.desc}）`;
  if (value === "friendly") return "やさしい";
  if (value === "cautious") return "ふつう";
  if (value === "skeptical") return "むずかしい";
  return value;
}

function getDifficultyBadgeColor(value: string): string {
  const opt = DIFFICULTY_OPTIONS.find((o) => o.value === value);
  return opt?.color || "bg-gray-100 text-gray-700 border-gray-300";
}

function getRank(score: number): string {
  if (score >= 90) return "S";
  if (score >= 80) return "A";
  if (score >= 70) return "B";
  if (score >= 60) return "C";
  if (score >= 40) return "D";
  return "E";
}

function getScoreColor(score: number): string {
  if (score >= 80) return "text-green-600";
  if (score >= 60) return "text-yellow-600";
  if (score >= 40) return "text-orange-500";
  return "text-red-500";
}

export function LessonPractice({ slug, lesson, color, practiceHighlight }: LessonPracticeProps) {
  const [phase, setPhase] = useState<Phase>("ready");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [score, setScore] = useState<ScoreResult | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [usingProfile, setUsingProfile] = useState(false);

  const lessonDefaults = getPracticeDefaults(slug, lesson.level);

  // Editable settings state
  const [product, setProduct] = useState(lessonDefaults.product);
  const [productDetail, setProductDetail] = useState("");
  const [industry, setIndustry] = useState(lessonDefaults.industry);
  const [scene, setScene] = useState(lessonDefaults.scene);
  const [customerType, setCustomerType] = useState(lessonDefaults.customerType);
  const [difficulty, setDifficulty] = useState(lessonDefaults.difficulty);

  // Load saved profile on mount
  useEffect(() => {
    const profile = loadPracticeProfile();
    if (profile) {
      setProduct(profile.product);
      setProductDetail(profile.productDetail || "");
      setIndustry(profile.industry);
      setScene(profile.scene);
      setCustomerType(profile.customerType);
      setDifficulty(profile.difficulty);
      setUsingProfile(true);
    }
  }, []);

  // Check auth state
  useEffect(() => {
    const supabase = createClient();
    if (!supabase) {
      setAuthChecked(true);
      return;
    }
    supabase.auth.getUser().then(({ data: { user } }) => {
      setIsLoggedIn(!!user);
      setAuthChecked(true);
    });
  }, []);

  // Reset when slug changes
  useEffect(() => {
    setPhase("ready");
    setScore(null);
    setIsEditing(false);
  }, [slug]);

  function handleSaveProfile() {
    const profile: PracticeProfile = {
      product,
      productDetail,
      industry,
      scene,
      customerType,
      difficulty,
      updatedAt: new Date().toISOString(),
    };
    savePracticeProfile(profile);
    setUsingProfile(true);
    setIsEditing(false);
  }

  function handleResetToDefaults() {
    clearPracticeProfile();
    setProduct(lessonDefaults.product);
    setProductDetail("");
    setIndustry(lessonDefaults.industry);
    setScene(lessonDefaults.scene);
    setCustomerType(lessonDefaults.customerType);
    setDifficulty(lessonDefaults.difficulty);
    setUsingProfile(false);
    setIsEditing(false);
  }

  // Build productContext: user's product detail info only
  const fullProductContext = productDetail || undefined;

  // Build lessonFocus: lesson-specific AI customer behavior + scoring hint
  const focus = LESSON_FOCUS_MAP[slug];
  const lessonFocus = focus ? focus.customerBehavior : undefined;
  const scoringHint = focus ? focus.scoringHint : undefined;

  const chatEndpoint = isLoggedIn ? "/api/chat" : "/api/chat/guest";
  const scoreEndpoint = isLoggedIn ? "/api/score" : "/api/score/guest";

  const sceneLabel = scene === "phone" ? "電話営業" : scene === "visit" ? "訪問営業" : "問い合わせ対応";
  const customerTypeLabel = CUSTOMER_TYPE_OPTIONS.find((o) => o.value === customerType)?.label || customerType;

  // ── Ready phase ──
  if (phase === "ready") {
    return (
      <div>
        {/* Learning point reminder */}
        {lesson.objectives && lesson.objectives.length > 0 && (
          <div
            className={`mb-8 rounded-xl border p-5 ${
              practiceHighlight
                ? "border-accent/40 bg-accent/5"
                : "border-gray-200 bg-gray-50"
            }`}
          >
            <p className="text-sm font-bold text-foreground mb-3">
              このレッスンの学習ポイント
            </p>
            <ul className="space-y-1.5">
              {lesson.objectives.map((obj, i) => (
                <li key={i} className="text-sm text-muted leading-relaxed flex items-start gap-2">
                  <svg className="w-4 h-4 text-accent mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {obj}
                </li>
              ))}
            </ul>
          </div>
        )}

        <h2 className="text-lg font-bold text-foreground mb-3">
          実践練習のテーマ
        </h2>
        <p className="text-muted leading-relaxed mb-8 text-base">
          {lesson.practicePrompt}
        </p>

        {/* Scenario settings — editable */}
        <div className="mb-6 rounded-xl border border-gray-200 bg-gray-50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
              <span className="text-xs font-bold text-gray-600 uppercase tracking-wide">ロープレ設定</span>
              {usingProfile && (
                <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-bold text-accent">
                  マイ設定
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={() => setIsEditing(!isEditing)}
              className="text-xs font-bold text-accent hover:underline"
            >
              {isEditing ? "閉じる" : "設定を変更"}
            </button>
          </div>

          {isEditing ? (
            /* ── Editing mode ── */
            <div className="p-4 space-y-4">
              {/* Product */}
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">
                  商材・サービス
                </label>
                <p className="text-[11px] text-gray-400 mb-1.5">
                  「外壁塗装」「生命保険」などざっくりでOK
                </p>
                <input
                  type="text"
                  value={product}
                  onChange={(e) => setProduct(e.target.value)}
                  placeholder="例：外壁塗装、法人向けSaaS、生命保険..."
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-foreground outline-none focus:border-accent focus:ring-1 focus:ring-accent/30"
                />
              </div>

              {/* Product detail — optional */}
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">
                  商材の詳細
                  <span className="ml-1 font-normal text-gray-400">（任意）</span>
                </label>
                <p className="text-[11px] text-gray-400 mb-1.5">
                  価格・特徴・強みなどを入れると、お客さん役がより具体的な質問や反論をしてきます
                </p>
                <textarea
                  value={productDetail}
                  onChange={(e) => setProductDetail(e.target.value)}
                  placeholder={"例：シリコン系塗料、耐用15年、60〜80万円\n競合より長寿命でアフター保証5年付き"}
                  rows={3}
                  className="w-full resize-none rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-foreground outline-none placeholder:text-gray-400 focus:border-accent focus:ring-1 focus:ring-accent/30"
                />
              </div>

              {/* Industry / Customer */}
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">
                  相手（お客さんの業種・属性）
                </label>
                <p className="text-[11px] text-gray-400 mb-1.5">
                  「戸建てオーナー」「中小企業の社長」などざっくりでOK
                </p>
                <input
                  type="text"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  placeholder="例：戸建て住宅オーナー、中小企業の社長..."
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-foreground outline-none focus:border-accent focus:ring-1 focus:ring-accent/30"
                />
              </div>

              {/* Scene */}
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5">
                  シーン
                </label>
                <div className="flex flex-wrap gap-2">
                  {SCENE_OPTIONS.map((s) => (
                    <button
                      key={s.value}
                      type="button"
                      onClick={() => setScene(s.value)}
                      className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${
                        scene === s.value
                          ? "border-accent bg-accent/10 text-accent"
                          : "border-gray-300 bg-white text-gray-600 hover:border-gray-400"
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Customer Type */}
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5">
                  お客さんの立場
                </label>
                <div className="flex flex-wrap gap-2">
                  {CUSTOMER_TYPE_OPTIONS.map((ct) => (
                    <button
                      key={ct.value}
                      type="button"
                      onClick={() => setCustomerType(ct.value)}
                      className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${
                        customerType === ct.value
                          ? "border-accent bg-accent/10 text-accent"
                          : "border-gray-300 bg-white text-gray-600 hover:border-gray-400"
                      }`}
                    >
                      {ct.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Difficulty / Persona */}
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5">
                  お客さんのタイプ
                </label>
                <div className="grid grid-cols-1 gap-1.5">
                  {DIFFICULTY_OPTIONS.map((d) => (
                    <button
                      key={d.value}
                      type="button"
                      onClick={() => setDifficulty(d.value)}
                      className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm transition ${
                        difficulty === d.value
                          ? "border-accent bg-accent/5 ring-1 ring-accent/30"
                          : "border-gray-200 bg-white hover:border-gray-300"
                      }`}
                    >
                      <span className={`inline-block rounded-full border px-2 py-0.5 text-[10px] font-bold ${d.color}`}>
                        {d.label}
                      </span>
                      <span className={`text-sm ${difficulty === d.value ? "font-bold text-foreground" : "text-gray-600"}`}>
                        {d.desc}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleSaveProfile}
                  disabled={!product.trim() || !industry.trim()}
                  className="flex h-10 items-center justify-center rounded-lg bg-accent text-sm font-bold text-white transition hover:opacity-90 disabled:opacity-40"
                >
                  この設定を保存して全レッスンで使う
                </button>
                {usingProfile && (
                  <button
                    type="button"
                    onClick={handleResetToDefaults}
                    className="text-xs font-medium text-gray-500 hover:text-gray-700 transition"
                  >
                    レッスンのデフォルト設定に戻す
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* ── Display mode ── */
            <div className="p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-start gap-2">
                  <span className="text-xs text-gray-500 shrink-0 pt-0.5 w-10">商材</span>
                  <div>
                    <span className="text-sm font-medium text-foreground">{product}</span>
                    {productDetail && (
                      <p className="text-[11px] text-gray-400 mt-0.5 line-clamp-2">{productDetail}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-xs text-gray-500 shrink-0 pt-0.5 w-10">相手</span>
                  <span className="text-sm font-medium text-foreground">{industry}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-xs text-gray-500 shrink-0 pt-0.5 w-10">シーン</span>
                  <span className="text-sm font-medium text-foreground">{sceneLabel}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-xs text-gray-500 shrink-0 pt-0.5 w-10">難易度</span>
                  <span className={`inline-block rounded-full border px-2 py-0.5 text-xs font-bold ${getDifficultyBadgeColor(difficulty)}`}>
                    {getDifficultyLabel(difficulty)}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-3">
                <span className="text-xs text-gray-500 shrink-0 pt-0.5 w-10">立場</span>
                <span className="text-sm font-medium text-foreground">{customerTypeLabel}</span>
              </div>
            </div>
          )}
        </div>

        {/* Start button */}
        <div className="rounded-xl border border-accent/20 bg-accent/5 p-5 text-center">
          <p className="text-sm font-bold text-accent mb-1">学んだらすぐ実践</p>
          <p className="text-xs text-muted mb-4">
            レッスンで学んだテクニックをAIロープレで実践練習できます。
            {usingProfile && "（マイ設定で練習します）"}
          </p>
          <button
            onClick={() => setPhase("chat")}
            disabled={!authChecked || !product.trim() || !industry.trim()}
            className="inline-flex h-12 items-center justify-center rounded-xl px-8 text-sm font-bold text-white transition hover:opacity-90 disabled:opacity-60"
            style={{ backgroundColor: color }}
          >
            {authChecked ? "ロープレを始める" : "読み込み中..."}
          </button>
        </div>

        {/* Worksheet link */}
        <div className="mt-4 border-t border-gray-200 pt-4">
          <Link
            href="/worksheet"
            className="flex items-center justify-between py-3 border-b border-gray-100 group"
          >
            <div>
              <p className="text-sm font-bold text-foreground group-hover:underline">
                ワークシートで準備する
              </p>
              <p className="text-xs text-muted mt-0.5">
                商談準備を体系的に行う
              </p>
            </div>
            <svg
              className="w-4 h-4 text-gray-300 group-hover:text-foreground transition shrink-0"
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
      </div>
    );
  }

  // ── Chat phase — fullscreen overlay ──
  if (phase === "chat") {
    return (
      <div className="fixed inset-0 z-50 flex flex-col bg-white">
        {/* Mini header */}
        <div className="flex h-12 shrink-0 items-center justify-between border-b border-gray-200 px-4">
          <span className="text-sm font-bold text-foreground truncate mr-4">
            Lesson {lesson.order}: {lesson.title}
          </span>
          <button
            type="button"
            onClick={() => setPhase("ready")}
            className="flex shrink-0 items-center gap-1 rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-bold text-gray-600 transition hover:bg-gray-50"
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
            終了
          </button>
        </div>
        {/* ChatUI fills remaining space */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <ChatUI
            industry={industry}
            product={product}
            difficulty={difficulty}
            scene={scene}
            customerType={customerType}
            productContext={fullProductContext}
            lessonFocus={lessonFocus}
            scoringFocus={scoringHint}
            chatEndpoint={chatEndpoint}
            scoreEndpoint={scoreEndpoint}
            lessonSlug={slug}
            onFinish={(result) => {
              setScore(result);
              setPhase("score");
            }}
          />
        </div>
      </div>
    );
  }

  // ── Score phase ──
  return (
    <div className="py-4">
      {/* Score header */}
      <div className="text-center mb-8">
        <p className="text-xs text-muted mb-1">あなたの営業スコア</p>
        <div className="flex items-center justify-center gap-2">
          <span className={`text-6xl font-black ${getScoreColor(score?.overall ?? 0)}`}>
            {score?.overall ?? 0}
          </span>
          <span className="text-2xl font-black text-muted/30">/ 100</span>
        </div>
        <div className="mt-1 text-sm font-bold text-muted">
          ランク: {getRank(score?.overall ?? 0)}
        </div>
      </div>

      {/* Practice context reminder */}
      <div className="mb-6 rounded-lg border border-card-border bg-card px-4 py-3">
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
          <span>{product} / {industry}</span>
          <span>{sceneLabel}</span>
          <span className={`rounded-full border px-1.5 py-0.5 text-[10px] font-bold ${getDifficultyBadgeColor(difficulty)}`}>
            {getDifficultyLabel(difficulty)}
          </span>
        </div>
      </div>

      {/* Summary */}
      {score?.summary && (
        <div className="mb-6 rounded-xl border border-card-border bg-card p-5">
          <p className="text-sm leading-relaxed text-muted">{score.summary}</p>
        </div>
      )}

      {/* Strengths & Improvements */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {score?.strengths && score.strengths.length > 0 && (
          <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-4">
            <p className="text-xs font-bold text-green-500 mb-2">良かった点</p>
            <ul className="space-y-1">
              {score.strengths.map((s, i) => (
                <li key={i} className="text-sm text-foreground flex items-start gap-1.5">
                  <svg className="w-3.5 h-3.5 text-green-500 mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  {s}
                </li>
              ))}
            </ul>
          </div>
        )}
        {score?.improvements && score.improvements.length > 0 && (
          <div className="rounded-xl border border-accent/20 bg-accent/5 p-4">
            <p className="text-xs font-bold text-accent mb-2">改善ポイント</p>
            <ul className="space-y-1">
              {score.improvements.map((s, i) => (
                <li key={i} className="text-sm text-foreground flex items-start gap-1.5">
                  <svg className="w-3.5 h-3.5 text-accent mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 9v4m0 4h.01"/><circle cx="12" cy="12" r="10"/></svg>
                  {s}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="space-y-3 text-center">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => {
              setScore(null);
              setPhase("ready");
            }}
            className="inline-flex h-12 items-center justify-center rounded-xl px-8 text-sm font-bold text-white transition hover:opacity-90"
            style={{ backgroundColor: color }}
          >
            もう一度練習する
          </button>
          {(() => {
            const { next } = getAdjacentLessons(slug);
            return next ? (
              <Link
                href={`/learn/${next.slug}`}
                className="inline-flex h-12 items-center justify-center rounded-xl border-2 border-accent/30 px-8 text-sm font-bold text-accent transition hover:bg-accent/5"
              >
                次のレッスンへ →
              </Link>
            ) : null;
          })()}
        </div>

        {!isLoggedIn && (
          <div className="mt-4 rounded-xl border border-accent/20 bg-accent/5 p-4">
            <p className="text-xs text-muted mb-2">
              ログインするとスコア履歴を保存できます
            </p>
            <Link
              href="/login?redirect=/learn"
              className="text-sm font-bold text-accent hover:underline"
            >
              Googleで無料ログイン →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
