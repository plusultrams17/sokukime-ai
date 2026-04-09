import type { Metadata } from "next";
import Image from "next/image";
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
    icon: "",
    image: "/images/misc/tool-sales-quiz.png",
    keywords: ["営業力 診断", "営業スキル チェック"],
    time: "約3分",
  },
  {
    slug: "script-generator",
    name: "営業トークスクリプト生成",
    description:
      "業種と商材を選ぶだけで、5ステップメソッドに基づくトークスクリプトを自動生成。アプローチからクロージングまでの台本が手に入ります。",
    icon: "",
    image: "/images/misc/tool-script-generator.png",
    keywords: ["トークスクリプト", "営業 台本"],
    time: "約1分",
  },
  {
    slug: "objection-handbook",
    name: "反論切り返しトーク集",
    description:
      "「高い」「検討します」「必要ない」——営業でよくある断り文句30パターンへの切り返しトークを6カテゴリで整理。即実践できる対処法を無料公開。",
    icon: "",
    image: "/images/misc/tool-objection-handbook.png",
    keywords: ["反論処理", "切り返しトーク"],
    time: "読み放題",
  },
  {
    slug: "closing-calculator",
    name: "クロージング率計算ツール",
    description:
      "商談数・提案数・成約数を入力して成約率を自動計算。業種別ベンチマークと比較し、改善すべきポイントを可視化します。",
    icon: "",
    image: "/images/misc/tool-closing-calculator.png",
    keywords: ["成約率 計算", "営業 KPI"],
    time: "約1分",
  },
  {
    slug: "objection-scenario",
    name: "「考えます」切り返しシナリオ",
    description:
      "商談中に「考えます」と言われたら？ あなたの選択でストーリーが分岐。3つのルートで正解パターンを体験学習できます。",
    icon: "",
    image: "",
    keywords: ["考えます 切り返し", "反論処理 シナリオ"],
    time: "約2分",
  },
  {
    slug: "industry-weakness",
    name: "業種別「弱点スキル」ランキング",
    description:
      "12,000人超の診断データから判明した業種別の弱点スキル。あなたの業界の「あるある」が見つかります。",
    icon: "",
    image: "",
    keywords: ["営業 弱点", "業種別 ランキング"],
    time: "閲覧のみ",
  },
  {
    slug: "rebuttal-challenge",
    name: "60秒 切り返しチャレンジ",
    description:
      "賃貸物件の内見中、お客さんの反論に60秒以内で切り返せ。即座に採点＋模範トーク表示。スピードと内容の2軸で実力を測定。",
    icon: "",
    image: "",
    keywords: ["反論 切り返し", "60秒 チャレンジ"],
    time: "約5分",
  },
  {
    slug: "virtual-roleplay",
    name: "3Dバーチャル営業ロープレ",
    description:
      "3D仮想空間の社長室でAI相手に商談体験。リアルな訪問営業シーンをバーチャルで再現。懐疑的な社長に業務効率化SaaSを提案せよ。",
    icon: "",
    image: "",
    keywords: ["3D ロープレ", "バーチャル 商談"],
    time: "約5分",
  },
];

const SITE_URL =
  process.env.NEXT_PUBLIC_APP_URL || "https://seiyaku-coach.vercel.app";

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
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0f1729] to-[#1a2744] px-4 sm:px-6 pt-24 pb-16 sm:pt-32 sm:pb-20">
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm">
            登録不要・完全無料
          </div>
          <h1 className="mb-4 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            営業力を鍛える<span className="text-accent">無料ツール</span>
          </h1>
          <p className="mx-auto max-w-2xl text-base text-white/70 leading-relaxed sm:text-lg">
            今すぐ使える8つの営業支援ツール。
            <br className="hidden sm:block" />
            診断・生成・学習・分析で、あなたの営業スキルを底上げします。
          </p>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="px-4 sm:px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {tools.map((tool) => (
              <Link
                key={tool.slug}
                href={`/tools/${tool.slug}`}
                className="group rounded-2xl border border-card-border bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg sm:p-8"
              >
                <div className="mb-4 flex items-center justify-between">
                  {tool.image ? (
                    <Image src={tool.image} alt={tool.name} width={64} height={64} className="rounded-xl object-cover" />
                  ) : (
                    <span className="text-4xl">{tool.icon}</span>
                  )}
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

      {/* Pro Upsell */}
      <section className="px-4 sm:px-6 pb-8">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-2xl border border-accent/20 bg-gradient-to-br from-accent/5 to-transparent p-8 text-center">
            <h2 className="mb-2 text-xl font-bold text-foreground sm:text-2xl">
              ツールで見つけた課題を<span className="text-accent">Proプラン</span>で克服
            </h2>
            <p className="mb-4 text-sm text-muted leading-relaxed">
              無料ツールでわかった弱点を、無制限AIロープレで集中練習。
              <br className="hidden sm:block" />
              全5カテゴリの詳細スコア＋AIアドバイスで最短でスキルアップ。
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/pricing"
                className="inline-flex h-11 items-center rounded-xl bg-accent px-6 text-sm font-bold text-white transition hover:bg-accent-hover"
              >
                7日間無料でProを試す
              </Link>
              <span className="text-xs text-muted">¥2,980/月 ・ いつでも解約OK</span>
            </div>
          </div>
        </div>
      </section>

      {/* SEO Content */}
      <section className="px-4 sm:px-6 pb-16 sm:pb-24">
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
              成約コーチAIの無料ツールは、この課題を解決するために開発されました。
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
      <section className="px-4 sm:px-6 pb-16 sm:pb-24">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-2xl font-bold text-foreground sm:text-3xl">
            ツールで見つけた課題をAIロープレで克服
          </h2>
          <p className="mb-8 text-sm text-muted sm:text-base">
            診断結果やスクリプトを活かして、AIと実践的な営業練習を始めましょう。
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/learn" className="morph-btn">
              <span className="btn-fill" />
              <span className="shadow" />
              <span className="btn-text">
                {"無料で営業の型を学ぶ".split("").map((char, i) => (
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
            <Link
              href="/roleplay"
              className="inline-flex h-12 items-center justify-center rounded-xl border-2 border-accent/30 bg-accent/5 px-6 text-sm font-bold text-accent transition hover:bg-accent/10 hover:border-accent/50 sm:min-w-[220px]"
            >
              学んだらAIで練習する
            </Link>
          </div>
        </div>
      </section>

      {/* Industry link */}
      <section className="px-4 sm:px-6 pb-16 sm:pb-24">
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
