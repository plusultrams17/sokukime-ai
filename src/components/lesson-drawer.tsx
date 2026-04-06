"use client";

import { useState, useEffect, useCallback } from "react";
import { getAllLessons } from "@/lib/lessons";
import type { Lesson } from "@/lib/lessons";
import { processExamplesHtml } from "@/lib/lessons/process-html";

const STEP_LESSON_MAP: Record<number, string> = {
  1: "premise-setting",
  2: "drawer-phrases",
  3: "benefit-method",
  4: "closing-intro",
  5: "rebuttal-pattern",
};

const LEVEL_LABELS: Record<string, string> = {
  beginner: "初級",
  intermediate: "中級",
  advanced: "上級",
};

interface LessonDrawerProps {
  open: boolean;
  onClose: () => void;
  currentStepNumber?: number;
}

export function LessonDrawer({ open, onClose, currentStepNumber }: LessonDrawerProps) {
  const [lessons] = useState<Lesson[]>(() => getAllLessons());
  const [selectedSlug, setSelectedSlug] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"theory" | "examples">("theory");

  // Auto-select lesson based on current step
  useEffect(() => {
    if (!open) return;
    const stepSlug = currentStepNumber ? STEP_LESSON_MAP[currentStepNumber] : undefined;
    if (stepSlug && lessons.some((l) => l.slug === stepSlug)) {
      setSelectedSlug(stepSlug);
    } else if (!selectedSlug && lessons.length > 0) {
      setSelectedSlug(lessons[0].slug);
    }
  }, [open, currentStepNumber, lessons, selectedSlug]);

  // ESC key to close
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (open) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [open, handleKeyDown]);

  // Lock body scroll when open on mobile
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = ""; };
    }
  }, [open]);

  const selectedLesson = lessons.find((l) => l.slug === selectedSlug);

  const grouped = {
    beginner: lessons.filter((l) => l.level === "beginner"),
    intermediate: lessons.filter((l) => l.level === "intermediate"),
    advanced: lessons.filter((l) => l.level === "advanced"),
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-50 bg-black/50 transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel — right slide on desktop, bottom slide on mobile */}
      <div
        className={`fixed z-50 flex flex-col bg-background transition-[transform,visibility] duration-300 ease-out
          inset-x-0 bottom-0 top-0 md:inset-y-0 md:left-auto md:right-0 md:w-[420px]
          ${open ? "visible translate-x-0 translate-y-0" : "invisible translate-y-full md:translate-y-0 md:translate-x-full"}`}
        role="dialog"
        aria-modal={open}
        aria-hidden={!open}
        aria-label="教材参照"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-card-border px-4 py-3">
          <div className="flex items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent">
              <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" />
              <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
            </svg>
            <span className="text-sm font-bold text-foreground">教材</span>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted transition hover:bg-card-border hover:text-foreground"
            aria-label="閉じる"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Lesson selector */}
        <div className="border-b border-card-border px-4 py-2">
          <select
            value={selectedSlug}
            onChange={(e) => { setSelectedSlug(e.target.value); setActiveTab("theory"); }}
            className="w-full rounded-lg border border-card-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
          >
            {(["beginner", "intermediate", "advanced"] as const).map((level) => (
              <optgroup key={level} label={`${LEVEL_LABELS[level]}（${grouped[level].length}レッスン）`}>
                {grouped[level].map((l) => (
                  <option key={l.slug} value={l.slug}>
                    {l.order}. {l.title}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        {/* Tabs: 理論 / トーク例 */}
        <div className="flex border-b border-card-border">
          <button
            onClick={() => setActiveTab("theory")}
            className={`flex-1 py-2.5 text-center text-sm font-medium transition ${
              activeTab === "theory"
                ? "text-accent border-b-2 border-accent"
                : "text-muted hover:text-foreground"
            }`}
          >
            理論
          </button>
          <button
            onClick={() => setActiveTab("examples")}
            className={`flex-1 py-2.5 text-center text-sm font-medium transition ${
              activeTab === "examples"
                ? "text-accent border-b-2 border-accent"
                : "text-muted hover:text-foreground"
            }`}
          >
            トーク例
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {selectedLesson ? (
            activeTab === "theory" ? (
              <div
                className="blog-content"
                dangerouslySetInnerHTML={{ __html: selectedLesson.theory }}
              />
            ) : (
              <div
                className="blog-content"
                dangerouslySetInnerHTML={{ __html: processExamplesHtml(selectedLesson.examples) }}
              />
            )
          ) : (
            <p className="text-sm text-muted">レッスンを選択してください</p>
          )}
        </div>
      </div>
    </>
  );
}
