/**
 * Maps score categories to relevant lesson slugs.
 * Used by score-card.tsx to link weak categories to specific lessons.
 */

export interface CategoryLessonInfo {
  slug: string;
  title: string;
}

export const CATEGORY_LESSON_MAP: Record<string, CategoryLessonInfo[]> = {
  "アプローチ": [
    { slug: "sales-mindset", title: "営業マインドセット" },
    { slug: "praise-technique", title: "褒めの技術" },
    { slug: "premise-setting", title: "前提設定" },
  ],
  "ヒアリング": [
    { slug: "mehrabian-rule", title: "メラビアンの法則" },
    { slug: "drawer-phrases", title: "引き出しフレーズ" },
    { slug: "deepening", title: "深掘り技術" },
  ],
  "プレゼン": [
    { slug: "benefit-method", title: "ベネフィット話法" },
    { slug: "comparison-if", title: "比較話法・IF活用" },
  ],
  "クロージング": [
    { slug: "closing-intro", title: "クロージング基礎" },
    { slug: "social-proof", title: "社会的証明" },
    { slug: "consistency", title: "一貫性の原理" },
    { slug: "quotation-method", title: "証言引用法" },
    { slug: "positive-closing", title: "ポジティブクロージング" },
    { slug: "negative-closing", title: "ネガティブクロージング" },
    { slug: "desire-patterns", title: "欲求パターン" },
  ],
  "反論処理": [
    { slug: "rebuttal-basics", title: "反論処理の基本" },
    { slug: "rebuttal-pattern", title: "反論4大パターン" },
    { slug: "purpose-recall", title: "目的の振り返り" },
    { slug: "third-party-attack", title: "第三者トーク" },
    { slug: "positive-shower", title: "YESの積み上げ" },
    { slug: "reframe", title: "リフレーミング" },
    { slug: "value-stacking", title: "価値の再提示" },
  ],
};

/**
 * Get recommended lessons for a category based on score.
 * Lower scores → earlier (basic) lessons, higher scores → later (advanced) lessons.
 */
export function getCategoryLearnLinks(
  categoryName: string,
  score: number,
): { slug: string; title: string; label: string } | null {
  const lessons = CATEGORY_LESSON_MAP[categoryName];
  if (!lessons || lessons.length === 0) return null;

  if (score < 40) {
    // Basics - first lesson
    const l = lessons[0];
    return { slug: l.slug, title: l.title, label: "基礎" };
  } else if (score < 60) {
    // Mid-level
    const idx = Math.min(Math.floor(lessons.length / 2), lessons.length - 1);
    const l = lessons[idx];
    return { slug: l.slug, title: l.title, label: "復習" };
  } else {
    // Score 60-69 — advanced lesson for reinforcement
    const l = lessons[lessons.length - 1];
    return { slug: l.slug, title: l.title, label: "強化" };
  }
}
