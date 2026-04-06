"use client";

import "../../roleplay/pixar.css";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChatUI } from "@/app/roleplay/chat-ui";
import { RadarChart } from "@/components/radar-chart";
import type { ScoreResult } from "@/lib/scoring";

/* ─── Session keys (must match /try-roleplay/page.tsx) ─── */
const GUEST_SETUP_KEY = "guest-roleplay-setup";
const GUEST_COMPLETED_KEY = "guest-roleplay-completed";

interface GuestSetup {
  industry: string;
  product: string;
  difficulty: string;
  scene: string;
  customerType: string;
  industryKey?: string;
}

type Phase = "loading" | "chat" | "score";

export default function GuestChatPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("loading");
  const [setup, setSetup] = useState<GuestSetup | null>(null);
  const [score, setScore] = useState<ScoreResult | null>(null);

  // Load setup from sessionStorage; guard against duplicate trials
  useEffect(() => {
    try {
      const completed = sessionStorage.getItem(GUEST_COMPLETED_KEY);
      if (completed === "true") {
        // Already completed guest trial → send to login
        router.replace("/login?redirect=/roleplay");
        return;
      }

      const raw = sessionStorage.getItem(GUEST_SETUP_KEY);
      if (!raw) {
        router.replace("/try-roleplay");
        return;
      }
      const parsed = JSON.parse(raw) as GuestSetup;
      if (!parsed.product || !parsed.difficulty) {
        router.replace("/try-roleplay");
        return;
      }
      setSetup(parsed);
      setPhase("chat");
    } catch {
      router.replace("/try-roleplay");
    }
  }, [router]);

  function markCompleted() {
    try {
      sessionStorage.setItem(GUEST_COMPLETED_KEY, "true");
      sessionStorage.removeItem(GUEST_SETUP_KEY);
    } catch {
      // best-effort
    }
  }

  function handleFinish(result: ScoreResult & { scoreId?: string | null }) {
    setScore(result);
    markCompleted();
    setPhase("score");
  }

  if (phase === "loading" || !setup) {
    return (
      <div
        className="flex min-h-screen items-center justify-center"
        style={{ background: "#f0e4d4" }}
      >
        <div
          style={{
            fontFamily:
              '"Arial Rounded MT Bold", "Helvetica Rounded", Arial, sans-serif',
            color: "#6a6560",
            fontWeight: 700,
          }}
        >
          読み込み中...
        </div>
      </div>
    );
  }

  if (phase === "score" && score) {
    return <GuestScoreScreen score={score} />;
  }

  return (
    <div
      className="flex min-h-screen flex-col"
      style={{
        background: "#f0e4d4",
        fontFamily:
          '"Arial Rounded MT Bold", "Helvetica Rounded", Arial, sans-serif',
      }}
    >
      {/* Guest header */}
      <header
        style={{
          background: "#f5f1e8",
          borderBottom: "0.18em solid #4d4c4a",
        }}
      >
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <span
              style={{
                fontSize: "1.05em",
                fontWeight: 800,
                color: "#4d4c4a",
              }}
            >
              成約コーチ AI
            </span>
          </Link>
          <div
            style={{
              fontSize: "0.7em",
              fontWeight: 800,
              color: "#fff",
              background: "#f48a58",
              padding: "0.3em 0.8em",
              borderRadius: "2em",
              border: "0.12em solid #c4693d",
              boxShadow: "0.08em 0.08em 0 #c4693d",
            }}
          >
            ゲスト体験中
          </div>
        </div>
      </header>

      {/* Reuse existing ChatUI with guest endpoints */}
      <ChatUI
        industry={setup.industry}
        product={setup.product}
        difficulty={setup.difficulty}
        scene={setup.scene}
        customerType={setup.customerType || "individual"}
        chatEndpoint="/api/chat/guest"
        scoreEndpoint="/api/score/guest"
        onFinish={handleFinish}
      />
    </div>
  );
}

/* ─── Guest Score Screen with Signup CTA ─── */

function GuestScoreScreen({ score }: { score: ScoreResult }) {
  const rank =
    score.overall >= 90
      ? "S"
      : score.overall >= 80
      ? "A"
      : score.overall >= 70
      ? "B"
      : score.overall >= 60
      ? "C"
      : score.overall >= 40
      ? "D"
      : "E";

  const scoreColor =
    score.overall >= 80
      ? "#22c55e"
      : score.overall >= 60
      ? "#eab308"
      : score.overall >= 40
      ? "#f48a58"
      : "#ef4444";

  return (
    <div
      className="flex min-h-screen flex-col"
      style={{
        background: "#f0e4d4",
        fontFamily:
          '"Arial Rounded MT Bold", "Helvetica Rounded", Arial, sans-serif',
      }}
    >
      <header
        style={{
          background: "#f5f1e8",
          borderBottom: "0.18em solid #4d4c4a",
        }}
      >
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <span
              style={{
                fontSize: "1.05em",
                fontWeight: 800,
                color: "#4d4c4a",
              }}
            >
              成約コーチ AI
            </span>
          </Link>
          <div
            style={{
              fontSize: "0.7em",
              fontWeight: 800,
              color: "#fff",
              background: "#22c55e",
              padding: "0.3em 0.8em",
              borderRadius: "2em",
              border: "0.12em solid #15803d",
              boxShadow: "0.08em 0.08em 0 #15803d",
            }}
          >
            体験完了
          </div>
        </div>
      </header>

      <main className="flex flex-1 items-start justify-center px-4 py-8">
        <div className="w-full max-w-lg space-y-5">
          {/* Score Card */}
          <div className="pixar-card">
            <div className="text-center">
              <div
                style={{
                  fontSize: "0.75em",
                  fontWeight: 700,
                  color: "#8a8680",
                  marginBottom: "0.3em",
                }}
              >
                あなたの営業スコア
              </div>
              <div
                style={{
                  fontSize: "4em",
                  fontWeight: 900,
                  color: scoreColor,
                  lineHeight: 1,
                }}
              >
                {score.overall}
                <span
                  style={{
                    fontSize: "0.4em",
                    fontWeight: 700,
                    color: "#a09a90",
                  }}
                >
                  /100
                </span>
              </div>
              <div
                style={{
                  fontSize: "0.9em",
                  fontWeight: 800,
                  color: "#4d4c4a",
                  marginTop: "0.3em",
                }}
              >
                ランク: {rank}
              </div>

              {/* Radar chart (blurred teaser) */}
              <div className="relative my-4">
                <div className="pointer-events-none opacity-80">
                  <RadarChart categories={score.categories} size={200} />
                </div>
              </div>

              {score.summary && (
                <p
                  style={{
                    fontSize: "0.85em",
                    color: "#4d4c4a",
                    lineHeight: 1.6,
                    marginTop: "0.5em",
                  }}
                >
                  {score.summary}
                </p>
              )}
            </div>
          </div>

          {/* ── 痛み可視化ブロック（Pain Diagnosis） ── */}
          <div className="pixar-card">
            <div className="text-center">
              <div
                style={{
                  fontSize: "0.75em",
                  fontWeight: 700,
                  color: "#8a8680",
                  marginBottom: "0.4em",
                }}
              >
                改善ポイント
              </div>
              <div
                style={{
                  fontSize: "0.95em",
                  fontWeight: 800,
                  color: "#4d4c4a",
                  marginBottom: "0.8em",
                }}
              >
                最もスコアが低かったカテゴリ
              </div>
              {(() => {
                const sorted = [...score.categories].sort(
                  (a, b) => a.score - b.score,
                );
                const weakest = sorted[0];
                if (!weakest) return null;
                return (
                  <div
                    style={{
                      padding: "0.8em 1em",
                      borderRadius: "0.8em",
                      background: "#fef2f2",
                      border: "0.12em solid #ef4444",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "0.85em",
                        fontWeight: 800,
                        color: "#991b1b",
                        marginBottom: "0.3em",
                      }}
                    >
                      {weakest.name}: {weakest.score}点
                    </div>
                    <p
                      style={{
                        fontSize: "0.75em",
                        color: "#7f1d1d",
                        lineHeight: 1.5,
                      }}
                    >
                      このカテゴリを重点的に練習することで、全体スコアの底上げが期待できます。
                      無料登録すると毎日1回のロープレで継続的に改善できます。
                    </p>
                  </div>
                );
              })()}
            </div>
          </div>

          {/* ── Pro差分 + 切迫感ブロック ── */}
          <div
            className="pixar-card"
            style={{
              borderColor: "#f48a58",
              background: "linear-gradient(135deg, #fff8f3, #fdf2f2)",
            }}
          >
            <div className="text-center">
              <div
                style={{
                  fontSize: "0.85em",
                  fontWeight: 800,
                  color: "#4d4c4a",
                  marginBottom: "0.5em",
                }}
              >
                スコアを伸ばすには、繰り返しの練習が必要です
              </div>

              {/* 無料/Proの違い */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.4em",
                  textAlign: "left",
                  padding: "0.8em 1em",
                  margin: "0.5em 0 0.8em",
                  background: "#fff",
                  borderRadius: "0.8em",
                  border: "0.12em solid #f48a58",
                }}
              >
                <div
                  style={{
                    fontSize: "0.8em",
                    color: "#4d4c4a",
                    fontWeight: 700,
                  }}
                >
                  無料プランでできること:
                </div>
                <div
                  style={{
                    fontSize: "0.78em",
                    color: "#6a6560",
                    fontWeight: 600,
                    paddingLeft: "0.5em",
                  }}
                >
                  ・22レッスンで営業の「型」を学習（全レッスン無料）
                </div>
                <div
                  style={{
                    fontSize: "0.78em",
                    color: "#6a6560",
                    fontWeight: 600,
                    paddingLeft: "0.5em",
                  }}
                >
                  ・毎日1回のAIロープレで実践練習
                </div>
                <div
                  style={{
                    fontSize: "0.78em",
                    color: "#6a6560",
                    fontWeight: 600,
                    paddingLeft: "0.5em",
                  }}
                >
                  ・スコアで自分の弱点を確認
                </div>
                <div
                  style={{
                    fontSize: "0.7em",
                    color: "#a09a90",
                    marginTop: "0.3em",
                    paddingLeft: "0.5em",
                  }}
                >
                  Proなら: 無制限ロープレ・全5カテゴリ詳細スコア・AI改善アドバイス
                </div>
              </div>

              {/* メインCTA */}
              <Link
                href="/login?redirect=/roleplay"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "3em",
                  padding: "0 2em",
                  borderRadius: "2em",
                  background: "#f48a58",
                  color: "#fff",
                  fontWeight: 800,
                  fontSize: "0.95em",
                  textDecoration: "none",
                  border: "0.12em solid #c4693d",
                  boxShadow: "0.12em 0.12em 0 #c4693d",
                }}
              >
                無料登録して練習を続ける
              </Link>
              <p
                style={{
                  fontSize: "0.7em",
                  color: "#a09a90",
                  marginTop: "0.5em",
                }}
              >
                メールアドレスのみ ・ クレカ不要
              </p>
            </div>
          </div>

          {/* Back link */}
          <div className="text-center">
            <Link
              href="/"
              style={{
                fontSize: "0.8em",
                color: "#8a8680",
                textDecoration: "underline",
                fontWeight: 700,
              }}
            >
              ← トップに戻る
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
