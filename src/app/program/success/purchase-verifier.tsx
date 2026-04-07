"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

type VerifyStatus = "verifying" | "verified" | "error";

/**
 * Verifies Stripe checkout session on mount.
 * Creates purchase record if webhook missed it.
 * Blocks CTA until verification is complete.
 */
export function PurchaseVerifier({
  children,
}: {
  children: (status: VerifyStatus) => React.ReactNode;
}) {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [status, setStatus] = useState<VerifyStatus>(
    sessionId ? "verifying" : "verified",
  );

  useEffect(() => {
    if (!sessionId) return;

    let attempt = 0;
    const maxAttempts = 3;

    async function verify() {
      while (attempt < maxAttempts) {
        try {
          const res = await fetch("/api/program/verify-purchase", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ session_id: sessionId }),
          });
          if (res.ok) {
            setStatus("verified");
            return;
          }
          // 401 = not logged in, don't retry
          if (res.status === 401) {
            setStatus("error");
            return;
          }
        } catch {
          // Network error, will retry
        }
        attempt++;
        if (attempt < maxAttempts) {
          await new Promise((r) => setTimeout(r, 1000 * attempt));
        }
      }
      setStatus("error");
    }

    verify();
  }, [sessionId]);

  return <>{children(status)}</>;
}
