// ============================================================================
// RevClaim AI — Multi-Engine Autonomous Voice Orchestrator
// ============================================================================
// Dynamically selects the best voice stack based on client locale & environment:
// - India (INR): Gnani.ai Indic Voice + Twilio India SIP
// - Global (USD/EUR): ElevenLabs Conversational AI + Twilio US SIP
// - Browser Testing: LiveKit WebRTC Real-Time Stream

import { Invoice } from "./types";
import { initiateTwilioOutboundCall } from "./twilio";
import { createLiveKitVoiceSession } from "./livekit";
import { synthesizeIndicSpeech } from "./gnani";
import { startOutboundCall as startElevenLabsCall } from "./elevenlabs";
import { generateNegotiationTurn } from "./llm";

export interface VoiceDispatchOptions {
  invoice: Invoice;
  preferredChannel?: "phone" | "webrtc_browser" | "auto";
  localeHint?: "indic_hinglish" | "international_english";
}

export interface VoiceDispatchResult {
  channel: "twilio_phone" | "livekit_webrtc" | "elevenlabs_conversational";
  engine: "gnani_indic" | "elevenlabs" | "simulated";
  sessionId: string;
  status: "initiated" | "ringing" | "connected";
  details: Record<string, any>;
}

export async function orchestrateRecoveryCall(
  options: VoiceDispatchOptions
): Promise<VoiceDispatchResult> {
  const { invoice, preferredChannel = "auto" } = options;
  const isIndianClient = invoice.currency === "INR" || (invoice.debtorPhone || "").startsWith("+91");

  console.log(`[Voice Orchestrator] Routing recovery call for invoice ${invoice.invoiceNumber} (${invoice.currency})`);

  // Route 1: In-browser WebRTC session (via LiveKit)
  if (preferredChannel === "webrtc_browser") {
    const livekitSession = await createLiveKitVoiceSession(
      invoice.id,
      invoice.debtorName || invoice.debtor?.contactPerson || "Client"
    );
    return {
      channel: "livekit_webrtc",
      engine: isIndianClient ? "gnani_indic" : "elevenlabs",
      sessionId: livekitSession.roomName,
      status: "connected",
      details: livekitSession,
    };
  }

  // Route 2: Real Telephone Dialing via Twilio
  // If Indian client, uses Gnani.ai Indic adapter; otherwise ElevenLabs
  if (isIndianClient) {
    const twilioCall = await initiateTwilioOutboundCall({
      to: invoice.debtorPhone || invoice.debtor?.phone || "+919876543210",
      invoiceId: invoice.id,
      invoiceNumber: invoice.invoiceNumber,
      amount: invoice.amountDue ?? invoice.amount ?? 1500,
      clientName: invoice.debtorName || invoice.debtor?.contactPerson || "Client",
    });

    return {
      channel: "twilio_phone",
      engine: "gnani_indic",
      sessionId: twilioCall.callSid,
      status: "initiated",
      details: {
        provider: "Twilio + Gnani.ai Hinglish Model",
        callSid: twilioCall.callSid,
      },
    };
  }

  // Route 3: Global Conversational AI (ElevenLabs + Twilio)
  const elevenLabsCall = await startElevenLabsCall(invoice);
  return {
    channel: "elevenlabs_conversational",
    engine: "elevenlabs",
    sessionId: elevenLabsCall.conversationId || `conv_${Date.now()}`,
    status: "initiated",
    details: {
      provider: "ElevenLabs Conversational AI + Twilio",
      conversationId: elevenLabsCall.conversationId,
    },
  };
}
