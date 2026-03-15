export interface ProductInfo {
  productName: string;
  industry: string;
  targetAudience: string;
  keyFeatures: string;
  priceRange: string;
  advantages: string;
  challenges: string;
}

export interface PhaseConfig {
  num: string;
  name: string;
  sub: string;
  color: string;
}

export interface PhaseProps {
  data: Record<string, string>;
  onChange: (key: string, value: string) => void;
  preview: string;
  onGenerate: () => void;
  isLoading: boolean;
  color: string;
}

export const PHASES: PhaseConfig[] = [
  { num: "Step 1", name: "アプローチ", sub: "信頼構築", color: "#0F6E56" },
  { num: "Step 2", name: "ヒアリング", sub: "課題発掘", color: "#185FA5" },
  { num: "Step 3", name: "プレゼン", sub: "価値提案", color: "#534AB7" },
  { num: "Step 4", name: "クロージング", sub: "決断促進", color: "#993C1D" },
  { num: "Step 5", name: "反論処理", sub: "切り返し", color: "#A32D2D" },
];
