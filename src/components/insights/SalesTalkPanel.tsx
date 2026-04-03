"use client";

import { useState } from "react";
import type { Insight, SalesTalkPattern } from "@/types/insights";

interface SalesTalkPanelProps {
  isOpen: boolean;
  onClose: () => void;
  insight: Insight | null;
  patterns: SalesTalkPattern[] | null;
  isLoading: boolean;
  onGenerate: (industry: string, product: string) => void;
  industry: string;
  product: string;
  onIndustryChange: (v: string) => void;
  onProductChange: (v: string) => void;
}

const PATTERN_LABELS: Record<string, string> = {
  approach: "A: アプローチ",
  presentation: "B: プレゼン",
  objection: "C: 反論処理",
};

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      onClick={handleCopy}
      className="shrink-0 rounded-md border border-card-border px-2.5 py-1 text-[10px] text-muted transition hover:border-accent/30 hover:text-foreground"
    >
      {copied ? "コピー済み" : "コピー"}
    </button>
  );
}

export function SalesTalkPanel({
  isOpen,
  onClose,
  insight,
  patterns,
  isLoading,
  onGenerate,
  industry,
  product,
  onIndustryChange,
  onProductChange,
}: SalesTalkPanelProps) {
  if (!isOpen || !insight) return null;

  return (
    <>
      {/* Desktop: fixed right panel */}
      <div className="hidden lg:block">
        <div className="fixed right-0 top-16 z-30 h-[calc(100vh-4rem)] w-[400px] overflow-y-auto border-l border-card-border bg-background p-6">
          <PanelContent
            insight={insight}
            patterns={patterns}
            isLoading={isLoading}
            onGenerate={onGenerate}
            onClose={onClose}
            industry={industry}
            product={product}
            onIndustryChange={onIndustryChange}
            onProductChange={onProductChange}
          />
        </div>
      </div>

      {/* Mobile: bottom sheet */}
      <div className="lg:hidden">
        {/* Backdrop */}
        <div
          className="fixed inset-0 z-40 bg-black/40"
          onClick={onClose}
        />
        <div className="fixed bottom-0 left-0 right-0 z-50 max-h-[80vh] overflow-y-auto rounded-t-2xl border-t border-card-border bg-background p-6">
          {/* Drag handle */}
          <div className="mb-4 flex justify-center">
            <div className="h-1 w-10 rounded-full bg-card-border" />
          </div>
          <PanelContent
            insight={insight}
            patterns={patterns}
            isLoading={isLoading}
            onGenerate={onGenerate}
            onClose={onClose}
            industry={industry}
            product={product}
            onIndustryChange={onIndustryChange}
            onProductChange={onProductChange}
          />
        </div>
      </div>
    </>
  );
}

function PanelContent({
  insight,
  patterns,
  isLoading,
  onGenerate,
  onClose,
  industry,
  product,
  onIndustryChange,
  onProductChange,
}: {
  insight: Insight;
  patterns: SalesTalkPattern[] | null;
  isLoading: boolean;
  onGenerate: (industry: string, product: string) => void;
  onClose: () => void;
  industry: string;
  product: string;
  onIndustryChange: (v: string) => void;
  onProductChange: (v: string) => void;
}) {
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-bold">営業トーク変換</h3>
        <button
          onClick={onClose}
          className="rounded-md p-1 text-muted transition hover:text-foreground"
          aria-label="閉じる"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Original insight info */}
      <div className="mb-5 rounded-lg border border-card-border bg-card p-3">
        <p className="text-xs text-muted">元記事</p>
        <p className="text-sm font-medium text-foreground line-clamp-2">
          {insight.title_ja}
        </p>
      </div>

      {/* Inputs */}
      <div className="mb-4 space-y-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-muted">
            あなたの業界
          </label>
          <input
            type="text"
            value={industry}
            onChange={(e) => onIndustryChange(e.target.value)}
            placeholder="例: 不動産、保険、SaaS"
            className="h-9 w-full rounded-lg border border-card-border bg-background px-3 text-sm text-foreground placeholder:text-muted/50 focus:border-accent focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted">
            あなたの商材
          </label>
          <input
            type="text"
            value={product}
            onChange={(e) => onProductChange(e.target.value)}
            placeholder="例: 投資用マンション、法人保険"
            className="h-9 w-full rounded-lg border border-card-border bg-background px-3 text-sm text-foreground placeholder:text-muted/50 focus:border-accent focus:outline-none"
          />
        </div>
      </div>

      <button
        onClick={() => onGenerate(industry, product)}
        disabled={isLoading || !industry || !product}
        className="mb-6 flex h-10 w-full items-center justify-center rounded-lg bg-accent text-sm font-bold text-white transition hover:bg-accent-hover disabled:opacity-50"
      >
        {isLoading ? "生成中..." : "営業トークを生成する"}
      </button>

      {/* Pattern cards */}
      {patterns && patterns.length > 0 && (
        <div className="space-y-4">
          {patterns.map((pattern) => (
            <div
              key={pattern.type}
              className="rounded-xl border border-card-border bg-card p-4"
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-bold text-accent">
                  {PATTERN_LABELS[pattern.type] || pattern.type}
                </span>
                <CopyButton text={pattern.content} />
              </div>
              <p className="mb-1 text-sm font-bold text-foreground">
                {pattern.title}
              </p>
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted">
                {pattern.content}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
