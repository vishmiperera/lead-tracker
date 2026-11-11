export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Lost' | 'Closed';

export type LeadSource = 'Facebook' | 'Instagram' | 'WhatsApp Direct';

export interface Lead {
  id: string;
  created_at: string;
  name: string;
  phone: string;
  lead_status: LeadStatus;
  source: LeadSource;
  campaign: string;
  message: string;
  notes?: string;
  ad_id?: string;
  venue_interest?: string;
}

export interface KpiMetrics {
  totalLeads: number;
  totalLeadsDiffPercent: number;
  newLeadsToday: number;
  topCampaignName: string;
  topCampaignCount: number;
  contactedRatePercent: number;
  contactedCount: number;
  qualifiedCount: number;
}

export interface FilterOptions {
  searchQuery: string;
  status: string; // 'All' | LeadStatus
  source: string; // 'All' | LeadSource
  campaign: string; // 'All' | string
  dateRange: 'all' | 'today' | '7days' | '30days';
}

