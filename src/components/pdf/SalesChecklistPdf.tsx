"use client";

import { forwardRef } from "react";

interface CheckItem {
  text: string;
}

interface CheckCategory {
  name: string;
  color: string;
  items: CheckItem[];
}

const CATEGORIES: CheckCategory[] = [
  {
    name: "アプローチ（信頼構築）",
    color: "#0F6E56",
    items: [
      { text: "商談前に相手の会社・個人について必ずリサーチしている" },
      { text: "第一印象（身だしなみ・表情・声のトーン）を意識的に整えている" },
      { text: "相手を具体的に褒めてからビジネスの話に入れている" },
      { text: "相手が話しやすい雰囲気をつくれている" },
      { text: "名前を呼びながら会話を進めている" },
    ],
  },
  {
    name: "ヒアリング（課題発掘）",
    color: "#2563EB",
    items: [
      { text: "自分が話す時間より相手が話す時間のほうが長い" },
      { text: "「現状→課題→理想→リスク」の順で質問を深掘りできている" },
      { text: "相手が自覚していない潜在ニーズを引き出せている" },
      { text: "数字を使った具体的な質問ができている" },
      { text: "相手の言葉を復唱・要約して確認を取っている" },
    ],
  },
  {
    name: "プレゼン（価値提案）",
    color: "#7C3AED",
    items: [
      { text: "機能の説明ではなく、相手にとっての価値で提案できている" },
      { text: "ヒアリングで聞いた課題に直結する形で提案している" },
      { text: "同業種・同規模の導入事例を必ず1つ以上提示している" },
      { text: "競合との違いを明確に説明できている" },
      { text: "数字（コスト削減額・時間短縮・ROI）で効果を示している" },
    ],
  },
  {
    name: "クロージング（決断促進）",
    color: "#DC2626",
    items: [
      { text: "事前合意で「今日決めるか決めないか」を最初に確認している" },
      { text: "二者択一の質問で決断を促せている" },
      { text: "沈黙を恐れず、相手が考える時間を与えている" },
      { text: "「始める前提」で自然に手続きの話に移行できている" },
      { text: "限定性・緊急性を適切に提示できている" },
    ],
  },
  {
    name: "反論処理（切り返し）",
    color: "#EA580C",
    items: [
      { text: "反論が出ても動揺せず、まず共感を示せている" },
      { text: "「検討します」の裏にある本当の理由を聞き出せている" },
      { text: "価格の反論に対して、価値の再提示ができている" },
      { text: "決裁者が別の場合、稟議サポート資料を用意している" },
      { text: "反論を次回アポの約束につなげられている" },
    ],
  },
];

const ACCENT = "#f97316";

const S = {
  page: {
    width: "794px",
    padding: "40px",
    fontFamily: "system-ui, sans-serif",
    backgroundColor: "#FFFFFF",
    color: "#1E293B",
    fontSize: "11px",
    lineHeight: "1.6",
  },
  header: {
    borderBottom: `3px solid ${ACCENT}`,
    paddingBottom: "12px",
    marginBottom: "20px",
  },
  h1: { fontSize: "20px", fontWeight: "bold" as const, margin: 0 },
  subtitle: { color: "#64748B", margin: "4px 0 0", fontSize: "11px" },
  instructions: {
    backgroundColor: "#FFF7ED",
    border: `1px solid ${ACCENT}40`,
    padding: "10px 14px",
    marginBottom: "20px",
    fontSize: "10.5px",
    color: "#92400E",
    lineHeight: "1.7",
  },
  categoryHeader: (color: string) => ({
    backgroundColor: color,
    color: "#FFFFFF",
    padding: "6px 14px",
    fontSize: "13px",
    fontWeight: "bold" as const,
    marginBottom: "8px",
    marginTop: "16px",
  }),
  checkRow: {
    display: "flex" as const,
    alignItems: "flex-start" as const,
    gap: "8px",
    padding: "5px 0",
    borderBottom: "1px solid #F1F5F9",
  },
  ratingBoxes: {
    display: "flex" as const,
    gap: "4px",
    flexShrink: 0,
  },
  ratingBox: {
    width: "22px",
    height: "22px",
    border: "1px solid #CBD5E1",
    textAlign: "center" as const,
    fontSize: "9px",
    lineHeight: "22px",
    color: "#94A3B8",
  },
  checkText: {
    fontSize: "11px",
    color: "#1E293B",
    flex: 1,
    paddingTop: "2px",
  },
  subtotalRow: {
    display: "flex" as const,
    justifyContent: "flex-end" as const,
    padding: "6px 0",
    fontSize: "11px",
    fontWeight: "bold" as const,
  },
  scoreSummary: {
    border: `2px solid ${ACCENT}`,
    padding: "16px",
    marginTop: "24px",
    textAlign: "center" as const,
  },
  actionPlan: {
    border: "1px dashed #CBD5E1",
    padding: "12px 14px",
    minHeight: "80px",
    marginTop: "16px",
    backgroundColor: "#FAFAFA",
  },
  footer: {
    borderTop: "1px solid #E5DFD6",
    paddingTop: "10px",
    marginTop: "20px",
    textAlign: "center" as const,
    fontSize: "9px",
    color: "#94A3B8",
  },
} as const;

const SalesChecklistPdf = forwardRef<HTMLDivElement>(
  function SalesChecklistPdf(_props, ref) {
    return (
      <div ref={ref} style={S.page}>
        {/* Header */}
        <div style={S.header}>
          <h1 style={S.h1}>営業力セルフチェックシート</h1>
          <p style={S.subtitle}>
            成約コーチ AI | 5カテゴリ x 5項目 = 25項目 | 出力日: {new Date().toLocaleDateString("ja-JP")}
          </p>
        </div>

        {/* Instructions */}
        <div style={S.instructions}>
          <strong>評価方法:</strong> 各項目を1〜5の5段階で自己評価してください。<br />
          1=全くできていない / 2=たまにできている / 3=半分くらいできている / 4=ほぼできている / 5=常にできている<br />
          <strong>記入日:</strong> ______年 ______月 ______日 &nbsp;&nbsp; <strong>氏名:</strong> ________________________
        </div>

        {/* Rating Headers */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "4px", fontSize: "9px", color: "#94A3B8", gap: "4px" }}>
          <span style={{ width: "22px", textAlign: "center" }}>1</span>
          <span style={{ width: "22px", textAlign: "center" }}>2</span>
          <span style={{ width: "22px", textAlign: "center" }}>3</span>
          <span style={{ width: "22px", textAlign: "center" }}>4</span>
          <span style={{ width: "22px", textAlign: "center" }}>5</span>
        </div>

        {/* Categories */}
        {CATEGORIES.map((cat, ci) => (
          <div key={ci}>
            <div style={S.categoryHeader(cat.color)}>
              {ci + 1}. {cat.name}
            </div>
            {cat.items.map((item, ii) => (
              <div key={ii} style={S.checkRow}>
                <div style={S.checkText}>
                  {ci * 5 + ii + 1}. {item.text}
                </div>
                <div style={S.ratingBoxes}>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <div key={n} style={S.ratingBox}>{n}</div>
                  ))}
                </div>
              </div>
            ))}
            <div style={S.subtotalRow}>
              <span style={{ color: cat.color }}>小計: _____ / 25</span>
            </div>
          </div>
        ))}

        {/* Total Score Summary */}
        <div style={S.scoreSummary}>
          <div style={{ fontSize: "14px", fontWeight: "bold", marginBottom: "8px" }}>
            合計スコア: _____ / 125
          </div>
          <div style={{ fontSize: "10px", color: "#64748B", lineHeight: "1.8" }}>
            100〜125: 即戦力レベル。高い営業スキルを維持しています。<br />
            75〜99: 実践レベル。弱点カテゴリを集中強化すると成約率が上がります。<br />
            50〜74: 成長途上。基本の型を身につけることで大きく改善できます。<br />
            25〜49: 基礎固め段階。まず1つのカテゴリに絞って改善しましょう。
          </div>
        </div>

        {/* Action Plan */}
        <div style={{ marginTop: "20px" }}>
          <div style={{ fontSize: "13px", fontWeight: "bold", marginBottom: "8px", color: ACCENT }}>
            改善アクションプラン
          </div>
          <div style={{ fontSize: "10px", color: "#64748B", marginBottom: "8px" }}>
            最もスコアが低いカテゴリを1つ選び、具体的な改善行動を記入してください。
          </div>
          <div style={S.actionPlan}>
            <div style={{ fontSize: "10px", color: "#94A3B8", marginBottom: "6px" }}>
              重点改善カテゴリ: _______________________________
            </div>
            <div style={{ fontSize: "10px", color: "#94A3B8", marginBottom: "6px" }}>
              具体的な改善行動（3つ）:
            </div>
            <div style={{ fontSize: "10px", color: "#94A3B8", marginBottom: "4px" }}>
              1. ___________________________________________________________________________
            </div>
            <div style={{ fontSize: "10px", color: "#94A3B8", marginBottom: "4px" }}>
              2. ___________________________________________________________________________
            </div>
            <div style={{ fontSize: "10px", color: "#94A3B8", marginBottom: "4px" }}>
              3. ___________________________________________________________________________
            </div>
            <div style={{ fontSize: "10px", color: "#94A3B8" }}>
              目標達成期限: ______年 ______月 ______日
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={S.footer}>
          成約コーチ AI - 営業力セルフチェックシート | 購入者限定資料 | 無断転載・再配布禁止
        </div>
      </div>
    );
  },
);

export default SalesChecklistPdf;
