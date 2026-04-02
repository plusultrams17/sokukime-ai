import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { JsonLd } from "@/components/json-ld";
import { StickyCTA } from "@/components/sticky-cta";
import { IndustryHeroBg } from "@/components/industry-hero-bg";
import {
  getIndustryBySlug,
  getAllIndustrySlugs,
  getOtherIndustries,
} from "@/data/industries";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllIndustrySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const industry = getIndustryBySlug(slug);
  if (!industry) return { title: "業種が見つかりません" };

  return {
    title: industry.metaTitle,
    description: industry.metaDescription,
    alternates: { canonical: `/industry/${industry.slug}` },
    keywords: industry.keywords,
    openGraph: {
      type: "article",
      title: `${industry.metaTitle} | 成約コーチ AI`,
      description: industry.metaDescription,
      locale: "ja_JP",
    },
  };
}

const DIFFICULTY_COLORS: Record<string, string> = {
  "初級": "#0F6E56",
  "中級": "#2563EB",
  "上級": "#7C3AED",
};

function IndustryCTA({ text }: { text: string }) {
  return (
    <Link href="/roleplay" className="morph-btn">
      <span className="btn-fill" />
      <span className="shadow" />
      <span className="btn-text">
        {text.split("").map((char, i) => (
          <span key={i} style={{ "--i": i } as React.CSSProperties}>{char}</span>
        ))}
      </span>
      <span className="orbit-dots"><span /><span /><span /><span /></span>
      <span className="corners"><span /><span /><span /><span /></span>
    </Link>
  );
}

export default async function IndustryPage({ params }: Props) {
  const { slug } = await params;
  const industry = getIndustryBySlug(slug);
  if (!industry) notFound();

  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://seiyaku-coach.com";
  const otherIndustries = getOtherIndustries(slug);

  const jsonLdData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "FAQPage",
        "@id": `${siteUrl}/industry/${slug}#faq`,
        mainEntity: industry.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "ホーム", item: siteUrl },
          { "@type": "ListItem", position: 2, name: "業種別", item: `${siteUrl}/industry` },
          { "@type": "ListItem", position: 3, name: industry.name, item: `${siteUrl}/industry/${slug}` },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      <JsonLd data={jsonLdData} />
      <Header />

      {/* 1. Hero */}
      <section className="relative overflow-hidden px-6 pt-20 pb-16 sm:pt-28 sm:pb-20" style={{ backgroundColor: "#0a0f1a" }}>
        <IndustryHeroBg slug={slug} />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 z-[1] bg-gradient-to-b from-black/40 via-black/20 to-black/50" />
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <nav className="mb-6 text-sm text-white/60">
            <Link href="/" className="transition hover:text-white">ホーム</Link>
            <span className="mx-2">/</span>
            <Link href="/industry" className="transition hover:text-white">業種別</Link>
            <span className="mx-2">/</span>
            <span className="text-white/80">{industry.name}</span>
          </nav>

          <h1 className="mb-4 text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl" style={{ textShadow: "0 2px 12px rgba(0,0,0,0.5)" }}>
            {industry.heroTitle}
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-base text-white/85 leading-relaxed sm:text-lg" style={{ textShadow: "0 1px 6px rgba(0,0,0,0.4)" }}>
            {industry.heroSubtitle}
          </p>

          <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
            {[
              { label: "平均商談サイクル", value: industry.stats.avgDealCycle },
              { label: "よくある課題", value: industry.stats.commonPainPoint },
              { label: "改善ポテンシャル", value: industry.stats.improvementPotential },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl bg-black/30 p-5 backdrop-blur-sm border border-white/10">
                <div className="text-xs font-medium text-white/70 mb-1">{s.label}</div>
                <div className="text-xl font-bold text-accent sm:text-2xl" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.3)" }}>{s.value}</div>
              </div>
            ))}
          </div>

          <div className="flex flex-col items-center gap-4">
            <IndustryCTA text={industry.ctaText} />
            <p className="text-sm text-white/60">
              &#10003; 無料で体験&ensp;&#10003; 登録不要&ensp;&#10003; {industry.name}特化シナリオ
            </p>
          </div>
        </div>
      </section>

      {/* 2. Challenges */}
      <section className="px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-4 text-center text-2xl font-bold text-foreground sm:text-3xl">
            {industry.name}営業のよくある課題
          </h2>
          <p className="mb-12 text-center text-sm text-muted sm:text-base">
            これらの課題をAIロープレで克服しましょう
          </p>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {industry.challenges.map((c) => (
              <div key={c.title} className="rounded-2xl bg-white shadow-sm border border-card-border overflow-hidden">
                {c.image ? (
                  <div className="relative w-full aspect-square bg-gray-50">
                    <Image
                      src={c.image}
                      alt={c.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, 33vw"
                    />
                  </div>
                ) : (
                  <div className="px-6 pt-6 text-3xl">{c.icon}</div>
                )}
                <div className="p-6">
                  <h3 className="mb-2 text-base font-bold text-foreground">{c.title}</h3>
                  <p className="text-sm text-muted leading-relaxed">{c.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Objection Patterns */}
      <section className="px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-4 text-center text-2xl font-bold text-foreground sm:text-3xl">
            {industry.name}でよくある反論パターンと切り返し
          </h2>
          <p className="mb-12 text-center text-sm text-muted sm:text-base">
            実際の商談で頻出する反論への対処法をマスターしましょう
          </p>
          <div className="space-y-4">
            {industry.objectionPatterns.map((p, i) => (
              <details key={i} className="group rounded-2xl bg-white shadow-sm border border-card-border">
                <summary className="flex cursor-pointer items-center justify-between px-6 py-5 [&::-webkit-details-marker]:hidden list-none">
                  <div className="flex items-center gap-3 flex-1">
                    <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-100 text-sm font-bold text-red-600">{i + 1}</span>
                    <div>
                      <p className="text-sm font-bold text-foreground">&ldquo;{p.objection}&rdquo;</p>
                      <p className="mt-0.5 text-xs text-muted">{p.context}</p>
                    </div>
                  </div>
                  <svg className="h-5 w-5 shrink-0 text-muted transition-transform duration-200 group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                </summary>
                <div className="border-t border-card-border px-6 pb-6 pt-4">
                  <div className="mb-3 inline-flex rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
                    テクニック: {p.technique}
                  </div>
                  <div className="space-y-3">
                    {p.responses.map((r, ri) => (
                      <div key={ri} className="flex gap-3 rounded-xl bg-green-50 border border-green-200/50 p-4">
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-600 text-[10px] font-bold text-white">{ri + 1}</span>
                        <p className="text-sm text-foreground leading-relaxed">{r}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Roleplay Scenarios */}
      <section className="px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-4 text-center text-2xl font-bold text-foreground sm:text-3xl">
            {industry.name}向けロープレシナリオ
          </h2>
          <p className="mb-12 text-center text-sm text-muted sm:text-base">
            難易度別のシナリオでステップアップ
          </p>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {industry.roleplayScenarios.map((s, i) => {
              const color = DIFFICULTY_COLORS[s.difficulty] || "#0F6E56";
              return (
                <div key={i} className="rounded-2xl bg-white shadow-sm border border-card-border p-6 flex flex-col">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="rounded-full px-3 py-1 text-xs font-bold text-white" style={{ backgroundColor: color }}>{s.difficulty}</span>
                    <span className="text-xs text-muted">シナリオ {i + 1}</span>
                  </div>
                  <h3 className="mb-2 text-base font-bold text-foreground">{s.title}</h3>
                  <div className="mb-3 flex items-center gap-2 text-xs text-muted">
                    <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    <span>{s.customerType}</span>
                  </div>
                  <p className="text-sm text-muted leading-relaxed mb-4">{s.situation}</p>
                  <div className="mt-auto pt-3 border-t border-card-border">
                    <p className="mb-2 text-xs font-semibold text-foreground">重点ポイント</p>
                    <div className="flex flex-wrap gap-1.5">
                      {s.focusPoints.map((fp) => (
                        <span key={fp} className="rounded-full px-2.5 py-0.5 text-xs font-medium" style={{ backgroundColor: `${color}15`, color }}>{fp}</span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-12 text-center">
            <p className="mb-4 text-sm text-muted">これらのシナリオをAI相手に実践してみましょう</p>
            <Link href="/roleplay" className="inline-flex h-12 items-center justify-center rounded-xl bg-accent px-8 text-base font-bold text-white transition hover:bg-accent-hover">
              {industry.name}のロープレを始める
            </Link>
          </div>
        </div>
      </section>

      {/* 5. SEO Rich Text */}
      <section className="px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-6 text-2xl font-bold text-foreground sm:text-3xl text-center">
            {industry.name}営業にAIロープレが効果的な理由
          </h2>
          <div className="speech-bubble space-y-4 text-sm text-muted leading-relaxed sm:text-base">
            <p>
              {industry.name}業界の営業では、{industry.longDescription}
              こうした業界特有の課題に対応するためには、十分な練習量と的確なフィードバックが必要です。
              しかし、従来のロープレ研修では練習相手の確保が難しく、フィードバックも属人的になりがちでした。
            </p>
            <p>
              成約コーチ AIの
              <Link href="/roleplay" className="text-accent hover:underline">AIロープレ機能</Link>
              なら、{industry.name}業界でよくある{industry.stats.commonPainPoint}
              といった課題に特化したシナリオを24時間いつでも練習可能。
              AIがリアルなお客さん役を演じ、営業心理学に基づく5ステップメソッドで自動採点します。
            </p>
            <p>
              まずは
              <Link href="/tools/sales-quiz" className="text-accent hover:underline">営業力診断テスト</Link>
              であなたのスキルレベルを確認し、
              <Link href="/tools/script-generator" className="text-accent hover:underline">トークスクリプト生成</Link>
              で{industry.name}向けの営業台本を作成すれば、効率的なスキルアップが可能です。
            </p>
          </div>
        </div>
      </section>

      {/* 6. FAQ */}
      <section className="px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-4 text-center text-2xl font-bold text-foreground sm:text-3xl">
            {industry.name}営業ロープレに関するよくある質問
          </h2>
          <p className="mb-12 text-center text-sm text-muted sm:text-base">
            {industry.name}業界でのAIロープレ活用についてお答えします
          </p>
          <div className="space-y-3">
            {industry.faqs.map((faq) => (
              <details key={faq.question} className="group rounded-2xl bg-white shadow-sm">
                <summary className="flex cursor-pointer items-center justify-between px-6 py-5 text-sm font-semibold text-foreground [&::-webkit-details-marker]:hidden list-none">
                  <span>{faq.question}</span>
                  <svg className="h-5 w-5 shrink-0 text-muted transition-transform duration-200 group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                </summary>
                <div className="border-t border-card-border px-6 pb-5 pt-4 text-sm leading-relaxed text-muted">{faq.answer}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Other Industries */}
      <section className="px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-4 text-center text-2xl font-bold text-foreground sm:text-3xl">他の業種のロープレも見る</h2>
          <p className="mb-12 text-center text-sm text-muted sm:text-base">16業種に対応した専用シナリオを用意しています</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {otherIndustries.map((o) => (
              <Link key={o.slug} href={`/industry/${o.slug}`} className="group rounded-xl bg-white border border-card-border p-4 text-center transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm hover:border-accent/30">
                <p className="text-sm font-bold text-foreground transition group-hover:text-accent">{o.name}</p>
                <p className="mt-1 text-xs text-muted line-clamp-1">{o.description}</p>
              </Link>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Link href="/industry" className="text-sm font-medium text-accent transition hover:underline">業種一覧に戻る</Link>
          </div>
        </div>
      </section>

      {/* 8. Final CTA */}
      <section className="px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-2xl font-bold text-foreground sm:text-3xl">
            {industry.name}の営業力を、AIで鍛えよう
          </h2>
          <p className="mb-4 text-sm text-muted sm:text-base">
            {industry.name}に特化した反論処理・クロージングをAIと練習。無料で今すぐ始められます。
          </p>
          <p className="mb-10 text-sm text-muted">
            &#10003; 無料で体験 &#10003; 登録不要 &#10003; いつでも解約OK
          </p>
          <div className="flex flex-col items-center gap-4">
            <IndustryCTA text={industry.ctaText} />
          </div>
          <div className="mt-6">
            <Link href="/pricing" className="text-sm text-muted transition hover:text-accent hover:underline">料金プランを見る →</Link>
          </div>
        </div>
      </section>

      <Footer />
      <StickyCTA />
    </div>
  );
}
