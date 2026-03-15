"use client";

import Link from "next/link";
import { ExitIntentPopup } from "@/components/exit-intent-popup";
import { markPopupDismissed } from "@/lib/popup-rules";

const POPUP_ID = "roleplay-lp-exit";

/**
 * Roleplay landing page exit-intent popup.
 * Uses shared ExitIntentPopup with Pro exclusion + session/cooldown rules.
 */
export function RoleplayLpExitPopup() {
  return (
    <ExitIntentPopup popupId={POPUP_ID} headingId="roleplay-lp-exit-heading">
      {({ dismiss }) => (
        <>
          <div className="mb-4 text-center" aria-hidden="true">
            <svg
              className="mx-auto h-14 w-14 text-accent"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
              />
            </svg>
          </div>

          <h2
            id="roleplay-lp-exit-heading"
            className="mb-2 text-center text-xl font-bold text-foreground"
          >
            営業ロープレ、やらずに帰りますか？
          </h2>

          <p className="mb-2 text-center text-sm text-muted">
            たった3分でAIがあなたの営業力を5項目で採点します。
          </p>

          <p className="mb-6 text-center text-xs text-muted">
            &#10003; 登録不要　&#10003; 完全無料　&#10003; 60秒で開始
          </p>

          <Link
            href="/roleplay"
            className="flex h-12 w-full items-center justify-center rounded-xl bg-accent text-base font-bold text-white transition hover:bg-accent-hover"
            onClick={() => markPopupDismissed(POPUP_ID)}
          >
            無料でAIとロープレする
          </Link>

          <p className="mt-3 text-center text-xs text-muted">
            今月 128人 がAIロープレを体験しました
          </p>

          <button
            onClick={dismiss}
            className="mt-4 block w-full text-center text-sm text-muted transition hover:text-foreground"
          >
            今はやめておく
          </button>
        </>
      )}
    </ExitIntentPopup>
  );
}
