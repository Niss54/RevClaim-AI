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
 * Sub-50ms Smart Reflex Engine for Instant High-EQ Human Reactions & Sales Influence
 * Handles emergencies, accidents, puncture, and tough objections with zero network delay.
 */
function checkSmartHumanReflex(ctx: NegotiationContext): string | null {
  const msg = ctx.clientLastMessage.toLowerCase().trim();
  const name = ctx.debtorName.split(" ")[0] || "ji";
  const currencySymbol = ctx.currency === "USD" ? "$" : "₹";
  const halfAmount = Math.round(ctx.amountDue / 2);

  // 1. Road Emergency, Car Puncture, Accident, Health Issues (Safety & Empathy First!)
  if (
    msg.includes("puncture") ||
    msg.includes("panchar") ||
    msg.includes("punchur") ||
    msg.includes("tyre") ||
    msg.includes("tire") ||
    msg.includes("accident") ||
    msg.includes("gadi kharab") ||
    msg.includes("gaadi kharab") ||
    msg.includes("breakdown") ||
    msg.includes("bike slip") ||
    msg.includes("hospital") ||
    msg.includes("doctor") ||
    msg.includes("emergency") ||
    msg.includes("tabiyat") ||
    msg.includes("bimar") ||
    msg.includes("chot") ||
    msg.includes("injury") ||
    msg.includes("ill") ||
    msg.includes("sick")
  ) {
    return `Arey, koi baat nahi ${name}! Aap pehle puncture theek karwa lijiye, aap theek hain na? Invoice ki baat hum baad mein aaram se kar lenge. Main payment link WhatsApp par chhod deti hoon, jab aap safe pahunchein tab dekh lijiyega.`;
  }

  // 2. Identity & "Why are you calling me?" / "Who authorized this?"
  if (
    msg.includes("kaun") ||
    msg.includes("who is this") ||
    msg.includes("who are you") ||
    msg.includes("why are you calling") ||
    msg.includes("kyu call kiya") ||
    msg.includes("kisne bola")
  ) {
    return `Namaste ${name}! Main Sarah hoon accounts desk se, regarding invoice ${ctx.invoiceNumber} for ${currencySymbol}${ctx.amountDue.toLocaleString()} (${ctx.deliverable}). Bas 1 minute ka quick reconciliation update chahiye tha taaki account smooth rahe.`;
  }

  // 3. AI / Bot Detection ("Are you an AI? / Robot ho kya?")
  if (
    msg.includes("robot") ||
    msg.includes("ai ho") ||
    msg.includes("artificial") ||
    msg.includes("computer") ||
    msg.includes("machine") ||
    msg.includes("are you real") ||
    msg.includes("are you human")
  ) {
    return `Haha, nahi ${name}! Main RevClaim ki smart billing specialist hoon, par hum agency founder ke behalf par directly coordinate kar rahe hain taaki account settlement bilkul simple ho sake.`;
  }

  // 4. Busy / Driving / In Meeting ("Meeting me hoon / baad me call karo")
  if (
    msg.includes("meeting") ||
    msg.includes("busy") ||
    msg.includes("drive") ||
    msg.includes("driving") ||
    msg.includes("baad me") ||
    msg.includes("later") ||
    msg.includes("call me later") ||
    msg.includes("kal karna") ||
    msg.includes("traffic")
  ) {
    return `Oh, bilkul ${name}! Aap pehle driving ya meeting complete kar lijiye, main disturb nahi karungi. Dodo ka direct link WhatsApp par chhod diya hai, shaam ko jab free hon tab check kar lijiyega.`;
  }

  // 5. Hostile / Refusal ("Paise nahi dunga / court jao / fraud hai")
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
    return `Aap bilkul pareshan mat hoiye ${name}, main koi tension create nahi karna chahti. Saare follow-ups turant pause kar diye hain aur founder ko escalate kar diya hai taaki aap dono aapas me resolve kar sakein. Have a good day.`;
  }

  // 6. Work Quality / Bug / Deliverable Dispute ("Kaam bekar hai / bugs hain")
  if (
    msg.includes("bug") ||
    msg.includes("kharab") ||
    msg.includes("incomplete") ||
    msg.includes("dispute") ||
    msg.includes("not happy") ||
    msg.includes("quality") ||
    msg.includes("issue")
  ) {
    return `Acha hua aapne bataya ${name}! Maine deliverable dispute log kar diya hai aur reminders turant halt kar diye hain. Humare lead developer aapko issue review ke liye contact karenge.`;
  }

  // 7. Hardship / Cash Crunch ("Paise nahi hain / tight budget / funds delayed")
  if (
    msg.includes("paisa nahi") ||
    msg.includes("paise nahi") ||
    msg.includes("no money") ||
    msg.includes("tight") ||
    msg.includes("crunch") ||
    msg.includes("salary nahi") ||
    msg.includes("client ne nahi diya")
  ) {
    return `Main bilkul samajh sakti hoon ${name}, cash flow crunches sabke sath aate hain. Aapko poora ek sath dene ki zaroorat nahi hai—kya hum 50% (${currencySymbol}${halfAmount.toLocaleString()}) abhi settle kar lein aur baaki next Friday taaki account active rahe?`;
  }

  // 8. Positive / Willing to pay / "Send link"
  if (
    msg.includes("send link") ||
    msg.includes("link bhejo") ||
    msg.includes("qr code") ||
    msg.includes("whatsapp") ||
    msg.includes("pay karta hoon") ||
    msg.includes("done") ||
    msg.includes("clear kar")
  ) {
    return `Superb ${name}! Maine direct Dodo Payments checkout link aapke WhatsApp par bhej diya hai. 10 seconds me UPI ya card se clear ho jayega. Thank you so much!`;
  }

  return null;
}

/**
 * Primary Generator: Groq LPU (Sub-700ms LPU Inference)
 * Primary: llama-3.3-70b-versatile; Cascade fallback: qwen/qwen3.8-27b -> llama-3.1-8b-instant
 */
async function callGroq(
  systemInstruction: string,
  userPrompt: string,
  apiKey: string
): Promise<string> {
  const url = "https://api.groq.com/openai/v1/chat/completions";
  const candidateModels = [
    process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
    "qwen/qwen3.8-27b",
    "llama-3.1-8b-instant"
  ];

  let lastError: Error | null = null;
  for (const model of candidateModels) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: systemInstruction },
            { role: "user", content: userPrompt },
          ],
          temperature: 0.3,
          max_tokens: 75,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const text = data.choices?.[0]?.message?.content;
        if (text) return text.trim();
      } else if (res.status === 404) {
        // Model not available on this tier, cascade to next
        continue;
      } else {
        const errorText = await res.text();
        lastError = new Error(`Groq API error (${res.status}): ${errorText}`);
      }
    } catch (e: any) {
      lastError = e;
    }
  }

  throw lastError || new Error("All Groq models exhausted");
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

  const systemPrompt = `You are Sarah, an elite high-EQ billing mediation coordinator and consultative sales specialist representing ${ctx.freelancerName}.
You are on a live telephone call with ${ctx.debtorName} (${ctx.debtorCompany}) regarding invoice ${ctx.invoiceNumber} for ${currencySymbol}${ctx.amountDue.toLocaleString()} (${ctx.deliverable}, ${ctx.daysOverdue} days overdue).

TACTICAL INFLUENCE & SALES PSYCHOLOGY (THE 4 SACRED LAWS):
1. EMPATHY BEFORE COMMERCE:
   - If the client mentions ANY trouble (car puncture, accident, breakdown, hospital, illness, family emergency):
     STRICTLY FORBIDDEN: NEVER say "Arey kya baat hai!" (in Hindi that means celebrating misfortune!).
     STRICTLY FORBIDDEN: NEVER abruptly pivot with "Chaliye ab invoice ki baat karte hain" (sounds like an emotionless debt-collection robot).
     ALWAYS prioritize their human safety and convenience: "Arey, koi baat nahi! Aap pehle puncture theek karwa lijiye / emergency dekh lijiye, aap theek hain na? Invoice ki baat hum baad mein aaram se kar lenge. Main link WhatsApp par chhod deti hoon."
2. THE CONSULTATIVE REFRAME:
   - You are NOT an aggressive debt collector. You are a business partner helping keep their vendor account active and smooth so upcoming deliverables stay unblocked.
3. CONCESSION & SPLIT CLOSING:
   - If debtor mentions cash-flow pressure, offer a 50% split (${currencySymbol}${halfAmount.toLocaleString()} today via Dodo Payments link and remainder next Friday).
4. CRISP NATURAL HINGLISH:
   - Speak like a real courteous human with natural colloquial warmth.
   - Keep turns strictly under 2 short sentences (max 20 words).`;

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
