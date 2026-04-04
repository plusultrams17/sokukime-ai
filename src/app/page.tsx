import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/header";
import { JsonLd } from "@/components/json-ld";
import { HomepageCTATracker } from "@/components/homepage-cta-tracker";

/* ─── Reusable CTA Button ─── */

function CTAButton({ className = "" }: { className?: string }) {
  return (
    <Link href="/learn" scroll={true} className={`lp-cta-btn ${className}`}>
      無料で営業の型を学ぶ
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
            description:
              "22レッスン学習コース・業種別トークスクリプト・AIロープレ1日1回・成約スコアリング",
            availability: "https://schema.org/InStock",
          },
          {
            "@type": "Offer",
            price: "2980",
            priceCurrency: "JPY",
            name: "Proプラン",
            description:
              "22レッスン+認定試験・全業種トークスクリプト・AIロープレ無制限・リアルタイムコーチング",
            availability: "https://schema.org/InStock",
          },
        ],
        featureList:
          "22レッスン学習コース, 業種別トークスクリプト, 切り返し話法, AIロープレ練習, 成約スコア分析, リアルタイムコーチング",
        inLanguage: "ja",
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

      {/* SEO */}
      <h1 className="sr-only">
        業種別営業学習プログラム — 成約5ステップメソッドで営業の「型」を習得
      </h1>
      <p className="sr-only">
        成約コーチ AIは、営業心理学に基づく「成約5ステップメソッド」を22レッスンで体系的に学べる業種別営業学習プログラムです。アプローチ・ヒアリング・プレゼン・クロージング・反論処理の5ステップを、業種別のトークスクリプトと切り返し話法で実践的に習得。学んだ技術はAIロープレで即実践練習できます。
      </p>

      {/* ═══════════════════════════════════════════════
          1. HERO — Text overlaid on full-width visual
      ═══════════════════════════════════════════════ */}
      <section className="relative w-full overflow-hidden" style={{ backgroundColor: "#e8e6e1", minHeight: "100dvh" }}>
        {/* Background image — bottom-aligned so mountain/path stays low */}
        <Image
          src="/hero-visual.png"
          alt="営業の道を歩むビジネスパーソン — 成約への旅路"
          fill
          priority
          className="object-cover object-bottom"
        />

        {/* Text overlay — split: heading top, CTA bottom */}
        <div className="relative z-10 flex flex-col justify-between px-6 pt-32 pb-10 sm:pt-40 sm:pb-16" style={{ minHeight: "100dvh" }}>
          {/* Heading — top */}
          <div className="text-center">
            <p className="lp-heading mb-6" style={{ fontSize: "clamp(28px, 5vw, 44px)" }}>
              売れる営業には、<span className="lp-highlight">「型」</span>がある。
            </p>
            <p className="mx-auto max-w-xl text-base leading-relaxed text-muted sm:text-lg">
              営業心理学に基づく「成約5ステップメソッド」を、
              <br className="hidden sm:block" />
              22レッスンで体系的に学べるプログラムです。
            </p>
          </div>

          {/* CTA — bottom */}
          <div className="text-center">
            <CTAButton />
            <p className="mt-5 text-sm text-muted">
              登録不要・22レッスン無料・5分で開始
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          2. 課題共感
      ═══════════════════════════════════════════════ */}
      <section style={{ backgroundColor: "#e8e6e1" }}>
        <div className="lp-section pb-0">
          <p className="lp-heading text-center" style={{ marginBottom: "-30px" }}>
            営業の<span className="lp-highlight">「型」</span>を学んだ人の変化
          </p>
        </div>
        {/* Full-width image with stats overlaid top-left */}
        <div className="relative w-full">
          <Image
            src="/step-visual.png"
            alt="成約5ステップメソッド — アプローチ・ヒアリング・プレゼン・クロージング・反論処理"
            width={1600}
            height={900}
            className="w-full"
          />
          {/* Stats — top-left overlay, individual cards */}
          <div className="absolute top-4 left-4 space-y-2 sm:top-8 sm:left-8 sm:space-y-3 lg:top-12 lg:left-12">
            {[
              { value: "1.8倍", label: "初回商談での成約率" },
              { value: "67%", label: "「検討します」からの切り返し成功率" },
              { value: "83%", label: "受講者が3週間でスコア改善" },
            ].map((stat, i) => (
              <div key={i} className="flex items-center gap-2 rounded-lg bg-white/85 px-3 py-2 shadow-md backdrop-blur-sm sm:px-4 sm:py-3">
                <span className="shrink-0 text-sm font-bold sm:text-base lg:text-lg" style={{ color: "var(--lp-cta)" }}>
                  {stat.value}
                </span>
                <p className="text-xs leading-snug text-foreground sm:text-sm lg:text-base">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          3. 解決策 / 価値
      ═══════════════════════════════════════════════ */}
      <section style={{ backgroundColor: "#e8e6e1" }}>
        <div className="lp-section text-center">
          <p className="lp-heading mb-12">
            <span className="lp-highlight">成約コーチ AI</span>なら、
            <br className="sm:hidden" />
            営業の「型」が身につく
          </p>
          <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 sm:grid-cols-3">
            <Image
              src="/learn-visual.png"
              alt="学ぶ — 5分のレッスンで営業心理学の「型」を理解。22レッスンを段階的に進められる"
              width={600}
              height={600}
              className="w-full"
            />
            <Image
              src="/try-visual.png"
              alt="試す — 学んだ話法をAIロープレで即実践。あなたの業種に合わせたお客さん役が相手"
              width={600}
              height={600}
              className="w-full"
            />
            <Image
              src="/grow-visual.png"
              alt="伸びる — 成約スコアで弱点が一目瞭然。練習するたびに数字で成長を実感できる"
              width={600}
              height={600}
              className="w-full"
            />
          </div>
          <div className="mt-12">
            <CTAButton />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          4. 社会的証明
      ═══════════════════════════════════════════════ */}
      <section style={{ backgroundColor: "#e8e6e1" }}>
        <div className="lp-section text-center">
          <p className="lp-heading mb-8">
            体験者の声
          </p>
          <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 sm:grid-cols-3">
            <Image
              src="/voice-1.png"
              alt="25歳・不動産営業 — 型を学んでから商談に臨んだら、初めて即決をもらえた"
              width={600}
              height={400}
              className="w-full"
            />
            <Image
              src="/voice-2.png"
              alt="34歳・SaaS営業マネージャー — 22レッスンをやらせたら共通言語ができて指導がラクになった"
              width={600}
              height={400}
              className="w-full"
            />
            <Image
              src="/voice-3.png"
              alt="27歳・保険営業 — 5ステップの型があるだけで商談の組み立て方がわかるようになった"
              width={600}
              height={400}
              className="w-full"
            />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          5. 最終CTA
      ═══════════════════════════════════════════════ */}
      <section style={{ backgroundColor: "#e8e6e1" }}>
        <div className="lp-section text-center">
          <p className="lp-heading mb-6">
            「なんとなく」の営業を
            <br />
            今日で終わりにしませんか？
          </p>
          <div className="mb-8">
            <CTAButton />
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted">
            <span>登録不要</span>
            <span className="hidden sm:inline text-card-border">|</span>
            <span>14日間スコア改善保証</span>
            <span className="hidden sm:inline text-card-border">|</span>
            <span>いつでも退会OK</span>
          </div>
        </div>
      </section>

      {/* ── Inline Footer ── */}
      <footer className="px-6 py-10 text-center text-xs text-muted" style={{ backgroundColor: "#e8e6e1" }}>
        <nav className="mb-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          <Link href="/learn" className="transition hover:text-foreground">学習コース</Link>
          <Link href="/roleplay" className="transition hover:text-foreground">AIロープレ</Link>
          <Link href="/pricing" className="transition hover:text-foreground">料金プラン</Link>
          <Link href="/faq" className="transition hover:text-foreground">FAQ</Link>
          <Link href="/terms" className="transition hover:text-foreground">利用規約</Link>
        </nav>
        <p>&copy; {new Date().getFullYear()} 成約コーチ AI</p>
      </footer>

      <HomepageCTATracker />
    </div>
  );
}
