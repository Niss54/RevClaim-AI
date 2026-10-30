import { NextRequest, NextResponse } from "next/server";
import { generateNegotiationTurn, isHindiOrHinglish } from "@/lib/llm";

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function POST(req: NextRequest) {
  return handleRespond(req);
}

export async function GET(req: NextRequest) {
  return handleRespond(req);
}

async function handleRespond(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const clientName = searchParams.get("clientName") || "there";
  const invoiceNumber = searchParams.get("invoiceNumber") || "INV-1042";
  const amount = searchParams.get("amount") || "5000";
  const phone = searchParams.get("phone") || "+918840301998";

  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL && !process.env.NEXT_PUBLIC_APP_URL.includes("localhost")
      ? process.env.NEXT_PUBLIC_APP_URL
      : "https://rev-claim-ai.vercel.app";

  const rawNextRespondUrl = `${baseUrl}/api/twilio/voice/respond?clientName=${encodeURIComponent(clientName)}&invoiceNumber=${encodeURIComponent(invoiceNumber)}&amount=${encodeURIComponent(amount)}&phone=${encodeURIComponent(phone)}`;
  const escapedNextRespondUrl = escapeXml(rawNextRespondUrl);
  const escapedName = escapeXml(clientName);
  const escapedInvoice = escapeXml(invoiceNumber);
  const escapedAmount = escapeXml(amount);

  let speechResult = "";

  if (req.method === "POST") {
    try {
      const contentType = req.headers.get("content-type") || "";
      if (contentType.includes("form")) {
        const formData = await req.formData();
        speechResult = (formData.get("SpeechResult") as string) || (formData.get("Digits") as string) || "";
      } else if (contentType.includes("json")) {
        const json = await req.json();
        speechResult = json.SpeechResult || json.speechResult || json.Digits || "";
      }
    } catch (e) {
      console.warn("[Twilio Respond] Could not parse body:", e);
    }
  }

  if (!speechResult) {
    speechResult = searchParams.get("SpeechResult") || searchParams.get("Digits") || "";
  }

  console.log(`[Twilio Conversational AI] Client spoken/dtmf input: "${speechResult}"`);

  // If user said nothing or silence timed out
  if (!speechResult.trim()) {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Gather input="dtmf speech" action="${escapedNextRespondUrl}" method="POST" speechTimeout="auto" timeout="5" language="hi-IN">
    <Say voice="Polly.Aditi" language="hi-IN">
      Ji ${escapedName}, main aapki aawaz nahi sun paayi. Kripya bataiye, kya hum invoice ${escapedInvoice} ke payment par baat kar sakte hain?
    </Say>
  </Gather>
  <Say voice="Polly.Aditi" language="hi-IN">
    Koi baat nahi. Humne direct settlement link aapke WhatsApp aur email par bhej diya hai. Aap wahan se clear kar sakte hain. Dhanyawaad!
  </Say>
</Response>`.trim();

    return new NextResponse(xml, {
      headers: { "Content-Type": "text/xml; charset=utf-8" },
    });
  }

  // Generate high-EQ empathetic conversational response via Groq LPU / Gemini Flash
  let replyText = "";
  try {
    const llmRes = await generateNegotiationTurn({
      debtorName: clientName,
      debtorCompany: "Client",
      invoiceNumber,
      amountDue: Number(amount) || 5000,
      currency: "INR",
      daysOverdue: 14,
      deliverable: "Deliverables & Services",
      freelancerName: "Nishant Maurya",
      conversationHistory: [],
      clientLastMessage: speechResult,
    });
    replyText = llmRes.reply;
  } catch (err: any) {
    console.error("[Twilio LLM Turn Error]:", err);
    replyText = `Main samajh sakti hoon ${clientName} ji. Humne aapke liye 50% split option payment link par open rakha hai. Maine link aapke WhatsApp par share kar diya hai.`;
  }

  const isHindi = isHindiOrHinglish(replyText);
  const voiceLang = isHindi ? "hi-IN" : "en-IN";
  const escapedReply = escapeXml(replyText);

  // Check if caller wants to conclude call
  const isExit =
    /bye|alvida|shukriya|dhanyawad|done|theek hai rakho|thank you|call cut|rakh raha/i.test(speechResult) ||
    /shubh ho|have a wonderful day|dhanyawaad/i.test(replyText);

  let xml: string;
  if (isExit) {
    xml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Aditi" language="${voiceLang}">
    ${escapedReply}
  </Say>
  <Pause length="1"/>
  <Say voice="Polly.Aditi" language="hi-IN">
    Aapka bahut-bahut dhanyawaad! Payment link aapke WhatsApp aur email par ready hai. Have a wonderful day!
  </Say>
  <Hangup/>
</Response>`.trim();
  } else {
    xml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Gather input="dtmf speech" action="${escapedNextRespondUrl}" method="POST" speechTimeout="auto" timeout="6" language="hi-IN">
    <Say voice="Polly.Aditi" language="${voiceLang}">
      ${escapedReply}
    </Say>
  </Gather>
  <Say voice="Polly.Aditi" language="hi-IN">
    Theek hai ${escapedName} ji, humne direct settlement link aapke WhatsApp aur email par drop kar diya hai. Aap aaram se verify kar ke clear kar sakte hain. Dhanyawaad!
  </Say>
</Response>`.trim();
  }

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "text/xml; charset=utf-8",
      "Cache-Control": "no-store, no-cache, must-revalidate",
    },
  });
}
