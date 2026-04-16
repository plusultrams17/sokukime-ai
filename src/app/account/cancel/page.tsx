"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Header } from "@/components/header";
import { createClient } from "@/lib/supabase/client";

/* ── Types ── */

type CancelReason =
  | "price_too_high"
  | "no_time"
  | "no_effect"
  | "switching"
  | "other";

interface ReasonOption {
  id: CancelReason;
  label: string;
}

type Step = "reason" | "offer" | "confirm" | "complete";

/* ── Constants ── */

const CANCEL_REASONS: ReasonOption[] = [
  { id: "price_too_high", label: "料金が高い" },
  { id: "no_time", label: "使う時間がない" },
  { id: "no_effect", label: "期待した効果がない" },
  { id: "switching", label: "他サービスに乗り換え" },
  { id: "other", label: "その他" },
];

interface SaveOffer {
  title: string;
  description: string;
  ctaLabel: string;
  ctaAction: "downgrade" | "pause" | "learn" | "proceed" | "feedback";
}

const SAVE_OFFERS: Record<CancelReason, SaveOffer> = {
  price_too_high: {
    title: "Starterプラン（¥990/月）へのダウングレードはいかがですか？",
    description:
      "Starterプランでも全22レッスンとAIロープレ月30回をご利用いただけます。現在の学習進捗やスコア履歴はすべて引き継がれます。",
    ctaLabel: "Starterプランに変更する",
    ctaAction: "downgrade",
  },
  no_time: {
    title: "最大3ヶ月の一時停止が可能です",
    description:
      "データや進捗をすべて保持したまま、一時的に課金を停止できます。忙しい時期が落ち着いたら、いつでも再開できます。停止期間中の課金はありません。",
    ctaLabel: "一時停止する",
    ctaAction: "pause",
  },
  no_effect: {
    title: "弱点を特定して効果的に練習しませんか？",
    description:
      "学習コースでは、あなたのスコアが低いカテゴリを重点的にトレーニングできます。スコアレポートの改善アドバイスに沿って練習すると、効率よくスキルアップにつながります。",
    ctaLabel: "学習コースを見る",
    ctaAction: "learn",
  },
  switching: {
    title: "フィードバックありがとうございます",
    description:
      "差し支えなければ、移行先のサービスをお教えいただけますか？ご意見は今後の改善に活かします。",
    ctaLabel: "退会手続きに進む",
    ctaAction: "proceed",
  },
  other: {
    title: "ご不便をおかけして申し訳ございません",
    description:
      "よろしければ解約の理由を詳しくお聞かせください。いただいたフィードバックは今後のサービス改善に活かします。",
    ctaLabel: "フィードバックを送信して退会手続きへ",
    ctaAction: "feedback",
  },
};

/* ── Component ── */

export default function CancelPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("reason");
  const [selectedReason, setSelectedReason] = useState<CancelReason | null>(null);
  const [otherDetail, setOtherDetail] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [plan, setPlan] = useState<string>("free");

  // Auth check
  useEffect(() => {
    const supabase = createClient();
    if (!supabase) {
      setAuthChecked(true);
      return;
    }
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setIsAuthenticated(true);
        supabase
          .from("profiles")
          .select("plan")
          .eq("id", user.id)
          .single()
          .then(({ data }) => {
            if (data?.plan) setPlan(data.plan);
          });
      }
      setAuthChecked(true);
    });
  }, []);

  const offer = selectedReason ? SAVE_OFFERS[selectedReason] : null;
  const isPaid = plan === "starter" || plan === "pro" || plan === "master";

  /* ── Handlers ── */

  function handleSelectReason(reason: CancelReason) {
    setSelectedReason(reason);
    setOtherDetail("");
    setErrorMsg("");
    setStep("offer");
  }

  async function handleOfferCTA() {
    if (!offer) return;
    setErrorMsg("");

    switch (offer.ctaAction) {
      case "downgrade": {
        // Redirect to pricing page for plan change
        router.push("/pricing");
        return;
      }
      case "pause": {
        // Redirect to Stripe portal for pause
        setIsProcessing(true);
        try {
          const res = await fetch("/api/stripe/portal", { method: "POST" });
          const data = await res.json().catch(() => ({}));
          if (res.ok && data.url) {
            window.location.href = data.url;
            return;
          }
          setErrorMsg("サブスクリプション管理画面を開けませんでした。時間をおいて再度お試しください。");
        } catch {
          setErrorMsg("通信エラーが発生しました。時間をおいて再度お試しください。");
        }
        setIsProcessing(false);
        return;
      }
      case "learn": {
        router.push("/learn");
        return;
      }
      case "proceed": {
        setStep("confirm");
        return;
      }
      case "feedback": {
        // Log feedback then move to confirm
        if (otherDetail.trim()) {
          await logCancelReason();
        }
        setStep("confirm");
        return;
      }
    }
  }

  async function logCancelReason() {
    try {
      await fetch("/api/cancel-reason", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reason: selectedReason,
          reasonDetail: otherDetail || undefined,
          offerType: offer?.ctaAction,
          outcome: "rejected",
        }),
      });
    } catch {
      // Non-blocking: don't prevent cancellation if logging fails
    }
  }

  function handleProceedToConfirm() {
    setStep("confirm");
  }

  async function handleConfirmCancel() {
    setIsProcessing(true);
    setErrorMsg("");

    // Log cancel reason
    await logCancelReason();

    try {
      // Open Stripe portal for actual cancellation
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json().catch(() => ({}));

      if (res.ok && data.url) {
        window.location.href = data.url;
        return;
      }

      setErrorMsg(
        "解約処理を開始できませんでした。時間をおいて再度お試しください。問題が続く場合は support@seiyaku-coach.com までご連絡ください。"
      );
    } catch {
      setErrorMsg(
        "通信エラーが発生しました。時間をおいて再度お試しください。"
      );
    }
    setIsProcessing(false);
  }

  /* ── Render ── */

  // Loading state
  if (!authChecked) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center py-32">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="mx-auto max-w-md px-4 py-20 text-center">
          <h1 className="mb-4 text-xl font-bold">ログインが必要です</h1>
          <p className="mb-6 text-sm text-muted">
            解約手続きにはログインが必要です。
          </p>
          <Link
            href="/login?redirect=/account/cancel"
            className="inline-flex h-11 items-center rounded-xl bg-accent px-6 text-sm font-bold text-white transition hover:bg-accent-hover"
          >
            ログインする
          </Link>
        </div>
      </div>
    );
  }

  // Not on a paid plan
  if (!isPaid) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="mx-auto max-w-md px-4 py-20 text-center">
          <h1 className="mb-4 text-xl font-bold">
            有料プランをご利用ではありません
          </h1>
          <p className="mb-6 text-sm text-muted">
            現在、無料プランをご利用中です。解約手続きは不要です。
          </p>
          <Link
            href="/dashboard"
            className="inline-flex h-11 items-center rounded-xl border border-card-border px-6 text-sm font-bold text-foreground transition hover:border-accent/50 hover:text-accent"
          >
            ダッシュボードへ戻る
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="mx-auto max-w-xl px-4 py-10 sm:px-6 sm:py-16">
        {/* Progress indicator */}
        <div className="mb-8 flex items-center justify-center gap-2" aria-label="進行状況">
          {(["reason", "offer", "confirm"] as const).map((s, i) => {
            const stepLabels = ["理由選択", "ご提案", "最終確認"];
            const stepIndex = ["reason", "offer", "confirm"].indexOf(step);
            const isActive = i <= stepIndex && step !== "complete";
            return (
              <div key={s} className="flex items-center gap-2">
                {i > 0 && (
                  <div
                    className={`h-px w-6 sm:w-10 ${
                      isActive ? "bg-accent" : "bg-card-border"
                    }`}
                  />
                )}
                <div className="flex items-center gap-1.5">
                  <div
                    className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                      isActive
                        ? "bg-accent text-white"
                        : "border border-card-border text-muted"
                    }`}
                  >
                    {i + 1}
                  </div>
                  <span
                    className={`hidden text-xs sm:inline ${
                      isActive ? "font-medium text-foreground" : "text-muted"
                    }`}
                  >
                    {stepLabels[i]}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Step: Reason Selection */}
        {step === "reason" && (
          <div className="rounded-2xl border border-card-border bg-card p-6 sm:p-8">
            <h1 className="mb-2 text-center text-lg font-bold sm:text-xl">
              解約の理由をお聞かせください
            </h1>
            <p className="mb-6 text-center text-sm text-muted">
              いただいたご意見はサービス改善に活用いたします
            </p>
            <div className="space-y-2">
              {CANCEL_REASONS.map((reason) => (
                <button
                  key={reason.id}
                  onClick={() => handleSelectReason(reason.id)}
                  className="flex w-full items-center justify-between rounded-xl border border-card-border px-4 py-3.5 text-sm text-foreground transition hover:border-accent/50 hover:bg-accent/5"
                >
                  <span>{reason.label}</span>
                  <svg
                    className="h-4 w-4 shrink-0 text-muted"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              ))}
            </div>
            <div className="mt-6 text-center">
              <Link
                href="/dashboard"
                className="text-sm text-muted transition hover:text-foreground"
              >
                やっぱりやめる
              </Link>
            </div>
          </div>
        )}

        {/* Step: Save Offer */}
        {step === "offer" && offer && (
          <div className="rounded-2xl border border-card-border bg-card p-6 sm:p-8">
            <h2 className="mb-2 text-center text-lg font-bold sm:text-xl">
              {offer.title}
            </h2>
            <p className="mb-6 text-center text-sm leading-relaxed text-muted">
              {offer.description}
            </p>

            {/* Detail input for "other" and "switching" reasons */}
            {(selectedReason === "other" || selectedReason === "switching") && (
              <div className="mb-6">
                <textarea
                  value={otherDetail}
                  onChange={(e) => setOtherDetail(e.target.value)}
                  placeholder={
                    selectedReason === "switching"
                      ? "移行先のサービス名をお教えください..."
                      : "詳しい理由をお聞かせください..."
                  }
                  rows={3}
                  className="w-full rounded-xl border border-card-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted/50 focus:border-accent focus:outline-none"
                />
              </div>
            )}

            {errorMsg && (
              <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/5 px-4 py-3 text-sm text-red-600">
                {errorMsg}
              </div>
            )}

            <div className="flex flex-col gap-3">
              <button
                onClick={handleOfferCTA}
                disabled={isProcessing}
                className="flex h-12 w-full items-center justify-center rounded-xl bg-accent text-sm font-bold text-white transition hover:bg-accent-hover disabled:opacity-50"
              >
                {isProcessing ? "処理中..." : offer.ctaLabel}
              </button>
              <button
                onClick={handleProceedToConfirm}
                className="text-sm text-muted transition hover:text-foreground"
              >
                それでも解約する
              </button>
            </div>

            <div className="mt-4 text-center">
              <button
                onClick={() => {
                  setStep("reason");
                  setErrorMsg("");
                }}
                className="text-xs text-muted transition hover:text-foreground"
              >
                理由を選び直す
              </button>
            </div>
          </div>
        )}

        {/* Step: Final Confirmation */}
        {step === "confirm" && (
          <div className="rounded-2xl border border-card-border bg-card p-6 sm:p-8">
            <div className="mb-6 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border-2 border-red-500/30 bg-red-500/5">
                <svg
                  className="h-7 w-7 text-red-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h2 className="mb-2 text-lg font-bold sm:text-xl">
                本当に解約しますか？
              </h2>
              <p className="text-sm leading-relaxed text-muted">
                解約すると、現在の請求期間終了後に以下の機能が利用できなくなります。
              </p>
            </div>

            <div className="mb-6 rounded-xl border border-card-border bg-background p-4">
              <p className="mb-3 text-xs font-bold text-muted">
                解約後に失われるもの
              </p>
              <ul className="space-y-2 text-sm text-foreground">
                <li className="flex items-start gap-2">
                  <svg className="mt-0.5 h-4 w-4 shrink-0 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span>AIロープレの月次クレジット（無料プランの累計5回に制限）</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="mt-0.5 h-4 w-4 shrink-0 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span>全22レッスンへのアクセス（基本3レッスンに制限）</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="mt-0.5 h-4 w-4 shrink-0 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span>全5カテゴリのスコア分析（1カテゴリに制限）</span>
                </li>
              </ul>
              <div className="mt-3 border-t border-card-border pt-3">
                <p className="text-xs text-muted">
                  ※ 過去のスコア履歴やアカウント情報は保持されます。再度有料プランに加入すれば、すべての機能をご利用いただけます。
                </p>
              </div>
            </div>

            {errorMsg && (
              <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/5 px-4 py-3 text-sm text-red-600">
                {errorMsg}
              </div>
            )}

            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  setStep("reason");
                  setSelectedReason(null);
                  setOtherDetail("");
                  setErrorMsg("");
                }}
                className="flex h-12 w-full items-center justify-center rounded-xl bg-accent text-sm font-bold text-white transition hover:bg-accent-hover"
              >
                やっぱり続ける
              </button>
              <button
                onClick={handleConfirmCancel}
                disabled={isProcessing}
                className="flex h-11 w-full items-center justify-center rounded-xl border border-red-500/30 text-sm font-medium text-red-500 transition hover:bg-red-500/5 disabled:opacity-50"
              >
                {isProcessing ? "処理中..." : "解約手続きに進む"}
              </button>
            </div>

            <div className="mt-4 text-center">
              <button
                onClick={() => {
                  setStep("offer");
                  setErrorMsg("");
                }}
                className="text-xs text-muted transition hover:text-foreground"
              >
                戻る
              </button>
            </div>
          </div>
        )}

        {/* Step: Complete */}
        {step === "complete" && (
          <div className="rounded-2xl border border-card-border bg-card p-6 text-center sm:p-8">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent/10">
              <svg
                className="h-7 w-7 text-accent"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M16.704 5.29a1 1 0 010 1.42l-7.5 7.5a1 1 0 01-1.42 0l-3.5-3.5a1 1 0 011.42-1.42L8.5 12.08l6.79-6.79a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h2 className="mb-2 text-lg font-bold">
              解約手続きを受け付けました
            </h2>
            <p className="mb-6 text-sm leading-relaxed text-muted">
              現在の請求期間の終了まで、引き続き現プランの機能をご利用いただけます。
              <br />
              ご利用ありがとうございました。
            </p>
            <Link
              href="/dashboard"
              className="inline-flex h-11 items-center rounded-xl border border-card-border px-6 text-sm font-bold text-foreground transition hover:border-accent/50 hover:text-accent"
            >
              ダッシュボードへ戻る
            </Link>
            <p className="mt-4 text-xs text-muted">
              ご不明点がございましたら{" "}
              <a
                href="mailto:support@seiyaku-coach.com"
                className="text-accent underline decoration-accent/30 underline-offset-2 transition hover:decoration-accent"
              >
                support@seiyaku-coach.com
              </a>{" "}
              までお問い合わせください。
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
