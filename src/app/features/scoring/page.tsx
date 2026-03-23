import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "成約スコアリング機能",
  description:
    "成約コーチ AIのスコアリング機能。5ステップそれぞれを20点満点で採点し、営業力を100点満点で可視化します。",
  alternates: { canonical: "/features/scoring" },
};

const grades = [
  { grade: "S", range: "90-100", color: "text-green-400", desc: "成約メソッドマスター。確実に成約できる実力です。" },
  { grade: "A", range: "80-89", color: "text-green-400", desc: "高い営業力。あと少しでマスターレベル。" },
  { grade: "B", range: "60-79", color: "text-yellow-400", desc: "基本は身についている。応用力を磨きましょう。" },
  { grade: "C", range: "40-59", color: "text-orange-400", desc: "伸びしろ大。特定のステップを重点練習。" },
  { grade: "D", range: "20-39", color: "text-red-400", desc: "基本の型から練習しましょう。" },
  { grade: "E", range: "0-19", color: "text-red-400", desc: "まずはアプローチの型から始めましょう。" },
];

const categories = [
  {
    name: "アプローチ",
    points: "20点",
    criteria: [
      "褒めることで信頼構築ができたか",
      "ゴール共有トークで不安を解消したか",
      "自然な会話で信頼を構築したか",
    ],
  },
  {
    name: "ヒアリング",
    points: "20点",
    criteria: [
      "的確な質問でニーズを引き出したか",
      "問題を深掘りして本質に迫れたか",
      "お客さん自身に課題を認識させたか",
    ],
  },
  {
    name: "プレゼン",
    points: "20点",
    criteria: [
      "理屈ではなく感情に訴えたか",
      "お客さんの未来像を描けたか",
      "商品の価値を実感させたか",
    ],
  },
  {
    name: "クロージング",
    points: "20点",
    criteria: [
      "社会的証明クロージングを使えたか",
      "一貫性の活用で自然に導けたか",
      "段階的訴求で後押しできたか",
    ],
  },
  {
    name: "反論処理",
    points: "20点",
    criteria: [
      "共感でお客さんの気持ちを受け止めたか",
      "根拠提示で論理的に切り返せたか",
      "再度クロージングに持っていけたか",
    ],
  },
];

export default function ScoringFeaturePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="px-6 pt-32 pb-16">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-4"><Image src="/images/pages/scoring-hero.png" alt="成約スコアリング" width={80} height={80} className="mx-auto rounded-2xl" /></div>
          <h1 className="mb-4 text-4xl font-bold">成約スコアリング</h1>
          <p className="text-lg text-muted">
            5ステップ × 20点の100点満点で
            <br />
            あなたの営業力を定量的に可視化
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="px-6 pb-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-8 text-2xl font-bold">採点カテゴリ</h2>
          <div className="space-y-4">
            {categories.map((cat, i) => (
              <div
                key={cat.name}
                className="rounded-2xl border border-card-border bg-card p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-sm font-bold text-accent">
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold">{cat.name}</h3>
                  </div>
                  <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-bold text-accent">
                    {cat.points}
                  </span>
                </div>
                <div className="space-y-2">
                  {cat.criteria.map((c) => (
                    <div
                      key={c}
                      className="flex items-start gap-2 text-sm text-muted"
                    >
                      <span className="text-accent mt-0.5">&#x2713;</span>
                      {c}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Grade */}
      <section className="border-t border-card-border px-6 py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-8 text-2xl font-bold">ランク評価</h2>
          <div className="overflow-hidden rounded-2xl border border-card-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-card-border bg-card">
                  <th className="px-6 py-3 text-left font-medium text-muted">
                    ランク
                  </th>
                  <th className="px-6 py-3 text-left font-medium text-muted">
                    スコア
                  </th>
                  <th className="px-6 py-3 text-left font-medium text-muted">
                    レベル
                  </th>
                </tr>
              </thead>
              <tbody>
                {grades.map((g) => (
                  <tr
                    key={g.grade}
                    className="border-b border-card-border last:border-0"
                  >
                    <td className={`px-6 py-3 text-2xl font-black ${g.color}`}>
                      {g.grade}
                    </td>
                    <td className="px-6 py-3 font-medium">{g.range}</td>
                    <td className="px-6 py-3 text-muted">{g.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* What you get */}
      <section className="border-t border-card-border px-6 py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-8 text-2xl font-bold">スコアカードでわかること</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              {
                icon: "📈",
                image: "/images/pages/scoring-total.png",
                title: "総合スコア & ランク",
                desc: "100点満点の総合評価とS〜Eのランク表示",
              },
              {
                icon: "📋",
                image: "/images/pages/scoring-feedback.png",
                title: "カテゴリ別フィードバック",
                desc: "各ステップの得点と具体的な改善アドバイス",
              },
              {
                icon: "💪",
                image: "/images/pages/scoring-strength.png",
                title: "強みの分析",
                desc: "あなたの営業で特に良かったポイント",
              },
              {
                icon: "🎯",
                image: "/images/pages/scoring-improve.png",
                title: "改善ポイント",
                desc: "次のロープレで意識すべき具体的な課題",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-card-border bg-card p-5"
              >
                {item.image ? <Image src={item.image} alt={item.title} width={48} height={48} className="rounded-lg" /> : <span className="text-2xl">{item.icon}</span>}
                <h3 className="mt-2 font-bold">{item.title}</h3>
                <p className="mt-1 text-sm text-muted">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-card-border px-6 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-2xl font-bold">
            あなたの営業力は何点？
          </h2>
          <p className="mb-8 text-sm text-muted">
            無料でAIロープレ＆スコアリングを体験できます
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/roleplay"
              className="inline-flex h-14 items-center justify-center rounded-xl bg-accent px-10 text-lg font-bold text-white transition hover:bg-accent-hover"
            >
              無料で採点してみる
            </Link>
            <Link
              href="/features"
              className="inline-flex h-14 items-center justify-center rounded-xl border border-card-border px-10 text-lg font-medium text-muted transition hover:border-accent hover:text-foreground"
            >
              他の機能を見る
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
