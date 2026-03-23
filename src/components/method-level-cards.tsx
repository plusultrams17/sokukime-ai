"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getLessonsByLevel } from "@/lib/lessons";

interface Progress {
  completedLessons: string[];
  quizScores: Record<string, number>;
}

const LEVELS = [
  {
    key: "beginner" as const,
    label: "初級",
    subtitle: "アプローチ・ヒアリング・プレゼン",
    description:
      "信頼構築から価値提案までの基礎技術を学びます。営業の土台となるマインドセット、褒める技術、前提設定、伝え方の法則、ニーズ発掘、利点話法を習得します。",
    color: "#0F6E56",
    bg: "rgba(15,110,86,0.08)",
    borderHover: "rgba(15,110,86,0.4)",
  },
  {
    key: "intermediate" as const,
    label: "中級",
    subtitle: "クロージング",
    description:
      "お客様の決断を後押しするクロージング技術を学びます。社会的証明、一貫性の活用、第三者話法、ポジティブ/ネガティブクロージング、欲求パターンを習得します。",
    color: "#2563EB",
    bg: "rgba(37,99,235,0.08)",
    borderHover: "rgba(37,99,235,0.4)",
  },
  {
    key: "advanced" as const,
    label: "上級",
    subtitle: "反論処理・切り返し",
    description:
      "「考えたい」「高い」等の反論に対する切り返し技術を学びます。共感→フック→AREA話法の型、5つの切り返し技法を実践的に習得します。",
    color: "#7C3AED",
    bg: "rgba(124,58,237,0.08)",
    borderHover: "rgba(124,58,237,0.4)",
  },
];

function getProgress(): Progress {
  if (typeof window === "undefined")
    return { completedLessons: [], quizScores: {} };
  try {
    const raw = localStorage.getItem("seiyaku-learn-progress");
    if (raw) return JSON.parse(raw);
  } catch {}
  return { completedLessons: [], quizScores: {} };
}

export function MethodLevelCards() {
  const [progress, setProgress] = useState<Progress>({
    completedLessons: [],
    quizScores: {},
  });

  useEffect(() => {
    setProgress(getProgress());
  }, []);

  return (
    <div className="mx-auto max-w-5xl px-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
      {LEVELS.map((level) => {
        const lessons = getLessonsByLevel(level.key);
        const completedCount = lessons.filter((l) =>
          progress.completedLessons.includes(l.slug),
        ).length;
        const total = lessons.length;
        const pct = total > 0 ? Math.round((completedCount / total) * 100) : 0;

        return (
          <Link
            key={level.key}
            href={`/learn#${level.key}`}
            className="method-level-card group"
            style={
              {
                "--level-color": level.color,
                "--level-bg": level.bg,
                "--level-border-hover": level.borderHover,
              } as React.CSSProperties
            }
          >
            {/* Top accent line */}
            <div
              className="method-level-card__accent"
              style={{ backgroundColor: level.color }}
            />

            {/* Header row */}
            <div className="flex items-center justify-between mb-3">
              <span
                className="method-level-card__badge"
                style={{ backgroundColor: level.color }}
              >
                {level.label}
              </span>
              <span className="text-xs text-muted">
                {completedCount}/{total} 完了
              </span>
            </div>

            {/* Progress bar */}
            <div className="h-1.5 rounded-full bg-gray-100 mb-4 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${pct}%`, backgroundColor: level.color }}
              />
            </div>

            {/* Content */}
            <h3 className="text-base font-bold text-foreground mb-1">
              {level.subtitle}
            </h3>
            <p className="text-xs text-muted leading-relaxed line-clamp-3">
              {level.description}
            </p>

            {/* Arrow */}
            <div className="mt-4 flex items-center gap-1 text-xs font-semibold transition-colors" style={{ color: level.color }}>
              学習を始める
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-transform group-hover:translate-x-1"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
