"use client";

import { useState } from "react";

interface IndustrySetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (industries: string[]) => void;
}

const INDUSTRY_OPTIONS = [
  { slug: "real-estate", label: "不動産" },
  { slug: "insurance", label: "保険" },
  { slug: "saas", label: "SaaS / IT" },
  { slug: "hr", label: "人材" },
  { slug: "education", label: "教育" },
  { slug: "retail", label: "物販" },
  { slug: "finance", label: "金融" },
  { slug: "medical", label: "医療" },
  { slug: "manufacturing", label: "製造" },
  { slug: "consulting", label: "コンサル" },
  { slug: "advertising", label: "広告" },
  { slug: "automotive", label: "自動車" },
];

export function IndustrySetupModal({
  isOpen,
  onClose,
  onSave,
}: IndustrySetupModalProps) {
  const [selected, setSelected] = useState<string[]>([]);

  if (!isOpen) return null;

  function toggle(slug: string) {
    setSelected((prev) =>
      prev.includes(slug)
        ? prev.filter((s) => s !== slug)
        : [...prev, slug]
    );
  }

  async function handleSave() {
    if (selected.length === 0) return;
    onSave(selected);
  }

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-50 bg-black/50" onClick={onClose} />
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="w-full max-w-md rounded-2xl border border-card-border bg-background p-6"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="mb-2 text-lg font-bold text-foreground">
            あなたの業界を選んでください
          </h2>
          <p className="mb-5 text-sm text-muted">
            選択した業界のインサイトを優先的に表示します（複数選択可）
          </p>
          <div className="mb-6 grid grid-cols-3 gap-2">
            {INDUSTRY_OPTIONS.map((opt) => (
              <button
                key={opt.slug}
                onClick={() => toggle(opt.slug)}
                className={`rounded-lg border px-3 py-2.5 text-sm font-medium transition ${
                  selected.includes(opt.slug)
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-card-border bg-card text-muted hover:border-accent/30"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="flex-1 rounded-lg border border-card-border py-2.5 text-sm text-muted transition hover:text-foreground"
            >
              後で
            </button>
            <button
              onClick={handleSave}
              disabled={selected.length === 0}
              className="flex-1 rounded-lg bg-accent py-2.5 text-sm font-bold text-white transition hover:bg-accent-hover disabled:opacity-50"
            >
              保存する ({selected.length})
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
