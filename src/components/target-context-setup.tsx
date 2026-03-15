"use client";

import { useState, useEffect, useCallback } from "react";
import {
  loadTargetContext,
  saveTargetContext,
  hasTargetContext,
  type TargetContext,
  EMPTY_TARGET,
} from "@/lib/target-context";

type InputMode = "url" | "manual" | "document";

const MANUAL_FIELDS: {
  key: keyof TargetContext;
  label: string;
  placeholder: string;
}[] = [
  {
    key: "targetCompanyName",
    label: "ターゲット企業名",
    placeholder: "例: 株式会社〇〇",
  },
  {
    key: "targetIndustry",
    label: "業種",
    placeholder: "例: 製造業、小売業、IT...",
  },
  {
    key: "targetPosition",
    label: "担当者役職・部門",
    placeholder: "例: 営業部長、経営企画室...",
  },
  {
    key: "targetScale",
    label: "企業規模",
    placeholder: "例: 従業員100名、年商10億円...",
  },
  {
    key: "targetNeeds",
    label: "想定ニーズ・課題",
    placeholder: "例: コスト削減、業務効率化、売上拡大...",
  },
  {
    key: "targetBudget",
    label: "想定予算",
    placeholder: "例: 月額5万円〜、年間100万円...",
  },
  {
    key: "targetTimeline",
    label: "導入検討時期",
    placeholder: "例: 今期中、来月、半年以内...",
  },
];

export function TargetContextSetup() {
  const [mode, setMode] = useState<InputMode>("url");
  const [ctx, setCtx] = useState<TargetContext>(EMPTY_TARGET);
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
    const saved = loadTargetContext();
    setCtx(saved);
    setIsRegistered(hasTargetContext(saved));
    setIsHydrated(true);
  }, []);

  const handleManualChange = useCallback(
    (field: keyof TargetContext, value: string) => {
      setCtx((prev) => ({ ...prev, [field]: value }));
    },
    [],
  );

  const handleManualSave = useCallback(() => {
    saveTargetContext(ctx);
    setIsRegistered(true);
    setIsEditing(false);
    setSuccessMsg("ターゲット情報を保存しました");
    setTimeout(() => setSuccessMsg(""), 3000);
  }, [ctx]);

  const handleUrlExtract = useCallback(async () => {
    if (!url.trim()) return;
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/target-context/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "抽出に失敗しました");
        return;
      }
      const extracted = data.extracted as Partial<TargetContext>;
      const merged: TargetContext = { ...EMPTY_TARGET };
      for (const key of Object.keys(EMPTY_TARGET) as (keyof TargetContext)[]) {
        if (extracted[key]) merged[key] = extracted[key];
      }
      setCtx(merged);
      saveTargetContext(merged);
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
      const res = await fetch("/api/target-context/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentText }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "抽出に失敗しました");
        return;
      }
      const extracted = data.extracted as Partial<TargetContext>;
      const merged: TargetContext = { ...EMPTY_TARGET };
      for (const key of Object.keys(EMPTY_TARGET) as (keyof TargetContext)[]) {
        if (extracted[key]) merged[key] = extracted[key];
      }
      merged.additionalInfo = documentText.trim().slice(0, 3000);
      setCtx(merged);
      saveTargetContext(merged);
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
    setCtx(EMPTY_TARGET);
    saveTargetContext(EMPTY_TARGET);
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
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
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
                ターゲット情報が登録済みです
              </p>
              <p className="text-xs text-muted mt-0.5">
                各レッスンのAIがターゲットに合わせた回答を生成します
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
          {ctx.targetCompanyName && (
            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-foreground">
              {ctx.targetCompanyName}
            </span>
          )}
          {ctx.targetIndustry && (
            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-foreground">
              {ctx.targetIndustry}
            </span>
          )}
          {ctx.targetPosition && (
            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
              {ctx.targetPosition}
            </span>
          )}
          {ctx.targetScale && (
            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-foreground">
              {ctx.targetScale}
            </span>
          )}
          {ctx.targetBudget && (
            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-foreground">
              {ctx.targetBudget}
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
            ターゲット情報を編集
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
              placeholder="ターゲット企業の資料や情報をここにペーストすると、AIがより精度の高い回答を生成します"
              className="w-full rounded-xl border border-[#E5E0D8] bg-white px-4 py-3 text-sm outline-none transition-all duration-200 focus:border-accent focus:shadow-[0_0_0_3px_rgba(249,115,22,0.1)] placeholder:text-[#B4B0A8] min-h-[80px] resize-y"
            />
          </div>
        </div>
        <div className="mt-6 flex items-center gap-3">
          <button
            type="button"
            onClick={handleManualSave}
            disabled={!ctx.targetCompanyName.trim() && !ctx.targetIndustry.trim()}
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
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
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
              d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
            />
          </svg>
        </span>
        <div>
          <h3 className="text-base font-bold text-foreground">
            ターゲット情報を登録する
          </h3>
          <p className="text-xs text-muted mt-0.5">
            営業先の情報を登録すると、よりリアルなロープレ練習ができます
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
              placeholder="https://target-company.com"
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
            ターゲット企業のWebサイトURLを入力すると、AIが自動で情報を抽出します
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
            disabled={!ctx.targetCompanyName.trim() && !ctx.targetIndustry.trim()}
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
            placeholder="ターゲット企業の資料、会社概要、ニュース記事などのテキストをここに貼り付けてください。&#10;&#10;PDFの場合は、テキストをコピーしてペーストしてください。"
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
