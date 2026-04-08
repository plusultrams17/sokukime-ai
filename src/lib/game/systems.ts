"use client";

/* ═══════════════════════════════════════════════════════════════════════════
   成約コーチAI — ゲームシステム
   Timer / Achievement / Status Effect / Event / Difficulty

   Pure TypeScript, no React imports.
   すべてのUIテキストは日本語。
═══════════════════════════════════════════════════════════════════════════ */

// ─────────────────────────────────────────────
// Re-export types used by the game engine
// ─────────────────────────────────────────────
export type ChoiceQuality = "excellent" | "good" | "neutral" | "bad";

/* ═══════════════════════════════════════════════════════════════
   1. TIMER SYSTEM — カウントダウンプレッシャー
═══════════════════════════════════════════════════════════════ */

export interface TimerMultiplierInfo {
  multiplier: number;
  label: string;
}

export class ChoiceTimer {
  private duration: number = 30;
  private remaining: number = 0;
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private running: boolean = false;
  private onTick: ((remaining: number) => void) | null = null;
  private onExpire: (() => void) | null = null;

  /**
   * Start countdown.
   * @param duration  seconds (default 30)
   * @param onTick    called every 100ms with remaining seconds
   * @param onExpire  called when timer hits 0
   */
  start(
    duration: number = 30,
    onTick?: (remaining: number) => void,
    onExpire?: () => void,
  ): void {
    this.stop(); // clear any previous timer
    this.duration = duration;
    this.remaining = duration;
    this.onTick = onTick ?? null;
    this.onExpire = onExpire ?? null;
    this.running = true;

    this.intervalId = setInterval(() => {
      this.remaining = Math.max(0, this.remaining - 0.1);
      this.onTick?.(this.remaining);

      if (this.remaining <= 0) {
        this.stop();
        this.onExpire?.();
      }
    }, 100);
  }

  /** Stop the timer without triggering onExpire. */
  stop(): void {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.running = false;
  }

  /** Seconds remaining (float). */
  getRemaining(): number {
    return Math.max(0, this.remaining);
  }

  /** Duration originally set. */
  getDuration(): number {
    return this.duration;
  }

  /** How many seconds elapsed since start. */
  getElapsed(): number {
    return this.duration - this.remaining;
  }

  /** Whether the timer is currently counting down. */
  isRunning(): boolean {
    return this.running;
  }

  /**
   * Score multiplier based on how quickly the player answered.
   *
   * | Elapsed   | Multiplier | Label           |
   * |-----------|------------|-----------------|
   * | 0–33%     | 1.5x       | 即断力!         |
   * | 33–66%    | 1.0x       | —               |
   * | 66–100%   | 0.8x       | 迷いが見える…   |
   * | expired   | 0.5x       | タイムアップ     |
   */
  getMultiplier(): number {
    return this.getMultiplierInfo().multiplier;
  }

  getMultiplierLabel(): string {
    return this.getMultiplierInfo().label;
  }

  getMultiplierInfo(): TimerMultiplierInfo {
    if (this.remaining <= 0 && !this.running) {
      return { multiplier: 0.5, label: "タイムアップ" };
    }
    const elapsed = this.duration - this.remaining;
    const ratio = elapsed / this.duration;

    if (ratio <= 0.33) {
      return { multiplier: 1.5, label: "即断力!" };
    }
    if (ratio <= 0.66) {
      return { multiplier: 1.0, label: "" };
    }
    return { multiplier: 0.8, label: "迷いが見える…" };
  }

  /** Add bonus seconds (from status effects / events). */
  addTime(seconds: number): void {
    this.remaining = Math.min(this.remaining + seconds, this.duration + seconds);
  }

  /** Cleanly destroy — call on unmount. */
  destroy(): void {
    this.stop();
    this.onTick = null;
    this.onExpire = null;
  }
}

/* ═══════════════════════════════════════════════════════════════
   2. ACHIEVEMENT SYSTEM — 実績
═══════════════════════════════════════════════════════════════ */

const STORAGE_KEY = "sokukime_achievements";

export interface GameStats {
  totalScore: number;
  emotion: number;
  maxCombo: number;
  choiceCount: number;
  excellentCount: number;
  goodCount: number;
  badCount: number;
  fastChoiceCount: number;   // choices made within first 33% of timer
  perfectNodes: number;      // nodes where excellent was chosen
  grade: string;             // S, A, B, C
  scenarioId: string;
  timeSpent: number;         // total seconds
  emotionHistory: number[];  // emotion value after each node (for comeback detection)
}

export type AchievementRarity = "common" | "rare" | "epic" | "legendary";

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  condition: (stats: GameStats) => boolean;
  rarity: AchievementRarity;
}

/** Rarity display info. */
export const RARITY_META: Record<AchievementRarity, { label: string; color: string }> = {
  common:    { label: "コモン",     color: "#9ca3af" },
  rare:      { label: "レア",       color: "#3b82f6" },
  epic:      { label: "エピック",   color: "#a855f7" },
  legendary: { label: "レジェンド", color: "#f59e0b" },
};

// ─── Achievement Definitions ────────────────────────────────────

export const ACHIEVEMENTS: Achievement[] = [
  // ── Common (基本) ──────────────────────────────
  {
    id: "first-clear",
    title: "初成約",
    description: "はじめてシナリオをクリアした",
    icon: "🎉",
    rarity: "common",
    condition: () => true, // any completion
  },
  {
    id: "fast-3",
    title: "即断即決",
    description: "3回以上、制限時間の1/3以内に回答した",
    icon: "⚡",
    rarity: "common",
    condition: (s) => s.fastChoiceCount >= 3,
  },
  {
    id: "combo-3",
    title: "トリプルコンボ",
    description: "3連続で「良い」以上の選択をした",
    icon: "🔥",
    rarity: "common",
    condition: (s) => s.maxCombo >= 3,
  },
  {
    id: "grade-a",
    title: "Aランク営業",
    description: "Aランク以上でクリアした",
    icon: "🅰️",
    rarity: "common",
    condition: (s) => s.grade === "A" || s.grade === "S",
  },
  {
    id: "no-bad",
    title: "ノーミス",
    description: "「NG行動」を1回もせずにクリアした",
    icon: "🛡️",
    rarity: "common",
    condition: (s) => s.badCount === 0,
  },

  // ── Rare (上級) ────────────────────────────────
  {
    id: "combo-5",
    title: "パーフェクトコンボ",
    description: "5連続で「良い」以上の選択をした",
    icon: "💥",
    rarity: "rare",
    condition: (s) => s.maxCombo >= 5,
  },
  {
    id: "emotion-90",
    title: "心を掴む",
    description: "感情メーターを90以上にした",
    icon: "💖",
    rarity: "rare",
    condition: (s) => s.emotion >= 90,
  },
  {
    id: "cold-sweat-win",
    title: "冷や汗の勝利",
    description: "感情メーターが20以下に落ちた後、A以上でクリアした",
    icon: "😅",
    rarity: "rare",
    condition: (s) => {
      const hitLow = s.emotionHistory.some((e) => e <= 20);
      return hitLow && (s.grade === "S" || s.grade === "A");
    },
  },
  {
    id: "speedster",
    title: "スピードスター",
    description: "全ての選択を制限時間の1/3以内に回答した",
    icon: "🏎️",
    rarity: "rare",
    condition: (s) => s.fastChoiceCount >= s.choiceCount && s.choiceCount > 0,
  },
  {
    id: "comeback",
    title: "粘り腰",
    description: "NG行動を3回以上した後、AかSランクでクリアした",
    icon: "💪",
    rarity: "rare",
    condition: (s) => s.badCount >= 3 && (s.grade === "S" || s.grade === "A"),
  },
  {
    id: "score-80",
    title: "トップセールス",
    description: "スコア80以上を獲得した",
    icon: "📈",
    rarity: "rare",
    condition: (s) => s.totalScore >= 80,
  },

  // ── Epic (シナリオ別) ──────────────────────────
  {
    id: "all-excellent",
    title: "全問エクセレント",
    description: "すべてのノードで「最高の一手」を選んだ",
    icon: "👑",
    rarity: "epic",
    condition: (s) => s.excellentCount === s.choiceCount && s.choiceCount > 0,
  },
  {
    id: "cafe-master",
    title: "雑談マスター",
    description: "カフェ商談をSランクでクリアした",
    icon: "☕",
    rarity: "epic",
    condition: (s) => s.scenarioId === "cafe-meeting" && s.grade === "S",
  },
  {
    id: "cold-master",
    title: "飛び込みの達人",
    description: "飛び込み営業をSランクでクリアした",
    icon: "🚪",
    rarity: "epic",
    condition: (s) => s.scenarioId === "cold-visit" && s.grade === "S",
  },
  {
    id: "online-master",
    title: "画面越しの魔術師",
    description: "オンライン商談をSランクでクリアした",
    icon: "💻",
    rarity: "epic",
    condition: (s) => s.scenarioId === "online-meeting" && s.grade === "S",
  },
  {
    id: "exhibition-master",
    title: "展示会の狩人",
    description: "展示会営業をSランクでクリアした",
    icon: "🎪",
    rarity: "epic",
    condition: (s) => s.scenarioId === "exhibition" && s.grade === "S",
  },
  {
    id: "office-master",
    title: "社長室の支配者",
    description: "訪問営業をSランクでクリアした",
    icon: "🏢",
    rarity: "epic",
    condition: (s) => s.scenarioId === "office-visit" && s.grade === "S",
  },
  {
    id: "referral-master",
    title: "紹介の連鎖",
    description: "紹介営業をSランクでクリアした",
    icon: "🤝",
    rarity: "epic",
    condition: (s) => s.scenarioId === "referral" && s.grade === "S",
  },

  // ── Legendary (伝説) ──────────────────────────
  {
    id: "perfect-game",
    title: "完全試合",
    description: "全問エクセレント + 感情90以上 + Sランク",
    icon: "🏆",
    rarity: "legendary",
    condition: (s) =>
      s.excellentCount === s.choiceCount &&
      s.choiceCount > 0 &&
      s.emotion >= 90 &&
      s.grade === "S",
  },
  {
    id: "miracle-comeback",
    title: "奇跡の大逆転",
    description: "感情メーターが10以下に落ちた後、Sランクでクリアした",
    icon: "✨",
    rarity: "legendary",
    condition: (s) => {
      const hitCritical = s.emotionHistory.some((e) => e <= 10);
      return hitCritical && s.grade === "S";
    },
  },
  {
    id: "speed-demon",
    title: "スピードデーモン",
    description: "全選択を5秒以内に回答し、Sランクでクリアした",
    icon: "👹",
    rarity: "legendary",
    condition: (s) =>
      s.fastChoiceCount >= s.choiceCount &&
      s.choiceCount > 0 &&
      s.grade === "S",
  },

  // ── New Achievements ────────────────────────────

  // ── Common (追加) ──────────────────────────────
  {
    id: "neutral-zero",
    title: "白黒はっきり",
    description: "「普通」の選択を1回もせずにクリアした",
    icon: "⚖️",
    rarity: "common",
    condition: (s) => {
      const neutralCount = s.choiceCount - s.excellentCount - s.goodCount - s.badCount;
      return neutralCount === 0 && s.choiceCount > 0;
    },
  },
  {
    id: "event-collector",
    title: "イベントハンター",
    description: "1回のプレイで5つ以上のイベントを体験した",
    icon: "🎯",
    rarity: "common",
    // Note: eventCount tracked externally; condition uses emotionHistory length as proxy
    condition: (s) => s.emotionHistory.length >= 8, // proxy: many nodes = many events
  },

  // ── Rare (追加) ────────────────────────────────
  {
    id: "combo-7",
    title: "セブンスター",
    description: "7連続で「良い」以上の選択をした",
    icon: "⭐",
    rarity: "rare",
    condition: (s) => s.maxCombo >= 7,
  },
  {
    id: "quick-clear",
    title: "電光石火",
    description: "3分以内にシナリオをクリアした",
    icon: "⏱️",
    rarity: "rare",
    condition: (s) => s.timeSpent <= 180 && s.timeSpent > 0,
  },
  {
    id: "close-call",
    title: "起死回生",
    description: "感情5以下に落ちた後、復活してクリアした",
    icon: "🔄",
    rarity: "rare",
    condition: (s) => {
      const hitCritical = s.emotionHistory.some((e) => e <= 5);
      return hitCritical && (s.grade === "S" || s.grade === "A" || s.grade === "B");
    },
  },
  {
    id: "no-debuff",
    title: "鉄壁の営業",
    description: "デバフなしでクリアした（NG行動0 + 感情30以下にならず）",
    icon: "🛡️",
    rarity: "rare",
    condition: (s) => s.badCount === 0 && s.emotionHistory.every((e) => e > 30),
  },
  {
    id: "score-100",
    title: "百点満点",
    description: "スコア100以上を獲得した",
    icon: "💯",
    rarity: "rare",
    condition: (s) => s.totalScore >= 100,
  },
  {
    id: "buff-master",
    title: "バフコレクター",
    description: "高コンボ＋高感情でバフを大量獲得した",
    icon: "✨",
    rarity: "rare",
    condition: (s) => s.maxCombo >= 5 && s.emotion >= 70,
  },

  // ── Epic (追加) ────────────────────────────────
  {
    id: "hard-mode-s",
    title: "鬼の中の鬼",
    description: "鬼モードでSランクをクリアした",
    icon: "👹",
    rarity: "epic",
    condition: (s) => s.grade === "S",
    // Note: difficulty mode cannot be checked from GameStats alone;
    // caller should only pass this when difficulty === "hard"
  },
  {
    id: "emotion-roller",
    title: "感情のジェットコースター",
    description: "感情が20以下→80以上の振れ幅を体験した",
    icon: "🎢",
    rarity: "epic",
    condition: (s) => {
      const hitLow = s.emotionHistory.some((e) => e <= 20);
      const hitHigh = s.emotionHistory.some((e) => e >= 80);
      return hitLow && hitHigh;
    },
  },
  {
    id: "slow-and-steady",
    title: "沈着冷静",
    description: "全ての選択を制限時間の50%以上残して回答した",
    icon: "🧘",
    rarity: "epic",
    condition: (s) => s.fastChoiceCount >= s.choiceCount && s.choiceCount >= 5,
  },
  {
    id: "no-timer-expire",
    title: "時間厳守",
    description: "タイマー切れ0回でクリアした（全選択を時間内に回答）",
    icon: "⏰",
    rarity: "epic",
    condition: (s) => s.choiceCount > 0 && s.grade !== "C",
    // Note: timer expire tracking is external; this is a proxy condition
  },
  {
    id: "all-scenarios-clear",
    title: "全制覇",
    description: "全6シナリオをクリアした",
    icon: "🗺️",
    rarity: "epic",
    condition: () => true, // Checked externally: all 6 scenarioIds must be in localStorage
  },

  // ── Legendary (追加) ──────────────────────────
  {
    id: "combo-10",
    title: "伝説のコンボ",
    description: "10連続で「良い」以上の選択をした",
    icon: "🔟",
    rarity: "legendary",
    condition: (s) => s.maxCombo >= 10,
  },
  {
    id: "first-hard",
    title: "鬼門突破",
    description: "鬼モードを初めてクリアした",
    icon: "🚩",
    rarity: "legendary",
    condition: (s) => s.grade !== "C",
    // Note: difficulty mode tracked externally; awarded only when difficulty === "hard"
  },

  // ── Additional Achievements (追加) ────────────────
  {
    id: "all-bad-recover",
    title: "不死鳥",
    description: "NG行動3回以上した後、Bランク以上でクリアした",
    icon: "🦅",
    rarity: "rare",
    condition: (s) => s.badCount >= 3 && (s.grade === "S" || s.grade === "A" || s.grade === "B"),
  },
  {
    id: "emotion-maxed",
    title: "感情マスター",
    description: "感情メーターを100に到達させた",
    icon: "💯",
    rarity: "epic",
    condition: (s) => s.emotionHistory.some((e) => e >= 100),
  },
  {
    id: "under-pressure",
    title: "修羅場の達人",
    description: "タイマー残り5秒以下で3回excellentを獲得した",
    icon: "🔥",
    rarity: "epic",
    // Note: precise timer tracking is external; uses fastChoiceCount inverse + excellent as proxy
    condition: (s) => s.excellentCount >= 3 && s.fastChoiceCount < s.choiceCount,
  },
];

/**
 * Check which achievements were newly unlocked this game.
 * Returns only achievements that are not in `previouslyUnlocked`.
 */
export function checkAchievements(
  stats: GameStats,
  previouslyUnlocked: string[],
): Achievement[] {
  const unlocked = new Set(previouslyUnlocked);
  return ACHIEVEMENTS.filter((a) => !unlocked.has(a.id) && a.condition(stats));
}

/** Read unlocked achievement IDs from localStorage. */
export function getUnlockedAchievements(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as string[];
  } catch { /* ignore corrupt data */ }
  return [];
}

/** Persist unlocked achievement IDs to localStorage. */
export function saveUnlockedAchievements(ids: string[]): void {
  if (typeof window === "undefined") return;
  try {
    // Merge with existing to avoid losing data if called with partial list
    const existing = new Set(getUnlockedAchievements());
    ids.forEach((id) => existing.add(id));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(existing)));
  } catch { /* localStorage full or blocked */ }
}

/** Get the full Achievement object for an ID. */
export function getAchievementById(id: string): Achievement | undefined {
  return ACHIEVEMENTS.find((a) => a.id === id);
}

/* ═══════════════════════════════════════════════════════════════
   3. STATUS EFFECTS / BUFFS & DEBUFFS
═══════════════════════════════════════════════════════════════ */

export type StatusEffectType = "buff" | "debuff";

export interface StatusEffectValue {
  scoreMultiplier?: number;
  emotionMultiplier?: number;
  timerExtension?: number;
}

export interface StatusEffect {
  id: string;
  name: string;
  icon: string;
  description: string;
  type: StatusEffectType;
  duration: number;       // remaining nodes
  effect: StatusEffectValue;
}

// ─── Predefined Effects ─────────────────────────────────────

/** Create a fresh copy of a predefined buff/debuff. */
function effect(base: Omit<StatusEffect, "duration">, duration: number): StatusEffect {
  return { ...base, duration };
}

export const BUFF_DEFINITIONS = {
  /** 3-combo: +20% score for 2 nodes */
  momentum: {
    id: "momentum",
    name: "営業の勢い",
    icon: "🔥",
    description: "連続成功でノッている！ スコア+20%",
    type: "buff" as const,
    effect: { scoreMultiplier: 1.2 },
  },
  /** emotion > 70: +30% emotion gain for 2 nodes */
  trust: {
    id: "trust",
    name: "信頼獲得",
    icon: "✨",
    description: "相手の信頼を獲得した。感情変動+30%",
    type: "buff" as const,
    effect: { emotionMultiplier: 1.3 },
  },
  /** 5-combo: +50% score, +10s timer for 3 nodes */
  zone: {
    id: "zone",
    name: "ゾーン",
    icon: "⚡",
    description: "完全に集中している！ スコア+50%、タイマー+10秒",
    type: "buff" as const,
    effect: { scoreMultiplier: 1.5, timerExtension: 10 },
  },
  /** Event-triggered: minor score boost */
  confidence: {
    id: "confidence",
    name: "自信",
    icon: "😎",
    description: "良い流れだ。スコア+10%",
    type: "buff" as const,
    effect: { scoreMultiplier: 1.1 },
  },
  /** Event-triggered: emotion gain boost */
  rapport: {
    id: "rapport",
    name: "ラポール",
    icon: "🤗",
    description: "相手との距離が縮まった。感情変動+20%",
    type: "buff" as const,
    effect: { emotionMultiplier: 1.2 },
  },
  /** Comeback-triggered: score +15%, timer +5s */
  secondWind: {
    id: "second-wind",
    name: "セカンドウィンド",
    icon: "🌊",
    description: "逆境から復活！ スコア+15%、タイマー+5秒",
    type: "buff" as const,
    effect: { scoreMultiplier: 1.15, timerExtension: 5 },
  },
  /** 4+ excellent in a row: score +25% */
  masterMind: {
    id: "master-mind",
    name: "策士",
    icon: "🧠",
    description: "完璧な戦略が冴える。スコア+25%",
    type: "buff" as const,
    effect: { scoreMultiplier: 1.25 },
  },
  /** emotion > 80: emotion gain +40% */
  empathy: {
    id: "empathy",
    name: "共感力",
    icon: "💞",
    description: "深い共感が生まれた。感情変動+40%",
    type: "buff" as const,
    effect: { emotionMultiplier: 1.4 },
  },
  /** Hard mode at low timer: score +30% for 1 node */
  adrenaline: {
    id: "adrenaline",
    name: "アドレナリン",
    icon: "💉",
    description: "極限状態でアドレナリンが放出！ スコア+30%",
    type: "buff" as const,
    effect: { scoreMultiplier: 1.3 },
  },
  /** Rapport events: emotion +25% */
  charm: {
    id: "charm",
    name: "チャーム",
    icon: "🌹",
    description: "人を惹きつける魅力が発動。感情変動+25%",
    type: "buff" as const,
    effect: { emotionMultiplier: 1.25 },
  },
} as const;

export const DEBUFF_DEFINITIONS = {
  /** bad choice: -20% score for 1 node */
  shaken: {
    id: "shaken",
    name: "動揺",
    icon: "😰",
    description: "失敗で動揺している。スコア-20%",
    type: "debuff" as const,
    effect: { scoreMultiplier: 0.8 },
  },
  /** emotion < 30: -30% emotion gain for 2 nodes */
  coldAir: {
    id: "cold-air",
    name: "空気が冷えた",
    icon: "🥶",
    description: "場の空気が冷え切っている。感情上昇-30%",
    type: "debuff" as const,
    effect: { emotionMultiplier: 0.7 },
  },
  /** 2 consecutive bad: -40% emotion gain for 2 nodes */
  distrust: {
    id: "distrust",
    name: "不信感",
    icon: "😤",
    description: "相手が不信感を抱いている。感情上昇-40%",
    type: "debuff" as const,
    effect: { emotionMultiplier: 0.6 },
  },
  /** Event-triggered: timer reduction */
  pressure: {
    id: "pressure",
    name: "プレッシャー",
    icon: "😓",
    description: "プレッシャーを感じている。タイマー-5秒",
    type: "debuff" as const,
    effect: { timerExtension: -5 },
  },
  /** Event-triggered: minor score reduction */
  nervousness: {
    id: "nervousness",
    name: "緊張",
    icon: "😬",
    description: "緊張してきた。スコア-10%",
    type: "debuff" as const,
    effect: { scoreMultiplier: 0.9 },
  },
  /** Unexpected event: score -15% for 2 nodes */
  confusion: {
    id: "confusion",
    name: "混乱",
    icon: "😵",
    description: "想定外の事態に混乱。スコア-15%",
    type: "debuff" as const,
    effect: { scoreMultiplier: 0.85 },
  },
  /** Long session: score -10%, timer -3s */
  fatigue: {
    id: "fatigue",
    name: "疲労",
    icon: "😫",
    description: "長丁場で疲労が蓄積。スコア-10%、タイマー-3秒",
    type: "debuff" as const,
    effect: { scoreMultiplier: 0.9, timerExtension: -3 },
  },
  /** Sharp question: emotion gain -35% */
  intimidated: {
    id: "intimidated",
    name: "萎縮",
    icon: "😨",
    description: "相手の鋭い質問に萎縮。感情上昇-35%",
    type: "debuff" as const,
    effect: { emotionMultiplier: 0.65 },
  },
  /** High combo breaking: score -25% for 1 node */
  overconfident: {
    id: "overconfident",
    name: "慢心",
    icon: "😏",
    description: "調子に乗りすぎた。スコア-25%",
    type: "debuff" as const,
    effect: { scoreMultiplier: 0.75 },
  },
  /** Timer pressure: emotion -20% */
  flustered: {
    id: "flustered",
    name: "焦り",
    icon: "😰",
    description: "時間に追われ焦っている。感情変動-20%",
    type: "debuff" as const,
    effect: { emotionMultiplier: 0.8 },
  },
} as const;

/**
 * Create a buff from a predefined template.
 */
export function createBuff(
  key: keyof typeof BUFF_DEFINITIONS,
  duration: number,
): StatusEffect {
  return effect(BUFF_DEFINITIONS[key], duration);
}

/**
 * Create a debuff from a predefined template.
 */
export function createDebuff(
  key: keyof typeof DEBUFF_DEFINITIONS,
  duration: number,
): StatusEffect {
  return effect(DEBUFF_DEFINITIONS[key], duration);
}

// ─── StatusEffectManager ────────────────────────────────────

export class StatusEffectManager {
  private effects: StatusEffect[] = [];

  /** Get a copy of all currently active effects. */
  getActiveEffects(): StatusEffect[] {
    return [...this.effects];
  }

  /** Get only active buffs. */
  getBuffs(): StatusEffect[] {
    return this.effects.filter((e) => e.type === "buff");
  }

  /** Get only active debuffs. */
  getDebuffs(): StatusEffect[] {
    return this.effects.filter((e) => e.type === "debuff");
  }

  /**
   * Add a status effect.
   * If an effect with the same id already exists, refresh its duration
   * (take the longer of the two).
   */
  addEffect(newEffect: StatusEffect): void {
    const existing = this.effects.find((e) => e.id === newEffect.id);
    if (existing) {
      existing.duration = Math.max(existing.duration, newEffect.duration);
      return;
    }
    this.effects.push({ ...newEffect });
  }

  /** Decrement all durations by 1 and remove expired effects. */
  tickNode(): void {
    this.effects = this.effects
      .map((e) => ({ ...e, duration: e.duration - 1 }))
      .filter((e) => e.duration > 0);
  }

  /**
   * Aggregate score multiplier from all active effects.
   * Multiplicative stacking (e.g. 1.2 * 0.8 = 0.96).
   */
  getScoreMultiplier(): number {
    return this.effects.reduce(
      (acc, e) => acc * (e.effect.scoreMultiplier ?? 1),
      1,
    );
  }

  /**
   * Aggregate emotion multiplier from all active effects.
   * Multiplicative stacking.
   */
  getEmotionMultiplier(): number {
    return this.effects.reduce(
      (acc, e) => acc * (e.effect.emotionMultiplier ?? 1),
      1,
    );
  }

  /**
   * Total timer bonus/penalty in seconds from all active effects.
   * Additive stacking.
   */
  getTimerBonus(): number {
    return this.effects.reduce(
      (acc, e) => acc + (e.effect.timerExtension ?? 0),
      0,
    );
  }

  /** Check if a specific effect is currently active. */
  hasEffect(id: string): boolean {
    return this.effects.some((e) => e.id === id);
  }

  /** Remove a specific effect by id. */
  removeEffect(id: string): void {
    this.effects = this.effects.filter((e) => e.id !== id);
  }

  /** Clear all effects. */
  reset(): void {
    this.effects = [];
  }
}

/**
 * Helper: determine which buffs/debuffs to apply after a choice.
 * Call this from the game loop after processing a choice.
 */
export function getTriggeredEffects(params: {
  quality: ChoiceQuality;
  combo: number;
  emotion: number;
  consecutiveBad: number;
}): StatusEffect[] {
  const { quality, combo, emotion, consecutiveBad } = params;
  const effects: StatusEffect[] = [];

  // ── Buffs ──
  if (combo >= 5) {
    effects.push(createBuff("zone", 3));
  } else if (combo >= 3) {
    effects.push(createBuff("momentum", 2));
  }

  if (emotion > 70 && (quality === "excellent" || quality === "good")) {
    effects.push(createBuff("trust", 2));
  }

  // ── Debuffs ──
  if (quality === "bad") {
    effects.push(createDebuff("shaken", 1));
  }

  if (emotion < 30) {
    effects.push(createDebuff("coldAir", 2));
  }

  if (consecutiveBad >= 2) {
    effects.push(createDebuff("distrust", 2));
  }

  return effects;
}

/* ═══════════════════════════════════════════════════════════════
   4. DYNAMIC EVENTS SYSTEM — ドラマティックイベント
═══════════════════════════════════════════════════════════════ */

export type EventTrigger =
  | "random"
  | "emotion_high"
  | "emotion_low"
  | "combo"
  | "phase_change";

export interface GameEvent {
  id: string;
  trigger: EventTrigger;
  probability: number;
  minEmotion?: number;
  maxEmotion?: number;
  minCombo?: number;
  phase?: number;
  sceneType?: string;

  title: string;
  description: string;
  icon: string;
  effect: {
    emotionDelta?: number;
    scoreDelta?: number;
    timerDelta?: number;
    statusEffect?: StatusEffect;
  };
  duration: number; // ms to display popup
}

// ─── Event Definitions ──────────────────────────────────────

const GAME_EVENTS: GameEvent[] = [
  // ═══════════════════════════════════════
  //  Office (社長室 / オフィス) Events
  // ═══════════════════════════════════════
  {
    id: "office-secretary-enters",
    trigger: "emotion_high",
    probability: 0.5,
    minEmotion: 55,
    sceneType: "office",
    title: "秘書が入ってきた",
    description: "「社長、次のご予定ですが…」秘書が入ってきたが、社長は「この人の話は最後まで聞くよ」と返した。あなたへの信頼の証だ。",
    icon: "👩‍💼",
    effect: {
      emotionDelta: 5,
      statusEffect: createBuff("confidence", 2),
    },
    duration: 2500,
  },
  {
    id: "office-phone-rings",
    trigger: "random",
    probability: 0.35,
    sceneType: "office",
    title: "電話が鳴った",
    description: "デスクの電話が鳴り響く。社長が「ちょっと失礼」と受話器を取った。商談の流れが一瞬途切れる——集中力を切らすな。",
    icon: "📞",
    effect: {
      emotionDelta: -3,
      timerDelta: -3,
    },
    duration: 2500,
  },
  {
    id: "office-tea-served",
    trigger: "random",
    probability: 0.4,
    sceneType: "office",
    title: "お茶が出された",
    description: "「どうぞ」——温かいお茶が運ばれてきた。場の空気が少し和らぐ。",
    icon: "🍵",
    effect: {
      emotionDelta: 3,
    },
    duration: 3000,
  },
  {
    id: "office-competitor-mention",
    trigger: "emotion_low",
    probability: 0.45,
    maxEmotion: 35,
    sceneType: "office",
    title: "「他社の方がいいんじゃ…」",
    description: "社長がふと言った。「この前来た〇〇社の方が条件良かったんだよなぁ」——ライバルの影がちらつく。負けるな。",
    icon: "⚔️",
    effect: {
      emotionDelta: -5,
      statusEffect: createDebuff("pressure", 2),
    },
    duration: 2500,
  },
  {
    id: "office-nodding",
    trigger: "combo",
    probability: 0.6,
    minCombo: 3,
    sceneType: "office",
    title: "相手が頷き始めた",
    description: "社長が大きく頷いている。「なるほどね…それは面白い」——良い流れだ、畳みかけろ！",
    icon: "😊",
    effect: {
      emotionDelta: 5,
      statusEffect: createBuff("rapport", 2),
    },
    duration: 2500,
  },
  {
    id: "office-boss-leans-forward",
    trigger: "emotion_high",
    probability: 0.4,
    minEmotion: 65,
    sceneType: "office",
    title: "社長が身を乗り出した",
    description: "話に引き込まれた社長が、デスクから身を乗り出してきた。「それ、もう少し詳しく聞かせてくれるか？」",
    icon: "✨",
    effect: {
      emotionDelta: 8,
      scoreDelta: 3,
    },
    duration: 2500,
  },

  // ═══════════════════════════════════════
  //  Cafe (カフェ) Events
  // ═══════════════════════════════════════
  {
    id: "cafe-barista-recommend",
    trigger: "random",
    probability: 0.4,
    sceneType: "cafe",
    title: "バリスタのおすすめ",
    description: "「今日のスペシャルです」——バリスタが季節のドリンクを持ってきてくれた。会話のきっかけになる。",
    icon: "☕",
    effect: {
      emotionDelta: 4,
    },
    duration: 3000,
  },
  {
    id: "cafe-loud-neighbor",
    trigger: "random",
    probability: 0.3,
    sceneType: "cafe",
    title: "隣の席がうるさい",
    description: "隣の席のグループが急に盛り上がり始めた。声が聞こえにくい。「場所変えましょうか？」と提案するチャンスだ。",
    icon: "🔊",
    effect: {
      emotionDelta: -3,
      timerDelta: -2,
    },
    duration: 2500,
  },
  {
    id: "cafe-rain-starts",
    trigger: "random",
    probability: 0.25,
    sceneType: "cafe",
    title: "雨が降り始めた",
    description: "窓の外が急に暗くなり、雨が降り始めた。「あ、傘持ってます？」——帰りの心配が相手の頭をよぎる。テンポよく進めよう。",
    icon: "🌧️",
    effect: {
      emotionDelta: -2,
      timerDelta: -3,
    },
    duration: 2500,
  },
  {
    id: "cafe-shared-laugh",
    trigger: "emotion_high",
    probability: 0.5,
    minEmotion: 60,
    sceneType: "cafe",
    title: "思わず二人で笑った",
    description: "ふとした話題で相手と目が合い、同時に吹き出した。「この人、面白いな」——距離がグッと縮まった瞬間。",
    icon: "😄",
    effect: {
      emotionDelta: 8,
      statusEffect: createBuff("rapport", 3),
    },
    duration: 2500,
  },
  {
    id: "cafe-phone-notification",
    trigger: "emotion_low",
    probability: 0.4,
    maxEmotion: 40,
    sceneType: "cafe",
    title: "相手がスマホをチラ見",
    description: "テーブルの上で相手のスマホが光った。ちらっと画面を見ている…集中力が切れかけている。話を戻せ！",
    icon: "📱",
    effect: {
      emotionDelta: -4,
      statusEffect: createDebuff("nervousness", 1),
    },
    duration: 2500,
  },

  // ═══════════════════════════════════════
  //  Exhibition (展示会) Events
  // ═══════════════════════════════════════
  {
    id: "exhibition-rival-booth",
    trigger: "random",
    probability: 0.35,
    sceneType: "exhibition",
    title: "ライバル会社のブース",
    description: "隣のブースにライバル会社が出展している。相手の目がそちらに泳いだ——差別化トークで引き留めろ！",
    icon: "🏴",
    effect: {
      emotionDelta: -4,
      timerDelta: 5,
      statusEffect: createDebuff("pressure", 1),
    },
    duration: 2500,
  },
  {
    id: "exhibition-crowd",
    trigger: "emotion_high",
    probability: 0.45,
    minEmotion: 50,
    sceneType: "exhibition",
    title: "人だかりができた",
    description: "あなたの説明に引き寄せられ、通行人が足を止めた。注目の的だ——プレッシャーをエネルギーに変えろ！",
    icon: "👥",
    effect: {
      emotionDelta: 5,
      scoreDelta: 3,
      statusEffect: createBuff("confidence", 2),
    },
    duration: 2500,
  },
  {
    id: "exhibition-demo-crash",
    trigger: "random",
    probability: 0.25,
    sceneType: "exhibition",
    title: "デモ画面がフリーズ！",
    description: "タブレットのデモアプリが固まった！ 相手が不安そうにこちらを見ている——口頭で切り抜けろ！",
    icon: "💻",
    effect: {
      emotionDelta: -5,
      timerDelta: -3,
    },
    duration: 2500,
  },
  {
    id: "exhibition-business-card-full",
    trigger: "combo",
    probability: 0.5,
    minCombo: 2,
    sceneType: "exhibition",
    title: "「名刺もう一枚いいですか？」",
    description: "相手が同僚を呼んできた。「この人の話、聞いた方がいいよ」——紹介の連鎖が始まる！",
    icon: "📇",
    effect: {
      emotionDelta: 8,
      scoreDelta: 5,
    },
    duration: 2500,
  },
  {
    id: "exhibition-announcement",
    trigger: "phase_change",
    probability: 0.4,
    phase: 3,
    sceneType: "exhibition",
    title: "会場アナウンス",
    description: "「まもなく特別講演が始まります」——相手の時間が限られている。要点を絞れ！",
    icon: "🔔",
    effect: {
      timerDelta: -5,
      emotionDelta: -2,
    },
    duration: 3000,
  },

  // ═══════════════════════════════════════
  //  Online (オンライン) Events
  // ═══════════════════════════════════════
  {
    id: "online-screen-freeze",
    trigger: "random",
    probability: 0.35,
    sceneType: "online",
    title: "画面が一瞬フリーズ",
    description: "「あれ…固まった？」画面が一瞬止まった。相手が不安げに「聞こえてますか？」——冷静に対応だ。",
    icon: "🖥️",
    effect: {
      emotionDelta: -3,
      timerDelta: -2,
    },
    duration: 3000,
  },
  {
    id: "online-pet-appears",
    trigger: "random",
    probability: 0.25,
    sceneType: "online",
    title: "相手の背後にペットが…",
    description: "カメラの向こうで猫が棚の上を歩いている。相手が慌てて追い払う。「すみません…」——場が和む瞬間。",
    icon: "🐱",
    effect: {
      emotionDelta: 5,
    },
    duration: 2500,
  },
  {
    id: "online-mute-mistake",
    trigger: "emotion_low",
    probability: 0.3,
    maxEmotion: 35,
    sceneType: "online",
    title: "ミュート解除忘れ！",
    description: "相手「…聞こえてませんよ？」大事な説明中にミュートになっていた。もう一度説明し直す羽目に。",
    icon: "🔇",
    effect: {
      emotionDelta: -5,
      timerDelta: -4,
      statusEffect: createDebuff("shaken", 1),
    },
    duration: 2500,
  },
  {
    id: "online-screen-share-wow",
    trigger: "combo",
    probability: 0.5,
    minCombo: 3,
    sceneType: "online",
    title: "「その画面、共有してもらえますか？」",
    description: "相手から画面共有のリクエストが来た。食い入るように資料を見ている——関心が最高潮だ！",
    icon: "📊",
    effect: {
      emotionDelta: 8,
      scoreDelta: 3,
      statusEffect: createBuff("confidence", 2),
    },
    duration: 2500,
  },
  {
    id: "online-background-noise",
    trigger: "random",
    probability: 0.3,
    sceneType: "online",
    title: "背景で工事の音が…",
    description: "ガガガガ…！ 相手のオフィス近くで工事が始まったようだ。「うるさくてすみません…」——集中力が試される。",
    icon: "🔨",
    effect: {
      emotionDelta: -4,
      timerDelta: -2,
    },
    duration: 3000,
  },

  // ═══════════════════════════════════════
  //  Restaurant (飲食店 / 飛び込み) Events
  // ═══════════════════════════════════════
  {
    id: "restaurant-customer-rush",
    trigger: "random",
    probability: 0.35,
    sceneType: "restaurant",
    title: "お客さんが来た！",
    description: "「いらっしゃいませ！」——店にお客さんが入ってきた。店長の注意がそちらに移る。手短にまとめろ！",
    icon: "🚶",
    effect: {
      emotionDelta: -5,
      timerDelta: -5,
    },
    duration: 2500,
  },
  {
    id: "restaurant-food-served",
    trigger: "random",
    probability: 0.3,
    sceneType: "restaurant",
    title: "「これ、食べてみて」",
    description: "店長が自慢の料理を出してくれた。「うまいでしょ？」——店長のプライドに触れる絶好のチャンスだ。",
    icon: "🍽️",
    effect: {
      emotionDelta: 6,
      statusEffect: createBuff("rapport", 2),
    },
    duration: 2500,
  },
  {
    id: "restaurant-delivery-arrives",
    trigger: "random",
    probability: 0.3,
    sceneType: "restaurant",
    title: "業者の配達が来た",
    description: "「おーい、ここ置いといて！」食材の配達が来て、店長がバタバタ。忙しいアピールが始まった。",
    icon: "📦",
    effect: {
      emotionDelta: -3,
      timerDelta: -3,
    },
    duration: 3000,
  },
  {
    id: "restaurant-regular-vouches",
    trigger: "emotion_high",
    probability: 0.4,
    minEmotion: 55,
    sceneType: "restaurant",
    title: "常連客がフォロー！",
    description: "カウンターの常連が「いいシステムじゃん、入れなよ」と援護射撃。店長の表情が変わった！",
    icon: "🍻",
    effect: {
      emotionDelta: 10,
      scoreDelta: 3,
      statusEffect: createBuff("confidence", 2),
    },
    duration: 2500,
  },
  {
    id: "restaurant-arms-crossed",
    trigger: "emotion_low",
    probability: 0.45,
    maxEmotion: 30,
    sceneType: "restaurant",
    title: "腕を組んだ",
    description: "店長が腕を組み、少し後ろに下がった。「で？ それがうちに何の関係あるの？」——壁を感じる。",
    icon: "💢",
    effect: {
      emotionDelta: -5,
      statusEffect: createDebuff("distrust", 2),
    },
    duration: 2500,
  },

  // ═══════════════════════════════════════
  //  Generic (全シナリオ共通) Events
  // ═══════════════════════════════════════
  {
    id: "generic-taking-notes",
    trigger: "combo",
    probability: 0.5,
    minCombo: 2,
    title: "相手がメモを取り始めた",
    description: "ペンを取り出し、真剣にメモを取っている。あなたの言葉が響いている証拠だ。",
    icon: "📝",
    effect: {
      emotionDelta: 6,
      scoreDelta: 2,
    },
    duration: 3000,
  },
  {
    id: "generic-arms-crossed",
    trigger: "emotion_low",
    probability: 0.4,
    maxEmotion: 30,
    title: "視線が冷たくなった",
    description: "相手の目が冷たくなり、表情が固まった。防御姿勢——このまま押しても逆効果だ。アプローチを変えろ。",
    icon: "🧊",
    effect: {
      emotionDelta: -4,
      statusEffect: createDebuff("nervousness", 2),
    },
    duration: 2500,
  },
  {
    id: "generic-smile",
    trigger: "emotion_high",
    probability: 0.45,
    minEmotion: 60,
    title: "相手がふっと笑った",
    description: "堅かった表情が緩み、自然な笑顔が見えた。心の壁が崩れ始めている。",
    icon: "😊",
    effect: {
      emotionDelta: 5,
      statusEffect: createBuff("rapport", 2),
    },
    duration: 3000,
  },
  {
    id: "generic-check-watch",
    trigger: "emotion_low",
    probability: 0.35,
    maxEmotion: 25,
    title: "時計をチラ見…",
    description: "相手がさりげなく時計を確認した。「そろそろ時間が…」と言い出しかねない。巻き返しは今だ！",
    icon: "⌚",
    effect: {
      emotionDelta: -3,
      timerDelta: -5,
    },
    duration: 3000,
  },
  {
    id: "generic-leaning-in",
    trigger: "combo",
    probability: 0.45,
    minCombo: 4,
    title: "目が輝いた！",
    description: "相手の瞳が変わった。「それ、もっと聞かせて」——完全に興味を引いた。主導権はあなたにある！",
    icon: "⚡",
    effect: {
      emotionDelta: 7,
      scoreDelta: 4,
      statusEffect: createBuff("confidence", 2),
    },
    duration: 2500,
  },
  {
    id: "generic-deep-breath",
    trigger: "random",
    probability: 0.2,
    title: "沈黙が流れた…",
    description: "ふっと会話が途切れ、重い沈黙が場を支配する。相手は何かを考え込んでいる。",
    icon: "🫥",
    effect: {
      emotionDelta: -2,
    },
    duration: 2500,
  },
  {
    id: "generic-colleague-call",
    trigger: "phase_change",
    probability: 0.3,
    phase: 2,
    title: "スマホ通知が光った",
    description: "相手のスマホに通知が光った。チラッと目線がそれる。「失礼…」——集中力が一瞬切れた。取り戻せるか？",
    icon: "📱",
    effect: {
      emotionDelta: -3,
      timerDelta: -3,
    },
    duration: 2500,
  },
  {
    id: "generic-nod-agreement",
    trigger: "emotion_high",
    probability: 0.4,
    minEmotion: 70,
    title: "「確かにそうだね」",
    description: "相手が何度も頷きながら同意している。完全にこちらのペースだ。",
    icon: "👍",
    effect: {
      emotionDelta: 5,
      scoreDelta: 2,
      statusEffect: createBuff("confidence", 1),
    },
    duration: 3000,
  },
  {
    id: "generic-sudden-question",
    trigger: "random",
    probability: 0.3,
    title: "鋭い質問が飛んできた",
    description: "「ところで、御社の導入実績は？」——想定外の質問。ここでの対応がプロかアマかの分かれ道だ。",
    icon: "❓",
    effect: {
      emotionDelta: -2,
      timerDelta: -3,
    },
    duration: 2500,
  },
  {
    id: "generic-water-break",
    trigger: "random",
    probability: 0.2,
    title: "相手が水を飲んだ",
    description: "コップの水に手を伸ばし、一口。特に意味はないが…あなたも一息つける。",
    icon: "💧",
    effect: {
      timerDelta: 3,
    },
    duration: 2000,
  },
  {
    id: "generic-referral-hint",
    trigger: "emotion_high",
    probability: 0.3,
    minEmotion: 75,
    title: "「知り合いにも紹介しようかな」",
    description: "まだ契約もしていないのに紹介の話が出た！ 相手はすでにあなたのファンになっている。",
    icon: "🌟",
    effect: {
      emotionDelta: 10,
      scoreDelta: 5,
    },
    duration: 2500,
  },

  // ═══════════════════════════════════════
  //  Office (追加) — 10 events
  // ═══════════════════════════════════════
  {
    id: "office-stare-window",
    trigger: "emotion_low",
    probability: 0.35,
    maxEmotion: 40,
    sceneType: "office",
    title: "社長が窓の外を見つめる",
    description: "社長の視線が窓の外に流れた。話に集中していない——興味を引き戻す一手が必要だ。",
    icon: "🪟",
    effect: {
      emotionDelta: -4,
      statusEffect: createDebuff("nervousness", 1),
    },
    duration: 2500,
  },
  {
    id: "office-executive-peeks",
    trigger: "random",
    probability: 0.3,
    sceneType: "office",
    title: "役員が覗きに来た",
    description: "ドアが少し開き、役員が顔を覗かせた。「何の話？」——聴衆が増えた。プレゼンの見せ場だ。",
    icon: "👀",
    effect: {
      emotionDelta: -2,
      timerDelta: -2,
      statusEffect: createDebuff("pressure", 1),
    },
    duration: 2500,
  },
  {
    id: "office-business-card",
    trigger: "emotion_high",
    probability: 0.4,
    minEmotion: 50,
    sceneType: "office",
    title: "名刺を丁寧に受け取った",
    description: "社長があなたの名刺を両手で受け取り、じっくり読んでいる。「いい名刺ですね」——第一印象は上々だ。",
    icon: "📇",
    effect: {
      emotionDelta: 4,
      statusEffect: createBuff("rapport", 1),
    },
    duration: 3000,
  },
  {
    id: "office-calculator",
    trigger: "emotion_high",
    probability: 0.45,
    minEmotion: 60,
    sceneType: "office",
    title: "社長が電卓を叩き始めた",
    description: "おもむろに電卓を取り出し、計算を始めた。コスト試算をしている——具体的な検討フェーズに入った証拠だ！",
    icon: "🧮",
    effect: {
      emotionDelta: 8,
      scoreDelta: 3,
      statusEffect: createBuff("confidence", 2),
    },
    duration: 2500,
  },
  {
    id: "office-family-photo",
    trigger: "random",
    probability: 0.3,
    sceneType: "office",
    title: "壁の写真に気づいた",
    description: "ふと壁に飾られた家族写真が目に入った。共通の話題になるかもしれない——人間関係を深めるチャンスだ。",
    icon: "🖼️",
    effect: {
      emotionDelta: 3,
      statusEffect: createBuff("charm", 1),
    },
    duration: 3000,
  },
  {
    id: "office-open-laptop",
    trigger: "combo",
    probability: 0.5,
    minCombo: 2,
    sceneType: "office",
    title: "パソコンを開いた",
    description: "社長がノートPCを開いた。「ちょっと今の話、資料で確認させてくれ」——真剣に検討し始めている！",
    icon: "💻",
    effect: {
      emotionDelta: 6,
      scoreDelta: 2,
    },
    duration: 2500,
  },
  {
    id: "office-want-staff-to-hear",
    trigger: "emotion_high",
    probability: 0.35,
    minEmotion: 70,
    sceneType: "office",
    title: "「うちの社員にも聞かせたい」",
    description: "社長が突然言った。「これ、うちの営業にも聞かせたい話だな」——最高の褒め言葉だ！",
    icon: "🏢",
    effect: {
      emotionDelta: 10,
      scoreDelta: 5,
      statusEffect: createBuff("masterMind", 2),
    },
    duration: 2500,
  },
  {
    id: "office-predecessor-bad",
    trigger: "emotion_low",
    probability: 0.4,
    maxEmotion: 35,
    sceneType: "office",
    title: "前任者の悪い印象",
    description: "「前に来た営業がひどくてね…」——前任者のせいで印象が悪い。信頼を一から築き直す必要がある。",
    icon: "👤",
    effect: {
      emotionDelta: -6,
      statusEffect: createDebuff("intimidated", 2),
    },
    duration: 2500,
  },
  {
    id: "office-sigh-continue",
    trigger: "random",
    probability: 0.25,
    sceneType: "office",
    title: "ため息をついた後に「続けて」",
    description: "社長が大きなため息をついた。「…で、続けてくれ」——疲れている？ それとも考え込んでいる？ 読みが試される。",
    icon: "💭",
    effect: {
      emotionDelta: -1,
      timerDelta: 3,
    },
    duration: 3000,
  },
  {
    id: "office-ask-price",
    trigger: "emotion_high",
    probability: 0.5,
    minEmotion: 55,
    sceneType: "office",
    title: "「値段は？」と聞かれた",
    description: "「で、いくらなの？」——価格を聞いてきた。これは買いシグナルだ！ 自信を持って答えろ。",
    icon: "💰",
    effect: {
      emotionDelta: 5,
      scoreDelta: 3,
    },
    duration: 2500,
  },

  // ═══════════════════════════════════════
  //  Cafe (追加) — 10 events
  // ═══════════════════════════════════════
  {
    id: "cafe-order-change",
    trigger: "emotion_high",
    probability: 0.35,
    minEmotion: 55,
    sceneType: "cafe",
    title: "相手が注文を変えた",
    description: "「やっぱりケーキも頼もうかな」——リラックスして追加注文。長居する気になった証拠だ。",
    icon: "🍰",
    effect: {
      emotionDelta: 5,
      timerDelta: 3,
    },
    duration: 3000,
  },
  {
    id: "cafe-bgm-changed",
    trigger: "random",
    probability: 0.2,
    sceneType: "cafe",
    title: "BGMが変わった",
    description: "店内のBGMがジャズからクラシックに変わった。雰囲気が少し変わり、会話のトーンもリセットされる。",
    icon: "🎵",
    effect: {
      emotionDelta: 1,
    },
    duration: 2500,
  },
  {
    id: "cafe-other-customer-interrupt",
    trigger: "random",
    probability: 0.25,
    sceneType: "cafe",
    title: "他の客が声をかけてきた",
    description: "「すみません、お砂糖取ってもらえますか？」——第三者に会話を中断された。流れを取り戻せ。",
    icon: "🙋",
    effect: {
      emotionDelta: -2,
      timerDelta: -2,
    },
    duration: 3000,
  },
  {
    id: "cafe-menu-closed",
    trigger: "combo",
    probability: 0.45,
    minCombo: 2,
    sceneType: "cafe",
    title: "相手がメニューを閉じた",
    description: "テーブルのメニューを静かに閉じ、こちらに視線を向けた。完全にあなたの話に集中している。",
    icon: "📖",
    effect: {
      emotionDelta: 5,
      statusEffect: createBuff("rapport", 2),
    },
    duration: 3000,
  },
  {
    id: "cafe-light-change",
    trigger: "random",
    probability: 0.2,
    sceneType: "cafe",
    title: "窓際の席で光が変わった",
    description: "雲が切れ、暖かい日差しが差し込んだ。テーブルに光が広がる——雰囲気が明るくなった。",
    icon: "☀️",
    effect: {
      emotionDelta: 3,
    },
    duration: 2500,
  },
  {
    id: "cafe-spill-coffee",
    trigger: "random",
    probability: 0.2,
    sceneType: "cafe",
    title: "コーヒーをこぼしそうになった",
    description: "カップに手が当たり、コーヒーが揺れた！ ギリギリセーフだが、一瞬ヒヤッとした。",
    icon: "☕",
    effect: {
      emotionDelta: -2,
      statusEffect: createDebuff("flustered", 1),
    },
    duration: 2500,
  },
  {
    id: "cafe-wrong-order",
    trigger: "random",
    probability: 0.2,
    sceneType: "cafe",
    title: "店員が間違えて持ってきた",
    description: "「こちらご注文のカプチーノです」「…頼んでないんですが」——ちょっとしたハプニングで場が和む。",
    icon: "🤷",
    effect: {
      emotionDelta: 2,
    },
    duration: 3000,
  },
  {
    id: "cafe-acquaintance-arrives",
    trigger: "random",
    probability: 0.25,
    sceneType: "cafe",
    title: "相手の知り合いが偶然来た",
    description: "「あれ？ 田中さん！」相手の知人がカフェに現れた。紹介してもらえるかもしれないが、会話は中断。",
    icon: "🤝",
    effect: {
      emotionDelta: -1,
      timerDelta: -3,
    },
    duration: 2500,
  },
  {
    id: "cafe-wifi-down",
    trigger: "random",
    probability: 0.2,
    sceneType: "cafe",
    title: "カフェのWiFiが切れた",
    description: "「あれ、ネットが繋がらない…」資料をオンラインで見せようとしたが、WiFiが不安定。口頭で勝負だ。",
    icon: "📶",
    effect: {
      emotionDelta: -3,
      timerDelta: -2,
    },
    duration: 3000,
  },
  {
    id: "cafe-check-time",
    trigger: "phase_change",
    probability: 0.4,
    phase: 3,
    sceneType: "cafe",
    title: "お会計の話になった",
    description: "「そろそろ出ましょうか」——相手がお会計を意識し始めた。まとめに入る時だ。",
    icon: "💳",
    effect: {
      timerDelta: -5,
      emotionDelta: -2,
    },
    duration: 3000,
  },

  // ═══════════════════════════════════════
  //  Exhibition (追加) — 10 events
  // ═══════════════════════════════════════
  {
    id: "exhibition-foreigner-needs-interpreter",
    trigger: "random",
    probability: 0.25,
    sceneType: "exhibition",
    title: "通訳が必要な外国人が来た",
    description: "外国人の来場者がブースに来た。英語での説明が必要だ——語学力と機転が試される。",
    icon: "🌍",
    effect: {
      emotionDelta: -3,
      timerDelta: -3,
      statusEffect: createDebuff("pressure", 1),
    },
    duration: 2500,
  },
  {
    id: "exhibition-neighbor-loud-demo",
    trigger: "random",
    probability: 0.3,
    sceneType: "exhibition",
    title: "隣ブースのデモが大音量",
    description: "隣のブースが派手なデモを始めた。「すごいですねー！」と来場者がそちらに流れていく…負けるな！",
    icon: "🔊",
    effect: {
      emotionDelta: -4,
      statusEffect: createDebuff("nervousness", 1),
    },
    duration: 2500,
  },
  {
    id: "exhibition-pamphlet-out",
    trigger: "random",
    probability: 0.3,
    sceneType: "exhibition",
    title: "パンフレットが切れた",
    description: "「パンフレットください」「あ…切れてしまって…」——準備不足が露呈。口頭でカバーするしかない。",
    icon: "📄",
    effect: {
      emotionDelta: -3,
      statusEffect: createDebuff("flustered", 1),
    },
    duration: 3000,
  },
  {
    id: "exhibition-vip-badge",
    trigger: "emotion_high",
    probability: 0.4,
    minEmotion: 50,
    sceneType: "exhibition",
    title: "VIPバッジの来場者",
    description: "首からVIPバッジを下げた人物がブースに立ち寄った。「面白いね、これ」——大物かもしれない。全力でアピールだ！",
    icon: "🏅",
    effect: {
      emotionDelta: 5,
      scoreDelta: 5,
      statusEffect: createBuff("adrenaline", 1),
    },
    duration: 2500,
  },
  {
    id: "exhibition-media-coverage",
    trigger: "combo",
    probability: 0.35,
    minCombo: 3,
    sceneType: "exhibition",
    title: "記者・メディアが取材に来た",
    description: "「〇〇新聞ですが、取材させていただけますか？」——メディア露出のチャンス。ここで決めろ！",
    icon: "📰",
    effect: {
      emotionDelta: 8,
      scoreDelta: 5,
      statusEffect: createBuff("confidence", 3),
    },
    duration: 2500,
  },
  {
    id: "exhibition-light-flicker",
    trigger: "random",
    probability: 0.2,
    sceneType: "exhibition",
    title: "ブースの照明がチカチカ",
    description: "ブースの照明が不安定に点滅し始めた。「大丈夫ですか？」と来場者が心配顔——早く直さないと。",
    icon: "💡",
    effect: {
      emotionDelta: -3,
      timerDelta: -2,
    },
    duration: 3000,
  },
  {
    id: "exhibition-other-exhibitor",
    trigger: "random",
    probability: 0.25,
    sceneType: "exhibition",
    title: "他の出展者が様子を見に来た",
    description: "隣のブースのスタッフが「調子どうですか？」と声をかけてきた。情報交換のチャンスだが、今は商談中だ。",
    icon: "🤵",
    effect: {
      emotionDelta: -1,
      timerDelta: -2,
    },
    duration: 2500,
  },
  {
    id: "exhibition-freebie-hunter",
    trigger: "random",
    probability: 0.3,
    sceneType: "exhibition",
    title: "景品をねだる人",
    description: "「景品だけもらえますか？」——商談には興味のない人が来た。丁重にさばいて本命に集中しよう。",
    icon: "🎁",
    effect: {
      emotionDelta: -2,
      timerDelta: -3,
    },
    duration: 3000,
  },
  {
    id: "exhibition-stamp-rally",
    trigger: "random",
    probability: 0.2,
    sceneType: "exhibition",
    title: "スタンプラリーの客",
    description: "「スタンプだけお願いします！」——スタンプラリー参加者がブースに殺到。対応に追われる。",
    icon: "🗂️",
    effect: {
      emotionDelta: -2,
      timerDelta: -4,
    },
    duration: 3000,
  },
  {
    id: "exhibition-organizer-rounds",
    trigger: "phase_change",
    probability: 0.35,
    phase: 2,
    sceneType: "exhibition",
    title: "主催者が巡回に来た",
    description: "主催者が各ブースを回っている。「いい感じですね！」——良い評価をもらえた。士気が上がる。",
    icon: "🎪",
    effect: {
      emotionDelta: 4,
      scoreDelta: 2,
      statusEffect: createBuff("confidence", 1),
    },
    duration: 3000,
  },

  // ═══════════════════════════════════════
  //  Online (追加) — 10 events
  // ═══════════════════════════════════════
  {
    id: "online-child-appears",
    trigger: "random",
    probability: 0.25,
    sceneType: "online",
    title: "相手の子供が画面に映り込む",
    description: "「パパ何してるの？」——子供が画面に飛び込んできた。相手は慌てているが…微笑ましい瞬間だ。",
    icon: "👶",
    effect: {
      emotionDelta: 4,
      statusEffect: createBuff("charm", 1),
    },
    duration: 2500,
  },
  {
    id: "online-recording-request",
    trigger: "emotion_high",
    probability: 0.4,
    minEmotion: 60,
    sceneType: "online",
    title: "録画していいか聞かれた",
    description: "「この内容、録画して社内で共有してもいいですか？」——あなたの話が社内展開される。大きな前進だ！",
    icon: "🎥",
    effect: {
      emotionDelta: 8,
      scoreDelta: 5,
      statusEffect: createBuff("masterMind", 2),
    },
    duration: 2500,
  },
  {
    id: "online-chat-question",
    trigger: "combo",
    probability: 0.45,
    minCombo: 2,
    sceneType: "online",
    title: "チャットで質問が来た",
    description: "画面のチャット欄に質問が投稿された。「具体的な導入事例を教えてください」——関心が高まっている。",
    icon: "💬",
    effect: {
      emotionDelta: 5,
      scoreDelta: 2,
    },
    duration: 3000,
  },
  {
    id: "online-camera-off",
    trigger: "emotion_low",
    probability: 0.4,
    maxEmotion: 35,
    sceneType: "online",
    title: "相手がカメラをOFFにした",
    description: "突然相手のカメラがOFFに。表情が見えなくなった——興味を失った？ それとも別の用事？ 不安が募る。",
    icon: "📷",
    effect: {
      emotionDelta: -5,
      statusEffect: createDebuff("nervousness", 2),
    },
    duration: 2500,
  },
  {
    id: "online-virtual-bg-glitch",
    trigger: "random",
    probability: 0.2,
    sceneType: "online",
    title: "バーチャル背景が崩れた",
    description: "相手のバーチャル背景が崩れ、自宅の様子がチラリ。お互い苦笑い——アイスブレイクのネタになる。",
    icon: "🖼️",
    effect: {
      emotionDelta: 2,
    },
    duration: 2500,
  },
  {
    id: "online-unexpected-participant",
    trigger: "random",
    probability: 0.3,
    sceneType: "online",
    title: "別の参加者が入ってきた",
    description: "「失礼します、途中参加です」——予定にない人物がミーティングに加わった。聴衆が増えた。",
    icon: "👥",
    effect: {
      emotionDelta: -2,
      timerDelta: -2,
      statusEffect: createDebuff("pressure", 1),
    },
    duration: 2500,
  },
  {
    id: "online-screen-share-risk",
    trigger: "random",
    probability: 0.2,
    sceneType: "online",
    title: "画面共有で個人情報が映りそう",
    description: "画面共有しようとしたら、通知が映りそうに！ 慌てて「おっと…」——冷静に対処しよう。",
    icon: "🔒",
    effect: {
      emotionDelta: -3,
      statusEffect: createDebuff("flustered", 1),
    },
    duration: 3000,
  },
  {
    id: "online-extend-time",
    trigger: "emotion_high",
    probability: 0.35,
    minEmotion: 65,
    sceneType: "online",
    title: "「時間を延長してもいい」と言われた",
    description: "「次の予定まで余裕あるので、もう少し聞かせてください」——最高のシグナルだ。相手は本気で興味がある。",
    icon: "⏰",
    effect: {
      emotionDelta: 8,
      timerDelta: 8,
      statusEffect: createBuff("confidence", 2),
    },
    duration: 2500,
  },
  {
    id: "online-unstable-connection",
    trigger: "random",
    probability: 0.3,
    sceneType: "online",
    title: "接続が不安定で音が途切れる",
    description: "「すみません…途切れて…聞こえ…」——回線が不安定。大事なポイントが伝わっていないかもしれない。",
    icon: "📶",
    effect: {
      emotionDelta: -4,
      timerDelta: -3,
      statusEffect: createDebuff("confusion", 1),
    },
    duration: 2500,
  },
  {
    id: "online-screenshot-taken",
    trigger: "combo",
    probability: 0.4,
    minCombo: 3,
    sceneType: "online",
    title: "スクリーンショットを撮られた",
    description: "相手が画面のスクリーンショットを撮った。「この部分、保存させてもらいますね」——資料が刺さっている！",
    icon: "📸",
    effect: {
      emotionDelta: 6,
      scoreDelta: 3,
    },
    duration: 3000,
  },

  // ═══════════════════════════════════════
  //  Restaurant (追加) — 10 events
  // ═══════════════════════════════════════
  {
    id: "restaurant-knife-noise",
    trigger: "random",
    probability: 0.25,
    sceneType: "restaurant",
    title: "仕込み中で包丁の音がうるさい",
    description: "トントントン！ 厨房から包丁の音が響く。「仕込み中なんで！」——声を張って話す必要がある。",
    icon: "🔪",
    effect: {
      emotionDelta: -3,
      timerDelta: -2,
    },
    duration: 3000,
  },
  {
    id: "restaurant-staff-mistake",
    trigger: "random",
    probability: 0.25,
    sceneType: "restaurant",
    title: "アルバイトがミスをした",
    description: "「すみません！」アルバイトが皿を落とした。店長が対応に追われる——しばし中断。",
    icon: "💥",
    effect: {
      emotionDelta: -4,
      timerDelta: -4,
    },
    duration: 2500,
  },
  {
    id: "restaurant-regular-complaint",
    trigger: "emotion_low",
    probability: 0.35,
    maxEmotion: 35,
    sceneType: "restaurant",
    title: "常連からのクレーム",
    description: "「大将、この前の料理ちょっとしょっぱかったよ」常連が文句を言い始めた。店長のイライラが伝染しそうだ。",
    icon: "😡",
    effect: {
      emotionDelta: -5,
      statusEffect: createDebuff("coldAir", 1),
    },
    duration: 2500,
  },
  {
    id: "restaurant-competitor-cm",
    trigger: "random",
    probability: 0.2,
    sceneType: "restaurant",
    title: "テレビで競合のCMが流れた",
    description: "店内のテレビに競合サービスのCMが流れた。「あ、これ知ってるよ」と店長。差別化を説明するチャンスだ。",
    icon: "📺",
    effect: {
      emotionDelta: -3,
      statusEffect: createDebuff("pressure", 1),
    },
    duration: 2500,
  },
  {
    id: "restaurant-wife-appears",
    trigger: "random",
    probability: 0.3,
    sceneType: "restaurant",
    title: "店長の奥さんが登場",
    description: "「あなた、また営業の人？」奥さんが厨房から出てきた。味方につけるか、敵に回すか——ここが分岐点。",
    icon: "👩",
    effect: {
      emotionDelta: -2,
      timerDelta: -2,
    },
    duration: 2500,
  },
  {
    id: "restaurant-rainy-slow",
    trigger: "random",
    probability: 0.25,
    sceneType: "restaurant",
    title: "雨の日で客が少ない",
    description: "店内はガラガラ。「雨だとね…」と店長がつぶやく。暇な分じっくり話を聞いてもらえるチャンスだ。",
    icon: "🌧️",
    effect: {
      emotionDelta: 3,
      timerDelta: 5,
    },
    duration: 3000,
  },
  {
    id: "restaurant-drunk-customer",
    trigger: "random",
    probability: 0.2,
    sceneType: "restaurant",
    title: "酔った客が絡んできた",
    description: "「おーい、何売ってんの？」酔った客が話に割り込んできた。やんわりかわして商談に戻ろう。",
    icon: "🍺",
    effect: {
      emotionDelta: -4,
      timerDelta: -3,
      statusEffect: createDebuff("confusion", 1),
    },
    duration: 2500,
  },
  {
    id: "restaurant-neighbor-owner",
    trigger: "random",
    probability: 0.25,
    sceneType: "restaurant",
    title: "近所の店長が様子見",
    description: "「お、営業さん来てるの？ うちにも来てよ」——近隣の店長が顔を出した。紹介のチャンスだ。",
    icon: "🏪",
    effect: {
      emotionDelta: 4,
      scoreDelta: 2,
    },
    duration: 3000,
  },
  {
    id: "restaurant-power-flicker",
    trigger: "random",
    probability: 0.15,
    sceneType: "restaurant",
    title: "電気が一瞬消えた",
    description: "パチッ！ 店内の照明が一瞬消え、すぐに戻った。「ブレーカーかな…」——不吉な雰囲気。",
    icon: "⚡",
    effect: {
      emotionDelta: -2,
      statusEffect: createDebuff("nervousness", 1),
    },
    duration: 2500,
  },
  {
    id: "restaurant-uber-order",
    trigger: "random",
    probability: 0.3,
    sceneType: "restaurant",
    title: "UberEatsの注文が入った",
    description: "ピロン♪「あ、Uber来た！」店長がスマホを確認。忙しそうだが、デジタルに前向きな姿勢が見える。",
    icon: "🛵",
    effect: {
      emotionDelta: 1,
      timerDelta: -3,
    },
    duration: 3000,
  },

  // ═══════════════════════════════════════
  //  Generic (追加) — 20 events
  // ═══════════════════════════════════════
  {
    id: "generic-anything-else",
    trigger: "emotion_high",
    probability: 0.4,
    minEmotion: 65,
    title: "「他に聞きたいことある？」",
    description: "相手が自分から質問を促してきた。興味の表れだ——準備しておいたキラーコンテンツを出せ！",
    icon: "🙋",
    effect: {
      emotionDelta: 6,
      scoreDelta: 3,
      statusEffect: createBuff("rapport", 2),
    },
    duration: 2500,
  },
  {
    id: "generic-print-typo",
    trigger: "random",
    probability: 0.2,
    title: "資料の印刷ミスに気づいた",
    description: "「あれ…この数字、おかしくないですか？」——資料に誤字を発見された。誠実に訂正し、信頼を守れ。",
    icon: "📋",
    effect: {
      emotionDelta: -4,
      statusEffect: createDebuff("flustered", 1),
    },
    duration: 2500,
  },
  {
    id: "generic-stood-up",
    trigger: "emotion_low",
    probability: 0.35,
    maxEmotion: 25,
    title: "相手が立ち上がった",
    description: "相手が椅子から立ち上がった。帰る準備？ それとも…「ちょっとトイレ」——心臓に悪い瞬間だ。",
    icon: "🚶",
    effect: {
      emotionDelta: -5,
      statusEffect: createDebuff("pressure", 1),
    },
    duration: 2500,
  },
  {
    id: "generic-famous-quote",
    trigger: "random",
    probability: 0.2,
    title: "名言を引用してきた",
    description: "「ドラッカーも言ってるけど…」相手が有名な名言を引用した。知識レベルが高い相手だ。話のレベルを上げろ。",
    icon: "📚",
    effect: {
      emotionDelta: 2,
      statusEffect: createDebuff("intimidated", 1),
    },
    duration: 3000,
  },
  {
    id: "generic-internal-review",
    trigger: "emotion_high",
    probability: 0.35,
    minEmotion: 55,
    title: "「社内で検討します」",
    description: "前向きな返事だが、これは断り文句にもなりうる。次のアクションを明確にして、確度を上げろ！",
    icon: "🏢",
    effect: {
      emotionDelta: 2,
      scoreDelta: 2,
    },
    duration: 2500,
  },
  {
    id: "generic-unexpected-question",
    trigger: "random",
    probability: 0.3,
    title: "予想外の質問",
    description: "「それ、法的に問題ないの？」——まったく予想していなかった角度からの質問。冷静に、正直に答えよう。",
    icon: "⚠️",
    effect: {
      emotionDelta: -3,
      timerDelta: -3,
      statusEffect: createDebuff("confusion", 1),
    },
    duration: 2500,
  },
  {
    id: "generic-calculating",
    trigger: "emotion_high",
    probability: 0.4,
    minEmotion: 60,
    title: "相手が計算を始めた",
    description: "スマホの電卓アプリを開いて、何か計算している。「年間で考えると…」——購入を前提にした計算だ！",
    icon: "🧮",
    effect: {
      emotionDelta: 7,
      scoreDelta: 3,
    },
    duration: 2500,
  },
  {
    id: "generic-long-silence",
    trigger: "emotion_low",
    probability: 0.3,
    maxEmotion: 35,
    title: "沈黙が続いた",
    description: "……長い沈黙。相手は何を考えている？ 焦って話し始めるか、待つか——判断力が問われる。",
    icon: "🤐",
    effect: {
      emotionDelta: -3,
      timerDelta: -2,
      statusEffect: createDebuff("nervousness", 1),
    },
    duration: 2500,
  },
  {
    id: "generic-pours-coffee",
    trigger: "emotion_high",
    probability: 0.35,
    minEmotion: 55,
    title: "相手がコーヒーを注いでくれた",
    description: "「おかわりどうぞ」——相手があなたにコーヒーを注いでくれた。もてなしの心が感じられる。歓迎されている。",
    icon: "☕",
    effect: {
      emotionDelta: 5,
      statusEffect: createBuff("charm", 1),
    },
    duration: 3000,
  },
  {
    id: "generic-honest-moment",
    trigger: "emotion_high",
    probability: 0.3,
    minEmotion: 60,
    title: "「正直に言うとね…」",
    description: "相手が本音を話し始めた。「実は、今の業者に不満があってね」——核心に迫るチャンスだ。聞き逃すな！",
    icon: "💬",
    effect: {
      emotionDelta: 8,
      scoreDelta: 3,
      statusEffect: createBuff("rapport", 2),
    },
    duration: 2500,
  },
  {
    id: "generic-head-tilt",
    trigger: "emotion_low",
    probability: 0.3,
    maxEmotion: 40,
    title: "首を傾げている",
    description: "相手が首を傾げ、怪訝な表情。「うーん…ちょっとよくわからないんだけど」——説明が伝わっていない。",
    icon: "🤔",
    effect: {
      emotionDelta: -3,
      statusEffect: createDebuff("nervousness", 1),
    },
    duration: 3000,
  },
  {
    id: "generic-first-time-heard",
    trigger: "combo",
    probability: 0.4,
    minCombo: 2,
    title: "「それ初めて聞いた」",
    description: "「へぇ、そんな方法があるんだ。初めて聞いたよ」——新鮮な驚きを与えた。知識の差が武器になる瞬間。",
    icon: "💡",
    effect: {
      emotionDelta: 6,
      scoreDelta: 2,
      statusEffect: createBuff("confidence", 1),
    },
    duration: 3000,
  },
  {
    id: "generic-expression-clouded",
    trigger: "emotion_low",
    probability: 0.35,
    maxEmotion: 30,
    title: "相手の表情が曇った",
    description: "さっきまでの穏やかな表情が急に曇った。何か地雷を踏んだか…慎重に言葉を選べ。",
    icon: "😟",
    effect: {
      emotionDelta: -5,
      statusEffect: createDebuff("coldAir", 1),
    },
    duration: 2500,
  },
  {
    id: "generic-phone-alarm",
    trigger: "random",
    probability: 0.2,
    title: "スマートフォンのアラームが鳴った",
    description: "ピピピッ！ 相手のスマホからアラームが鳴った。「あ、すみません」——次の予定が迫っている合図かも。",
    icon: "📱",
    effect: {
      emotionDelta: -2,
      timerDelta: -3,
    },
    duration: 2500,
  },
  {
    id: "generic-budget-question",
    trigger: "emotion_high",
    probability: 0.4,
    minEmotion: 55,
    title: "「予算はいくらなの？」",
    description: "具体的な予算の話が出た。本気で導入を検討している証拠。ここで値引きに逃げるな、価値を伝えろ！",
    icon: "💰",
    effect: {
      emotionDelta: 5,
      scoreDelta: 3,
    },
    duration: 2500,
  },
  {
    id: "generic-re-reading",
    trigger: "emotion_high",
    probability: 0.35,
    minEmotion: 50,
    title: "相手が資料を読み返している",
    description: "渡した資料を何度もめくっている。「この部分、もう少し詳しく…」——資料が刺さったポイントを深掘りしよう。",
    icon: "📖",
    effect: {
      emotionDelta: 5,
      scoreDelta: 2,
    },
    duration: 3000,
  },
  {
    id: "generic-sudden-loud",
    trigger: "random",
    probability: 0.2,
    title: "突然の大きな声",
    description: "「ちょっと待って！」——相手が突然大きな声を出した。驚いたが…「今の部分、すごく重要だね」——褒め言葉だった！",
    icon: "📢",
    effect: {
      emotionDelta: 4,
      statusEffect: createBuff("confidence", 1),
    },
    duration: 3000,
  },
  {
    id: "generic-pen-spinning",
    trigger: "emotion_low",
    probability: 0.25,
    maxEmotion: 40,
    title: "ペンを回している",
    description: "相手がペンをくるくる回している。退屈？ それとも考え中？ 表情を読んで次の一手を決めろ。",
    icon: "🖊️",
    effect: {
      emotionDelta: -2,
    },
    duration: 2500,
  },
  {
    id: "generic-special-case",
    trigger: "random",
    probability: 0.3,
    title: "「うちの場合は特殊でね…」",
    description: "「一般的な話はわかるけど、うちは事情が違うんだよ」——カスタマイズ提案のチャンスだ。柔軟性を見せろ。",
    icon: "🏭",
    effect: {
      emotionDelta: -2,
      timerDelta: -2,
    },
    duration: 2500,
  },
  {
    id: "generic-more-specific",
    trigger: "emotion_high",
    probability: 0.35,
    minEmotion: 50,
    title: "「もう少し具体的に」",
    description: "「概要はわかった。もう少し具体的な数字で教えてくれる？」——深い関心の証。データで攻めろ！",
    icon: "📊",
    effect: {
      emotionDelta: 4,
      scoreDelta: 2,
    },
    duration: 3000,
  },
  {
    id: "generic-competitor-brochure",
    trigger: "emotion_low",
    probability: 0.3,
    maxEmotion: 35,
    title: "競合のパンフレットが見えた",
    description: "相手のデスクに競合他社のパンフレットが置いてある。「あ、〇〇さんも来たんですね」——比較されている。負けるな。",
    icon: "📑",
    effect: {
      emotionDelta: -4,
      statusEffect: createDebuff("pressure", 1),
    },
    duration: 2500,
  },
  {
    id: "generic-warm-handshake",
    trigger: "emotion_high",
    probability: 0.3,
    minEmotion: 70,
    title: "温かい握手を求められた",
    description: "「いい話だったよ」——相手が立ち上がり、しっかりと握手を求めてきた。成約への大きな一歩だ。",
    icon: "🤝",
    effect: {
      emotionDelta: 8,
      scoreDelta: 4,
      statusEffect: createBuff("empathy", 2),
    },
    duration: 2500,
  },
];

// ─── EventManager ───────────────────────────────────────────

export class EventManager {
  private sceneType: string;
  private triggered: Set<string> = new Set();
  private availableEvents: GameEvent[];

  constructor(sceneType: string) {
    this.sceneType = sceneType;
    // Filter to events that match this scene type or are generic (no sceneType set)
    this.availableEvents = GAME_EVENTS.filter(
      (e) => !e.sceneType || e.sceneType === sceneType,
    );
  }

  /**
   * Check if an event should fire this node.
   * Returns at most one event (highest priority match).
   * Each event can only fire once per game session.
   */
  checkEvents(context: {
    emotion: number;
    combo: number;
    phase: number;
    nodeIndex: number;
  }): GameEvent | null {
    const { emotion, combo, phase } = context;

    // Shuffle to randomize which event fires when multiple qualify
    const shuffled = shuffleArray(this.availableEvents);

    for (const event of shuffled) {
      // Skip already-triggered events
      if (this.triggered.has(event.id)) continue;

      // Check trigger conditions
      if (!this.matchesTrigger(event, emotion, combo, phase)) continue;

      // Roll probability
      if (Math.random() > event.probability) continue;

      return event;
    }

    return null;
  }

  private matchesTrigger(
    event: GameEvent,
    emotion: number,
    combo: number,
    phase: number,
  ): boolean {
    switch (event.trigger) {
      case "random":
        return true;

      case "emotion_high":
        return emotion >= (event.minEmotion ?? 50);

      case "emotion_low":
        return emotion <= (event.maxEmotion ?? 30);

      case "combo":
        return combo >= (event.minCombo ?? 3);

      case "phase_change":
        return event.phase !== undefined && phase === event.phase;

      default:
        return false;
    }
  }

  /** Mark an event as triggered so it won't fire again this session. */
  markTriggered(eventId: string): void {
    this.triggered.add(eventId);
  }

  /** Get all events that have been triggered this session. */
  getTriggeredEvents(): string[] {
    return Array.from(this.triggered);
  }

  /** Get how many events are available (not yet triggered) for this scene. */
  getRemainingEventCount(): number {
    return this.availableEvents.filter((e) => !this.triggered.has(e.id)).length;
  }

  /** Reset for a new game. */
  reset(): void {
    this.triggered.clear();
  }
}

/** Fisher-Yates shuffle (internal helper). */
function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ═══════════════════════════════════════════════════════════════
   5. DIFFICULTY SCALING — 難易度設定
═══════════════════════════════════════════════════════════════ */

export interface DifficultyConfig {
  timerDuration: number;      // seconds per choice
  scoreMultiplier: number;    // applied to base score
  emotionDecayRate: number;   // passive emotion loss per node
  eventFrequency: number;     // 0–1, probability multiplier for events
  label: string;              // Japanese display name
  description: string;        // Japanese description
}

export const DIFFICULTIES: Record<string, DifficultyConfig> = {
  easy: {
    timerDuration: 45,
    scoreMultiplier: 0.8,
    emotionDecayRate: 0,
    eventFrequency: 0.2,
    label: "入門",
    description: "時間に余裕あり。イベント少なめ。初めての方におすすめ",
  },
  normal: {
    timerDuration: 30,
    scoreMultiplier: 1.0,
    emotionDecayRate: 2,
    eventFrequency: 0.4,
    label: "標準",
    description: "バランスの取れた難易度。実戦に近い緊張感",
  },
  hard: {
    timerDuration: 20,
    scoreMultiplier: 1.5,
    emotionDecayRate: 5,
    eventFrequency: 0.6,
    label: "鬼モード",
    description: "制限時間が短く、プレッシャー最大。スコアも最大",
  },
};

export type DifficultyKey = keyof typeof DIFFICULTIES;

/** Get difficulty config with fallback to "normal". */
export function getDifficulty(key: string): DifficultyConfig {
  return DIFFICULTIES[key] ?? DIFFICULTIES.normal;
}

/* ═══════════════════════════════════════════════════════════════
   6. SCORE CALCULATOR — 統合スコア計算

   Combines timer multiplier, status effects, difficulty,
   and event bonuses into a final score delta.
═══════════════════════════════════════════════════════════════ */

export interface ScoreCalculation {
  baseScore: number;
  timerMultiplier: number;
  statusMultiplier: number;
  difficultyMultiplier: number;
  eventBonus: number;
  finalScore: number;
  breakdown: string[];  // Japanese explanation of each modifier
}

/**
 * Calculate the final score for a single choice,
 * factoring in all game systems.
 */
export function calculateScore(params: {
  baseScore: number;
  timerMultiplier: number;
  statusEffectManager: StatusEffectManager;
  difficulty: DifficultyConfig;
  eventScoreBonus?: number;
}): ScoreCalculation {
  const {
    baseScore,
    timerMultiplier,
    statusEffectManager,
    difficulty,
    eventScoreBonus = 0,
  } = params;

  const statusMult = statusEffectManager.getScoreMultiplier();
  const diffMult = difficulty.scoreMultiplier;

  const rawScore = baseScore * timerMultiplier * statusMult * diffMult;
  const finalScore = Math.round(rawScore + eventScoreBonus);

  const breakdown: string[] = [];
  if (timerMultiplier !== 1) {
    breakdown.push(`タイマー: x${timerMultiplier.toFixed(1)}`);
  }
  if (statusMult !== 1) {
    breakdown.push(`ステータス: x${statusMult.toFixed(2)}`);
  }
  if (diffMult !== 1) {
    breakdown.push(`難易度: x${diffMult.toFixed(1)}`);
  }
  if (eventScoreBonus !== 0) {
    breakdown.push(`イベント: ${eventScoreBonus > 0 ? "+" : ""}${eventScoreBonus}`);
  }

  return {
    baseScore,
    timerMultiplier,
    statusMultiplier: statusMult,
    difficultyMultiplier: diffMult,
    eventBonus: eventScoreBonus,
    finalScore,
    breakdown,
  };
}

/**
 * Calculate the final emotion delta for a single choice,
 * factoring in status effects, difficulty decay, and events.
 */
export function calculateEmotionDelta(params: {
  baseEmotionDelta: number;
  statusEffectManager: StatusEffectManager;
  difficulty: DifficultyConfig;
  eventEmotionDelta?: number;
}): number {
  const {
    baseEmotionDelta,
    statusEffectManager,
    difficulty,
    eventEmotionDelta = 0,
  } = params;

  const emotionMult = statusEffectManager.getEmotionMultiplier();

  // Only apply multiplier to the base delta, not the event bonus
  // Decay is always subtracted
  const adjustedBase = baseEmotionDelta * emotionMult;
  const total = adjustedBase + eventEmotionDelta - difficulty.emotionDecayRate;

  return Math.round(total);
}

/* ═══════════════════════════════════════════════════════════════
   7. GAME SESSION ORCHESTRATOR

   Ties all systems together into a single manager
   that the React component can instantiate.
═══════════════════════════════════════════════════════════════ */

export interface GameSessionConfig {
  sceneType: string;
  difficulty: DifficultyKey;
  scenarioId: string;
}

export class GameSession {
  readonly timer: ChoiceTimer;
  readonly statusEffects: StatusEffectManager;
  readonly events: EventManager;
  readonly difficulty: DifficultyConfig;
  readonly scenarioId: string;

  private combo: number = 0;
  private maxCombo: number = 0;
  private consecutiveBad: number = 0;
  private excellentCount: number = 0;
  private goodCount: number = 0;
  private badCount: number = 0;
  private fastChoiceCount: number = 0;
  private choiceCount: number = 0;
  private perfectNodes: number = 0;
  private totalScore: number = 0;
  private emotion: number = 50;
  private emotionHistory: number[] = [];
  private startTime: number = Date.now();

  constructor(config: GameSessionConfig) {
    this.timer = new ChoiceTimer();
    this.statusEffects = new StatusEffectManager();
    this.events = new EventManager(config.sceneType);
    this.difficulty = getDifficulty(config.difficulty);
    this.scenarioId = config.scenarioId;
  }

  /** Set the initial emotion (from scenario config). */
  setInitialEmotion(value: number): void {
    this.emotion = value;
    this.emotionHistory = [value];
  }

  /** Start the timer for the current choice. */
  startTimer(onTick?: (remaining: number) => void, onExpire?: () => void): void {
    const timerBonus = this.statusEffects.getTimerBonus();
    const duration = Math.max(5, this.difficulty.timerDuration + timerBonus);
    this.timer.start(duration, onTick, onExpire);
  }

  /**
   * Process a choice. Returns the full calculation details.
   * Call this when the player selects an answer.
   */
  processChoice(params: {
    baseScore: number;
    baseEmotionDelta: number;
    quality: ChoiceQuality;
  }): {
    score: ScoreCalculation;
    emotionDelta: number;
    newEmotion: number;
    newCombo: number;
    triggeredEffects: StatusEffect[];
    event: GameEvent | null;
    newAchievements: Achievement[];
    timerInfo: TimerMultiplierInfo;
  } {
    const { baseScore, baseEmotionDelta, quality } = params;

    // Stop timer and get multiplier
    this.timer.stop();
    const timerInfo = this.timer.getMultiplierInfo();

    // Track fast choices (answered within first 33% of timer)
    const elapsed = this.timer.getElapsed();
    const duration = this.timer.getDuration();
    if (duration > 0 && elapsed / duration <= 0.33) {
      this.fastChoiceCount++;
    }

    // Update combo
    if (quality === "excellent" || quality === "good") {
      this.combo++;
      this.consecutiveBad = 0;
    } else {
      this.combo = 0;
      if (quality === "bad") {
        this.consecutiveBad++;
      } else {
        this.consecutiveBad = 0;
      }
    }
    this.maxCombo = Math.max(this.maxCombo, this.combo);

    // Track quality counts
    this.choiceCount++;
    if (quality === "excellent") {
      this.excellentCount++;
      this.perfectNodes++;
    }
    if (quality === "good") this.goodCount++;
    if (quality === "bad") this.badCount++;

    // Check for dynamic event
    const event = this.events.checkEvents({
      emotion: this.emotion,
      combo: this.combo,
      phase: 0, // phase can be passed in from the component
      nodeIndex: this.choiceCount - 1,
    });
    if (event) {
      this.events.markTriggered(event.id);
    }

    // Calculate score
    const score = calculateScore({
      baseScore,
      timerMultiplier: timerInfo.multiplier,
      statusEffectManager: this.statusEffects,
      difficulty: this.difficulty,
      eventScoreBonus: event?.effect.scoreDelta,
    });
    this.totalScore += score.finalScore;

    // Calculate emotion
    const emotionDelta = calculateEmotionDelta({
      baseEmotionDelta,
      statusEffectManager: this.statusEffects,
      difficulty: this.difficulty,
      eventEmotionDelta: event?.effect.emotionDelta,
    });
    this.emotion = Math.max(0, Math.min(100, this.emotion + emotionDelta));
    this.emotionHistory.push(this.emotion);

    // Get triggered status effects
    const triggeredEffects = getTriggeredEffects({
      quality,
      combo: this.combo,
      emotion: this.emotion,
      consecutiveBad: this.consecutiveBad,
    });

    // Add event-triggered status effect if any
    if (event?.effect.statusEffect) {
      triggeredEffects.push(event.effect.statusEffect);
    }

    // Apply all triggered effects
    for (const eff of triggeredEffects) {
      this.statusEffects.addEffect(eff);
    }

    // Tick status effects (decrement durations)
    this.statusEffects.tickNode();

    // Check achievements
    const stats = this.getStats();
    const previouslyUnlocked = getUnlockedAchievements();
    const newAchievements = checkAchievements(stats, previouslyUnlocked);

    // Save newly unlocked achievements
    if (newAchievements.length > 0) {
      saveUnlockedAchievements(newAchievements.map((a) => a.id));
    }

    return {
      score,
      emotionDelta,
      newEmotion: this.emotion,
      newCombo: this.combo,
      triggeredEffects,
      event,
      newAchievements,
      timerInfo,
    };
  }

  /** Build the current GameStats snapshot. */
  getStats(): GameStats {
    const elapsed = (Date.now() - this.startTime) / 1000;
    return {
      totalScore: this.totalScore,
      emotion: this.emotion,
      maxCombo: this.maxCombo,
      choiceCount: this.choiceCount,
      excellentCount: this.excellentCount,
      goodCount: this.goodCount,
      badCount: this.badCount,
      fastChoiceCount: this.fastChoiceCount,
      perfectNodes: this.perfectNodes,
      grade: this.calculateGrade(),
      scenarioId: this.scenarioId,
      timeSpent: Math.round(elapsed),
      emotionHistory: [...this.emotionHistory],
    };
  }

  /** Current total score. */
  getTotalScore(): number {
    return this.totalScore;
  }

  /** Current emotion. */
  getEmotion(): number {
    return this.emotion;
  }

  /** Current combo. */
  getCombo(): number {
    return this.combo;
  }

  /** Highest combo reached. */
  getMaxCombo(): number {
    return this.maxCombo;
  }

  /** Rough grade calculation (S/A/B/C). */
  private calculateGrade(): string {
    const s = this.totalScore;
    const e = this.emotion;
    if (s >= 65 && e >= 60) return "S";
    if (s >= 45 && e >= 40) return "A";
    if (s >= 25 && e >= 20) return "B";
    return "C";
  }

  /** Add timer seconds to the timer. */
  addTimerBonus(seconds: number): void {
    this.timer.addTime(seconds);
  }

  /** Clean up all resources. */
  destroy(): void {
    this.timer.destroy();
    this.statusEffects.reset();
    this.events.reset();
  }
}
