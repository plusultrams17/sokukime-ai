import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/header";
import { JsonLd } from "@/components/json-ld";
import { HomepageCTATracker } from "@/components/homepage-cta-tracker";
import { SalesTriviaPopup } from "@/components/sales-trivia-popup";
import { UserReviews } from "@/components/user-reviews";
import { ReferralTracker } from "@/components/referral-tracker";
import { MiniDiagnosis } from "@/components/mini-diagnosis";

/* ─── Reusable CTA Buttons ─── */

/**
 * メインCTA: 無料ロープレへ誘導（Freeプラン=累計5回）
 * Hero・各セクションの主導線。体験（/roleplay）に集約する。
 */
function CTAButton({ className = "" }: { className?: string }) {
  return (
    <Link href="/roleplay" scroll={true} className={`lp-cta-btn ${className}`}>
      無料で5回試す
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

/* ─── Static content data ─── */

// 痛み3枚（決定3-2）
const PAINS = [
  {
    title: "練習相手がいない",
    desc: "先輩は現場に出ずっぱり。ロープレに付き合ってもらう時間が取れず、ぶっつけ本番でお客様の前に立つしかない。",
  },
  {
    title: "教育する時間がない",
    desc: "新人にじっくり営業を教えたいのに、社長も先輩も自分の案件で手一杯。育成が後回しになっていく。",
  },
  {
    title: "お客様の前で断り文句に凍る",
    desc: "「高い」「他と比べたい」「今は考えていない」。想定外のひと言に頭が真っ白になり、返す言葉が出てこない。",
  },
];

// 3分デモの流れ（決定3-3）
const DEMO_STEPS = [
  {
    step: "01",
    title: "お客様役のAIと話す",
    desc: "住宅・リフォーム・塗装のお客様をAIが演じます。実際の商談のように、チャットで会話を進めます。",
  },
  {
    step: "02",
    title: "終わると5カテゴリで採点",
    desc: "アプローチ・ヒアリング・プレゼン・クロージング・反論処理の5カテゴリを自動でスコア化します。",
  },
  {
    step: "03",
    title: "改善アドバイスが届く",
    desc: "どこでつまずいたか、次にどう言い換えればよかったか。弱点と伸ばし方が具体的に見えます。",
  },
];

// 機能（決定3-4）
const FEATURES = [
  {
    value: "5カテゴリ",
    title: "成約スコア採点",
    desc: "アプローチからクロージング・反論処理まで、営業の流れを5カテゴリに分けて採点。弱点が数字で見えます。",
  },
  {
    value: "22レッスン",
    title: "体系的な学習コース",
    desc: "営業心理学にもとづく成約5ステップメソッドを、22レッスンで順を追って学べます。",
  },
  {
    value: "30パターン",
    title: "反論の切り返し集",
    desc: "「高い」「検討します」など、現場で頻出する断り文句への切り返しを30パターン用意しています。",
  },
];

// 業界別（決定3-5・住宅/リフォーム/塗装を先頭に）
const FEATURED_INDUSTRIES = [
  {
    slug: "real-estate",
    name: "住宅・不動産",
    desc: "注文住宅・建売の商談に特化したシナリオで、高額決断のクロージングを練習。",
  },
  {
    slug: "reform",
    name: "リフォーム",
    desc: "水回り・内装リフォームの相見積もり・値引き交渉への切り返しを練習。",
  },
  {
    slug: "exterior-painting",
    name: "外壁塗装",
    desc: "訪問・見積もり提示から契約まで、塗装営業ならではの反論処理を練習。",
  },
];

// 料金3プラン（決定2・詳細は/pricingへ）
const PRICING = [
  {
    tier: "ライト",
    price: "2,980",
    roleplay: "月30回",
    desc: "個人で営業を学び始めた方に",
    features: ["学習コース全22レッスン", "成約スコア全5カテゴリ", "反論切り返し30パターン"],
    recommended: false,
  },
  {
    tier: "プロ",
    price: "6,980",
    roleplay: "月100回",
    desc: "本格的に営業力を伸ばしたい方に",
    features: ["ライトのすべて", "AI改善アドバイス", "毎日の練習にも余裕の回数"],
    recommended: true,
  },
  {
    tier: "無制限",
    price: "14,800",
    roleplay: "月300回",
    desc: "トップセールス・毎日練習する方に",
    features: ["プロのすべて", "実質無制限の練習量", "優先サポート"],
    recommended: false,
  },
];

// FAQ（決定3-7）
const FAQS = [
  {
    q: "無料プランではどこまで使えますか？",
    a: "AIロープレを累計5回まで、成約スコア診断、基本レッスン3本を無料で利用できます。クレジットカードの登録は不要です。",
  },
  {
    q: "本当に営業が上手くなりますか？",
    a: "成約を保証するものではありません。練習相手がいなくても何度でもロープレでき、弱点が5カテゴリの採点で見えるよう設計しています。練習量を増やし、改善点を把握することを目的としたサービスです。",
  },
  {
    q: "どんな業種に対応していますか？",
    a: "住宅・リフォーム・外壁塗装をはじめ、16業種の専用シナリオを用意しています。業種を選んでロープレを始められます。",
  },
  {
    q: "解約はいつでもできますか？",
    a: "はい、いつでも解約できます。解約後も当月末までは有料機能をご利用いただけます。",
  },
];

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
          "住宅・リフォーム・塗装営業のためのAIロープレ。お客様役のAIと話すと、成約5ステップメソッドを5カテゴリで採点。新人が一人でも成約の練習ができる営業トレーニングサービス。",
        provider: { "@id": `${siteUrl}/#organization` },
        offers: [
          {
            "@type": "Offer",
            price: "0",
            priceCurrency: "JPY",
            name: "フリープラン",
            description:
              "AIロープレ累計5回まで・成約スコア診断・基本3レッスン・クレジットカード不要",
            availability: "https://schema.org/InStock",
          },
          {
            "@type": "Offer",
            price: "2980",
            priceCurrency: "JPY",
            name: "ライトプラン",
            description:
              "学習コース全22レッスン・成約スコア全5カテゴリ・反論切り返し30パターン・AIロープレ月30回",
            availability: "https://schema.org/InStock",
          },
          {
            "@type": "Offer",
            price: "6980",
            priceCurrency: "JPY",
            name: "プロプラン",
            description:
              "全22レッスン・成約スコア全5カテゴリ+AI改善アドバイス・AIロープレ月100回",
            availability: "https://schema.org/InStock",
          },
          {
            "@type": "Offer",
            price: "14800",
            priceCurrency: "JPY",
            name: "無制限プラン",
            description:
              "全22レッスン・成約スコア全5カテゴリ+AI改善アドバイス・AIロープレ月300回・優先サポート",
            availability: "https://schema.org/InStock",
          },
        ],
        featureList:
          "AIロープレ練習, 成約スコア5カテゴリ採点, 22レッスン学習コース, 業種別トークスクリプト, 反論切り返し30パターン, AI改善アドバイス",
        inLanguage: "ja",
      },
      {
        "@type": "FAQPage",
        "@id": `${siteUrl}/#faq`,
        mainEntity: FAQS.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
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
    <div className="lp-page min-h-screen bg-background">
      <JsonLd data={jsonLdData} />
      <Header />

      {/* SEO */}
      <h1 className="sr-only">
        住宅・リフォーム・塗装営業のためのAIロープレ — 新人が一人で、成約の練習ができる
      </h1>
      <p className="sr-only">
        成約コーチAIは、お客様役のAIと商談を練習できる営業トレーニングサービスです。ロープレが終わると、アプローチ・ヒアリング・プレゼン・クロージング・反論処理の5カテゴリを自動で採点し、弱点と改善点を可視化します。練習相手がいなくても、新人が一人で成約の練習を積めます。
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
            {/* Tag line — 住宅・リフォーム・塗装への特化を明示 */}
            <p
              className="mb-4 text-xs font-bold tracking-[0.2em] uppercase sm:mb-5 sm:text-sm"
              style={{ color: "#f97316" }}
            >
              住宅・リフォーム・塗装営業のためのAIロープレ
            </p>

            {/* Main heading */}
            <p
              className="lp-heading mb-5 leading-[1.3] text-white sm:mb-7"
              style={{
                fontSize: "clamp(24px, 6vw, 54px)",
                textShadow: "0 2px 20px rgba(0,0,0,0.3)",
              }}
            >
              新人が一人で、
              <br className="sm:hidden" />
              <span className="lp-highlight-hero">成約の練習</span>ができる。
            </p>

            {/* Sub heading */}
            <p
              className="mx-auto mb-10 max-w-lg text-sm leading-relaxed sm:mb-12 sm:text-base lg:text-lg"
              style={{
                color: "rgba(255,255,255,0.85)",
                textShadow: "0 1px 8px rgba(0,0,0,0.2)",
              }}
            >
              お客様役のAIと商談を練習。終わると5カテゴリで採点し、
              <br className="hidden sm:block" />
              どこでつまずいたか、次にどう言えばいいかが見えます。
            </p>

            {/* Score card preview — 「何が得られるか」を一目で理解させる */}
            <div
              className="mx-auto mb-8 max-w-md rounded-xl border border-white/15 bg-white/5 px-4 py-4 backdrop-blur-sm sm:mb-10 sm:px-5 sm:py-5"
              aria-label="スコアカード プレビュー"
            >
              <div
                className="mb-2 flex items-center justify-between text-[10px] tracking-widest uppercase sm:text-xs"
                style={{ color: "rgba(255,255,255,0.55)" }}
              >
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
                      background: item.active
                        ? "rgba(249,115,22,0.2)"
                        : "rgba(255,255,255,0.06)",
                      borderWidth: "1px",
                      borderStyle: "solid",
                      borderColor: item.active
                        ? "#f97316"
                        : "rgba(255,255,255,0.1)",
                    }}
                  >
                    <div
                      className="text-base font-extrabold sm:text-lg"
                      style={{
                        color: item.active ? "#f97316" : "rgba(255,255,255,0.5)",
                      }}
                    >
                      {item.rank}
                    </div>
                    <div
                      className="text-[9px] sm:text-[10px]"
                      style={{
                        color: item.active
                          ? "rgba(255,255,255,0.85)"
                          : "rgba(255,255,255,0.4)",
                      }}
                    >
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>
              <p
                className="mt-2.5 text-[10px] leading-relaxed sm:text-xs"
                style={{ color: "rgba(255,255,255,0.65)" }}
              >
                5カテゴリ（アプローチ/ヒアリング/プレゼン/クロージング/反論処理）を
                <span style={{ color: "#f97316" }}>Sランクまで</span>可視化
              </p>
            </div>

            {/* CTA — メイン(ロープレ体験) + サブ(診断) */}
            <div className="mb-3 flex flex-col items-center gap-3">
              <CTAButton className="hero-cta-btn" />
              <SecondaryCTA className="lp-cta-secondary--hero" />
            </div>

            {/* 個人〜法人利用への裾野を明示 */}
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
              {["クレカ不要で開始", "Googleログインのみ", "いつでも退会OK"].map(
                (text) => (
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
                )
              )}
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
          2. 痛み3枚 — 現場のリアルな困りごと
      ═══════════════════════════════════════════════ */}
      <section className="border-t border-card-border bg-background py-12 sm:py-16 md:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <p className="lp-heading mb-3 text-center">
            営業の新人育成、
            <br className="sm:hidden" />
            こんな<span className="lp-highlight">壁</span>にぶつかっていませんか
          </p>
          <p className="mb-10 text-center text-sm text-muted sm:mb-12">
            住宅・リフォーム・塗装の現場で、よく聞く3つの困りごと。
          </p>
          <div className="grid gap-4 sm:grid-cols-3 sm:gap-5">
            {PAINS.map((pain, i) => (
              <div
                key={pain.title}
                className="rounded-xl border border-card-border bg-card p-6"
              >
                <div
                  className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-full text-sm font-extrabold"
                  style={{
                    background: "rgba(249,115,22,0.12)",
                    color: "var(--lp-cta)",
                  }}
                >
                  {i + 1}
                </div>
                <p className="mb-2 text-base font-bold text-foreground">
                  {pain.title}
                </p>
                <p className="text-sm leading-relaxed text-muted">{pain.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          3. 3分デモの流れ — 使い方3ステップ
      ═══════════════════════════════════════════════ */}
      <section className="border-t border-card-border bg-white py-12 sm:py-16 md:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <p className="lp-heading mb-3 text-center">
            使い方は、たった<span className="lp-highlight">3分</span>
          </p>
          <p className="mb-10 text-center text-sm text-muted sm:mb-12">
            お客様役のAIと話すだけ。練習が終わると、その場で採点とアドバイスが届きます。
          </p>

          {/* スクショ枠 — ロープレ画面のイメージ */}
          <div className="mb-10 overflow-hidden rounded-2xl border border-card-border shadow-sm sm:mb-12">
            <Image
              src="/step-visual.png"
              alt="AIロープレの画面イメージ — お客様役AIとの会話と5カテゴリ採点"
              width={1600}
              height={900}
              sizes="(max-width: 768px) 100vw, 768px"
              className="w-full"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3 sm:gap-5">
            {DEMO_STEPS.map((s) => (
              <div
                key={s.step}
                className="rounded-xl border border-card-border bg-background p-6"
              >
                <div
                  className="mb-3 text-sm font-extrabold"
                  style={{ color: "var(--lp-cta)" }}
                >
                  STEP {s.step}
                </div>
                <p className="mb-2 text-base font-bold text-foreground">
                  {s.title}
                </p>
                <p className="text-sm leading-relaxed text-muted">{s.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center sm:mt-12">
            <CTAButton />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          4. 機能 — 5カテゴリ採点 / 22レッスン / 反論30パターン
      ═══════════════════════════════════════════════ */}
      <section className="border-t border-card-border bg-background py-12 sm:py-16 md:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <p className="lp-heading mb-3 text-center">
            成約力を鍛える、<span className="lp-highlight">3つの機能</span>
          </p>
          <p className="mb-10 text-center text-sm text-muted sm:mb-12">
            採点で弱点を見つけ、レッスンで型を学び、切り返し集で本番に備える。
          </p>
          <div className="grid gap-4 sm:grid-cols-3 sm:gap-5">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="rounded-xl border border-card-border bg-card p-6"
              >
                <div
                  className="mb-3 text-2xl font-extrabold sm:text-3xl"
                  style={{ color: "var(--lp-cta)" }}
                >
                  {f.value}
                </div>
                <p className="mb-2 text-base font-bold text-foreground">
                  {f.title}
                </p>
                <p className="text-sm leading-relaxed text-muted">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          5. 業界別 — 住宅・リフォーム・塗装を先頭に
      ═══════════════════════════════════════════════ */}
      <section className="border-t border-card-border bg-white py-12 sm:py-16 md:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <p className="lp-heading mb-3 text-center">
            あなたの業種に<span className="lp-highlight">特化</span>したシナリオ
          </p>
          <p className="mb-10 text-center text-sm text-muted sm:mb-12">
            業種ごとに、よくある反論やお客様のタイプに合わせたロープレができます。
          </p>
          <div className="grid gap-4 sm:grid-cols-3 sm:gap-5">
            {FEATURED_INDUSTRIES.map((ind) => (
              <Link
                key={ind.slug}
                href={`/industry/${ind.slug}`}
                className="group flex flex-col rounded-xl border border-card-border bg-background p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-sm"
              >
                <p className="mb-2 text-lg font-bold text-foreground transition group-hover:text-accent">
                  {ind.name}
                </p>
                <p className="mb-4 flex-1 text-sm leading-relaxed text-muted">
                  {ind.desc}
                </p>
                <span
                  className="text-sm font-semibold"
                  style={{ color: "var(--lp-cta)" }}
                >
                  シナリオを見る →
                </span>
              </Link>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link
              href="/industry"
              className="text-sm font-medium text-accent transition hover:underline"
            >
              保険・不動産・太陽光など、16業種の一覧を見る →
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          6. 料金3プラン — 本命=プロを中央・イチオシ
      ═══════════════════════════════════════════════ */}
      <section className="border-t border-card-border bg-background py-12 sm:py-16 md:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <p className="lp-heading mb-3 text-center">
            <span className="lp-highlight">料金</span>プラン
          </p>
          <p className="mb-10 text-center text-sm text-muted sm:mb-12">
            まずは無料で5回。物足りなくなったら、練習量に合わせて選べます。
          </p>
          <div className="grid gap-4 sm:grid-cols-3 sm:gap-5">
            {PRICING.map((plan) => (
              <div
                key={plan.tier}
                className="relative flex flex-col rounded-2xl border bg-card p-6"
                style={{
                  borderColor: plan.recommended
                    ? "var(--lp-cta)"
                    : "var(--card-border, rgba(0,0,0,0.1))",
                  borderWidth: plan.recommended ? "2px" : "1px",
                  boxShadow: plan.recommended
                    ? "0 8px 30px rgba(249,115,22,0.12)"
                    : "none",
                }}
              >
                {plan.recommended && (
                  <span
                    className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-xs font-bold text-white"
                    style={{ background: "var(--lp-cta)" }}
                  >
                    イチオシ
                  </span>
                )}
                <p className="mb-1 text-base font-bold text-foreground">
                  {plan.tier}
                </p>
                <p className="mb-3 text-xs text-muted">{plan.desc}</p>
                <div className="mb-1 flex items-baseline gap-1">
                  <span
                    className="text-3xl font-extrabold"
                    style={{ color: "var(--lp-cta)" }}
                  >
                    ¥{plan.price}
                  </span>
                  <span className="text-sm text-muted">/月（税込）</span>
                </div>
                <p className="mb-4 text-xs text-muted">
                  AIロープレ {plan.roleplay}
                </p>
                <ul className="mb-6 flex-1 space-y-2">
                  {plan.features.map((feat) => (
                    <li
                      key={feat}
                      className="flex items-start gap-2 text-sm text-foreground"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 14 14"
                        fill="none"
                        className="mt-0.5 shrink-0"
                        aria-hidden="true"
                      >
                        <circle
                          cx="7"
                          cy="7"
                          r="7"
                          fill="rgba(249,115,22,0.15)"
                        />
                        <path
                          d="M4 7.2L6.2 9.4L10 5"
                          stroke="#f97316"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      {feat}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/pricing"
                  className={
                    plan.recommended
                      ? "lp-cta-btn w-full text-center"
                      : "lp-cta-secondary w-full text-center"
                  }
                >
                  詳しく見る
                </Link>
              </div>
            ))}
          </div>
          <p className="mt-8 text-center text-sm text-muted">
            フリープラン（¥0・累計5回まで）はクレジットカード不要ですぐ始められます。
            <br className="hidden sm:block" />
            法人・チーム導入は
            <Link
              href="/enterprise"
              className="mx-1 font-medium text-accent transition hover:underline"
            >
              法人向けプラン
            </Link>
            をご覧ください。
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          6.5 ミニ診断1問 — エンゲージメントフック
      ═══════════════════════════════════════════════ */}
      <MiniDiagnosis />

      {/* ═══════════════════════════════════════════════
          6.6 ユーザーレビュー（0件時は自動非表示）
      ═══════════════════════════════════════════════ */}
      <UserReviews />

      {/* ═══════════════════════════════════════════════
          7. FAQ
      ═══════════════════════════════════════════════ */}
      <section className="border-t border-card-border bg-background py-12 sm:py-16 md:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <p className="lp-heading mb-10 text-center">
            よくある<span className="lp-highlight">質問</span>
          </p>
          <div className="space-y-3">
            {FAQS.map((faq) => (
              <details
                key={faq.q}
                className="group rounded-xl border border-card-border bg-card"
              >
                <summary className="flex cursor-pointer items-center justify-between px-5 py-4 text-sm font-bold text-foreground list-none [&::-webkit-details-marker]:hidden">
                  <span>{faq.q}</span>
                  <svg
                    className="h-5 w-5 shrink-0 text-muted transition-transform duration-200 group-open:rotate-180"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </summary>
                <div className="border-t border-card-border px-5 pb-5 pt-4 text-sm leading-relaxed text-muted">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          8. 最終CTA
      ═══════════════════════════════════════════════ */}
      <section className="border-t border-card-border bg-white">
        <div className="lp-section text-center">
          <p className="lp-heading mb-4">まず3分、試してみてください</p>
          <p className="mx-auto mb-6 max-w-md text-sm leading-relaxed text-muted sm:mb-8">
            自分の営業トークがどう採点されるのか、その場で確認できます。
            登録もクレジットカードも不要です。
          </p>
          <div className="mb-6 flex flex-col items-center gap-3 sm:mb-8">
            <CTAButton />
            <SecondaryCTA />
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-muted sm:gap-x-6 sm:text-sm">
            <span>3分で体験完了</span>
            <span className="hidden text-card-border sm:inline">|</span>
            <span>クレカ不要</span>
            <span className="hidden text-card-border sm:inline">|</span>
            <span>いつでも退会OK</span>
          </div>
          {/* Free-first value prop */}
          <div className="mx-auto mt-6 max-w-md rounded-lg border border-accent/30 bg-accent/5 px-4 py-3 sm:mt-8 sm:px-6 sm:py-4">
            <p className="text-sm font-bold text-foreground">
              無料プランでできること
            </p>
            <p className="mt-1 text-xs text-muted">
              AIロープレ体験・スコア診断・基本レッスン3本
            </p>
            <p className="text-xs text-muted">すべて無料、登録30秒</p>
          </div>
        </div>
      </section>

      {/* ── Inline Footer ── */}
      <footer className="border-t border-card-border bg-white px-4 py-8 text-center text-xs text-muted sm:px-6 sm:py-10">
        <nav className="mb-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 sm:gap-x-6">
          <Link href="/learn" className="transition hover:text-foreground">
            学習コース
          </Link>
          <Link href="/roleplay" className="transition hover:text-foreground">
            AIロープレ
          </Link>
          <Link href="/pricing" className="transition hover:text-foreground">
            料金プラン
          </Link>
          <Link href="/faq" className="transition hover:text-foreground">
            FAQ
          </Link>
          <Link href="/legal/terms" className="transition hover:text-foreground">
            利用規約
          </Link>
        </nav>
        <p>&copy; {new Date().getFullYear()} 成約コーチAI</p>
      </footer>

      <HomepageCTATracker />
      <SalesTriviaPopup />
      <ReferralTracker />
    </div>
  );
}
