"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { Header } from "@/components/header";
import {
  SKILLS,
  TYPES,
  COMBO_TYPES,
  getComboType,
  pentagonPoint,
  pentagonPath,
  getPercentile,
  encodeScores,
  type DiagnosisType,
} from "@/lib/diagnosis-data";

/* ═══════════════════════════════════════════════════════════════
   QUESTIONS — vector scoring across all 5 skills per choice
   Scores: [approach, hearing, presentation, closing, objection]
═══════════════════════════════════════════════════════════════ */

type SkillScores = [number, number, number, number, number];

interface Choice {
  text: string;
  scores: SkillScores;
}

interface Question {
  tag: string;
  tagEn: string;
  scene: string;
  question: string;
  choices: Choice[];
}

const QUESTIONS: Question[] = [
  {
    tag: "初回接触",
    tagEn: "FIRST CONTACT",
    scene:
      "住宅リフォームの訪問営業。インターホン越しに「間に合ってます」と返された。",
    question: "あなたの次の一手は？",
    choices: [
      {
        text: "「ですよね！この辺り外壁が気になるお宅が多くて声かけてるんです」",
        scores: [20, 12, 14, 10, 16],
      },
      {
        text: "「そうですか。ちなみに今のお住まい、何年くらいになりますか？」",
        scores: [10, 18, 8, 10, 12],
      },
      {
        text: "「来月から塗料が15%値上がりします。30秒だけいいですか？」",
        scores: [6, 6, 12, 16, 4],
      },
      {
        text: "「1点だけ — 築10年以上なら無料で外壁診断ができるんです」",
        scores: [12, 8, 18, 10, 10],
      },
    ],
  },
  {
    tag: "ニーズ発掘",
    tagEn: "NEEDS DISCOVERY",
    scene:
      "リビングで話を聞いてもらえることに。しかし「特に困ってることはないかな」と言われた。",
    question: "どう切り込む？",
    choices: [
      {
        text: "「お家のメンテナンス、最後にされたのいつ頃ですか？」と自然に質問する",
        scores: [12, 18, 8, 10, 10],
      },
      {
        text: "「同じエリアの方も最初はそうおっしゃってたんですが…」と事例を出す",
        scores: [18, 12, 16, 10, 16],
      },
      {
        text: "「では無料の簡易診断だけ、5分でやらせてください」と次ステップを提案",
        scores: [6, 4, 8, 18, 8],
      },
      {
        text: "「お困りでない方にこそ知っていただきたい話がありまして」とメリットを語る",
        scores: [10, 14, 18, 8, 8],
      },
    ],
  },
  {
    tag: "競合対策",
    tagEn: "COMPETITION",
    scene:
      "商談は順調。しかし「他社さんからも見積もり取ってるんだよね」と言われた。",
    question: "あなたのプレゼン戦略は？",
    choices: [
      {
        text: "「比較してもらえるの嬉しいです。何を一番重視されてますか？」と聞く",
        scores: [16, 18, 8, 10, 12],
      },
      {
        text: "「他社さんの見積もり内容、よかったら教えてもらえますか？」と情報を集める",
        scores: [6, 14, 6, 8, 10],
      },
      {
        text: "「○○さんのお宅だと月々○○円の節約です。10年で考えると…」と数字を出す",
        scores: [8, 8, 18, 12, 12],
      },
      {
        text: "「正直、価格だけなら他社さんが安いかもしれません。ただ——」と切り返す",
        scores: [14, 10, 14, 14, 20],
      },
    ],
  },
  {
    tag: "決断の後押し",
    tagEn: "DECISION",
    scene:
      "いい雰囲気で進んだ商談の最後。「いいなとは思うけど、ちょっと考えます」と言われた。",
    question: "あなたの決め手は？",
    choices: [
      {
        text: "「もちろんです。良いと思われたのはどの部分でしたか？」と肯定を引き出す",
        scores: [16, 16, 12, 12, 16],
      },
      {
        text: "「何が一番引っかかってますか？」と本音をストレートに聞く",
        scores: [8, 18, 6, 12, 14],
      },
      {
        text: "「来週から価格改定なので、今日お返事いただくのが一番お得です」と期限を示す",
        scores: [4, 4, 12, 18, 6],
      },
      {
        text: "「検討用の資料をまとめておきますね」と次回のアポを確保する",
        scores: [14, 10, 18, 8, 8],
      },
    ],
  },
  {
    tag: "価格交渉",
    tagEn: "NEGOTIATION",
    scene:
      "クロージング直前。「うーん、やっぱりちょっと高いですね…」と最後の壁が立ちはだかった。",
    question: "この壁をどう越える？",
    choices: [
      {
        text: "「そう感じますよね。ご予算はどれくらいをイメージされてました？」と聞く",
        scores: [14, 20, 8, 10, 20],
      },
      {
        text: "「月々にすると1日たった○○円なんです」とリフレーミングする",
        scores: [8, 6, 18, 14, 12],
      },
      {
        text: "「おっしゃる通りです。では○○プランはいかがですか？」と代替案を即提示",
        scores: [6, 6, 10, 18, 4],
      },
      {
        text: "「皆さん最初はそうおっしゃいます。でも3ヶ月後の声がこちら——」と実績を見せる",
        scores: [16, 8, 14, 8, 12],
      },
    ],
  },
];

/* ═══════════════════════════════════════════════════════════════
   INTRO SCREEN
═══════════════════════════════════════════════════════════════ */

function IntroScreen({ onStart }: { onStart: () => void }) {
  const cx = 150;
  const cy = 150;
  const r = 100;

  return (
    <div className="flex min-h-[80dvh] flex-col items-center justify-center px-6 py-16">
      {/* Pentagon constellation */}
      <div className="relative mb-10" style={{ width: 280, height: 280 }}>
        <svg
          viewBox="0 0 300 300"
          className="h-full w-full"
          style={{ filter: "drop-shadow(0 4px 20px rgba(27,107,90,0.08))" }}
        >
          {/* Grid rings */}
          {[0.33, 0.66, 1].map((scale) => (
            <path
              key={scale}
              d={pentagonPath(cx, cy, r * scale)}
              fill="none"
              stroke="var(--card-border)"
              strokeWidth={0.5}
              opacity={0.6}
            />
          ))}

          {/* Axis lines */}
          {SKILLS.map((_, i) => {
            const p = pentagonPoint(cx, cy, r, i);
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

          {/* Outer pentagon */}
          <path
            d={pentagonPath(cx, cy, r)}
            fill="none"
            stroke="var(--accent)"
            strokeWidth={1.5}
            opacity={0.3}
            className="intro-pentagon-draw"
          />

          {/* Vertex dots + labels */}
          {SKILLS.map((skill, i) => {
            const p = pentagonPoint(cx, cy, r, i);
            const lp = pentagonPoint(cx, cy, r + 28, i);
            return (
              <g key={skill.key}>
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={12}
                  fill={skill.color}
                  opacity={0.15}
                  className="intro-vertex-pulse"
                  style={{ animationDelay: `${i * 0.4}s` }}
                />
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={4}
                  fill={skill.color}
                  className="intro-vertex-pulse"
                  style={{ animationDelay: `${i * 0.4}s` }}
                />
                <text
                  x={lp.x}
                  y={lp.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill={skill.color}
                  fontSize={11}
                  fontWeight={700}
                >
                  {skill.name}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Copy */}
      <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-muted">
        30秒 &middot; 5問 &middot; 登録不要
      </p>
      <h1
        className="mb-4 text-center font-bold leading-snug text-foreground"
        style={{ fontSize: "clamp(26px, 5vw, 40px)" }}
      >
        あなたの営業力を、
        <br />
        可視化する。
      </h1>
      <p
        className="mx-auto mb-10 max-w-xs text-center text-sm leading-relaxed text-muted"
      >
        5つの営業スキルを直感で診断。
        <br />
        あなたの強みと課題が見えてきます。
      </p>

      {/* CTA */}
      <button onClick={onStart} className="lp-cta-btn diagnosis-cta">
        診断スタート
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   QUESTION SCREEN
═══════════════════════════════════════════════════════════════ */

function QuestionScreen({
  question,
  questionIndex,
  scores,
  onAnswer,
}: {
  question: Question;
  questionIndex: number;
  scores: number[];
  onAnswer: (scores: SkillScores) => void;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const tagColor = SKILLS[questionIndex].color;

  const handleSelect = useCallback(
    (choiceIndex: number) => {
      if (selected !== null) return;
      setSelected(choiceIndex);
      setTimeout(() => {
        onAnswer(question.choices[choiceIndex].scores);
        setSelected(null);
      }, 400);
    },
    [selected, onAnswer, question.choices],
  );

  const miniCx = 28;
  const miniCy = 28;
  const miniR = 20;

  return (
    <div className="mx-auto flex min-h-[80dvh] max-w-2xl flex-col px-6 pb-10 pt-8">
      {/* Top bar */}
      <div className="mb-8 flex items-center justify-between">
        <svg width={56} height={56} viewBox="0 0 56 56">
          <path
            d={pentagonPath(miniCx, miniCy, miniR)}
            fill="none"
            stroke="var(--card-border)"
            strokeWidth={1}
          />
          {SKILLS.map((s, i) => {
            const p = pentagonPoint(miniCx, miniCy, miniR, i);
            const filled =
              i < questionIndex ||
              (i === questionIndex && selected !== null);
            return (
              <circle
                key={s.key}
                cx={p.x}
                cy={p.y}
                r={filled ? 4 : 2.5}
                fill={filled ? s.color : "var(--card-border)"}
                className={filled ? "diagnosis-dot-pop" : ""}
              />
            );
          })}
          {scores.map((_, i) => {
            if (i >= questionIndex) return null;
            const p1 = pentagonPoint(miniCx, miniCy, miniR, i);
            const nextI = (i + 1) % 5;
            if (
              nextI >= questionIndex &&
              !(nextI === questionIndex && selected !== null)
            )
              return null;
            const p2 = pentagonPoint(miniCx, miniCy, miniR, nextI);
            return (
              <line
                key={`line-${i}`}
                x1={p1.x}
                y1={p1.y}
                x2={p2.x}
                y2={p2.y}
                stroke={SKILLS[i].color}
                strokeWidth={1}
                opacity={0.5}
              />
            );
          })}
        </svg>
        <span className="text-xs font-bold tracking-[0.2em] text-muted">
          {questionIndex + 1} / 5
        </span>
      </div>

      {/* Watermark number */}
      <div className="relative mb-6">
        <span
          className="absolute -left-2 -top-6 select-none font-black leading-none"
          style={{
            fontSize: "clamp(100px, 20vw, 160px)",
            color: "var(--card-border)",
            opacity: 0.4,
            letterSpacing: "-0.05em",
          }}
          aria-hidden="true"
        >
          {String(questionIndex + 1).padStart(2, "0")}
        </span>

        <div className="relative z-10 mb-5">
          <span
            className="inline-block rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em]"
            style={{ color: tagColor, background: `${tagColor}12` }}
          >
            {question.tagEn}
          </span>
        </div>

        <div className="relative z-10">
          <p className="mb-2 text-sm leading-relaxed text-muted">
            {question.scene}
          </p>
          <h2 className="text-xl font-bold leading-snug text-foreground sm:text-2xl">
            {question.question}
          </h2>
        </div>
      </div>

      {/* Choices */}
      <div className="relative z-10 flex flex-1 flex-col justify-center gap-3 py-4">
        {question.choices.map((choice, i) => {
          const isSelected = selected === i;
          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={selected !== null}
              className="group relative w-full rounded-xl border px-5 py-4 text-left text-sm leading-relaxed transition-all duration-200 sm:text-base"
              style={{
                borderColor: isSelected
                  ? tagColor
                  : "var(--card-border)",
                background: isSelected ? `${tagColor}08` : "var(--card)",
                color: "var(--foreground)",
                transform: isSelected ? "scale(1.02)" : undefined,
                boxShadow: isSelected
                  ? `0 4px 16px ${tagColor}20`
                  : "0 1px 3px rgba(0,0,0,0.04)",
              }}
            >
              <div className="relative flex items-start gap-3">
                <span
                  className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold"
                  style={{
                    border: `1.5px solid ${isSelected ? tagColor : "var(--card-border)"}`,
                    color: isSelected ? tagColor : "var(--muted)",
                    background: isSelected
                      ? `${tagColor}15`
                      : "transparent",
                  }}
                >
                  {String.fromCharCode(65 + i)}
                </span>
                <span className={isSelected ? "font-semibold" : ""}>
                  {choice.text}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Progress dots */}
      <div className="flex items-center justify-center gap-2 pt-4">
        {SKILLS.map((s, i) => (
          <div
            key={s.key}
            className="h-1.5 rounded-full transition-all duration-500"
            style={{
              width: i === questionIndex ? 32 : 8,
              background: i <= questionIndex ? s.color : "var(--card-border)",
              opacity: i <= questionIndex ? 1 : 0.4,
            }}
          />
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   RESULT SCREEN
═══════════════════════════════════════════════════════════════ */

function ResultPentagon({ scores }: { scores: number[] }) {
  const size = 320;
  const cx = size / 2;
  const cy = size / 2;
  const outerR = size / 2 - 50;

  const dataPath =
    scores
      .map((score, i) => {
        const p = pentagonPoint(cx, cy, (score / 100) * outerR, i);
        return `${i === 0 ? "M" : "L"}${p.x},${p.y}`;
      })
      .join(" ") + "Z";

  return (
    <div className="relative mx-auto" style={{ width: size, height: size }}>
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="h-full w-full"
      >
        <defs>
          <linearGradient id="data-gradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={SKILLS[0].color} stopOpacity={0.18} />
            <stop offset="25%" stopColor={SKILLS[1].color} stopOpacity={0.14} />
            <stop offset="50%" stopColor={SKILLS[2].color} stopOpacity={0.14} />
            <stop offset="75%" stopColor={SKILLS[3].color} stopOpacity={0.14} />
            <stop
              offset="100%"
              stopColor={SKILLS[4].color}
              stopOpacity={0.18}
            />
          </linearGradient>
          <filter id="vertex-glow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

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
          fill="url(#data-gradient)"
          stroke="none"
          className="diagnosis-data-reveal"
        />

        {scores.map((score, i) => {
          const p1 = pentagonPoint(cx, cy, (score / 100) * outerR, i);
          const nextI = (i + 1) % 5;
          const p2 = pentagonPoint(
            cx,
            cy,
            (scores[nextI] / 100) * outerR,
            nextI,
          );
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
              className="diagnosis-line-draw"
              style={{ animationDelay: `${0.3 + i * 0.15}s` }}
            />
          );
        })}

        {scores.map((score, i) => {
          const p = pentagonPoint(cx, cy, (score / 100) * outerR, i);
          return (
            <g key={`vertex-${i}`} filter="url(#vertex-glow)">
              <circle
                cx={p.x}
                cy={p.y}
                r={5}
                fill={SKILLS[i].color}
                className="diagnosis-vertex-pop"
                style={{ animationDelay: `${0.5 + i * 0.15}s` }}
              />
            </g>
          );
        })}

        {scores.map((score, i) => {
          const labelP = pentagonPoint(cx, cy, outerR + 30, i);
          return (
            <g key={`label-${i}`}>
              <text
                x={labelP.x}
                y={labelP.y - 8}
                textAnchor="middle"
                dominantBaseline="central"
                fill={SKILLS[i].color}
                fontSize={10}
                fontWeight={700}
                letterSpacing="0.05em"
              >
                {SKILLS[i].name}
              </text>
              <text
                x={labelP.x}
                y={labelP.y + 8}
                textAnchor="middle"
                dominantBaseline="central"
                fill="var(--foreground)"
                fontSize={14}
                fontWeight={800}
              >
                {score}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function ResultScreen({
  scores,
  onRetry,
}: {
  scores: number[];
  onRetry: () => void;
}) {
  const overall = Math.round(scores.reduce((a, b) => a + b, 0) / 5);
  const maxIndex = scores.indexOf(Math.max(...scores));
  const minIndex = scores.indexOf(Math.min(...scores));
  const type = getComboType(scores);
  const percentile = getPercentile(overall);

  const grade =
    overall >= 80
      ? { label: "S", sub: "トップ営業レベル" }
      : overall >= 70
        ? { label: "A", sub: "即戦力" }
        : overall >= 60
          ? { label: "B", sub: "伸びしろあり" }
          : overall >= 50
            ? { label: "C", sub: "改善の余地あり" }
            : { label: "D", sub: "基礎から見直そう" };

  const siteUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : "https://seiyaku-coach.vercel.app";
  const shareText = `【営業力診断】${type.name}（総合${overall}点・上位${100 - percentile}%）\nあなたの営業タイプは？30秒で無料診断\n`;
  const shareUrl = `${siteUrl}/diagnosis/result/${encodeScores(scores)}`;

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-6 pb-16 pt-12">
      <p className="diagnosis-fade-in mb-8 text-[10px] font-bold uppercase tracking-[0.4em] text-muted">
        Your Sales Profile
      </p>

      <div
        className="diagnosis-fade-in mb-8"
        style={{ animationDelay: "0.2s" }}
      >
        <ResultPentagon scores={scores} />
      </div>

      <div
        className="diagnosis-fade-in mb-2 text-center"
        style={{ animationDelay: "0.6s" }}
      >
        <h2
          className="mb-1 font-bold text-foreground"
          style={{ fontSize: "clamp(22px, 5vw, 32px)" }}
        >
          {type.name}
        </h2>
        <p className="text-xs font-medium tracking-[0.2em] text-muted">
          {type.en}
        </p>
      </div>

      <p
        className="diagnosis-fade-in mb-2 text-center text-sm font-medium leading-relaxed text-foreground"
        style={{ maxWidth: 380, animationDelay: "0.7s" }}
      >
        {type.headline}
      </p>
      <p
        className="diagnosis-fade-in mb-8 text-center text-sm leading-relaxed text-muted"
        style={{ maxWidth: 360, animationDelay: "0.8s" }}
      >
        {type.description}
      </p>

      {/* Score badge */}
      <div
        className="diagnosis-fade-in mb-10 flex items-center gap-4 rounded-2xl border border-card-border bg-card px-8 py-5 shadow-sm"
        style={{ animationDelay: "1s" }}
      >
        <div className="text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted">
            総合スコア
          </p>
          <p className="text-4xl font-black text-foreground">{overall}</p>
        </div>
        <div className="h-12 w-px bg-card-border" />
        <div className="text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted">
            ランク
          </p>
          <p
            className="text-4xl font-black"
            style={{ color: SKILLS[maxIndex].color }}
          >
            {grade.label}
          </p>
        </div>
        <div className="h-12 w-px bg-card-border" />
        <div className="text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted">
            上位
          </p>
          <p className="text-4xl font-black text-foreground">
            {100 - percentile}<span className="text-lg">%</span>
          </p>
        </div>
      </div>

      {/* Skill bars */}
      <div
        className="diagnosis-fade-in mb-10 w-full max-w-sm space-y-4"
        style={{ animationDelay: "1.2s" }}
      >
        {scores.map((score, i) => (
          <div key={SKILLS[i].key}>
            <div className="mb-1.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ background: SKILLS[i].color }}
                />
                <span className="text-xs font-bold text-foreground">
                  {SKILLS[i].name}
                </span>
              </div>
              <span
                className="text-sm font-black"
                style={{ color: SKILLS[i].color }}
              >
                {score}
              </span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-card-border/30">
              <div
                className="diagnosis-bar-fill h-full rounded-full transition-all duration-1000 ease-out"
                style={{
                  width: `${score}%`,
                  background: SKILLS[i].color,
                  animationDelay: `${1.4 + i * 0.1}s`,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Advice cards */}
      <div
        className="diagnosis-fade-in mb-10 w-full max-w-sm space-y-3"
        style={{ animationDelay: "1.6s" }}
      >
        {/* Strengths TOP3 */}
        <div
          className="rounded-2xl border bg-card px-5 py-4"
          style={{ borderColor: `${SKILLS[maxIndex].color}30` }}
        >
          <p
            className="mb-2 text-[10px] font-bold uppercase tracking-[0.15em]"
            style={{ color: SKILLS[maxIndex].color }}
          >
            あなたの強み TOP3
          </p>
          <ul className="space-y-1.5">
            {type.strengths.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                <span
                  className="mt-0.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full"
                  style={{ background: SKILLS[maxIndex].color }}
                />
                {s}
              </li>
            ))}
          </ul>
        </div>

        {/* Failure pattern */}
        <div className="rounded-2xl border border-card-border bg-card px-5 py-4">
          <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.15em] text-muted">
            伸ばすべきポイント — {SKILLS[minIndex].name}
          </p>
          <p className="mb-2 text-sm font-bold text-foreground">
            {type.failurePattern}
          </p>
          <p className="text-xs leading-relaxed text-muted">{type.advice}</p>
        </div>

        {/* Aruaru */}
        <div className="rounded-2xl border border-card-border bg-background px-5 py-4">
          <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.15em] text-muted">
            こんな経験ありませんか？
          </p>
          <p className="text-sm leading-relaxed text-foreground italic">
            &ldquo;{type.aruaru}&rdquo;
          </p>
        </div>
      </div>

      <div className="mb-10 h-px w-16 bg-card-border" />

      {/* Score-band CTAs */}
      <div
        className="diagnosis-fade-in flex w-full max-w-sm flex-col items-center gap-3"
        style={{ animationDelay: "1.8s" }}
      >
        {overall >= 80 ? (
          <>
            <Link href={`/roleplay?from=diagnosis&weakest=${encodeURIComponent(SKILLS[minIndex].name)}`} className="lp-cta-btn w-full text-center">
              Sランクの実力、AIロープレで証明する
            </Link>
            <Link
              href="/learn"
              className="flex h-12 w-full items-center justify-center rounded border border-card-border bg-card text-sm font-medium text-muted transition hover:border-foreground/20 hover:text-foreground"
            >
              さらに磨く — 学習コースへ
            </Link>
          </>
        ) : overall >= 60 ? (
          <>
            <Link href={`/roleplay?from=diagnosis&weakest=${encodeURIComponent(SKILLS[minIndex].name)}`} className="lp-cta-btn w-full text-center">
              AIロープレで{SKILLS[minIndex].name}を克服する
            </Link>
            <p className="text-xs text-muted">
              あと{80 - overall}点でSランク — {SKILLS[minIndex].name}を伸ばせば届く
            </p>
            <Link
              href="/learn"
              className="flex h-12 w-full items-center justify-center rounded border border-card-border bg-card text-sm font-medium text-muted transition hover:border-foreground/20 hover:text-foreground"
            >
              まず{SKILLS[minIndex].name}の「型」を学ぶ
            </Link>
          </>
        ) : (
          <>
            <Link href="/learn" className="lp-cta-btn w-full text-center">
              まず{SKILLS[minIndex].name}の「型」を学ぶ
            </Link>
            <Link
              href={`/roleplay?from=diagnosis&weakest=${encodeURIComponent(SKILLS[minIndex].name)}`}
              className="flex h-12 w-full items-center justify-center rounded border border-card-border bg-card text-sm font-medium text-muted transition hover:border-foreground/20 hover:text-foreground"
            >
              AIロープレを試してみる
            </Link>
          </>
        )}
        <button
          onClick={onRetry}
          className="mt-2 text-xs font-medium text-muted transition hover:text-foreground"
        >
          もう一度診断する
        </button>
      </div>

      {/* Plan recommendation based on diagnosis result */}
      <div
        className="diagnosis-fade-in mt-10 w-full max-w-sm"
        style={{ animationDelay: "2s" }}
      >
        <div className="rounded-2xl border border-card-border bg-card p-5">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-muted text-center">
            あなたにおすすめのプラン
          </p>
          {overall >= 70 ? (
            <>
              <div className="mb-2 flex items-center justify-center gap-1.5">
                <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[9px] font-bold text-accent">診断結果に基づく推奨</span>
              </div>
              <p className="text-sm font-bold text-center mb-1">Proプラン</p>
              <p className="text-xs text-muted text-center leading-relaxed mb-3">
                スコア{overall}点のあなたは既に基礎ができています。<span className="text-foreground font-semibold">商談前の最終リハ</span>と<span className="text-foreground font-semibold">弱点カテゴリの徹底練習</span>で、A/Sランクを目指す段階です。月60回で毎日積み上げられます。
              </p>
              <div className="text-center text-lg font-bold text-accent mb-1">¥1,980<span className="text-xs text-muted font-normal">/月</span></div>
              <p className="text-[10px] text-muted text-center mb-2">1日あたり約66円・いつでも解約可</p>
            </>
          ) : overall >= 40 ? (
            <>
              <div className="mb-2 flex items-center justify-center gap-1.5">
                <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[9px] font-bold text-accent">診断結果に基づく推奨</span>
              </div>
              <p className="text-sm font-bold text-center mb-1">Starterプラン</p>
              <p className="text-xs text-muted text-center leading-relaxed mb-3">
                スコア{overall}点のあなたは、<span className="text-foreground font-semibold">型を固めれば一気に伸びる</span>段階です。全22レッスンで弱点の「型」を学び、月30回のロープレで身体に染み込ませましょう。
              </p>
              <div className="text-center text-lg font-bold text-accent mb-1">¥990<span className="text-xs text-muted font-normal">/月</span></div>
              <p className="text-[10px] text-muted text-center mb-2">1日あたり約33円・いつでも解約可</p>
            </>
          ) : (
            <>
              <div className="mb-2 flex items-center justify-center gap-1.5">
                <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[9px] font-bold text-accent">まずは無料で</span>
              </div>
              <p className="text-sm font-bold text-center mb-1">無料プランから始めよう</p>
              <p className="text-xs text-muted text-center leading-relaxed mb-3">
                AIロープレを<span className="text-foreground font-semibold">累計5回まで無料</span>でお試しいただけます。基本3レッスンで営業の型を学んでから、実戦形式のロープレに挑戦しましょう。
              </p>
              <p className="text-[10px] text-muted text-center mb-2">クレジットカード登録不要</p>
            </>
          )}
          <div className="text-center">
            <Link
              href="/pricing"
              className="inline-flex h-10 w-full items-center justify-center rounded-lg bg-accent px-5 text-xs font-bold text-background transition hover:opacity-90"
            >
              {overall >= 40 ? "プランを見て続きを始める →" : "プランの詳細を見る →"}
            </Link>
          </div>
        </div>
      </div>

      {/* SNS Share */}
      <div
        className="diagnosis-fade-in mt-6 w-full max-w-sm"
        style={{ animationDelay: "2.2s" }}
      >
        <p className="mb-3 text-center text-[10px] font-bold uppercase tracking-[0.3em] text-muted">
          結果をシェアする
        </p>
        <div className="flex gap-3">
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-card-border bg-card px-4 py-3 text-sm font-medium text-foreground transition hover:border-foreground/20"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            X でシェア
          </a>
          <a
            href={`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-white transition hover:opacity-90"
            style={{ background: "#06C755" }}
          >
            LINE
          </a>
        </div>
      </div>

      <p
        className="mt-12 text-center text-[10px] leading-relaxed text-muted"
        style={{ maxWidth: 340 }}
      >
        ※ この5問診断であなたの営業傾向が見えました。
        <br />
        AIロープレでは実際の商談を再現し、30項目の行動チェックリストで正確な営業力スコアを算出します。
      </p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════════ */

type Phase = "intro" | "quiz" | "result";

export default function DiagnosisPage() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [currentQ, setCurrentQ] = useState(0);
  const [scores, setScores] = useState<number[]>([0, 0, 0, 0, 0]);
  const [fadeKey, setFadeKey] = useState(0);

  const handleStart = useCallback(() => {
    setPhase("quiz");
    setCurrentQ(0);
    setScores([0, 0, 0, 0, 0]);
    setFadeKey((k) => k + 1);
  }, []);

  const handleAnswer = useCallback(
    (choiceScores: SkillScores) => {
      const newScores = scores.map((s, i) => s + choiceScores[i]);
      setScores(newScores);

      if (currentQ < QUESTIONS.length - 1) {
        setCurrentQ((q) => q + 1);
        setFadeKey((k) => k + 1);
      } else {
        setPhase("result");
        setFadeKey((k) => k + 1);
      }
    },
    [scores, currentQ],
  );

  const handleRetry = useCallback(() => {
    setPhase("intro");
    setCurrentQ(0);
    setScores([0, 0, 0, 0, 0]);
    setFadeKey((k) => k + 1);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div key={fadeKey} className="diagnosis-fade-in">
        {phase === "intro" && <IntroScreen onStart={handleStart} />}
        {phase === "quiz" && (
          <QuestionScreen
            question={QUESTIONS[currentQ]}
            questionIndex={currentQ}
            scores={scores}
            onAnswer={handleAnswer}
          />
        )}
        {phase === "result" && (
          <ResultScreen scores={scores} onRetry={handleRetry} />
        )}
      </div>
    </div>
  );
}
