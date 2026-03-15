"use client";

import { useState, useEffect, useCallback } from "react";
import {
  loadCompanyContext,
  saveCompanyContext,
  hasCompanyContext,
  type CompanyContext,
  EMPTY_CONTEXT,
} from "@/lib/company-context";

type InputMode = "url" | "manual" | "document";

const MANUAL_FIELDS: {
  key: keyof CompanyContext;
  label: string;
  placeholder: string;
  multiline?: boolean;
}[] = [
  {
    key: "companyName",
    label: "会社名",
    placeholder: "例: 株式会社〇〇",
  },
  {
    key: "industry",
    label: "業種",
    placeholder: "例: 不動産、IT、保険、教育...",
  },
  {
    key: "productName",
    label: "商材・サービス名",
    placeholder: "例: 外壁塗装サービス、法人向けSaaS...",
  },
  {
    key: "targetAudience",
    label: "ターゲット層",
    placeholder: "例: 中小企業の経営者、30代共働き世帯...",
  },
  {
    key: "keyFeatures",
    label: "主な特徴・強み",
    placeholder: "例: 業界最安値、24時間サポート、導入実績300社...",
  },
  {
    key: "priceRange",
    label: "価格帯",
    placeholder: "例: 月額1万円〜、一括50万円...",
  },
  {
    key: "advantages",
    label: "競合優位性",
    placeholder: "例: 唯一の〇〇対応、特許取得済み...",
  },
  {
    key: "challenges",
    label: "営業課題",
    placeholder: "例: 価格が高いと言われる、競合が多い...",
  },
];

export function CompanyContextSetup() {
  const [mode, setMode] = useState<InputMode>("url");
  const [ctx, setCtx] = useState<CompanyContext>(EMPTY_CONTEXT);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  // URL mode state
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Document mode state
  const [documentText, setDocumentText] = useState("");

  // Editing mode (after registration)
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const saved = loadCompanyContext();
    setCtx(saved);
    setIsRegistered(hasCompanyContext(saved));
    setIsHydrated(true);
  }, []);

  const handleManualChange = useCallback(
    (field: keyof CompanyContext, value: string) => {
      setCtx((prev) => ({ ...prev, [field]: value }));
    },
    [],
  );

  const handleManualSave = useCallback(() => {
    saveCompanyContext(ctx);
    setIsRegistered(true);
    setIsEditing(false);
    setSuccessMsg("会社情報を保存しました");
    setTimeout(() => setSuccessMsg(""), 3000);
  }, [ctx]);

  const handleUrlExtract = useCallback(async () => {
    if (!url.trim()) return;
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/company-context/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "抽出に失敗しました");
        return;
      }
      const extracted = data.extracted as Partial<CompanyContext>;
      const merged: CompanyContext = { ...EMPTY_CONTEXT };
      for (const key of Object.keys(EMPTY_CONTEXT) as (keyof CompanyContext)[]) {
        if (extracted[key]) merged[key] = extracted[key];
      }
      setCtx(merged);
      saveCompanyContext(merged);
      setIsRegistered(true);
      setIsEditing(true);
      setSuccessMsg("URLから情報を抽出しました。内容を確認・編集できます。");
      setTimeout(() => setSuccessMsg(""), 5000);
    } catch {
      setError("通信エラーが発生しました");
    } finally {
      setLoading(false);
    }
  }, [url]);

  const handleDocumentExtract = useCallback(async () => {
    if (!documentText.trim()) return;
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/company-context/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentText }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "抽出に失敗しました");
        return;
      }
      const extracted = data.extracted as Partial<CompanyContext>;
      const merged: CompanyContext = { ...EMPTY_CONTEXT };
      for (const key of Object.keys(EMPTY_CONTEXT) as (keyof CompanyContext)[]) {
        if (extracted[key]) merged[key] = extracted[key];
      }
      // Also store original document text as additionalInfo
      merged.additionalInfo = documentText.trim().slice(0, 3000);
      setCtx(merged);
      saveCompanyContext(merged);
      setIsRegistered(true);
      setIsEditing(true);
      setSuccessMsg("資料から情報を抽出しました。内容を確認・編集できます。");
      setTimeout(() => setSuccessMsg(""), 5000);
    } catch {
      setError("通信エラーが発生しました");
    } finally {
      setLoading(false);
    }
  }, [documentText]);

  const handleReset = useCallback(() => {
    setCtx(EMPTY_CONTEXT);
    saveCompanyContext(EMPTY_CONTEXT);
    setIsRegistered(false);
    setIsEditing(false);
    setUrl("");
    setDocumentText("");
    setSuccessMsg("");
    setError("");
  }, []);

  if (!isHydrated) return null;

  // Already registered — show summary card
  if (isRegistered && !isEditing) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600">
              <svg
                className="w-5 h-5"
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
            </span>
            <div>
              <p className="text-sm font-bold text-foreground">
                AI学習情報が登録済みです
              </p>
              <p className="text-xs text-muted mt-0.5">
                各レッスンのAIがこの情報を活用します
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="text-xs font-medium text-accent hover:underline"
            >
              編集
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="text-xs font-medium text-muted hover:text-red-500"
            >
              リセット
            </button>
          </div>
        </div>

        {/* Summary chips */}
        <div className="mt-4 flex flex-wrap gap-2">
          {ctx.companyName && (
            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-foreground">
              {ctx.companyName}
            </span>
          )}
          {ctx.industry && (
            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-foreground">
              {ctx.industry}
            </span>
          )}
          {ctx.productName && (
            <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
              {ctx.productName}
            </span>
          )}
          {ctx.targetAudience && (
            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-foreground">
              {ctx.targetAudience}
            </span>
          )}
          {ctx.priceRange && (
            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-foreground">
              {ctx.priceRange}
            </span>
          )}
        </div>

        {successMsg && (
          <p className="mt-3 text-xs text-green-600 font-medium">{successMsg}</p>
        )}
      </div>
    );
  }

  // Edit mode — show form
  if (isEditing) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-base font-bold text-foreground">
            会社・商材情報を編集
          </h3>
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="text-xs text-muted hover:text-foreground"
          >
            閉じる
          </button>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {MANUAL_FIELDS.map((f) => (
            <div key={f.key} className={f.multiline ? "sm:col-span-2" : ""}>
              <label className="mb-1.5 block text-xs font-semibold text-[#6B7280]">
                {f.label}
              </label>
              <input
                type="text"
                value={ctx[f.key]}
                onChange={(e) => handleManualChange(f.key, e.target.value)}
                placeholder={f.placeholder}
                className="w-full rounded-xl border border-[#E5E0D8] bg-white px-4 py-3 text-sm outline-none transition-all duration-200 focus:border-accent focus:shadow-[0_0_0_3px_rgba(249,115,22,0.1)] placeholder:text-[#B4B0A8]"
              />
            </div>
          ))}
          {/* Additional info */}
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs font-semibold text-[#6B7280]">
              補足情報（資料テキスト等）
            </label>
            <textarea
              value={ctx.additionalInfo}
              onChange={(e) =>
                handleManualChange("additionalInfo", e.target.value)
              }
              placeholder="PDFや資料の内容をここにペーストすると、AIがより精度の高い回答を生成します"
              className="w-full rounded-xl border border-[#E5E0D8] bg-white px-4 py-3 text-sm outline-none transition-all duration-200 focus:border-accent focus:shadow-[0_0_0_3px_rgba(249,115,22,0.1)] placeholder:text-[#B4B0A8] min-h-[80px] resize-y"
            />
          </div>
        </div>
        <div className="mt-6 flex items-center gap-3">
          <button
            type="button"
            onClick={handleManualSave}
            disabled={!ctx.industry.trim() && !ctx.productName.trim()}
            className="rounded-xl bg-accent px-6 py-2.5 text-sm font-bold text-white transition hover:bg-accent-hover disabled:opacity-40 disabled:cursor-not-allowed"
          >
            保存する
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="text-xs text-muted hover:text-red-500"
          >
            リセット
          </button>
        </div>
        {successMsg && (
          <p className="mt-3 text-xs text-green-600 font-medium">{successMsg}</p>
        )}
      </div>
    );
  }

  // Initial setup — 3 mode input
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8">
      <div className="flex items-center gap-3 mb-2">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z"
            />
          </svg>
        </span>
        <div>
          <h3 className="text-base font-bold text-foreground">
            あなたの商材情報を登録する
          </h3>
          <p className="text-xs text-muted mt-0.5">
            登録すると全レッスンのAIがあなた専用の回答を生成します
          </p>
        </div>
      </div>

      {/* Mode Tabs */}
      <div className="mt-5 mb-5 flex gap-1 rounded-xl bg-gray-100 p-1">
        {(
          [
            { key: "url" as const, label: "URLから取得", icon: "link" },
            { key: "manual" as const, label: "手入力", icon: "edit" },
            { key: "document" as const, label: "資料を共有", icon: "doc" },
          ] as const
        ).map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => {
              setMode(tab.key);
              setError("");
            }}
            className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg px-3 py-2.5 text-xs font-medium transition ${
              mode === tab.key
                ? "bg-white text-foreground shadow-sm"
                : "text-muted hover:text-foreground"
            }`}
          >
            {tab.icon === "link" && (
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.86-4.318a4.5 4.5 0 00-6.364-6.364L4.5 6.113a4.5 4.5 0 001.242 7.244" />
              </svg>
            )}
            {tab.icon === "edit" && (
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
              </svg>
            )}
            {tab.icon === "doc" && (
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            )}
            {tab.label}
          </button>
        ))}
      </div>

      {/* URL Mode */}
      {mode === "url" && (
        <div>
          <div className="flex gap-2">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://your-product.com"
              className="flex-1 rounded-xl border border-[#E5E0D8] bg-white px-4 py-3 text-sm outline-none transition-all duration-200 focus:border-accent focus:shadow-[0_0_0_3px_rgba(249,115,22,0.1)] placeholder:text-[#B4B0A8]"
              onKeyDown={(e) => {
                if (e.key === "Enter" && url.trim() && !loading) handleUrlExtract();
              }}
            />
            <button
              type="button"
              onClick={handleUrlExtract}
              disabled={!url.trim() || loading}
              className="rounded-xl bg-accent px-5 py-3 text-sm font-bold text-white transition hover:bg-accent-hover disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {loading ? (
                <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
                  <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="opacity-75" />
                </svg>
              ) : (
                "取得"
              )}
            </button>
          </div>
          <p className="mt-2 text-xs text-muted">
            商品・サービスのWebページURLを入力すると、AIが自動で情報を抽出します
          </p>
        </div>
      )}

      {/* Manual Mode */}
      {mode === "manual" && (
        <div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {MANUAL_FIELDS.map((f) => (
              <div key={f.key}>
                <label className="mb-1.5 block text-xs font-semibold text-[#6B7280]">
                  {f.label}
                </label>
                <input
                  type="text"
                  value={ctx[f.key]}
                  onChange={(e) => handleManualChange(f.key, e.target.value)}
                  placeholder={f.placeholder}
                  className="w-full rounded-xl border border-[#E5E0D8] bg-white px-4 py-3 text-sm outline-none transition-all duration-200 focus:border-accent focus:shadow-[0_0_0_3px_rgba(249,115,22,0.1)] placeholder:text-[#B4B0A8]"
                />
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={handleManualSave}
            disabled={!ctx.industry.trim() && !ctx.productName.trim()}
            className="mt-4 rounded-xl bg-accent px-6 py-2.5 text-sm font-bold text-white transition hover:bg-accent-hover disabled:opacity-40 disabled:cursor-not-allowed"
          >
            保存する
          </button>
        </div>
      )}

      {/* Document Mode */}
      {mode === "document" && (
        <div>
          <textarea
            value={documentText}
            onChange={(e) => setDocumentText(e.target.value)}
            placeholder="商品パンフレット、提案書、営業資料などのテキストをここに貼り付けてください。&#10;&#10;PDFの場合は、テキストをコピーしてペーストしてください。"
            className="w-full rounded-xl border border-[#E5E0D8] bg-white px-4 py-3 text-sm outline-none transition-all duration-200 focus:border-accent focus:shadow-[0_0_0_3px_rgba(249,115,22,0.1)] placeholder:text-[#B4B0A8] min-h-[140px] resize-y"
          />
          <div className="mt-3 flex items-center justify-between">
            <p className="text-xs text-muted">
              {documentText.length > 0
                ? `${documentText.length.toLocaleString()}文字`
                : "資料のテキストをペーストしてください"}
            </p>
            <button
              type="button"
              onClick={handleDocumentExtract}
              disabled={!documentText.trim() || loading}
              className="rounded-xl bg-accent px-6 py-2.5 text-sm font-bold text-white transition hover:bg-accent-hover disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
                    <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="opacity-75" />
                  </svg>
                  抽出中...
                </span>
              ) : (
                "AIで抽出する"
              )}
            </button>
          </div>
        </div>
      )}

      {error && (
        <p className="mt-3 text-sm text-red-500">{error}</p>
      )}
      {successMsg && (
        <p className="mt-3 text-sm text-green-600 font-medium">{successMsg}</p>
      )}
    </div>
  );
}
