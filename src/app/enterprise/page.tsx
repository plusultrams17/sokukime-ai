import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { TEAM_PLANS } from "@/lib/plans";
import { EnterpriseLeadForm } from "./lead-form";

export const metadata: Metadata = {
  title: "法人プラン | 成約コーチAI - チーム全員の営業力をAIで底上げ",
  description:
    "成約コーチAIの法人向けチームプラン。チーム管理ダッシュボード、メンバー招待、一括請求書払いに対応。5名から導入可能で、人数に応じたボリュームディスカウントをご用意しています。",
  openGraph: {
    title: "法人プラン | 成約コーチAI",
    description:
      "営業チームの実力をAIで可視化し、成約力を底上げ。5名からの法人向けチームプランをご用意。",
  },
};

const VALUE_PROPOSITIONS = [
  {
    title: "チーム管理ダッシュボード",
    description:
      "メンバー全員のロープレ回数・スコア推移・学習進捗を一覧で把握。マネージャーが個別フィードバックの優先順位を判断できます。",
  },
  {
    title: "メンバー招待・権限管理",
    description:
      "メールアドレスで簡単招待。オーナー・管理者・メンバーの3段階の権限設定で、チーム運用に柔軟に対応します。",
  },
  {
    title: "一括請求書払い対応",
    description:
      "10名以上のプランで請求書払いに対応。月次・年次の一括精算で、経理処理の手間を削減します。",
  },
  {
    title: "全員が同じメソッドで学習",
    description:
      "成約5ステップメソッドに基づく全22レッスンとAIロープレで、チーム全体の営業トーク品質を標準化できます。",
  },
] as const;

const STEPS = [
  {
    step: 1,
    title: "お問い合わせ",
    description: "下記フォームまたはメールでご連絡ください。人数・ご要望をヒアリングし、最適なプランをご提案します。",
  },
  {
    step: 2,
    title: "トライアル導入",
    description: "まずは少人数でお試し利用いただけます。操作方法のオンボーディングサポートも実施します。",
  },
  {
    step: 3,
    title: "本格導入",
    description: "全メンバーのアカウントを発行し、チーム管理ダッシュボードで運用を開始します。",
  },
] as const;

const FAQ_ITEMS = [
  {
    question: "個人プランからチームプランに移行できますか？",
    answer:
      "はい、移行できます。既存の個人アカウントをチームに統合することも可能です。学習進捗やスコア履歴はそのまま引き継がれます。お問い合わせフォームからご連絡いただければ、移行手順をご案内します。",
  },
  {
    question: "途中でメンバーの追加・削減はできますか？",
    answer:
      "はい、いつでも変更できます。メンバー追加は管理画面から即時反映されます。人数帯が変わる場合は、次回請求から新しい単価が適用されます。",
  },
  {
    question: "セキュリティ体制はどうなっていますか？",
    answer:
      "認証はGoogleのOAuth 2.0を採用し、決済はStripe（PCI DSS Level 1準拠）で処理しています。通信はすべてHTTPSで暗号化されており、データはSupabase（AWSインフラ）上で安全に管理されています。",
  },
  {
    question: "契約期間の縛りはありますか？",
    answer:
      "月払いプランはいつでも解約可能です。年払いプランは12ヶ月の契約期間となりますが、20%のディスカウントが適用されます。年払い途中の解約については個別にご相談ください。",
  },
] as const;

export default function EnterprisePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="border-b border-card-border bg-gradient-to-b from-accent/5 to-background px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <p className="mb-4 text-xs font-bold uppercase tracking-widest text-accent">
            For Sales Teams
          </p>
          <h1 className="mb-5 text-2xl font-bold leading-tight sm:text-3xl md:text-4xl">
            営業チームの実力をAIで可視化し、
            <br className="hidden sm:block" />
            成約力を底上げ
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
            成約コーチAIの法人プランなら、チーム全員が同じメソッドで練習し、
            マネージャーは一画面で全員の成長を把握できます。
            5名から導入でき、人数に応じたボリュームディスカウントをご用意しています。
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <a
              href="#contact"
              className="inline-flex h-12 items-center justify-center rounded-xl bg-accent px-8 text-sm font-bold text-white transition hover:bg-accent-hover sm:min-w-[200px]"
            >
              お問い合わせ
            </a>
            <a
              href="#pricing"
              className="inline-flex h-12 items-center justify-center rounded-xl border border-card-border px-8 text-sm font-bold text-foreground transition hover:border-accent/50 hover:text-accent sm:min-w-[200px]"
            >
              料金を見る
            </a>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Value Propositions */}
        <section className="py-16 sm:py-20">
          <div className="mb-10 text-center sm:mb-12">
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-accent">
              Features
            </p>
            <h2 className="text-xl font-bold sm:text-2xl md:text-3xl">
              法人導入で実現できること
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            {VALUE_PROPOSITIONS.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-card-border bg-card p-6 sm:p-8"
              >
                <h3 className="mb-2 text-base font-bold sm:text-lg">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing Table */}
        <section id="pricing" className="scroll-mt-20 py-16 sm:py-20">
          <div className="mb-10 text-center sm:mb-12">
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-accent">
              Pricing
            </p>
            <h2 className="mb-3 text-xl font-bold sm:text-2xl md:text-3xl">
              チームプラン料金
            </h2>
            <p className="text-sm text-muted">
              年間契約で全プラン20%OFF
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {TEAM_PLANS.map((plan) => {
              const memberRange = plan.maxMembers
                ? `${plan.minMembers}-${plan.maxMembers}名`
                : `${plan.minMembers}名以上`;
              const creditLabel =
                plan.creditsPerUser === Infinity
                  ? "無制限"
                  : `月${plan.creditsPerUser}回/人`;

              return (
                <div
                  key={plan.tier}
                  className={`relative flex flex-col rounded-2xl border p-5 sm:p-6 ${
                    plan.tier === "team_30"
                      ? "border-2 border-accent bg-gradient-to-b from-accent/10 to-card"
                      : "border-card-border bg-card"
                  }`}
                >
                  {plan.tier === "team_30" && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-accent px-4 py-1 text-xs font-bold text-white">
                      人気
                    </div>
                  )}
                  <h3 className="mb-1 text-lg font-bold">{plan.name}</h3>
                  <p className="mb-4 text-xs text-muted">{memberRange}</p>

                  {/* Monthly price */}
                  <div className="mb-1 flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-accent sm:text-3xl">
                      &yen;{plan.pricePerUser.toLocaleString()}
                    </span>
                    <span className="text-xs text-muted">/人/月</span>
                  </div>
                  <p className="mb-4 text-xs text-muted">
                    年契: &yen;{plan.annualPricePerUser.toLocaleString()}/人/月
                    <span className="ml-1 rounded bg-green-600/10 px-1.5 py-0.5 text-[10px] font-bold text-green-600">
                      20%OFF
                    </span>
                  </p>

                  <p className="mb-4 text-sm font-medium">
                    AIロープレ {creditLabel}
                  </p>

                  {/* Features */}
                  <ul className="mt-auto space-y-2 text-xs">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2">
                        <svg
                          className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.704 5.29a1 1 0 010 1.42l-7.5 7.5a1 1 0 01-1.42 0l-3.5-3.5a1 1 0 011.42-1.42L8.5 12.08l6.79-6.79a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-muted">{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          {/* Pricing note */}
          <p className="mt-6 text-center text-xs text-muted">
            ※ 表示価格はすべて税込です。年間契約は12ヶ月分を一括でのお支払いとなります。
          </p>
        </section>

        {/* 3-Step Onboarding */}
        <section className="py-16 sm:py-20">
          <div className="mb-10 text-center sm:mb-12">
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-accent">
              Getting Started
            </p>
            <h2 className="text-xl font-bold sm:text-2xl md:text-3xl">
              3ステップで導入
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            {STEPS.map((item) => (
              <div key={item.step} className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border-2 border-accent text-lg font-bold text-accent">
                  {item.step}
                </div>
                <h3 className="mb-2 text-base font-bold">{item.title}</h3>
                <p className="text-sm leading-relaxed text-muted">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Lead Capture Form */}
        <section id="contact" className="scroll-mt-20 py-16 sm:py-20">
          <div className="mx-auto max-w-2xl">
            <div className="mb-10 text-center">
              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-accent">
                Contact
              </p>
              <h2 className="mb-3 text-xl font-bold sm:text-2xl md:text-3xl">
                お問い合わせ
              </h2>
              <p className="text-sm text-muted">
                導入のご相談・お見積もりなど、お気軽にご連絡ください。
                <br />
                通常1営業日以内にご返信いたします。
              </p>
            </div>
            <EnterpriseLeadForm />
          </div>
        </section>

        {/* FAQ */}
        <section className="pb-16 pt-8 sm:pb-20">
          <div className="mb-8 text-center">
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-accent">
              FAQ
            </p>
            <h2 className="text-xl font-bold sm:text-2xl">よくある質問</h2>
          </div>
          <div className="mx-auto max-w-3xl space-y-3">
            {FAQ_ITEMS.map((item, i) => (
              <details
                key={item.question}
                className="group rounded-xl border border-card-border bg-card"
                open={i === 0}
              >
                <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-4 text-sm font-bold text-foreground [&::-webkit-details-marker]:hidden sm:px-6 sm:py-5">
                  <span>{item.question}</span>
                  <svg
                    className="h-5 w-5 shrink-0 text-muted transition-transform duration-200 group-open:rotate-180"
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
                <div className="border-t border-card-border px-4 pb-4 pt-3 text-sm leading-relaxed text-muted sm:px-6 sm:pb-5 sm:pt-4">
                  {item.answer}
                </div>
              </details>
            ))}
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
