/**
 * Company/product context that AI uses across all learning features.
 * Stored in localStorage so it persists across sessions.
 */

const STORAGE_KEY = "seiyaku-company-context";

export interface CompanyContext {
  companyName: string;
  industry: string;
  productName: string;
  targetAudience: string;
  keyFeatures: string;
  priceRange: string;
  advantages: string;
  challenges: string;
  additionalInfo: string; // pasted text from PDFs, etc.
}

export const EMPTY_CONTEXT: CompanyContext = {
  companyName: "",
  industry: "",
  productName: "",
  targetAudience: "",
  keyFeatures: "",
  priceRange: "",
  advantages: "",
  challenges: "",
  additionalInfo: "",
};

export function loadCompanyContext(): CompanyContext {
  if (typeof window === "undefined") return EMPTY_CONTEXT;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return { ...EMPTY_CONTEXT, ...JSON.parse(saved) };
    }
  } catch {
    // ignore
  }
  return EMPTY_CONTEXT;
}

export function saveCompanyContext(ctx: CompanyContext): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ctx));
  } catch {
    // ignore quota errors
  }
}

export function hasCompanyContext(ctx: CompanyContext): boolean {
  return !!(ctx.industry.trim() || ctx.productName.trim());
}

/** Build a context string for AI prompts. */
export function buildContextPrompt(ctx: CompanyContext): string {
  const parts: string[] = [];
  if (ctx.companyName) parts.push(`会社名: ${ctx.companyName}`);
  if (ctx.industry) parts.push(`業種: ${ctx.industry}`);
  if (ctx.productName) parts.push(`商材・サービス名: ${ctx.productName}`);
  if (ctx.targetAudience) parts.push(`ターゲット層: ${ctx.targetAudience}`);
  if (ctx.keyFeatures) parts.push(`主な特徴: ${ctx.keyFeatures}`);
  if (ctx.priceRange) parts.push(`価格帯: ${ctx.priceRange}`);
  if (ctx.advantages) parts.push(`競合優位性: ${ctx.advantages}`);
  if (ctx.challenges) parts.push(`課題: ${ctx.challenges}`);
  if (ctx.additionalInfo) parts.push(`補足情報:\n${ctx.additionalInfo}`);
  return parts.join("\n");
}
