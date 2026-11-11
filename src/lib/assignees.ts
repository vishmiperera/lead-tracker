import { supabase, isSupabaseConfigured } from "./supabase";

export const DEFAULT_ASSIGNEES: string[] = [
  "Kasun Perera",
  "Sarah De Silva",
  "Akeel Mohamed",
  "Tharindu Fernando",
  "Dinuk Weerasinghe",
];

const STORAGE_KEY = "millionspaces_team_assignees_v1";

/**
 * Read assignees from localStorage cache as immediate synchronous fallback
 */
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

/**
 * Save assignees to localStorage cache
 */
export function saveStoredAssignees(assignees: string[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(assignees));
  } catch (err) {
    console.error("Failed to save assignees to localStorage:", err);
  }
}

/**
 * Fetch assignees from Supabase table `team_assignees`, falling back to localStorage
 */
export async function fetchAllAssignees(): Promise<{ assignees: string[]; isLive: boolean }> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("team_assignees")
        .select("name")
        .order("name", { ascending: true });

      if (!error && Array.isArray(data)) {
        const names = data.map((row: { name: string }) => row.name);
        saveStoredAssignees(names);
        return { assignees: names, isLive: true };
      }
    } catch (err) {
      console.warn("Supabase team_assignees fetch error:", err);
    }
  }

  return { assignees: getStoredAssignees(), isLive: false };
}

/**
 * Insert new assignee into Supabase `team_assignees` table and localStorage
 */
export async function createAssigneeRecord(name: string): Promise<boolean> {
  const current = getStoredAssignees();
  if (!current.includes(name)) {
    saveStoredAssignees([...current, name]);
  }

  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase
        .from("team_assignees")
        .insert([{ name }]);
      if (!error) return true;
      console.warn("Supabase insert assignee error:", error.message);
    } catch (err) {
      console.warn("Failed to create assignee in Supabase:", err);
    }
  }

  return true;
}

/**
 * Update an existing assignee name in Supabase `team_assignees` and `meta_whatsapp_leads`
 */
export async function updateAssigneeRecord(oldName: string, newName: string): Promise<boolean> {
  const current = getStoredAssignees();
  const updated = current.map((a) => (a === oldName ? newName : a));
  saveStoredAssignees(updated);

  if (isSupabaseConfigured && supabase) {
    try {
      // Update in team_assignees
      await supabase
        .from("team_assignees")
        .update({ name: newName })
        .eq("name", oldName);

      // Also update any leads assigned to oldName in meta_whatsapp_leads
      await supabase
        .from("meta_whatsapp_leads")
        .update({ assignee: newName })
        .eq("assignee", oldName);

      return true;
    } catch (err) {
      console.warn("Supabase update assignee error:", err);
    }
  }

  return true;
}

/**
 * Delete an assignee from Supabase `team_assignees` and clear from assigned leads
 */
export async function deleteAssigneeRecord(name: string): Promise<boolean> {
  const current = getStoredAssignees();
  const updated = current.filter((a) => a !== name);
  saveStoredAssignees(updated);

  if (isSupabaseConfigured && supabase) {
    try {
      // Delete from team_assignees table
      await supabase
        .from("team_assignees")
        .delete()
        .eq("name", name);

      // Unassign any leads previously assigned to this person
      await supabase
        .from("meta_whatsapp_leads")
        .update({ assignee: null })
        .eq("assignee", name);

      return true;
    } catch (err) {
      console.warn("Supabase delete assignee error:", err);
    }
  }

  return true;
}

/**
 * Subscribe to Supabase real-time updates for team_assignees
 */
export function subscribeToAssigneesChanges(onAssigneeChange: () => void) {
  if (!isSupabaseConfigured || !supabase) return null;

  try {
    const channel = supabase
      .channel("realtime-team-assignees")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "team_assignees",
        },
        () => {
          onAssigneeChange();
        }
      )
      .subscribe();

    return channel;
  } catch (err) {
    console.warn("Supabase assignees realtime subscription error:", err);
    return null;
  }
}
