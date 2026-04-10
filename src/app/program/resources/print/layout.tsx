"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function PrintLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [status, setStatus] = useState<"loading" | "unauthorized" | "ready">(
    "loading",
  );

  useEffect(() => {
    async function checkAccess() {
      try {
        const res = await fetch("/api/program/status");
        const data = await res.json();
        if (!data.authenticated) {
          window.location.href = "/login?redirect=/program/resources";
          return;
        }
        if (!data.purchased) {
          window.location.href = "/pricing";
          return;
        }
        setStatus("ready");
      } catch {
        setStatus("unauthorized");
      }
    }
    checkAccess();
  }, []);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-sm text-gray-500 animate-pulse">読み込み中...</div>
      </div>
    );
  }

  if (status === "unauthorized") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-center">
          <p className="mb-4 text-sm text-gray-600">アクセスできませんでした</p>
          <Link
            href="/pricing"
            className="text-sm font-medium text-orange-600 hover:underline"
          >
            料金プランを見る
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 print-container">
      {/* Sticky toolbar (hidden on print) */}
      <div className="sticky top-0 z-10 border-b border-gray-200 bg-white shadow-sm print:hidden">
        <div className="mx-auto flex max-w-[210mm] items-center justify-between px-6 py-3">
          <Link
            href="/program/resources"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
            リソースハブへ戻る
          </Link>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-5 py-2 text-sm font-bold text-white transition hover:bg-orange-600"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="6 9 6 2 18 2 18 9" />
              <path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2" />
              <rect x="6" y="14" width="12" height="8" />
            </svg>
            PDFとして保存
          </button>
        </div>
        <div className="mx-auto max-w-[210mm] px-6 pb-3">
          <p className="text-xs text-gray-500">
            ※ 「PDFとして保存」を押すと印刷ダイアログが開きます。送信先で「PDFに保存」を選んでください。
          </p>
        </div>
      </div>

      {/* Content (printable area) */}
      <div className="mx-auto max-w-[210mm] bg-white p-8 shadow-sm print:max-w-none print:p-0 print:shadow-none">
        {children}
      </div>

      {/* Print styles */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4;
            margin: 18mm 15mm 18mm 15mm;
          }
          html,
          body {
            background: white !important;
          }
          .print-container {
            background: white !important;
          }
          .print-page-break {
            page-break-before: always;
          }
          .print-avoid-break {
            page-break-inside: avoid;
          }
          h1,
          h2,
          h3 {
            page-break-after: avoid;
          }
          img,
          table {
            page-break-inside: avoid;
          }
        }

        .print-prose h1 {
          font-size: 24pt;
          font-weight: 800;
          color: #0f172a;
          margin-top: 0;
          margin-bottom: 1rem;
          line-height: 1.3;
        }
        .print-prose h2 {
          font-size: 16pt;
          font-weight: 700;
          color: #0f172a;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
          padding-bottom: 0.4rem;
          border-bottom: 2px solid #f97316;
          line-height: 1.4;
        }
        .print-prose h3 {
          font-size: 13pt;
          font-weight: 700;
          color: #1e293b;
          margin-top: 1.2rem;
          margin-bottom: 0.5rem;
          line-height: 1.4;
        }
        .print-prose p {
          font-size: 10.5pt;
          line-height: 1.75;
          color: #334155;
          margin-bottom: 0.75rem;
        }
        .print-prose ul {
          list-style: disc;
          padding-left: 1.5rem;
          margin-bottom: 0.75rem;
        }
        .print-prose ol {
          list-style: decimal;
          padding-left: 1.5rem;
          margin-bottom: 0.75rem;
        }
        .print-prose li {
          font-size: 10.5pt;
          line-height: 1.75;
          color: #334155;
          margin-bottom: 0.35rem;
        }
        .print-prose strong {
          font-weight: 700;
          color: #0f172a;
        }
        .print-prose .ann {
          display: block;
          font-size: 9.5pt;
          color: #64748b;
          margin-left: 0.5rem;
        }
        .print-prose .example-ng,
        .print-prose .example-ok,
        .print-prose .example-talk {
          border-left: 4px solid;
          padding: 0.75rem 1rem;
          margin: 0.75rem 0;
          border-radius: 0.25rem;
        }
        .print-prose .example-ng {
          border-color: #ef4444;
          background: #fef2f2;
        }
        .print-prose .example-ok {
          border-color: #10b981;
          background: #ecfdf5;
        }
        .print-prose .example-talk {
          border-color: #3b82f6;
          background: #eff6ff;
        }
        .print-prose .example-ng h3,
        .print-prose .example-ok h3,
        .print-prose .example-talk h3 {
          font-size: 11pt;
          margin-top: 0;
          margin-bottom: 0.4rem;
        }
        .print-prose .example-ng p,
        .print-prose .example-ok p,
        .print-prose .example-talk p {
          margin-bottom: 0.3rem;
        }
        .print-prose em {
          font-style: normal;
          color: #64748b;
          font-size: 9.5pt;
        }
      `}</style>
    </div>
  );
}
