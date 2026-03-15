"use client";

import { useState, useEffect, useCallback } from "react";
import { WORKSHEET_PHASES } from "@/lib/pdf/worksheet-fields";
import { LESSON_WORKSHEET_MAP } from "@/lib/lessons/worksheet-mapping";
import {
  loadCompanyContext,
  hasCompanyContext,
} from "@/lib/company-context";
import {
  loadTargetContext,
  hasTargetContext,
} from "@/lib/target-context";

const STORAGE_KEY = "worksheet-v2-data";

interface InlineWorksheetProps {
  slug: string;
}

/**
 * Inline worksheet block rendered within theory content.
 * Shows worksheet fields in the flow of the lesson, matching the PDF manual structure.
 */
export function InlineWorksheet({ slug }: InlineWorksheetProps) {
  const mapping = LESSON_WORKSHEET_MAP[slug];
  const [data, setData] = useState<Record<string, string>>({});
  const [isHydrated, setIsHydrated] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.phaseData && mapping) {
          setData(parsed.phaseData[mapping.phaseIndex] || {});
        }
      }
    } catch {
      // ignore
    }
    setIsHydrated(true);
  }, [mapping]);

  useEffect(() => {
    if (!isHydrated || !mapping) return;
    const timer = setTimeout(() => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        const parsed = saved
          ? JSON.parse(saved)
          : {
              phaseData: [{}, {}, {}, {}, {}],
              previews: ["", "", "", "", ""],
              industry: "",
            };
        parsed.phaseData[mapping.phaseIndex] = data;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
      } catch {
        // ignore
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [data, isHydrated, mapping]);

  const handleChange = useCallback((key: string, value: string) => {
    setData((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleAIGenerate = useCallback(async () => {
    if (!mapping) return;
    const ctx = loadCompanyContext();
    if (!hasCompanyContext(ctx)) return;

    // Collect only the field keys that belong to THIS lesson's sections
    const phase = WORKSHEET_PHASES[mapping.phaseIndex];
    const allowedKeys = new Set<string>();
    mapping.sections.forEach((sec) => {
      const section = phase.sections[sec.sectionIndex];
      const keys = sec.fieldKeys || section.fields.map((f) => f.key);
      keys.forEach((k) => allowedKeys.add(k));
    });

    const tgt = loadTargetContext();

    setIsGenerating(true);
    try {
      const res = await fetch("/api/worksheet/generate-phase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phase: mapping.phaseIndex,
          industry: ctx.industry || ctx.productName,
          productInfo: {
            productName: ctx.productName,
            targetAudience: ctx.targetAudience,
            keyFeatures: ctx.keyFeatures,
            priceRange: ctx.priceRange,
            advantages: ctx.advantages,
            challenges: ctx.challenges,
          },
          ...(hasTargetContext(tgt) && {
            targetInfo: {
              targetCompanyName: tgt.targetCompanyName,
              targetIndustry: tgt.targetIndustry,
              targetPosition: tgt.targetPosition,
              targetScale: tgt.targetScale,
              targetNeeds: tgt.targetNeeds,
              targetBudget: tgt.targetBudget,
              targetTimeline: tgt.targetTimeline,
            },
          }),
        }),
      });
      if (!res.ok) throw new Error("API error");
      const result = await res.json();
      setData((prev) => {
        const next = { ...prev };
        for (const [key, val] of Object.entries(result)) {
          if (key !== "preview" && typeof val === "string" && allowedKeys.has(key) && !next[key]?.trim()) {
            next[key] = val;
          }
        }
        return next;
      });
    } catch {
      // silently handle
    } finally {
      setIsGenerating(false);
    }
  }, [mapping]);

  if (!mapping || !isHydrated) return null;

  const phase = WORKSHEET_PHASES[mapping.phaseIndex];

  const allFieldKeys: string[] = [];
  mapping.sections.forEach((sec) => {
    const section = phase.sections[sec.sectionIndex];
    const keys = sec.fieldKeys || section.fields.map((f) => f.key);
    allFieldKeys.push(...keys);
  });
  const filled = allFieldKeys.filter((k) => (data[k] || "").trim()).length;
  const total = allFieldKeys.length;

  return (
    <div
      className="mt-10 rounded-2xl border-2 p-4 sm:p-6 md:p-8 overflow-hidden"
      style={{ borderColor: phase.color + "40", backgroundColor: phase.color + "08" }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 sm:gap-3 mb-1">
        <span
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-white text-xs font-bold"
          style={{ backgroundColor: phase.color }}
        >
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z"
            />
          </svg>
        </span>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm sm:text-base font-bold text-foreground truncate">
            ワークで理解を深める
          </h3>
        </div>
        <span
          className="text-xs font-medium shrink-0"
          style={{ color: filled === total ? "#16a34a" : "#9CA3AF" }}
        >
          {filled}/{total}
        </span>
      </div>
      <p className="text-xs sm:text-sm text-muted mb-5 sm:mb-6 leading-relaxed">
        {mapping.description}
      </p>

      {/* Fields */}
      <div className="space-y-5 sm:space-y-6">
        {mapping.sections.map((sec, si) => {
          const section = phase.sections[sec.sectionIndex];
          const fields = sec.fieldKeys
            ? section.fields.filter((f) => sec.fieldKeys!.includes(f.key))
            : section.fields;

          return (
            <div key={si}>
              <p
                className="text-xs sm:text-sm font-bold mb-2 sm:mb-3"
                style={{ color: phase.color }}
              >
                {section.title}
              </p>
              <div className="space-y-3">
                {fields.map((field) => {
                  const val = data[field.key] || "";
                  const isFilled = val.trim().length > 0;
                  const placeholder = field.example
                    ? `例: ${field.example}`
                    : `${field.label}を入力...`;
                  return (
                    <div key={field.key}>
                      <label className="mb-1 sm:mb-1.5 block text-xs font-semibold text-[#6B7280] break-words">
                        {field.label}
                      </label>
                      <div className="relative">
                        <textarea
                          value={val}
                          onChange={(e) =>
                            handleChange(field.key, e.target.value)
                          }
                          placeholder={placeholder}
                          rows={field.multiline ? 3 : 2}
                          className={`w-full rounded-lg sm:rounded-xl bg-white border border-[#E5E0D8] px-3 sm:px-4 py-2.5 sm:py-3 text-sm leading-relaxed outline-none transition-all duration-200 focus:border-[#378ADD] focus:shadow-[0_0_0_3px_rgba(55,138,221,0.1)] placeholder:text-[#B4B0A8] placeholder:leading-relaxed resize-y ${isFilled ? "pr-9" : ""}`}
                        />
                        {isFilled && (
                          <span className="absolute right-2.5 sm:right-3 top-3 text-green-500">
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="3"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Progress + AI Button */}
      <div className="mt-5 sm:mt-6">
        <div className="h-1.5 rounded-full bg-white/80 overflow-hidden mb-3 sm:mb-4">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${total > 0 ? (filled / total) * 100 : 0}%`,
              backgroundColor: phase.color,
            }}
          />
        </div>
        <button
          type="button"
          onClick={handleAIGenerate}
          disabled={isGenerating || !hasCompanyContext(loadCompanyContext())}
          className="flex items-center justify-center gap-2 rounded-lg sm:rounded-xl py-2.5 px-4 sm:px-5 text-xs sm:text-sm font-bold text-white transition hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed w-full sm:w-auto"
          style={{ backgroundColor: phase.color }}
        >
          {isGenerating ? (
            <>
              <svg
                className="h-4 w-4 animate-spin shrink-0"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="3"
                  className="opacity-25"
                />
                <path
                  d="M4 12a8 8 0 018-8"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  className="opacity-75"
                />
              </svg>
              AI分析中...
            </>
          ) : (
            <>
              <svg
                className="w-4 h-4 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
                />
              </svg>
              AIで空欄を自動入力
            </>
          )}
        </button>
        {!hasCompanyContext(loadCompanyContext()) && (
          <p className="mt-2 text-xs text-muted">
            学習ページトップの「会社情報を登録」からAI分析に必要な情報を入力してください
          </p>
        )}
      </div>
    </div>
  );
}
