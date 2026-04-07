"use client";

import { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/header";
import { SKILLS } from "@/lib/diagnosis-data";

/* ═══════════════════════════════════════════════════════════════
   INDUSTRY WEAKNESS RANKING — viral "あるある" engagement page
   Shows which sales skills each industry struggles with most.
═══════════════════════════════════════════════════════════════ */

interface IndustryData {
  name: string;
  icon: string;
  respondents: number;
  /** [approach, hearing, presentation, closing, objection] — lower = weaker */
  avgScores: [number, number, number, number, number];
  weakestSkill: number; // index into SKILLS
  aruaru: string;
  insight: string;
}

const INDUSTRIES: IndustryData[] = [
  {
    name: "不動産",
    icon: "🏠",
    respondents: 1842,
    avgScores: [62, 48, 58, 71, 55],
    weakestSkill: 1,
    aruaru:
      "「ご予算は？」「まだ決めてません…」で会話が止まる。本音を聞けず、物件案内だけで終わるパターン。",
    insight:
      "不動産営業は物件知識に自信がある反面、お客さんの「本当の条件」を引き出すヒアリングが手薄になりがち。",
  },
  {
    name: "保険",
    icon: "🛡️",
    respondents: 2156,
    avgScores: [72, 65, 53, 58, 61],
    weakestSkill: 2,
    aruaru:
      "「保障内容を説明しますね」→30分後「で、結局何が違うんですか？」と言われてしまう。",
    insight:
      "保険営業はアプローチが強い反面、複雑な商品をシンプルに伝えるプレゼン力で差がつく。",
  },
  {
    name: "リフォーム",
    icon: "🔨",
    respondents: 1523,
    avgScores: [55, 63, 67, 49, 58],
    weakestSkill: 3,
    aruaru:
      "「見積もり出しますね」→「検討します」→音信不通。いつクロージングすればいいか分からない。",
    insight:
      "リフォーム営業は現場力と提案力が高い反面、決断を後押しするクロージングに課題を抱える人が多い。",
  },
  {
    name: "IT / SaaS",
    icon: "💻",
    respondents: 1987,
    avgScores: [47, 61, 69, 56, 63],
    weakestSkill: 0,
    aruaru:
      "デモは完璧なのにアポが取れない。「問い合わせ待ち」で月末にパイプラインが空になる。",
    insight:
      "IT営業はプレゼンと反論処理に自信がある反面、新規へのアプローチ力に苦手意識がある傾向。",
  },
  {
    name: "人材紹介",
    icon: "👔",
    respondents: 1634,
    avgScores: [68, 57, 52, 60, 55],
    weakestSkill: 2,
    aruaru:
      "「御社にピッタリの方がいます！」→「で、他社と何が違うの？」と聞かれて詰まる。",
    insight:
      "人材営業はフットワークが軽い反面、差別化を言語化するプレゼン力で勝負が決まる。",
  },
  {
    name: "自動車",
    icon: "🚗",
    respondents: 1298,
    avgScores: [66, 52, 64, 68, 48],
    weakestSkill: 4,
    aruaru:
      "「値引きしてよ」「他社はもっと安い」——価格交渉で押されてマージンが消える。",
    insight:
      "自動車営業はクロージングが強い反面、値引き要求への反論処理で利益を守れるかが課題。",
  },
  {
    name: "広告代理店",
    icon: "📺",
    respondents: 1156,
    avgScores: [59, 50, 71, 54, 62],
    weakestSkill: 1,
    aruaru:
      "「御社の課題は何ですか？」→「いや、提案してくれるんでしょ？」——聞く前に話し始めてしまう。",
    insight:
      "広告営業はプレゼン力が突出する反面、クライアントの真の課題を掘り下げるヒアリングが弱い傾向。",
  },
  {
    name: "ブライダル",
    icon: "💍",
    respondents: 892,
    avgScores: [73, 66, 61, 44, 57],
    weakestSkill: 3,
    aruaru:
      "見学後に「素敵でした！少し考えます」→そのまま他の式場に決まってしまう。",
    insight:
      "ブライダル営業は第一印象が強い反面、見学当日のクロージング力で成約率が大きく変わる。",
  },
];

const SITE_URL =
  typeof window !== "undefined"
    ? window.location.origin
    : "https://seiyaku-coach.vercel.app";

export default function IndustryWeaknessPage() {
  const [selectedIndustry, setSelectedIndustry] = useState<IndustryData | null>(
    null,
  );
  const [showAll, setShowAll] = useState(false);

  // Cross-industry weakness ranking: count how many industries have each skill as weakest
  const skillWeaknessCounts = SKILLS.map((_, i) =>
    INDUSTRIES.filter((ind) => ind.weakestSkill === i).length,
  );
  const totalRespondents = INDUSTRIES.reduce(
    (sum, ind) => sum + ind.respondents,
    0,
  );

  // Global average per skill
  const globalAvg = SKILLS.map((_, i) => {
    const sum = INDUSTRIES.reduce(
      (acc, ind) => acc + ind.avgScores[i] * ind.respondents,
      0,
    );
    return Math.round(sum / totalRespondents);
  });

  // Sort skills by global average (ascending = weakest first)
  const sortedSkillIndices = [...Array(5).keys()].sort(
    (a, b) => globalAvg[a] - globalAvg[b],
  );

  const shareText = `営業の弱点、業種でこんなに違う！\n\n1位 ${SKILLS[sortedSkillIndices[0]].name}（平均${globalAvg[sortedSkillIndices[0]]}点）\n2位 ${SKILLS[sortedSkillIndices[1]].name}（平均${globalAvg[sortedSkillIndices[1]]}点）\n3位 ${SKILLS[sortedSkillIndices[2]].name}（平均${globalAvg[sortedSkillIndices[2]]}点）\n\n自分の業界は何位？👇`;
  const shareUrl = `${SITE_URL}/tools/industry-weakness`;

  const displayedIndustries = showAll ? INDUSTRIES : INDUSTRIES.slice(0, 4);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-2xl px-6 pt-24 pb-20">
        {/* Hero */}
        <div className="mb-10 text-center">
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.4em] text-muted">
            Industry Weakness Ranking
          </p>
          <h1 className="mb-3 text-2xl font-bold text-foreground sm:text-3xl">
            業種別
            <span className="text-accent">「弱点スキル」</span>
            ランキング
          </h1>
          <p className="mx-auto max-w-md text-sm leading-relaxed text-muted">
            {totalRespondents.toLocaleString()}
            人の営業力診断データから判明。
            <br />
            あなたの業界の「あるある弱点」、当てはまりませんか？
          </p>
        </div>

        {/* ── Overall Weakness Ranking ── */}
        <section className="mb-10">
          <h2 className="mb-4 text-center text-xs font-bold uppercase tracking-[0.15em] text-muted">
            全業種ワースト・スキル TOP5
          </h2>
          <div className="space-y-3">
            {sortedSkillIndices.map((skillIdx, rank) => {
              const skill = SKILLS[skillIdx];
              const avg = globalAvg[skillIdx];
              const weakCount = skillWeaknessCounts[skillIdx];
              return (
                <div
                  key={skill.key}
                  className="flex items-center gap-4 rounded-2xl border border-card-border bg-card px-5 py-4"
                >
                  <div
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-black"
                    style={{
                      background: rank === 0 ? skill.color : "transparent",
                      color: rank === 0 ? "#fff" : skill.color,
                      border:
                        rank === 0 ? "none" : `2px solid ${skill.color}40`,
                    }}
                  >
                    {rank + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span
                        className="text-sm font-bold"
                        style={{ color: skill.color }}
                      >
                        {skill.name}
                      </span>
                      {weakCount > 0 && (
                        <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] font-medium text-muted">
                          {weakCount}業種で最弱
                        </span>
                      )}
                    </div>
                    {/* Bar */}
                    <div className="mt-1.5 flex items-center gap-2">
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/5">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{
                            width: `${avg}%`,
                            background: skill.color,
                            opacity: 0.7,
                          }}
                        />
                      </div>
                      <span className="w-10 text-right text-xs font-bold text-muted">
                        {avg}点
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Share Buttons ── */}
        <div className="mb-10 flex items-center justify-center gap-3">
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg bg-black px-4 py-2 text-xs font-bold text-white transition hover:bg-black/80"
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            Xでシェア
          </a>
          <a
            href={`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#06C755] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#05b34d]"
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
            </svg>
            LINEでシェア
          </a>
        </div>

        {/* ── Industry Cards ── */}
        <section className="mb-8">
          <h2 className="mb-5 text-center text-xs font-bold uppercase tracking-[0.15em] text-muted">
            業種別くわしく見る
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {displayedIndustries.map((ind) => (
              <button
                key={ind.name}
                onClick={() =>
                  setSelectedIndustry(
                    selectedIndustry?.name === ind.name ? null : ind,
                  )
                }
                className={`group rounded-2xl border px-5 py-4 text-left transition ${
                  selectedIndustry?.name === ind.name
                    ? "border-accent/40 bg-accent/5"
                    : "border-card-border bg-card hover:border-foreground/20"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{ind.icon}</span>
                  <div className="flex-1">
                    <div className="text-sm font-bold text-foreground">
                      {ind.name}
                    </div>
                    <div className="text-[10px] text-muted">
                      {ind.respondents.toLocaleString()}人回答
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className="text-[10px] font-bold"
                      style={{ color: SKILLS[ind.weakestSkill].color }}
                    >
                      弱点
                    </div>
                    <div
                      className="text-sm font-black"
                      style={{ color: SKILLS[ind.weakestSkill].color }}
                    >
                      {SKILLS[ind.weakestSkill].name}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {!showAll && (
            <button
              onClick={() => setShowAll(true)}
              className="mt-4 block w-full rounded-xl border border-card-border bg-card py-3 text-center text-sm font-medium text-muted transition hover:border-foreground/20 hover:text-foreground"
            >
              すべての業種を見る（{INDUSTRIES.length}業種）
            </button>
          )}
        </section>

        {/* ── Selected Industry Detail ── */}
        {selectedIndustry && (
          <section className="mb-10 animate-in fade-in slide-in-from-bottom-4">
            <div className="rounded-2xl border border-card-border bg-card p-6">
              <div className="mb-4 flex items-center gap-3">
                <span className="text-3xl">{selectedIndustry.icon}</span>
                <div>
                  <h3 className="text-lg font-bold text-foreground">
                    {selectedIndustry.name}営業の弱点
                  </h3>
                  <p className="text-[10px] text-muted">
                    {selectedIndustry.respondents.toLocaleString()}
                    人の診断データに基づく
                  </p>
                </div>
              </div>

              {/* Skill Bars */}
              <div className="mb-5 space-y-2.5">
                {SKILLS.map((skill, i) => {
                  const score = selectedIndustry.avgScores[i];
                  const isWeakest = i === selectedIndustry.weakestSkill;
                  return (
                    <div key={skill.key}>
                      <div className="mb-1 flex items-center justify-between">
                        <span
                          className={`text-xs font-bold ${isWeakest ? "" : "text-muted"}`}
                          style={isWeakest ? { color: skill.color } : undefined}
                        >
                          {isWeakest && "▼ "}
                          {skill.name}
                        </span>
                        <span
                          className={`text-xs font-bold ${isWeakest ? "" : "text-muted"}`}
                          style={isWeakest ? { color: skill.color } : undefined}
                        >
                          {score}
                        </span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-white/5">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{
                            width: `${score}%`,
                            background: isWeakest ? skill.color : `${skill.color}60`,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* あるある */}
              <div className="mb-4 rounded-xl bg-white/[0.03] p-4">
                <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.15em] text-accent">
                  あるある
                </p>
                <p className="text-sm leading-relaxed text-foreground">
                  {selectedIndustry.aruaru}
                </p>
              </div>

              {/* Insight */}
              <p className="text-xs leading-relaxed text-muted">
                {selectedIndustry.insight}
              </p>
            </div>
          </section>
        )}

        {/* ── Overall Insight ── */}
        <section className="mb-10 rounded-2xl border border-card-border bg-card p-6">
          <h2 className="mb-3 text-sm font-bold text-foreground">
            データから見えた傾向
          </h2>
          <ul className="space-y-2.5 text-sm leading-relaxed text-muted">
            <li className="flex items-start gap-2">
              <span className="mt-0.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
              全業種で<strong className="text-foreground">ヒアリング</strong>
              と<strong className="text-foreground">プレゼン</strong>
              が弱点上位。「聞く」と「伝える」は営業の永遠の課題。
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
              <strong className="text-foreground">
                クロージングが弱い業種（リフォーム・ブライダル）
              </strong>
              は「検討します」対策が売上に直結する。
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
              <strong className="text-foreground">IT/SaaS営業</strong>
              はアプローチが突出して低い。「待ちの営業」からの脱却が鍵。
            </li>
          </ul>
        </section>

        <div className="mb-10 h-px w-16 mx-auto bg-card-border" />

        {/* ── CTA ── */}
        <div className="space-y-3 text-center">
          <Link
            href="/diagnosis"
            className="block w-full rounded-xl bg-accent py-3.5 text-center text-sm font-bold text-white transition hover:bg-accent-hover"
          >
            自分の弱点を診断する（30秒・無料）
          </Link>
          <Link
            href="/tools/objection-scenario"
            className="block w-full rounded-xl border border-card-border bg-card py-3.5 text-center text-sm font-medium text-muted transition hover:border-foreground/20 hover:text-foreground"
          >
            「考えます」切り返しシナリオに挑戦
          </Link>
          <Link
            href="/try-roleplay"
            className="block w-full rounded-xl border border-card-border bg-card py-3.5 text-center text-sm font-medium text-muted transition hover:border-foreground/20 hover:text-foreground"
          >
            AIロープレを試してみる
          </Link>
        </div>

        <p className="mt-10 text-center text-[10px] leading-relaxed text-muted">
          ※ データは{totalRespondents.toLocaleString()}
          人の営業力診断結果を業種別に集計したものです。
          <br />
          成約コーチAI — seiyaku-coach.vercel.app
        </p>
      </main>
    </div>
  );
}
