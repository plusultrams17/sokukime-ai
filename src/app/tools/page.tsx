import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { StickyCTA } from "@/components/sticky-cta";
import { JsonLd } from "@/components/json-ld";

export const metadata: Metadata = {
  title: "無料営業ツール｜営業力診断・トークスクリプト・反論切り返し",
  description:
    "登録不要・完全無料の営業支援ツール集。営業力診断テスト、トークスクリプト自動生成、反論切り返しトーク集、クロージング率計算ツールで営業スキルを向上。",
  alternates: {
    canonical: "/tools",
  },
};

const tools = [
  {
    slug: "sales-quiz",
    name: "営業力診断テスト",
    description:
      "10問の質問でアプローチ・ヒアリング・プレゼン・クロージング・反論処理の5項目を診断。あなたの強みと弱点が一目でわかります。",
    icon: "📊",
    keywords: ["営業力 診断", "営業スキル チェック"],
    time: "約3分",
  },
  {
    slug: "script-generator",
    name: "営業トークスクリプト生成",
    description:
      "業種と商材を選ぶだけで、5ステップメソッドに基づくトークスクリプトを自動生成。アプローチからクロージングまでの台本が手に入ります。",
    icon: "📝",
    keywords: ["トークスクリプト", "営業 台本"],
    time: "約1分",
  },
  {
    slug: "objection-handbook",
    name: "反論切り返しトーク集",
    description:
      "「高い」「検討します」「必要ない」——営業でよくある断り文句30パターンへの切り返しトークを6カテゴリで整理。即実践できる対処法を無料公開。",
    icon: "🛡️",
    keywords: ["反論処理", "切り返しトーク"],
    time: "読み放題",
  },
  {
    slug: "closing-calculator",
    name: "クロージング率計算ツール",
    description:
      "商談数・提案数・成約数を入力して成約率を自動計算。業種別ベンチマークと比較し、改善すべきポイントを可視化します。",
    icon: "🧮",
    keywords: ["成約率 計算", "営業 KPI"],
    time: "約1分",
  },
];

const SITE_URL =
  process.env.NEXT_PUBLIC_APP_URL || "https://sokukime-ai.vercel.app";

export default function ToolsPage() {
  const jsonLdData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${SITE_URL}/tools#page`,
        name: "無料営業ツール集",
        description:
          "登録不要・完全無料の営業支援ツール。営業力診断・トークスクリプト生成・反論切り返し・成約率計算。",
        url: `${SITE_URL}/tools`,
        isPartOf: { "@id": `${SITE_URL}/#website` },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "ホーム", item: SITE_URL },
          {
            "@type": "ListItem",
            position: 2,
            name: "無料ツール",
            item: `${SITE_URL}/tools`,
          },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      <JsonLd data={jsonLdData} />
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0f1729] to-[#1a2744] px-6 pt-24 pb-16 sm:pt-32 sm:pb-20">
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm">
            登録不要・完全無料
          </div>
          <h1 className="mb-4 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            営業力を鍛える<span className="text-accent">無料ツール</span>
          </h1>
          <p className="mx-auto max-w-2xl text-base text-white/70 leading-relaxed sm:text-lg">
            今すぐ使える4つの営業支援ツール。
            <br className="hidden sm:block" />
            診断・生成・学習・分析で、あなたの営業スキルを底上げします。
          </p>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {tools.map((tool) => (
              <Link
                key={tool.slug}
                href={`/tools/${tool.slug}`}
                className="group rounded-2xl border border-card-border bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg sm:p-8"
              >
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-4xl">{tool.icon}</span>
                  <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
                    {tool.time}
                  </span>
                </div>
                <h2 className="mb-2 text-lg font-bold text-foreground group-hover:text-accent transition-colors sm:text-xl">
                  {tool.name}
                </h2>
                <p className="mb-4 text-sm leading-relaxed text-muted">
                  {tool.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {tool.keywords.map((kw) => (
                    <span
                      key={kw}
                      className="rounded-full bg-background px-3 py-1 text-xs text-muted"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
                <div className="mt-4 flex items-center gap-1 text-sm font-medium text-accent opacity-0 transition-opacity group-hover:opacity-100">
                  使ってみる
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SEO Content */}
      <section className="px-6 pb-16 sm:pb-24">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-6 text-2xl font-bold text-foreground sm:text-3xl">
            なぜ無料の営業ツールが必要なのか
          </h2>
          <div className="space-y-4 text-sm leading-relaxed text-muted sm:text-base">
            <p>
              営業スキルの向上には「現状の把握」と「正しい型の習得」が不可欠です。
              しかし、多くの営業パーソンは日々の業務に追われ、自分のスキルを客観的に評価する機会がありません。
            </p>
            <p>
              成約コーチ AIの無料ツールは、この課題を解決するために開発されました。
              営業力診断テストであなたの強みと弱みを可視化し、
              トークスクリプト生成ツールで営業の「型」を手に入れ、
              反論切り返しトーク集で実践的な対処法を学び、
              クロージング率計算ツールで数値的な改善ポイントを特定できます。
            </p>
            <p>
              すべてのツールは登録不要・完全無料でお使いいただけます。
              ツールで得た知見をさらに深めたい方は、
              <Link
                href="/roleplay"
                className="text-accent underline underline-offset-4 hover:text-accent-hover"
              >
                AIロープレ
              </Link>
              で実践練習をお試しください。AIがリアルなお客さん役を演じ、
              あなたのスキルをリアルタイムでフィードバックします。
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-16 sm:pb-24">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-2xl font-bold text-foreground sm:text-3xl">
            ツールで見つけた課題をAIロープレで克服
          </h2>
          <p className="mb-8 text-sm text-muted sm:text-base">
            診断結果やスクリプトを活かして、AIと実践的な営業練習を始めましょう。
          </p>
          <Link href="/roleplay" className="morph-btn">
            <span className="btn-fill" />
            <span className="shadow" />
            <span className="btn-text">
              {"今すぐAIと商談してみる".split("").map((char, i) => (
                <span key={i} style={{ "--i": i } as React.CSSProperties}>
                  {char}
                </span>
              ))}
            </span>
            <span className="orbit-dots">
              <span />
              <span />
              <span />
              <span />
            </span>
            <span className="corners">
              <span />
              <span />
              <span />
              <span />
            </span>
          </Link>
        </div>
      </section>

      {/* Industry link */}
      <section className="px-6 pb-16 sm:pb-24">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm text-muted">
            業種別の営業ロープレもあります →{" "}
            <Link
              href="/industry"
              className="text-accent underline underline-offset-4 hover:text-accent-hover"
            >
              業種別ページを見る
            </Link>
          </p>
        </div>
      </section>

      <Footer />
      <StickyCTA />
    </div>
  );
}
