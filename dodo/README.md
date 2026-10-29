# Dodo Payments Integration Engine 🦤
> **Merchant of Record (MoR) Integration for RevClaim AI**

## 1. Why Dodo Payments?
Traditional payment gateways (Stripe, Razorpay) require freelancers to handle cross-border tax compliance, VAT/GST registration, and messy dispute paperwork. 

**Dodo Payments acts as the Merchant of Record (MoR):**
- Handles 100% of international and domestic tax calculation & remittance.
- Supports local UPI, NetBanking, and credit/debit cards in 220+ countries.
- Direct checkout URLs can be generated dynamically over API and dispatched over WhatsApp in <1.2 seconds.

---

## 2. Business Model & Pricing Strategy
- **Platform Access:** 100% Free to use. **No win, no fee.**
- **Success Fee:** ₹199 flat (India) or $5 flat (Global) deducted directly via Dodo MoR split settlement when the overdue payment clears.
- **Gross Margins:** 82%+ blended margin against ₹8.55 ($0.10) telephony and voice synthesis cost.

---

## 3. Webhook Lifecycle
```
[Client Clicks WhatsApp Link] 
         │
         ▼
[Completes Payment on Dodo Checkout]
         │
         ▼
[Dodo Fires Webhook to RevClaim AI: /api/webhook/dodo]
         │
         ▼
[Invoice Status Updated: 'RECOVERED']
         │
         ▼
[viaSocket MCP Sends Instant WhatsApp Receipt & Notifies Slack]
```

---

## 4. Testing the Webhook
You can test the end-to-end webhook transition using the test script:
```bash
node dodo/test-webhook.mjs
```
