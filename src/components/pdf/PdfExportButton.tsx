"use client";

import { useState, useRef, useCallback, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { generatePdf } from "@/lib/pdf/pdf-utils";

interface PdfExportButtonProps {
  filename: string;
  renderContent: (ref: React.RefObject<HTMLDivElement | null>) => ReactNode;
  children?: ReactNode;
  className?: string;
  disabled?: boolean;
}

export function PdfExportButton({
  filename,
  renderContent,
  children,
  className,
  disabled,
}: PdfExportButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const contentRef = useRef<HTMLDivElement | null>(null);

  const handleExport = useCallback(async () => {
    setIsGenerating(true);
    setShowContent(true);

    // Wait for SVGs and content to render
    await new Promise((resolve) => setTimeout(resolve, 800));

    try {
      if (contentRef.current) {
        await generatePdf(contentRef.current, { filename });
      }
    } catch (err) {
      console.error("PDF generation failed:", err);
      alert("PDF生成に失敗しました。もう一度お試しください。");
    } finally {
      setShowContent(false);
      setIsGenerating(false);
    }
  }, [filename]);

  return (
    <>
      <button
        onClick={handleExport}
        disabled={isGenerating || disabled}
        className={
          className ||
          "inline-flex items-center gap-2 border border-card-border bg-white px-4 py-2 text-sm font-medium text-muted transition hover:border-accent hover:text-foreground disabled:opacity-50"
        }
      >
        {isGenerating ? (
          <>
            <span className="inline-block h-4 w-4 animate-spin border-2 border-current/30 border-t-current rounded-full" />
            PDF生成中...
          </>
        ) : (
          children || (
            <>
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
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              PDFで保存
            </>
          )
        )}
      </button>

      {showContent &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            style={{
              position: "fixed",
              left: "-9999px",
              top: 0,
              zIndex: -1,
              overflow: "hidden",
            }}
          >
            {renderContent(contentRef)}
          </div>,
          document.body,
        )}
    </>
  );
}
