"use client";

import { ExitIntentPopup } from "@/components/exit-intent-popup";

const POPUP_ID = "worksheet-exit";

interface WorksheetExitPopupProps {
  progressPercent: number;
  filledCount: number;
  totalCount: number;
}

/**
 * Worksheet exit-intent popup — fires when user has 1+ items filled.
 *
 * Psychology: Loss Aversion + Goal-Gradient Effect
 * - "保存されていません" triggers fear of losing work (Loss Aversion —
 *   losses feel ~2x more painful than equivalent gains)
 * - Progress bar + "あとX項目" shows proximity to goal (Goal-Gradient —
 *   people accelerate effort as they approach completion)
 * - "自動保存されています" reassurance on decline reduces regret anxiety
 */
export function WorksheetExitPopup({
  progressPercent,
  filledCount,
  totalCount,
}: WorksheetExitPopupProps) {
  return (
    <ExitIntentPopup
      popupId={POPUP_ID}
      headingId="worksheet-exit-heading"
      extraCondition={filledCount > 0}
    >
      {({ close, dismiss }) => (
        <>
          {/* Icon — warning triangle */}
          <div className="mb-4 text-center" aria-hidden="true">
            <svg
              className="mx-auto h-14 w-14 text-amber-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
              />
            </svg>
          </div>

          {/* Headline — Loss Aversion */}
          <h2
            id="worksheet-exit-heading"
            className="mb-2 text-center text-xl font-bold text-foreground"
          >
            入力データが保存されていません
          </h2>

          {/* Body — Goal-Gradient: emphasize remaining */}
          <p className="mb-4 text-center text-sm text-muted">
            あと{" "}
            <span className="font-bold text-accent">
              {totalCount - filledCount}項目
            </span>{" "}
            でAIがトークスクリプトを自動生成します！
          </p>

          {/* Progress bar — Goal-Gradient visualization */}
          <div className="mb-6 rounded-xl border border-card-border bg-background p-4">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="font-medium text-foreground">完了</span>
              <span className="font-bold text-accent">
                {filledCount}/{totalCount} 項目
              </span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-card-border">
              <div
                className="h-full rounded-full bg-accent transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="mt-2 text-center text-xs text-muted">
              {progressPercent}% 完了
            </p>
          </div>

          {/* Primary CTA — stay on page (close without cooldown) */}
          <button
            onClick={close}
            className="flex h-12 w-full items-center justify-center rounded-xl bg-accent text-base font-bold text-white transition hover:bg-accent-hover"
          >
            続きを入力する
          </button>

          {/* Secondary — save and leave (dismiss with cooldown) */}
          <button
            onClick={dismiss}
            className="mt-4 block w-full text-center text-sm text-muted transition hover:text-foreground"
          >
            保存して後で続ける
          </button>
          <p className="mt-1 text-center text-[11px] text-muted">
            &#10003; 入力データは自動保存されています
          </p>
        </>
      )}
    </ExitIntentPopup>
  );
}
