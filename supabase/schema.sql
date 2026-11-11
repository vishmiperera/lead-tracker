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
    venue_interest TEXT
);

-- 3. Create helpful indexes for fast filtering and searching
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.meta_whatsapp_leads (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.meta_whatsapp_leads (lead_status);
CREATE INDEX IF NOT EXISTS idx_leads_source ON public.meta_whatsapp_leads (source);
CREATE INDEX IF NOT EXISTS idx_leads_campaign ON public.meta_whatsapp_leads (campaign);
CREATE INDEX IF NOT EXISTS idx_leads_phone ON public.meta_whatsapp_leads (phone);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.meta_whatsapp_leads ENABLE ROW LEVEL SECURITY;

-- 5. Policies
-- Allow read access for authenticated and anonymous users with API key
CREATE POLICY "Allow public read access"
ON public.meta_whatsapp_leads
FOR SELECT
USING (true);

-- Allow insert access (e.g. from Meta Webhook and Admin UI)
CREATE POLICY "Allow public insert access"
ON public.meta_whatsapp_leads
FOR INSERT
WITH CHECK (true);

-- Allow update access (e.g. changing status or adding notes)
CREATE POLICY "Allow public update access"
ON public.meta_whatsapp_leads
FOR UPDATE
USING (true)
WITH CHECK (true);

-- Allow delete access (e.g. archiving/cleaning spam leads)
CREATE POLICY "Allow public delete access"
ON public.meta_whatsapp_leads
FOR DELETE
USING (true);

-- 6. Seed Sample Data (Optional realistic inquiries for MillionSpaces)
INSERT INTO public.meta_whatsapp_leads (id, created_at, name, phone, lead_status, source, campaign, message, venue_interest, ad_id, notes)
VALUES
  (gen_random_uuid(), now() - INTERVAL '15 minutes', 'Dinuk Weerasinghe', '+94772189401', 'New', 'Instagram', 'Q4 Corporate Event Venues - Colombo', 'Hi MillionSpaces team! We are planning an annual leadership summit for 65 delegates in early December. Need a high-end boardroom setup with catering near Colombo 03.', 'Luxury Boardroom & Summit Hall', 'meta_ad_88392101', 'Requires AV projector and buffet lunch.'),
  (gen_random_uuid(), now() - INTERVAL '45 minutes', 'Shanika Perera', '+94718392019', 'New', 'Facebook', 'Festive Season Banquet & Rooftop Bookings', 'Hello, looking for a scenic rooftop terrace venue for an engagement dinner of around 80 guests on Saturday, Dec 21st. Is outside decor allowed?', 'Rooftop Terrace Lounge', 'meta_ad_99201844', NULL),
  (gen_random_uuid(), now() - INTERVAL '2 hours', 'Akeel Mohamed', '+94769018432', 'Contacted', 'Instagram', 'Startups Co-Working & Dedicated Desks', 'Saw your Meta ad for flexible team desks. Our fintech startup has 6 developers needing dedicated desks with 24/7 access.', 'Hatch / Orion City Dedicated Pod', 'meta_ad_44019288', 'Followed up via WhatsApp. Tour scheduled.'),
  (gen_random_uuid(), now() - INTERVAL '4 hours', 'Dr. Kanishka Fernando', '+94773449012', 'Qualified', 'Facebook', 'High-End Boardroom & Meeting Pods', 'Good day, I need a quiet 14-seater executive meeting room for a full-day medical advisory board meeting this coming Thursday.', 'World Trade Center Executive Suite', 'meta_ad_77209144', 'Quote sent for Cinnamon Lakeside Boardroom.'),
  (gen_random_uuid(), now() - INTERVAL '6 hours', 'Nethmi Jayasuriya', '+94703928172', 'New', 'WhatsApp Direct', 'Creative Studio & Photo Shoot Spaces', 'Hey! Inquiring about renting a daylight photography studio with backdrops for a brand apparel shoot next Tuesday from 9 AM to 4 PM.', 'Studio 44 Daylight Studio', 'meta_ad_33091823', NULL),
  (gen_random_uuid(), now() - INTERVAL '14 hours', 'Rohan De Silva', '+94771928374', 'Contacted', 'Facebook', 'Q4 Corporate Event Venues - Colombo', 'Can you provide quotation for renting the Waters Edge Grand Banquet lawn for a tech product launch with 200 attendees?', 'Waters Edge Grand Lawn', 'meta_ad_88392101', 'Sent proposal PDF via WhatsApp.'),
  (gen_random_uuid(), now() - INTERVAL '22 hours', 'Tanya Senanayake', '+94715562091', 'Closed', 'Instagram', 'Festive Season Banquet & Rooftop Bookings', 'Booking confirmed! Paid 50% advance for the Galle Face terrace cocktail event on Dec 14th.', 'Galle Face Terrace Suite', 'meta_ad_99201844', 'Deal closed. Advance receipt issued.'),
  (gen_random_uuid(), now() - INTERVAL '1 day', 'Marcus Tan', '+6591283741', 'Qualified', 'Facebook', 'High-End Boardroom & Meeting Pods', 'Hi, I am visiting Colombo from Singapore next week for investor meetings. Need an executive boardroom at One Galle Face for 2 consecutive days.', 'Shangri-La / OGF Executive Room', 'meta_ad_77209144', 'High value foreign lead.')
ON CONFLICT DO NOTHING;
