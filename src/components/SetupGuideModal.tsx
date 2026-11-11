"use client";

import React, { useState } from "react";
import {
  X,
  BookOpen,
  Key,
  Database,
  Radio,
  ExternalLink,
  Copy,
  CheckCircle2,
  Terminal,
} from "lucide-react";

interface SetupGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SetupGuideModal({ isOpen, onClose }: SetupGuideModalProps) {
  const [activeTab, setActiveTab] = useState<"supabase" | "meta" | "vercel">("supabase");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, keyName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyName);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/30">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#2EA3E6]/10 text-[#2EA3E6] flex items-center justify-center font-bold">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Live Deployment & Integration Checklist
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Setup steps for Supabase, Meta WhatsApp API, and Vercel
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

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200/80 dark:border-slate-800/80 bg-slate-50/30 dark:bg-slate-800/20 px-5 pt-3 gap-2">
          <button
            onClick={() => setActiveTab("supabase")}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
              activeTab === "supabase"
                ? "border-[#2EA3E6] text-[#2EA3E6]"
                : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Database className="w-4 h-4" />
            <span>1. Supabase Database</span>
          </button>

          <button
            onClick={() => setActiveTab("meta")}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
              activeTab === "meta"
                ? "border-[#2EA3E6] text-[#2EA3E6]"
                : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Radio className="w-4 h-4" />
            <span>2. Meta WhatsApp Webhook</span>
          </button>

          <button
            onClick={() => setActiveTab("vercel")}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
              activeTab === "vercel"
                ? "border-[#2EA3E6] text-[#2EA3E6]"
                : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Key className="w-4 h-4" />
            <span>3. Vercel & Env Keys</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-5 space-y-4 overflow-y-auto text-xs leading-relaxed text-slate-700 dark:text-slate-300">
          {activeTab === "supabase" && (
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <span className="font-bold text-slate-900 dark:text-white block mb-1">
                  Step 1: Open Supabase Project
                </span>
                <p className="text-slate-500 dark:text-slate-400">
                  Create a new project on{" "}
                  <a
                    href="https://supabase.com/dashboard"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#2EA3E6] underline inline-flex items-center gap-0.5 font-semibold"
                  >
                    supabase.com/dashboard <ExternalLink className="w-3 h-3" />
                  </a>
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <span className="font-bold text-slate-900 dark:text-white block mb-1">
                  Step 2: Run SQL Schema
                </span>
                <p className="text-slate-500 dark:text-slate-400 mb-2">
                  Navigate to <strong>SQL Editor</strong> in Supabase, paste the contents of{" "}
                  <code className="text-[#2EA3E6] font-mono">supabase/schema.sql</code>, and click <strong>Run</strong>.
                </p>
                <div className="p-2.5 rounded-lg bg-slate-900 text-slate-200 font-mono text-[11px] flex items-center justify-between">
                  <span>File: supabase/schema.sql</span>
                  <span className="text-emerald-400">Ready in workspace</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <span className="font-bold text-slate-900 dark:text-white block mb-1">
                  Step 3: Copy API Credentials
                </span>
                <p className="text-slate-500 dark:text-slate-400">
                  Go to <strong>Project Settings</strong> &gt; <strong>API</strong> and copy:
                </p>
                <ul className="list-disc pl-5 mt-1 space-y-1 text-slate-600 dark:text-slate-400">
                  <li><strong>Project URL</strong>: e.g. <code className="text-[#2EA3E6]">https://your-ref.supabase.co</code></li>
                  <li><strong>anon public key</strong>: client API key</li>
                  <li><strong>service_role key</strong>: webhook server-side key</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === "meta" && (
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <span className="font-bold text-slate-900 dark:text-white block mb-1">
                  Step 1: Open Meta Developer App
                </span>
                <p className="text-slate-500 dark:text-slate-400">
                  Go to{" "}
                  <a
                    href="https://developers.facebook.com/apps"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#2EA3E6] underline inline-flex items-center gap-0.5 font-semibold"
                  >
                    developers.facebook.com/apps <ExternalLink className="w-3 h-3" />
                  </a>{" "}
                  and open your Business app &gt; <strong>WhatsApp</strong> &gt; <strong>Configuration</strong>.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                <span className="font-bold text-slate-900 dark:text-white block">
                  Step 2: Enter Webhook Settings
                </span>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Callback URL</span>
                      <code className="text-xs font-mono text-[#2EA3E6]">https://&lt;your-domain&gt;/api/meta-webhook</code>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Verify Token</span>
                      <code className="text-xs font-mono text-[#FF2E63]">millionspaces_meta_leads_secret_token</code>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyToClipboard("millionspaces_meta_leads_secret_token", "token")}
                      className="px-2 py-1 text-[11px] font-semibold rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700"
                    >
                      {copiedKey === "token" ? "Copied" : "Copy"}
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <span className="font-bold text-slate-900 dark:text-white block mb-1">
                  Step 3: Subscribe to &quot;messages&quot;
                </span>
                <p className="text-slate-500 dark:text-slate-400">
                  Under Webhook fields, click <strong>Manage</strong> and click <strong>Subscribe</strong> for the <strong>messages</strong> field.
                </p>
              </div>
            </div>
          )}

          {activeTab === "vercel" && (
            <div className="space-y-3">
              <p className="text-slate-500 dark:text-slate-400">
                Add these variables in <strong>Vercel &gt; Settings &gt; Environment Variables</strong>:
              </p>
              <div className="p-3 rounded-xl bg-slate-950 font-mono text-slate-200 text-[11px] space-y-1">
                <p><span className="text-slate-400">NEXT_PUBLIC_SUPABASE_URL</span>=https://your-id.supabase.co</p>
                <p><span className="text-slate-400">NEXT_PUBLIC_SUPABASE_ANON_KEY</span>=your-anon-key</p>
                <p><span className="text-slate-400">SUPABASE_SERVICE_ROLE_KEY</span>=your-service-role-key</p>
                <p><span className="text-slate-400">META_WEBHOOK_VERIFY_TOKEN</span>=millionspaces_meta_leads_secret_token</p>
                <p><span className="text-slate-400">NEXT_PUBLIC_ADMIN_EMAIL</span>=adminsl@millionspaces.com</p>
                <p><span className="text-slate-400">ADMIN_PASSWORD</span>=MsAdmin@2019</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/30 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-[#2EA3E6] hover:bg-[#1D92D4] text-white transition shadow-sm"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
}

