import { spawn } from "child_process";

console.log("Starting Next.js production server on port 3000...");
const nextProc = spawn("node", ["node_modules/next/dist/bin/next", "start", "-p", "3000"], {
  stdio: ["ignore", "pipe", "pipe"],
  shell: true,
});

nextProc.stdout.on("data", (d) => {
  console.log(`[Next.js stdout]: ${d.toString().trim()}`);
});

nextProc.stderr.on("data", (d) => {
  console.error(`[Next.js stderr]: ${d.toString().trim()}`);
});

async function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function checkServer() {
  for (let i = 0; i < 20; i++) {
    try {
      const res = await fetch("http://127.0.0.1:3000/");
      if (res.status === 200) {
        console.log("Server is ready!");
        return true;
      }
    } catch {
      await delay(600);
    }
  }
  return false;
}

async function run() {
  try {
    const isReady = await checkServer();
    if (!isReady) {
      throw new Error("Server failed to become ready in time.");
    }

    // 1. Test GET verification
    console.log("\n=== Test 1: GET Challenge Verification ===");
    const getUrl =
      "http://127.0.0.1:3000/api/meta-webhook?hub.mode=subscribe&hub.verify_token=millionspaces_meta_leads_secret_token&hub.challenge=CHALLENGE_ACCEPTED_12345";
    const getRes = await fetch(getUrl);
    const getText = await getRes.text();
    console.log("GET Response status:", getRes.status);
    console.log("GET Response challenge:", getText);
    if (getRes.status !== 200 || getText !== "CHALLENGE_ACCEPTED_12345") {
      throw new Error(`GET verification challenge failed: status ${getRes.status}, body: ${getText}`);
    }
    console.log(">> Test 1 PASSED!");

    // 2. Test POST Meta Webhook Payload
    console.log("\n=== Test 2: POST WhatsApp Ad Referral Webhook ===");
    const payload = {
      object: "whatsapp_business_account",
      entry: [
        {
          id: "WABA_99201844",
          changes: [
            {
              field: "messages",
              value: {
                messaging_product: "whatsapp",
                contacts: [
                  {
                    profile: { name: "Tharindu Wijesinghe" },
                    wa_id: "94775432109",
                  },
                ],
                messages: [
                  {
                    from: "94775432109",
                    id: "wamid.TEST_AD_LEAD_001",
                    timestamp: "1731301000",
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
    };

    const postRes = await fetch("http://127.0.0.1:3000/api/meta-webhook", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const postData = await postRes.json();
    console.log("POST Response status:", postRes.status);
    console.log("POST Response data:", JSON.stringify(postData, null, 2));

    if (postRes.status !== 200 || !postData.success) {
      throw new Error(`POST webhook processing failed: ${JSON.stringify(postData)}`);
    }
    console.log(">> Test 2 PASSED!");

    console.log("\n=======================================================");
    console.log("SUCCESS: All Meta Webhook tests passed with 100% accuracy!");
    console.log("=======================================================");
  } finally {
    console.log("Terminating test Next.js server...");
    nextProc.kill("SIGKILL");
  }
}

run().catch((err) => {
  console.error("Test failed:", err);
  nextProc.kill("SIGKILL");
  process.exit(1);
});
