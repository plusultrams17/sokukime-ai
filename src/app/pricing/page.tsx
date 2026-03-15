"use client";

import { useState } from "react";
import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { Footer } from "@/components/footer";
import { trackCTAClick, trackCheckoutStarted } from "@/lib/tracking";
import { PricingExitPopup } from "@/components/exit-popups/pricing-exit-popup";
import { ScrollSlideIn } from "@/components/scroll-slide-in";

const features = [
  { name: "AIロープレ", free: "1日1回", pro: "無制限" },
  { name: "詳細スコア", free: "1カテゴリ", pro: "全5カテゴリ" },
  { name: "AI改善アドバイス", free: "−", pro: "✓" },
  { name: "リアルタイムコーチ", free: "✓", pro: "✓" },
  { name: "営業シーン選択", free: "✓", pro: "✓" },
  { name: "難易度選択", free: "✓", pro: "✓" },
];

const comparisons = [
  { name: "営業研修（集合型）", cost: "¥50,000〜", frequency: "月1回", icon: "🏢" },
  { name: "営業コンサルティング", cost: "¥100,000〜", frequency: "月1回", icon: "👔" },
  { name: "先輩にロープレ依頼", cost: "時給換算 ¥3,000〜", frequency: "週1回（相手の都合次第）", icon: "👥" },
  { name: "成約コーチ AI Pro", cost: "¥2,980", frequency: "毎日・無制限・24時間", icon: "🔥", highlight: true },
];

const testimonials = [
  {
    name: "T.S.",
    role: "不動産営業 / 入社2年目",
    text: "毎日練習できるから、クロージングに自信がついた。",
    score: "78",
  },
  {
    name: "M.K.",
    role: "保険営業 / マネージャー",
    text: "チームの営業力を底上げする練習ツールとして活用しています。",
    score: "85",
  },
];

const faqItems = [
  {
    question: "いつでも解約できますか？",
    answer:
      "はい、いつでも解約できます。解約後も現在の請求期間の終了までProプランをご利用いただけます。",
  },
  {
    question: "支払い方法は？",
    answer:
      "クレジットカード（Visa, Mastercard, JCB, American Express）でお支払いいただけます。Stripeによる安全な決済システムを使用しています。",
  },
  {
    question: "無料プランに制限はありますか？",
    answer:
      "無料プランは1日1回のロープレ制限があり、スコアは1カテゴリのみ詳細表示されます。Proプランでは全5カテゴリの詳細スコアとAI改善アドバイスが表示されます。",
  },
  {
    question: "無料プランからProへの切り替えはすぐにできますか？",
    answer:
      "はい。ワンクリックでアップグレードでき、すぐにProプランの全機能をご利用いただけます。",
  },
  {
    question: "Proプランで何が変わりますか？",
    answer:
      "ロープレ回数が無制限になり、全5カテゴリの詳細スコアとAI改善アドバイスが表示されます。1日に何度でも繰り返し練習でき、短期間でスキルアップを実感できます。",
  },
  {
    question: "年額プランはありますか？",
    answer:
      "はい。年額プラン（¥29,800/年）をご用意しています。月額換算で約¥2,483となり、2ヶ月分おトクです。",
  },
  {
    question: "領収書・請求書は発行できますか？",
    answer:
      "はい。Stripeの決済管理画面から領収書をダウンロードいただけます。法人利用の場合は経費精算にもご利用いただけます。",
  },
  {
    question: "返金はできますか？",
    answer:
      "デジタルコンテンツの性質上、サービス提供開始後の返金は行っておりません。解約後は請求期間の終了まで利用可能です。",
  },
  {
    question: "複数のデバイスで使えますか？",
    answer:
      "はい。同一アカウントでPC・スマートフォン・タブレットからご利用いただけます。",
  },
];

export default function PricingPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [billing, setBilling] = useState<"monthly" | "annual">("annual");

  const monthlyPrice = 2980;
  const annualPrice = 29800;
  const annualMonthly = Math.round(annualPrice / 12);
  const savingsMonths = 2;

  async function handleUpgrade() {
    setIsLoading(true);
    trackCTAClick("pricing_pro", "pricing_page", "/api/stripe/checkout");
    trackCheckoutStarted();
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ billing }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else if (data.error === "Unauthorized") {
        window.location.href = "/signup";
      }
    } catch {
      // ignore
    }
    setIsLoading(false);
  }

  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://sokukime-ai.vercel.app";

  const pricingJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        "@id": `${siteUrl}/pricing#product`,
        name: "成約コーチ AI Proプラン",
        description:
          "AIロープレ無制限・全5カテゴリ詳細スコア・AI改善アドバイス・リアルタイムコーチング付きの営業トレーニングプラン",
        brand: {
          "@type": "Organization",
          name: "成約コーチ AI",
        },
        offers: [
          {
            "@type": "Offer",
            name: "無料プラン",
            price: "0",
            priceCurrency: "JPY",
            description: "AIロープレ1日1回・成約スコア1カテゴリ",
            availability: "https://schema.org/InStock",
            url: `${siteUrl}/pricing`,
          },
          {
            "@type": "Offer",
            name: "Proプラン（月額）",
            price: "2980",
            priceCurrency: "JPY",
            description: "AIロープレ無制限・全5カテゴリ詳細スコア・AI改善アドバイス",
            availability: "https://schema.org/InStock",
            url: `${siteUrl}/pricing`,
            priceValidUntil: "2026-12-31",
          },
          {
            "@type": "Offer",
            name: "Proプラン（年額）",
            price: "29800",
            priceCurrency: "JPY",
            description: "AIロープレ無制限・全5カテゴリ詳細スコア・AI改善アドバイス（2ヶ月分おトク）",
            availability: "https://schema.org/InStock",
            url: `${siteUrl}/pricing`,
            priceValidUntil: "2026-12-31",
          },
        ],
      },
      {
        "@type": "FAQPage",
        "@id": `${siteUrl}/pricing#faq`,
        mainEntity: faqItems.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${siteUrl}/pricing#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "ホーム",
            item: siteUrl,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "料金プラン",
            item: `${siteUrl}/pricing`,
          },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      <JsonLd data={pricingJsonLd} />

      {/* Header */}
      <header className="border-b border-card-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🔥</span>
            <span className="text-lg font-bold">成約コーチ AI</span>
          </Link>
          <Link
            href="/roleplay"
            className="rounded-lg bg-accent px-5 py-2 text-sm font-semibold text-white transition hover:bg-accent-hover"
          >
            ロープレを始める
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-6 py-20">
        {/* Pricing Section Title */}
        <div className="mb-10 text-center">
          <h1 className="mb-4 text-4xl font-bold">料金プラン</h1>
          <p className="text-lg text-muted">
            無料で始めて、もっと練習したくなったらProへ
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="mb-10 flex items-center justify-center gap-3">
          <button
            onClick={() => setBilling("monthly")}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              billing === "monthly"
                ? "bg-card text-foreground shadow-sm border border-card-border"
                : "text-muted hover:text-foreground"
            }`}
          >
            月額
          </button>
          <button
            onClick={() => setBilling("annual")}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
              billing === "annual"
                ? "bg-card text-foreground shadow-sm border border-card-border"
                : "text-muted hover:text-foreground"
            }`}
          >
            年額
            <span className="rounded-full bg-green-500/10 px-2 py-0.5 text-[11px] font-bold text-green-500">
              {savingsMonths}ヶ月分おトク
            </span>
          </button>
        </div>

        {/* Pricing Cards */}
        <div className="grid gap-8 md:grid-cols-2">
          {/* Free Plan */}
          <div className="rounded-2xl border border-card-border bg-card p-8">
            <div className="mb-6">
              <h3 className="text-xl font-bold">無料プラン</h3>
              <div className="mt-4">
                <span className="text-4xl font-bold">¥0</span>
                <span className="text-muted">/月</span>
              </div>
              <p className="mt-2 text-sm text-muted">
                まずは試してみたい方に
              </p>
            </div>

            <Link
              href="/roleplay"
              className="flex h-12 w-full items-center justify-center rounded-xl border border-card-border text-base font-bold text-muted transition hover:border-accent hover:text-foreground"
            >
              無料で始める
            </Link>

            <div className="mt-8 space-y-4">
              {features.map((f) => (
                <div
                  key={f.name}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-muted">{f.name}</span>
                  <span
                    className={
                      f.free === "−" || f.free === "1日1回" || f.free === "1カテゴリ"
                        ? "text-muted"
                        : "text-foreground"
                    }
                  >
                    {f.free}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Pro Plan */}
          <div className="relative rounded-2xl border-2 border-accent bg-card p-8">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-4 py-1 text-xs font-bold text-white">
              おすすめ
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-bold text-accent">Proプラン</h3>
              <div className="mt-4">
                {billing === "annual" ? (
                  <>
                    <span className="text-4xl font-bold">¥{annualMonthly.toLocaleString()}</span>
                    <span className="text-muted">/月</span>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-sm text-muted line-through">¥{monthlyPrice.toLocaleString()}/月</span>
                      <span className="text-xs text-muted">
                        年額 ¥{annualPrice.toLocaleString()}
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <span className="text-4xl font-bold">¥{monthlyPrice.toLocaleString()}</span>
                    <span className="text-muted">/月</span>
                  </>
                )}
              </div>
              <p className="mt-2 text-sm text-muted">
                本気で営業力を鍛えたい方に
              </p>
            </div>

            <button
              onClick={handleUpgrade}
              disabled={isLoading}
              className="flex h-12 w-full items-center justify-center rounded-xl bg-accent text-base font-bold text-white transition hover:bg-accent-hover disabled:opacity-60"
            >
              {isLoading ? "処理中..." : billing === "annual" ? "年額プランに申し込む" : "Proプランに申し込む"}
            </button>
            <p className="mt-3 text-center text-[11px] text-muted">
              いつでも解約OK・即日反映・違約金なし
            </p>

            <div className="mt-8 space-y-4">
              {features.map((f) => (
                <div
                  key={f.name}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-foreground">{f.name}</span>
                  <span className="font-medium text-accent">{f.pro}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Guarantee Badge */}
        <div className="mt-6 flex items-center justify-center gap-2 text-sm text-muted">
          <span>🛡️</span>
          <span>
            いつでも解約OK・Stripe安全決済・クレジットカード各社対応
          </span>
        </div>

        {/* ROI Comparison Section */}
        <div className="mt-20">
          <h2 className="mb-8 text-center text-2xl font-bold">
            コスパで比較
          </h2>
          <div className="space-y-3">
            {comparisons.map((item) => (
              <div
                key={item.name}
                className={`flex items-center gap-4 rounded-xl border p-5 ${
                  item.highlight
                    ? "border-accent bg-accent/5"
                    : "border-card-border bg-card"
                }`}
              >
                <span className="text-2xl">{item.icon}</span>
                <div className="flex-1">
                  <p
                    className={`font-bold ${
                      item.highlight ? "text-accent" : "text-foreground"
                    }`}
                  >
                    {item.name}
                  </p>
                  <p className="text-sm text-muted">{item.frequency}</p>
                </div>
                <span
                  className={`text-lg font-bold ${
                    item.highlight ? "text-accent" : "text-foreground"
                  }`}
                >
                  {item.cost}
                </span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-center text-xs text-muted">
            ※一般的な市場価格の参考値です。実際の価格はサービス提供者により異なります。
          </p>
        </div>

        {/* Testimonials Section */}
        <div className="mt-20">
          <h2 className="mb-8 text-center text-2xl font-bold">
            利用者の声
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="rounded-2xl border border-card-border bg-card p-6"
              >
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <p className="font-bold">{t.name}</p>
                    <p className="text-sm text-muted">{t.role}</p>
                  </div>
                  <div className="flex flex-col items-center rounded-lg bg-accent/10 px-3 py-1.5">
                    <span className="text-xs text-muted">スコア</span>
                    <span className="text-lg font-bold text-accent">
                      {t.score}
                    </span>
                  </div>
                </div>
                <p className="text-sm leading-relaxed text-muted">
                  &ldquo;{t.text}&rdquo;
                </p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-center text-xs text-muted">
            ※個人の感想であり、効果を保証するものではありません
          </p>
        </div>

        {/* FAQ */}
        <div className="mt-20">
          <h2 className="mb-8 text-center text-2xl font-bold">
            よくある質問
          </h2>
          <div className="space-y-4">
            {faqItems.map((item) => (
              <div
                key={item.question}
                className="rounded-xl border border-card-border bg-card p-6"
              >
                <h3 className="mb-2 font-bold">{item.question}</h3>
                <p className="text-sm text-muted">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 text-center">
          <p className="mb-4 text-muted">
            営業研修1回の費用で、1ヶ月間無制限にロープレできます
          </p>
          <Link
            href="/roleplay"
            className="text-sm text-accent hover:underline"
          >
            まずは無料で試してみる →
          </Link>
        </div>
      </div>

      {/* Footer */}
      <Footer />
      <PricingExitPopup />
      <ScrollSlideIn sessionKey="pricing-slide-in" scrollThreshold={0.4}>
        <p className="mb-2 text-sm font-bold text-foreground">
          まずは無料で体験
        </p>
        <p className="mb-3 text-xs text-muted">
          リスクゼロで営業力を鍛えよう
        </p>
        <Link
          href="/roleplay"
          className="inline-flex h-9 items-center justify-center rounded-lg bg-accent px-4 text-xs font-bold text-white transition hover:bg-accent-hover"
        >
          無料で始める
        </Link>
      </ScrollSlideIn>
    </div>
  );
}
