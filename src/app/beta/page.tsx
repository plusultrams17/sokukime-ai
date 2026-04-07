import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { StickyCTA } from "@/components/sticky-cta";
import { JsonLd } from "@/components/json-ld";
import { BetaSignupForm } from "@/components/beta-signup-form";

export const metadata: Metadata = {
  title: "ベータテスター募集 | 限定100名",
  description:
    "成約コーチAIのベータテスターを限定100名募集中。正式リリース後、Proプラン3ヶ月無料の特典付き。AIがリアルなお客さん役を演じる営業ロープレアプリを、誰よりも早く体験しませんか？",
  alternates: { canonical: "/beta" },
  openGraph: {
    title: "ベータテスター募集 | 限定100名 | 成約コーチAI",
    description:
      "成約コーチAIのベータテスターを限定100名募集中。正式リリース後、Proプラン3ヶ月無料の特典付き。",
  },
};

const SITE_URL =
  process.env.NEXT_PUBLIC_APP_URL || "https://seiyaku-coach.vercel.app";

const benefits = [
  {
    icon: (
      <svg className="h-8 w-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
      </svg>
    ),
    title: "Proプラン3ヶ月無料",
    desc: "正式リリース後、月額¥2,980のProプランが3ヶ月間無料。¥8,940相当の特典です。",
  },
  {
    icon: (
      <svg className="h-8 w-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
    title: "全機能を先行体験",
    desc: "AIロープレ・成約スコアリング・学習コース・AIコーチングをいち早く利用できます。",
  },
  {
    icon: (
      <svg className="h-8 w-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
      </svg>
    ),
    title: "開発チームへ直接フィードバック",
    desc: "あなたの声が製品を形にします。改善リクエストを優先的に反映します。",
  },
];

const howSteps = [
  {
    num: "01",
    title: "メールで登録",
    desc: "メールアドレスを入力するだけ。30秒で完了します。",
  },
  {
    num: "02",
    title: "招待メールが届く",
    desc: "ベータ版の準備ができ次第、招待メールをお届けします。",
  },
  {
    num: "03",
    title: "全機能を無料で体験",
    desc: "AIロープレ・スコアリング・学習コースをすべて体験できます。",
  },
];

const faqs = [
  {
    q: "ベータテスターは何をするのですか？",
    a: "成約コーチAIの全機能を無料で体験し、使い心地やご要望をフィードバックしていただくだけです。特別なスキルは必要ありません。",
  },
  {
    q: "3ヶ月無料はいつから始まりますか？",
    a: "正式リリース後に自動的に適用されます。ベータ期間中は完全無料でご利用いただけます。",
  },
  {
    q: "ベータテスターに個人情報は必要ですか？",
    a: "メールアドレスのみで登録できます。それ以外の個人情報は不要です。",
  },
  {
    q: "100名を超えたらどうなりますか？",
    a: "残念ながら、定員に達した場合は募集を締め切ります。ご興味のある方はお早めにご登録ください。",
  },
  {
    q: "いつ頃招待されますか？",
    a: "登録順に順次ご招待いたします。ベータ版の進捗状況はメールでお知らせします。",
  },
];

export default function BetaPage() {
  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "ベータテスター募集 | 成約コーチAI",
    description:
      "成約コーチAIのベータテスターを限定100名募集中。正式リリース後、Proプラン3ヶ月無料。",
    url: `${SITE_URL}/beta`,
  };

  return (
    <div className="min-h-screen bg-background">
      <JsonLd data={jsonLdData} />
      <Header />

      {/* 1. Hero */}
      <section
        className="relative overflow-hidden px-6 pt-24 pb-16 sm:pt-32 sm:pb-20"
        style={{ backgroundColor: "#0a0f1a" }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/40" />
        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-accent/20 px-4 py-1.5 text-sm font-medium text-accent backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            限定100名募集中
          </div>

          <h1
            className="mb-4 text-3xl font-bold text-white sm:text-4xl lg:text-5xl"
            style={{ textShadow: "0 2px 12px rgba(0,0,0,0.5)" }}
          >
            ベータテスターになって
            <br />
            <span className="text-accent">営業AIの未来</span>を一緒に作る
          </h1>
          <p
            className="mx-auto mb-10 max-w-2xl text-base text-white/80 leading-relaxed sm:text-lg"
            style={{ textShadow: "0 1px 6px rgba(0,0,0,0.4)" }}
          >
            AIがリアルなお客さん役を演じる営業ロープレアプリを、誰よりも早く体験しませんか？
            <br className="hidden sm:block" />
            正式リリース後、<strong className="text-white">Proプラン3ヶ月無料</strong>の特典付き。
          </p>

          <BetaSignupForm position="hero" />
        </div>
      </section>

      {/* 2. Benefits */}
      <section className="px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-4 text-center text-2xl font-bold text-foreground sm:text-3xl">
            ベータテスター限定の特典
          </h2>
          <p className="mb-12 text-center text-sm text-muted sm:text-base">
            早期にご参加いただいた方だけの特別な3つのメリット
          </p>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {benefits.map((b) => (
              <div
                key={b.title}
                className="rounded-2xl bg-white shadow-sm border border-card-border p-6 text-center"
              >
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent/10">
                  {b.icon}
                </div>
                <h3 className="mb-2 text-base font-bold text-foreground">
                  {b.title}
                </h3>
                <p className="text-sm text-muted leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Main Signup Form */}
      <section className="px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-xl">
          <div className="rounded-2xl border border-card-border bg-white p-8 shadow-sm sm:p-10">
            <h2 className="mb-2 text-center text-xl font-bold text-foreground sm:text-2xl">
              ベータテスターに登録する
            </h2>
            <p className="mb-8 text-center text-sm text-muted">
              メールアドレスだけで登録完了。30秒で終わります。
            </p>
            <BetaSignupForm position="main" />
          </div>
        </div>
      </section>

      {/* 4. How it works */}
      <section className="px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-4 text-center text-2xl font-bold text-foreground sm:text-3xl">
            参加までの流れ
          </h2>
          <p className="mb-12 text-center text-sm text-muted sm:text-base">
            かんたん3ステップでベータテスターに
          </p>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {howSteps.map((s) => (
              <div
                key={s.num}
                className="relative rounded-2xl bg-white shadow-sm border border-card-border p-6 text-center"
              >
                <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-accent text-sm font-bold text-white">
                  {s.num}
                </div>
                <h3 className="mb-2 text-base font-bold text-foreground">
                  {s.title}
                </h3>
                <p className="text-sm text-muted leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. FAQ */}
      <section className="px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-4 text-center text-2xl font-bold text-foreground sm:text-3xl">
            よくある質問
          </h2>
          <p className="mb-12 text-center text-sm text-muted sm:text-base">
            ベータテスター募集に関するご質問にお答えします
          </p>

          <div className="space-y-3">
            {faqs.map((faq) => (
              <details
                key={faq.q}
                className="group rounded-2xl bg-white shadow-sm border border-card-border"
              >
                <summary className="flex cursor-pointer items-center justify-between px-6 py-5 text-sm font-semibold text-foreground [&::-webkit-details-marker]:hidden list-none">
                  <span>{faq.q}</span>
                  <svg
                    className="h-5 w-5 shrink-0 text-muted transition-transform duration-200 group-open:rotate-180"
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

      {/* 6. Final CTA */}
      <section className="px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-2xl font-bold text-foreground sm:text-3xl">
            今すぐベータテスターに登録する
          </h2>
          <p className="mb-10 text-sm text-muted sm:text-base">
            限定100名の募集です。営業AIの未来を一緒に作りませんか？
          </p>
          <BetaSignupForm position="footer" />
          <p className="mt-6 text-sm text-muted">
            &#10003; 完全無料&ensp;&#10003; メールアドレスのみ&ensp;&#10003;
            Proプラン3ヶ月無料特典
          </p>
          <p className="mt-4">
            <Link
              href="/"
              className="text-sm text-muted transition hover:text-accent hover:underline"
            >
              成約コーチAI について詳しく見る →
            </Link>
          </p>
        </div>
      </section>

      <Footer />
      <StickyCTA
        ctaText="ベータテスター登録"
        ctaHref="/beta#signup"
        subtitle="限定100名・Proプラン3ヶ月無料"
      />
    </div>
  );
}
