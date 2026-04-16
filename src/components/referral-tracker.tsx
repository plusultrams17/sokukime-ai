"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";

function ReferralTrackerInner() {
  const searchParams = useSearchParams();
  useEffect(() => {
    const ref = searchParams.get("ref");
    if (ref) {
      localStorage.setItem("referral_code", ref.toUpperCase());
    }
  }, [searchParams]);
  return null;
}

export function ReferralTracker() {
  return (
    <Suspense fallback={null}>
      <ReferralTrackerInner />
    </Suspense>
  );
}
