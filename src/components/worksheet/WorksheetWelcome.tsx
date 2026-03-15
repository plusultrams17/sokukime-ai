"use client";

const INDUSTRY_PRESETS = [
  "外壁塗装",
  "生命保険",
  "不動産売買",
  "法人向けSaaS",
  "学習塾",
  "太陽光パネル",
  "リフォーム",
  "人材紹介",
  "自動車販売",
  "美容・ダイエット",
];

const STEPS = [
  {
    num: "1",
    title: "商材を入力",
    desc: "あなたの業種・商材を選ぶだけ",
    color: "#0F6E56",
  },
  {
    num: "2",
    title: "穴埋めを完成",
    desc: "5フェーズのテンプレを埋める",
    color: "#185FA5",
  },
  {
    num: "3",
    title: "AIがスクリプト生成",
    desc: "あなた専用のトーク例が完成",
    color: "#534AB7",
  },
];

interface WorksheetWelcomeProps {
  industry: string;
  setIndustry: (v: string) => void;
  onStart: () => void;
}

export function WorksheetWelcome({
  industry,
  setIndustry,
  onStart,
}: WorksheetWelcomeProps) {
  return (
    <section className="px-6 pb-16">
      <div className="mx-auto max-w-3xl">
        {/* Value Proposition */}
        <div className="animate-fade-in-up rounded-2xl border border-[#E8E4DD] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] sm:p-10">
          <div className="mb-8 text-center">
            <h2 className="mb-2 text-xl font-bold text-[#1E293B] sm:text-2xl">
              商談の準備を5ステップで完成させよう
            </h2>
            <p className="text-sm leading-relaxed text-[#6B7280]">
              AIが穴埋めからトークスクリプトまで自動生成。
              <br className="hidden sm:block" />
              あなた専用の営業台本が数分で手に入ります。
            </p>
          </div>

          {/* 3-Step Explainer */}
          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {STEPS.map((step, i) => (
              <div
                key={step.num}
                className="animate-fade-in-up flex items-start gap-3 rounded-xl border border-[#E8E4DD] bg-[#FAFAF8] p-4"
                style={{ animationDelay: `${i * 0.1}s`, animationFillMode: "both" }}
              >
                <span
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                  style={{ background: step.color }}
                >
                  {step.num}
                </span>
                <div>
                  <p className="text-sm font-bold text-[#1E293B]">{step.title}</p>
                  <p className="mt-0.5 text-xs text-[#9CA3AF]">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Guided Industry Selection */}
          <div className="rounded-xl border-2 border-accent/20 bg-accent/[0.03] p-5 animate-gentle-pulse">
            <p className="mb-3 text-center text-sm font-bold text-[#1E293B]">
              まずは業種を選んでみましょう
            </p>
            <input
              type="text"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              placeholder="例: 外壁塗装、生命保険、SaaSツール..."
              className="mb-3 w-full rounded-lg border border-[#E5E0D8] bg-white px-4 py-3 text-sm outline-none transition-all focus:border-[#378ADD] focus:shadow-[0_0_0_3px_rgba(55,138,221,0.1)] placeholder:text-[#B4B0A8]"
            />
            <div className="flex flex-wrap justify-center gap-2">
              {INDUSTRY_PRESETS.map((p) => (
                <button
                  key={p}
                  onClick={() => {
                    setIndustry(p);
                    onStart();
                  }}
                  className="cursor-pointer rounded-full border border-[#E5E0D8] px-3 py-1.5 text-xs font-medium text-[#6B7280] transition-all hover:border-accent hover:bg-accent/5 hover:text-accent"
                >
                  {p}
                </button>
              ))}
            </div>
            {industry.trim() && (
              <div className="mt-4 text-center">
                <button
                  onClick={onStart}
                  className="inline-flex h-11 cursor-pointer items-center justify-center rounded-xl bg-accent px-8 text-sm font-bold text-white transition hover:bg-accent-hover"
                >
                  ワークシートを始める
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
