"use client";

import React, { useState, useEffect, useCallback } from "react";
import { TopBar } from "@/components/TopBar";
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
import { CheckCircle, Sparkles, BookOpen, Table, Columns } from "lucide-react";

export default function DashboardPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLiveSupabase, setIsLiveSupabase] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [noticeMessage, setNoticeMessage] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<"table" | "kanban">("table");

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
    // Initial load from cache or Supabase
    setAssignees(getStoredAssignees());
    loadAssignees();

    // Subscribe to real-time changes on team_assignees
    const assigneesChannel = subscribeToAssigneesChanges(() => {
      loadAssignees();
    });

    return () => {
      if (assigneesChannel && supabase) {
        supabase.removeChannel(assigneesChannel);
      }
    };
  }, [loadAssignees]);

  // Assignee Management Handlers
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

  // Handle single lead assignee change
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

  // Handle batch assignee change
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

  // Load leads from Supabase or fallback
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

    // Subscribe to Supabase real-time updates if connected
    const channel = subscribeToLeadsChanges(() => {
      loadLeads();
    });

    return () => {
      if (channel && supabase) {
        supabase.removeChannel(channel);
      }
    };
  }, [loadLeads]);

  // Handle inline or modal status change
  const handleStatusChange = async (id: string, newStatus: LeadStatus) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === id ? { ...l, lead_status: newStatus } : l))
    );
    if (selectedLead && selectedLead.id === id) {
      setSelectedLead((prev) => (prev ? { ...prev, lead_status: newStatus } : null));
    }
    await updateLeadStatus(id, newStatus);
  };

  // Handle batch status change
  const handleBatchStatusChange = async (ids: string[], newStatus: LeadStatus) => {
    setLeads((prev) =>
      prev.map((l) => (ids.includes(l.id) ? { ...l, lead_status: newStatus } : l))
    );
    await batchUpdateLeadStatus(ids, newStatus);
    setNoticeMessage(`Updated ${ids.length} leads to ${newStatus}`);
    setTimeout(() => setNoticeMessage(null), 3000);
  };

  // Handle batch delete
  const handleBatchDelete = async (ids: string[]) => {
    setLeads((prev) => prev.filter((l) => !ids.includes(l.id)));
    await batchDeleteLeads(ids);
    setNoticeMessage(`Deleted ${ids.length} leads`);
    setTimeout(() => setNoticeMessage(null), 3000);
  };

  // Handle notes update
  const handleSaveNotes = async (id: string, notes: string) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === id ? { ...l, notes } : l))
    );
    if (selectedLead && selectedLead.id === id) {
      setSelectedLead((prev) => (prev ? { ...prev, notes } : null));
    }
    await updateLeadNotes(id, notes);
  };

  // Handle lead creation
  const handleCreateLead = async (leadData: Omit<Lead, "id" | "created_at">) => {
    const created = await createNewLead(leadData);
    setLeads((prev) => [created, ...prev]);
    setNoticeMessage(`New lead "${created.name}" created!`);
    setTimeout(() => setNoticeMessage(null), 3000);
  };

  // Handle lead deletion
  const handleDeleteLead = async (id: string) => {
    setLeads((prev) => prev.filter((l) => l.id !== id));
    await deleteLeadRecord(id);
    setSelectedLead(null);
    setNoticeMessage("Lead record removed.");
    setTimeout(() => setNoticeMessage(null), 3000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/60 dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Top Header */}
      <TopBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onRefresh={() => loadLeads(true)}
        isRefreshing={isRefreshing}
        isLiveSupabase={isLiveSupabase}
        onOpenNewLead={() => setIsNewLeadOpen(true)}
        onOpenWebhookTester={() => setIsWebhookTesterOpen(true)}
        onOpenSetupGuide={() => setIsSetupGuideOpen(true)}
        onOpenManageAssignees={() => setIsManageAssigneesOpen(true)}
        assigneesCount={assignees.length}
        totalLeadsCount={leads.length}
      />

      {/* Main Dashboard Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Notice toast banner */}
        {noticeMessage && (
          <div className="p-3.5 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xl flex items-center justify-between text-xs font-semibold animate-in fade-in slide-in-from-top-2">
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

        {/* Status Mode Banner */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${isLiveSupabase ? "bg-emerald-500 animate-pulse" : "bg-[#2EA3E6]"}`} />
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>MillionSpaces Campaign Lead Stream</span>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#FF2E63]/10 text-[#FF2E63]">
                  Meta WhatsApp API
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {isLiveSupabase
                  ? "Connected to live Supabase database (public.meta_whatsapp_leads). Inbound leads sync automatically with real-time updates."
                  : "Running in interactive demo state with preloaded venue inquiries. Changes persist to local storage. Connect Supabase keys in .env.local anytime."}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={() => setIsSetupGuideOpen(true)}
              className="px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition flex items-center space-x-1"
            >
              <BookOpen className="w-3.5 h-3.5 text-slate-400" />
              <span>Setup Guide</span>
            </button>

            <button
              onClick={() => setIsWebhookTesterOpen(true)}
              className="px-3.5 py-1.5 text-xs font-bold rounded-xl bg-[#2EA3E6]/10 hover:bg-[#2EA3E6]/20 text-[#0284C7] dark:text-[#2EA3E6] border border-[#2EA3E6]/30 flex items-center space-x-1.5 transition"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Simulate Webhook</span>
            </button>
          </div>
        </div>

        {/* 1. KPI Summary Metrics */}
        <KpiSummaryRow leads={leads} />

        {/* 2. Visual Analytics & Recharts */}
        <AnalyticsCharts leads={leads} />

        {/* 3. View Switcher & Centralized Inbound Leads */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex rounded-full p-1 bg-slate-100 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 shadow-xs">
              <button
                type="button"
                onClick={() => setActiveView("table")}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-full transition flex items-center space-x-1.5 ${
                  activeView === "table"
                    ? "bg-white dark:bg-slate-700 text-[#0284C7] dark:text-[#2EA3E6] shadow-xs"
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <Table className="w-3.5 h-3.5" />
                <span>Table View</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveView("kanban")}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-full transition flex items-center space-x-1.5 ${
                  activeView === "kanban"
                    ? "bg-white dark:bg-slate-700 text-[#0284C7] dark:text-[#2EA3E6] shadow-xs"
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <Columns className="w-3.5 h-3.5" />
                <span>Pipeline Kanban</span>
              </button>
            </div>

            <span className="text-xs text-slate-400 font-medium">
              Showing {leads.length} total inquiries
            </span>
          </div>

          {activeView === "table" ? (
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
          ) : (
            <LeadsKanban
              leads={leads}
              onSelectLead={(lead) => setSelectedLead(lead)}
              onStatusChange={handleStatusChange}
              assignees={assignees}
              onAssigneeChange={handleAssigneeChange}
            />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-200/80 dark:border-slate-800/80 py-4 mt-12 bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-700 dark:text-slate-300">
              MillionSpaces Leads Hub
            </span>
            <span>•</span>
            <span>Click-to-WhatsApp Meta Ads Management</span>
          </div>
          <div className="flex items-center space-x-4">
            <span>Webhook: <code className="text-[#2EA3E6] font-mono">/api/meta-webhook</code></span>
            <span>Admin: <span className="font-semibold text-slate-700 dark:text-slate-300">adminsl@millionspaces.com</span></span>
          </div>
        </div>
      </footer>

      {/* Detail Drawer / Modal */}
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

      {/* New Manual Lead Modal */}
      <NewLeadModal
        isOpen={isNewLeadOpen}
        onClose={() => setIsNewLeadOpen(false)}
        onSubmit={handleCreateLead}
        assignees={assignees}
      />

      {/* Meta Webhook Simulator Modal */}
      <MetaWebhookTesterModal
        isOpen={isWebhookTesterOpen}
        onClose={() => setIsWebhookTesterOpen(false)}
        onLeadAdded={() => loadLeads(true)}
      />

      {/* Setup Guide Modal */}
      <SetupGuideModal
        isOpen={isSetupGuideOpen}
        onClose={() => setIsSetupGuideOpen(false)}
      />

      {/* Manage Assignees Modal */}
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
