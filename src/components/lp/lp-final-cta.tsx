import Link from "next/link";
import { LpMorphBtn } from "./lp-morph-btn";

interface TrustBadge {
  icon: React.ReactNode;
  text: string;
}

interface LpFinalCtaProps {
  heading: string;
  subtext: string;
  trustText: string;
  ctaText: string;
  ctaHref: string;
  trustBadges: TrustBadge[];
}

export function LpFinalCta({
  heading,
  subtext,
  trustText,
  ctaText,
  ctaHref,
  trustBadges,
}: LpFinalCtaProps) {
  return (
    <section className="relative overflow-hidden px-6 py-16 sm:py-24">
      <div
        className="blob blob-teal"
        style={{ width: 400, height: 400, top: -100, left: "30%" }}
      />
      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <h2
          className="mb-4 text-2xl font-bold text-foreground sm:text-3xl"
          style={{ textWrap: "balance" } as React.CSSProperties}
        >
          {heading}
        </h2>
        <p className="mb-4 text-sm text-muted sm:text-base">{subtext}</p>
        <p className="mb-10 text-sm text-muted">{trustText}</p>
        <div className="flex flex-col items-center gap-4">
          <LpMorphBtn text={ctaText} href={ctaHref} />
        </div>
        <div className="mt-6">
          <Link
            href="/pricing"
            className="text-sm text-muted transition hover:text-accent hover:underline"
          >
            料金プランを見る →
          </Link>
        </div>

        {/* Trust badges */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4 text-xs text-muted sm:gap-6">
          {trustBadges.map((badge) => (
            <span
              key={typeof badge.text === "string" ? badge.text : ""}
              className="inline-flex items-center gap-1.5"
            >
              {badge.icon}
              {badge.text}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
