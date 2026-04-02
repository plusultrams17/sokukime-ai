/**
 * Simple in-memory sliding-window rate limiter.
 * No external dependencies. Best-effort on serverless (per-container).
 */

interface RateLimitEntry {
  timestamps: number[];
}

const store = new Map<string, RateLimitEntry>();
let lastCleanup = Date.now();

function cleanup(windowMs: number) {
  const now = Date.now();
  if (now - lastCleanup < 60_000) return;
  lastCleanup = now;
  const cutoff = now - windowMs;
  for (const [key, entry] of store) {
    entry.timestamps = entry.timestamps.filter((t) => t > cutoff);
    if (entry.timestamps.length === 0) store.delete(key);
  }
}

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetMs: number;
}

export function checkRateLimit(
  key: string,
  maxRequests: number,
  windowMs: number = 60_000
): RateLimitResult {
  cleanup(windowMs);
  const now = Date.now();
  const cutoff = now - windowMs;

  let entry = store.get(key);
  if (!entry) {
    entry = { timestamps: [] };
    store.set(key, entry);
  }

  entry.timestamps = entry.timestamps.filter((t) => t > cutoff);

  if (entry.timestamps.length >= maxRequests) {
    return {
      success: false,
      remaining: 0,
      resetMs: entry.timestamps[0] + windowMs - now,
    };
  }

  entry.timestamps.push(now);
  return {
    success: true,
    remaining: maxRequests - entry.timestamps.length,
    resetMs: windowMs,
  };
}
