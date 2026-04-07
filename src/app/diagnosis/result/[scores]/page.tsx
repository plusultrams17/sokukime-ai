import Link from "next/link";
import type { Metadata } from "next";
import {
  SKILLS,
  getComboType,
  pentagonPoint,
  pentagonPath,
  getPercentile,
  parseScores,
} from "@/lib/diagnosis-data";

type Props = {
  params: Promise<{ scores: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { scores: scoresParam } = await params;
  const scores = parseScores(scoresParam);

  if (!scores) {
    return { title: "営業力診断 — 成約コーチAI" };
  }

  const type = getComboType(scores);
  const overall = Math.round(scores.reduce((a, b) => a + b, 0) / 5);
  const percentile = getPercentile(overall);

  return {
    title: `${type.name} — 営業力診断結果 | 成約コーチAI`,
    description: `${type.headline}（総合${overall}点・上位${100 - percentile}%）30秒で無料診断`,
    openGraph: {
      title: `【${type.name}】営業力診断結果`,
      description: `${type.headline}（総合${overall}点・上位${100 - percentile}%）`,
      siteName: "成約コーチAI",
    },
    twitter: {
      card: "summary_large_image",
      title: `【${type.name}】営業力診断結果`,
      description: `${type.headline}（総合${overall}点・上位${100 - percentile}%）`,
    },
  };
}

export default async function DiagnosisResultPage({ params }: Props) {
  const { scores: scoresParam } = await params;
  const scores = parseScores(scoresParam);

  if (!scores) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-6">
        <div className="text-center">
          <p className="mb-4 text-sm text-muted">無効な診断結果です</p>
          <Link
            href="/diagnosis"
            className="text-sm font-bold text-accent hover:underline"
          >
            診断をやり直す
          </Link>
        </div>
      </div>
    );
  }

  const overall = Math.round(scores.reduce((a, b) => a + b, 0) / 5);
  const maxIndex = scores.indexOf(Math.max(...scores));
  const minIndex = scores.indexOf(Math.min(...scores));
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

  const size = 280;
  const cx = size / 2;
  const cy = size / 2;
  const outerR = size / 2 - 45;

  const dataPath =
    scores
      .map((score, i) => {
        const p = pentagonPoint(cx, cy, (score / 100) * outerR, i);
        return `${i === 0 ? "M" : "L"}${p.x},${p.y}`;
      })
      .join(" ") + "Z";

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-card-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-2xl items-center justify-between px-6">
          <Link href="/" className="text-lg font-bold">
            成約コーチ AI
          </Link>
          <Link
            href="/diagnosis"
            className="rounded-lg border border-card-border px-4 py-1.5 text-sm text-muted transition hover:text-foreground"
          >
            自分も診断する
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-md px-6 py-12">
        <p className="mb-6 text-center text-[10px] font-bold uppercase tracking-[0.4em] text-muted">
          Sales Profile Result
        </p>

        {/* Pentagon Chart */}
        <div className="relative mx-auto mb-8" style={{ width: size, height: size }}>
          <svg viewBox={`0 0 ${size} ${size}`} className="h-full w-full">
            {[25, 50, 75, 100].map((level) => (
              <path
                key={level}
                d={pentagonPath(cx, cy, (level / 100) * outerR)}
                fill="none"
                stroke="var(--card-border)"
                strokeWidth={0.5}
                opacity={0.6}
              />
            ))}

            {SKILLS.map((_, i) => {
              const p = pentagonPoint(cx, cy, outerR, i);
              return (
                <line
                  key={i}
                  x1={cx}
                  y1={cy}
                  x2={p.x}
                  y2={p.y}
                  stroke="var(--card-border)"
                  strokeWidth={0.5}
                  opacity={0.4}
                />
              );
            })}

            <path
              d={dataPath}
              fill="rgba(249,115,22,0.1)"
              stroke="none"
            />

            {scores.map((score, i) => {
              const p1 = pentagonPoint(cx, cy, (score / 100) * outerR, i);
              const nextI = (i + 1) % 5;
              const p2 = pentagonPoint(cx, cy, (scores[nextI] / 100) * outerR, nextI);
              return (
                <line
                  key={`edge-${i}`}
                  x1={p1.x}
                  y1={p1.y}
                  x2={p2.x}
                  y2={p2.y}
                  stroke={SKILLS[i].color}
                  strokeWidth={2}
                  opacity={0.8}
                />
              );
            })}

            {scores.map((score, i) => {
              const p = pentagonPoint(cx, cy, (score / 100) * outerR, i);
              return (
                <circle
                  key={`vertex-${i}`}
                  cx={p.x}
                  cy={p.y}
                  r={4}
                  fill={SKILLS[i].color}
                />
              );
            })}

            {scores.map((score, i) => {
              const labelP = pentagonPoint(cx, cy, outerR + 28, i);
              return (
                <g key={`label-${i}`}>
                  <text
                    x={labelP.x}
                    y={labelP.y - 7}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill={SKILLS[i].color}
                    fontSize={9}
                    fontWeight={700}
                  >
                    {SKILLS[i].name}
                  </text>
                  <text
                    x={labelP.x}
                    y={labelP.y + 7}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill="var(--foreground)"
                    fontSize={12}
                    fontWeight={800}
                  >
                    {score}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Type Name */}
        <div className="mb-2 text-center">
          <h1
            className="mb-1 font-bold text-foreground"
            style={{ fontSize: "clamp(22px, 5vw, 32px)" }}
          >
            {type.name}
          </h1>
          <p className="text-xs font-medium tracking-[0.2em] text-muted">
            {type.en}
          </p>
        </div>

        <p className="mb-2 text-center text-sm font-medium leading-relaxed text-foreground">
          {type.headline}
        </p>
        <p className="mx-auto mb-8 max-w-sm text-center text-sm leading-relaxed text-muted">
          {type.description}
        </p>

        {/* Score badge */}
        <div className="mb-8 flex items-center justify-center gap-4 rounded-2xl border border-card-border bg-card px-6 py-4">
          <div className="text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted">総合</p>
            <p className="text-3xl font-black text-foreground">{overall}</p>
          </div>
          <div className="h-10 w-px bg-card-border" />
          <div className="text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted">ランク</p>
            <p className="text-3xl font-black" style={{ color: SKILLS[maxIndex].color }}>
              {grade}
            </p>
          </div>
          <div className="h-10 w-px bg-card-border" />
          <div className="text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted">上位</p>
            <p className="text-3xl font-black text-foreground">
              {100 - percentile}<span className="text-sm">%</span>
            </p>
          </div>
        </div>

        {/* Strengths */}
        <div className="mb-4 rounded-2xl border bg-card px-5 py-4" style={{ borderColor: `${SKILLS[maxIndex].color}30` }}>
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.15em]" style={{ color: SKILLS[maxIndex].color }}>
            強み TOP3
          </p>
          <ul className="space-y-1.5">
            {type.strengths.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                <span className="mt-0.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: SKILLS[maxIndex].color }} />
                {s}
              </li>
            ))}
          </ul>
        </div>

        {/* Weakness */}
        <div className="mb-8 rounded-2xl border border-card-border bg-card px-5 py-4">
          <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.15em] text-muted">
            課題 — {SKILLS[minIndex].name}
          </p>
          <p className="mb-2 text-sm font-bold text-foreground">{type.failurePattern}</p>
          <p className="text-xs leading-relaxed text-muted">{type.advice}</p>
        </div>

        <div className="mb-8 h-px w-16 mx-auto bg-card-border" />

        {/* CTA */}
        <div className="space-y-3 text-center">
          <Link
            href="/diagnosis"
            className="block w-full rounded-xl bg-accent py-3.5 text-center text-sm font-bold text-white transition hover:bg-accent-hover"
          >
            自分の営業タイプを診断する
          </Link>
          <p className="text-[10px] text-muted">30秒 ・ 5問 ・ 登録不要</p>
          <Link
            href="/try-roleplay"
            className="block w-full rounded-xl border border-card-border bg-card py-3.5 text-center text-sm font-medium text-muted transition hover:border-foreground/20 hover:text-foreground"
          >
            AIロープレを試してみる
          </Link>
        </div>

        <p className="mt-10 text-center text-[10px] leading-relaxed text-muted">
          成約コーチAI — seiyaku-coach.vercel.app
        </p>
      </main>
    </div>
  );
}
