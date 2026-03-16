import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { JsonLd } from "@/components/json-ld";
import { createClient } from "@/lib/supabase/server";

/* ─── SEO Metadata ─── */

const SITE_URL =
  process.env.NEXT_PUBLIC_APP_URL || "https://sokukime-ai.vercel.app";

export const metadata: Metadata = {
  title:
    "営業研修を無料でオンライン受講 | 22レッスン+認定試験 | 成約コーチAI",
  description:
    "1,600件の商談から体系化した成約5ステップメソッド。22レッスン・3レベル構成の営業学習プログラム。理論→トーク例→クイズ→実践の4ステップで確実にスキルアップ。",
  openGraph: {
    title:
      "営業研修を無料でオンライン受講 | 22レッスン+認定試験 | 成約コーチAI",
    description:
      "1,600件の商談から体系化した成約5ステップメソッド。22レッスン・3レベル構成の営業学習プログラム。理論→トーク例→クイズ→実践の4ステップで確実にスキルアップ。",
    url: `${SITE_URL}/lp/learn`,
    type: "website",
    locale: "ja_JP",
    siteName: "成約コーチ AI",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "営業研修を無料でオンライン受講 | 22レッスン+認定試験 | 成約コーチAI",
    description:
      "1,600件の商談から体系化した成約5ステップメソッド。22レッスン・3レベル構成の営業学習プログラム。",
  },
  alternates: {
    canonical: `${SITE_URL}/lp/learn`,
  },
};

/* ─── Data ─── */

const methodSteps = [
  {
    num: 1,
    name: "アプローチ",
    desc: "信頼構築・前提設定・心理的安全の確保",
    color: "#0F6E56",
  },
  {
    num: 2,
    name: "ヒアリング",
    desc: "質問でニーズを引き出し、問題を深掘り",
    color: "#0F6E56",
  },
  {
    num: 3,
    name: "プレゼン",
    desc: "特徴ではなく価値（ベネフィット）で伝える",
    color: "#0F6E56",
  },
  {
    num: 4,
    name: "クロージング",
    desc: "社会的証明・一貫性の活用・段階的訴求",
    color: "#2563EB",
  },
  {
    num: 5,
    name: "反論処理",
    desc: "共感→確認→根拠提示→行動促進の4ステップ",
    color: "#7C3AED",
  },
];

const curriculum = [
  {
    level: "初級",
    levelEn: "Beginner",
    color: "#0F6E56",
    subtitle: "アプローチ・ヒアリング・プレゼン",
    lessonCount: 8,
    lessons: [
      "営業マインドセット",
      "褒める技術",
      "前提設定",
      "メラビアンの法則",
      "質問力・ヒアリング",
      "ニーズの深掘り",
      "利点話法",
      "ベネフィット提示",
    ],
  },
  {
    level: "中級",
    levelEn: "Intermediate",
    color: "#2563EB",
    subtitle: "クロージング",
    lessonCount: 7,
    lessons: [
      "社会的証明",
      "一貫性の法則",
      "第三者話法",
      "ポジティブクロージング",
      "ネガティブクロージング",
      "欲求パターン分析",
      "段階的訴求技法",
    ],
  },
  {
    level: "上級",
    levelEn: "Advanced",
    color: "#7C3AED",
    subtitle: "反論処理・切り返し",
    lessonCount: 7,
    lessons: [
      "反論処理概論",
      "「考えたい」の切り返し",
      "「高い」の切り返し",
      "「他社と比較したい」の切り返し",
      "「今じゃない」の切り返し",
      "共感→フック→AREA話法",
      "総合切り返しトレーニング",
    ],
  },
];

const learningFlow = [
  {
    num: 1,
    title: "理論解説",
    desc: "営業心理学に基づく理論をわかりやすく解説。なぜそのテクニックが効くのかを理解。",
    icon: "book",
  },
  {
    num: 2,
    title: "トーク例",
    desc: "実際の営業シーンで使えるトーク例を掲載。すぐに使えるフレーズを学習。",
    icon: "chat",
  },
  {
    num: 3,
    title: "確認クイズ",
    desc: "3問のクイズで理解度をチェック。間違えた箇所は復習して定着させる。",
    icon: "quiz",
  },
  {
    num: 4,
    title: "実践練習",
    desc: "AIロープレで学んだテクニックを実践。フィードバックでさらにスキルアップ。",
    icon: "practice",
  },
];

const comparisons = [
  {
    method: "集合研修",
    price: "¥50,000〜/回",
    timing: "開催日のみ",
    pace: "全員同じ",
    practice: "限定的",
    measurement: "なし",
  },
  {
    method: "営業コンサル",
    price: "¥100,000〜/月",
    timing: "予約制",
    pace: "コンサル次第",
    practice: "対面のみ",
    measurement: "主観評価",
  },
  {
    method: "成約コーチ AI",
    price: "¥0〜¥2,980/月",
    timing: "24時間365日",
    pace: "自分のペース",
    practice: "AI無制限",
    measurement: "スコア可視化",
    highlight: true,
  },
];

const faqs = [
  {
    q: "本当に無料で学習できますか？",
    a: "はい。全22レッスンの理論解説・トーク例・確認クイズは完全無料でご利用いただけます。登録不要で今すぐ学習を始められます。",
  },
  {
    q: "1レッスンにかかる時間はどれくらいですか？",
    a: "1レッスンあたり約5〜10分で完了できます。移動中やスキマ時間を活用して、無理なく学習を進められます。",
  },
  {
    q: "営業未経験ですが大丈夫ですか？",
    a: "はい。初級レッスンは営業の基礎から丁寧に解説しています。未経験者でも段階的にスキルを身につけられるカリキュラム構成です。",
  },
  {
    q: "認定試験とは何ですか？",
    a: "全22レッスンを完了後に受験できる総合テストです。20問中16問以上（80%）の正答で合格となり、認定証を取得できます。営業スキルの証明としてご活用いただけます。",
  },
  {
    q: "チームや部下に受講させたいのですが？",
    a: "各メンバーがアカウントを作成し、自分のペースで学習を進められます。認定試験の合否でスキル到達度を確認できるため、研修の効果測定にもご利用いただけます。",
  },
  {
    q: "AIロープレとの違いは何ですか？",
    a: "学習コースは「知識のインプット」、AIロープレは「実践のアウトプット」です。学習コースで理論を学び、AIロープレで実践するのが最も効果的な使い方です。",
  },
];

/* ─── SVG Icons ─── */

function FlowIcon({ type }: { type: string }) {
  const cls = "w-10 h-10";
  switch (type) {
    case "book":
      return (
        <svg viewBox="0 0 48 48" className={cls} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
          <path d="M8 6h32v36H8z" />
          <path d="M16 6v36" />
          <path d="M22 16h12M22 24h10M22 32h8" />
        </svg>
      );
    case "chat":
      return (
        <svg viewBox="0 0 48 48" className={cls} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
          <path d="M6 10h28v20H16l-6 6v-6H6z" />
          <path d="M18 30h18v14l-4-4H18z" />
          <circle cx="15" cy="20" r="1.5" fill="currentColor" />
          <circle cx="21" cy="20" r="1.5" fill="currentColor" />
          <circle cx="27" cy="20" r="1.5" fill="currentColor" />
        </svg>
      );
    case "quiz":
      return (
        <svg viewBox="0 0 48 48" className={cls} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
          <circle cx="24" cy="24" r="20" />
          <path d="M18 18c0-4 3-6 6-6s6 2 6 6-3 5-6 6v2" />
          <circle cx="24" cy="34" r="1.5" fill="currentColor" />
        </svg>
      );
    case "practice":
      return (
        <svg viewBox="0 0 48 48" className={cls} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
          <circle cx="16" cy="16" r="8" />
          <path d="M10 42c0-6 3-10 6-10" />
          <circle cx="32" cy="16" r="8" />
          <path d="M38 42c0-6-3-10-6-10" />
          <path d="M20 28h8" />
          <path d="M24 24v8" />
        </svg>
      );
    default:
      return null;
  }
}

/* ─── Page ─── */

export default async function LearnLP() {
  let isLoggedIn = false;
  try {
    const supabase = await createClient();
    if (supabase) {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      isLoggedIn = !!user;
    }
  } catch {
    // Supabase unavailable
  }

  const jsonLdData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${SITE_URL}/lp/learn`,
        name: "営業研修を無料でオンライン受講 | 22レッスン+認定試験 | 成約コーチAI",
        description:
          "1,600件の商談から体系化した成約5ステップメソッド。22レッスン・3レベル構成の営業学習プログラム。",
        url: `${SITE_URL}/lp/learn`,
        isPartOf: { "@id": `${SITE_URL}/#website` },
        publisher: { "@id": `${SITE_URL}/#organization` },
        inLanguage: "ja",
      },
      {
        "@type": "Course",
        name: "成約5ステップメソッド 営業学習プログラム",
        description:
          "1,600件の商談から体系化した営業メソッド。22レッスン・3レベル構成。理論→トーク例→クイズ→実践の4ステップで確実にスキルアップ。",
        provider: {
          "@type": "Organization",
          name: "成約コーチ AI",
          url: SITE_URL,
        },
        url: `${SITE_URL}/learn`,
        numberOfCredits: 22,
        educationalLevel: "Beginner to Advanced",
        inLanguage: "ja",
        isAccessibleForFree: true,
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "JPY",
          availability: "https://schema.org/InStock",
          category: "Free",
        },
        hasCourseInstance: {
          "@type": "CourseInstance",
          courseMode: "Online",
          courseWorkload: "PT4H",
        },
      },
      {
        "@type": "FAQPage",
        "@id": `${SITE_URL}/lp/learn#faq`,
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.q,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.a,
          },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "ホーム",
            item: SITE_URL,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "営業学習プログラム",
            item: `${SITE_URL}/lp/learn`,
          },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      <JsonLd data={jsonLdData} />
      <Header user={{ isLoggedIn }} />

      {/* ═══════════════════════════════════════════════
          1. HERO
      ═══════════════════════════════════════════════ */}
      <section className="relative overflow-hidden px-6 pt-24 pb-16 sm:pt-32 sm:pb-24">
        <div
          className="blob blob-teal"
          style={{ width: 350, height: 350, top: -80, right: -100 }}
        />
        <div
          className="blob blob-cream"
          style={{ width: 250, height: 250, bottom: -60, left: -80 }}
        />

        <div className="relative z-10 mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent">
            <svg
              className="h-4 w-4 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
            22レッスン+認定試験 営業学習プログラム
          </div>

          <h1
            className="mb-6 text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl"
            style={{ textWrap: "balance" } as React.CSSProperties}
          >
            1,600件の商談から体系化。
            <br />
            <span className="text-accent">
              営業の&ldquo;型&rdquo;を22レッスンで習得
            </span>
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-base text-muted leading-relaxed sm:text-lg">
            理論 → トーク例 → クイズ → 実践。
            <br className="hidden sm:block" />
            初級〜上級の3レベル構成で、体系的に営業スキルを身につける。
          </p>

          {/* Stats */}
          <div className="mx-auto mb-10 flex max-w-lg items-center justify-center gap-6 sm:gap-10">
            {[
              { value: "22", unit: "レッスン" },
              { value: "3", unit: "レベル構成" },
              { value: "0", unit: "円で開始" },
            ].map((s) => (
              <div key={s.unit} className="text-center">
                <p className="text-2xl font-extrabold text-accent sm:text-3xl">
                  {s.value}
                </p>
                <p className="mt-1 text-xs text-muted">{s.unit}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="flex flex-col items-center gap-4">
            <Link href="/learn" className="morph-btn">
              <span className="btn-fill" />
              <span className="shadow" />
              <span className="btn-text">
                {"無料で学習を始める".split("").map((char, i) => (
                  <span key={i} style={{ "--i": i } as React.CSSProperties}>
                    {char}
                  </span>
                ))}
              </span>
              <span className="orbit-dots">
                <span />
                <span />
                <span />
                <span />
              </span>
              <span className="corners">
                <span />
                <span />
                <span />
                <span />
              </span>
            </Link>
            <p className="text-sm text-muted">
              &#10003; 登録不要&ensp;&#10003; 全レッスン無料&ensp;&#10003;
              スマホ対応
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          2. METHOD OVERVIEW (5ステップ)
      ═══════════════════════════════════════════════ */}
      <section className="px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-4xl">
          <h2
            className="mb-4 text-center text-2xl font-bold text-foreground sm:text-3xl"
            style={{ textWrap: "balance" } as React.CSSProperties}
          >
            営業心理学に基づく再現性のある&ldquo;型&rdquo;
          </h2>
          <p className="mb-12 text-center text-sm text-muted sm:text-base">
            成約5ステップメソッドの全体像
          </p>

          {/* 5-step horizontal flow */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-0">
            {methodSteps.map((step, i) => (
              <div key={step.name} className="flex items-center">
                <div className="flex flex-col items-center text-center w-36 sm:w-32">
                  <div
                    className="flex h-14 w-14 items-center justify-center rounded-full text-white text-lg font-bold"
                    style={{ backgroundColor: step.color }}
                  >
                    {step.num}
                  </div>
                  <p className="mt-2 text-sm font-bold text-foreground">
                    {step.name}
                  </p>
                  <p className="mt-1 text-xs text-muted leading-snug">
                    {step.desc}
                  </p>
                </div>
                {/* Arrow between steps */}
                {i < methodSteps.length - 1 && (
                  <svg
                    className="hidden sm:block h-5 w-5 flex-shrink-0 text-card-border mx-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                )}
                {i < methodSteps.length - 1 && (
                  <svg
                    className="sm:hidden h-5 w-5 text-card-border my-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 14l-7 7-7-7"
                    />
                  </svg>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          3. CURRICULUM DETAILS
      ═══════════════════════════════════════════════ */}
      <section className="relative overflow-hidden px-6 py-16 sm:py-24">
        <div
          className="blob blob-pink"
          style={{ width: 300, height: 300, top: -40, left: -60 }}
        />
        <div className="relative z-10 mx-auto max-w-5xl">
          <h2
            className="mb-4 text-center text-2xl font-bold text-foreground sm:text-3xl"
            style={{ textWrap: "balance" } as React.CSSProperties}
          >
            3レベル×22レッスンの体系的カリキュラム
          </h2>
          <p className="mb-12 text-center text-sm text-muted sm:mb-16 sm:text-base">
            基礎から応用まで、段階的にスキルを積み上げる
          </p>

          <div className="space-y-8">
            {curriculum.map((level) => (
              <div
                key={level.level}
                className="rounded-2xl bg-white p-6 shadow-sm sm:p-8"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 mb-6">
                  <div className="flex items-center gap-3">
                    <span
                      className="inline-flex items-center justify-center rounded-lg px-3 py-1 text-xs font-bold text-white tracking-wider"
                      style={{ backgroundColor: level.color }}
                    >
                      {level.level}
                    </span>
                    <span className="text-xs text-muted font-medium">
                      {level.lessonCount}レッスン
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-foreground">
                    {level.subtitle}
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {level.lessons.map((lesson, i) => (
                    <div
                      key={lesson}
                      className="flex items-center gap-3 rounded-lg bg-background px-4 py-3"
                    >
                      <span
                        className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                        style={{ backgroundColor: level.color, opacity: 0.8 }}
                      >
                        {i + 1}
                      </span>
                      <span className="text-sm text-foreground">{lesson}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Certification Exam */}
            <div className="rounded-2xl border-2 border-accent bg-accent/5 p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-3">
                <span className="inline-flex items-center justify-center rounded-lg bg-accent px-3 py-1 text-xs font-bold text-white tracking-wider">
                  認定試験
                </span>
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">
                成約メソッド認定試験
              </h3>
              <p className="text-sm text-muted leading-relaxed">
                全22レッスン完了後に受験可能。20問中16問以上（80%）の正答で合格。
                認定証を取得して、営業スキルの習得を証明できます。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          4. LEARNING FLOW (4ステップ)
      ═══════════════════════════════════════════════ */}
      <section className="px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-4xl">
          <h2
            className="mb-4 text-center text-2xl font-bold text-foreground sm:text-3xl"
            style={{ textWrap: "balance" } as React.CSSProperties}
          >
            各レッスンの4ステップ構成
          </h2>
          <p className="mb-12 text-center text-sm text-muted sm:text-base">
            インプットからアウトプットまで、1レッスンで完結
          </p>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {learningFlow.map((step) => (
              <div
                key={step.title}
                className="relative rounded-2xl bg-white p-6 shadow-sm text-center"
              >
                {/* Step number badge */}
                <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-accent font-bold text-sm">
                  {step.num}
                </div>
                <div className="mx-auto mb-4 text-accent">
                  <FlowIcon type={step.icon} />
                </div>
                <h3 className="mb-2 text-base font-bold text-foreground">
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Intermediate CTA */}
          <div className="mt-12 flex flex-col items-center gap-4">
            <Link href="/learn" className="morph-btn">
              <span className="btn-fill" />
              <span className="shadow" />
              <span className="btn-text">
                {"無料で学習を始める".split("").map((char, i) => (
                  <span key={i} style={{ "--i": i } as React.CSSProperties}>
                    {char}
                  </span>
                ))}
              </span>
              <span className="orbit-dots">
                <span />
                <span />
                <span />
                <span />
              </span>
              <span className="corners">
                <span />
                <span />
                <span />
                <span />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          5. COMPARISON TABLE
      ═══════════════════════════════════════════════ */}
      <section className="relative overflow-hidden px-6 py-16 sm:py-24">
        <div
          className="blob blob-cream"
          style={{ width: 300, height: 300, bottom: -60, right: -80 }}
        />
        <div className="relative z-10 mx-auto max-w-4xl">
          <h2
            className="mb-4 text-center text-2xl font-bold text-foreground sm:text-3xl"
            style={{ textWrap: "balance" } as React.CSSProperties}
          >
            他の研修との比較
          </h2>
          <p className="mb-12 text-center text-sm text-muted sm:text-base">
            コスト・利便性・効果で圧倒的な違い
          </p>

          {/* Mobile: stacked cards */}
          <div className="sm:hidden space-y-4">
            {comparisons.map((c) => (
              <div
                key={c.method}
                className={`rounded-2xl p-5 ${
                  c.highlight
                    ? "border-2 border-accent bg-accent/5"
                    : "bg-white shadow-sm"
                }`}
              >
                <p
                  className={`text-base font-bold mb-3 ${
                    c.highlight ? "text-accent" : "text-foreground"
                  }`}
                >
                  {c.method}
                  {c.highlight && (
                    <span className="ml-2 inline-flex items-center rounded-full bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent">
                      おすすめ
                    </span>
                  )}
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted">料金</span>
                    <span className="font-semibold text-foreground">
                      {c.price}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">利用時間</span>
                    <span className="font-semibold text-foreground">
                      {c.timing}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">学習ペース</span>
                    <span className="font-semibold text-foreground">
                      {c.pace}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">実践練習</span>
                    <span className="font-semibold text-foreground">
                      {c.practice}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">効果測定</span>
                    <span className="font-semibold text-foreground">
                      {c.measurement}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop: table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-card-border">
                  <th className="pb-4 text-left font-semibold text-muted" />
                  {comparisons.map((c) => (
                    <th
                      key={c.method}
                      className={`pb-4 text-center font-bold ${
                        c.highlight ? "text-accent" : "text-foreground"
                      }`}
                    >
                      {c.method}
                      {c.highlight && (
                        <span className="ml-1 inline-flex items-center rounded-full bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent">
                          おすすめ
                        </span>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { label: "料金", key: "price" as const },
                  { label: "利用時間", key: "timing" as const },
                  { label: "学習ペース", key: "pace" as const },
                  { label: "実践練習", key: "practice" as const },
                  { label: "効果測定", key: "measurement" as const },
                ].map((row) => (
                  <tr key={row.label} className="border-b border-card-border">
                    <td className="py-4 text-muted font-medium">{row.label}</td>
                    {comparisons.map((c) => (
                      <td
                        key={c.method}
                        className={`py-4 text-center ${
                          c.highlight
                            ? "font-semibold text-accent"
                            : "text-foreground"
                        }`}
                      >
                        {c[row.key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          6. FOR MANAGERS (法人向け)
      ═══════════════════════════════════════════════ */}
      <section className="px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-2xl bg-foreground p-8 sm:p-12 text-center">
            <p className="mb-2 text-sm font-medium text-accent tracking-wide">
              FOR MANAGERS
            </p>
            <h2 className="mb-4 text-2xl font-bold text-white sm:text-3xl">
              チームの営業力を底上げしたい
              <br className="sm:hidden" />
              マネージャーへ
            </h2>
            <p className="mx-auto mb-8 max-w-xl text-sm leading-relaxed text-gray-300">
              部下全員が同じ&ldquo;型&rdquo;を学べるから、営業品質が安定。
              各自のペースで24時間学習でき、認定試験でスキル到達度を可視化できます。
            </p>

            <div className="mx-auto grid max-w-2xl grid-cols-1 gap-4 sm:grid-cols-3">
              {[
                {
                  title: "統一された型",
                  desc: "全員が同じメソッドを学び、営業品質を標準化",
                },
                {
                  title: "24時間学習",
                  desc: "各自のペースで、スキマ時間に効率よく学習",
                },
                {
                  title: "スキル可視化",
                  desc: "認定試験で到達度を測定し、成長を把握",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-xl bg-white/10 p-5 text-left"
                >
                  <p className="mb-1 text-sm font-bold text-white">
                    {item.title}
                  </p>
                  <p className="text-xs leading-relaxed text-gray-400">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <Link
                href="/learn"
                className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-white transition hover:bg-accent-hover"
              >
                まずは1レッスン試してみる
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          7. CROSS-LINKS
      ═══════════════════════════════════════════════ */}
      <section className="px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-4 text-center text-2xl font-bold text-foreground sm:text-3xl">
            学んだことを実践で磨く
          </h2>
          <p className="mb-12 text-center text-sm text-muted sm:text-base">
            知識のインプットと実践のアウトプットで、最速でスキルアップ
          </p>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Roleplay link */}
            <Link
              href="/lp/roleplay"
              className="group flex items-start gap-4 rounded-2xl border border-card-border bg-white p-6 shadow-sm transition hover:border-accent/40 hover:shadow-md"
            >
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm text-muted">学んだことを実践</p>
                <p className="text-base font-bold text-foreground group-hover:text-accent transition-colors">
                  AIロープレで練習する →
                </p>
                <p className="mt-1 text-xs text-muted">
                  学習したテクニックをAIとの実践ロープレで体に染み込ませる
                </p>
              </div>
            </Link>

            {/* Worksheet link */}
            <Link
              href="/lp/worksheet"
              className="group flex items-start gap-4 rounded-2xl border border-card-border bg-white p-6 shadow-sm transition hover:border-accent/40 hover:shadow-md"
            >
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm text-muted">商談準備の習慣化</p>
                <p className="text-base font-bold text-foreground group-hover:text-accent transition-colors">
                  ワークシートで準備する →
                </p>
                <p className="mt-1 text-xs text-muted">
                  学んだ5ステップメソッドで商談を事前に組み立てる
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          8. FAQ
      ═══════════════════════════════════════════════ */}
      <section className="relative overflow-hidden px-6 py-16 sm:py-24">
        <div
          className="blob blob-teal"
          style={{ width: 250, height: 250, bottom: -40, left: -60 }}
        />
        <div className="relative z-10 mx-auto max-w-3xl">
          <h2 className="mb-4 text-center text-2xl font-bold text-foreground sm:text-3xl">
            よくある質問
          </h2>
          <p className="mb-12 text-center text-sm text-muted sm:text-base">
            学習プログラムについてのよくある質問にお答えします
          </p>
          <div className="space-y-3">
            {faqs.map((faq) => (
              <details
                key={faq.q}
                className="group rounded-2xl bg-white shadow-sm"
              >
                <summary className="flex cursor-pointer items-center justify-between px-6 py-5 text-sm font-semibold text-foreground [&::-webkit-details-marker]:hidden list-none">
                  <span>{faq.q}</span>
                  <svg
                    className="h-5 w-5 flex-shrink-0 text-muted transition-transform duration-200 group-open:rotate-180"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </summary>
                <div className="border-t border-card-border px-6 pb-5 pt-4 text-sm leading-relaxed text-muted">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          9. FINAL CTA
      ═══════════════════════════════════════════════ */}
      <section className="relative overflow-hidden px-6 py-16 sm:py-24">
        <div
          className="blob blob-cream"
          style={{ width: 400, height: 400, top: -100, left: "30%" }}
        />
        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <h2
            className="mb-4 text-2xl font-bold text-foreground sm:text-3xl"
            style={{ textWrap: "balance" } as React.CSSProperties}
          >
            今日から始める、営業スキルの体系的な習得。
          </h2>
          <p className="mb-4 text-sm text-muted sm:text-base">
            1,600件の商談から生まれた実践的なカリキュラム。
            <br className="hidden sm:block" />
            まずは初級レッスン1から、あなたのペースで。
          </p>
          <p className="mb-10 text-sm text-muted">
            &#10003; 全レッスン無料 &#10003; 登録不要 &#10003; スマホ対応
          </p>
          <div className="flex flex-col items-center gap-4">
            <Link href="/learn" className="morph-btn">
              <span className="btn-fill" />
              <span className="shadow" />
              <span className="btn-text">
                {"無料で学習を始める".split("").map((char, i) => (
                  <span key={i} style={{ "--i": i } as React.CSSProperties}>
                    {char}
                  </span>
                ))}
              </span>
              <span className="orbit-dots">
                <span />
                <span />
                <span />
                <span />
              </span>
              <span className="corners">
                <span />
                <span />
                <span />
                <span />
              </span>
            </Link>
          </div>
          <div className="mt-6">
            <Link
              href="/pricing"
              className="text-sm text-muted transition hover:text-accent hover:underline"
            >
              料金プランを見る →
            </Link>
          </div>

          {/* Trust badges */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4 text-xs text-muted sm:gap-6">
            <span className="inline-flex items-center gap-1.5">
              <svg
                className="h-4 w-4 text-accent"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              SSL暗号化通信
            </span>
            <span className="inline-flex items-center gap-1.5">
              <svg
                className="h-4 w-4 text-accent"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              データ安全保護
            </span>
            <span className="inline-flex items-center gap-1.5">
              <svg
                className="h-4 w-4 text-accent"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
              スマホ対応
            </span>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
