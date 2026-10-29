import { Invoice } from "./types";
import { DodoPayments } from "dodopayments";

export interface DodoCheckoutSession {
  checkoutUrl: string;
  sessionId: string;
}

/**
 * Returns an instance of the official DodoPayments SDK client if API key exists.
 */
function getDodoClient(): DodoPayments | null {
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
      const payment = await client.payments.create({
        billing: {
          city: "Goa",
          country: "IN",
          state: "GA",
          street: "Tech Village",
          zipcode: "403001",
        },
        customer: {
          email: params.customerEmail,
          name: params.customerName,
        },
        payment_link: true,
        product_cart: [
          {
            product_id: `prod_inv_${params.invoiceId.slice(0, 8)}`,
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
    checkoutUrl: `https://checkout.dodopayments.com/buy/p_${params.invoiceId}?amount=${params.amount}&email=${encodeURIComponent(params.customerEmail)}`,
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
      const payment = await client.payments.create({
        billing: {
          city: "Goa",
          country: "IN",
          state: "GA",
          street: "Tech Village",
          zipcode: "403001",
        },
        customer: {
          email: invoice.debtor?.email || invoice.debtorEmail || "billing@client.com",
          name: invoice.debtor?.contactPerson || invoice.debtorName || "Client",
        },
        payment_link: true,
        product_cart: [
          {
            product_id: `prod_inv_${invoice.id.slice(0, 8)}`,
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
    checkoutUrl: `https://checkout.dodopayments.com/buy/p_inv_${invoice.id}?demo=true&amount=${invoice.amountDue || invoice.amount || 1000}`,
    sessionId: `dodo_sess_${Date.now()}`,
  };
}
