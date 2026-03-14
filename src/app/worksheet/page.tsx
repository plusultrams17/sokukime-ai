"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import type { ProductInfo } from "@/types/worksheet";

/* ─── Constants ────────────────────────────────── */

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

type PhaseId = "approach" | "hearing" | "presentation" | "closing" | "objection";

const PHASES: { id: PhaseId; label: string; icon: string; description: string }[] = [
  { id: "approach", label: "アプローチ", icon: "🤝", description: "信頼構築" },
  { id: "hearing", label: "ヒアリング", icon: "👂", description: "問題の把握" },
  { id: "presentation", label: "プレゼン", icon: "📊", description: "価値伝達" },
  { id: "closing", label: "クロージング", icon: "🎯", description: "決断促進" },
  { id: "objection", label: "反論処理", icon: "🛡️", description: "行動促進" },
];

type WorksheetTypeId =
  | "needs_phrase"
  | "deepening"
  | "benefit"
  | "comparison"
  | "social_proof"
  | "customer_voice"
  | "proposal_pattern"
  | "positive_single"
  | "positive_triple"
  | "motivation"
  | "urgency"
  | "urgency_practice"
  | "negative_single"
  | "negative_triple"
  | "objection_list"
  | "third_party"
  | "premise_check"
  | "reframe";

const WORKSHEET_TYPES: {
  id: WorksheetTypeId;
  phase: PhaseId;
  icon: string;
  title: string;
  description: string;
  gridLabel: string;
}[] = [
  // アプローチ
  { id: "needs_phrase", phase: "approach", icon: "🎯", title: "ニーズ引き出しフレーズシート", description: "お客さんのニーズ・お悩みを第三者話法で引き出す", gridLabel: "ニーズ（お悩み・問題）" },

  // ヒアリング
  { id: "deepening", phase: "hearing", icon: "🔍", title: "課題深掘りシート", description: "お客さんの問題を5つの観点で深掘りする質問", gridLabel: "深掘り質問" },

  // プレゼン
  { id: "benefit", phase: "presentation", icon: "💡", title: "ベネフィット変換シート", description: "商品の特徴をお客さんのメリットに変換する", gridLabel: "SP→ベネフィット変換例" },
  { id: "comparison", phase: "presentation", icon: "⚖️", title: "比較提案シート", description: "競合との違いを効果的に伝えるポイント", gridLabel: "競合との比較ポイント" },

  // クロージング
  { id: "social_proof", phase: "closing", icon: "👥", title: "社会的証明シート", description: "多くの人が選んでいることを示すフレーズ", gridLabel: "社会的証明フレーズ" },
  { id: "customer_voice", phase: "closing", icon: "💬", title: "顧客の声活用シート", description: "お客様の声・感想を引用するフレーズ", gridLabel: "顧客の声（引用例）" },
  { id: "proposal_pattern", phase: "closing", icon: "📋", title: "提案パターンシート", description: "自信を持って提案を言い切るパターン", gridLabel: "提案パターン" },
  { id: "positive_single", phase: "closing", icon: "✨", title: "メリット訴求シート", description: "お客さんが得られるメリットを1つずつ訴求", gridLabel: "メリット訴求フレーズ" },
  { id: "positive_triple", phase: "closing", icon: "📈", title: "段階的メリット訴求シート", description: "メリットを3段階で積み上げて訴求する", gridLabel: "段階的メリット訴求（3段×4セット）" },
  { id: "motivation", phase: "closing", icon: "🔥", title: "動機づけ分析シート", description: "接近動機と回避動機の両面からアプローチ", gridLabel: "動機づけフレーズ" },
  { id: "urgency", phase: "closing", icon: "⏰", title: "緊急性喚起シート", description: "今すぐ決めたい気持ちを引き出すフレーズ", gridLabel: "緊急性喚起フレーズ" },
  { id: "urgency_practice", phase: "closing", icon: "🏋️", title: "緊急性トーク練習シート", description: "お客さんの先送りに対する切り返し練習", gridLabel: "緊急性トーク練習（客→営業）" },
  { id: "negative_single", phase: "closing", icon: "⚠️", title: "リスク提示シート", description: "決断を先送りするデメリットを提示", gridLabel: "リスク提示フレーズ" },
  { id: "negative_triple", phase: "closing", icon: "📉", title: "段階的リスク提示シート", description: "リスクを3段階で示して決断を促す", gridLabel: "段階的リスク提示（3段×4セット）" },

  // 反論処理
  { id: "objection_list", phase: "objection", icon: "📝", title: "断り文句リストアップシート", description: "よくある断り文句を事前に洗い出す", gridLabel: "よくある断り文句" },
  { id: "third_party", phase: "objection", icon: "👤", title: "第三者事例活用シート", description: "他のお客様の事例で反論を処理する", gridLabel: "第三者事例フレーズ" },
  { id: "premise_check", phase: "objection", icon: "🤝", title: "合意確認シート", description: "最初の合意を確認して一貫性を活用する", gridLabel: "合意確認フレーズ" },
  { id: "reframe", phase: "objection", icon: "🔄", title: "視点転換シート", description: "反論を別の角度から見せ直す切り返し", gridLabel: "視点転換フレーズ" },
];

const DEEPENING_CATEGORIES = [
  {
    key: "cause",
    label: "原因",
    example: "「何が原因ですか？」",
    tip: "まず原因を特定する。お客さん自身に語らせることが重要。",
  },
  {
    key: "since",
    label: "いつから",
    example: "「いつからですか？」",
    tip: "時間軸を入れると問題の深刻度が伝わりやすくなる。",
  },
  {
    key: "concrete",
    label: "具体的に",
    example: "「そのままだと具体的にどうなりますか？」「具体的にどんな（状況・痛み・不具合）ですか？」",
    tip: "問題を視覚化させる。未来の痛みと現在の痛みの両面を引き出す。",
  },
  {
    key: "awareness",
    label: "問題認識",
    example: "「それって気分どうですかね？」",
    tip: "感情を引き出す問いかけ。論理ではなく感情を動かす。",
  },
  {
    key: "why",
    label: "なぜ？",
    example: "「なぜ今まで解決しなかったんですか？」",
    tip: "解決を先送りにした理由を理解することで反論の先取りができる。",
  },
] as const;

/* ─── Types ────────────────────────────────────── */

interface AiResult {
  phraseKeyword: string;
  items: string[];
}

/* ─── Component ────────────────────────────────── */

export default function WorksheetPage() {
  const [industry, setIndustry] = useState("");
  const [phase, setPhase] = useState<PhaseId | null>(null);
  const [wsType, setWsType] = useState<WorksheetTypeId | null>(null);
  const [mode, setMode] = useState<"self" | "ai" | null>(null);
  const [grid, setGrid] = useState<string[]>(Array(12).fill(""));
  const [phraseKeyword, setPhraseKeyword] = useState("");
  const [aiResult, setAiResult] = useState<AiResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showComparison, setShowComparison] = useState(false);

  // Deepening-specific state
  const [deepeningRows, setDeepeningRows] = useState<string[]>(Array(5).fill(""));
  const [showTheoryPanel, setShowTheoryPanel] = useState(false);
  const [expandedTips, setExpandedTips] = useState<Record<string, boolean>>({});

  // Input mode state
  const [inputMode, setInputMode] = useState<"simple" | "url" | "detail">("simple");
  const [urlInput, setUrlInput] = useState("");
  const [isAnalyzingUrl, setIsAnalyzingUrl] = useState(false);
  const [productInfo, setProductInfo] = useState<ProductInfo | null>(null);
  const [urlError, setUrlError] = useState("");
  const [detailFields, setDetailFields] = useState({
    productName: "", industry: "", targetAudience: "",
    keyFeatures: "", priceRange: "", advantages: "", challenges: "",
  });

  const filledCount = grid.filter((v) => v.trim()).length;
  const deepeningFilledCount = deepeningRows.filter((v) => v.trim()).length;
  const currentWs = WORKSHEET_TYPES.find((w) => w.id === wsType);
  const isDeepening = wsType === "deepening";
  const phaseWorksheets = WORKSHEET_TYPES.filter((w) => w.phase === phase);

  /* ─── Handlers ─────────────────────────────── */

  const handleGenerate = useCallback(async () => {
    if (!industry.trim() || !wsType) return;
    setIsGenerating(true);
    try {
      const res = await fetch("/api/worksheet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          industry: industry.trim(),
          type: wsType,
          ...(productInfo && { productInfo }),
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        if (res.status === 401) {
          alert("ログインが必要です。ログイン後にもう一度お試しください。");
          return;
        }
        throw new Error(err.error || "API error");
      }
      const data: AiResult = await res.json();
      setAiResult(data);

      if (mode === "ai") {
        if (isDeepening) {
          setDeepeningRows(
            data.items
              .slice(0, 5)
              .concat(Array(5).fill(""))
              .slice(0, 5),
          );
        } else {
          setGrid(
            data.items
              .slice(0, 12)
              .concat(Array(12).fill(""))
              .slice(0, 12),
          );
        }
        if (data.phraseKeyword) setPhraseKeyword(data.phraseKeyword);
      } else {
        setShowComparison(true);
      }
    } catch {
      alert("生成に失敗しました。もう一度お試しください。");
    } finally {
      setIsGenerating(false);
    }
  }, [industry, wsType, mode, isDeepening, productInfo]);

  const handleReset = () => {
    setGrid(Array(12).fill(""));
    setDeepeningRows(Array(5).fill(""));
    setPhraseKeyword("");
    setAiResult(null);
    setShowComparison(false);
    setShowTheoryPanel(false);
    setExpandedTips({});
  };

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
      if (!res.ok) {
        setUrlError(data.error || "分析に失敗しました");
        return;
      }
      const info: ProductInfo = data.productInfo;
      setProductInfo(info);
      setDetailFields({
        productName: info.productName || "",
        industry: info.industry || "",
        targetAudience: info.targetAudience || "",
        keyFeatures: info.keyFeatures || "",
        priceRange: info.priceRange || "",
        advantages: info.advantages || "",
        challenges: info.challenges || "",
      });
      if (info.industry) setIndustry(info.industry);
    } catch {
      setUrlError("分析中にエラーが発生しました");
    } finally {
      setIsAnalyzingUrl(false);
    }
  }, [urlInput]);

  const handleDetailApply = () => {
    const info: ProductInfo = { ...detailFields };
    setProductInfo(info);
    if (detailFields.industry) setIndustry(detailFields.industry);
  };

  const handleModeSelect = (m: "self" | "ai") => {
    setMode(m);
    handleReset();
  };

  const handlePhaseSelect = (id: PhaseId) => {
    setPhase(id);
    setWsType(null);
    setMode(null);
    handleReset();
  };

  const handleTypeSelect = (id: WorksheetTypeId) => {
    setWsType(id);
    setMode(null);
    handleReset();
  };

  const getGrade = () => {
    if (filledCount >= 11) return { grade: "S", color: "text-green-400", msg: "素晴らしい！お客さんの状況を深く理解できています。この知識をロープレで活かしましょう。" };
    if (filledCount >= 9) return { grade: "A", color: "text-green-400", msg: "高い理解度です。AIの提案も参考に、さらに知識を深めましょう。" };
    if (filledCount >= 6) return { grade: "B", color: "text-yellow-400", msg: "基本は把握できています。空欄の部分はAIの提案を参考に学びましょう。" };
    if (filledCount >= 3) return { grade: "C", color: "text-orange-400", msg: "まだ理解が浅い状態です。AIの提案を参考に、もっとリサーチしましょう。" };
    return { grade: "D", color: "text-red-400", msg: "業界・商材のリサーチが必要です。AIの提案をヒントに知識をインプットしましょう。" };
  };

  const getDeepeningGrade = () => {
    if (deepeningFilledCount >= 5) return { grade: "S", color: "text-green-400", msg: "すべてのカテゴリに独自の深掘り質問を持っています。実践力が高い状態です。" };
    if (deepeningFilledCount >= 4) return { grade: "A", color: "text-green-400", msg: "ほぼ網羅できています。AIの提案と比較してさらに磨きましょう。" };
    if (deepeningFilledCount >= 3) return { grade: "B", color: "text-yellow-400", msg: "半数以上記入できています。残りのカテゴリも練習しておきましょう。" };
    if (deepeningFilledCount >= 2) return { grade: "C", color: "text-orange-400", msg: "まだ準備が不十分です。AIの質問例を参考にしてみてください。" };
    return { grade: "D", color: "text-red-400", msg: "深掘り質問の準備が必要です。AIの提案からスタートしましょう。" };
  };

  const activeFilledCount = isDeepening ? deepeningFilledCount : filledCount;

  /* ─── Render ───────────────────────────────── */

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Title */}
      <section className="px-6 pt-32 pb-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-3 inline-block rounded-full bg-accent/10 px-4 py-1 text-xs font-bold text-accent">
            営業準備ツール
          </div>
          <h1 className="mb-3 text-3xl font-bold">営業準備ワークシート</h1>
          <p className="text-sm text-muted leading-relaxed">
            営業に必要な知識をどれだけインプットできていますか？
            <br />
            業界理解・自社理解を自己チェックしましょう。
          </p>
        </div>
      </section>

      {/* Industry Input */}
      <section className="px-6 pb-6">
        <div className="mx-auto max-w-3xl">
          <label className="mb-3 block text-sm font-bold">
            1. 商材・業種を入力
          </label>

          {/* Input Mode Tabs */}
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
                  inputMode === tab.key
                    ? "bg-accent text-white"
                    : "text-muted hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Simple Input */}
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

          {/* URL Input */}
          {inputMode === "url" && (
            <div>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://example.com/product"
                  className="flex-1 rounded-xl border border-card-border bg-card px-4 py-3 text-sm outline-none transition focus:border-accent"
                />
                <button
                  onClick={handleAnalyzeUrl}
                  disabled={isAnalyzingUrl || !urlInput.trim()}
                  className="inline-flex items-center justify-center rounded-xl bg-accent px-5 font-bold text-white transition hover:bg-accent-hover disabled:opacity-50"
                >
                  {isAnalyzingUrl ? (
                    <>
                      <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      分析中
                    </>
                  ) : (
                    "分析する"
                  )}
                </button>
              </div>
              <p className="mt-2 text-[11px] text-muted">
                商材のHP・LPのURLを入力すると、AIが商材情報を自動抽出します
              </p>

              {urlError && (
                <div className="mt-3 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                  {urlError}
                </div>
              )}

              {productInfo && inputMode === "url" && (
                <div className="mt-4 rounded-xl border border-accent/30 bg-accent/5 p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="text-sm font-bold">抽出結果</div>
                    <button
                      onClick={() => setInputMode("detail")}
                      className="rounded-lg border border-card-border px-3 py-1 text-xs text-muted transition hover:border-accent hover:text-accent"
                    >
                      編集する
                    </button>
                  </div>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {[
                      { label: "商材名", value: productInfo.productName },
                      { label: "業種", value: productInfo.industry },
                      { label: "ターゲット層", value: productInfo.targetAudience },
                      { label: "主な特徴", value: productInfo.keyFeatures },
                      { label: "価格帯", value: productInfo.priceRange },
                      { label: "競合優位性", value: productInfo.advantages },
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

          {/* Detail Input */}
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
                  <label className="mb-1 block text-xs font-medium text-muted">
                    {field.label}
                  </label>
                  <input
                    type="text"
                    value={detailFields[field.key]}
                    onChange={(e) => {
                      const updated = { ...detailFields, [field.key]: e.target.value };
                      setDetailFields(updated);
                      if (field.key === "industry") setIndustry(e.target.value);
                    }}
                    placeholder={field.placeholder}
                    className="w-full rounded-lg border border-card-border bg-card px-4 py-2.5 text-sm outline-none transition focus:border-accent placeholder:text-muted/40"
                  />
                </div>
              ))}
              <button
                onClick={handleDetailApply}
                disabled={!detailFields.industry.trim()}
                className="inline-flex h-10 items-center justify-center rounded-xl bg-accent px-6 text-sm font-bold text-white transition hover:bg-accent-hover disabled:opacity-50"
              >
                この内容で分析する
              </button>
              {productInfo && inputMode === "detail" && (
                <p className="text-xs text-accent">
                  詳細情報が設定されました。下のフェーズを選択してください。
                </p>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Phase Selection */}
      {industry.trim() && (
        <section className="px-6 pb-6">
          <div className="mx-auto max-w-3xl">
            <label className="mb-3 block text-sm font-bold">
              2. フェーズを選択
            </label>
            <div className="grid grid-cols-5 gap-2">
              {PHASES.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handlePhaseSelect(p.id)}
                  className={`rounded-xl border p-3 text-center transition ${
                    phase === p.id
                      ? "border-accent bg-accent/5"
                      : "border-card-border bg-card hover:border-accent/50"
                  }`}
                >
                  <div className="text-xl mb-1">{p.icon}</div>
                  <div className="text-xs font-bold leading-tight">{p.label}</div>
                  <p className="mt-0.5 text-[10px] text-muted">{p.description}</p>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Worksheet Type Selection */}
      {phase && phaseWorksheets.length > 0 && (
        <section className="px-6 pb-6">
          <div className="mx-auto max-w-3xl">
            <label className="mb-3 block text-sm font-bold">
              3. ワークシートを選択
              <span className="ml-2 text-xs font-normal text-muted">
                （{PHASES.find((p) => p.id === phase)?.label}フェーズ）
              </span>
            </label>
            <div className={`grid gap-3 ${phaseWorksheets.length <= 2 ? "grid-cols-2" : "grid-cols-2 sm:grid-cols-3"}`}>
              {phaseWorksheets.map((w) => (
                <button
                  key={w.id}
                  onClick={() => handleTypeSelect(w.id)}
                  className={`rounded-xl border p-4 text-left transition ${
                    wsType === w.id
                      ? "border-accent bg-accent/5"
                      : "border-card-border bg-card hover:border-accent/50"
                  }`}
                >
                  <div className="text-2xl mb-2">{w.icon}</div>
                  <div className="text-xs font-bold leading-tight">{w.title}</div>
                  <p className="mt-1 text-[10px] text-muted leading-tight">{w.description}</p>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Mode Selection */}
      {wsType && (
        <section className="px-6 pb-8">
          <div className="mx-auto max-w-3xl">
            <label className="mb-3 block text-sm font-bold">
              4. モードを選択
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleModeSelect("self")}
                className={`rounded-xl border p-5 text-left transition ${
                  mode === "self"
                    ? "border-accent bg-accent/5"
                    : "border-card-border bg-card hover:border-accent/50"
                }`}
              >
                <div className="text-lg font-bold mb-1">✍️ 自分で記入</div>
                <p className="text-xs text-muted">
                  知識チェック。自分の理解度を確認してからAIと答え合わせ。
                </p>
              </button>
              <button
                onClick={() => handleModeSelect("ai")}
                className={`rounded-xl border p-5 text-left transition ${
                  mode === "ai"
                    ? "border-accent bg-accent/5"
                    : "border-card-border bg-card hover:border-accent/50"
                }`}
              >
                <div className="text-lg font-bold mb-1">🤖 AIに依頼</div>
                <p className="text-xs text-muted">
                  AIが業界知識を自動生成。リサーチ・学習のベースに。
                </p>
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ═══ Standard Worksheet Grid (non-deepening types) ═══ */}
      {mode && currentWs && !isDeepening && (
        <section className="px-6 pb-8">
          <div className="mx-auto max-w-3xl">
            {/* Template Header */}
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{currentWs.icon}</span>
                <div>
                  <div className="text-sm font-bold">{currentWs.title}</div>
                  <div className="text-[10px] text-muted">
                    {PHASES.find((p) => p.id === currentWs.phase)?.label}フェーズ
                  </div>
                </div>
              </div>
              <div className="rounded-full bg-accent/10 px-3 py-1 text-xs font-bold text-accent">
                {industry}
              </div>
            </div>

            {/* Phrase Template (needs_phrase type only) */}
            {wsType === "needs_phrase" && (
              <div className="mb-6 rounded-xl border border-card-border bg-card p-5">
                <div className="mb-2 text-xs font-bold text-accent">
                  引き出しフレーズ
                </div>
                <div className="flex flex-wrap items-center gap-1 text-sm">
                  <span className="text-muted">「</span>
                  {mode === "self" ? (
                    <input
                      value={phraseKeyword}
                      onChange={(e) => setPhraseKeyword(e.target.value)}
                      placeholder="キーワード"
                      className="w-32 border-b border-accent/30 bg-transparent px-1 py-0.5 text-center text-accent outline-none transition focus:border-accent"
                    />
                  ) : (
                    <span className="min-w-[80px] border-b border-accent/30 px-2 py-0.5 text-center text-accent">
                      {phraseKeyword || "___"}
                    </span>
                  )}
                  <span className="text-muted">
                    で悩んでいる人が多いですが、
                  </span>
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-1 text-sm">
                  <span className="text-muted">○○さんは</span>
                  <span className="min-w-[80px] border-b border-card-border px-2 py-0.5 text-center text-muted">
                    {phraseKeyword || "___"}
                  </span>
                  <span className="text-muted">
                    でのお悩みなどはないですか？」
                  </span>
                </div>
              </div>
            )}

            {/* Grid */}
            <div className="mb-4">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-bold">{currentWs.gridLabel}</h2>
                {mode === "self" && (
                  <span className="text-xs text-muted">
                    {filledCount}/12 記入済み
                  </span>
                )}
              </div>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
                {grid.map((value, i) => (
                  <div key={i}>
                    {mode === "self" ? (
                      <input
                        value={value}
                        onChange={(e) => {
                          const next = [...grid];
                          next[i] = e.target.value;
                          setGrid(next);
                        }}
                        placeholder={`${i + 1}`}
                        className="w-full rounded-lg border border-card-border bg-card px-3 py-3 text-sm outline-none transition focus:border-accent placeholder:text-muted/30"
                      />
                    ) : (
                      <div className="min-h-[44px] rounded-lg border border-card-border bg-card px-3 py-3 text-sm">
                        {value || (
                          <span className="text-muted/30">{i + 1}</span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3">
              {mode === "self" && !showComparison && (
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating || filledCount === 0}
                  className="inline-flex h-11 items-center justify-center rounded-xl bg-accent px-6 font-bold text-white transition hover:bg-accent-hover disabled:opacity-50"
                >
                  {isGenerating ? (
                    <>
                      <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      分析中...
                    </>
                  ) : (
                    "AIと答え合わせ"
                  )}
                </button>
              )}
              {mode === "ai" && !aiResult && (
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="inline-flex h-11 items-center justify-center rounded-xl bg-accent px-6 font-bold text-white transition hover:bg-accent-hover disabled:opacity-50"
                >
                  {isGenerating ? (
                    <>
                      <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      生成中...
                    </>
                  ) : (
                    "AIで生成する"
                  )}
                </button>
              )}
              {(filledCount > 0 || aiResult) && (
                <button
                  onClick={handleReset}
                  className="inline-flex h-11 items-center justify-center rounded-xl border border-card-border px-6 text-sm text-muted transition hover:border-accent hover:text-foreground"
                >
                  リセット
                </button>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ═══ Standard Comparison Result (non-deepening) ═══ */}
      {showComparison && aiResult && !isDeepening && (
        <section className="px-6 pb-8">
          <div className="mx-auto max-w-3xl">
            <div className="rounded-2xl border border-accent/30 bg-accent/5 p-6">
              <h3 className="mb-5 text-lg font-bold">知識チェック結果</h3>

              {/* Score */}
              <div className="mb-6 grid grid-cols-3 gap-4 text-center">
                <div className="rounded-xl bg-background/50 p-4">
                  <div className="text-3xl font-black text-accent">
                    {filledCount}
                    <span className="text-base font-normal text-muted">
                      /12
                    </span>
                  </div>
                  <div className="mt-1 text-xs text-muted">記入数</div>
                </div>
                <div className="rounded-xl bg-background/50 p-4">
                  <div className={`text-3xl font-black ${getGrade().color}`}>
                    {getGrade().grade}
                  </div>
                  <div className="mt-1 text-xs text-muted">理解度</div>
                </div>
                <div className="rounded-xl bg-background/50 p-4">
                  <div className="text-3xl font-black text-accent">
                    {Math.round((filledCount / 12) * 100)}
                    <span className="text-base font-normal text-muted">%</span>
                  </div>
                  <div className="mt-1 text-xs text-muted">カバー率</div>
                </div>
              </div>

              {/* Feedback */}
              <p className="mb-6 rounded-lg bg-background/50 p-4 text-sm text-muted leading-relaxed">
                {getGrade().msg}
              </p>

              {/* AI phrase keyword */}
              {wsType === "needs_phrase" && aiResult.phraseKeyword && (
                <div className="mb-4">
                  <div className="mb-2 text-xs font-bold text-accent">
                    AIの提案キーワード
                  </div>
                  <div className="rounded-lg bg-background/50 px-4 py-2 text-sm">
                    「
                    <span className="font-bold text-accent">
                      {aiResult.phraseKeyword}
                    </span>
                    で悩んでいる人が多いですが...」
                  </div>
                </div>
              )}

              {/* AI items */}
              <div>
                <div className="mb-3 text-xs font-bold text-accent">
                  AIの提案する{currentWs?.gridLabel}：
                </div>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
                  {aiResult.items.map((item, i) => {
                    const userHas = grid.some(
                      (g) =>
                        g.trim() &&
                        (g.includes(item) ||
                          item.includes(g) ||
                          g.trim() === item.trim()),
                    );
                    return (
                      <div
                        key={i}
                        className={`rounded-lg border px-3 py-2 text-sm ${
                          userHas
                            ? "border-green-500/30 bg-green-500/10 text-green-400"
                            : "border-card-border bg-background/50"
                        }`}
                      >
                        {userHas && (
                          <span className="mr-1 text-green-400">✓</span>
                        )}
                        {item}
                      </div>
                    );
                  })}
                </div>
                <p className="mt-3 text-[11px] text-muted">
                  ✓ はあなたの回答と一致・類似した項目です
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ═══ Deepening Sheet ═══ */}
      {mode && currentWs && isDeepening && (
        <section className="px-6 pb-8">
          <div className="mx-auto max-w-3xl">
            {/* Template Header */}
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{currentWs.icon}</span>
                <div>
                  <div className="text-sm font-bold">{currentWs.title}</div>
                  <div className="text-[10px] text-muted">
                    {PHASES.find((p) => p.id === currentWs.phase)?.label}フェーズ
                  </div>
                </div>
              </div>
              <div className="rounded-full bg-accent/10 px-3 py-1 text-xs font-bold text-accent">
                {industry}
              </div>
            </div>

            {/* Phrase Template */}
            <div className="mb-4 rounded-xl border border-card-border bg-card p-5">
              <div className="mb-2 text-xs font-bold text-accent">
                引き出しフレーズ
              </div>
              <div className="flex flex-wrap items-center gap-1 text-sm">
                <span className="text-muted">「</span>
                {mode === "self" ? (
                  <input
                    value={phraseKeyword}
                    onChange={(e) => setPhraseKeyword(e.target.value)}
                    placeholder="キーワード"
                    className="w-32 border-b border-accent/30 bg-transparent px-1 py-0.5 text-center text-accent outline-none transition focus:border-accent"
                  />
                ) : (
                  <span className="min-w-[80px] border-b border-accent/30 px-2 py-0.5 text-center text-accent">
                    {phraseKeyword || "___"}
                  </span>
                )}
                <span className="text-muted">
                  で悩んでいる人が多いですが、
                </span>
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-1 text-sm">
                <span className="text-muted">○○さんは</span>
                <span className="min-w-[80px] border-b border-card-border px-2 py-0.5 text-center text-muted">
                  {phraseKeyword || "___"}
                </span>
                <span className="text-muted">
                  でのお悩みなどはないですか？」
                </span>
              </div>
            </div>

            {/* Educational Panel: 第三者話法 */}
            <div className="mb-6">
              <button
                onClick={() => setShowTheoryPanel(!showTheoryPanel)}
                className="flex w-full items-center justify-between rounded-xl border border-card-border bg-card px-5 py-3 text-left transition hover:border-accent/50"
              >
                <span className="text-sm font-bold">
                  引き出しフレーズの作り方（第三者話法）
                </span>
                <svg
                  className={`h-4 w-4 text-muted transition-transform ${showTheoryPanel ? "rotate-180" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showTheoryPanel && (
                <div className="mt-2 space-y-4 rounded-xl border border-card-border bg-card p-5">
                  <div className="border-l-2 border-accent/40 pl-4">
                    <h4 className="mb-2 text-sm font-bold">第三者話法の構造</h4>
                    <div className="space-y-2 text-xs text-muted leading-relaxed">
                      <div>
                        <span className="font-bold text-foreground">1行目: 第三者 + 口語調</span>
                        <br />
                        例: 「最近、○○で悩んでいる方が多くて...」
                        <br />
                        <span className="text-accent">→ 第三者の話として切り出すことで、お客さんが答えやすくなる</span>
                      </div>
                      <div>
                        <span className="font-bold text-foreground">2行目: ○○さん自身への質問 + 書き言葉</span>
                        <br />
                        例: 「○○さんはそういったお悩みなどはないですか？」
                        <br />
                        <span className="text-accent">→ 丁寧語に切り替えることで押し付けがましくなくなる</span>
                      </div>
                    </div>
                  </div>
                  <div className="border-l-2 border-accent/40 pl-4">
                    <h4 className="mb-2 text-sm font-bold">なぜ効くのか？</h4>
                    <ul className="space-y-1 text-xs text-muted leading-relaxed">
                      <li>・人は自分の悩みを直接聞かれると答えにくい → 第三者の話として聞くと答えやすい</li>
                      <li>・「あなたはどうですか？」より「よくあるんですが...」の方が圧力を感じない</li>
                    </ul>
                  </div>
                  <div className="border-l-2 border-accent/40 pl-4">
                    <h4 className="mb-2 text-sm font-bold">NOと言われたら</h4>
                    <div className="text-xs text-muted leading-relaxed">
                      <p className="mb-1">
                        まず: <span className="font-bold text-foreground">「あーそうなんですね、ありがとうございます」</span>
                      </p>
                      <p className="mb-1">諦めずに、以下で再挑戦:</p>
                      <div className="flex flex-wrap gap-2">
                        <span className="rounded-full border border-accent/30 bg-accent/10 px-2 py-0.5 text-accent">「他には」</span>
                        <span className="rounded-full border border-accent/30 bg-accent/10 px-2 py-0.5 text-accent">「そんな中で」</span>
                        <span className="rounded-full border border-accent/30 bg-accent/10 px-2 py-0.5 text-accent">「そしたらですね」</span>
                      </div>
                      <p className="mt-1 text-[10px] text-muted">※ 1回で諦めない。3回まで試みる。</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 5-Row Deepening Grid */}
            <div className="mb-4">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-bold">深掘り質問カテゴリ</h2>
                {mode === "self" && (
                  <span className="text-xs text-muted">
                    {deepeningFilledCount}/5 記入済み
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-3">
                {DEEPENING_CATEGORIES.map((cat, i) => (
                  <div key={cat.key} className="rounded-xl border border-card-border bg-card p-4">
                    <div className="mb-2 flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <span className="mt-0.5 min-w-[56px] text-sm font-bold text-accent">
                          {cat.label}
                        </span>
                        <span className="text-xs text-muted italic leading-snug">
                          {cat.example}
                        </span>
                      </div>
                      <button
                        onClick={() => setExpandedTips((prev) => ({ ...prev, [cat.key]: !prev[cat.key] }))}
                        className="flex-shrink-0 rounded-full border border-card-border px-2 py-0.5 text-[10px] text-muted transition hover:border-accent hover:text-accent"
                        title={cat.tip}
                      >
                        ?
                      </button>
                    </div>
                    {expandedTips[cat.key] && (
                      <div className="mb-2 rounded-lg border border-amber-500/20 bg-amber-500/10 px-3 py-2 text-xs leading-relaxed text-amber-400">
                        {cat.tip}
                      </div>
                    )}
                    {mode === "self" ? (
                      <input
                        value={deepeningRows[i]}
                        onChange={(e) => {
                          const next = [...deepeningRows];
                          next[i] = e.target.value;
                          setDeepeningRows(next);
                        }}
                        placeholder={`${industry}向けの「${cat.label}」質問を記入...`}
                        className="w-full rounded-lg border border-card-border bg-background/50 px-3 py-2.5 text-sm outline-none transition focus:border-accent placeholder:text-muted/30"
                      />
                    ) : (
                      <div className="min-h-[40px] rounded-lg border border-card-border bg-background/50 px-3 py-2.5 text-sm">
                        {deepeningRows[i] || (
                          <span className="text-muted/30">{i + 1}</span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3">
              {mode === "self" && !showComparison && (
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating || deepeningFilledCount === 0}
                  className="inline-flex h-11 items-center justify-center rounded-xl bg-accent px-6 font-bold text-white transition hover:bg-accent-hover disabled:opacity-50"
                >
                  {isGenerating ? (
                    <>
                      <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      分析中...
                    </>
                  ) : (
                    "AIと答え合わせ"
                  )}
                </button>
              )}
              {mode === "ai" && !aiResult && (
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="inline-flex h-11 items-center justify-center rounded-xl bg-accent px-6 font-bold text-white transition hover:bg-accent-hover disabled:opacity-50"
                >
                  {isGenerating ? (
                    <>
                      <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      生成中...
                    </>
                  ) : (
                    "AIで生成する"
                  )}
                </button>
              )}
              {(deepeningFilledCount > 0 || aiResult) && (
                <button
                  onClick={handleReset}
                  className="inline-flex h-11 items-center justify-center rounded-xl border border-card-border px-6 text-sm text-muted transition hover:border-accent hover:text-foreground"
                >
                  リセット
                </button>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ═══ Deepening Comparison Result ═══ */}
      {showComparison && aiResult && isDeepening && (
        <section className="px-6 pb-8">
          <div className="mx-auto max-w-3xl">
            <div className="rounded-2xl border border-accent/30 bg-accent/5 p-6">
              <h3 className="mb-5 text-lg font-bold">深掘り質問チェック結果</h3>

              <div className="mb-6 grid grid-cols-3 gap-4 text-center">
                <div className="rounded-xl bg-background/50 p-4">
                  <div className="text-3xl font-black text-accent">
                    {deepeningFilledCount}
                    <span className="text-base font-normal text-muted">/5</span>
                  </div>
                  <div className="mt-1 text-xs text-muted">記入数</div>
                </div>
                <div className="rounded-xl bg-background/50 p-4">
                  <div className={`text-3xl font-black ${getDeepeningGrade().color}`}>
                    {getDeepeningGrade().grade}
                  </div>
                  <div className="mt-1 text-xs text-muted">理解度</div>
                </div>
                <div className="rounded-xl bg-background/50 p-4">
                  <div className="text-3xl font-black text-accent">
                    {Math.round((deepeningFilledCount / 5) * 100)}
                    <span className="text-base font-normal text-muted">%</span>
                  </div>
                  <div className="mt-1 text-xs text-muted">カバー率</div>
                </div>
              </div>

              <p className="mb-6 rounded-lg bg-background/50 p-4 text-sm text-muted leading-relaxed">
                {getDeepeningGrade().msg}
              </p>

              {aiResult.phraseKeyword && (
                <div className="mb-6">
                  <div className="mb-2 text-xs font-bold text-accent">
                    AIの提案キーワード
                  </div>
                  <div className="rounded-lg bg-background/50 px-4 py-2 text-sm">
                    「
                    <span className="font-bold text-accent">
                      {aiResult.phraseKeyword}
                    </span>
                    で悩んでいる人が多いですが...」
                  </div>
                </div>
              )}

              <div>
                <div className="mb-3 text-xs font-bold text-accent">
                  カテゴリ別の比較：
                </div>
                <div className="space-y-3">
                  {DEEPENING_CATEGORIES.map((cat, i) => (
                    <div key={cat.key} className="rounded-lg border border-card-border bg-background/50 p-4">
                      <div className="mb-2 text-xs font-bold text-accent">{cat.label}</div>
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        <div className={`rounded-lg border px-3 py-2 text-sm ${
                          deepeningRows[i]?.trim()
                            ? "border-green-500/30 bg-green-500/5"
                            : "border-card-border"
                        }`}>
                          <div className="mb-1 text-[10px] font-bold text-muted">あなたの回答</div>
                          {deepeningRows[i]?.trim() ? (
                            <span className="text-green-400">{deepeningRows[i]}</span>
                          ) : (
                            <span className="text-muted/30">未記入</span>
                          )}
                        </div>
                        <div className="rounded-lg border border-accent/30 bg-accent/5 px-3 py-2 text-sm">
                          <div className="mb-1 text-[10px] font-bold text-muted">AIの提案</div>
                          <span>{aiResult.items[i] || "-"}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="border-t border-card-border px-6 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-3 text-xl font-bold">
            準備ができたら、ロープレで実践しよう
          </h2>
          <p className="mb-6 text-sm text-muted">
            ワークシートで整理した知識をAIロープレで実践練習
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/roleplay"
              className="inline-flex h-12 items-center justify-center rounded-xl bg-accent px-8 font-bold text-white transition hover:bg-accent-hover"
            >
              ロープレを始める
            </Link>
            <Link
              href="/features"
              className="inline-flex h-12 items-center justify-center rounded-xl border border-card-border px-8 text-sm font-medium text-muted transition hover:border-accent hover:text-foreground"
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
