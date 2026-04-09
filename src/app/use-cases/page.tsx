import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { JsonLd } from "@/components/json-ld";

export const metadata: Metadata = {
  title: "活用シーン",
  description:
    "成約コーチAIの活用シーン。新人研修、チームのスキル底上げ、個人事業主の営業練習、テレアポ練習など、様々な場面で活用できます。",
  alternates: { canonical: "/use-cases" },
};

const useCases = [
  {
    icon: "",
    image: "/images/pages/usecase-newbie.png",
    title: "新人営業マンの研修",
    problem:
      "従来のロープレは先輩の時間を奪い、新人は遠慮して十分な練習ができない。研修後も自主練の環境がない。",
    solution:
      "AIが相手役になるので、先輩に遠慮せず何度でも練習可能。成約5ステップメソッドが自然に身につくまで反復できます。",
    example: {
      scene: "入社3ヶ月目の保険営業マン",
      product: "生命保険の新規契約",
      result:
        "毎日のAIロープレで、アプローチの「ゴール共有トーク」が自然にできるように。自信を持って商談に臨めるようになった。",
    },
    stats: "独り立ちまでの期間を大幅に短縮",
  },
  {
    icon: "",
    image: "/images/pages/usecase-team.png",
    title: "営業チームのスキル底上げ",
    problem:
      "チーム内で営業手法がバラバラ。エースの技術が属人化し、チーム全体の底上げが進まない。",
    solution:
      "成約メソッドという共通の「型」でチーム全員を評価。スコアで弱点を可視化し、ピンポイントで改善できます。",
    example: {
      scene: "不動産営業チーム（5名）",
      product: "マンション販売",
      result:
        "チーム全員がスコア70以上を目標に練習。クロージング力が統一され、チーム全体の営業力が底上げされた。",
    },
    stats: "チーム全体の営業力を底上げ",
  },
  {
    icon: "",
    image: "/images/pages/usecase-freelance.png",
    title: "個人事業主・フリーランス",
    problem:
      "一人で営業するため、ロープレ相手がいない。提案・クロージングに不安を抱えたまま商談に臨んでいる。",
    solution:
      "24時間いつでもAIと練習。商談前のウォームアップや、失注後の振り返り練習に最適です。",
    example: {
      scene: "Webデザイナー（フリーランス）",
      product: "Webサイト制作の提案",
      result:
        "商談前にAIロープレでプレゼンのリハーサル。自信を持って提案できるようになり、受注率が向上。",
    },
    stats: "商談への自信度が大幅アップ",
  },
  {
    icon: "",
    image: "/images/pages/usecase-teleapo.png",
    title: "テレアポ・電話営業の練習",
    problem:
      "電話営業はスピードが命。瞬時の切り返しが求められるが、練習する場がない。",
    solution:
      "電話営業モードでAIと練習。短いやりとりの中でアプローチ→ヒアリング→アポイント獲得の流れを訓練します。",
    example: {
      scene: "SaaS企業のインサイドセールス",
      product: "クラウド勤怠管理システム",
      result:
        "断り文句への切り返しパターンが増え、アポイント獲得率が目に見えて改善。",
    },
    stats: "アポ獲得率の大幅アップを目指せる",
  },
];

export default function UseCasesPage() {
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://seiyaku-coach.vercel.app";

  return (
    <div className="min-h-screen bg-background">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebPage",
              "@id": `${siteUrl}/use-cases#webpage`,
              name: "活用シーン | 成約コーチAI",
              description:
                "成約コーチAIは、新人営業研修、チームの営業力底上げ、個人事業主の自主トレ、テレアポ練習など幅広い営業シーンで活用できるAIロープレツールです。",
              url: `${siteUrl}/use-cases`,
              isPartOf: { "@id": `${siteUrl}/#website` },
              inLanguage: "ja",
            },
            {
              "@type": "BreadcrumbList",
              "@id": `${siteUrl}/use-cases#breadcrumb`,
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "ホーム", item: siteUrl },
                { "@type": "ListItem", position: 2, name: "活用シーン", item: `${siteUrl}/use-cases` },
              ],
            },
          ],
        }}
      />
      <Header />

      <section className="px-6 pt-32 pb-16">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-4 text-4xl font-bold">活用シーン</h1>
          <p className="text-lg text-muted">
            あらゆる営業シーンで成約コーチAIを活用できます
          </p>
          <p className="mx-auto mt-6 max-w-3xl text-sm text-muted leading-relaxed text-left">
            成約コーチAIは、新人営業マンの研修（<strong className="text-foreground">独り立ちまでの期間を短縮</strong>）、営業チームのスキル底上げ（<strong className="text-foreground">共通の型でチーム力向上</strong>）、個人事業主・フリーランスの自主トレ、テレアポ・電話営業の練習（<strong className="text-foreground">切り返し力を強化</strong>）など、幅広い営業シーンで活用できます。6業種（不動産・保険・SaaS・人材・教育・物販）に対応。
          </p>
        </div>
      </section>

      <section className="px-6 pb-20">
        <div className="mx-auto max-w-4xl space-y-12">
          {useCases.map((uc) => (
            <div
              key={uc.title}
              className="rounded-2xl border border-card-border bg-card overflow-hidden"
            >
              {/* Header */}
              <div className="border-b border-card-border bg-card p-6">
                <div className="flex items-center gap-3">
                  {uc.image ? <Image src={uc.image} alt={uc.title} width={56} height={56} className="rounded-xl flex-shrink-0" /> : <span className="text-3xl">{uc.icon}</span>}
                  <div>
                    <h2 className="text-xl font-bold">{uc.title}</h2>
                    <p className="mt-1 text-sm text-accent font-medium">
                      {uc.stats}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Problem / Solution */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4">
                    <div className="mb-2 text-xs font-semibold text-red-400">
                      課題
                    </div>
                    <p className="text-sm text-muted leading-relaxed">
                      {uc.problem}
                    </p>
                  </div>
                  <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-4">
                    <div className="mb-2 text-xs font-semibold text-green-400">
                      解決策
                    </div>
                    <p className="text-sm text-muted leading-relaxed">
                      {uc.solution}
                    </p>
                  </div>
                </div>

                {/* Example */}
                <div className="rounded-xl border border-accent/20 bg-accent/5 p-4">
                  <div className="mb-3 text-xs font-semibold text-accent">
                    想定される活用シーン
                  </div>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-muted">シーン:</span>{" "}
                      {uc.example.scene}
                    </div>
                    <div>
                      <span className="text-muted">商材:</span>{" "}
                      {uc.example.product}
                    </div>
                    <div>
                      <span className="text-muted">期待できる効果:</span>{" "}
                      {uc.example.result}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Industry Links */}
      <section className="border-t border-card-border px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-8 text-center text-2xl font-bold">
            業種別の営業ロープレ
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
            {[
              { name: "不動産営業", href: "/industry/real-estate" },
              { name: "保険営業", href: "/industry/insurance" },
              { name: "SaaS営業", href: "/industry/saas" },
              { name: "人材営業", href: "/industry/hr" },
              { name: "教育・スクール営業", href: "/industry/education" },
              { name: "物販営業", href: "/industry/retail" },
            ].map((industry) => (
              <Link
                key={industry.href}
                href={industry.href}
                className="rounded-xl border border-card-border bg-card p-4 text-center text-sm font-medium transition hover:border-accent/50 hover:text-accent"
              >
                {industry.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-card-border px-6 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-2xl font-bold">
            あなたの営業シーンに合わせてAIが対応
          </h2>
          <p className="mb-8 text-sm text-muted">
            業種・商材・お客さんのタイプを自由に設定できます。
            無料で1日1回試せます。
          </p>
          <Link
            href="/roleplay"
            className="inline-flex h-14 items-center justify-center rounded-xl bg-accent px-10 text-lg font-bold text-white transition hover:bg-accent-hover"
          >
            無料で始める
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
