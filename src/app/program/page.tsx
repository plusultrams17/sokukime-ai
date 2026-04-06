"use client";

import { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ScriptCompletionPreview } from "@/components/script-completion-preview";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const painPoints = [
  {
    title: "ロープレが怖い",
    description:
      "先輩の前で練習するのが恥ずかしい。失敗を見られるのが怖くて、練習を避けてしまう。結果、本番で失敗を繰り返す悪循環に。",
  },
  {
    title: "自己流で限界を感じている",
    description:
      "営業トークを我流で続けてきたけれど、成約率が頭打ち。何が悪いのか分からず、改善の糸口が見えない。",
  },
  {
    title: "研修は高すぎる",
    description:
      "法人向け営業研修は1回5万円以上。個人で参加できるものは少なく、書籍だけでは実践力が身につかない。",
  },
];

const includedItems = [
  {
    label: "22レッスン（動画+テキスト）",
    description: "成約5ステップメソッドを初級・中級・上級の3段階で体系的に学習",
  },
  {
    label: "認定試験",
    description: "全レッスン修了後の理解度チェック。合格で修了証を発行",
  },
  {
    label: "反論切り返しテンプレート 30パターン",
    description: "「高い」「検討します」「今じゃない」など頻出反論への切り返し集",
  },
  {
    label: "トークスクリプトテンプレート",
    description: "アプローチからクロージングまで、すぐに使える営業台本",
  },
  {
    label: "AIコーチ Pro アクセス権",
    description: "無制限AIロープレ+全5カテゴリ詳細スコア+AI改善アドバイス",
  },
];

const curriculumLevels = [
  {
    level: "初級",
    color: "text-green-600",
    bgColor: "bg-green-600/10",
    borderColor: "border-green-600/20",
    topics: "アプローチ・ヒアリング・プレゼン",
    lessons: 8,
    details: [
      "第一印象で信頼を勝ち取るアプローチ手法",
      "お客さまの本音を引き出すヒアリング技術",
      "刺さる提案を組み立てるプレゼンの型",
    ],
  },
  {
    level: "中級",
    color: "text-accent",
    bgColor: "bg-accent/10",
    borderColor: "border-accent/20",
    topics: "クロージング",
    lessons: 7,
    details: [
      "買わない理由を潰すクロージングの流れ",
      "テストクロージングのタイミングと話法",
      "即決を引き出すクロージングパターン",
    ],
  },
  {
    level: "上級",
    color: "text-orange-600",
    bgColor: "bg-orange-600/10",
    borderColor: "border-orange-600/20",
    topics: "反論処理 + 認定試験",
    lessons: 7,
    details: [
      "「検討します」を突破する反論処理フレーム",
      "価格・タイミング・競合比較への切り返し",
      "認定試験で実力を証明",
    ],
  },
];

const comparisonRows = [
  {
    feature: "学習コンテンツ",
    program: "22レッスン+テンプレート",
    training: "1〜2日の座学",
    chatgpt: "なし（自分で質問）",
    book: "体系的だが一方通行",
  },
  {
    feature: "実践練習",
    program: "AIロープレ無制限",
    training: "研修中のみ",
    chatgpt: "汎用的な応答のみ",
    book: "なし",
  },
  {
    feature: "フィードバック",
    program: "AI即時スコアリング",
    training: "講師の主観評価",
    chatgpt: "営業特化でない",
    book: "なし",
  },
  {
    feature: "価格",
    program: "¥9,800（買い切り）",
    training: "¥50,000〜/回",
    chatgpt: "¥3,000/月〜",
    book: "¥1,500〜/冊",
  },
  {
    feature: "反復学習",
    program: "24時間いつでも",
    training: "追加費用が必要",
    chatgpt: "営業の型がない",
    book: "読むだけ",
  },
  {
    feature: "営業メソッド",
    program: "成約5ステップ準拠",
    training: "講師により異なる",
    chatgpt: "なし",
    book: "著者により異なる",
  },
];

const faqItems = [
  {
    question: "返金はできますか？",
    answer:
      "本商品はデジタルコンテンツのため、特定商取引法に基づくクーリングオフの対象外となります。購入後の返品・返金は原則お受けしておりません。ただし、コンテンツに重大な不備がある場合はサポート（seiyaku.coach.ai@gmail.com）までご連絡ください。購入前に無料の学習コースで内容の一部をご確認いただけます。",
  },
  {
    question: "いつまで見られますか？",
    answer:
      "買い切り型のプログラムですので、一度ご購入いただければ無期限でアクセスできます。将来のアップデートも追加費用なしでご利用いただけます。",
  },
  {
    question: "AIコーチ（月額サブスクリプション）とは別ですか？",
    answer:
      "はい、別の商品です。本プログラムは「学習教材+テンプレート」の買い切り商品です。AIコーチ Pro（月額¥2,980）は無制限AIロープレ+詳細スコアのサブスクリプションサービスです。本プログラムにはAIコーチ Proのアクセス権も含まれていますので、両方を個別に購入する必要はありません。",
  },
  {
    question: "営業未経験でも大丈夫ですか？",
    answer:
      "はい。初級編からステップバイステップで学べる構成になっていますので、営業未経験の方や新入社員の方にも最適です。基礎から応用まで体系的にカバーしています。",
  },
  {
    question: "スマートフォンでも学習できますか？",
    answer:
      "はい。PC・スマートフォン・タブレットすべてに対応しています。通勤中や移動時間にもスキマ時間で学習を進められます。",
  },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function ProgramPage() {
  const [loading, setLoading] = useState(false);
  const launchPrice = 9800;

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout-program", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else if (res.status === 401) {
        // Not logged in — redirect to signup with return URL
        window.location.href = "/signup?redirect=/program";
      } else {
        alert(data.error || "エラーが発生しました");
        setLoading(false);
      }
    } catch {
      alert("通信エラーが発生しました。もう一度お試しください。");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden py-20 sm:py-28">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <p className="mb-4 inline-block rounded-full border border-lp-cta/30 bg-lp-cta/5 px-4 py-1.5 text-xs font-bold text-lp-cta">
            先着30名限定 — 特別価格で提供中
          </p>
          <h1 className="mb-6 text-3xl font-extrabold leading-tight sm:text-4xl md:text-5xl">
            営業の「型」を身につければ、
            <br className="hidden sm:block" />
            <span className="lp-highlight-hero">成約率は変わる</span>
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
            成約5ステップメソッドを22レッスンで完全習得。
            <br className="hidden sm:block" />
            反論切り返しテンプレート・トークスクリプト・AIコーチ Pro アクセス権付き。
            <br className="hidden sm:block" />
            学んで、練習して、結果を出す。すべてが揃った買い切りプログラム。
          </p>
          <div className="flex flex-col items-center gap-4">
            <button
              onClick={handleCheckout}
              disabled={loading}
              className="lp-cta-btn hero-cta-btn disabled:opacity-60"
            >
              {loading ? "処理中..." : "今すぐプログラムを手に入れる"}
            </button>
            <p className="text-sm text-muted">
              <span className="mr-1 text-sm text-muted line-through">¥14,800</span>
              <span className="text-lg font-bold text-lp-cta">
                ¥{launchPrice.toLocaleString()}
              </span>
              <span className="text-xs text-muted">（税込¥{Math.round(launchPrice * 1.1).toLocaleString()}）/ 買い切り</span>
            </p>
          </div>
          <p className="mt-3 text-center text-xs text-muted">
            ※ 効果には個人差があります。成果を保証するものではありません。
          </p>
        </div>
      </section>

      {/* ── Script Completion Preview ── */}
      <section>
        <ScriptCompletionPreview />
      </section>

      {/* ── Pain Points ── */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="mb-4 text-center text-2xl font-bold sm:text-3xl">
            こんな悩み、ありませんか？
          </h2>
          <p className="mb-10 text-center text-sm text-muted">
            多くの営業パーソンが抱える3つの壁
          </p>
          <div className="grid gap-5 sm:grid-cols-3">
            {painPoints.map((point) => (
              <div
                key={point.title}
                className="rounded-2xl border border-card-border bg-card p-6"
              >
                <h3 className="mb-3 text-lg font-bold text-foreground">
                  {point.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted">
                  {point.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── What You Get ── */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="mb-4 text-center text-2xl font-bold sm:text-3xl">
            プログラムに含まれるもの
          </h2>
          <p className="mb-10 text-center text-sm text-muted">
            学習・実践・テンプレートがすべてセット
          </p>
          <div className="space-y-4">
            {includedItems.map((item, i) => (
              <div
                key={item.label}
                className="flex gap-4 rounded-xl border border-card-border bg-card p-5 sm:p-6"
              >
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-accent/10 text-sm font-bold text-accent">
                  {i + 1}
                </div>
                <div>
                  <h3 className="mb-1 font-bold text-foreground">
                    {item.label}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Curriculum Overview ── */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="mb-4 text-center text-2xl font-bold sm:text-3xl">
            カリキュラム
          </h2>
          <p className="mb-10 text-center text-sm text-muted">
            初級から上級まで、3つのレベルで段階的にスキルアップ
          </p>
          <div className="grid gap-6 md:grid-cols-3">
            {curriculumLevels.map((level) => (
              <div
                key={level.level}
                className={`rounded-2xl border ${level.borderColor} bg-card p-6`}
              >
                <div className="mb-4 flex items-center gap-3">
                  <span
                    className={`inline-flex rounded-lg ${level.bgColor} px-3 py-1 text-xs font-bold ${level.color}`}
                  >
                    {level.level}
                  </span>
                  <span className="text-xs text-muted">
                    {level.lessons}レッスン
                  </span>
                </div>
                <h3 className="mb-3 text-lg font-bold text-foreground">
                  {level.topics}
                </h3>
                <ul className="space-y-2">
                  {level.details.map((detail) => (
                    <li
                      key={detail}
                      className="flex items-start gap-2 text-sm leading-relaxed text-muted"
                    >
                      <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="mt-6 text-center text-sm text-muted">
            合計 <span className="font-bold text-foreground">22レッスン + 認定試験</span>
          </p>
        </div>
      </section>

      {/* ── Comparison Table ── */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="mb-4 text-center text-2xl font-bold sm:text-3xl">
            他の学習方法との比較
          </h2>
          <p className="mb-10 text-center text-sm text-muted">
            本プログラム vs 営業研修 vs ChatGPT vs 営業本
          </p>

          {/* Desktop table */}
          <div className="hidden overflow-hidden rounded-2xl border border-card-border sm:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-card-border bg-card">
                  <th className="p-4 text-left font-bold text-muted"></th>
                  <th className="p-4 text-left font-bold text-accent">
                    本プログラム
                  </th>
                  <th className="p-4 text-left font-bold text-foreground">
                    営業研修
                  </th>
                  <th className="p-4 text-left font-bold text-foreground">
                    ChatGPT
                  </th>
                  <th className="p-4 text-left font-bold text-foreground">
                    営業本
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, i) => (
                  <tr
                    key={row.feature}
                    className={
                      i < comparisonRows.length - 1
                        ? "border-b border-card-border"
                        : ""
                    }
                  >
                    <td className="p-4 font-medium text-foreground">
                      {row.feature}
                    </td>
                    <td className="p-4 font-medium text-accent">
                      {row.program}
                    </td>
                    <td className="p-4 text-muted">{row.training}</td>
                    <td className="p-4 text-muted">{row.chatgpt}</td>
                    <td className="p-4 text-muted">{row.book}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="space-y-4 sm:hidden">
            {comparisonRows.map((row) => (
              <div
                key={row.feature}
                className="rounded-xl border border-card-border bg-card p-4"
              >
                <p className="mb-3 text-sm font-bold text-foreground">
                  {row.feature}
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-accent font-medium">本プログラム</span>
                    <span className="text-accent font-medium text-right">
                      {row.program}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">営業研修</span>
                    <span className="text-muted text-right">
                      {row.training}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">ChatGPT</span>
                    <span className="text-muted text-right">
                      {row.chatgpt}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">営業本</span>
                    <span className="text-muted text-right">{row.book}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-6">
          <div className="relative mx-auto max-w-lg rounded-2xl border-2 border-lp-cta bg-card p-8 sm:p-10">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-lp-cta px-4 py-1 text-xs font-bold text-white">
              先着30名限定価格
            </div>

            <div className="mb-6 text-center">
              <h2 className="mb-2 text-xl font-bold sm:text-2xl">
                成約5ステップ攻略プログラム
              </h2>
              <p className="text-sm text-muted">
                学習+実践+テンプレートのオールインワン
              </p>
            </div>

            <div className="mb-6 text-center">
              <p className="text-sm text-muted line-through">¥14,800</p>
              <p className="text-4xl font-extrabold text-lp-cta sm:text-5xl">
                ¥{launchPrice.toLocaleString()}
              </p>
              <p className="mt-1 text-xs text-muted">
                税込 ¥{Math.round(launchPrice * 1.1).toLocaleString()} / 買い切り
              </p>
            </div>

            <div className="mb-6 space-y-2">
              {includedItems.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-2 text-sm"
                >
                  <svg
                    className="h-4 w-4 flex-shrink-0 text-accent"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-foreground">{item.label}</span>
                </div>
              ))}
            </div>

            <button
              onClick={handleCheckout}
              disabled={loading}
              className="lp-cta-btn w-full disabled:opacity-60"
            >
              {loading ? "処理中..." : "今すぐプログラムを手に入れる"}
            </button>

            <p className="mt-3 text-center text-[11px] text-muted">
              買い切り型 - 追加費用なし - 無期限アクセス
            </p>
            <p className="mt-2 text-center text-[11px] text-muted">
              ※ デジタルコンテンツのため、購入後の返品・返金は原則不可です。
              <br />
              ※ 効果には個人差があります。営業成果を保証するものではありません。
            </p>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-muted">
              <span>Stripe安全決済</span>
              <span>クレジットカード対応</span>
              <Link href="/legal/tokushoho" className="underline hover:text-foreground">特商法表記</Link>
            </div>
          </div>

          {/* Included value callout */}
          <div className="mx-auto mt-6 max-w-lg rounded-xl border border-lp-cta/20 bg-lp-cta/5 p-4 text-center">
            <p className="text-sm font-bold text-foreground">
              AIコーチ Pro アクセス権付き
            </p>
            <p className="mt-1 text-xs text-muted">
              AIコーチ Pro（月額¥2,980相当）+ 22レッスン学習教材・テンプレートがすべて含まれています
            </p>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="mb-8 text-center text-2xl font-bold sm:text-3xl">
            よくある質問
          </h2>
          <div className="space-y-3">
            {faqItems.map((item, i) => (
              <details
                key={item.question}
                className="group rounded-xl border border-card-border bg-card"
                open={i === 0}
              >
                <summary className="flex cursor-pointer items-center justify-between px-6 py-5 text-sm font-bold text-foreground [&::-webkit-details-marker]:hidden list-none">
                  <span>{item.question}</span>
                  <svg
                    className="h-5 w-5 flex-shrink-0 text-muted transition-transform duration-200 group-open:rotate-180"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </summary>
                <div className="border-t border-card-border px-6 pb-5 pt-4 text-sm leading-relaxed text-muted">
                  {item.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="mb-4 text-2xl font-bold sm:text-3xl">
            営業の「型」を今日から身につけよう
          </h2>
          <p className="mb-8 text-sm text-muted">
            先着30名限定・特別価格で提供中。営業研修1回分以下の費用で、体系的な営業スキルを学べます。
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <button
              onClick={handleCheckout}
              disabled={loading}
              className="lp-cta-btn hero-cta-btn disabled:opacity-60"
            >
              {loading ? "処理中..." : "今すぐプログラムを手に入れる"}
            </button>
            <Link
              href="/learn"
              className="lp-cta-secondary"
            >
              まず無料で学習コースを見る
            </Link>
          </div>
          <p className="mt-4 text-xs text-muted">
            <span className="mr-1 text-xs line-through">¥14,800</span>
            <span className="font-bold text-lp-cta">
              ¥{launchPrice.toLocaleString()}
            </span>
            （税込¥{Math.round(launchPrice * 1.1).toLocaleString()}）
            - 買い切り - 無期限アクセス
          </p>
          <p className="mt-2 text-xs text-muted">
            ※ 効果には個人差があります。
            <Link href="/legal/tokushoho" className="underline hover:text-foreground">特定商取引法に基づく表記</Link>
          </p>
        </div>
      </section>

      {/* ── Footer ── */}
      <Footer />
    </div>
  );
}
