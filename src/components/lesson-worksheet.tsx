"use client";

import { useState, useEffect, useCallback } from "react";
import { WORKSHEET_PHASES } from "@/lib/pdf/worksheet-fields";
import { LESSON_WORKSHEET_MAP } from "@/lib/lessons/worksheet-mapping";
import {
  loadCompanyContext,
  saveCompanyContext,
  hasCompanyContext,
  type CompanyContext,
  EMPTY_CONTEXT,
} from "@/lib/company-context";
import {
  loadTargetContext,
  hasTargetContext,
} from "@/lib/target-context";

const STORAGE_KEY = "worksheet-v2-data";

interface LessonWorksheetProps {
  slug: string;
  color: string;
}

export function LessonWorksheet({ slug, color }: LessonWorksheetProps) {
  const mapping = LESSON_WORKSHEET_MAP[slug];

  const [data, setData] = useState<Record<string, string>>({});
  const [isHydrated, setIsHydrated] = useState(false);
  const [companyCtx, setCompanyCtx] = useState<CompanyContext>(EMPTY_CONTEXT);
  const [showCompanyForm, setShowCompanyForm] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Load from localStorage
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
    setCompanyCtx(loadCompanyContext());
    setIsHydrated(true);
  }, [mapping]);

  // Save worksheet data to localStorage (debounced)
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

  const handleCompanyChange = useCallback(
    (field: keyof CompanyContext, value: string) => {
      setCompanyCtx((prev) => {
        const next = { ...prev, [field]: value };
        saveCompanyContext(next);
        return next;
      });
    },
    [],
  );

  // AI analysis: generate worksheet fields using company + target context
  const handleAIGenerate = useCallback(async () => {
    if (!mapping) return;
    if (!hasCompanyContext(companyCtx)) {
      setShowCompanyForm(true);
      return;
    }
    const tgt = loadTargetContext();
    setIsGenerating(true);
    try {
      const res = await fetch("/api/worksheet/generate-phase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phase: mapping.phaseIndex,
          industry: companyCtx.industry || companyCtx.productName,
          productInfo: {
            productName: companyCtx.productName,
            targetAudience: companyCtx.targetAudience,
            keyFeatures: companyCtx.keyFeatures,
            priceRange: companyCtx.priceRange,
            advantages: companyCtx.advantages,
            challenges: companyCtx.challenges,
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
      // Fill empty fields only
      setData((prev) => {
        const next = { ...prev };
        for (const [key, val] of Object.entries(result)) {
          if (key !== "preview" && typeof val === "string" && !next[key]?.trim()) {
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
  }, [mapping, companyCtx]);

  // No worksheet mapping for this lesson — return nothing
  if (!mapping) {
    return null;
  }

  // Loading state
  if (!isHydrated) {
    return (
      <div className="rounded-2xl border border-card-border bg-white p-6 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />
        <div className="h-10 bg-gray-200 rounded mb-3" />
        <div className="h-10 bg-gray-200 rounded mb-3" />
        <div className="h-10 bg-gray-200 rounded" />
      </div>
    );
  }

  const phase = WORKSHEET_PHASES[mapping.phaseIndex];

  // Count filled / total fields
  const allFieldKeys: string[] = [];
  mapping.sections.forEach((sec) => {
    const section = phase.sections[sec.sectionIndex];
    const keys = sec.fieldKeys || section.fields.map((f) => f.key);
    allFieldKeys.push(...keys);
  });
  const filled = allFieldKeys.filter((k) => (data[k] || "").trim()).length;
  const total = allFieldKeys.length;

  return (
    <div className="rounded-2xl border border-card-border bg-white shadow-sm overflow-hidden">
      {/* Header */}
      <div
        className="px-5 py-4 border-b border-card-border"
        style={{ borderTopWidth: 3, borderTopColor: phase.color }}
      >
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
            <DocIcon className="w-4 h-4" style={{ color: phase.color }} />
            ワークシート
          </h3>
          <span
            className="text-xs font-medium"
            style={{ color: filled === total ? "#16a34a" : "#9CA3AF" }}
          >
            {filled}/{total}
          </span>
        </div>
        <p className="text-xs text-muted leading-relaxed">
          {mapping.description}
        </p>
      </div>

      {/* Company Context Toggle */}
      <div className="px-5 pt-4">
        <button
          type="button"
          onClick={() => setShowCompanyForm(!showCompanyForm)}
          className="flex items-center gap-1.5 text-[11px] font-semibold text-muted hover:text-foreground transition mb-3"
        >
          <svg
            className={`w-3 h-3 transition-transform ${showCompanyForm ? "rotate-90" : ""}`}
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <polygon points="6 3 20 12 6 21" />
          </svg>
          {hasCompanyContext(companyCtx)
            ? `会社情報: ${companyCtx.industry || companyCtx.productName}`
            : "会社・商材の情報を登録（AI分析に使用）"}
        </button>
        {showCompanyForm && (
          <CompanyContextForm
            ctx={companyCtx}
            onChange={handleCompanyChange}
            color={phase.color}
          />
        )}
      </div>

      {/* Fields */}
      <div className="p-5 pt-2 space-y-5">
        {mapping.sections.map((sec, si) => {
          const section = phase.sections[sec.sectionIndex];
          const fields = sec.fieldKeys
            ? section.fields.filter((f) => sec.fieldKeys!.includes(f.key))
            : section.fields;

          return (
            <div key={si}>
              <p
                className="text-xs font-bold mb-3"
                style={{ color: phase.color }}
              >
                {section.title}
              </p>
              <div className="space-y-3">
                {fields.map((field) => {
                  const val = data[field.key] || "";
                  const isFilled = val.trim().length > 0;
                  return (
                    <div key={field.key}>
                      <label className="mb-1 block text-[11px] font-semibold text-[#6B7280]">
                        {field.label}
                      </label>
                      <div className="relative">
                        {field.multiline ? (
                          <textarea
                            value={val}
                            onChange={(e) =>
                              handleChange(field.key, e.target.value)
                            }
                            placeholder={`${field.label}を入力...`}
                            className={`w-full rounded-lg bg-[#FAFAF8] border border-[#E5E0D8] px-3 py-2.5 text-xs outline-none transition-all duration-200 focus:border-[#378ADD] focus:shadow-[0_0_0_3px_rgba(55,138,221,0.1)] placeholder:text-[#B4B0A8] min-h-[72px] resize-y ${isFilled ? "pr-8" : ""}`}
                          />
                        ) : (
                          <input
                            type="text"
                            value={val}
                            onChange={(e) =>
                              handleChange(field.key, e.target.value)
                            }
                            placeholder={`${field.label}を入力...`}
                            className={`w-full rounded-lg bg-[#FAFAF8] border border-[#E5E0D8] px-3 py-2.5 text-xs outline-none transition-all duration-200 focus:border-[#378ADD] focus:shadow-[0_0_0_3px_rgba(55,138,221,0.1)] placeholder:text-[#B4B0A8] ${isFilled ? "pr-8" : ""}`}
                          />
                        )}
                        {isFilled && (
                          <span
                            className={`absolute right-2.5 ${field.multiline ? "top-3" : "top-1/2 -translate-y-1/2"} text-green-500`}
                          >
                            <svg
                              width="12"
                              height="12"
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

      {/* Progress bar */}
      <div className="px-5 pb-2">
        <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${total > 0 ? (filled / total) * 100 : 0}%`,
              backgroundColor: phase.color,
            }}
          />
        </div>
      </div>

      {/* AI Analyze Button */}
      <div className="px-5 py-3 border-t border-card-border bg-gray-50/50">
        <button
          type="button"
          onClick={handleAIGenerate}
          disabled={isGenerating}
          className="flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold text-white transition hover:opacity-90 disabled:opacity-50"
          style={{ backgroundColor: phase.color }}
        >
          {isGenerating ? (
            <>
              <svg
                className="h-3.5 w-3.5 animate-spin"
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
              <SparkleIcon className="w-3.5 h-3.5" />
              AIで分析する
            </>
          )}
        </button>
        {!hasCompanyContext(companyCtx) && (
          <p className="mt-2 text-center text-[10px] text-muted">
            会社情報を登録するとより精度の高い分析ができます
          </p>
        )}
      </div>
    </div>
  );
}

/* ── Company Context Form ──────────────────────── */

const COMPANY_FIELDS: {
  key: keyof CompanyContext;
  label: string;
  placeholder: string;
  multiline?: boolean;
}[] = [
  {
    key: "industry",
    label: "業種",
    placeholder: "例: 不動産、IT、保険、教育...",
  },
  {
    key: "productName",
    label: "商材・サービス名",
    placeholder: "例: 外壁塗装サービス、法人向けSaaS...",
  },
  {
    key: "targetAudience",
    label: "ターゲット層",
    placeholder: "例: 中小企業の経営者、30代共働き世帯...",
  },
  {
    key: "keyFeatures",
    label: "主な特徴・強み",
    placeholder: "例: 業界最安値、24時間サポート...",
  },
  {
    key: "priceRange",
    label: "価格帯",
    placeholder: "例: 月額1万円〜、一括50万円...",
  },
  {
    key: "additionalInfo",
    label: "補足情報（資料の内容をペースト）",
    placeholder:
      "PDFや資料の内容をここにペーストすると、AIがより精度の高い分析を行います",
    multiline: true,
  },
];

function CompanyContextForm({
  ctx,
  onChange,
  color,
}: {
  ctx: CompanyContext;
  onChange: (field: keyof CompanyContext, value: string) => void;
  color: string;
}) {
  return (
    <div className="mb-4 space-y-2.5 border-l-2 pl-3 ml-1" style={{ borderColor: color }}>
      {COMPANY_FIELDS.map((f) =>
        f.multiline ? (
          <div key={f.key}>
            <label className="mb-1 block text-[10px] font-semibold text-[#6B7280]">
              {f.label}
            </label>
            <textarea
              value={ctx[f.key]}
              onChange={(e) => onChange(f.key, e.target.value)}
              placeholder={f.placeholder}
              className="w-full rounded-lg bg-[#FAFAF8] border border-[#E5E0D8] px-3 py-2 text-[11px] outline-none transition-all duration-200 focus:border-[#378ADD] focus:shadow-[0_0_0_3px_rgba(55,138,221,0.1)] placeholder:text-[#B4B0A8] min-h-[60px] resize-y"
            />
          </div>
        ) : (
          <div key={f.key}>
            <label className="mb-1 block text-[10px] font-semibold text-[#6B7280]">
              {f.label}
            </label>
            <input
              type="text"
              value={ctx[f.key]}
              onChange={(e) => onChange(f.key, e.target.value)}
              placeholder={f.placeholder}
              className="w-full rounded-lg bg-[#FAFAF8] border border-[#E5E0D8] px-3 py-2 text-[11px] outline-none transition-all duration-200 focus:border-[#378ADD] focus:shadow-[0_0_0_3px_rgba(55,138,221,0.1)] placeholder:text-[#B4B0A8]"
            />
          </div>
        ),
      )}
      <p className="text-[10px] text-muted leading-relaxed">
        入力した情報は全レッスンのAI分析に活用されます
      </p>
    </div>
  );
}

/* ── Icons ─────────────────────────────────────── */

function SparkleIcon({
  className,
  ...props
}: React.SVGProps<SVGSVGElement> & { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z"
      />
    </svg>
  );
}

function DocIcon({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      className={className}
      style={style}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  );
}
