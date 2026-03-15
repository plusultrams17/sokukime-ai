"use client";

import Link from "next/link";
import { ExitIntentPopup } from "@/components/exit-intent-popup";
import { markPopupDismissed } from "@/lib/popup-rules";

const POPUP_ID = "home-exit";

/**
 * Homepage exit-intent popup.
 *
 * Psychology: Curiosity Gap + Zero-Price Effect
 * - "何点か知っていますか？" opens an information gap the visitor feels compelled to close
 * - "完全無料" leverages the irrational power of zero price (Zero-Price Effect)
 * - Social proof number triggers Bandwagon Effect
 */
export function HomeExitPopup() {
  return (
    <ExitIntentPopup popupId={POPUP_ID} headingId="home-exit-heading">
      {({ dismiss }) => (
        <>
          {/* Icon — diagnostic badge */}
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
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </div>

          {/* Headline — Curiosity Gap */}
          <h2
            id="home-exit-heading"
            className="mb-2 text-center text-xl font-bold text-foreground"
          >
            あなたの営業力、何点か知っていますか？
          </h2>

          {/* Body — specific promise */}
          <p className="mb-2 text-center text-sm text-muted">
            たった3分のAIロープレで、5項目のスコアがわかります。
          </p>

          {/* Trust badges — Zero-Price Effect */}
          <p className="mb-6 text-center text-xs text-muted">
            &#10003; 登録不要　&#10003; 完全無料
          </p>

          {/* CTA */}
          <Link
            href="/roleplay"
            className="flex h-12 w-full items-center justify-center rounded-xl bg-accent text-base font-bold text-white transition hover:bg-accent-hover"
            onClick={() => markPopupDismissed(POPUP_ID)}
          >
            無料で営業力を診断する &rarr;
          </Link>

          {/* Social proof — Bandwagon Effect */}
          <p className="mt-3 text-center text-xs text-muted">
            今月 128人 が営業力診断を受けました
          </p>

          {/* Decline */}
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
