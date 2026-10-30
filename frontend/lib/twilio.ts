// ============================================================================
// RevClaim AI — Twilio Outbound Telephony & Voice Trunking
// ============================================================================

export interface TwilioCallParams {
  to: string;
  invoiceId: string;
  invoiceNumber: string;
  amount: number;
  clientName: string;
  callbackUrl?: string;
}

export interface TwilioCallResponse {
  success: boolean;
  callSid?: string;
  status: "queued" | "ringing" | "in-progress" | "failed" | "unconfigured";
  provider: "twilio_live" | "unconfigured";
  error?: string;
}

export async function initiateTwilioOutboundCall(
  params: TwilioCallParams
): Promise<TwilioCallResponse> {
  const accountSid = process.env.TWILIO_ACCOUNT_SID?.trim();
  const authToken = process.env.TWILIO_AUTH_TOKEN?.trim();
  const fromNumber = process.env.TWILIO_PHONE_NUMBER?.trim();

  // If Twilio credentials are not set, report status honestly
  if (!accountSid || !authToken || !fromNumber || accountSid.includes("your_twilio")) {
    console.warn(`[Twilio Setup Needed] Dialing ${params.to} paused: TWILIO_ACCOUNT_SID / AUTH_TOKEN / PHONE_NUMBER not set in .env.`);
    return {
      success: false,
      status: "unconfigured",
      provider: "unconfigured",
      error: "Twilio credentials missing in .env. Please set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_PHONE_NUMBER.",
    };
  }

  try {
    const authHeader = "Basic " + Buffer.from(`${accountSid}:${authToken}`).toString("base64");
    const cleanTo = params.to.replace(/\s+/g, "");

    const firstName = params.clientName ? params.clientName.trim().split(" ")[0] : "there";

    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL && !process.env.NEXT_PUBLIC_APP_URL.includes("localhost")
        ? process.env.NEXT_PUBLIC_APP_URL
        : "https://rev-claim-ai.vercel.app";

    const voiceUrl = `${baseUrl}/api/twilio/voice?clientName=${encodeURIComponent(firstName)}&invoiceNumber=${encodeURIComponent(params.invoiceNumber)}&amount=${encodeURIComponent(params.amount.toString())}&phone=${encodeURIComponent(cleanTo)}`;

    function escapeXml(unsafe: string): string {
      return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");
    }

    const rawRespondUrl = `${baseUrl}/api/twilio/voice/respond?clientName=${encodeURIComponent(firstName)}&invoiceNumber=${encodeURIComponent(params.invoiceNumber)}&amount=${encodeURIComponent(params.amount.toString())}&phone=${encodeURIComponent(cleanTo)}`;
    const escapedRespondUrl = escapeXml(rawRespondUrl);
    const escapedName = escapeXml(firstName);
    const escapedInvoice = escapeXml(params.invoiceNumber);
    const escapedAmount = escapeXml(params.amount.toString());

    // Inline TwiML with dual DTMF+Speech Gather & bilingual Polly.Aditi
    // Eliminates external webhook dependency and XML entity parse errors
    const inlineTwiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Gather input="dtmf speech" action="${escapedRespondUrl}" method="POST" speechTimeout="auto" timeout="5" language="hi-IN">
    <Say voice="Polly.Aditi" language="hi-IN">
      Namaste ${escapedName} ji! Main Sarah bol rahi hoon RevClaim AI accounts desk se aapke invoice ${escapedInvoice} ke silsile mein. Baki rashi rupaye ${escapedAmount} hai. Kya aap mujhe sun pa rahe hain? Kya hum iska settlement discuss kar sakte hain?
    </Say>
  </Gather>
  <Gather input="dtmf speech" action="${escapedRespondUrl}" method="POST" speechTimeout="auto" timeout="5" language="hi-IN">
    <Say voice="Polly.Aditi" language="hi-IN">
      Ji ${escapedName}, kya aap line par hain? Kripya bataiye agar aap mujhe sun pa rahe hain.
    </Say>
  </Gather>
  <Say voice="Polly.Aditi" language="hi-IN">
    Lagta hai network issue hai. Humne Dodo Payments ka direct link aapke WhatsApp aur email par bhej diya hai. Aap wahan se 24 ghante mein aaram se clear kar sakte hain. Dhanyawaad, aur aapka din shubh ho!
  </Say>
</Response>`.trim();

    const formData = new URLSearchParams();
    formData.append("To", cleanTo);
    formData.append("From", fromNumber);
    formData.append("Twiml", inlineTwiml);
    formData.append("Url", voiceUrl);

    const res = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Calls.json`,
      {
        method: "POST",
        headers: {
          Authorization: authHeader,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      }
    );

    if (!res.ok) {
      const err = await res.text();
      console.warn("[Twilio API Error]:", err);
      return {
        success: false,
        status: "failed",
        provider: "twilio_live",
        error: `Twilio call failed (${res.status}): ${err}`,
      };
    }

    const data = await res.json();
    return {
      success: true,
      callSid: data.sid,
      status: data.status || "queued",
      provider: "twilio_live",
    };
  } catch (err: any) {
    console.warn("[Twilio Outbound Call Error]:", err);
    return {
      success: false,
      status: "failed",
      provider: "twilio_live",
      error: err?.message || "Twilio request exception",
    };
  }
}
