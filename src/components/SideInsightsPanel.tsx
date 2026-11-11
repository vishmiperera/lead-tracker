"use client";

import React from "react";
import {
  TrendingUp,
  MessageCircle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Radio,
  Sliders,
  Send,
} from "lucide-react";
import { Lead } from "@/types";

interface SideInsightsPanelProps {
  leads: Lead[];
  onOpenWebhookTester: () => void;
  onFilterStatus?: (status: string) => void;
  activeFilter?: string;
}

export function SideInsightsPanel({
  leads,
  onOpenWebhookTester,
  onFilterStatus,
  activeFilter = "All Statuses",
}: SideInsightsPanelProps) {
  const total = leads.length;
  const newCount = leads.filter((l) => l.lead_status === "New").length;
  const contactedCount = leads.filter((l) => l.lead_status === "Contacted").length;
  const qualifiedCount = leads.filter((l) => l.lead_status === "Qualified").length;
  const closedCount = leads.filter((l) => l.lead_status === "Closed").length;

  const respondedCount = contactedCount + qualifiedCount + closedCount;
  const respondedRate = total > 0 ? Math.round((respondedCount / total) * 100) : 0;

  return (
    <div className="w-full bg-[#14232C] text-white rounded-3xl p-5 sm:p-6 shadow-xl space-y-5 flex flex-col justify-between border border-slate-800">
      {/* Top Header: Matching reference [FROM JFK  NON-STOP  TO BOM] */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider pb-3 border-b border-slate-800">
          <div>
            <span className="block text-[9px] text-slate-400 font-bold tracking-widest">FROM</span>
            <span className="text-white font-black text-sm tracking-wide">META ADS</span>
          </div>

          <div className="px-2.5 py-0.5 rounded-full bg-white/5 border border-slate-700 text-[10px] text-slate-300 font-bold uppercase tracking-wider">
            NON-STOP
          </div>

          <div className="text-right">
            <span className="block text-[9px] text-slate-400 font-bold tracking-widest">TO</span>
            <span className="text-emerald-400 font-black text-sm tracking-wide">WHATSAPP</span>
          </div>
        </div>

        {/* Reference Dotted World Route Map Graphic with Flying Plane / Message Icon */}
        <div className="relative p-4 rounded-2xl bg-[#0C171E] border border-slate-800/90 overflow-hidden text-center select-none">
          {/* Subtle world map background dots */}
          <div className="absolute inset-0 opacity-20 flex items-center justify-center pointer-events-none">
            <svg className="w-full h-full text-slate-400" viewBox="0 0 300 120" fill="currentColor">
              <circle cx="40" cy="50" r="2" />
              <circle cx="55" cy="40" r="1.5" />
              <circle cx="70" cy="60" r="2" />
              <circle cx="85" cy="45" r="1.5" />
              <circle cx="100" cy="55" r="2" />
              <circle cx="140" cy="50" r="2" />
              <circle cx="160" cy="35" r="2" />
              <circle cx="180" cy="65" r="2" />
              <circle cx="210" cy="45" r="2" />
              <circle cx="230" cy="55" r="1.5" />
              <circle cx="260" cy="50" r="2" />
            </svg>
          </div>

          {/* Route path with animated flight plane */}
          <div className="relative z-10 py-3">
            <svg className="w-full h-16" viewBox="0 0 280 60" fill="none">
              {/* Origin node */}
              <circle cx="25" cy="45" r="6" fill="#2EA3E6" />
              <circle cx="25" cy="45" r="12" fill="#2EA3E6" opacity="0.2" className="animate-ping" />

              {/* Destination node */}
              <circle cx="255" cy="45" r="6" fill="#10B981" />
              <circle cx="255" cy="45" r="12" fill="#10B981" opacity="0.2" className="animate-ping" />

              {/* Curved Flight Arc */}
              <path
                d="M 25 45 Q 140 -5 255 45"
                stroke="url(#routeGradient)"
                strokeWidth="2.5"
                strokeDasharray="4 4"
                fill="none"
              />

              {/* Flying Airplane / Message Icon along arc */}
              <g transform="translate(133, 10)">
                <circle cx="7" cy="7" r="11" fill="#FF2E63" />
                <path
                  d="M4 7 L10 4 L8.5 7 L10 10 Z"
                  fill="white"
                />
              </g>

              <defs>
                <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#2EA3E6" />
                  <stop offset="50%" stopColor="#FF2E63" />
                  <stop offset="100%" stopColor="#10B981" />
                </linearGradient>
              </defs>
            </svg>

            {/* City / Platform labels */}
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mt-1 px-1">
              <span className="font-bold text-slate-200">FACEBOOK & IG</span>
              <span className="font-bold text-emerald-400">wa.me/direct</span>
            </div>
          </div>
        </div>

        {/* Reference Pill Toggles (like [NON STOP] [ONE STOP] [MORE STOP]) */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">
            QUICK STATUS FILTER
          </span>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              onClick={() => onFilterStatus?.("All Statuses")}
              className={`py-2 px-2 text-[10px] font-black rounded-xl transition text-center uppercase ${
                activeFilter === "All Statuses"
                  ? "bg-[#2EA3E6] text-white shadow-md shadow-[#2EA3E6]/25"
                  : "bg-white/5 text-slate-400 hover:text-white hover:bg-white/10"
              }`}
            >
              ALL ({total})
            </button>
            <button
              onClick={() => onFilterStatus?.("New")}
              className={`py-2 px-2 text-[10px] font-black rounded-xl transition text-center uppercase ${
                activeFilter === "New"
                  ? "bg-[#FF2E63] text-white shadow-md shadow-[#FF2E63]/25"
                  : "bg-white/5 text-slate-400 hover:text-white hover:bg-white/10"
              }`}
            >
              NEW ({newCount})
            </button>
            <button
              onClick={() => onFilterStatus?.("Contacted")}
              className={`py-2 px-2 text-[10px] font-black rounded-xl transition text-center uppercase ${
                activeFilter === "Contacted"
                  ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/25"
                  : "bg-white/5 text-slate-400 hover:text-white hover:bg-white/10"
              }`}
            >
              RESPONDED ({respondedCount})
            </button>
          </div>
        </div>

        {/* Reference Slider Gauge (Matching the [PRICE $500 ---- $2500] slider in reference) */}
        <div className="p-4 rounded-2xl bg-[#0C171E] border border-slate-800 space-y-2.5">
          <div className="flex items-center justify-between text-xs font-black">
            <span className="text-slate-400 uppercase tracking-wider text-[10px]">
              LEAD RESPONSE RATE
            </span>
            <span className="text-emerald-400 font-black text-sm">{respondedRate}%</span>
          </div>

          {/* Slider track with yellow/cyan knob matching reference */}
          <div className="relative py-2">
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#2EA3E6] via-[#FF2E63] to-emerald-400 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${Math.max(5, Math.min(respondedRate, 100))}%` }}
              />
            </div>
            {/* Slider Knob */}
            <div
              className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#FF2E63] border-2 border-white shadow-md cursor-pointer transition-all duration-500"
              style={{ left: `calc(${Math.max(5, Math.min(respondedRate, 100))}% - 8px)` }}
            />
          </div>

          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span>0% (Untouched)</span>
            <span>100% (All Contacted)</span>
          </div>
        </div>
      </div>

      {/* Primary Simulator Button */}
      <button
        onClick={onOpenWebhookTester}
        className="w-full py-3 px-4 rounded-full bg-gradient-to-r from-[#2EA3E6] to-[#00A3E8] hover:opacity-95 active:scale-95 text-white font-black text-xs tracking-wider flex items-center justify-center space-x-2 shadow-lg shadow-[#2EA3E6]/25 transition"
      >
        <Sparkles className="w-4 h-4" />
        <span>SIMULATE META LEAD</span>
      </button>
    </div>
  );
}
