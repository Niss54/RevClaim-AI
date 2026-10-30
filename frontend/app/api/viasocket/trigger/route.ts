import { NextRequest, NextResponse } from "next/server";
import {
  dispatchViaSocketWhatsApp,
  dispatchViaSocketSettlement,
  syncDebtorToViaSocketDb,
} from "@/lib/viasocket";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Support both wrapped { action, payload } and direct flat payloads from UI components
    const action = body.action || "whatsapp";
    const payload = body.payload || {
      phone: body.debtorPhone || body.phone || "+918840301998",
      clientName: body.debtorName || body.clientName || "Nishant Maurya",
      amount: Number(body.amountDue || body.amount || 5000),
      invoiceNumber: body.invoiceNumber || "INV-2026-NISHANT-LIVE",
      paymentLink: body.checkoutUrl || body.paymentLink || "https://test.checkout.dodopayments.com/JMiVINHG",
      invoiceId: body.invoiceId || "inv-live-nishant",
    };

    if (action === "whatsapp") {
      const res = await dispatchViaSocketWhatsApp(payload);
      return NextResponse.json({
        ...res,
        waLink: `https://wa.me/${(payload.phone || "").replace(/\D/g, "")}?text=${encodeURIComponent(
          `Namaste ${payload.clientName}, RevClaim AI notice: Please settle invoice ${payload.invoiceNumber} (₹${payload.amount}) securely at: ${payload.paymentLink} within 24 hours.`
        )}`,
      });
    }

    if (action === "settlement") {
      const res = await dispatchViaSocketSettlement(payload);
      return NextResponse.json(res);
    }

    if (action === "db_sync") {
      const res = await syncDebtorToViaSocketDb(payload);
      return NextResponse.json(res);
    }

    return NextResponse.json(
      { success: false, error: `Unknown action: ${action}` },
      { status: 400 }
    );
  } catch (error) {
    console.error("[viaSocket API Route Error]:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to execute viaSocket workflow",
      },
      { status: 500 }
    );
  }
}
