"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { Footer } from "@/components/footer";
import { trackCTAClick, trackCheckoutStarted, trackPricingPageView, trackCheckoutStart } from "@/lib/tracking";
import { PricingExitPopup } from "@/components/exit-popups/pricing-exit-popup";
import { UserReviews } from "@/components/user-reviews";
import { ScrollSlideIn } from "@/components/scroll-slide-in";
import { getActivePromotion } from "@/lib/promotions";

const features = [
  { name: "学習コース（22レッスン）", free: "全レッスン", pro: "全レッスン" },
  { name: "業種別トークスクリプト", free: "一部閲覧", pro: "全業種対応" },
  { name: "切り返し話法テンプレート", free: "基本パターン", pro: "30パターン" },
  { name: "AIロープレ", free: "1日1回", pro: "無制限" },
  { name: "詳細スコア", free: "1カテゴリ", pro: "全5カテゴリ" },
  { name: "AI改善アドバイス", free: "−", pro: "✓" },
  { name: "リアルタイムコーチ", free: "✓", pro: "✓" },
];

const comparisons = [
  { name: "法人向けAIロープレ", cost: "¥100,000〜", frequency: "法人契約のみ・見積もり必要", icon: "🤖", image: "/images/misc/comparison-training.png" },
  { name: "営業研修（集合型）", cost: "¥50,000〜", frequency: "月1回", icon: "🏢", image: "/images/misc/comparison-training.png" },
  { name: "営業コンサルティング", cost: "¥100,000〜", frequency: "月1回", icon: "👔", image: "/images/misc/comparison-consulting.png" },
  { name: "先輩にロープレ依頼", cost: "時給換算 ¥3,000〜", frequency: "週1回（相手の都合次第）", icon: "👥", image: "/images/misc/comparison-senpai.png" },
  { name: "成約コーチ AI Pro", cost: "¥2,980", frequency: "22レッスン+全業種コンテンツ+無制限AI練習・24時間・個人で即開始", icon: "🔥", image: "/images/misc/comparison-ai-pro.png", highlight: true },
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
      "クレジットカード（Visa, Mastercard, JCB, American Express）およびコンビニ決済（セブン-イレブン、ローソン、ファミリーマート等）に対応しています。Stripeによる安全な決済システムを使用しています。",
  },
  {
    question: "無料プランに制限はありますか？",
    answer:
      "無料プランでも22レッスンの学習コースは全て受講できます。業種別コンテンツは一部制限があり、AIロープレは1日1回までです。Proプランでは全業種コンテンツと無制限AIロープレが使えます。",
  },
  {
    question: "無料プランからProへの切り替えはすぐにできますか？",
    answer:
      "はい。ワンクリックでアップグレードでき、すぐにProプランの全機能をご利用いただけます。",
  },
  {
    question: "Proプランで何が変わりますか？",
    answer:
      "全8業種のトークスクリプト・切り返し話法テンプレート（30パターン）が使い放題になり、AIロープレも無制限。全5カテゴリの詳細スコアとAI改善アドバイスで、短期間でスキルアップを実感できます。",
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
    question: "7日間の無料トライアルとは？",
    answer:
      "Proプランに申し込むと、最初の7日間は無料で全機能をお試しいただけます。トライアル期間中にいつでもキャンセル可能で、キャンセルすれば一切課金されません。",
  },
  {
    question: "返金はできますか？",
    answer:
      "はい。14日間スコア改善保証があります。Proプランに登録後14日間毎日ロープレを続けてもスコアが改善しない場合、全額返金いたします（14日間で7回以上のロープレ実施が条件）。また、7日間の無料トライアル中はいつでもキャンセル可能で、一切課金されません。",
  },
  {
    question: "複数のデバイスで使えますか？",
    answer:
      "はい。同一アカウントでPC・スマートフォン・タブレットからご利用いただけます。",
  },
  {
    question: "法人チームプランとは？",
    answer:
      "月額¥20,000（税抜）で5名までのチームメンバーが全員Proプランと同等の機能を利用できます。チーム管理ダッシュボードからメンバーの招待・管理が可能です。カード決済のほか、請求書払いにも対応しています。",
  },
];

export default function PricingPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [billing, setBilling] = useState<"monthly" | "annual">("monthly");
  const [promoCode, setPromoCode] = useState("");
  const [promoOpen, setPromoOpen] = useState(false);
  const [activePromo] = useState(() => getActivePromotion());

  const [trialDays, setTrialDays] = useState<number | null>(null);

  useEffect(() => {
    trackPricingPageView({});
    // Check trial status for countdown display
    fetch("/api/dashboard")
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (data?.trialDaysRemaining) setTrialDays(data.trialDaysRemaining);
      })
      .catch(() => {});
  }, []);

  const monthlyPrice = 2980;
  const annualPrice = 29800;
  const annualMonthly = Math.round(annualPrice / 12);
  const savingsMonths = 2;
  // Tax-inclusive prices (Japan law requires 総額表示 since 2021-04-01)
  const monthlyTaxInc = Math.round(monthlyPrice * 1.1);
  const annualTaxInc = Math.round(annualPrice * 1.1);
  const annualMonthlyTaxInc = Math.round(annualTaxInc / 12);

  async function handleUpgrade() {
    setIsLoading(true);
    trackCTAClick("pricing_pro", "pricing_page", "/api/stripe/checkout");
    trackCheckoutStarted();
    trackCheckoutStart({ billing });
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ billing, ...(promoCode ? { promoCode } : {}) }),
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

  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://seiyaku-coach.com";

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
        offers: {
          "@type": "AggregateOffer",
          lowPrice: "0",
          highPrice: "29800",
          priceCurrency: "JPY",
          offerCount: 3,
          offers: [
            {
              "@type": "Offer",
              name: "無料プラン",
              price: "0",
              priceCurrency: "JPY",
              description: "22レッスン学習コース・業種別トークスクリプト・AIロープレ1日1回・成約スコア1カテゴリ",
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
          <Link href="/" className="flex items-center gap-3">
            <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="header-logo">
              <path d="M8 38c2-1 5-2 9-2s7 1 9 3" stroke="var(--accent)" strokeWidth="3.5" strokeLinecap="round" />
              <path d="M17 36c2-1.5 4-2 6-1.5 2.5 0.8 4 2.5 5 4.5 0.8 1.5 0.5 3-0.5 4s-2.5 1.5-4 1" stroke="var(--accent)" strokeWidth="3.5" strokeLinecap="round" />
              <path d="M56 38c-2-1-5-2-9-2s-7 1-9 3" stroke="var(--accent)" strokeWidth="3.5" strokeLinecap="round" />
              <path d="M47 36c-2-1.5-4-2-6-1.5-2.5 0.8-4 2.5-5 4.5-0.8 1.5-0.5 3 0.5 4s2.5 1.5 4 1" stroke="var(--accent)" strokeWidth="3.5" strokeLinecap="round" />
              <path d="M27 39c1.5-2 3.5-3 5-3s3.5 1 5 3c1 1.5 1 3 0 4s-2.5 1.5-5 1.5-4-0.5-5-1.5-1-2.5 0-4z" stroke="var(--accent)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M25.5 38.5c1-1 2-1.2 3-0.8 1.2 0.4 1.8 1.5 1.5 2.8" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M38.5 38.5c-1-1-2-1.2-3-0.8-1.2 0.4-1.8 1.5-1.5 2.8" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="32" cy="24" r="2" fill="var(--accent)" opacity="0.7" />
              <circle cx="24" cy="27" r="1.3" fill="var(--accent)" opacity="0.6" />
              <circle cx="40" cy="27" r="1.3" fill="var(--accent)" opacity="0.6" />
              <path d="M32 28v-5" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
              <path d="M27 30l-2-3" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
              <path d="M37 30l2-3" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
            </svg>
            <span className="header-wave-text" aria-label="成約コーチ AI">
              <span className="header-wave-text__outline">成約コーチ AI</span>
              <span className="header-wave-text__fill">成約コーチ AI</span>
            </span>
          </Link>
          <Link
            href="/learn"
            className="rounded-lg bg-accent px-5 py-2 text-sm font-semibold text-white transition hover:bg-accent-hover"
          >
            無料で学ぶ
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-6 py-20">
        {/* Trial Countdown Banner — 競合失敗分析: urgency drives 15-25% more conversions */}
        {trialDays !== null && trialDays > 0 && (
          <div className="mb-8 rounded-xl border-2 border-accent/40 bg-accent/5 px-5 py-4 text-center animate-fade-in-up">
            <div className="flex items-center justify-center gap-3">
              <span className="text-2xl">⏰</span>
              <div>
                <div className="text-sm font-bold text-accent">
                  無料トライアル残り{trialDays}日
                </div>
                <div className="text-xs text-muted">
                  {trialDays <= 2 ? "間もなく終了します。今すぐProプランに登録して全機能を維持しましょう" : "トライアル中に全機能を試して、効果を実感してください"}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Pricing Section Title */}
        <div className="mb-10 text-center">
          <h1 className="mb-4 text-4xl font-bold">料金プラン</h1>
          <p className="text-lg text-muted">
            営業の「型」を学んで、AIで実践。もっと上を目指すならProへ
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-muted leading-relaxed">
            成約コーチ AIは22レッスンの学習コースと業種別コンテンツを無料で提供。Proプラン（月額¥2,980）なら全業種のトークスクリプト・切り返し話法テンプレート・無制限AIロープレ練習が使い放題。いつでも解約可能です。
          </p>
        </div>

        {/* Objection Handling */}
        <div className="mb-12 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-card-border bg-card p-5 text-center">
            <div className="mb-2 text-2xl">🤔</div>
            <p className="mb-1 text-sm font-bold">効果があるか不安？</p>
            <p className="text-xs text-muted leading-relaxed">
              営業心理学に基づく22レッスンで体系的に学習。業種別トークスクリプトですぐ現場で使えます。まず無料レッスンを1つ試してみてください。
            </p>
          </div>
          <div className="rounded-xl border border-card-border bg-card p-5 text-center">
            <div className="mb-2 text-2xl">⏰</div>
            <p className="mb-1 text-sm font-bold">時間がない？</p>
            <p className="text-xs text-muted leading-relaxed">
              1回のロープレはたった3〜5分。通勤中・昼休み・寝る前の隙間時間でOK。チーム研修のように日程調整する必要もありません。
            </p>
          </div>
          <div className="rounded-xl border border-card-border bg-card p-5 text-center">
            <div className="mb-2 text-2xl">💰</div>
            <p className="mb-1 text-sm font-bold">本当にいつでも辞められる？</p>
            <p className="text-xs text-muted leading-relaxed">
              7日間の無料トライアル中はいつでもキャンセル可能。課金後も1クリックで即解約、違約金・手数料は一切ありません。
            </p>
          </div>
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

        {/* Score Improvement Guarantee — Hero級配置: Pricing Card直上で返金保証を強調 */}
        <div
          style={{
            maxWidth: "800px",
            margin: "0 auto 2rem",
            padding: "1.5rem 2rem",
            background: "linear-gradient(135deg, #fff8f3, #fef2f2)",
            borderRadius: "1rem",
            border: "2px solid #f97316",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>🛡️</div>
          <h3
            style={{
              fontSize: "1.25rem",
              fontWeight: 800,
              color: "#ea580c",
              marginBottom: "0.5rem",
            }}
          >
            14日間スコア改善保証
          </h3>
          <p style={{ fontSize: "0.95rem", color: "#4a5568", lineHeight: 1.6 }}>
            14日間で営業スコアが改善しなければ、<strong>全額返金します</strong>。<br />
            リスクなくProの全機能を試せます。
          </p>
          <p style={{ fontSize: "0.75rem", color: "#718096", marginTop: "0.5rem" }}>
            ※ 14日間で7回以上のロープレ実施が条件
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
              href="/learn"
              className="flex h-10 w-full items-center justify-center rounded-xl border border-card-border text-sm text-muted transition hover:border-accent/50 hover:text-foreground"
            >
              無料で始める
            </Link>
            <p className="mt-2 text-center text-[11px] text-accent/60">
              Proの7日間無料トライアルもあります →
            </p>

            <div className="mt-8 space-y-4">
              {features.map((f) => (
                <div
                  key={f.name}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-muted">{f.name}</span>
                  <span
                    className={
                      f.free === "−" || f.free === "1日1回" || f.free === "1カテゴリ" || f.free === "一部閲覧" || f.free === "基本パターン"
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
              <p className="mt-1 text-xs text-muted">
                {billing === "annual"
                  ? `税込 ¥${annualMonthlyTaxInc.toLocaleString()}/月（年額 ¥${annualTaxInc.toLocaleString()}）`
                  : `税込 ¥${monthlyTaxInc.toLocaleString()}/月`}
              </p>
              <p className="mt-2 text-sm text-muted">
                全コンテンツ+無制限AIロープレで本気のスキルアップ
              </p>
            </div>

            {/* Campaign Notice — auto-applied at checkout */}
            {activePromo && billing === "monthly" && (
              <div className="mb-3 rounded-lg border border-accent/30 bg-accent/5 px-4 py-2.5 text-center">
                <p className="text-xs font-bold text-accent">
                  {activePromo.name}適用中
                </p>
                <p className="text-[11px] text-muted">
                  トライアル後の初月 ¥{activePromo.discountPrice.toLocaleString()}
                  <span className="ml-1 line-through">¥{activePromo.originalPrice.toLocaleString()}</span>
                  （自動適用）
                </p>
              </div>
            )}

            {/* 7日間無料の視覚化バナー */}
            <div
              style={{
                padding: "1rem 1.5rem",
                background: "#fef2f2",
                border: "2px solid #ef4444",
                borderRadius: "0.75rem",
                textAlign: "center",
                marginBottom: "1rem",
              }}
            >
              <p style={{ fontSize: "1.1rem", fontWeight: 800, color: "#991b1b" }}>
                ✅ 7日間は100%無料（1円も請求されません）
              </p>
              <p style={{ fontSize: "0.85rem", color: "#7f1d1d", marginTop: "0.3rem" }}>
                カード登録後、7日経過してから初めて {billing === "annual" ? `¥${annualMonthlyTaxInc.toLocaleString()}/月（税込）` : `¥${monthlyTaxInc.toLocaleString()}/月（税込）`} が課金されます
              </p>
            </div>

            <button
              onClick={handleUpgrade}
              disabled={isLoading}
              className="flex h-12 w-full items-center justify-center rounded-xl bg-accent text-base font-bold text-white transition hover:bg-accent-hover disabled:opacity-60"
            >
              {isLoading ? "処理中..." : "無料で7日間すべての機能を使う"}
            </button>
            <p className="mt-3 text-center text-[11px] text-muted">
              今日スタート → {new Date(Date.now() + 7 * 86400000).toLocaleDateString("ja-JP", { month: "long", day: "numeric" })}まで無料 ・ いつでも解約OK
            </p>
            <p className="mt-1 text-center text-[11px] text-accent/70">
              1回のロープレあたり約¥99 — コーヒー1杯以下
            </p>

            {/* Promo Code Input */}
            <div className="mt-4 text-center">
              {!promoOpen ? (
                <button
                  onClick={() => setPromoOpen(true)}
                  className="text-xs text-muted transition hover:text-accent"
                >
                  プロモコードをお持ちですか？
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                    placeholder="コードを入力"
                    className="h-9 flex-1 rounded-lg border border-card-border bg-background px-3 text-sm text-foreground placeholder:text-muted/50 focus:border-accent focus:outline-none"
                  />
                  <button
                    onClick={() => { setPromoOpen(false); setPromoCode(""); }}
                    className="text-xs text-muted hover:text-foreground"
                  >
                    閉じる
                  </button>
                </div>
              )}
            </div>

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
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-muted">
          <span className="flex items-center gap-1">🛡️ 14日間スコア改善保証</span>
          <span className="flex items-center gap-1">🔒 Stripe安全決済</span>
          <span className="flex items-center gap-1">🏪 コンビニ決済対応</span>
          <span className="flex items-center gap-1">🧾 経費精算・領収書OK</span>
        </div>
        <p className="mt-2 text-center text-xs text-muted">
          上司の承認不要 — 個人で今すぐ始められます。法人払いにも対応。
        </p>

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
                {item.image ? (
                  <Image src={item.image} alt={item.name} width={48} height={48} className="rounded-lg object-cover" />
                ) : (
                  <span className="text-2xl">{item.icon}</span>
                )}
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

        {/* Dynamic User Reviews — 承認済みレビューがあれば自動表示 */}
        <UserReviews />

        {/* Team / Corporate Plan */}
        <div className="mt-20 rounded-2xl border-2 border-accent/30 bg-gradient-to-br from-accent/5 to-transparent p-8 sm:p-12">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-3 inline-flex rounded-full bg-accent px-4 py-1 text-xs font-bold text-white">
              新登場
            </div>
            <p className="mb-2 text-sm font-medium text-accent">
              法人・チーム向け
            </p>
            <h2 className="mb-4 text-2xl font-bold">
              チームの営業力を底上げしませんか？
            </h2>
            <p className="mb-6 text-sm text-muted leading-relaxed">
              営業チーム全員のスキルを均一に底上げ。個別の営業研修（1回5万円〜）と比べて
              <strong>1/10以下のコスト</strong>で、毎日の実践練習環境を提供します。
            </p>

            {/* Team Plan Price */}
            <div className="mb-6">
              <span className="text-4xl font-bold text-accent">¥20,000</span>
              <span className="text-muted">/月（税抜）</span>
              <p className="mt-1 text-xs text-muted">
                税込 ¥22,000/月 ・ 5名まで ・ 1人あたり¥4,000/月
              </p>
            </div>

            <div className="mb-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-card-border bg-card p-4">
                <p className="mb-1 text-2xl font-bold text-accent">無制限</p>
                <p className="text-xs text-muted">全メンバーのロープレ回数</p>
              </div>
              <div className="rounded-xl border border-card-border bg-card p-4">
                <p className="mb-1 text-2xl font-bold text-accent">5名</p>
                <p className="text-xs text-muted">チームプラン対応人数</p>
              </div>
              <div className="rounded-xl border border-card-border bg-card p-4">
                <p className="mb-1 text-2xl font-bold text-accent">請求書OK</p>
                <p className="text-xs text-muted">経費精算・法人払い対応</p>
              </div>
            </div>

            <div className="mb-6 rounded-xl bg-card border border-card-border p-4 text-left">
              <p className="mb-2 text-sm font-bold">法人プランに含まれる機能</p>
              <ul className="grid gap-1 text-sm text-muted sm:grid-cols-2">
                <li>&#10003; 全メンバー無制限ロープレ</li>
                <li>&#10003; 全5カテゴリの詳細スコア</li>
                <li>&#10003; AI改善アドバイス</li>
                <li>&#10003; チーム管理ダッシュボード</li>
                <li>&#10003; メンバー招待・管理</li>
                <li>&#10003; 請求書払い対応</li>
              </ul>
            </div>

            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/team"
                className="inline-flex h-12 items-center justify-center rounded-xl bg-accent px-8 text-base font-bold text-white transition hover:bg-accent-hover"
              >
                チームプランを始める
              </Link>
              <a
                href="mailto:support@seiyaku-coach.com?subject=法人プランのお問い合わせ&body=会社名：%0Aご担当者名：%0A利用予定人数：%0Aご質問・ご要望：%0A"
                className="inline-flex h-12 items-center justify-center rounded-xl border-2 border-accent bg-transparent px-8 text-base font-bold text-accent transition hover:bg-accent/10"
              >
                問い合わせる
              </a>
            </div>
            <p className="mt-3 text-xs text-muted">
              稟議書テンプレート付き ・ いつでも解約OK ・ カード決済 or 請求書払い
            </p>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-20">
          <h2 className="mb-8 text-center text-2xl font-bold">
            よくある質問
          </h2>
          <div className="space-y-3">
            {faqItems.map((item, i) => (
              <details key={item.question} className="group rounded-xl border border-card-border bg-card" open={i === 0}>
                <summary className="flex cursor-pointer items-center justify-between px-6 py-5 text-sm font-bold text-foreground [&::-webkit-details-marker]:hidden list-none">
                  <span>{item.question}</span>
                  <svg
                    className="h-5 w-5 flex-shrink-0 text-muted transition-transform duration-200 group-open:rotate-180"
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="border-t border-card-border px-6 pb-5 pt-4 text-sm leading-relaxed text-muted">
                  {item.answer}
                </div>
              </details>
            ))}
          </div>
        </div>

        {/* Referral CTA */}
        <div className="mt-12 rounded-xl border border-green-500/20 bg-green-500/5 p-6 text-center">
          <p className="mb-1 text-sm font-bold">友達紹介で ¥1,000 OFF</p>
          <p className="mb-3 text-xs text-muted">
            紹介した友達もあなたも、初月 ¥1,000 割引。紹介コードを共有するだけ。
          </p>
          <Link
            href="/referral"
            className="inline-flex h-9 items-center rounded-lg border border-green-500/30 px-4 text-xs font-bold text-green-600 transition hover:bg-green-500/10"
          >
            紹介プログラムを見る →
          </Link>
        </div>

        {/* Program Cross-sell */}
        <div className="mt-12 rounded-2xl border-2 border-accent/30 bg-accent/5 p-6 sm:p-8 text-center">
          <p className="mb-2 text-sm font-medium text-accent">買い切り教材もあります</p>
          <h3 className="mb-3 text-xl font-bold text-foreground">
            成約5ステップ完全攻略プログラム
          </h3>
          <p className="mb-4 text-sm text-muted leading-relaxed">
            22レッスン+反論切り返しテンプレート+トークスクリプトがすべてセット。
            <br className="hidden sm:block" />
            一度購入すれば無期限でアクセスできる買い切り型の教材です。
          </p>
          <div className="mb-4 flex items-center justify-center gap-2">
            <span className="text-sm text-muted line-through">¥14,800</span>
            <span className="text-2xl font-bold text-accent">¥9,800</span>
            <span className="rounded-full bg-accent/10 px-2 py-0.5 text-xs font-bold text-accent">先着30名</span>
          </div>
          <Link
            href="/program"
            className="inline-flex h-11 items-center justify-center rounded-xl bg-accent px-7 text-sm font-bold text-white transition hover:bg-accent-hover"
          >
            プログラムの詳細を見る
          </Link>
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 text-center">
          <p className="mb-6 text-muted">
            営業研修1回の費用で、22レッスン+全業種コンテンツ+無制限AI練習が使い放題
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/learn"
              className="inline-flex h-12 items-center justify-center rounded-xl bg-accent px-6 text-sm font-bold text-white transition hover:bg-accent-hover sm:min-w-[220px]"
            >
              無料で営業の型を学ぶ
            </Link>
            <Link
              href="/roleplay"
              className="inline-flex h-12 items-center justify-center rounded-xl border-2 border-accent/30 bg-accent/5 px-6 text-sm font-bold text-accent transition hover:bg-accent/10 hover:border-accent/50 sm:min-w-[220px]"
            >
              学んだらAIで練習する
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
      <PricingExitPopup />
      <ScrollSlideIn sessionKey="pricing-slide-in" scrollThreshold={0.4}>
        <p className="mb-2 text-sm font-bold text-foreground">
          まずは無料で学ぶ
        </p>
        <p className="mb-3 text-xs text-muted">
          5分で最初のレッスンが完了
        </p>
        <div className="flex items-center gap-3">
          <Link
            href="/learn"
            className="inline-flex h-9 items-center justify-center rounded-lg bg-accent px-4 text-xs font-bold text-white transition hover:bg-accent-hover"
          >
            無料で学ぶ
          </Link>
          <Link
            href="/roleplay"
            className="text-xs font-bold text-accent transition hover:underline"
          >
            AIで練習する
          </Link>
        </div>
      </ScrollSlideIn>
    </div>
  );
}
