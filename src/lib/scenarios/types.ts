/* ═══════════════════════════════════════════════════════════════
   バーチャル商談チャレンジ — 共通型定義
   全シナリオが共有するインターフェース
═══════════════════════════════════════════════════════════════ */

export type Phase = 0 | 1 | 2 | 3 | 4 | 5;
export type ChoiceQuality = "excellent" | "good" | "neutral" | "bad";
export type Difficulty = "easy" | "normal" | "hard";

export interface IntroScene {
  id: string;
  text: string;
  subText?: string;
  duration: number;
}

export interface GameChoice {
  id: string;
  label: string;
  icon: string;
  salesTalk: string;
  customerResponse: string;
  customerResponseAlt?: string;
  score: number;
  emotionDelta: number;
  technique?: string;
  quality: ChoiceQuality;
  hint?: string;
}

export interface GameNode {
  id: string;
  phase: Phase;
  phaseLabel: string;
  narration?: string;
  customerLine?: string;
  choices: GameChoice[];
  specialEvent?: "silence" | "business_card" | "document_timing";
}

export interface Ending {
  id: string;
  title: string;
  emoji: string;
  description: string;
  grade: string;
}

export type SceneType =
  | "office"
  | "cafe"
  | "exhibition"
  | "online"
  | "shop"
  | "restaurant";

export interface ScenarioConfig {
  meta: {
    id: string;
    title: string;
    shortTitle: string;
    emoji: string;
    description: string;
    location: string;
    customerType: string;
    product: string;
    sceneType: SceneType;
    difficulty: "beginner" | "intermediate" | "advanced";
  };
  phaseLabels: string[];
  introScenes: IntroScene[];
  gameNodes: GameNode[];
  nodeOrder: string[];
  initialEmotion: number;
  getEnding: (totalScore: number, emotion: number, choiceIds?: string[]) => Ending;
}

/* ─── LocalStorage 永続化用 ─── */
export interface ScenarioRecord {
  bestScore: number;
  bestGrade: string;
  bestEmotion: number;
  playCount: number;
  choicesMade: string[];
  techniquesUsed: string[];
  lastPlayed: string;
}

export interface PlayerData {
  scenarios: Record<string, ScenarioRecord>;
  totalPlayCount: number;
}
