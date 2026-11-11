"use client";

import React from "react";
import {
  LayoutDashboard,
  MessageSquare,
  Columns,
  BarChart3,
  Users,
  Settings,
  Sparkles,
  BookOpen,
  Radio,
  Plus,
  Building2,
  ExternalLink,
} from "lucide-react";

interface SidebarProps {
  activeTab: "overview" | "leads" | "kanban" | "analytics";
  onTabChange: (tab: "overview" | "leads" | "kanban" | "analytics") => void;
  onOpenNewLead: () => void;
  onOpenManageAssignees: () => void;
  onOpenWebhookTester: () => void;
  onOpenSetupGuide: () => void;
  assignees: string[];
  totalLeadsCount: number;
  isLiveSupabase: boolean;
}

export function Sidebar({
  activeTab,
  onTabChange,
  onOpenNewLead,
  onOpenManageAssignees,
  onOpenWebhookTester,
  onOpenSetupGuide,
  assignees,
  totalLeadsCount,
  isLiveSupabase,
}: SidebarProps) {
  const navItems = [
    {
      id: "overview" as const,
      label: "DASHBOARD",
      icon: LayoutDashboard,
    },
    {
      id: "leads" as const,
      label: "INBOUND LEADS",
      icon: MessageSquare,
      badge: totalLeadsCount > 0 ? totalLeadsCount : undefined,
    },
    {
      id: "kanban" as const,
      label: "PIPELINE KANBAN",
      icon: Columns,
    },
    {
      id: "analytics" as const,
      label: "ANALYTICS",
      icon: BarChart3,
    },
  ];

  return (
    <aside className="w-full lg:w-64 xl:w-72 bg-[#14232C] text-white flex flex-col justify-between shrink-0 p-5 lg:p-6 select-none border-b lg:border-b-0 lg:border-r border-slate-800">
      {/* Top Profile & Brand Module */}
      <div className="space-y-6">
        {/* Profile Card (matching reference style: centered round avatar + name + email) */}
        <div className="flex flex-col items-center text-center space-y-2.5 pt-2">
          <div className="relative">
            <div className="w-16 h-16 rounded-full p-1 ring-2 ring-[#2EA3E6]/60 bg-gradient-to-tr from-[#2EA3E6] via-[#00A3E8] to-[#FF2E63] shadow-lg shadow-[#2EA3E6]/20">
              <div className="w-full h-full rounded-full bg-[#0E171E] flex items-center justify-center font-black text-white text-lg tracking-wider">
                MS
              </div>
            </div>
            <span
              className={`absolute bottom-0 right-1 w-3.5 h-3.5 rounded-full border-2 border-[#14232C] ${
                isLiveSupabase ? "bg-emerald-500 animate-pulse" : "bg-[#2EA3E6]"
              }`}
              title={isLiveSupabase ? "Supabase Realtime Live" : "Local Mode"}
            />
          </div>

          <div>
            <h3 className="font-black text-sm tracking-widest text-white uppercase">
              MILLIONSPACES
            </h3>
            <p className="text-[11px] text-slate-400 font-mono">
              adminsl@millionspaces.com
            </p>
          </div>
        </div>

        {/* Primary Action Button (Hot Pink MillionSpaces Accent) */}
        <button
          onClick={onOpenNewLead}
          className="w-full py-2.5 px-4 rounded-full bg-[#FF2E63] hover:bg-[#e02654] active:scale-95 text-white font-black text-xs tracking-wider flex items-center justify-center space-x-2 shadow-lg shadow-[#FF2E63]/25 transition"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>NEW INBOUND LEAD</span>
        </button>

        {/* Navigation Items (Reference Pill Style: bright white pill when active) */}
        <nav className="space-y-1.5 pt-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-full text-xs font-black tracking-wide transition-all duration-200 group ${
                  isActive
                    ? "bg-white text-[#14232C] shadow-lg font-black translate-x-1"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? "text-[#2EA3E6]" : "text-slate-400 group-hover:text-white"
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge !== undefined && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isActive
                        ? "bg-[#2EA3E6] text-white"
                        : "bg-white/10 text-slate-300"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          {/* Quick Tools */}
          <div className="pt-3 border-t border-slate-800 space-y-1">
            <button
              onClick={onOpenManageAssignees}
              className="w-full flex items-center justify-between px-4 py-2.5 rounded-full text-xs text-slate-400 hover:text-white hover:bg-white/5 transition"
            >
              <div className="flex items-center space-x-3">
                <Users className="w-4 h-4 text-[#2EA3E6]" />
                <span className="font-bold">TEAM ASSIGNEES</span>
              </div>
              <span className="px-1.5 py-0.5 rounded-full bg-slate-800 text-[10px] text-slate-300">
                {assignees.length}
              </span>
            </button>

            <button
              onClick={onOpenWebhookTester}
              className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-full text-xs text-slate-400 hover:text-white hover:bg-white/5 transition"
            >
              <Sparkles className="w-4 h-4 text-[#FF2E63]" />
              <span className="font-bold">SIMULATE WEBHOOK</span>
            </button>

            <button
              onClick={onOpenSetupGuide}
              className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-full text-xs text-slate-400 hover:text-white hover:bg-white/5 transition"
            >
              <BookOpen className="w-4 h-4 text-slate-400" />
              <span className="font-bold">SETUP GUIDE</span>
            </button>
          </div>
        </nav>
      </div>

      {/* Bottom Module: Active Team & Flight Route World Graphic (Matching Reference Bottom Left) */}
      <div className="pt-4 border-t border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
            ACTIVE USERS
          </span>
          <button
            onClick={onOpenManageAssignees}
            className="text-[10px] text-[#2EA3E6] hover:underline font-bold"
          >
            Manage
          </button>
        </div>

        {/* Overlapping team avatar bubbles + counter */}
        <div className="flex items-center -space-x-2 overflow-hidden py-0.5">
          {assignees.slice(0, 4).map((member) => (
            <div
              key={member}
              title={member}
              className="w-8 h-8 rounded-full border-2 border-[#14232C] bg-gradient-to-tr from-[#2EA3E6] to-[#00A3E8] flex items-center justify-center text-[11px] font-black text-white uppercase shadow-sm"
            >
              {member.charAt(0)}
            </div>
          ))}
          {assignees.length > 4 && (
            <div className="w-8 h-8 rounded-full border-2 border-[#14232C] bg-[#FF2E63] text-white flex items-center justify-center text-[10px] font-bold">
              +{assignees.length - 4}
            </div>
          )}
        </div>

        {/* Reference Dotted World Route Graphic (Yellow/Cyan curved arcs) */}
        <div className="relative h-14 w-full rounded-2xl bg-[#0B151C] border border-slate-800/80 p-2 overflow-hidden flex items-center justify-center">
          <svg
            className="w-full h-full text-slate-600 opacity-60"
            viewBox="0 0 200 60"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* World background dots */}
            <circle cx="30" cy="30" r="1.5" fill="#2EA3E6" opacity="0.6" />
            <circle cx="45" cy="22" r="1.5" fill="#2EA3E6" opacity="0.4" />
            <circle cx="60" cy="35" r="1.5" fill="#2EA3E6" opacity="0.5" />
            <circle cx="100" cy="25" r="2" fill="#2EA3E6" opacity="0.8" />
            <circle cx="140" cy="38" r="1.5" fill="#FF2E63" opacity="0.5" />
            <circle cx="170" cy="28" r="2" fill="#FF2E63" opacity="0.8" />
            {/* Flight Route Arcs */}
            <path
              d="M30 30 C 60 10, 80 10, 100 25"
              stroke="#2EA3E6"
              strokeWidth="1.2"
              strokeDasharray="2 3"
            />
            <path
              d="M100 25 C 130 15, 150 15, 170 28"
              stroke="#FF2E63"
              strokeWidth="1.2"
              strokeDasharray="2 3"
            />
            <circle cx="100" cy="25" r="3" fill="#2EA3E6" />
            <circle cx="170" cy="28" r="3" fill="#FF2E63" />
          </svg>
          <span className="absolute bottom-1 right-2 text-[8px] font-mono text-slate-400">
            FB/IG ➔ WA Network
          </span>
        </div>

        {/* Realtime Status Indicator */}
        <div className="flex items-center space-x-2 text-[11px] text-slate-400 pt-0.5">
          <span className="flex h-2 w-2 relative">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                isLiveSupabase ? "bg-emerald-400" : "bg-[#2EA3E6]"
              }`}
            />
            <span
              className={`relative inline-flex rounded-full h-2 w-2 ${
                isLiveSupabase ? "bg-emerald-500" : "bg-[#2EA3E6]"
              }`}
            />
          </span>
          <span className="text-xs truncate">
            {isLiveSupabase ? "Supabase Live" : "Local Workspace Mode"}
          </span>
        </div>
      </div>
    </aside>
  );
}
