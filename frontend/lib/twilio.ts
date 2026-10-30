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

    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Aditi" language="hi-IN">
    Namaste ${params.clientName} ji. Main RevClaim AI accounts desk se call kar rahi hoon, invoice ${params.invoiceNumber} ke silsile mein. Kul baki rashi rupaye ${params.amount} hai. Humne direct Dodo payment link aapke WhatsApp aur email par bhej diya hai. Kripya 24 ghante mein settle kar dijiye taaki automated follow-ups pause ho sakein. Dhanyawaad!
  </Say>
  <Pause length="1"/>
  <Say voice="Polly.Aditi" language="hi-IN">
    Aap payment link par jakar UPI ya card se turant clear kar sakte hain. Have a great day!
  </Say>
</Response>`;

    const formData = new URLSearchParams();
    formData.append("To", cleanTo);
    formData.append("From", fromNumber);
    formData.append("Twiml", twiml);

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
