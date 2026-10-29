import { NextRequest, NextResponse } from "next/server";
import { createDodoPaymentLink } from "@/lib/dodo";
import { getInvoiceById } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { invoiceId, amount, customerEmail, customerName } = body;

    let targetInvoice = null;
    if (invoiceId) {
      targetInvoice = getInvoiceById(invoiceId);
    }

    const payAmount = amount || targetInvoice?.amount || 1500;
    const email = customerEmail || targetInvoice?.debtorEmail || "finance@client.com";
    const name = customerName || targetInvoice?.debtorName || "Valued Client";

    const session = await createDodoPaymentLink({
      invoiceId: invoiceId || "INV-MANUAL",
      amount: payAmount,
      customerEmail: email,
      customerName: name,
    });

    return NextResponse.json({
      success: true,
      checkoutUrl: session.checkoutUrl,
      paymentId: session.paymentId,
      amount: payAmount,
      currency: "USD",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to create checkout",
      },
      { status: 500 }
    );
  }
}
