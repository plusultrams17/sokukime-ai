/**
 * Lesson slug → roleplay parameter mapping.
 * Used by LessonPractice to auto-configure ChatUI for inline roleplay.
 */

interface PracticeDefaults {
  industry: string;
  product: string;
  scene: "visit" | "phone" | "inbound";
  customerType: "individual" | "owner" | "manager" | "staff";
}

const LEVEL_DIFFICULTY: Record<string, string> = {
  beginner: "friendly",
  intermediate: "cautious",
  advanced: "skeptical",
};

// Per-lesson overrides. Lessons not listed here use level-based defaults.
const LESSON_OVERRIDES: Record<string, Partial<PracticeDefaults>> = {
  // ── Beginner: 個人客 + 訪問 + 親しみやすいシナリオ ──
  "sales-mindset":    { industry: "戸建て住宅オーナー", product: "リフォーム", scene: "visit", customerType: "individual" },
  "praise-technique": { industry: "戸建て住宅オーナー", product: "外壁塗装", scene: "visit", customerType: "individual" },
  "premise-setting":  { industry: "保険見直し検討中", product: "生命保険", scene: "visit", customerType: "individual" },
  "mehrabian-rule":   { industry: "子育て世帯", product: "学習塾の入会", scene: "inbound", customerType: "individual" },
  "drawer-phrases":   { industry: "戸建て住宅オーナー", product: "外壁塗装", scene: "visit", customerType: "individual" },
  "deepening":        { industry: "保険見直し検討中", product: "医療保険", scene: "visit", customerType: "individual" },
  "benefit-method":   { industry: "車買い替え検討者", product: "新車販売", scene: "inbound", customerType: "individual" },
  "comparison-if":    { industry: "戸建て住宅オーナー", product: "太陽光パネル", scene: "visit", customerType: "individual" },

  // ── Intermediate: 会社オーナー + 訪問 + 業務改善系 ──
  "closing-intro":    { industry: "中小企業の社長", product: "業務改善ソフト", scene: "visit", customerType: "owner" },
  "social-proof":     { industry: "飲食店オーナー", product: "POSレジシステム", scene: "visit", customerType: "owner" },
  "consistency":      { industry: "中小企業の社長", product: "法人向けクラウドサービス", scene: "visit", customerType: "owner" },
  "quotation-method": { industry: "美容サロンオーナー", product: "業務用美容商材", scene: "visit", customerType: "owner" },
  "positive-closing": { industry: "個人事業主", product: "コーポレートサイト制作", scene: "visit", customerType: "owner" },
  "negative-closing": { industry: "中小企業の社長", product: "業務効率化SaaS", scene: "phone", customerType: "owner" },
  "desire-patterns":  { industry: "不動産投資家", product: "収益不動産", scene: "phone", customerType: "individual" },

  // ── Advanced: 部長クラス + 電話 + コスト削減系 ──
  "rebuttal-basics":    { industry: "企業の総務部門", product: "法人向け団体保険", scene: "phone", customerType: "manager" },
  "rebuttal-pattern":   { industry: "IT企業の部長", product: "法人向けクラウドサービス", scene: "phone", customerType: "manager" },
  "purpose-recall":     { industry: "製造業の工場長", product: "業務効率化ツール", scene: "phone", customerType: "manager" },
  "third-party-attack": { industry: "中小企業の社長", product: "求人広告", scene: "phone", customerType: "owner" },
  "positive-shower":    { industry: "企業の総務部門", product: "法人カーリース", scene: "phone", customerType: "manager" },
  "reframe":            { industry: "IT企業の部長", product: "業務効率化SaaS", scene: "phone", customerType: "manager" },
  "value-stacking":     { industry: "建築塗装業者の社長", product: "塗料・塗装材料", scene: "phone", customerType: "owner" },
};

const DEFAULT_BY_LEVEL: Record<string, PracticeDefaults> = {
  beginner: {
    industry: "戸建て住宅オーナー",
    product: "リフォーム",
    scene: "visit",
    customerType: "individual",
  },
  intermediate: {
    industry: "中小企業の社長",
    product: "業務改善ソフト",
    scene: "visit",
    customerType: "owner",
  },
  advanced: {
    industry: "IT企業の部長",
    product: "法人向けクラウドサービス",
    scene: "phone",
    customerType: "manager",
  },
};

export function getPracticeDefaults(
  slug: string,
  level: string,
): PracticeDefaults & { difficulty: string } {
  const base = DEFAULT_BY_LEVEL[level] || DEFAULT_BY_LEVEL.beginner;
  const overrides = LESSON_OVERRIDES[slug] || {};
  const difficulty = LEVEL_DIFFICULTY[level] || "friendly";

  return {
    ...base,
    ...overrides,
    difficulty,
  };
}
