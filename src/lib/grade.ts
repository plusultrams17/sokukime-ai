/**
 * Grade system — canonical thresholds (matches /features/scoring display).
 *
 *   S (90-100) — 成約メソッドマスター
 *   A (80-89)  — 高い営業力
 *   B (60-79)  — 基本は身についている
 *   C (40-59)  — 伸びしろ大
 *   D (0-39)   — 基本の型から練習
 */

export type Grade = "S" | "A" | "B" | "C" | "D";

export interface GradeInfo {
  grade: Grade;
  label: string;
  color: string;       // Tailwind text color class
  hex: string;         // Hex for OGP / SVG
  barClass: string;    // Tailwind bg class for progress bars
}

const GRADES: { min: number; info: GradeInfo }[] = [
  { min: 90, info: { grade: "S", label: "卓越", color: "text-green-400",  hex: "#4ade80", barClass: "bg-green-400" } },
  { min: 80, info: { grade: "A", label: "良好", color: "text-green-600",  hex: "#22c55e", barClass: "bg-green-500" } },
  { min: 60, info: { grade: "B", label: "標準", color: "text-yellow-500", hex: "#eab308", barClass: "bg-yellow-500" } },
  { min: 40, info: { grade: "C", label: "要改善", color: "text-orange-500", hex: "#f97316", barClass: "bg-orange-400" } },
  { min: 0,  info: { grade: "D", label: "未実施", color: "text-red-500",   hex: "#ef4444", barClass: "bg-red-400" } },
];

export function getGradeInfo(score: number): GradeInfo {
  for (const g of GRADES) {
    if (score >= g.min) return g.info;
  }
  return GRADES[GRADES.length - 1].info;
}

export function getGrade(score: number): Grade {
  return getGradeInfo(score).grade;
}

export function getGradeHex(score: number): string {
  return getGradeInfo(score).hex;
}
