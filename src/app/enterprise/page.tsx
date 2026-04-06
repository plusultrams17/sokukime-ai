import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { JsonLd } from "@/components/json-ld";
import { CopyButton } from "@/components/copy-button";

export const metadata: Metadata = {
  title: "法人・チーム導入｜営業チームのロープレ研修をAIで効率化",
  description:
    "営業チーム5名〜の法人導入に対応。1人月額1,980円で無制限AIロープレ。稟議書テンプレート付き。営業研修コスト1/10で毎日の実践練習環境を構築。",
  alternates: { canonical: "/enterprise" },
};

const SITE_URL =
  process.env.NEXT_PUBLIC_APP_URL || "https://seiyaku-coach.vercel.app";

const benefits = [
  {
    icon: "",
    title: "研修コスト1/10以下",
    description:
      "集合型営業研修（1回5万円〜）と比べ、成約コーチ AIなら1人月額1,980円〜。年間で数百万円のコスト削減が可能です。",
  },
  {
    icon: "",
    title: "成果を数値で可視化",
    description:
      "全メンバーのロープレスコアを5カテゴリで定量評価。誰がどのスキルに課題を持っているか一目でわかります。",
  },
  {
    icon: "",
    title: "忘却曲線に対抗する毎日の練習",
    description:
      "営業研修の87%は30日で忘却されます（Xerox社調査）。毎日5分のAIロープレで「学んだら忘れない」環境を構築。",
  },
  {
    icon: "",
    title: "24時間・場所を選ばず",
    description:
      "全国の拠点・リモートワーカーも同じ品質のトレーニングを受けられます。研修のためのスケジュール調整は不要。",
  },
  {
    icon: "",
    title: "業種別シナリオ対応",
    description:
      "保険・不動産・SaaS・人材など16業種に特化したシナリオを用意。御社の営業現場に近い状況で練習できます。",
  },
  {
    icon: "",
    title: "安心のセキュリティ",
    description:
      "Supabase + Stripe による業界標準のセキュリティ。データは暗号化され、日本国内のインフラで運用。",
  },
];

const comparisonData = [
  {
    name: "集合型営業研修",
    cost: "5万〜30万円/回/人",
    frequency: "月1-2回",
    feedback: "講師依存・属人的",
    measurability: "アンケートのみ",
  },
  {
    name: "営業コンサルタント",
    cost: "10万〜50万円/月",
    frequency: "月1-2回",
    feedback: "属人的",
    measurability: "定性のみ",
  },
  {
    name: "法人向けAIロープレ",
    cost: "要問合せ（推定10万円〜/月）",
    frequency: "利用可能",
    feedback: "AIフィードバック",
    measurability: "スコアあり",
  },
  {
    name: "成約コーチ AI チームプラン",
    cost: "1,980円/人/月（5名〜）",
    frequency: "毎日・無制限",
    feedback: "5カテゴリAI採点+改善提案",
    measurability: "定量スコア推移",
    highlight: true,
  },
];

const ringiTemplate = `【稟議書】AIロープレツール「成約コーチ AI」導入について

■ 件名
営業チーム向けAIロープレツール「成約コーチ AI」チームプラン導入

■ 起案日
____年__月__日

■ 起案者
部署: __________ 氏名: __________

■ 導入目的
営業チームの商談スキル（クロージング・反論処理・ヒアリング等）を
定量的に測定・改善するため、AIロープレツールを導入する。

■ 背景・課題
1. 営業研修の効果が持続しない（研修内容の87%が30日で忘却 ※Xerox社調査）
2. 個人のスキル差が可視化できていない
3. ロープレ練習の機会が不足（練習相手の確保が困難）
4. 集合研修のコスト・スケジュール調整負担

■ 導入ツール概要
サービス名: 成約コーチ AI（https://seiyaku-coach.vercel.app）
提供形態: SaaS（クラウド）
内容: AIがリアルなお客さん役を演じる営業ロープレ練習ツール
      5カテゴリ（アプローチ・ヒアリング・プレゼン・クロージング・反論処理）で
      自動採点し、AI改善アドバイスを提供
対応業種: 16業種（保険・不動産・SaaS・人材等）

■ 費用
チームプラン: ¥1,980/人/月（税込）× __名 = ¥______/月
年間費用: ¥______
※比較: 集合型営業研修 1回5万〜30万円/人

■ 期待効果
1. 営業研修コストの削減（従来比 1/10〜1/20）
2. 商談成約率の向上（継続練習による定着効果）
3. 新人営業の早期戦力化（オンボーディング期間短縮）
4. 個人別スキルの定量的把握と育成計画への反映

■ セキュリティ
- 通信: SSL/TLS暗号化
- 認証: Google OAuth 2.0
- 決済: Stripe（PCI DSS準拠）
- データ保管: Supabase（PostgreSQL）

■ 契約条件
- 最低契約期間: なし（月単位で解約可能）
- 支払方法: クレジットカード / 請求書払い対応
- 無料トライアル: 7日間

■ 添付資料
- サービス概要資料
- 料金プラン詳細（https://seiyaku-coach.vercel.app/pricing）

■ 承認欄
部長: ______ 課長: ______ 担当: ______`;

export default function EnterprisePage() {
  const jsonLdData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${SITE_URL}/enterprise#page`,
        name: "法人・チーム導入",
        description:
          "営業チーム5名〜の法人導入。1人月額1,980円で無制限AIロープレ。",
        url: `${SITE_URL}/enterprise`,
        isPartOf: { "@id": `${SITE_URL}/#website` },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "ホーム",
            item: SITE_URL,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "法人導入",
            item: `${SITE_URL}/enterprise`,
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
            法人・チーム向け
          </div>
          <h1 className="mb-4 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            営業チームの研修を
            <span className="text-accent">1/10のコスト</span>で毎日実施
          </h1>
          <p className="mx-auto max-w-2xl text-base text-white/70 leading-relaxed sm:text-lg">
            集合型研修1回分の費用で、チーム全員が毎日AIロープレで実践練習。
            <br className="hidden sm:block" />
            5カテゴリの定量スコアで、育成計画を数値で管理できます。
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a
              href="mailto:support@seiyaku-coach.com?subject=法人プランのお問い合わせ&body=会社名：%0Aご担当者名：%0A利用予定人数：%0Aご質問・ご要望：%0A"
              className="inline-flex h-12 items-center justify-center rounded-xl bg-accent px-8 text-base font-bold text-white transition hover:bg-accent-hover"
            >
              法人プランを問い合わせる
            </a>
            <Link
              href="/roleplay"
              className="inline-flex h-12 items-center justify-center rounded-xl border-2 border-white/30 px-8 text-base font-bold text-white transition hover:bg-white/10"
            >
              まず無料で体験する
            </Link>
          </div>
          <p className="mt-4 text-sm text-white/50">
            稟議書テンプレート付き ・ 7日間無料トライアル ・ いつでも解約OK
          </p>
        </div>
      </section>

      {/* Problem: Forgetting Curve */}
      <section className="px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-8 sm:p-12">
            <h2 className="mb-4 text-center text-2xl font-bold text-foreground sm:text-3xl">
              営業研修の<span className="text-red-500">87%</span>は30日で忘れられる
            </h2>
            <p className="mb-6 text-center text-sm text-muted leading-relaxed sm:text-base">
              心理学者エビングハウスの「忘却曲線」研究により、1回限りの学習は急速に忘却されることが証明されています。
              Xerox社の調査でも、営業研修で学んだ内容の87%が30日以内に失われると報告されています。
            </p>
            <div className="grid grid-cols-4 gap-3 text-center">
              {[
                { time: "1時間後", loss: "56%" },
                { time: "1日後", loss: "67%" },
                { time: "1週間後", loss: "75%" },
                { time: "30日後", loss: "79%" },
              ].map((d) => (
                <div
                  key={d.time}
                  className="rounded-xl border border-card-border bg-card p-3"
                >
                  <p className="text-lg font-bold text-red-500 sm:text-2xl">
                    {d.loss}
                  </p>
                  <p className="text-xs text-muted">{d.time}の忘却率</p>
                </div>
              ))}
            </div>
            <p className="mt-6 text-center text-sm font-medium text-accent">
              解決策: 毎日のAIロープレで「間隔反復」を実現し、忘却に対抗
            </p>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-4 text-center text-2xl font-bold text-foreground sm:text-3xl">
            法人導入のメリット
          </h2>
          <p className="mb-12 text-center text-sm text-muted sm:text-base">
            CSO Insights（Korn Ferry）の研究: 効果的な研修を実施した企業は成約率52.6%を達成
          </p>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((b) => (
              <div
                key={b.title}
                className="rounded-2xl border border-card-border bg-card p-6"
              >
                {b.icon ? <span className="mb-3 block text-3xl">{b.icon}</span> : null}
                <h3 className="mb-2 text-base font-bold text-foreground">
                  {b.title}
                </h3>
                <p className="text-sm text-muted leading-relaxed">
                  {b.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-8 text-center text-2xl font-bold text-foreground sm:text-3xl">
            コスト・効果比較
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-card-border text-left">
                  <th className="px-4 py-3 font-semibold text-foreground">
                    サービス
                  </th>
                  <th className="px-4 py-3 font-semibold text-foreground">
                    費用
                  </th>
                  <th className="px-4 py-3 font-semibold text-foreground">
                    練習頻度
                  </th>
                  <th className="px-4 py-3 font-semibold text-foreground">
                    フィードバック
                  </th>
                  <th className="px-4 py-3 font-semibold text-foreground">
                    効果測定
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((row) => (
                  <tr
                    key={row.name}
                    className={`border-b border-card-border ${
                      row.highlight
                        ? "bg-accent/5 font-medium"
                        : ""
                    }`}
                  >
                    <td
                      className={`px-4 py-3 ${
                        row.highlight ? "font-bold text-accent" : "text-foreground"
                      }`}
                    >
                      {row.name}
                    </td>
                    <td
                      className={`px-4 py-3 ${
                        row.highlight ? "font-bold text-accent" : "text-muted"
                      }`}
                    >
                      {row.cost}
                    </td>
                    <td className="px-4 py-3 text-muted">{row.frequency}</td>
                    <td className="px-4 py-3 text-muted">{row.feedback}</td>
                    <td className="px-4 py-3 text-muted">
                      {row.measurability}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-center text-xs text-muted">
            ※一般的な市場価格の参考値です。RAIN Group / CSO Insights研究データに基づく
          </p>
        </div>
      </section>

      {/* Ringi Template */}
      <section className="px-6 py-16 sm:py-24" id="ringi">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-4 text-center text-2xl font-bold text-foreground sm:text-3xl">
            稟議書テンプレート
          </h2>
          <p className="mb-8 text-center text-sm text-muted sm:text-base">
            社内承認に必要な情報をまとめたテンプレートをご用意しました。
            コピーしてそのままお使いいただけます。
          </p>
          <div className="rounded-2xl border border-card-border bg-card p-6 sm:p-8">
            <pre className="max-h-96 overflow-y-auto whitespace-pre-wrap text-xs text-muted leading-relaxed sm:text-sm">
              {ringiTemplate}
            </pre>
            <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <CopyButton text={ringiTemplate} />
              <p className="text-xs text-muted">
                ※ブラウザのクリップボードにコピーされます
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-2xl font-bold text-foreground sm:text-3xl">
            まずは無料で体験、効果を実感してから導入検討
          </h2>
          <p className="mb-8 text-sm text-muted sm:text-base">
            個人で無料体験 → チームプランに移行。最短当日で導入完了します。
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/roleplay"
              className="inline-flex h-12 items-center justify-center rounded-xl bg-accent px-8 text-base font-bold text-white transition hover:bg-accent-hover"
            >
              無料でロープレを試す
            </Link>
            <a
              href="mailto:support@seiyaku-coach.com?subject=法人プランのお問い合わせ&body=会社名：%0Aご担当者名：%0A利用予定人数：%0Aご質問・ご要望：%0A"
              className="inline-flex h-12 items-center justify-center rounded-xl border-2 border-accent px-8 text-base font-bold text-accent transition hover:bg-accent/10"
            >
              法人プランを問い合わせる
            </a>
          </div>
          <p className="mt-4 text-xs text-muted">
            ご利用人数に応じたお見積もりをお送りします（最短当日対応）
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
