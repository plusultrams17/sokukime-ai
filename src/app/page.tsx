import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { JsonLd } from "@/components/json-ld";
import { StickyCTA } from "@/components/sticky-cta";
import { MethodLevelCards } from "@/components/method-level-cards";
import { HomepageCTATracker } from "@/components/homepage-cta-tracker";
import { HomeExitPopup } from "@/components/exit-popups/home-exit-popup";
import { ScrollSlideIn } from "@/components/scroll-slide-in";
import { SocialProofStats } from "@/components/social-proof-stats";
import { UserReviews } from "@/components/user-reviews";
import { IndustryQuickValue } from "@/components/industry-quick-value";

/* ─── Data ─── */

const stats = [
  { value: "5分", label: "で1レッスン完了。スキマ時間で学べる" },
  { value: "8業種", label: "に対応。あなたの商材で練習できる" },
  { value: "スコア", label: "で成長が見える。弱点も一目でわかる" },
];

const industries = [
  { name: "塗装", desc: "外壁・屋根塗装", slug: "exterior-painting" },
  { name: "リフォーム", desc: "住宅リフォーム", slug: "reform" },
  { name: "不動産", desc: "売買・賃貸仲介", slug: "real-estate" },
  { name: "保険", desc: "生保・損保営業", slug: "insurance" },
  { name: "SaaS", desc: "法人向けIT営業", slug: "saas" },
  { name: "人材", desc: "採用・人材派遣", slug: "hr" },
  { name: "教育", desc: "塾・スクール", slug: "education" },
  { name: "物販", desc: "小売・EC販売", slug: "retail" },
];

const methodStepLinks = [
  { step: "01", name: "アプローチ", desc: "信頼構築・褒め・ゴール共有", href: "/learn/sales-mindset" },
  { step: "02", name: "ヒアリング", desc: "ニーズ発掘・深掘り質問", href: "/learn/mehrabian-rule" },
  { step: "03", name: "プレゼン", desc: "利点話法・比較提案", href: "/learn/benefit-method" },
  { step: "04", name: "クロージング", desc: "決断を後押しする技術", href: "/learn/closing-intro" },
  { step: "05", name: "反論処理", desc: "切り返しトーク", href: "/learn/rebuttal-basics" },
];


const freeFeatures = [
  "22レッスンで営業の型を学ぶ",
  "業種別トークスクリプト閲覧",
  "AIロープレ（1日1回無料）",
  "成約スコアリング",
];

const faqs = [
  {
    q: "本当に無料で使えますか？",
    a: "はい。22レッスンの学習コースは登録不要で閲覧できます。無料アカウントを作成すると、学んだ内容をAIロープレで実践練習（1日1回）もできます。",
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
    q: "効果がなかったら返金できますか？",
    a: "はい。14日間スコア改善保証があります。Proプランで14日間毎日ロープレしてもスコアが改善しない場合、全額返金します（14日間で7回以上の実施が条件）。",
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

/* ─── Reusable Primary CTA Button ─── */

function PrimaryCTA({ className = "", text = "無料で営業の型を学ぶ", href = "/learn" }: { className?: string; text?: string; href?: string }) {
  return (
    <Link href={href} scroll={true} className={`morph-btn ${className}`}>
      <span className="btn-fill" />
      <span className="shadow" />
      <span className="btn-text">
        {text.split("").map((char, i) => (
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
    process.env.NEXT_PUBLIC_APP_URL || "https://seiyaku-coach.com";

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
          "業種別営業学習プログラム。営業心理学に基づく「成約5ステップメソッド」を22レッスンで体系的に習得。業種別トークスクリプト・切り返し話法・AIロープレ練習で営業力を底上げ。",
        provider: { "@id": `${siteUrl}/#organization` },
        offers: [
          {
            "@type": "Offer",
            price: "0",
            priceCurrency: "JPY",
            name: "無料プラン",
            description: "22レッスン学習コース・業種別トークスクリプト・AIロープレ1日1回・成約スコアリング",
            availability: "https://schema.org/InStock",
          },
          {
            "@type": "Offer",
            price: "2980",
            priceCurrency: "JPY",
            name: "Proプラン",
            description: "22レッスン+認定試験・全業種トークスクリプト・AIロープレ無制限・リアルタイムコーチング",
            availability: "https://schema.org/InStock",
          },
        ],
        featureList: "22レッスン学習コース, 業種別トークスクリプト, 切り返し話法, AIロープレ練習, 成約スコア分析, リアルタイムコーチング",
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
            営業心理学に基づくメソッド
          </div>

          <h1 className="sr-only">
            業種別営業学習プログラム — 成約5ステップメソッドで営業の「型」を習得
          </h1>
          <p className="sr-only">
            成約コーチ AIは、営業心理学に基づく「成約5ステップメソッド」を22レッスンで体系的に学べる業種別営業学習プログラムです。アプローチ・ヒアリング・プレゼン・クロージング・反論処理の5ステップを、業種別のトークスクリプトと切り返し話法で実践的に習得。学んだ技術はAIロープレで即実践練習できます。
          </p>

          <p className="mb-6 text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-6xl" role="presentation" style={{ textWrap: "balance" } as React.CSSProperties}>
            売れる営業には「型」がある。
            <br />
            <span className="text-accent">業種別に、体系的に学ぶ。</span>
          </p>

          <div className="mx-auto mb-10 grid max-w-3xl grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
            {[
              { num: "1", icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253", title: "型を学ぶ", desc: "5分のレッスンで営業心理学の「型」を理解" },
              { num: "2", icon: "M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z", title: "AIで実践する", desc: "あなたの業種でAIロープレ。学んだ話法をその場で練習" },
              { num: "3", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z", title: "スコアで伸びる", desc: "弱点が数字でわかり、毎日成長を実感できる" },
            ].map((step) => (
              <div key={step.num} className="relative rounded-2xl border border-white/15 bg-white/10 p-5 text-left backdrop-blur-sm">
                <div className="mb-3 flex items-center gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-bold text-white">{step.num}</span>
                  <svg className="h-5 w-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d={step.icon} />
                  </svg>
                </div>
                <p className="mb-1 text-sm font-bold text-white">{step.title}</p>
                <p className="text-xs leading-relaxed text-white/60">{step.desc}</p>
              </div>
            ))}
          </div>

          {/* Dual CTAs: Learn primary, Roleplay secondary */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4" data-hero-cta>
            <PrimaryCTA text="無料で営業の型を学ぶ" href="/learn" />
            <Link
              href="/roleplay"
              scroll={true}
              className="inline-flex h-14 items-center justify-center rounded-xl border-2 border-white/30 px-8 text-base font-medium text-white/80 transition hover:bg-white/10 hover:text-white sm:min-w-[220px]"
            >
              学んだらAIで練習する
            </Link>
          </div>
          <p className="mt-4 text-sm text-white/50">
            &#10003; 22レッスン無料&ensp;&#10003; 8業種対応&ensp;&#10003; 5分で最初のレッスン開始
          </p>

          <SocialProofStats />

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
          2. INDUSTRY QUICK VALUE — 即時価値体験
      ═══════════════════════════════════════════════ */}
      <IndustryQuickValue industries={industries} />

      {/* ═══════════════════════════════════════════════
          6. 5-STEP METHOD
      ═══════════════════════════════════════════════ */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-6 mb-10">
          <h2 className="mb-4 text-center text-2xl font-bold text-foreground sm:text-3xl" style={{ textWrap: "balance" } as React.CSSProperties}>
            営業心理学に基づく「型」
          </h2>
          <p className="mb-2 text-center text-sm font-medium text-accent">
            5つのステップを、初級→中級→上級の22レッスンで段階的に習得
          </p>
          <p className="text-center text-sm text-muted sm:text-base">
            アプローチからクロージング・反論処理まで、どんな商材でも使える型が身につく
          </p>
        </div>
        {/* 5-step quick links */}
        <div className="mx-auto max-w-5xl px-6 mb-8">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
            {methodStepLinks.map((s) => (
              <Link
                key={s.step}
                href={s.href}
                scroll={true}
                className="group relative overflow-hidden rounded-xl border border-card-border bg-white p-4 text-center transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-lg hover:shadow-accent/10"
              >
                <div className="absolute inset-x-0 top-0 h-0.5 bg-accent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <span className="mb-1 block text-xs font-bold text-accent">STEP {s.step}</span>
                <span className="block text-sm font-bold text-foreground">{s.name}</span>
                <span className="mt-1 block text-xs text-muted leading-snug">{s.desc}</span>
                <span className="mt-2 inline-flex items-center gap-0.5 text-xs font-medium text-accent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  このステップを学ぶ
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </Link>
            ))}
          </div>
        </div>

        <MethodLevelCards />
      </section>

      {/* ═══════════════════════════════════════════════
          7. FREE PLAN CTA
      ═══════════════════════════════════════════════ */}
      <section className="px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-2xl font-bold text-foreground sm:text-3xl">
            まずは無料で学んでみませんか？
          </h2>
          <p className="mb-10 text-sm text-muted sm:text-base">
            登録不要ですぐに始められます。
            <br />
            学んだ内容はAIロープレで実践練習も可能です。
          </p>
          <div className="plan">
            <div className="inner">
              <span className="pricing">
                <span>¥0 <small>/月</small></span>
              </span>
              <p className="title">無料プラン</p>
              <p className="info">22レッスンで営業の型を学び、AIロープレで実践。スコアで成長を実感できます。</p>
              <ul className="features">
                {freeFeatures.map((feat) => (
                  <li key={feat}>
                    <span className="icon"><CheckIcon /></span>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
              <div className="action flex flex-col gap-2">
                <Link href="/learn" scroll={true} className="button">まず5分のレッスンを体験する</Link>
                <Link href="/roleplay" scroll={true} className="button" style={{ background: "transparent", border: "2px solid rgba(249,115,22,0.4)", color: "#f97316" }}>AIロープレを試してみる</Link>
              </div>
            </div>
          </div>

          {/* Pro anchoring — Tversky & Kahneman anchoring effect */}
          <div className="mt-6 rounded-xl border border-card-border/60 bg-white/50 px-6 py-4">
            <p className="mb-1 text-xs text-muted">さらに上を目指すなら</p>
            <div className="flex items-center justify-center gap-3 text-sm">
              <span className="text-muted line-through">営業研修1回 ¥50,000〜</span>
              <span className="font-bold text-accent">→ Pro ¥2,980/月で無制限</span>
            </div>
            <p className="mt-2 text-center text-xs text-muted">
              🛡️ 14日間スコア改善保証付き — 効果がなければ全額返金
            </p>
            <Link href="/pricing" scroll={true} className="mt-1 block text-center text-xs font-medium text-accent transition hover:underline">
              料金プランを見る →
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          9. TESTIMONIALS (Social Proof — Cialdini)
      ═══════════════════════════════════════════════ */}
      <UserReviews />

      {/* ═══════════════════════════════════════════════
          10. FAQ
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
          11. FINAL CTA
      ═══════════════════════════════════════════════ */}
      <section className="relative overflow-hidden px-6 py-16 sm:py-24">
        <div className="blob blob-teal" style={{ width: 400, height: 400, top: -100, left: "30%" }} />
        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-2xl font-bold text-foreground sm:text-3xl" style={{ textWrap: "balance" } as React.CSSProperties}>
            「なんとなく」の営業を続けますか？
          </h2>
          <p className="mb-4 text-sm text-muted sm:text-base">
            今日学んだ「型」は、明日の商談からそのまま使えます。
            <br />
            まずは1つ、5分のレッスンから始めてみてください。
          </p>
          <p className="mb-10 text-sm text-muted">
            &#10003; 登録不要 &#10003; 22レッスン無料 &#10003; いつでも解約OK
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <PrimaryCTA text="最初のレッスンを始める" href="/learn" />
            <Link
              href="/roleplay"
              scroll={true}
              className="inline-flex h-14 items-center justify-center rounded-xl border-2 border-accent/30 bg-accent/5 px-8 text-base font-bold text-accent transition hover:bg-accent/10 hover:border-accent/50 sm:min-w-[220px]"
            >
              AIロープレを試す
            </Link>
          </div>
          <div className="mt-6">
            <Link href="/pricing" scroll={true} className="text-sm text-muted transition hover:text-accent hover:underline">
              料金プランを見る →
            </Link>
          </div>

          {/* Trust badges — 競合失敗分析: 保証がないと離脱率が跳ね上がる */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4 text-xs text-muted sm:gap-6">
            <span className="inline-flex items-center gap-1.5">
              <svg className="h-4 w-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              14日間スコア改善保証
            </span>
            <span className="inline-flex items-center gap-1.5">
              <svg className="h-4 w-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              SSL暗号化通信
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
          営業の「型」を知ると、商談が変わる
        </p>
        <p className="mb-3 text-xs text-muted">
          5分のレッスンで、使えるテクニックが1つ増えます
        </p>
        <div className="flex items-center gap-3">
          <Link
            href="/learn"
            scroll={true}
            className="inline-flex h-9 items-center justify-center rounded-lg bg-accent px-4 text-xs font-bold text-white transition hover:bg-accent-hover"
          >
            無料で学ぶ
          </Link>
          <Link
            href="/roleplay"
            scroll={true}
            className="text-xs font-bold text-accent transition hover:underline"
          >
            AIで練習する
          </Link>
        </div>
      </ScrollSlideIn>
    </div>
  );
}
