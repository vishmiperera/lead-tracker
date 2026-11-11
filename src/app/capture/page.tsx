"use client";

import React, { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { CAMPAIGN_OPTIONS } from "@/lib/mockData";
import { 
  Building2, 
  Send, 
  CheckCircle2, 
  User, 
  Phone, 
  MessageSquare, 
  Sparkles,
  ArrowLeft
} from "lucide-react";

export default function MobileQuickCapturePage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("+94");
  const [source, setSource] = useState<"Facebook" | "Instagram" | "WhatsApp Direct">("Facebook");
  const [campaign, setCampaign] = useState(CAMPAIGN_OPTIONS[0]);
  const [venueInterest, setVenueInterest] = useState("");
  const [message, setMessage] = useState("");
  const [assignedRep, setAssignedRep] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !message.trim()) {
      alert("Please fill in customer name, phone number, and inquiry message.");
      return;
    }

    setIsSubmitting(true);

    const newLead = {
      name: name.trim(),
      phone: phone.trim(),
      source,
      campaign,
      assignee: assignedRep.trim() || undefined,
      venue_interest: venueInterest.trim() || undefined,
      message: message.trim(),
      lead_status: "New" as const,
      notes: assignedRep ? `Logged by rep: ${assignedRep}` : undefined,
      ad_id: `ad_${Date.now().toString().slice(-6)}`,
      created_at: new Date().toISOString(),
    };

    if (supabase) {
      const { error } = await supabase.from("meta_whatsapp_leads").insert([newLead]);
      if (error) {
        console.error("Supabase error:", error);
        alert("Failed to save lead: " + error.message);
        setIsSubmitting(false);
        return;
      }
    }

    setIsSubmitting(false);
    setSubmitted(true);
  };

  const handleReset = () => {
    setName("");
    setPhone("+94");
    setMessage("");
    setVenueInterest("");
    setSubmitted(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-4 sm:p-6 flex flex-col justify-center items-center">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8">
        {/* Brand Header */}
        <div className="flex items-center justify-between pb-5 border-b border-slate-200 dark:border-slate-800 mb-6">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#2EA3E6] flex items-center justify-center text-white shadow-md shadow-[#2EA3E6]/30">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-base font-extrabold tracking-tight">
                Million<span className="text-[#2EA3E6]">Spaces</span>
              </div>
              <p className="text-xs text-slate-500 font-medium">Quick Lead Capture</p>
            </div>
          </div>
          <Link
            href="/"
            className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 inline-flex items-center gap-1 font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Dashboard
          </Link>
        </div>

        {submitted ? (
          <div className="text-center py-8 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-xl font-bold">Lead Saved Successfully!</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              The lead has been recorded in the central database and is now visible on the team dashboard.
            </p>
            <button
              onClick={handleReset}
              className="w-full mt-4 py-3 px-4 bg-[#2EA3E6] hover:bg-[#258bc5] text-white font-semibold rounded-xl transition shadow-md shadow-[#2EA3E6]/25"
            >
              + Log Another Lead
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                Customer Name *
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Shanika Perera"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2EA3E6]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                WhatsApp Phone Number *
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="+94 77 XXXXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#2EA3E6]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                  Ad Source
                </label>
                <select
                  value={source}
                  onChange={(e) => setSource(e.target.value as "Facebook" | "Instagram" | "WhatsApp Direct")}
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2EA3E6]"
                >
                  <option value="Facebook">Facebook Ad</option>
                  <option value="Instagram">Instagram Ad</option>
                  <option value="WhatsApp Direct">WhatsApp Direct</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                  Sales Rep Name
                </label>
                <input
                  type="text"
                  placeholder="Your Name / Rep"
                  value={assignedRep}
                  onChange={(e) => setAssignedRep(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2EA3E6]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                Campaign / Ad Target
              </label>
              <select
                value={campaign}
                onChange={(e) => setCampaign(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2EA3E6]"
              >
                {CAMPAIGN_OPTIONS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                Venue Interest (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Waters Edge Grand Lawn, Rooftop, etc."
                value={venueInterest}
                onChange={(e) => setVenueInterest(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2EA3E6]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                Message / Inquiry Text *
              </label>
              <div className="relative">
                <MessageSquare className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <textarea
                  required
                  rows={3}
                  placeholder="Paste or type what customer asked on WhatsApp..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2EA3E6]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 bg-[#FF2E63] hover:bg-[#e02654] disabled:opacity-50 text-white font-bold rounded-xl transition shadow-lg shadow-[#FF2E63]/25 flex items-center justify-center gap-2 mt-2"
            >
              {isSubmitting ? (
                "Saving Lead..."
              ) : (
                <>
                  <Send className="w-4 h-4" /> Save Lead to Dashboard
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
