import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "即キメAIについて",
  description:
    "即キメAIは即決営業メソッドに基づくAI営業ロープレコーチングサービスです。営業マンが24時間いつでも練習できる環境を提供します。",
  alternates: { canonical: "/about" },
};

const values = [
  {
    icon: "🎯",
    title: "実践主義",
    desc: "理論だけでなく、繰り返し実践することで営業力は身につく。AIとの反復練習で「型」を体に染み込ませます。",
  },
  {
    icon: "📊",
    title: "データドリブン",
    desc: "感覚ではなく、5ステップの定量スコアで弱点を可視化。何を改善すべきか明確にします。",
  },
  {
    icon: "🔥",
    title: "アクセシブル",
    desc: "24時間いつでも、スマホからでも練習可能。先輩の時間を奪わず、自分のペースでスキルアップ。",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="px-6 pt-32 pb-20">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="mb-6 text-4xl font-bold leading-tight">
            営業の「練習」を、
            <br />
            <span className="text-accent">もっと身近に。</span>
          </h1>
          <p className="text-lg text-muted leading-relaxed">
            即キメAIは、AI × 即決営業メソッドで営業マンの練習環境を変えるサービスです。
            <br />
            先輩に頼まなくても、24時間いつでも、何度でも営業ロープレができる世界を目指しています。
          </p>
        </div>
      </section>

      {/* Problem */}
      <section className="border-t border-card-border px-6 py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-8 text-2xl font-bold">解決したい課題</h2>
          <div className="space-y-6 text-sm leading-relaxed text-muted">
            <p>
              営業力を上げるには「場数」が必要です。しかし、多くの営業マンは十分な練習機会を得られていません。
            </p>
            <div className="rounded-xl border border-card-border bg-card p-6 space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-lg">😩</span>
                <span>
                  ロープレは先輩や上司に頼む必要があり、相手の時間を奪ってしまう
                </span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-lg">😰</span>
                <span>
                  練習不足のまま本番に臨み、「考えます」で終わってしまう
                </span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-lg">🤷</span>
                <span>
                  自分の弱点がわからず、何を改善すべきかも不明確
                </span>
              </div>
            </div>
            <p>
              即キメAIは、これらの課題をAIの力で解決します。
              即決営業メソッドという体系化された営業手法をAIに搭載し、
              いつでもどこでも質の高いロープレ練習ができる環境を提供します。
            </p>
          </div>
        </div>
      </section>

      {/* Method */}
      <section className="border-t border-card-border px-6 py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-4 text-2xl font-bold">即決営業メソッドとは</h2>
          <p className="mb-8 text-sm text-muted leading-relaxed">
            即決営業メソッドは、契約率60%超の実績を持つ体系的な営業手法です。
            アプローチからクロージング、反論処理までの5ステップで構成されています。
          </p>
          <div className="space-y-3">
            {[
              {
                step: "1",
                name: "アプローチ",
                desc: "褒める→先回り→心の扉を開く。お客さんとの信頼関係を構築する最初のステップ。",
              },
              {
                step: "2",
                name: "ヒアリング",
                desc: "質問でニーズを引き出し、問題を深掘り。お客さんが自分で課題に気づくよう導く。",
              },
              {
                step: "3",
                name: "プレゼン",
                desc: "理屈ではなく感動で動かす。お客さんの未来を描き、商品の価値を実感してもらう。",
              },
              {
                step: "4",
                name: "クロージング",
                desc: "過半数・一貫性通し・カギカッコ・ポジティブトリプルで、自然な流れで契約へ。",
              },
              {
                step: "5",
                name: "反論処理",
                desc: "共感→フック→AREA話法→訴求で、「考えます」を「お願いします」に変える。",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="flex items-start gap-4 rounded-xl border border-card-border bg-card p-5"
              >
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-accent/10 text-sm font-bold text-accent">
                  {item.step}
                </div>
                <div>
                  <h3 className="font-bold">{item.name}</h3>
                  <p className="mt-1 text-sm text-muted">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="border-t border-card-border px-6 py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-8 text-2xl font-bold">大切にしていること</h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {values.map((v) => (
              <div
                key={v.title}
                className="rounded-xl border border-card-border bg-card p-6 text-center"
              >
                <div className="mb-3 text-3xl">{v.icon}</div>
                <h3 className="mb-2 font-bold">{v.title}</h3>
                <p className="text-xs text-muted leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-card-border px-6 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-2xl font-bold">
            営業力を鍛える、新しい方法を試してみませんか？
          </h2>
          <p className="mb-8 text-sm text-muted">
            無料アカウントで1日1回ロープレできます。クレジットカード不要。
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
