import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { JsonLd } from "@/components/json-ld";

export const metadata: Metadata = {
  title: "成約コーチ AIについて",
  description:
    "成約コーチ AIは営業心理学に基づくAI営業ロープレコーチングサービスです。営業マンが24時間いつでも練習できる環境を提供します。",
  alternates: { canonical: "/about" },
};

const values = [
  {
    icon: "",
    image: "/images/pages/about-value-practice.png",
    title: "実践主義",
    desc: "理論だけでなく、繰り返し実践することで営業力は身につく。AIとの反復練習で「型」を体に染み込ませます。",
  },
  {
    icon: "",
    image: "/images/pages/about-value-datadriven.png",
    title: "データドリブン",
    desc: "感覚ではなく、5ステップの定量スコアで弱点を可視化。何を改善すべきか明確にします。",
  },
  {
    icon: "",
    image: "/images/pages/about-value-accessible.png",
    title: "アクセシブル",
    desc: "24時間いつでも、スマホからでも練習可能。先輩の時間を奪わず、自分のペースでスキルアップ。",
  },
];

export default function AboutPage() {
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://seiyaku-coach.vercel.app";

  return (
    <div className="min-h-screen bg-background">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "AboutPage",
              "@id": `${siteUrl}/about#webpage`,
              name: "成約コーチ AIについて",
              description:
                "成約コーチ AIは、営業心理学の理論と現場経験から体系化された「成約5ステップメソッド」をAI技術で誰でも練習できるようにした営業ロープレコーチングサービスです。",
              url: `${siteUrl}/about`,
              isPartOf: { "@id": `${siteUrl}/#website` },
              about: { "@id": `${siteUrl}/#organization` },
              inLanguage: "ja",
            },
            {
              "@type": "BreadcrumbList",
              "@id": `${siteUrl}/about#breadcrumb`,
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "ホーム", item: siteUrl },
                { "@type": "ListItem", position: 2, name: "成約コーチ AIについて", item: `${siteUrl}/about` },
              ],
            },
          ],
        }}
      />
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
            成約コーチ AIは、AI × 営業心理学で営業マンの練習環境を変えるサービスです。
            <br />
            先輩に頼まなくても、24時間いつでも、何度でも営業ロープレができる世界を目指しています。
          </p>
        </div>
      </section>

      {/* AEO Definition */}
      <section className="border-t border-card-border px-6 py-12">
        <div className="mx-auto max-w-3xl">
          <p className="text-sm leading-relaxed text-muted">
            <strong className="text-foreground">成約コーチ AI</strong>は、営業心理学の理論と現場経験から体系化された「成約5ステップメソッド」（アプローチ・ヒアリング・プレゼン・クロージング・反論処理）をAI技術で誰でも練習できるようにした営業ロープレコーチングサービスです。「練習相手がいない」「恥ずかしくて練習できない」という営業マンの課題を、AIお客さん役との24時間無制限ロープレで解決します。
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
                <Image src="/images/pages/about-problem-burden.png" alt="練習相手の負担" width={40} height={40} className="rounded-lg flex-shrink-0" />
                <span>
                  ロープレは先輩や上司に頼む必要があり、相手の時間を奪ってしまう
                </span>
              </div>
              <div className="flex items-start gap-3">
                <Image src="/images/pages/about-problem-unprepared.png" alt="練習不足" width={40} height={40} className="rounded-lg flex-shrink-0" />
                <span>
                  練習不足のまま本番に臨み、成果につながらないまま終わってしまう
                </span>
              </div>
              <div className="flex items-start gap-3">
                <Image src="/images/pages/about-problem-unknown.png" alt="弱点不明" width={40} height={40} className="rounded-lg flex-shrink-0" />
                <span>
                  自分の弱点がわからず、何を改善すべきかも不明確
                </span>
              </div>
            </div>
            <p>
              成約コーチ AIは、これらの課題をAIの力で解決します。
              営業心理学に基づいた体系的な営業手法をAIに搭載し、
              いつでもどこでも質の高いロープレ練習ができる環境を提供します。
            </p>
          </div>
        </div>
      </section>

      {/* Method */}
      <section className="border-t border-card-border px-6 py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-4 text-2xl font-bold">成約5ステップメソッドとは</h2>
          <p className="mb-8 text-sm text-muted leading-relaxed">
            成約5ステップメソッドは、営業心理学に基づく体系的な営業手法です。
            アプローチからクロージング、反論処理までの5ステップで構成されています。
          </p>
          <div className="space-y-3">
            {[
              {
                step: "1",
                name: "アプローチ",
                desc: "信頼構築→ゴール共有→心理的安全の確保。お客さんとの信頼関係を構築する最初のステップ。",
              },
              {
                step: "2",
                name: "ヒアリング",
                desc: "質問でニーズを引き出し、問題を深掘り。お客さんが自分で課題に気づくよう導く。",
              },
              {
                step: "3",
                name: "プレゼン",
                desc: "特徴ではなく価値（ベネフィット）で伝える。お客さんの未来を描き、商品の価値を実感してもらう。",
              },
              {
                step: "4",
                name: "クロージング",
                desc: "社会的証明・一貫性の活用・お客様の声・段階的訴求で、自然な流れで契約へ。",
              },
              {
                step: "5",
                name: "反論処理",
                desc: "共感→確認→根拠提示→行動促進の4ステップで、反論を成約に変える。",
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

      {/* Founder Credibility — 競合失敗分析: 信頼性の欠如が最大の離脱要因 */}
      <section className="border-t border-card-border px-6 py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-8 text-2xl font-bold">開発の背景</h2>
          <div className="rounded-2xl border border-card-border bg-card p-6 sm:p-8">
            <div className="mb-6 flex items-start gap-4">
              <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-accent/10 text-2xl">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </div>
              <div>
                <p className="text-lg font-bold text-foreground">成約コーチ AI 開発チーム</p>
                <p className="text-sm text-muted">営業現場の課題をテクノロジーで解決する</p>
              </div>
            </div>
            <div className="space-y-4 text-sm leading-relaxed text-muted">
              <p>
                成約コーチ AIは、<strong className="text-foreground">「営業の練習環境がない」</strong>という現場の声から生まれました。
              </p>
              <p>
                営業研修は1回5万円以上が相場。しかも月1回の集合研修では、
                <strong className="text-foreground">87%の内容が30日以内に忘れられる</strong>
                というデータがあります（ES Research調べ）。
                先輩へのロープレ依頼も、相手の時間を奪う負い目があり、十分な回数をこなせないのが現実です。
              </p>
              <p>
                成約5ステップメソッドは、営業心理学の研究と現場で実証された営業手法を体系化したものです。
                アプローチ・ヒアリング・プレゼン・クロージング・反論処理の5段階を、
                <strong className="text-foreground">AIコーチが定量的に評価</strong>することで、
                「何が足りないか」を明確にします。
              </p>
              <p>
                私たちは、すべての営業パーソンが<strong className="text-foreground">場所・時間・費用の制約なく</strong>、
                質の高い練習ができる環境を提供することを目指しています。
              </p>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-card-border bg-background p-4 text-center">
                <p className="text-2xl font-bold text-accent">22</p>
                <p className="text-xs text-muted">体系化されたレッスン</p>
              </div>
              <div className="rounded-xl border border-card-border bg-background p-4 text-center">
                <p className="text-2xl font-bold text-accent">5</p>
                <p className="text-xs text-muted">営業心理学ベースのステップ</p>
              </div>
              <div className="rounded-xl border border-card-border bg-background p-4 text-center">
                <p className="text-2xl font-bold text-accent">24h</p>
                <p className="text-xs text-muted">いつでも練習可能</p>
              </div>
            </div>
          </div>

          {/* 成果保証 — 競合で欠けていた最大のポイント */}
          <div className="mt-8 rounded-2xl border-2 border-accent/30 bg-accent/5 p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-accent text-xl text-white">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              </div>
              <div>
                <h3 className="mb-2 text-lg font-bold text-foreground">14日間返金保証</h3>
                <p className="text-sm leading-relaxed text-muted">
                  Proプランにご満足いただけなかった場合、14日以内であれば
                  <strong className="text-foreground">全額返金</strong>いたします。
                  安心してお試しいただけます。
                </p>
                <p className="mt-2 text-xs text-muted">
                  ※ 14日間で7回以上のロープレ実施が条件です。詳細は利用規約をご確認ください。
                </p>
              </div>
            </div>
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
                <div className="mb-3">{v.image ? <Image src={v.image} alt={v.title} width={64} height={64} className="mx-auto rounded-xl" /> : <span className="text-3xl">{v.icon}</span>}</div>
                <h3 className="mb-2 font-bold">{v.title}</h3>
                <p className="text-xs text-muted leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related Links */}
      <section className="border-t border-card-border px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-6 text-xl font-bold">もっと詳しく</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <Link href="/features" className="flex items-center gap-3 rounded-xl border border-card-border bg-card p-4 transition hover:border-accent/50">
              <Image src="/images/pages/about-link-features.png" alt="機能紹介" width={48} height={48} className="rounded-lg flex-shrink-0" />
              <div>
                <p className="text-sm font-bold">機能紹介</p>
                <p className="text-xs text-muted">AIロープレ・コーチ・スコアリング</p>
              </div>
            </Link>
            <Link href="/use-cases" className="flex items-center gap-3 rounded-xl border border-card-border bg-card p-4 transition hover:border-accent/50">
              <Image src="/images/pages/about-link-usecases.png" alt="活用シーン" width={48} height={48} className="rounded-lg flex-shrink-0" />
              <div>
                <p className="text-sm font-bold">活用シーン</p>
                <p className="text-xs text-muted">新人研修・チーム・個人・テレアポ</p>
              </div>
            </Link>
            <Link href="/blog/sokketsu-eigyo-method-guide" className="flex items-center gap-3 rounded-xl border border-card-border bg-card p-4 transition hover:border-accent/50">
              <Image src="/images/pages/about-link-method.png" alt="メソッド解説" width={48} height={48} className="rounded-lg flex-shrink-0" />
              <div>
                <p className="text-sm font-bold">成約5ステップメソッド解説</p>
                <p className="text-xs text-muted">ブログで詳しく学ぶ</p>
              </div>
            </Link>
            <Link href="/pricing" className="flex items-center gap-3 rounded-xl border border-card-border bg-card p-4 transition hover:border-accent/50">
              <Image src="/images/pages/about-link-pricing.png" alt="料金プラン" width={48} height={48} className="rounded-lg flex-shrink-0" />
              <div>
                <p className="text-sm font-bold">料金プラン</p>
                <p className="text-xs text-muted">無料プラン・Proプラン比較</p>
              </div>
            </Link>
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
            無料で体験できます。登録不要で今すぐお試しください。
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
