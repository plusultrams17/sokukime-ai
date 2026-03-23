"use client";

import { useRef, useState } from "react";

interface ShareCardProps {
  score: number;
  rank: string;
  totalSessions: number;
}

function getRankColor(rank: string) {
  if (rank === "S") return "#22c55e";
  if (rank === "A") return "#16a34a";
  if (rank === "B") return "#eab308";
  if (rank === "C") return "#f97316";
  return "#ef4444";
}

export function ShareCard({ score, rank, totalSessions }: ShareCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  async function handleDownload() {
    if (!cardRef.current) return;
    setIsGenerating(true);

    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: "#1B6B5A",
        scale: 2,
      });
      const link = document.createElement("a");
      link.download = `seiyaku-coach-score-${score}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch {
      // html2canvas が利用できない場合はスキップ
    }
    setIsGenerating(false);
  }

  return (
    <div>
      {/* Rendered Card */}
      <div
        ref={cardRef}
        className="mx-auto w-80 rounded-2xl p-6"
        style={{ background: "linear-gradient(135deg, #1B6B5A, #155A4A)" }}
      >
        <div className="mb-4 text-center text-sm font-bold text-white/80">
          成約コーチ AI
        </div>
        <div className="mb-2 text-center">
          <span
            className="text-6xl font-black"
            style={{ color: getRankColor(rank) }}
          >
            {score}
          </span>
          <span className="text-2xl font-bold text-white/40"> / 100</span>
        </div>
        <div
          className="mb-4 text-center text-2xl font-bold"
          style={{ color: getRankColor(rank) }}
        >
          ランク {rank}
        </div>
        {totalSessions > 0 && (
          <div className="flex justify-center gap-6 text-center">
            <div>
              <div className="text-xl font-bold text-white">
                {totalSessions}
              </div>
              <div className="text-[10px] text-white/60">回ロープレ</div>
            </div>
          </div>
        )}
        <div className="mt-4 text-center text-[10px] text-white/40">
          sokukime.ai
        </div>
      </div>

      {/* Download Button */}
      <div className="mt-3 text-center">
        <button
          onClick={handleDownload}
          disabled={isGenerating}
          className="rounded-lg border border-card-border px-4 py-2 text-xs text-muted transition hover:text-foreground disabled:opacity-60"
        >
          {isGenerating ? "画像生成中..." : "画像をダウンロード"}
        </button>
      </div>
    </div>
  );
}
