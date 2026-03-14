export type { QuizQuestion, Lesson } from "./types";
export { beginnerLessons } from "./beginner";
export { intermediateLessons } from "./intermediate";
export { advancedLessons } from "./advanced";

import { beginnerLessons } from "./beginner";
import { intermediateLessons } from "./intermediate";
import { advancedLessons } from "./advanced";
import type { Lesson } from "./types";

const allLessons: Lesson[] = [
  ...beginnerLessons,
  ...intermediateLessons,
  ...advancedLessons,
];

export function getAllLessons(): Lesson[] {
  return allLessons;
}

export function getLessonBySlug(slug: string): Lesson | undefined {
  return allLessons.find((l) => l.slug === slug);
}

export function getLessonsByLevel(
  level: "beginner" | "intermediate" | "advanced",
): Lesson[] {
  return allLessons.filter((l) => l.level === level);
}

export function getAdjacentLessons(slug: string): {
  prev: Lesson | undefined;
  next: Lesson | undefined;
} {
  const idx = allLessons.findIndex((l) => l.slug === slug);
  return {
    prev: idx > 0 ? allLessons[idx - 1] : undefined,
    next: idx < allLessons.length - 1 ? allLessons[idx + 1] : undefined,
  };
}
