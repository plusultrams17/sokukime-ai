import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { StickyCTA } from "@/components/sticky-cta";
import { JsonLd } from "@/components/json-ld";
import { SalesQuizClient } from "./quiz-client";

export const metadata: Metadata = {
  title: "営業力診断テスト｜無料であなたの営業スキルを採点",
  description: "10問の質問であなたの営業力を5項目で診断。アプローチ・ヒアリング・プレゼン・クロージング・反論処理のスキルを無料チェック。登録不要。",
  alternates: { canonical: "/tools/sales-quiz" },
};

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://sokukime-ai.vercel.app";

export default function SalesQuizPage() {
  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "営業力診断テスト",
    description: "10問の質問で営業力を5項目で診断する無料ツール",
    url: `${SITE_URL}/tools/sales-quiz`,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "JPY" },
  };

  return (
    <div className="min-h-screen bg-background">
      <JsonLd data={jsonLdData} />
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0f1729] to-[#1a2744] px-6 pt-24 pb-16 sm:pt-32 sm:pb-20">
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm"><Image src="/images/misc/tool-sales-quiz.png" alt="" width={24} height={24} className="rounded" /> 約3分・登録不要</div>
          <h1 className="mb-4 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            あなたの<span className="text-accent">営業力</span>を診断
          </h1>
          <p className="mx-auto max-w-2xl text-base text-white/70 leading-relaxed sm:text-lg">
            10問の質問に答えるだけで、アプローチ・ヒアリング・プレゼン・クロージング・反論処理の5項目であなたの営業スキルを採点します。
          </p>
        </div>
      </section>

      {/* SEO Content */}
      <section className="px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-6 text-2xl font-bold text-foreground sm:text-3xl">なぜ営業力の「見える化」が重要なのか</h2>
          <div className="space-y-4 text-sm text-muted leading-relaxed sm:text-base">
            <p>多くの営業パーソンは、自分の強みと弱みを正確に把握できていません。「なんとなく商談がうまくいかない」と感じていても、具体的にどのスキルが不足しているかがわからないため、効果的な改善ができないのです。</p>
            <p>この営業力診断テストは、成約5ステップメソッド（アプローチ・ヒアリング・プレゼン・クロージング・反論処理）に基づいて、あなたの営業スキルを客観的に評価します。各項目のスコアを可視化することで、優先的に強化すべきポイントが明確になります。</p>
            <p>診断結果で弱点が見つかったら、<Link href="/roleplay" className="text-accent hover:underline">AIロープレ</Link>でその分野を集中練習するのが効果的です。また、<Link href="/tools/script-generator" className="text-accent hover:underline">トークスクリプト生成</Link>で営業の型を作り、<Link href="/tools/objection-handbook" className="text-accent hover:underline">反論切り返しトーク集</Link>で対処法を学ぶことで、総合的なスキルアップが可能です。</p>
          </div>
        </div>
      </section>

      {/* Quiz */}
      <section className="px-6 pb-16 sm:pb-24">
        <div className="mx-auto max-w-3xl">
          <SalesQuizClient />
        </div>
      </section>

      {/* Related Tools */}
      <section className="px-6 pb-16 sm:pb-24">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-6 text-xl font-bold text-foreground">関連ツール</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Link href="/tools/script-generator" className="rounded-xl border border-card-border bg-white p-4 text-center transition hover:-translate-y-0.5 hover:shadow-sm">
              <div className="flex justify-center mb-1"><Image src="/images/misc/tool-script-generator.png" alt="" width={20} height={20} className="inline-block rounded" /></div>
              <div className="text-sm font-medium text-foreground">トークスクリプト生成</div>
            </Link>
            <Link href="/tools/objection-handbook" className="rounded-xl border border-card-border bg-white p-4 text-center transition hover:-translate-y-0.5 hover:shadow-sm">
              <div className="flex justify-center mb-1"><Image src="/images/misc/tool-objection-handbook.png" alt="" width={20} height={20} className="inline-block rounded" /></div>
              <div className="text-sm font-medium text-foreground">反論切り返しトーク集</div>
            </Link>
            <Link href="/tools/closing-calculator" className="rounded-xl border border-card-border bg-white p-4 text-center transition hover:-translate-y-0.5 hover:shadow-sm">
              <div className="flex justify-center mb-1"><Image src="/images/misc/tool-closing-calculator.png" alt="" width={20} height={20} className="inline-block rounded" /></div>
              <div className="text-sm font-medium text-foreground">クロージング率計算</div>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
      <StickyCTA />
    </div>
  );
}
