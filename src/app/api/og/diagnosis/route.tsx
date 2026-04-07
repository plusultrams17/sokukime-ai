import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

export const runtime = "edge";

const SKILLS = [
  { name: "アプローチ", color: "#FF9F1C" },
  { name: "ヒアリング", color: "#2EC4B6" },
  { name: "プレゼン", color: "#A855F7" },
  { name: "クロージング", color: "#F43F5E" },
  { name: "反論処理", color: "#3B82F6" },
];

const TYPES = [
  "信頼構築タイプ",
  "傾聴分析タイプ",
  "ストーリーテラータイプ",
  "即決クローザータイプ",
  "切り返しの達人タイプ",
];

function pentagonPoint(cx: number, cy: number, radius: number, index: number) {
  const angle = -Math.PI / 2 + (index * 2 * Math.PI) / 5;
  return {
    x: cx + radius * Math.cos(angle),
    y: cy + radius * Math.sin(angle),
  };
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const scoresParam = searchParams.get("scores") || "50,50,50,50,50";
  const scores = scoresParam.split(",").map(Number).slice(0, 5);
  while (scores.length < 5) scores.push(50);

  const overall = Math.round(scores.reduce((a, b) => a + b, 0) / 5);
  const maxIndex = scores.indexOf(Math.max(...scores));
  const typeName = TYPES[maxIndex];

  const grade =
    overall >= 80 ? "S" : overall >= 70 ? "A" : overall >= 60 ? "B" : overall >= 50 ? "C" : "D";

  // Pentagon geometry
  const cx = 200;
  const cy = 200;
  const outerR = 140;

  // Build SVG pentagon paths
  const gridRings = [25, 50, 75, 100]
    .map((level) => {
      const r = (level / 100) * outerR;
      const pts = Array.from({ length: 5 }, (_, i) => pentagonPoint(cx, cy, r, i));
      return `M${pts.map((p) => `${p.x},${p.y}`).join("L")}Z`;
    })
    .join(" ");

  const dataPoints = scores.map((s, i) => pentagonPoint(cx, cy, (s / 100) * outerR, i));
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
        {/* Left: Pentagon chart */}
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
            {/* Grid */}
            <path d={gridRings} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
            {/* Data shape */}
            <path d={dataPath} fill="rgba(255,159,28,0.15)" stroke="none" />
            {/* Data outline */}
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
            {/* Vertex dots */}
            {dataPoints.map((p, i) => (
              <circle key={i} cx={p.x} cy={p.y} r="6" fill={SKILLS[i].color} />
            ))}
            {/* Labels */}
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
          {/* Small label */}
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.3em",
              color: "rgba(255,255,255,0.3)",
              marginBottom: 16,
            }}
          >
            YOUR SALES PROFILE
          </div>

          {/* Type name */}
          <div
            style={{
              fontSize: 36,
              fontWeight: 800,
              color: "#F0EDE6",
              marginBottom: 12,
            }}
          >
            {typeName}
          </div>

          {/* Score + Rank */}
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 20,
              marginBottom: 24,
            }}
          >
            <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
              <span style={{ fontSize: 64, fontWeight: 900, color: "#F0EDE6" }}>
                {overall}
              </span>
              <span style={{ fontSize: 20, color: "rgba(255,255,255,0.3)" }}>
                / 100
              </span>
            </div>
            <div
              style={{
                fontSize: 32,
                fontWeight: 900,
                color: SKILLS[maxIndex].color,
              }}
            >
              {grade}
            </div>
          </div>

          {/* Skill bars */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {scores.map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: SKILLS[i].color,
                  }}
                />
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: "rgba(255,255,255,0.6)",
                    width: 80,
                  }}
                >
                  {SKILLS[i].name}
                </span>
                <div
                  style={{
                    flex: 1,
                    height: 6,
                    borderRadius: 3,
                    background: "rgba(255,255,255,0.06)",
                    overflow: "hidden",
                    display: "flex",
                  }}
                >
                  <div
                    style={{
                      width: `${s}%`,
                      height: "100%",
                      borderRadius: 3,
                      background: SKILLS[i].color,
                    }}
                  />
                </div>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 800,
                    color: SKILLS[i].color,
                    width: 28,
                    textAlign: "right",
                  }}
                >
                  {s}
                </span>
              </div>
            ))}
          </div>

          {/* Brand */}
          <div
            style={{
              marginTop: 32,
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
