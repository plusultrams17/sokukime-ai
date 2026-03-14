"use client";

import { useState, useRef, useEffect } from "react";
import type { ScoreResult } from "./page";

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
  onFinish: (score: ScoreResult) => void;
  isGuest?: boolean;
  onAuthGate?: (messages: Message[]) => void;
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

export function ChatUI({ industry, product, difficulty, scene, customerType, onFinish, isGuest, onAuthGate }: ChatUIProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [turnCount, setTurnCount] = useState(0);
  const [isScoring, setIsScoring] = useState(false);
  const [coach, setCoach] = useState<CoachData | null>(null);
  const [showCoach, setShowCoach] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const maxTurns = 10;

  useEffect(() => {
    startConversation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function startConversation() {
    setIsLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [],
          industry,
          product,
          difficulty,
          scene,
          customerType,
          isFirstMessage: true,
        }),
      });
      const data = await res.json();
      setMessages([{ role: "assistant", content: data.message }]);
      // Initial coach tip
      setCoach({
        currentStep: "アプローチ",
        stepNumber: 1,
        detectedTechniques: [],
        nextTip: "まずは相手を褒めて心理的安全の確保をしましょう。2度褒めが理想。その後「前提設定」でYESを取ります",
        examplePhrase: "素敵な会社ですね！今まで○社伺いましたがダントツです。ところで、もしお話聞いて気に入らなかったら断ってくださいね。気に入ったらぜひスタートしてください！",
      });
    } catch {
      setMessages([
        {
          role: "assistant",
          content:
            "こんにちは。お電話ありがとうございます。どのようなご用件でしょうか？",
        },
      ]);
    }
    setIsLoading(false);
  }

  async function fetchCoach(allMessages: Message[]) {
    try {
      const res = await fetch("/api/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: allMessages, industry, product, customerType, scene }),
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
    setTurnCount((c) => c + 1);
    setIsLoading(true);

    // Fetch customer response and coach analysis in parallel
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
    if (isGuest && onAuthGate) {
      onAuthGate(messages);
      return;
    }
    setIsScoring(true);
    try {
      const res = await fetch("/api/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages, industry, product, difficulty, scene, customerType }),
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
    <div className="flex flex-1 overflow-hidden">
      {/* Main chat area */}
      <div className="flex flex-1 flex-col">
        {/* Step progress bar - sticky */}
        <div className="sticky top-0 z-30 border-b border-card-border bg-card px-4 py-2">
          <div className="mx-auto max-w-3xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted">
                {sceneLabels[scene] || "🏠 訪問営業"} │ {product} → {industry}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted">
                  ターン {turnCount}/{maxTurns}
                </span>
                <button
                  onClick={() => setShowCoach(!showCoach)}
                  className={`rounded px-2 py-0.5 text-xs transition ${
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
                  className={`flex-1 rounded-full py-0.5 text-center text-[10px] font-medium transition ${
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
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <div className="mx-auto max-w-3xl space-y-5">
            {/* Scenario intro */}
            {messages.length > 0 && (
              <div className="animate-fade-in-up rounded-xl border border-card-border bg-card/50 px-4 py-3 text-center text-xs text-muted">
                {sceneLabels[scene] || "🏠"} ロープレ開始 ─ あなたは<span className="font-bold text-accent">営業マン</span>。<span className="font-bold text-blue-400">{industry || "お客さん"}</span>に{product}を提案してください。
              </div>
            )}

            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex animate-fade-in-up gap-3 ${
                  msg.role === "user" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                {/* Avatar */}
                <div
                  className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-sm ${
                    msg.role === "user"
                      ? "bg-accent/20 text-accent"
                      : "bg-blue-500/20 text-blue-400"
                  }`}
                >
                  {msg.role === "user" ? "🔥" : "👤"}
                </div>

                {/* Bubble */}
                <div className={`max-w-[75%] ${msg.role === "user" ? "text-right" : "text-left"}`}>
                  <div
                    className={`mb-1 text-[11px] font-bold ${
                      msg.role === "user" ? "text-accent" : "text-blue-400"
                    }`}
                  >
                    {msg.role === "user" ? "あなた（営業マン）" : "お客さん"}
                  </div>
                  <div
                    className={`inline-block rounded-2xl px-4 py-3 text-sm leading-relaxed ${
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
              <div className="flex animate-fade-in-up gap-3">
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-sm text-blue-400">
                  👤
                </div>
                <div>
                  <div className="mb-1 text-[11px] font-bold text-blue-400">
                    お客さん
                  </div>
                  <div className="inline-block rounded-2xl border border-card-border bg-card px-4 py-3">
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

        {/* Mobile coach (above input) */}
        {showCoach && coach && (
          <div className="border-t border-accent/20 bg-card/80 px-4 py-2 md:hidden">
            <div className="mx-auto max-w-3xl">
              <div className="mb-1 flex items-center justify-between">
                <span className="text-xs font-medium text-accent">
                  🎓 {coach.stepNumber}. {coach.currentStep}
                </span>
                {coach.detectedTechniques.length > 0 && (
                  <div className="flex gap-1">
                    {coach.detectedTechniques.map((t, i) => (
                      <span key={i} className="text-xs">
                        {qualityIcon(t.quality)}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <p className="mb-1 text-xs leading-relaxed text-muted">
                💡 {coach.nextTip}
              </p>
              <div className="flex items-center gap-2">
                <p className="flex-1 truncate text-xs font-medium text-accent">
                  🗣️ {coach.examplePhrase}
                </p>
                <button
                  onClick={() => {
                    setInput(coach.examplePhrase);
                    inputRef.current?.focus();
                  }}
                  className="flex-shrink-0 rounded bg-accent/10 px-2 py-0.5 text-[10px] font-medium text-accent"
                >
                  コピー
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Input area */}
        <div className="border-t border-card-border bg-background px-4 py-4">
          <div className="mx-auto max-w-3xl">
            {turnCount >= maxTurns ? (
              <button
                onClick={finishAndScore}
                disabled={isScoring}
                className="flex h-12 w-full items-center justify-center rounded-xl bg-accent text-base font-bold text-white transition hover:bg-accent-hover disabled:opacity-60"
              >
                {isScoring ? "📊 採点中..." : "📊 商談を終了して採点する"}
              </button>
            ) : (
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="営業トークを入力... (Enterで送信)"
                    rows={1}
                    className="w-full resize-none rounded-xl border border-card-border bg-card px-4 py-3 text-sm outline-none placeholder:text-muted/50 focus:border-accent"
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
                className="mt-2 w-full text-center text-xs text-muted transition hover:text-accent"
              >
                {isScoring ? "採点中..." : "途中で商談を終了して採点する →"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Coach Panel (right sidebar) */}
      {showCoach && coach && (
        <div className="hidden w-80 flex-shrink-0 self-start sticky top-14 max-h-[calc(100vh-3.5rem)] overflow-y-auto border-l border-card-border bg-card/50 p-4 md:block">
          <div className="space-y-4">
            {/* Current Step */}
            <div className="rounded-xl border border-accent/30 bg-accent/5 p-4">
              <div className="mb-1 flex items-center gap-2">
                <span className="text-lg">🎓</span>
                <span className="text-xs font-medium text-accent">
                  現在のステップ
                </span>
              </div>
              <div className="text-lg font-bold">
                {coach.stepNumber}. {coach.currentStep}
              </div>
            </div>

            {/* Detected Techniques */}
            {coach.detectedTechniques.length > 0 && (
              <div className="rounded-xl border border-card-border p-4">
                <div className="mb-2 text-xs font-medium text-muted">
                  検出されたテクニック
                </div>
                <div className="space-y-2">
                  {coach.detectedTechniques.map((t, i) => (
                    <div
                      key={i}
                      className={`rounded-lg p-2 text-xs ${
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
            <div className="rounded-xl border border-card-border p-4">
              <div className="mb-2 text-xs font-medium text-muted">
                💡 次に使うべきテクニック
              </div>
              <p className="text-sm leading-relaxed">{coach.nextTip}</p>
            </div>

            {/* Example Phrase */}
            <div className="rounded-xl border border-accent/20 bg-accent/5 p-4">
              <div className="mb-2 text-xs font-medium text-accent">
                🗣️ トーク例（コピーして使ってOK）
              </div>
              <p className="text-sm leading-relaxed font-medium">
                {coach.examplePhrase}
              </p>
              <button
                onClick={() => {
                  setInput(coach.examplePhrase);
                  inputRef.current?.focus();
                }}
                className="mt-2 rounded-lg bg-accent/10 px-3 py-1 text-xs font-medium text-accent transition hover:bg-accent/20"
              >
                ← 入力欄にコピー
              </button>
            </div>

            {/* 5 Step Reference */}
            <div className="rounded-xl border border-card-border p-4">
              <div className="mb-2 text-xs font-medium text-muted">
                📖 営業5ステップ
              </div>
              <div className="space-y-1 text-[11px]">
                {STEPS.map((s) => (
                  <div
                    key={s.num}
                    className={`flex items-center gap-2 rounded px-2 py-1 ${
                      coach.stepNumber === s.num
                        ? "bg-accent/10 text-accent font-medium"
                        : "text-muted"
                    }`}
                  >
                    <span className="w-3">{s.num}</span>
                    <span>{s.name}</span>
                    {coach.stepNumber === s.num && (
                      <span className="ml-auto">← 今ここ</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
