"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { trackCTAClick, trackCheckoutStarted, trackPricingPageView, trackCheckoutStart } from "@/lib/tracking";
import { PricingExitPopup } from "@/components/exit-popups/pricing-exit-popup";
import { UserReviews } from "@/components/user-reviews";
import { getActivePromotion } from "@/lib/promotions";
import { createClient } from "@/lib/supabase/client";
import { getStoredUTM } from "@/components/utm-tracker";

const features = [
  { name: "学習コース（22レッスン）", free: "基本3レッスン", pro: "全22レッスン" },
  { name: "業種別トークスクリプト", free: "一部閲覧", pro: "全業種対応" },
  { name: "切り返し話法テンプレート", free: "基本パターン", pro: "30パターン" },
  { name: "AIロープレ", free: "1日1回", pro: "無制限" },
  { name: "詳細スコア + AI改善", free: "1カテゴリ", pro: "全5カテゴリ" },
];

const comparisons = [
  { name: "営業研修（集合型）", cost: "¥50,000〜", frequency: "月1回", image: "/images/misc/comparison-training.png" },
  { name: "営業コンサルティング", cost: "¥100,000〜", frequency: "月1回", image: "/images/misc/comparison-consulting.png" },
  { name: "成約コーチAI Pro", cost: "¥2,980（税込）", frequency: "無制限・24時間・即開始", image: "/images/misc/comparison-ai-pro.png", highlight: true },
];


const faqItems = [
  {
    question: "7日間の無料トライアルとは？",
    answer:
      "Proプランに申し込むと、最初の7日間は無料で全22レッスン・AIロープレ（1日5回）・スコア全5カテゴリ・テンプレート30パターンをお試しいただけます。トライアル期間中にいつでもキャンセル可能で、キャンセルすれば一切課金されません。トライアル終了後に課金が開始され、AIロープレが無制限になります。",
  },
  {
    question: "いつでも解約できますか？",
    answer:
      "はい、いつでも解約できます。解約後も現在の請求期間の終了までProプランをご利用いただけます。14日間返金保証もあります。",
  },
  {
    question: "支払い方法は？",
    answer:
      "クレジットカード（Visa, Mastercard, JCB, American Express）に対応しています。Stripeによる安全な決済です。",
  },
  {
    question: "無料プランとProの違いは？",
    answer:
      "無料プランでは基本3レッスン・AIロープレ1日1回・スコア1カテゴリが利用可能。Proでは全22レッスン・全業種コンテンツ・AIロープレ無制限・全5カテゴリの詳細スコア+AI改善アドバイスが使えます。",
  },
];

export default function PricingPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [promoOpen, setPromoOpen] = useState(false);
  const [activePromo] = useState(() => getActivePromotion());
  const [currentPlan, setCurrentPlan] = useState<"free" | "pro" | null>(null);

  useEffect(() => {
    trackPricingPageView({});
    // Check current plan to show appropriate UI
    const supabase = createClient();
    if (supabase) {
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (user) {
          supabase
            .from("profiles")
            .select("plan")
            .eq("id", user.id)
            .single()
            .then(({ data }) => {
              setCurrentPlan((data?.plan as "free" | "pro") || "free");
            });
        }
      });
    }
  }, []);

  // ¥2,980 is already tax-inclusive (per tokushoho/terms)
  const monthlyPrice = 2980;

  async function handleUpgrade() {
    if (isLoading) return; // Prevent duplicate clicks
    setIsLoading(true);
    setErrorMsg("");
    trackCTAClick("pricing_pro", "pricing_page", "/api/stripe/checkout");
    trackCheckoutStarted();
    trackCheckoutStart({});

    // Client-side auth check — redirect to login before hitting API
    const supabase = createClient();
    if (supabase) {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = "/login?redirect=/pricing";
        return;
      }
    }

    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...(promoCode ? { promoCode } : {}), utm: getStoredUTM() }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      if (data.error === "Unauthorized") {
        window.location.href = "/login?redirect=/pricing";
        return;
      }
      setErrorMsg(data.error || "エラーが発生しました。もう一度お試しください。");
    } catch {
      setErrorMsg("チェックアウトの開始に失敗しました。もう一度お試しください。");
    }
    setIsLoading(false);
  }

  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://seiyaku-coach.vercel.app";

  const pricingJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        "@id": `${siteUrl}/pricing#product`,
        name: "成約コーチAI Proプラン",
        description:
          "AIロープレ無制限・全5カテゴリ詳細スコア・AI改善アドバイス・リアルタイムコーチング付きの営業トレーニングプラン",
        brand: {
          "@type": "Organization",
          name: "成約コーチAI",
        },
        offers: {
          "@type": "AggregateOffer",
          lowPrice: "0",
          highPrice: "2980",
          priceCurrency: "JPY",
          offerCount: 2,
          offers: [
            {
              "@type": "Offer",
              name: "無料プラン",
              price: "0",
              priceCurrency: "JPY",
              description: "基本3レッスン・業種別トークスクリプト一部・AIロープレ1日1回・成約スコア1カテゴリ",
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

      <Header />

      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-20">
        {/* Pricing Section Title */}
        <div className="mb-10 text-center">
          <h1 className="mb-3 text-2xl font-bold sm:text-3xl md:text-4xl">料金プラン</h1>
          <p className="text-lg text-muted">
            無料で学び始めて、本気で伸ばしたくなったらProへ
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid gap-8 md:grid-cols-2">
          {/* Free Plan */}
          <div className="rounded-2xl border border-card-border bg-card p-5 sm:p-8">
            <div className="mb-6">
              <h3 className="text-xl font-bold">無料プラン</h3>
              <div className="mt-4">
                <span className="text-4xl font-bold">¥0</span>
                <span className="text-muted">/月</span>
              </div>
              <p className="mt-2 text-sm text-muted">
                まずは試してみたい方に
              </p>
              <p className="mt-1 text-xs text-yellow-600/80">
                ※ 学習コースは基本3レッスン・AIロープレは1日1回・スコアは1カテゴリのみ
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

            <div className="mt-6 space-y-3 sm:mt-8 sm:space-y-4">
              {features.map((f) => (
                <div
                  key={f.name}
                  className="flex items-center justify-between gap-2 text-xs sm:text-sm"
                >
                  <span className="text-muted min-w-0">{f.name}</span>
                  <span
                    className={`shrink-0 ${
                      f.free === "−" || f.free === "1日1回" || f.free === "1カテゴリ" || f.free === "一部閲覧" || f.free === "基本3レッスン" || f.free === "基本パターン"
                        ? "text-muted"
                        : "text-foreground"
                    }`}
                  >
                    {f.free}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Pro Plan */}
          <div className="relative rounded-2xl border-2 border-accent bg-card p-5 sm:p-8">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-4 py-1 text-xs font-bold text-white whitespace-nowrap">
              {activePromo?.id === "launch2026"
                ? "🎉 ローンチ記念 先着100名"
                : "おすすめ"}
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-bold text-accent">Proプラン</h3>
              <div className="mt-4">
                <span className="text-4xl font-bold">¥{monthlyPrice.toLocaleString()}</span>
                <span className="text-muted">/月<span className="text-xs">（税込）</span></span>
              </div>
              <p className="mt-1 text-sm font-medium text-accent/80">
                1日あたり約¥99 ─ コーヒー1杯以下
              </p>
              <p className="mt-2 text-sm text-muted">
                全業種コンテンツと無制限AIロープレで、短期間で営業力を伸ばす
              </p>
            </div>

            {/* Campaign Notice — auto-applied at checkout */}
            {activePromo && (
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

            {currentPlan === "pro" ? (
              /* Pro会員向け表示 */
              <div className="mb-4 rounded-xl border-2 border-green-500/30 bg-green-500/5 px-4 py-4 text-center">
                <p className="text-sm font-extrabold text-green-400">
                  Proプラン利用中
                </p>
                <p className="mt-1 text-xs text-muted">
                  全機能をご利用いただけます
                </p>
              </div>
            ) : (
              /* 未登録・Free会員向け表示 */
              <>
                {/* 7日間無料バナー */}
                <div className="mb-4 rounded-xl border-2 border-accent bg-accent/5 px-4 py-3 text-center">
                  <p className="text-sm font-extrabold text-accent">
                    最初の7日間は無料
                  </p>
                  <p className="mt-0.5 text-xs text-muted">
                    全22レッスン・AIロープレ1日5回をお試し。いつでもキャンセルOK
                  </p>
                </div>
              </>
            )}

            {currentPlan === "pro" ? (
              <Link
                href="/roleplay"
                className="flex h-12 w-full items-center justify-center rounded-xl bg-accent text-base font-bold text-white transition hover:bg-accent-hover"
              >
                ロープレを始める
              </Link>
            ) : (
              <button
                onClick={handleUpgrade}
                disabled={isLoading}
                className="flex h-12 w-full items-center justify-center rounded-xl bg-accent text-base font-bold text-white transition hover:bg-accent-hover disabled:opacity-60"
              >
                {isLoading ? "処理中..." : "7日間無料でAIロープレを試す"}
              </button>
            )}
            {errorMsg && (
              <div className="mt-2 rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2 text-xs text-red-400 text-center">
                {errorMsg}
              </div>
            )}
            {currentPlan !== "pro" && (
              <p className="mt-2 text-center text-[11px] text-muted">
                いつでも解約OK ・ 14日間返金保証
              </p>
            )}

            {/* Promo Code Input */}
            {currentPlan !== "pro" && <div className="mt-4 text-center">
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
            </div>}

            <div className="mt-6 space-y-3 sm:mt-8 sm:space-y-4">
              {features.map((f) => (
                <div
                  key={f.name}
                  className="flex items-center justify-between gap-2 text-xs sm:text-sm"
                >
                  <span className="text-foreground min-w-0">{f.name}</span>
                  <span className="shrink-0 font-medium text-accent">{f.pro}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Guarantee Badge */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-xs text-muted sm:gap-x-4 sm:text-sm">
          <span className="flex items-center gap-1"><svg className="inline-block h-4 w-4 text-muted shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2.001A11.954 11.954 0 0110 1.944zM14.707 8.707a1 1 0 00-1.414-1.414L10 10.586 8.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg> 14日間返金保証</span>
          <span className="flex items-center gap-1"><svg className="inline-block h-4 w-4 text-muted shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg> Stripe安全決済</span>
          <span className="flex items-center gap-1">JCB / Visa / Mastercard</span>
          <span className="flex items-center gap-1">経費精算・領収書OK</span>
        </div>

        {/* ROI Comparison Section */}
        <div className="mt-20">
          <h2 className="mb-6 text-center text-xl font-bold sm:mb-8 sm:text-2xl">
            営業スキルを伸ばす方法、コストで比べると
          </h2>
          <div className="space-y-3">
            {comparisons.map((item) => (
              <div
                key={item.name}
                className={`flex items-center gap-3 rounded-xl border p-4 sm:gap-4 sm:p-5 ${
                  item.highlight
                    ? "border-accent bg-accent/5"
                    : "border-card-border bg-card"
                }`}
              >
                {item.image && (
                  <Image src={item.image} alt={item.name} width={48} height={48} className="rounded-lg object-cover" />
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
          <p className="mt-3 text-center text-xs text-muted">
            ※ 一般的な市場価格の参考値です
          </p>
        </div>

        {/* Dynamic User Reviews — 承認済みレビューがあれば自動表示 */}
        <UserReviews />

        {/* FAQ */}
        <div className="mt-20">
          <h2 className="mb-6 text-center text-xl font-bold sm:mb-8 sm:text-2xl">
            よくある質問
          </h2>
          <div className="space-y-3">
            {faqItems.map((item, i) => (
              <details key={item.question} className="group rounded-xl border border-card-border bg-card" open={i === 0}>
                <summary className="flex cursor-pointer items-center justify-between px-4 py-4 text-sm font-bold text-foreground [&::-webkit-details-marker]:hidden list-none sm:px-6 sm:py-5">
                  <span>{item.question}</span>
                  <svg
                    className="h-5 w-5 flex-shrink-0 text-muted transition-transform duration-200 group-open:rotate-180"
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="border-t border-card-border px-4 pb-4 pt-3 text-sm leading-relaxed text-muted sm:px-6 sm:pb-5 sm:pt-4">
                  {item.answer}
                </div>
              </details>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        {currentPlan !== "pro" && (
          <div className="mt-16 text-center">
            <p className="mb-5 text-muted">
              7日間の無料トライアルでAIロープレをお試し。いつでも解約OK
            </p>
            <button
                onClick={handleUpgrade}
                disabled={isLoading}
                className="inline-flex h-12 items-center justify-center rounded-xl bg-accent px-8 text-sm font-bold text-white transition hover:bg-accent-hover disabled:opacity-60 sm:min-w-[240px]"
              >
                {isLoading ? "処理中..." : "無料トライアルを始める"}
              </button>
            {errorMsg && (
              <div className="mx-auto mt-3 max-w-md rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2 text-xs text-red-400">
                {errorMsg}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <Footer />
      <PricingExitPopup />
    </div>
  );
}
