"use client";

import React, { useState } from "react";
import {
  X,
  Phone,
  MessageCircle,
  Calendar,
  Layers,
  Tag,
  ExternalLink,
  Edit3,
  Trash2,
  CheckCircle2,
  Clock,
  Sparkles,
  Building,
  Copy,
  Send,
} from "lucide-react";
import { Lead, LeadStatus } from "@/types";

interface LeadDetailModalProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: (id: string, status: LeadStatus) => void;
  onSaveNotes: (id: string, notes: string) => void;
  onDeleteLead: (id: string) => void;
}

export function LeadDetailModal({
  lead,
  isOpen,
  onClose,
  onStatusChange,
  onSaveNotes,
  onDeleteLead,
}: LeadDetailModalProps) {
  const [notes, setNotes] = useState(lead?.notes || "");
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [showNotesSuccess, setShowNotesSuccess] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("intro");
  const [customReply, setCustomReply] = useState<string>("");
  const [copiedText, setCopiedText] = useState(false);

  React.useEffect(() => {
    if (lead) {
      setNotes(lead.notes || "");
      const defaultIntro = `Hello ${lead.name}, thank you for contacting MillionSpaces! We received your inquiry regarding "${lead.campaign}". We would love to assist you with finding the ideal space. Could you let us know your preferred date and expected guest count?`;
      setCustomReply(defaultIntro);
      setSelectedTemplate("intro");
    }
  }, [lead]);

  if (!isOpen || !lead) return null;

  const handleSaveNotes = () => {
    setIsSavingNotes(true);
    onSaveNotes(lead.id, notes);
    setTimeout(() => {
      setIsSavingNotes(false);
      setShowNotesSuccess(true);
      setTimeout(() => setShowNotesSuccess(false), 2000);
    }, 300);
  };

  // WhatsApp formatted link
  const sanitizedPhone = lead.phone.replace(/[^0-9]/g, "");
  const whatsappUrl = `https://wa.me/${sanitizedPhone}?text=${encodeURIComponent(customReply)}`;

  // Format date cleanly
  const formattedDate = new Date(lead.created_at).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  const statuses: { label: LeadStatus; bg: string; text: string }[] = [
    { label: "New", bg: "bg-[#FF2E63]/10 hover:bg-[#FF2E63]/20", text: "text-[#FF2E63]" },
    { label: "Contacted", bg: "bg-[#2EA3E6]/10 hover:bg-[#2EA3E6]/20", text: "text-[#2EA3E6]" },
    { label: "Qualified", bg: "bg-emerald-500/10 hover:bg-emerald-500/20", text: "text-emerald-500" },
    { label: "Lost", bg: "bg-slate-500/10 hover:bg-slate-500/20", text: "text-slate-500" },
    { label: "Closed", bg: "bg-purple-500/10 hover:bg-purple-500/20", text: "text-purple-500" },
  ];

  // Quick reply templates
  const templates = [
    {
      id: "intro",
      title: "Inquiry Welcome",
      text: `Hello ${lead.name}, thank you for contacting MillionSpaces! We received your inquiry regarding "${lead.campaign}". We would love to assist you with finding the ideal space. Could you let us know your preferred date and expected guest count?`,
    },
    {
      id: "tour",
      title: "Schedule Site Tour",
      text: `Hi ${lead.name}, thank you for checking out MillionSpaces! We would be delighted to host you for a private walkthrough of our partner spaces in Colombo. Are you free for a 20-minute visit tomorrow or Thursday afternoon?`,
    },
    {
      id: "quote",
      title: "Quote & Package Info",
      text: `Dear ${lead.name}, here is the overview for "${lead.venue_interest || lead.campaign}". Packages include full AV setups, high-speed Wi-Fi, and optional catering. Would you like us to generate a personalized proposal PDF?`,
    },
    {
      id: "followup",
      title: "Status Check-in",
      text: `Hi ${lead.name}, following up on your recent space inquiry with MillionSpaces. Are you still exploring venues for your event? Let us know if you need customized options or special booking terms!`,
    },
  ];

  const handleSelectTemplate = (t: typeof templates[0]) => {
    setSelectedTemplate(t.id);
    setCustomReply(t.text);
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(customReply);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-6 pb-4 border-b border-slate-200/80 dark:border-slate-800/80 flex items-start justify-between bg-slate-50/50 dark:bg-slate-800/30">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#2EA3E6] to-[#00A3E8] text-white flex items-center justify-center text-lg font-bold shadow-md shadow-[#2EA3E6]/20">
              {lead.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  {lead.name}
                </h2>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200">
                  {lead.source}
                </span>
              </div>
              <div className="flex items-center space-x-3 text-xs text-slate-500 dark:text-slate-400 mt-1">
                <span className="flex items-center space-x-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>{formattedDate}</span>
                </span>
                {lead.ad_id && (
                  <span className="font-mono text-[11px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-400">
                    Ad ID: {lead.ad_id}
                  </span>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Action Row: Direct WhatsApp Launch */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-[#2EA3E6]/5 dark:bg-[#2EA3E6]/10 border border-[#2EA3E6]/20">
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                WhatsApp Phone Number
              </p>
              <p className="text-base font-bold text-slate-900 dark:text-white mt-0.5 flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#2EA3E6]" />
                {lead.phone}
              </p>
            </div>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                if (lead.lead_status === "New") {
                  onStatusChange(lead.id, "Contacted");
                }
              }}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition active:scale-95"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Launch WhatsApp Chat</span>
              <ExternalLink className="w-3 h-3 opacity-75" />
            </a>
          </div>

          {/* Quick WhatsApp Reply Assistant */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#FF2E63]" />
                <span>1-Click WhatsApp Quick Replies</span>
              </span>
              <button
                type="button"
                onClick={handleCopyText}
                className="text-xs font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1 transition"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copiedText ? "Copied!" : "Copy Text"}</span>
              </button>
            </div>

            {/* Template selector pills */}
            <div className="flex flex-wrap gap-2 mb-3">
              {templates.map((tpl) => (
                <button
                  key={tpl.id}
                  type="button"
                  onClick={() => handleSelectTemplate(tpl)}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${
                    selectedTemplate === tpl.id
                      ? "bg-[#2EA3E6] text-white shadow-xs"
                      : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-[#2EA3E6]/40"
                  }`}
                >
                  {tpl.title}
                </button>
              ))}
            </div>

            <textarea
              rows={3}
              value={customReply}
              onChange={(e) => setCustomReply(e.target.value)}
              className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#2EA3E6]"
            />
          </div>

          {/* Status Switcher Buttons */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Update Lead Status
            </label>
            <div className="flex flex-wrap gap-2">
              {statuses.map((st) => {
                const isActive = lead.lead_status === st.label;
                return (
                  <button
                    key={st.label}
                    onClick={() => onStatusChange(lead.id, st.label)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      isActive
                        ? `${st.bg} ${st.text} ring-2 ring-current shadow-sm scale-105`
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                    }`}
                  >
                    {st.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Campaign and Venue Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-[#2EA3E6]" />
                Meta Ad Campaign
              </span>
              <p className="text-sm font-semibold text-slate-900 dark:text-white mt-1">
                {lead.campaign}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-[#FF2E63]" />
                Venue Interest
              </span>
              <p className="text-sm font-semibold text-slate-900 dark:text-white mt-1">
                {lead.venue_interest || "General Venue / Event Inquiry"}
              </p>
            </div>
          </div>

          {/* Inbound WhatsApp Message Content */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 flex items-center justify-between">
              <span>Incoming WhatsApp Message Body</span>
              <span className="text-[11px] text-slate-400 font-normal">
                Direct from Meta Webhook
              </span>
            </label>
            <div className="p-4 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-sans shadow-inner whitespace-pre-wrap">
              {lead.message}
            </div>
          </div>

          {/* Internal Notes & Follow-up log */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Edit3 className="w-3.5 h-3.5 text-slate-400" />
                <span>Internal Staff Notes & Follow-up</span>
              </label>
              {showNotesSuccess && (
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Notes Saved!
                </span>
              )}
            </div>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Sent quotation for 65 pax banquet, customer requested site visit on Thursday..."
              className="w-full p-3 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2EA3E6]"
            />
            <div className="flex justify-end mt-2">
              <button
                type="button"
                onClick={handleSaveNotes}
                disabled={isSavingNotes}
                className="px-4 py-1.5 text-xs font-bold rounded-lg bg-[#2EA3E6] hover:bg-[#1D92D4] text-white shadow-sm transition disabled:opacity-50"
              >
                {isSavingNotes ? "Saving..." : "Save Note"}
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-between">
          <button
            onClick={() => {
              if (confirm(`Are you sure you want to delete lead "${lead.name}"?`)) {
                onDeleteLead(lead.id);
                onClose();
              }
            }}
            className="text-xs font-semibold text-rose-600 hover:text-rose-700 dark:text-rose-400 flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Lead</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
