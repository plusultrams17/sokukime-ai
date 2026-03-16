"use client";

import { useState } from "react";
import Image from "next/image";
import type { Category } from "./page";

export function HandbookFilter({ categories }: { categories: Category[] }) {
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const filtered = activeCategory === "all"
    ? categories
    : categories.filter((c) => c.id === activeCategory);

  return (
    <>
      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2 mb-8 justify-center">
        <button
          onClick={() => setActiveCategory("all")}
          className={`rounded-full px-4 py-2 text-sm font-medium transition ${
            activeCategory === "all"
              ? "bg-accent text-white"
              : "bg-white border border-card-border text-foreground hover:bg-gray-50"
          }`}
        >
          すべて（30）
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              activeCategory === cat.id
                ? "bg-accent text-white"
                : "bg-white border border-card-border text-foreground hover:bg-gray-50"
            }`}
          >
            {cat.image ? <Image src={cat.image} alt="" width={20} height={20} className="inline-block rounded" /> : cat.icon} {cat.name}（{cat.items.length}）
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="space-y-8">
        {filtered.map((cat) => (
          <div key={cat.id}>
            <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-foreground">
              {cat.image ? <Image src={cat.image} alt={cat.name} width={32} height={32} className="rounded-lg" /> : <span className="text-2xl">{cat.icon}</span>}
              {cat.name}の反論（{cat.items.length}パターン）
            </h3>
            <div className="space-y-3">
              {cat.items.map((item, i) => (
                <details key={i} className="group rounded-2xl bg-white shadow-sm border border-card-border">
                  <summary className="flex cursor-pointer items-center justify-between px-6 py-4 [&::-webkit-details-marker]:hidden list-none">
                    <p className="text-sm font-bold text-foreground">
                      &ldquo;{item.objection}&rdquo;
                    </p>
                    <svg className="h-5 w-5 shrink-0 text-muted transition-transform duration-200 group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="border-t border-card-border px-6 pb-6 pt-4 space-y-4">
                    <div>
                      <p className="text-xs font-semibold text-muted mb-1">よくある状況</p>
                      <p className="text-sm text-foreground">{item.context}</p>
                    </div>
                    <div className="rounded-lg bg-red-50 border border-red-200/50 p-3">
                      <p className="text-xs font-semibold text-red-600 mb-1">NG対応</p>
                      <p className="text-sm text-red-700">{item.ngResponse}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted mb-2">切り返しトーク例</p>
                      <div className="space-y-2">
                        {item.responses.map((r, ri) => (
                          <div key={ri} className="flex gap-3 rounded-xl bg-green-50 border border-green-200/50 p-3">
                            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-600 text-[10px] font-bold text-white">{ri + 1}</span>
                            <p className="text-sm text-foreground leading-relaxed">{r}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <span className="inline-flex items-center rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
                        テクニック: {item.technique}
                      </span>
                    </div>
                    <div className="rounded-lg bg-amber-50 border border-amber-200/50 p-3">
                      <p className="text-xs font-semibold text-amber-700 mb-1">💡 ポイント</p>
                      <p className="text-sm text-amber-800">{item.tip}</p>
                    </div>
                  </div>
                </details>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
