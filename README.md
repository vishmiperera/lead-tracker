# MillionSpaces Leads Hub 🏢💬

A modern, responsive, high-utility SaaS Lead Management Dashboard designed specifically for tracking and qualifying **Click-to-WhatsApp leads** generated from **Meta Ad campaigns** (Facebook & Instagram).

Built with **Next.js 14 (App Router)**, **Tailwind CSS**, **shadcn/ui-inspired components**, **Recharts**, and integrated with **Supabase** for persistent real-time storage. Fully optimized for instant deployment on **Vercel**.

---

## 🌟 Key Features

### 1. MillionSpaces Brand Aesthetic
- **MillionSpaces Sky Blue (`#2EA3E6` / `#00A3E8`)**: Primary brand accent used in header badges, primary metrics, and campaign bar charts.
- **Vibrant Hot Pink / Magenta (`#FF2E63`)**: Secondary/CTA accent inspired by the signature MillionSpaces search button, used for New Lead status badges and action CTAs.
- **Full Dark / Light Mode**: Seamless theme switching with persistence via `next-themes`.
- **Subtle Modern Elevation**: Rounded-2xl cards with soft ambient shadows and glassmorphic headers.

### 2. High-Utility KPI Row
- **Total Inbound Leads**: With calculated Week-over-Week (% WoW) volume increase.
- **New Leads Today**: Real-time counter of fresh inbound WhatsApp inquiries.
- **Top Performing Campaign**: Meta ad campaign generating the most WhatsApp chats.
- **Contacted / Active Response Rate**: Response rate tracking with interactive progress bar.

### 3. Interactive Analytics (Recharts)
- **Campaign Lead Volume Bar Chart**: Dynamic bar chart showing lead counts per Meta campaign styled with MillionSpaces Sky Blue `#2EA3E6`.
- **Source Split Donut Chart**: Visual distribution of Facebook Ads vs. Instagram Ads vs. Direct WhatsApp inquiries using `#2EA3E6` and `#FF2E63`.

### 4. Centralized Leads Data Table
- **Columns**:
  1. **Date & Time**: Formatted cleanly (e.g., "Today, 10:30 AM" or "Oct 24, 2:15 PM") with sortable header.
  2. **Customer Name**: Sender display name with avatar badge.
  3. **WhatsApp Phone**: One-click direct link to open `https://wa.me/<phone>` with pre-filled greeting template.
  4. **Lead Status Badge**: Color-coded inline dropdown (`New` = Pink, `Contacted` = Blue, `Qualified` = Green, `Closed` = Purple, `Lost` = Gray).
  5. **Source**: Visual badges for Facebook, Instagram, or WhatsApp Direct.
  6. **Campaign Name**: Meta ad creative or campaign tag.
  7. **Inquiry Message**: Preview of the customer's incoming message with full-detail inspection drawer.
- **Filtering & Search**:
  - Global pill search across Name, Phone number, Campaign, and Inquiry text.
  - Multi-criteria filter toolbar: Status, Source platform, Campaign name, and Timeframe presets (`All`, `Today`, `7D`, `30D`).
  - Pagination controls with configurable items per page (10, 25, 50).
  - One-click **Export to CSV**.

### 5. Meta Webhook Integration (`/api/meta-webhook`)
- **GET Handler**: Meta App Dashboard verification challenge (`hub.mode`, `hub.verify_token`, `hub.challenge`).
- **POST Handler**: Processes inbound WhatsApp Business Cloud API webhooks, extracting:
  - Customer WhatsApp ID and display name
  - Incoming message body text
  - Ad referral metadata (`source_url`, `source_id`/`ad_id`, `headline`, `body`)
  - Direct persistence into Supabase `meta_whatsapp_leads` table.
- **Built-in Webhook Simulator**: Modal in the top bar to simulate live inbound Meta ad clicks in 1 click!

### 6. Admin Authentication Portal
- Super Admin Login with requested credentials:
  - **Username / Email**: `adminsl@millionspaces.com`
  - **Password**: `MsAdmin@2019`

---

## 🗄️ Database Schema (Supabase)

To connect Supabase, open the **SQL Editor** in your Supabase project dashboard and execute the script in [`supabase/schema.sql`](./supabase/schema.sql):

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

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

-- Enable RLS & Policies
ALTER TABLE public.meta_whatsapp_leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access" ON public.meta_whatsapp_leads FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON public.meta_whatsapp_leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON public.meta_whatsapp_leads FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow public delete access" ON public.meta_whatsapp_leads FOR DELETE USING (true);
```

---

## ⚙️ Environment Variables Setup

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Populate the variables:

```env
# Supabase Configuration (Optional - app gracefully uses rich mock data if omitted)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Meta WhatsApp Webhook Secret Token
META_WEBHOOK_VERIFY_TOKEN=millionspaces_meta_leads_secret_token

# Admin Access Credentials
NEXT_PUBLIC_ADMIN_EMAIL=adminsl@millionspaces.com
ADMIN_PASSWORD=MsAdmin@2019
```

> **Note:** If Supabase keys are not provided, the dashboard automatically runs in an interactive demo mode with realistic venue, co-working, and event inquiries, and persists changes (status updates, new leads, notes) to local storage.

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for Production
```bash
npm run build
npm start
```

---

## 📡 Meta Cloud API Webhook Setup

1. In your **Meta for Developers Dashboard**, navigate to your App > **WhatsApp** > **Configuration**.
2. Under **Webhook**, click **Edit**.
3. **Callback URL**: `https://your-domain.vercel.app/api/meta-webhook`
4. **Verify Token**: `millionspaces_meta_leads_secret_token` (or matching `META_WEBHOOK_VERIFY_TOKEN`).
5. Click **Verify and Save**.
6. Under Webhook fields, subscribe to **`messages`**.

---

## 🚢 Deploying to Vercel

1. Push your repository to GitHub, GitLab, or Bitbucket.
2. Import the project into [Vercel](https://vercel.com).
3. Under **Project Settings > Environment Variables**, add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `META_WEBHOOK_VERIFY_TOKEN`
4. Click **Deploy**. Vercel will build and deploy the Next.js App Router application in under a minute!

