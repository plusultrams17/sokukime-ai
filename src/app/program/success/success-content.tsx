"use client";

import Link from "next/link";

const STEPS = [
  {
    number: 1,
    title: "型を学ぶ",
    description:
      "22レッスンで成約5ステップの型を体系的に習得。1レッスン約5分で無理なく進められます。",
    detail: "22レッスン",
  },
  {
    number: 2,
    title: "実践する",
    description:
      "AIロープレであなたの商材・業種に合わせたリアルな商談練習。月60回まで繰り返し練習できます。",
    detail: "AIロープレ",
  },
  {
    number: 3,
    title: "改善する",
    description:
      "全5カテゴリのスコア分析で弱点を特定。AI改善アドバイスで的確に改善ポイントを把握できます。",
    detail: "スコア分析",
  },
];

type VerifyStatus = "verifying" | "verified" | "error";

export function SuccessContent({ status }: { status: VerifyStatus }) {
  return (
    <section className="px-6 py-16 sm:py-24">
      <div className="mx-auto max-w-2xl text-center">
        {/* Success icon */}
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border-2 border-green-500/30 bg-green-50">
          <svg
            className="h-8 w-8 text-green-500"
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
        </div>

        <h1 className="mb-3 text-2xl font-bold text-foreground sm:text-3xl">
          購入が完了しました
        </h1>
        <p className="mb-10 text-sm text-muted leading-relaxed sm:text-base">
          「成約5ステップ完全攻略プログラム」をご購入いただき、ありがとうございます。
          <br className="hidden sm:block" />
          以下のロードマップに沿って、営業の型を身につけてください。
        </p>

        {/* 3-Step Roadmap */}
        <div className="mb-10 rounded-2xl border border-card-border bg-white p-6 text-left shadow-sm sm:p-8">
          <h2 className="mb-6 text-center text-base font-bold text-foreground">
            学習ロードマップ
          </h2>
          <div className="space-y-0">
            {STEPS.map((step, i) => (
              <div key={step.number} className="relative flex gap-4">
                <div className="flex flex-col items-center">
                  <span
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                    style={{ backgroundColor: "#f97316" }}
                  >
                    {step.number}
                  </span>
                  {i < STEPS.length - 1 && (
                    <div className="mt-1 h-full w-px bg-card-border" />
                  )}
                </div>
                <div className={i < STEPS.length - 1 ? "pb-6" : ""}>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-foreground">
                      {step.title}
                    </h3>
                    <span
                      className="rounded-full px-2.5 py-0.5 text-[11px] font-medium"
                      style={{
                        backgroundColor: "rgba(249,115,22,0.1)",
                        color: "#f97316",
                      }}
                    >
                      {step.detail}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action buttons — blocked until verification complete */}
        {status === "verifying" && (
          <div className="flex items-center justify-center gap-2 py-4 text-sm text-muted">
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            購入情報を確認中...
          </div>
        )}

        {status === "verified" && (
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/program/resources"
              className="inline-flex h-12 w-full items-center justify-center rounded-xl px-8 text-base font-bold text-white transition hover:opacity-90 sm:w-auto"
              style={{ backgroundColor: "#f97316" }}
            >
              リソースハブへ進む
            </Link>
            <Link
              href="/learn"
              className="inline-flex h-12 w-full items-center justify-center rounded-xl border border-card-border bg-white px-8 text-base font-bold text-foreground transition hover:border-orange-300 sm:w-auto"
            >
              レッスンを始める
            </Link>
          </div>
        )}

        {status === "error" && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4">
            <p className="mb-2 text-sm font-medium text-red-700">
              購入情報の確認に失敗しました
            </p>
            <p className="text-xs text-red-600">
              ページを再読み込みしてください。問題が続く場合は{" "}
              <a
                href="mailto:support@seiyaku-coach.com"
                className="underline"
              >
                support@seiyaku-coach.com
              </a>{" "}
              までお問い合わせください。
            </p>
          </div>
        )}

        <p className="mt-8 text-xs text-muted">
          ご不明な点がありましたら、お気軽にお問い合わせください。
        </p>
      </div>
    </section>
  );
}
