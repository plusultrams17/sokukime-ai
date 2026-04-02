/**
 * GA4 Event Tracking Utility
 * Centralized tracking functions for all custom events.
 * Uses dataLayer.push for GTM compatibility + direct gtag fallback.
 */

// ─── Core ────────────────────────────────────────────

function pushEvent(eventName: string, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;

  // dataLayer push (GTM)
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: eventName, ...params });

  // Direct gtag fallback
  if (window.gtag) {
    window.gtag("event", eventName, params);
  }
}

// ─── CTA Clicks ──────────────────────────────────────

export function trackCTAClick(
  ctaName: string,
  ctaLocation: string,
  ctaDestination: string = ""
) {
  pushEvent("cta_clicked", {
    cta_name: ctaName,
    cta_location: ctaLocation,
    cta_destination: ctaDestination,
  });
}

// ─── Roleplay Flow ───────────────────────────────────

export function trackRoleplaySetup(params: {
  product: string;
  customerType: string;
  industry: string;
  scene: string;
  difficulty: string;
}) {
  pushEvent("roleplay_setup_completed", {
    product: params.product,
    customer_type: params.customerType,
    industry: params.industry,
    scene: params.scene,
    difficulty: params.difficulty,
  });
}

export function trackRoleplayMessage(turnNumber: number, messageLength: number) {
  pushEvent("roleplay_message_sent", {
    turn_number: turnNumber,
    message_length: messageLength,
  });
}

export function trackRoleplayCoachToggled(coachVisible: boolean) {
  pushEvent("roleplay_coach_toggled", {
    coach_visible: coachVisible,
  });
}

export function trackRoleplayScoreRequested(totalTurns: number, durationSeconds: number) {
  pushEvent("roleplay_score_requested", {
    total_turns: totalTurns,
    duration_seconds: durationSeconds,
  });
}

export function trackRoleplayCompleted(params: {
  totalScore: number;
  scoreApproach?: number;
  scoreHearing?: number;
  scorePresentation?: number;
  scoreClosing?: number;
  scoreObjection?: number;
  difficulty: string;
  totalTurns: number;
  durationSeconds: number;
}) {
  pushEvent("roleplay_completed", {
    total_score: params.totalScore,
    score_approach: params.scoreApproach,
    score_hearing: params.scoreHearing,
    score_presentation: params.scorePresentation,
    score_closing: params.scoreClosing,
    score_objection: params.scoreObjection,
    difficulty: params.difficulty,
    total_turns: params.totalTurns,
    duration_seconds: params.durationSeconds,
  });
}

// ─── Worksheet Flow ──────────────────────────────────

export function trackWorksheetStarted(industry: string) {
  pushEvent("worksheet_started", { industry });
}

export function trackWorksheetPhaseStarted(phaseNumber: number, phaseName: string) {
  pushEvent("worksheet_phase_started", {
    phase_number: phaseNumber,
    phase_name: phaseName,
  });
}

export function trackWorksheetAIGenerated(phaseNumber: number, phaseName: string) {
  pushEvent("worksheet_ai_generated", {
    phase_number: phaseNumber,
    phase_name: phaseName,
  });
}

export function trackWorksheetPhaseCompleted(
  phaseNumber: number,
  phaseName: string
) {
  pushEvent("worksheet_phase_completed", {
    phase_number: phaseNumber,
    phase_name: phaseName,
  });
}

export function trackWorksheetCompleted(industry: string) {
  pushEvent("worksheet_completed", { industry });
}

// ─── Auth ────────────────────────────────────────────

export function trackSignupStarted(method: "google" | "email") {
  pushEvent("signup_started", { method });
}

export function trackSignupCompleted(method: "google" | "email") {
  pushEvent("signup_completed", { method });
}

export function trackLoginCompleted(method: "google" | "email") {
  pushEvent("login_completed", { method });
}

// ─── Upgrade / Purchase ──────────────────────────────

export function trackUpgradeModalShown(
  triggerReason: "daily_limit" | "scorecard" | "pricing"
) {
  pushEvent("upgrade_modal_shown", {
    trigger_reason: triggerReason,
    current_plan: "free",
  });
}

export function trackCheckoutStarted() {
  pushEvent("checkout_started", {
    plan: "pro",
    price: 2980,
    currency: "JPY",
  });
}

// ─── Scroll Depth ────────────────────────────────────

const firedThresholds = new Set<string>();

export function trackScrollDepth(percent: number, pagePath: string) {
  const key = `${pagePath}_${percent}`;
  if (firedThresholds.has(key)) return;
  firedThresholds.add(key);

  pushEvent("scroll_depth", {
    percent_scrolled: percent,
    page_path: pagePath,
  });
}

export function resetScrollTracking() {
  firedThresholds.clear();
}

// ─── Engagement DB Tracking ─────────────────────────

/** GA4 + DB同時記録（fire-and-forget） */
export function trackEngagementEvent(
  eventType: string,
  metadata?: Record<string, unknown>
) {
  pushEvent(`engagement_${eventType}`, metadata || {});

  if (typeof window === "undefined") return;
  fetch("/api/engagement/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ eventType, metadata }),
  }).catch(() => {});
}

// ─── Cancel Flow ────────────────────────────────────

export function trackCancelReasonSelected(reason: string) {
  pushEvent("cancel_reason_selected", { reason });
}

export function trackCancelOfferShown(offerType: string) {
  pushEvent("cancel_offer_shown", { offer_type: offerType });
}

export function trackCancelOfferAccepted(offerType: string) {
  pushEvent("cancel_offer_accepted", { offer_type: offerType });
}

export function trackCancelOfferRejected(offerType: string) {
  pushEvent("cancel_offer_rejected", { offer_type: offerType });
}

// ─── Funnel Events (GA4 Custom) ─────────────────────

export function trackRoleplayStart(params: { industry: string; difficulty: string }) {
  pushEvent("roleplay_start", {
    industry: params.industry,
    difficulty: params.difficulty,
  });
}

export function trackRoleplayComplete(params: { industry: string; difficulty: string; totalScore?: number }) {
  pushEvent("roleplay_complete", {
    industry: params.industry,
    difficulty: params.difficulty,
    total_score: params.totalScore,
  });
}

export function trackScoreView(params: { industry: string; difficulty: string; totalScore: number }) {
  pushEvent("score_view", {
    industry: params.industry,
    difficulty: params.difficulty,
    total_score: params.totalScore,
  });
}

export function trackPricingPageView(params: { industry?: string; difficulty?: string }) {
  pushEvent("pricing_page_view", {
    industry: params.industry || "",
    difficulty: params.difficulty || "",
  });
}

export function trackCheckoutStart(params: { industry?: string; difficulty?: string; billing?: string }) {
  pushEvent("checkout_start", {
    industry: params.industry || "",
    difficulty: params.difficulty || "",
    billing: params.billing || "monthly",
    plan: "pro",
    currency: "JPY",
  });
}

export function trackCheckoutComplete(params: { industry?: string; difficulty?: string }) {
  pushEvent("checkout_complete", {
    industry: params.industry || "",
    difficulty: params.difficulty || "",
    plan: "pro",
    currency: "JPY",
  });
}

// ─── Upgrade Prompt ─────────────────────────────────

export function trackUpgradePromptShown(params: { trigger: string; industry?: string; difficulty?: string }) {
  pushEvent("upgrade_prompt_shown", {
    trigger: params.trigger,
    industry: params.industry || "",
    difficulty: params.difficulty || "",
  });
}

export function trackUpgradePromptClicked(params: { trigger: string; industry?: string; difficulty?: string }) {
  pushEvent("upgrade_prompt_clicked", {
    trigger: params.trigger,
    industry: params.industry || "",
    difficulty: params.difficulty || "",
  });
}

// ─── Referral ───────────────────────────────────────

export function trackReferralCodeCopied() {
  pushEvent("referral_code_copied");
}

export function trackReferralShareClicked(platform: string) {
  pushEvent("referral_share_clicked", { platform });
}

export function trackScoreShared(params: { platform: string; score: number; scoreId?: string }) {
  pushEvent("score_shared", params);
}

// ─── Aha Moment ─────────────────────────────────────

/**
 * Track "aha moment" — when user's score improves from previous session.
 * Based on Facebook's "7 friends in 10 days" activation metric (Chamath Palihapitiya).
 * This is the key activation event that predicts long-term retention.
 */
export function trackAhaMoment(params: {
  previousScore: number;
  newScore: number;
  improvement: number;
  sessionCount: number;
}) {
  pushEvent("aha_moment_score_improved", {
    previous_score: params.previousScore,
    new_score: params.newScore,
    improvement: params.improvement,
    session_count: params.sessionCount,
  });

  // Also track in engagement DB for server-side analysis
  trackEngagementEvent("aha_moment", {
    previousScore: params.previousScore,
    newScore: params.newScore,
    improvement: params.improvement,
    sessionCount: params.sessionCount,
  });
}
