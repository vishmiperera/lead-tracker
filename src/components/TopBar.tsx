"use client";

import React, { useState } from "react";
import {
  Search,
  RotateCw,
  Plus,
  Sparkles,
  Database,
  Radio,
  SlidersHorizontal,
  ChevronDown,
  Building2,
} from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { AuthModal } from "./AuthModal";

interface TopBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  isLiveSupabase: boolean;
  onOpenNewLead: () => void;
  onOpenWebhookTester: () => void;
  totalLeadsCount: number;
}

export function TopBar({
  searchQuery,
  onSearchChange,
  onRefresh,
  isRefreshing,
  isLiveSupabase,
  onOpenNewLead,
  onOpenWebhookTester,
  totalLeadsCount,
}: TopBarProps) {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ email: string; role: string } | null>({
    email: "adminsl@millionspaces.com",
    role: "Super Admin",
  });

  return (
    <>
      <header className="sticky top-0 z-30 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-[#0B0F19]/80 backdrop-blur-md transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-3">
            {/* Left: Brand Identity */}
            <div className="flex items-center space-x-3 shrink-0">
              <div className="relative flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#2EA3E6] to-[#00A3E8] shadow-md shadow-[#2EA3E6]/25">
                <Building2 className="w-5 h-5 text-white" />
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF2E63] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-[#FF2E63]"></span>
                </span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center space-x-2">
                  <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 dark:text-white">
                    Million<span className="text-[#2EA3E6]">Spaces</span>
                  </span>
                  <span className="text-xs px-2 py-0.5 font-semibold rounded-full bg-[#2EA3E6]/10 text-[#0284C7] dark:text-[#2EA3E6] border border-[#2EA3E6]/20">
                    Leads Hub
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-[11px] text-slate-500 dark:text-slate-400">
                  <span className="flex items-center space-x-1">
                    <Radio className="w-3 h-3 text-emerald-500 animate-pulse" />
                    <span>Click-to-WhatsApp Meta Ads</span>
                  </span>
                  <span>•</span>
                  <span className="hidden sm:inline-flex items-center space-x-1">
                    <Database className="w-3 h-3 text-slate-400" />
                    <span>{isLiveSupabase ? "Supabase Live" : "Local Storage Demo"}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Middle: Pill-shaped Quick Search */}
            <div className="flex-1 max-w-md mx-2 hidden md:block">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                  <Search className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="Quick search by name, phone, or venue inquiry... (Ctrl+K)"
                  className="w-full pl-10 pr-10 py-2 text-sm rounded-full bg-slate-100/90 dark:bg-slate-800/80 border border-transparent focus:border-[#2EA3E6] dark:focus:border-[#2EA3E6] text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#2EA3E6]/20 transition-all shadow-inner"
                />
                {searchQuery && (
                  <button
                    onClick={() => onSearchChange("")}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Right: Actions, Theme Toggle, Admin Pill */}
            <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
              {/* Meta Webhook Simulator Button */}
              <button
                onClick={onOpenWebhookTester}
                title="Test Meta Webhook Payload"
                className="hidden lg:flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-[#2EA3E6]/50 text-slate-700 dark:text-slate-300 shadow-sm transition"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#2EA3E6]" />
                <span>Test Webhook</span>
              </button>

              {/* Refresh Button */}
              <button
                onClick={onRefresh}
                disabled={isRefreshing}
                title="Refresh leads data"
                className="w-9 h-9 rounded-full flex items-center justify-center border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:text-[#2EA3E6] dark:hover:text-[#2EA3E6] hover:border-[#2EA3E6]/40 shadow-sm transition-all duration-200 disabled:opacity-50"
              >
                <RotateCw
                  className={`w-4 h-4 ${isRefreshing ? "animate-spin text-[#2EA3E6]" : ""}`}
                />
              </button>

              {/* Theme Toggle */}
              <ThemeToggle />

              {/* Add New Lead CTA (MillionSpaces Hot Pink Accent #FF2E63) */}
              <button
                onClick={onOpenNewLead}
                className="flex items-center space-x-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-full bg-[#FF2E63] hover:bg-[#E01C50] text-white shadow-md shadow-[#FF2E63]/25 hover:shadow-lg hover:shadow-[#FF2E63]/30 active:scale-95 transition-all duration-150"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span className="hidden sm:inline">Add Lead</span>
              </button>

              {/* Admin Profile Pill */}
              <button
                onClick={() => setIsAuthOpen(true)}
                className="flex items-center space-x-2 pl-2 pr-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50 dark:bg-slate-900 transition"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#2EA3E6] to-[#00A3E8] text-white flex items-center justify-center text-xs font-bold shadow-sm">
                  MS
                </div>
                <div className="hidden xl:flex flex-col text-left">
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-tight">
                    {currentUser ? "MillionSpaces Admin" : "Sign In"}
                  </span>
                  <span className="text-[10px] text-slate-400 leading-none">
                    {currentUser ? currentUser.email : "Access Leads"}
                  </span>
                </div>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>
            </div>
          </div>

          {/* Mobile search bar visible on small devices */}
          <div className="pb-3 md:hidden">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search leads, phone, venue..."
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2EA3E6]/20"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        currentUser={currentUser}
        onLogin={(email) => setCurrentUser({ email, role: "Super Admin" })}
        onLogout={() => setCurrentUser(null)}
      />
    </>
  );
}
