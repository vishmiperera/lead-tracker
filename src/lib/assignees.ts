export const DEFAULT_ASSIGNEES: string[] = [
  "Kasun Perera",
  "Sarah De Silva",
  "Akeel Mohamed",
  "Tharindu Fernando",
  "Dinuk Weerasinghe",
];

const STORAGE_KEY = "millionspaces_team_assignees_v1";

export function getStoredAssignees(): string[] {
  if (typeof window === "undefined") {
    return DEFAULT_ASSIGNEES;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_ASSIGNEES));
      return DEFAULT_ASSIGNEES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_ASSIGNEES;
  } catch (err) {
    console.warn("Failed to load assignees from localStorage:", err);
    return DEFAULT_ASSIGNEES;
  }
}

export function saveStoredAssignees(assignees: string[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(assignees));
  } catch (err) {
    console.error("Failed to save assignees to localStorage:", err);
  }
}
