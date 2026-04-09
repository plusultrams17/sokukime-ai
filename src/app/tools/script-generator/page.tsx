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

      <section className="relative overflow-hidden bg-gradient-to-b from-[#0f1729] to-[#1a2744] px-4 pt-24 pb-16 sm:px-6 sm:pt-32 sm:pb-20">
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

      <section className="px-4 py-10 sm:px-6 sm:py-14">
        <div className="mx-auto max-w-4xl">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="flex items-center gap-4 rounded-2xl border border-card-border bg-white p-5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent/10">
                <svg className="h-6 w-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>
              </div>
              <div>
                <p className="text-lg font-bold text-foreground">成約率UP</p>
                <p className="text-xs text-muted">「型」があるだけで結果が変わる</p>
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-2xl border border-card-border bg-white p-5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent/10">
                <svg className="h-6 w-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
              </div>
              <div>
                <p className="text-lg font-bold text-foreground">約1分で完成</p>
                <p className="text-xs text-muted">3つ選ぶだけで台本が完成</p>
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-2xl border border-card-border bg-white p-5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent/10">
                <svg className="h-6 w-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
              </div>
              <div>
                <p className="text-lg font-bold text-foreground">全5ステップ対応</p>
                <p className="text-xs text-muted">アプローチ〜反論処理まで網羅</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6 sm:pb-24">
        <div className="mx-auto max-w-4xl">
          <ScriptGeneratorClient />
        </div>
      </section>

      {/* 5-Step Explanation (collapsed) */}
      <section className="px-4 pb-16 sm:px-6 sm:pb-24">
        <div className="mx-auto max-w-3xl">
          <details className="group rounded-2xl border border-card-border bg-white shadow-sm">
            <summary className="flex cursor-pointer items-center justify-between px-6 py-5 text-base font-bold text-foreground [&::-webkit-details-marker]:hidden list-none sm:text-lg">
              <span>トークスクリプトの5ステップ構成とは？</span>
              <svg className="h-5 w-5 shrink-0 text-muted transition-transform duration-200 group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
            </summary>
            <div className="space-y-3 border-t border-card-border px-6 pb-6 pt-4">
              {[
                { num: "1", name: "アプローチ", desc: "信頼を構築し、商談の土台を作る。自己紹介・訪問目的・アイスブレイク。", color: "#0F6E56" },
                { num: "2", name: "ヒアリング", desc: "質問でニーズを引き出し、課題を明確にする。現状・課題・理想を深掘り。", color: "#185FA5" },
                { num: "3", name: "プレゼン", desc: "課題に対する解決策をベネフィット中心で提案。特徴ではなく価値を伝える。", color: "#534AB7" },
                { num: "4", name: "クロージング", desc: "テストクロージングで温度感を確認し、決断を後押し。", color: "#993C1D" },
                { num: "5", name: "反論処理", desc: "想定される反論への切り返しを事前に準備。共感→確認→提案の流れ。", color: "#A32D2D" },
              ].map((s) => (
                <div key={s.num} className="flex gap-4 rounded-xl bg-background p-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white" style={{ backgroundColor: s.color }}>{s.num}</span>
                  <div><p className="text-sm font-bold text-foreground">{s.name}</p><p className="mt-0.5 text-sm text-muted">{s.desc}</p></div>
                </div>
              ))}
            </div>
          </details>
        </div>
      </section>

      {/* Related */}
      <section className="px-4 pb-16 sm:px-6 sm:pb-24">
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
