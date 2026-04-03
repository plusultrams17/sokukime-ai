"use client";

import { useState } from "react";
import Link from "next/link";
import { getIndustryBySlug } from "@/data/industries";
import { IndustryIcon } from "@/components/industry-icons";

/* ─── NG回答データ（既存データにNG回答フィールドがないため） ─── */

const ngResponses: Record<string, string> = {
  "exterior-painting": "そうですか...では劣化が進んだらまたお声がけください",
  "reform": "えっ、それは安すぎますよ。手抜き工事かもしれませんよ",
  "real-estate": "わかりました。ではまた見たい物件がありましたらご連絡ください",
  "insurance": "でも万が一のことがあったら、ご家族が大変ですよ",
  "saas": "承知しました。ご検討よろしくお願いします",
  "hr": "そうですか、では採用の計画が出たらまたご連絡ください",
  "education": "わかりました。お子さんと相談されてからご連絡ください",
  "retail": "そうですか...では資料だけ置いていきますね",
};

/* ─── Props ─── */

interface IndustryItem {
  name: string;
  desc: string;
  slug: string;
}

export function IndustryQuickValue({ industries }: { industries: IndustryItem[] }) {
  const [selectedSlug, setSelectedSlug] = useState(industries[0].slug);
  const [expanded, setExpanded] = useState(false);
  const industry = getIndustryBySlug(selectedSlug);
  const selectedItem = industries.find((i) => i.slug === selectedSlug);
  const patterns = industry?.objectionPatterns ?? [];
  const firstPattern = patterns[0];
  const ng = ngResponses[selectedSlug];
  const remainingPatterns = patterns.slice(1);

  function handleSelectIndustry(slug: string) {
    setSelectedSlug(slug);
    setExpanded(false);
  }

  return (
    <section className="relative overflow-hidden px-6 py-16 sm:py-20">
      <div className="absolute inset-0 bg-gradient-to-b from-accent/[0.03] via-transparent to-transparent" aria-hidden="true" />
      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <h2 className="mb-2 text-2xl font-bold text-foreground sm:text-3xl">
          あなたの業種で、明日使える切り返しトーク
        </h2>
        <p className="mb-10 text-sm text-muted sm:text-base">
          業種を選んで、プロの営業話法を今すぐ体験
        </p>

        {/* ─── 業種ボタン ─── */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4 mb-8">
          {industries.map((ind) => (
            <button
              key={ind.slug}
              onClick={() => handleSelectIndustry(ind.slug)}
              className={`group relative overflow-hidden rounded-2xl border p-4 transition-all duration-300 text-left ${
                selectedSlug === ind.slug
                  ? "border-accent bg-accent/10 shadow-lg shadow-accent/10"
                  : "border-card-border bg-white hover:-translate-y-1 hover:border-accent/40 hover:shadow-lg hover:shadow-accent/10"
              }`}
            >
              {selectedSlug === ind.slug && (
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-accent to-orange-400" />
              )}
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl transition-colors duration-300 ${
                  selectedSlug === ind.slug
                    ? "bg-accent text-white"
                    : "bg-accent/10 text-accent group-hover:bg-accent group-hover:text-white"
                }`}>
                  <IndustryIcon name={ind.name} />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">{ind.name}</p>
                  <p className="text-xs text-muted">{ind.desc}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* ─── 切り返しトーク カード ─── */}
        {firstPattern && (
          <div key={selectedSlug} className="animate-fade-in-up mx-auto max-w-2xl text-left">
            {/* パターン1: NG vs 正解 フル表示 */}
            <div className="rounded-2xl border border-card-border bg-white p-6 shadow-lg sm:p-8">
              {/* 業種名 + 断り文句 */}
              <div className="mb-5">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent">
                  <IndustryIcon name={selectedItem?.name ?? ""} />
                  {industry!.name} でよくある断り文句
                </div>
                <p className="text-lg font-bold text-foreground leading-relaxed">
                  「{firstPattern.objection}」
                </p>
                <p className="mt-1 text-xs text-muted">{firstPattern.context}</p>
              </div>

              {/* NG回答 */}
              {ng && (
                <div className="mb-5 rounded-xl bg-red-50 border border-red-100 p-4">
                  <p className="mb-2 text-sm font-bold text-red-500 flex items-center gap-1.5">
                    <span className="text-base">&#10060;</span> よくある失敗トーク
                  </p>
                  <p className="text-sm text-red-700 leading-relaxed">
                    「{ng}」
                  </p>
                </div>
              )}

              {/* 正解トーク */}
              <div className="mb-5 rounded-xl bg-emerald-50 border border-emerald-100 p-4">
                <p className="mb-2 text-sm font-bold text-emerald-600 flex items-center gap-1.5">
                  <span className="text-base">&#9989;</span> 成約する営業のトーク
                </p>
                <p className="text-sm text-emerald-800 leading-relaxed">
                  「{firstPattern.responses[0]}」
                </p>
              </div>

              {/* テクニック */}
              <div className="mb-6 rounded-xl bg-amber-50 border border-amber-100 p-4">
                <p className="text-sm text-amber-800 leading-relaxed">
                  <span className="font-bold">&#128161; テクニック:</span> {firstPattern.technique}
                </p>
              </div>

              {/* 展開ボタン or 残りパターン */}
              {!expanded && remainingPatterns.length > 0 && (
                <button
                  onClick={() => setExpanded(true)}
                  className="group flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-bold text-white transition hover:bg-accent-hover"
                >
                  この業種の切り返しをあと{remainingPatterns.length}パターン見る
                  <svg className="h-4 w-4 transition-transform group-hover:translate-y-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              )}
            </div>

            {/* ─── 展開された残りパターン ─── */}
            {expanded && remainingPatterns.length > 0 && (
              <div className="mt-4 space-y-4 animate-fade-in-up">
                {remainingPatterns.map((p, i) => (
                  <div key={i} className="rounded-2xl border border-card-border bg-white p-6 shadow-sm sm:p-8">
                    <div className="mb-4 flex items-start gap-3">
                      <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-100 text-xs font-bold text-red-600">
                        {i + 2}
                      </span>
                      <div>
                        <p className="text-base font-bold text-foreground leading-relaxed">
                          「{p.objection}」
                        </p>
                        <p className="mt-1 text-xs text-muted">{p.context}</p>
                      </div>
                    </div>

                    {/* 正解トーク */}
                    <div className="mb-4 rounded-xl bg-emerald-50 border border-emerald-100 p-4">
                      <p className="mb-2 text-sm font-bold text-emerald-600 flex items-center gap-1.5">
                        <span className="text-base">&#9989;</span> 成約する営業のトーク
                      </p>
                      <div className="space-y-2">
                        {p.responses.map((r, ri) => (
                          <p key={ri} className="text-sm text-emerald-800 leading-relaxed">
                            {p.responses.length > 1 && (
                              <span className="mr-1.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-200 text-[10px] font-bold text-emerald-700">{ri + 1}</span>
                            )}
                            「{r}」
                          </p>
                        ))}
                      </div>
                    </div>

                    {/* テクニック */}
                    <div className="rounded-xl bg-amber-50 border border-amber-100 p-4">
                      <p className="text-sm text-amber-800 leading-relaxed">
                        <span className="font-bold">&#128161; テクニック:</span> {p.technique}
                      </p>
                    </div>
                  </div>
                ))}

                {/* 展開後CTA */}
                <div className="rounded-2xl border-2 border-accent/30 bg-accent/5 p-6 text-center sm:p-8">
                  <p className="mb-2 text-base font-bold text-foreground">
                    {industry!.name}の切り返しトーク、全{patterns.length}パターンを確認しました
                  </p>
                  <p className="mb-6 text-sm text-muted">
                    次はレッスンで営業の「型」を体系的に身につけましょう
                  </p>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
                    <Link
                      href="/learn"
                      scroll={true}
                      className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-accent px-6 py-3 text-sm font-bold text-white transition hover:bg-accent-hover"
                    >
                      22レッスンで型を学ぶ
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                    <Link
                      href="/roleplay"
                      scroll={true}
                      className="inline-flex items-center justify-center gap-1.5 rounded-xl border-2 border-accent/30 px-6 py-3 text-sm font-bold text-accent transition hover:bg-accent/5"
                    >
                      学んだらAIで練習する
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* 未展開時のサブCTA */}
            {!expanded && (
              <div className="mt-5 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                <Link
                  href="/learn"
                  scroll={true}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-accent/10 px-5 py-2.5 text-sm font-bold text-accent transition hover:bg-accent/20"
                >
                  この業種のレッスンを見る
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
                <Link
                  href="/roleplay"
                  scroll={true}
                  className="text-sm font-medium text-muted transition hover:text-accent hover:underline"
                >
                  AIロープレで練習する
                </Link>
              </div>
            )}
          </div>
        )}

        <div className="mt-10 inline-flex items-center gap-2 rounded-full bg-accent/10 px-5 py-2.5 text-sm font-semibold text-accent">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent" />
          </span>
          無料で業種別レッスンを始められます
        </div>
      </div>
    </section>
  );
}
