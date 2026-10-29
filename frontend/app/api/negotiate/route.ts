import { NextRequest, NextResponse } from "next/server";
import { generateNegotiationTurn, NegotiationContext } from "@/lib/llm";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const ctx: NegotiationContext = {
      debtorName: body.debtorName || "Rahul Sharma",
      debtorCompany: body.debtorCompany || "Acme Creative Studios",
      invoiceNumber: body.invoiceNumber || "INV-1042",
      amountDue: Number(body.amountDue || body.amount || 45000),
      currency: body.currency || "INR",
      daysOverdue: Number(body.daysOverdue || 14),
      deliverable: body.deliverable || "Figma UI/UX Design System",
      freelancerName: body.freelancerName || "Nishant Maurya",
      conversationHistory: Array.isArray(body.conversationHistory) ? body.conversationHistory : [],
      clientLastMessage: body.clientLastMessage || body.message || "Hello",
    };

    const startTime = Date.now();
    const result = await generateNegotiationTurn(ctx);
    const totalLatency = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      reply: result.reply,
      modelUsed: result.modelUsed,
      latencyMs: result.latencyMs || totalLatency,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("[API Negotiate Error]:", error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Failed to generate negotiation turn",
      },
      { status: 500 }
    );
  }
}
