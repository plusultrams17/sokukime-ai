"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface ChecklistStep {
  id: string;
  label: string;
  description: string;
  href: string;
  cta: string;
}

const STEPS: ChecklistStep[] = [
  {
    id: "first_roleplay",
    label: "初回ロープレを完了",
    description: "AIとの営業ロープレを1回体験しよう",
    href: "/roleplay",
    cta: "ロープレを始める",
  },
  {
    id: "check_score",
    label: "スコアを確認",
    description: "あなたの営業力をスコアで可視化",
    href: "/dashboard",
    cta: "スコアを見る",
  },
  {
    id: "weakness_practice",
    label: "弱点を練習",
    description: "改善カテゴリを重点的にトレーニング",
    href: "/roleplay",
    cta: "練習する",
  },
  {
    id: "check_dashboard",
    label: "ダッシュボードを確認",
    description: "成長の推移を確認しよう",
    href: "/dashboard",
    cta: "確認する",
  },
];

const STORAGE_KEY = "onboarding_checklist_progress";
const DISMISSED_KEY = "onboarding_checklist_dismissed";

function getStoredProgress(): Record<string, boolean> {
  if (typeof window === "undefined") return {};
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

function saveProgress(progress: Record<string, boolean>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // localStorage unavailable
  }
}

export interface OnboardingData {
  totalSessions: number;
  totalScored: number;
  weakestCategory: { name: string; score: number } | null;
}

/**
 * Derive auto-completed steps from dashboard data.
 * Merges with manually-checked steps from localStorage.
 */
function deriveProgress(data: OnboardingData, stored: Record<string, boolean>): Record<string, boolean> {
  return {
    first_roleplay: stored.first_roleplay || data.totalSessions >= 1,
    check_score: stored.check_score || data.totalScored >= 1,
    weakness_practice: stored.weakness_practice || data.totalSessions >= 2,
    // Auto-check "check_dashboard" since user is viewing it right now
    check_dashboard: stored.check_dashboard || data.totalSessions >= 1,
  };
}

export function OnboardingChecklist({ data }: { data: OnboardingData }) {
  const [progress, setProgress] = useState<Record<string, boolean>>({});
  const [dismissed, setDismissed] = useState(false);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(DISMISSED_KEY) === "true") {
      setDismissed(true);
      setInitialized(true);
      return;
    }

    const stored = getStoredProgress();
    const derived = deriveProgress(data, stored);

    // Persist auto-detected progress
    saveProgress(derived);
    setProgress(derived);
    setInitialized(true);
  }, [data]);

  const completedCount = STEPS.filter((s) => progress[s.id]).length;
  const allComplete = completedCount === STEPS.length;

  // Auto-dismiss when all complete
  useEffect(() => {
    if (allComplete && initialized) {
      localStorage.setItem(DISMISSED_KEY, "true");
    }
  }, [allComplete, initialized]);

  if (!initialized || dismissed || allComplete) return null;

  function toggleStep(stepId: string) {
    const newProgress = { ...progress, [stepId]: !progress[stepId] };
    setProgress(newProgress);
    saveProgress(newProgress);
  }

  function handleDismiss() {
    setDismissed(true);
    localStorage.setItem(DISMISSED_KEY, "true");
  }

  const progressPercent = Math.round((completedCount / STEPS.length) * 100);

  return (
    <div className="mb-6 rounded-xl border border-accent/20 bg-gradient-to-br from-accent/5 to-transparent p-5">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold">はじめてガイド</h3>
          <p className="text-xs text-muted">
            {completedCount}/{STEPS.length} 完了
          </p>
        </div>
        <button
          onClick={handleDismiss}
          className="text-xs text-muted transition hover:text-foreground"
          aria-label="閉じる"
        >
          非表示
        </button>
      </div>

      {/* Progress bar */}
      <div className="mb-4 h-2 overflow-hidden rounded-full bg-card-border">
        <div
          className="h-full rounded-full bg-accent transition-all duration-500"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="space-y-2">
        {STEPS.map((step, i) => {
          const done = progress[step.id];
          return (
            <div
              key={step.id}
              className={`flex items-center gap-3 rounded-lg border p-3 transition ${
                done
                  ? "border-green-500/20 bg-green-500/5"
                  : "border-card-border bg-card"
              }`}
            >
              <button
                onClick={() => toggleStep(step.id)}
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition ${
                  done
                    ? "border-green-500 bg-green-500 text-white"
                    : "border-card-border hover:border-accent"
                }`}
                aria-label={done ? "完了を取り消す" : "完了にする"}
              >
                {done && (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </button>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${done ? "text-muted line-through" : "text-foreground"}`}>
                  {i + 1}. {step.label}
                </p>
                <p className="text-xs text-muted">{step.description}</p>
              </div>
              {!done && (
                <Link
                  href={step.href}
                  className="shrink-0 rounded-lg bg-accent/10 px-3 py-1.5 text-xs font-bold text-accent transition hover:bg-accent/20"
                >
                  {step.cta}
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
