"use client";

import "./pixar.css";
import { Suspense, useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ChatUI } from "./chat-ui";
import { ScoreCard } from "./score-card";
import { UserMenu } from "@/components/user-menu";
import { UpgradeModal } from "@/components/upgrade-modal";
import { WelcomeModal } from "@/components/welcome-modal";
import { EmailVerificationModal } from "@/components/email-verification-modal";
import type { OnboardingPreset } from "@/components/welcome-modal";
import { RadarChart } from "@/components/radar-chart";
import { createClient } from "@/lib/supabase/client";
import type { UsageStatus } from "@/lib/usage";
import type { ScoreResult } from "@/lib/scoring";
import {
  trackRoleplaySetup,
  trackRoleplayCompleted,
  trackUpgradeModalShown,
  trackEngagementEvent,
  trackRoleplayStart,
  trackRoleplayComplete,
  trackScoreView,
  trackUpgradePromptShown,
  trackUpgradePromptClicked,
  trackAhaMoment,
} from "@/lib/tracking";
import { trackCheckoutComplete } from "@/lib/tracking";
import { PostPaymentSurvey } from "@/components/post-payment-survey";
import {
  canShowPaywall,
  recordPaywallShown,
  recordPaywallDismissed,
} from "@/lib/paywall-cooldown";

export type { ScoreResult } from "@/lib/scoring";

export type RoleplayPhase = "setup" | "chat" | "auth-gate" | "score";

interface PendingScore {
  messages: { role: string; content: string }[];
  industry: string;
  product: string;
  difficulty: string;
  scene: string;
  customerType: string;
  timestamp: number;
  score?: ScoreResult;
}

const PENDING_SCORE_KEY = "seiyaku-pending-score";
const PENDING_SCORE_TTL = 60 * 60 * 1000; // 1 hour

function UpgradeToast() {
  const searchParams = useSearchParams();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (searchParams.get("upgraded") === "true") {
      setShow(true);
      trackCheckoutComplete({});
    }
  }, [searchParams]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in-up">
      <div className="mx-4 w-full max-w-md rounded-2xl border border-green-500/30 bg-card p-8 shadow-2xl">
        <div className="mb-4 text-center text-4xl" aria-hidden="true"><svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{display:"inline"}}><polyline points="20 6 9 17 4 12"/></svg></div>
        <h2 className="mb-2 text-center text-xl font-bold text-green-400">
          Proプランのご利用が開始されました
        </h2>
        <p className="mb-6 text-center text-sm text-muted">
          無制限ロープレ・全5カテゴリ詳細スコア・AI改善アドバイスが使えます
        </p>

        <div className="mb-6 space-y-3 rounded-xl border border-card-border bg-card p-4">
          <p className="text-xs font-bold text-muted">まずこの3ステップで効果を最大化：</p>
          <div className="flex items-start gap-3">
            <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-accent/10 text-xs font-bold text-accent">1</span>
            <p className="text-sm text-muted">3回ロープレして現在地のスコアを把握する</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-accent/10 text-xs font-bold text-accent">2</span>
            <p className="text-sm text-muted">一番低いカテゴリを集中的に練習する</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-accent/10 text-xs font-bold text-accent">3</span>
            <p className="text-sm text-muted">毎日ロープレしてスコアの伸びをダッシュボードで追跡</p>
          </div>
        </div>

        <button
          onClick={() => setShow(false)}
          className="flex h-12 w-full items-center justify-center rounded-xl bg-accent text-base font-bold text-white transition hover:bg-accent-hover"
        >
          さっそくロープレを始める
        </button>

        <a
          href="/referral"
          className="mt-3 block text-center text-xs text-accent/70 hover:text-accent transition"
        >
          友達に紹介して ¥1,000 OFF を受け取る →
        </a>
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

function ShowScoreCheck({ onShowScore }: { onShowScore: () => void }) {
  const searchParams = useSearchParams();
  useEffect(() => {
    if (searchParams.get("showScore") === "true") {
      onShowScore();
    }
  }, [searchParams, onShowScore]);
  return null;
}

const customerTypes = [
  { value: "individual", label: "個人のお客さん" },
  { value: "owner", label: "会社オーナー・社長" },
  { value: "manager", label: "部長・課長クラス" },
  { value: "staff", label: "担当者・一般社員" },
];

const genderOptions = [
  { value: "male", label: "男性" },
  { value: "female", label: "女性" },
  { value: "unspecified", label: "指定なし" },
];

const ageOptions = [
  { value: "20s", label: "20代" },
  { value: "30s", label: "30代" },
  { value: "40s", label: "40代" },
  { value: "50s", label: "50代" },
  { value: "60plus", label: "60代以上" },
];

type InputMode = "text" | "url" | "file";
const inputModes: { value: InputMode; label: string }[] = [
  { value: "text", label: "手書き" },
  { value: "url", label: "URL" },
  { value: "file", label: "ファイル" },
];

const customerScenes = [
  { value: "phone", label: "電話営業", desc: "テレアポ・電話商談" },
  { value: "visit", label: "訪問営業", desc: "お客さん宅・会社に訪問" },
  { value: "inbound", label: "問い合わせ対応", desc: "お客さんからの問い合わせ" },
];

// Customer personas imported from shared definition
import { CUSTOMER_PERSONAS } from "@/lib/personas";

export default function RoleplayPage() {
  const [phase, setPhase] = useState<RoleplayPhase>("setup");
  const [setupMode, setSetupMode] = useState<"simple" | "detailed">("simple");
  const [hasAutoSwitched, setHasAutoSwitched] = useState(false);
  const [pendingAutoStart, setPendingAutoStart] = useState(false);
  const [product, setProduct] = useState("");
  const [customerType, setCustomerType] = useState("individual");
  const [customerIndustry, setCustomerIndustry] = useState("");
  const [scene, setScene] = useState("visit");
  const [difficulty, setDifficulty] = useState("friendly");
  const [score, setScore] = useState<(ScoreResult & { scoreId?: string | null }) | null>(null);

  const [usage, setUsage] = useState<UsageStatus | null>(null);
  const [isGuest, setIsGuest] = useState(true);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeModalTrigger, setUpgradeModalTrigger] = useState<"limit" | "score" | "feature">("limit");
  const [showWelcome, setShowWelcome] = useState(false);
  const [isCheckingUsage, setIsCheckingUsage] = useState(false);
  const [isAutoScoring, setIsAutoScoring] = useState(false);
  const [pendingTurnCount, setPendingTurnCount] = useState(0);
  const [previewScore, setPreviewScore] = useState<ScoreResult | null>(null);
  const [previousScore, setPreviousScore] = useState<number | undefined>(undefined);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  // Product input modes
  const [productInputMode, setProductInputMode] = useState<InputMode>("text");
  const [productDetail, setProductDetail] = useState("");
  const [productUrl, setProductUrl] = useState("");
  const [productFileName, setProductFileName] = useState("");
  const [productFileContent, setProductFileContent] = useState("");
  const productFileRef = useRef<HTMLInputElement>(null);

  // Customer persona
  const [customerGender, setCustomerGender] = useState("unspecified");
  const [customerAge, setCustomerAge] = useState("");
  const [customerPersona, setCustomerPersona] = useState("");
  const [customerInputMode, setCustomerInputMode] = useState<InputMode>("text");
  const [customerUrl, setCustomerUrl] = useState("");
  const [customerFileName, setCustomerFileName] = useState("");
  const [customerFileContent, setCustomerFileContent] = useState("");
  const customerFileRef = useRef<HTMLInputElement>(null);

  const productSuggestions = ["外壁塗装", "法人向けクラウドサービス", "学習塾の入会", "生命保険", "太陽光パネル"];

  // Industry-specific quick-start templates — 競合失敗分析: 92%がカスタマイズされた練習を好む
  const INDUSTRY_TEMPLATES = [
    { label: "不動産", product: "新築マンション", customerType: "individual", industry: "住宅購入検討者", scene: "visit", difficulty: "cautious", desc: "マンション・戸建て" },
    { label: "保険", product: "生命保険", customerType: "individual", industry: "保険見直し検討中", scene: "visit", difficulty: "friendly", desc: "生命・損害保険" },
    { label: "IT・SaaS", product: "法人向けクラウドサービス", customerType: "manager", industry: "IT企業", scene: "phone", difficulty: "cautious", desc: "法人ソフトウェア" },
    { label: "リフォーム", product: "外壁塗装", customerType: "individual", industry: "戸建て住宅オーナー", scene: "visit", difficulty: "skeptical", desc: "外壁・屋根・水回り" },
    { label: "教育", product: "学習塾の入会", customerType: "individual", industry: "子育て世帯", scene: "inbound", difficulty: "friendly", desc: "塾・習い事" },
    { label: "エネルギー", product: "太陽光パネル", customerType: "individual", industry: "戸建て住宅オーナー", scene: "phone", difficulty: "silent", desc: "太陽光・蓄電池" },
    { label: "自動車", product: "新車販売", customerType: "individual", industry: "車買い替え検討者", scene: "inbound", difficulty: "talkative", desc: "新車・中古車" },
    { label: "人材", product: "求人広告", customerType: "owner", industry: "中小企業", scene: "phone", difficulty: "low-energy", desc: "求人・人材紹介" },
  ];

  // Phase 1 simple-mode templates — 初回ユーザー向けのワンタップ開始
  const PHASE1_TEMPLATES = [
    {
      id: "painting",
      name: "訪販リフォーム",
      icon: "",
      product: "外壁塗装",
      scene: "visit",
      customerType: "individual",
      customerIndustry: "戸建て住宅オーナー",
      difficulty: "cautious",
      description: "40代夫婦に外壁塗装を訪問営業",
    },
    {
      id: "insurance",
      name: "保険営業",
      icon: "",
      product: "医療保険",
      scene: "phone",
      customerType: "individual",
      customerIndustry: "保険見直し検討中",
      difficulty: "skeptical",
      description: "30代に医療保険を電話で提案",
    },
    {
      id: "real_estate",
      name: "不動産営業",
      icon: "",
      product: "新築マンション",
      scene: "visit",
      customerType: "individual",
      customerIndustry: "住宅購入検討者",
      difficulty: "cautious",
      description: "30代夫婦にマンションを接客",
    },
    {
      id: "car",
      name: "自動車営業",
      icon: "",
      product: "新車（ファミリーカー）",
      scene: "inbound",
      customerType: "individual",
      customerIndustry: "車買い替え検討者",
      difficulty: "talkative",
      description: "家族連れに新車を提案",
    },
    {
      id: "saas",
      name: "SaaS営業",
      icon: "",
      product: "業務効率化SaaS",
      scene: "phone",
      customerType: "owner",
      customerIndustry: "中小企業",
      difficulty: "cautious",
      description: "中小企業オーナーにSaaS導入提案",
    },
    {
      id: "web",
      name: "Web制作営業",
      icon: "",
      product: "コーポレートサイト制作",
      scene: "visit",
      customerType: "owner",
      customerIndustry: "個人事業主",
      difficulty: "cautious",
      description: "個人事業主にサイト制作提案",
    },
  ];

  function applyTemplate(t: typeof INDUSTRY_TEMPLATES[number]) {
    setProduct(t.product);
    setCustomerType(t.customerType);
    setCustomerIndustry(t.industry);
    setScene(t.scene);
    setDifficulty(t.difficulty);
  }

  function applyPhase1Template(t: typeof PHASE1_TEMPLATES[number]) {
    setProduct(t.product);
    setCustomerType(t.customerType);
    setCustomerIndustry(t.customerIndustry);
    setScene(t.scene);
    setDifficulty(t.difficulty);
  }

  const handleWelcome = useCallback(() => {
    setShowWelcome(true);
  }, []);

  const handleOnboardingComplete = useCallback(
    (preset?: OnboardingPreset) => {
      setShowWelcome(false);
      if (preset) {
        setProduct(preset.product);
        setScene(preset.scene);
        setCustomerType(preset.customerType);
        setDifficulty(preset.difficulty);
        // Auto-start roleplay with preset
        if (isGuest) {
          setPhase("chat");
        } else {
          // Record usage then start
          fetch("/api/usage/record", { method: "POST" })
            .then((res) => res.json())
            .then((data) => {
              if (!data.error) setUsage(data);
              setPhase("chat");
            })
            .catch(() => setPhase("chat"));
        }
      }
    },
    [isGuest]
  );

  function handleFileUpload(
    e: React.ChangeEvent<HTMLInputElement>,
    target: "product" | "customer"
  ) {
    const file = e.target.files?.[0];
    if (!file) return;

    const setName = target === "product" ? setProductFileName : setCustomerFileName;
    const setContent = target === "product" ? setProductFileContent : setCustomerFileContent;

    setName(file.name);

    if (
      file.type === "text/plain" ||
      file.name.endsWith(".txt") ||
      file.name.endsWith(".csv")
    ) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setContent((ev.target?.result as string) || "");
      };
      reader.readAsText(file);
    } else if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
      setContent("[PDF] " + file.name + " を読み込みました");
    } else {
      setContent("[ファイル] " + file.name + " を読み込みました");
    }
  }

  function clearFile(target: "product" | "customer") {
    if (target === "product") {
      setProductFileName("");
      setProductFileContent("");
      if (productFileRef.current) productFileRef.current.value = "";
    } else {
      setCustomerFileName("");
      setCustomerFileContent("");
      if (customerFileRef.current) customerFileRef.current.value = "";
    }
  }

  const industry = customerIndustry || customerType;
  const canStart = product.trim();

  // Build context strings from detailed setup fields
  const productContext = [
    productDetail && `商材の詳細: ${productDetail}`,
    productUrl && `商材のURL: ${productUrl}`,
    productFileContent && `商材の資料内容: ${productFileContent}`,
  ].filter(Boolean).join("\n") || "";

  const customerContext = [
    customerGender !== "unspecified" && customerGender && `お客さんの性別: ${customerGender === "male" ? "男性" : "女性"}`,
    customerAge && `お客さんの年代: ${customerAge}`,
    customerPersona && `お客さんの人物像・背景: ${customerPersona}`,
    customerUrl && `お客さんの関連URL: ${customerUrl}`,
    customerFileContent && `お客さんの資料内容: ${customerFileContent}`,
  ].filter(Boolean).join("\n") || "";

  // Check auth state and fetch usage on mount
  useEffect(() => {
    const supabase = createClient();
    if (!supabase) {
      setIsGuest(true);
      return;
    }
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setIsGuest(false);
        // Fetch usage for logged-in users
        fetch("/api/usage")
          .then((r) => r.json())
          .then((data) => {
            if (!data.error) setUsage(data);
          })
          .catch(() => {});
      } else {
        setIsGuest(true);
      }
    });
  }, []);

  // Auto-start roleplay after a Phase 1 template is applied (state must be flushed first)
  useEffect(() => {
    if (!pendingAutoStart) return;
    if (!product.trim()) return;
    setPendingAutoStart(false);
    handleStartRoleplay();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingAutoStart, product]);

  // Auto-switch setup mode based on user history — initial users see simple mode, returners see detailed
  useEffect(() => {
    if (hasAutoSwitched) return;
    // Guest users always start with simple mode (already default)
    if (isGuest) {
      setHasAutoSwitched(true);
      return;
    }
    // Wait until usage is loaded for logged-in users
    if (usage === null) return;
    const totalSessions = usage.totalSessions ?? 0;
    if (totalSessions === 0) {
      setSetupMode("simple");
    } else {
      setSetupMode("detailed");
    }
    setHasAutoSwitched(true);
  }, [usage, isGuest, hasAutoSwitched]);

  // Handle returning from login with showScore param
  const handleShowScore = useCallback(async () => {
    const raw = localStorage.getItem(PENDING_SCORE_KEY);
    if (!raw) return;

    try {
      const pending: PendingScore = JSON.parse(raw);
      // Check TTL
      if (Date.now() - pending.timestamp > PENDING_SCORE_TTL) {
        localStorage.removeItem(PENDING_SCORE_KEY);
        return;
      }

      // Use pre-computed score if available (no API call needed)
      if (pending.score) {
        setScore(pending.score);
        setPhase("score");
        setProduct(pending.product);
        setDifficulty(pending.difficulty);
        localStorage.removeItem(PENDING_SCORE_KEY);
        return;
      }

      // Fallback: call /api/score for old localStorage data without pre-computed score
      setIsAutoScoring(true);
      const res = await fetch("/api/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: pending.messages,
          industry: pending.industry,
          product: pending.product,
          difficulty: pending.difficulty,
          scene: pending.scene,
          customerType: pending.customerType,
        }),
      });
      const data = await res.json();
      if (!data.error) {
        setScore(data);
        setPhase("score");
        setProduct(pending.product);
        setDifficulty(pending.difficulty);
      }
      localStorage.removeItem(PENDING_SCORE_KEY);
    } catch {
      localStorage.removeItem(PENDING_SCORE_KEY);
    }
    setIsAutoScoring(false);
  }, []);

  // Handle guest finishing roleplay → save to localStorage and show auth gate
  function handleAuthGate(
    messages: { role: string; content: string }[],
    previewScoreData?: ScoreResult
  ) {
    const pending: PendingScore = {
      messages,
      industry,
      product,
      difficulty,
      scene,
      customerType,
      timestamp: Date.now(),
      score: previewScoreData,
    };
    localStorage.setItem(PENDING_SCORE_KEY, JSON.stringify(pending));
    setPendingTurnCount(messages.filter((m) => m.role === "user").length);
    if (previewScoreData) {
      setPreviewScore(previewScoreData);
    }
    setPhase("auth-gate");
  }

  async function handleStartRoleplay() {
    if (!canStart) return;

    trackRoleplaySetup({
      product,
      customerType,
      industry,
      scene,
      difficulty,
    });

    // Guest: skip usage check, go directly to chat
    if (isGuest) {
      setPhase("chat");
      trackRoleplayStart({ industry, difficulty });
      return;
    }

    setIsCheckingUsage(true);

    try {
      const res = await fetch("/api/usage/record", { method: "POST" });
      const data = await res.json();

      if (res.status === 403) {
        // Email verification required
        if (data.error === "email_verification_required") {
          setUserEmail(data.email || "");
          setShowVerificationModal(true);
          setIsCheckingUsage(false);
          return;
        }

        setUsage(data);
        if (canShowPaywall("limit")) {
          setUpgradeModalTrigger("limit");
          setShowUpgradeModal(true);
          recordPaywallShown("limit");
          trackUpgradeModalShown("daily_limit");
        }
        setIsCheckingUsage(false);
        return;
      }

      setUsage(data);
      setPhase("chat");
      trackRoleplayStart({ industry, difficulty });
      trackEngagementEvent("roleplay_start", { product, difficulty });
    } catch {
      // Allow to proceed on network error
      setPhase("chat");
    }
    setIsCheckingUsage(false);
  }

  // Auto-scoring loading screen
  if (isAutoScoring) {
    return (
      <div className="pixar-setup flex min-h-screen flex-col items-center justify-center">
        <div className="pixar-card animate-fade-in-up text-center" style={{ padding: '2em', maxWidth: '20em' }}>
          <div style={{ fontSize: '2.5em', marginBottom: '0.3em' }} aria-hidden="true"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#f48a58" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{display:"inline"}}><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg></div>
          <div style={{ fontSize: '1.1em', fontWeight: 800, color: '#4d4c4a', marginBottom: '0.3em' }}>診断結果を作成中...</div>
          <p style={{ fontSize: '0.82em', color: '#6a6560' }}>ロープレの内容を分析しています</p>
        </div>
      </div>
    );
  }

  const isPixarPhase = phase === "setup" || phase === "chat";

  return (
    <div className={`flex min-h-screen flex-col ${isPixarPhase ? '' : 'bg-background'}`} style={isPixarPhase ? { background: '#f0e4d4', fontFamily: '"Arial Rounded MT Bold", "Helvetica Rounded", Arial, sans-serif' } : undefined}>
      {/* Upgrade success toast & welcome check & showScore check */}
      <Suspense>
        <UpgradeToast />
        <WelcomeCheck onWelcome={handleWelcome} />
        <ShowScoreCheck onShowScore={handleShowScore} />
      </Suspense>
      <PostPaymentSurvey />

      {/* Welcome Modal (Do-Based Onboarding) */}
      <WelcomeModal open={showWelcome} onComplete={handleOnboardingComplete} />

      {/* Header */}
      <header
        style={isPixarPhase ? {
          background: '#f5f1e8',
          borderBottom: '0.18em solid #4d4c4a',
          fontFamily: 'inherit',
        } : undefined}
        className={isPixarPhase ? '' : 'border-b border-card-border bg-background/90 backdrop-blur-md'}
      >
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="header-logo">
              <path d="M8 38c2-1 5-2 9-2s7 1 9 3" stroke="var(--accent)" strokeWidth="3.5" strokeLinecap="round" />
              <path d="M17 36c2-1.5 4-2 6-1.5 2.5 0.8 4 2.5 5 4.5 0.8 1.5 0.5 3-0.5 4s-2.5 1.5-4 1" stroke="var(--accent)" strokeWidth="3.5" strokeLinecap="round" />
              <path d="M56 38c-2-1-5-2-9-2s-7 1-9 3" stroke="var(--accent)" strokeWidth="3.5" strokeLinecap="round" />
              <path d="M47 36c-2-1.5-4-2-6-1.5-2.5 0.8-4 2.5-5 4.5-0.8 1.5-0.5 3 0.5 4s2.5 1.5 4 1" stroke="var(--accent)" strokeWidth="3.5" strokeLinecap="round" />
              <path d="M27 39c1.5-2 3.5-3 5-3s3.5 1 5 3c1 1.5 1 3 0 4s-2.5 1.5-5 1.5-4-0.5-5-1.5-1-2.5 0-4z" stroke="var(--accent)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M25.5 38.5c1-1 2-1.2 3-0.8 1.2 0.4 1.8 1.5 1.5 2.8" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M38.5 38.5c-1-1-2-1.2-3-0.8-1.2 0.4-1.8 1.5-1.5 2.8" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="32" cy="24" r="2" fill="var(--accent)" opacity="0.7" />
              <circle cx="24" cy="27" r="1.3" fill="var(--accent)" opacity="0.6" />
              <circle cx="40" cy="27" r="1.3" fill="var(--accent)" opacity="0.6" />
              <path d="M32 28v-5" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
              <path d="M27 30l-2-3" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
              <path d="M37 30l2-3" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
            </svg>
            <span className="header-wave-text" aria-label="成約コーチ AI">
              <span className="header-wave-text__outline">成約コーチ AI</span>
              <span className="header-wave-text__fill">成約コーチ AI</span>
            </span>
          </Link>
          <div className="flex items-center gap-3">
            {/* Usage indicator */}
            {usage && usage.plan === "free" && phase === "setup" && (
              <div className="flex items-center gap-2" style={isPixarPhase ? { border: '0.12em solid #4d4c4a', borderRadius: '2em', padding: '0.25em 0.7em', fontSize: '0.78em', fontWeight: 700, background: '#f5f1e8' } : undefined}>
                <span style={isPixarPhase ? { color: '#6a6560' } : undefined} className={isPixarPhase ? '' : 'text-muted'}>残り:</span>
                <span
                  style={isPixarPhase ? {
                    fontWeight: 800,
                    color: usage.canStart ? '#f48a58' : '#e65e5e',
                  } : undefined}
                  className={isPixarPhase ? '' : (usage.canStart ? "font-bold text-accent" : "font-bold text-red-500")}
                >
                  {Math.max(0, usage.limit - usage.used)}/{usage.limit}回
                </span>
              </div>
            )}
            {/* Streak counter */}
            {usage && usage.streak !== undefined && usage.streak >= 2 && phase === "setup" && (
              <div
                style={isPixarPhase ? { border: '0.12em solid #4d4c4a', borderRadius: '2em', padding: '0.2em 0.6em', fontSize: '0.72em', fontWeight: 800, background: '#f5f1e8', color: '#f48a58' } : undefined}
                className={isPixarPhase ? '' : 'rounded-full bg-accent/10 px-3 py-1 text-xs font-bold text-accent'}
                title="連続練習日数"
              >
                {usage.streak}日連続
              </div>
            )}
            {usage && usage.plan === "pro" && (
              <div className="flex items-center gap-2">
                {phase === "setup" && usage.totalSessions !== undefined && usage.totalSessions > 0 && (
                  <div style={isPixarPhase ? { fontSize: '0.68em', fontWeight: 700, color: '#6a6560' } : undefined} className={isPixarPhase ? '' : 'text-[11px] text-muted'}>
                    累計 {usage.totalSessions} 回
                  </div>
                )}
                <div
                  style={isPixarPhase ? { border: '0.12em solid #4d4c4a', borderRadius: '2em', padding: '0.2em 0.6em', fontSize: '0.72em', fontWeight: 800, background: '#f48a58', color: '#fff', boxShadow: '0.08em 0.08em 0 #c4693d' } : undefined}
                  className={isPixarPhase ? '' : 'rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent'}
                >
                  Pro
                </div>
              </div>
            )}

            {phase === "chat" && (
              <button
                onClick={() => setPhase("setup")}
                className={isPixarPhase ? 'pixar-tag' : 'rounded-lg border border-card-border px-3 py-1.5 text-xs text-muted transition hover:text-foreground'}
              >
                やり直す
              </button>
            )}
            <UserMenu initialPlan={usage?.plan} />
          </div>
        </div>
      </header>

      {/* Setup Phase — Simple Mode (Phase 1) */}
      {phase === "setup" && setupMode === "simple" && (
        <div className="pixar-setup flex flex-1 items-center justify-center px-4 py-8">
          <div className="w-full max-w-3xl space-y-6">
            {/* Title */}
            <div className="text-center">
              <h1 className="mb-1 text-2xl font-extrabold" style={{ color: '#4d4c4a' }}>
                業種を選ぶだけで、すぐ始められます
              </h1>
              <p className="text-sm font-semibold" style={{ color: '#8a8680', marginBottom: '0.8em' }}>
                あなたの業種をタップすると、3秒でロープレ開始
              </p>
            </div>

            {/* Phase 1: Industry Templates Grid — モバイル1カラム / タブレット2カラム / PC3カラム */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {PHASE1_TEMPLATES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    applyPhase1Template(t);
                    // Signal auto-start; the effect will fire once state is flushed
                    setPendingAutoStart(true);
                  }}
                  disabled={isCheckingUsage || (usage !== null && usage.plan === "free" && !usage.canStart)}
                  className="pixar-card text-left transition-transform active:scale-[0.98] hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{
                    padding: '1.1em 1em',
                    background: '#fdfaf3',
                    borderColor: '#d4cabb',
                    cursor: 'pointer',
                  }}
                  aria-label={`${t.name}のロープレを開始: ${t.description}`}
                >
                  <div className="flex items-start gap-3">
                    {t.icon ? (
                      <div
                        aria-hidden="true"
                        style={{
                          fontSize: '2rem',
                          lineHeight: 1,
                          flexShrink: 0,
                        }}
                      >
                        {t.icon}
                      </div>
                    ) : null}
                    <div className="flex-1 min-w-0">
                      <div
                        style={{
                          fontSize: '1.1rem',
                          fontWeight: 800,
                          color: '#4d4c4a',
                          marginBottom: '0.25em',
                          lineHeight: 1.3,
                        }}
                      >
                        {t.name}
                      </div>
                      <div
                        style={{
                          fontSize: '0.85rem',
                          color: '#6a6560',
                          lineHeight: 1.5,
                        }}
                      >
                        {t.description}
                      </div>
                      <div
                        style={{
                          marginTop: '0.6em',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.3em',
                          fontSize: '0.75rem',
                          fontWeight: 800,
                          color: '#f48a58',
                        }}
                      >
                        タップで開始 <span aria-hidden="true">→</span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Daily Limit Banner for Free Users (simple mode) */}
            {usage && usage.plan === "free" && !usage.canStart && (
              <div className="pixar-card" style={{ borderColor: '#f48a58', background: 'linear-gradient(135deg, #fff8f3, #fdf2f2)' }}>
                <div className="text-center">
                  <div style={{ fontSize: '2em', marginBottom: '0.3em' }} aria-hidden="true"><span className="inline-block h-6 w-6 rounded-full bg-accent" /></div>
                  <p style={{ fontSize: '1.1em', fontWeight: 800, color: '#4d4c4a', marginBottom: '0.2em' }}>
                    今日のロープレは終了 — でもまだ伸びしろがあります
                  </p>
                  <p style={{ fontSize: '0.82em', color: '#6a6560', marginBottom: '0.8em', lineHeight: 1.6 }}>
                    繰り返し練習することで<span style={{ color: '#f48a58', fontWeight: 800 }}>スコアの改善が期待</span>できます。<br />
                    Proなら無制限に練習できます。
                  </p>
                  <a
                    href="/pricing"
                    onClick={() => {
                      trackUpgradePromptClicked({ trigger: "daily_limit_banner" });
                    }}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '3em',
                      padding: '0 2em',
                      borderRadius: '2em',
                      background: '#f48a58',
                      color: '#fff',
                      fontWeight: 800,
                      fontSize: '0.95em',
                      textDecoration: 'none',
                      border: '0.12em solid #c4693d',
                      boxShadow: '0.12em 0.12em 0 #c4693d',
                    }}
                  >
                    7日間無料でProを試す →
                  </a>
                </div>
              </div>
            )}

            {/* Loading state */}
            {isCheckingUsage && (
              <div className="text-center" style={{ fontSize: '0.85em', color: '#6a6560', fontWeight: 700 }}>
                確認中...
              </div>
            )}

            {/* Switch to detailed mode */}
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setSetupMode("detailed")}
                className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 transition hover:opacity-80"
                style={{
                  background: 'transparent',
                  border: '0.12em solid #c4b9a8',
                  color: '#6a6560',
                  fontWeight: 700,
                  fontSize: '0.8em',
                  cursor: 'pointer',
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
                もっと詳しく設定したい方はこちら
              </button>
            </div>

            {/* Learn course link */}
            <div className="text-center">
              <Link
                href="/learn"
                className="inline-flex items-center gap-2 rounded-full px-4 py-2 transition hover:opacity-80"
                style={{
                  background: '#e8dfd0',
                  border: '0.12em solid #c4b9a8',
                  color: '#6a6560',
                  fontWeight: 700,
                  fontSize: '0.78em',
                  textDecoration: 'none',
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>
                まず学習コースで「型」を学ぶと効果UP
                <span style={{ color: '#f48a58', fontWeight: 800 }}>→</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Setup Phase — Detailed Mode (Phase 2) — Pixar Card Style */}
      {phase === "setup" && setupMode === "detailed" && (
        <div className="pixar-setup flex flex-1 items-center justify-center px-4 py-8">
          <div className="w-full max-w-lg space-y-6">
            {/* Title */}
            <div className="text-center">
              <h1 className="mb-1 text-2xl font-extrabold" style={{ color: '#4d4c4a' }}>
                ロープレ設定
              </h1>
              <p className="text-sm font-semibold" style={{ color: '#8a8680', marginBottom: '0.8em' }}>
                営業シーンを設定して、AIとロープレを始められます
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                <button
                  type="button"
                  onClick={() => setSetupMode("simple")}
                  className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 transition hover:opacity-80"
                  style={{
                    background: '#e8dfd0',
                    border: '0.12em solid #c4b9a8',
                    color: '#6a6560',
                    fontWeight: 700,
                    fontSize: '0.78em',
                    cursor: 'pointer',
                  }}
                >
                  <span aria-hidden="true">←</span>
                  シンプルモードに戻る
                </button>
                <Link
                  href="/learn"
                  className="inline-flex items-center gap-2 rounded-full px-4 py-2 transition hover:opacity-80"
                  style={{
                    background: '#e8dfd0',
                    border: '0.12em solid #c4b9a8',
                    color: '#6a6560',
                    fontWeight: 700,
                    fontSize: '0.78em',
                    textDecoration: 'none',
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>
                  学習コース
                  <span style={{ color: '#f48a58', fontWeight: 800 }}>→</span>
                </Link>
              </div>
            </div>

            {/* Quick Start by Industry — 60秒で最初のロープレ開始 */}
            <div className="pixar-card" style={{ background: '#f8f3ea', borderColor: '#d4cabb' }}>
              <div className="mb-3 flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f48a58" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                <span style={{ fontSize: '0.9em', fontWeight: 800, color: '#4d4c4a' }}>業種別クイックスタート</span>
                <span style={{ fontSize: '0.68em', color: '#a09a90', fontWeight: 600 }}>ワンタップで設定完了</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {INDUSTRY_TEMPLATES.map((t) => (
                  <button
                    key={t.label}
                    type="button"
                    onClick={() => applyTemplate(t)}
                    className="pixar-option text-left transition-transform active:scale-95"
                    style={{ padding: '0.5em 0.6em' }}
                  >
                    <div style={{ fontSize: '0.88em', fontWeight: 800 }}>{t.label}</div>
                    <div style={{ fontSize: '0.68em', opacity: 0.6 }}>{t.desc}</div>
                  </button>
                ))}
              </div>
              <p style={{ fontSize: '0.68em', color: '#a09a90', marginTop: '0.5em', textAlign: 'center' }}>
                タップで設定が自動入力されます。下のフォームで自由に変更もOK
              </p>
            </div>

            {/* ── あなた（営業マン）Card ── */}
            <div className="pixar-card pixar-card--sales">
              <div className="mb-4 flex items-center">
                <div className="pixar-avatar pixar-avatar--sales"><span className="inline-block h-4 w-4 rounded-full bg-accent" /></div>
                <p className="pixar-username">あなた（営業マン）</p>
              </div>

              <div className="pixar-content">
                {/* Product name */}
                <div className="mb-3">
                  <label className="pixar-label">売りたい商材・サービス</label>
                  <input
                    type="text"
                    value={product}
                    onChange={(e) => setProduct(e.target.value)}
                    placeholder="例：外壁塗装、法人向けクラウド、学習塾の入会..."
                    className="pixar-input"
                    style={{ '--pixar-focus': '#f48a58' } as React.CSSProperties}
                  />
                  {!product && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {productSuggestions.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setProduct(s)}
                          className="pixar-tag"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Product detail — input mode tabs */}
                <div className="mb-3">
                  <label className="pixar-label">商材の詳細情報（任意）</label>
                  <div className="mb-2 flex flex-wrap gap-1.5">
                    {inputModes.map((m) => (
                      <button
                        key={m.value}
                        type="button"
                        onClick={() => setProductInputMode(m.value)}
                        className={`pixar-tab ${
                          productInputMode === m.value ? "pixar-tab--active-sales" : ""
                        }`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>

                  {productInputMode === "text" && (
                    <textarea
                      value={productDetail}
                      onChange={(e) => setProductDetail(e.target.value)}
                      placeholder="商材の特徴、価格帯、ターゲット層など自由に入力..."
                      className="pixar-textarea"
                      style={{ '--pixar-focus': '#f48a58' } as React.CSSProperties}
                    />
                  )}

                  {productInputMode === "url" && (
                    <input
                      type="url"
                      value={productUrl}
                      onChange={(e) => setProductUrl(e.target.value)}
                      placeholder="https://example.com/product-page"
                      className="pixar-input"
                      style={{ '--pixar-focus': '#f48a58' } as React.CSSProperties}
                    />
                  )}

                  {productInputMode === "file" && (
                    <>
                      <input
                        ref={productFileRef}
                        type="file"
                        accept=".txt,.csv,.pdf"
                        onChange={(e) => handleFileUpload(e, "product")}
                        className="hidden"
                      />
                      {!productFileName ? (
                        <button
                          type="button"
                          onClick={() => productFileRef.current?.click()}
                          className="pixar-upload-area"
                        >
                          <div style={{ fontSize: '1.5em', marginBottom: '0.3em' }} aria-hidden="true"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{display:"inline"}}><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></div>
                          <div style={{ fontSize: '0.82em', fontWeight: 700, color: '#6a6560' }}>
                            クリックしてファイルを選択
                          </div>
                          <div style={{ fontSize: '0.72em', color: '#a09a90', marginTop: '0.2em' }}>
                            PDF・テキスト・CSV に対応
                          </div>
                        </button>
                      ) : (
                        <div className="pixar-file-info">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                          <span>{productFileName}</span>
                          <button
                            type="button"
                            onClick={() => clearFile("product")}
                            className="pixar-file-info__remove"
                            aria-label="ファイルを削除"
                          >
                            ✕
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Scene selection */}
                <div>
                  <label className="pixar-label">営業シーン</label>
                  <div className="flex flex-wrap gap-2">
                    {customerScenes.map((s) => (
                      <button
                        key={s.value}
                        onClick={() => setScene(s.value)}
                        className={`pixar-option text-left ${
                          scene === s.value ? "pixar-option--active-sales" : ""
                        }`}
                      >
                        <div className="text-sm font-bold">{s.label}</div>
                        <div className="text-[10px]" style={{ opacity: 0.7 }}>{s.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ── 相手（お客さん）Card ── */}
            <div className="pixar-card pixar-card--customer">
              <div className="mb-4 flex items-center">
                <div className="pixar-avatar pixar-avatar--customer"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div>
                <p className="pixar-username">相手（お客さん）</p>
              </div>

              <div className="pixar-content">
                {/* Customer type */}
                <div className="mb-3">
                  <label className="pixar-label">お客さんの属性</label>
                  <div className="flex flex-wrap gap-2">
                    {customerTypes.map((ct) => (
                      <button
                        key={ct.value}
                        onClick={() => setCustomerType(ct.value)}
                        className={`pixar-option text-sm ${
                          customerType === ct.value ? "pixar-option--active-customer" : ""
                        }`}
                      >
                        {ct.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Gender */}
                <div className="mb-3">
                  <label className="pixar-label">性別</label>
                  <div className="flex flex-wrap gap-2">
                    {genderOptions.map((g) => (
                      <button
                        key={g.value}
                        onClick={() => setCustomerGender(g.value)}
                        className={`pixar-option text-sm ${
                          customerGender === g.value ? "pixar-option--active-customer" : ""
                        }`}
                      >
                        {g.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Age */}
                <div className="mb-3">
                  <label className="pixar-label">年齢層</label>
                  <div className="flex flex-wrap gap-1.5">
                    {ageOptions.map((a) => (
                      <button
                        key={a.value}
                        onClick={() => setCustomerAge(customerAge === a.value ? "" : a.value)}
                        className={`pixar-option text-sm ${
                          customerAge === a.value ? "pixar-option--active-customer" : ""
                        }`}
                      >
                        {a.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Industry */}
                <div className="mb-3">
                  <label className="pixar-label">業種・職業（任意）</label>
                  <input
                    type="text"
                    value={customerIndustry}
                    onChange={(e) => setCustomerIndustry(e.target.value)}
                    placeholder="例：飲食店オーナー、製造業の工場長、30代共働き夫婦..."
                    className="pixar-input"
                    style={{ '--pixar-focus': '#5c99e2' } as React.CSSProperties}
                  />
                </div>

                {/* Customer persona detail — input mode tabs */}
                <div className="mb-3">
                  <label className="pixar-label">ペルソナ詳細（任意）</label>
                  <div className="mb-2 flex flex-wrap gap-1.5">
                    {inputModes.map((m) => (
                      <button
                        key={m.value}
                        type="button"
                        onClick={() => setCustomerInputMode(m.value)}
                        className={`pixar-tab ${
                          customerInputMode === m.value ? "pixar-tab--active-customer" : ""
                        }`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>

                  {customerInputMode === "text" && (
                    <textarea
                      value={customerPersona}
                      onChange={(e) => setCustomerPersona(e.target.value)}
                      placeholder="特定の人物像があれば記入（例：価格に敏感、以前他社で失敗経験あり...）"
                      className="pixar-textarea"
                      style={{ '--pixar-focus': '#5c99e2' } as React.CSSProperties}
                    />
                  )}

                  {customerInputMode === "url" && (
                    <input
                      type="url"
                      value={customerUrl}
                      onChange={(e) => setCustomerUrl(e.target.value)}
                      placeholder="https://example.com/customer-profile"
                      className="pixar-input"
                      style={{ '--pixar-focus': '#5c99e2' } as React.CSSProperties}
                    />
                  )}

                  {customerInputMode === "file" && (
                    <>
                      <input
                        ref={customerFileRef}
                        type="file"
                        accept=".txt,.csv,.pdf"
                        onChange={(e) => handleFileUpload(e, "customer")}
                        className="hidden"
                      />
                      {!customerFileName ? (
                        <button
                          type="button"
                          onClick={() => customerFileRef.current?.click()}
                          className="pixar-upload-area"
                        >
                          <div style={{ fontSize: '1.5em', marginBottom: '0.3em' }} aria-hidden="true"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{display:"inline"}}><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></div>
                          <div style={{ fontSize: '0.82em', fontWeight: 700, color: '#6a6560' }}>
                            クリックしてファイルを選択
                          </div>
                          <div style={{ fontSize: '0.72em', color: '#a09a90', marginTop: '0.2em' }}>
                            PDF・テキスト・CSV に対応
                          </div>
                        </button>
                      ) : (
                        <div className="pixar-file-info">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                          <span>{customerFileName}</span>
                          <button
                            type="button"
                            onClick={() => clearFile("customer")}
                            className="pixar-file-info__remove"
                            aria-label="ファイルを削除"
                          >
                            ✕
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Customer Persona Type */}
                <div>
                  <label className="pixar-label">お客さんのタイプ</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {CUSTOMER_PERSONAS.map((p) => (
                      <button
                        key={p.value}
                        onClick={() => setDifficulty(p.value)}
                        className={`pixar-persona ${
                          difficulty === p.value ? "pixar-persona--active" : ""
                        }`}
                      >
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className={`inline-block h-2 w-2 rounded-full flex-shrink-0 ${
                            p.difficulty === "green" ? "bg-green-400" :
                            p.difficulty === "yellow" ? "bg-yellow-400" : "bg-red-400"
                          }`} />
                          <span className="text-sm font-bold">{p.label}</span>
                        </div>
                        <div className="text-[10px] sm:text-[11px] leading-tight" style={{ opacity: 0.7 }}>{p.description}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Daily Limit Banner for Free Users */}
            {usage && usage.plan === "free" && !usage.canStart && (
              <div className="pixar-card" style={{ borderColor: '#f48a58', background: 'linear-gradient(135deg, #fff8f3, #fdf2f2)' }}>
                <div className="text-center">
                  <div style={{ fontSize: '2em', marginBottom: '0.3em' }} aria-hidden="true"><span className="inline-block h-6 w-6 rounded-full bg-accent" /></div>
                  <p style={{ fontSize: '1.1em', fontWeight: 800, color: '#4d4c4a', marginBottom: '0.2em' }}>
                    今日のロープレは終了 — でもまだ伸びしろがあります
                  </p>
                  <p style={{ fontSize: '0.82em', color: '#6a6560', marginBottom: '0.8em', lineHeight: 1.6 }}>
                    繰り返し練習することで<span style={{ color: '#f48a58', fontWeight: 800 }}>スコアの改善が期待</span>できます。<br />
                    Proなら無制限に練習でき、全5カテゴリの詳細フィードバックも見れます。
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5em', marginBottom: '0.5em' }}>
                    <div style={{ display: 'flex', gap: '0.8em', fontSize: '0.72em', color: '#6a6560' }}>
                      <span>無制限ロープレ</span>
                      <span>全スコア開放</span>
                      <span>AI改善アドバイス</span>
                    </div>
                  </div>
                  <a
                    href="/pricing"
                    onClick={() => {
                      trackUpgradePromptClicked({ trigger: "daily_limit_banner" });
                    }}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '3em',
                      padding: '0 2em',
                      borderRadius: '2em',
                      background: '#f48a58',
                      color: '#fff',
                      fontWeight: 800,
                      fontSize: '0.95em',
                      textDecoration: 'none',
                      border: '0.12em solid #c4693d',
                      boxShadow: '0.12em 0.12em 0 #c4693d',
                    }}
                  >
                    7日間無料でProを試す →
                  </a>
                  <p style={{ fontSize: '0.72em', color: '#a09a90', marginTop: '0.5em' }}>
                    7日間完全無料 → ¥2,980/月 ・ いつでも解約OK ・ 経費精算OK
                  </p>
                </div>
              </div>
            )}

            {/* Action: Start Button */}
            <button
              onClick={handleStartRoleplay}
              disabled={!canStart || isCheckingUsage || (usage !== null && usage.plan === "free" && !usage.canStart)}
              className="pixar-start-btn"
            >
              {isCheckingUsage ? "確認中..." : usage && usage.plan === "free" && !usage.canStart ? "本日の無料回数を使い切りました" : "ロープレを開始する"}
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
          productContext={productContext}
          customerContext={customerContext}
          isGuest={isGuest}
          onAuthGate={handleAuthGate}
          onFinish={(result) => {
            setScore(result);
            setPhase("score");
            trackRoleplayComplete({ industry, difficulty, totalScore: result.overall });
            trackScoreView({ industry, difficulty, totalScore: result.overall });
            trackEngagementEvent("roleplay_complete", { score: result.overall });
            trackEngagementEvent("score_view");
            // Aha moment detection: score improved from previous session
            const prevScore = (result as unknown as Record<string, unknown>).previousScore as number | undefined;
            if (prevScore != null && result.overall > prevScore) {
              trackAhaMoment({
                previousScore: prevScore,
                newScore: result.overall,
                improvement: result.overall - prevScore,
                sessionCount: usage?.totalSessions || 0,
              });
            }
            const categoryScores: Record<string, number> = {};
            result.categories?.forEach((c: { name: string; score: number }) => {
              const key = c.name;
              if (key === "アプローチ") categoryScores.approach = c.score;
              else if (key === "ヒアリング") categoryScores.hearing = c.score;
              else if (key === "プレゼン") categoryScores.presentation = c.score;
              else if (key === "クロージング") categoryScores.closing = c.score;
              else if (key === "反論処理") categoryScores.objection = c.score;
            });
            trackRoleplayCompleted({
              totalScore: result.overall,
              scoreApproach: categoryScores.approach,
              scoreHearing: categoryScores.hearing,
              scorePresentation: categoryScores.presentation,
              scoreClosing: categoryScores.closing,
              scoreObjection: categoryScores.objection,
              difficulty,
              totalTurns: 0,
              durationSeconds: 0,
            });
          }}
        />
      )}

      {/* Auth Gate Phase */}
      {phase === "auth-gate" && (
        <AuthGateContent
          previewScore={previewScore}
          pendingTurnCount={pendingTurnCount}
        />
      )}

      {/* Score Phase */}
      {phase === "score" && score && (
        <ScoreCard
          score={score}
          plan={usage?.plan}
          onUpgrade={() => {
            setUpgradeModalTrigger("score");
            setShowUpgradeModal(true);
          }}
          onRetry={() => {
            if (score) setPreviousScore(score.overall);
            setScore(null);
            setPhase("setup");
            // Refresh usage if logged in
            if (!isGuest) {
              fetch("/api/usage")
                .then((r) => r.json())
                .then((data) => {
                  if (!data.error) setUsage(data);
                })
                .catch(() => {});
            }
          }}
        />
      )}

      {/* Email Verification Modal */}
      <EmailVerificationModal
        open={showVerificationModal}
        email={userEmail}
        onClose={() => setShowVerificationModal(false)}
        onVerified={() => {
          setShowVerificationModal(false);
          // Retry starting roleplay after verification
          handleStartRoleplay();
        }}
      />

      {/* Upgrade Modal */}
      <UpgradeModal
        open={showUpgradeModal}
        onClose={() => {
          setShowUpgradeModal(false);
          recordPaywallDismissed();
        }}
        trigger={upgradeModalTrigger}
        currentScore={score?.overall}
        previousScore={previousScore}
      />
    </div>
  );
}

/* ── Auth Gate with inline Google Login ── */
function GoogleIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

function AuthGateContent({
  previewScore,
  pendingTurnCount,
}: {
  previewScore: ScoreResult | null;
  pendingTurnCount: number;
}) {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleGoogleLogin() {
    setError("");
    setIsGoogleLoading(true);

    const supabase = createClient();
    if (!supabase) {
      setError("サービスが一時的に利用できません");
      setIsGoogleLoading(false);
      return;
    }

    const callbackUrl = new URL("/auth/callback", window.location.origin);
    callbackUrl.searchParams.set("redirect", "/roleplay?showScore=true");

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: callbackUrl.toString(),
      },
    });

    if (error) {
      setError("Googleログインに失敗しました。もう一度お試しください。");
      setIsGoogleLoading(false);
    }
  }

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-12">
      <div className="w-full max-w-md animate-fade-in-up text-center">
        <div className="mb-6 rounded-2xl border border-card-border bg-card p-8">
          <h2 className="mb-2 text-xl font-bold">
            ロープレお疲れさまでした
          </h2>

          {previewScore ? (
            <>
              <div className="my-6">
                <div className="text-xs text-muted mb-1">あなたの営業スコア</div>
                <div className="flex items-center justify-center gap-2">
                  <span className={`text-6xl font-black ${
                    previewScore.overall >= 80 ? "text-green-600" :
                    previewScore.overall >= 60 ? "text-yellow-600" :
                    previewScore.overall >= 40 ? "text-orange-500" : "text-red-500"
                  }`}>
                    {previewScore.overall}
                  </span>
                  <span className="text-2xl font-black text-muted/30">/ 100</span>
                </div>
                <div className="mt-1 text-sm font-bold text-muted">
                  ランク: {previewScore.overall >= 90 ? "S" : previewScore.overall >= 80 ? "A" : previewScore.overall >= 70 ? "B" : previewScore.overall >= 60 ? "C" : previewScore.overall >= 40 ? "D" : "E"}
                </div>
              </div>

              <div className="relative my-6">
                <div className="pointer-events-none blur-sm">
                  <RadarChart categories={previewScore.categories} size={200} />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="rounded-full border border-card-border bg-card/80 px-4 py-2 text-xs font-medium text-muted backdrop-blur-sm">
                    5カテゴリの詳細分析を見る
                  </div>
                </div>
              </div>

              {/* Value prop before login */}
              <div className="mb-5 rounded-xl border border-accent/20 bg-accent/5 p-4 text-left">
                <p className="mb-2 text-xs font-bold text-accent">ログインで見れる内容：</p>
                <ul className="space-y-1 text-xs text-muted">
                  <li>5カテゴリ別の詳細スコア＆レーダーチャート</li>
                  <li>カテゴリごとの改善ポイント</li>
                  <li>スコア履歴の保存＆推移グラフ</li>
                  <li>毎日1回の無料ロープレ（Proなら無制限）</li>
                </ul>
              </div>

              <div className="mb-4 flex flex-wrap justify-center gap-3 text-[11px] text-muted">
                <span>完全無料・クレジットカード不要</span>
                <span>Googleアカウントで10秒で完了</span>
              </div>
            </>
          ) : (
            <>
              <div className="mb-4 text-5xl" aria-hidden="true"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{display:"inline"}}><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg></div>
              <p className="mb-4 text-sm text-muted">
                あなたの営業スコアが算出されました。結果を見るにはログインしてください。
              </p>
              {pendingTurnCount > 0 && (
                <div className="mb-6 rounded-xl border border-accent/20 bg-accent/5 px-4 py-3">
                  <div className="text-sm text-muted">
                    あなたの営業トーク <span className="font-bold text-accent">{pendingTurnCount}ターン</span> を
                    AIが分析完了
                  </div>
                  <div className="mt-1 text-xs text-muted">
                    ログイン後すぐに結果をお見せします
                  </div>
                </div>
              )}
              <div className="mb-4 flex flex-wrap justify-center gap-3 text-[11px] text-muted">
                <span>完全無料・クレジットカード不要</span>
                <span>10秒で登録完了</span>
              </div>
            </>
          )}

          {error && (
            <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isGoogleLoading}
            className="flex h-14 w-full items-center justify-center gap-3 rounded-xl border-2 border-accent bg-accent/5 text-sm font-bold text-accent transition hover:bg-accent/10 disabled:opacity-60"
          >
            {isGoogleLoading ? (
              "接続中..."
            ) : (
              <>
                <GoogleIcon />
                Googleで結果を見る（無料）
              </>
            )}
          </button>
          <Link
            href="/login?redirect=/roleplay?showScore=true"
            className="mt-2 block text-center text-xs text-muted transition hover:text-accent"
          >
            メールアドレスでログイン →
          </Link>
        </div>

        <p className="text-xs text-muted">
          ログインすると初回は自動的にアカウントが作成されます。
        </p>
      </div>
    </div>
  );
}
