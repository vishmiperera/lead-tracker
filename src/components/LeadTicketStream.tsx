"use client";

import React from "react";
import {
  MessageCircle,
  Clock,
  Phone,
  Eye,
  ArrowUpRight,
  ExternalLink,
  Tag,
  User,
  Sparkles,
} from "lucide-react";
import { Lead, LeadStatus } from "@/types";

interface LeadTicketStreamProps {
  leads: Lead[];
  onSelectLead: (lead: Lead) => void;
  onStatusChange: (id: string, newStatus: LeadStatus) => void;
  assignees: string[];
  onAssigneeChange: (id: string, newAssignee: string) => void;
}

export function LeadTicketStream({
  leads,
  onSelectLead,
  onStatusChange,
  assignees,
  onAssigneeChange,
}: LeadTicketStreamProps) {
  if (leads.length === 0) {
    return (
      <div className="bg-white dark:bg-[#121E27] rounded-3xl p-10 text-center border border-slate-200/60 dark:border-slate-800 shadow-sm">
        <div className="w-12 h-12 rounded-full bg-[#2EA3E6]/10 text-[#2EA3E6] mx-auto flex items-center justify-center mb-3">
          <MessageCircle className="w-6 h-6" />
        </div>
        <h4 className="text-sm font-bold text-slate-800 dark:text-white">
          No matching inbound leads
        </h4>
        <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
          No inquiries found matching your current filter criteria. Try adjusting your search query or status filter.
        </p>
      </div>
    );
  }

  // Format relative or date string
  const formatTime = (isoString: string) => {
    try {
      const d = new Date(isoString);
      const now = new Date();
      const isToday =
        d.getDate() === now.getDate() &&
        d.getMonth() === now.getMonth() &&
        d.getFullYear() === now.getFullYear();

      const timeStr = d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
      if (isToday) return `Today, ${timeStr}`;
      return `${d.toLocaleDateString([], { month: "short", day: "numeric" })}, ${timeStr}`;
    } catch {
      return isoString;
    }
  };

  const getStatusBadgeStyle = (status: LeadStatus) => {
    switch (status) {
      case "New":
        return {
          pill: "bg-[#FF2E63]/10 text-[#FF2E63] border-[#FF2E63]/30",
          dot: "bg-[#FF2E63]",
        };
      case "Contacted":
        return {
          pill: "bg-[#2EA3E6]/10 text-[#0284C7] dark:text-[#2EA3E6] border-[#2EA3E6]/30",
          dot: "bg-[#2EA3E6]",
        };
      case "Qualified":
        return {
          pill: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
          dot: "bg-emerald-500",
        };
      case "Closed":
        return {
          pill: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30",
          dot: "bg-purple-500",
        };
      case "Lost":
        return {
          pill: "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700",
          dot: "bg-slate-400",
        };
      default:
        return {
          pill: "bg-slate-100 text-slate-700 border-slate-200",
          dot: "bg-slate-400",
        };
    }
  };

  return (
    <div className="space-y-3.5">
      {leads.map((lead) => {
        const cleanPhone = lead.phone.replace(/[^0-9]/g, "");
        const statusStyle = getStatusBadgeStyle(lead.lead_status);

        return (
          <div
            key={lead.id}
            className="group relative bg-white dark:bg-[#121E27] rounded-3xl border border-slate-200/70 dark:border-slate-800 shadow-xs hover:shadow-md hover:border-[#2EA3E6]/40 transition-all duration-200 p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            {/* Left Section: Avatar + Name + Timestamp */}
            <div className="flex items-center space-x-3.5 shrink-0 min-w-[200px]">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#2EA3E6] to-[#00A3E8] text-white flex items-center justify-center font-bold text-sm shadow-md shadow-[#2EA3E6]/20">
                {lead.name ? lead.name.charAt(0).toUpperCase() : "L"}
              </div>

              <div className="overflow-hidden">
                <button
                  onClick={() => onSelectLead(lead)}
                  className="font-bold text-sm text-slate-900 dark:text-white hover:text-[#2EA3E6] transition truncate block text-left"
                >
                  {lead.name || "Anonymous Lead"}
                </button>
                <div className="flex items-center space-x-1.5 text-[11px] text-[#2EA3E6] font-medium mt-0.5">
                  <Clock className="w-3 h-3" />
                  <span>{formatTime(lead.created_at)}</span>
                </div>
              </div>
            </div>

            {/* Middle Section: Phone + Message Excerpt + Campaign */}
            <div className="flex-1 min-w-0 space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                {/* Click-to-WhatsApp link */}
                <a
                  href={`https://wa.me/${cleanPhone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition group/wa"
                  title="Click to open direct WhatsApp conversation"
                >
                  <MessageCircle className="w-3 h-3 text-emerald-500 fill-emerald-500" />
                  <span className="font-mono text-[11px]">{lead.phone}</span>
                  <ExternalLink className="w-2.5 h-2.5 opacity-60 group-hover/wa:opacity-100" />
                </a>

                {/* Campaign Tag */}
                <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  <Tag className="w-2.5 h-2.5" />
                  <span className="truncate max-w-[140px]">{lead.campaign}</span>
                </span>
              </div>

              {/* Message text excerpt */}
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate italic">
                &ldquo;{lead.message || "Customer initiated WhatsApp conversation from Meta ad"}&rdquo;
              </p>
            </div>

            {/* Right Section: Status Pill + Assignee + Action Button */}
            <div className="flex items-center flex-wrap sm:flex-nowrap gap-2.5 shrink-0">
              {/* Status Select Pill */}
              <div className="relative">
                <select
                  value={lead.lead_status}
                  onChange={(e) => onStatusChange(lead.id, e.target.value as LeadStatus)}
                  className={`text-xs font-bold pl-3 pr-6 py-1.5 rounded-full border cursor-pointer appearance-none focus:outline-none transition ${statusStyle.pill}`}
                >
                  <option value="New">● New</option>
                  <option value="Contacted">● Contacted</option>
                  <option value="Qualified">● Qualified</option>
                  <option value="Closed">● Closed</option>
                  <option value="Lost">● Lost</option>
                </select>
                <span className="absolute right-2 top-2 pointer-events-none text-[8px] opacity-70">
                  ▼
                </span>
              </div>

              {/* Assignee Select Pill */}
              <div className="relative">
                <select
                  value={lead.assignee || "Unassigned"}
                  onChange={(e) => {
                    const val = e.target.value === "Unassigned" ? "" : e.target.value;
                    onAssigneeChange(lead.id, val);
                  }}
                  className={`text-xs font-medium pl-2.5 pr-6 py-1.5 rounded-full border cursor-pointer appearance-none focus:outline-none transition ${
                    lead.assignee
                      ? "bg-[#2EA3E6]/10 text-[#0284C7] dark:text-[#2EA3E6] border-[#2EA3E6]/30 font-semibold"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700"
                  }`}
                >
                  <option value="Unassigned">👤 Unassigned</option>
                  {assignees.map((person) => (
                    <option key={person} value={person}>
                      👤 {person}
                    </option>
                  ))}
                </select>
                <span className="absolute right-2 top-2 pointer-events-none text-[8px] opacity-70">
                  ▼
                </span>
              </div>

              {/* View Lead Pill Button (Inspired by reference [BOOK NOW] button) */}
              <button
                onClick={() => onSelectLead(lead)}
                className="py-1.5 px-3.5 rounded-full bg-[#14232C] hover:bg-slate-800 dark:bg-white dark:text-[#14232C] text-white font-bold text-xs flex items-center space-x-1 shadow-xs hover:scale-105 active:scale-95 transition"
              >
                <span>VIEW</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
