"use client";
import { useState } from "react";

interface WelcomeModalProps {
  open: boolean;
  onComplete: () => void;
}

const steps = [
  {
    icon: "🎉",
    title: "成約コーチ AIへようこそ！",
    body: "AIとロープレして、営業メソッドの型を体に叩き込みましょう。",
  },
  {
    icon: "🎯",
    title: "3ステップで完了",
    body: "① 商材を入力 → ② AIとロープレ → ③ スコアで実力チェック\n\nコーチ機能がリアルタイムでサポートします。",
  },
  {
    icon: "🔥",
    title: "さっそく始めましょう！",
    body: "まずは1回、気軽にロープレしてみてください。毎日練習して、スコア90を目指しましょう！",
  },
];

export function WelcomeModal({ open, onComplete }: WelcomeModalProps) {
  const [step, setStep] = useState(0);
  if (!open) return null;
  const isLast = step === steps.length - 1;
  const current = steps[step];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-md animate-fade-in-up rounded-2xl border border-card-border bg-card p-8 text-center">
        <div className="mb-4 text-5xl">{current.icon}</div>
        <h2 className="mb-3 text-xl font-bold">{current.title}</h2>
        <p className="mb-8 text-sm text-muted leading-relaxed whitespace-pre-line">{current.body}</p>
        <div className="mb-6 flex justify-center gap-2">
          {steps.map((_, i) => (
            <div key={i} className={`h-2 w-2 rounded-full transition ${i === step ? "bg-accent" : "bg-card-border"}`} />
          ))}
        </div>
        <button onClick={() => isLast ? onComplete() : setStep(s => s + 1)}
          className="flex h-12 w-full items-center justify-center rounded-xl bg-accent text-base font-bold text-white transition hover:bg-accent-hover">
          {isLast ? "ロープレを始める" : "次へ"}
        </button>
        {!isLast && (
          <button onClick={onComplete} className="mt-3 text-xs text-muted hover:text-foreground">
            スキップ
          </button>
        )}
      </div>
    </div>
  );
}
