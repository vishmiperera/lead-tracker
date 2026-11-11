"use client";

import React, { useState } from "react";
import {
  X,
  Sparkles,
  Send,
  Code,
  CheckCircle2,
  AlertCircle,
  Copy,
  ExternalLink,
} from "lucide-react";

interface MetaWebhookTesterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLeadAdded: () => void;
}

export function MetaWebhookTesterModal({
  isOpen,
  onClose,
  onLeadAdded,
}: MetaWebhookTesterModalProps) {
  const [selectedPreset, setSelectedPreset] = useState("rooftop");
  const [isLoading, setIsLoading] = useState(false);
  const [responseLog, setResponseLog] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const samplePayloads: Record<string, any> = {
    rooftop: {
      object: "whatsapp_business_account",
      entry: [
        {
          id: "WABA_10294829104",
          changes: [
            {
              field: "messages",
              value: {
                messaging_product: "whatsapp",
                metadata: {
                  display_phone_number: "+94112345678",
                  phone_number_id: "10928374192",
                },
                contacts: [
                  {
                    profile: { name: "Tharindu Wijesinghe" },
                    wa_id: "94775432109",
                  },
                ],
                messages: [
                  {
                    from: "94775432109",
                    id: `wamid_${Date.now()}`,
                    timestamp: Math.floor(Date.now() / 1000).toString(),
                    text: {
                      body: "Hi MillionSpaces, I saw your Instagram Ad for rooftop venues. Do you have a space for a 70-guest cocktail event in Colombo 03 on Saturday?",
                    },
                    type: "text",
                    referral: {
                      source_url: "https://www.instagram.com/p/DB123456/",
                      source_type: "ad",
                      source_id: "meta_ad_99201844",
                      headline: "Festive Season Banquet & Rooftop Bookings",
                      body: "Celebrate the holidays in style at Colombo's premier rooftop venues.",
                    },
                  },
                ],
              },
            },
          ],
        },
      ],
    },
    boardroom: {
      object: "whatsapp_business_account",
      entry: [
        {
          id: "WABA_10294829104",
          changes: [
            {
              field: "messages",
              value: {
                messaging_product: "whatsapp",
                metadata: {
                  display_phone_number: "+94112345678",
                  phone_number_id: "10928374192",
                },
                contacts: [
                  {
                    profile: { name: "Sanduni Alwis" },
                    wa_id: "94719876543",
                  },
                ],
                messages: [
                  {
                    from: "94719876543",
                    id: `wamid_${Date.now()}`,
                    timestamp: Math.floor(Date.now() / 1000).toString(),
                    text: {
                      body: "Hello! We need a luxury 16-seater boardroom at Cinnamon Grand with high speed audio-visual zoom setup for a board meeting this Friday.",
                    },
                    type: "text",
                    referral: {
                      source_url: "https://fb.me/millionspaces_boardrooms",
                      source_type: "ad",
                      source_id: "meta_ad_77209144",
                      headline: "High-End Boardroom & Meeting Pods",
                      body: "Impress your clients with Colombo's most prestigious executive spaces.",
                    },
                  },
                ],
              },
            },
          ],
        },
      ],
    },
  };

  const currentPayload = samplePayloads[selectedPreset];

  const handleSendTestWebhook = async () => {
    setIsLoading(true);
    setResponseLog(null);

    try {
      const res = await fetch("/api/meta-webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(currentPayload),
      });

      const data = await res.json();
      setResponseLog(JSON.stringify(data, null, 2));
      setIsLoading(false);
      onLeadAdded();
    } catch (err: any) {
      setResponseLog(`Error: ${err.message}`);
      setIsLoading(false);
    }
  };

  const handleCopyEndpoint = () => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    navigator.clipboard.writeText(`${origin}/api/meta-webhook`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/30">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#2EA3E6]/10 text-[#2EA3E6] flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Meta Webhook Testing Suite
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Simulate inbound Meta Click-to-WhatsApp webhook events
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 overflow-y-auto">
          {/* Endpoint Info */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Active Webhook Callback URL
              </p>
              <code className="text-xs font-mono text-[#2EA3E6] font-bold">
                /api/meta-webhook
              </code>
            </div>
            <button
              onClick={handleCopyEndpoint}
              className="text-xs font-medium px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copied ? "Copied!" : "Copy Full URL"}</span>
            </button>
          </div>

          {/* Preset Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Select Sample Ad Referral Payload
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setSelectedPreset("rooftop")}
                className={`p-3 rounded-xl border text-left transition ${
                  selectedPreset === "rooftop"
                    ? "border-[#2EA3E6] bg-[#2EA3E6]/5 dark:bg-[#2EA3E6]/10 text-[#2EA3E6]"
                    : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
                }`}
              >
                <div className="font-bold text-xs">Instagram Ad Referral</div>
                <div className="text-[11px] opacity-80 mt-0.5">
                  Rooftop Venue Inquiry (Tharindu W.)
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedPreset("boardroom")}
                className={`p-3 rounded-xl border text-left transition ${
                  selectedPreset === "boardroom"
                    ? "border-[#2EA3E6] bg-[#2EA3E6]/5 dark:bg-[#2EA3E6]/10 text-[#2EA3E6]"
                    : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
                }`}
              >
                <div className="font-bold text-xs">Facebook Ad Referral</div>
                <div className="text-[11px] opacity-80 mt-0.5">
                  Boardroom Pods (Sanduni A.)
                </div>
              </button>
            </div>
          </div>

          {/* JSON Preview */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center justify-between">
              <span>Meta WhatsApp Cloud API Payload Structure</span>
              <span className="text-[11px] text-slate-400 font-mono">POST JSON</span>
            </label>
            <pre className="p-3 text-[11px] font-mono rounded-xl bg-slate-900 text-slate-200 border border-slate-800 overflow-x-auto max-h-48">
              {JSON.stringify(currentPayload, null, 2)}
            </pre>
          </div>

          {/* Response Log */}
          {responseLog && (
            <div className="animate-in fade-in duration-150">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>API Route Execution Response (/api/meta-webhook)</span>
              </label>
              <pre className="p-3 text-[11px] font-mono rounded-xl bg-slate-950 text-emerald-400 border border-emerald-900/50 max-h-36 overflow-x-auto">
                {responseLog}
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 transition"
          >
            Close
          </button>

          <button
            onClick={handleSendTestWebhook}
            disabled={isLoading}
            className="flex items-center space-x-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-[#2EA3E6] hover:bg-[#1D92D4] text-white shadow-md shadow-[#2EA3E6]/25 transition disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isLoading ? "Dispatching..." : "Simulate Webhook Dispatch"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
