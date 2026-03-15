"use client";

import { useState, useRef, useEffect } from "react";
import type { ScoreResult } from "./page";
import {
  trackRoleplayMessage,
  trackRoleplayCoachToggled,
  trackRoleplayScoreRequested,
} from "@/lib/tracking";

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

interface CoachData {
  currentStep: string;
  stepNumber: number;
  detectedTechniques: {
    name: string;
    quote: string;
    quality: "good" | "ok" | "missed";
  }[];
  nextTip: string;
  examplePhrase: string;
}

interface ChatUIProps {
  industry: string;
  product: string;
  difficulty: string;
  scene: string;
  customerType: string;
  productContext?: string;
  customerContext?: string;
  onFinish: (score: ScoreResult) => void;
  isGuest?: boolean;
  onAuthGate?: (messages: Message[], previewScore?: ScoreResult) => void;
}

const STEPS = [
  { num: 1, name: "アプローチ", short: "AP" },
  { num: 2, name: "ヒアリング", short: "HR" },
  { num: 3, name: "プレゼン", short: "PR" },
  { num: 4, name: "クロージング", short: "CL" },
  { num: 5, name: "反論処理", short: "反論" },
];

const sceneLabels: Record<string, string> = {
  phone: "📞 電話営業",
  visit: "🏠 訪問営業",
  inbound: "📩 問い合わせ対応",
};

const sceneHints: Record<string, string> = {
  phone: "電話をかけるところから始めてみましょう",
  visit: "お客さんの玄関先・受付での第一声から始めてみましょう",
  inbound: "お問い合わせへの返答から始めてみましょう",
};

const STEP_LESSON_MAP: Record<number, { slug: string; label: string }> = {
  1: { slug: "premise-setting", label: "前提設定（先回りトーク）" },
  2: { slug: "drawer-phrases", label: "引き出しフレーズ（ニーズ発掘）" },
  3: { slug: "benefit-method", label: "利点話法（SP→ベネフィット変換）" },
  4: { slug: "closing-intro", label: "クロージング概論" },
  5: { slug: "rebuttal-pattern", label: "切り返しの型（共通フレームワーク）" },
};

export function ChatUI({ industry, product, difficulty, scene, customerType, productContext, customerContext, onFinish, isGuest, onAuthGate }: ChatUIProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [turnCount, setTurnCount] = useState(0);
  const [isScoring, setIsScoring] = useState(false);
  const [coach, setCoach] = useState<CoachData | null>(null);
  const [showCoach, setShowCoach] = useState(true);
  const [showNudge, setShowNudge] = useState(false);
  const nudgeShownRef = useRef(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const maxTurns = 10;
  const chatStartTime = useRef(Date.now());

  // Idle detection — show learning nudge after 30s of inactivity
  useEffect(() => {
    if (nudgeShownRef.current || isLoading || messages.length === 0 || input.length > 0) return;
    const timer = setTimeout(() => {
      if (!nudgeShownRef.current) {
        setShowNudge(true);
        nudgeShownRef.current = true;
      }
    }, 30_000);
    return () => clearTimeout(timer);
  }, [messages, isLoading, input]);

  // User speaks first — set initial coach data and focus input
  useEffect(() => {
    setCoach({
      currentStep: "アプローチ",
      stepNumber: 1,
      detectedTechniques: [],
      nextTip: "まずは相手を褒めて心理的安全の確保をしましょう。2度褒めが理想。その後「前提設定」でYESを取ります",
      examplePhrase: "素敵な会社ですね！今まで○社伺いましたがダントツです。ところで、もしお話聞いて気に入らなかったら断ってくださいね。気に入ったらぜひスタートしてください！",
    });
    setTimeout(() => inputRef.current?.focus(), 300);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function fetchCoach(allMessages: Message[]) {
    try {
      const res = await fetch("/api/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: allMessages, industry, product, customerType, scene, difficulty, productContext, customerContext }),
      });
      const data = await res.json();
      setCoach(data);
    } catch {
      // Keep previous coach data
    }
  }

  async function sendMessage() {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    const newMessages: Message[] = [
      ...messages,
      { role: "user", content: userMessage },
    ];
    setMessages(newMessages);
    const newTurn = turnCount + 1;
    setTurnCount(newTurn);
    trackRoleplayMessage(newTurn, userMessage.length);
    setIsLoading(true);

    // Fetch customer response
    const [chatRes] = await Promise.all([
      fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages,
          industry,
          product,
          difficulty,
          scene,
          customerType,
          productContext,
          customerContext,
          isFirstMessage: false,
        }),
      }).then((r) => r.json()).catch(() => ({ message: "（通信エラー）" })),
    ]);

    const finalMessages: Message[] = [
      ...newMessages,
      { role: "assistant", content: chatRes.message },
    ];
    setMessages(finalMessages);
    setIsLoading(false);

    // Fetch coach after messages update (non-blocking)
    fetchCoach(finalMessages);

    inputRef.current?.focus();
  }

  async function finishAndScore() {
    const durationSec = Math.round((Date.now() - chatStartTime.current) / 1000);
    trackRoleplayScoreRequested(turnCount, durationSec);

    if (isGuest && onAuthGate) {
      setIsScoring(true);
      try {
        const res = await fetch("/api/score/preview", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages, industry, product, difficulty, scene, customerType, productContext, customerContext }),
        });
        const data = await res.json();
        if (!data.error) {
          onAuthGate(messages, data);
        } else {
          onAuthGate(messages);
        }
      } catch {
        onAuthGate(messages);
      }
      setIsScoring(false);
      return;
    }
    setIsScoring(true);
    try {
      const res = await fetch("/api/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages, industry, product, difficulty, scene, customerType, productContext, customerContext }),
      });
      const data = await res.json();
      onFinish(data);
    } catch {
      onFinish({
        overall: 50,
        categories: [
          { name: "アプローチ", score: 50, feedback: "採点中にエラーが発生しました" },
        ],
        summary: "採点中にエラーが発生しました。もう一度お試しください。",
        strengths: [],
        improvements: [],
      });
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  const qualityIcon = (q: string) => {
    if (q === "good") return "✅";
    if (q === "ok") return "🟡";
    return "❌";
  };

  return (
    <div className="flex flex-1 flex-col md:flex-row overflow-hidden">
      {/* Main chat area */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Step progress bar - sticky */}
        <div className="sticky top-0 z-30 border-b border-card-border bg-card px-3 py-2 sm:px-4">
          <div className="mx-auto max-w-3xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] sm:text-xs text-muted truncate mr-2">
                {sceneLabels[scene] || "🏠 訪問営業"} │ {product} → {industry}
              </span>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-[11px] sm:text-xs text-muted">
                  {turnCount}/{maxTurns}
                </span>
                <button
                  onClick={() => {
                    const next = !showCoach;
                    setShowCoach(next);
                    trackRoleplayCoachToggled(next);
                  }}
                  className={`rounded px-2 py-0.5 text-[11px] sm:text-xs transition ${
                    showCoach
                      ? "bg-accent/20 text-accent"
                      : "bg-card-border text-muted"
                  }`}
                >
                  🎓 コーチ {showCoach ? "ON" : "OFF"}
                </button>
              </div>
            </div>
            {/* 5-step progress */}
            <div className="flex gap-1">
              {STEPS.map((step) => (
                <div
                  key={step.num}
                  className={`flex-1 rounded-full py-0.5 text-center text-[10px] sm:text-[11px] font-medium transition ${
                    coach && coach.stepNumber === step.num
                      ? "bg-accent text-white"
                      : coach && coach.stepNumber > step.num
                      ? "bg-accent/30 text-accent"
                      : "bg-card-border text-muted/50"
                  }`}
                >
                  <span className="hidden sm:inline">{step.name}</span>
                  <span className="sm:hidden">{step.short}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-3 py-4 sm:px-4 sm:py-6">
          <div className="mx-auto max-w-3xl space-y-4 sm:space-y-5">
            {/* First turn guide — user starts the conversation */}
            {messages.length === 0 && !isLoading && (
              <div className="animate-fade-in-up space-y-4 sm:space-y-5">
                <div className="rounded-xl border border-card-border bg-card/50 px-4 py-3 text-center text-xs sm:text-sm text-muted">
                  {sceneLabels[scene] || "🏠"} ロープレ開始 ─ あなたは<span className="font-bold text-accent">営業マン</span>です。<span className="font-bold text-blue-400">{industry || "お客さん"}</span>に{product}を提案してください。
                </div>
                <div className="rounded-xl border border-accent/30 bg-accent/5 px-4 py-4 sm:px-5 sm:py-5 text-center">
                  <div className="mb-2 text-2xl sm:text-3xl">🎤</div>
                  <p className="text-sm sm:text-base font-bold text-foreground mb-1">
                    あなたの第一声からスタートです！
                  </p>
                  <p className="text-xs sm:text-sm text-muted">
                    {sceneHints[scene] || "自由に営業トークを始めてみましょう"}
                  </p>
                </div>
              </div>
            )}

            {/* Scenario intro (after first message) */}
            {messages.length > 0 && (
              <div className="animate-fade-in-up rounded-xl border border-card-border bg-card/50 px-3 py-2 sm:px-4 sm:py-3 text-center text-[11px] sm:text-xs text-muted">
                {sceneLabels[scene] || "🏠"} ロープレ中 ─ <span className="font-bold text-accent">営業マン</span> vs <span className="font-bold text-blue-400">{industry || "お客さん"}</span>
              </div>
            )}

            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex animate-fade-in-up gap-2 sm:gap-3 ${
                  msg.role === "user" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                {/* Avatar */}
                <div
                  className={`flex h-8 w-8 sm:h-9 sm:w-9 flex-shrink-0 items-center justify-center rounded-full text-xs sm:text-sm ${
                    msg.role === "user"
                      ? "bg-accent/20 text-accent"
                      : "bg-blue-500/20 text-blue-400"
                  }`}
                >
                  {msg.role === "user" ? "🔥" : "👤"}
                </div>

                {/* Bubble */}
                <div className={`max-w-[80%] sm:max-w-[75%] ${msg.role === "user" ? "text-right" : "text-left"}`}>
                  <div
                    className={`mb-1 text-[11px] sm:text-xs font-bold ${
                      msg.role === "user" ? "text-accent" : "text-blue-400"
                    }`}
                  >
                    {msg.role === "user" ? "あなた（営業マン）" : "お客さん"}
                  </div>
                  <div
                    className={`inline-block rounded-2xl px-3 py-2.5 sm:px-4 sm:py-3 text-[13px] sm:text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-accent text-white"
                        : "border border-card-border bg-card text-foreground"
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{msg.content}</div>
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex animate-fade-in-up gap-2 sm:gap-3">
                <div className="flex h-8 w-8 sm:h-9 sm:w-9 flex-shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-xs sm:text-sm text-blue-400">
                  👤
                </div>
                <div>
                  <div className="mb-1 text-[11px] sm:text-xs font-bold text-blue-400">
                    お客さん
                  </div>
                  <div className="inline-block rounded-2xl border border-card-border bg-card px-3 py-2.5 sm:px-4 sm:py-3">
                    <div className="flex gap-1.5">
                      <div className="typing-dot h-2 w-2 rounded-full bg-muted" />
                      <div className="typing-dot h-2 w-2 rounded-full bg-muted" />
                      <div className="typing-dot h-2 w-2 rounded-full bg-muted" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Mobile coach (above input) — larger text */}
        {showCoach && coach && (
          <div className="border-t border-accent/20 bg-card/80 px-3 py-3 sm:px-4 md:hidden">
            <div className="mx-auto max-w-3xl">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-bold text-accent">
                  🎓 {coach.stepNumber}. {coach.currentStep}
                </span>
                {coach.detectedTechniques.length > 0 && (
                  <div className="flex gap-1.5">
                    {coach.detectedTechniques.map((t, i) => (
                      <span key={i} className="text-sm" title={t.name}>
                        {qualityIcon(t.quality)}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              {coach.detectedTechniques.length > 0 && (
                <div className="mb-2 space-y-1.5">
                  {coach.detectedTechniques.map((t, i) => (
                    <div
                      key={i}
                      className={`rounded-lg px-2.5 py-1.5 text-xs ${
                        t.quality === "good"
                          ? "bg-green-500/10 border border-green-500/20"
                          : t.quality === "ok"
                          ? "bg-yellow-500/10 border border-yellow-500/20"
                          : "bg-red-500/10 border border-red-500/20"
                      }`}
                    >
                      {qualityIcon(t.quality)} {t.name}
                      {t.quote && <span className="text-muted ml-1">&ldquo;{t.quote}&rdquo;</span>}
                    </div>
                  ))}
                </div>
              )}
              <p className="mb-2 text-sm leading-relaxed text-muted">
                💡 {coach.nextTip}
              </p>
              <div className="flex items-start gap-2 rounded-lg bg-accent/5 border border-accent/20 px-3 py-2">
                <p className="flex-1 text-sm font-medium text-accent leading-relaxed">
                  🗣️ {coach.examplePhrase}
                </p>
                <button
                  onClick={() => {
                    setInput(coach.examplePhrase);
                    inputRef.current?.focus();
                  }}
                  className="flex-shrink-0 rounded bg-accent/10 px-2.5 py-1 text-xs font-medium text-accent"
                >
                  コピー
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Learning nudge banner — shown after 30s idle */}
        {showNudge && (
          <div className="animate-fade-in-up border-t border-yellow-500/30 bg-yellow-500/5 px-3 py-3 sm:px-4 sm:py-4">
            <div className="mx-auto max-w-3xl flex items-start gap-3">
              <span className="text-xl sm:text-2xl flex-shrink-0 mt-0.5">💡</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm sm:text-base font-bold text-foreground mb-1">
                  行き詰まっていますか？
                </p>
                <p className="text-xs sm:text-sm text-muted mb-3">
                  言葉が出てこないときは、学習ステップを確認してから戻ってくると効果的です
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <a
                    href={`/learn/${STEP_LESSON_MAP[coach?.stepNumber ?? 1]?.slug ?? "premise-setting"}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-3.5 py-2 text-xs sm:text-sm font-bold text-white transition hover:bg-accent-hover"
                  >
                    📖 「{STEP_LESSON_MAP[coach?.stepNumber ?? 1]?.label ?? "前提設定"}」を学ぶ
                  </a>
                  <a
                    href="/learn"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 rounded-lg border border-card-border px-3 py-2 text-xs sm:text-sm font-medium text-muted transition hover:text-foreground"
                  >
                    全レッスン一覧
                  </a>
                  <button
                    onClick={() => setShowNudge(false)}
                    className="ml-auto text-xs text-muted transition hover:text-foreground"
                  >
                    閉じる
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Input area */}
        <div className="border-t border-card-border bg-background px-3 py-3 sm:px-4 sm:py-4">
          <div className="mx-auto max-w-3xl">
            {turnCount >= maxTurns ? (
              <button
                onClick={finishAndScore}
                disabled={isScoring}
                className="flex h-12 w-full items-center justify-center rounded-xl bg-accent text-sm sm:text-base font-bold text-white transition hover:bg-accent-hover disabled:opacity-60"
              >
                {isScoring ? "📊 採点中..." : "📊 商談を終了して採点する"}
              </button>
            ) : (
              <div className="flex gap-2 sm:gap-3">
                <div className="relative flex-1">
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={messages.length === 0 ? "第一声を入力してください... (Enterで送信)" : "営業トークを入力... (Enterで送信)"}
                    rows={1}
                    className="w-full resize-none rounded-xl border border-card-border bg-card px-3 py-3 sm:px-4 text-sm outline-none placeholder:text-muted/50 focus:border-accent"
                  />
                </div>
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || isLoading}
                  className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-accent text-white transition hover:bg-accent-hover disabled:opacity-40"
                >
                  ↑
                </button>
              </div>
            )}
            {turnCount > 0 && turnCount < maxTurns && (
              <button
                onClick={finishAndScore}
                disabled={isScoring}
                className="mt-2 w-full text-center text-xs sm:text-sm text-muted transition hover:text-accent"
              >
                {isScoring ? "採点中..." : "途中で商談を終了して採点する →"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Coach Panel (right sidebar) — larger text on desktop */}
      {showCoach && coach && (
        <div className="hidden w-80 lg:w-96 flex-shrink-0 md:flex flex-col border-l border-card-border bg-card/50 overflow-y-auto">
          <div className="mt-auto p-5">
          <div className="space-y-5">
            {/* Current Step */}
            <div className="rounded-xl border border-accent/30 bg-accent/5 p-5">
              <div className="mb-1 flex items-center gap-2">
                <span className="text-xl">🎓</span>
                <span className="text-sm font-medium text-accent">
                  現在のステップ
                </span>
              </div>
              <div className="text-xl font-bold">
                {coach.stepNumber}. {coach.currentStep}
              </div>
            </div>

            {/* Detected Techniques */}
            {coach.detectedTechniques.length > 0 && (
              <div className="rounded-xl border border-card-border p-5">
                <div className="mb-3 text-sm font-medium text-muted">
                  検出されたテクニック
                </div>
                <div className="space-y-2.5">
                  {coach.detectedTechniques.map((t, i) => (
                    <div
                      key={i}
                      className={`rounded-lg p-3 text-sm ${
                        t.quality === "good"
                          ? "bg-green-500/10 border border-green-500/20"
                          : t.quality === "ok"
                          ? "bg-yellow-500/10 border border-yellow-500/20"
                          : "bg-red-500/10 border border-red-500/20"
                      }`}
                    >
                      <div className="mb-1 font-medium">
                        {qualityIcon(t.quality)} {t.name}
                      </div>
                      {t.quote && (
                        <div className="text-muted italic">
                          &ldquo;{t.quote}&rdquo;
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Next Tip */}
            <div className="rounded-xl border border-card-border p-5">
              <div className="mb-2 text-sm font-medium text-muted">
                💡 次に使うべきテクニック
              </div>
              <p className="text-base leading-relaxed">{coach.nextTip}</p>
            </div>

            {/* Example Phrase */}
            <div className="rounded-xl border border-accent/20 bg-accent/5 p-5">
              <div className="mb-2 text-sm font-medium text-accent">
                🗣️ トーク例（コピーして使ってOK）
              </div>
              <p className="text-base leading-relaxed font-medium">
                {coach.examplePhrase}
              </p>
              <button
                onClick={() => {
                  setInput(coach.examplePhrase);
                  inputRef.current?.focus();
                }}
                className="mt-3 rounded-lg bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent transition hover:bg-accent/20"
              >
                ← 入力欄にコピー
              </button>
            </div>

            {/* 5 Step Reference */}
            <div className="rounded-xl border border-card-border p-5">
              <div className="mb-3 text-sm font-medium text-muted">
                📖 営業5ステップ
              </div>
              <div className="space-y-1.5 text-sm">
                {STEPS.map((s) => (
                  <div
                    key={s.num}
                    className={`flex items-center gap-2 rounded px-2.5 py-1.5 ${
                      coach.stepNumber === s.num
                        ? "bg-accent/10 text-accent font-medium"
                        : "text-muted"
                    }`}
                  >
                    <span className="w-4">{s.num}</span>
                    <span>{s.name}</span>
                    {coach.stepNumber === s.num && (
                      <span className="ml-auto text-xs">← 今ここ</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
          </div>
        </div>
      )}

    </div>
  );
}
