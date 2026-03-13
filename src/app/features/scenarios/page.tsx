import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "シナリオカスタマイズ機能",
  description:
    "即キメAIのシナリオカスタマイズ機能。営業シーン、お客さんのタイプ、難易度を自由に設定して、リアルな営業ロープレを練習できます。",
  alternates: { canonical: "/features/scenarios" },
};

const scenes = [
  {
    icon: "📞",
    name: "電話営業",
    desc: "テレアポ・電話商談のシミュレーション。短い会話の中でアポイントを取る練習に最適。",
    tips: "素早い切り返しと簡潔なトークが求められます",
  },
  {
    icon: "🏠",
    name: "訪問営業",
    desc: "お客さん宅・会社に訪問するシーンを再現。対面ならではの信頼構築から契約までの流れを練習。",
    tips: "アプローチから丁寧に信頼関係を築くことがポイント",
  },
  {
    icon: "📩",
    name: "問い合わせ対応",
    desc: "お客さんからの問い合わせに対応するシーン。ニーズが顕在化しているお客さんへの提案を練習。",
    tips: "お客さんの関心を的確にキャッチして、提案につなげましょう",
  },
];

const customerTypes = [
  {
    icon: "👤",
    name: "個人のお客さん",
    desc: "一般消費者への営業。感情に寄り添ったアプローチが重要です。",
  },
  {
    icon: "👔",
    name: "会社オーナー・社長",
    desc: "経営者への営業。ROIや経営課題の解決を軸にした提案が求められます。",
  },
  {
    icon: "📊",
    name: "部長・課長クラス",
    desc: "決裁権を持つ管理職への営業。上への説明のしやすさも考慮した提案を。",
  },
  {
    icon: "🙋",
    name: "担当者・一般社員",
    desc: "現場の担当者への営業。上長への起案をサポートする提案が効果的です。",
  },
];

const difficulties = [
  {
    level: "🟢 素直なお客さん",
    desc: "比較的前向きで、話を聞いてくれるタイプ。初心者の練習に最適。基本の型を身につけるのに向いています。",
    techniques: "アプローチの型、基本的なヒアリング、シンプルなクロージング",
  },
  {
    level: "🟡 慎重なお客さん",
    desc: "「考えます」「検討します」が口癖の慎重派。切り返しの練習に最適。中級者向け。",
    techniques: "深掘りヒアリング、感情に訴えるプレゼン、粘り強いクロージング",
  },
  {
    level: "🔴 手強いお客さん",
    desc: "反論が多く、簡単には首を縦に振らないタイプ。反論処理の実践練習に。上級者向け。",
    techniques: "AREA話法、共感→フック→訴求、複数回のクロージングアプローチ",
  },
];

export default function ScenariosFeaturePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="px-6 pt-32 pb-16">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-4 text-5xl">🎭</div>
          <h1 className="mb-4 text-4xl font-bold">シナリオカスタマイズ</h1>
          <p className="text-lg text-muted">
            あなたの営業シーンに合わせて、
            <br />
            AIが最適なお客さん役を演じます
          </p>
        </div>
      </section>

      {/* Scenes */}
      <section className="px-6 pb-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-6 text-2xl font-bold">営業シーン</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {scenes.map((s) => (
              <div
                key={s.name}
                className="rounded-2xl border border-card-border bg-card p-6"
              >
                <div className="text-3xl mb-3">{s.icon}</div>
                <h3 className="font-bold mb-2">{s.name}</h3>
                <p className="text-xs text-muted leading-relaxed mb-3">
                  {s.desc}
                </p>
                <div className="rounded-lg bg-accent/5 border border-accent/20 p-2 text-[11px] text-accent">
                  {s.tips}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Types */}
      <section className="border-t border-card-border px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-6 text-2xl font-bold">お客さんのタイプ</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {customerTypes.map((ct) => (
              <div
                key={ct.name}
                className="flex items-start gap-3 rounded-xl border border-card-border bg-card p-5"
              >
                <span className="text-2xl">{ct.icon}</span>
                <div>
                  <h3 className="font-bold">{ct.name}</h3>
                  <p className="mt-1 text-xs text-muted leading-relaxed">
                    {ct.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Difficulty */}
      <section className="border-t border-card-border px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-6 text-2xl font-bold">難易度設定</h2>
          <div className="space-y-4">
            {difficulties.map((d) => (
              <div
                key={d.level}
                className="rounded-2xl border border-card-border bg-card p-6"
              >
                <h3 className="text-lg font-bold mb-2">{d.level}</h3>
                <p className="text-sm text-muted leading-relaxed mb-3">
                  {d.desc}
                </p>
                <div className="text-xs text-muted">
                  <span className="font-medium text-foreground">
                    練習できるテクニック:
                  </span>{" "}
                  {d.techniques}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Input */}
      <section className="border-t border-card-border px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-6 text-2xl font-bold">商材の自由入力</h2>
          <div className="rounded-2xl border border-card-border bg-card p-6">
            <p className="text-sm text-muted leading-relaxed mb-4">
              あなたが実際に売っている商材・サービスを自由に入力できます。
              AIがその商材に合わせたお客さんを演じるので、リアルな練習が可能です。
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                "外壁塗装",
                "法人向けクラウド",
                "学習塾の入会",
                "生命保険",
                "太陽光パネル",
                "不動産売買",
                "SaaSツール",
                "研修サービス",
              ].map((example) => (
                <span
                  key={example}
                  className="rounded-full border border-card-border px-3 py-1 text-xs text-muted"
                >
                  {example}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-card-border px-6 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-2xl font-bold">
            あなたの営業シーンで練習してみよう
          </h2>
          <p className="mb-8 text-sm text-muted">
            業種・商材・お客さんのタイプを自由に設定可能。無料で試せます。
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/signup"
              className="inline-flex h-14 items-center justify-center rounded-xl bg-accent px-10 text-lg font-bold text-white transition hover:bg-accent-hover"
            >
              無料で始める
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
