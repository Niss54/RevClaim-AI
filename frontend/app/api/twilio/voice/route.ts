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
  const invoiceNumber = searchParams.get("invoiceNumber") || "your pending invoice";

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Joanna" language="en-US">
    Hello ${clientName}! This is Sarah calling from RevClaim AI accounts desk regarding invoice ${invoiceNumber} reconciliation.
  </Say>
  <Pause length="1"/>
  <Say voice="Polly.Joanna" language="en-US">
    We have dispatched your direct Dodo Payments settlement link directly to your WhatsApp and verified email. You can clear the balance via UPI, card, or request an installment schedule anytime.
  </Say>
  <Pause length="1"/>
  <Say voice="Polly.Joanna" language="en-US">
    Thank you so much, and have a wonderful day!
  </Say>
</Response>`.trim();

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "text/xml",
      "Cache-Control": "no-store",
    },
  });
}
