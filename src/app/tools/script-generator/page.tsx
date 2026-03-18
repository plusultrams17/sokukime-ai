import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { StickyCTA } from "@/components/sticky-cta";
import { JsonLd } from "@/components/json-ld";
import { ScriptGeneratorClient } from "./generator-client";

export const metadata: Metadata = {
  title: "営業トークスクリプト自動生成｜業種別テンプレート無料作成",
  description: "業種と商材を選ぶだけで、アプローチからクロージングまでの営業トークスクリプトを自動生成。5ステップメソッドに基づくテンプレートを無料で作成。",
  alternates: { canonical: "/tools/script-generator" },
};

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://seiyaku-coach.vercel.app";

export default function ScriptGeneratorPage() {
  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "営業トークスクリプト生成ツール",
    description: "業種と商材を選ぶだけで営業トークスクリプトを自動生成する無料ツール",
    url: `${SITE_URL}/tools/script-generator`,
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
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm"><Image src="/images/misc/tool-script-generator.png" alt="" width={24} height={24} className="rounded" /> 約1分・登録不要</div>
          <h1 className="mb-4 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            <span className="text-accent">トークスクリプト</span>を自動生成
          </h1>
          <p className="mx-auto max-w-2xl text-base text-white/70 leading-relaxed sm:text-lg">
            業種と商材を選ぶだけで、5ステップメソッドに基づいた営業トークスクリプトを自動生成。アプローチからクロージングまでの「型」が手に入ります。
          </p>
        </div>
      </section>

      <section className="px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-6 text-2xl font-bold text-foreground sm:text-3xl">営業トークスクリプトが成約率を上げる理由</h2>
          <div className="space-y-4 text-sm text-muted leading-relaxed sm:text-base">
            <p>トップ営業マンとそうでない営業マンの最大の違いは「商談の型」を持っているかどうかです。トークスクリプト（営業台本）は、成功パターンを再現可能な形に落とし込んだものです。</p>
            <p>スクリプトがあることで、商談の流れを事前にイメージでき、各フェーズで何を話すべきかが明確になります。特にアプローチの最初の30秒、ヒアリングでの深掘り質問、クロージングの決め台詞は、事前に準備しているかどうかで結果が大きく変わります。</p>
            <p>生成したスクリプトは<Link href="/roleplay" className="text-accent hover:underline">AIロープレ</Link>で実践練習するのがおすすめです。台本を覚えるだけでなく、AIのリアルな反応に対応することで「生きたトーク力」が身につきます。</p>
          </div>
        </div>
      </section>

      <section className="px-6 pb-16 sm:pb-24">
        <div className="mx-auto max-w-4xl">
          <ScriptGeneratorClient />
        </div>
      </section>

      {/* 5-Step Explanation */}
      <section className="px-6 pb-16 sm:pb-24">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-6 text-xl font-bold text-foreground text-center">トークスクリプトの5ステップ構成</h2>
          <div className="space-y-4">
            {[
              { step: "Step 1", name: "アプローチ", desc: "信頼を構築し、商談の土台を作る。自己紹介・訪問目的・アイスブレイク。", color: "#0F6E56" },
              { step: "Step 2", name: "ヒアリング", desc: "質問でニーズを引き出し、課題を明確にする。現状・課題・理想を深掘り。", color: "#185FA5" },
              { step: "Step 3", name: "プレゼン", desc: "課題に対する解決策をベネフィット中心で提案。特徴ではなく価値を伝える。", color: "#534AB7" },
              { step: "Step 4", name: "クロージング", desc: "テストクロージングで温度感を確認し、決断を後押し。", color: "#993C1D" },
              { step: "Step 5", name: "反論処理", desc: "想定される反論への切り返しを事前に準備。共感→確認→提案の流れ。", color: "#A32D2D" },
            ].map((s) => (
              <div key={s.step} className="flex gap-4 rounded-xl bg-white border border-card-border p-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white" style={{ backgroundColor: s.color }}>{s.step.replace("Step ", "")}</span>
                <div><p className="font-bold text-foreground text-sm">{s.name}</p><p className="text-sm text-muted mt-1">{s.desc}</p></div>
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
            <Link href="/tools/sales-quiz" className="rounded-xl border border-card-border bg-white p-4 text-center transition hover:-translate-y-0.5 hover:shadow-sm">
              <div className="flex justify-center mb-1"><Image src="/images/misc/tool-sales-quiz.png" alt="" width={20} height={20} className="inline-block rounded" /></div>
              <div className="text-sm font-medium text-foreground">営業力診断テスト</div>
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
