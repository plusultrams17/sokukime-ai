import { ImageResponse } from "next/og";
import { getGrade } from "@/lib/grade";

export const runtime = "edge";
export const alt = "営業力診断結果 — 成約コーチAI";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

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

export default async function Image() {
  // Default scores for static OGP (when no params)
  const scores = [70, 60, 55, 45, 65];
  const overall = Math.round(scores.reduce((a, b) => a + b, 0) / 5);
  const maxIndex = scores.indexOf(Math.max(...scores));
  const typeName = TYPES[maxIndex];
  const grade = getGrade(overall);

  const cx = 200;
  const cy = 200;
  const outerR = 140;

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
            <path d={gridRings} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
            <path d={dataPath} fill="rgba(255,159,28,0.15)" stroke="none" />
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
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: "0.2em",
              color: "rgba(255,255,255,0.3)",
              marginBottom: 16,
            }}
          >
            30秒・5問・登録不要
          </div>
          <div
            style={{
              fontSize: 44,
              fontWeight: 800,
              color: "#F0EDE6",
              marginBottom: 8,
            }}
          >
            あなたの営業タイプは？
          </div>
          <div
            style={{
              fontSize: 20,
              color: "rgba(255,255,255,0.5)",
              marginBottom: 32,
            }}
          >
            5つの営業スキルを可視化する無料診断
          </div>
          <div
            style={{
              marginTop: 16,
              fontSize: 16,
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
