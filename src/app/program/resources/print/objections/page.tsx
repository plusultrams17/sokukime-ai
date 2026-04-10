"use client";

import { objectionCategories } from "@/lib/objections-data";

export default function PrintObjectionsPage() {
  const totalItems = objectionCategories.reduce(
    (sum, c) => sum + c.items.length,
    0,
  );

  return (
    <article className="print-prose">
      {/* Cover */}
      <header className="mb-8 border-b-4 border-orange-500 pb-6">
        <p className="mb-2 text-xs font-bold uppercase tracking-widest text-orange-600">
          成約コーチAI 教材プログラム
        </p>
        <h1>
          反論切り返し
          <br />
          <span className="text-orange-600">30パターン集</span>
        </h1>
        <p className="mt-4 text-sm text-gray-600 leading-relaxed">
          営業現場でよくある断り文句 {totalItems}
          パターンへの実践的な切り返しトーク集。NG対応と正しい切り返し、テクニック名、プロのコツまで完全網羅。
        </p>
        <div className="mt-4 flex items-center gap-3 text-xs text-gray-500">
          <span className="font-bold">{totalItems}パターン収録</span>
          <span>|</span>
          <span>{objectionCategories.length}カテゴリ分類</span>
          <span>|</span>
          <span>そのまま使える実践例</span>
        </div>
      </header>

      {/* Table of Contents */}
      <section className="print-avoid-break mb-10 rounded-lg bg-gray-50 p-5">
        <h2 className="!mt-0 !border-none !pb-0 text-orange-600" style={{ fontSize: "14pt" }}>
          目次
        </h2>
        <ol className="mt-3 !pl-0 !list-none space-y-2">
          {objectionCategories.map((cat, i) => (
            <li key={cat.id} className="!mb-0 text-sm">
              <span className="font-bold text-gray-900">
                カテゴリ {i + 1}. {cat.name}
              </span>
              <span className="ml-2 text-[9.5pt] text-gray-500">
                （{cat.items.length}パターン）
              </span>
              <ul className="mt-1 !pl-6 !list-disc space-y-0.5">
                {cat.items.map((item) => (
                  <li key={item.objection} className="!mb-0 text-[10pt] text-gray-700">
                    「{item.objection}」
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </section>

      {/* Categories */}
      {objectionCategories.map((cat, catIdx) => (
        <section
          key={cat.id}
          className={catIdx > 0 ? "print-page-break" : ""}
        >
          <header className="mb-5">
            <div className="mb-1 flex items-center gap-3">
              <span className="inline-flex items-center rounded-full bg-orange-500 px-3 py-0.5 text-[9pt] font-bold text-white">
                カテゴリ {catIdx + 1}
              </span>
              <span className="text-[9pt] text-gray-500">
                {cat.items.length}パターン
              </span>
            </div>
            <h2 className="!mt-2">{cat.name}</h2>
          </header>

          {cat.items.map((item, itemIdx) => (
            <div
              key={item.objection}
              className="print-avoid-break mb-5 rounded-lg border border-gray-200 p-4"
            >
              <div className="mb-2 flex items-start gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-900 text-[10pt] font-bold text-white">
                  {itemIdx + 1}
                </span>
                <div className="flex-1">
                  <h3 className="!mt-0 !mb-1 !text-[13pt]">
                    「{item.objection}」
                  </h3>
                  <p className="!mb-0 text-[9.5pt] text-gray-500">
                    {item.context}
                  </p>
                </div>
              </div>

              {/* NG response */}
              <div className="mb-3 rounded border-l-4 border-red-400 bg-red-50 p-3">
                <p className="!mb-1 text-[9.5pt] font-bold text-red-700">
                  ❌ NG対応
                </p>
                <p className="!mb-0 text-[10pt] text-gray-700">
                  {item.ngResponse}
                </p>
              </div>

              {/* OK responses */}
              <div className="mb-3 rounded border-l-4 border-green-500 bg-green-50 p-3">
                <p className="!mb-2 text-[9.5pt] font-bold text-green-700">
                  ✅ 正しい切り返し
                </p>
                <ul className="!mb-0 !pl-4 !list-disc space-y-1.5">
                  {item.responses.map((r, i) => (
                    <li key={i} className="!mb-0 text-[10pt] text-gray-800">
                      {r}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Technique + Tip */}
              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="flex-1 rounded bg-blue-50 p-2.5">
                  <p className="!mb-0 text-[9pt] text-blue-900">
                    <strong>テクニック:</strong> {item.technique}
                  </p>
                </div>
                <div className="flex-1 rounded bg-amber-50 p-2.5">
                  <p className="!mb-0 text-[9pt] text-amber-900">
                    <strong>💡 プロのコツ:</strong> {item.tip}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </section>
      ))}

      {/* Footer */}
      <footer className="mt-12 border-t border-gray-200 pt-6 text-center">
        <p className="text-[9pt] text-gray-500">
          © 成約コーチAI — 反論切り返し30パターン集
        </p>
        <p className="mt-1 text-[9pt] text-gray-500">
          https://seiyaku-coach.vercel.app
        </p>
      </footer>
    </article>
  );
}
