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

          {/* Upgrade CTA */}
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
                  fontSize: "1.8em",
                  marginBottom: "0.3em",
                }}
              >
                🎉
              </div>
              <p
                style={{
                  fontSize: "1.1em",
                  fontWeight: 800,
                  color: "#4d4c4a",
                  marginBottom: "0.3em",
                }}
              >
                ロープレ完了おめでとうございます！
              </p>
              <p
                style={{
                  fontSize: "0.85em",
                  color: "#6a6560",
                  marginBottom: "0.8em",
                  lineHeight: 1.6,
                }}
              >
                無料登録で明日もロープレできます。
                <br />
                スコアは保存され、伸びが見えるようになります。
              </p>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "0.4em",
                  fontSize: "0.78em",
                  color: "#6a6560",
                  marginBottom: "0.8em",
                }}
              >
                <span>✓ 毎日1回の無料ロープレ</span>
                <span>✓ スコア履歴の保存＆推移グラフ</span>
                <span>✓ 5カテゴリ別の詳細アドバイス</span>
              </div>
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
                無料登録して無制限化 →
              </Link>
              <p
                style={{
                  fontSize: "0.7em",
                  color: "#a09a90",
                  marginTop: "0.5em",
                }}
              >
                クレカ不要 ・ 10秒で完了
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
