"use client";

import Link from "next/link";
import { ExitIntentPopup } from "@/components/exit-intent-popup";
import { markPopupDismissed } from "@/lib/popup-rules";

const POPUP_ID = "blog-exit";

/**
 * Blog article exit-intent popup.
 *
 * Psychology: Knowledge Gap + Commitment Consistency
 * - Reader already invested time reading → "せっかく学んだのに" leverages sunk cost
 * - "実践してみませんか？" bridges knowledge→action gap
 * - Free + low-effort CTA reduces friction
 */
export function BlogExitPopup() {
  return (
    <ExitIntentPopup popupId={POPUP_ID} headingId="blog-exit-heading">
      {({ dismiss }) => (
        <>
          {/* Icon */}
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
                d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.58-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"
              />
            </svg>
          </div>

          {/* Headline */}
          <h2
            id="blog-exit-heading"
            className="mb-2 text-center text-xl font-bold text-foreground"
          >
            読んだだけでは身につきません
          </h2>

          {/* Body */}
          <p className="mb-2 text-center text-sm text-muted">
            記事で学んだテクニックをAIロープレで実践してみませんか？
            <br />
            3分で営業スコアがわかります。
          </p>

          {/* Trust badges */}
          <p className="mb-6 text-center text-xs text-muted">
            &#10003; 無料　&#10003; 登録不要で体験OK　&#10003; 24時間対応
          </p>

          {/* CTA */}
          <Link
            href="/roleplay"
            className="flex h-12 w-full items-center justify-center rounded-xl bg-accent text-base font-bold text-white transition hover:bg-accent-hover"
            onClick={() => markPopupDismissed(POPUP_ID)}
          >
            無料でAIロープレを試す &rarr;
          </Link>

          {/* Learn link */}
          <Link
            href="/learn"
            className="mt-3 block w-full text-center text-sm font-medium text-accent transition hover:underline"
            onClick={() => markPopupDismissed(POPUP_ID)}
          >
            まず営業の型を学ぶ &rarr;
          </Link>

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
