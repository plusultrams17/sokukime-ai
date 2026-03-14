import {
  SalesMindsetDiagram,
  PraiseTechniqueDiagram,
  PremiseSettingDiagram,
  MehrabianDiagram,
  DrawerPhrasesDiagram,
  DeepeningDiagram,
  BenefitMethodDiagram,
  ComparisonIfDiagram,
} from "./beginner";

import {
  ClosingIntroDiagram,
  SocialProofDiagram,
  ConsistencyDiagram,
  QuotationMethodDiagram,
  PositiveClosingDiagram,
  NegativeClosingDiagram,
  DesirePatternsDiagram,
} from "./intermediate";

import {
  RebuttalBasicsDiagram,
  RebuttalPatternDiagram,
  PurposeRecallDiagram,
  ThirdPartyAttackDiagram,
  PositiveShowerDiagram,
  ReframeDiagram,
  ValueStackingDiagram,
} from "./advanced";

import { beginnerSectionDiagrams } from "./beginner-sections";
import { intermediateSectionDiagrams } from "./intermediate-sections";
import { advancedSectionDiagrams } from "./advanced-sections";

/* ── Top-level overview diagrams (1 per lesson) ─── */
const DIAGRAM_MAP: Record<string, React.ComponentType> = {
  "sales-mindset": SalesMindsetDiagram,
  "praise-technique": PraiseTechniqueDiagram,
  "premise-setting": PremiseSettingDiagram,
  "mehrabian-rule": MehrabianDiagram,
  "drawer-phrases": DrawerPhrasesDiagram,
  "deepening": DeepeningDiagram,
  "benefit-method": BenefitMethodDiagram,
  "comparison-if": ComparisonIfDiagram,
  "closing-intro": ClosingIntroDiagram,
  "social-proof": SocialProofDiagram,
  "consistency": ConsistencyDiagram,
  "quotation-method": QuotationMethodDiagram,
  "positive-closing": PositiveClosingDiagram,
  "negative-closing": NegativeClosingDiagram,
  "desire-patterns": DesirePatternsDiagram,
  "rebuttal-basics": RebuttalBasicsDiagram,
  "rebuttal-pattern": RebuttalPatternDiagram,
  "purpose-recall": PurposeRecallDiagram,
  "third-party-attack": ThirdPartyAttackDiagram,
  "positive-shower": PositiveShowerDiagram,
  "reframe": ReframeDiagram,
  "value-stacking": ValueStackingDiagram,
};

/* ── Section diagrams (multiple per lesson) ──────── */
const SECTION_DIAGRAM_MAP: Record<string, Record<string, React.ComponentType>> = {
  ...beginnerSectionDiagrams,
  ...intermediateSectionDiagrams,
  ...advancedSectionDiagrams,
};

export function LessonDiagram({ slug }: { slug: string }) {
  const Component = DIAGRAM_MAP[slug];
  if (!Component) return null;
  return <Component />;
}

export function getSectionDiagram(
  slug: string,
  key: string,
): React.ComponentType | null {
  return SECTION_DIAGRAM_MAP[slug]?.[key] ?? null;
}
