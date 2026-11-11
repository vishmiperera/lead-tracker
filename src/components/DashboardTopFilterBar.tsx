"use client";

import React, { useState } from "react";
import {
  Search,
  Calendar,
  User,
  RotateCw,
  Plus,
  Sparkles,
  BookOpen,
  Filter,
  Check,
  ChevronDown,
  X,
  Database,
} from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

interface DashboardTopFilterBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  dateFilter: "all" | "today" | "7days" | "30days" | "custom";
  onDateFilterChange: (df: "all" | "today" | "7days" | "30days" | "custom") => void;
  customStartDate: string;
  onCustomStartDateChange: (date: string) => void;
  customEndDate: string;
  onCustomEndDateChange: (date: string) => void;
  selectedAssignee: string;
  onAssigneeChange: (assignee: string) => void;
  assignees: string[];
  onOpenNewLead: () => void;
  onOpenWebhookTester: () => void;
  onOpenSetupGuide: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  isLiveSupabase: boolean;
  totalLeadsCount: number;
}

export function DashboardTopFilterBar({
  searchQuery,
  onSearchChange,
  selectedStatus,
  onStatusChange,
  dateFilter,
  onDateFilterChange,
  customStartDate,
  onCustomStartDateChange,
  customEndDate,
  onCustomEndDateChange,
  selectedAssignee,
  onAssigneeChange,
  assignees,
  onOpenNewLead,
  onOpenWebhookTester,
  onOpenSetupGuide,
  onRefresh,
  isRefreshing,
  isLiveSupabase,
  totalLeadsCount,
}: DashboardTopFilterBarProps) {
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const statusOptions = ["All Statuses", "New", "Contacted", "Qualified", "Closed"];

  const getDateLabel = () => {
    switch (dateFilter) {
      case "today":
        return "Today";
      case "7days":
        return "Last 7 Days";
      case "30days":
        return "Last 30 Days";
      case "custom":
        if (customStartDate && customEndDate) {
          return `${customStartDate} → ${customEndDate}`;
        }
        return "Custom Range";
      default:
        return "All Dates";
    }
  };

  return (
    <div className="bg-white dark:bg-[#121E27] rounded-3xl p-4 sm:p-5 shadow-xs border border-slate-200/70 dark:border-slate-800 space-y-3.5">
      {/* Tier 1: Pill Input Fields (Matching reference: [New York (JFK) ⇄ Mumbai (BOM)] [29 July 2019] [2 Traveller]) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5">
        {/* Search Pill (md:col-span-6) */}
        <div className="md:col-span-6 relative flex items-center">
          <div className="w-full flex items-center bg-[#F4F8FA] dark:bg-[#0C171E] rounded-full px-4 py-2.5 border border-slate-200/60 dark:border-slate-800 focus-within:border-[#2EA3E6] focus-within:ring-2 focus-within:ring-[#2EA3E6]/20 transition">
            <Search className="w-4 h-4 text-slate-400 shrink-0 mr-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by name, phone, message, campaign, or assignee..."
              className="w-full bg-transparent text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange("")}
                className="text-slate-400 hover:text-slate-600 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Date Range Pill (md:col-span-3) */}
        <div className="md:col-span-3 relative">
          <div className="flex items-center justify-between bg-[#F4F8FA] dark:bg-[#0C171E] rounded-full px-4 py-2.5 border border-slate-200/60 dark:border-slate-800">
            <div className="flex items-center space-x-2 text-xs truncate">
              <Calendar className="w-4 h-4 text-[#2EA3E6] shrink-0" />
              <select
                value={dateFilter}
                onChange={(e) => {
                  const val = e.target.value as any;
                  onDateFilterChange(val);
                  if (val === "custom") {
                    setIsDatePickerOpen(true);
                  } else {
                    setIsDatePickerOpen(false);
                  }
                }}
                className="bg-transparent text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer focus:outline-none appearance-none pr-4 truncate"
              >
                <option value="all">📅 All Dates</option>
                <option value="today">📅 Today</option>
                <option value="7days">📅 Last 7 Days</option>
                <option value="30days">📅 Last 30 Days</option>
                <option value="custom">📅 Custom Range (Oct-Nov)</option>
              </select>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Assignee Pill (md:col-span-3) */}
        <div className="md:col-span-3 relative">
          <div className="flex items-center justify-between bg-[#F4F8FA] dark:bg-[#0C171E] rounded-full px-4 py-2.5 border border-slate-200/60 dark:border-slate-800">
            <div className="flex items-center space-x-2 text-xs truncate">
              <User className="w-4 h-4 text-[#2EA3E6] shrink-0" />
              <select
                value={selectedAssignee}
                onChange={(e) => onAssigneeChange(e.target.value)}
                className="bg-transparent text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer focus:outline-none appearance-none pr-4 truncate"
              >
                <option value="All Assignees">👤 All Assignees</option>
                <option value="Unassigned">👤 Unassigned Only</option>
                {assignees.map((a) => (
                  <option key={a} value={a}>
                    👤 {a}
                  </option>
                ))}
              </select>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Custom Date Range Picker Sub-Bar (Appears when 'custom' is active) */}
      {dateFilter === "custom" && (
        <div className="flex flex-wrap items-center gap-2.5 p-3 rounded-2xl bg-[#F4F8FA] dark:bg-[#0C171E] border border-slate-200/80 dark:border-slate-800 animate-in fade-in duration-150">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#2EA3E6]" /> Custom Date Range:
          </span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">From:</span>
            <input
              type="date"
              value={customStartDate}
              onChange={(e) => onCustomStartDateChange(e.target.value)}
              className="px-2.5 py-1 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#2EA3E6]"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">To:</span>
            <input
              type="date"
              value={customEndDate}
              onChange={(e) => onCustomEndDateChange(e.target.value)}
              className="px-2.5 py-1 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#2EA3E6]"
            />
          </div>
          {(customStartDate || customEndDate) && (
            <button
              type="button"
              onClick={() => {
                onCustomStartDateChange("");
                onCustomEndDateChange("");
                onDateFilterChange("all");
              }}
              className="text-xs text-rose-500 hover:underline font-bold ml-auto"
            >
              Clear Custom Range
            </button>
          )}
        </div>
      )}

      {/* Tier 2: Status Filter Pills + Action Buttons (Matching reference: [ONE WAY] [ROUND TRIP] [MULTI CITY] ... [SEARCH]) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        {/* Status Pills */}
        <div className="flex items-center flex-wrap gap-1.5">
          {statusOptions.map((st) => {
            const isAll = st === "All Statuses";
            const isSelected = selectedStatus === st;
            const label = isAll ? "ALL LEADS" : st.toUpperCase();

            return (
              <button
                key={st}
                onClick={() => onStatusChange(st)}
                className={`px-4 py-1.5 rounded-full text-xs font-black tracking-wide transition-all duration-150 ${
                  isSelected
                    ? "bg-[#14232C] dark:bg-white text-white dark:text-[#14232C] shadow-sm scale-105"
                    : "bg-[#F4F8FA] dark:bg-[#0C171E] text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-800"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center space-x-2 shrink-0">
          {/* Refresh sync button */}
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="p-2 rounded-full bg-[#F4F8FA] dark:bg-[#0C171E] text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-800 transition"
            title="Refresh Leads from Supabase"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-[#2EA3E6]" : ""}`} />
          </button>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* New Lead Button */}
          <button
            onClick={onOpenNewLead}
            className="px-4 py-1.5 rounded-full bg-[#FF2E63] hover:bg-[#e02654] active:scale-95 text-white font-black text-xs tracking-wider flex items-center space-x-1.5 shadow-md shadow-[#FF2E63]/25 transition"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>NEW LEAD</span>
          </button>
        </div>
      </div>
    </div>
  );
}
