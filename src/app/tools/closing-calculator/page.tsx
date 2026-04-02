import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { StickyCTA } from "@/components/sticky-cta";
import { JsonLd } from "@/components/json-ld";
import { ClosingCalculatorClient } from "./calculator-client";

export const metadata: Metadata = {
  title: "クロージング率・成約率計算ツール｜営業KPI無料計算",
  description: "商談数・提案数・成約数を入力するだけで成約率を自動計算。業種別ベンチマークと比較してあなたの営業力を可視化。登録不要・無料。",
  alternates: { canonical: "/tools/closing-calculator" },
};

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://seiyaku-coach.com";

const benchmarks = [
  { industry: "保険", rate: 25 },
  { industry: "不動産", rate: 20 },
  { industry: "リフォーム", rate: 30 },
  { industry: "IT/SaaS", rate: 22 },
  { industry: "人材紹介", rate: 18 },
  { industry: "自動車", rate: 35 },
  { industry: "広告", rate: 20 },
  { industry: "ブライダル", rate: 40 },
];

const tips = [
  { title: "ヒアリングの質を上げる", desc: "お客様の課題を深掘りすることで、提案の的確さが上がり、成約率が向上します。" },
  { title: "テストクロージングを入れる", desc: "プレゼン中に小さな「Yes」を積み重ねることで、最終クロージングの成功率が上がります。" },
  { title: "反論処理のパターンを増やす", desc: "よくある反論への切り返しを事前に準備しておくことで、商談の主導権を握れます。" },
  { title: "フォローアップの仕組み化", desc: "提案後のフォローを3日・7日・14日の3段階で行うことで、検討中の顧客を取りこぼしません。" },
  { title: "ロープレで実践練習", desc: "AIロープレで弱点を繰り返し練習することで、本番での対応力が格段に上がります。" },
];

export default function ClosingCalculatorPage() {
  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "クロージング率計算ツール",
    description: "営業KPIを入力して成約率を計算する無料ツール",
    url: `${SITE_URL}/tools/closing-calculator`,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "JPY" },
  };

  return (
    <div className="min-h-screen bg-background">
      <JsonLd data={jsonLdData} />
      <Header />

      <section className="relative overflow-hidden bg-gradient-to-b from-[#0f1729] to-[#1a2744] px-6 pt-24 pb-16 sm:pt-32 sm:pb-20">
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm"><Image src="/images/misc/tool-closing-calculator.png" alt="" width={24} height={24} className="rounded" /> 登録不要・無料</div>
          <h1 className="mb-4 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            <span className="text-accent">成約率</span>を計算して改善点を発見
          </h1>
          <p className="mx-auto max-w-2xl text-base text-white/70 leading-relaxed sm:text-lg">
            商談数・提案数・成約数を入力するだけで、あなたの営業ファネルを可視化。業種別ベンチマークと比較して改善ポイントを特定します。
          </p>
        </div>
      </section>

      {/* Value Props */}
      <section className="px-6 py-10 sm:py-14">
        <div className="mx-auto max-w-3xl">
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-2xl border border-card-border bg-white p-4 text-center">
              <p className="text-lg font-bold text-accent">3つ入力</p>
              <p className="text-xs text-muted">アポ・提案・成約数</p>
            </div>
            <div className="rounded-2xl border border-card-border bg-white p-4 text-center">
              <p className="text-lg font-bold text-accent">ファネル可視化</p>
              <p className="text-xs text-muted">どこで落ちてるか一目</p>
            </div>
            <div className="rounded-2xl border border-card-border bg-white p-4 text-center">
              <p className="text-lg font-bold text-accent">業種別比較</p>
              <p className="text-xs text-muted">ベンチマークと対比</p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 pb-16 sm:pb-24">
        <div className="mx-auto max-w-3xl">
          <ClosingCalculatorClient />
        </div>
      </section>

      {/* Benchmarks */}
      <section className="px-6 pb-16 sm:pb-24">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-6 text-xl font-bold text-foreground text-center">業種別 成約率ベンチマーク</h2>
          <div className="rounded-2xl bg-white border border-card-border shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-card-border bg-gray-50"><th className="px-6 py-3 text-left font-semibold text-foreground">業種</th><th className="px-6 py-3 text-right font-semibold text-foreground">平均成約率</th></tr></thead>
              <tbody>
                {benchmarks.map((b) => (
                  <tr key={b.industry} className="border-b border-card-border last:border-0">
                    <td className="px-6 py-3 text-foreground">{b.industry}</td>
                    <td className="px-6 py-3 text-right"><span className="inline-flex items-center gap-2"><span className="h-2 rounded-full bg-accent" style={{ width: `${b.rate * 2}px` }} /><span className="font-medium">{b.rate}%</span></span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Tips (collapsible) */}
      <section className="px-6 pb-16 sm:pb-24">
        <div className="mx-auto max-w-3xl">
          <details className="group rounded-2xl border border-card-border bg-white shadow-sm">
            <summary className="flex cursor-pointer items-center justify-between px-6 py-5 text-base font-bold text-foreground [&::-webkit-details-marker]:hidden list-none sm:text-lg">
              <span>成約率を上げる5つの方法</span>
              <svg className="h-5 w-5 shrink-0 text-muted transition-transform duration-200 group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
            </summary>
            <div className="space-y-3 border-t border-card-border px-6 pb-6 pt-4">
              {tips.map((tip, i) => (
                <div key={i} className="flex gap-4 rounded-xl bg-background p-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/10 text-sm font-bold text-accent">{i + 1}</span>
                  <div><p className="text-sm font-bold text-foreground">{tip.title}</p><p className="mt-0.5 text-sm text-muted">{tip.desc}</p></div>
                </div>
              ))}
            </div>
          </details>
        </div>
      </section>

      {/* Related */}
      <section className="px-6 pb-16 sm:pb-24">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-6 text-xl font-bold text-foreground">関連ツール</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Link href="/tools/sales-quiz" className="rounded-xl border border-card-border bg-white p-4 text-center transition hover:-translate-y-0.5 hover:shadow-sm">
              <div className="flex justify-center mb-1"><Image src="/images/misc/tool-sales-quiz.png" alt="" width={20} height={20} className="inline-block rounded" /></div>
              <div className="text-sm font-medium text-foreground">営業力診断テスト</div>
            </Link>
            <Link href="/tools/script-generator" className="rounded-xl border border-card-border bg-white p-4 text-center transition hover:-translate-y-0.5 hover:shadow-sm">
              <div className="flex justify-center mb-1"><Image src="/images/misc/tool-script-generator.png" alt="" width={20} height={20} className="inline-block rounded" /></div>
              <div className="text-sm font-medium text-foreground">トークスクリプト生成</div>
            </Link>
            <Link href="/tools/objection-handbook" className="rounded-xl border border-card-border bg-white p-4 text-center transition hover:-translate-y-0.5 hover:shadow-sm">
              <div className="flex justify-center mb-1"><Image src="/images/misc/tool-objection-handbook.png" alt="" width={20} height={20} className="inline-block rounded" /></div>
              <div className="text-sm font-medium text-foreground">反論切り返しトーク集</div>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
      <StickyCTA />
    </div>
  );
}
