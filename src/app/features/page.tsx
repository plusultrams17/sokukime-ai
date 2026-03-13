import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "機能紹介",
  description:
    "即キメAIの主要機能。AIロープレ、リアルタイムコーチ、即決営業スコアリングなど、営業力を鍛える機能を詳しく紹介します。",
  alternates: { canonical: "/features" },
};

const features = [
  {
    icon: "🎭",
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
    icon: "🧠",
    title: "リアルタイムAIコーチ",
    desc: "会話中にリアルタイムで即決営業テクニックを分析。今何をすべきかをコーチがアドバイスします。",
    href: "/features/coach",
    highlights: [
      "会話ごとにテクニック検出",
      "次に使うべきテクニックを提案",
      "コピペできる例文を表示",
    ],
  },
  {
    icon: "📊",
    title: "即決営業スコアリング",
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
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="px-6 pt-32 pb-16">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-4 text-4xl font-bold">機能紹介</h1>
          <p className="text-lg text-muted">
            AI × 即決営業メソッドで、効率的に営業力を鍛える
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
                <span className="text-4xl">{f.icon}</span>
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
                    <span className="text-accent">✓</span>
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
                    即キメAI
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

      {/* CTA */}
      <section className="border-t border-card-border px-6 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-2xl font-bold">
            すべての機能を無料で体験
          </h2>
          <p className="mb-8 text-sm text-muted">
            クレジットカード不要。1日1回無料でAIロープレを体験できます。
          </p>
          <Link
            href="/signup"
            className="inline-flex h-14 items-center justify-center rounded-xl bg-accent px-10 text-lg font-bold text-white transition hover:bg-accent-hover"
          >
            無料で始める
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
