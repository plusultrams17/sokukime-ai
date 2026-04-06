import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { JsonLd } from "@/components/json-ld";

export const metadata: Metadata = {
  title: "機能紹介",
  description:
    "成約コーチ AIの主要機能。AIロープレ、リアルタイムコーチ、成約スコアリングなど、営業力を鍛える機能を詳しく紹介します。",
  alternates: { canonical: "/features" },
};

const features = [
  {
    icon: "",
    image: "/images/pages/feature-roleplay.png",
    title: "AIロープレ",
    desc: "AIがリアルなお客さん役を演じます。業種・商材・難易度を自由にカスタマイズして、あらゆる営業シーンを練習。",
    href: "/features/scenarios",
    highlights: [
      "3種類の営業シーン（電話・訪問・問い合わせ）",
      "4種類のお客さんタイプ",
      "3段階の難易度設定",
    ],
  },
  {
    icon: "",
    image: "/images/pages/feature-coach.png",
    title: "リアルタイムAIコーチ",
    desc: "会話中にリアルタイムで成約メソッドのテクニックを分析。今何をすべきかをコーチがアドバイスします。",
    href: "/features/coach",
    highlights: [
      "会話ごとにテクニック検出",
      "次に使うべきテクニックを提案",
      "コピペできる例文を表示",
    ],
  },
  {
    icon: "",
    image: "/images/pages/feature-scoring.png",
    title: "成約スコアリング",
    desc: "5ステップそれぞれを20点満点で採点。総合スコアとランク（S〜E）で実力を可視化します。",
    href: "/features/scoring",
    highlights: [
      "5カテゴリ×20点の100点満点",
      "カテゴリ別の詳細フィードバック",
      "強み・改善点のリストアップ",
    ],
  },
];

export default function FeaturesPage() {
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://seiyaku-coach.vercel.app";

  return (
    <div className="min-h-screen bg-background">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebPage",
              "@id": `${siteUrl}/features#webpage`,
              name: "機能紹介 | 成約コーチ AI",
              description:
                "成約コーチ AIの主要機能：(1) AIロープレ（業種・難易度カスタマイズ対応）、(2) リアルタイムAIコーチ（商談中テクニック自動分析）、(3) 成約スコアリング（5ステップ×20点満点で採点）。従来の対面ロープレと比較してコスト約94%削減。",
              url: `${siteUrl}/features`,
              isPartOf: { "@id": `${siteUrl}/#website` },
              about: { "@id": `${siteUrl}/#application` },
              inLanguage: "ja",
            },
            {
              "@type": "BreadcrumbList",
              "@id": `${siteUrl}/features#breadcrumb`,
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "ホーム", item: siteUrl },
                { "@type": "ListItem", position: 2, name: "機能紹介", item: `${siteUrl}/features` },
              ],
            },
          ],
        }}
      />
      <Header />

      <section className="px-6 pt-32 pb-16">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-4 text-4xl font-bold">機能紹介</h1>
          <p className="text-lg text-muted">
            AI × 成約メソッドで、効率的に営業力を鍛える
          </p>
          <p className="mx-auto mt-6 max-w-3xl text-sm text-muted leading-relaxed text-left">
            成約コーチ AIの主要機能は、(1) <strong className="text-foreground">AIロープレ</strong>（業種・難易度カスタマイズ対応、3営業シーン×4顧客タイプ×3難易度）、(2) <strong className="text-foreground">リアルタイムAIコーチ</strong>（商談中にテクニックを自動分析・提案）、(3) <strong className="text-foreground">成約スコアリング</strong>（5ステップ×20点の100点満点で採点）の3つです。従来の対面ロープレ（1回¥50,000〜・週1-2回が限度）と比較して、月額¥2,980で24時間無制限に練習できます。
          </p>
        </div>
      </section>

      <section className="px-6 pb-20">
        <div className="mx-auto max-w-4xl space-y-8">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-card-border bg-card p-8"
            >
              <div className="flex items-start gap-4 mb-6">
                {f.image ? <Image src={f.image} alt={f.title} width={64} height={64} className="rounded-xl flex-shrink-0" /> : <span className="text-4xl">{f.icon}</span>}
                <div>
                  <h2 className="text-2xl font-bold">{f.title}</h2>
                  <p className="mt-2 text-sm text-muted leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              </div>

              <div className="mb-6 space-y-2">
                {f.highlights.map((h) => (
                  <div
                    key={h}
                    className="flex items-center gap-2 text-sm text-muted"
                  >
                    <svg className="h-4 w-4 flex-shrink-0 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    {h}
                  </div>
                ))}
              </div>

              <Link
                href={f.href}
                className="inline-flex items-center text-sm text-accent font-medium hover:underline"
              >
                詳しく見る →
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison */}
      <section className="border-t border-card-border px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-8 text-center text-2xl font-bold">
            従来の営業練習との違い
          </h2>
          <div className="overflow-hidden rounded-2xl border border-card-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-card-border bg-card">
                  <th className="px-6 py-4 text-left text-muted font-medium" />
                  <th className="px-6 py-4 text-center text-muted font-medium">
                    従来のロープレ
                  </th>
                  <th className="px-6 py-4 text-center font-bold text-accent">
                    成約コーチ AI
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["練習時間", "相手の都合次第", "24時間いつでも"],
                  ["練習回数", "週1-2回が限度", "無制限（Pro）"],
                  ["フィードバック", "主観的", "AI定量スコア"],
                  ["コスト", "¥50,000〜/回", "¥2,980/月"],
                  ["準備", "日程調整が必要", "すぐに開始"],
                  ["一貫性", "相手によって異なる", "常に同じ基準"],
                ].map(([label, traditional, ai]) => (
                  <tr
                    key={label}
                    className="border-b border-card-border last:border-0"
                  >
                    <td className="px-6 py-3 font-medium">{label}</td>
                    <td className="px-6 py-3 text-center text-muted">
                      {traditional}
                    </td>
                    <td className="px-6 py-3 text-center text-accent font-medium">
                      {ai}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Related Content */}
      <section className="border-t border-card-border px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-8 text-center text-2xl font-bold">関連コンテンツ</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <Link
              href="/blog/eigyo-roleplay-ai-practice"
              className="rounded-xl border border-card-border bg-card p-5 transition hover:border-accent/50"
            >
              <p className="mb-1 text-xs font-medium text-accent">ブログ</p>
              <p className="text-sm font-bold leading-snug">営業ロープレをAIで練習する5つのメリット</p>
            </Link>
            <Link
              href="/learn"
              className="rounded-xl border border-card-border bg-card p-5 transition hover:border-accent/50"
            >
              <p className="mb-1 text-xs font-medium text-accent">学習コース</p>
              <p className="text-sm font-bold leading-snug">22レッスン+認定試験で成約メソッドを習得</p>
            </Link>
            <Link
              href="/worksheet"
              className="rounded-xl border border-card-border bg-card p-5 transition hover:border-accent/50"
            >
              <p className="mb-1 text-xs font-medium text-accent">ワークシート</p>
              <p className="text-sm font-bold leading-snug">AIでトークスクリプトを自動生成</p>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-card-border px-6 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-2xl font-bold">
            すべての機能を無料で体験
          </h2>
          <p className="mb-8 text-sm text-muted">
            クレジットカード不要。1日1回無料でAIロープレを体験できます。
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/learn"
              className="inline-flex h-14 items-center justify-center rounded-xl border-2 border-accent/30 bg-accent/5 px-8 text-base font-bold text-accent transition hover:bg-accent/10 hover:border-accent/50 sm:min-w-[220px]"
            >
              まず営業の型を学ぶ
            </Link>
            <Link
              href="/roleplay"
              className="inline-flex h-14 items-center justify-center rounded-xl bg-accent px-8 text-base font-bold text-white transition hover:bg-accent-hover sm:min-w-[220px]"
            >
              無料で始める
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
