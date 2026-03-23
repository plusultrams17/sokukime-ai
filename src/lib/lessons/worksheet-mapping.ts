/**
 * Maps each lesson slug to the relevant worksheet phase and sections.
 * Used by LessonWorksheet to show only the fields relevant to the current lesson.
 */

export interface WorksheetSection {
  sectionIndex: number;
  /** If specified, only show these field keys from the section. */
  fieldKeys?: string[];
}

export interface WorksheetMapping {
  phaseIndex: number;
  sections: WorksheetSection[];
  description: string;
}

export const LESSON_WORKSHEET_MAP: Record<string, WorksheetMapping> = {
  // ── Beginner — Phase 0: アプローチ ──
  "praise-technique": {
    phaseIndex: 0,
    sections: [{ sectionIndex: 0 }],
    description: "褒めフレーズを3パターン準備しましょう",
  },
  "premise-setting": {
    phaseIndex: 0,
    sections: [{ sectionIndex: 1 }],
    description: "ゴール共有のトークスクリプトを書きましょう",
  },

  // ── Beginner — Phase 1: ヒアリング ──
  "drawer-phrases": {
    phaseIndex: 1,
    sections: [{ sectionIndex: 0 }, { sectionIndex: 1 }],
    description: "想定ニーズとニーズ発掘フレーズを準備しましょう",
  },
  "deepening": {
    phaseIndex: 1,
    sections: [{ sectionIndex: 2 }],
    description: "深掘り質問チェーンを自分の商材で準備しましょう",
  },

  // ── Beginner — Phase 2: プレゼン ──
  "benefit-method": {
    phaseIndex: 2,
    sections: [{ sectionIndex: 0 }],
    description: "SPとベネフィットの3組を作成しましょう",
  },
  "comparison-if": {
    phaseIndex: 2,
    sections: [{ sectionIndex: 1 }, { sectionIndex: 2 }],
    description: "比較話法とIF活用のスクリプトを準備しましょう",
  },

  // ── Intermediate — Phase 3: クロージング ──
  "closing-intro": {
    phaseIndex: 3,
    sections: [{ sectionIndex: 0 }],
    description: "基本3技術のフレーズを準備しましょう",
  },
  "social-proof": {
    phaseIndex: 3,
    sections: [{ sectionIndex: 0, fieldKeys: ["socialProof"] }],
    description: "社会的証明のフレーズを書き出しましょう",
  },
  "consistency": {
    phaseIndex: 3,
    sections: [{ sectionIndex: 0, fieldKeys: ["consistency"] }],
    description: "一貫性の原理を活用するフレーズを準備しましょう",
  },
  "quotation-method": {
    phaseIndex: 3,
    sections: [{ sectionIndex: 0, fieldKeys: ["quote1", "quote2"] }],
    description: "第三者の声（証言引用）を準備しましょう",
  },
  "positive-closing": {
    phaseIndex: 3,
    sections: [{ sectionIndex: 1 }],
    description: "ポジティブクロージングのスクリプトを準備しましょう",
  },
  "negative-closing": {
    phaseIndex: 3,
    sections: [{ sectionIndex: 2 }],
    description: "ネガティブクロージングのスクリプトを準備しましょう",
  },
  "desire-patterns": {
    phaseIndex: 3,
    sections: [{ sectionIndex: 3 }, { sectionIndex: 4 }],
    description: "欲求パターンと最終訴求フレーズを作成しましょう",
  },

  // ── Advanced — Phase 4: 反論処理 ──
  "rebuttal-basics": {
    phaseIndex: 4,
    sections: [{ sectionIndex: 0 }, { sectionIndex: 1 }],
    description: "想定反論と切り返しの型を準備しましょう",
  },
  "rebuttal-pattern": {
    phaseIndex: 4,
    sections: [{ sectionIndex: 0 }],
    description: "4大パターンの反論と切り返しを書きましょう",
  },
  "purpose-recall": {
    phaseIndex: 4,
    sections: [
      { sectionIndex: 1 },
      { sectionIndex: 2, fieldKeys: ["tech1Recall", "tech1Area"] },
    ],
    description: "目的の振り返りと切り返しの公式を準備しましょう",
  },
  "third-party-attack": {
    phaseIndex: 4,
    sections: [{ sectionIndex: 2, fieldKeys: ["tech2Episode"] }],
    description: "第三者エピソードの切り返しを準備しましょう",
  },
  "positive-shower": {
    phaseIndex: 4,
    sections: [{ sectionIndex: 2, fieldKeys: ["tech3YesPlus"] }],
    description: "YESの積み上げ（自己説得法）を準備しましょう",
  },
  "reframe": {
    phaseIndex: 4,
    sections: [
      { sectionIndex: 2, fieldKeys: ["tech4Reframe", "tech4Correction"] },
    ],
    description: "すり替え・褒めのフレーズを準備しましょう",
  },
  "value-stacking": {
    phaseIndex: 4,
    sections: [
      { sectionIndex: 2, fieldKeys: ["tech5Apology", "tech5Value"] },
    ],
    description: "驚き＋謝罪と価値の再提示を準備しましょう",
  },
};
