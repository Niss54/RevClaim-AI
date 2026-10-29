import crypto from "node:crypto";
import { Invoice } from "./types";

export interface OutboundCallResult {
  provider: "elevenlabs_twilio" | "demo";
  status: "calling" | "completed";
  conversationId?: string;
  callSid?: string;
}

export function buildDynamicVariables(invoice: Invoice): Record<string, string> {
  const firstName = invoice.debtor.contactPerson.split(" ")[0];
  const halfAmount = Math.round(invoice.amountDue / 2);

  return {
    debtor_first_name: firstName,
    company_name: invoice.debtor.companyName,
    invoice_number: invoice.invoiceNumber,
    amount_due: invoice.amountDue.toLocaleString(),
    currency: invoice.currency,
    half_amount: halfAmount.toLocaleString(),
    due_date: invoice.dueDate,
    days_overdue: invoice.daysPastDue.toString(),
    deliverable_summary: invoice.deliverableSummary,
    agency_name: "DevStudio Accounts",
    payment_link: invoice.paymentLinkUrl || "https://checkout.dodopayments.com/buy/p_inv_demo"
  };
}

export async function startOutboundCall(invoice: Invoice): Promise<OutboundCallResult> {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  const agentId = process.env.ELEVENLABS_AGENT_ID;
  const phoneNumberId = process.env.ELEVENLABS_PHONE_NUMBER_ID;

  // Fallback to demo simulation if credentials aren't set
  if (!apiKey || !agentId || !phoneNumberId || process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
    return {
      provider: "demo",
      status: "calling",
      conversationId: `conv_sim_${Date.now()}`
    };
  }

  const response = await fetch("https://api.elevenlabs.io/v1/convai/twilio/outbound-call", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "xi-api-key": apiKey,
    },
    body: JSON.stringify({
      agent_id: agentId,
      agent_phone_number_id: phoneNumberId,
      to_number: invoice.debtor.phone,
      conversation_initiation_client_data: {
        dynamic_variables: buildDynamicVariables(invoice),
      },
      call_recording_enabled: true,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`ElevenLabs outbound call failed (${response.status}): ${errorText}`);
  }

  const payload = (await response.json()) as {
    conversation_id?: string | null;
    callSid?: string | null;
  };

  return {
    provider: "elevenlabs_twilio",
    status: "calling",
    conversationId: payload.conversation_id ?? undefined,
    callSid: payload.callSid ?? undefined,
  };
}

export function verifyElevenLabsWebhook(body: string, signature: string | null): boolean {
  const secret = process.env.ELEVENLABS_WEBHOOK_SECRET;
  if (!secret) return true; // dev bypass
  if (!signature) return false;

  const expected = crypto.createHmac("sha256", secret).update(body).digest("hex");
  const normalized = signature.replace(/^sha256=/, "");
  return crypto.timingSafeEqual(Buffer.from(expected, "hex"), Buffer.from(normalized, "hex"));
}
