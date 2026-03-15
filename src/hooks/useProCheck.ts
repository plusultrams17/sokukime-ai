"use client";

import { useState, useEffect } from "react";

const CACHE_KEY = "seiyaku-pro-status";
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

interface CachedStatus {
  isPro: boolean;
  checkedAt: number;
}

/**
 * Lightweight hook to check if the current user is a Pro subscriber.
 * Caches result in sessionStorage for 5 minutes to avoid repeated API calls.
 * Returns `null` while loading, `true`/`false` once resolved.
 */
export function useProCheck(): boolean | null {
  const [isPro, setIsPro] = useState<boolean | null>(null);

  useEffect(() => {
    // Check cache first
    try {
      const raw = sessionStorage.getItem(CACHE_KEY);
      if (raw) {
        const cached: CachedStatus = JSON.parse(raw);
        if (Date.now() - cached.checkedAt < CACHE_TTL) {
          setIsPro(cached.isPro);
          return;
        }
      }
    } catch {
      // ignore parse errors
    }

    // Fetch from API
    fetch("/api/usage")
      .then((r) => {
        if (!r.ok) {
          // Not logged in or error — treat as non-Pro
          setIsPro(false);
          return;
        }
        return r.json();
      })
      .then((data) => {
        if (!data) return;
        const pro = data.plan === "pro";
        setIsPro(pro);
        try {
          sessionStorage.setItem(
            CACHE_KEY,
            JSON.stringify({ isPro: pro, checkedAt: Date.now() }),
          );
        } catch {
          // quota error
        }
      })
      .catch(() => {
        setIsPro(false);
      });
  }, []);

  return isPro;
}
