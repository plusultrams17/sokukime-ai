"use client";

import { useState, useEffect } from "react";
import {
  cancelReasons,
  getOfferForReason,
  getDiscountedPrice,
  type CancelReason,
  type CancelOffer,
} from "@/lib/cancel-offers";
import type { UserAchievements } from "@/lib/engagement";
import {
  trackCancelReasonSelected,
  trackCancelOfferShown,
  trackCancelOfferAccepted,
  trackCancelOfferRejected,
} from "@/lib/tracking";

interface CancelSaveModalProps {
  open: boolean;
  onClose: () => void;
  onProceedToCancel: () => void;
}

const ORIGINAL_PRICE = 1980;

export function CancelSaveModal({
  open,
  onClose,
  onProceedToCancel,
}: CancelSaveModalProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedReason, setSelectedReason] = useState<CancelReason | null>(null);
  const [reasonDetail, setReasonDetail] = useState("");
  const [offer, setOffer] = useState<CancelOffer | null>(null);
  const [achievements, setAchievements] = useState<UserAchievements | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [pauseMonths, setPauseMonths] = useState(1);

  // モーダル表示時に実績データを取得
  useEffect(() => {
    if (!open) return;
    fetch("/api/engagement")
      .then((r) => r.json())
      .then((data) => {
        if (data.achievements) setAchievements(data.achievements);
      })
      .catch(() => {});
  }, [open]);

  if (!open) return null;

  function handleSelectReason(reason: CancelReason) {
    setSelectedReason(reason);
    const offerData = getOfferForReason(reason);
    setOffer(offerData);
    setStep(2);
    trackCancelReasonSelected(reason);
    trackCancelOfferShown(offerData.type);
  }

  function handleClose() {
    setStep(1);
    setSelectedReason(null);
    setOffer(null);
    setReasonDetail("");
    setPauseMonths(1);
    onClose();
  }

  async function handleAcceptOffer() {
    if (!offer || !selectedReason) return;
    setIsLoading(true);

    try {
      if (offer.type === "pause") {
        // 一時停止の場合はStep 3の確認画面へ
        setStep(3);
        setIsLoading(false);
        return;
      }

      if (offer.type === "coaching") {
        // コーチング提案 → 理由をログしてモーダルを閉じ、ロープレへ
        await fetch("/api/cancel-reason", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            reason: selectedReason,
            reasonDetail: reasonDetail || undefined,
            offerType: offer.type,
            outcome: "accepted",
          }),
        });
        trackCancelOfferAccepted(offer.type);
        handleClose();
        return;
      }

      // 割引オファーの適用
      const res = await fetch("/api/stripe/cancel-offer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reason: selectedReason,
          reasonDetail: reasonDetail || undefined,
          offerType: offer.type,
        }),
      });

      if (res.ok) {
        trackCancelOfferAccepted(offer.type);
        handleClose();
      } else {
        console.error("[cancel-save-modal] cancel-offer failed:", res.status);
        alert("割引の適用に失敗しました。時間をおいて再度お試しください。");
      }
    } catch (err) {
      console.error("[cancel-save-modal] cancel-offer error:", err);
      alert("割引の適用に失敗しました。通信環境をご確認のうえ再度お試しください。");
    }
    setIsLoading(false);
  }

  async function handleConfirmPause() {
    if (!selectedReason) return;
    setIsLoading(true);

    try {
      const res = await fetch("/api/stripe/pause", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "pause", pauseMonths }),
      });

      if (res.ok) {
        await fetch("/api/cancel-reason", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            reason: selectedReason,
            offerType: "pause",
            outcome: "accepted",
          }),
        }).catch((err) => {
          console.error("[cancel-save-modal] pause cancel-reason log failed:", err);
        });
        trackCancelOfferAccepted("pause");
        handleClose();
      } else {
        console.error("[cancel-save-modal] pause failed:", res.status);
        alert("一時停止の設定に失敗しました。時間をおいて再度お試しください。");
      }
    } catch (err) {
      console.error("[cancel-save-modal] pause error:", err);
      alert("一時停止の設定に失敗しました。通信環境をご確認のうえ再度お試しください。");
    }
    setIsLoading(false);
  }

  async function handleRejectOffer() {
    if (selectedReason && offer) {
      trackCancelOfferRejected(offer.type);
      // /api/cancel-reason の失敗は解約フローをブロックしない（ログのみ）
      await fetch("/api/cancel-reason", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reason: selectedReason,
          reasonDetail: reasonDetail || undefined,
          offerType: offer.type,
          outcome: "rejected",
        }),
      }).catch((err) => {
        console.error("[cancel-save-modal] cancel-reason log failed:", err);
      });
    }
    handleClose();
    onProceedToCancel();
  }

  const scoreTrendLabel =
    achievements?.scoreTrend === "improving"
      ? "上昇中"
      : achievements?.scoreTrend === "stable"
        ? "安定"
        : achievements?.scoreTrend === "declining"
          ? "下降中"
          : "";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-md animate-fade-in-up rounded-2xl border border-card-border bg-card p-8 max-h-[90vh] overflow-y-auto">
        {/* Step 1: 理由選択 */}
        {step === 1 && (
          <>
            <h2 className="mb-2 text-center text-lg font-bold">
              解約の理由を教えてください
            </h2>
            <p className="mb-6 text-center text-sm text-muted">
              今後の改善に役立てさせていただきます
            </p>
            <div className="space-y-2">
              {cancelReasons.map((reason) => (
                <button
                  key={reason}
                  onClick={() => handleSelectReason(reason)}
                  className="flex w-full items-center rounded-xl border border-card-border px-4 py-3 text-sm text-muted transition hover:border-accent/50 hover:text-foreground"
                >
                  {reason}
                </button>
              ))}
            </div>
            <button
              onClick={handleClose}
              className="mt-4 w-full text-center text-sm text-muted transition hover:text-foreground"
            >
              やっぱりやめる
            </button>
          </>
        )}

        {/* Step 2: 動的オファー */}
        {step === 2 && offer && (
          <>
            <h2 className="mb-2 text-center text-lg font-bold">
              {offer.title}
            </h2>
            <p className="mb-6 text-center text-sm text-muted">
              {offer.description}
            </p>

            {/* 割引オファー */}
            {(offer.type === "discount_25" || offer.type === "comparison") && (
              <>
                <div className="mb-4 rounded-xl border border-accent/30 bg-accent/5 p-5 text-center">
                  <div className="mb-1 text-xs text-muted">
                    {offer.discountMonths}ヶ月間のお支払い
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-lg text-muted line-through">
                      ¥{ORIGINAL_PRICE.toLocaleString()}
                    </span>
                    <span className="text-2xl font-black text-accent">
                      ¥
                      {getDiscountedPrice(
                        ORIGINAL_PRICE,
                        offer.discountPercent!
                      ).toLocaleString()}
                    </span>
                  </div>
                  <div className="mt-1 text-xs font-medium text-accent">
                    {offer.discountPercent}% OFF（{offer.discountMonths}ヶ月間）
                  </div>
                </div>

                {offer.type === "comparison" && (
                  <div className="mb-4 rounded-xl border border-card-border p-4">
                    <div className="mb-2 text-xs font-medium text-muted">
                      成約コーチAI だけの特長
                    </div>
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center gap-2">
                        <svg className="h-4 w-4 flex-shrink-0 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
                        <span>成約5ステップメソッドに基づくAIコーチング</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg className="h-4 w-4 flex-shrink-0 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
                        <span>5ステップ×リアルタイム分析</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg className="h-4 w-4 flex-shrink-0 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
                        <span>営業シーン別のカスタムロールプレイ</span>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* 一時停止オファー */}
            {offer.type === "pause" && offer.pauseMonths && (
              <div className="mb-4 rounded-xl border border-card-border p-5">
                <div className="mb-3 text-xs font-medium text-muted">
                  停止期間を選択
                </div>
                <div className="space-y-2">
                  {offer.pauseMonths.map((months) => (
                    <button
                      key={months}
                      onClick={() => setPauseMonths(months)}
                      className={`flex w-full items-center rounded-lg border px-4 py-3 text-sm transition ${
                        pauseMonths === months
                          ? "border-accent bg-accent/10 text-accent"
                          : "border-card-border text-muted hover:border-accent/50"
                      }`}
                    >
                      {months}ヶ月間停止
                    </button>
                  ))}
                </div>
                <div className="mt-3 space-y-1 text-xs text-muted">
                  <div className="flex items-center gap-1.5">
                    <svg className="h-3.5 w-3.5 flex-shrink-0 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg> データ・進捗はすべて保持されます
                  </div>
                  <div className="flex items-center gap-1.5">
                    <svg className="h-3.5 w-3.5 flex-shrink-0 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg> 停止期間中は課金されません
                  </div>
                  <div className="flex items-center gap-1.5">
                    <svg className="h-3.5 w-3.5 flex-shrink-0 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg> 自動再開の3日前にメールで通知
                  </div>
                </div>
              </div>
            )}

            {/* コーチングオファー */}
            {offer.type === "coaching" && (
              <div className="mb-4 rounded-xl border border-card-border p-5 text-center">
                <div className="mb-2 text-xs font-medium text-muted">
                  もう一度練習してみませんか？
                </div>
                <p className="text-sm text-muted">
                  次のロープレで新しいスキルを試してみましょう。
                  <br />
                  コーチからのフィードバックを活用できます。
                </p>
              </div>
            )}

            {/* その他 - フリーテキスト */}
            {offer.type === "generic" && (
              <div className="mb-4">
                <textarea
                  value={reasonDetail}
                  onChange={(e) => setReasonDetail(e.target.value)}
                  placeholder="よろしければ詳しい理由を教えてください..."
                  className="w-full rounded-xl border border-card-border bg-background px-4 py-3 text-sm outline-none placeholder:text-muted/50 focus:border-accent"
                  rows={3}
                />
              </div>
            )}

            {/* ユーザー実績表示 */}
            {offer.showAchievements && achievements && achievements.totalSessions > 0 && (
              <div className="mb-4 rounded-xl border border-card-border bg-card p-4">
                <div className="mb-2 text-xs font-medium text-muted">
                  これまでの成果
                </div>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div>
                    <div className="text-lg font-bold text-accent">
                      {achievements.totalSessions}
                    </div>
                    <div className="text-[10px] text-muted">回ロープレ</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-accent">
                      {achievements.bestScore}
                    </div>
                    <div className="text-[10px] text-muted">最高スコア</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-accent">
                      {scoreTrendLabel || "-"}
                    </div>
                    <div className="text-[10px] text-muted">スコア推移</div>
                  </div>
                </div>
              </div>
            )}

            {/* CTAボタン */}
            <div className="flex flex-col gap-3">
              <button
                onClick={handleAcceptOffer}
                disabled={isLoading}
                className="flex h-12 w-full items-center justify-center rounded-xl bg-accent text-base font-bold text-white transition hover:bg-accent-hover disabled:opacity-60"
              >
                {isLoading
                  ? "処理中..."
                  : offer.type === "pause"
                    ? "一時停止する"
                    : offer.type === "coaching"
                      ? "もう一度ロープレで試す"
                      : offer.type === "generic"
                        ? "フィードバックを送信する"
                        : "特別価格で続ける"}
              </button>
              <button
                onClick={handleRejectOffer}
                className="text-sm text-muted transition hover:text-foreground"
              >
                それでも解約する
              </button>
            </div>
          </>
        )}

        {/* Step 3: 一時停止確認 */}
        {step === 3 && (
          <>
            <h2 className="mb-2 text-center text-lg font-bold">
              一時停止の確認
            </h2>
            <div className="mb-6 rounded-xl border border-accent/30 bg-accent/5 p-5">
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted">停止期間</span>
                  <span className="font-medium">{pauseMonths}ヶ月間</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted">自動再開日</span>
                  <span className="font-medium">
                    {new Date(
                      Date.now() + pauseMonths * 30 * 24 * 60 * 60 * 1000
                    ).toLocaleDateString("ja-JP")}
                    頃
                  </span>
                </div>
                <div className="border-t border-card-border pt-3 text-xs text-muted">
                  再開日の3日前にメールでお知らせします。
                  いつでも手動で再開することも可能です。
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={handleConfirmPause}
                disabled={isLoading}
                className="flex h-12 w-full items-center justify-center rounded-xl bg-accent text-base font-bold text-white transition hover:bg-accent-hover disabled:opacity-60"
              >
                {isLoading ? "処理中..." : "一時停止を確定する"}
              </button>
              <button
                onClick={() => setStep(2)}
                className="text-sm text-muted transition hover:text-foreground"
              >
                戻る
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
