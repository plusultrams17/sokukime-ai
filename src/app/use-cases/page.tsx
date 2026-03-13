import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "活用シーン",
  description:
    "即キメAIの活用シーン。新人研修、チームのスキル底上げ、個人事業主の営業練習、テレアポ練習など、様々な場面で活用できます。",
  alternates: { canonical: "/use-cases" },
};

const useCases = [
  {
    icon: "🆕",
    title: "新人営業マンの研修",
    problem:
      "従来のロープレは先輩の時間を奪い、新人は遠慮して十分な練習ができない。研修後も自主練の環境がない。",
    solution:
      "AIが相手役になるので、先輩に遠慮せず何度でも練習可能。即決営業の5ステップが自然に身につくまで反復できます。",
    example: {
      scene: "入社3ヶ月目の保険営業マン",
      product: "生命保険の新規契約",
      result:
        "毎日のAIロープレで、アプローチの「先回りトーク」が自然にできるように。入社半年で月3件の契約を達成。",
    },
    stats: "独り立ちまでの期間が平均50%短縮",
  },
  {
    icon: "👥",
    title: "営業チームのスキル底上げ",
    problem:
      "チーム内で営業手法がバラバラ。エースの技術が属人化し、チーム全体の底上げが進まない。",
    solution:
      "即決営業メソッドという共通の「型」でチーム全員を評価。スコアで弱点を可視化し、ピンポイントで改善できます。",
    example: {
      scene: "不動産営業チーム（5名）",
      product: "マンション販売",
      result:
        "チーム全員がスコア70以上を目標に練習。クロージング力が統一され、チーム全体の成約率が20%向上。",
    },
    stats: "チーム成約率が平均20%向上",
  },
  {
    icon: "💼",
    title: "個人事業主・フリーランス",
    problem:
      "一人で営業するため、ロープレ相手がいない。提案・クロージングに不安を抱えたまま商談に臨んでいる。",
    solution:
      "24時間いつでもAIと練習。商談前のウォームアップや、失注後の振り返り練習に最適です。",
    example: {
      scene: "Webデザイナー（フリーランス）",
      product: "Webサイト制作の提案",
      result:
        "商談前にAIロープレでプレゼンのリハーサル。自信を持って提案できるようになり、受注率が向上。",
    },
    stats: "商談への自信度が大幅アップ",
  },
  {
    icon: "📞",
    title: "テレアポ・電話営業の練習",
    problem:
      "電話営業はスピードが命。瞬時の切り返しが求められるが、練習する場がない。",
    solution:
      "電話営業モードでAIと練習。短いやりとりの中でアプローチ→ヒアリング→アポイント獲得の流れを訓練します。",
    example: {
      scene: "SaaS企業のインサイドセールス",
      product: "クラウド勤怠管理システム",
      result:
        "断り文句への切り返しパターンが増え、アポイント獲得率が1.3倍に。",
    },
    stats: "アポ獲得率が平均30%アップ",
  },
];

export default function UseCasesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="px-6 pt-32 pb-16">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-4 text-4xl font-bold">活用シーン</h1>
          <p className="text-lg text-muted">
            あらゆる営業シーンで即キメAIを活用できます
          </p>
        </div>
      </section>

      <section className="px-6 pb-20">
        <div className="mx-auto max-w-4xl space-y-12">
          {useCases.map((uc) => (
            <div
              key={uc.title}
              className="rounded-2xl border border-card-border bg-card overflow-hidden"
            >
              {/* Header */}
              <div className="border-b border-card-border bg-card p-6">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{uc.icon}</span>
                  <div>
                    <h2 className="text-xl font-bold">{uc.title}</h2>
                    <p className="mt-1 text-sm text-accent font-medium">
                      {uc.stats}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Problem / Solution */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4">
                    <div className="mb-2 text-xs font-semibold text-red-400">
                      課題
                    </div>
                    <p className="text-sm text-muted leading-relaxed">
                      {uc.problem}
                    </p>
                  </div>
                  <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-4">
                    <div className="mb-2 text-xs font-semibold text-green-400">
                      解決策
                    </div>
                    <p className="text-sm text-muted leading-relaxed">
                      {uc.solution}
                    </p>
                  </div>
                </div>

                {/* Example */}
                <div className="rounded-xl border border-accent/20 bg-accent/5 p-4">
                  <div className="mb-3 text-xs font-semibold text-accent">
                    活用事例
                  </div>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-muted">シーン:</span>{" "}
                      {uc.example.scene}
                    </div>
                    <div>
                      <span className="text-muted">商材:</span>{" "}
                      {uc.example.product}
                    </div>
                    <div>
                      <span className="text-muted">成果:</span>{" "}
                      {uc.example.result}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-card-border px-6 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-2xl font-bold">
            あなたの営業シーンに合わせてAIが対応
          </h2>
          <p className="mb-8 text-sm text-muted">
            業種・商材・お客さんのタイプを自由に設定できます。
            無料で1日1回試せます。
          </p>
          <Link
            href="/roleplay"
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
