import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { StickyCTA } from "@/components/sticky-cta";
import { JsonLd } from "@/components/json-ld";
import { DMGeneratorClient } from "./generator-client";

export const metadata: Metadata = {
  title: "営業DM自動生成ツール｜ターゲットに合わせたパーソナライズDM",
  description:
    "業種・チャネル・関係性を選ぶだけで、パーソナライズされた営業DM文面を3パターン自動生成。X DM・Instagram DM・LinkedIn・メールに対応。",
  alternates: {
    canonical: "/tools/dm-generator",
  },
};

const SITE_URL =
  process.env.NEXT_PUBLIC_APP_URL || "https://seiyaku-coach.vercel.app";

export default function DMGeneratorPage() {
  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "営業DM自動生成ツール",
    description:
      "業種・チャネル・関係性を選ぶだけで、パーソナライズされた営業DM文面を3パターン自動生成する無料ツール",
    url: `${SITE_URL}/tools/dm-generator`,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "JPY" },
  };

  return (
    <div className="min-h-screen bg-background">
      <JsonLd data={jsonLdData} />
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0f1729] to-[#1a2744] px-4 pt-24 pb-16 sm:px-6 sm:pt-32 sm:pb-20">
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm">
            約1分・登録不要
          </div>
          <h1 className="mb-4 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            <span className="text-accent">営業DM</span>を自動生成
          </h1>
          <p className="mx-auto max-w-2xl text-base text-white/70 leading-relaxed sm:text-lg">
            業種・チャネル・関係性を入力するだけで、パーソナライズされた営業DM文面を3パターン生成。
            <br className="hidden sm:block" />
            X DM、Instagram DM、LinkedIn、メールに対応しています。
          </p>
        </div>
      </section>

      {/* Feature highlights */}
      <section className="px-4 py-10 sm:px-6 sm:py-14">
        <div className="mx-auto max-w-4xl">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="flex items-center gap-4 rounded-2xl border border-card-border bg-white p-5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent/10">
                <svg
                  className="h-6 w-6 text-accent"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <div>
                <p className="text-lg font-bold text-foreground">3パターン生成</p>
                <p className="text-xs text-muted">
                  異なるアプローチで比較検討
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-2xl border border-card-border bg-white p-5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent/10">
                <svg
                  className="h-6 w-6 text-accent"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <div>
                <p className="text-lg font-bold text-foreground">
                  パーソナライズ対応
                </p>
                <p className="text-xs text-muted">
                  ターゲットに合わせた文面
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-2xl border border-card-border bg-white p-5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent/10">
                <svg
                  className="h-6 w-6 text-accent"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                  <line x1="8" y1="21" x2="16" y2="21" />
                  <line x1="12" y1="17" x2="12" y2="21" />
                </svg>
              </div>
              <div>
                <p className="text-lg font-bold text-foreground">4チャネル対応</p>
                <p className="text-xs text-muted">
                  X / Instagram / LinkedIn / メール
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Generator */}
      <section className="px-4 pb-16 sm:px-6 sm:pb-24">
        <div className="mx-auto max-w-4xl">
          <DMGeneratorClient />
        </div>
      </section>

      {/* How to use */}
      <section className="px-4 pb-16 sm:px-6 sm:pb-24">
        <div className="mx-auto max-w-3xl">
          <details className="group rounded-2xl border border-card-border bg-white shadow-sm">
            <summary className="flex cursor-pointer items-center justify-between px-6 py-5 text-base font-bold text-foreground [&::-webkit-details-marker]:hidden list-none sm:text-lg">
              <span>営業DMの効果的な書き方とは？</span>
              <svg
                className="h-5 w-5 shrink-0 text-muted transition-transform duration-200 group-open:rotate-180"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </summary>
            <div className="space-y-3 border-t border-card-border px-6 pb-6 pt-4">
              {[
                {
                  num: "1",
                  name: "相手を知る",
                  desc: "送信前にターゲットのプロフィールや投稿を確認。共通点や興味関心を把握してからDMを作成すると返信率が大きく変わります。",
                  color: "#0F6E56",
                },
                {
                  num: "2",
                  name: "短く、要点を伝える",
                  desc: "長文DMは読まれにくい傾向があります。最初の2行で相手の興味を引き、要点を簡潔に伝えましょう。",
                  color: "#185FA5",
                },
                {
                  num: "3",
                  name: "価値を先に提供する",
                  desc: "いきなり商品の紹介ではなく、相手にとって有益な情報やインサイトを先に提供することで、信頼関係の構築につながります。",
                  color: "#534AB7",
                },
                {
                  num: "4",
                  name: "行動を促す",
                  desc: "「もしよろしければ」のような曖昧な表現ではなく、具体的な次のステップ（無料相談、資料共有など）を提示しましょう。",
                  color: "#993C1D",
                },
                {
                  num: "5",
                  name: "フォローアップを忘れない",
                  desc: "1通目で返信がなくても諦めない。3-5日後に別の切り口でフォローアップDMを送ることで、反応を得られることがあります。",
                  color: "#A32D2D",
                },
              ].map((s) => (
                <div
                  key={s.num}
                  className="flex gap-4 rounded-xl bg-background p-4"
                >
                  <span
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                    style={{ backgroundColor: s.color }}
                  >
                    {s.num}
                  </span>
                  <div>
                    <p className="text-sm font-bold text-foreground">{s.name}</p>
                    <p className="mt-0.5 text-sm text-muted">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </details>
        </div>
      </section>

      {/* SEO Content */}
      <section className="px-4 pb-16 sm:px-6 sm:pb-24">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-6 text-2xl font-bold text-foreground sm:text-3xl">
            なぜ営業DMにパーソナライズが重要なのか
          </h2>
          <div className="space-y-4 text-sm leading-relaxed text-muted sm:text-base">
            <p>
              SNSやメールでの営業DMは、適切に活用すれば新規顧客の獲得につながる有力な手段です。
              しかし、テンプレートをそのままコピーしただけの一斉送信DMは、受信者に見透かされ、無視されるケースがほとんどです。
            </p>
            <p>
              返信率を高めるためには、ターゲットの業種・立場・関心事に合わせたパーソナライズが不可欠です。
              成約コーチAIのDM自動生成ツールは、あなたが入力した条件に基づいて、異なるアプローチのDM文面を3パターン提案します。
              共感型・価値提案型・質問型など、複数の切り口を比較しながら、最も効果的な文面を選べます。
            </p>
            <p>
              DM文面が決まったら、実際の商談に備えて{" "}
              <Link
                href="/roleplay"
                className="text-accent underline underline-offset-4 hover:text-accent-hover"
              >
                AIロープレ
              </Link>
              で返信後の会話シミュレーションを行うと、より高い成約率が期待できます。
            </p>
          </div>
        </div>
      </section>

      {/* Related Tools */}
      <section className="px-4 pb-16 sm:px-6 sm:pb-24">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-6 text-xl font-bold text-foreground">関連ツール</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Link
              href="/tools/script-generator"
              className="rounded-xl border border-card-border bg-white p-4 text-center transition hover:-translate-y-0.5 hover:shadow-sm"
            >
              <div className="text-sm font-medium text-foreground">
                トークスクリプト生成
              </div>
            </Link>
            <Link
              href="/tools/objection-handbook"
              className="rounded-xl border border-card-border bg-white p-4 text-center transition hover:-translate-y-0.5 hover:shadow-sm"
            >
              <div className="text-sm font-medium text-foreground">
                反論切り返しトーク集
              </div>
            </Link>
            <Link
              href="/tools/sales-quiz"
              className="rounded-xl border border-card-border bg-white p-4 text-center transition hover:-translate-y-0.5 hover:shadow-sm"
            >
              <div className="text-sm font-medium text-foreground">
                営業力診断テスト
              </div>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
      <StickyCTA />
    </div>
  );
}
