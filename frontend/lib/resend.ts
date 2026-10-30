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
  process.env.RESEND_FROM_EMAIL || "RevClaim AI <onboarding@resend.dev>";
const SANDBOX_OWNER_EMAIL = "nishantma05@gmail.com";

/**
 * Builds high-converting HTML settlement notice with Dual-Rail payment options
 */
function generateSettlementHtml(params: ResendEmailParams, note?: string): string {
  const cleanInv = params.invoiceNumber.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
  const vanAccount = `REVC${cleanInv}`;
  const formattedAmount = `₹${params.amount.toLocaleString("en-IN")}`;
  const days = params.daysOverdue || 34;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Payment Reconciliation Notice</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0f172a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #0f172a; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);">
          
          ${note ? `
          <tr>
            <td style="background-color: #fef3c7; padding: 10px 24px; border-bottom: 1px solid #fde68a;">
              <p style="margin: 0; font-size: 11px; color: #92400e; font-family: monospace; font-weight: 600;">
                ℹ️ ${note}
              </p>
            </td>
          </tr>` : ""}

          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%); padding: 28px 32px; border-bottom: 3px solid #6366f1;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <h1 style="margin: 0; color: #ffffff; font-size: 22px; font-weight: 900; letter-spacing: -0.5px;">
                      ⚡ RevClaim AI
                    </h1>
                    <p style="margin: 4px 0 0 0; color: #94a3b8; font-size: 12px;">
                      Autonomous Invoice Recovery & Settlement Network
                    </p>
                  </td>
                  <td align="right">
                    <span style="background: rgba(239, 68, 68, 0.2); color: #fca5a5; border: 1px solid rgba(239, 68, 68, 0.4); padding: 4px 12px; border-radius: 9999px; font-size: 11px; font-weight: 700; font-family: monospace;">
                      OVERDUE • ${days} DAYS
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 32px;">
              <p style="margin: 0 0 16px 0; font-size: 16px; font-weight: 700; color: #0f172a;">
                Dear ${params.clientName},
              </p>
              <p style="margin: 0 0 20px 0; font-size: 14px; line-height: 1.6; color: #475569;">
                This is an automated payment reconciliation notice from <strong>RevClaim AI</strong> regarding outstanding Invoice <strong>#${params.invoiceNumber}</strong>.
              </p>

              <!-- Invoice Summary Box -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 20px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td>
                          <span style="font-size: 11px; color: #64748b; text-transform: uppercase; font-weight: 700; letter-spacing: 0.5px;">Outstanding Balance</span>
                          <div style="font-size: 32px; font-weight: 900; color: #0f172a; margin-top: 4px; font-family: monospace;">
                            ${formattedAmount}
                          </div>
                        </td>
                        <td align="right" valign="top">
                          <span style="font-size: 12px; color: #475569; font-weight: 600;">Due: Immediate (24h)</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Dual Rail Payment Options -->
              <h3 style="margin: 0 0 14px 0; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b;">
                Dual-Rail Settlement Options
              </h3>

              <!-- Rail 1: Instant Card/UPI via Dodo Payments -->
              <div style="background-color: #f5f3ff; border: 1.5px solid #c4b5fd; border-radius: 12px; padding: 20px; margin-bottom: 16px;">
                <div style="font-size: 12px; font-weight: 800; color: #6d28d9; text-transform: uppercase; margin-bottom: 6px;">
                  Rail 1: Instant Online Settlement (10-Second Checkout)
                </div>
                <p style="margin: 0 0 16px 0; font-size: 13px; color: #4c1d95; line-height: 1.5;">
                  Pay instantly via Credit/Debit Cards, UPI, NetBanking or International rails via our secure Dodo Payments Merchant of Record portal.
                </p>
                <div style="text-align: center;">
                  <a href="${params.paymentLink}" style="background-color: #4f46e5; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-size: 14px; font-weight: 700; display: inline-block; box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.3);">
                    Pay ${formattedAmount} via Dodo Payments →
                  </a>
                </div>
              </div>

              <!-- Rail 2: Direct Corporate Bank Wire -->
              <div style="background-color: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 12px; padding: 18px; margin-bottom: 24px;">
                <div style="font-size: 12px; font-weight: 800; color: #334155; text-transform: uppercase; margin-bottom: 8px;">
                  Rail 2: Direct Corporate Bank Wire (NEFT / RTGS / IMPS)
                </div>
                <table role="presentation" width="100%" cellspacing="0" cellpadding="4" style="font-size: 12px; color: #475569; font-family: monospace;">
                  <tr>
                    <td width="35%" style="color: #64748b;">Beneficiary:</td>
                    <td style="font-weight: 700; color: #0f172a;">Nishant Maurya - RevClaim Collection</td>
                  </tr>
                  <tr>
                    <td style="color: #64748b;">Virtual Account:</td>
                    <td style="font-weight: 800; color: #4338ca;">${vanAccount}</td>
                  </tr>
                  <tr>
                    <td style="color: #64748b;">Bank:</td>
                    <td style="color: #0f172a;">HDFC Bank Smart Collect Escrow</td>
                  </tr>
                  <tr>
                    <td style="color: #64748b;">IFSC Code:</td>
                    <td style="font-weight: 700; color: #0f172a;">HDFC0000050</td>
                  </tr>
                </table>
              </div>

              <!-- MSMED Statutory Notice -->
              <div style="background-color: #fef2f2; border: 1px solid #fecaca; border-radius: 10px; padding: 14px 16px;">
                <p style="margin: 0; font-size: 11px; line-height: 1.5; color: #991b1b;">
                  ⚖️ <strong>Statutory Regulatory Notice:</strong> Under Section 16 of the MSMED Act, delayed payments beyond 45 days accrue monthly compound interest at three times the RBI bank rate. Unresolved balances are queued for automated filing with the MSME Samadhaan Facilitation Council.
                </p>
              </div>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 20px 32px; border-top: 1px solid #e2e8f0; text-align: center;">
              <p style="margin: 0 0 6px 0; font-size: 12px; color: #64748b;">
                RevClaim AI Accounts Desk • Autonomous Indic Voice & Settlement Network
              </p>
              <p style="margin: 0; font-size: 11px; color: #94a3b8;">
                Powered by Resend Cloud + viaSocket MCP + LiveKit Cloud
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
  const subject =
    params.subject ||
    `⚡ [URGENT] Overdue Invoice ${params.invoiceNumber} (₹${params.amount.toLocaleString("en-IN")}) — 24h Settlement Notice`;

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
        subject,
        html: generateSettlementHtml(params),
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

      const redirectNote = `[DEMO SANDBOX MODE] Notice originally addressed to debtor: ${targetEmail} (${params.clientName}). Delivered to registered developer inbox: ${SANDBOX_OWNER_EMAIL}`;

      const retryRes = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: RESEND_FROM,
          to: [SANDBOX_OWNER_EMAIL],
          subject: `[Debtor: ${params.clientName}] ${subject}`,
          html: generateSettlementHtml(params, redirectNote),
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
