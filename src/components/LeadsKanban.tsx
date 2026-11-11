"use client";

import React, { useState } from "react";
import {
  MessageCircle,
  Calendar,
  Eye,
  ArrowRight,
  CheckCircle2,
  Users,
  GripVertical,
  MoveRight,
} from "lucide-react";
import { Lead, LeadStatus, LeadSource } from "@/types";

interface LeadsKanbanProps {
  leads: Lead[];
  onSelectLead: (lead: Lead) => void;
  onStatusChange: (id: string, newStatus: LeadStatus) => void;
  assignees?: string[];
  onAssigneeChange?: (id: string, newAssignee: string) => void;
}

const COLUMNS: { id: LeadStatus; label: string; headerColor: string; badgeColor: string; borderTop: string; dropRing: string }[] = [
  {
    id: "New",
    label: "New Inquiries",
    headerColor: "text-[#FF2E63]",
    badgeColor: "bg-[#FF2E63]/10 text-[#FF2E63]",
    borderTop: "border-t-[#FF2E63]",
    dropRing: "ring-[#FF2E63] border-[#FF2E63]/60 bg-[#FF2E63]/5",
  },
  {
    id: "Contacted",
    label: "Contacted",
    headerColor: "text-[#2EA3E6]",
    badgeColor: "bg-[#2EA3E6]/10 text-[#2EA3E6]",
    borderTop: "border-t-[#2EA3E6]",
    dropRing: "ring-[#2EA3E6] border-[#2EA3E6]/60 bg-[#2EA3E6]/5",
  },
  {
    id: "Qualified",
    label: "Qualified / Site Tour",
    headerColor: "text-emerald-500",
    badgeColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    borderTop: "border-t-emerald-500",
    dropRing: "ring-emerald-500 border-emerald-500/60 bg-emerald-500/5",
  },
  {
    id: "Closed",
    label: "Closed / Booked",
    headerColor: "text-purple-500",
    badgeColor: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
    borderTop: "border-t-purple-500",
    dropRing: "ring-purple-500 border-purple-500/60 bg-purple-500/5",
  },
  {
    id: "Lost",
    label: "Lost / Inactive",
    headerColor: "text-slate-500",
    badgeColor: "bg-slate-500/10 text-slate-600 dark:text-slate-400",
    borderTop: "border-t-slate-400",
    dropRing: "ring-slate-400 border-slate-400/60 bg-slate-400/5",
  },
];

export function LeadsKanban({
  leads,
  onSelectLead,
  onStatusChange,
  assignees = [],
  onAssigneeChange,
}: LeadsKanbanProps) {
  // Drag and drop state
  const [draggedLeadId, setDraggedLeadId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<LeadStatus | null>(null);

  const draggedLead = leads.find((l) => l.id === draggedLeadId);

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

  // Compact source badge styling helper to avoid overflow
  const getSourceBadge = (source: string) => {
    switch (source) {
      case "Instagram":
        return {
          label: "Instagram",
          badgeBg: "bg-purple-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20",
        };
      case "Facebook":
        return {
          label: "Facebook",
          badgeBg: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
        };
      case "WhatsApp Direct":
      default:
        return {
          label: "Direct WA",
          badgeBg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
        };
    }
  };

  // Drag start handler on card
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, leadId: string) => {
    e.dataTransfer.setData("text/plain", leadId);
    e.dataTransfer.effectAllowed = "move";
    setDraggedLeadId(leadId);
  };

  // Drag end handler
  const handleDragEnd = () => {
    setDraggedLeadId(null);
    setDragOverColumn(null);
  };

  // Column drag over handler
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, colId: LeadStatus) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverColumn !== colId) {
      setDragOverColumn(colId);
    }
  };

  // Column drop handler
  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetStatus: LeadStatus) => {
    e.preventDefault();
    const leadId = e.dataTransfer.getData("text/plain") || draggedLeadId;
    setDragOverColumn(null);
    setDraggedLeadId(null);

    if (!leadId) return;

    const lead = leads.find((l) => l.id === leadId);
    if (lead && lead.lead_status !== targetStatus) {
      onStatusChange(leadId, targetStatus);
    }
  };

  return (
    <div className="space-y-2.5">
      {/* Sub-header instruction hint */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1 select-none">
        <span className="flex items-center gap-1.5 font-medium">
          <GripVertical className="w-3.5 h-3.5 text-slate-400" />
          <span>Drag and drop leads between columns to immediately update their stage across both Kanban and Table views.</span>
        </span>
        <span className="text-[11px] text-slate-400 hidden md:inline">
          {leads.length} total leads
        </span>
      </div>

      <div className="flex xl:grid xl:grid-cols-5 gap-3.5 sm:gap-4 overflow-x-auto pb-4 scrollbar-thin">
        {COLUMNS.map((col) => {
          const columnLeads = leads.filter((l) => l.lead_status === col.id);
          const isDropActive = dragOverColumn === col.id && draggedLead?.lead_status !== col.id;

          return (
            <div
              key={col.id}
              onDragOver={(e) => handleDragOver(e, col.id)}
              onDragEnter={(e) => {
                e.preventDefault();
                setDragOverColumn(col.id);
              }}
              onDragLeave={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                  if (dragOverColumn === col.id) {
                    setDragOverColumn(null);
                  }
                }
              }}
              onDrop={(e) => handleDrop(e, col.id)}
              className={`min-w-[270px] xl:min-w-0 flex-1 flex flex-col border border-t-4 ${col.borderTop} rounded-2xl p-3 min-h-[560px] transition-all duration-200 ${
                isDropActive
                  ? `${col.dropRing} ring-2 ring-offset-2 dark:ring-offset-slate-900 shadow-md`
                  : "bg-slate-100/70 dark:bg-slate-900/60 border-slate-200/80 dark:border-slate-800/80"
              }`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 mb-2.5 border-b border-slate-200/60 dark:border-slate-800/60">
                <span className={`text-xs font-bold uppercase tracking-wider ${col.headerColor}`}>
                  {col.label}
                </span>
                <span
                  className={`text-[11px] font-black px-2 py-0.5 rounded-full ${col.badgeColor}`}
                >
                  {columnLeads.length}
                </span>
              </div>

              {/* Column Drop Indicator Banner when dragging over */}
              {isDropActive && (
                <div className="mb-2.5 p-3 rounded-xl border-2 border-dashed border-[#2EA3E6] bg-[#2EA3E6]/10 text-center text-xs font-bold text-[#2EA3E6] animate-pulse flex items-center justify-center gap-1.5 shadow-2xs">
                  <MoveRight className="w-3.5 h-3.5" />
                  <span>Drop to mark as {col.label}</span>
                </div>
              )}

              {/* Column Lead Cards */}
              <div className="flex-1 space-y-3 overflow-y-auto pr-1">
                {columnLeads.length === 0 ? (
                  <div className="h-32 flex items-center justify-center text-center text-slate-400 dark:text-slate-500 text-xs italic">
                    No {col.label.toLowerCase()}
                  </div>
                ) : (
                  columnLeads.map((lead) => {
                    const cleanPhone = lead.phone.replace(/[^0-9]/g, "");
                    const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                      `Hi ${lead.name}, thank you for contacting MillionSpaces regarding your venue inquiry for "${lead.campaign}". How can we help?`
                    )}`;
                    const nextStatus = getNextStatus(lead.lead_status);
                    const sourceBadge = getSourceBadge(lead.source);
                    const isDraggingThisCard = draggedLeadId === lead.id;

                    return (
                      <div
                        key={lead.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, lead.id)}
                        onDragEnd={handleDragEnd}
                        onClick={() => onSelectLead(lead)}
                        className={`group p-3.5 rounded-xl bg-white dark:bg-slate-800 border transition-all duration-150 cursor-grab active:cursor-grabbing relative select-none ${
                          isDraggingThisCard
                            ? "opacity-35 scale-[0.98] border-dashed border-[#2EA3E6] shadow-none"
                            : "border-slate-200/80 dark:border-slate-700/80 shadow-2xs hover:shadow-md hover:border-[#2EA3E6]/50 hover:-translate-y-0.5"
                        }`}
                      >
                        {/* Top Row: Drag Handle, Avatar, Name & Compact Source Pill */}
                        <div className="flex items-center justify-between gap-1.5 mb-2">
                          <div className="flex items-center space-x-1.5 min-w-0 flex-1">
                            <GripVertical className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 group-hover:text-slate-400 shrink-0" />
                            <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center font-bold text-[10px] shrink-0">
                              {lead.name.charAt(0).toUpperCase()}
                            </div>
                            <span
                              className="font-bold text-xs text-slate-900 dark:text-white truncate"
                              title={lead.name}
                            >
                              {lead.name}
                            </span>
                          </div>
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border shrink-0 ${sourceBadge.badgeBg}`}
                            title={lead.source}
                          >
                            {sourceBadge.label}
                          </span>
                        </div>

                        {/* Phone link & Campaign */}
                        <div className="flex items-center justify-between gap-2 mb-2 text-xs">
                          <div
                            onClick={(e) => e.stopPropagation()}
                            onMouseDown={(e) => e.stopPropagation()}
                          >
                            <a
                              href={waUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              draggable={false}
                              className="inline-flex items-center space-x-1 text-[11px] font-mono text-emerald-600 dark:text-emerald-400 hover:underline"
                              title="Chat on WhatsApp"
                            >
                              <MessageCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                              <span>{lead.phone}</span>
                            </a>
                          </div>
                          <span
                            className="inline-flex items-center text-[10px] text-slate-500 dark:text-slate-400 font-medium truncate max-w-[120px]"
                            title={lead.campaign}
                          >
                            📌 {lead.campaign}
                          </span>
                        </div>

                        {/* Message preview bubble */}
                        <div
                          className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed bg-slate-50 dark:bg-slate-900/60 p-2 rounded-lg border border-slate-100 dark:border-slate-800/80 mb-2.5"
                          title={lead.message}
                        >
                          {lead.message || <span className="italic text-slate-400">No message attached</span>}
                        </div>

                        {/* Metadata Row: Date & Assignee */}
                        <div className="flex items-center justify-between gap-2 text-[10px] text-slate-400 dark:text-slate-500 mb-2.5">
                          <span className="flex items-center space-x-1 shrink-0">
                            <Calendar className="w-3 h-3 text-slate-400 shrink-0" />
                            <span>
                              {new Date(lead.created_at).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                          </span>

                          {/* Interactive Assignee Select or Read-only Pill */}
                          {onAssigneeChange && assignees.length > 0 ? (
                            <div
                              onClick={(e) => e.stopPropagation()}
                              onMouseDown={(e) => e.stopPropagation()}
                              className="relative shrink-0"
                            >
                              <select
                                value={lead.assignee || ""}
                                onChange={(e) => onAssigneeChange(lead.id, e.target.value)}
                                className="text-[10px] font-medium px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-[#2EA3E6] cursor-pointer max-w-[130px] truncate"
                                title={lead.assignee ? `Assigned to ${lead.assignee}` : "Assign team member"}
                              >
                                <option value="">👤 Unassigned</option>
                                {assignees.map((a) => (
                                  <option key={a} value={a}>
                                    👤 {a}
                                  </option>
                                ))}
                              </select>
                            </div>
                          ) : (
                            <span
                              className={`inline-flex items-center space-x-1 text-[10px] font-medium px-1.5 py-0.5 rounded ${
                                lead.assignee
                                  ? "text-[#0284C7] dark:text-[#2EA3E6] bg-[#2EA3E6]/10"
                                  : "text-slate-400 dark:text-slate-500"
                              }`}
                            >
                              <Users className="w-2.5 h-2.5" />
                              <span className="truncate max-w-[100px]">
                                {lead.assignee || "Unassigned"}
                              </span>
                            </span>
                          )}
                        </div>

                        {/* Action buttons footer */}
                        <div
                          className="pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between gap-2"
                          onClick={(e) => e.stopPropagation()}
                          onMouseDown={(e) => e.stopPropagation()}
                        >
                          {nextStatus ? (
                            <button
                              type="button"
                              onClick={() => onStatusChange(lead.id, nextStatus)}
                              className="flex-1 py-1.5 px-2.5 text-[11px] font-bold rounded-lg bg-slate-100 hover:bg-[#2EA3E6] text-slate-700 hover:text-white dark:bg-slate-700/80 dark:hover:bg-[#2EA3E6] dark:text-slate-200 dark:hover:text-white transition flex items-center justify-center space-x-1 shadow-2xs group/btn active:scale-98"
                              title={`Advance to ${nextStatus}`}
                            >
                              <span>{nextStatus}</span>
                              <ArrowRight className="w-3 h-3 transition-transform group-hover/btn:translate-x-0.5" />
                            </button>
                          ) : (
                            <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400 flex items-center space-x-1 py-1">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>{lead.lead_status === "Closed" ? "Closed Won" : "Archived"}</span>
                            </span>
                          )}

                          <button
                            type="button"
                            onClick={() => onSelectLead(lead)}
                            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700/80 text-slate-400 hover:text-[#2EA3E6] hover:border-[#2EA3E6]/40 transition shrink-0"
                            title="View Lead Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
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
    </div>
  );
}
