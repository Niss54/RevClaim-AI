import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  return handleVoice(req);
}

export async function GET(req: NextRequest) {
  return handleVoice(req);
}

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function handleVoice(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const clientName = searchParams.get("clientName") || "there";
  const invoiceNumber = searchParams.get("invoiceNumber") || "INV-1042";
  const amount = searchParams.get("amount") || "5000";
  const phone = searchParams.get("phone") || "+918840301998";

  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL && !process.env.NEXT_PUBLIC_APP_URL.includes("localhost")
      ? process.env.NEXT_PUBLIC_APP_URL
      : "https://rev-claim-ai.vercel.app";

  const rawRespondUrl = `${baseUrl}/api/twilio/voice/respond?clientName=${encodeURIComponent(clientName)}&invoiceNumber=${encodeURIComponent(invoiceNumber)}&amount=${encodeURIComponent(amount)}&phone=${encodeURIComponent(phone)}`;
  const escapedRespondUrl = escapeXml(rawRespondUrl);
  const escapedName = escapeXml(clientName);
  const escapedInvoice = escapeXml(invoiceNumber);
  const escapedAmount = escapeXml(amount);

  // Interactive, high-EQ neural voice opening with real-time DTMF + Speech Recognition Gather
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
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

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "text/xml; charset=utf-8",
      "Cache-Control": "no-store, no-cache, must-revalidate",
    },
  });
}
