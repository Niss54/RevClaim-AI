import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { orchestrateRecoveryCall } from "@/lib/voice-orchestrator";
import { createCallRecord, completeCallRecord } from "@/lib/call-store";
import { buildSimulatedCallResult } from "@/lib/demo-call";
import { triggerMcpRecoveryActions } from "@/lib/mcp";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { invoiceId, mode = "demo", channel = "auto" } = body;

    const invoice = db.getInvoice(invoiceId);
    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    db.updateInvoiceStatus(invoiceId, "CALLING");

    if (mode === "demo") {
      // Simulate call flow
      const callRecord = createCallRecord({
        invoiceId: invoice.id,
        debtorName: invoice.debtor?.contactPerson || invoice.debtorName || "Client",
        debtorPhone: invoice.debtor?.phone || invoice.debtorPhone || "+14155552671",
        mode: "demo",
        conversationId: `sim_conv_${Date.now()}`
      });

      // Complete simulation with PTP commitment
      const result = buildSimulatedCallResult(invoice);
      completeCallRecord(callRecord.id, result);
      db.updateInvoiceStatus(invoiceId, "PTP_AGREED", {
        ptpAmount: result.ptpAmount,
        ptpDate: result.ptpDate
      });

      // Trigger MCP actions
      await triggerMcpRecoveryActions(invoice, invoice.paymentLinkUrl || "https://checkout.dodopayments.com");

      return NextResponse.json({
        success: true,
        call: {
          ...callRecord,
          status: "completed",
          result
        }
      });
    }

    // Live Multi-Engine Voice Call (Twilio, Gnani.ai Indic, or ElevenLabs)
    const voiceResult = await orchestrateRecoveryCall({
      invoice,
      preferredChannel: channel,
    });

    const callRecord = createCallRecord({
      invoiceId: invoice.id,
      debtorName: invoice.debtor?.contactPerson || invoice.debtorName || "Client",
      debtorPhone: invoice.debtor?.phone || invoice.debtorPhone || "+14155552671",
      mode: "live",
      conversationId: voiceResult.sessionId,
      callSid: voiceResult.sessionId,
    });

    return NextResponse.json({
      success: true,
      call: callRecord,
      voiceEngine: voiceResult.engine,
      channel: voiceResult.channel,
      details: voiceResult.details,
    });

    return NextResponse.json({
      success: true,
      call: callRecord
    });
  } catch (error: any) {
    console.error("Call initiation error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to initiate call" },
      { status: 500 }
    );
  }
}
