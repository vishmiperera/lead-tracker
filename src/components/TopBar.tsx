"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  RotateCw,
  Plus,
  Sparkles,
  Database,
  Radio,
  ChevronDown,
  Building2,
  BookOpen,
  Smartphone,
  Users,
  ShieldCheck,
  LogOut,
  ExternalLink,
  CheckCircle2,
  Command,
} from "lucide-react";
import Link from "next/link";
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
  onOpenSetupGuide?: () => void;
  onOpenManageAssignees?: () => void;
  assigneesCount?: number;
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
  onOpenSetupGuide,
  onOpenManageAssignees,
  assigneesCount,
  totalLeadsCount,
}: TopBarProps) {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ email: string; role: string } | null>({
    email: "adminsl@millionspaces.com",
    role: "Super Admin",
  });

  const searchInputRef = useRef<HTMLInputElement>(null);
  const accountMenuRef = useRef<HTMLDivElement>(null);

  // Smart scroll effect: elevates and tightens navbar on scroll
  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 15);
      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Keyboard shortcut Ctrl+K / Cmd+K to focus search input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Click outside listener for Account Menu popover
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(e.target as Node)) {
        setIsAccountMenuOpen(false);
      }
    };
    if (isAccountMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isAccountMenuOpen]);

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isScrolled
            ? "bg-white/90 dark:bg-[#0A0E17]/90 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/80 shadow-xs py-2 sm:py-2.5"
            : "bg-white/80 dark:bg-[#0A0E17]/80 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-800/60 py-3 sm:py-3.5"
        }`}
      >
        <div className="max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-3 sm:gap-4">
            {/* Left: Brand Identity with Live API status */}
            <div className="flex items-center space-x-3 shrink-0">
              <Link href="/" className="flex items-center space-x-3 group">
                <div className="relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-[#2EA3E6] via-[#00A3E8] to-[#258bc5] text-white shadow-md shadow-[#2EA3E6]/25 group-hover:scale-105 transition-transform duration-200">
                  <Building2 className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF2E63] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#FF2E63]"></span>
                  </span>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center space-x-2">
                    <span className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900 dark:text-white leading-tight">
                      Million<span className="text-[#2EA3E6]">Spaces</span>
                    </span>
                    <span className="hidden sm:inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60">
                      Leads Hub
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-[11px] text-slate-400 dark:text-slate-500">
                    <span className="inline-flex items-center gap-1 font-medium">
                      <span className={`w-1.5 h-1.5 rounded-full ${isLiveSupabase ? "bg-emerald-500 animate-pulse" : "bg-amber-400"}`} />
                      {isLiveSupabase ? "Meta WhatsApp Live" : "Demo Workspace"}
                    </span>
                  </div>
                </div>
              </Link>
            </div>

            {/* Middle: Minimalist Command Search (Desktop & Laptop) */}
            <div className="flex-1 max-w-md mx-2 hidden lg:block">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500 group-focus-within:text-[#2EA3E6] transition-colors">
                  <Search className="w-4 h-4" />
                </div>
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="Search customer, phone, campaign, inquiry..."
                  className="w-full pl-9 pr-14 py-1.5 sm:py-2 text-xs sm:text-sm rounded-full bg-slate-100/80 dark:bg-slate-800/60 border border-transparent hover:border-slate-300 dark:hover:border-slate-700 focus:border-[#2EA3E6] dark:focus:border-[#2EA3E6] text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#2EA3E6]/15 transition-all"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  {searchQuery ? (
                    <button
                      type="button"
                      onClick={() => onSearchChange("")}
                      className="pointer-events-auto text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-semibold"
                    >
                      ×
                    </button>
                  ) : (
                    <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 dark:text-slate-500 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded shadow-2xs">
                      <Command className="w-2.5 h-2.5" /> K
                    </kbd>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Actions Cluster & Account Showing Area */}
            <div className="flex items-center space-x-1.5 sm:space-x-2.5 shrink-0">
              {/* Team Assignees Pill */}
              {onOpenManageAssignees && (
                <button
                  onClick={onOpenManageAssignees}
                  title="Manage Team Assignees"
                  className="flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-full border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900 hover:border-[#2EA3E6]/50 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300 shadow-2xs transition"
                >
                  <Users className="w-3.5 h-3.5 text-[#2EA3E6]" />
                  <span className="hidden md:inline">Assignees</span>
                  {assigneesCount !== undefined && (
                    <span className="px-1.5 py-0.2 rounded-full bg-[#2EA3E6]/10 text-[#0284C7] dark:text-[#2EA3E6] text-[10px] font-bold">
                      {assigneesCount}
                    </span>
                  )}
                </button>
              )}

              {/* Mobile Quick Capture */}
              <Link
                href="/capture"
                title="Mobile Quick Lead Capture for Reps"
                className="hidden xl:flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 transition"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Quick Capture</span>
              </Link>

              {/* Minimalist Tools Cluster */}
              <div className="flex items-center space-x-1 pl-1 border-l border-slate-200 dark:border-slate-800">
                {/* Meta Webhook Simulator Button */}
                <button
                  onClick={onOpenWebhookTester}
                  title="Simulate Inbound Meta Webhook"
                  className="w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-full flex items-center justify-center border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:text-[#2EA3E6] hover:border-[#2EA3E6]/40 shadow-2xs transition active:scale-95"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#2EA3E6]" />
                </button>

                {/* Setup Guide Button */}
                {onOpenSetupGuide && (
                  <button
                    onClick={onOpenSetupGuide}
                    title="View Setup & Integration Guide"
                    className="hidden sm:flex w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-full items-center justify-center border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:text-[#2EA3E6] hover:border-[#2EA3E6]/40 shadow-2xs transition active:scale-95"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                  </button>
                )}

                {/* Refresh Leads Data */}
                <button
                  onClick={onRefresh}
                  disabled={isRefreshing}
                  title="Refresh Leads Data"
                  className="w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-full flex items-center justify-center border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:text-[#2EA3E6] hover:border-[#2EA3E6]/40 shadow-2xs transition-all duration-200 disabled:opacity-50 active:scale-95"
                >
                  <RotateCw
                    className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-[#2EA3E6]" : ""}`}
                  />
                </button>

                {/* Theme Toggle */}
                <ThemeToggle />
              </div>

              {/* Add New Lead Primary Action (MillionSpaces Hot Pink #FF2E63) */}
              <button
                onClick={onOpenNewLead}
                className="flex items-center space-x-1.5 px-3.5 py-1.5 sm:py-2 text-xs sm:text-sm font-bold rounded-full bg-[#FF2E63] hover:bg-[#e02654] text-white shadow-md shadow-[#FF2E63]/25 hover:shadow-lg hover:shadow-[#FF2E63]/30 active:scale-95 transition-all duration-150"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span className="hidden sm:inline">Add Lead</span>
              </button>

              {/* Minimalist Account Showing Area (Redesigned Pill + Popover) */}
              <div className="relative pl-1 sm:pl-2" ref={accountMenuRef}>
                <button
                  type="button"
                  onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
                  title="Account Details & Settings"
                  className="flex items-center space-x-2 p-1 sm:pr-2.5 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-[#2EA3E6]/40 transition shadow-2xs group"
                >
                  <div className="relative">
                    <div className="w-7 h-7 sm:w-7.5 sm:h-7.5 rounded-full bg-gradient-to-tr from-[#2EA3E6] to-[#00A3E8] text-white flex items-center justify-center text-xs font-extrabold shadow-xs">
                      MS
                    </div>
                    <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900" />
                  </div>

                  <div className="hidden xl:flex flex-col text-left mr-0.5">
                    <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 leading-tight">
                      Admin
                    </span>
                    <span className="text-[9px] text-slate-400 font-medium leading-none">
                      MillionSpaces
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-3 h-3 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition-transform duration-200 ${
                      isAccountMenuOpen ? "rotate-180 text-[#2EA3E6]" : ""
                    }`}
                  />
                </button>

                {/* Account Popover Menu */}
                {isAccountMenuOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 rounded-2xl shadow-xl p-3 space-y-3 animate-in fade-in zoom-in-95 duration-150 z-50">
                    {/* User Dossier Header */}
                    <div className="flex items-center space-x-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#2EA3E6] to-[#00A3E8] text-white flex items-center justify-center font-bold text-sm shadow-sm">
                        MS
                      </div>
                      <div className="overflow-hidden">
                        <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          MillionSpaces Admin
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                          {currentUser ? currentUser.email : "adminsl@millionspaces.com"}
                        </div>
                        <div className="inline-flex items-center gap-1 mt-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.2 rounded-full">
                          <ShieldCheck className="w-3 h-3" />
                          <span>Super Admin</span>
                        </div>
                      </div>
                    </div>

                    {/* Quick System Links */}
                    <div className="space-y-1">
                      <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 px-2 py-0.5">
                        Shortcuts
                      </div>

                      {onOpenSetupGuide && (
                        <button
                          onClick={() => {
                            setIsAccountMenuOpen(false);
                            onOpenSetupGuide();
                          }}
                          className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                        >
                          <span className="flex items-center gap-2">
                            <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                            Setup & Webhook Guide
                          </span>
                        </button>
                      )}

                      <button
                        onClick={() => {
                          setIsAccountMenuOpen(false);
                          onOpenWebhookTester();
                        }}
                        className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                      >
                        <span className="flex items-center gap-2">
                          <Sparkles className="w-3.5 h-3.5 text-[#2EA3E6]" />
                          Meta Webhook Simulator
                        </span>
                      </button>

                      <Link
                        href="/capture"
                        onClick={() => setIsAccountMenuOpen(false)}
                        className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                      >
                        <span className="flex items-center gap-2">
                          <Smartphone className="w-3.5 h-3.5 text-emerald-500" />
                          Mobile Quick Lead Capture
                        </span>
                        <ExternalLink className="w-3 h-3 text-slate-400" />
                      </Link>
                    </div>

                    {/* Footer: Sign in / Switch Account */}
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center px-1">
                      <button
                        onClick={() => {
                          setIsAccountMenuOpen(false);
                          setIsAuthOpen(true);
                        }}
                        className="text-xs text-[#2EA3E6] hover:underline font-semibold"
                      >
                        {currentUser ? "Switch Account" : "Sign In"}
                      </button>

                      {currentUser && (
                        <button
                          onClick={() => {
                            setCurrentUser(null);
                            setIsAccountMenuOpen(false);
                          }}
                          className="text-xs text-rose-500 hover:underline inline-flex items-center gap-1 font-medium"
                        >
                          <LogOut className="w-3 h-3" />
                          <span>Sign Out</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Search Bar visible on screens < lg */}
          <div className="pt-2.5 pb-1 lg:hidden">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Search className="w-3.5 h-3.5" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search leads, phone, campaign..."
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#2EA3E6]"
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
