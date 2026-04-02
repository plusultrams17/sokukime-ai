"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ToolUpsellCTA } from "@/components/tool-upsell-cta";
import { ToolEmailGate } from "@/components/tool-email-gate";

export function ClosingCalculatorClient() {
  const [appointments, setAppointments] = useState("");
  const [proposals, setProposals] = useState("");
  const [deals, setDeals] = useState("");
  const [dealSize, setDealSize] = useState("");
  const [emailUnlocked, setEmailUnlocked] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem("tool_email_captured") === "true") {
      setEmailUnlocked(true);
    }
  }, []);

  const appt = parseInt(appointments) || 0;
  const prop = parseInt(proposals) || 0;
  const deal = parseInt(deals) || 0;
  const size = parseInt(dealSize) || 0;

  const apptToProposal = appt > 0 ? (prop / appt) * 100 : 0;
  const proposalToDeal = prop > 0 ? (deal / prop) * 100 : 0;
  const overallRate = appt > 0 ? (deal / appt) * 100 : 0;
  const monthlyRevenue = deal * size;
  const hasData = appt > 0 && prop > 0 && deal > 0;

  const getColor = (rate: number) => {
    if (rate >= 30) return "#10B981";
    if (rate >= 15) return "#F59E0B";
    return "#EF4444";
  };

  const weakPoint = apptToProposal < proposalToDeal
    ? { stage: "アポ→提案", advice: "アプローチとヒアリングの改善が必要です。初回訪問での信頼構築とニーズ引き出しを練習しましょう。" }
    : { stage: "提案→成約", advice: "クロージングと反論処理の強化が必要です。お客様の懸念を解消するスキルを磨きましょう。" };

  return (
    <div className="space-y-6">
      {/* Input */}
      <div className="rounded-2xl bg-white border border-card-border shadow-sm p-6 sm:p-8">
        <h3 className="text-base font-bold text-foreground mb-6">営業数値を入力</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">月間アポイント数 <span className="text-red-500">*</span></label>
            <input type="number" min="0" value={appointments} onChange={(e) => setAppointments(e.target.value)} placeholder="例: 20" className="w-full rounded-xl border border-card-border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-accent focus:ring-1 focus:ring-accent" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">月間提案数 <span className="text-red-500">*</span></label>
            <input type="number" min="0" value={proposals} onChange={(e) => setProposals(e.target.value)} placeholder="例: 12" className="w-full rounded-xl border border-card-border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-accent focus:ring-1 focus:ring-accent" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">月間成約数 <span className="text-red-500">*</span></label>
            <input type="number" min="0" value={deals} onChange={(e) => setDeals(e.target.value)} placeholder="例: 4" className="w-full rounded-xl border border-card-border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-accent focus:ring-1 focus:ring-accent" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">平均単価（円）<span className="text-xs text-muted ml-1">任意</span></label>
            <input type="number" min="0" value={dealSize} onChange={(e) => setDealSize(e.target.value)} placeholder="例: 500000" className="w-full rounded-xl border border-card-border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-accent focus:ring-1 focus:ring-accent" />
          </div>
        </div>
      </div>

      {/* Funnel */}
      {hasData && (
        <div className="rounded-2xl bg-white border border-card-border shadow-sm p-6 sm:p-8 animate-fade-in-up">
          <h3 className="text-base font-bold text-foreground mb-6">営業ファネル分析</h3>

          <div className="space-y-4">
            {/* Appointments */}
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-foreground">アポイント</span>
                <span className="font-bold text-foreground">{appt}件</span>
              </div>
              <div className="h-8 rounded-lg bg-accent" />
            </div>

            <div className="flex items-center gap-2 text-xs pl-4">
              <svg className="h-4 w-4 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7" /></svg>
              <span className="font-bold" style={{ color: getColor(apptToProposal) }}>{apptToProposal.toFixed(1)}%</span>
              <span className="text-muted">が提案に移行</span>
            </div>

            {/* Proposals */}
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-foreground">提案</span>
                <span className="font-bold text-foreground">{prop}件</span>
              </div>
              <div className="h-8 rounded-lg" style={{ width: `${Math.max((prop / appt) * 100, 10)}%`, backgroundColor: getColor(apptToProposal) }} />
            </div>

            <div className="flex items-center gap-2 text-xs pl-4">
              <svg className="h-4 w-4 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7" /></svg>
              <span className="font-bold" style={{ color: getColor(proposalToDeal) }}>{proposalToDeal.toFixed(1)}%</span>
              <span className="text-muted">が成約</span>
            </div>

            {/* Deals */}
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-foreground">成約</span>
                <span className="font-bold text-foreground">{deal}件</span>
              </div>
              <div className="h-8 rounded-lg" style={{ width: `${Math.max((deal / appt) * 100, 5)}%`, backgroundColor: getColor(proposalToDeal) }} />
            </div>
          </div>

          {/* Summary */}
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
            <div className="rounded-xl bg-background p-4 text-center">
              <p className="text-xs text-muted mb-1">総合成約率</p>
              <p className="text-2xl font-bold" style={{ color: getColor(overallRate) }}>{overallRate.toFixed(1)}%</p>
            </div>
            <div className="rounded-xl bg-background p-4 text-center">
              <p className="text-xs text-muted mb-1">アポ→提案率</p>
              <p className="text-2xl font-bold" style={{ color: getColor(apptToProposal) }}>{apptToProposal.toFixed(1)}%</p>
            </div>
            <div className="rounded-xl bg-background p-4 text-center col-span-2 sm:col-span-1">
              <p className="text-xs text-muted mb-1">提案→成約率</p>
              <p className="text-2xl font-bold" style={{ color: getColor(proposalToDeal) }}>{proposalToDeal.toFixed(1)}%</p>
            </div>
          </div>

          {size > 0 && (
            <div className="mt-4 rounded-xl bg-accent/10 p-4 text-center">
              <p className="text-xs text-muted mb-1">月間売上予測</p>
              <p className="text-2xl font-bold text-accent">¥{monthlyRevenue.toLocaleString()}</p>
            </div>
          )}

          {/* Weak Point — gated behind email */}
          {!emailUnlocked ? (
            <div className="mt-6">
              <ToolEmailGate toolName="closing-calculator" onUnlock={() => setEmailUnlocked(true)} />
            </div>
          ) : (
            <>
              <div className="mt-6 rounded-xl border-2 border-orange-200 bg-orange-50 p-4">
                <p className="text-sm font-bold text-foreground mb-1">改善ポイント: {weakPoint.stage}が低め</p>
                <p className="text-sm text-muted mb-3">{weakPoint.advice}</p>
                <Link href="/roleplay" className="inline-flex h-9 items-center justify-center rounded-lg bg-accent px-5 text-sm font-bold text-white transition hover:bg-accent-hover">
                  AIロープレで練習する
                </Link>
              </div>

              {/* Pro Upsell */}
              <div className="mt-6">
                <ToolUpsellCTA />
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
