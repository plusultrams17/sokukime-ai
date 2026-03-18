import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { JsonLd } from "@/components/json-ld";
import { StickyCTA } from "@/components/sticky-cta";
import { MethodCarousel } from "@/components/method-carousel";
import { HomepageCTATracker } from "@/components/homepage-cta-tracker";
import { HomeExitPopup } from "@/components/exit-popups/home-exit-popup";
import { ScrollSlideIn } from "@/components/scroll-slide-in";

/* ─── Data ─── */

const stats = [
  { value: "5ステップ", label: "営業心理学に基づく型" },
  { value: "24時間365日", label: "深夜の練習もOK" },
  { value: "0円", label: "メアド不要で今すぐ" },
];

const industries = ["塗装", "リフォーム", "不動産", "保険", "SaaS", "人材", "教育", "物販"];

const beforeCards = [
  { title: "ロープレ環境", desc: "先輩に頼まないとロープレできない", image: "/images/ba/before-01.png" },
  { title: "本番への不安", desc: "練習不足で本番が怖い", image: "/images/ba/before-02.png" },
  { title: "切り返し力", desc: "切り返しパターンが少ない", image: "/images/ba/before-03.png" },
  { title: "弱点の把握", desc: "自分の弱点がわからない", image: "/images/ba/before-04.png" },
];

const afterCards = [
  { title: "ロープレ環境", desc: "24時間いつでもAIとロープレ", image: "/images/ba/after-01.png" },
  { title: "本番への自信", desc: "場数を踏んで自信がつく", image: "/images/ba/after-02.png" },
  { title: "切り返し力", desc: "営業の型が体に染みつく", image: "/images/ba/after-03.png" },
  { title: "弱点の把握", desc: "AIスコアで弱点を可視化", image: "/images/ba/after-04.png" },
];

const steps = [
  {
    num: "01",
    title: "業種・商材を入力",
    desc: "あなたの営業シーンに合わせたリアルなお客さんをAIが生成",
    image: "/images/steps/step-01.png",
  },
  {
    num: "02",
    title: "AIとロープレ開始",
    desc: "AIが実際のお客さんのように反応。アプローチからクロージングまで実践",
    image: "/images/steps/step-02.png",
  },
  {
    num: "03",
    title: "成約スコアで採点",
    desc: "アプローチ・ヒアリング・クロージング・反論処理を成約メソッドで分析",
    image: "/images/steps/step-03.png",
  },
];

const LEVEL_COLORS: Record<string, string> = {
  "初級": "#0F6E56",
  "中級": "#2563EB",
  "上級": "#7C3AED",
};

const methods = [
  { name: "アプローチ", desc: "信頼構築→前提設定→心理的安全の確保", level: "初級" },
  { name: "ヒアリング", desc: "質問でニーズを引き出し、問題を深掘り", level: "初級" },
  { name: "プレゼン", desc: "特徴ではなく価値（ベネフィット）で伝える", level: "初級" },
  { name: "クロージング", desc: "社会的証明・一貫性の活用・お客様の声・段階的訴求", level: "中級" },
  { name: "反論処理", desc: "共感→確認→根拠提示→行動促進の4ステップ", level: "上級" },
];

const serviceCategories = [
  { title: "AIロープレ", desc: "AIがお客さん役を演じて実践練習", href: "/roleplay" },
  { title: "学習コース", desc: "22レッスン+認定試験", href: "/learn" },
  { title: "ワークシート", desc: "商談前の5フェーズ準備シート", href: "/worksheet" },
  { title: "無料営業ツール", desc: "診断・スクリプト・切り返し集", href: "/tools" },
  { title: "ブログ", desc: "営業ノウハウ記事", href: "/blog" },
];

const betaFeatures = [
  "AIロープレ（1日1回無料）",
  "22レッスン+AI営業分析",
  "成約スコアリング",
  "リアルタイムコーチング",
];

const faqs = [
  {
    q: "本当に無料で使えますか？",
    a: "はい。登録不要でロープレ・分析を体験できます。無料アカウントで1日1回AIロープレが可能です。",
  },
  {
    q: "どんな業種・商材でも使えますか？",
    a: "はい。あなたの業種・商材を入力すると、AIがそのシーンに合ったお客さん役を演じます。不動産、保険、SaaS、教育など幅広くご利用いただけます。",
  },
  {
    q: "成約コーチ AIのメソッドとは？",
    a: "成約5ステップメソッドは、アプローチ→ヒアリング→プレゼン→クロージング→反論処理の5段階で構成された、営業心理学に基づく体系的な営業手法です。各ステップをAIが評価し、改善ポイントを提示します。",
  },
  {
    q: "Proプランはいつでも解約できますか？",
    a: "はい、いつでも解約可能です。解約後も現在の請求期間の終了まで利用できます。",
  },
  {
    q: "スマートフォンでも使えますか？",
    a: "はい。ブラウザから利用でき、スマートフォン・タブレット・PCすべてに対応しています。",
  },
  {
    q: "データの安全性は？",
    a: "通信はSSL暗号化で保護されています。ロープレの会話データはお客様のアカウントに紐づいて管理され、第三者に共有されることはありません。",
  },
  {
    q: "AIの採点はどの程度正確ですか？",
    a: "AIは営業心理学に基づく5ステップメソッドの評価基準に沿って採点します。人間のコーチと同じ基準でフィードバックを提供しますが、AIの特性上、参考値としてご活用ください。",
  },
  {
    q: "アカウントを削除できますか？",
    a: "はい。設定画面からいつでもアカウントを削除できます。削除すると、すべてのデータが完全に消去されます。",
  },
  {
    q: "法人・チームでの利用は可能ですか？",
    a: "現在はベータテスト期間中のため個人向けのプランのみですが、法人向けプランも準備中です。チームでの研修利用をご検討の方は、お問い合わせください。",
  },
  {
    q: "対応言語は日本語のみですか？",
    a: "はい。現在は日本語のみ対応しています。AIのロープレ・フィードバック・学習コースのすべてが日本語で提供されます。",
  },
];

/* ─── Shared SVG Icons ─── */

function CheckIcon() {
  return (
    <svg height="24" width="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M0 0h24v24H0z" fill="none" />
      <path fill="currentColor" d="M10 15.172l9.192-9.193 1.415 1.414L10 18l-6.364-6.364 1.414-1.414z" />
    </svg>
  );
}


/* ─── Method Step SVG Illustrations ─── */

function MethodScene({ step }: { step: number }) {
  const cls = "w-20 h-20";
  switch (step) {
    case 0:
      return (
        <svg viewBox="0 0 64 56" className={cls} fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
          <circle cx="18" cy="14" r="6" fill="white" />
          <path d="M18 20v14M18 26l-8-5M18 26l8 5" />
          <path d="M18 34l-5 14M18 34l5 14" />
          <circle cx="46" cy="14" r="6" fill="white" />
          <path d="M46 20v14M46 26l8-5M46 26l-8 5" />
          <path d="M46 34l-5 14M46 34l5 14" />
          <path d="M32 4l-2 4h4z" fill="white" stroke="none" />
          <path d="M32 2v3M29 5h6" strokeWidth="1.5" />
        </svg>
      );
    case 1:
      return (
        <svg viewBox="0 0 48 48" className={cls} fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
          <path d="M18 10a12 12 0 0 1 6 22c-2 2-3 4-3 6" />
          <path d="M18 10c-5 0-10 5-10 12s5 12 10 12" />
          <path d="M30 18a5 5 0 0 1 0 8" />
          <path d="M34 14a9 9 0 0 1 0 16" />
          <path d="M38 10a13 13 0 0 1 0 24" opacity="0.5" />
        </svg>
      );
    case 2:
      return (
        <svg viewBox="0 0 48 48" className={cls} fill="white" stroke="none" aria-hidden="true">
          <rect x="4" y="32" width="9" height="12" rx="1" />
          <rect x="17" y="24" width="9" height="20" rx="1" />
          <rect x="30" y="14" width="9" height="30" rx="1" />
          <path d="M6 30L22 18l14-8" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" />
          <polygon points="38,8 42,14 34,14" />
        </svg>
      );
    case 3:
      return (
        <svg viewBox="0 0 48 40" className={cls} fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M4 24l8-10 8 4 4-6" />
          <path d="M44 24l-8-10-8 4-4-6" />
          <path d="M12 24l6 6 5-3 5 5" />
          <path d="M36 24l-6 6-5-3-3 3" />
        </svg>
      );
    case 4:
      return (
        <svg viewBox="0 0 48 48" className={cls} fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M24 4L6 12v12c0 10 8 16 18 20 10-4 18-10 18-20V12L24 4z" />
          <path d="M16 24l5 5 10-10" strokeWidth="3" />
        </svg>
      );
    default:
      return null;
  }
}

/* ─── Reusable Primary CTA Button ─── */

function PrimaryCTA({ className = "" }: { className?: string }) {
  return (
    <Link href="/roleplay" className={`morph-btn ${className}`}>
      <span className="btn-fill" />
      <span className="shadow" />
      <span className="btn-text">
        {"今すぐAIと商談してみる".split("").map((char, i) => (
          <span key={i} style={{ "--i": i } as React.CSSProperties}>{char}</span>
        ))}
      </span>
      <span className="orbit-dots">
        <span /><span /><span /><span />
      </span>
      <span className="corners">
        <span /><span /><span /><span />
      </span>
    </Link>
  );
}

/* ─── Page ─── */

export default function Home() {
  const siteUrl =
    process.env.NEXT_PUBLIC_APP_URL || "https://seiyaku-coach.vercel.app";

  const jsonLdData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "@id": `${siteUrl}/#application`,
        name: "成約コーチ AI",
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        url: siteUrl,
        description:
          "AIがリアルなお客さん役を演じる営業ロープレ練習アプリ。クロージング・反論処理を24時間練習。成約率を上げる5ステップメソッドで営業研修を効率化。",
        provider: { "@id": `${siteUrl}/#organization` },
        offers: [
          {
            "@type": "Offer",
            price: "0",
            priceCurrency: "JPY",
            name: "無料プラン",
            description: "1日1回AIロープレ・成約スコアリング・学習コース閲覧",
            availability: "https://schema.org/InStock",
          },
          {
            "@type": "Offer",
            price: "2980",
            priceCurrency: "JPY",
            name: "Proプラン",
            description: "AIロープレ無制限・22レッスン+認定試験・リアルタイムコーチング・優先サポート",
            availability: "https://schema.org/InStock",
          },
        ],
        featureList: "AIロープレ, 成約スコア分析, 22レッスン+認定試験, リアルタイムコーチング, AI営業分析",
        inLanguage: "ja",
      },
      {
        "@type": "FAQPage",
        "@id": `${siteUrl}/#faq`,
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
        "@id": `${siteUrl}/#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "ホーム",
            item: siteUrl,
          },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      <JsonLd data={jsonLdData} />
      <Header />

      {/* ═══════════════════════════════════════════════
          1. HERO
      ═══════════════════════════════════════════════ */}
      <section className="relative z-0 overflow-hidden px-6 pt-8 pb-16 sm:pt-12 sm:pb-20">
        <div className="hero-city" aria-hidden="true" />

        <div className="relative z-10 mx-auto max-w-4xl text-center">
          {/* Authority badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm">
            <svg className="h-4 w-4 text-yellow-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            1,600件の商談から生まれたメソッド
          </div>

          <h1 className="sr-only">
            AIで営業ロープレ練習 — 成約率を上げる5ステップメソッド
          </h1>
          <p className="sr-only">
            成約コーチ AIは、AIがリアルなお客さん役を演じる営業ロープレ練習アプリです。営業心理学に基づく「成約5ステップメソッド」（アプローチ・ヒアリング・プレゼン・クロージング・反論処理）をAIコーチがリアルタイムで評価し、24時間いつでも無料で営業力を鍛えることができます。1,600件の商談から体系化された営業の型を、22レッスンの学習コースとAIロープレで習得できます。
          </p>

          <p className="mb-6 text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-6xl" role="presentation" style={{ textWrap: "balance" } as React.CSSProperties}>
            「考えます」で終わる商談を、
            <br />
            <span className="text-accent">「お願いします」で終わらせる。</span>
          </p>

          <p className="mx-auto mb-10 max-w-2xl text-base text-white/70 leading-relaxed sm:text-lg">
            営業心理学に基づく5ステップの「型」をAIと反復練習。
            <br className="hidden sm:block" />
            先輩の空きを待つ必要はもうありません。
          </p>

          {/* Single Primary CTA */}
          <div className="flex flex-col items-center gap-4" data-hero-cta>
            <PrimaryCTA />
            <p className="text-sm text-white/50">
              &#10003; 無料で体験&ensp;&#10003; 登録不要&ensp;&#10003; 1分で最初の商談開始
            </p>
          </div>

          {/* Secondary text link */}
          <p className="mt-4 text-sm text-white/60">
            まずは学習コースから →{" "}
            <Link href="/learn" className="underline decoration-white/40 underline-offset-4 transition-colors hover:text-white hover:decoration-white">
              コースを見る
            </Link>
          </p>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
            {stats.map((s) => (
              <div key={s.label} className="rounded-2xl bg-white/10 p-5 backdrop-blur-sm sm:p-6">
                <div className="text-2xl font-bold text-accent sm:text-3xl">{s.value}</div>
                <div className="mt-1 text-sm text-white/60">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          2. SOCIAL PROOF
      ═══════════════════════════════════════════════ */}
      <section className="px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-3 text-lg font-semibold text-foreground sm:text-xl">
            あなたの業界に対応しています
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {industries.map((name) => (
              <span key={name} className="rounded-full border border-card-border bg-white px-4 py-2 text-sm font-medium text-foreground shadow-sm">
                {name}
              </span>
            ))}
          </div>
          <div className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2 text-sm font-medium text-accent">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent" />
            </span>
            ベータテスト中 — 先着100名無料ご招待
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          3. BEFORE / AFTER
      ═══════════════════════════════════════════════ */}
      <section className="px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto w-full max-w-6xl">
          <h2 className="mb-2 text-center text-2xl font-bold text-foreground sm:text-3xl" style={{ textWrap: "balance" } as React.CSSProperties}>
            先週のあなた vs. 来週のあなた
          </h2>
          <p className="mb-10 text-center text-sm text-muted sm:text-base">
            もう「練習相手がいない」と悩む必要はありません
          </p>

          {/* Before */}
          <div className="mb-3 text-center">
            <span className="inline-block rounded-full bg-red-100 px-4 py-1 text-sm font-bold text-red-500 border border-red-200">
              Before
            </span>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {beforeCards.map((card) => (
              <div key={card.title} className="ba-card ba-card--before">
                <div className="ba-card__illustration">
                  <Image
                    src={card.image}
                    alt={card.desc}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 50vw"
                  />
                </div>
                <div className="mt-3">
                  <p className="text-xs font-semibold text-red-800/60">{card.title}</p>
                  <p className="text-sm font-medium leading-snug text-red-600">{card.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="my-6 flex justify-center">
            <svg className="h-10 w-10 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>

          {/* After */}
          <div className="mb-3 text-center">
            <span className="inline-block rounded-full bg-accent/20 px-4 py-1 text-sm font-bold text-accent">
              After
            </span>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {afterCards.map((card) => (
              <div key={card.title} className="ba-card">
                <div className="ba-card__illustration">
                  <Image
                    src={card.image}
                    alt={card.desc}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 50vw"
                  />
                </div>
                <div className="mt-3">
                  <p className="text-xs font-semibold text-gray-600">{card.title}</p>
                  <p className="text-sm font-medium leading-snug text-emerald-500">{card.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Intermediate CTA — Loss Aversion framing at psychological peak (after B/A) */}
          <div className="mt-10 flex flex-col items-center gap-4">
            <p className="text-center text-sm font-medium text-muted">
              次の現場訪問、切り返しの練習をしないまま迎えますか？
            </p>
            <PrimaryCTA />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          4. HOW IT WORKS
      ═══════════════════════════════════════════════ */}
      <section className="relative overflow-hidden px-6 py-16 sm:py-24">
        <div className="blob blob-pink" style={{ width: 300, height: 300, top: -40, right: -60 }} />
        <div className="relative z-10 mx-auto max-w-5xl">
          <h2 className="mb-4 text-center text-2xl font-bold text-foreground sm:text-3xl" style={{ textWrap: "balance" } as React.CSSProperties}>
            3ステップで、今日から営業練習が変わる
          </h2>
          <p className="mb-12 text-center text-sm text-muted sm:mb-16 sm:text-base">
            登録もダウンロードも不要。思い立った瞬間にロープレ開始。
          </p>
          <div className="flex flex-wrap justify-center gap-8">
            {steps.map((step) => (
              <div key={step.num} className="howto-card">
                <div className="howto-card__photo">
                  <Image
                    src={step.image}
                    alt={step.title}
                    fill
                    className="object-cover"
                    sizes="250px"
                  />
                </div>
                <div className="howto-card__num">{step.num}</div>
                <div className="howto-card__title">
                  {step.title}
                  <br />
                  <span>{step.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          5. 5-STEP METHOD
      ═══════════════════════════════════════════════ */}
      <section className="overflow-hidden py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="mb-4 text-center text-2xl font-bold text-foreground sm:text-3xl" style={{ textWrap: "balance" } as React.CSSProperties}>
            トップ営業マンが無意識にやっている5つのステップ
          </h2>
          <p className="mb-2 text-center text-sm font-medium text-accent">
            4年半・1,600件の現場経験を体系化した営業の型
          </p>
          <p className="mb-12 text-center text-sm text-muted sm:mb-16 sm:text-base">
            この流れを身につければ、どんな商材でも商談の型ができる
          </p>
          <div className="mb-8 flex flex-wrap items-center justify-center gap-4">
            {Object.entries(LEVEL_COLORS).map(([label, color]) => (
              <span key={label} className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-bold text-white" style={{ backgroundColor: color }}>
                {label}
              </span>
            ))}
          </div>
        </div>
        <MethodCarousel>
          {methods.map((m, i) => {
            const color = LEVEL_COLORS[m.level] || "#0F6E56";
            return (
              <div key={m.name} className="comic-card" style={{ "--level-color": color } as React.CSSProperties}>
                <div className="card-header">
                  <div className="card-avatar">{i + 1}</div>
                  <div className="card-user-info">
                    <p className="card-username">{m.name}</p>
                    <p className="card-handle" style={{ color }}>{m.level}</p>
                  </div>
                </div>
                <div className="card-content">
                  <div className="card-image-container">
                    <MethodScene step={i} />
                  </div>
                  <p className="card-caption">{m.desc}</p>
                </div>
              </div>
            );
          })}
        </MethodCarousel>
      </section>

      {/* ═══════════════════════════════════════════════
          6. SERVICE CATEGORIES
      ═══════════════════════════════════════════════ */}
      <section className="px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-12 text-center text-2xl font-bold text-foreground sm:text-3xl">
            あなたの営業力を上げる5つの武器
          </h2>
          <div className="brutalist-cards">
            {serviceCategories.map((cat) => (
              <Link key={cat.title} href={cat.href} className="brutalist-card">
                <div className="brutalist-card__logo">
                  <svg
                    className="brutalist-card__icon"
                    viewBox="0 0 24 27"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      d="M1,0 L23,0 C23.5522847,-1.01453063e-16 24,0.44771525 24,1 L24,8.17157288 C24,8.70200585 23.7892863,9.21071368 23.4142136,9.58578644 L20.5857864,12.4142136 C20.2107137,12.7892863 20,13.2979941 20,13.8284271 L20,26 C20,26.5522847 19.5522847,27 19,27 L1,27 C0.44771525,27 6.76353751e-17,26.5522847 0,26 L0,1 C-6.76353751e-17,0.44771525 0.44771525,1.01453063e-16 1,0 Z"
                      fill="#F3E9CB"
                    />
                  </svg>
                </div>
                <div className="brutalist-card__text">
                  <span>{cat.desc}</span>
                  <span>{cat.title}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          7. BETA TEST CTA
      ═══════════════════════════════════════════════ */}
      <section className="px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-2xl font-bold text-foreground sm:text-3xl">
            今なら全機能を無料で体験できます
          </h2>
          <p className="mb-10 text-sm text-muted sm:text-base">
            まずは1回、AIと商談してみてください。
            <br />
            「これ、うちの後輩にやらせたい」そんな声をいただいています。
          </p>
          <div className="plan">
            <div className="inner">
              <span className="pricing">
                <span>無料 <small>ベータ版</small></span>
              </span>
              <p className="title">ベータテストプラン</p>
              <p className="info">全機能を無料でお試しいただけます。フィードバックをお待ちしています。</p>
              <ul className="features">
                {betaFeatures.map((feat) => (
                  <li key={feat}>
                    <span className="icon"><CheckIcon /></span>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
              <div className="action">
                <Link href="/roleplay" className="button">今すぐAIと商談してみる</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          8. FAQ
      ═══════════════════════════════════════════════ */}
      <section className="relative overflow-hidden px-6 py-16 sm:py-24">
        <div className="blob blob-cream" style={{ width: 250, height: 250, bottom: -40, left: -60 }} />
        <div className="relative z-10 mx-auto max-w-3xl">
          <h2 className="mb-4 text-center text-2xl font-bold text-foreground sm:text-3xl">
            よくある質問
          </h2>
          <p className="mb-12 text-center text-sm text-muted sm:text-base">
            成約コーチ AIについてのよくある質問にお答えします
          </p>
          <div className="space-y-3">
            {faqs.map((faq) => (
              <details key={faq.q} className="group rounded-2xl bg-white shadow-sm">
                <summary className="flex cursor-pointer items-center justify-between px-6 py-5 text-sm font-semibold text-foreground [&::-webkit-details-marker]:hidden list-none">
                  <span>{faq.q}</span>
                  <svg
                    className="h-5 w-5 flex-shrink-0 text-muted transition-transform duration-200 group-open:rotate-180"
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
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
        <div className="blob blob-teal" style={{ width: 400, height: 400, top: -100, left: "30%" }} />
        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-2xl font-bold text-foreground sm:text-3xl" style={{ textWrap: "balance" } as React.CSSProperties}>
            明日の商談に間に合う。今すぐ練習を始めよう。
          </h2>
          <p className="mb-4 text-sm text-muted sm:text-base">
            3分で最初の商談が終わります。まずは1回、試してみてください。
          </p>
          <p className="mb-10 text-sm text-muted">
            &#10003; 無料で体験 &#10003; 登録不要 &#10003; いつでも解約OK
          </p>
          <div className="flex flex-col items-center gap-4">
            <PrimaryCTA />
          </div>
          <div className="mt-6">
            <Link href="/pricing" className="text-sm text-muted transition hover:text-accent hover:underline">
              料金プランを見る →
            </Link>
          </div>

          {/* Trust badges */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4 text-xs text-muted sm:gap-6">
            <span className="inline-flex items-center gap-1.5">
              <svg className="h-4 w-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              SSL暗号化通信
            </span>
            <span className="inline-flex items-center gap-1.5">
              <svg className="h-4 w-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              データ安全保護
            </span>
            <span className="inline-flex items-center gap-1.5">
              <svg className="h-4 w-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              いつでも退会可能
            </span>
          </div>
        </div>
      </section>

      <Footer />
      <StickyCTA />
      <HomepageCTATracker />
      <HomeExitPopup />
      <ScrollSlideIn sessionKey="home-slide-in">
        <p className="mb-2 pr-6 text-sm font-bold text-foreground">
          次のお客さん、もっと上手くいくかも？
        </p>
        <p className="mb-3 text-xs text-muted">
          AIが3分であなたの営業力をスコアリングします
        </p>
        <Link
          href="/roleplay"
          className="inline-flex h-9 items-center justify-center rounded-lg bg-accent px-4 text-xs font-bold text-white transition hover:bg-accent-hover"
        >
          無料で営業力を診断する
        </Link>
      </ScrollSlideIn>
    </div>
  );
}
