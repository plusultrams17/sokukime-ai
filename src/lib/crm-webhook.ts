import { SupabaseClient } from "@supabase/supabase-js";

/**
 * CRM Webhook Integration
 *
 * Sends lifecycle events to an external CRM (Salesforce, HubSpot, etc.)
 * via configurable webhook URL. Events are logged for audit/retry.
 *
 * Configure via environment variable:
 *   CRM_WEBHOOK_URL - The endpoint to POST events to
 *   CRM_WEBHOOK_SECRET - Shared secret for HMAC signature
 */

export type CRMEventType =
  | "user.signup"
  | "user.pro_conversion"
  | "user.cancellation"
  | "user.payment_failed"
  | "user.payment_recovered"
  | "user.trial_started"
  | "user.trial_expired"
  | "user.at_risk"
  | "user.reactivation"
  | "user.program_purchased";

export interface CRMEventPayload {
  event: CRMEventType;
  timestamp: string;
  user: {
    id: string;
    email: string;
    plan: string;
    created_at?: string;
  };
  metadata?: Record<string, unknown>;
}

/**
 * Generate HMAC-SHA256 signature for webhook payload.
 */
async function generateSignature(payload: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  return Array.from(new Uint8Array(signature))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Send a lifecycle event to the configured CRM webhook.
 * Logs all attempts to crm_webhook_logs for audit/retry.
 */
export async function sendCRMEvent(
  supabase: SupabaseClient,
  event: CRMEventType,
  userId: string,
  email: string,
  plan: string,
  metadata?: Record<string, unknown>
): Promise<boolean> {
  const webhookUrl = process.env.CRM_WEBHOOK_URL;
  if (!webhookUrl) return false; // CRM not configured

  const payload: CRMEventPayload = {
    event,
    timestamp: new Date().toISOString(),
    user: { id: userId, email, plan },
    metadata,
  };

  const body = JSON.stringify(payload);

  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    const secret = process.env.CRM_WEBHOOK_SECRET;
    if (secret) {
      headers["X-Webhook-Signature"] = await generateSignature(body, secret);
    }

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers,
      body,
      signal: AbortSignal.timeout(10000), // 10s timeout
    });

    await supabase.from("crm_webhook_logs").insert({
      event_type: event,
      user_id: userId,
      payload,
      status: response.ok ? "sent" : "failed",
      response_code: response.status,
      error_message: response.ok ? null : `HTTP ${response.status}`,
    });

    return response.ok;
  } catch (err) {
    await supabase.from("crm_webhook_logs").insert({
      event_type: event,
      user_id: userId,
      payload,
      status: "failed",
      error_message: err instanceof Error ? err.message : "Unknown error",
    });
    return false;
  }
}

/**
 * Get recent CRM webhook logs for admin monitoring.
 */
export async function getCRMWebhookLogs(
  supabase: SupabaseClient,
  limit = 50
) {
  const { data } = await supabase
    .from("crm_webhook_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  return data || [];
}
