import type { Metadata } from "next";
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

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://sokukime-ai.vercel.app";

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
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm">🧮 登録不要・無料</div>
          <h1 className="mb-4 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            <span className="text-accent">成約率</span>を計算して改善点を発見
          </h1>
          <p className="mx-auto max-w-2xl text-base text-white/70 leading-relaxed sm:text-lg">
            商談数・提案数・成約数を入力するだけで、あなたの営業ファネルを可視化。業種別ベンチマークと比較して改善ポイントを特定します。
          </p>
        </div>
      </section>

      <section className="px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-6 text-2xl font-bold text-foreground sm:text-3xl">成約率を正しく把握することの重要性</h2>
          <div className="space-y-4 text-sm text-muted leading-relaxed sm:text-base">
            <p>営業の世界では「KPIを測定していない=改善ができない」と言われます。成約率（クロージング率）は営業パフォーマンスの最も基本的な指標であり、この数字を正確に把握することが改善の第一歩です。</p>
            <p>成約率はアポイントから提案への移行率と、提案から成約への移行率に分解できます。どちらのステップで落ちているかを特定することで、ヒアリング力の強化が必要なのか、クロージング力の強化が必要なのかが明確になります。</p>
            <p>数値で課題が見えたら、<Link href="/roleplay" className="text-accent hover:underline">AIロープレ</Link>で弱点を集中練習しましょう。<Link href="/tools/sales-quiz" className="text-accent hover:underline">営業力診断テスト</Link>と合わせて使うと、定量面・定性面の両方からスキルを把握できます。</p>
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

      {/* Tips */}
      <section className="px-6 pb-16 sm:pb-24">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-6 text-xl font-bold text-foreground text-center">成約率を上げる5つの方法</h2>
          <div className="space-y-4">
            {tips.map((tip, i) => (
              <div key={i} className="flex gap-4 rounded-xl bg-white border border-card-border p-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/10 text-sm font-bold text-accent">{i + 1}</span>
                <div><p className="font-bold text-foreground text-sm">{tip.title}</p><p className="text-sm text-muted mt-1">{tip.desc}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related */}
      <section className="px-6 pb-16 sm:pb-24">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-6 text-xl font-bold text-foreground">関連ツール</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              { href: "/tools/sales-quiz", name: "営業力診断テスト", icon: "📊" },
              { href: "/tools/script-generator", name: "トークスクリプト生成", icon: "📝" },
              { href: "/tools/objection-handbook", name: "反論切り返しトーク集", icon: "🛡️" },
            ].map((t) => (
              <Link key={t.href} href={t.href} className="rounded-xl border border-card-border bg-white p-4 text-center transition hover:-translate-y-0.5 hover:shadow-sm">
                <div className="text-2xl mb-1">{t.icon}</div>
                <div className="text-sm font-medium text-foreground">{t.name}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
      <StickyCTA />
    </div>
  );
}
