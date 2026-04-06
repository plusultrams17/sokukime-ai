import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/header";
import { JsonLd } from "@/components/json-ld";
import { HomepageCTATracker } from "@/components/homepage-cta-tracker";

/* ─── Reusable CTA Buttons ─── */

function CTAButton({ className = "" }: { className?: string }) {
  return (
    <Link href="/try-roleplay" scroll={true} className={`lp-cta-btn ${className}`}>
      今すぐAIロープレを体験
    </Link>
  );
}

function SecondaryCTA({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/learn"
      scroll={true}
      className={`lp-cta-secondary ${className}`}
    >
      まず営業の型を学ぶ →
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
    <div className="lp-page min-h-screen bg-background">
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
      <section
        className="relative -mt-16 w-full overflow-hidden"
        style={{ backgroundColor: "#1a1a1a", minHeight: "100dvh" }}
      >
        {/* Background image — bottom-aligned so mountain/path stays low */}
        <Image
          src="/hero-visual.png"
          alt="営業の道を歩むビジネスパーソン — 成約への旅路"
          fill
          priority
          className="object-cover object-bottom opacity-60"
        />

        {/* Gradient overlay — ensures text readability over any image */}
        <div
          className="absolute inset-0 z-[1]"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.15) 40%, rgba(0,0,0,0.4) 70%, rgba(0,0,0,0.7) 100%)",
          }}
        />

        {/* Content — vertically centered with CTA close to heading */}
        <div
          className="relative z-10 flex flex-col items-center justify-center px-6 pt-24 pb-24 sm:pt-28 sm:pb-28"
          style={{ minHeight: "100dvh" }}
        >
          <div className="mx-auto w-full max-w-3xl text-center">
            {/* Tag line */}
            <p
              className="mb-4 text-xs font-bold tracking-[0.2em] uppercase sm:mb-5 sm:text-sm"
              style={{ color: "#f97316" }}
            >
              商談即決スキル × AIロープレ
            </p>

            {/* Main heading */}
            <p
              className="lp-heading mb-5 leading-[1.3] text-white sm:mb-7"
              style={{
                fontSize: "clamp(30px, 6vw, 52px)",
                textShadow: "0 2px 20px rgba(0,0,0,0.3)",
              }}
            >
              「検討します」を、その場で
              <br />
              <span className="lp-highlight-hero">&quot;イエス&quot;</span>に変える。
            </p>

            {/* Sub heading */}
            <p
              className="mx-auto mb-10 max-w-lg text-sm leading-relaxed sm:mb-12 sm:text-base lg:text-lg"
              style={{
                color: "rgba(255,255,255,0.85)",
                textShadow: "0 1px 8px rgba(0,0,0,0.2)",
              }}
            >
              訪販・保険・不動産の営業マンが使う「商談即決スキル」を、
              <br className="hidden sm:block" />
              AIロープレで体に叩き込む。3分後、あなたの切り返しが変わります。
            </p>

            {/* CTA */}
            <div className="mb-3 flex flex-col items-center gap-3">
              <CTAButton className="hero-cta-btn" />
            </div>

            {/* Trust signals */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 sm:gap-x-6">
              {["22レッスン収録", "3分で体験完了", "登録・クレカ不要"].map((text) => (
                <span
                  key={text}
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm"
                  style={{ color: "rgba(255,255,255,0.7)" }}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    className="shrink-0"
                    aria-hidden="true"
                  >
                    <circle cx="7" cy="7" r="7" fill="rgba(249,115,22,0.2)" />
                    <path
                      d="M4 7.2L6.2 9.4L10 5"
                      stroke="#f97316"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {text}
                </span>
              ))}
            </div>
          </div>

          {/* Scroll indicator — bottom of viewport */}
          <div
            className="absolute bottom-6 left-1/2 -translate-x-1/2 sm:bottom-10"
            aria-hidden="true"
          >
            <div className="hero-scroll-indicator flex flex-col items-center gap-1">
              <span
                className="text-[10px] tracking-widest uppercase"
                style={{ color: "rgba(255,255,255,0.4)" }}
              >
                Scroll
              </span>
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                style={{ color: "rgba(255,255,255,0.4)" }}
              >
                <path
                  d="M10 4v10m0 0l-4-4m4 4l4-4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          2. こんな悩みはありませんか？（PAS: Problem）
      ═══════════════════════════════════════════════ */}
      <section style={{ backgroundColor: "#f7f8ea" }}>
        <div className="lp-section text-center">
          <p className="lp-heading mb-8">
            こんな<span className="lp-highlight">悩み</span>はありませんか？
          </p>
          <div className="mx-auto grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              {
                emoji: "😥",
                text: "先輩が忙しくてロープレ相手がいない",
              },
              {
                emoji: "🙈",
                text: "何回ミスしても恥ずかしくない環境がほしい",
              },
              {
                emoji: "🤔",
                text: "自分の営業トークの何が悪いか分からない",
              },
            ].map((item) => (
              <div
                key={item.text}
                className="rounded-xl bg-white/80 px-5 py-6 shadow-sm backdrop-blur-sm"
              >
                <p className="mb-2 text-2xl">{item.emoji}</p>
                <p className="text-sm font-medium leading-relaxed text-foreground">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-sm text-muted">
            成約コーチ AIなら、<strong className="text-foreground">24時間いつでも</strong>AIがロープレ相手になり、
            <br className="hidden sm:block" />
            <strong className="text-foreground">5カテゴリのスコア</strong>で改善ポイントが一目瞭然です。
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          3. 解決策 / 価値（PAS: Solution）
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
              alt="学ぶ — 5分のレッスンで営業心理学の「型」を理解"
              width={600}
              height={600}
              className="w-full"
            />
            <Image
              src="/try-visual.png"
              alt="試す — 学んだ話法をAIロープレで即実践"
              width={600}
              height={600}
              className="w-full"
            />
            <Image
              src="/grow-visual.png"
              alt="伸びる — 成約スコアで弱点が一目瞭然"
              width={600}
              height={600}
              className="w-full"
            />
          </div>
          <div className="mt-12 flex flex-col items-center gap-3">
            <CTAButton />
            <SecondaryCTA />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          4. スコアリング紹介 + 法人比較
      ═══════════════════════════════════════════════ */}
      <section style={{ backgroundColor: "#f7f8ea" }}>
        <div className="lp-section pb-0">
          <p className="lp-heading text-center" style={{ marginBottom: "-30px" }}>
            AIロープレの<span className="lp-highlight">スコアリング</span>評価基準
          </p>
        </div>
        <div className="relative w-full">
          <Image
            src="/step-visual.png"
            alt="成約5ステップメソッド — アプローチ・ヒアリング・プレゼン・クロージング・反論処理"
            width={1600}
            height={900}
            className="w-full"
          />
          <div className="absolute top-4 left-4 space-y-2 sm:top-8 sm:left-8 sm:space-y-3 lg:top-12 lg:left-12">
            {[
              { value: "5カテゴリ", label: "スコアで弱点を可視化" },
              { value: "3分", label: "1回のロープレ所要時間" },
              { value: "22レッスン", label: "体系的な営業メソッド" },
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
        {/* ChatGPT/法人との差別化 */}
        <div className="lp-section pt-8 pb-6">
          <p className="mb-6 text-center text-sm font-bold text-foreground">
            ChatGPTや法人AIロープレとの違い
          </p>
          <div className="mx-auto grid max-w-3xl grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              { label: "ChatGPT", items: ["メソッドなし", "スコアなし", "進捗管理なし"], color: "#9ca3af" },
              { label: "法人AIロープレ", items: ["初期費用 数百万円", "法人契約のみ", "個人利用不可"], color: "#9ca3af" },
              { label: "成約コーチ AI", items: ["22レッスン内蔵", "5カテゴリ採点", "月¥2,980で即開始"], color: "var(--lp-cta)" },
            ].map((col) => (
              <div key={col.label} className="rounded-xl border bg-white px-4 py-4" style={{ borderColor: col.color }}>
                <p className="mb-2 text-center text-xs font-bold" style={{ color: col.color }}>
                  {col.label}
                </p>
                <ul className="space-y-1">
                  {col.items.map((item) => (
                    <li key={item} className="text-center text-xs text-muted">{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          体験者の声 — 実ユーザーが集まるまで非表示
      ═══════════════════════════════════════════════ */}
      {/*
      <section style={{ backgroundColor: "#e8e6e1" }}>
        <div className="lp-section pt-6 text-center">
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
          <p className="mt-4 text-center text-xs text-muted/70">
            ※サービスイメージです。実際のユーザーの声ではありません
          </p>
        </div>
      </section>
      */}

      {/* ═══════════════════════════════════════════════
          5. 最終CTA
      ═══════════════════════════════════════════════ */}
      <section className="border-t border-card-border bg-white">
        <div className="lp-section text-center">
          <p className="lp-heading mb-6">
            「なんとなく」の営業を
            <br />
            今日で終わりにしませんか？
          </p>
          <div className="mb-8 flex flex-col items-center gap-3">
            <CTAButton />
            <SecondaryCTA />
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted">
            <span>登録不要</span>
            <span className="hidden sm:inline text-card-border">|</span>
            <span>3分で体験完了</span>
            <span className="hidden sm:inline text-card-border">|</span>
            <span>いつでも退会OK</span>
          </div>
          {/* Pro plan anchoring */}
          <div className="mt-8 mx-auto max-w-md rounded-lg border border-card-border bg-background px-6 py-4">
            <p className="text-xs text-muted mb-1">さらに本格的に学びたい方へ</p>
            <p className="text-sm font-bold text-foreground">
              Proプラン <span style={{ color: "var(--lp-cta)" }}>¥2,980</span><span className="text-muted font-normal">/月</span>
            </p>
            <p className="text-xs text-muted mt-1">全業種トークスクリプト・AIロープレ無制限・認定試験</p>
          </div>
        </div>
      </section>

      {/* ── Inline Footer ── */}
      <footer className="border-t border-card-border bg-white px-6 py-10 text-center text-xs text-muted">
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
