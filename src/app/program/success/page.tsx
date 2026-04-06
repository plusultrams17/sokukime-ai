import Link from "next/link";
import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "購入完了｜成約5ステップ完全攻略プログラム",
  robots: { index: false },
};

const STEPS = [
  {
    number: 1,
    title: "型を学ぶ",
    description: "22レッスンで成約5ステップの型を体系的に習得。1レッスン約5分で無理なく進められます。",
    detail: "22レッスン",
  },
  {
    number: 2,
    title: "実践する",
    description: "AIロープレであなたの商材・業種に合わせたリアルな商談練習。回数無制限で繰り返し練習できます。",
    detail: "AIロープレ",
  },
  {
    number: 3,
    title: "改善する",
    description: "全5カテゴリのスコア分析で弱点を特定。AI改善アドバイスで的確に改善ポイントを把握できます。",
    detail: "スコア分析",
  },
];

export default function ProgramSuccessPage() {
  return (
    <div className="min-h-screen bg-gray-950">
      <Header />

      <section className="px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-2xl text-center">
          {/* Success icon */}
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border-2 border-green-500/30 bg-green-500/10">
            <svg className="h-8 w-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="mb-3 text-2xl font-bold text-white sm:text-3xl">
            購入が完了しました
          </h1>
          <p className="mb-10 text-sm text-gray-400 leading-relaxed sm:text-base">
            「成約5ステップ完全攻略プログラム」をご購入いただき、ありがとうございます。
            <br className="hidden sm:block" />
            以下のロードマップに沿って、営業の型を身につけてください。
          </p>

          {/* 3-Step Roadmap */}
          <div className="mb-10 rounded-2xl border border-gray-800 bg-gray-900 p-6 text-left sm:p-8">
            <h2 className="mb-6 text-center text-base font-bold text-white">学習ロードマップ</h2>
            <div className="space-y-0">
              {STEPS.map((step, i) => (
                <div key={step.number} className="relative flex gap-4">
                  {/* Timeline connector */}
                  <div className="flex flex-col items-center">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange-500 text-sm font-bold text-white">
                      {step.number}
                    </span>
                    {i < STEPS.length - 1 && (
                      <div className="mt-1 h-full w-px bg-gray-700" />
                    )}
                  </div>
                  {/* Content */}
                  <div className={i < STEPS.length - 1 ? "pb-6" : ""}>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-white">{step.title}</h3>
                      <span className="rounded-full bg-orange-500/10 px-2.5 py-0.5 text-[11px] font-medium text-orange-400">
                        {step.detail}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-gray-400 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/program/resources"
              className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-orange-500 px-8 text-base font-bold text-white transition hover:bg-orange-600 sm:w-auto"
            >
              リソースハブへ進む
            </Link>
            <Link
              href="/learn"
              className="inline-flex h-12 w-full items-center justify-center rounded-xl border border-gray-700 bg-gray-900 px-8 text-base font-bold text-white transition hover:border-orange-500/40 sm:w-auto"
            >
              レッスンを始める
            </Link>
          </div>

          <p className="mt-8 text-xs text-gray-500">
            ご不明な点がありましたら、お気軽にお問い合わせください。
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
