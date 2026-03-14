import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "リアルタイムAIコーチ機能",
  description:
    "成約コーチ AIのリアルタイムコーチ機能。ロープレ中にAIが成約メソッドのテクニックを分析し、リアルタイムでアドバイスします。",
  alternates: { canonical: "/features/coach" },
};

const coachFeatures = [
  {
    icon: "📍",
    title: "現在のステップ表示",
    desc: "会話の進行に応じて、今どのステップにいるかを自動判定。アプローチ→ヒアリング→プレゼン→クロージング→反論処理の流れを把握できます。",
  },
  {
    icon: "✅",
    title: "テクニック検出",
    desc: "あなたの発言から使用したテクニックを自動検出。「前提設定トーク」「共感フレーズ」「根拠提示」など、成約メソッドの型が使えているかリアルタイムで確認できます。",
  },
  {
    icon: "💡",
    title: "次のアクション提案",
    desc: "「次はヒアリングで深掘りしましょう」「クロージングのタイミングです」など、会話の流れに沿った具体的なアドバイスを表示します。",
  },
  {
    icon: "💬",
    title: "例文コピー機能",
    desc: "各テクニックの具体的な例文をワンクリックでコピー。「こう言えばいい」がすぐにわかるので、初心者でも型を実践しやすくなっています。",
  },
];

export default function CoachFeaturePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="px-6 pt-32 pb-16">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-4 text-5xl">🧠</div>
          <h1 className="mb-4 text-4xl font-bold">リアルタイムAIコーチ</h1>
          <p className="text-lg text-muted">
            ロープレ中にAIがあなたの営業テクニックを分析し、
            <br />
            リアルタイムでアドバイスします
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 pb-20">
        <div className="mx-auto max-w-3xl space-y-6">
          {coachFeatures.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-card-border bg-card p-6"
            >
              <div className="flex items-start gap-4">
                <span className="text-2xl">{f.icon}</span>
                <div>
                  <h2 className="text-lg font-bold">{f.title}</h2>
                  <p className="mt-2 text-sm text-muted leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-card-border px-6 py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-8 text-center text-2xl font-bold">
            コーチはこう動く
          </h2>
          <div className="space-y-4">
            {[
              {
                step: "1",
                text: "あなたが営業トークを入力",
                detail: "普段の営業と同じように、お客さんに話しかけます",
              },
              {
                step: "2",
                text: "AIがテクニックを瞬時に分析",
                detail:
                  "成約メソッドの型に照らし合わせ、使用したテクニックを検出",
              },
              {
                step: "3",
                text: "コーチパネルにフィードバック表示",
                detail:
                  "✅ できている点、🟡 改善の余地がある点、次に使うべき型を表示",
              },
              {
                step: "4",
                text: "例文を参考に次の発言を改善",
                detail:
                  "コーチの提案を参考に、より効果的な営業トークを実践",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="flex gap-4 rounded-xl border border-card-border p-5"
              >
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-accent/10 text-sm font-bold text-accent">
                  {item.step}
                </div>
                <div>
                  <div className="font-bold">{item.text}</div>
                  <div className="mt-1 text-sm text-muted">{item.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-card-border px-6 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-2xl font-bold">
            AIコーチと一緒に練習してみよう
          </h2>
          <p className="mb-8 text-sm text-muted">
            無料でコーチ機能付きのAIロープレを体験できます
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/roleplay"
              className="inline-flex h-14 items-center justify-center rounded-xl bg-accent px-10 text-lg font-bold text-white transition hover:bg-accent-hover"
            >
              無料で始める
            </Link>
            <Link
              href="/features"
              className="inline-flex h-14 items-center justify-center rounded-xl border border-card-border px-10 text-lg font-medium text-muted transition hover:border-accent hover:text-foreground"
            >
              他の機能を見る
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
