"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  Filter,
  Download,
  Phone,
  MessageCircle,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Calendar,
  Building,
  Tag,
  ArrowUpDown,
  CheckCircle2,
  Clock,
  Sparkles,
  Eye,
  SlidersHorizontal,
  Trash2,
  CheckSquare,
  Square,
} from "lucide-react";
import { Lead, LeadStatus, LeadSource } from "@/types";
import { CAMPAIGN_OPTIONS, STATUS_OPTIONS, SOURCE_OPTIONS } from "@/lib/mockData";

interface LeadsTableProps {
  leads: Lead[];
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onStatusChange: (id: string, newStatus: LeadStatus) => void;
  onSelectLead: (lead: Lead) => void;
  onBatchStatusChange?: (ids: string[], newStatus: LeadStatus) => void;
  onBatchDelete?: (ids: string[]) => void;
  assignees?: string[];
  onAssigneeChange?: (id: string, newAssignee: string) => void;
  onBatchAssign?: (ids: string[], assignee: string) => void;
}

export function LeadsTable({
  leads,
  searchQuery,
  onSearchChange,
  onStatusChange,
  onSelectLead,
  onBatchStatusChange,
  onBatchDelete,
  assignees = [],
  onAssigneeChange,
  onBatchAssign,
}: LeadsTableProps) {
  // Filters state
  const [selectedStatus, setSelectedStatus] = useState<string>("All Statuses");
  const [selectedSource, setSelectedSource] = useState<string>("All Sources");
  const [selectedCampaign, setSelectedCampaign] = useState<string>("All Campaigns");
  const [selectedAssignee, setSelectedAssignee] = useState<string>("All Assignees");
  const [dateFilter, setDateFilter] = useState<"all" | "today" | "7days" | "30days" | "custom">("all");
  const [customStartDate, setCustomStartDate] = useState<string>("");
  const [customEndDate, setCustomEndDate] = useState<string>("");

  // Selection state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Sorting state
  const [sortField, setSortField] = useState<"created_at" | "name">("created_at");
  const [sortAsc, setSortAsc] = useState<boolean>(false); // default newest first

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // Filter and sort logic
  const filteredLeads = useMemo(() => {
    return leads
      .filter((lead) => {
        // Search query filter (Name, Phone, Campaign, Message, Assignee)
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = lead.name.toLowerCase().includes(q);
          const matchPhone = lead.phone.toLowerCase().includes(q);
          const matchCampaign = lead.campaign.toLowerCase().includes(q);
          const matchMessage = lead.message.toLowerCase().includes(q);
          const matchAssignee = (lead.assignee || "").toLowerCase().includes(q);
          if (!matchName && !matchPhone && !matchCampaign && !matchMessage && !matchAssignee) {
            return false;
          }
        }

        // Status filter
        if (selectedStatus !== "All Statuses" && lead.lead_status !== selectedStatus) {
          return false;
        }

        // Source filter
        if (selectedSource !== "All Sources" && lead.source !== selectedSource) {
          return false;
        }

        // Campaign filter
        if (selectedCampaign !== "All Campaigns" && lead.campaign !== selectedCampaign) {
          return false;
        }

        // Assignee filter
        if (selectedAssignee !== "All Assignees") {
          if (selectedAssignee === "Unassigned") {
            if (lead.assignee && lead.assignee.trim()) return false;
          } else if (lead.assignee !== selectedAssignee) {
            return false;
          }
        }

        // Date filter
        if (dateFilter !== "all") {
          const leadDate = new Date(lead.created_at).getTime();
          const now = Date.now();
          if (dateFilter === "today") {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (leadDate < today.getTime()) return false;
          } else if (dateFilter === "7days") {
            if (now - leadDate > 7 * 24 * 60 * 60 * 1000) return false;
          } else if (dateFilter === "30days") {
            if (now - leadDate > 30 * 24 * 60 * 60 * 1000) return false;
          } else if (dateFilter === "custom") {
            if (customStartDate) {
              const start = new Date(customStartDate);
              start.setHours(0, 0, 0, 0);
              if (leadDate < start.getTime()) return false;
            }
            if (customEndDate) {
              const end = new Date(customEndDate);
              end.setHours(23, 59, 59, 999);
              if (leadDate > end.getTime()) return false;
            }
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortField === "created_at") {
          const timeA = new Date(a.created_at).getTime();
          const timeB = new Date(b.created_at).getTime();
          return sortAsc ? timeA - timeB : timeB - timeA;
        } else {
          return sortAsc
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name);
        }
      });
  }, [
    leads,
    searchQuery,
    selectedStatus,
    selectedSource,
    selectedCampaign,
    selectedAssignee,
    dateFilter,
    customStartDate,
    customEndDate,
    sortField,
    sortAsc,
  ]);

  // Pagination calculation
  const totalItems = filteredLeads.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const validCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (validCurrentPage - 1) * pageSize;
  const paginatedLeads = filteredLeads.slice(startIndex, startIndex + pageSize);

  // Toggle selection
  const handleToggleSelectAll = () => {
    if (selectedIds.length === paginatedLeads.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedLeads.map((l) => l.id));
    }
  };

  const handleToggleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Status Badge Styling Helper
  const getStatusBadge = (status: LeadStatus) => {
    switch (status) {
      case "New":
        return {
          bg: "bg-[#FF2E63]/10 text-[#FF2E63] border-[#FF2E63]/25",
          dot: "bg-[#FF2E63]",
        };
      case "Contacted":
        return {
          bg: "bg-[#2EA3E6]/10 text-[#0284C7] dark:text-[#2EA3E6] border-[#2EA3E6]/25",
          dot: "bg-[#2EA3E6]",
        };
      case "Qualified":
        return {
          bg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25",
          dot: "bg-emerald-500",
        };
      case "Closed":
        return {
          bg: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/25",
          dot: "bg-purple-500",
        };
      case "Lost":
      default:
        return {
          bg: "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/25",
          dot: "bg-slate-400",
        };
    }
  };

  // Source Badge Styling Helper
  const getSourceBadge = (source: LeadSource) => {
    switch (source) {
      case "Instagram":
        return {
          label: "Instagram",
          badgeBg: "bg-gradient-to-r from-purple-500/10 to-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20",
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

  // Format Date Helper
  const formatDateTime = (dateString: string) => {
    const d = new Date(dateString);
    const now = new Date();
    const isToday =
      d.getDate() === now.getDate() &&
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear();

    const timeStr = d.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    if (isToday) {
      return (
        <span className="flex items-center space-x-1 text-[#2EA3E6] font-semibold">
          <Clock className="w-3 h-3 text-[#2EA3E6]" />
          <span>Today, {timeStr}</span>
        </span>
      );
    }

    return (
      <span>
        {d.toLocaleDateString("en-US", { month: "short", day: "numeric" })},{" "}
        {timeStr}
      </span>
    );
  };

  // Export to CSV
  const handleExportCsv = () => {
    const exportData =
      selectedIds.length > 0
        ? filteredLeads.filter((l) => selectedIds.includes(l.id))
        : filteredLeads;

    if (exportData.length === 0) return;
    const headers = ["ID", "Created At", "Name", "Phone", "Status", "Assignee", "Source", "Campaign", "Message", "Notes"];
    const rows = exportData.map((l) => [
      l.id,
      l.created_at,
      `"${l.name.replace(/"/g, '""')}"`,
      `"${l.phone}"`,
      l.lead_status,
      `"${(l.assignee || "Unassigned").replace(/"/g, '""')}"`,
      l.source,
      `"${l.campaign.replace(/"/g, '""')}"`,
      `"${l.message.replace(/"/g, '""')}"`,
      `"${(l.notes || "").replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `millionspaces-leads-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleResetFilters = () => {
    setSelectedStatus("All Statuses");
    setSelectedSource("All Sources");
    setSelectedCampaign("All Campaigns");
    setSelectedAssignee("All Assignees");
    setDateFilter("all");
    setCustomStartDate("");
    setCustomEndDate("");
    onSearchChange("");
    setSelectedIds([]);
    setCurrentPage(1);
  };

  const hasActiveFilters =
    searchQuery !== "" ||
    selectedStatus !== "All Statuses" ||
    selectedSource !== "All Sources" ||
    selectedCampaign !== "All Campaigns" ||
    selectedAssignee !== "All Assignees" ||
    dateFilter !== "all" ||
    customStartDate !== "" ||
    customEndDate !== "";

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl shadow-soft overflow-hidden">
      {/* Table Header & Controls Bar */}
      <div className="p-5 border-b border-slate-200/80 dark:border-slate-800/80 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Meta Click-to-WhatsApp Leads
              </h3>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-[#2EA3E6]/10 text-[#0284C7] dark:text-[#2EA3E6]">
                {filteredLeads.length} {filteredLeads.length === 1 ? "Lead" : "Leads"}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Live customer inquiries sourced from Facebook & Instagram Meta Ad Campaigns
            </p>
          </div>

          {/* Quick Actions (Export CSV & Filter Reset) */}
          <div className="flex items-center space-x-2">
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="text-xs font-semibold px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
              >
                Reset Filters
              </button>
            )}

            <button
              onClick={handleExportCsv}
              disabled={filteredLeads.length === 0}
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-[#2EA3E6]/40 text-slate-700 dark:text-slate-300 shadow-sm transition disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>
                {selectedIds.length > 0
                  ? `Export Selected (${selectedIds.length})`
                  : "Export CSV"}
              </span>
            </button>
          </div>
        </div>

        {/* Batch Actions Bar (Visible when rows are selected) */}
        {selectedIds.length > 0 && (
          <div className="p-3 rounded-xl bg-[#2EA3E6]/10 border border-[#2EA3E6]/25 flex flex-wrap items-center justify-between gap-2 animate-in fade-in duration-150">
            <span className="text-xs font-bold text-[#0284C7] dark:text-[#2EA3E6]">
              {selectedIds.length} lead{selectedIds.length > 1 ? "s" : ""} selected
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-500 dark:text-slate-400">Mark as:</span>
              <button
                onClick={() => {
                  onBatchStatusChange?.(selectedIds, "Contacted");
                  setSelectedIds([]);
                }}
                className="px-2.5 py-1 text-xs font-bold rounded-lg bg-[#2EA3E6] text-white hover:bg-[#1D92D4] transition"
              >
                Contacted
              </button>
              <button
                onClick={() => {
                  onBatchStatusChange?.(selectedIds, "Qualified");
                  setSelectedIds([]);
                }}
                className="px-2.5 py-1 text-xs font-bold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition"
              >
                Qualified
              </button>
              <button
                onClick={() => {
                  onBatchStatusChange?.(selectedIds, "Closed");
                  setSelectedIds([]);
                }}
                className="px-2.5 py-1 text-xs font-bold rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition"
              >
                Closed
              </button>

              {/* Batch Assignee Dropdown */}
              {assignees.length > 0 && (
                <div className="flex items-center gap-1 pl-2 border-l border-slate-300 dark:border-slate-700">
                  <span className="text-xs text-slate-500 dark:text-slate-400">Assign to:</span>
                  <select
                    defaultValue=""
                    onChange={(e) => {
                      if (e.target.value) {
                        const targetAssignee = e.target.value === "Unassigned" ? "" : e.target.value;
                        onBatchAssign?.(selectedIds, targetAssignee);
                        setSelectedIds([]);
                        e.target.value = "";
                      }
                    }}
                    className="text-xs py-1 px-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#2EA3E6]"
                  >
                    <option value="" disabled>Choose member...</option>
                    <option value="Unassigned">Unassigned</option>
                    {assignees.map((a) => (
                      <option key={a} value={a}>👤 {a}</option>
                    ))}
                  </select>
                </div>
              )}

              <button
                onClick={() => {
                  if (confirm(`Delete ${selectedIds.length} selected leads?`)) {
                    onBatchDelete?.(selectedIds);
                    setSelectedIds([]);
                  }
                }}
                className="p-1.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition ml-1"
                title="Delete Selected Leads"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Filter Toolbar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5 pt-1">
          {/* Status Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
              Lead Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/70 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#2EA3E6]"
            >
              {STATUS_OPTIONS.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          {/* Assignee Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
              Assignee
            </label>
            <select
              value={selectedAssignee}
              onChange={(e) => {
                setSelectedAssignee(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/70 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#2EA3E6]"
            >
              <option value="All Assignees">All Assignees</option>
              <option value="Unassigned">👤 Unassigned</option>
              {assignees.map((person) => (
                <option key={person} value={person}>
                  👤 {person}
                </option>
              ))}
            </select>
          </div>

          {/* Source Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
              Source Platform
            </label>
            <select
              value={selectedSource}
              onChange={(e) => {
                setSelectedSource(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/70 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#2EA3E6]"
            >
              {SOURCE_OPTIONS.map((so) => (
                <option key={so} value={so}>
                  {so}
                </option>
              ))}
            </select>
          </div>

          {/* Campaign Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
              Campaign
            </label>
            <select
              value={selectedCampaign}
              onChange={(e) => {
                setSelectedCampaign(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/70 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#2EA3E6] truncate"
            >
              {CAMPAIGN_OPTIONS.map((ca) => (
                <option key={ca} value={ca}>
                  {ca}
                </option>
              ))}
            </select>
          </div>

          {/* Timeframe Presets */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
              Date Range
            </label>
            <div className="flex rounded-xl p-0.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60">
              {(
                [
                  { key: "all", label: "All" },
                  { key: "today", label: "Today" },
                  { key: "7days", label: "7D" },
                  { key: "30days", label: "30D" },
                  { key: "custom", label: "Custom" },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => {
                    setDateFilter(tab.key);
                    setCurrentPage(1);
                  }}
                  className={`flex-1 py-1 text-[11px] font-semibold rounded-lg transition ${
                    dateFilter === tab.key
                      ? "bg-white dark:bg-slate-700 text-[#2EA3E6] shadow-xs"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Custom Date Range Picker (Visible when "Custom" is selected) */}
        {dateFilter === "custom" && (
          <div className="flex flex-wrap items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 animate-in fade-in duration-150">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#2EA3E6]" /> Custom Date Range:
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">From:</span>
              <input
                type="date"
                value={customStartDate}
                onChange={(e) => {
                  setCustomStartDate(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-2.5 py-1 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#2EA3E6]"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">To:</span>
              <input
                type="date"
                value={customEndDate}
                onChange={(e) => {
                  setCustomEndDate(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-2.5 py-1 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#2EA3E6]"
              />
            </div>
            {(customStartDate || customEndDate) && (
              <button
                type="button"
                onClick={() => {
                  setCustomStartDate("");
                  setCustomEndDate("");
                }}
                className="text-xs text-rose-500 hover:underline font-semibold ml-auto"
              >
                Clear Range
              </button>
            )}
          </div>
        )}
      </div>

      {/* Main Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200/80 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-800/40 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 select-none">
              <th className="py-3 px-3 w-10 text-center">
                <button
                  type="button"
                  onClick={handleToggleSelectAll}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {selectedIds.length === paginatedLeads.length && paginatedLeads.length > 0 ? (
                    <CheckSquare className="w-4 h-4 text-[#2EA3E6]" />
                  ) : (
                    <Square className="w-4 h-4" />
                  )}
                </button>
              </th>
              <th className="py-3 px-3 w-40">
                <button
                  onClick={() => {
                    if (sortField === "created_at") {
                      setSortAsc(!sortAsc);
                    } else {
                      setSortField("created_at");
                      setSortAsc(false);
                    }
                  }}
                  className="flex items-center space-x-1 hover:text-slate-800 dark:hover:text-slate-200"
                >
                  <span>Date & Time</span>
                  <ArrowUpDown className="w-3 h-3" />
                </button>
              </th>
              <th className="py-3 px-3 min-w-[150px]">
                <button
                  onClick={() => {
                    if (sortField === "name") {
                      setSortAsc(!sortAsc);
                    } else {
                      setSortField("name");
                      setSortAsc(true);
                    }
                  }}
                  className="flex items-center space-x-1 hover:text-slate-800 dark:hover:text-slate-200"
                >
                  <span>Name</span>
                  <ArrowUpDown className="w-3 h-3" />
                </button>
              </th>
              <th className="py-3 px-3 min-w-[140px]">Phone Number</th>
              <th className="py-3 px-3 min-w-[130px]">Status</th>
              <th className="py-3 px-3 min-w-[140px]">Assignee</th>
              <th className="py-3 px-3 min-w-[110px]">Source</th>
              <th className="py-3 px-3 min-w-[170px]">Campaign</th>
              <th className="py-3 px-3 min-w-[210px]">Message / Inquiry</th>
              <th className="py-3 px-3 text-right w-20">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            {paginatedLeads.length === 0 ? (
              <tr>
                <td colSpan={10} className="py-12 text-center">
                  <div className="max-w-xs mx-auto text-center space-y-2">
                    <p className="font-semibold text-slate-700 dark:text-slate-300">
                      No matching leads found
                    </p>
                    <p className="text-xs text-slate-400">
                      Try adjusting your search criteria or resetting filters.
                    </p>
                    {hasActiveFilters && (
                      <button
                        onClick={handleResetFilters}
                        className="mt-2 text-xs font-semibold px-3 py-1.5 rounded-lg bg-[#2EA3E6]/10 text-[#2EA3E6] hover:bg-[#2EA3E6]/20 transition"
                      >
                        Clear All Filters
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              paginatedLeads.map((lead) => {
                const statusInfo = getStatusBadge(lead.lead_status);
                const sourceInfo = getSourceBadge(lead.source);
                const isSelected = selectedIds.includes(lead.id);
                const cleanPhone = lead.phone.replace(/[^0-9]/g, "");
                const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                  `Hi ${lead.name}, thank you for contacting MillionSpaces! We received your inquiry regarding "${lead.campaign}". How can we help?`
                )}`;

                return (
                  <tr
                    key={lead.id}
                    onClick={() => onSelectLead(lead)}
                    className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group cursor-pointer ${
                      isSelected ? "bg-[#2EA3E6]/5 dark:bg-[#2EA3E6]/10" : ""
                    }`}
                  >
                    {/* Checkbox */}
                    <td
                      className="py-3.5 px-3 text-center"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleSelectOne(lead.id);
                      }}
                    >
                      <button type="button" className="text-slate-400 hover:text-slate-600">
                        {isSelected ? (
                          <CheckSquare className="w-4 h-4 text-[#2EA3E6]" />
                        ) : (
                          <Square className="w-4 h-4" />
                        )}
                      </button>
                    </td>

                    {/* 1. Date & Time */}
                    <td className="py-3.5 px-3 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      {formatDateTime(lead.created_at)}
                    </td>

                    {/* 2. Customer Name */}
                    <td className="py-3.5 px-3 font-semibold text-slate-900 dark:text-white">
                      <div className="flex items-center space-x-2">
                        <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center font-bold text-xs uppercase shrink-0">
                          {lead.name.charAt(0)}
                        </div>
                        <span className="truncate max-w-[140px]">{lead.name}</span>
                      </div>
                    </td>

                    {/* 3. Phone Number with WhatsApp Link */}
                    <td
                      className="py-3.5 px-3 whitespace-nowrap"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Open WhatsApp Web chat"
                        className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 font-medium transition"
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span className="font-mono text-xs">{lead.phone}</span>
                      </a>
                    </td>

                    {/* 4. Lead Status with Dropdown selector */}
                    <td
                      className="py-3.5 px-3 whitespace-nowrap"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="relative inline-block">
                        <select
                          value={lead.lead_status}
                          onChange={(e) =>
                            onStatusChange(lead.id, e.target.value as LeadStatus)
                          }
                          className={`text-xs font-bold px-2.5 py-1 rounded-full border appearance-none pr-6 cursor-pointer focus:outline-none transition ${statusInfo.bg}`}
                        >
                          <option value="New">● New</option>
                          <option value="Contacted">● Contacted</option>
                          <option value="Qualified">● Qualified</option>
                          <option value="Closed">● Closed</option>
                          <option value="Lost">● Lost</option>
                        </select>
                        <span className="absolute right-2 top-2 pointer-events-none text-current text-[10px]">
                          ▼
                        </span>
                      </div>
                    </td>

                    {/* 5. Assignee Dropdown selector */}
                    <td
                      className="py-3.5 px-3 whitespace-nowrap"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="relative inline-block">
                        <select
                          value={lead.assignee || "Unassigned"}
                          onChange={(e) => {
                            const val = e.target.value === "Unassigned" ? "" : e.target.value;
                            onAssigneeChange?.(lead.id, val);
                          }}
                          className={`text-xs font-semibold px-2.5 py-1 rounded-full border appearance-none pr-6 cursor-pointer focus:outline-none transition ${
                            lead.assignee
                              ? "bg-[#2EA3E6]/10 border-[#2EA3E6]/30 text-[#0284C7] dark:text-[#2EA3E6]"
                              : "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400"
                          }`}
                        >
                          <option value="Unassigned">👤 Unassigned</option>
                          {assignees.map((person) => (
                            <option key={person} value={person}>
                              👤 {person}
                            </option>
                          ))}
                        </select>
                        <span className="absolute right-2 top-2 pointer-events-none text-current text-[10px]">
                          ▼
                        </span>
                      </div>
                    </td>

                    {/* 6. Source */}
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <span
                        className={`inline-block text-[11px] font-semibold px-2 py-0.5 rounded-md border ${sourceInfo.badgeBg}`}
                      >
                        {sourceInfo.label}
                      </span>
                    </td>

                    {/* 6. Campaign */}
                    <td className="py-3.5 px-3 text-slate-700 dark:text-slate-300">
                      <div
                        className="truncate max-w-[180px] font-medium"
                        title={lead.campaign}
                      >
                        {lead.campaign}
                      </div>
                    </td>

                    {/* 7. Message Preview */}
                    <td className="py-3.5 px-3 text-slate-600 dark:text-slate-400">
                      <p
                        className="truncate max-w-[220px] text-xs"
                        title={lead.message}
                      >
                        {lead.message}
                      </p>
                    </td>

                    {/* 8. Action view button */}
                    <td
                      className="py-3.5 px-3 text-right whitespace-nowrap"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => onSelectLead(lead)}
                        title="View Full Lead Details"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-[#2EA3E6] hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center space-x-2">
          <span>Rows per page:</span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-[#2EA3E6]"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
          <span className="text-slate-400 pl-2">
            Showing {totalItems > 0 ? startIndex + 1 : 0} -{" "}
            {Math.min(startIndex + pageSize, totalItems)} of {totalItems} leads
          </span>
        </div>

        <div className="flex items-center space-x-1.5">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={validCurrentPage <= 1}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="px-2 font-medium">
            Page {validCurrentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={validCurrentPage >= totalPages}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
