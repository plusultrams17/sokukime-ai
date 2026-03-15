const VISITED_KEY = "seiyaku-worksheet-visited";

export function isFirstWorksheetVisit(): boolean {
  if (typeof window === "undefined") return true;
  return localStorage.getItem(VISITED_KEY) !== "true";
}

export function markWorksheetVisited(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(VISITED_KEY, "true");
  } catch {
    // silently fail
  }
}
