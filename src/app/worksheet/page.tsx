"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import type { ProductInfo } from "@/types/worksheet";

/* ─── Constants ────────────────────────────────── */

const INDUSTRY_PRESETS = [
  "外壁塗装", "生命保険", "不動産売買", "法人向けSaaS", "学習塾",
  "太陽光パネル", "リフォーム", "人材紹介", "自動車販売", "美容・ダイエット",
];

const PHASES = [
  { num: "Step 1", name: "アプローチ", sub: "信頼構築", color: "#0F6E56" },
  { num: "Step 2", name: "ヒアリング", sub: "課題発掘", color: "#185FA5" },
  { num: "Step 3", name: "プレゼン", sub: "価値提案", color: "#534AB7" },
  { num: "Step 4", name: "クロージング", sub: "決断促進", color: "#993C1D" },
  { num: "Step 5", name: "反論処理", sub: "切り返し", color: "#A32D2D" },
];

const OBJECTION_TYPES = [
  { label: "意思決定の壁", tagClass: "bg-amber-100 text-amber-800", placeholder: "例：上司に相談しないと…", reply: "例：そうですよね、慎重にされたいですよね。ちなみに○○様ご自身はいかがですか？" },
  { label: "比較検討", tagClass: "bg-blue-100 text-blue-800", placeholder: "例：他社も見てから決めたい", reply: "例：もちろんです。ちなみに弊社自体は良いと思ってくださってますか？" },
  { label: "予算の壁", tagClass: "bg-green-100 text-green-800", placeholder: "例：ちょっと高いかな…", reply: "例：高く感じさせてしまってすみません。実は皆さん「値段以上」とおっしゃってまして…" },
  { label: "タイミングの壁", tagClass: "bg-orange-100 text-orange-800", placeholder: "例：今はまだいいかな", reply: "例：いつかはやりたいとは思ってくださってますか？実は先送りが一番リスクが大きくて…" },
];

/* ─── Sub Components ──────────────────────────── */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-3 mt-6 border-b border-card-border pb-1.5 text-xs font-semibold tracking-wide text-muted first:mt-0">
      {children}
    </div>
  );
}

function InputField({
  label, placeholder, hint, value, onChange, multiline,
}: {
  label?: string; placeholder: string; hint?: string;
  value: string; onChange: (v: string) => void; multiline?: boolean;
}) {
  const cls = "w-full rounded-lg border border-card-border bg-background px-3.5 py-2.5 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/10 placeholder:text-muted/40";
  return (
    <div className="mb-3">
      {label && <label className="mb-1 block text-xs font-medium text-muted">{label}</label>}
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`${cls} min-h-[72px] resize-y`}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cls}
        />
      )}
      {hint && <p className="mt-1 text-xs italic text-muted/60">{hint}</p>}
    </div>
  );
}

function Preview({ children, active }: { children: React.ReactNode; active: boolean }) {
  return (
    <div className={`mt-4 border-l-[3px] p-4 text-sm leading-relaxed transition-colors ${
      active
        ? "border-green-500 bg-green-50 text-green-800"
        : "border-card-border bg-background text-muted"
    }`}>
      {children}
    </div>
  );
}

function AIButton({ onClick, loading, children }: { onClick: () => void; loading: boolean; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="mt-4 inline-flex items-center gap-2 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-60 disabled:hover:translate-y-0"
    >
      {loading ? (
        <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
        </svg>
      )}
      {loading ? "生成中..." : children}
    </button>
  );
}

/* ─── Main Component ──────────────────────────── */

export default function WorksheetPage() {
  /* Industry input state */
  const [industry, setIndustry] = useState("");
  const [inputMode, setInputMode] = useState<"simple" | "url" | "detail">("simple");
  const [urlInput, setUrlInput] = useState("");
  const [isAnalyzingUrl, setIsAnalyzingUrl] = useState(false);
  const [productInfo, setProductInfo] = useState<ProductInfo | null>(null);
  const [urlError, setUrlError] = useState("");
  const [detailFields, setDetailFields] = useState({
    productName: "", industry: "", targetAudience: "",
    keyFeatures: "", priceRange: "", advantages: "", challenges: "",
  });

  /* Phase state */
  const [activePhase, setActivePhase] = useState(0);
  const [phaseData, setPhaseData] = useState<Record<string, string>[]>([{}, {}, {}, {}, {}]);
  const [previews, setPreviews] = useState<string[]>(["", "", "", "", ""]);
  const [generatingPhase, setGeneratingPhase] = useState<number | null>(null);

  /* Helpers */
  const f = (key: string) => phaseData[activePhase]?.[key] || "";
  const setF = (key: string, value: string) => {
    setPhaseData((prev) => {
      const next = [...prev];
      next[activePhase] = { ...next[activePhase], [key]: value };
      return next;
    });
  };

  /* URL analysis */
  const handleAnalyzeUrl = useCallback(async () => {
    if (!urlInput.trim()) return;
    setIsAnalyzingUrl(true);
    setUrlError("");
    try {
      const res = await fetch("/api/worksheet/analyze-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: urlInput.trim() }),
      });
      const data = await res.json();
      if (!res.ok) { setUrlError(data.error || "分析に失敗しました"); return; }
      const info: ProductInfo = data.productInfo;
      setProductInfo(info);
      setDetailFields({
        productName: info.productName || "", industry: info.industry || "",
        targetAudience: info.targetAudience || "", keyFeatures: info.keyFeatures || "",
        priceRange: info.priceRange || "", advantages: info.advantages || "",
        challenges: info.challenges || "",
      });
      if (info.industry) setIndustry(info.industry);
    } catch { setUrlError("分析中にエラーが発生しました"); }
    finally { setIsAnalyzingUrl(false); }
  }, [urlInput]);

  const handleDetailApply = () => {
    setProductInfo({ ...detailFields });
    if (detailFields.industry) setIndustry(detailFields.industry);
  };

  /* AI generation per phase */
  const handleGenerate = useCallback(async () => {
    if (!industry.trim()) return;
    setGeneratingPhase(activePhase);
    try {
      const res = await fetch("/api/worksheet/generate-phase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          industry: industry.trim(),
          phase: activePhase,
          ...(productInfo && { productInfo }),
        }),
      });
      if (!res.ok) throw new Error("API error");
      const data = await res.json();

      // Fill empty fields with AI suggestions
      setPhaseData((prev) => {
        const next = [...prev];
        const current = { ...next[activePhase] };
        for (const [key, val] of Object.entries(data)) {
          if (key !== "preview" && typeof val === "string" && !current[key]?.trim()) {
            current[key] = val;
          }
        }
        next[activePhase] = current;
        return next;
      });

      if (data.preview) {
        setPreviews((prev) => {
          const next = [...prev];
          next[activePhase] = data.preview;
          return next;
        });
      }
    } catch {
      alert("生成に失敗しました。もう一度お試しください。");
    } finally {
      setGeneratingPhase(null);
    }
  }, [industry, activePhase, productInfo]);

  /* Navigation */
  const navigate = (dir: number) => {
    const next = activePhase + dir;
    if (next >= 0 && next < PHASES.length) setActivePhase(next);
  };

  const isLoading = generatingPhase === activePhase;
  const preview = previews[activePhase];
  const showWorksheet = industry.trim().length > 0;

  /* ─── Render ───────────────────────────────── */

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Title */}
      <section className="px-6 pt-32 pb-8">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="mb-2 text-2xl font-bold sm:text-3xl">営業準備ワークシート</h1>
          <p className="text-sm text-muted leading-relaxed">
            各フェーズの穴埋めを完成させると、AIがあなた専用のトークスクリプトを自動生成します
          </p>
        </div>
      </section>

      {/* ═══ Industry Input ═══ */}
      <section className="px-6 pb-6">
        <div className="mx-auto max-w-3xl">
          <label className="mb-3 block text-sm font-bold">商材・業種を入力</label>

          <div className="mb-4 flex gap-1 rounded-xl border border-card-border bg-card p-1">
            {([
              { key: "simple" as const, label: "かんたん入力" },
              { key: "url" as const, label: "URLから入力" },
              { key: "detail" as const, label: "詳細入力" },
            ]).map((tab) => (
              <button
                key={tab.key}
                onClick={() => setInputMode(tab.key)}
                className={`flex-1 rounded-lg px-3 py-2 text-xs font-bold transition ${
                  inputMode === tab.key ? "bg-accent text-white" : "text-muted hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {inputMode === "simple" && (
            <div>
              <input
                type="text"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                placeholder="例: 外壁塗装、生命保険、SaaSツール..."
                className="w-full rounded-xl border border-card-border bg-card px-4 py-3 text-sm outline-none transition focus:border-accent"
              />
              <div className="mt-3 flex flex-wrap gap-2">
                {INDUSTRY_PRESETS.map((p) => (
                  <button
                    key={p}
                    onClick={() => setIndustry(p)}
                    className={`rounded-full border px-3 py-1 text-xs transition ${
                      industry === p
                        ? "border-accent bg-accent/10 text-accent"
                        : "border-card-border text-muted hover:border-accent hover:text-foreground"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          )}

          {inputMode === "url" && (
            <div>
              <div className="flex gap-2">
                <input type="url" value={urlInput} onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://example.com/product"
                  className="flex-1 rounded-xl border border-card-border bg-card px-4 py-3 text-sm outline-none transition focus:border-accent" />
                <button onClick={handleAnalyzeUrl} disabled={isAnalyzingUrl || !urlInput.trim()}
                  className="inline-flex items-center rounded-xl bg-accent px-5 font-bold text-white transition hover:bg-accent-hover disabled:opacity-50">
                  {isAnalyzingUrl ? (<><span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />分析中</>) : "分析する"}
                </button>
              </div>
              <p className="mt-2 text-[11px] text-muted">商材のHP・LPのURLを入力すると、AIが商材情報を自動抽出します</p>
              {urlError && <div className="mt-3 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">{urlError}</div>}
              {productInfo && inputMode === "url" && (
                <div className="mt-4 rounded-xl border border-accent/30 bg-accent/5 p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="text-sm font-bold">抽出結果</div>
                    <button onClick={() => setInputMode("detail")} className="rounded-lg border border-card-border px-3 py-1 text-xs text-muted transition hover:border-accent hover:text-accent">編集する</button>
                  </div>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {[
                      { label: "商材名", value: productInfo.productName }, { label: "業種", value: productInfo.industry },
                      { label: "ターゲット層", value: productInfo.targetAudience }, { label: "主な特徴", value: productInfo.keyFeatures },
                      { label: "価格帯", value: productInfo.priceRange }, { label: "競合優位性", value: productInfo.advantages },
                      { label: "課題", value: productInfo.challenges },
                    ].map((item) => (
                      <div key={item.label} className="rounded-lg border border-card-border bg-card px-3 py-2">
                        <div className="text-[10px] font-bold text-muted">{item.label}</div>
                        <div className="text-xs">{item.value || <span className="text-muted/30">未検出</span>}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {inputMode === "detail" && (
            <div className="space-y-3">
              {([
                { key: "productName" as const, label: "商材名", placeholder: "例: スーパーコート外壁塗装" },
                { key: "industry" as const, label: "業種", placeholder: "例: 外壁塗装" },
                { key: "targetAudience" as const, label: "ターゲット層", placeholder: "例: 30-50代の持ち家世帯" },
                { key: "keyFeatures" as const, label: "主な特徴・強み", placeholder: "例: 10年保証、自社施工、地域密着" },
                { key: "priceRange" as const, label: "価格帯", placeholder: "例: 80万〜150万円" },
                { key: "advantages" as const, label: "競合優位性", placeholder: "例: 自社職人のため中間マージンなし" },
                { key: "challenges" as const, label: "課題", placeholder: "例: 訪問営業での信頼獲得が難しい" },
              ]).map((field) => (
                <div key={field.key}>
                  <label className="mb-1 block text-xs font-medium text-muted">{field.label}</label>
                  <input type="text" value={detailFields[field.key]}
                    onChange={(e) => {
                      setDetailFields({ ...detailFields, [field.key]: e.target.value });
                      if (field.key === "industry") setIndustry(e.target.value);
                    }}
                    placeholder={field.placeholder}
                    className="w-full rounded-lg border border-card-border bg-card px-4 py-2.5 text-sm outline-none transition focus:border-accent placeholder:text-muted/40" />
                </div>
              ))}
              <button onClick={handleDetailApply} disabled={!detailFields.industry.trim()}
                className="inline-flex h-10 items-center rounded-xl bg-accent px-6 text-sm font-bold text-white transition hover:bg-accent-hover disabled:opacity-50">
                この内容で分析する
              </button>
              {productInfo && inputMode === "detail" && <p className="text-xs text-accent">詳細情報が設定されました。</p>}
            </div>
          )}
        </div>
      </section>

      {/* ═══ Phase Worksheet ═══ */}
      {showWorksheet && (
        <section className="px-6 pb-16">
          <div className="mx-auto max-w-3xl">

            {/* Tab Bar (sticky) */}
            <div className="sticky top-0 z-10 -mx-6 bg-background/95 px-6 pb-2 pt-3 backdrop-blur-sm">
              <div className="flex gap-1">
                {PHASES.map((p, i) => {
                  const isActive = i === activePhase;
                  return (
                    <button
                      key={i}
                      onClick={() => setActivePhase(i)}
                      className={`relative flex-1 rounded-xl p-2.5 text-center transition sm:p-3 ${
                        isActive
                          ? "bg-card shadow-sm"
                          : "hover:bg-card/50"
                      }`}
                      style={{
                        border: isActive ? `2px solid ${p.color}` : "1px solid transparent",
                      }}
                    >
                      {isActive && (
                        <div
                          className="absolute -top-0.5 left-1/2 h-[3px] w-9 -translate-x-1/2 rounded-full"
                          style={{ background: p.color }}
                        />
                      )}
                      <span
                        className="block text-[10px] font-semibold sm:text-xs"
                        style={{ color: isActive ? p.color : "#B4B2A9" }}
                      >
                        {p.num}
                      </span>
                      <span className={`block text-xs font-semibold sm:text-sm ${isActive ? "text-foreground" : "text-muted"}`}>
                        {p.name}
                      </span>
                      <span
                        className="mt-0.5 hidden text-[10px] sm:block"
                        style={{ color: isActive ? p.color : "#B4B2A9" }}
                      >
                        {p.sub}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Progress Bar */}
              <div className="mt-2 flex gap-1">
                {PHASES.map((p, i) => (
                  <div
                    key={i}
                    className="h-1 flex-1 rounded-full transition-colors"
                    style={{ background: i <= activePhase ? p.color : "rgba(0,0,0,0.06)" }}
                  />
                ))}
              </div>
            </div>

            {/* ── Phase 0: アプローチ ── */}
            {activePhase === 0 && (
              <div className="animate-fadeIn mt-6 rounded-2xl border border-card-border bg-card p-6 shadow-sm sm:p-8">
                <h3 className="mb-1 text-lg font-bold">信頼構築シート</h3>
                <p className="mb-6 text-sm text-muted">商談相手に「この人の話を聞きたい」と思わせる最初の一言を準備する</p>

                <SectionLabel>褒めポイントを3つ準備</SectionLabel>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <InputField label="外見・雰囲気" placeholder="例：明るくて話しやすい雰囲気ですね" hint="見た目、服装、声のトーンなど" value={f("praise1")} onChange={(v) => setF("praise1", v)} />
                  <InputField label="会社・店舗" placeholder="例：オフィスが綺麗で働きやすそう" hint="立地、内装、設備など" value={f("praise2")} onChange={(v) => setF("praise2", v)} />
                  <InputField label="実績・評判" placeholder="例：口コミの評価がすごく高い" hint="受賞歴、メディア掲載、口コミなど" value={f("praise3")} onChange={(v) => setF("praise3", v)} />
                </div>

                <SectionLabel>前提設定（事前合意）</SectionLabel>
                <InputField
                  multiline
                  placeholder="例：本日は弊社サービスについてご説明させてください。もし良いなと思われたら、ぜひこの機会にスタートしてみてください。もし合わないと感じたら遠慮なくおっしゃってください。"
                  hint="「聞いて良ければ契約、合わなければ断ってOK」を事前に伝える文"
                  value={f("premise")} onChange={(v) => setF("premise", v)}
                />

                <Preview active={!!preview}>{preview || "ここに入力内容からトーク例が自動生成されます"}</Preview>
                <AIButton onClick={handleGenerate} loading={isLoading}>AIでトーク例を生成</AIButton>
              </div>
            )}

            {/* ── Phase 1: ヒアリング ── */}
            {activePhase === 1 && (
              <div className="animate-fadeIn mt-6 rounded-2xl border border-card-border bg-card p-6 shadow-sm sm:p-8">
                <h3 className="mb-1 text-lg font-bold">課題発掘シート</h3>
                <p className="mb-6 text-sm text-muted">お客様の「浅い悩み」を「深い問題」に変える質問リストを準備する</p>

                <SectionLabel>想定されるお客様のニーズ（3つ以上）</SectionLabel>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <InputField label="ニーズ 1" placeholder="例：集客に困っている" value={f("need1")} onChange={(v) => setF("need1", v)} />
                  <InputField label="ニーズ 2" placeholder="例：コストを抑えたい" value={f("need2")} onChange={(v) => setF("need2", v)} />
                  <InputField label="ニーズ 3" placeholder="例：人手が足りない" value={f("need3")} onChange={(v) => setF("need3", v)} />
                </div>

                <SectionLabel>深掘り質問チェーン</SectionLabel>
                <InputField label="原因は？" placeholder="例：何が原因だと感じていますか？" value={f("cause")} onChange={(v) => setF("cause", v)} />
                <InputField label="いつから？" placeholder="例：いつ頃からその状況ですか？" value={f("since")} onChange={(v) => setF("since", v)} />
                <InputField label="具体的には？" placeholder="例：具体的にどんな影響が出ていますか？" value={f("concrete")} onChange={(v) => setF("concrete", v)} />
                <InputField label="放置したら？" placeholder="例：このまま続くとどうなりそうですか？" value={f("neglect")} onChange={(v) => setF("neglect", v)} />
                <InputField label="気分は？" placeholder="例：それってどんな気持ちになりますか？" value={f("feeling")} onChange={(v) => setF("feeling", v)} />

                <Preview active={!!preview}>{preview || "入力したニーズ × 深掘り質問の組み合わせをAIが自動でロープレ用スクリプトに変換します"}</Preview>
                <AIButton onClick={handleGenerate} loading={isLoading}>AIでスクリプト生成</AIButton>
              </div>
            )}

            {/* ── Phase 2: プレゼン ── */}
            {activePhase === 2 && (
              <div className="animate-fadeIn mt-6 rounded-2xl border border-card-border bg-card p-6 shadow-sm sm:p-8">
                <h3 className="mb-1 text-lg font-bold">価値提案シート</h3>
                <p className="mb-6 text-sm text-muted">「特徴」を「お客様のメリット」に変換して、比較で優位性を伝える</p>

                <SectionLabel>セールスポイント → ベネフィット変換（3つ）</SectionLabel>
                {[1, 2, 3].map((n) => (
                  <div key={n} className="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <InputField label={`特徴（セールスポイント）${n}`} placeholder={n === 1 ? "例：専任担当制" : n === 2 ? "例：月次レポート提出" : "例：初期費用0円"} value={f(`feature${n}`)} onChange={(v) => setF(`feature${n}`, v)} />
                    <InputField label={`だから → メリット ${n}`} placeholder={n === 1 ? "例：何度も説明し直す手間がない" : n === 2 ? "例：数字で効果が見える" : "例：リスクなく始められる"} value={f(`benefit${n}`)} onChange={(v) => setF(`benefit${n}`, v)} />
                  </div>
                ))}

                <SectionLabel>競合比較</SectionLabel>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <InputField label="他社はこう" placeholder="例：担当がコロコロ変わる" value={f("compCompetitor")} onChange={(v) => setF("compCompetitor", v)} />
                  <InputField label="うちはこう" placeholder="例：専任1人が最後まで対応" value={f("compOurs")} onChange={(v) => setF("compOurs", v)} />
                  <InputField label="だからこのメリット" placeholder="例：一貫した対応で安心" value={f("compBenefit")} onChange={(v) => setF("compBenefit", v)} />
                </div>

                <Preview active={!!preview}>{preview || "「他社は○○だけど、うちは○○。だから○○」のトークをAIが生成します"}</Preview>
                <AIButton onClick={handleGenerate} loading={isLoading}>AIでトーク生成</AIButton>
              </div>
            )}

            {/* ── Phase 3: クロージング ── */}
            {activePhase === 3 && (
              <div className="animate-fadeIn mt-6 rounded-2xl border border-card-border bg-card p-6 shadow-sm sm:p-8">
                <h3 className="mb-1 text-lg font-bold">クロージングシート</h3>
                <p className="mb-6 text-sm text-muted">「お客様の声」「みんなやってます」「論理的な理由」で決断を後押しする</p>

                <SectionLabel>お客様の声（第三者話法）</SectionLabel>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <InputField label="お客様の声 1" placeholder='例：「もっと早くやればよかった」' value={f("voice1")} onChange={(v) => setF("voice1", v)} />
                  <InputField label="お客様の声 2" placeholder='例：「想像以上に成果が出た」' value={f("voice2")} onChange={(v) => setF("voice2", v)} />
                </div>

                <SectionLabel>社会的証明</SectionLabel>
                <InputField label="みんながやっている事実" placeholder="例：同業種の80%が導入済み / 月間50社が新規契約" value={f("socialProof")} onChange={(v) => setF("socialProof", v)} />

                <SectionLabel>決断すべき理由</SectionLabel>
                <InputField label="今やるべき論理的理由" placeholder="例：繁忙期前に準備しないと、来期の売上に直結する" value={f("reason")} onChange={(v) => setF("reason", v)} />

                <SectionLabel>訴求フレーズ</SectionLabel>
                <InputField
                  multiline
                  placeholder='例：「○○と皆さんおっしゃってくれてます。同じ○○業界の方々もスタートされてますので、どうかこの機会にご決断ください。」'
                  value={f("appealPhrase")} onChange={(v) => setF("appealPhrase", v)}
                />

                <Preview active={!!preview}>{preview || "お客様の声 + 社会的証明 + 理由 + 訴求 を組み合わせたクロージングトークをAIが生成します"}</Preview>
                <AIButton onClick={handleGenerate} loading={isLoading}>AIで3パターン生成</AIButton>
              </div>
            )}

            {/* ── Phase 4: 反論処理 ── */}
            {activePhase === 4 && (
              <div className="animate-fadeIn mt-6 rounded-2xl border border-card-border bg-card p-6 shadow-sm sm:p-8">
                <h3 className="mb-1 text-lg font-bold">反論処理シート</h3>
                <p className="mb-6 text-sm text-muted">「考えます」と言われた時の切り返しパターンを事前準備する</p>

                <SectionLabel>想定される反論（4大パターン）</SectionLabel>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {OBJECTION_TYPES.map((obj, i) => (
                    <div key={i} className="rounded-xl border border-card-border bg-background p-4">
                      <div className="mb-3">
                        <span className={`inline-block rounded-md px-2.5 py-1 text-[11px] font-semibold ${obj.tagClass}`}>
                          {obj.label}
                        </span>
                      </div>
                      <InputField label="想定セリフ" placeholder={obj.placeholder} value={f(`obj${i + 1}Script`)} onChange={(v) => setF(`obj${i + 1}Script`, v)} />
                      <InputField label="あなたの切り返し" placeholder={obj.reply} multiline value={f(`obj${i + 1}Response`)} onChange={(v) => setF(`obj${i + 1}Response`, v)} />
                    </div>
                  ))}
                </div>

                <Preview active={!!preview}>{preview || "4つの反論パターン × あなたの商材で、AIがロープレシナリオを自動生成します"}</Preview>
                <AIButton onClick={handleGenerate} loading={isLoading}>AIで反論ロープレ生成</AIButton>
              </div>
            )}

            {/* Navigation */}
            <div className="mt-8 flex items-center justify-between">
              <button
                onClick={() => navigate(-1)}
                disabled={activePhase === 0}
                className="rounded-lg border border-card-border bg-card px-5 py-2.5 text-sm font-medium transition hover:border-accent disabled:cursor-not-allowed disabled:opacity-40"
              >
                ← 前のステップ
              </button>
              <span className="text-sm text-muted">
                {activePhase + 1} / {PHASES.length}
              </span>
              <button
                onClick={() => navigate(1)}
                disabled={activePhase === PHASES.length - 1}
                className="rounded-lg px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                style={{
                  background: activePhase < PHASES.length - 1
                    ? PHASES[activePhase + 1].color
                    : "#D3D1C7",
                }}
              >
                次のステップ →
              </button>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="border-t border-card-border px-6 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-3 text-xl font-bold">準備ができたら、ロープレで実践しよう</h2>
          <p className="mb-6 text-sm text-muted">ワークシートで整理した知識をAIロープレで実践練習</p>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link href="/roleplay" className="inline-flex h-12 items-center justify-center rounded-xl bg-accent px-8 font-bold text-white transition hover:bg-accent-hover">
              ロープレを始める
            </Link>
            <Link href="/features" className="inline-flex h-12 items-center justify-center rounded-xl border border-card-border px-8 text-sm font-medium text-muted transition hover:border-accent hover:text-foreground">
              他の機能を見る
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
