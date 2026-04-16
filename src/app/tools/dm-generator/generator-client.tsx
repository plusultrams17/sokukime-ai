"use client";

import { useState, useRef } from "react";
import { ToolUpsellCTA } from "@/components/tool-upsell-cta";

const INDUSTRIES = [
  "保険",
  "不動産",
  "訪問販売",
  "SaaS",
  "医療機器",
  "その他",
];

const CHANNELS = ["X DM", "Instagram DM", "LinkedIn", "メール"];

const RELATIONSHIPS = ["初対面", "面識あり", "元同僚・知人"];

interface DMPattern {
  label: string;
  text: string;
}

function CopyIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function CheckIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      className={`${className} text-green-500`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2.5}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 13l4 4L19 7"
      />
    </svg>
  );
}

export function DMGeneratorClient() {
  const [targetName, setTargetName] = useState("");
  const [industry, setIndustry] = useState("");
  const [channel, setChannel] = useState("");
  const [relationship, setRelationship] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");

  const [patterns, setPatterns] = useState<DMPattern[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copiedIndex, setCopiedIndex] = useState(-1);

  const resultRef = useRef<HTMLDivElement>(null);

  const canGenerate = industry && channel && relationship;

  const handleGenerate = async () => {
    if (!canGenerate) return;

    setLoading(true);
    setError("");
    setPatterns([]);

    try {
      const res = await fetch("/api/tools/dm-generator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetName,
          industry,
          channel,
          relationship,
          additionalInfo,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "生成に失敗しました。もう一度お試しください。");
        return;
      }

      if (data.patterns && Array.isArray(data.patterns)) {
        setPatterns(data.patterns);
        setTimeout(
          () =>
            resultRef.current?.scrollIntoView({
              behavior: "smooth",
              block: "start",
            }),
          100,
        );
      } else {
        setError("生成結果の形式が不正です。もう一度お試しください。");
      }
    } catch {
      setError("通信エラーが発生しました。もう一度お試しください。");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(-1), 2000);
    } catch {
      // fallback: do nothing
    }
  };

  return (
    <div className="space-y-6">
      {/* Input Form */}
      <div className="rounded-2xl border border-card-border bg-white p-6 shadow-sm sm:p-8">
        <h3 className="mb-6 text-base font-bold text-foreground">
          DM生成条件
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">
              ターゲット名
              <span className="ml-1 text-xs text-muted">（任意）</span>
            </label>
            <input
              type="text"
              value={targetName}
              onChange={(e) => setTargetName(e.target.value)}
              placeholder="例: 田中さん"
              maxLength={50}
              className="w-full rounded-xl border border-card-border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-accent"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">
              業種 <span className="text-red-500">*</span>
            </label>
            <select
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="w-full rounded-xl border border-card-border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-accent"
            >
              <option value="">選択してください</option>
              {INDUSTRIES.map((i) => (
                <option key={i} value={i}>
                  {i}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">
              チャネル <span className="text-red-500">*</span>
            </label>
            <select
              value={channel}
              onChange={(e) => setChannel(e.target.value)}
              className="w-full rounded-xl border border-card-border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-accent"
            >
              <option value="">選択してください</option>
              {CHANNELS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">
              関係性 <span className="text-red-500">*</span>
            </label>
            <select
              value={relationship}
              onChange={(e) => setRelationship(e.target.value)}
              className="w-full rounded-xl border border-card-border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-accent"
            >
              <option value="">選択してください</option>
              {RELATIONSHIPS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium text-foreground">
              追加情報
              <span className="ml-1 text-xs text-muted">（任意）</span>
            </label>
            <textarea
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              placeholder='例: 「最近転職した」「投稿でAIに興味あると書いていた」'
              maxLength={500}
              rows={3}
              className="w-full rounded-xl border border-card-border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-accent resize-none"
            />
          </div>
        </div>

        <div className="mt-6 flex flex-col items-center gap-3">
          <button
            onClick={handleGenerate}
            disabled={!canGenerate || loading}
            className="inline-flex h-12 items-center justify-center rounded-xl bg-accent px-8 text-base font-bold text-white transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-40"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg
                  className="h-5 w-5 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                生成中...
              </span>
            ) : (
              "DM文面を生成する"
            )}
          </button>
        </div>

        {error && (
          <div className="mt-4 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}
      </div>

      {/* Generated Results */}
      {patterns.length > 0 && (
        <div ref={resultRef} className="space-y-4 animate-fade-in-up">
          <h3 className="text-base font-bold text-foreground">
            生成結果 -- 3パターン
          </h3>

          {patterns.map((pattern, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl border border-card-border bg-white shadow-sm"
            >
              {/* Pattern header */}
              <div className="flex items-center justify-between border-b border-card-border bg-background/50 px-5 py-3">
                <span className="text-sm font-bold text-foreground">
                  <span
                    className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-accent text-xs font-bold text-white"
                  >
                    {index + 1}
                  </span>
                  {pattern.label}
                </span>
                <button
                  onClick={() => handleCopy(pattern.text, index)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-card-border px-3 py-1.5 text-xs font-medium text-muted transition hover:bg-gray-50 hover:text-foreground"
                >
                  {copiedIndex === index ? (
                    <>
                      <CheckIcon className="h-3.5 w-3.5" />
                      コピー済
                    </>
                  ) : (
                    <>
                      <CopyIcon className="h-3.5 w-3.5" />
                      コピー
                    </>
                  )}
                </button>
              </div>

              {/* Pattern body */}
              <div className="p-5 sm:p-6">
                <p className="text-sm leading-relaxed text-foreground whitespace-pre-line">
                  {pattern.text}
                </p>
              </div>
            </div>
          ))}

          {/* Tip */}
          <div className="rounded-xl border border-accent/20 bg-accent/5 px-5 py-4">
            <p className="text-sm font-medium text-foreground">
              活用のポイント
            </p>
            <ul className="mt-2 space-y-1 text-sm text-muted">
              <li>
                -- 送信前にターゲットの投稿やプロフィールを確認し、具体的な情報を追記すると返信率が上がります
              </li>
              <li>
                -- 一斉送信ではなく、1通ずつカスタマイズすることを推奨します
              </li>
              <li>
                -- 返信がない場合は3-5日後にフォローアップDMを送りましょう
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* Upsell after generation */}
      {patterns.length > 0 && <ToolUpsellCTA />}
    </div>
  );
}
