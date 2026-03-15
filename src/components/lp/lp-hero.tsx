import Link from "next/link";
import { LpMorphBtn } from "./lp-morph-btn";

interface LpHeroProps {
  badgeText: string;
  badgeIcon?: React.ReactNode;
  headlineTop: string;
  headlineAccent: string;
  seoH1: string;
  subheadline: string;
  ctaText: string;
  ctaHref: string;
  trustText: string;
  stats: Array<{ value: string; label: string }>;
  secondaryLink?: { text: string; href: string };
}

export function LpHero({
  badgeText,
  badgeIcon,
  headlineTop,
  headlineAccent,
  seoH1,
  subheadline,
  ctaText,
  ctaHref,
  trustText,
  stats,
  secondaryLink,
}: LpHeroProps) {
  return (
    <section className="relative overflow-hidden px-6 pt-24 pb-16 sm:pt-32 sm:pb-24">
      {/* Decorative blobs */}
      <div
        className="blob blob-teal"
        style={{ width: 350, height: 350, top: -80, right: -100 }}
      />
      <div
        className="blob blob-cream"
        style={{ width: 250, height: 250, bottom: -60, left: -80 }}
      />

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        {/* Badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent">
          {badgeIcon || (
            <svg
              className="h-4 w-4 text-yellow-500 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          )}
          {badgeText}
        </div>

        {/* SEO h1 (screen-reader only) */}
        <h1 className="sr-only">{seoH1}</h1>

        {/* Visual headline */}
        <p
          className="mb-6 text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl"
          role="presentation"
          style={{ textWrap: "balance" } as React.CSSProperties}
        >
          {headlineTop}
          <br />
          <span className="text-accent">{headlineAccent}</span>
        </p>

        {/* Subheadline */}
        <p className="mx-auto mb-10 max-w-2xl text-base text-muted leading-relaxed sm:text-lg">
          {subheadline}
        </p>

        {/* CTA */}
        <div className="flex flex-col items-center gap-4" data-hero-cta>
          <LpMorphBtn text={ctaText} href={ctaHref} />
          <p className="text-sm text-muted">{trustText}</p>
        </div>

        {/* Secondary link */}
        {secondaryLink && (
          <p className="mt-4 text-sm text-muted">
            <Link
              href={secondaryLink.href}
              className="underline decoration-muted/40 underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
            >
              {secondaryLink.text}
            </Link>
          </p>
        )}

        {/* Stats */}
        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border border-card-border bg-white p-5 sm:p-6"
            >
              <div className="text-2xl font-bold text-accent sm:text-3xl">
                {s.value}
              </div>
              <div className="mt-1 text-sm text-muted">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
