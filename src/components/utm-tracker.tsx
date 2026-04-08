"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const;

function UTMTrackerInner() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const params: Record<string, string> = {};
    let hasUTM = false;

    for (const key of UTM_KEYS) {
      const value = searchParams.get(key);
      if (value) {
        params[key] = value;
        hasUTM = true;
      }
    }

    if (!hasUTM) return;

    // Store in sessionStorage for attribution
    try {
      const existing = sessionStorage.getItem("utm_params");
      if (!existing) {
        sessionStorage.setItem("utm_params", JSON.stringify(params));
      }
    } catch {
      // sessionStorage unavailable
    }

    // Send to GA4
    if (window.gtag) {
      window.gtag("event", "utm_landing", params);
    }
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: "utm_landing", ...params });
  }, [searchParams]);

  return null;
}

export function UTMTracker() {
  return (
    <Suspense>
      <UTMTrackerInner />
    </Suspense>
  );
}

/** Retrieve stored UTM params (for passing to checkout, signup, etc.) */
export function getStoredUTM(): Record<string, string> {
  try {
    const raw = sessionStorage.getItem("utm_params");
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}
