import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/header";
import { JsonLd } from "@/components/json-ld";
import { HomepageCTATracker } from "@/components/homepage-cta-tracker";
import { SalesTriviaPopup } from "@/components/sales-trivia-popup";
import { UserReviews } from "@/components/user-reviews";
import { ReferralTracker } from "@/components/referral-tracker";
import { MiniDiagnosis } from "@/components/mini-diagnosis";
import { LPHeroAB } from "@/components/lp-hero-ab";

/* ─── Reusable CTA Buttons ─── */

/**
 * メインCTA: 無料ロープレへ誘導（Freeプラン=累計5回）
 * Phase 2A改修: `/diagnose` から `/roleplay` に変更し、選択肢のパラドックス回避のため
 * 体験→診断の順に整理。Heroではこれが主導線。
 */
function CTAButton({ className = "" }: { className?: string }) {
  return (
    <Link href="/roleplay" scroll={true} className={`lp-cta-btn ${className}`}>
      無料で試す（5回まで）
    </Link>
  );
}

/**
 * サブCTA: 60秒の簡易診断 → `/diagnosis`
 * 「まだ試すのは早い」層の受け皿。Heroと最終CTAでのみ併置。
 */
function SecondaryCTA({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/diagnosis"
      scroll={true}
      className={`lp-cta-secondary ${className}`}
    >
      まず60秒で診断する →
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
        name: "成約コーチAI",
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
              "基本3レッスン・業種別トークスクリプト一部・AIロープレ累計5回まで・成約スコア1カテゴリ",
            availability: "https://schema.org/InStock",
          },
          {
            "@type": "Offer",
            price: "990",
            priceCurrency: "JPY",
            name: "Starterプラン",
            description:
              "22レッスン+認定試験・全業種トークスクリプト・AIロープレ月30回・リアルタイムコーチング",
            availability: "https://schema.org/InStock",
          },
          {
            "@type": "Offer",
            price: "1980",
            priceCurrency: "JPY",
            name: "Proプラン",
            description:
              "22レッスン+認定試験・全業種トークスクリプト・AIロープレ月60回・リアルタイムコーチング",
            availability: "https://schema.org/InStock",
          },
          {
            "@type": "Offer",
            price: "4980",
            priceCurrency: "JPY",
            name: "Masterプラン",
            description:
              "22レッスン+認定試験・全業種トークスクリプト・AIロープレ月200回・リアルタイムコーチング・優先サポート",
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
        業種別営業学習プログラム — 弱点を可視化し、伸びしろを見つけて営業力を底上げ
      </h1>
      <p className="sr-only">
        成約コーチAIは、営業心理学に基づく「成約5ステップメソッド」を22レッスンで体系的に学べる業種別営業学習プログラムです。アプローチ・ヒアリング・プレゼン・クロージング・反論処理の5ステップを、業種別のトークスクリプトと切り返し話法で実践的に習得。学んだ技術はAIロープレで即実践練習できます。
      </p>

      {/* ═══════════════════════════════════════════════
          1. HERO — Text overlaid on full-width visual
      ═══════════════════════════════════════════════ */}
      <section
        className="relative -mt-16 w-full overflow-hidden pt-10 sm:pt-0"
        style={{ backgroundColor: "#1a1a1a", minHeight: "100dvh" }}
      >
        {/* Background image — bottom-aligned so mountain/path stays low */}
        <Image
          src="/hero-visual.png"
          alt="営業の道を歩むビジネスパーソン — 成約への旅路"
          fill
          priority
          sizes="100vw"
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
          className="relative z-10 flex flex-col items-center justify-center px-4 pt-24 pb-24 sm:px-6 sm:pt-28 sm:pb-28"
          style={{ minHeight: "100dvh" }}
        >
          <div className="mx-auto w-full max-w-3xl text-center">
            {/* Tag line — Phase 2A改修: 狭いセグメント限定表記を撤廃し、
                3ペルソナ（新人/中堅/経営者）を包含する表現に */}
            <p
              className="mb-4 text-xs font-bold tracking-[0.2em] uppercase sm:mb-5 sm:text-sm"
              style={{ color: "#f97316" }}
            >
              個人の練習から、チーム全体の底上げまで
            </p>

            {/* Main heading + Sub heading (A/B testable) */}
            <LPHeroAB />

            {/* Score card preview — Phase 2A改修: S/A/B/C/Dランクの可視化で
                「何が得られるか」を一目で理解させる（funnel-architect推奨） */}
            <div
              className="mx-auto mb-8 max-w-md rounded-xl border border-white/15 bg-white/5 px-4 py-4 backdrop-blur-sm sm:mb-10 sm:px-5 sm:py-5"
              aria-label="スコアカード プレビュー"
            >
              <div className="mb-2 flex items-center justify-between text-[10px] tracking-widest uppercase sm:text-xs" style={{ color: "rgba(255,255,255,0.55)" }}>
                <span>成約スコア</span>
                <span>Sample</span>
              </div>
              <div className="flex items-stretch gap-1.5 sm:gap-2">
                {[
                  { rank: "S", label: "達人", active: false },
                  { rank: "A", label: "上級", active: true },
                  { rank: "B", label: "中級", active: false },
                  { rank: "C", label: "初級", active: false },
                  { rank: "D", label: "入門", active: false },
                ].map((item) => (
                  <div
                    key={item.rank}
                    className="flex-1 rounded-md px-1 py-2 text-center sm:py-2.5"
                    style={{
                      background: item.active ? "rgba(249,115,22,0.2)" : "rgba(255,255,255,0.06)",
                      borderWidth: item.active ? "1px" : "1px",
                      borderStyle: "solid",
                      borderColor: item.active ? "#f97316" : "rgba(255,255,255,0.1)",
                    }}
                  >
                    <div
                      className="text-base font-extrabold sm:text-lg"
                      style={{ color: item.active ? "#f97316" : "rgba(255,255,255,0.5)" }}
                    >
                      {item.rank}
                    </div>
                    <div
                      className="text-[9px] sm:text-[10px]"
                      style={{ color: item.active ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.4)" }}
                    >
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-2.5 text-[10px] leading-relaxed sm:text-xs" style={{ color: "rgba(255,255,255,0.65)" }}>
                5カテゴリ（アプローチ/ヒアリング/プレゼン/クロージング/反論処理）を
                <span style={{ color: "#f97316" }}>Sランクまで</span>可視化
              </p>
            </div>

            {/* CTA — Phase 2A改修: メイン(ロープレ体験) + サブ(診断) の2つに集約 */}
            <div className="mb-3 flex flex-col items-center gap-3">
              <CTAButton className="hero-cta-btn" />
              <SecondaryCTA className="lp-cta-secondary--hero" />
            </div>

            {/* ペルソナC対応 — 個人〜法人利用への裾野を明示 */}
            <p
              className="mt-5 text-xs sm:text-sm"
              style={{ color: "rgba(255,255,255,0.75)" }}
            >
              個人の自主練から、法人・チーム導入まで対応 ／
              <Link
                href="/enterprise"
                className="ml-1 underline underline-offset-2 transition hover:text-white"
                style={{ color: "#f97316" }}
              >
                法人向け詳細
              </Link>
            </p>

            {/* Trust signals */}
            <div className="mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 sm:mt-6 sm:gap-x-6">
              {["クレカ不要で開始", "Googleログインのみ", "いつでも退会OK"].map((text) => (
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
            className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 sm:bottom-10"
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
          2. ビジュアル証明 — スコア画像
      ═══════════════════════════════════════════════ */}
      <section style={{ backgroundColor: "#f7f8ea" }}>
        <div className="lp-section pb-0">
          <p className="lp-heading text-center" style={{ marginBottom: "-30px" }}>
            5カテゴリの<span className="lp-highlight">スコア</span>で<br className="sm:hidden" />弱点が一目瞭然
          </p>
        </div>
        <div className="relative w-full">
          <Image
            src="/step-visual.png"
            alt="成約5ステップメソッド — アプローチ・ヒアリング・プレゼン・クロージング・反論処理"
            width={1600}
            height={900}
            sizes="100vw"
            className="w-full"
          />
          <div className="absolute top-1 left-1 space-y-1 sm:top-8 sm:left-8 sm:space-y-3 lg:top-12 lg:left-12">
            {[
              { value: "5カテゴリ", label: "スコアで弱点を可視化" },
              { value: "3分", label: "1回のロープレ所要時間" },
              { value: "22レッスン", label: "体系的な営業メソッド" },
            ].map((stat, i) => (
              <div key={i} className="flex items-center gap-1 rounded-md bg-white/85 px-1.5 py-1 shadow-md backdrop-blur-sm sm:gap-2 sm:rounded-lg sm:px-4 sm:py-3">
                <span className="shrink-0 text-[9px] font-bold sm:text-base lg:text-lg" style={{ color: "var(--lp-cta)" }}>
                  {stat.value}
                </span>
                <p className="text-[8px] leading-snug text-foreground sm:text-sm lg:text-base">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          2.5 ソーシャルプルーフ
      ═══════════════════════════════════════════════ */}
      <section className="border-t border-card-border bg-white py-12 sm:py-16 md:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <p className="lp-heading mb-10 text-center">
            選ばれる<span className="lp-highlight">理由</span>
          </p>
          {/* 数値実績 */}
          <div className="mb-12 grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-4">
            {[
              { value: "22", unit: "レッスン", label: "体系的カリキュラム" },
              { value: "5", unit: "カテゴリ", label: "AIスコア分析" },
              { value: "30", unit: "パターン", label: "反論切り返しテンプレ" },
              { value: "24h", unit: "", label: "いつでも練習可能" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-xl border border-card-border bg-background p-3 text-center sm:p-4">
                <div className="text-2xl font-extrabold sm:text-3xl" style={{ color: "var(--lp-cta)" }}>
                  {stat.value}<span className="text-sm font-bold text-muted">{stat.unit}</span>
                </div>
                <div className="mt-1 text-xs text-muted">{stat.label}</div>
              </div>
            ))}
          </div>
          {/* こんな方に最適 */}
          <div className="grid gap-3 sm:gap-4 sm:grid-cols-3">
            {[
              { title: "入社1〜3年目", desc: "営業の「型」を最短で習得したい若手営業パーソン" },
              { title: "成約率に伸び悩み", desc: "自己流の限界を感じ、体系的メソッドで突破したい方" },
              { title: "ロープレが苦手", desc: "人前での練習が苦手で、AIと気軽に何度でも練習したい方" },
            ].map((item) => (
              <div key={item.title} className="rounded-xl border border-card-border bg-background p-5">
                <p className="mb-1 text-sm font-bold text-foreground">{item.title}</p>
                <p className="text-xs text-muted leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          2.6 悩み共感 — 承認格差の文脈
      ═══════════════════════════════════════════════ */}
      <section className="border-t border-card-border bg-background py-12 sm:py-16 md:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <p className="lp-heading mb-8 text-center">
            営業で一番つらいのは、<br className="sm:hidden" /><span className="lp-highlight">給料じゃない</span>
          </p>
          <div className="space-y-4">
            {[
              {
                q: "「なんで売れないんだろう」と、自分を責めてしまう",
                a: "売れない原因が見えないから苦しい。スコアで弱点を可視化すると、努力の方向が定まります。",
              },
              {
                q: "先輩の「普通にやればいいじゃん」が一番キツい",
                a: "「普通」は人によって違います。22レッスンの型があれば、自分だけの基準で成長を測れます。",
              },
              {
                q: "お客さんに必要とされている実感がない",
                a: "営業スキルが上がると、お客さんから「あなたに相談してよかった」と言われる瞬間が来ます。",
              },
            ].map((item, i) => (
              <div key={i} className="rounded-xl border border-card-border bg-card p-5">
                <p className="mb-2 text-sm font-bold text-foreground">{item.q}</p>
                <p className="text-xs text-muted leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <p className="mb-4 text-xs text-muted">
              まずは今の営業力を客観的に把握するところから。
            </p>
            <CTAButton />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          2.7 ミニ診断1問 — エンゲージメントフック
      ═══════════════════════════════════════════════ */}
      <MiniDiagnosis />

      {/* ═══════════════════════════════════════════════
          2.7 ユーザーレビュー（0件時は自動非表示）
      ═══════════════════════════════════════════════ */}
      <UserReviews />

      {/* ═══════════════════════════════════════════════
          3. 最終CTA
      ═══════════════════════════════════════════════ */}
      <section className="border-t border-card-border bg-white">
        <div className="lp-section text-center">
          <p className="lp-heading mb-4">
            まず3分、試してみてください
          </p>
          <p className="mx-auto mb-6 max-w-md text-sm text-muted leading-relaxed sm:mb-8">
            自分の営業トークがどう評価されるのか、スコアで確認できます。
            登録もクレジットカードも不要です。
          </p>
          <div className="mb-6 flex flex-col items-center gap-3 sm:mb-8">
            <CTAButton />
            <SecondaryCTA />
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-muted sm:gap-x-6 sm:text-sm">
            <span>3分で体験完了</span>
            <span className="hidden sm:inline text-card-border">|</span>
            <span>クレカ不要</span>
            <span className="hidden sm:inline text-card-border">|</span>
            <span>いつでも退会OK</span>
          </div>
          {/* Free-first value prop */}
          <div className="mt-6 mx-auto max-w-md rounded-lg border border-accent/30 bg-accent/5 px-4 py-3 sm:mt-8 sm:px-6 sm:py-4">
            <p className="text-sm font-bold text-foreground">
              無料プランでできること
            </p>
            <p className="text-xs text-muted mt-1">AIロープレ体験・スコア診断・基本レッスン3本</p>
            <p className="text-xs text-muted">すべて無料、登録30秒</p>
          </div>
        </div>
      </section>

      {/* ── Inline Footer ── */}
      <footer className="border-t border-card-border bg-white px-4 py-8 text-center text-xs text-muted sm:px-6 sm:py-10">
        <nav className="mb-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 sm:gap-x-6">
          <Link href="/learn" className="transition hover:text-foreground">学習コース</Link>
          <Link href="/roleplay" className="transition hover:text-foreground">AIロープレ</Link>
          <Link href="/pricing" className="transition hover:text-foreground">料金プラン</Link>
          <Link href="/faq" className="transition hover:text-foreground">FAQ</Link>
          <Link href="/legal/terms" className="transition hover:text-foreground">利用規約</Link>
        </nav>
        <p>&copy; {new Date().getFullYear()} 成約コーチAI</p>
      </footer>

      <HomepageCTATracker />
      <SalesTriviaPopup />
      <ReferralTracker />
    </div>
  );
}
