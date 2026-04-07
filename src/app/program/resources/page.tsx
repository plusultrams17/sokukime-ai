"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { PdfExportButton } from "@/components/pdf/PdfExportButton";
import dynamic from "next/dynamic";

const ObjectionCheatsheetPdf = dynamic(
  () => import("@/components/pdf/ObjectionCheatsheetPdf"),
  { ssr: false },
);
const ScriptTemplatePdf = dynamic(
  () => import("@/components/pdf/ScriptTemplatePdf"),
  { ssr: false },
);
const SalesChecklistPdf = dynamic(
  () => import("@/components/pdf/SalesChecklistPdf"),
  { ssr: false },
);

export default function ProgramResourcesPage() {
  const [status, setStatus] = useState<"loading" | "unauthorized" | "ready">("loading");

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
          window.location.href = "/program";
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
      <div className="flex min-h-screen items-center justify-center" style={{ backgroundColor: "#f7f8ea" }}>
        <div className="text-sm text-muted animate-pulse">読み込み中...</div>
      </div>
    );
  }

  if (status === "unauthorized") {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ backgroundColor: "#f7f8ea" }}>
        <div className="text-center">
          <p className="text-sm text-muted mb-4">アクセスできませんでした</p>
          <Link href="/program" className="text-sm hover:underline" style={{ color: "#f97316" }}>
            プログラムページへ戻る
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f7f8ea" }}>
      <Header />

      {/* Hero */}
      <section className="px-6 pt-12 pb-10 sm:pt-16 sm:pb-14">
        <div className="mx-auto max-w-4xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-medium" style={{ borderColor: "rgba(249,115,22,0.3)", backgroundColor: "rgba(249,115,22,0.1)", color: "#f97316" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            プログラム購入者限定
          </div>
          <h1 className="mb-3 text-2xl font-bold text-foreground sm:text-3xl">
            リソースハブ
          </h1>
          <p className="text-sm text-muted leading-relaxed sm:text-base">
            プログラムに含まれる全ての教材・ツール・特典にここからアクセスできます。
          </p>
        </div>
      </section>

      {/* Section 1: Learning Roadmap */}
      <section className="px-6 pb-12">
        <div className="mx-auto max-w-4xl">
          <SectionHeading>学習ロードマップ</SectionHeading>
          <div className="grid gap-4 sm:grid-cols-3">
            <RoadmapStep
              step={1}
              title="型を学ぶ"
              description="22レッスンで成約5ステップの型を体系的に習得。1レッスン約5分。"
              detail="22レッスン"
            />
            <RoadmapStep
              step={2}
              title="実践する"
              description="AIロープレで実際の商談を想定した練習を繰り返す。"
              detail="AIロープレ"
            />
            <RoadmapStep
              step={3}
              title="改善する"
              description="5カテゴリのスコア分析で弱点を特定し、集中的に改善する。"
              detail="スコア分析"
            />
          </div>
        </div>
      </section>

      {/* Section 2: Lesson Materials */}
      <section className="px-6 pb-12">
        <div className="mx-auto max-w-4xl">
          <SectionHeading>レッスン教���</SectionHeading>
          <div className="grid gap-4 sm:grid-cols-2">
            <ResourceCard
              href="/learn"
              title="22レッスンを始める"
              description="成約5ステップメソッドを初級・中級・上級の22レッスンで段階的に学習。各レッスンにクイズ付き。"
              icon={
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" />
                  <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
                </svg>
              }
            />
            <ResourceCard
              href="/learn/exam"
              title="認定試験に挑戦"
              description="全22レッスンを修了後、認定試験で実力を証明。合格者にはデジタル認定証を発行。"
              icon={
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 9H4.5a2.5 2.5 0 010-5H6" />
                  <path d="M18 9h1.5a2.5 2.5 0 000-5H18" />
                  <path d="M4 22h16" />
                  <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20 7 22" />
                  <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20 17 22" />
                  <path d="M18 2H6v7a6 6 0 0012 0V2z" />
                </svg>
              }
            />
          </div>
        </div>
      </section>

      {/* Section 3: Downloadable PDFs */}
      <section className="px-6 pb-12">
        <div className="mx-auto max-w-4xl">
          <SectionHeading>ダウンロード資料</SectionHeading>
          <div className="grid gap-4 sm:grid-cols-3">
            <PdfCard
              title="反論切り返し30パターン"
              description="6カテゴリ x 5パターン。営業でよくある断り文句への切り返しトークをま���めたチートシート。"
              filename="反論切り返し30パタ��ン_チートシート.pdf"
              renderContent={(ref) => <ObjectionCheatsheetPdf ref={ref} />}
            />
            <PdfCard
              title="5ステップ トークスクリプト"
              description="成約5ステップの各段階で使��るテンプレートトーク。業種別ヒント付き。"
              filename="5ステップ_トークスクリプト_テンプレート.pdf"
              renderContent={(ref) => <ScriptTemplatePdf ref={ref} />}
            />
            <PdfCard
              title="営業力セルフチェック"
              description="5カテゴリ25項目の自己評価で現在の営業力を可視化。改善アクションプラン記入欄付き。"
              filename="営業力セルフチェックシート.pdf"
              renderContent={(ref) => <SalesChecklistPdf ref={ref} />}
            />
          </div>
        </div>
      </section>

      {/* Section 4: AI Coach Pro */}
      <section className="px-6 pb-12">
        <div className="mx-auto max-w-4xl">
          <SectionHeading>AIコーチ Pro</SectionHeading>
          <div className="rounded-2xl border border-card-border bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex-1">
                <h3 className="mb-2 text-lg font-bold text-foreground">AIロープレを始める</h3>
                <p className="mb-4 text-sm text-muted leading-relaxed">
                  あなたの商材・業種に合わせた��アルな営業シミュレーション。
                  Pro特典として無���限のロープレ、全5カテゴリの詳細スコア、AI改善アドバイスが利用可能です。
                </p>
                <div className="flex flex-wrap gap-3">
                  <ProBadge>無制限ロープレ</ProBadge>
                  <ProBadge>詳細スコア</ProBadge>
                  <ProBadge>AI改善アドバイス</ProBadge>
                </div>
              </div>
              <Link
                href="/roleplay"
                className="inline-flex h-12 shrink-0 items-center justify-center rounded-xl px-8 text-base font-bold text-white transition hover:opacity-90"
                style={{ backgroundColor: "#f97316" }}
              >
                ロープレを始める
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: Free Tools */}
      <section className="px-6 pb-16 sm:pb-24">
        <div className="mx-auto max-w-4xl">
          <SectionHeading>無料ツール</SectionHeading>
          <div className="grid gap-4 sm:grid-cols-2">
            <ToolCard
              href="/tools/objection-handbook"
              title="反論切り返しトーク集"
              description="30パターンの反論切り返しトークをブラウザで閲覧"
            />
            <ToolCard
              href="/tools/script-generator"
              title="トークスクリプト生成"
              description="商材情報を入���して業種別トークスクリプトを自動生成"
            />
            <ToolCard
              href="/tools/sales-quiz"
              title="営業力診断テスト"
              description="10問の診断で営業力を5段階評価"
            />
            <ToolCard
              href="/tools/closing-calculator"
              title="クロージング率計算"
              description="商談��ータから成約率を算出し改善ポイントを提示"
            />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

/* ── Sub-components ── */

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-5 text-lg font-bold text-foreground sm:text-xl">
      {children}
    </h2>
  );
}

interface RoadmapStepProps {
  step: number;
  title: string;
  description: string;
  detail: string;
}

function RoadmapStep({ step, title, description, detail }: RoadmapStepProps) {
  return (
    <div className="relative rounded-2xl border border-card-border bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center gap-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white" style={{ backgroundColor: "#f97316" }}>
          {step}
        </span>
        <h3 className="text-base font-bold text-foreground">{title}</h3>
      </div>
      <p className="mb-3 text-xs text-muted leading-relaxed">{description}</p>
      <span className="inline-block rounded-full px-3 py-1 text-xs font-medium" style={{ backgroundColor: "rgba(249,115,22,0.1)", color: "#f97316" }}>
        {detail}
      </span>
      {step < 3 && (
        <div className="absolute -right-2 top-1/2 hidden -translate-y-1/2 text-card-border sm:block" aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </div>
      )}
    </div>
  );
}

interface ResourceCardProps {
  href: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

function ResourceCard({ href, title, description, icon }: ResourceCardProps) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-card-border bg-white p-6 shadow-sm transition hover:border-orange-300"
    >
      <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg" style={{ backgroundColor: "rgba(249,115,22,0.1)", color: "#f97316" }}>
        {icon}
      </div>
      <h3 className="mb-2 text-base font-bold text-foreground transition-colors" style={{ "--tw-group-hover-color": "#f97316" } as React.CSSProperties}>
        {title}
      </h3>
      <p className="text-xs text-muted leading-relaxed">{description}</p>
    </Link>
  );
}

interface PdfCardProps {
  title: string;
  description: string;
  filename: string;
  renderContent: (ref: React.RefObject<HTMLDivElement | null>) => React.ReactNode;
}

function PdfCard({ title, description, filename, renderContent }: PdfCardProps) {
  return (
    <div className="flex flex-col rounded-2xl border border-card-border bg-white p-5 shadow-sm">
      <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg" style={{ backgroundColor: "rgba(249,115,22,0.1)", color: "#f97316" }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      </div>
      <h3 className="mb-2 text-sm font-bold text-foreground">{title}</h3>
      <p className="mb-4 flex-1 text-xs text-muted leading-relaxed">{description}</p>
      <PdfExportButton
        filename={filename}
        renderContent={renderContent}
        className="inline-flex items-center justify-center gap-2 rounded-lg border border-orange-200 bg-orange-50 px-4 py-2.5 text-sm font-medium text-orange-600 transition hover:bg-orange-100"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        PDFダウンロード
      </PdfExportButton>
    </div>
  );
}

function ProBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium" style={{ borderColor: "rgba(249,115,22,0.2)", backgroundColor: "rgba(249,115,22,0.1)", color: "#f97316" }}>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
      {children}
    </span>
  );
}

interface ToolCardProps {
  href: string;
  title: string;
  description: string;
}

function ToolCard({ href, title, description }: ToolCardProps) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-4 rounded-xl border border-card-border bg-white p-4 shadow-sm transition hover:border-orange-300"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-background text-muted transition-colors" style={{ "--tw-group-hover-bg": "rgba(249,115,22,0.1)" } as React.CSSProperties}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      </div>
      <div className="flex-1">
        <h3 className="text-sm font-bold text-foreground">{title}</h3>
        <p className="text-xs text-muted">{description}</p>
      </div>
      <svg className="h-4 w-4 shrink-0 text-card-border" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 18 15 12 9 6" />
      </svg>
    </Link>
  );
}
