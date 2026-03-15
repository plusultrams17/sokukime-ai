/**
 * Paywall cooldown logic to prevent over-showing upgrade modals.
 *
 * Rules:
 * - Same modal: max once per 24 hours
 * - After 3 consecutive dismissals: 7-day cooldown
 * - Don't show before first roleplay completion
 */

const STORAGE_KEY = "seiyaku-paywall-cooldown";

interface CooldownData {
  /** Timestamps of recent dismissals */
  dismissals: number[];
  /** Last shown timestamp per trigger type */
  lastShown: Record<string, number>;
  /** Number of consecutive dismissals without upgrade */
  consecutiveDismissals: number;
  /** Cooldown until timestamp (7-day rest after 3 dismissals) */
  cooldownUntil?: number;
}

const COOLDOWN_HOURS = 24;
const DISMISS_THRESHOLD = 3;
const LONG_COOLDOWN_DAYS = 7;

function getData(): CooldownData {
  if (typeof window === "undefined") {
    return { dismissals: [], lastShown: {}, consecutiveDismissals: 0 };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return { dismissals: [], lastShown: {}, consecutiveDismissals: 0 };
}

function saveData(data: CooldownData) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore
  }
}

/**
 * Check if a paywall can be shown for the given trigger type.
 */
export function canShowPaywall(trigger: string): boolean {
  const data = getData();
  const now = Date.now();

  // Check long cooldown (7 days after 3 dismissals)
  if (data.cooldownUntil && now < data.cooldownUntil) {
    return false;
  }

  // Check per-trigger 24h cooldown
  const lastShown = data.lastShown[trigger];
  if (lastShown && now - lastShown < COOLDOWN_HOURS * 60 * 60 * 1000) {
    return false;
  }

  return true;
}

/**
 * Record that a paywall was shown.
 */
export function recordPaywallShown(trigger: string) {
  const data = getData();
  data.lastShown[trigger] = Date.now();
  saveData(data);
}

/**
 * Record that a paywall was dismissed (user closed without upgrading).
 */
export function recordPaywallDismissed() {
  const data = getData();
  const now = Date.now();

  data.dismissals.push(now);
  data.consecutiveDismissals += 1;

  // If threshold reached, set 7-day cooldown
  if (data.consecutiveDismissals >= DISMISS_THRESHOLD) {
    data.cooldownUntil = now + LONG_COOLDOWN_DAYS * 24 * 60 * 60 * 1000;
    data.consecutiveDismissals = 0; // Reset counter
  }

  saveData(data);
}

/**
 * Reset cooldown state (e.g., after user upgrades).
 */
export function resetPaywallCooldown() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
