import { WORKSHEET_PHASES } from "@/lib/pdf/worksheet-fields";

export function getPhaseFieldKeys(phaseIndex: number): string[] {
  const phase = WORKSHEET_PHASES[phaseIndex];
  if (!phase) return [];
  return phase.sections.flatMap((s) => s.fields.map((f) => f.key));
}

export function getPhaseProgress(
  phaseIndex: number,
  phaseData: Record<string, string>,
): { filled: number; total: number; percent: number } {
  const keys = getPhaseFieldKeys(phaseIndex);
  const total = keys.length;
  if (total === 0) return { filled: 0, total: 0, percent: 0 };
  const filled = keys.filter((k) => phaseData[k]?.trim()).length;
  return { filled, total, percent: Math.round((filled / total) * 100) };
}

export function getOverallProgress(
  allPhaseData: Record<string, string>[],
): { filled: number; total: number; percent: number } {
  let filled = 0;
  let total = 0;
  for (let i = 0; i < WORKSHEET_PHASES.length; i++) {
    const p = getPhaseProgress(i, allPhaseData[i] || {});
    filled += p.filled;
    total += p.total;
  }
  return { filled, total, percent: total > 0 ? Math.round((filled / total) * 100) : 0 };
}

export function isAllComplete(allPhaseData: Record<string, string>[]): boolean {
  for (let i = 0; i < WORKSHEET_PHASES.length; i++) {
    const { percent } = getPhaseProgress(i, allPhaseData[i] || {});
    if (percent < 100) return false;
  }
  return true;
}
