import { ImageResponse } from "next/og";
import {
  SKILLS,
  getComboType,
  getPercentile,
  parseScores,
  pentagonPoint,
} from "@/lib/diagnosis-data";

export const runtime = "edge";
export const alt = "営業力診断結果 — 成約コーチAI";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ scores: string }>;
}) {
  const { scores: scoresParam } = await params;
  const scores = parseScores(scoresParam) ?? [60, 60, 60, 60, 60];

  const overall = Math.round(scores.reduce((a, b) => a + b, 0) / 5);
  const type = getComboType(scores);
  const percentile = getPercentile(overall);
  const grade =
    overall >= 80
      ? "S"
      : overall >= 70
        ? "A"
        : overall >= 60
          ? "B"
          : overall >= 50
            ? "C"
            : "D";

  const cx = 200;
  const cy = 200;
  const outerR = 140;

  const gridRings = [25, 50, 75, 100]
    .map((level) => {
      const r = (level / 100) * outerR;
      const pts = Array.from({ length: 5 }, (_, i) =>
        pentagonPoint(cx, cy, r, i),
      );
      return `M${pts.map((p) => `${p.x},${p.y}`).join("L")}Z`;
    })
    .join(" ");

  const dataPoints = scores.map((s, i) =>
    pentagonPoint(cx, cy, (s / 100) * outerR, i),
  );
  const dataPath = `M${dataPoints.map((p) => `${p.x},${p.y}`).join("L")}Z`;

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: "flex",
          background: "#0A0A0A",
          fontFamily: "sans-serif",
        }}
      >
        {/* Left: Pentagon */}
        <div
          style={{
            width: 500,
            height: 630,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="400" height="400" viewBox="0 0 400 400">
            <path
              d={gridRings}
              fill="none"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="0.5"
            />
            <path
              d={dataPath}
              fill="rgba(249,115,22,0.15)"
              stroke="none"
            />
            {dataPoints.map((p, i) => {
              const next = dataPoints[(i + 1) % 5];
              return (
                <line
                  key={i}
                  x1={p.x}
                  y1={p.y}
                  x2={next.x}
                  y2={next.y}
                  stroke={SKILLS[i].color}
                  strokeWidth="2"
                  opacity="0.8"
                />
              );
            })}
            {dataPoints.map((p, i) => (
              <circle key={i} cx={p.x} cy={p.y} r="6" fill={SKILLS[i].color} />
            ))}
            {scores.map((s, i) => {
              const lp = pentagonPoint(cx, cy, outerR + 35, i);
              return (
                <text
                  key={i}
                  x={lp.x}
                  y={lp.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill={SKILLS[i].color}
                  fontSize="14"
                  fontWeight="700"
                >
                  {SKILLS[i].name} {s}
                </text>
              );
            })}
          </svg>
        </div>

        {/* Right: Info */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            paddingRight: 60,
            paddingLeft: 20,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              marginBottom: 20,
            }}
          >
            <div
              style={{
                fontSize: 64,
                fontWeight: 900,
                color: "#F97316",
              }}
            >
              {grade}
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div
                style={{
                  fontSize: 16,
                  color: "rgba(255,255,255,0.4)",
                  fontWeight: 700,
                }}
              >
                総合 {overall}点 ・ 上位{100 - percentile}%
              </div>
            </div>
          </div>

          <div
            style={{
              fontSize: 36,
              fontWeight: 800,
              color: "#F0EDE6",
              marginBottom: 8,
            }}
          >
            {type.name}
          </div>
          <div
            style={{
              fontSize: 18,
              color: "rgba(255,255,255,0.5)",
              marginBottom: 32,
              lineHeight: 1.6,
            }}
          >
            {type.headline}
          </div>

          <div
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: "rgba(255,255,255,0.25)",
              letterSpacing: "0.1em",
            }}
          >
            成約コーチAI — seiyaku-coach.vercel.app
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
