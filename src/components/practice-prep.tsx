"use client";

import { useState, useEffect, useCallback } from "react";
import { WORKSHEET_PHASES } from "@/lib/worksheet-fields";
import { LESSON_WORKSHEET_MAP } from "@/lib/lessons/worksheet-mapping";

const STORAGE_KEY = "worksheet-v2-data";

interface PracticePrepProps {
  slug: string;
  product: string;
  industry: string;
}

export function PracticePrep({ slug, product, industry }: PracticePrepProps) {
  const mapping = LESSON_WORKSHEET_MAP[slug];
  const [data, setData] = useState<Record<string, string>>({});
  const [isHydrated, setIsHydrated] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Load saved data
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

  // Determine open/collapsed based on fill state after hydration
  useEffect(() => {
    if (!isHydrated || !mapping) return;
    const phase = WORKSHEET_PHASES[mapping.phaseIndex];
    const keys: string[] = [];
    mapping.sections.forEach((sec) => {
      const section = phase.sections[sec.sectionIndex];
      const fieldKeys = sec.fieldKeys || section.fields.map((f) => f.key);
      keys.push(...fieldKeys);
    });
    const filled = keys.filter((k) => (data[k] || "").trim()).length;
    // Expand if empty, collapse if already filled
    setIsOpen(filled === 0);
  }, [isHydrated]); // eslint-disable-line react-hooks/exhaustive-deps

  // Debounced save to localStorage
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

  const handleFillExample = useCallback(
    (key: string, example: string) => {
      setData((prev) => {
        if ((prev[key] || "").trim()) return prev;
        return { ...prev, [key]: example };
      });
    },
    [],
  );

  if (!mapping || !isHydrated) return null;

  const phase = WORKSHEET_PHASES[mapping.phaseIndex];

  // Collect all field keys for this lesson
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
      className="mb-8 rounded-xl border-2 overflow-hidden"
      style={{ borderColor: phase.color + "30", backgroundColor: phase.color + "06" }}
    >
      {/* Header — always visible, toggles open/close */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-3 px-4 py-3.5 text-left"
      >
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
          <p className="text-sm font-bold text-foreground">
            スクリプトを準備
          </p>
          <p className="text-xs text-muted mt-0.5">
            {mapping.description}
          </p>
        </div>
        <span
          className="text-xs font-medium shrink-0"
          style={{ color: filled === total ? "#16a34a" : "#9CA3AF" }}
        >
          {filled}/{total}
        </span>
        <svg
          className={`w-4 h-4 text-gray-400 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* Collapsible body */}
      {isOpen && (
        <div className="px-4 pb-4 space-y-5">
          {mapping.sections.map((sec, si) => {
            const section = phase.sections[sec.sectionIndex];
            const fields = sec.fieldKeys
              ? section.fields.filter((f) => sec.fieldKeys!.includes(f.key))
              : section.fields;

            return (
              <div key={si}>
                <p
                  className="text-xs font-bold mb-2"
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
                        <label className="mb-1 block text-xs font-semibold text-[#6B7280]">
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
                            className={`w-full rounded-lg bg-white border border-[#E5E0D8] px-3 py-2.5 text-sm leading-relaxed outline-none transition-all duration-200 focus:border-[#378ADD] focus:shadow-[0_0_0_3px_rgba(55,138,221,0.1)] placeholder:text-[#B4B0A8] placeholder:leading-relaxed resize-y ${isFilled ? "pr-9" : ""}`}
                          />
                          {isFilled && (
                            <span className="absolute right-2.5 top-3 text-green-500">
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
                        {field.example && !isFilled && (
                          <button
                            type="button"
                            onClick={() =>
                              handleFillExample(field.key, field.example!)
                            }
                            className="mt-1 text-[11px] font-medium hover:underline"
                            style={{ color: phase.color }}
                          >
                            例文で下書き
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Progress bar */}
          <div className="h-1.5 rounded-full bg-white/80 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${total > 0 ? (filled / total) * 100 : 0}%`,
                backgroundColor: phase.color,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
