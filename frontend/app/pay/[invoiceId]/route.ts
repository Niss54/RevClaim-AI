import { NextRequest, NextResponse } from "next/server";
import { createDodoPaymentLink } from "@/lib/dodo";
import { getInvoiceById } from "@/lib/db";
import { INITIAL_INVOICES } from "@/lib/demo-data";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ invoiceId: string }> }
) {
  try {
    const { invoiceId } = await context.params;

    // Look up invoice details
    let invoice = getInvoiceById(invoiceId);
    if (!invoice) {
      invoice =
        INITIAL_INVOICES.find(
          (i) =>
            i.id === invoiceId ||
            i.invoiceNumber.toLowerCase() === invoiceId.toLowerCase()
        ) || null;
    }

    const amount = invoice?.amountDue || invoice?.amount || 5000;
    const email =
      invoice?.debtorEmail ||
      invoice?.debtor?.email ||
      "nishantma05@gmail.com";
    const name =
      invoice?.debtorName ||
      invoice?.debtor?.contactPerson ||
      "Valued Client";

    // Provision a brand new, non-expired checkout session on the fly
    const session = await createDodoPaymentLink({
      invoiceId: invoiceId || "INV-1042",
      amount,
      customerEmail: email,
      customerName: name,
    });

    if (session?.checkoutUrl) {
      return NextResponse.redirect(session.checkoutUrl, 307);
    }

    return NextResponse.redirect(
      "https://test.checkout.dodopayments.com/caPOfBRz",
      307
    );
  } catch (error) {
    console.error("[Pay Dynamic Route Error]:", error);
    return NextResponse.redirect(
      "https://test.checkout.dodopayments.com/caPOfBRz",
      307
    );
  }
}
