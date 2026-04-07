import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { JsonLd } from "@/components/json-ld";

/* ─── SEO Metadata ─── */

const SITE_URL =
  process.env.NEXT_PUBLIC_APP_URL || "https://seiyaku-coach.vercel.app";

export const metadata: Metadata = {
  title: "AI営業分析ワークシート | 商談準備・振り返りツール",
  description:
    "商談前の準備と商談後の振り返りをAIがサポート。営業の勝ちパターンを可視化する分析ワークシート。5ステップメソッドに基づく体系的な営業改善ツール。",
  openGraph: {
    title: "AI営業分析ワークシート | 商談準備・振り返りツール | 成約コーチAI",
    description:
      "商談前の準備と商談後の振り返りをAIがサポート。営業の勝ちパターンを可視化する分析ワークシート。",
    url: `${SITE_URL}/lp/worksheet`,
    type: "website",
    locale: "ja_JP",
    siteName: "成約コーチAI",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI営業分析ワークシート | 商談準備・振り返りツール | 成約コーチAI",
    description:
      "商談前の準備と商談後の振り返りをAIがサポート。営業の勝ちパターンを可視化する分析ワークシート。",
  },
  alternates: {
    canonical: `${SITE_URL}/worksheet`,
  },
};

/* ─── Data ─── */

const challenges = [
  {
    icon: "question",
    text: "商談前に何を準備すればいいかわからない",
  },
  {
    icon: "feeling",
    text: "商談後の振り返りが感覚頼み",
  },
  {
    icon: "person",
    text: "勝ちパターンが属人化している",
  },
];

const features = [
  {
    title: "商談準備シート",
    desc: "顧客情報・ニーズ仮説・提案ストーリーを整理。商談前に「何を伝えるか」を明確にする。",
    items: ["顧客の基本情報と課題整理", "ニーズの仮説立て", "提案ストーリーの組み立て"],
  },
  {
    title: "商談振り返り分析",
    desc: "5ステップごとに自己採点し、AIが分析。感覚ではなくデータで振り返る。",
    items: [
      "アプローチ〜反論処理の5段階採点",
      "AIによる客観的フィードバック",
      "成功・失敗パターンの蓄積",
    ],
  },
  {
    title: "改善アクションの自動提案",
    desc: "分析結果からAIが次の商談で実践すべきアクションを具体的に提案。",
    items: [
      "弱点に基づく改善ポイント",
      "次回の商談で使えるトーク例",
      "優先順位付きのアクションリスト",
    ],
  },
];

const scenes = [
  {
    title: "商談30分前のクイック準備",
    desc: "移動中や待ち時間に、スマホでサッと要点を整理。準備ゼロで商談に臨むことがなくなる。",
    time: "30分前",
  },
  {
    title: "商談直後の記憶が新しいうちに振り返り",
    desc: "帰りの電車やカフェで、商談の記憶が鮮明なうちにAIと一緒に分析。時間が経つと忘れる細部を逃さない。",
    time: "直後",
  },
  {
    title: "週次の営業MTGで数字の裏付けに",
    desc: "蓄積された分析データを元に、上司やチームへの報告・改善提案ができる。感覚ではなくデータで語る。",
    time: "週次",
  },
];

const faqs = [
  {
    q: "ワークシートは無料で使えますか？",
    a: "はい。無料アカウントでもワークシートの全機能をご利用いただけます。登録不要で今すぐお試しいただけます。",
  },
  {
    q: "どんな業種・商材に対応していますか？",
    a: "業種・商材を問わずご利用いただけます。不動産、保険、SaaS、人材、教育など、あらゆる営業シーンに対応しています。",
  },
  {
    q: "データは保存されますか？",
    a: "無料アカウントではブラウザのローカルストレージに保存されます。アカウント登録（無料）いただくと、クラウドに保存され複数端末からアクセスできます。",
  },
  {
    q: "AI分析の精度はどのくらいですか？",
    a: "営業心理学に基づく5ステップメソッドの評価基準に沿って分析します。人間のコーチと同じ基準でフィードバックを提供しますが、参考値としてご活用ください。",
  },
  {
    q: "スマートフォンでも使えますか？",
    a: "はい。ブラウザから利用でき、スマートフォン・タブレット・PCすべてに対応しています。移動中でもサッと使えます。",
  },
  {
    q: "チームや上司と共有できますか？",
    a: "現在は個人利用を想定していますが、分析結果のスクリーンショットやPDFエクスポート機能でチームへの共有が可能です。チーム向け機能は準備中です。",
  },
];

/* ─── SVG Icons ─── */

function CheckIcon() {
  return (
    <svg
      className="h-5 w-5 flex-shrink-0 text-accent"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2.5}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 13l4 4L19 7"
      />
    </svg>
  );
}

/* ─── Feature Illustration SVGs ─── */

function PrepSheetScene() {
  return (
    <svg
      viewBox="0 0 120 80"
      className="w-full h-full"
      aria-hidden="true"
    >
      {/* Clipboard */}
      <rect x="30" y="8" width="60" height="68" rx="4" fill="#e8f5e9" stroke="#43a047" strokeWidth="1.5" />
      <rect x="44" y="4" width="32" height="8" rx="4" fill="#43a047" />
      <circle cx="60" cy="8" r="2.5" fill="#e8f5e9" />
      {/* Lines */}
      <rect x="38" y="20" width="30" height="3" rx="1.5" fill="#81c784" />
      <rect x="38" y="28" width="44" height="3" rx="1.5" fill="#a5d6a7" />
      <rect x="38" y="36" width="38" height="3" rx="1.5" fill="#81c784" />
      <rect x="38" y="44" width="44" height="3" rx="1.5" fill="#a5d6a7" />
      {/* Checkboxes */}
      <rect x="38" y="54" width="8" height="8" rx="2" fill="#43a047" />
      <path d="M40 58.5l2 2 4-4" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <rect x="50" y="55" width="24" height="2.5" rx="1" fill="#81c784" />
      <rect x="38" y="64" width="8" height="8" rx="2" fill="#43a047" opacity="0.4" />
      <rect x="50" y="65" width="20" height="2.5" rx="1" fill="#a5d6a7" />
      {/* Sparkle */}
      <circle cx="98" cy="16" r="3" fill="#f9a825" opacity="0.6" />
      <path d="M98 11v10M93 16h10" stroke="#f9a825" strokeWidth="1" opacity="0.4" />
    </svg>
  );
}

function ReviewScene() {
  return (
    <svg
      viewBox="0 0 120 80"
      className="w-full h-full"
      aria-hidden="true"
    >
      {/* Score card */}
      <rect x="15" y="10" width="90" height="60" rx="4" fill="#e8f5e9" stroke="#43a047" strokeWidth="1.5" />
      <rect x="15" y="10" width="90" height="12" rx="4" fill="#43a047" />
      <text x="60" y="19" fontSize="7" fill="white" fontWeight="bold" textAnchor="middle">5ステップ分析</text>
      {/* Bar chart */}
      <rect x="25" y="52" width="12" height="12" rx="1" fill="#66bb6a" />
      <rect x="41" y="42" width="12" height="22" rx="1" fill="#43a047" />
      <rect x="57" y="48" width="12" height="16" rx="1" fill="#81c784" />
      <rect x="73" y="36" width="12" height="28" rx="1" fill="#2e7d32" />
      <rect x="89" y="44" width="12" height="20" rx="1" fill="#66bb6a" />
      {/* Labels */}
      <text x="31" y="70" fontSize="4" fill="#4a5568" textAnchor="middle">AP</text>
      <text x="47" y="70" fontSize="4" fill="#4a5568" textAnchor="middle">HR</text>
      <text x="63" y="70" fontSize="4" fill="#4a5568" textAnchor="middle">PR</text>
      <text x="79" y="70" fontSize="4" fill="#4a5568" textAnchor="middle">CL</text>
      <text x="95" y="70" fontSize="4" fill="#4a5568" textAnchor="middle">OB</text>
      {/* Trend line */}
      <path d="M31 50L47 40L63 46L79 34L95 42" stroke="#1b5e20" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function ActionScene() {
  return (
    <svg
      viewBox="0 0 120 80"
      className="w-full h-full"
      aria-hidden="true"
    >
      {/* Chat bubble */}
      <rect x="20" y="8" width="80" height="56" rx="6" fill="#e8f5e9" stroke="#43a047" strokeWidth="1.5" />
      <polygon points="40,64 50,64 42,74" fill="#e8f5e9" stroke="#43a047" strokeWidth="1.5" />
      <line x1="40" y1="64" x2="50" y2="64" stroke="#e8f5e9" strokeWidth="2" />
      {/* AI badge */}
      <rect x="28" y="14" width="20" height="8" rx="4" fill="#43a047" />
      <text x="38" y="20" fontSize="5" fill="white" fontWeight="bold" textAnchor="middle">AI</text>
      {/* Action items */}
      <circle cx="32" cy="30" r="3" fill="#43a047" />
      <text x="32" y="32" fontSize="4" fill="white" fontWeight="bold" textAnchor="middle">1</text>
      <rect x="40" y="28" width="50" height="3" rx="1" fill="#81c784" />
      <circle cx="32" cy="40" r="3" fill="#43a047" />
      <text x="32" y="42" fontSize="4" fill="white" fontWeight="bold" textAnchor="middle">2</text>
      <rect x="40" y="38" width="44" height="3" rx="1" fill="#a5d6a7" />
      <circle cx="32" cy="50" r="3" fill="#43a047" />
      <text x="32" y="52" fontSize="4" fill="white" fontWeight="bold" textAnchor="middle">3</text>
      <rect x="40" y="48" width="48" height="3" rx="1" fill="#81c784" />
      {/* Lightbulb */}
      <circle cx="104" cy="14" r="5" fill="#f9a825" opacity="0.7" />
      <path d="M104 19v3" stroke="#f9a825" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      <path d="M101 22h6" stroke="#f9a825" strokeWidth="1" opacity="0.4" />
    </svg>
  );
}

/* ─── Scene Illustration SVGs ─── */

function ClockIcon() {
  return (
    <svg
      viewBox="0 0 48 48"
      className="w-12 h-12"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <circle cx="24" cy="24" r="20" />
      <path d="M24 12v12l8 4" />
    </svg>
  );
}

/* ─── Challenge Card Icons ─── */

function ChallengeIcon({ type }: { type: string }) {
  const cls = "w-10 h-10 text-red-400";
  switch (type) {
    case "question":
      return (
        <svg viewBox="0 0 48 48" className={cls} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
          <circle cx="24" cy="24" r="20" />
          <path d="M18 18c0-4 3-6 6-6s6 2 6 6-3 4-6 6v2" />
          <circle cx="24" cy="34" r="1.5" fill="currentColor" />
        </svg>
      );
    case "feeling":
      return (
        <svg viewBox="0 0 48 48" className={cls} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
          <circle cx="24" cy="24" r="20" />
          <path d="M16 28c2 4 5 6 8 6s6-2 8-6" />
          <circle cx="18" cy="20" r="2" fill="currentColor" />
          <circle cx="30" cy="20" r="2" fill="currentColor" />
          <path d="M12 14l6 4M36 14l-6 4" />
        </svg>
      );
    case "person":
      return (
        <svg viewBox="0 0 48 48" className={cls} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
          <circle cx="24" cy="16" r="8" />
          <path d="M10 42c0-8 6-14 14-14s14 6 14 14" />
          <path d="M34 10l4-4M38 10l-4-4" />
        </svg>
      );
    default:
      return null;
  }
}

/* ─── Page ─── */

export default function WorksheetLP() {
  const jsonLdData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${SITE_URL}/lp/worksheet`,
        name: "AI営業分析ワークシート | 商談準備・振り返りツール | 成約コーチAI",
        description:
          "商談前の準備と商談後の振り返りをAIがサポート。営業の勝ちパターンを可視化する分析ワークシート。5ステップメソッドに基づく体系的な営業改善ツール。",
        url: `${SITE_URL}/lp/worksheet`,
        isPartOf: { "@id": `${SITE_URL}/#website` },
        publisher: { "@id": `${SITE_URL}/#organization` },
        inLanguage: "ja",
      },
      {
        "@type": "SoftwareApplication",
        name: "AI営業分析ワークシート",
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        url: `${SITE_URL}/worksheet`,
        description:
          "商談前の準備と商談後の振り返りをAIがサポート。営業の勝ちパターンを可視化する分析ワークシート。",
        provider: { "@id": `${SITE_URL}/#organization` },
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "JPY",
          availability: "https://schema.org/InStock",
        },
        featureList:
          "商談準備シート, 商談振り返り分析, 改善アクション提案, 5ステップ採点, AI分析",
        inLanguage: "ja",
      },
      {
        "@type": "FAQPage",
        "@id": `${SITE_URL}/lp/worksheet#faq`,
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
            name: "AI営業分析ワークシート",
            item: `${SITE_URL}/lp/worksheet`,
          },
        ],
      },
    ],
  };

  const featureScenes = [<PrepSheetScene key="prep" />, <ReviewScene key="review" />, <ActionScene key="action" />];

  return (
    <div className="min-h-screen bg-background">
      <JsonLd data={jsonLdData} />
      <Header />

      {/* ═══════════════════════════════════════════════
          1. HERO
      ═══════════════════════════════════════════════ */}
      <section className="relative overflow-hidden px-6 pt-24 pb-16 sm:pt-32 sm:pb-24">
        {/* Decorative blobs */}
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
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            5ステップメソッド対応ワークシート
          </div>

          <h1 className="mb-6 text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl" style={{ textWrap: "balance" } as React.CSSProperties}>
            商談の勝ちパターンを見える化。
            <br />
            <span className="text-accent">AI営業分析ワークシート</span>
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-base text-muted leading-relaxed sm:text-lg">
            商談前の準備・商談後の振り返りをAIがサポート。
            <br className="hidden sm:block" />
            感覚に頼らない、データドリブンな営業改善を。
          </p>

          {/* CTA */}
          <div className="flex flex-col items-center gap-4">
            <Link href="/worksheet" className="morph-btn">
              <span className="btn-fill" />
              <span className="shadow" />
              <span className="btn-text">
                {"ワークシートを使ってみる（無料）".split("").map((char, i) => (
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
              &#10003; 無料で利用可能&ensp;&#10003; 登録不要&ensp;&#10003;
              スマホ対応
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          2. CHALLENGE / EMPATHY
      ═══════════════════════════════════════════════ */}
      <section className="px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-4xl">
          <h2
            className="mb-4 text-center text-2xl font-bold text-foreground sm:text-3xl"
            style={{ textWrap: "balance" } as React.CSSProperties}
          >
            こんな悩み、ありませんか？
          </h2>
          <p className="mb-12 text-center text-sm text-muted sm:text-base">
            多くの営業パーソンが抱える「準備」と「振り返り」の課題
          </p>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {challenges.map((c) => (
              <div
                key={c.text}
                className="flex flex-col items-center gap-4 rounded-2xl border border-red-200 bg-red-50/60 p-6 text-center"
              >
                <ChallengeIcon type={c.icon} />
                <p className="text-sm font-semibold leading-snug text-red-700">
                  {c.text}
                </p>
              </div>
            ))}
          </div>

          {/* Arrow */}
          <div className="my-8 flex justify-center">
            <svg
              className="h-10 w-10 text-accent"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>

          {/* Solution hint */}
          <div className="rounded-2xl border border-accent/20 bg-accent/5 p-6 text-center sm:p-8">
            <p className="text-lg font-bold text-accent sm:text-xl">
              ワークシートで、すべて解決できます。
            </p>
            <p className="mt-2 text-sm text-muted">
              AIが商談の準備から振り返りまでを仕組み化。
              属人的なノウハウをチーム全体の資産に変えます。
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          3. FEATURE DETAILS
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
            3つの機能で、商談力を底上げする
          </h2>
          <p className="mb-12 text-center text-sm text-muted sm:mb-16 sm:text-base">
            準備 → 振り返り → 改善のサイクルをAIが回す
          </p>

          <div className="space-y-8">
            {features.map((feat, i) => (
              <div
                key={feat.title}
                className={`flex flex-col gap-6 rounded-2xl bg-white p-6 shadow-sm sm:p-8 md:flex-row md:items-center md:gap-10 ${
                  i % 2 === 1 ? "md:flex-row-reverse" : ""
                }`}
              >
                {/* Illustration */}
                <div className="flex-shrink-0 mx-auto w-48 h-32 md:w-56 md:h-36">
                  {featureScenes[i]}
                </div>
                {/* Text */}
                <div className="flex-1">
                  <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1 text-xs font-bold text-accent">
                    機能 {i + 1}
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-foreground">
                    {feat.title}
                  </h3>
                  <p className="mb-4 text-sm leading-relaxed text-muted">
                    {feat.desc}
                  </p>
                  <ul className="space-y-2">
                    {feat.items.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2 text-sm text-foreground"
                      >
                        <CheckIcon />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          4. USE CASES / SCENES
      ═══════════════════════════════════════════════ */}
      <section className="px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-4xl">
          <h2
            className="mb-4 text-center text-2xl font-bold text-foreground sm:text-3xl"
            style={{ textWrap: "balance" } as React.CSSProperties}
          >
            こんなシーンで使えます
          </h2>
          <p className="mb-12 text-center text-sm text-muted sm:mb-16 sm:text-base">
            忙しい営業の日常にフィットする3つの活用法
          </p>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {scenes.map((scene) => (
              <div
                key={scene.title}
                className="relative rounded-2xl bg-white p-6 shadow-sm"
              >
                {/* Time badge */}
                <div className="mb-4 inline-flex items-center gap-2 text-accent">
                  <ClockIcon />
                  <span className="text-sm font-bold">{scene.time}</span>
                </div>
                <h3 className="mb-2 text-base font-bold text-foreground leading-snug">
                  {scene.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted">
                  {scene.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Intermediate CTA */}
          <div className="mt-12 flex flex-col items-center gap-4">
            <Link href="/worksheet" className="morph-btn">
              <span className="btn-fill" />
              <span className="shadow" />
              <span className="btn-text">
                {"ワークシートを使ってみる（無料）".split("").map((char, i) => (
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
          5. CROSS-LINKS (Other Features)
      ═══════════════════════════════════════════════ */}
      <section className="px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-4 text-center text-2xl font-bold text-foreground sm:text-3xl">
            ワークシートと一緒に使うと、もっと効果的
          </h2>
          <p className="mb-12 text-center text-sm text-muted sm:text-base">
            準備の前にスキルを磨き、準備したら実践へ
          </p>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Learn link */}
            <Link
              href="/lp/learn"
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
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm text-muted">準備の前にスキルを磨く</p>
                <p className="text-base font-bold text-foreground group-hover:text-accent transition-colors">
                  学習コース →
                </p>
                <p className="mt-1 text-xs text-muted">
                  22レッスン+認定試験で5ステップメソッドを体系的に学ぶ
                </p>
              </div>
            </Link>

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
                <p className="text-sm text-muted">準備したら実践</p>
                <p className="text-base font-bold text-foreground group-hover:text-accent transition-colors">
                  AIロープレ →
                </p>
                <p className="mt-1 text-xs text-muted">
                  ワークシートで準備した内容をAIとの実践で試す
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          6. FAQ
      ═══════════════════════════════════════════════ */}
      <section className="relative overflow-hidden px-6 py-16 sm:py-24">
        <div
          className="blob blob-cream"
          style={{ width: 250, height: 250, bottom: -40, left: -60 }}
        />
        <div className="relative z-10 mx-auto max-w-3xl">
          <h2 className="mb-4 text-center text-2xl font-bold text-foreground sm:text-3xl">
            よくある質問
          </h2>
          <p className="mb-12 text-center text-sm text-muted sm:text-base">
            ワークシートについてのよくある質問にお答えします
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
          7. FINAL CTA
      ═══════════════════════════════════════════════ */}
      <section className="relative overflow-hidden px-6 py-16 sm:py-24">
        <div
          className="blob blob-teal"
          style={{ width: 400, height: 400, top: -100, left: "30%" }}
        />
        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <h2
            className="mb-4 text-2xl font-bold text-foreground sm:text-3xl"
            style={{ textWrap: "balance" } as React.CSSProperties}
          >
            次の商談は、準備した状態で臨もう。
          </h2>
          <p className="mb-4 text-sm text-muted sm:text-base">
            ワークシートで商談の勝ちパターンを見える化。今すぐ無料で始められます。
          </p>
          <p className="mb-10 text-sm text-muted">
            &#10003; 無料で利用可能 &#10003; 登録不要 &#10003; スマホ対応
          </p>
          <div className="flex flex-col items-center gap-4">
            <Link href="/worksheet" className="morph-btn">
              <span className="btn-fill" />
              <span className="shadow" />
              <span className="btn-text">
                {"ワークシートを使ってみる（無料）".split("").map((char, i) => (
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
