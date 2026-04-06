"use client";
import { useState } from "react";

export interface OnboardingPreset {
  product: string;
  scene: string;
  customerType: string;
  difficulty: string;
}

interface WelcomeModalProps {
  open: boolean;
  onComplete: (preset?: OnboardingPreset) => void;
}

const industries = [
  {
    value: "housing",
    label: "住宅・リフォーム",
    icon: "",
    products: ["外壁塗装", "リフォーム", "太陽光パネル"],
  },
  {
    value: "insurance",
    label: "保険・金融",
    icon: "",
    products: ["生命保険", "損害保険", "投資商品"],
  },
  {
    value: "education",
    label: "教育・スクール",
    icon: "",
    products: ["学習塾の入会", "オンライン講座", "英会話スクール"],
  },
  {
    value: "it",
    label: "IT・SaaS",
    icon: "",
    products: ["法人向けクラウドサービス", "業務効率化ツール", "セキュリティソフト"],
  },
  {
    value: "other",
    label: "その他",
    icon: "",
    products: [],
  },
];

const scenes = [
  { value: "visit", label: "訪問営業", desc: "お客さん宅・会社に訪問" },
  { value: "phone", label: "電話営業", desc: "テレアポ・電話商談" },
  { value: "inbound", label: "問い合わせ対応", desc: "お客さんからの問い合わせ" },
];

export function WelcomeModal({ open, onComplete }: WelcomeModalProps) {
  const [step, setStep] = useState(0);
  const [selectedIndustry, setSelectedIndustry] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [customProduct, setCustomProduct] = useState("");
  const [selectedScene, setSelectedScene] = useState("");

  if (!open) return null;

  const industry = industries.find((i) => i.value === selectedIndustry);

  const canProceedStep1 =
    selectedIndustry &&
    (selectedIndustry !== "other"
      ? selectedProduct
      : customProduct.trim());

  function handleIndustrySelect(value: string) {
    setSelectedIndustry(value);
    setSelectedProduct("");
    setCustomProduct("");
  }

  function handleComplete() {
    const product =
      selectedIndustry === "other"
        ? customProduct.trim()
        : selectedProduct;

    onComplete({
      product,
      scene: selectedScene,
      customerType: "individual",
      difficulty: "friendly",
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-md animate-fade-in-up rounded-2xl border border-card-border bg-card p-8">
        {step === 0 && (
          <>
            <div className="mb-1 text-xs font-medium text-accent">
              STEP 1 / 2
            </div>
            <h2 className="mb-1 text-xl font-bold">
              どんな商材を扱っていますか？
            </h2>
            <p className="mb-5 text-sm text-muted">
              あなたの業界に合わせたロープレを用意します
            </p>

            <div className="space-y-2">
              {industries.map((ind) => (
                <button
                  key={ind.value}
                  onClick={() => handleIndustrySelect(ind.value)}
                  className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition ${
                    selectedIndustry === ind.value
                      ? "border-accent bg-accent/10"
                      : "border-card-border hover:border-accent/50"
                  }`}
                >
                  {ind.icon ? <span className="text-xl">{ind.icon}</span> : null}
                  <span className="text-sm font-medium">{ind.label}</span>
                </button>
              ))}
            </div>

            {/* Product sub-selection */}
            {industry && industry.products.length > 0 && (
              <div className="mt-4">
                <div className="mb-2 text-xs font-medium text-muted">
                  具体的な商材は？
                </div>
                <div className="flex flex-wrap gap-2">
                  {industry.products.map((p) => (
                    <button
                      key={p}
                      onClick={() => setSelectedProduct(p)}
                      className={`rounded-full border px-3 py-1.5 text-xs transition ${
                        selectedProduct === p
                          ? "border-accent bg-accent/10 text-accent font-medium"
                          : "border-card-border text-muted hover:border-accent/50"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Custom product input for "other" */}
            {selectedIndustry === "other" && (
              <div className="mt-4">
                <input
                  type="text"
                  value={customProduct}
                  onChange={(e) => setCustomProduct(e.target.value)}
                  placeholder="商材名を入力してください..."
                  className="w-full rounded-lg border border-card-border bg-background px-4 py-3 text-sm outline-none placeholder:text-muted/50 focus:border-accent"
                  autoFocus
                />
              </div>
            )}

            <button
              onClick={() => setStep(1)}
              disabled={!canProceedStep1}
              className="mt-6 flex h-12 w-full items-center justify-center rounded-xl bg-accent text-base font-bold text-white transition hover:bg-accent-hover disabled:opacity-40"
            >
              次へ
            </button>

            <button
              onClick={() => onComplete()}
              className="mt-3 w-full text-center text-xs text-muted hover:text-foreground"
            >
              スキップして自分で設定する
            </button>
          </>
        )}

        {step === 1 && (
          <>
            <div className="mb-1 text-xs font-medium text-accent">
              STEP 2 / 2
            </div>
            <h2 className="mb-1 text-xl font-bold">
              よくある商談シーンは？
            </h2>
            <p className="mb-5 text-sm text-muted">
              実際の営業に近いシーンでロープレできます
            </p>

            <div className="space-y-2">
              {scenes.map((s) => (
                <button
                  key={s.value}
                  onClick={() => setSelectedScene(s.value)}
                  className={`flex w-full flex-col rounded-xl border p-4 text-left transition ${
                    selectedScene === s.value
                      ? "border-accent bg-accent/10"
                      : "border-card-border hover:border-accent/50"
                  }`}
                >
                  <span className="text-sm font-medium">{s.label}</span>
                  <span className="mt-0.5 text-xs text-muted">{s.desc}</span>
                </button>
              ))}
            </div>

            <button
              onClick={handleComplete}
              disabled={!selectedScene}
              className="mt-6 flex h-12 w-full items-center justify-center rounded-xl bg-accent text-base font-bold text-white transition hover:bg-accent-hover disabled:opacity-40"
            >
              ロープレを始める
            </button>

            <button
              onClick={() => setStep(0)}
              className="mt-3 w-full text-center text-xs text-muted hover:text-foreground"
            >
              ← 戻る
            </button>
          </>
        )}
      </div>
    </div>
  );
}
