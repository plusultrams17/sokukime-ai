"use client";

import { useState, useRef, useEffect, use } from "react";
import Link from "next/link";
import { getChallenge } from "@/lib/challenges";
import { Header } from "@/components/header";

interface ChallengeResult {
  score: number;
  feedback: string;
  modelAnswer: string;
  techniques: { name: string; detected: boolean }[];
}

export default function ChallengePlayPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const challenge = getChallenge(id);

  const [phase, setPhase] = useState<"intro" | "play" | "scoring" | "result">(
    "intro"
  );
  const [response, setResponse] = useState("");
  const [timeLeft, setTimeLeft] = useState(60);
  const [result, setResult] = useState<ChallengeResult | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const startTimeRef = useRef(0);
  const responseRef = useRef("");

  // Keep responseRef in sync
  useEffect(() => {
    responseRef.current = response;
  }, [response]);

  // Cleanup timer
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  function startChallenge() {
    setPhase("play");
    setTimeLeft(60);
    startTimeRef.current = Date.now();
    timerRef.current = setInterval(() => {
      const elapsed = Math.floor(
        (Date.now() - startTimeRef.current) / 1000
      );
      const remaining = Math.max(0, 60 - elapsed);
      setTimeLeft(remaining);
      if (remaining <= 0) {
        if (timerRef.current) clearInterval(timerRef.current);
        handleSubmit(responseRef.current);
      }
    }, 200);
    setTimeout(() => inputRef.current?.focus(), 100);
  }

  async function handleSubmit(text?: string) {
    if (timerRef.current) clearInterval(timerRef.current);
    const finalText = (text ?? response).trim();
    if (!finalText) {
      setResponse("（時間切れ）");
    }
    setPhase("scoring");
    const timeUsed = 60 - timeLeft;

    try {
      const res = await fetch("/api/challenge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          challengeId: id,
          response: finalText || "（時間切れ）",
          timeUsed,
        }),
      });
      const data = await res.json();
      if (data.error) {
        setResult({
          score: 0,
          feedback: data.error,
          modelAnswer: "",
          techniques: [],
        });
      } else {
        setResult(data);
      }
    } catch {
      setResult({
        score: 40,
        feedback: "採点中にエラーが発生しました。",
        modelAnswer: "もう一度お試しください。",
        techniques: [],
      });
    }
    setPhase("result");
  }

  if (!challenge) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <p className="mb-4 text-lg font-bold text-foreground">
            チャレンジが見つかりません
          </p>
          <Link href="/challenge" className="text-accent hover:underline">
            一覧に戻る
          </Link>
        </div>
      </div>
    );
  }

  // Timer color
  const timerColor =
    timeLeft > 30
      ? "text-green-400"
      : timeLeft > 10
        ? "text-yellow-400"
        : "text-red-400";
  const timerBg =
    timeLeft > 30
      ? "bg-green-400"
      : timeLeft > 10
        ? "bg-yellow-400"
        : "bg-red-400";

  // Score color helper
  const getScoreColor = (s: number) =>
    s >= 80
      ? "text-green-400"
      : s >= 60
        ? "text-yellow-400"
        : s >= 40
          ? "text-orange-400"
          : "text-red-400";

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="mx-auto max-w-2xl px-6 pt-24 pb-16 sm:pt-28">
        {/* INTRO phase */}
        {phase === "intro" && (
          <div className="animate-fade-in-up space-y-6">
            <div className="text-center">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-bold text-accent">
                60秒チャレンジ
              </div>
              <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
                {challenge.title}
              </h1>
            </div>

            <div className="rounded-2xl border border-card-border bg-card p-6">
              <p className="mb-2 text-xs font-bold text-muted">
                シチュエーション
              </p>
              <p className="mb-4 text-sm leading-relaxed text-foreground">
                {challenge.context}
              </p>

              <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 px-4 py-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-500/20">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#60a5fa"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                  <div>
                    <p className="mb-1 text-xs font-bold text-blue-400">
                      お客さん
                    </p>
                    <p className="text-base font-medium text-foreground">
                      「{challenge.customerLine}」
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-accent/20 bg-accent/5 p-6 text-center">
              <p className="mb-1 text-sm text-muted">制限時間</p>
              <p className="mb-2 text-4xl font-black text-accent">
                60<span className="text-lg">秒</span>
              </p>
              <p className="mb-4 text-xs text-muted">
                1回の返答で、お客さんの心を動かせ。
              </p>
              <button
                onClick={startChallenge}
                className="inline-flex h-12 items-center justify-center rounded-xl bg-accent px-8 text-base font-bold text-white transition hover:bg-accent-hover"
              >
                チャレンジ開始
              </button>
            </div>
          </div>
        )}

        {/* PLAY phase */}
        {phase === "play" && (
          <div className="animate-fade-in-up space-y-6">
            {/* Timer */}
            <div className="text-center">
              <p className={`text-5xl font-black tabular-nums ${timerColor}`}>
                {timeLeft}
              </p>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-card-border">
                <div
                  className={`h-full rounded-full transition-all duration-200 ${timerBg}`}
                  style={{ width: `${(timeLeft / 60) * 100}%` }}
                />
              </div>
            </div>

            {/* Customer line */}
            <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 px-4 py-3">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-500/20">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#60a5fa"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <div>
                  <p className="mb-1 text-xs font-bold text-blue-400">
                    お客さん
                  </p>
                  <p className="text-sm text-foreground">
                    「{challenge.customerLine}」
                  </p>
                </div>
              </div>
            </div>

            {/* Input */}
            <div>
              <label className="mb-2 block text-xs font-bold text-muted">
                あなたの切り返し:
              </label>
              <textarea
                ref={inputRef}
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                placeholder="ここに返答を入力してください..."
                rows={5}
                className="w-full resize-none rounded-xl border border-card-border bg-card px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted/50 focus:border-accent"
              />
            </div>

            <button
              onClick={() => handleSubmit()}
              disabled={!response.trim()}
              className="h-12 w-full rounded-xl bg-accent text-base font-bold text-white transition hover:bg-accent-hover disabled:opacity-40"
            >
              この返答で勝負する
            </button>
          </div>
        )}

        {/* SCORING phase */}
        {phase === "scoring" && (
          <div className="animate-fade-in-up flex flex-col items-center justify-center py-20">
            <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-accent border-t-transparent" />
            <p className="text-lg font-bold text-foreground">採点中...</p>
            <p className="mt-1 text-sm text-muted">
              あなたの切り返しをAIが分析しています
            </p>
          </div>
        )}

        {/* RESULT phase */}
        {phase === "result" && result && (
          <div className="animate-fade-in-up space-y-6">
            {/* Score */}
            <div className="rounded-2xl border border-card-border bg-card p-8 text-center">
              <p className="mb-2 text-sm text-muted">あなたのスコア</p>
              <p
                className={`text-6xl font-black ${getScoreColor(result.score)}`}
              >
                {result.score}
              </p>
              <p className="text-lg font-bold text-muted/50">/ 100</p>
            </div>

            {/* Techniques detected */}
            {result.techniques.length > 0 && (
              <div className="rounded-2xl border border-card-border bg-card p-6">
                <h3 className="mb-3 text-sm font-medium text-muted">
                  検出テクニック
                </h3>
                <div className="space-y-2">
                  {result.techniques.map((t, i) => (
                    <div
                      key={i}
                      className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm ${t.detected ? "border-green-500/20 bg-green-500/10" : "border-red-500/20 bg-red-500/10"}`}
                    >
                      {t.detected ? (
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#22c55e"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      ) : (
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#ef4444"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      )}
                      <span
                        className={
                          t.detected ? "text-green-400" : "text-red-400"
                        }
                      >
                        {t.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Feedback */}
            <div className="rounded-2xl border border-card-border bg-card p-6">
              <h3 className="mb-3 text-sm font-medium text-muted">
                フィードバック
              </h3>
              <p className="text-sm leading-relaxed text-foreground">
                {result.feedback}
              </p>
            </div>

            {/* Model Answer */}
            {result.modelAnswer && (
              <div className="rounded-2xl border border-accent/20 bg-accent/5 p-6">
                <h3 className="mb-3 text-sm font-medium text-accent">
                  模範トーク
                </h3>
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                  {result.modelAnswer}
                </p>
              </div>
            )}

            {/* Share + CTAs */}
            <div className="space-y-3">
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`60秒チャレンジ「${challenge.title}」で${result.score}点取った！ #成約コーチAI #営業`)}&url=${encodeURIComponent("https://seiyaku-coach.vercel.app/challenge")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-[#1DA1F2]/20 bg-[#1DA1F2]/10 text-sm font-bold text-[#1DA1F2] transition hover:bg-[#1DA1F2]/20"
              >
                Xでシェアする
              </a>
              <div className="grid grid-cols-2 gap-3">
                <Link
                  href="/try-roleplay"
                  className="flex h-12 items-center justify-center rounded-xl bg-accent text-sm font-bold text-white transition hover:bg-accent-hover"
                >
                  フル商談に挑戦
                </Link>
                <Link
                  href="/challenge"
                  className="flex h-12 items-center justify-center rounded-xl border border-card-border bg-card text-sm font-bold text-foreground transition hover:bg-card-border"
                >
                  別の問題に挑戦
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
