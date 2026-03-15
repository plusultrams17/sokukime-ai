"use client";

import Link from "next/link";
import { ExitIntentPopup } from "@/components/exit-intent-popup";
import { markPopupDismissed } from "@/lib/popup-rules";

const POPUP_ID = "pricing-exit";

/**
 * Pricing page exit-intent popup — fires after 30+ seconds on page.
 *
 * Psychology: Foot-in-the-Door + Regret Aversion
 * - Redirects to free roleplay instead of paid checkout (Foot-in-the-Door —
 *   small initial commitment leads to larger ones later)
 * - "まだ迷っていますか？" acknowledges hesitation with empathy
 * - Testimonial provides social proof (Bandwagon Effect)
 * - "気に入らなければ、それまでです" reduces Regret Aversion
 */
export function PricingExitPopup() {
  return (
    <ExitIntentPopup
      popupId={POPUP_ID}
      headingId="pricing-exit-heading"
      cooldownDays={7}
      desktopMinStayMs={30000}
      mobileMinStayMs={30000}
    >
      {({ dismiss }) => (
        <>
          {/* Headline — empathetic acknowledgment */}
          <h2
            id="pricing-exit-heading"
            className="mb-2 text-center text-xl font-bold text-foreground"
          >
            まだ迷っていますか？
          </h2>

          {/* Body — Foot-in-the-Door: offer free first */}
          <p className="mb-5 text-center text-sm text-muted">
            まずは無料で1回試してみてください。
            <br />
            気に入らなければ、それまでです。
          </p>

          {/* Testimonial — Social Proof */}
          <div className="mb-6 rounded-xl border border-card-border bg-background p-4">
            <div className="mb-3 flex items-start justify-between">
              <div>
                <p className="text-sm font-bold text-foreground">T.S.</p>
                <p className="text-xs text-muted">不動産営業 / 入社2年目</p>
              </div>
              <div className="flex flex-col items-center rounded-lg bg-accent/10 px-2.5 py-1">
                <span className="text-[10px] text-muted">スコア</span>
                <span className="text-base font-bold text-accent">78</span>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-muted">
              &ldquo;毎日練習できるから、クロージングに自信がついた。&rdquo;
            </p>
          </div>

          {/* Risk removal */}
          <p className="mb-4 text-center text-xs text-muted">
            &#10003; 登録不要　&#10003; 完全無料　&#10003; 60秒で開始
          </p>

          {/* CTA — free roleplay (NOT paid checkout) */}
          <Link
            href="/roleplay"
            className="flex h-12 w-full items-center justify-center rounded-xl bg-accent text-base font-bold text-white transition hover:bg-accent-hover"
            onClick={() => markPopupDismissed(POPUP_ID)}
          >
            無料でAIロープレを体験
          </Link>

          {/* Decline */}
          <button
            onClick={dismiss}
            className="mt-4 block w-full text-center text-sm text-muted transition hover:text-foreground"
          >
            もう少し検討する
          </button>
        </>
      )}
    </ExitIntentPopup>
  );
}
