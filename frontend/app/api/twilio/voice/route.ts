import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  return handleVoice(req);
}

export async function GET(req: NextRequest) {
  return handleVoice(req);
}

function handleVoice(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const clientName = searchParams.get("clientName") || "there";
  const invoiceNumber = searchParams.get("invoiceNumber") || "INV-1042";
  const amount = searchParams.get("amount") || "5000";

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Aditi" language="en-IN">
    Hello ${clientName}! This is Sarah calling from RevClaim AI accounts desk regarding invoice ${invoiceNumber} reconciliation.
  </Say>
  <Pause length="1"/>
  <Say voice="Polly.Aditi" language="hi-IN">
    Namaste! Humne aapka direct Dodo Payments settlement link aapke WhatsApp aur verified email par bhej diya hai. Aap UPI, card, ya installment schedule se balance clear kar sakte hain.
  </Say>
  <Pause length="1"/>
  <Say voice="Polly.Aditi" language="en-IN">
    Thank you so much, and have a wonderful day!
  </Say>
</Response>`.trim();

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "text/xml; charset=utf-8",
      "Cache-Control": "no-store, no-cache, must-revalidate",
    },
  });
}
