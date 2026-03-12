import Link from "next/link";

const stats = [
  { value: "60%超", label: "契約率" },
  { value: "4.5年", label: "新規営業経験" },
  { value: "5ステップ", label: "即決営業メソッド" },
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

const methods = [
  { name: "アプローチ", desc: "褒める→先回り→心の扉を開く", level: "初級" },
  { name: "ヒアリング", desc: "質問でニーズを引き出し、問題を深掘り", level: "初級" },
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

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 z-50 w-full border-b border-card-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🔥</span>
            <span className="text-lg font-bold">即キメAI</span>
          </div>
          <Link
            href="/roleplay"
            className="rounded-lg bg-accent px-5 py-2 text-sm font-semibold text-white transition hover:bg-accent-hover"
          >
            無料で試す
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative flex min-h-screen items-center justify-center px-6 pt-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(249,115,22,0.08),transparent_60%)]" />
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-block rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-sm text-accent">
            AI × 即決営業メソッドで営業力を鍛える
          </div>
          <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight sm:text-6xl">
            AIとロープレして
            <br />
            <span className="text-accent">成約率を上げろ。</span>
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-muted">
            契約率60%超の即決営業メソッドをAIに搭載。
            <br />
            お客さん役のAIと何度でも練習して、本番で即キメできる営業力を手に入れる。
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/roleplay"
              className="flex h-14 w-full items-center justify-center rounded-xl bg-accent px-8 text-lg font-bold text-white transition hover:bg-accent-hover sm:w-auto"
            >
              🎯 無料でロープレを始める
            </Link>
          </div>
          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-8">
            {stats.map((s) => (
              <div key={s.label}>
                <div className="text-3xl font-bold text-accent">{s.value}</div>
                <div className="mt-1 text-sm text-muted">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-card-border px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-4 text-center text-3xl font-bold">使い方は3ステップ</h2>
          <p className="mb-16 text-center text-muted">
            複雑な設定は不要。すぐにロープレを始められます。
          </p>
          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((step) => (
              <div
                key={step.num}
                className="rounded-2xl border border-card-border bg-card p-8"
              >
                <div className="mb-4 text-4xl font-black text-accent/30">
                  {step.num}
                </div>
                <h3 className="mb-2 text-xl font-bold">{step.title}</h3>
                <p className="text-sm leading-relaxed text-muted">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Method */}
      <section className="border-t border-card-border px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-4 text-center text-3xl font-bold">
            即決営業 5ステップメソッド
          </h2>
          <p className="mb-16 text-center text-muted">
            体系化された営業の「型」をAIが正確に評価します
          </p>
          <div className="space-y-4">
            {methods.map((m, i) => (
              <div
                key={m.name}
                className="flex items-center gap-6 rounded-xl border border-card-border bg-card p-6"
              >
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-accent/10 text-lg font-bold text-accent">
                  {i + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-bold">{m.name}</h3>
                    <span className="rounded-full bg-card-border px-2.5 py-0.5 text-xs text-muted">
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

      {/* CTA */}
      <section className="border-t border-card-border px-6 py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-bold">
            今すぐ営業力を鍛えよう
          </h2>
          <p className="mb-10 text-muted">
            無料で1日1回ロープレできます。登録不要、すぐに始められます。
          </p>
          <Link
            href="/roleplay"
            className="inline-flex h-14 items-center justify-center rounded-xl bg-accent px-10 text-lg font-bold text-white transition hover:bg-accent-hover"
          >
            🔥 無料でロープレを始める
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-card-border px-6 py-8">
        <div className="mx-auto max-w-6xl text-center text-sm text-muted">
          &copy; 2025 即キメAI. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
