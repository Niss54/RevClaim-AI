import { NextRequest, NextResponse } from "next/server";
import { updateInvoiceStatus, markInvoicePaid, getInvoiceById } from "@/lib/db";
import { dispatchWhatsAppPaymentLink } from "@/lib/mcp";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    let event: any;

    try {
      event = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const eventType = event.type || event.event;
    const metadata = event.data?.metadata || event.metadata || {};
    const invoiceId = metadata.invoiceId || event.data?.invoice_id;

    console.log(`[Dodo Webhook] Received event: ${eventType} for invoice: ${invoiceId}`);

    if (eventType === "payment.succeeded" || eventType === "payment.created") {
      if (invoiceId) {
        const inv = getInvoiceById(invoiceId);
        if (inv) {
          markInvoicePaid(invoiceId);

          // Trigger viaSocket MCP / WhatsApp receipt confirmation
          await dispatchWhatsAppPaymentLink(
            inv.debtorPhone || inv.debtor?.phone || "+14155552671",
            inv.debtorName || inv.debtor?.contactPerson || "Client",
            inv.amount || inv.amountDue || 1500,
            `https://checkout.dodopayments.com/receipt/${invoiceId}`
          );
        }
      }

      return NextResponse.json({
        success: true,
        received: true,
        status: "settled",
      });
    }

    return NextResponse.json({ success: true, ignored: true });
  } catch (error) {
    console.error("[Dodo Webhook Error]:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Webhook processing failed",
      },
      { status: 500 }
    );
  }
}
