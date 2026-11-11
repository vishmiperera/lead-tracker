"use client";

import React from "react";
import {
  MessageCircle,
  Phone,
  Calendar,
  Eye,
  ArrowRight,
  Sparkles,
  Building,
  CheckCircle2,
  Tag,
} from "lucide-react";
import { Lead, LeadStatus } from "@/types";

interface LeadsKanbanProps {
  leads: Lead[];
  onSelectLead: (lead: Lead) => void;
  onStatusChange: (id: string, newStatus: LeadStatus) => void;
}

const COLUMNS: { id: LeadStatus; label: string; headerColor: string; badgeColor: string; borderTop: string }[] = [
  {
    id: "New",
    label: "New Inquiries",
    headerColor: "text-[#FF2E63]",
    badgeColor: "bg-[#FF2E63]/10 text-[#FF2E63]",
    borderTop: "border-t-[#FF2E63]",
  },
  {
    id: "Contacted",
    label: "Contacted",
    headerColor: "text-[#2EA3E6]",
    badgeColor: "bg-[#2EA3E6]/10 text-[#2EA3E6]",
    borderTop: "border-t-[#2EA3E6]",
  },
  {
    id: "Qualified",
    label: "Qualified / Site Tour",
    headerColor: "text-emerald-500",
    badgeColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    borderTop: "border-t-emerald-500",
  },
  {
    id: "Closed",
    label: "Closed / Booked",
    headerColor: "text-purple-500",
    badgeColor: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
    borderTop: "border-t-purple-500",
  },
  {
    id: "Lost",
    label: "Lost / Inactive",
    headerColor: "text-slate-500",
    badgeColor: "bg-slate-500/10 text-slate-600 dark:text-slate-400",
    borderTop: "border-t-slate-400",
  },
];

export function LeadsKanban({
  leads,
  onSelectLead,
  onStatusChange,
}: LeadsKanbanProps) {
  // Next stage transition helper
  const getNextStatus = (current: LeadStatus): LeadStatus | null => {
    switch (current) {
      case "New":
        return "Contacted";
      case "Contacted":
        return "Qualified";
      case "Qualified":
        return "Closed";
      default:
        return null;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {COLUMNS.map((col) => {
        const columnLeads = leads.filter((l) => l.lead_status === col.id);

        return (
          <div
            key={col.id}
            className={`flex flex-col bg-slate-100/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 border-t-4 ${col.borderTop} rounded-2xl p-3 min-h-[520px] transition-all`}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-200/60 dark:border-slate-800/60">
              <span className={`text-xs font-bold uppercase tracking-wider ${col.headerColor}`}>
                {col.label}
              </span>
              <span
                className={`text-[11px] font-black px-2 py-0.5 rounded-full ${col.badgeColor}`}
              >
                {columnLeads.length}
              </span>
            </div>

            {/* Column Lead Cards */}
            <div className="flex-1 space-y-2.5 overflow-y-auto pr-1">
              {columnLeads.length === 0 ? (
                <div className="h-32 flex items-center justify-center text-center text-slate-400 text-xs italic">
                  No {col.label.toLowerCase()}
                </div>
              ) : (
                columnLeads.map((lead) => {
                  const cleanPhone = lead.phone.replace(/[^0-9]/g, "");
                  const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                    `Hi ${lead.name}, thank you for contacting MillionSpaces regarding your venue inquiry for "${lead.campaign}". How can we help?`
                  )}`;
                  const nextStatus = getNextStatus(lead.lead_status);

                  return (
                    <div
                      key={lead.id}
                      onClick={() => onSelectLead(lead)}
                      className="group p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-xs hover:shadow-md hover:border-[#2EA3E6]/50 transition-all cursor-pointer relative"
                    >
                      {/* Top info: Name & Source */}
                      <div className="flex items-start justify-between gap-1 mb-1.5">
                        <div className="flex items-center space-x-1.5">
                          <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center font-bold text-[10px]">
                            {lead.name.charAt(0)}
                          </div>
                          <span className="font-bold text-xs text-slate-900 dark:text-white truncate max-w-[110px]">
                            {lead.name}
                          </span>
                        </div>
                        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700/80 text-slate-600 dark:text-slate-300 shrink-0">
                          {lead.source}
                        </span>
                      </div>

                      {/* Phone link */}
                      <div
                        className="mb-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <a
                          href={waUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-1 text-[11px] text-emerald-600 dark:text-emerald-400 hover:underline font-mono"
                        >
                          <MessageCircle className="w-3 h-3" />
                          <span>{lead.phone}</span>
                        </a>
                      </div>

                      {/* Campaign tag */}
                      <div className="mb-2">
                        <span
                          className="inline-block text-[10px] text-slate-500 dark:text-slate-400 font-medium truncate max-w-full"
                          title={lead.campaign}
                        >
                          📌 {lead.campaign}
                        </span>
                      </div>

                      {/* Message preview */}
                      <p
                        className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed bg-slate-50 dark:bg-slate-900/50 p-1.5 rounded-lg border border-slate-100 dark:border-slate-800"
                        title={lead.message}
                      >
                        {lead.message}
                      </p>

                      {/* Action buttons footer */}
                      <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
                        <span className="text-[10px] text-slate-400">
                          {new Date(lead.created_at).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>

                        <div
                          className="flex items-center space-x-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {nextStatus && (
                            <button
                              type="button"
                              onClick={() => onStatusChange(lead.id, nextStatus)}
                              className="px-2 py-0.5 text-[10px] font-bold rounded bg-slate-100 dark:bg-slate-700 hover:bg-[#2EA3E6] hover:text-white text-slate-700 dark:text-slate-200 transition flex items-center space-x-0.5"
                              title={`Advance to ${nextStatus}`}
                            >
                              <span>{nextStatus}</span>
                              <ArrowRight className="w-2.5 h-2.5" />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => onSelectLead(lead)}
                            className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                            title="View Lead Dossier"
                          >
                            <Eye className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

