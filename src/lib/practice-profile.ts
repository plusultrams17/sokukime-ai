/**
 * PracticeProfile — ユーザーのロープレ設定をlocalStorageで永続化。
 * レッスン実践練習とメインロープレの両方で共有される。
 * 一度設定すれば、全レッスン・全セッションで自動的に使われる。
 */

const STORAGE_KEY = "seiyaku-practice-profile";

export interface PracticeProfile {
  product: string;
  productDetail: string;
  industry: string;
  scene: "visit" | "phone" | "inbound";
  customerType: "individual" | "owner" | "manager" | "staff";
  difficulty: string;
  updatedAt: string;
}

export function loadPracticeProfile(): PracticeProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.product && parsed.industry) return parsed;
    }
  } catch {
    // ignore
  }
  return null;
}

export function savePracticeProfile(profile: PracticeProfile): void {
  if (typeof window === "undefined") return;
  try {
    profile.updatedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch {
    // ignore quota errors
  }
}

export function clearPracticeProfile(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
