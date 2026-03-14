import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { JsonLd } from "@/components/json-ld";
import { StickyCTA } from "@/components/sticky-cta";

/* ─── Data ─── */

const stats = [
  { value: "60%超", label: "契約率" },
  { value: "4.5年", label: "新規営業経験" },
  { value: "5ステップ", label: "即決営業メソッド" },
];

const socialProofNumbers = [
  { value: "500+", label: "登録ユーザー" },
  { value: "3,000+", label: "ロープレ実施回数" },
  { value: "4.7/5.0", label: "ユーザー満足度" },
];

const testimonials = [
  {
    name: "T.S.",
    role: "不動産営業 / 入社2年目",
    text: "先輩に何度も頼まなくても、AIと何度でも練習できるのが最高。クロージングの型が身について、月の契約数が1.5倍になりました。",
    score: "78",
  },
  {
    name: "M.K.",
    role: "保険営業 / マネージャー",
    text: "チームの新人教育に導入。ロープレの回数が圧倒的に増えて、新人の独り立ちまでの期間が半分になった。",
    score: "85",
  },
  {
    name: "Y.A.",
    role: "SaaS営業 / 3年目",
    text: "即決営業メソッドの切り返し話法が実践で使えるレベルまで鍛えられる。コーチ機能が本当に優秀。",
    score: "92",
  },
];

const beforeItems = [
  { text: "先輩に頼まないとロープレできない", icon: "😩" },
  { text: "練習不足で本番が怖い", icon: "😰" },
  { text: "切り返しパターンが少ない", icon: "🤷" },
  { text: "自分の弱点がわからない", icon: "❓" },
];

const afterItems = [
  { text: "24時間いつでもAIとロープレ", icon: "🔥" },
  { text: "場数を踏んで自信がつく", icon: "💪" },
  { text: "即決営業の型が体に染みつく", icon: "🎯" },
  { text: "AIスコアで弱点を可視化", icon: "📊" },
];

const steps = [
  {
    num: "01",
    title: "業種・商材を入力",
    desc: "あなたの営業シーンに合わせたリアルなお客さんをAIが生成",
  },
  {
    num: "02",
    title: "AIとロープレ開始",
    desc: "AIが実際のお客さんのように反応。アプローチからクロージングまで実践",
  },
  {
    num: "03",
    title: "即決営業スコアで採点",
    desc: "先回り・ヒアリング・クロージング・切り返しを即決営業メソッドで分析",
  },
];

const serviceCategories = [
  { icon: "🎯", title: "ロープレ", desc: "AIと営業ロープレ" },
  { icon: "📋", title: "ワークシート", desc: "営業準備シート" },
  { icon: "🧠", title: "コーチング", desc: "リアルタイム指導" },
  { icon: "📊", title: "スコアリング", desc: "即決営業で採点" },
  { icon: "🔍", title: "分析", desc: "弱点を可視化" },
];

const methods = [
  { name: "アプローチ", desc: "褒める→先回り→心の扉を開く", level: "初級" },
  {
    name: "ヒアリング",
    desc: "質問でニーズを引き出し、問題を深掘り",
    level: "初級",
  },
  { name: "プレゼン", desc: "理屈ではなく感動で動かす", level: "初級" },
  {
    name: "クロージング",
    desc: "過半数・一貫性通し・カギカッコ・ポジティブトリプル",
    level: "中級",
  },
  {
    name: "反論処理",
    desc: "共感→フック→AREA話法→訴求の型で切り返し",
    level: "上級",
  },
];

const faqs = [
  {
    q: "本当に無料で使えますか？",
    a: "はい。無料アカウントで1日1回AIロープレができます。クレジットカードの登録も不要です。",
  },
  {
    q: "どんな業種・商材でも使えますか？",
    a: "はい。あなたの業種・商材を入力すると、AIがそのシーンに合ったお客さん役を演じます。不動産、保険、SaaS、教育など幅広くご利用いただけます。",
  },
  {
    q: "即決営業メソッドとは？",
    a: "即決営業メソッドは、アプローチ→ヒアリング→プレゼン→クロージング→反論処理の5ステップで構成された、体系的な営業手法です。契約率60%超の実績を持つメソッドをAIが正確に評価します。",
  },
  {
    q: "Proプランはいつでも解約できますか？",
    a: "はい、いつでも解約可能です。解約後も現在の請求期間の終了まで利用できます。",
  },
  {
    q: "スマートフォンでも使えますか？",
    a: "はい。ブラウザから利用でき、スマートフォン・タブレット・PCすべてに対応しています。",
  },
];

/* ─── Page ─── */

export default async function Home() {
  let isLoggedIn = false;
  try {
    const supabase = await createClient();
    if (supabase) {
      const { data: { user } } = await supabase.auth.getUser();
      isLoggedIn = !!user;
    }
  } catch {
    // Supabase unavailable — render as guest
  }

  const roleplayHref = "/roleplay";
  const worksheetHref = "/worksheet";

  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "即キメAI",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description:
      "AI × 即決営業メソッドで営業ロープレを何度でも練習。即決営業の5ステップを身につけて成約率を上げる。",
    offers: [
      {
        "@type": "Offer",
        price: "0",
        priceCurrency: "JPY",
        description: "無料プラン（1日1回）",
      },
      {
        "@type": "Offer",
        price: "2980",
        priceCurrency: "JPY",
        description: "Proプラン（無制限）",
      },
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.7",
      ratingCount: "500",
      bestRating: "5",
    },
  };

  return (
    <div className="min-h-screen bg-background">
      <JsonLd data={jsonLdData} />

      {/* Header */}
      <Header user={{ isLoggedIn }} />

      {/* Hero */}
      <section className="relative overflow-hidden px-6 pt-28 pb-20 sm:pt-36 sm:pb-28">
        {/* Decorative blobs */}
        <div className="blob blob-cream" style={{ width: 400, height: 400, top: -80, right: -100 }} />
        <div className="blob blob-teal" style={{ width: 350, height: 350, bottom: -60, left: -80 }} />
        <div className="blob blob-pink" style={{ width: 200, height: 200, top: '40%', left: '60%' }} />

        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-block rounded-full border border-accent/20 bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent">
            即決営業メソッド搭載 | 500+人が利用中
          </div>

          <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-6xl">
            AIとロープレして
            <br />
            <span className="text-accent">成約率を上げろ。</span>
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-lg text-muted">
            「考えます」を「お願いします」に変える営業の型を、AIと反復練習。
            <br />
            24時間いつでも、何度でも。
          </p>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center" data-hero-cta>
            <Link
              href={roleplayHref}
              className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-accent px-10 text-lg font-bold text-white shadow-lg shadow-accent/20 transition hover:bg-accent-hover hover:shadow-xl sm:w-auto"
            >
              🎯 ロープレする
            </Link>
            <Link
              href={worksheetHref}
              className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl border-2 border-accent bg-white px-10 text-lg font-bold text-accent shadow-lg shadow-accent/10 transition hover:bg-accent/5 hover:shadow-xl sm:w-auto"
            >
              📋 分析を行う
            </Link>
          </div>

          <p className="mt-4 text-xs text-muted">
            &#10003; 無料で体験可能 &#10003; 登録不要で今すぐ試せる
          </p>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {stats.map((s) => (
              <div key={s.label} className="rounded-2xl bg-white p-6 shadow-sm">
                <div className="text-3xl font-bold text-accent">{s.value}</div>
                <div className="mt-1 text-sm text-muted">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Categories */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-12 text-center text-2xl font-bold text-foreground">
            サービスカテゴリ
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
            {serviceCategories.map((cat) => (
              <div
                key={cat.title}
                className="flex flex-col items-center gap-3 rounded-2xl bg-white p-6 shadow-sm transition hover:shadow-md"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blob-teal text-2xl">
                  {cat.icon}
                </div>
                <div className="text-sm font-bold text-foreground">{cat.title}</div>
                <div className="text-xs text-muted">{cat.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="relative overflow-hidden px-6 py-24">
        <div className="blob blob-cream" style={{ width: 300, height: 300, top: 40, left: -80 }} />
        <div className="blob blob-teal" style={{ width: 250, height: 250, bottom: 20, right: -60 }} />

        <div className="relative z-10 mx-auto max-w-5xl">
          <h2 className="mb-4 text-center text-3xl font-bold text-foreground">
            営業マンに選ばれています
          </h2>
          <p className="mb-12 text-center text-muted">
            実際に即キメAIを使って成果を出しているユーザーの声
          </p>

          {/* Numbers */}
          <div className="mb-16 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {socialProofNumbers.map((n) => (
              <div
                key={n.label}
                className="rounded-2xl bg-white p-6 text-center shadow-sm"
              >
                <div className="text-3xl font-bold text-accent">{n.value}</div>
                <div className="mt-1 text-sm text-muted">{n.label}</div>
              </div>
            ))}
          </div>

          {/* Testimonials */}
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="relative rounded-2xl bg-white p-6 shadow-sm"
              >
                {/* Score badge */}
                <div className="absolute -top-3 right-4 rounded-full bg-accent px-3 py-1 text-xs font-bold text-white shadow-sm">
                  スコア {t.score}
                </div>
                <p className="mb-4 text-sm leading-relaxed text-muted">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="border-t border-card-border pt-4">
                  <div className="text-sm font-semibold text-foreground">{t.name}</div>
                  <div className="text-xs text-muted">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Before / After */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-4 text-center text-3xl font-bold text-foreground">
            即キメAIで変わること
          </h2>
          <p className="mb-12 text-center text-muted">
            練習環境の悩みを解消し、営業力を飛躍させる
          </p>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Before */}
            <div className="rounded-2xl bg-white p-8 shadow-sm">
              <div className="mb-6 text-center">
                <span className="inline-block rounded-full bg-gray-100 px-4 py-1.5 text-sm font-semibold text-muted">
                  Before
                </span>
              </div>
              <ul className="space-y-4">
                {beforeItems.map((item) => (
                  <li
                    key={item.text}
                    className="flex items-start gap-3 text-sm text-muted"
                  >
                    <span className="mt-0.5 text-lg leading-none">
                      {item.icon}
                    </span>
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* After */}
            <div className="rounded-2xl border-2 border-accent/20 bg-accent/5 p-8 shadow-sm">
              <div className="mb-6 text-center">
                <span className="inline-block rounded-full bg-accent/10 px-4 py-1.5 text-sm font-semibold text-accent">
                  After
                </span>
              </div>
              <ul className="space-y-4">
                {afterItems.map((item) => (
                  <li
                    key={item.text}
                    className="flex items-start gap-3 text-sm text-foreground"
                  >
                    <span className="mt-0.5 text-lg leading-none">
                      {item.icon}
                    </span>
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="relative overflow-hidden px-6 py-24">
        <div className="blob blob-pink" style={{ width: 300, height: 300, top: -40, right: -60 }} />

        <div className="relative z-10 mx-auto max-w-5xl">
          <h2 className="mb-4 text-center text-3xl font-bold text-foreground">
            使い方は3ステップ
          </h2>
          <p className="mb-16 text-center text-muted">
            複雑な設定は不要。すぐにロープレを始められます。
          </p>
          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((step) => (
              <div
                key={step.num}
                className="rounded-2xl bg-white p-8 shadow-sm"
              >
                <div className="mb-4 text-4xl font-black text-accent/20">
                  {step.num}
                </div>
                <h3 className="mb-2 text-xl font-bold text-foreground">{step.title}</h3>
                <p className="text-sm leading-relaxed text-muted">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Method */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-4 text-center text-3xl font-bold text-foreground">
            即決営業 5ステップメソッド
          </h2>
          <p className="mb-16 text-center text-muted">
            体系化された営業の「型」をAIが正確に評価します
          </p>
          <div className="space-y-4">
            {methods.map((m, i) => (
              <div
                key={m.name}
                className="flex items-center gap-6 rounded-2xl bg-white p-6 shadow-sm"
              >
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-accent/10 text-lg font-bold text-accent">
                  {i + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-bold text-foreground">{m.name}</h3>
                    <span className="rounded-full bg-blob-teal px-2.5 py-0.5 text-xs font-medium text-accent">
                      {m.level}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="relative overflow-hidden px-6 py-24">
        <div className="blob blob-cream" style={{ width: 250, height: 250, bottom: -40, left: -60 }} />

        <div className="relative z-10 mx-auto max-w-3xl">
          <h2 className="mb-4 text-center text-3xl font-bold text-foreground">
            よくある質問
          </h2>
          <p className="mb-12 text-center text-muted">
            即キメAIについてのよくある質問にお答えします
          </p>
          <div className="space-y-3">
            {faqs.map((faq) => (
              <details
                key={faq.q}
                className="group rounded-2xl bg-white shadow-sm"
              >
                <summary className="flex cursor-pointer items-center justify-between px-6 py-5 text-sm font-semibold text-foreground [&::-webkit-details-marker]:hidden list-none">
                  <span>{faq.q}</span>
                  <svg
                    className="h-4 w-4 flex-shrink-0 text-muted transition-transform duration-200 group-open:rotate-180"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </summary>
                <div className="border-t border-card-border px-6 pb-5 pt-4 text-sm leading-relaxed text-muted">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden px-6 py-24">
        <div className="blob blob-teal" style={{ width: 400, height: 400, top: -100, left: '30%' }} />

        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground">
            今すぐ営業力を鍛えよう
          </h2>
          <p className="mb-4 text-muted">
            無料アカウントで1日1回ロープレできます。Proプランなら無制限。
          </p>
          <p className="mb-10 text-xs text-muted">
            &#10003; クレジットカード不要 &#10003; 30秒で登録完了 &#10003;
            いつでも解約OK
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href={roleplayHref}
              className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-accent px-10 text-lg font-bold text-white shadow-lg shadow-accent/20 transition hover:bg-accent-hover hover:shadow-xl"
            >
              🎯 ロープレする
            </Link>
            <Link
              href={worksheetHref}
              className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl border-2 border-accent bg-white px-10 text-lg font-bold text-accent shadow-lg shadow-accent/10 transition hover:bg-accent/5 hover:shadow-xl"
            >
              📋 分析を行う
            </Link>
          </div>
          <div className="mt-4">
            <Link
              href="/pricing"
              className="text-sm text-muted transition hover:text-accent hover:underline"
            >
              料金プランを見る →
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* Sticky CTA (client component) */}
      <StickyCTA />
    </div>
  );
}
