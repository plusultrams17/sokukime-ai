"use client";

interface RadarChartProps {
  categories: { name: string; score: number }[];
  size?: number;
}

export function RadarChart({ categories, size = 220 }: RadarChartProps) {
  const cx = size / 2;
  const cy = size / 2;
  const radius = size / 2 - 35;
  const n = categories.length;
  const angleStep = (2 * Math.PI) / n;
  const startAngle = -Math.PI / 2;

  function getPoint(index: number, value: number) {
    const angle = startAngle + index * angleStep;
    const r = (value / 100) * radius;
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  }

  function polygonPath(value: number) {
    return Array.from({ length: n }, (_, i) => {
      const p = getPoint(i, value);
      return `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`;
    }).join(" ") + " Z";
  }

  const gridLevels = [25, 50, 75, 100];
  const dataPoints = categories.map((cat, i) => getPoint(i, cat.score));
  const dataPath = dataPoints
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ") + " Z";

  function labelAnchor(index: number): "start" | "middle" | "end" {
    const angle = startAngle + index * angleStep;
    const deg = (angle * 180) / Math.PI;
    if (deg > -100 && deg < -80) return "middle";
    if (deg > 70 && deg < 110) return "middle";
    if (Math.cos(angle) > 0.1) return "start";
    if (Math.cos(angle) < -0.1) return "end";
    return "middle";
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="mx-auto"
    >
      {/* Grid pentagons */}
      {gridLevels.map((level) => (
        <path
          key={level}
          d={polygonPath(level)}
          fill="none"
          stroke="var(--card-border)"
          strokeWidth={1}
          opacity={level === 100 ? 0.6 : 0.3}
        />
      ))}

      {/* Axis lines */}
      {categories.map((_, i) => {
        const p = getPoint(i, 100);
        return (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={p.x}
            y2={p.y}
            stroke="var(--card-border)"
            strokeWidth={1}
            opacity={0.3}
          />
        );
      })}

      {/* Data polygon */}
      <path
        d={dataPath}
        fill="var(--accent)"
        fillOpacity={0.15}
        stroke="var(--accent)"
        strokeWidth={2}
      />

      {/* Data points */}
      {dataPoints.map((p, i) => (
        <circle
          key={i}
          cx={p.x}
          cy={p.y}
          r={3.5}
          fill="var(--accent)"
        />
      ))}

      {/* Labels */}
      {categories.map((cat, i) => {
        const p = getPoint(i, 125);
        return (
          <text
            key={i}
            x={p.x}
            y={p.y}
            textAnchor={labelAnchor(i)}
            dominantBaseline="central"
            fill="var(--muted)"
            fontSize={11}
            fontWeight={500}
          >
            {cat.name}
          </text>
        );
      })}

      {/* Score values next to points */}
      {categories.map((cat, i) => {
        const p = getPoint(i, cat.score > 15 ? cat.score - 12 : cat.score + 12);
        return (
          <text
            key={`score-${i}`}
            x={p.x}
            y={p.y}
            textAnchor="middle"
            dominantBaseline="central"
            fill="var(--accent)"
            fontSize={10}
            fontWeight={700}
          >
            {cat.score}
          </text>
        );
      })}
    </svg>
  );
}
