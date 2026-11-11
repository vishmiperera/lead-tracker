"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Sidebar } from "@/components/Sidebar";
import { SideInsightsPanel } from "@/components/SideInsightsPanel";
import { DashboardTopFilterBar } from "@/components/DashboardTopFilterBar";
import { LeadTicketStream } from "@/components/LeadTicketStream";
import { KpiSummaryRow } from "@/components/KpiSummaryRow";
import { AnalyticsCharts } from "@/components/AnalyticsCharts";
import { LeadsTable } from "@/components/LeadsTable";
import { LeadsKanban } from "@/components/LeadsKanban";
import { LeadDetailModal } from "@/components/LeadDetailModal";
import { NewLeadModal } from "@/components/NewLeadModal";
import { MetaWebhookTesterModal } from "@/components/MetaWebhookTesterModal";
import { SetupGuideModal } from "@/components/SetupGuideModal";
import { ManageAssigneesModal } from "@/components/ManageAssigneesModal";
import {
  fetchAllLeads,
  updateLeadStatus,
  updateLeadNotes,
  createNewLead,
  deleteLeadRecord,
  batchUpdateLeadStatus,
  batchDeleteLeads,
  updateLeadAssignee,
  batchUpdateLeadAssignee,
  subscribeToLeadsChanges,
  supabase,
} from "@/lib/supabase";
import {
  getStoredAssignees,
  saveStoredAssignees,
  fetchAllAssignees,
  createAssigneeRecord,
  updateAssigneeRecord,
  deleteAssigneeRecord,
  subscribeToAssigneesChanges,
} from "@/lib/assignees";
import { Lead, LeadStatus } from "@/types";
import {
  CheckCircle,
  Sparkles,
  BookOpen,
  LayoutGrid,
  Table,
  SlidersHorizontal,
  Download,
} from "lucide-react";

export default function DashboardPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLiveSupabase, setIsLiveSupabase] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [noticeMessage, setNoticeMessage] = useState<string | null>(null);

  // Active navigation tab ("overview" | "leads" | "kanban" | "analytics")
  const [activeNavTab, setActiveNavTab] = useState<"overview" | "leads" | "kanban" | "analytics">("overview");

  // In overview: toggle between reference "cards" stream and dense "table"
  const [overviewViewMode, setOverviewViewMode] = useState<"cards" | "table">("cards");

  // Filters state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [selectedAssignee, setSelectedAssignee] = useState("All Assignees");
  const [dateFilter, setDateFilter] = useState<"all" | "today" | "7days" | "30days" | "custom">("all");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");

  // Modals state
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isNewLeadOpen, setIsNewLeadOpen] = useState(false);
  const [isWebhookTesterOpen, setIsWebhookTesterOpen] = useState(false);
  const [isSetupGuideOpen, setIsSetupGuideOpen] = useState(false);
  const [isManageAssigneesOpen, setIsManageAssigneesOpen] = useState(false);

  // Assignees state
  const [assignees, setAssignees] = useState<string[]>([]);

  const loadAssignees = useCallback(async () => {
    try {
      const result = await fetchAllAssignees();
      if (result.assignees.length > 0) {
        setAssignees(result.assignees);
      }
    } catch (err) {
      console.warn("Error fetching assignees:", err);
    }
  }, []);

  useEffect(() => {
    setAssignees(getStoredAssignees());
    loadAssignees();

    const assigneesChannel = subscribeToAssigneesChanges(() => {
      loadAssignees();
    });

    return () => {
      if (assigneesChannel && supabase) {
        supabase.removeChannel(assigneesChannel);
      }
    };
  }, [loadAssignees]);

  // Assignee Handlers
  const handleAddAssignee = async (name: string) => {
    const updated = [...assignees, name];
    setAssignees(updated);
    await createAssigneeRecord(name);
    setNoticeMessage(`Added team member "${name}" to Supabase`);
    setTimeout(() => setNoticeMessage(null), 3000);
  };

  const handleUpdateAssignee = async (oldName: string, newName: string) => {
    const updated = assignees.map((a) => (a === oldName ? newName : a));
    setAssignees(updated);
    setLeads((prev) =>
      prev.map((l) => (l.assignee === oldName ? { ...l, assignee: newName } : l))
    );
    await updateAssigneeRecord(oldName, newName);
    setNoticeMessage(`Updated team member "${newName}" in Supabase`);
    setTimeout(() => setNoticeMessage(null), 3000);
  };

  const handleDeleteAssignee = async (name: string) => {
    const updated = assignees.filter((a) => a !== name);
    setAssignees(updated);
    setLeads((prev) =>
      prev.map((l) => (l.assignee === name ? { ...l, assignee: undefined } : l))
    );
    await deleteAssigneeRecord(name);
    setNoticeMessage(`Removed team member "${name}" from Supabase`);
    setTimeout(() => setNoticeMessage(null), 3000);
  };

  // Lead Assignee change
  const handleAssigneeChange = async (id: string, newAssignee: string) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === id ? { ...l, assignee: newAssignee || undefined } : l))
    );
    if (selectedLead && selectedLead.id === id) {
      setSelectedLead((prev) =>
        prev ? { ...prev, assignee: newAssignee || undefined } : null
      );
    }
    await updateLeadAssignee(id, newAssignee);
    setNoticeMessage(
      newAssignee ? `Lead assigned to ${newAssignee}` : "Lead unassigned"
    );
    setTimeout(() => setNoticeMessage(null), 2500);
  };

  const handleBatchAssign = async (ids: string[], newAssignee: string) => {
    setLeads((prev) =>
      prev.map((l) =>
        ids.includes(l.id) ? { ...l, assignee: newAssignee || undefined } : l
      )
    );
    await batchUpdateLeadAssignee(ids, newAssignee);
    setNoticeMessage(
      newAssignee
        ? `Assigned ${ids.length} leads to ${newAssignee}`
        : `Unassigned ${ids.length} leads`
    );
    setTimeout(() => setNoticeMessage(null), 3000);
  };

  // Load leads
  const loadLeads = useCallback(async (showToast = false) => {
    setIsRefreshing(true);
    try {
      const result = await fetchAllLeads();
      setLeads(result.leads);
      setIsLiveSupabase(result.isLive);

      if (showToast) {
        setNoticeMessage(
          result.isLive
            ? "Synced leads with Supabase database"
            : "Refreshed local lead workspace"
        );
        setTimeout(() => setNoticeMessage(null), 3000);
      }
    } catch (err) {
      console.error("Error loading leads:", err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadLeads();

    const channel = subscribeToLeadsChanges(() => {
      loadLeads();
    });

    return () => {
      if (channel && supabase) {
        supabase.removeChannel(channel);
      }
    };
  }, [loadLeads]);

  // Lead status changes
  const handleStatusChange = async (id: string, newStatus: LeadStatus) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === id ? { ...l, lead_status: newStatus } : l))
    );
    if (selectedLead && selectedLead.id === id) {
      setSelectedLead((prev) => (prev ? { ...prev, lead_status: newStatus } : null));
    }
    await updateLeadStatus(id, newStatus);
  };

  const handleBatchStatusChange = async (ids: string[], newStatus: LeadStatus) => {
    setLeads((prev) =>
      prev.map((l) => (ids.includes(l.id) ? { ...l, lead_status: newStatus } : l))
    );
    await batchUpdateLeadStatus(ids, newStatus);
    setNoticeMessage(`Updated ${ids.length} leads to ${newStatus}`);
    setTimeout(() => setNoticeMessage(null), 3000);
  };

  const handleBatchDelete = async (ids: string[]) => {
    setLeads((prev) => prev.filter((l) => !ids.includes(l.id)));
    await batchDeleteLeads(ids);
    setNoticeMessage(`Deleted ${ids.length} leads`);
    setTimeout(() => setNoticeMessage(null), 3000);
  };

  const handleSaveNotes = async (id: string, notes: string) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === id ? { ...l, notes } : l))
    );
    if (selectedLead && selectedLead.id === id) {
      setSelectedLead((prev) => (prev ? { ...prev, notes } : null));
    }
    await updateLeadNotes(id, notes);
  };

  const handleCreateLead = async (leadData: Omit<Lead, "id" | "created_at">) => {
    const created = await createNewLead(leadData);
    setLeads((prev) => [created, ...prev]);
    setNoticeMessage(`New lead "${created.name}" created!`);
    setTimeout(() => setNoticeMessage(null), 3000);
  };

  const handleDeleteLead = async (id: string) => {
    setLeads((prev) => prev.filter((l) => l.id !== id));
    await deleteLeadRecord(id);
    setSelectedLead(null);
    setNoticeMessage("Lead record removed.");
    setTimeout(() => setNoticeMessage(null), 3000);
  };

  // Filtered leads computation
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const mName = lead.name?.toLowerCase().includes(q);
        const mPhone = lead.phone?.toLowerCase().includes(q);
        const mCamp = lead.campaign?.toLowerCase().includes(q);
        const mMsg = lead.message?.toLowerCase().includes(q);
        const mAss = (lead.assignee || "").toLowerCase().includes(q);
        if (!mName && !mPhone && !mCamp && !mMsg && !mAss) return false;
      }

      // 2. Status
      if (selectedStatus !== "All Statuses" && lead.lead_status !== selectedStatus) {
        return false;
      }

      // 3. Assignee
      if (selectedAssignee !== "All Assignees") {
        if (selectedAssignee === "Unassigned") {
          if (lead.assignee && lead.assignee.trim()) return false;
        } else if (lead.assignee !== selectedAssignee) {
          return false;
        }
      }

      // 4. Date Range
      if (dateFilter !== "all") {
        const leadDate = new Date(lead.created_at).getTime();
        const now = Date.now();
        if (dateFilter === "today") {
          const todayStart = new Date().setHours(0, 0, 0, 0);
          if (leadDate < todayStart) return false;
        } else if (dateFilter === "7days") {
          if (leadDate < now - 7 * 24 * 60 * 60 * 1000) return false;
        } else if (dateFilter === "30days") {
          if (leadDate < now - 30 * 24 * 60 * 60 * 1000) return false;
        } else if (dateFilter === "custom") {
          if (customStartDate) {
            const start = new Date(customStartDate).setHours(0, 0, 0, 0);
            if (leadDate < start) return false;
          }
          if (customEndDate) {
            const end = new Date(customEndDate).setHours(23, 59, 59, 999);
            if (leadDate > end) return false;
          }
        }
      }

      return true;
    });
  }, [
    leads,
    searchQuery,
    selectedStatus,
    selectedAssignee,
    dateFilter,
    customStartDate,
    customEndDate,
  ]);

  // Export CSV handler
  const handleExportCSV = () => {
    if (filteredLeads.length === 0) return;
    const headers = ["ID", "Name", "Phone", "Status", "Assignee", "Source", "Campaign", "Message", "Created At"];
    const rows = filteredLeads.map((l) => [
      `"${l.id}"`,
      `"${(l.name || "").replace(/"/g, '""')}"`,
      `"${l.phone}"`,
      `"${l.lead_status}"`,
      `"${(l.assignee || "").replace(/"/g, '""')}"`,
      `"${l.source}"`,
      `"${(l.campaign || "").replace(/"/g, '""')}"`,
      `"${(l.message || "").replace(/"/g, '""')}"`,
      `"${l.created_at}"`,
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `millionspaces-leads-${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#D6E2E9] dark:bg-[#070D12] text-slate-900 dark:text-slate-100 p-2 sm:p-4 lg:p-6 flex items-center justify-center font-sans antialiased transition-colors duration-200">
      {/* Master Framed Application Shell (Matching reference rounded card frame) */}
      <div className="w-full max-w-[1600px] min-h-[92vh] bg-[#F4F8FA] dark:bg-[#0B141B] rounded-[24px] sm:rounded-[36px] shadow-2xl border border-white/60 dark:border-slate-800/80 flex flex-col lg:flex-row overflow-hidden transition-all duration-300">
        
        {/* Left Dark Slate Sidebar (Pinned on left on desktop, collapses cleanly on mobile) */}
        <Sidebar
          activeTab={activeNavTab}
          onTabChange={setActiveNavTab}
          onOpenNewLead={() => setIsNewLeadOpen(true)}
          onOpenManageAssignees={() => setIsManageAssigneesOpen(true)}
          onOpenWebhookTester={() => setIsWebhookTesterOpen(true)}
          onOpenSetupGuide={() => setIsSetupGuideOpen(true)}
          assignees={assignees}
          totalLeadsCount={leads.length}
          isLiveSupabase={isLiveSupabase}
        />

        {/* Right Main Canvas Content Area */}
        <div className="flex-1 min-w-0 flex flex-col overflow-y-auto max-h-none lg:max-h-[92vh] p-4 sm:p-6 lg:p-8 space-y-6">
          
          {/* Notification Toast Banner */}
          {noticeMessage && (
            <div className="p-3.5 rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xl flex items-center justify-between text-xs font-bold animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-[#2EA3E6]" />
                <span>{noticeMessage}</span>
              </div>
              <button
                onClick={() => setNoticeMessage(null)}
                className="text-xs opacity-70 hover:opacity-100"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Top Search & Filter Bar (Matching Reference Two-Tier Pill Controls) */}
          <DashboardTopFilterBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedStatus={selectedStatus}
            onStatusChange={setSelectedStatus}
            dateFilter={dateFilter}
            onDateFilterChange={setDateFilter}
            customStartDate={customStartDate}
            onCustomStartDateChange={setCustomStartDate}
            customEndDate={customEndDate}
            onCustomEndDateChange={setCustomEndDate}
            selectedAssignee={selectedAssignee}
            onAssigneeChange={setSelectedAssignee}
            assignees={assignees}
            onOpenNewLead={() => setIsNewLeadOpen(true)}
            onOpenWebhookTester={() => setIsWebhookTesterOpen(true)}
            onOpenSetupGuide={() => setIsSetupGuideOpen(true)}
            onRefresh={() => loadLeads(true)}
            isRefreshing={isRefreshing}
            isLiveSupabase={isLiveSupabase}
            totalLeadsCount={leads.length}
          />

          {/* MAIN TAB 1: OVERVIEW DASHBOARD */}
          {activeNavTab === "overview" && (
            <div className="space-y-6">
              {/* Reference KPI Summary Row */}
              <KpiSummaryRow leads={leads} />

              {/* Reference Results Header: [RESULT (25)] with Right Pill Buttons */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center space-x-3">
                  <h3 className="text-base sm:text-lg font-black tracking-wider text-slate-900 dark:text-white uppercase">
                    RESULT ({filteredLeads.length})
                  </h3>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#2EA3E6]/10 text-[#0284C7] dark:text-[#2EA3E6] font-bold">
                    Meta ➔ WhatsApp
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  {/* Cards vs Table view toggle */}
                  <div className="flex rounded-full p-1 bg-white dark:bg-[#121E27] border border-slate-200/80 dark:border-slate-800 shadow-xs">
                    <button
                      type="button"
                      onClick={() => setOverviewViewMode("cards")}
                      className={`px-3 py-1 text-xs font-black rounded-full transition flex items-center space-x-1.5 ${
                        overviewViewMode === "cards"
                          ? "bg-[#14232C] text-white dark:bg-white dark:text-[#14232C] shadow-xs"
                          : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                      }`}
                      title="Ticket Cards Stream (Reference Style)"
                    >
                      <LayoutGrid className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Cards</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setOverviewViewMode("table")}
                      className={`px-3 py-1 text-xs font-black rounded-full transition flex items-center space-x-1.5 ${
                        overviewViewMode === "table"
                          ? "bg-[#14232C] text-white dark:bg-white dark:text-[#14232C] shadow-xs"
                          : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                      }`}
                      title="Spreadsheet Table View"
                    >
                      <Table className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Table</span>
                    </button>
                  </div>

                  {/* CSV Export Button */}
                  <button
                    onClick={handleExportCSV}
                    className="p-2 sm:px-3 sm:py-1 text-xs font-bold rounded-full bg-white dark:bg-[#121E27] hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-200 shadow-xs flex items-center space-x-1 transition"
                    title="Export Filtered Leads to CSV"
                  >
                    <Download className="w-3.5 h-3.5 text-slate-500" />
                    <span className="hidden sm:inline">Export</span>
                  </button>
                </div>
              </div>

              {/* 2-Column Split (Matching Reference: Left 8-cols Tickets, Right 4-cols Dark Map Card) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left: Leads Ticket Stream / Table (8 cols on desktop) */}
                <div className="lg:col-span-8 min-w-0 space-y-4">
                  {overviewViewMode === "cards" ? (
                    <LeadTicketStream
                      leads={filteredLeads}
                      onSelectLead={(l) => setSelectedLead(l)}
                      onStatusChange={handleStatusChange}
                      assignees={assignees}
                      onAssigneeChange={handleAssigneeChange}
                    />
                  ) : (
                    <div className="bg-white dark:bg-[#121E27] rounded-3xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm">
                      <LeadsTable
                        leads={leads}
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                        onStatusChange={handleStatusChange}
                        onSelectLead={(lead) => setSelectedLead(lead)}
                        onBatchStatusChange={handleBatchStatusChange}
                        onBatchDelete={handleBatchDelete}
                        assignees={assignees}
                        onAssigneeChange={handleAssigneeChange}
                        onBatchAssign={handleBatchAssign}
                      />
                    </div>
                  )}
                </div>

                {/* Right: Dark Side Insights Panel (4 cols on desktop) */}
                <div className="lg:col-span-4 min-w-0 space-y-4">
                  <SideInsightsPanel
                    leads={leads}
                    onOpenWebhookTester={() => setIsWebhookTesterOpen(true)}
                    onFilterStatus={(st) => setSelectedStatus(st)}
                    activeFilter={selectedStatus}
                  />
                </div>
              </div>
            </div>
          )}

          {/* MAIN TAB 2: INBOUND LEADS (Full Width Comprehensive Table View) */}
          {activeNavTab === "leads" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-wider">
                    All Inbound Inquiries
                  </h3>
                  <p className="text-xs text-slate-400">
                    Comprehensive lead management with batch updates, assignees, custom date ranges, and CSV export.
                  </p>
                </div>
              </div>

              <LeadsTable
                leads={leads}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                onStatusChange={handleStatusChange}
                onSelectLead={(lead) => setSelectedLead(lead)}
                onBatchStatusChange={handleBatchStatusChange}
                onBatchDelete={handleBatchDelete}
                assignees={assignees}
                onAssigneeChange={handleAssigneeChange}
                onBatchAssign={handleBatchAssign}
              />
            </div>
          )}

          {/* MAIN TAB 3: PIPELINE KANBAN */}
          {activeNavTab === "kanban" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-wider">
                    Pipeline Kanban Stages
                  </h3>
                  <p className="text-xs text-slate-400">
                    Track sales velocity from initial Click-to-WhatsApp message to qualified booking.
                  </p>
                </div>
              </div>

              <LeadsKanban
                leads={filteredLeads}
                onSelectLead={(lead) => setSelectedLead(lead)}
                onStatusChange={handleStatusChange}
                assignees={assignees}
                onAssigneeChange={handleAssigneeChange}
              />
            </div>
          )}

          {/* MAIN TAB 4: ANALYTICS & CHARTS */}
          {activeNavTab === "analytics" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-wider">
                  Conversion & Campaign Analytics
                </h3>
                <p className="text-xs text-slate-400">
                  Performance metrics across Facebook, Instagram ads, and WhatsApp response times.
                </p>
              </div>

              <KpiSummaryRow leads={leads} />
              <AnalyticsCharts leads={leads} />
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <LeadDetailModal
        lead={selectedLead}
        isOpen={Boolean(selectedLead)}
        onClose={() => setSelectedLead(null)}
        onStatusChange={handleStatusChange}
        onSaveNotes={handleSaveNotes}
        onDeleteLead={handleDeleteLead}
        assignees={assignees}
        onAssigneeChange={handleAssigneeChange}
      />

      <NewLeadModal
        isOpen={isNewLeadOpen}
        onClose={() => setIsNewLeadOpen(false)}
        onSubmit={handleCreateLead}
        assignees={assignees}
      />

      <MetaWebhookTesterModal
        isOpen={isWebhookTesterOpen}
        onClose={() => setIsWebhookTesterOpen(false)}
        onLeadAdded={() => loadLeads(true)}
      />

      <SetupGuideModal
        isOpen={isSetupGuideOpen}
        onClose={() => setIsSetupGuideOpen(false)}
      />

      <ManageAssigneesModal
        isOpen={isManageAssigneesOpen}
        onClose={() => setIsManageAssigneesOpen(false)}
        assignees={assignees}
        leads={leads}
        onAddAssignee={handleAddAssignee}
        onUpdateAssignee={handleUpdateAssignee}
        onDeleteAssignee={handleDeleteAssignee}
      />
    </div>
  );
}
