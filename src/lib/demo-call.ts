import { Invoice, CallResult } from "./types";

export function buildSimulatedCallResult(invoice: Invoice): CallResult {
  const firstName = invoice.debtor.contactPerson.split(" ")[0];
  const halfAmount = Math.round(invoice.amountDue / 2);

  return {
    summary: `Called ${invoice.debtor.contactPerson} at ${invoice.debtor.companyName}. Verified identity and discussed invoice ${invoice.invoiceNumber}. Debtor noted a temporary cash crunch; RevClaim AI negotiated a 50% split payment commitment of ₹${halfAmount.toLocaleString()} to be cleared today via Dodo link, with remainder scheduled for next Friday.`,
    ptpAmount: halfAmount,
    ptpDate: "Today (Split 50%)",
    confidence: "high",
    transcript: [
      {
        role: "agent",
        message: `Hello, am I speaking with ${firstName} from ${invoice.debtor.companyName}?`,
        timestamp: "00:03"
      },
      {
        role: "debtor",
        message: `Yes, this is ${firstName}. Who is calling?`,
        timestamp: "00:07"
      },
      {
        role: "agent",
        message: `Hi ${firstName}, this is Sarah calling on behalf of DevStudio's Accounts team regarding invoice ${invoice.invoiceNumber} for ₹${invoice.amountDue.toLocaleString()} for the ${invoice.deliverableSummary}, which was due on ${invoice.dueDate}.`,
        timestamp: "00:15"
      },
      {
        role: "debtor",
        message: `Oh right, I apologize. Things have been really tight for us this month with delayed client retainers. I cannot clear the entire amount today.`,
        timestamp: "00:26"
      },
      {
        role: "agent",
        message: `We completely understand cash flow crunches, ${firstName}. Would you be able to clear 50% today (₹${halfAmount.toLocaleString()}), and we can schedule the remaining balance for next Friday?`,
        timestamp: "00:36"
      },
      {
        role: "debtor",
        message: `Yes, I can definitely do ₹${halfAmount.toLocaleString()} today. Can you send me the payment link?`,
        timestamp: "00:44"
      },
      {
        role: "agent",
        message: `Perfect! I have just dispatched the secure Dodo checkout link to your WhatsApp and on screen. Thank you for your commitment, ${firstName}!`,
        timestamp: "00:52"
      }
    ]
  };
}
