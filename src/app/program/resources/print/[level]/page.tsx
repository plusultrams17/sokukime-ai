"use client";

import { useParams, notFound } from "next/navigation";
import { getLessonsByLevel } from "@/lib/lessons";
import { processExamplesHtml } from "@/lib/lessons/process-html";

const LEVEL_META: Record<
  string,
  { label: string; subtitle: string; description: string; color: string }
> = {
  beginner: {
    label: "初級",
    subtitle: "アプローチ・ヒアリング・プレゼン",
    description:
      "信頼構築から価値提案までの基礎技術。営業の土台となるマインドセット、褒める技術、ゴール共有、伝え方の法則、ニーズ発掘、利点話法を習得します。",
    color: "#0F6E56",
  },
  intermediate: {
    label: "中級",
    subtitle: "クロージング",
    description:
      "お客様の決断を後押しするクロージング技術。社会的証明、一貫性の活用、第三者話法、ポジティブ/ネガティブクロージング、欲求パターンを習得します。",
    color: "#2563EB",
  },
  advanced: {
    label: "上級",
    subtitle: "反論処理・切り返し",
    description:
      "「考えたい」「高い」等の反論に対する切り返し技術。共感→フック→切り返しの公式、5つの切り返し技法を実践的に習得します。",
    color: "#7C3AED",
  },
};

export default function PrintLevelPage() {
  const params = useParams();
  const level = params?.level as string;

  if (!level || !(level in LEVEL_META)) {
    notFound();
  }

  const meta = LEVEL_META[level];
  const lessons = getLessonsByLevel(
    level as "beginner" | "intermediate" | "advanced",
  );

  return (
    <article className="print-prose">
      {/* Cover */}
      <header className="mb-8 border-b-4 pb-6" style={{ borderColor: meta.color }}>
        <p
          className="mb-2 text-xs font-bold uppercase tracking-widest"
          style={{ color: meta.color }}
        >
          成約コーチAI 教材プログラム
        </p>
        <h1>
          {meta.label}完全ガイド
          <br />
          <span className="text-xl font-semibold text-gray-600">
            {meta.subtitle}
          </span>
        </h1>
        <p className="mt-4 text-sm text-gray-600 leading-relaxed">
          {meta.description}
        </p>
        <div className="mt-4 flex items-center gap-3 text-xs text-gray-500">
          <span className="font-bold">{lessons.length}レッスン収録</span>
          <span>|</span>
          <span>成約5ステップメソッド準拠</span>
        </div>
      </header>

      {/* Table of Contents */}
      <section className="print-avoid-break mb-10 rounded-lg bg-gray-50 p-5">
        <h2
          className="!mt-0 !border-none !pb-0"
          style={{ color: meta.color, fontSize: "14pt" }}
        >
          目次
        </h2>
        <ol className="mt-3 space-y-1.5 !pl-0 !list-none">
          {lessons.map((lesson) => (
            <li
              key={lesson.slug}
              className="!mb-0 flex items-start gap-3 border-b border-gray-200 pb-1.5 text-sm"
            >
              <span
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10pt] font-bold text-white"
                style={{ backgroundColor: meta.color }}
              >
                {lesson.order}
              </span>
              <span className="flex-1">
                <span className="font-bold text-gray-900">{lesson.title}</span>
                <span className="ml-2 text-[9.5pt] text-gray-500">
                  {lesson.description}
                </span>
              </span>
            </li>
          ))}
        </ol>
      </section>

      {/* Lessons */}
      {lessons.map((lesson, idx) => (
        <section
          key={lesson.slug}
          className={idx > 0 ? "print-page-break" : ""}
        >
          <header className="mb-4">
            <div className="mb-1 flex items-center gap-3">
              <span
                className="inline-flex items-center rounded-full px-3 py-0.5 text-[9pt] font-bold text-white"
                style={{ backgroundColor: meta.color }}
              >
                Lesson {lesson.order}
              </span>
              <span className="text-[9pt] text-gray-500">
                {meta.label} {lesson.order}/{lessons.length}
              </span>
            </div>
            <h2 className="!mt-2">{lesson.title}</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              {lesson.description}
            </p>
          </header>

          {/* Objectives */}
          {lesson.objectives && lesson.objectives.length > 0 && (
            <div className="print-avoid-break mb-5 rounded-lg border border-orange-200 bg-orange-50 p-4">
              <h3
                className="!mt-0 !text-[11pt]"
                style={{ color: "#ea580c" }}
              >
                🎯 学習目標
              </h3>
              <ul className="!mb-0">
                {lesson.objectives.map((obj, i) => (
                  <li key={i}>{obj}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Theory */}
          <div
            dangerouslySetInnerHTML={{
              __html: processExamplesHtml(lesson.theory || ""),
            }}
          />

          {/* Examples */}
          {lesson.examples && (
            <div
              dangerouslySetInnerHTML={{
                __html: processExamplesHtml(lesson.examples),
              }}
            />
          )}

          {/* Quiz */}
          {lesson.quiz && lesson.quiz.length > 0 && (
            <div className="print-avoid-break mt-5 rounded-lg border border-gray-200 bg-gray-50 p-4">
              <h3 className="!mt-0 !text-[11pt]">📝 確認クイズ</h3>
              <ol className="!pl-5">
                {lesson.quiz.map((q, i) => (
                  <li key={i} className="!mb-3">
                    <p className="!mb-1 font-semibold text-gray-900">
                      {q.question}
                    </p>
                    <ul className="!mb-1 !pl-4">
                      {q.options.map((opt, j) => (
                        <li
                          key={j}
                          className={
                            j === q.answer ? "font-semibold text-green-700" : ""
                          }
                        >
                          {String.fromCharCode(65 + j)}. {opt}
                          {j === q.answer && " ✓"}
                        </li>
                      ))}
                    </ul>
                    <p className="!mb-0 text-[9.5pt] text-gray-600">
                      <strong>解説:</strong> {q.explanation}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Practice prompt */}
          {lesson.practicePrompt && (
            <div className="print-avoid-break mt-4 rounded-lg border-l-4 border-blue-400 bg-blue-50 p-4">
              <h3 className="!mt-0 !text-[11pt] !text-blue-900">
                💪 実践練習のポイント
              </h3>
              <p className="!mb-0">{lesson.practicePrompt}</p>
            </div>
          )}
        </section>
      ))}

      {/* Footer */}
      <footer className="mt-12 border-t border-gray-200 pt-6 text-center">
        <p className="text-[9pt] text-gray-500">
          © 成約コーチAI — 成約5ステップメソッド {meta.label}完全ガイド
        </p>
        <p className="mt-1 text-[9pt] text-gray-500">
          https://seiyaku-coach.vercel.app
        </p>
      </footer>
    </article>
  );
}
