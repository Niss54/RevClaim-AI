import { Invoice } from "./types";

export interface DodoCheckoutSession {
  checkoutUrl: string;
  sessionId: string;
}

export async function createDodoPaymentLink(params: {
  invoiceId: string;
  amount: number;
  customerEmail: string;
  customerName: string;
}): Promise<{ checkoutUrl: string; paymentId: string }> {
  return {
    checkoutUrl: `https://checkout.dodopayments.com/buy/p_${params.invoiceId}?amount=${params.amount}&email=${encodeURIComponent(params.customerEmail)}`,
    paymentId: `dodo_${Date.now()}`
  };
}

export async function createDodoCheckoutSession(invoice: Invoice): Promise<DodoCheckoutSession> {
  const apiKey = process.env.DODO_PAYMENTS_API_KEY;

  // Fallback demo checkout link if no API key is configured
  if (!apiKey || apiKey.includes("your_dodo")) {
    return {
      checkoutUrl: `https://checkout.dodopayments.com/buy/p_inv_${invoice.id}?demo=true&amount=${invoice.amountDue}`,
      sessionId: `dodo_sess_${Date.now()}`
    };
  }

  try {
    const res = await fetch("https://api.dodopayments.com/v1/checkouts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        product_cart: [
          {
            product_id: `prod_invoice_${invoice.id}`,
            name: `Invoice Settlement ${invoice.invoiceNumber}`,
            amount: invoice.amountDue * 100, // in cents/paise
            quantity: 1
          }
        ],
        billing: {
          name: invoice.debtor?.contactPerson || invoice.debtorName || "Client",
          email: invoice.debtor?.email || invoice.debtorEmail || "billing@client.com",
          phone_number: invoice.debtor?.phone || invoice.debtorPhone || "+14155552671"
        },
        return_url: process.env.DODO_PAYMENTS_RETURN_URL || "http://localhost:3000/settlement/success",
        metadata: {
          invoiceId: invoice.id,
          invoiceNumber: invoice.invoiceNumber
        }
      })
    });

    if (!res.ok) {
      const err = await res.text();
      console.warn("Dodo API failed, using fallback:", err);
      return {
        checkoutUrl: `https://checkout.dodopayments.com/buy/p_inv_${invoice.id}?fallback=true`,
        sessionId: `dodo_fallback_${Date.now()}`
      };
    }

    const data = await res.json();
    return {
      checkoutUrl: data.checkout_url || data.url,
      sessionId: data.session_id || data.id
    };
  } catch (error) {
    console.warn("Dodo request error:", error);
    return {
      checkoutUrl: `https://checkout.dodopayments.com/buy/p_inv_${invoice.id}?fallback=true`,
      sessionId: `dodo_fallback_${Date.now()}`
    };
  }
}
