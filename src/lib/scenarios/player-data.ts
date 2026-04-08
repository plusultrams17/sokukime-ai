import type { PlayerData, ScenarioRecord } from "./types";

const STORAGE_KEY = "virtual-challenge-player";

function getDefaultRecord(): ScenarioRecord {
  return {
    bestScore: 0,
    bestGrade: "",
    bestEmotion: 0,
    playCount: 0,
    choicesMade: [],
    techniquesUsed: [],
    lastPlayed: "",
  };
}

export function loadPlayerData(): PlayerData {
  if (typeof window === "undefined") return { scenarios: {}, totalPlayCount: 0 };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as PlayerData;
  } catch {}
  return { scenarios: {}, totalPlayCount: 0 };
}

export function savePlayerData(data: PlayerData) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}
}

export function recordPlay(
  scenarioId: string,
  score: number,
  grade: string,
  emotion: number,
  choiceIds: string[],
  techniques: string[],
) {
  const data = loadPlayerData();
  const rec = data.scenarios[scenarioId] ?? getDefaultRecord();

  rec.playCount += 1;
  rec.lastPlayed = new Date().toISOString();
  if (score > rec.bestScore) {
    rec.bestScore = score;
    rec.bestGrade = grade;
    rec.bestEmotion = emotion;
  }
  // merge unique choices & techniques
  const choiceSet = new Set([...rec.choicesMade, ...choiceIds]);
  rec.choicesMade = [...choiceSet];
  const techSet = new Set([...rec.techniquesUsed, ...techniques.filter(Boolean)]);
  rec.techniquesUsed = [...techSet];

  data.scenarios[scenarioId] = rec;
  data.totalPlayCount += 1;
  savePlayerData(data);
  return data;
}

/* ─── Stats helpers ─── */
export function getTotalTechniques(data: PlayerData): number {
  const all = new Set<string>();
  Object.values(data.scenarios).forEach((r) => r.techniquesUsed.forEach((t) => all.add(t)));
  return all.size;
}

export function getTotalChoices(data: PlayerData): number {
  const all = new Set<string>();
  Object.values(data.scenarios).forEach((r) => r.choicesMade.forEach((c) => all.add(c)));
  return all.size;
}

export function getBestGradeForScenario(data: PlayerData, scenarioId: string): string {
  return data.scenarios[scenarioId]?.bestGrade ?? "";
}
