// ============================================================================
// RevClaim AI — Dual LLM Orchestration Engine (Gemini + Groq Fallback)
// ============================================================================

export interface NegotiationContext {
  debtorName: string;
  debtorCompany: string;
  invoiceNumber: string;
  amountDue: number;
  currency: string;
  daysOverdue: number;
  deliverable: string;
  freelancerName: string;
  conversationHistory: { role: "agent" | "client"; text: string }[];
  clientLastMessage: string;
}

export interface LLMResponse {
  reply: string;
  modelUsed: "gemini-2.0-flash" | "groq-llama-3.3-70b" | "calibrated-heuristic-fallback";
  latencyMs: number;
  intentDetected?: "hardship" | "dispute" | "ptp_commitment" | "refusal" | "greeting";
  ptpDetails?: { amount?: number; date?: string };
}

/**
 * Primary Generator: Google Gemini 2.0 Flash
 */
async function callGemini(
  systemInstruction: string,
  userPrompt: string,
  apiKey: string
): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [{ text: `${systemInstruction}\n\nClient input:\n${userPrompt}` }],
        },
      ],
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 250,
      },
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Gemini API error (${res.status}): ${errorText}`);
  }

  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("Empty response from Gemini");
  return text.trim();
}

/**
 * Fallback Generator: Groq Llama 3.3 70B (Sub-200ms ultra-low latency)
 */
async function callGroq(
  systemInstruction: string,
  userPrompt: string,
  apiKey: string
): Promise<string> {
  const url = "https://api.groq.com/openai/v1/chat/completions";

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemInstruction },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.3,
      max_tokens: 250,
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Groq API error (${res.status}): ${errorText}`);
  }

  const data = await res.json();
  const text = data.choices?.[0]?.message?.content;
  if (!text) throw new Error("Empty response from Groq");
  return text.trim();
}

/**
 * Unified Orchestrator with Intelligent Auto-Failover
 */
export async function generateNegotiationTurn(ctx: NegotiationContext): Promise<LLMResponse> {
  const startTime = Date.now();
  const geminiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  const groqKey = process.env.GROQ_API_KEY;

  const halfAmount = Math.round(ctx.amountDue / 2);
  const systemPrompt = `You are Sarah, a warm, professional accounts mediation manager representing ${ctx.freelancerName}.
You are speaking on phone with ${ctx.debtorName} from ${ctx.debtorCompany} regarding invoice ${ctx.invoiceNumber} for ${ctx.currency} ${ctx.amountDue.toLocaleString()} (deliverable: "${ctx.deliverable}", ${ctx.daysOverdue} days overdue).

GOALS:
1. Preserve good business relations — never sound aggressive or rude.
2. If client has cash flow hardship: Offer a 50% split payment today (${ctx.currency} ${halfAmount.toLocaleString()}) and remainder next Friday.
3. If client agrees: Lock in the Promise-to-Pay (PTP) and confirm instant Dodo checkout link is on their WhatsApp.
4. Keep spoken responses short, natural, and conversational (under 2 sentences). Speak in clear English or Hinglish if the client speaks in Hindi.`;

  const conversationText = ctx.conversationHistory
    .map((m) => `${m.role === "agent" ? "Sarah" : ctx.debtorName}: ${m.text}`)
    .join("\n");

  const userPrompt = `${conversationText}\n${ctx.debtorName}: ${ctx.clientLastMessage}\nSarah:`;

  // 1. Try Gemini first (Primary)
  if (geminiKey && !geminiKey.includes("your_gemini")) {
    try {
      const reply = await callGemini(systemPrompt, userPrompt, geminiKey);
      return {
        reply,
        modelUsed: "gemini-2.0-flash",
        latencyMs: Date.now() - startTime,
      };
    } catch (geminiError) {
      console.warn("[LLM] Gemini primary failed, failing over to Groq:", geminiError);
    }
  }

  // 2. Try Groq fallback (High Speed)
  if (groqKey && !groqKey.includes("your_groq")) {
    try {
      const reply = await callGroq(systemPrompt, userPrompt, groqKey);
      return {
        reply,
        modelUsed: "groq-llama-3.3-70b",
        latencyMs: Date.now() - startTime,
      };
    } catch (groqError) {
      console.warn("[LLM] Groq fallback failed, using calibrated heuristic:", groqError);
    }
  }

  // 3. Calibrated Rule-based Simulation Fallback (Always Reliable)
  const lowerMsg = ctx.clientLastMessage.toLowerCase();
  let fallbackReply = `I completely understand cash flow crunches, ${ctx.debtorName}. Would you be able to clear 50% (${ctx.currency} ${halfAmount.toLocaleString()}) today, and we schedule the remainder for next Friday?`;

  if (lowerMsg.includes("send") || lowerMsg.includes("link") || lowerMsg.includes("yes") || lowerMsg.includes("ok")) {
    fallbackReply = `Wonderful! I have locked in your Promise-to-Pay and just dispatched the secure Dodo Payments checkout link to your WhatsApp. Thank you for your partnership!`;
  }

  return {
    reply: fallbackReply,
    modelUsed: "calibrated-heuristic-fallback",
    latencyMs: Date.now() - startTime,
  };
}
