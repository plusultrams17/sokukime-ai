"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import * as THREE from "three";
import Link from "next/link";
import { Header } from "@/components/header";

/* ─── Types ─── */
type Phase = "intro" | "active" | "ended";
type Message = { role: "user" | "assistant"; content: string };

const MAX_TURNS = 8;

/* ═══════════════════════════════════════════════════════════════
   3D SCENE COMPONENTS
═══════════════════════════════════════════════════════════════ */

function Floor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[10, 10]} />
      <meshStandardMaterial color="#a0855b" />
    </mesh>
  );
}

function Walls() {
  return (
    <group>
      {/* Back wall */}
      <mesh position={[0, 2.5, -5]}>
        <boxGeometry args={[10, 5, 0.15]} />
        <meshStandardMaterial color="#e8dcc8" />
      </mesh>
      {/* Left wall */}
      <mesh position={[-5, 2.5, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[10, 5, 0.15]} />
        <meshStandardMaterial color="#ddd0bc" />
      </mesh>
      {/* Right wall */}
      <mesh position={[5, 2.5, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <boxGeometry args={[10, 5, 0.15]} />
        <meshStandardMaterial color="#ddd0bc" />
      </mesh>
    </group>
  );
}

function WindowDecor() {
  return (
    <group position={[-4.9, 2.5, -1.5]} rotation={[0, Math.PI / 2, 0]}>
      {/* Frame bg */}
      <mesh position={[0, 0, -0.01]}>
        <planeGeometry args={[2.15, 1.95]} />
        <meshStandardMaterial color="#f5f0e8" />
      </mesh>
      {/* Sky pane */}
      <mesh>
        <planeGeometry args={[2, 1.8]} />
        <meshStandardMaterial color="#87ceeb" emissive="#4a90d9" emissiveIntensity={0.3} />
      </mesh>
      {/* Cross bars */}
      <mesh position={[0, 0, 0.01]}>
        <boxGeometry args={[2, 0.04, 0.02]} />
        <meshStandardMaterial color="#f5f0e8" />
      </mesh>
      <mesh position={[0, 0, 0.01]}>
        <boxGeometry args={[0.04, 1.8, 0.02]} />
        <meshStandardMaterial color="#f5f0e8" />
      </mesh>
    </group>
  );
}

function Desk() {
  return (
    <group position={[0, 0, -2.5]}>
      {/* Tabletop */}
      <mesh position={[0, 0.75, 0]} castShadow>
        <boxGeometry args={[2.4, 0.07, 1]} />
        <meshStandardMaterial color="#5c4033" />
      </mesh>
      {/* Legs */}
      {(
        [
          [-1.05, 0.37, -0.4],
          [1.05, 0.37, -0.4],
          [-1.05, 0.37, 0.4],
          [1.05, 0.37, 0.4],
        ] as [number, number, number][]
      ).map((p, i) => (
        <mesh key={i} position={p} castShadow>
          <boxGeometry args={[0.06, 0.74, 0.06]} />
          <meshStandardMaterial color="#4a3728" />
        </mesh>
      ))}
      {/* Laptop screen */}
      <mesh position={[0.4, 0.84, -0.15]} rotation={[-0.15, 0, 0]} castShadow>
        <boxGeometry args={[0.45, 0.3, 0.015]} />
        <meshStandardMaterial color="#222" />
      </mesh>
      {/* Laptop base */}
      <mesh position={[0.4, 0.79, 0.08]} castShadow>
        <boxGeometry args={[0.45, 0.015, 0.3]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      {/* Papers */}
      <mesh position={[-0.5, 0.795, 0]} castShadow>
        <boxGeometry args={[0.3, 0.008, 0.4]} />
        <meshStandardMaterial color="#faf8f5" />
      </mesh>
      {/* Pen */}
      <mesh position={[-0.3, 0.8, 0.15]} rotation={[0, 0.3, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.008, 0.008, 0.18, 6]} />
        <meshStandardMaterial color="#1a1a6e" />
      </mesh>
    </group>
  );
}

function Plant() {
  return (
    <group position={[3.5, 0, -4]}>
      {/* Pot */}
      <mesh position={[0, 0.3, 0]} castShadow>
        <cylinderGeometry args={[0.18, 0.22, 0.5, 8]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      {/* Leaves */}
      <mesh position={[0, 0.85, 0]} castShadow>
        <sphereGeometry args={[0.4, 8, 8]} />
        <meshStandardMaterial color="#2d5a27" />
      </mesh>
    </group>
  );
}

/* ─── Customer Avatar ─── */

function CustomerAvatar({ talking }: { talking: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    groupRef.current.position.y = Math.sin(clock.elapsedTime * 1.5) * 0.008;
    if (headRef.current) {
      headRef.current.rotation.x = talking
        ? Math.sin(clock.elapsedTime * 3) * 0.06
        : Math.sin(clock.elapsedTime * 0.5) * 0.02;
    }
  });

  const chairLegs: [number, number, number][] = [
    [-0.2, 0.22, -0.2],
    [0.2, 0.22, -0.2],
    [-0.2, 0.22, 0.2],
    [0.2, 0.22, 0.2],
  ];

  return (
    <group ref={groupRef} position={[0, 0, -3.5]}>
      {/* Chair seat */}
      <mesh position={[0, 0.45, 0]} castShadow>
        <boxGeometry args={[0.5, 0.05, 0.5]} />
        <meshStandardMaterial color="#1a1a2e" />
      </mesh>
      {/* Chair back */}
      <mesh position={[0, 0.85, -0.23]} castShadow>
        <boxGeometry args={[0.5, 0.8, 0.05]} />
        <meshStandardMaterial color="#1a1a2e" />
      </mesh>
      {/* Chair legs */}
      {chairLegs.map((p, i) => (
        <mesh key={i} position={p}>
          <boxGeometry args={[0.04, 0.44, 0.04]} />
          <meshStandardMaterial color="#111" />
        </mesh>
      ))}
      {/* Torso */}
      <mesh position={[0, 1.05, -0.05]} castShadow>
        <boxGeometry args={[0.45, 0.55, 0.26]} />
        <meshStandardMaterial color="#1e3a5f" />
      </mesh>
      {/* Head */}
      <mesh ref={headRef} position={[0, 1.52, 0]} castShadow>
        <sphereGeometry args={[0.19, 16, 16]} />
        <meshStandardMaterial color="#deb887" />
      </mesh>
      {/* Hair */}
      <mesh position={[0, 1.62, -0.02]}>
        <sphereGeometry args={[0.17, 12, 6, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#2c1810" />
      </mesh>
      {/* Left arm */}
      <mesh position={[-0.3, 0.92, 0.08]} castShadow>
        <boxGeometry args={[0.12, 0.42, 0.14]} />
        <meshStandardMaterial color="#1e3a5f" />
      </mesh>
      {/* Right arm */}
      <mesh position={[0.3, 0.92, 0.08]} castShadow>
        <boxGeometry args={[0.12, 0.42, 0.14]} />
        <meshStandardMaterial color="#1e3a5f" />
      </mesh>
    </group>
  );
}

/* ─── Speech Bubble (HTML overlay in 3D) ─── */

function SpeechBubble({ text }: { text: string }) {
  if (!text) return null;
  const display = text.length > 100 ? text.slice(0, 100) + "..." : text;
  return (
    <Html position={[0, 2.1, -3.5]} center distanceFactor={3}>
      <div
        className="pointer-events-none relative w-max rounded-2xl bg-white/95 px-5 py-3 text-[26px] font-medium leading-[1.8] text-gray-800 shadow-xl backdrop-blur-sm"
        style={{ maxWidth: "min(560px, 80vw)" }}
      >
        {display}
        <div className="absolute -bottom-3 left-1/2 h-0 w-0 -translate-x-1/2 border-l-[10px] border-r-[10px] border-t-[12px] border-l-transparent border-r-transparent border-t-white/95" />
      </div>
    </Html>
  );
}

/* ─── User's Chair ─── */

function UserChair() {
  const legs: [number, number, number][] = [
    [-0.2, 0.22, -0.2],
    [0.2, 0.22, -0.2],
    [-0.2, 0.22, 0.2],
    [0.2, 0.22, 0.2],
  ];
  return (
    <group position={[0, 0, -1.2]}>
      <mesh position={[0, 0.45, 0]} castShadow>
        <boxGeometry args={[0.5, 0.05, 0.5]} />
        <meshStandardMaterial color="#1a1a2e" />
      </mesh>
      <mesh position={[0, 0.85, 0.23]} castShadow>
        <boxGeometry args={[0.5, 0.8, 0.05]} />
        <meshStandardMaterial color="#1a1a2e" />
      </mesh>
      {legs.map((p, i) => (
        <mesh key={i} position={p}>
          <boxGeometry args={[0.04, 0.44, 0.04]} />
          <meshStandardMaterial color="#111" />
        </mesh>
      ))}
    </group>
  );
}

/* ─── Whiteboard on right wall ─── */

function Whiteboard() {
  return (
    <group position={[4.9, 2.2, -2.5]} rotation={[0, -Math.PI / 2, 0]}>
      <mesh>
        <planeGeometry args={[2, 1.3]} />
        <meshStandardMaterial color="#f8f8f8" />
      </mesh>
      {/* Frame */}
      <mesh position={[0, 0, -0.02]}>
        <planeGeometry args={[2.1, 1.4]} />
        <meshStandardMaterial color="#999" />
      </mesh>
    </group>
  );
}

/* ─── Combined Scene ─── */

function Scene({ talking, latestBubble }: { talking: boolean; latestBubble: string }) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 5, 2]} intensity={0.7} castShadow />
      <pointLight position={[-3, 3, -1]} intensity={0.3} color="#fff5e6" />
      <Floor />
      <Walls />
      <WindowDecor />
      <Desk />
      <Plant />
      <Whiteboard />
      <CustomerAvatar talking={talking} />
      <SpeechBubble text={latestBubble} />
      <UserChair />
      <OrbitControls
        enablePan={false}
        minDistance={2.5}
        maxDistance={6}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2.2}
        target={[0, 1.2, -2.5]}
      />
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════ */

export default function VirtualScene() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [latestBubble, setLatestBubble] = useState("");
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const userTurns = messages.filter((m) => m.role === "user").length;
  const turnsLeft = MAX_TURNS - userTurns;

  /* Timer */
  useEffect(() => {
    if (phase === "active") {
      timerRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase]);

  /* Auto-scroll chat */
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* Start game */
  function handleStart() {
    setPhase("active");
    setMessages([
      {
        role: "assistant",
        content:
          "あ、どうも。今日はわざわざすみませんね。…で、うちにどんな用件ですか？正直あんまり時間ないんで、手短にお願いしますよ。",
      },
    ]);
    setLatestBubble("うちにどんな用件ですか？");
    setTimeout(() => inputRef.current?.focus(), 300);
  }

  /* Send message */
  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || sending || phase !== "active") return;

    const userMsg: Message = { role: "user", content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setSending(true);
    setLatestBubble("");

    try {
      const res = await fetch("/api/chat/guest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages,
          product: "業務効率化SaaS",
          industry: "中小企業",
          difficulty: "skeptical",
          scene: "visit",
          customerType: "owner",
        }),
      });
      const data = await res.json();
      const reply: string = data.message || "…";
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
      setLatestBubble(reply);

      const nextUserCount = newMessages.filter((m) => m.role === "user").length;
      if (nextUserCount >= MAX_TURNS) {
        setTimeout(() => {
          setPhase("ended");
          if (timerRef.current) clearInterval(timerRef.current);
        }, 1500);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "（通信エラーが発生しました）" },
      ]);
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  }, [input, sending, messages, phase]);

  /* End early */
  function handleEnd() {
    setPhase("ended");
    if (timerRef.current) clearInterval(timerRef.current);
  }

  /* Reset */
  function handleRetry() {
    setPhase("intro");
    setMessages([]);
    setElapsed(0);
    setLatestBubble("");
    setInput("");
  }

  const mins = Math.floor(elapsed / 60);
  const secs = elapsed % 60;
  const timeStr = `${mins}:${secs.toString().padStart(2, "0")}`;

  return (
    <div className="min-h-screen bg-[#0f1729]">
      <Header />

      <div className="flex h-[calc(100dvh-4rem)] flex-col lg:flex-row">
        {/* ─── 3D Scene ─── */}
        <div
          className={`relative w-full ${
            phase === "active"
              ? "h-[38vh] min-h-[200px] lg:h-full lg:w-[55%]"
              : "h-full"
          }`}
        >
          <Canvas
            shadows
            camera={{ position: [0, 2, 1.5], fov: 55 }}
            gl={{ antialias: true }}
          >
            <Scene talking={sending} latestBubble={phase === "active" ? latestBubble : ""} />
          </Canvas>

          {/* Timer overlay */}
          {phase === "active" && (
            <div className="absolute left-3 top-3 flex items-center gap-2">
              <div className="rounded-lg bg-black/60 px-3 py-1.5 font-mono text-sm text-white backdrop-blur-sm">
                {timeStr}
              </div>
              <div className="rounded-lg bg-black/60 px-3 py-1.5 text-xs text-white/80 backdrop-blur-sm">
                残り <span className="font-bold text-accent">{turnsLeft}</span> ターン
              </div>
            </div>
          )}

          {/* Drag hint */}
          {phase === "active" && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-black/40 px-3 py-1 text-[10px] text-white/40 backdrop-blur-sm">
              ドラッグで視点を動かせます
            </div>
          )}

          {/* ─── INTRO OVERLAY ─── */}
          {phase === "intro" && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
              <div className="mx-4 max-w-md rounded-2xl border border-white/10 bg-[#1a2744] p-6 text-center sm:p-8">
                <div className="mb-3 text-4xl">🏢</div>
                <h1 className="mb-2 text-xl font-bold text-white sm:text-2xl">
                  3Dバーチャル営業ロープレ
                </h1>
                <p className="mb-5 text-sm leading-relaxed text-white/60">
                  中小企業の社長室を訪問。
                  <br />
                  IT導入に懐疑的な社長に
                  <br />
                  業務効率化SaaSを提案せよ。
                </p>
                <div className="mb-6 space-y-1.5 rounded-xl bg-white/5 p-4 text-left text-xs text-white/50">
                  <p>📍 シーン：訪問営業（社長室）</p>
                  <p>👤 お客さん：40代男性 / 社長 / 懐疑的</p>
                  <p>💼 商材：業務効率化SaaS</p>
                  <p>🎯 ゴール：{MAX_TURNS}ターン以内に興味を引き出す</p>
                </div>
                <button
                  onClick={handleStart}
                  className="w-full rounded-xl bg-accent px-6 py-3 text-sm font-bold text-white transition hover:bg-accent-hover"
                >
                  商談を始める
                </button>
                <Link
                  href="/tools"
                  className="mt-4 block text-xs text-white/40 underline transition hover:text-white/60"
                >
                  ← ツール一覧に戻る
                </Link>
              </div>
            </div>
          )}

          {/* ─── RESULTS OVERLAY ─── */}
          {phase === "ended" && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
              <div className="mx-4 max-w-md rounded-2xl border border-white/10 bg-[#1a2744] p-6 text-center sm:p-8">
                <div className="mb-3 text-4xl">📊</div>
                <h2 className="mb-4 text-xl font-bold text-white">商談終了</h2>
                <div className="mb-5 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-white/5 p-4">
                    <div className="text-2xl font-bold text-accent">{userTurns}</div>
                    <div className="mt-1 text-xs text-white/50">発言回数</div>
                  </div>
                  <div className="rounded-xl bg-white/5 p-4">
                    <div className="text-2xl font-bold text-accent">{timeStr}</div>
                    <div className="mt-1 text-xs text-white/50">所要時間</div>
                  </div>
                </div>
                <p className="mb-6 text-sm leading-relaxed text-white/60">
                  {userTurns >= 6
                    ? "しっかりとした商談ができましたね！Proプランなら5カテゴリの詳細スコア＋AIフィードバックで、さらに実力を伸ばせます。"
                    : "もう少し会話を深めると効果的です。Proプランで無制限に練習して、本番に備えましょう。"}
                </p>
                <div className="flex flex-col gap-2.5">
                  <Link
                    href="/pricing"
                    className="rounded-xl bg-accent px-6 py-3 text-sm font-bold text-white transition hover:bg-accent-hover"
                  >
                    Proプランで本格練習する
                  </Link>
                  <button
                    onClick={handleRetry}
                    className="rounded-xl border border-white/20 px-6 py-3 text-sm font-medium text-white/70 transition hover:bg-white/5"
                  >
                    もう一度挑戦する
                  </button>
                  <Link
                    href="/tools"
                    className="mt-1 text-xs text-white/40 underline transition hover:text-white/60"
                  >
                    ← ツール一覧に戻る
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ─── Chat Panel ─── */}
        {phase === "active" && (
          <div className="flex w-full flex-1 flex-col border-t border-white/10 bg-[#0d1321] lg:w-[45%] lg:flex-none lg:border-l lg:border-t-0">
            {/* Chat header */}
            <div className="flex shrink-0 items-center justify-between border-b border-white/10 px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <span className="text-sm font-medium text-white/80">
                  中小企業 社長
                </span>
              </div>
              <button
                onClick={handleEnd}
                className="rounded-lg border border-white/20 px-3 py-1.5 text-xs text-white/50 transition hover:bg-white/10 hover:text-white/80"
              >
                商談を終了
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                      m.role === "user"
                        ? "rounded-br-md bg-accent text-white"
                        : "rounded-bl-md bg-white/10 text-white/90"
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}
              {sending && (
                <div className="flex justify-start">
                  <div className="rounded-2xl rounded-bl-md bg-white/10 px-4 py-2.5 text-sm text-white/50">
                    <span className="inline-flex gap-0.5">
                      <span className="animate-bounce" style={{ animationDelay: "0ms" }}>.</span>
                      <span className="animate-bounce" style={{ animationDelay: "150ms" }}>.</span>
                      <span className="animate-bounce" style={{ animationDelay: "300ms" }}>.</span>
                    </span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <div className="shrink-0 border-t border-white/10 px-4 py-3">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.nativeEvent.isComposing) sendMessage();
                  }}
                  placeholder="営業トークを入力..."
                  disabled={sending}
                  className="flex-1 rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 text-sm text-white outline-none placeholder:text-white/30 focus:border-accent disabled:opacity-50"
                />
                <button
                  onClick={sendMessage}
                  disabled={sending || !input.trim()}
                  className="shrink-0 rounded-xl bg-accent px-4 py-2.5 text-sm font-bold text-white transition hover:bg-accent-hover disabled:opacity-50"
                >
                  送信
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
