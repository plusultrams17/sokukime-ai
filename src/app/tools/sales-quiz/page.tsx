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

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://seiyaku-coach.vercel.app";

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

      {/* Value Props */}
      <section className="px-6 py-10 sm:py-14">
        <div className="mx-auto max-w-3xl">
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-2xl border border-card-border bg-white p-4 text-center">
              <p className="text-lg font-bold text-accent">10問</p>
              <p className="text-xs text-muted">約3分で完了</p>
            </div>
            <div className="rounded-2xl border border-card-border bg-white p-4 text-center">
              <p className="text-lg font-bold text-accent">5項目</p>
              <p className="text-xs text-muted">営業スキルを採点</p>
            </div>
            <div className="rounded-2xl border border-card-border bg-white p-4 text-center">
              <p className="text-lg font-bold text-accent">S〜D</p>
              <p className="text-xs text-muted">ランクで弱点判明</p>
            </div>
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
