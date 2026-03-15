import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { StickyCTA } from "@/components/sticky-cta";
import { JsonLd } from "@/components/json-ld";
import { industries } from "@/data/industries";

export const metadata: Metadata = {
  title: "業種別AI営業ロープレ練習",
  description:
    "16業種に特化したAI営業ロープレ。保険・不動産・リフォーム・外壁塗装・太陽光・自動車・人材紹介・IT/SaaS・広告・医療機器・印刷・ブライダル。業種固有の反論パターンとシナリオで実践練習。",
  alternates: { canonical: "/industry" },
};

const SITE_URL =
  process.env.NEXT_PUBLIC_APP_URL || "https://sokukime-ai.vercel.app";

export default function IndustryIndexPage() {
  const jsonLdData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name: "業種別AI営業ロープレ練習",
        description:
          "16業種に特化したAI営業ロープレ。業種固有の反論パターンとシナリオで実践練習。",
        url: `${SITE_URL}/industry`,
        isPartOf: { "@id": `${SITE_URL}/#website` },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "ホーム", item: SITE_URL },
          {
            "@type": "ListItem",
            position: 2,
            name: "業種別",
            item: `${SITE_URL}/industry`,
          },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      <JsonLd data={jsonLdData} />
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0f1729] to-[#1a2744] px-6 pt-24 pb-16 sm:pt-32 sm:pb-20">
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/20" />
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <nav className="mb-6 text-sm text-white/60">
            <Link href="/" className="transition hover:text-white">
              ホーム
            </Link>
            <span className="mx-2">/</span>
            <span className="text-white/80">業種別</span>
          </nav>
          <h1 className="mb-4 text-3xl font-bold text-white sm:text-4xl lg:text-5xl" style={{ textShadow: "0 2px 12px rgba(0,0,0,0.5)" }}>
            あなたの業種に特化した
            <span className="text-accent">営業ロープレ</span>
          </h1>
          <p className="mx-auto max-w-2xl text-base text-white/85 leading-relaxed sm:text-lg" style={{ textShadow: "0 1px 6px rgba(0,0,0,0.4)" }}>
            16業種それぞれに最適化された反論パターン・商談シナリオ・クロージングテクニックで、
            実践的な営業スキルを身につけましょう。
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-4 text-center text-2xl font-bold text-foreground sm:text-3xl">
            業種を選んで練習を始める
          </h2>
          <p className="mb-12 text-center text-sm text-muted sm:text-base">
            あなたの業界に特化したロープレシナリオ・反論パターン・商談テクニックを確認できます
          </p>

          <div className="flex flex-wrap justify-center gap-6">
            {industries.map((industry) => (
              <Link
                key={industry.slug}
                href={`/industry/${industry.slug}`}
                className="ind-card"
              >
                {/* Corner rectangles */}
                <div className="ind-rect lt" />
                <div className="ind-rect rt" />
                <div className="ind-rect lb" />
                <div className="ind-rect rb" />

                {/* Image */}
                <div className="ind-image">
                  <Image
                    src={`/images/industries/${industry.slug}.png`}
                    alt={`${industry.name}営業イメージ`}
                    fill
                    className="object-cover rounded-[0.25rem]"
                    sizes="(max-width: 640px) 50vw, 14rem"
                  />
                </div>

                {/* Title */}
                <div className="ind-title">{industry.name}</div>

                {/* Love / description */}
                <div className="ind-love">
                  <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" className="ind-love-svg">
                    <path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z" />
                  </svg>
                  <span>{industry.description}</span>
                </div>

                {/* Category / keywords */}
                <div className="ind-category">
                  {industry.keywords.slice(0, 3).map((keyword) => (
                    <span key={keyword} className="ind-btn">
                      {keyword}
                    </span>
                  ))}
                </div>

                {/* Action */}
                <div className="ind-action">練習を始める</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SEO Text */}
      <section className="px-6 pb-16 sm:pb-24">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-6 text-2xl font-bold text-foreground sm:text-3xl text-center">
            業種別AI営業ロープレとは
          </h2>
          <div className="space-y-4 text-sm text-muted leading-relaxed sm:text-base">
            <p>
              営業の現場では、業種ごとに商談の流れやお客様の反応が大きく異なります。
              不動産営業では高額商材ならではの慎重な判断への対応が、保険営業ではニーズ喚起のスキルが、
              SaaS営業ではデモからの有料化トークが求められます。
            </p>
            <p>
              成約コーチ AIの業種別ロープレでは、各業界でよくある反論パターンや商談シナリオをAIが再現。
              業界特有のクロージングテクニックを何度でも練習できます。
              まずは
              <Link href="/tools/sales-quiz" className="text-accent hover:underline">
                営業力診断テスト
              </Link>
              で現在のスキルを把握してから、
              <Link href="/roleplay" className="text-accent hover:underline">
                AIロープレ
              </Link>
              で実践練習を始めましょう。
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-16 sm:pb-24">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-2xl font-bold text-foreground sm:text-3xl">
            あなたの業種で、今すぐ練習を始めよう
          </h2>
          <p className="mb-10 text-sm text-muted sm:text-base">
            業種・商材を入力するだけで、AIがリアルなお客さん役を演じます。
          </p>
          <Link href="/roleplay" className="morph-btn">
            <span className="btn-fill" />
            <span className="shadow" />
            <span className="btn-text">
              {"無料でAIロープレを始める".split("").map((char, i) => (
                <span key={i} style={{ "--i": i } as React.CSSProperties}>{char}</span>
              ))}
            </span>
            <span className="orbit-dots"><span /><span /><span /><span /></span>
            <span className="corners"><span /><span /><span /><span /></span>
          </Link>
          <p className="mt-4 text-sm text-muted">
            &#10003; 無料で体験&ensp;&#10003; 登録不要&ensp;&#10003; 16業種対応
          </p>
        </div>
      </section>

      <Footer />
      <StickyCTA />
    </div>
  );
}
