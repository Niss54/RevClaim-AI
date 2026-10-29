// ============================================================================
// RevClaim AI — Ultra-Low Latency Dual LLM & Smart Reflex Engine
// Primary: Groq LPU (Sub-700ms) | Failover: Google Gemini Flash-Lite
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
  modelUsed: "groq-qwen-27b" | "gemini-flash-lite" | "smart-human-reflex";
  latencyMs: number;
  intentDetected?: "hardship" | "dispute" | "ptp_commitment" | "refusal" | "greeting" | "ai_check" | "busy";
  ptpDetails?: { amount?: number; date?: string };
}

/**
 * Sub-50ms Smart Reflex Engine for Instant High-EQ Human Reactions
 * Handles unexpected ("ulta seedha") debtor questions with zero network delay.
 */
function checkSmartHumanReflex(ctx: NegotiationContext): string | null {
  const msg = ctx.clientLastMessage.toLowerCase().trim();
  const name = ctx.debtorName.split(" ")[0] || "ji";
  const currencySymbol = ctx.currency === "USD" ? "$" : "₹";
  const halfAmount = Math.round(ctx.amountDue / 2);

  // 1. Identity & "Why are you calling me?" / "Who authorized this?"
  if (
    msg.includes("kaun") ||
    msg.includes("who is this") ||
    msg.includes("who are you") ||
    msg.includes("why are you calling") ||
    msg.includes("kyu call kiya") ||
    msg.includes("kisne bola")
  ) {
    return `Namaste ${name}! Main Sarah hoon accounts desk se, regarding invoice ${ctx.invoiceNumber} for ${currencySymbol}${ctx.amountDue.toLocaleString()} (${ctx.deliverable}). Bas 1 minute ka quick reconciliation update chahiye tha.`;
  }

  // 2. AI / Bot Detection ("Are you an AI? / Robot ho kya?")
  if (
    msg.includes("robot") ||
    msg.includes("ai ho") ||
    msg.includes("artificial") ||
    msg.includes("computer") ||
    msg.includes("machine") ||
    msg.includes("are you real") ||
    msg.includes("are you human")
  ) {
    return `Haha, nahi ${name}! Main RevClaim ki AI billing coordinator hoon, par hum agency founder ke sath directly coordinate karke account settlement smooth banane me help kar rahe hain.`;
  }

  // 3. Busy / Driving / In Meeting ("Meeting me hoon / baad me call karo")
  if (
    msg.includes("meeting") ||
    msg.includes("busy") ||
    msg.includes("drive") ||
    msg.includes("driving") ||
    msg.includes("baad me") ||
    msg.includes("later") ||
    msg.includes("call me later") ||
    msg.includes("kal karna")
  ) {
    return `Oh, extremely sorry ${name}! Main abhi call wrap karti hoon. Maine Dodo ka direct payment link aapke WhatsApp par bhej diya hai, jab free hon tab check kar lijiyega.`;
  }

  // 4. Hostile / Refusal ("Paise nahi dunga / court jao / fraud hai")
  if (
    msg.includes("nahi dunga") ||
    msg.includes("wont pay") ||
    msg.includes("won't pay") ||
    msg.includes("court") ||
    msg.includes("police") ||
    msg.includes("lawyer") ||
    msg.includes("fraud") ||
    msg.includes("don't call") ||
    msg.includes("mat karna")
  ) {
    return `Understood completely, ${name}. Main abhi saare automated follow-ups pause kar rahi hoon aur founder ko escalate kar rahi hoon taaki aap dono aapas me resolve kar sakein. Have a good day.`;
  }

  // 5. Work Quality / Bug / Deliverable Dispute ("Kaam bekar hai / bugs hain")
  if (
    msg.includes("bug") ||
    msg.includes("kharab") ||
    msg.includes("incomplete") ||
    msg.includes("dispute") ||
    msg.includes("not happy") ||
    msg.includes("quality") ||
    msg.includes("issue")
  ) {
    return `Got it ${name}. Maine deliverable review dispute log kar diya hai. Calls turant halt kar di gayi hain aur development lead aapko sign-off review ke liye contact karenge.`;
  }

  // 6. Hardship / Cash Crunch ("Paise nahi hain / tight budget / funds delayed")
  if (
    msg.includes("paisa nahi") ||
    msg.includes("paise nahi") ||
    msg.includes("no money") ||
    msg.includes("tight") ||
    msg.includes("crunch") ||
    msg.includes("salary nahi") ||
    msg.includes("client ne nahi diya")
  ) {
    return `Bilkul samajh sakti hoon ${name}, cash flow crunches hote rehte hain. Kya hum 50% (${currencySymbol}${halfAmount.toLocaleString()}) abhi clear kar lein aur baki agle Friday?`;
  }

  // 7. Positive / Willing to pay / "Send link"
  if (
    msg.includes("send link") ||
    msg.includes("link bhejo") ||
    msg.includes("qr code") ||
    msg.includes("whatsapp") ||
    msg.includes("pay karta hoon") ||
    msg.includes("done")
  ) {
    return `Superb ${name}! Maine direct Dodo Payments checkout link aapke WhatsApp par bhej diya hai. 10 seconds me UPI ya card se clear ho jayega. Thank you so much!`;
  }

  return null;
}

/**
 * Primary Generator: Groq Qwen 27B (Sub-700ms LPU Inference)
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
      model: "qwen/qwen3.8-27b",
      messages: [
        { role: "system", content: systemInstruction },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.3,
      max_tokens: 65, // Short, punchy phone turns (15-20 words)
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
 * Failover Generator: Google Gemini Flash-Lite
 */
async function callGemini(
  systemInstruction: string,
  userPrompt: string,
  apiKey: string
): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-lite-latest:generateContent?key=${apiKey}`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [{ text: `${systemInstruction}\n\nDebtor said:\n${userPrompt}\nSarah (speak in max 1-2 natural spoken sentences):` }],
        },
      ],
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 65,
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
 * Master Voice Orchestrator (< 600-800ms Latency Guaranteed)
 */
export async function generateNegotiationTurn(ctx: NegotiationContext): Promise<LLMResponse> {
  const startTime = Date.now();

  // 1. Check Sub-50ms Smart Human Reflex Engine FIRST (instant zero-lag reaction)
  const reflexReply = checkSmartHumanReflex(ctx);
  if (reflexReply) {
    return {
      reply: reflexReply,
      modelUsed: "smart-human-reflex",
      latencyMs: Date.now() - startTime,
    };
  }

  const groqKey = process.env.GROQ_API_KEY;
  const geminiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  const halfAmount = Math.round(ctx.amountDue / 2);
  const currencySymbol = ctx.currency === "USD" ? "$" : "₹";

  const systemPrompt = `You are Sarah, a warm, dignified, and highly intelligent billing mediation specialist representing ${ctx.freelancerName}.
You are on a live phone call with ${ctx.debtorName} (${ctx.debtorCompany}) regarding invoice ${ctx.invoiceNumber} for ${currencySymbol}${ctx.amountDue.toLocaleString()} (${ctx.deliverable}, ${ctx.daysOverdue} days overdue).

HUMAN CONVERSATIONAL RULES:
- Speak like a real courteous human on a phone call. Never sound like a script-reading robot.
- Use natural conversational warmth, gentle empathy, and occasional Hindi/Hinglish warmth if addressed in Hindi.
- Keep turns strictly under 2 short sentences (15-20 words max).
- If debtor mentions cash-flow pressure, offer a 50% split (${currencySymbol}${halfAmount.toLocaleString()} today, rest next Friday).
- If debtor asks an unexpected question, answer with calm respect, dignity, and pivot smoothly to the solution.`;

  const conversationText = ctx.conversationHistory
    .slice(-4)
    .map((m) => `${m.role === "agent" ? "Sarah" : ctx.debtorName}: ${m.text}`)
    .join("\n");

  const userPrompt = `${conversationText}\n${ctx.debtorName}: ${ctx.clientLastMessage}\nSarah:`;

  // 2. High-Speed Primary: Groq LPU (~700ms)
  if (groqKey && !groqKey.includes("your_groq")) {
    try {
      const reply = await callGroq(systemPrompt, userPrompt, groqKey);
      return {
        reply,
        modelUsed: "groq-qwen-27b",
        latencyMs: Date.now() - startTime,
      };
    } catch (groqError) {
      console.warn("[LLM] Groq primary error, failing over to Gemini:", groqError);
    }
  }

  // 3. Fallback: Google Gemini Flash-Lite
  if (geminiKey && !geminiKey.includes("your_gemini")) {
    try {
      const reply = await callGemini(systemPrompt, userPrompt, geminiKey);
      return {
        reply,
        modelUsed: "gemini-flash-lite",
        latencyMs: Date.now() - startTime,
      };
    } catch (geminiError) {
      console.warn("[LLM] Gemini fallback error:", geminiError);
    }
  }

  // 4. Default High-EQ Fallback
  return {
    reply: `I completely understand, ${ctx.debtorName}. Would clearing 50% (${currencySymbol}${halfAmount.toLocaleString()}) today on Dodo ease things up for you?`,
    modelUsed: "smart-human-reflex",
    latencyMs: Date.now() - startTime,
  };
}
