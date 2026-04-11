"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import type { Insight, SalesTalkPattern, InsightUsage } from "@/types/insights";
import { DailyBriefingHeader } from "@/components/insights/DailyBriefingHeader";
import { FeaturedInsightCard } from "@/components/insights/FeaturedInsightCard";
import { InsightCard } from "@/components/insights/InsightCard";
import { SalesTalkPanel } from "@/components/insights/SalesTalkPanel";
import { InsightPaywall } from "@/components/insights/InsightPaywall";
import { InsightSkeleton } from "@/components/insights/InsightSkeleton";
import { IndustrySetupModal } from "@/components/insights/IndustrySetupModal";
import { Header } from "@/components/header";

const DEFAULT_INDUSTRIES = [
  { slug: "all", label: "すべて" },
  { slug: "real-estate", label: "不動産" },
  { slug: "insurance", label: "保険" },
  { slug: "saas", label: "SaaS" },
  { slug: "hr", label: "人材" },
  { slug: "education", label: "教育" },
  { slug: "retail", label: "物販" },
];

export default function InsightsPage() {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [usage, setUsage] = useState<InsightUsage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("all");
  const [viewedIds, setViewedIds] = useState<Set<string>>(new Set());
  const [showSetupModal, setShowSetupModal] = useState(false);

  // SalesTalkPanel state
  const [panelOpen, setPanelOpen] = useState(false);
  const [selectedInsight, setSelectedInsight] = useState<Insight | null>(null);
  const [patterns, setPatterns] = useState<SalesTalkPattern[] | null>(null);
  const [patternsLoading, setPatternsLoading] = useState(false);
  const [talkIndustry, setTalkIndustry] = useState("");
  const [talkProduct, setTalkProduct] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const [insightsRes, usageRes] = await Promise.all([
          fetch(`/api/insights${selectedIndustry !== "all" ? `?industry=${selectedIndustry}` : ""}`),
          fetch("/api/insights/usage"),
        ]);

        if (insightsRes.status === 401 || usageRes.status === 401) {
          window.location.href = "/login?redirect=/insights";
          return;
        }

        if (!insightsRes.ok) throw new Error("Failed to load insights");

        const insightsData = await insightsRes.json();
        const usageData = await usageRes.json();

        setInsights(insightsData.insights || []);
        setUsage(usageData);

        // Show setup modal if user has no industry preferences
        if (usageData.needsSetup) {
          setShowSetupModal(true);
        }
      } catch {
        setError("データの読み込みに失敗しました");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [selectedIndustry]);

  const handleConvert = useCallback((insight: Insight) => {
    setSelectedInsight(insight);
    setPatterns(null);
    setPanelOpen(true);
  }, []);

  const handleSave = useCallback(async (insight: Insight) => {
    try {
      await fetch("/api/insights/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ insightId: insight.id }),
      });
    } catch {
      // Silently fail
    }
  }, []);

  const handleGenerate = useCallback(
    async (industry: string, product: string) => {
      if (!selectedInsight) return;
      setPatternsLoading(true);
      try {
        const res = await fetch("/api/insights/convert", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            insightId: selectedInsight.id,
            industry,
            product,
          }),
        });
        if (!res.ok) throw new Error("Failed to generate");
        const data = await res.json();
        setPatterns(data.patterns || []);
      } catch {
        // Could show error toast
      } finally {
        setPatternsLoading(false);
      }
    },
    [selectedInsight]
  );

  const handleIndustrySave = useCallback(
    async (industries: string[]) => {
      try {
        await fetch("/api/insights/industry", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ industries }),
        });
        setShowSetupModal(false);
        if (industries.length > 0) {
          setSelectedIndustry(industries[0]);
        }
      } catch {
        // Silently fail
      }
    },
    []
  );

  // Track views
  const markViewed = useCallback((id: string) => {
    setViewedIds((prev) => new Set(prev).add(id));
  }, []);

  const isPro =
    usage?.plan === "starter" || usage?.plan === "pro" || usage?.plan === "master";
  const freeLimit = usage?.limit || 3;

  // Split insights
  const featured = insights[0] || null;
  const trendInsights = insights.filter((i) => i.source_type === "news").slice(1, 5);
  const researchInsights = insights.filter((i) => i.source_type === "research");

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="mb-8">
          <div className="mb-2 h-4 w-32 animate-pulse rounded bg-card-border" />
          <div className="h-8 w-64 animate-pulse rounded bg-card-border" />
        </div>
        <InsightSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <p className="text-sm text-muted mb-4">{error}</p>
          <Link href="/dashboard" className="text-sm text-accent hover:underline">
            ダッシュボードに戻る
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />

      <div
        className={`mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-10 ${
          panelOpen ? "lg:mr-[400px] lg:max-w-3xl" : ""
        }`}
      >
        {/* ZONE 1: Daily Briefing Header */}
        <DailyBriefingHeader
          date={new Date().toISOString()}
          industries={DEFAULT_INDUSTRIES}
          selectedIndustry={selectedIndustry}
          onSelectIndustry={setSelectedIndustry}
          viewedCount={viewedIds.size}
          totalCount={insights.length}
        />

        {/* ZONE 2: Content */}
        {insights.length === 0 ? (
          <div className="rounded-xl border border-card-border bg-card p-8 text-center">
            <div className="mb-3"><span className="inline-block h-5 w-5 rounded-full bg-accent" /></div>
            <h2 className="mb-2 text-lg font-bold">
              まだインサイトがありません
            </h2>
            <p className="text-sm text-muted">
              間もなく最新の業界情報が配信されます
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Featured article */}
            {featured && (
              <div onClick={() => markViewed(featured.id)}>
                <FeaturedInsightCard
                  insight={featured}
                  onConvert={handleConvert}
                  onSave={handleSave}
                  isPro={isPro}
                />
              </div>
            )}

            {/* Trend articles grid */}
            {trendInsights.length > 0 && (
              <div>
                <h2 className="mb-4 text-sm font-bold text-muted">
                  トレンド記事
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {trendInsights.map((insight, i) => {
                    const isLocked = !isPro && i + 1 >= freeLimit;
                    return (
                      <div
                        key={insight.id}
                        onClick={() => !isLocked && markViewed(insight.id)}
                      >
                        <InsightCard
                          insight={insight}
                          onConvert={handleConvert}
                          onSave={handleSave}
                          isPro={isPro}
                          isLocked={isLocked}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Paywall for free users */}
            {!isPro && trendInsights.length >= freeLimit && (
              <InsightPaywall onUpgrade={() => (window.location.href = "/pricing")} />
            )}

            {/* Research / psychology articles */}
            {researchInsights.length > 0 && (
              <div>
                <h2 className="mb-4 text-sm font-bold text-muted">
                  営業心理学・研究
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {researchInsights.map((insight, i) => {
                    const isLocked = !isPro && i >= 1;
                    return (
                      <div
                        key={insight.id}
                        onClick={() => !isLocked && markViewed(insight.id)}
                      >
                        <InsightCard
                          insight={insight}
                          onConvert={handleConvert}
                          onSave={handleSave}
                          isPro={isPro}
                          isLocked={isLocked}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ZONE 3: Session end message */}
        {insights.length > 0 && viewedIds.size >= insights.length && (
          <div className="mt-10 rounded-xl border border-accent/20 bg-accent/5 p-6 text-center">
            <p className="mb-2 text-sm font-bold text-accent">
              今日のインサイトを読んだあなたは、同業者の上位5%の情報力を持っています
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/roleplay"
                className="rounded-lg bg-accent px-5 py-2.5 text-sm font-bold text-white transition hover:bg-accent-hover"
              >
                インサイトを使ってロープレする
              </Link>
              <Link
                href="/dashboard"
                className="rounded-lg border border-card-border px-4 py-2.5 text-sm text-muted transition hover:border-accent/30 hover:text-foreground"
              >
                ダッシュボードに戻る
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Sales Talk Panel */}
      <SalesTalkPanel
        isOpen={panelOpen}
        onClose={() => setPanelOpen(false)}
        insight={selectedInsight}
        patterns={patterns}
        isLoading={patternsLoading}
        onGenerate={handleGenerate}
        industry={talkIndustry}
        product={talkProduct}
        onIndustryChange={setTalkIndustry}
        onProductChange={setTalkProduct}
      />

      {/* Industry Setup Modal */}
      <IndustrySetupModal
        isOpen={showSetupModal}
        onClose={() => setShowSetupModal(false)}
        onSave={handleIndustrySave}
      />
    </>
  );
}
