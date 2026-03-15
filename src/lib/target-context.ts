/**
 * Target/prospect context that AI uses across all learning features.
 * Stored in localStorage so it persists across sessions.
 */

const STORAGE_KEY = "seiyaku-target-context";

export interface TargetContext {
  targetCompanyName: string;
  targetIndustry: string;
  targetPosition: string;
  targetScale: string;
  targetNeeds: string;
  targetBudget: string;
  targetTimeline: string;
  additionalInfo: string;
}

export const EMPTY_TARGET: TargetContext = {
  targetCompanyName: "",
  targetIndustry: "",
  targetPosition: "",
  targetScale: "",
  targetNeeds: "",
  targetBudget: "",
  targetTimeline: "",
  additionalInfo: "",
};

export function loadTargetContext(): TargetContext {
  if (typeof window === "undefined") return EMPTY_TARGET;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return { ...EMPTY_TARGET, ...JSON.parse(saved) };
    }
  } catch {
    // ignore
  }
  return EMPTY_TARGET;
}

export function saveTargetContext(ctx: TargetContext): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ctx));
  } catch {
    // ignore quota errors
  }
}

export function hasTargetContext(ctx: TargetContext): boolean {
  return !!(ctx.targetCompanyName.trim() || ctx.targetIndustry.trim());
}

/** Build a context string for AI prompts. */
export function buildTargetPrompt(ctx: TargetContext): string {
  const parts: string[] = [];
  if (ctx.targetCompanyName) parts.push(`ターゲット企業名: ${ctx.targetCompanyName}`);
  if (ctx.targetIndustry) parts.push(`ターゲット業種: ${ctx.targetIndustry}`);
  if (ctx.targetPosition) parts.push(`担当者役職: ${ctx.targetPosition}`);
  if (ctx.targetScale) parts.push(`企業規模: ${ctx.targetScale}`);
  if (ctx.targetNeeds) parts.push(`想定ニーズ・課題: ${ctx.targetNeeds}`);
  if (ctx.targetBudget) parts.push(`想定予算: ${ctx.targetBudget}`);
  if (ctx.targetTimeline) parts.push(`導入検討時期: ${ctx.targetTimeline}`);
  if (ctx.additionalInfo) parts.push(`補足情報:\n${ctx.additionalInfo}`);
  return parts.join("\n");
}
