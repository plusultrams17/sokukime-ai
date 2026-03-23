"use client";

import { useState, useEffect } from "react";

const SURVEY_OPTIONS = [
  { id: "unlimited", label: "無制限でロープレしたい" },
  { id: "score_detail", label: "スコアの詳細が見たい" },
  { id: "ai_advice", label: "AIアドバイスが欲しい" },
  { id: "price", label: "価格が手頃だった" },
  { id: "other", label: "その他" },
];

export function PostPaymentSurvey() {
  const [show, setShow] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    // Show survey 3 seconds after the page loads with ?upgraded=true
    const params = new URLSearchParams(window.location.search);
    if (params.get("upgraded") !== "true") return;

    // Don't show if already answered
    if (sessionStorage.getItem("survey-answered")) return;

    const timer = setTimeout(() => setShow(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleSelect = async (optionId: string) => {
    setSubmitted(true);
    sessionStorage.setItem("survey-answered", "1");

    try {
      await fetch("/api/survey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answer: optionId }),
      });
    } catch {
      // Non-critical, silently fail
    }

    setTimeout(() => setShow(false), 2000);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in-up">
      <div className="mx-4 w-full max-w-md rounded-2xl border border-card-border bg-card p-6 shadow-2xl">
        {submitted ? (
          <div className="text-center">
            <p className="text-2xl">🙏</p>
            <p className="mt-2 font-bold">ありがとうございます！</p>
            <p className="mt-1 text-sm text-muted">
              フィードバックを記録しました
            </p>
          </div>
        ) : (
          <>
            <div className="mb-1 text-center">
              <p className="text-2xl">🎉</p>
              <h3 className="mt-2 text-lg font-bold">
                Proプランへようこそ！
              </h3>
              <p className="mt-1 text-sm text-muted">
                1つだけ教えてください（タップするだけ）
              </p>
            </div>

            <p className="mb-4 text-center text-sm font-medium text-accent">
              決め手は何でしたか？
            </p>

            <div className="space-y-2">
              {SURVEY_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => handleSelect(opt.id)}
                  className="w-full rounded-xl border border-card-border bg-background px-4 py-3 text-left text-sm font-medium transition hover:border-accent hover:bg-accent/5"
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                sessionStorage.setItem("survey-answered", "1");
                setShow(false);
              }}
              className="mt-4 w-full text-center text-xs text-muted transition hover:text-foreground"
            >
              スキップ
            </button>
          </>
        )}
      </div>
    </div>
  );
}
