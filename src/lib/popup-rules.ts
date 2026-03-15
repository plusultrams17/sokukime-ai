/**
 * Popup display rules — localStorage + sessionStorage based
 * Controls cooldowns, session limits, and conversion exclusion.
 */

const STORAGE_PREFIX = "seiyaku-popup-";
const SESSION_KEY = "seiyaku-popup-session";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

/** Check if a popup can be shown (cooldown + session limit) */
export function canShowPopup(popupId: string, cooldownDays = 7): boolean {
  if (!isBrowser()) return false;

  try {
    // Session limit: max 1 popup per session
    if (hasShownPopupThisSession()) return false;

    // Cooldown: check last dismiss timestamp
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${popupId}-dismissed`);
    if (raw) {
      const { dismissedAt } = JSON.parse(raw) as { dismissedAt: number };
      const cooldownMs = cooldownDays * 24 * 60 * 60 * 1000;
      if (Date.now() - dismissedAt < cooldownMs) return false;
    }

    return true;
  } catch {
    return false;
  }
}

/** Record that a popup was dismissed (starts cooldown) */
export function markPopupDismissed(popupId: string): void {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(
      `${STORAGE_PREFIX}${popupId}-dismissed`,
      JSON.stringify({ dismissedAt: Date.now() }),
    );
  } catch {
    // quota error — silently fail
  }
}

/** Record that a popup was shown this session */
export function markPopupShownInSession(): void {
  if (!isBrowser()) return;
  try {
    sessionStorage.setItem(SESSION_KEY, "true");
  } catch {
    // silently fail
  }
}

/** Check if any popup was already shown this session */
export function hasShownPopupThisSession(): boolean {
  if (!isBrowser()) return false;
  try {
    return sessionStorage.getItem(SESSION_KEY) === "true";
  } catch {
    return false;
  }
}

/** Check if a slide-in was already shown this session */
export function hasShownSlideInThisSession(sessionKey: string): boolean {
  if (!isBrowser()) return false;
  try {
    return sessionStorage.getItem(`seiyaku-slidein-${sessionKey}`) === "true";
  } catch {
    return false;
  }
}

/** Mark a slide-in as shown this session */
export function markSlideInShownInSession(sessionKey: string): void {
  if (!isBrowser()) return;
  try {
    sessionStorage.setItem(`seiyaku-slidein-${sessionKey}`, "true");
  } catch {
    // silently fail
  }
}
