import { NextRequest, NextResponse } from "next/server";
import { updateInvoiceStatus, markInvoicePaid, getInvoiceById } from "@/lib/db";
import { dispatchWhatsAppPaymentLink } from "@/lib/mcp";
import crypto from "crypto";

function verifyDodoWebhook(rawBody: string, headers: Headers): { valid: boolean; reason?: string } {
  const webhookKey = process.env.DODO_PAYMENTS_WEBHOOK_KEY;
  const signatureHeader = headers.get("webhook-signature");
  const webhookId = headers.get("webhook-id");
  const webhookTimestamp = headers.get("webhook-timestamp");

  // In production or when webhook key is set, enforce strict HMAC-SHA256
  if (webhookKey && signatureHeader && webhookId && webhookTimestamp) {
    try {
      const cleanSecret = webhookKey.replace(/^whsec_/, "");
      const secretBytes = Buffer.from(cleanSecret, "base64");
      const toSign = `${webhookId}.${webhookTimestamp}.${rawBody}`;
      const computedHmac = crypto.createHmac("sha256", secretBytes).update(toSign).digest("base64");
      const expectedSignature = `v1,${computedHmac}`;

      const signatures = signatureHeader.split(" ");
      const match = signatures.includes(expectedSignature);
      if (!match) {
        return { valid: false, reason: "HMAC signature mismatch" };
      }
      return { valid: true };
    } catch (err: any) {
      return { valid: false, reason: `Verification exception: ${err.message}` };
    }
  }

  // If signature header is explicitly provided but key is missing or invalid
  if (signatureHeader && !webhookKey) {
    return { valid: false, reason: "DODO_PAYMENTS_WEBHOOK_KEY not configured on server" };
  }

  // Permissive fallback only in non-production local development without signature headers
  if (process.env.NODE_ENV !== "production" && !signatureHeader) {
    return { valid: true, reason: "Dev local simulation bypass" };
  }

  return { valid: false, reason: "Missing required webhook-signature headers" };
}

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();

    // 1. Strict Cryptographic Webhook Authentication
    const verification = verifyDodoWebhook(rawBody, req.headers);
    if (!verification.valid) {
      console.warn(`[Dodo Webhook 401] Unauthorized webhook request: ${verification.reason}`);
      return NextResponse.json(
        { error: "Unauthorized: Invalid Dodo webhook signature", reason: verification.reason },
        { status: 401 }
      );
    }

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
      let settledInvoice: any = null;
      if (invoiceId) {
        let rawAmount: number | undefined = undefined;
        if (typeof event.data?.amount === "number") {
          const target = getInvoiceById(invoiceId);
          if (target && event.data.amount === (target.amountDue || target.amount || 0) * 100) {
            rawAmount = target.amountDue || target.amount;
          } else if (target && event.data.amount === (target.amountDue || target.amount || 0)) {
            rawAmount = target.amountDue || target.amount;
          } else if (event.data.amount >= 500000) {
            rawAmount = event.data.amount / 100;
          } else {
            rawAmount = event.data.amount;
          }
        }

        settledInvoice = markInvoicePaid(invoiceId, rawAmount);

        if (settledInvoice) {
          // Trigger viaSocket MCP / WhatsApp receipt confirmation
          await dispatchWhatsAppPaymentLink(
            settledInvoice.debtorPhone || settledInvoice.debtor?.phone || "+14155552671",
            settledInvoice.debtorName || settledInvoice.debtor?.contactPerson || "Client",
            settledInvoice.recoveredAmount || settledInvoice.amountDue || 50000,
            `https://checkout.dodopayments.com/receipt/${invoiceId}`
          );
        }
      }

      return NextResponse.json({
        success: true,
        received: true,
        status: "settled",
        invoice: settledInvoice,
        monetization: {
          invoiceId: settledInvoice?.id,
          invoiceNumber: settledInvoice?.invoiceNumber,
          debtorName: settledInvoice?.debtorName || settledInvoice?.debtor?.contactPerson,
          companyName: settledInvoice?.debtorCompany || settledInvoice?.debtor?.companyName,
          currency: settledInvoice?.currency || "INR",
          grossRecovered: settledInvoice?.recoveredAmount ?? 0,
          revclaimPlatformFee: settledInvoice?.revclaimFeeDeducted ?? 0,
          feePercentage: "2.5%",
          gstOnFee18Pct: Math.round((settledInvoice?.revclaimFeeDeducted ?? 0) * 0.18),
          netRemittanceToFreelancer: settledInvoice?.netPayoutToUser ?? 0,
          payoutStatus: settledInvoice?.payoutStatus ?? "REMITTED",
          morGateway: "Dodo Payments Inc.",
          remittanceMechanism: "Escrow Split Direct-to-Bank (Zero Freelancer Leakage)",
        },
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
