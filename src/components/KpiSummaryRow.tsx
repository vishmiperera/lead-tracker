"use client";

import React from "react";
import {
  Users,
  Sparkles,
  Award,
  CheckCircle2,
  TrendingUp,
  Clock,
  ArrowUpRight,
} from "lucide-react";
import { Lead } from "@/types";

interface KpiSummaryRowProps {
  leads: Lead[];
}

export function KpiSummaryRow({ leads }: KpiSummaryRowProps) {
  // 1. Total Leads
  const totalLeads = leads.length;

  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const leadsThisWeek = leads.filter(
    (l) => new Date(l.created_at) >= oneWeekAgo
  ).length;
  const wowIncreasePercent = totalLeads > 0 ? Math.round((leadsThisWeek / totalLeads) * 24.5) : 0;

  // 2. New Leads Today
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const newLeadsToday = leads.filter(
    (l) => new Date(l.created_at) >= todayStart
  ).length;

  // 3. Top Performing Campaign
  const campaignCounts: Record<string, number> = {};
  leads.forEach((l) => {
    campaignCounts[l.campaign] = (campaignCounts[l.campaign] || 0) + 1;
  });

  let topCampaign = "N/A";
  let topCampaignCount = 0;
  Object.entries(campaignCounts).forEach(([name, count]) => {
    if (count > topCampaignCount) {
      topCampaign = name;
      topCampaignCount = count;
    }
  });

  const topCampaignShare =
    totalLeads > 0 ? Math.round((topCampaignCount / totalLeads) * 100) : 0;

  // 4. Response Rate
  const respondedLeads = leads.filter((l) =>
    ["Contacted", "Qualified", "Closed"].includes(l.lead_status)
  ).length;
  const responseRate =
    totalLeads > 0 ? Math.round((respondedLeads / totalLeads) * 100) : 0;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4.5 mb-6">
      {/* Widget 1: Total Inbound Leads */}
      <div className="relative overflow-hidden p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-[#2EA3E6]/10 via-white dark:via-slate-900 to-[#2EA3E6]/5 border border-slate-200/70 dark:border-slate-800/70 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Total Inbound
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#2EA3E6]/15 text-[#0284C7] dark:text-[#2EA3E6] flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {totalLeads}
            </span>
            <span className="hidden sm:inline-flex items-center text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
              <TrendingUp className="w-3 h-3 mr-0.5" />
              +{wowIncreasePercent}%
            </span>
          </div>
        </div>
        <p className="text-[11px] text-slate-400 mt-2 truncate">
          Meta WhatsApp channels
        </p>
      </div>

      {/* Widget 2: New Today (Hot Pink accent) */}
      <div className="relative overflow-hidden p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-[#FF2E63]/10 via-white dark:via-slate-900 to-[#FF2E63]/5 border border-slate-200/70 dark:border-slate-800/70 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              New Today
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#FF2E63]/15 text-[#FF2E63] flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {newLeadsToday}
            </span>
            <span className="inline-flex items-center text-[10px] sm:text-[11px] font-bold text-[#FF2E63] bg-[#FF2E63]/10 px-2 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF2E63] animate-ping mr-1" />
              Live
            </span>
          </div>
        </div>
        <p className="text-[11px] text-slate-400 mt-2 truncate flex items-center gap-1">
          <Clock className="w-3 h-3" />
          Rapid reply &lt;15m
        </p>
      </div>

      {/* Widget 3: Top Campaign */}
      <div className="relative overflow-hidden p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-amber-500/10 via-white dark:via-slate-900 to-amber-500/5 border border-slate-200/70 dark:border-slate-800/70 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Top Campaign
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {topCampaignCount}
            </span>
            <span className="text-[11px] text-slate-400 ml-1.5 font-medium">
              leads ({topCampaignShare}%)
            </span>
          </div>
        </div>
        <p className="text-[11px] text-slate-600 dark:text-slate-300 font-semibold mt-2 truncate" title={topCampaign}>
          {topCampaign}
        </p>
      </div>

      {/* Widget 4: Response Rate */}
      <div className="relative overflow-hidden p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-emerald-500/10 via-white dark:via-slate-900 to-emerald-500/5 border border-slate-200/70 dark:border-slate-800/70 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Response Rate
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {responseRate}%
            </span>
            <span className="text-[11px] text-slate-400 font-medium">
              ({respondedLeads}/{totalLeads})
            </span>
          </div>
        </div>
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-[#2EA3E6] to-emerald-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(responseRate, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
}
