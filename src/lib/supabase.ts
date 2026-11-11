import { createClient } from "@supabase/supabase-js";
import { Lead, LeadStatus } from "@/types";
import { INITIAL_MOCK_LEADS } from "./mockData";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.startsWith("https://") &&
    !supabaseUrl.includes("your-supabase-url")
);

// Client-side Supabase client (only created if configured)
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null;

// Server-side admin client with service role key if available, or anon key
export function getServiceSupabaseClient() {
  const serviceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !serviceKey || supabaseUrl.includes("your-supabase-url")) {
    return null;
  }
  return createClient(supabaseUrl, serviceKey);
}

// Local storage key for fallback persistence
const LOCAL_STORAGE_KEY = "millionspaces_meta_leads_v1";

export function getLocalStoredLeads(): Lead[] {
  if (typeof window === "undefined") return INITIAL_MOCK_LEADS;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_MOCK_LEADS));
      return INITIAL_MOCK_LEADS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_MOCK_LEADS;
  } catch (err) {
    console.error("Failed to parse local stored leads", err);
    return INITIAL_MOCK_LEADS;
  }
}

export function setLocalStoredLeads(leads: Lead[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(leads));
  } catch (err) {
    console.error("Failed to save leads to localStorage", err);
  }
}

// Unified client-side data operations
export async function fetchAllLeads(): Promise<{ leads: Lead[]; isLive: boolean; error?: string }> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("meta_whatsapp_leads")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.warn("Supabase fetch failed, falling back to local storage:", error.message);
        return { leads: getLocalStoredLeads(), isLive: false, error: error.message };
      }

      if (data && data.length > 0) {
        return { leads: data as Lead[], isLive: true };
      }

      // If live table is empty, seed initial mock leads to Supabase so the user has immediate data
      try {
        const { error: seedErr } = await supabase
          .from("meta_whatsapp_leads")
          .insert(INITIAL_MOCK_LEADS);
        if (!seedErr) {
          return { leads: INITIAL_MOCK_LEADS, isLive: true };
        }
      } catch {
        // ignore seed error
      }

      return { leads: data as Lead[], isLive: true };
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Supabase connection error";
      return { leads: getLocalStoredLeads(), isLive: false, error: errMsg };
    }
  }

  // Fallback to local storage mock data
  return { leads: getLocalStoredLeads(), isLive: false };
}

export async function updateLeadStatus(id: string, status: LeadStatus): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase
        .from("meta_whatsapp_leads")
        .update({ lead_status: status })
        .eq("id", id);
      if (!error) return true;
    } catch (err) {
      console.error("Supabase update error:", err);
    }
  }

  // Fallback: update in localStorage
  const current = getLocalStoredLeads();
  const updated = current.map((item) =>
    item.id === id ? { ...item, lead_status: status } : item
  );
  setLocalStoredLeads(updated);
  return true;
}

export async function updateLeadNotes(id: string, notes: string): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase
        .from("meta_whatsapp_leads")
        .update({ notes })
        .eq("id", id);
      if (!error) return true;
    } catch (err) {
      console.error("Supabase notes update error:", err);
    }
  }

  const current = getLocalStoredLeads();
  const updated = current.map((item) =>
    item.id === id ? { ...item, notes } : item
  );
  setLocalStoredLeads(updated);
  return true;
}

export async function createNewLead(lead: Omit<Lead, "id" | "created_at">): Promise<Lead> {
  const newLead: Lead = {
    ...lead,
    id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `lead-${Date.now()}`,
    created_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("meta_whatsapp_leads")
        .insert([newLead])
        .select()
        .single();
      if (!error && data) {
        return data as Lead;
      }
    } catch (err) {
      console.error("Supabase insert error:", err);
    }
  }

  const current = getLocalStoredLeads();
  const updated = [newLead, ...current];
  setLocalStoredLeads(updated);
  return newLead;
}

export async function deleteLeadRecord(id: string): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase
        .from("meta_whatsapp_leads")
        .delete()
        .eq("id", id);
      if (!error) return true;
    } catch (err) {
      console.error("Supabase delete error:", err);
    }
  }

  const current = getLocalStoredLeads();
  const updated = current.filter((item) => item.id !== id);
  setLocalStoredLeads(updated);
  return true;
}
