import Link from "next/link";

/* ── Step data with categorized sections ── */

const STEPS = [
  {
    name: "アプローチ",
    sub: "信頼構築",
    color: "#22c55e",
    sections: [
      { label: "信頼を掴む褒め方", count: 3 },
      { label: "商談ゴールの共有", count: 1 },
    ],
  },
  {
    name: "ヒアリング",
    sub: "課題発掘",
    color: "#3b82f6",
    sections: [
      { label: "想定ニーズの準備", count: 3 },
      { label: "本音を引き出す質問", count: 3 },
      { label: "核心に迫る深掘り", count: 5 },
    ],
  },
  {
    name: "プレゼン",
    sub: "価値提案",
    color: "#f97316",
    sections: [
      { label: "メリットの伝え方", count: 6 },
      { label: "他社との差別化", count: 3 },
      { label: "「もし〜なら」提案", count: 2 },
    ],
  },
  {
    name: "クロージング",
    sub: "決断促進",
    color: "#a855f7",
    sections: [
      { label: "決断を引き出す基本技", count: 4 },
      { label: "前向きクロージング", count: 4 },
      { label: "危機感クロージング", count: 6 },
      { label: "欲求に訴える話法", count: 3 },
    ],
  },
  {
    name: "反論処理",
    sub: "切り返し",
    color: "#ef4444",
    sections: [
      { label: "よくある断り文句", count: 8 },
      { label: "切り返しの基本型", count: 3 },
      { label: "実践切り返しトーク", count: 8 },
    ],
  },
];

const TOTAL = STEPS.reduce(
  (sum, s) => sum + s.sections.reduce((a, sec) => a + sec.count, 0),
  0
);

/* ── Component ── */

interface Props {
  showCta?: boolean;
}

export function ScriptCompletionPreview({ showCta = true }: Props) {
  return (
    <div className="py-14 sm:py-20">
      <div className="mx-auto max-w-6xl px-6">
        {/* Section header */}
        <p className="lp-heading mb-3 text-center">
          Pro会員特典で手に入る
          <br className="sm:hidden" />
          <span className="lp-highlight">完成スクリプト</span>
        </p>
        <p className="mx-auto mb-10 max-w-xl text-center text-sm leading-relaxed text-muted sm:mb-12 sm:text-base">
          5ステップ・{TOTAL}項目のトークスクリプトが、あなたの業種に合わせて完成。
          <br className="hidden sm:block" />
          そのままPDFで出力し、商談に持ち込めます。
        </p>

        {/* PDF mockup area */}
        <div className="relative">
          {/* Decorative angled pages behind */}
          <div
            className="absolute -left-3 top-6 hidden h-[90%] w-[95%] rounded-xl border border-card-border bg-white opacity-40 sm:block"
            style={{ transform: "rotate(-3deg)" }}
            aria-hidden="true"
          />
          <div
            className="absolute -right-3 top-4 hidden h-[90%] w-[95%] rounded-xl border border-card-border bg-white opacity-30 sm:block"
            style={{ transform: "rotate(2.5deg)" }}
            aria-hidden="true"
          />

          {/* Main document */}
          <div className="relative z-10 overflow-hidden rounded-2xl border border-card-border bg-white shadow-lg">
            {/* Header bar */}
            <div className="flex items-center justify-between bg-[#1E293B] px-5 py-3.5 sm:px-8 sm:py-4">
              <div className="flex items-center gap-2.5">
                <svg
                  className="h-5 w-5 text-white/70"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.8}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                  />
                </svg>
                <span className="text-sm font-medium text-white sm:text-base">
                  商談即決トークスクリプト
                </span>
              </div>
              <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white/80">
                5 STEP × {TOTAL}項目
              </span>
            </div>

            {/* 5-step card grid */}
            <div className="grid grid-cols-2 gap-3 p-4 sm:gap-4 sm:p-6 lg:grid-cols-5">
              {STEPS.map((step, i) => {
                const stepTotal = step.sections.reduce(
                  (a, s) => a + s.count,
                  0
                );
                return (
                  <div
                    key={i}
                    className={`flex flex-col rounded-xl border border-[#F0EDE8] bg-[#FAFAF8] ${
                      i === 4 ? "col-span-2 lg:col-span-1" : ""
                    }`}
                  >
                    {/* Colored top bar */}
                    <div
                      className="h-2 rounded-t-xl"
                      style={{ backgroundColor: step.color }}
                    />

                    <div className="flex flex-1 flex-col p-3.5 sm:p-4">
                      {/* Step number + name */}
                      <div className="mb-3.5 text-center">
                        <div
                          className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-white"
                          style={{ backgroundColor: step.color }}
                        >
                          {i + 1}
                        </div>
                        <p className="text-sm font-bold text-foreground sm:text-base">
                          {step.name}
                        </p>
                        <p className="text-xs text-muted">{step.sub}</p>
                      </div>

                      {/* Section categories */}
                      <div className="flex flex-1 flex-col gap-2">
                        {step.sections.map((sec) => (
                          <div
                            key={sec.label}
                            className="flex items-center justify-between rounded-lg px-3 py-2"
                            style={{
                              backgroundColor: step.color + "0A",
                              border: `1px solid ${step.color}18`,
                            }}
                          >
                            <span className="text-xs font-medium text-foreground sm:text-sm">
                              {sec.label}
                            </span>
                            <span
                              className="ml-1.5 shrink-0 text-xs font-bold sm:text-sm"
                              style={{ color: step.color }}
                            >
                              {sec.count}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Step total */}
                      <div
                        className="mt-3.5 border-t pt-2.5 text-center"
                        style={{ borderColor: step.color + "20" }}
                      >
                        <span
                          className="text-xl font-bold leading-none sm:text-2xl"
                          style={{ color: step.color }}
                        >
                          {stepTotal}
                        </span>
                        <span className="ml-0.5 text-xs text-muted">
                          項目
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer badges */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 border-t border-[#F0EDE8] px-5 py-4 sm:gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#1E293B] px-3.5 py-1.5 text-xs font-medium text-white sm:text-sm">
                <svg
                  className="h-3.5 w-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                  />
                </svg>
                {TOTAL}項目収録
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3.5 py-1.5 text-xs font-medium text-blue-600 sm:text-sm">
                <svg
                  className="h-3.5 w-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                  />
                </svg>
                PDF出力対応
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3.5 py-1.5 text-xs font-medium text-green-600 sm:text-sm">
                <svg
                  className="h-3.5 w-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Pro会員特典
              </span>
            </div>
          </div>
        </div>

        {/* CTA */}
        {showCta && (
          <div className="mt-10 text-center sm:mt-12">
            <Link href="/pricing" className="lp-cta-secondary">
              Proプランの詳細を見る →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
