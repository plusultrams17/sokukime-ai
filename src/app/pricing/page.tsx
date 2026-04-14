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
import { createClient } from "@/lib/supabase/client";
import { getStoredUTM } from "@/components/utm-tracker";
import { PLANS, type PlanTier } from "@/lib/plans";

const comparisons = [
  { name: "営業研修（集合型）", cost: "¥50,000〜", frequency: "月1回", image: "/images/misc/comparison-training.png" },
  { name: "営業コンサルティング", cost: "¥100,000〜", frequency: "月1回", image: "/images/misc/comparison-consulting.png" },
  { name: "成約コーチAI プロプラン", cost: "¥1,980（税込）", frequency: "月60回・24時間・即開始", image: "/images/misc/comparison-ai-pro.png", highlight: true },
];


const faqItems = [
  {
    question: "無料で試せますか？",
    answer:
      "はい。Googleアカウントでログインすると、無料プランでAIロープレを累計5回まで体験できます。クレジットカード不要で、いつでも有料プランにアップグレードできます。",
  },
  {
    question: "プランの違いは？",
    answer:
      "無料プランは累計5回まで体験用。スタータープラン（¥990）は月30回まで・全22レッスン利用可能。プロプラン（¥1,980）は月60回まで・AI詳細フィードバック付き。マスタープラン（¥4,980）は月200回まで・優先メールサポート付きです。",
  },
  {
    question: "いつでも解約できますか？",
    answer:
      "はい、いつでも解約できます。解約後も現在の請求期間の終了まで現プランをご利用いただけます。無料プランで累計5回までお試しいただけるため、ご納得いただいたうえでお申し込みください。",
  },
  {
    question: "支払い方法は？",
    answer:
      "クレジットカード（Visa, Mastercard, JCB, American Express）に対応しています。Stripeによる安全な決済です。",
  },
  {
    question: "プランの変更はできますか？",
    answer:
      "はい。マイページからいつでもプランのアップグレード・ダウングレードが可能です。アップグレードは即時反映、ダウングレードは次回請求日から反映されます。",
  },
];

export default function PricingPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [promoOpen, setPromoOpen] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<PlanTier | null>(null);
  const [loadingTier, setLoadingTier] = useState<PlanTier | null>(null);

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
              setCurrentPlan((data?.plan as PlanTier) || "free");
            });
        }
      });
    }
  }, []);

  async function handleUpgrade(tier: PlanTier) {
    if (isLoading) return; // Prevent duplicate clicks
    if (tier === "free") {
      window.location.href = "/login?redirect=/learn";
      return;
    }
    setIsLoading(true);
    setLoadingTier(tier);
    setErrorMsg("");
    trackCTAClick(`pricing_${tier}`, "pricing_page", "/api/stripe/checkout");
    trackCheckoutStarted(tier);
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
        body: JSON.stringify({ tier, ...(promoCode ? { promoCode } : {}), utm: getStoredUTM() }),
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
    setLoadingTier(null);
  }

  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://seiyaku-coach.vercel.app";

  const pricingJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        "@id": `${siteUrl}/pricing#product`,
        name: "成約コーチAI",
        description:
          "AIロープレで営業スキルを最短で伸ばす。月30回のスタータープラン (¥990) から月200回のマスタープラン (¥4,980) まで、4つのプランから選べる営業トレーニングサービス",
        brand: {
          "@type": "Organization",
          name: "成約コーチAI",
        },
        offers: {
          "@type": "AggregateOffer",
          lowPrice: "0",
          highPrice: "4980",
          priceCurrency: "JPY",
          offerCount: PLANS.length,
          offers: PLANS.map((p) => ({
            "@type": "Offer",
            name: p.name,
            price: String(p.price),
            priceCurrency: "JPY",
            description: p.features.join("・"),
            availability: "https://schema.org/InStock",
            url: `${siteUrl}/pricing`,
            ...(p.price > 0 ? { priceValidUntil: "2026-12-31" } : {}),
          })),
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

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-20">
        {/* Pricing Section Title */}
        <div className="mb-10 text-center">
          <h1 className="mb-3 text-2xl font-bold sm:text-3xl md:text-4xl">
            料金プラン
          </h1>
          <p className="mx-auto max-w-xl text-base text-muted sm:text-lg">
            あなたの営業レベルに合わせた4つのプラン
            <br className="hidden sm:block" />
            <span className="text-sm sm:text-base">
              無料5回お試し ・ クレカ不要 ・ いつでも解約OK
            </span>
          </p>

          {/* Trust stats row */}
          <div className="mx-auto mt-6 flex max-w-3xl flex-wrap items-center justify-center gap-2 text-[11px] sm:gap-3 sm:text-xs">
            <span className="flex items-center gap-1.5 rounded-full border border-card-border bg-card/60 px-3 py-1.5 font-bold text-foreground">
              <span className="text-accent">24h</span> いつでも練習OK
            </span>
            <span className="flex items-center gap-1.5 rounded-full border border-card-border bg-card/60 px-3 py-1.5 font-bold text-foreground">
              <span className="text-accent">全22</span> レッスン
            </span>
            <span className="flex items-center gap-1.5 rounded-full border border-card-border bg-card/60 px-3 py-1.5 font-bold text-foreground">
              <span className="text-accent">5カテゴリ</span> AIスコア
            </span>
            <span className="flex items-center gap-1.5 rounded-full border border-card-border bg-card/60 px-3 py-1.5 font-bold text-foreground">
              <span className="text-accent">30+</span> 切り返し話法
            </span>
          </div>
        </div>

        {/* Pricing Cards — 4 plan grid */}
        <div className="grid items-stretch gap-6 md:grid-cols-2 lg:grid-cols-4">
          {PLANS.map((plan) => {
            const isCurrentPlan = currentPlan === plan.tier;
            const isFree = plan.tier === "free";
            const isRecommended = plan.recommended;
            const isLoadingThis = loadingTier === plan.tier;

            return (
              <div
                key={plan.tier}
                className={`relative flex flex-col rounded-2xl p-5 sm:p-6 ${
                  isRecommended
                    ? "border-2 border-[#d7000e] bg-gradient-to-b from-[#d7000e]/15 via-card to-card shadow-2xl shadow-[#d7000e]/20 lg:-my-4 lg:scale-[1.04] lg:z-10"
                    : "border border-card-border bg-card"
                }`}
              >
                {isRecommended && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#d7000e] px-5 py-1.5 text-xs font-bold text-white shadow-lg shadow-[#d7000e]/40 sm:text-sm">
                    <span className="mr-1">★</span>おすすめ
                  </div>
                )}

                <div className="mb-5">
                  <h3 className={`text-lg font-bold ${isRecommended ? "text-accent" : ""}`}>
                    {plan.name}
                  </h3>
                  <p className="mt-1 text-xs text-muted">{plan.description}</p>

                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-3xl font-bold sm:text-4xl">
                      ¥{plan.price.toLocaleString()}
                    </span>
                    <span className="text-sm text-muted">
                      {isFree ? "/無料" : "/月"}
                    </span>
                  </div>

                  <p className="mt-1 text-xs text-muted">
                    {isFree ? plan.tagline : "税込"}
                  </p>
                </div>

                {/* Credits display */}
                {!isFree && plan.monthlyCredits !== null && (
                  <div className="mb-5 rounded-xl border border-card-border bg-background/40 px-3 py-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <span className="text-2xl font-bold leading-none text-accent">
                        {plan.monthlyCredits}
                      </span>
                      <span className="text-xs font-bold text-accent">回/月</span>
                    </div>

                    <p className="mt-2 text-[10px] leading-relaxed text-muted">
                      1回＝AIロープレ1セッション
                      <br />
                      毎月リセット（翌月1日に満タン）
                    </p>
                  </div>
                )}

                {isFree && (
                  <div className="mb-5 rounded-xl border border-card-border bg-background/40 px-3 py-3 text-center">
                    <p className="text-sm font-bold text-foreground">
                      累計{plan.baseCredits}回まで
                    </p>
                    <p className="mt-1 text-[10px] text-muted">
                      生涯の上限 ・ クレジットカード不要
                    </p>
                  </div>
                )}

                {/* CTA */}
                {isCurrentPlan ? (
                  <Link
                    href="/roleplay"
                    className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border-2 border-green-500/40 bg-green-500/10 text-sm font-bold text-green-400"
                  >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path fillRule="evenodd" d="M16.704 5.29a1 1 0 010 1.42l-7.5 7.5a1 1 0 01-1.42 0l-3.5-3.5a1 1 0 011.42-1.42L8.5 12.08l6.79-6.79a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    現在のプラン
                  </Link>
                ) : isFree ? (
                  <Link
                    href="/login?redirect=/learn"
                    className="flex h-12 w-full items-center justify-center rounded-xl border border-card-border text-sm font-bold text-foreground transition hover:border-accent/50 hover:text-accent"
                  >
                    {plan.ctaLabel}
                  </Link>
                ) : (
                  <button
                    onClick={() => handleUpgrade(plan.tier)}
                    disabled={isLoading}
                    className={`group flex w-full items-center justify-center gap-2 rounded-xl text-sm font-bold transition disabled:opacity-60 ${
                      isRecommended
                        ? "h-14 bg-[#d7000e] text-white shadow-lg shadow-[#d7000e]/30 hover:bg-[#b5000b] hover:shadow-xl hover:shadow-[#d7000e]/40"
                        : "h-12 border border-accent/60 text-accent hover:bg-accent/10"
                    }`}
                  >
                    {isLoadingThis ? (
                      "処理中..."
                    ) : (
                      <>
                        {plan.ctaLabel}
                        <svg
                          className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2.5}
                          aria-hidden="true"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </>
                    )}
                  </button>
                )}

                {/* Features list */}
                <ul className="mt-5 space-y-2 text-xs sm:text-sm">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <svg
                        className={`mt-0.5 h-4 w-4 shrink-0 ${
                          isRecommended ? "text-accent" : "text-muted"
                        }`}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.704 5.29a1 1 0 010 1.42l-7.5 7.5a1 1 0 01-1.42 0l-3.5-3.5a1 1 0 011.42-1.42L8.5 12.08l6.79-6.79a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-foreground/90">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {errorMsg && (
          <div className="mx-auto mt-4 max-w-md rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-center text-xs text-red-400">
            {errorMsg}
          </div>
        )}

        {/* Promo Code Input — 全プラン共通 */}
        <div className="mt-8 text-center">
          {!promoOpen ? (
            <button
              onClick={() => setPromoOpen(true)}
              className="inline-flex items-center gap-2 rounded-full border border-card-border bg-card px-5 py-2.5 text-xs font-bold text-foreground transition hover:border-accent/60 hover:text-accent sm:text-sm"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
              プロモコードを入力する
            </button>
          ) : (
            <div className="mx-auto max-w-sm">
              <label className="mb-2 block text-left text-[11px] font-bold text-muted">
                プロモコード
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  placeholder="例: LAUNCH2026"
                  className="h-10 flex-1 rounded-lg border border-card-border bg-background px-3 text-sm text-foreground placeholder:text-muted/40 focus:border-accent focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => { setPromoOpen(false); setPromoCode(""); }}
                  aria-label="プロモコード入力を閉じる"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-card-border text-muted transition hover:border-accent/50 hover:text-foreground"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="mt-2 text-left text-[10px] text-muted/70">
                チェックアウト画面でも入力できます
              </p>
            </div>
          )}
        </div>

        {/* Guarantee Badges — ピル型バッジ */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          <span className="flex items-center gap-1.5 rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1.5 text-xs font-bold text-green-400 sm:text-sm">
            <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2.001A11.954 11.954 0 0110 1.944zM14.707 8.707a1 1 0 00-1.414-1.414L10 10.586 8.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Freeで5回お試し
          </span>
          <span className="flex items-center gap-1.5 rounded-full border border-card-border bg-card px-3 py-1.5 text-xs font-bold text-foreground sm:text-sm">
            <svg className="h-3.5 w-3.5 text-muted" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            Stripe安全決済
          </span>
          <span className="rounded-full border border-card-border bg-card px-3 py-1.5 text-xs font-bold text-foreground sm:text-sm">
            JCB / Visa / Mastercard
          </span>
          <span className="rounded-full border border-card-border bg-card px-3 py-1.5 text-xs font-bold text-foreground sm:text-sm">
            経費精算・領収書OK
          </span>
          <span className="flex items-center gap-1.5 rounded-full border border-card-border bg-card px-3 py-1.5 text-xs font-bold text-foreground sm:text-sm">
            <svg className="h-3.5 w-3.5 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            いつでも解約OK
          </span>
        </div>

        {/* ROI Comparison Section */}
        <div className="mt-20">
          <div className="mb-8 text-center">
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-accent">
              Cost Comparison
            </p>
            <h2 className="text-xl font-bold sm:text-2xl md:text-3xl">
              営業スキルを伸ばす方法、
              <br className="sm:hidden" />
              コストで比べると
            </h2>
            <p className="mt-2 text-sm text-muted">
              ※ 各サービスの提供内容・効果は異なります。価格は一般的な市場相場の目安です
            </p>
          </div>
          <div className="space-y-3">
            {comparisons.map((item) => (
              <div
                key={item.name}
                className={`relative flex items-center gap-3 overflow-hidden rounded-xl border p-4 sm:gap-4 sm:p-5 ${
                  item.highlight
                    ? "border-2 border-accent bg-gradient-to-r from-accent/15 to-accent/5 shadow-lg shadow-accent/10"
                    : "border-card-border bg-card opacity-80"
                }`}
              >
                {item.highlight && (
                  <div className="absolute right-0 top-0 rounded-bl-xl bg-accent px-3 py-1 text-[10px] font-bold text-white">
                    ★ おすすめ
                  </div>
                )}
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
                  className={`whitespace-nowrap font-bold ${
                    item.highlight ? "text-xl text-accent sm:text-2xl" : "text-lg text-foreground line-through decoration-muted/50"
                  }`}
                >
                  {item.cost}
                </span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-center text-xs text-muted">
            ※ 各サービスの提供内容・効果は異なります。価格は一般的な市場相場の目安です
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

        {/* Bottom CTA — おすすめのプロプランへ誘導 */}
        {currentPlan !== "pro" && currentPlan !== "master" && (
          <div className="mt-16">
            <div className="mx-auto max-w-2xl rounded-2xl border-2 border-[#d7000e]/40 bg-gradient-to-br from-[#d7000e]/10 via-card to-card p-6 text-center shadow-xl shadow-[#d7000e]/10 sm:p-10">
              <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-[#d7000e] px-3 py-1 text-[10px] font-bold text-white sm:text-xs">
                <span className="text-base leading-none">★</span> おすすめ
              </div>
              <h3 className="mb-2 text-xl font-bold text-foreground sm:text-2xl">
                迷ったらプロプラン
              </h3>
              <p className="mb-5 text-sm text-muted sm:text-base">
                <span className="font-bold text-foreground">月60回のAIロープレ＋全22レッスン</span>
                <br />
                <span className="text-xs sm:text-sm">
                  無料5回お試し ・ いつでも解約OK ・ クレカ不要でスタート
                </span>
              </p>
              <button
                onClick={() => handleUpgrade("pro")}
                disabled={isLoading}
                className="group inline-flex h-14 items-center justify-center gap-2 rounded-xl bg-[#d7000e] px-10 text-base font-bold text-white shadow-lg shadow-[#d7000e]/30 transition hover:bg-[#b5000b] hover:shadow-xl hover:shadow-[#d7000e]/40 disabled:opacity-60 sm:min-w-[280px]"
              >
                {isLoading ? (
                  "処理中..."
                ) : (
                  <>
                    プロプランに申し込む
                    <svg
                      className="h-5 w-5 transition-transform group-hover:translate-x-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </button>
              <p className="mt-3 text-[11px] text-muted sm:text-xs">
                ¥1,980 / 月（税込）・Stripe安全決済
              </p>
              {errorMsg && (
                <div className="mx-auto mt-3 max-w-md rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-400">
                  {errorMsg}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <Footer />
      <PricingExitPopup />
    </div>
  );
}
