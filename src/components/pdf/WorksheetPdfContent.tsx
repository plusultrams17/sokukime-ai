"use client";

import { forwardRef } from "react";
import type { ProductInfo } from "@/types/worksheet";
import { WORKSHEET_PHASES } from "@/lib/pdf/worksheet-fields";

interface WorksheetPdfContentProps {
  industry: string;
  productInfo: ProductInfo | null;
  phaseData: Record<string, string>[];
  previews: string[];
}

const S = {
  page: {
    width: "794px",
    padding: "40px",
    fontFamily: "system-ui, sans-serif",
    backgroundColor: "#FFFFFF",
    color: "#1E293B",
    fontSize: "12px",
    lineHeight: "1.6",
  },
  header: {
    borderBottom: "3px solid #1B6B5A",
    paddingBottom: "16px",
    marginBottom: "24px",
  },
  h1: { fontSize: "22px", fontWeight: "bold" as const, margin: 0 },
  meta: { color: "#64748B", margin: "4px 0 0", fontSize: "11px" },
  productBox: {
    border: "1px solid #E5DFD6",
    padding: "16px",
    marginBottom: "24px",
  },
  sectionH: { fontSize: "14px", fontWeight: "bold" as const, marginBottom: "12px" },
  fieldLabel: { fontSize: "10px", fontWeight: "bold" as const, color: "#64748B" },
  footer: {
    borderTop: "1px solid #E5DFD6",
    paddingTop: "12px",
    marginTop: "24px",
    textAlign: "center" as const,
    fontSize: "9px",
    color: "#94A3B8",
  },
} as const;

const WorksheetPdfContent = forwardRef<HTMLDivElement, WorksheetPdfContentProps>(
  function WorksheetPdfContent({ industry, productInfo, phaseData, previews }, ref) {
    return (
      <div ref={ref} style={S.page}>
        {/* Header */}
        <div style={S.header}>
          <h1 style={S.h1}>営業準備ワークシート</h1>
          <p style={S.meta}>
            業種: {industry} | 出力日: {new Date().toLocaleDateString("ja-JP")}
          </p>
        </div>

        {/* Product Info */}
        {productInfo && (
          <div style={S.productBox}>
            <h2 style={S.sectionH}>商材情報</h2>
            <div style={{ display: "flex", flexWrap: "wrap" as const, gap: "8px" }}>
              {[
                { l: "商材名", v: productInfo.productName },
                { l: "業種", v: productInfo.industry },
                { l: "ターゲット層", v: productInfo.targetAudience },
                { l: "価格帯", v: productInfo.priceRange },
                { l: "主な特徴", v: productInfo.keyFeatures },
                { l: "競合優位性", v: productInfo.advantages },
                { l: "課題", v: productInfo.challenges },
              ]
                .filter((x) => x.v)
                .map((x) => (
                  <div key={x.l} style={{ flex: "0 0 48%", marginBottom: "4px" }}>
                    <span style={S.fieldLabel}>{x.l}: </span>
                    <span style={{ fontSize: "11px" }}>{x.v}</span>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Phases */}
        {WORKSHEET_PHASES.map((phase, pi) => (
          <div key={pi} style={{ marginBottom: "28px" }}>
            {/* Phase Header */}
            <div
              style={{
                borderLeft: `4px solid ${phase.color}`,
                paddingLeft: "12px",
                marginBottom: "14px",
              }}
            >
              <h2
                style={{
                  fontSize: "16px",
                  fontWeight: "bold",
                  color: phase.color,
                  margin: 0,
                }}
              >
                {phase.phaseNum}: {phase.phaseName}
              </h2>
              <p style={{ fontSize: "11px", color: "#64748B", margin: "2px 0 0" }}>
                {phase.phaseSub}
              </p>
            </div>

            {/* Sections */}
            {phase.sections.map((section, si) => (
              <div key={si} style={{ marginBottom: "14px" }}>
                <h3
                  style={{
                    fontSize: "11px",
                    fontWeight: "bold",
                    color: phase.color,
                    borderBottom: `1px solid ${phase.color}30`,
                    paddingBottom: "3px",
                    marginBottom: "8px",
                  }}
                >
                  {section.title}
                </h3>
                {section.fields.map((field) => {
                  const value = phaseData[pi]?.[field.key] || "";
                  return (
                    <div key={field.key} style={{ marginBottom: "6px" }}>
                      <div style={S.fieldLabel}>{field.label}</div>
                      <div
                        style={{
                          border: "1px solid #E5DFD6",
                          padding: "5px 10px",
                          minHeight: field.multiline ? "40px" : "24px",
                          fontSize: "11px",
                          backgroundColor: value ? "#FFFFFF" : "#F8F9FA",
                          color: value ? "#1E293B" : "#CBD5E1",
                          whiteSpace: "pre-wrap",
                        }}
                      >
                        {value || "(未入力)"}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}

            {/* AI Preview */}
            {previews[pi] && (
              <div
                style={{
                  borderLeft: "3px solid #16A34A",
                  backgroundColor: "#F0FDF4",
                  padding: "8px 12px",
                  fontSize: "11px",
                  color: "#166534",
                  marginTop: "10px",
                  whiteSpace: "pre-wrap",
                }}
              >
                <div style={{ fontWeight: "bold", marginBottom: "4px", fontSize: "10px" }}>
                  AIトーク例:
                </div>
                {previews[pi]}
              </div>
            )}
          </div>
        ))}

        {/* Footer */}
        <div style={S.footer}>成約コーチ AI - 営業準備ワークシート</div>
      </div>
    );
  },
);

export default WorksheetPdfContent;
