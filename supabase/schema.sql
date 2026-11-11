-- ============================================================
-- MillionSpaces Leads Hub - Supabase Database Schema
-- Table: meta_whatsapp_leads
-- ============================================================

-- 1. Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create the meta_whatsapp_leads table
CREATE TABLE IF NOT EXISTS public.meta_whatsapp_leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    lead_status TEXT NOT NULL DEFAULT 'New' CHECK (lead_status IN ('New', 'Contacted', 'Qualified', 'Lost', 'Closed')),
    source TEXT NOT NULL DEFAULT 'Facebook' CHECK (source IN ('Facebook', 'Instagram', 'WhatsApp Direct')),
    campaign TEXT NOT NULL DEFAULT 'General Inquiries',
    message TEXT NOT NULL,
    notes TEXT,
    ad_id TEXT,
    venue_interest TEXT,
    assignee TEXT
);

-- Ensure column exists if table was already created earlier:
ALTER TABLE public.meta_whatsapp_leads ADD COLUMN IF NOT EXISTS assignee TEXT;

-- 3. Create helpful indexes for fast filtering and searching
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.meta_whatsapp_leads (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.meta_whatsapp_leads (lead_status);
CREATE INDEX IF NOT EXISTS idx_leads_source ON public.meta_whatsapp_leads (source);
CREATE INDEX IF NOT EXISTS idx_leads_campaign ON public.meta_whatsapp_leads (campaign);
CREATE INDEX IF NOT EXISTS idx_leads_phone ON public.meta_whatsapp_leads (phone);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.meta_whatsapp_leads ENABLE ROW LEVEL SECURITY;

-- 5. Policies (Drop first so re-running never throws "already exists" errors)
DROP POLICY IF EXISTS "Allow public read access" ON public.meta_whatsapp_leads;
CREATE POLICY "Allow public read access"
ON public.meta_whatsapp_leads
FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Allow public insert access" ON public.meta_whatsapp_leads;
CREATE POLICY "Allow public insert access"
ON public.meta_whatsapp_leads
FOR INSERT
WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update access" ON public.meta_whatsapp_leads;
CREATE POLICY "Allow public update access"
ON public.meta_whatsapp_leads
FOR UPDATE
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public delete access" ON public.meta_whatsapp_leads;
CREATE POLICY "Allow public delete access"
ON public.meta_whatsapp_leads
FOR DELETE
USING (true);

-- ============================================================
-- 6. Table: team_assignees (Synchronized Team Members & Sales Reps)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.team_assignees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    name TEXT NOT NULL UNIQUE
);

CREATE INDEX IF NOT EXISTS idx_team_assignees_name ON public.team_assignees (name);

ALTER TABLE public.team_assignees ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read team_assignees" ON public.team_assignees;
CREATE POLICY "Allow public read team_assignees"
ON public.team_assignees FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert team_assignees" ON public.team_assignees;
CREATE POLICY "Allow public insert team_assignees"
ON public.team_assignees FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update team_assignees" ON public.team_assignees;
CREATE POLICY "Allow public update team_assignees"
ON public.team_assignees FOR UPDATE USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public delete team_assignees" ON public.team_assignees;
CREATE POLICY "Allow public delete team_assignees"
ON public.team_assignees FOR DELETE USING (true);

-- Seed initial team assignees
INSERT INTO public.team_assignees (name)
VALUES
  ('Kasun Perera'),
  ('Sarah De Silva'),
  ('Akeel Mohamed'),
  ('Tharindu Fernando'),
  ('Dinuk Weerasinghe')
ON CONFLICT (name) DO NOTHING;

-- ============================================================
-- NOTE: The table is now clean and empty, waiting for live Meta leads!
-- Real inbound leads from Facebook & Instagram Click-to-WhatsApp ads
-- will automatically be inserted here by the /api/meta-webhook endpoint.
-- ============================================================

