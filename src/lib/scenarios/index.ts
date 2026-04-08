/* ═══════════════════════════════════════════════════════════════
   シナリオレジストリ — 全シナリオの一覧とルックアップ
═══════════════════════════════════════════════════════════════ */

import type { ScenarioConfig } from "./types";
import { officeVisit } from "./office-visit";

// Lazy imports for code-splitting (loaded when selected)
const lazyScenarios: Record<string, () => Promise<ScenarioConfig>> = {
  "cafe-meeting": () => import("./cafe-meeting").then((m) => m.cafeMeeting),
  "exhibition": () => import("./exhibition").then((m) => m.exhibition),
  "online-meeting": () => import("./online-meeting").then((m) => m.onlineMeeting),
  "cold-visit": () => import("./cold-visit").then((m) => m.coldVisit),
  "referral": () => import("./referral").then((m) => m.referral),
};

/** All scenario metadata for listing (no heavy data loaded) */
export const SCENARIO_LIST: {
  id: string;
  title: string;
  shortTitle: string;
  emoji: string;
  image?: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  sceneType: string;
  customerType: string;
}[] = [
  {
    id: "office-visit",
    title: "訪問営業 — 社長室商談",
    shortTitle: "訪問営業",
    emoji: "🏢",
    image: "/images/challenges/challenge-office-visit.png",
    description: "中小企業の社長室を訪問。IT導入に懐疑的な社長に業務効率化SaaSを提案せよ。",
    difficulty: "beginner",
    sceneType: "office",
    customerType: "40代男性 / 社長 / 懐疑的",
  },
  {
    id: "cafe-meeting",
    title: "カフェ商談 — 紹介先との初回面談",
    shortTitle: "カフェ商談",
    emoji: "☕",
    image: "/images/challenges/challenge-cafe-meeting.png",
    description: "知人の紹介でカフェで初対面の経営者と面談。リラックスした雰囲気の中、自然に信頼関係を構築せよ。",
    difficulty: "beginner",
    sceneType: "cafe",
    customerType: "30代女性 / 美容サロン経営者",
  },
  {
    id: "exhibition",
    title: "展示会営業 — ブースでの名刺交換",
    shortTitle: "展示会営業",
    emoji: "🎪",
    image: "/images/challenges/challenge-exhibition.png",
    description: "IT展示会のブースで通りかかった見込み客を捕まえろ。たった3分で名刺交換→アポ獲得を目指す。",
    difficulty: "intermediate",
    sceneType: "exhibition",
    customerType: "50代男性 / 物流会社 部長",
  },
  {
    id: "online-meeting",
    title: "オンライン商談 — Zoom初回プレゼン",
    shortTitle: "オンライン商談",
    emoji: "💻",
    image: "/images/challenges/challenge-online-meeting.png",
    description: "Zoomでの初回オンライン商談。画面共有で資料を見せながら、画面越しに相手の反応を読み取れ。",
    difficulty: "intermediate",
    sceneType: "online",
    customerType: "40代男性 / 不動産会社 営業部長",
  },
  {
    id: "cold-visit",
    title: "飛び込み営業 — 商店街の店舗開拓",
    shortTitle: "飛び込み営業",
    emoji: "🚪",
    image: "/images/challenges/challenge-cold-visit.png",
    description: "アポなしで商店街の飲食店を訪問。忙しい店長の警戒を解き、POSレジの導入を提案せよ。",
    difficulty: "advanced",
    sceneType: "restaurant",
    customerType: "50代男性 / 居酒屋店長",
  },
  {
    id: "referral",
    title: "紹介営業 — 既存客からの紹介商談",
    shortTitle: "紹介営業",
    emoji: "🤝",
    image: "/images/challenges/challenge-referral.png",
    description: "既存顧客から紹介された新規顧客と商談。紹介者の信頼を活かしつつ、独自の関係を築け。",
    difficulty: "intermediate",
    sceneType: "office",
    customerType: "40代女性 / IT企業 取締役",
  },
];

/** Load a scenario by ID. Returns null if not found. */
export async function loadScenario(id: string): Promise<ScenarioConfig | null> {
  if (id === "office-visit") return officeVisit;

  const loader = lazyScenarios[id];
  if (!loader) return null;

  try {
    return await loader();
  } catch {
    return null;
  }
}

/** Synchronously get office-visit (default scenario, always bundled) */
export function getDefaultScenario(): ScenarioConfig {
  return officeVisit;
}

export { officeVisit };
export type { ScenarioConfig } from "./types";
