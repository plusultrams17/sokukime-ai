"use client";

import { useState } from "react";
import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { Footer } from "@/components/footer";

const features = [
  { name: "AIロープレ", free: "1日1回", pro: "無制限" },
  { name: "即決営業スコア採点", free: "✓", pro: "✓" },
  { name: "リアルタイムコーチ", free: "✓", pro: "✓" },
  { name: "5ステップ分析", free: "✓", pro: "✓" },
  { name: "営業シーン選択", free: "✓", pro: "✓" },
  { name: "難易度選択", free: "✓", pro: "✓" },
];

const comparisons = [
  { name: "営業研修（集合型）", cost: "¥50,000〜", frequency: "月1回", icon: "🏢" },
  { name: "営業コンサルティング", cost: "¥100,000〜", frequency: "月1回", icon: "👔" },
  { name: "先輩にロープレ依頼", cost: "時給換算 ¥3,000〜", frequency: "週1回（相手の都合次第）", icon: "👥" },
  { name: "即キメAI Pro", cost: "¥2,980", frequency: "毎日・無制限・24時間", icon: "🔥", highlight: true },
];

const testimonials = [
  {
    name: "T.S.",
    role: "不動産営業 / 入社2年目",
    text: "毎日練習できるから、1ヶ月でクロージングに自信がついた。月の契約数が1.5倍に。",
    score: "78",
  },
  {
    name: "M.K.",
    role: "保険営業 / マネージャー",
    text: "チーム全員の営業力を底上げできた。研修予算の削減にもつながっている。",
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
      "クレジットカード（Visa, Mastercard, JCB, AMEX）でお支払いいただけます。Stripeによる安全な決済システムを使用しています。",
  },
  {
    question: "無料プランに制限はありますか？",
    answer:
      "無料プランは1日1回のロープレ制限があります。スコア採点やコーチ機能は制限なくご利用いただけます。",
  },
  {
    question: "無料プランからProへの切り替えはすぐにできますか？",
    answer:
      "はい。ワンクリックでアップグレードでき、すぐにProプランの全機能をご利用いただけます。",
  },
  {
    question: "Proプランで何が変わりますか？",
    answer:
      "ロープレ回数が無制限になります。1日に何度でも繰り返し練習でき、短期間でスキルアップを実感できます。",
  },
  {
    question: "領収書・請求書は発行できますか？",
    answer:
      "はい。Stripeの決済管理画面から領収書をダウンロードいただけます。法人利用の場合は経費精算にもご利用いただけます。",
  },
];

export default function PricingPage() {
  const [isLoading, setIsLoading] = useState(false);

  async function handleUpgrade() {
    setIsLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", { method: "POST" });
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

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <div className="min-h-screen bg-background">
      <JsonLd data={faqJsonLd} />

      {/* Header */}
      <header className="border-b border-card-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🔥</span>
            <span className="text-lg font-bold">即キメAI</span>
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
        <div className="mb-16 text-center">
          <h1 className="mb-4 text-4xl font-bold">料金プラン</h1>
          <p className="text-lg text-muted">
            無料で始めて、もっと練習したくなったらProへ
          </p>
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
                      f.free === "1日1回" ? "text-muted" : "text-foreground"
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
                <span className="text-4xl font-bold">¥2,980</span>
                <span className="text-muted">/月</span>
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
              {isLoading ? "処理中..." : "Proプランに申し込む"}
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
          <p className="mb-2 text-muted">
            営業研修1回の費用で、1ヶ月間無制限にロープレできます
          </p>
          <p className="mb-4 text-sm font-semibold text-accent">
            🔥 500+ 人の営業マンが利用中
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
    </div>
  );
}
