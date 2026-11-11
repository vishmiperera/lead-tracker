import React from "react";
import Link from "next/link";
import { ShieldCheck, ArrowLeft } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-8 sm:p-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-[#2EA3E6] hover:underline mb-8 font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Leads Dashboard
        </Link>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-[#2EA3E6]/10 flex items-center justify-center text-[#2EA3E6]">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Privacy Policy</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">MillionSpaces Lead Hub</p>
          </div>
        </div>

        <div className="space-y-6 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <p>
            MillionSpaces (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) is committed to protecting your privacy. This Privacy Policy describes how we collect, use, and handle contact information obtained through Meta advertising campaigns (Facebook and Instagram Click-to-WhatsApp leads).
          </p>

          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 pt-4 border-t border-slate-200 dark:border-slate-800">
            1. Information We Collect
          </h2>
          <p>
            When you initiate a WhatsApp conversation through our Click-to-WhatsApp advertisements on Facebook or Instagram, we may collect:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Your WhatsApp profile display name.</li>
            <li>Your WhatsApp phone number.</li>
            <li>The message content and any inquiries submitted regarding venue bookings.</li>
            <li>Referral metadata (such as the ad campaign and venue interest).</li>
          </ul>

          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 pt-4 border-t border-slate-200 dark:border-slate-800">
            2. How We Use Your Information
          </h2>
          <p>
            We use the information collected strictly for customer service and venue booking inquiries:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Responding directly to your booking or venue rental requests via WhatsApp.</li>
            <li>Providing pricing quotes, venue availability, and catering details.</li>
            <li>Managing follow-ups requested by you.</li>
          </ul>

          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 pt-4 border-t border-slate-200 dark:border-slate-800">
            3. Data Protection & Retention
          </h2>
          <p>
            Your lead data is securely stored in encrypted databases with strict access control. We do not sell, rent, or trade your personal data to third parties.
          </p>

          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 pt-4 border-t border-slate-200 dark:border-slate-800">
            4. Contact Us
          </h2>
          <p>
            If you have questions regarding this Privacy Policy or your data, please contact our team at:
            <br />
            <strong>Email:</strong> support@millionspaces.com
            <br />
            <strong>Website:</strong> https://millionspaces.com
          </p>
        </div>
      </div>
    </div>
  );
}
