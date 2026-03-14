"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import type { ProductInfo } from "@/types/worksheet";
import { PdfExportButton } from "@/components/pdf/PdfExportButton";
import WorksheetPdfContent from "@/components/pdf/WorksheetPdfContent";

/* ─── Constants ────────────────────────────────── */

const INDUSTRY_PRESETS = [
  "外壁塗装", "生命保険", "不動産売買", "法人向けSaaS", "学習塾",
  "太陽光パネル", "リフォーム", "人材紹介", "自動車販売", "美容・ダイエット",
];

const PHASES = [
  { num: "Step 1", name: "アプローチ", sub: "信頼構築", color: "#0F6E56" },
  { num: "Step 2", name: "ヒアリング", sub: "課題発掘", color: "#185FA5" },
  { num: "Step 3", name: "プレゼン", sub: "価値提案", color: "#534AB7" },
  { num: "Step 4", name: "クロージング", sub: "決断促進", color: "#2563EB" },
  { num: "Step 5", name: "反論処理", sub: "切り返し", color: "#7C3AED" },
];

/* ─── Sub Components ──────────────────────────── */

function SectionLabel({ children, color }: { children: React.ReactNode; color?: string }) {
  return (
    <div
      className="mb-3 mt-6 border-b pb-1.5 text-xs font-semibold tracking-wide first:mt-0"
      style={{ borderColor: color ? `${color}30` : undefined, color: color || undefined }}
    >
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

function TechniqueCard({
  number, title, description, color, children,
}: {
  number: string; title: string; description: string; color: string; children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-card-border bg-background p-4">
      <div className="mb-3 flex items-center gap-2">
        <span
          className="inline-flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold text-white"
          style={{ background: color }}
        >
          {number}
        </span>
        <span className="text-sm font-bold">{title}</span>
      </div>
      <p className="mb-3 text-xs text-muted">{description}</p>
      {children}
    </div>
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
  const pc = PHASES[activePhase].color; // phase color shortcut

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

                <SectionLabel color={pc}>褒めポイントを3つ準備（比較で強調）</SectionLabel>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <InputField label="外見・雰囲気" placeholder="例：今まで何社もお伺いしましたが、こんなに明るい雰囲気の方は初めてです" hint="比較対象を入れると伝わる（自分と比較・今までと比較）" value={f("praise1")} onChange={(v) => setF("praise1", v)} />
                  <InputField label="会社・店舗" placeholder="例：このオフィス、今まで見た中でダントツに綺麗ですね！" hint="オフィス、店舗、設備、立地など" value={f("praise2")} onChange={(v) => setF("praise2", v)} />
                  <InputField label="実績・評判" placeholder="例：口コミ評価がこんなに高い会社は珍しいですよ" hint="受賞歴、口コミ、メディア掲載など" value={f("praise3")} onChange={(v) => setF("praise3", v)} />
                </div>
                <p className="mt-2 text-xs text-muted/60 italic">※謙遜されても同じ内容で「2度褒める」のがポイント。満更でもない表情が出たらシグナル。</p>

                <SectionLabel color={pc}>前提設定（先回り・事前合意）</SectionLabel>
                <InputField
                  multiline
                  placeholder="例：精一杯ご説明させていただきます。もし気に入らなければ遠慮なく断ってください。もし良いなと思われたら、ぜひこの機会にスタートしてみてください。よろしいですか？"
                  hint="①精一杯説明 → ②気に入らなければ断ってOK → ③良ければ契約 → ④「よろしいですか？」で念押し。アポ時＋商談前の2回行う"
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
                <p className="mb-6 text-sm text-muted">お客様の「浅い悩み」を「深い問題」に変えて、行動する理由を作る</p>

                <SectionLabel color={pc}>想定されるお客様のニーズ（3つ以上）</SectionLabel>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <InputField label="ニーズ 1" placeholder="例：集客に困っている" value={f("need1")} onChange={(v) => setF("need1", v)} />
                  <InputField label="ニーズ 2" placeholder="例：コストを抑えたい" value={f("need2")} onChange={(v) => setF("need2", v)} />
                  <InputField label="ニーズ 3" placeholder="例：人手が足りない" value={f("need3")} onChange={(v) => setF("need3", v)} />
                </div>

                <SectionLabel color={pc}>引き出しフレーズ（第三者話法＋質問）</SectionLabel>
                <p className="mb-3 text-xs text-muted">1行目は第三者話法で口語、2行目は文語で質問。「〇〇と悩んでいる方が多いのですが」で答えやすくする</p>
                <InputField label="引き出しフレーズ①" placeholder='例：「集客がなかなかうまくいかないんだよね」と悩んでいる方が多いのですが、○○さんは集客でのお悩みなどないですか？' multiline value={f("drawer1")} onChange={(v) => setF("drawer1", v)} />
                <InputField label="引き出しフレーズ②" placeholder='例：「コストが年々上がって大変だ」とおっしゃる方が多いのですが、○○さんはいかがですか？' multiline value={f("drawer2")} onChange={(v) => setF("drawer2", v)} />
                <InputField label="引き出しフレーズ③" placeholder='例：「人が足りなくて回らない」と嘆かれる方が多いのですが、○○さんもそういったお悩みはありますか？' multiline value={f("drawer3")} onChange={(v) => setF("drawer3", v)} />

                <SectionLabel color={pc}>深掘り質問チェーン（浅い→深いへ）</SectionLabel>
                <InputField label="原因は？" placeholder="例：何が原因だと感じていますか？" value={f("cause")} onChange={(v) => setF("cause", v)} />
                <InputField label="いつから？（時間軸＋金額換算）" placeholder="例：いつ頃からその状況ですか？ 月○万の損失なら年間で○○万円に…" hint="金額×期間で具体的にすると緊急性が増す" value={f("since")} onChange={(v) => setF("since", v)} />
                <InputField label="具体的には？" placeholder="例：具体的にどんな影響が出ていますか？" hint="「具体的に」を2〜4回繰り返すと最悪な問題に辿り着く" value={f("concrete")} onChange={(v) => setF("concrete", v)} />
                <InputField label="放置したら？" placeholder="例：このまま放置すると具体的にどうなりそうですか？" value={f("neglect")} onChange={(v) => setF("neglect", v)} />
                <InputField label="気分は？" placeholder="例：それって、気分はどうですか？" hint="お客様の口から言ってもらう。「困りますよね？」の誘導尋問はNG" value={f("feeling")} onChange={(v) => setF("feeling", v)} />

                <Preview active={!!preview}>{preview || "引き出しフレーズ × 深掘り質問チェーンをAIが自動でスクリプトに変換します"}</Preview>
                <AIButton onClick={handleGenerate} loading={isLoading}>AIでスクリプト生成</AIButton>
              </div>
            )}

            {/* ── Phase 2: プレゼン ── */}
            {activePhase === 2 && (
              <div className="animate-fadeIn mt-6 rounded-2xl border border-card-border bg-card p-6 shadow-sm sm:p-8">
                <h3 className="mb-1 text-lg font-bold">価値提案シート</h3>
                <p className="mb-6 text-sm text-muted">「特徴」を「お客様のメリット」に変換し、比較と想像で価値を伝える</p>

                <SectionLabel color={pc}>利点話法：セールスポイント → ベネフィット変換（3つ）</SectionLabel>
                <p className="mb-3 text-xs text-muted">SPだけでは売れない。「だから」で繋いでお客様のメリットを明確にする</p>
                {[1, 2, 3].map((n) => (
                  <div key={n} className="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <InputField label={`特徴（セールスポイント）${n}`} placeholder={n === 1 ? "例：専任担当制" : n === 2 ? "例：月次レポート提出" : "例：初期費用0円"} value={f(`feature${n}`)} onChange={(v) => setF(`feature${n}`, v)} />
                    <InputField label={`だから → メリット ${n}`} placeholder={n === 1 ? "例：何度も説明し直す手間がない" : n === 2 ? "例：数字で効果が見える" : "例：リスクなく始められる"} value={f(`benefit${n}`)} onChange={(v) => setF(`benefit${n}`, v)} />
                  </div>
                ))}

                <SectionLabel color={pc}>比較話法：競合との比較</SectionLabel>
                <p className="mb-3 text-xs text-muted">お客様は比較でしか商品の良さを理解できない。勝てる部分だけで勝負する</p>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <InputField label="他社はこう" placeholder="例：担当がコロコロ変わる" hint="「他社だと○○」「このままだと○○」形式" value={f("compCompetitor")} onChange={(v) => setF("compCompetitor", v)} />
                  <InputField label="うちはこう" placeholder="例：専任1人が最後まで対応" value={f("compOurs")} onChange={(v) => setF("compOurs", v)} />
                  <InputField label="だからこのメリット" placeholder="例：一貫した対応で安心" value={f("compBenefit")} onChange={(v) => setF("compBenefit", v)} />
                </div>

                <SectionLabel color={pc}>IF活用：想像させるフレーズ</SectionLabel>
                <p className="mb-3 text-xs text-muted">脳は想像と現実の区別がない。「もし」で想像させると、それを体験したように感じる</p>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <InputField label="天国IF（ポジティブ想像）" placeholder='例：もし毎月安定して新規が10件入ってきたら、気分はどうですか？' hint="得られる未来を想像させる" value={f("heavenIf")} onChange={(v) => setF("heavenIf", v)} />
                  <InputField label="地獄IF（ネガティブ想像）" placeholder='例：もしこのまま3年間、集客が今のままだったら気分はどうですか？' hint="地獄IFは天国の2倍の訴求力。本当にありそうな具体的な1コマを想像させる" value={f("hellIf")} onChange={(v) => setF("hellIf", v)} />
                </div>

                <Preview active={!!preview}>{preview || "利点話法＋比較＋IF活用を組み合わせたプレゼントークをAIが生成します"}</Preview>
                <AIButton onClick={handleGenerate} loading={isLoading}>AIでトーク生成</AIButton>
              </div>
            )}

            {/* ── Phase 3: クロージング ── */}
            {activePhase === 3 && (
              <div className="animate-fadeIn mt-6 rounded-2xl border border-card-border bg-card p-6 shadow-sm sm:p-8">
                <h3 className="mb-1 text-lg font-bold">クロージングシート</h3>
                <p className="mb-6 text-sm text-muted">訴求のための「武器」を準備し、ポジティブ・ネガティブ両面からお客様の決断を後押しする</p>

                {/* 基本3技術 */}
                <SectionLabel color={pc}>基本3技術（クロージングの武器）</SectionLabel>
                <div className="space-y-3">
                  <InputField
                    label="① カギカッコ（第三者話法）"
                    placeholder='例：○○さん、「もっと早くやればよかった！」ってみなさんおっしゃるんです。'
                    hint="自分の言葉ではなくお客様の声をそのまま伝える。前後に「間」を置く"
                    value={f("quote1")} onChange={(v) => setF("quote1", v)}
                  />
                  <InputField
                    label="カギカッコ②（別の切り口）"
                    placeholder='例：「想像以上に成果が出て驚きました」とおっしゃる方がほとんどです。'
                    value={f("quote2")} onChange={(v) => setF("quote2", v)}
                  />
                  <InputField
                    label="② 過半数（社会的証明）"
                    placeholder='例：みなっっっさん、選ばれています！同業種の方の8割がスタートされています。'
                    hint="「みなっっっさん」を力強く強調。繰り返し重ねるほど効果UP"
                    value={f("socialProof")} onChange={(v) => setF("socialProof", v)}
                  />
                  <InputField
                    label="③ 一貫性通し（前提→訴求）"
                    placeholder='例：最初にお伝えしましたよね。良いと思ったらスタートしてください、と。○○さんも良いと思ってくださっている。ですから、今日スタートしましょう。'
                    hint="始めと終わりを一致させる。「。（まる）」で言い切り→「間」→訴求"
                    multiline
                    value={f("consistency")} onChange={(v) => setF("consistency", v)}
                  />
                </div>

                {/* ポジティブクロージング */}
                <SectionLabel color="#2563EB">ポジティブクロージング</SectionLabel>
                <div className="space-y-3">
                  <InputField
                    label="天国IF（ポジティブ想像）"
                    placeholder='例：もし○○が実現したら、気分はどうですか？ →3倍リアクション＋オウム返し'
                    hint="ポジティブシングル用：SP→ベネフィット→IF想像→反応→カギカッコ→訴求"
                    value={f("posIf")} onChange={(v) => setF("posIf", v)}
                  />
                  <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-4">
                    <p className="mb-3 text-xs font-semibold text-blue-800">ポジティブトリプル（3連発リズム）</p>
                    <p className="mb-3 text-[11px] text-blue-600">3つとも長さを揃える。リズムで相手の納得感を増す。「もし〜」は入れない</p>
                    <InputField label="① SP→ベネフィット" placeholder="例：専任担当制だから、何度も説明し直す必要がありません" value={f("posTriple1")} onChange={(v) => setF("posTriple1", v)} />
                    <InputField label="② しかも！SP→ベネフィット" placeholder="例：しかも！月次レポートで効果が数字で見えます" value={f("posTriple2")} onChange={(v) => setF("posTriple2", v)} />
                    <InputField label="③ さらに！SP→ベネフィット" placeholder="例：さらに！初期費用0円でリスクなく始められます" value={f("posTriple3")} onChange={(v) => setF("posTriple3", v)} />
                  </div>
                </div>

                {/* ネガティブクロージング */}
                <SectionLabel color="#DC2626">ネガティブクロージング（ゆさぶり）</SectionLabel>
                <p className="mb-3 text-xs text-muted">人は得するより損したくない気持ちの方が2倍強い（プロスペクト理論）。敬意を必ず添える</p>
                <div className="space-y-3">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <InputField
                      label="逆セールスポイント"
                      placeholder='例：もし専任担当がいなかったら…'
                      hint="「○○じゃないと」「このままだと」「他社だと」形式"
                      value={f("negReverseSP")} onChange={(v) => setF("negReverseSP", v)}
                    />
                    <InputField
                      label="逆ベネフィット（ゆさぶりフレーズ）"
                      placeholder='例：毎回ゼロから説明し直す手間が永遠に続きます'
                      hint="お客様が嫌がる具体的な1コマ"
                      value={f("negReverseBenefit")} onChange={(v) => setF("negReverseBenefit", v)}
                    />
                  </div>
                  <InputField
                    label="地獄IF（ネガティブ想像）"
                    placeholder='例：○○様に限って当てはまらないですが、もしこのまま放置して○○になってしまったら、気分はどうですか？'
                    hint="必ず「○○様に限って当てはまらないですが」の敬意を先に入れる"
                    value={f("negIf")} onChange={(v) => setF("negIf", v)}
                  />
                  <div className="rounded-xl border border-red-200 bg-red-50/50 p-4">
                    <p className="mb-3 text-xs font-semibold text-red-800">ネガティブトリプル（ゆさぶり3連発）</p>
                    <InputField label="ゆさぶり①" placeholder="例：もし対策しなかったら、年間○万円の損失が続きます" value={f("negTriple1")} onChange={(v) => setF("negTriple1", v)} />
                    <InputField label="ゆさぶり②" placeholder="例：しかも、競合はどんどん先に進んでいます" value={f("negTriple2")} onChange={(v) => setF("negTriple2", v)} />
                    <InputField label="ゆさぶり③" placeholder="例：さらに、問題は時間とともに必ず悪化します" value={f("negTriple3")} onChange={(v) => setF("negTriple3", v)} />
                  </div>
                </div>

                {/* 欲求パターン */}
                <SectionLabel color={pc}>欲求パターン</SectionLabel>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <InputField
                    label="積極的欲求（〜したい）"
                    placeholder='例：売上を安定させたいですよね？'
                    hint="〜したい、〜になりたい"
                    value={f("activeDesire")} onChange={(v) => setF("activeDesire", v)}
                  />
                  <InputField
                    label="消極的欲求（〜したくない）"
                    placeholder='例：お客様を逃し続けたくないですよね？'
                    hint="〜したくない、〜と思われたくない。こちらの方が強い反応を引き出す"
                    value={f("passiveDesire")} onChange={(v) => setF("passiveDesire", v)}
                  />
                </div>

                {/* 訴求フレーズ */}
                <SectionLabel color={pc}>訴求フレーズ（まとめ）</SectionLabel>
                <InputField
                  multiline
                  placeholder='例：みなっさん「もっと早くやればよかった」とおっしゃってくださってます。同業種の方の8割がスタートされてます。ですから○○さんも、ぜひこの機会にスタートしてください。'
                  hint="カギカッコ＋過半数or一貫性通し＋訴求 を組み合わせる"
                  value={f("appealPhrase")} onChange={(v) => setF("appealPhrase", v)}
                />

                <Preview active={!!preview}>{preview || "基本3技術 × ポジティブ × ネガティブを組み合わせた完成クロージングトークをAIが生成します"}</Preview>
                <AIButton onClick={handleGenerate} loading={isLoading}>AIでクロージング生成</AIButton>
              </div>
            )}

            {/* ── Phase 4: 反論処理 ── */}
            {activePhase === 4 && (
              <div className="animate-fadeIn mt-6 rounded-2xl border border-card-border bg-card p-6 shadow-sm sm:p-8">
                <h3 className="mb-1 text-lg font-bold">反論処理シート</h3>
                <p className="mb-6 text-sm text-muted">「考えます」と言われた時の切り返しパターンを事前準備する</p>

                {/* 4大パターン */}
                <SectionLabel color={pc}>想定される反論（4大パターン）</SectionLabel>
                <p className="mb-3 text-xs text-muted">お客様の「考えます」の裏にある本音を4パターンに分類し、それぞれの切り返しを準備する</p>
                <div className="space-y-4">
                  {[
                    { num: "1", title: "意思決定の壁", color: "#0F6E56", scriptLabel: "想定セリフ", scriptPlaceholder: "例：上司に相談しないと…", scriptHint: "上司・家族など、自分だけでは決められないケース", rebuttalPlaceholder: "例：そうですよね、大きな決断ですから当然です。ちなみに、○○さんご自身は良いと思ってくださっていますか？もしそうでしたら、上司の方にご説明しやすい資料を一緒に作りましょう。" },
                    { num: "2", title: "比較検討", color: "#185FA5", scriptLabel: "想定セリフ", scriptPlaceholder: "例：他社も見てから決めたい", scriptHint: "他社と比較・もう少し調べたいケース", rebuttalPlaceholder: "例：もちろんです、比較検討は大事ですよね。ただ実は、他も見たいとおっしゃる方の多くは「迷っているだけ」なんです。○○さんが重視されるポイントでは、弊社が一番お力になれると確信しています。" },
                    { num: "3", title: "予算の壁", color: "#2563EB", scriptLabel: "想定セリフ", scriptPlaceholder: "例：ちょっと高いかな…", scriptHint: "価格が高い・予算がないケース", rebuttalPlaceholder: "例：高く感じさせてしまって申し訳ございません。私の伝え方が足りなかっただけなんです。みなっさん「安いよね」とおっしゃってくださる理由は、○○だから○○、しかも○○だから○○なんです。" },
                    { num: "4", title: "タイミングの壁", color: "#7C3AED", scriptLabel: "想定セリフ", scriptPlaceholder: "例：今はまだいいかな", scriptHint: "今じゃなくてもいい・来月以降でケース", rebuttalPlaceholder: "例：いつかはやりたいとお思いですよね？実は「今じゃない」とおっしゃった方の多くが、半年後に「あの時やっておけば…」とおっしゃるんです。問題は先送りするほど大きくなります。" },
                  ].map((pattern) => (
                    <div key={pattern.num} className="rounded-xl border border-card-border bg-background p-4">
                      <div className="mb-3 flex items-center gap-2">
                        <span
                          className="inline-flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold text-white"
                          style={{ background: pattern.color }}
                        >
                          {pattern.num}
                        </span>
                        <span className="text-sm font-bold">{pattern.title}</span>
                      </div>
                      <InputField
                        label={pattern.scriptLabel}
                        placeholder={pattern.scriptPlaceholder}
                        hint={pattern.scriptHint}
                        value={f(`obj${pattern.num}Script`)} onChange={(v) => setF(`obj${pattern.num}Script`, v)}
                      />
                      <InputField
                        label="あなたの切り返し"
                        placeholder={pattern.rebuttalPlaceholder}
                        multiline
                        value={f(`obj${pattern.num}Rebuttal`)} onChange={(v) => setF(`obj${pattern.num}Rebuttal`, v)}
                      />
                    </div>
                  ))}
                </div>

                {/* 共通の型 */}
                <SectionLabel color={pc}>切り返しの型（全技法共通の冒頭）</SectionLabel>
                <p className="mb-3 text-xs text-muted">全ての切り返しはこの型から始める。1つでも抜けると効果がなくなる</p>
                <InputField
                  label="① 共感"
                  placeholder='例：あーそうですよねー、考えたいですよねー、わかりますー'
                  hint="あわてず自信と余裕を見せる"
                  value={f("empathy")} onChange={(v) => setF("empathy", v)}
                />
                <InputField
                  label="② 感謝"
                  placeholder='例：真剣に考えていただいて、ありがとうございます。'
                  value={f("gratitude")} onChange={(v) => setF("gratitude", v)}
                />
                <InputField
                  label="③ フック（小さなYESを取る）"
                  placeholder='例：ちなみに、商品自体は良いと思ってくださっていますか？'
                  hint="ここでYESをもらうと「あなたが良いと言ったから背中を押す」形にできる"
                  value={f("hook")} onChange={(v) => setF("hook", v)}
                />

                {/* 5つの切り返し技法 */}
                <SectionLabel color={pc}>切り返し5技法</SectionLabel>
                <div className="space-y-4">
                  <TechniqueCard
                    number="1" title="目的の振り返り" color="#0F6E56"
                    description="考えたい・検討したいケースに有効。視野が狭くなった顧客を「森」に戻す"
                  >
                    <InputField
                      label="目的の振り返り"
                      placeholder='例：○○さん、今日の目的を思い出しましょう。○○の改善が目的でしたよね？'
                      hint="木を見て森を見ず → 一度森に戻す"
                      value={f("tech1Recall")} onChange={(v) => setF("tech1Recall", v)}
                    />
                    <InputField
                      label="AREA話法（主張→理由→例え→主張）"
                      multiline
                      placeholder='例：○○が目的であれば、絶っっっ対今決断すべきです！理由は〜。例えば〜。ですから○○が目的であれば、絶っっっ対今決断すべきです！'
                      hint="A: 主張 → R: 理由 → E: 例え・根拠 → A: 主張の繰り返し"
                      value={f("tech1Area")} onChange={(v) => setF("tech1Area", v)}
                    />
                  </TechniqueCard>

                  <TechniqueCard
                    number="2" title="第三者アタック" color="#185FA5"
                    description="考えたい・検討したいケースに有効。第三者の具体的なエピソードで揺さぶる"
                  >
                    <InputField
                      label="第三者エピソード（天国or地獄ストーリー）"
                      multiline
                      placeholder='例：以前、同じように悩まれたお客様がいたんですが、決断されたあと「あの時決めてよかった。先送りしてたら大変なことになっていた」と言ってくださいました。逆に、見送った方は半年後に○○という問題が…'
                      hint="多少長くてもOK、具体的に。自分の感情を入れてもOK。地獄の方が効果的"
                      value={f("tech2Episode")} onChange={(v) => setF("tech2Episode", v)}
                    />
                  </TechniqueCard>

                  <TechniqueCard
                    number="3" title="＋（プラス）のシャワー" color="#534AB7"
                    description="バトルっぽく熱くなったケースに有効。お客様自身にプラスを語らせて切り替える"
                  >
                    <InputField
                      label="YES+質問の流れ"
                      multiline
                      placeholder='例：ちなみに、商品のどのポイントが良いなと思っていただけてますか？（→回答）なぜそのポイントが良いなと思っていただけてますか？（→回答）→3倍リアクション「それは素晴らしいですね！」'
                      hint="3回YES+を繰り返し、お客様自身がプラスに切り替わる行動をしてもらう"
                      value={f("tech3YesPlus")} onChange={(v) => setF("tech3YesPlus", v)}
                    />
                  </TechniqueCard>

                  <TechniqueCard
                    number="4" title="すり替え" color="#2563EB"
                    description="他社比較・他者相談・今じゃなくてもいいに有効。相手の主張を別の角度から指摘する"
                  >
                    <InputField
                      label="すり替えフレーズ"
                      multiline
                      placeholder='例：他も見たいとおっしゃる方は、実は他を見たいわけではなくて「迷っているだけ」の方がほとんどでした。 / 「考えます」は問題の先送りと同じ。問題は必ず悪化します。'
                      hint="相手の「正義」を別の角度から指摘する。否定誘導は必ず「敬意」と「補正」をセットで"
                      value={f("tech4Reframe")} onChange={(v) => setF("tech4Reframe", v)}
                    />
                    <InputField
                      label="補正フレーズ（褒め）"
                      placeholder='例：○○さんは、問題を見て見ぬふりするような方ではなくて、しっかり決断できる方ですから。'
                      hint="否定誘導の後は必ず「○○なんですから」と褒めて補正。敵意は絶対NG、敬意を表す"
                      value={f("tech4Correction")} onChange={(v) => setF("tech4Correction", v)}
                    />
                  </TechniqueCard>

                  <TechniqueCard
                    number="5" title="価値の上乗せ" color="#7C3AED"
                    description="価格が高いと言われたケースに有効。値引きではなく価値を積み上げてバランスを取る"
                  >
                    <InputField
                      label="驚き＋謝罪"
                      placeholder='例：高いですか！そうでございますか！高く思わせてしまって申し訳ございません。私の伝え方が悪かっただけなんです。'
                      hint="「高い」に共感してはダメ。驚き→謝罪→これがAREAの主張になる"
                      value={f("tech5Apology")} onChange={(v) => setF("tech5Apology", v)}
                    />
                    <InputField
                      label="SP+ベネフィット3連発（価値の再提示）"
                      multiline
                      placeholder='例：なぜなら、みなっさん「安いよねー」とおっしゃってくれてるんです。理由は、○○だから○○、しかも○○だから○○、さらに○○だから○○。他社で同じことをやると○万円かかるのが事実です。'
                      hint="SP+ベネフィットを3連発。他社価格との比較も有効"
                      value={f("tech5Value")} onChange={(v) => setF("tech5Value", v)}
                    />
                  </TechniqueCard>
                </div>

                <Preview active={!!preview}>{preview || "共感→感謝→フック→技法→AREA→訴求の完成された反論処理フローをAIが生成します"}</Preview>
                <AIButton onClick={handleGenerate} loading={isLoading}>AIで反論処理フロー生成</AIButton>
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

            {/* PDF Export */}
            <div className="mt-4 text-center">
              <PdfExportButton
                filename={`営業準備ワークシート_${industry}_${new Date().toISOString().slice(0, 10)}.pdf`}
                renderContent={(ref) => (
                  <WorksheetPdfContent
                    ref={ref}
                    industry={industry}
                    productInfo={productInfo}
                    phaseData={phaseData}
                    previews={previews}
                  />
                )}
              >
                全ステップをPDFで保存
              </PdfExportButton>
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
