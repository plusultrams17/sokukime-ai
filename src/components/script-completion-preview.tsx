"use client";

import { useState } from "react";
import { WORKSHEET_PHASES } from "@/lib/pdf/worksheet-fields";

/* ── Display config per step: how many fields to show clear / blurred ── */
const DISPLAY_CONFIG = [
  { clear: 3, blur: 1 },
  { clear: 4, blur: 2 },
  { clear: 4, blur: 2 },
  { clear: 4, blur: 3 },
  { clear: 4, blur: 3 },
];

export function ScriptCompletionPreview() {
  const [activeTab, setActiveTab] = useState(0);
  const phase = WORKSHEET_PHASES[activeTab];
  const config = DISPLAY_CONFIG[activeTab];

  // Flatten all fields for the active phase
  const allFields = phase.sections.flatMap((sec) =>
    sec.fields.map((f) => ({ ...f, sectionTitle: sec.title }))
  );

  const clearFields = allFields.slice(0, config.clear);
  const blurFields = allFields.slice(config.clear, config.clear + config.blur);
  const hiddenCount = allFields.length - config.clear - config.blur;

  // Total fields across all phases
  const totalFields = WORKSHEET_PHASES.reduce(
    (sum, p) => sum + p.sections.reduce((s, sec) => s + sec.fields.length, 0),
    0
  );

  return (
    <div className="py-16 sm:py-20">
      <div className="mx-auto max-w-4xl px-6">
        {/* Header */}
        <div className="mb-4 flex items-center justify-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/5 px-3 py-1 text-xs font-bold text-accent">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            PDFダウンロード付き
          </span>
        </div>
        <h2 className="mb-3 text-center text-2xl font-bold sm:text-3xl">
          完成スクリプト プレビュー
        </h2>
        <p className="mb-10 text-center text-sm leading-relaxed text-muted">
          プログラム修了後に手に入る、あなただけのトークスクリプト。
          <br className="hidden sm:block" />
          5ステップ・{totalFields}項目以上を網羅した営業台本をPDFで出力できます。
        </p>

        {/* Tab Navigation */}
        <div className="mb-6 flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {WORKSHEET_PHASES.map((p, i) => (
            <button
              key={p.phaseNum}
              onClick={() => setActiveTab(i)}
              className={`flex-shrink-0 rounded-lg px-3 py-2 text-xs font-bold transition sm:px-4 sm:py-2.5 sm:text-sm ${
                i === activeTab
                  ? "text-white shadow-md"
                  : "border border-card-border bg-white text-muted hover:text-foreground"
              }`}
              style={i === activeTab ? { backgroundColor: p.color } : undefined}
            >
              <span className="sm:hidden">{i + 1}</span>
              <span className="hidden sm:inline">
                {p.phaseNum} {p.phaseName}
              </span>
            </button>
          ))}
        </div>

        {/* PDF-style Document Frame */}
        <div className="overflow-hidden rounded-2xl border border-card-border bg-white shadow-xl">
          {/* Document header bar */}
          <div
            className="flex items-center justify-between px-5 py-3 sm:px-6"
            style={{ backgroundColor: phase.color + "10" }}
          >
            <div className="flex items-center gap-2.5">
              <span
                className="flex h-6 w-6 items-center justify-center rounded text-xs font-bold text-white"
                style={{ backgroundColor: phase.color }}
              >
                {activeTab + 1}
              </span>
              <span className="text-sm font-bold" style={{ color: phase.color }}>
                {phase.phaseName}
                <span className="ml-1.5 text-xs font-normal text-muted">
                  — {phase.phaseSub}
                </span>
              </span>
            </div>
            <span className="text-xs text-muted">
              {allFields.length} 項目
            </span>
          </div>

          {/* Clear fields */}
          <div className="space-y-4 px-5 pt-5 sm:px-6 sm:pt-6">
            {clearFields.map((field, i) => {
              const showSectionTitle =
                i === 0 ||
                clearFields[i - 1]?.sectionTitle !== field.sectionTitle;
              return (
                <div key={field.key}>
                  {showSectionTitle && (
                    <p
                      className="mb-2 text-xs font-bold sm:text-sm"
                      style={{ color: phase.color }}
                    >
                      {field.sectionTitle}
                    </p>
                  )}
                  <div>
                    <p className="mb-1 text-xs font-semibold text-[#6B7280]">
                      {field.label}
                    </p>
                    <div className="rounded-lg border border-[#E5E0D8] bg-[#FAFAF8] px-3 py-2.5 text-sm leading-relaxed text-foreground sm:px-4 sm:py-3">
                      {field.example || "—"}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Blurred zone */}
          {blurFields.length > 0 && (
            <div className="relative px-5 pb-2 pt-4 sm:px-6">
              <div
                className="select-none space-y-4"
                style={{ filter: "blur(3px)" }}
                aria-hidden="true"
              >
                {blurFields.map((field) => (
                  <div key={field.key}>
                    <p className="mb-1 text-xs font-semibold text-[#6B7280]">
                      {field.label}
                    </p>
                    <div className="rounded-lg border border-[#E5E0D8] bg-[#FAFAF8] px-3 py-2.5 text-sm leading-relaxed text-foreground sm:px-4 sm:py-3">
                      {field.example || "—"}
                    </div>
                  </div>
                ))}
              </div>
              {/* Gradient overlay */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/30 to-white" />
            </div>
          )}

          {/* CTA inside document */}
          <div className="px-5 pb-5 pt-2 text-center sm:px-6 sm:pb-6">
            {hiddenCount > 0 && (
              <p className="text-sm font-medium text-muted">
                他 <span className="font-bold text-foreground">{hiddenCount}項目</span> はプログラムで作成
              </p>
            )}
          </div>
        </div>

        {/* Stats badges */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-card-border bg-white px-4 py-2 text-xs font-bold text-foreground shadow-sm">
            <svg className="h-3.5 w-3.5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25a2.25 2.25 0 01-2.25-2.25v-2.25z" />
            </svg>
            5ステップ
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-card-border bg-white px-4 py-2 text-xs font-bold text-foreground shadow-sm">
            <svg className="h-3.5 w-3.5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
            {totalFields}項目
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-card-border bg-white px-4 py-2 text-xs font-bold text-foreground shadow-sm">
            <svg className="h-3.5 w-3.5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
            PDF出力
          </span>
        </div>
      </div>
    </div>
  );
}
