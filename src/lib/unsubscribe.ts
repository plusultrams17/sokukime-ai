import crypto from "crypto";

const UNSUBSCRIBE_SECRET = process.env.UNSUBSCRIBE_SECRET || process.env.CRON_SECRET || "seiyaku-unsub-default";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://seiyaku-coach.vercel.app";

/**
 * Generate HMAC token for unsubscribe link.
 */
export function generateUnsubscribeToken(userId: string): string {
  return crypto
    .createHmac("sha256", UNSUBSCRIBE_SECRET)
    .update(userId)
    .digest("hex")
    .slice(0, 32);
}

/**
 * Generate full unsubscribe URL for a user.
 */
export function getUnsubscribeUrl(userId: string): string {
  const token = generateUnsubscribeToken(userId);
  return `${APP_URL}/api/unsubscribe?uid=${userId}&token=${token}`;
}
