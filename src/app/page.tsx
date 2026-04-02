import Link from "next/link";
import Image from "next/image";
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

/* ─── Data ─── */

const stats = [
  { value: "5ステップ", label: "営業心理学に基づく型" },
  { value: "24時間365日", label: "深夜の練習もOK" },
  { value: "0円", label: "メアド不要で今すぐ" },
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
    title: "5ステップの型を学ぶ",
    desc: "22レッスンで営業心理学の型をインプット。1レッスン5分",
    image: "/images/steps/step-01.png",
    href: "/learn",
  },
  {
    num: "02",
    title: "AIとロープレで実践",
    desc: "学んだテクニックをAI相手に即実践。何度でも練習できる",
    image: "/images/steps/step-02.png",
    href: "/roleplay",
  },
  {
    num: "03",
    title: "スコアで弱点を発見",
    desc: "5ステップごとのスコアで弱点を可視化。改善アドバイスはProで",
    image: "/images/steps/step-03.png",
    href: "/roleplay",
  },
];

const methodStepLinks = [
  { step: "01", name: "アプローチ", desc: "信頼構築・褒め・ゴール共有", href: "/learn/sales-mindset" },
  { step: "02", name: "ヒアリング", desc: "ニーズ発掘・深掘り質問", href: "/learn/mehrabian-rule" },
  { step: "03", name: "プレゼン", desc: "利点話法・比較提案", href: "/learn/benefit-method" },
  { step: "04", name: "クロージング", desc: "決断を後押しする技術", href: "/learn/closing-intro" },
  { step: "05", name: "反論処理", desc: "切り返しトーク", href: "/learn/rebuttal-basics" },
];


const freeTools = [
  {
    slug: "sales-quiz",
    name: "営業力診断テスト",
    description: "10問の質問で5項目を診断。あなたの営業スキルの強みと弱点が一目でわかる",
    badge: "約3分",
    icon: "quiz",
  },
  {
    slug: "script-generator",
    name: "トークスクリプト生成",
    description: "業種と商材を選ぶだけ。5ステップメソッドに基づくトークスクリプトをAIが自動生成",
    badge: "AI生成",
    icon: "script",
  },
  {
    slug: "objection-handbook",
    name: "反論切り返しトーク集",
    description: "「高い」「検討します」「必要ない」—よくある断り文句30パターンへの実践的な切り返しトーク",
    badge: "30パターン",
    icon: "shield",
  },
  {
    slug: "closing-calculator",
    name: "クロージング率計算",
    description: "商談数・成約数を入力して成約率を自動計算。業種別ベンチマークと比較して改善点を発見",
    badge: "ベンチマーク付き",
    icon: "calculator",
  },
];

const serviceCategories = [
  {
    title: "学習コース",
    desc: "成約5ステップメソッドを22レッスンで体系的に習得。各ステップの理論と実践を学び、認定試験で理解度を確認できます。",
    href: "/learn",
    image: "/images/cards/learn.png",
  },
  {
    title: "AIロープレ",
    desc: "AIがリアルなお客さん役を演じます。アプローチからクロージング、反論処理まで、何度でも実践練習。スコアで弱点を可視化。",
    href: "/roleplay",
    image: "/images/cards/roleplay.png",
  },
  {
    title: "ワークシート",
    desc: "商談前に5フェーズの準備シートを記入するだけで、ヒアリング漏れやクロージングの抜けを防止。商談の質が格段に上がります。",
    href: "/worksheet",
    image: "/images/cards/worksheet.png",
  },
  {
    title: "教材プログラム",
    desc: "成約5ステップ完全攻略プログラム。22レッスンで営業の型を体系的に習得。買い切りで何度でも復習可能。",
    href: "/program",
    image: "/images/cards/tools.png",
  },
  {
    title: "無料ツール",
    desc: "営業力診断テスト・トークスクリプト生成・反論切り返しトーク集・クロージング率計算。登録不要で今すぐ使えます。",
    href: "/tools",
    image: "/images/cards/tools.png",
  },
  {
    title: "ブログ",
    desc: "クロージングのコツ、飛び込み営業の心得、反論処理のテクニックなど、現場で使える営業ノウハウ記事を毎週更新中。",
    href: "/blog",
    image: "/images/cards/blog.png",
  },
];

const freeFeatures = [
  "22レッスンで営業の型を学ぶ",
  "AIロープレ（1日1回無料）",
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
    a: "現在は個人向けのプランのみですが、法人向けプランも準備中です。チームでの研修利用をご検討の方は、お問い合わせください。",
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

/* ─── Tool Icons ─── */

function ToolIcon({ icon }: { icon: string }) {
  const p = { className: "h-7 w-7", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true as const };
  switch (icon) {
    case "quiz":
      return <svg {...p}><path d="M9 19v-6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2zm0 0V9a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v10m-6 0a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2m0 0V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2z" /></svg>;
    case "script":
      return <svg {...p}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /><path d="M16 13H8" /><path d="M16 17H8" /><path d="M10 9H8" /></svg>;
    case "shield":
      return <svg {...p}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="M9 12l2 2 4-4" /></svg>;
    case "calculator":
      return <svg {...p}><rect x="4" y="2" width="16" height="20" rx="2" /><path d="M8 6h8" /><path d="M8 10h8" /><path d="M8 14h4" /><path d="M8 18h4" /><path d="M16 14h.01" /><path d="M16 18h.01" /></svg>;
    default:
      return null;
  }
}

/* ─── Industry Icons ─── */

function IndustryIcon({ name }: { name: string }) {
  const p = { className: "h-6 w-6", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true as const };
  switch (name) {
    case "塗装":
      return <svg {...p}><rect x="3" y="2" width="18" height="8" rx="1.5" /><path d="M12 10v8" /><path d="M8 21h8" /></svg>;
    case "リフォーム":
      return <svg {...p}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><path d="M9 22V12h6v10" /></svg>;
    case "不動産":
      return <svg {...p}><rect x="4" y="2" width="16" height="20" rx="1.5" /><path d="M9 22V12h6v10" /><circle cx="8" cy="6" r=".5" fill="currentColor" /><circle cx="16" cy="6" r=".5" fill="currentColor" /><circle cx="8" cy="9" r=".5" fill="currentColor" /><circle cx="16" cy="9" r=".5" fill="currentColor" /></svg>;
    case "保険":
      return <svg {...p}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="M9 12l2 2 4-4" /></svg>;
    case "SaaS":
      return <svg {...p}><rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8" /><path d="M12 17v4" /></svg>;
    case "人材":
      return <svg {...p}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>;
    case "教育":
      return <svg {...p}><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>;
    case "物販":
      return <svg {...p}><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></svg>;
    default:
      return null;
  }
}

/* ─── Reusable Primary CTA Button ─── */

function PrimaryCTA({ className = "", text = "今すぐAIと商談してみる", href = "/roleplay" }: { className?: string; text?: string; href?: string }) {
  return (
    <Link href={href} className={`morph-btn ${className}`}>
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
            営業心理学に基づくメソッド
          </div>

          <h1 className="sr-only">
            AIで営業ロープレ練習 — 成約率を上げる5ステップメソッド
          </h1>
          <p className="sr-only">
            成約コーチ AIは、AIがリアルなお客さん役を演じる営業ロープレ練習アプリです。営業心理学に基づく「成約5ステップメソッド」（アプローチ・ヒアリング・プレゼン・クロージング・反論処理）をAIコーチがリアルタイムで評価し、24時間いつでも無料で営業力を鍛えることができます。営業心理学から体系化された営業の型を、22レッスンの学習コースとAIロープレで習得できます。
          </p>

          <p className="mb-6 text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-6xl" role="presentation" style={{ textWrap: "balance" } as React.CSSProperties}>
            断られて終わる商談を、
            <br />
            <span className="text-accent">「決まる商談」に変える。</span>
          </p>

          <p className="mx-auto mb-10 max-w-2xl text-base text-white/70 leading-relaxed sm:text-lg">
            AIだから、何回失敗しても恥ずかしくない。
            <br className="hidden sm:block" />
            営業心理学に基づく5ステップの「型」を、24時間いつでも反復練習。
          </p>

          {/* Dual CTAs: Roleplay primary, Learn secondary */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4" data-hero-cta>
            <PrimaryCTA text="無料でAIと商談してみる" />
            <Link
              href="/learn"
              className="inline-flex h-14 items-center justify-center rounded-xl border-2 border-white/30 px-8 text-base font-medium text-white/80 transition hover:bg-white/10 hover:text-white sm:min-w-[220px]"
            >
              まず営業の型を学ぶ（5分）
            </Link>
          </div>
          <p className="mt-4 text-sm text-white/50">
            &#10003; 無料で体験&ensp;&#10003; 登録不要&ensp;&#10003; 1分で最初の商談開始
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
          2. SOCIAL PROOF
      ═══════════════════════════════════════════════ */}
      <section className="relative overflow-hidden px-6 py-16 sm:py-20">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/[0.03] via-transparent to-transparent" aria-hidden="true" />
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <h2 className="mb-2 text-2xl font-bold text-foreground sm:text-3xl">
            あなたの業界に対応しています
          </h2>
          <p className="mb-10 text-sm text-muted sm:text-base">
            業種・商材を入力するだけ。AIがリアルなお客さん役を演じます
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            {industries.map((ind) => (
              <Link key={ind.name} href={`/industry/${ind.slug}`} className="group relative overflow-hidden rounded-2xl border border-card-border bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-lg hover:shadow-accent/10">
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-accent to-orange-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent transition-colors duration-300 group-hover:bg-accent group-hover:text-white">
                  <IndustryIcon name={ind.name} />
                </div>
                <p className="text-sm font-bold text-foreground">{ind.name}</p>
                <p className="mt-0.5 text-xs text-muted">{ind.desc}</p>
              </Link>
            ))}
          </div>
          <div className="mt-10 inline-flex items-center gap-2 rounded-full bg-accent/10 px-5 py-2.5 text-sm font-semibold text-accent">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent" />
            </span>
            無料プランで今すぐ始められます
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
            AIが相手だから、失敗しても恥ずかしくない。何度でも練習できる。
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
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/learn"
                className="inline-flex h-12 items-center justify-center rounded-xl border-2 border-accent/30 bg-accent/5 px-6 text-sm font-bold text-accent transition hover:bg-accent/10 hover:border-accent/50 sm:min-w-[220px]"
              >
                まず型を学んでから練習する
              </Link>
              <PrimaryCTA text="すぐにAIと練習する" />
            </div>
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
            学ぶ → 実践する → 弱点に気づく。この繰り返しで営業力が伸びる。
          </p>
          <div className="flex flex-wrap justify-center gap-8">
            {steps.map((step) => (
              <Link key={step.num} href={step.href} className="howto-card group">
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
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          5. FREE TOOLS SHOWCASE
      ═══════════════════════════════════════════════ */}
      <section className="relative overflow-hidden px-6 py-16 sm:py-24">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/[0.03] via-transparent to-transparent" aria-hidden="true" />
        <div className="blob blob-teal" style={{ width: 280, height: 280, bottom: -40, right: -80 }} />
        <div className="relative z-10 mx-auto max-w-5xl">
          <div className="mb-6 text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent">
              完全無料・登録不要
            </span>
          </div>
          <h2 className="mb-2 text-center text-2xl font-bold text-foreground sm:text-3xl">
            今すぐ使える無料営業ツール
          </h2>
          <p className="mb-12 text-center text-sm text-muted sm:text-base">
            メアド不要。ブラウザだけで営業力を鍛える
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
            {freeTools.map((tool) => (
              <Link
                key={tool.slug}
                href={`/tools/${tool.slug}`}
                className="group relative overflow-hidden rounded-2xl border border-card-border bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-lg hover:shadow-accent/10"
              >
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-accent to-emerald-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="flex items-start justify-between gap-3">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent transition-colors duration-300 group-hover:bg-accent group-hover:text-white">
                    <ToolIcon icon={tool.icon} />
                  </div>
                  <span className="flex-shrink-0 rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
                    {tool.badge}
                  </span>
                </div>
                <p className="mt-4 text-base font-bold text-foreground">{tool.name}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted">{tool.description}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-accent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  今すぐ使う
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </Link>
            ))}
          </div>
          <p className="mt-8 text-center">
            <Link href="/tools" className="text-sm font-medium text-accent transition hover:underline">
              すべてのツールを見る →
            </Link>
          </p>
        </div>
      </section>

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
          6.5 PROGRAM CTA
      ═══════════════════════════════════════════════ */}
      <section className="relative overflow-hidden px-6 py-16 sm:py-24">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/[0.04] via-accent/[0.02] to-transparent" aria-hidden="true" />
        <div className="relative z-10 mx-auto max-w-4xl">
          <div className="rounded-3xl border-2 border-accent/30 bg-white p-8 sm:p-12 text-center shadow-lg shadow-accent/5">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
              買い切り教材
            </div>
            <h2 className="mb-3 text-2xl font-bold text-foreground sm:text-3xl">
              成約5ステップ完全攻略プログラム
            </h2>
            <p className="mx-auto mb-6 max-w-2xl text-sm text-muted leading-relaxed sm:text-base">
              22レッスンで営業の「型」を体系的に習得。アプローチからクロージング・反論処理まで、
              <br className="hidden sm:block" />
              どんな商材でも使える実践メソッドを身につけましょう。
            </p>
            <div className="mb-6 flex items-center justify-center gap-3">
              <span className="text-lg text-muted line-through">¥14,800</span>
              <span className="text-3xl font-bold text-accent sm:text-4xl">¥9,800</span>
              <span className="rounded-full bg-accent/10 px-3 py-1 text-sm font-bold text-accent">先着30名</span>
            </div>
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/program"
                className="inline-flex h-12 items-center justify-center rounded-xl bg-accent px-8 text-base font-bold text-white transition hover:bg-accent-hover"
              >
                プログラムの詳細を見る
              </Link>
              <Link
                href="/learn"
                className="inline-flex h-12 items-center justify-center rounded-xl border-2 border-accent/30 px-8 text-base font-bold text-accent transition hover:bg-accent/5"
              >
                まず無料レッスンを試す
              </Link>
            </div>
            <p className="mt-4 text-xs text-muted">
              &#10003; 買い切り・追加費用なし &#10003; 22レッスン完全収録 &#10003; AIロープレ連動
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          7. SERVICE CATEGORIES
      ═══════════════════════════════════════════════ */}
      <section className="px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-12 text-center text-2xl font-bold text-foreground sm:text-3xl">
            営業力を鍛えるサービス
          </h2>
          <div className="flip-cards">
            {serviceCategories.map((cat) => (
              <Link key={cat.title} href={cat.href} className="flip-card">
                <div className="flip-card__front">
                  <Image
                    src={cat.image}
                    alt={cat.title}
                    width={120}
                    height={120}
                    className="flip-card__icon"
                  />
                  <p className="flip-card__label">{cat.title}</p>
                </div>
                <div className="flip-card__content">
                  <p className="flip-card__title">{cat.title}</p>
                  <p className="flip-card__description">{cat.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          8. FREE PLAN CTA
      ═══════════════════════════════════════════════ */}
      <section className="px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-2xl font-bold text-foreground sm:text-3xl">
            まずは無料で体験してみませんか？
          </h2>
          <p className="mb-10 text-sm text-muted sm:text-base">
            まずは1回、AIと商談してみてください。
            <br />
            3分のロープレで、あなたの営業力がスコアでわかります。
          </p>
          <div className="plan">
            <div className="inner">
              <span className="pricing">
                <span>¥0 <small>/月</small></span>
              </span>
              <p className="title">無料プラン</p>
              <p className="info">登録するだけで、毎日1回AIロープレ＆スコアリングが使えます。</p>
              <ul className="features">
                {freeFeatures.map((feat) => (
                  <li key={feat}>
                    <span className="icon"><CheckIcon /></span>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
              <div className="action flex flex-col gap-2">
                <Link href="/learn" className="button" style={{ background: "transparent", border: "2px solid rgba(249,115,22,0.4)", color: "#f97316" }}>まず営業の型を学ぶ</Link>
                <Link href="/roleplay" className="button">すぐにAIと商談する</Link>
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
            <Link href="/pricing" className="mt-2 block text-center text-xs font-medium text-accent transition hover:underline">
              料金プランを見る →
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          9. TESTIMONIALS (Social Proof — Cialdini)
      ═══════════════════════════════════════════════ */}
      <section className="px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-4xl">
          <UserReviews />
        </div>
      </section>

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
            明日の商談に間に合う。今すぐ練習を始めよう。
          </h2>
          <p className="mb-4 text-sm text-muted sm:text-base">
            3分で最初の商談が終わります。まずは1回、試してみてください。
          </p>
          <p className="mb-10 text-sm text-muted">
            &#10003; 無料で体験 &#10003; 登録不要 &#10003; いつでも解約OK
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/learn"
              className="inline-flex h-14 items-center justify-center rounded-xl border-2 border-accent/30 bg-accent/5 px-8 text-base font-bold text-accent transition hover:bg-accent/10 hover:border-accent/50 sm:min-w-[220px]"
            >
              まず営業の型を学ぶ
            </Link>
            <PrimaryCTA text="すぐにAIと練習する" />
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
        <div className="flex items-center gap-3">
          <Link
            href="/learn"
            className="text-xs font-bold text-accent transition hover:underline"
          >
            型を学ぶ
          </Link>
          <Link
            href="/roleplay"
            className="inline-flex h-9 items-center justify-center rounded-lg bg-accent px-4 text-xs font-bold text-white transition hover:bg-accent-hover"
          >
            無料で営業力を診断する
          </Link>
        </div>
      </ScrollSlideIn>
    </div>
  );
}
