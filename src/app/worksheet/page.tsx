"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { JsonLd } from "@/components/json-ld";
import { PHASES } from "@/types/worksheet";
import { useWorksheetStorage } from "@/hooks/useWorksheetStorage";
import { getPhaseProgress, getOverallProgress, isAllComplete } from "@/lib/worksheet-progress";
import { isFirstWorksheetVisit, markWorksheetVisited } from "@/lib/worksheet-storage";
import { TabBar } from "@/components/worksheet/TabBar";
import { ProgressBar } from "@/components/worksheet/ProgressBar";
import { NavButtons } from "@/components/worksheet/NavButtons";
import { PhaseCompletionCelebration } from "@/components/worksheet/PhaseCompletionCelebration";
import { CompletionSummary } from "@/components/worksheet/CompletionSummary";
import { WorksheetWelcome } from "@/components/worksheet/WorksheetWelcome";
import { Phase0Approach } from "@/components/worksheet/phases/Phase0Approach";
import { Phase1Hearing } from "@/components/worksheet/phases/Phase1Hearing";
import { Phase2Presentation } from "@/components/worksheet/phases/Phase2Presentation";
import { Phase3Closing } from "@/components/worksheet/phases/Phase3Closing";
import { Phase4Objection } from "@/components/worksheet/phases/Phase4Objection";
import { WorksheetExitPopup } from "@/components/exit-popups/worksheet-exit-popup";
import {
  trackWorksheetStarted,
  trackWorksheetPhaseStarted,
  trackWorksheetAIGenerated,
  trackWorksheetPhaseCompleted,
  trackWorksheetCompleted,
} from "@/lib/tracking";
import { loadCompanyContext, hasCompanyContext } from "@/lib/company-context";
import { loadTargetContext, hasTargetContext } from "@/lib/target-context";

/* ─── Industry presets ──────────────────────────── */

const INDUSTRY_PRESETS = [
  "外壁塗装",
  "生命保険",
  "不動産売買",
  "法人向けSaaS",
  "学習塾",
  "太陽光パネル",
  "リフォーム",
  "人材紹介",
  "自動車販売",
  "美容・ダイエット",
];

/* ─── Main Component ────────────────────────────── */

export default function WorksheetPage() {
  const {
    phaseData,
    setPhaseData,
    previews,
    industry,
    setIndustry,
    updateField,
    updatePreview,
    isHydrated,
  } = useWorksheetStorage();

  const [activePhase, setActivePhase] = useState(0);
  const [generatingPhase, setGeneratingPhase] = useState<number | null>(null);
  const [celebratingPhase, setCelebratingPhase] = useState<number | null>(null);
  const [showWelcome, setShowWelcome] = useState(false);
  const prevPhaseProgress = useRef<number[]>([0, 0, 0, 0, 0]);
  const progressInitialized = useRef(false);

  /* Determine welcome state after hydration */
  useEffect(() => {
    if (!isHydrated) return;
    // Show welcome if first visit AND no saved data
    if (isFirstWorksheetVisit() && !industry.trim()) {
      setShowWelcome(true);
    }
  }, [isHydrated]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleWelcomeStart = useCallback(() => {
    markWorksheetVisited();
    setShowWelcome(false);
    if (industry.trim()) {
      trackWorksheetStarted(industry.trim());
    }
  }, [industry]);

  const isLoading = generatingPhase === activePhase;
  const preview = previews[activePhase];
  const phaseColor = PHASES[activePhase].color;
  const overall = getOverallProgress(phaseData);
  const allComplete = isAllComplete(phaseData);

  /* Phase completion detection */
  useEffect(() => {
    if (!isHydrated) return;
    // Initialize on first hydrated render (don't fire celebration for loaded data)
    if (!progressInitialized.current) {
      PHASES.forEach((_, i) => {
        prevPhaseProgress.current[i] = getPhaseProgress(i, phaseData[i] || {}).percent;
      });
      progressInitialized.current = true;
      return;
    }
    let newlyAllComplete = true;
    PHASES.forEach((phase, i) => {
      const { percent } = getPhaseProgress(i, phaseData[i] || {});
      if (percent === 100 && prevPhaseProgress.current[i] < 100) {
        setCelebratingPhase(i);
        setTimeout(() => setCelebratingPhase(null), 2500);
        trackWorksheetPhaseCompleted(i, phase.name);
      }
      if (percent < 100) newlyAllComplete = false;
      prevPhaseProgress.current[i] = percent;
    });
    if (newlyAllComplete && PHASES.some((_, i) => prevPhaseProgress.current[i] === 100)) {
      trackWorksheetCompleted(industry);
    }
  }, [phaseData, isHydrated, industry]);

  /* AI generation — try real API, fall back to mock */
  const handleGenerate = useCallback(async () => {
    trackWorksheetAIGenerated(activePhase, PHASES[activePhase].name);
    setGeneratingPhase(activePhase);
    try {
      // Build context from company + target info
      const companyCtx = loadCompanyContext();
      const tgt = loadTargetContext();

      let res = await fetch("/api/worksheet/generate-phase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phase: activePhase,
          industry: industry.trim(),
          ...(hasCompanyContext(companyCtx) && {
            productInfo: {
              productName: companyCtx.productName,
              targetAudience: companyCtx.targetAudience,
              keyFeatures: companyCtx.keyFeatures,
              priceRange: companyCtx.priceRange,
              advantages: companyCtx.advantages,
              challenges: companyCtx.challenges,
            },
          }),
          ...(hasTargetContext(tgt) && {
            targetInfo: {
              targetCompanyName: tgt.targetCompanyName,
              targetIndustry: tgt.targetIndustry,
              targetPosition: tgt.targetPosition,
              targetScale: tgt.targetScale,
              targetNeeds: tgt.targetNeeds,
              targetBudget: tgt.targetBudget,
              targetTimeline: tgt.targetTimeline,
            },
          }),
        }),
      });

      // Fall back to mock endpoint if real API fails
      if (!res.ok) {
        res = await fetch("/api/worksheet/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phase: activePhase }),
        });
      }

      if (!res.ok) throw new Error("API error");
      const result = await res.json();

      // Fill empty fields with AI suggestions
      setPhaseData((prev) => {
        const next = [...prev];
        const current = { ...next[activePhase] };
        for (const [key, val] of Object.entries(result)) {
          if (
            key !== "preview" &&
            typeof val === "string" &&
            !current[key]?.trim()
          ) {
            current[key] = val;
          }
        }
        next[activePhase] = current;
        return next;
      });

      if (result.preview) {
        updatePreview(activePhase, result.preview);
      }
    } catch {
      // Silently handle — preview stays empty
    } finally {
      setGeneratingPhase(null);
    }
  }, [activePhase, industry, phaseData, setPhaseData, updatePreview]);

  /* Field change */
  const handleFieldChange = useCallback(
    (key: string, value: string) => {
      updateField(activePhase, key, value);
    },
    [activePhase, updateField]
  );

  /* Navigation */
  const navigate = (dir: number) => {
    const next = activePhase + dir;
    if (next >= 0 && next < PHASES.length) {
      setActivePhase(next);
      trackWorksheetPhaseStarted(next, PHASES[next].name);
    }
  };

  /* Phase props */
  const phaseProps = {
    data: phaseData[activePhase] || {},
    onChange: handleFieldChange,
    preview: preview || "",
    onGenerate: handleGenerate,
    isLoading,
    color: phaseColor,
  };

  /* ─── JSON-LD ─────────────────────────────────── */

  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://seiyaku-coach.vercel.app";

  const worksheetJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "HowTo",
        "@id": `${siteUrl}/worksheet#howto`,
        name: "営業準備ワークシートの使い方",
        description:
          "5フェーズの穴埋めシートで商談前の準備を体系的に整理し、AIがトークスクリプトを自動生成します。",
        step: [
          {
            "@type": "HowToStep",
            position: 1,
            name: "商材・業種を入力",
            text: "営業する商材や業種を入力します。プリセットから選択することもできます。",
          },
          {
            "@type": "HowToStep",
            position: 2,
            name: "アプローチフェーズを埋める",
            text: "第一印象・信頼構築・ゴール共有など、アプローチに必要な情報を穴埋め形式で入力します。",
          },
          {
            "@type": "HowToStep",
            position: 3,
            name: "ヒアリングフェーズを埋める",
            text: "お客様のニーズ・課題・予算感など、ヒアリングで確認すべき項目を整理します。",
          },
          {
            "@type": "HowToStep",
            position: 4,
            name: "プレゼン・クロージング・反論処理を埋める",
            text: "ベネフィット提示・クロージングトーク・想定される反論と切り返しを準備します。",
          },
          {
            "@type": "HowToStep",
            position: 5,
            name: "AIでトークスクリプトを生成",
            text: "入力内容をもとにAIがあなた専用のトークスクリプトを自動生成します。",
          },
        ],
        tool: {
          "@type": "HowToTool",
          name: "成約コーチ AI ワークシート",
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${siteUrl}/worksheet#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "ホーム",
            item: siteUrl,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "営業準備ワークシート",
            item: `${siteUrl}/worksheet`,
          },
        ],
      },
    ],
  };

  /* ─── Render ──────────────────────────────────── */

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <JsonLd data={worksheetJsonLd} />
      <Header />

      {/* Hero */}
      <section className="px-6 pt-32 pb-6">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="mb-2 text-2xl font-bold text-[#1E293B] sm:text-3xl">
            営業準備ワークシート
          </h1>
          <p className="text-sm leading-relaxed text-[#6B7280]">
            各フェーズの穴埋めを完成させると、AIがあなた専用のトークスクリプトを自動生成します
          </p>
        </div>

        {/* Overall Progress */}
        {isHydrated && overall.filled > 0 && (
          <div className="mx-auto mt-4 max-w-3xl animate-fade-in-up">
            <div className="flex items-center gap-3">
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#E8E4DD]">
                <div
                  className="h-full rounded-full bg-accent transition-all duration-700 ease-out"
                  style={{ width: `${overall.percent}%` }}
                />
              </div>
              <span className="whitespace-nowrap text-sm font-bold text-accent">
                {overall.filled}/{overall.total} 項目
              </span>
            </div>
          </div>
        )}
      </section>

      {/* Welcome (first visit) OR Industry Input + Worksheet */}
      {showWelcome ? (
        <WorksheetWelcome
          industry={industry}
          setIndustry={setIndustry}
          onStart={handleWelcomeStart}
        />
      ) : (
      <>
      {/* Industry Input */}
      <section className="px-6 pb-4">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-[14px] border border-[#E8E4DD] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <label className="mb-2 block text-sm font-bold text-[#1E293B]">
              商材・業種
            </label>
            <input
              type="text"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              placeholder="例: 外壁塗装、生命保険、SaaSツール..."
              className="w-full rounded-lg border border-[#E5E0D8] bg-[#FAFAF8] px-4 py-3 text-sm outline-none transition-all focus:border-[#378ADD] focus:shadow-[0_0_0_3px_rgba(55,138,221,0.1)] placeholder:text-[#B4B0A8]"
            />
            <div className="mt-3 flex flex-wrap gap-2">
              {INDUSTRY_PRESETS.map((p) => (
                <button
                  key={p}
                  onClick={() => setIndustry(p)}
                  className={`rounded-full border px-3 py-1 text-xs font-medium transition-all ${
                    industry === p
                      ? "border-[#378ADD] bg-[#EFF6FF] text-[#1D4ED8]"
                      : "border-[#E5E0D8] text-[#9CA3AF] hover:border-[#378ADD] hover:text-[#1E293B]"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Worksheet */}
      <section className="px-6 pb-16">
        <div className="mx-auto max-w-3xl">
          {/* Sticky Tab Bar + Progress */}
          <div className="sticky top-0 z-10 -mx-6 bg-[#FAFAF8]/95 px-6 pb-2 pt-3 backdrop-blur-sm">
            <TabBar
              phases={PHASES}
              activePhase={activePhase}
              onPhaseChange={setActivePhase}
              phaseData={phaseData}
            />
            <ProgressBar phases={PHASES} activePhase={activePhase} phaseData={phaseData} />
          </div>

          {/* Phase Content */}
          <div className="relative">
            {activePhase === 0 && <Phase0Approach {...phaseProps} />}
            {activePhase === 1 && <Phase1Hearing {...phaseProps} />}
            {activePhase === 2 && <Phase2Presentation {...phaseProps} />}
            {activePhase === 3 && <Phase3Closing {...phaseProps} />}
            {activePhase === 4 && <Phase4Objection {...phaseProps} />}

            {/* Phase Completion Celebration */}
            {celebratingPhase === activePhase && celebratingPhase !== null && (
              <PhaseCompletionCelebration
                phaseIndex={activePhase}
                phaseName={PHASES[activePhase].name}
                phaseColor={PHASES[activePhase].color}
              />
            )}
          </div>

          {/* Navigation */}
          <NavButtons
            phases={PHASES}
            activePhase={activePhase}
            onNavigate={navigate}
          />

          {/* All Complete Summary */}
          {allComplete && <CompletionSummary phaseData={phaseData} />}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-[#E8E4DD] px-6 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-3 text-xl font-bold text-[#1E293B]">
            準備ができたら、ロープレで実践しよう
          </h2>
          <p className="mb-6 text-sm text-[#6B7280]">
            ワークシートで整理した知識をAIロープレで実践練習
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/roleplay"
              className="inline-flex h-12 items-center justify-center rounded-xl bg-accent px-8 font-bold text-white transition hover:bg-accent-hover"
            >
              ロープレを始める
            </Link>
            <Link
              href="/features"
              className="inline-flex h-12 items-center justify-center rounded-xl border border-[#E5E0D8] px-8 text-sm font-medium text-[#6B7280] transition hover:border-[#378ADD] hover:text-[#1E293B]"
            >
              他の機能を見る
            </Link>
          </div>
        </div>
      </section>
      </>
      )}

      <Footer />
      {isHydrated && overall.filled > 0 && overall.percent < 100 && (
        <WorksheetExitPopup
          progressPercent={overall.percent}
          filledCount={overall.filled}
          totalCount={overall.total}
        />
      )}
    </div>
  );
}
