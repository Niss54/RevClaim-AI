/**
 * RevClaim AI × Resend Cloud Email Service
 * Autonomous Multi-Rail Invoice Settlement & MSME Notice Engine
 */

export interface ResendEmailParams {
  to: string;
  clientName: string;
  amount: number;
  invoiceNumber: string;
  paymentLink: string;
  subject?: string;
  bodyText?: string;
  daysOverdue?: number;
}

export interface ResendResponse {
  success: boolean;
  messageId?: string;
  recipient: string;
  provider: "resend";
  error?: string;
  sandboxRedirected?: boolean;
}

const RESEND_API_KEY = process.env.RESEND_API_KEY || "";
const RESEND_FROM =
  process.env.RESEND_FROM_EMAIL || "RevClaim Accounts <onboarding@resend.dev>";
const SANDBOX_OWNER_EMAIL = "nishantma05@gmail.com";

/**
 * Builds plain text version for RFC 2046 multipart compliance (dramatically lowers Gmail spam score)
 */
function generateSettlementText(params: ResendEmailParams, note?: string): string {
  const cleanInv = params.invoiceNumber.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
  const vanAccount = `REVC${cleanInv}`;
  const formattedAmount = `INR ${params.amount.toLocaleString("en-IN")}`;

  return `${note ? "--- " + note + " ---\n\n" : ""}Hello ${params.clientName},

Following up on our recent voice conversation with Sarah from RevClaim AI, here are your secure settlement options for Invoice #${params.invoiceNumber}.

SUMMARY:
• Invoice Number: ${params.invoiceNumber}
• Outstanding Balance: ${formattedAmount}
• Status: Pending Clearance
• Direct Payment Link: ${params.paymentLink}

PAYMENT METHODS:

1. Instant Online Checkout (UPI, Debit/Credit Card, NetBanking):
${params.paymentLink}

2. Direct Corporate Bank Wire (NEFT / RTGS / IMPS):
• Beneficiary: Nishant Maurya - RevClaim Collection Escrow
• Virtual Account Number: ${vanAccount}
• Bank: HDFC Bank Smart Collect
• IFSC Code: HDFC0000050

STATUTORY NOTICE:
In compliance with Section 16 of the MSMED Act, prompt reconciliation prevents automated escalation to the MSME Facilitation Council.

If you have any questions or have already initiated the transfer, please reply to this email or message us directly on WhatsApp.

Sincerely,
Sarah — Accounts Desk
RevClaim AI (Autonomous Indic Voice & Settlement Network)
Contact: nishantma05@gmail.com
`;
}

/**
 * Builds clean, professional HTML settlement email
 */
function generateSettlementHtml(params: ResendEmailParams, note?: string): string {
  const cleanInv = params.invoiceNumber.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
  const vanAccount = `REVC${cleanInv}`;
  const formattedAmount = `₹${params.amount.toLocaleString("en-IN")}`;
  const days = params.daysOverdue || 34;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invoice Payment Details</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f1f5f9; padding: 32px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1); border: 1px solid #e2e8f0;">
          
          ${note ? `
          <tr>
            <td style="background-color: #fef3c7; padding: 12px 24px; border-bottom: 1px solid #fde68a;">
              <p style="margin: 0; font-size: 12px; color: #92400e; font-family: monospace; font-weight: 600;">
                ℹ️ ${note}
              </p>
            </td>
          </tr>` : ""}

          <!-- Header -->
          <tr>
            <td style="background-color: #0f172a; padding: 24px 32px; border-bottom: 3px solid #4f46e5;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <h1 style="margin: 0; color: #ffffff; font-size: 20px; font-weight: 800; letter-spacing: -0.5px;">
                      RevClaim AI
                    </h1>
                    <p style="margin: 4px 0 0 0; color: #94a3b8; font-size: 12px;">
                      Autonomous Accounts & Voice Settlement Network
                    </p>
                  </td>
                  <td align="right">
                    <span style="background-color: #dc2626; color: #ffffff; padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: 700; font-family: monospace; text-transform: uppercase;">
                      Overdue • ${days} Days
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 32px;">
              <p style="margin: 0 0 16px 0; font-size: 15px; font-weight: 600; color: #0f172a;">
                Hello ${params.clientName},
              </p>
              <p style="margin: 0 0 20px 0; font-size: 14px; line-height: 1.6; color: #475569;">
                Following up on our recent voice call conversation with Sarah from <strong>RevClaim AI</strong>, here are the official settlement options for Invoice <strong>#${params.invoiceNumber}</strong>.
              </p>

              <!-- Invoice Highlight Box -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; border: 1px solid #cbd5e1; border-radius: 10px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 20px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td>
                          <span style="font-size: 11px; color: #64748b; text-transform: uppercase; font-weight: 700; letter-spacing: 0.5px;">Outstanding Amount</span>
                          <div style="font-size: 30px; font-weight: 900; color: #0f172a; margin-top: 4px; font-family: monospace;">
                            ${formattedAmount}
                          </div>
                        </td>
                        <td align="right" valign="top">
                          <span style="font-size: 12px; color: #475569; font-weight: 600; background: #e2e8f0; padding: 4px 8px; border-radius: 4px;">
                            INV #${params.invoiceNumber}
                          </span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Action Rail 1: Instant Dodo Payments Link -->
              <div style="background-color: #f5f3ff; border: 1px solid #ddd6fe; border-radius: 10px; padding: 20px; margin-bottom: 20px; text-align: center;">
                <div style="font-size: 12px; font-weight: 800; color: #6d28d9; text-transform: uppercase; margin-bottom: 8px; letter-spacing: 0.5px;">
                  Option 1: Instant Checkout (UPI / Card / NetBanking)
                </div>
                <p style="margin: 0 0 16px 0; font-size: 13px; color: #4c1d95; line-height: 1.5;">
                  Pay securely via Dodo Payments Merchant of Record. Settle in under 10 seconds.
                </p>
                <a href="${params.paymentLink}" style="background-color: #4f46e5; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-size: 15px; font-weight: 700; display: inline-block; box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.25);">
                  Pay ${formattedAmount} Now &rarr;
                </a>
              </div>

              <!-- Action Rail 2: Direct Corporate Bank Wire -->
              <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 18px; margin-bottom: 24px;">
                <div style="font-size: 12px; font-weight: 800; color: #334155; text-transform: uppercase; margin-bottom: 8px; letter-spacing: 0.5px;">
                  Option 2: Direct Corporate Bank Wire (NEFT / RTGS / IMPS)
                </div>
                <table role="presentation" width="100%" cellspacing="0" cellpadding="4" style="font-size: 12px; color: #334155; font-family: monospace;">
                  <tr>
                    <td width="35%" style="color: #64748b;">Beneficiary:</td>
                    <td style="font-weight: 700; color: #0f172a;">Nishant Maurya - RevClaim Escrow</td>
                  </tr>
                  <tr>
                    <td style="color: #64748b;">Virtual Account:</td>
                    <td style="font-weight: 800; color: #4338ca;">${vanAccount}</td>
                  </tr>
                  <tr>
                    <td style="color: #64748b;">Bank:</td>
                    <td style="color: #0f172a;">HDFC Bank Smart Collect</td>
                  </tr>
                  <tr>
                    <td style="color: #64748b;">IFSC Code:</td>
                    <td style="font-weight: 700; color: #0f172a;">HDFC0000050</td>
                  </tr>
                </table>
              </div>

              <!-- Compliance Note -->
              <div style="background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 12px 16px; border-radius: 4px; margin-bottom: 20px;">
                <p style="margin: 0; font-size: 12px; line-height: 1.5; color: #1e40af;">
                  <strong>Note:</strong> Under Section 16 of the MSMED Act, timely settlement helps avoid automated reporting to commercial credit bureaus and the MSME Facilitation Council.
                </p>
              </div>

              <p style="margin: 0; font-size: 13px; color: #64748b; line-height: 1.5;">
                Sincerely,<br>
                <strong style="color: #0f172a;">Sarah — Billing Coordinator</strong><br>
                RevClaim AI Accounts Desk
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 18px 32px; border-top: 1px solid #e2e8f0; text-align: center;">
              <p style="margin: 0; font-size: 11px; color: #94a3b8;">
                This message was dispatched autonomously by RevClaim AI on behalf of Nishant Maurya.<br>
                For any queries, please reply directly to this email or message on WhatsApp.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

/**
 * Sends autonomous settlement email via Resend Cloud API
 * Automatically handles sandbox domain restrictions by routing to developer inbox
 */
export async function sendRecoveryEmail(
  params: ResendEmailParams
): Promise<ResendResponse> {
  const targetEmail = params.to?.trim() || SANDBOX_OWNER_EMAIL;
  // Professional, transactional subject without spam triggers (no emojis, no caps like [URGENT])
  const subject =
    params.subject ||
    `Payment Link: Invoice #${params.invoiceNumber} for ${params.clientName} (₹${params.amount.toLocaleString("en-IN")})`;

  console.log(`[Resend] Initiating delivery to ${targetEmail} for ${params.invoiceNumber}`);

  // 1. Attempt primary dispatch to target email
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: RESEND_FROM,
        to: [targetEmail],
        reply_to: SANDBOX_OWNER_EMAIL,
        subject,
        html: generateSettlementHtml(params),
        text: generateSettlementText(params),
      }),
    });

    const data = await res.json();

    if (res.ok && data?.id) {
      console.log(`[Resend] Successfully sent email (${data.id}) to ${targetEmail}`);
      return {
        success: true,
        messageId: data.id,
        recipient: targetEmail,
        provider: "resend",
      };
    }

    // 2. If blocked by Resend unverified domain policy (HTTP 403), gracefully redirect to sandbox owner
    if (res.status === 403 && targetEmail !== SANDBOX_OWNER_EMAIL) {
      console.warn(
        `[Resend Sandbox Notice] Unverified domain cannot receive external emails. Rerouting debtor copy to developer: ${SANDBOX_OWNER_EMAIL}`
      );

      const redirectNote = `Notice originally addressed to: ${targetEmail} (${params.clientName}). Delivered to your verified developer inbox.`;

      const retryRes = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: RESEND_FROM,
          to: [SANDBOX_OWNER_EMAIL],
          reply_to: SANDBOX_OWNER_EMAIL,
          subject: `[Client: ${params.clientName}] ${subject}`,
          html: generateSettlementHtml(params, redirectNote),
          text: generateSettlementText(params, redirectNote),
        }),
      });

      const retryData = await retryRes.json();
      if (retryRes.ok && retryData?.id) {
        console.log(
          `[Resend Sandbox] Successfully delivered demo copy (${retryData.id}) to ${SANDBOX_OWNER_EMAIL}`
        );
        return {
          success: true,
          messageId: retryData.id,
          recipient: SANDBOX_OWNER_EMAIL,
          provider: "resend",
          sandboxRedirected: true,
        };
      }
    }

    return {
      success: false,
      recipient: targetEmail,
      provider: "resend",
      error: data?.message || "Failed to dispatch via Resend",
    };
  } catch (err: any) {
    console.error("[Resend Error]:", err);
    return {
      success: false,
      recipient: targetEmail,
      provider: "resend",
      error: err?.message,
    };
  }
}
