"use client";

import { forwardRef } from "react";
import type { Lesson } from "@/lib/lessons/types";
import { LessonDiagram, getSectionDiagram } from "@/components/lesson-diagrams";
import { WORKSHEET_PHASES } from "@/lib/pdf/worksheet-fields";
import { LESSON_WORKSHEET_MAP } from "@/lib/lessons/worksheet-mapping";

const LEVEL_COLORS: Record<string, string> = {
  beginner: "#0F6E56",
  intermediate: "#2563EB",
  advanced: "#7C3AED",
};

function processExamplesHtml(html: string): string {
  const lines = html.split("\n");
  const result: string[] = [];
  let inDialogue = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    const isDialogueStart = /^<p>(?:営業|お客様|顧客|相手|客)：/.test(line);
    const isStageDirection = /^<p><em>[^<]*<\/em><\/p>$/.test(line);
    const canContinue = isDialogueStart || (inDialogue && isStageDirection);

    if (line.includes('class="dialogue"') || line.includes('class="example-')) {
      if (inDialogue) { result.push("</div>"); inDialogue = false; }
      result.push(lines[i]);
      continue;
    }
    if (isDialogueStart && !inDialogue) {
      inDialogue = true;
      result.push('<div class="dialogue">');
      result.push(lines[i]);
    } else if (canContinue && inDialogue) {
      result.push(lines[i]);
    } else if (!canContinue && inDialogue) {
      if (line === "") { result.push(lines[i]); }
      else { result.push("</div>"); inDialogue = false; result.push(lines[i]); }
    } else {
      result.push(lines[i]);
    }
  }
  if (inDialogue) result.push("</div>");
  return result.join("\n");
}

interface LessonPdfContentProps {
  lesson: Lesson;
  slug: string;
  quizScore?: number;
  worksheetData?: Record<string, string>[];
}

const LessonPdfContent = forwardRef<HTMLDivElement, LessonPdfContentProps>(
  function LessonPdfContent({ lesson, slug, quizScore, worksheetData }, ref) {
    const color = LEVEL_COLORS[lesson.level];
    const theoryParts = lesson.theory.split(/<!-- DIAGRAM:([\w-]+) -->/);
    const mapping = LESSON_WORKSHEET_MAP[slug];

    return (
      <div
        ref={ref}
        style={{
          width: "794px",
          padding: "40px",
          fontFamily: "system-ui, sans-serif",
          backgroundColor: "#FFFFFF",
          color: "#1E293B",
          fontSize: "12px",
          lineHeight: "1.8",
        }}
      >
        {/* Lesson Header */}
        <div style={{ marginBottom: "20px" }}>
          <div
            style={{
              display: "inline-block",
              backgroundColor: color,
              color: "#FFFFFF",
              padding: "2px 10px",
              fontSize: "10px",
              fontWeight: "bold",
              marginBottom: "8px",
            }}
          >
            {lesson.levelLabel} | Lesson {lesson.order}
          </div>
          <h1
            style={{
              fontSize: "22px",
              fontWeight: "bold",
              margin: "8px 0 4px",
            }}
          >
            {lesson.title}
          </h1>
          <p style={{ color: "#64748B", fontSize: "13px", margin: 0 }}>
            {lesson.description}
          </p>
        </div>

        {/* Learning Objectives */}
        {lesson.objectives.length > 0 && (
          <div
            style={{
              borderLeft: `4px solid ${color}`,
              paddingLeft: "16px",
              marginBottom: "24px",
            }}
          >
            <h3 style={{ fontSize: "13px", fontWeight: "bold", marginBottom: "8px" }}>
              学習目標
            </h3>
            <ul style={{ margin: 0, paddingLeft: "16px" }}>
              {lesson.objectives.map((obj, i) => (
                <li
                  key={i}
                  style={{
                    fontSize: "12px",
                    color: "#64748B",
                    marginBottom: "4px",
                  }}
                >
                  {obj}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Quiz Score (if available) */}
        {typeof quizScore === "number" && (
          <div
            style={{
              border: `2px solid ${color}`,
              padding: "10px 16px",
              marginBottom: "24px",
              textAlign: "center",
            }}
          >
            <span style={{ fontSize: "11px", color: "#64748B" }}>
              あなたのクイズスコア:{" "}
            </span>
            <span style={{ fontSize: "18px", fontWeight: "bold", color }}>
              {quizScore}/{lesson.quiz.length}
            </span>
          </div>
        )}

        {/* Theory Section */}
        <div style={{ marginBottom: "32px" }}>
          <h2
            style={{
              fontSize: "16px",
              fontWeight: "800",
              backgroundColor: "#1E293B",
              color: "#FFFFFF",
              padding: "8px 14px",
              marginBottom: "16px",
              letterSpacing: "0.02em",
            }}
          >
            理論解説
          </h2>

          {/* Overview diagram */}
          <LessonDiagram slug={slug} />

          {/* Theory content with inline section diagrams */}
          {theoryParts.length === 1 ? (
            <div
              className="blog-content"
              dangerouslySetInnerHTML={{ __html: lesson.theory }}
            />
          ) : (
            theoryParts.map((part, i) => {
              if (i % 2 === 0) {
                return part.trim() ? (
                  <div
                    key={i}
                    className="blog-content"
                    dangerouslySetInnerHTML={{ __html: part }}
                  />
                ) : null;
              }
              const Comp = getSectionDiagram(slug, part);
              return Comp ? <Comp key={`d-${i}`} /> : null;
            })
          )}
        </div>

        {/* Examples Section */}
        <div style={{ marginBottom: "32px" }}>
          <h2
            style={{
              fontSize: "16px",
              fontWeight: "800",
              backgroundColor: "#1E293B",
              color: "#FFFFFF",
              padding: "8px 14px",
              marginBottom: "16px",
              letterSpacing: "0.02em",
            }}
          >
            トーク例
          </h2>
          <div
            className="blog-content"
            dangerouslySetInnerHTML={{
              __html: processExamplesHtml(lesson.examples),
            }}
          />
        </div>

        {/* Quiz Section with Answers */}
        <div>
          <h2
            style={{
              fontSize: "16px",
              fontWeight: "800",
              backgroundColor: "#1E293B",
              color: "#FFFFFF",
              padding: "8px 14px",
              marginBottom: "16px",
              letterSpacing: "0.02em",
            }}
          >
            確認クイズ（解答付き）
          </h2>
          {lesson.quiz.map((q, qi) => (
            <div key={qi} style={{ marginBottom: "20px" }}>
              <p
                style={{
                  fontWeight: "bold",
                  fontSize: "13px",
                  marginBottom: "8px",
                }}
              >
                Q{qi + 1}. {q.question}
              </p>
              {q.options.map((opt, oi) => (
                <div
                  key={oi}
                  style={{
                    padding: "5px 10px",
                    marginBottom: "2px",
                    fontSize: "12px",
                    backgroundColor:
                      oi === q.answer ? "#F0FDF4" : "transparent",
                    border:
                      oi === q.answer
                        ? "1px solid #16A34A"
                        : "1px solid transparent",
                    fontWeight: oi === q.answer ? "bold" : "normal",
                    color: oi === q.answer ? "#166534" : "#64748B",
                  }}
                >
                  {String.fromCharCode(65 + oi)}. {opt}
                  {oi === q.answer && " ✓"}
                </div>
              ))}
              <div
                style={{
                  fontSize: "11px",
                  color: "#64748B",
                  marginTop: "6px",
                  paddingLeft: "12px",
                  borderLeft: "2px solid #E5DFD6",
                }}
              >
                {q.explanation}
              </div>
            </div>
          ))}
        </div>

        {/* Worksheet Section */}
        {mapping && worksheetData && (() => {
          const phase = WORKSHEET_PHASES[mapping.phaseIndex];
          const phaseValues = worksheetData[mapping.phaseIndex] || {};
          const hasAnyValue = mapping.sections.some((sec) => {
            const section = phase.sections[sec.sectionIndex];
            const fields = sec.fieldKeys
              ? section.fields.filter((f) => sec.fieldKeys!.includes(f.key))
              : section.fields;
            return fields.some((f) => (phaseValues[f.key] || "").trim());
          });
          if (!hasAnyValue) return null;
          return (
            <div style={{ marginBottom: "32px" }}>
              <h2
                style={{
                  fontSize: "16px",
                  fontWeight: "800",
                  backgroundColor: phase.color,
                  color: "#FFFFFF",
                  padding: "8px 14px",
                  marginBottom: "16px",
                  letterSpacing: "0.02em",
                }}
              >
                ワークシート — {phase.phaseName}
              </h2>
              {mapping.sections.map((sec, si) => {
                const section = phase.sections[sec.sectionIndex];
                const fields = sec.fieldKeys
                  ? section.fields.filter((f) => sec.fieldKeys!.includes(f.key))
                  : section.fields;
                return (
                  <div key={si} style={{ marginBottom: "14px" }}>
                    <h3
                      style={{
                        fontSize: "11px",
                        fontWeight: "bold",
                        color: phase.color,
                        borderBottom: `1px solid ${phase.color}30`,
                        paddingBottom: "3px",
                        marginBottom: "8px",
                      }}
                    >
                      {section.title}
                    </h3>
                    {fields.map((field) => {
                      const value = phaseValues[field.key] || "";
                      return (
                        <div key={field.key} style={{ marginBottom: "6px" }}>
                          <div
                            style={{
                              fontSize: "10px",
                              fontWeight: "bold",
                              color: "#64748B",
                            }}
                          >
                            {field.label}
                          </div>
                          <div
                            style={{
                              border: "1px solid #E5DFD6",
                              padding: "5px 10px",
                              minHeight: field.multiline ? "40px" : "24px",
                              fontSize: "11px",
                              backgroundColor: value.trim() ? "#FFFFFF" : "#F8F9FA",
                              color: value.trim() ? "#1E293B" : "#CBD5E1",
                              whiteSpace: "pre-wrap",
                            }}
                          >
                            {value.trim() || "(未入力)"}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          );
        })()}

        {/* Footer */}
        <div
          style={{
            borderTop: "1px solid #E5DFD6",
            paddingTop: "12px",
            marginTop: "24px",
            textAlign: "center",
            fontSize: "9px",
            color: "#94A3B8",
          }}
        >
          成約コーチ AI - {lesson.levelLabel} Lesson {lesson.order}:{" "}
          {lesson.title}
        </div>
      </div>
    );
  },
);

export default LessonPdfContent;
