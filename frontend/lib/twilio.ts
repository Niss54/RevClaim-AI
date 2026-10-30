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

    const twimlContent = `<Response>
  <Say voice="Polly.Joanna" language="en-US">
    Hello ${firstName}! This is Sarah calling from RevClaim AI accounts desk regarding your invoice ${params.invoiceNumber} reconciliation. We have dispatched your direct Dodo Payments settlement link directly to your WhatsApp and verified email. You can clear the balance via UPI, card, or request a flexible installment schedule anytime. Thank you so much, and have a wonderful day!
  </Say>
</Response>`.trim();

    // Use Twimlet Echo URL to ensure 100% compatibility with Twilio accounts
    const echoUrl = `http://twimlets.com/echo?Twiml=${encodeURIComponent(twimlContent)}`;

    const formData = new URLSearchParams();
    formData.append("To", cleanTo);
    formData.append("From", fromNumber);
    formData.append("Url", echoUrl);

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
