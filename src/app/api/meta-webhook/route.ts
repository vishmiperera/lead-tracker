import { NextRequest, NextResponse } from "next/server";
import { getServiceSupabaseClient } from "@/lib/supabase";

// Meta verification token configured in Meta App Dashboard / Environment variables
const VERIFY_TOKEN = process.env.META_WEBHOOK_VERIFY_TOKEN || "millionspaces_meta_leads_secret_token";

/**
 * GET Handler - Meta Webhook Verification
 * Meta sends a GET request when you register the webhook endpoint:
 * hub.mode=subscribe&hub.challenge=...&hub.verify_token=...
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get("hub.mode");
    const token = searchParams.get("hub.verify_token");
    const challenge = searchParams.get("hub.challenge");

    // Check if mode and token are in the query string of the request
    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      console.log("[Meta Webhook] Successfully verified webhook challenge!");
      // Meta expects the plain text challenge returned with HTTP 200
      return new NextResponse(challenge, {
        status: 200,
        headers: { "Content-Type": "text/plain" },
      });
    }

    // Token didn't match
    console.warn("[Meta Webhook] Verification token mismatch:", {
      receivedToken: token,
      expectedToken: VERIFY_TOKEN,
    });
    return NextResponse.json(
      { error: "Forbidden: Verification token mismatch" },
      { status: 403 }
    );
  } catch (error) {
    console.error("[Meta Webhook] GET error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

/**
 * POST Handler - Inbound WhatsApp Webhook Event
 * Processes incoming Click-to-WhatsApp ad leads and inserts them into Supabase
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log("[Meta Webhook] Received payload:", JSON.stringify(body, null, 2));

    // Ensure it's a WhatsApp Business Account event
    if (body.object !== "whatsapp_business_account" && !body.entry) {
      return NextResponse.json({ status: "ignored_non_whatsapp_event" }, { status: 200 });
    }

    const insertedLeads = [];
    const supabase = getServiceSupabaseClient();

    // Iterate through entries and changes
    for (const entry of body.entry || []) {
      for (const change of entry.changes || []) {
        if (change.field === "messages") {
          const value = change.value;
          const contacts = value.contacts || [];
          const messages = value.messages || [];

          for (const msg of messages) {
            // Find sender profile name
            const senderContact = contacts.find((c: { wa_id: string }) => c.wa_id === msg.from);
            const customerName = senderContact?.profile?.name || `WhatsApp User (+${msg.from})`;

            // Normalize phone number (ensure + prefix)
            const rawPhone = String(msg.from || "");
            const formattedPhone = rawPhone.startsWith("+") ? rawPhone : `+${rawPhone}`;

            // Extract message body text
            let messageText = "";
            if (msg.type === "text" && msg.text?.body) {
              messageText = msg.text.body;
            } else if (msg.type === "button" && msg.button?.text) {
              messageText = msg.button.text;
            } else if (msg.type === "interactive") {
              messageText =
                msg.interactive?.button_reply?.title ||
                msg.interactive?.list_reply?.title ||
                "Interactive selection";
            } else {
              messageText = `[Inquiry via ${msg.type || "WhatsApp"}]`;
            }

            // Extract Click-to-WhatsApp Referral Ad Data
            const referral = msg.referral;
            let source: "Facebook" | "Instagram" | "WhatsApp Direct" = "WhatsApp Direct";
            let campaign = "General Inquiries";
            let adId = undefined;

            if (referral) {
              adId = referral.source_id || referral.ad_id;
              const sourceUrl = (referral.source_url || "").toLowerCase();
              const sourceType = (referral.source_type || "").toLowerCase();

              // Determine platform source
              if (sourceUrl.includes("instagram.com") || sourceType.includes("instagram")) {
                source = "Instagram";
              } else if (sourceUrl.includes("fb.me") || sourceUrl.includes("facebook.com") || sourceType.includes("ad")) {
                source = "Facebook";
              }

              // Extract campaign name from headline or fallback
              if (referral.headline) {
                campaign = referral.headline;
              } else if (referral.body) {
                campaign = referral.body.slice(0, 40) + "...";
              } else {
                campaign = "Meta Click-to-WhatsApp Campaign";
              }
            }

            const newLeadRecord = {
              name: customerName,
              phone: formattedPhone,
              lead_status: "New" as const,
              source,
              campaign,
              message: messageText,
              ad_id: adId,
              created_at: new Date().toISOString(),
            };

            // Write to Supabase if configured
            if (supabase) {
              const { data, error } = await supabase
                .from("meta_whatsapp_leads")
                .insert([newLeadRecord])
                .select()
                .single();

              if (error) {
                console.error("[Meta Webhook] Supabase insert error:", error);
              } else {
                console.log("[Meta Webhook] Successfully saved lead to Supabase:", data);
                insertedLeads.push(data);
              }
            } else {
              console.log("[Meta Webhook] Supabase not connected. Processed lead:", newLeadRecord);
              insertedLeads.push(newLeadRecord);
            }
          }
        }
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: "Webhook processed successfully",
        leads_processed: insertedLeads.length,
        data: insertedLeads,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("[Meta Webhook] Processing error:", error);
    const message = error instanceof Error ? error.message : "Internal error";
    return NextResponse.json(
      { error: "Failed to process Meta webhook event", details: message },
      { status: 500 }
    );
  }
}
