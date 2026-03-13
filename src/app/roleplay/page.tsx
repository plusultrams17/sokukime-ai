"use client";

import { Suspense, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ChatUI } from "./chat-ui";
import { ScoreCard } from "./score-card";
import { UserMenu } from "@/components/user-menu";
import { UpgradeModal } from "@/components/upgrade-modal";
import { WelcomeModal } from "@/components/welcome-modal";
import type { UsageStatus } from "@/lib/usage";

export type RoleplayPhase = "setup" | "chat" | "score";

export interface ScoreResult {
  overall: number;
  categories: {
    name: string;
    score: number;
    feedback: string;
  }[];
  summary: string;
  strengths: string[];
  improvements: string[];
}

function UpgradeToast() {
  const searchParams = useSearchParams();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (searchParams.get("upgraded") === "true") {
      setShow(true);
      const timer = setTimeout(() => setShow(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  if (!show) return null;

  return (
    <div className="fixed top-4 left-1/2 z-50 -translate-x-1/2 animate-fade-in-up">
      <div className="rounded-xl border border-green-500/30 bg-green-500/10 px-6 py-3 text-sm font-medium text-green-400 shadow-xl">
        🎉 Proプランにアップグレードしました！無制限でロープレを楽しめます
      </div>
    </div>
  );
}

function WelcomeCheck({ onWelcome }: { onWelcome: () => void }) {
  const searchParams = useSearchParams();
  useEffect(() => {
    if (searchParams.get("welcome") === "true") {
      onWelcome();
    }
  }, [searchParams, onWelcome]);
  return null;
}

const customerTypes = [
  { value: "individual", label: "個人のお客さん" },
  { value: "owner", label: "会社オーナー・社長" },
  { value: "manager", label: "部長・課長クラス" },
  { value: "staff", label: "担当者・一般社員" },
];

const customerScenes = [
  { value: "phone", label: "📞 電話営業", desc: "テレアポ・電話商談" },
  { value: "visit", label: "🏠 訪問営業", desc: "お客さん宅・会社に訪問" },
  { value: "inbound", label: "📩 問い合わせ対応", desc: "お客さんからの問い合わせ" },
];

const difficulties = [
  { value: "easy", label: "🟢 素直なお客さん", desc: "比較的前向き。練習に最適" },
  { value: "normal", label: "🟡 慎重なお客さん", desc: "「考えます」が口癖。切り返し練習に" },
  { value: "hard", label: "🔴 手強いお客さん", desc: "反論多め。上級者向けの本格ロープレ" },
];

export default function RoleplayPage() {
  const [phase, setPhase] = useState<RoleplayPhase>("setup");
  const [product, setProduct] = useState("");
  const [customerType, setCustomerType] = useState("individual");
  const [customerIndustry, setCustomerIndustry] = useState("");
  const [scene, setScene] = useState("visit");
  const [difficulty, setDifficulty] = useState("normal");
  const [score, setScore] = useState<ScoreResult | null>(null);

  const [usage, setUsage] = useState<UsageStatus | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [isCheckingUsage, setIsCheckingUsage] = useState(false);

  const productSuggestions = ["外壁塗装", "法人向けクラウドサービス", "学習塾の入会", "生命保険", "太陽光パネル"];

  const handleWelcome = useCallback(() => {
    setShowWelcome(true);
  }, []);

  const industry = customerIndustry || customerType;
  const canStart = product.trim();

  // Fetch usage on mount
  useEffect(() => {
    fetch("/api/usage")
      .then((r) => r.json())
      .then((data) => {
        if (!data.error) setUsage(data);
      })
      .catch(() => {});
  }, []);

  async function handleStartRoleplay() {
    if (!canStart) return;
    setIsCheckingUsage(true);

    try {
      const res = await fetch("/api/usage/record", { method: "POST" });
      const data = await res.json();

      if (res.status === 403) {
        setUsage(data);
        setShowUpgradeModal(true);
        setIsCheckingUsage(false);
        return;
      }

      setUsage(data);
      setPhase("chat");
    } catch {
      // Allow to proceed on network error
      setPhase("chat");
    }
    setIsCheckingUsage(false);
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Upgrade success toast & welcome check */}
      <Suspense>
        <UpgradeToast />
        <WelcomeCheck onWelcome={handleWelcome} />
      </Suspense>

      {/* Welcome Modal */}
      <WelcomeModal open={showWelcome} onComplete={() => setShowWelcome(false)} />

      {/* Header */}
      <header className="border-b border-card-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl">🔥</span>
            <span className="font-bold">即キメAI</span>
          </Link>
          <div className="flex items-center gap-3">
            {/* Usage indicator */}
            {usage && usage.plan === "free" && phase === "setup" && (
              <div className="flex items-center gap-2 rounded-full border border-card-border px-3 py-1 text-xs">
                <span className="text-muted">残り:</span>
                <span
                  className={
                    usage.canStart
                      ? "font-bold text-accent"
                      : "font-bold text-red-400"
                  }
                >
                  {Math.max(0, usage.limit - usage.used)}/{usage.limit}回
                </span>
              </div>
            )}
            {usage && usage.plan === "pro" && (
              <div className="flex items-center gap-2">
                {phase === "setup" && usage.totalSessions !== undefined && (
                  <div className="text-[11px] text-muted">
                    累計 {usage.totalSessions || 0} 回ロープレ実施
                  </div>
                )}
                <div className="rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
                  Pro
                </div>
              </div>
            )}

            {phase === "chat" && (
              <button
                onClick={() => setPhase("setup")}
                className="rounded-lg border border-card-border px-3 py-1.5 text-xs text-muted transition hover:text-foreground"
              >
                やり直す
              </button>
            )}
            <UserMenu initialPlan={usage?.plan} />
          </div>
        </div>
      </header>

      {/* Setup Phase */}
      {phase === "setup" && (
        <div className="flex flex-1 items-center justify-center px-4 py-12">
          <div className="w-full max-w-lg space-y-8">
            <div>
              <h1 className="mb-2 text-2xl font-bold">ロープレ設定</h1>
              <p className="text-sm text-muted">
                営業シーンを設定して、AIとロープレを始めましょう
              </p>
            </div>

            {/* あなた（営業マン）側 */}
            <div className="rounded-2xl border border-accent/30 bg-accent/5 p-5">
              <div className="mb-4 flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent/20 text-sm">🔥</span>
                <span className="text-sm font-bold text-accent">あなた（営業マン）</span>
              </div>

              <div className="mb-4">
                <label className="mb-1.5 block text-xs font-medium text-muted">
                  売りたい商材・サービス
                </label>
                <input
                  type="text"
                  value={product}
                  onChange={(e) => setProduct(e.target.value)}
                  placeholder="例：外壁塗装、法人向けクラウド、学習塾の入会..."
                  className="w-full rounded-lg border border-card-border bg-card px-4 py-3 text-sm outline-none placeholder:text-muted/50 focus:border-accent"
                />
                {!product && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {productSuggestions.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setProduct(s)}
                        className="rounded-full border border-card-border px-3 py-1 text-xs text-muted transition hover:border-accent/50 hover:text-accent"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted">
                  営業シーン
                </label>
                <div className="flex flex-wrap gap-2">
                  {customerScenes.map((s) => (
                    <button
                      key={s.value}
                      onClick={() => setScene(s.value)}
                      className={`rounded-lg border px-3 py-2 text-left transition ${
                        scene === s.value
                          ? "border-accent bg-accent/10 text-accent"
                          : "border-card-border text-muted hover:border-accent/50"
                      }`}
                    >
                      <div className="text-sm font-medium">{s.label}</div>
                      <div className="text-[10px] text-muted">{s.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 相手（お客さん）側 */}
            <div className="rounded-2xl border border-blue-500/30 bg-blue-500/5 p-5">
              <div className="mb-4 flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-500/20 text-sm">👤</span>
                <span className="text-sm font-bold text-blue-400">相手（お客さん）</span>
              </div>

              <div className="mb-4">
                <label className="mb-1.5 block text-xs font-medium text-muted">
                  お客さんの属性
                </label>
                <div className="flex flex-wrap gap-2">
                  {customerTypes.map((ct) => (
                    <button
                      key={ct.value}
                      onClick={() => setCustomerType(ct.value)}
                      className={`rounded-lg border px-3 py-1.5 text-sm transition ${
                        customerType === ct.value
                          ? "border-blue-400 bg-blue-500/10 text-blue-400"
                          : "border-card-border text-muted hover:border-blue-400/50"
                      }`}
                    >
                      {ct.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label className="mb-1.5 block text-xs font-medium text-muted">
                  お客さんの業種（任意）
                </label>
                <input
                  type="text"
                  value={customerIndustry}
                  onChange={(e) => setCustomerIndustry(e.target.value)}
                  placeholder="例：飲食店オーナー、製造業の工場長、30代共働き夫婦..."
                  className="w-full rounded-lg border border-card-border bg-card px-4 py-3 text-sm outline-none placeholder:text-muted/50 focus:border-blue-400"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted">
                  お客さんの難易度
                </label>
                <div className="space-y-2">
                  {difficulties.map((d) => (
                    <button
                      key={d.value}
                      onClick={() => setDifficulty(d.value)}
                      className={`flex w-full items-center gap-3 rounded-lg border p-3 text-left transition ${
                        difficulty === d.value
                          ? "border-blue-400 bg-blue-500/10"
                          : "border-card-border hover:border-blue-400/50"
                      }`}
                    >
                      <span className="text-sm font-medium">{d.label}</span>
                      <span className="text-xs text-muted">{d.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={handleStartRoleplay}
              disabled={!canStart || isCheckingUsage}
              className="flex h-12 w-full items-center justify-center rounded-xl bg-accent text-base font-bold text-white transition hover:bg-accent-hover disabled:opacity-40 disabled:hover:bg-accent"
            >
              {isCheckingUsage ? "確認中..." : "🎯 ロープレを開始する"}
            </button>
          </div>
        </div>
      )}

      {/* Chat Phase */}
      {phase === "chat" && (
        <ChatUI
          industry={industry}
          product={product}
          difficulty={difficulty}
          scene={scene}
          customerType={customerType}
          onFinish={(result) => {
            setScore(result);
            setPhase("score");
          }}
        />
      )}

      {/* Score Phase */}
      {phase === "score" && score && (
        <ScoreCard
          score={score}
          plan={usage?.plan}
          onUpgrade={() => setShowUpgradeModal(true)}
          onRetry={() => {
            setScore(null);
            setPhase("setup");
            // Refresh usage
            fetch("/api/usage")
              .then((r) => r.json())
              .then((data) => {
                if (!data.error) setUsage(data);
              })
              .catch(() => {});
          }}
        />
      )}

      {/* Upgrade Modal */}
      <UpgradeModal
        open={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
      />
    </div>
  );
}
