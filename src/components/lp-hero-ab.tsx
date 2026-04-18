"use client";

import { useEffect, useState } from "react";

/**
 * LP Hero A/B Test Component
 *
 * Renders different headline variants based on hash-based assignment.
 * Variants can be configured via `lp_hero` AB test in Supabase,
 * or uses client-side cookie-based assignment as fallback.
 *
 * This is lightweight — no API call needed for the default variants.
 */

interface HeroVariant {
  headline: React.ReactNode;
  subheadline: React.ReactNode;
}

const VARIANTS: Record<string, HeroVariant> = {
  // Phase 2A改修: 3ペルソナ（新人/中堅/経営者）すべてが対象と読める表現へ
  // 従来は「新人向け」に読める狭さが課題だったため、"営業に関わるすべての人"
  // が自分ゴトとして受け取れる抽象度に調整。景表法配慮で「〜できる」と表現。
  control: {
    headline: (
      <>
        営業の型を、AIで。
        <br />
        <span className="lp-highlight-hero">新人から経営者まで、成約力を底上げ。</span>
      </>
    ),
    subheadline: (
      <>
        AIロープレ + 5カテゴリ採点 + 22レッスンで、営業スキルを客観視。
        <br />
        個人の練習から、チーム全体の底上げまで。
      </>
    ),
  },
  variant_b: {
    headline: (
      <>
        <span className="block whitespace-nowrap"><span className="lp-highlight-hero">AIが営業トークを5カテゴリで採点。</span></span>
        <span className="block whitespace-nowrap">弱点が見えれば、伸びしろになる。</span>
      </>
    ),
    subheadline: (
      <>
        若手は基礎を、中堅は客観評価を、経営者はチーム育成を。
        <br />
        営業に関わるすべての人のためのコーチAI。
      </>
    ),
  },
};

function getOrAssignVariant(): string {
  if (typeof document === "undefined") return "control";

  // Check cookie
  const match = document.cookie.match(/lp_hero_variant=(\w+)/);
  if (match && VARIANTS[match[1]]) return match[1];

  // Assign randomly (50/50)
  const variant = Math.random() < 0.5 ? "control" : "variant_b";
  document.cookie = `lp_hero_variant=${variant};path=/;max-age=${60 * 60 * 24 * 30}`;

  return variant;
}

export function LPHeroAB() {
  const [variant, setVariant] = useState<string>("control");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setVariant(getOrAssignVariant());
    setReady(true);
  }, []);

  const v = VARIANTS[variant] || VARIANTS.control;

  return (
    <>
      {/* Main heading */}
      <p
        className={`lp-heading mb-5 leading-[1.3] text-white sm:mb-7 transition-opacity duration-300 ${ready ? "opacity-100" : "opacity-0"}`}
        style={{
          fontSize: "clamp(16px, 5.5vw, 52px)",
          textShadow: "0 2px 20px rgba(0,0,0,0.3)",
        }}
      >
        {v.headline}
      </p>

      {/* Sub heading */}
      <p
        className={`mx-auto mb-10 max-w-lg text-sm leading-relaxed sm:mb-12 sm:text-base lg:text-lg transition-opacity duration-300 ${ready ? "opacity-100" : "opacity-0"}`}
        style={{
          color: "rgba(255,255,255,0.85)",
          textShadow: "0 1px 8px rgba(0,0,0,0.2)",
        }}
      >
        {v.subheadline}
      </p>

      {/* Hidden tracking pixel for variant */}
      {ready && (
        <span
          data-ab-test="lp_hero"
          data-ab-variant={variant}
          className="sr-only"
          aria-hidden="true"
        />
      )}
    </>
  );
}
