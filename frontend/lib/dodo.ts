import { Invoice } from "./types";
import { DodoPayments } from "dodopayments";

export interface DodoCheckoutSession {
  checkoutUrl: string;
  sessionId: string;
}

// Product cache for pre-provisioned demo invoices
const KNOWN_DODO_PRODUCTS: Record<string, string> = {
  "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa": "pdt_0Nqnu5MxxMMlvyKjHbKI8",
  "INV-1042": "pdt_0Nqnu5MxxMMlvyKjHbKI8",
  "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb": "pdt_0Nqnu9eAmQSMlropPTKEd",
  "INV-1043": "pdt_0Nqnu9eAmQSMlropPTKEd",
  "cccccccc-cccc-cccc-cccc-cccccccccccc": "pdt_0Nqnu9fxqD4yyJh1Pu8Vr",
  "INV-1044": "pdt_0Nqnu9fxqD4yyJh1Pu8Vr",
};

/**
 * Returns an instance of the official DodoPayments SDK client if API key exists.
 */
export function getDodoClient(): DodoPayments | null {
  const apiKey = process.env.DODO_PAYMENTS_API_KEY;
  if (!apiKey || apiKey.includes("your_dodo")) {
    return null;
  }
  const environment =
    process.env.DODO_PAYMENTS_ENVIRONMENT === "live_mode" ? "live_mode" : "test_mode";

  return new DodoPayments({
    bearerToken: apiKey,
    environment,
  });
}

/**
 * Ensures a valid product exists in Dodo Payments for the given invoice
 */
async function ensureDodoProduct(
  client: DodoPayments,
  invoiceId: string,
  invoiceNumber: string,
  amount: number,
  currency: string = "INR"
): Promise<string> {
  // Check pre-registered products
  if (KNOWN_DODO_PRODUCTS[invoiceId]) return KNOWN_DODO_PRODUCTS[invoiceId];
  if (KNOWN_DODO_PRODUCTS[invoiceNumber]) return KNOWN_DODO_PRODUCTS[invoiceNumber];

  try {
    const product = await client.products.create({
      name: `Invoice Settlement ${invoiceNumber || invoiceId.slice(0, 8)}`,
      description: "RevClaim AI Autonomous Invoice Settlement & PTP Enforcement",
      price: {
        currency: (currency.toUpperCase() as "INR" | "USD" | "EUR" | "GBP") || "INR",
        price: Math.round(amount * 100),
        type: "one_time_price",
      },
      tax_category: "saas",
    });

    // Attach official RevClaim logo to the newly created Dodo product
    try {
      const imgResp = await client.products.images.update(product.product_id);
      if (imgResp?.url && typeof window === "undefined") {
        const fs = await import("fs");
        const path = await import("path");
        const logoPath = path.join(process.cwd(), "public", "logo2.png");
        if (fs.existsSync(logoPath)) {
          const fileBuf = fs.readFileSync(logoPath);
          await fetch(imgResp.url, {
            method: "PUT",
            body: fileBuf,
            headers: { "Content-Type": "image/png" },
          });
        }
      }
    } catch {
      // non-fatal image attachment
    }

    KNOWN_DODO_PRODUCTS[invoiceId] = product.product_id;
    return product.product_id;
  } catch (err: any) {
    console.warn("[Dodo Product Provision Warning]:", err.message);
    // Fallback to first pre-registered product
    return "pdt_0Nqnu5MxxMMlvyKjHbKI8";
  }
}

/**
 * Creates dynamic Dodo checkout link for settlement
 */
export async function createDodoPaymentLink(params: {
  invoiceId: string;
  amount: number;
  customerEmail: string;
  customerName: string;
}): Promise<{ checkoutUrl: string; paymentId: string }> {
  const client = getDodoClient();

  if (client) {
    try {
      const productId = await ensureDodoProduct(
        client,
        params.invoiceId,
        `INV-${params.invoiceId.slice(0, 4)}`,
        params.amount
      );

      const payment = await client.payments.create({
        billing: {
          city: "Panaji",
          country: "IN",
          state: "GA",
          street: "Candolim Tech Hub",
          zipcode: "403515",
        },
        customer: {
          email: params.customerEmail || "finance@client.com",
          name: params.customerName || "Valued Client",
        },
        payment_link: true,
        product_cart: [
          {
            product_id: productId,
            amount: Math.round(params.amount * 100), // in paise/cents
            quantity: 1,
          },
        ],
        return_url:
          process.env.DODO_PAYMENTS_RETURN_URL ||
          `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/settlement/success`,
      });

      if (payment.payment_link) {
        return {
          checkoutUrl: payment.payment_link,
          paymentId: payment.payment_id,
        };
      }
    } catch (err: any) {
      console.warn("[Dodo SDK Warning, falling back to direct checkout URL]:", err.message);
    }
  }

  // Fallback direct checkout link
  return {
    checkoutUrl: `https://test.checkout.dodopayments.com/buy/p_${params.invoiceId}?amount=${params.amount}&email=${encodeURIComponent(params.customerEmail)}`,
    paymentId: `dodo_${Date.now()}`,
  };
}

/**
 * Creates full checkout session with metadata
 */
export async function createDodoCheckoutSession(invoice: Invoice): Promise<DodoCheckoutSession> {
  const client = getDodoClient();

  if (client) {
    try {
      const productId = await ensureDodoProduct(
        client,
        invoice.id,
        invoice.invoiceNumber,
        invoice.amountDue || invoice.amount || 1000,
        invoice.currency || "INR"
      );

      const payment = await client.payments.create({
        billing: {
          city: "Panaji",
          country: "IN",
          state: "GA",
          street: "Candolim Tech Hub",
          zipcode: "403515",
        },
        customer: {
          email: invoice.debtor?.email || invoice.debtorEmail || "billing@client.com",
          name: invoice.debtor?.contactPerson || invoice.debtorName || "Client",
        },
        payment_link: true,
        product_cart: [
          {
            product_id: productId,
            amount: Math.round((invoice.amountDue || invoice.amount || 1000) * 100),
            quantity: 1,
          },
        ],
        return_url:
          process.env.DODO_PAYMENTS_RETURN_URL ||
          `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/settlement/success`,
        metadata: {
          invoiceId: invoice.id,
          invoiceNumber: invoice.invoiceNumber,
        },
      });

      if (payment.payment_link) {
        return {
          checkoutUrl: payment.payment_link,
          sessionId: payment.payment_id,
        };
      }
    } catch (err: any) {
      console.warn("[Dodo SDK create failed, fallback to direct URL]:", err.message);
    }
  }

  // Demo fallback checkout link
  return {
    checkoutUrl: `https://test.checkout.dodopayments.com/buy/p_inv_${invoice.id}?demo=true&amount=${invoice.amountDue || invoice.amount || 1000}`,
    sessionId: `dodo_sess_${Date.now()}`,
  };
}
