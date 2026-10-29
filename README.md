# RevClaim AI ⚡
> **Autonomous Voice-Calling Invoice Recovery Copilot for Freelancers & SMBs**  
> *Built for Hacker House Goa 2026 (HHGoa) | Team: Pookie Baddies*

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Next.js 15](https://img.shields.io/badge/Next.js-15.1.7-black)](https://nextjs.org/)
[![Dodo Payments](https://img.shields.io/badge/Dodo%20Payments-MoR%20Live-emerald)](https://dodopayments.com)
[![Wispr Flow](https://img.shields.io/badge/Wispr%20Flow-Voice%20Dictated-indigo)](https://wisprflow.ai)
[![viaSocket MCP](https://img.shields.io/badge/viaSocket-MCP%20Connected-purple)](https://viasocket.com)

---

## 💡 Executive Summary & The Problem

Unpaid invoices kill freelance careers and small agencies:
- **56% of small business invoices are overdue** (*Intuit QuickBooks Global Report*).
- **Average amount owed:** **$17,500** per SMB; **$6,000 (₹5,00,000+)** per freelancer.
- **Wasted Time:** Freelancers spend **8.5 hours every month** (15–20 billable days/year) awkwardly chasing payments over WhatsApp and email.
- **Traditional Collections:** Hostile debt agencies charge **30% to 40% contingency cuts** and permanently incinerate client relationships.

**RevClaim AI solves this autonomously:**  
A polite, AI-powered voice agent ("Sarah from Accounts Desk") calls debtors, navigates cash flow objections with flexible split payment schedules, and dispatches instant **Dodo Payments checkout links** via WhatsApp.

---

## 🌟 Key Features

1. **Zero-Confrontation AI Mediation:**  
   Freelancers avoid confrontation anxiety. The AI acts as a polite, third-party accounts desk, preserving client relationships while securing a Promise-to-Pay (PTP).
2. **Dynamic Settlement & Split Payments:**  
   If the client faces a cash crunch, the AI autonomously calculates custom installment terms (e.g., 50% upfront today, remainder next week) or offers early-settlement incentive discounts.
3. **Instant Dodo Payments MoR Integration:**  
   Generates secure, one-click Merchant of Record payment links delivered directly to the client's phone via WhatsApp during or immediately after the call.
4. **viaSocket MCP Multi-Step Orchestration:**  
   Automatically syncs call recordings, transcripts, and PTP commitments to Google Sheets, triggers WhatsApp confirmation receipts, and notifies the freelancer on Slack.
5. **Legally Grounded Defense:**  
   Respects jurisdiction interest penalties (India MSMED Act 2006 Sec 15–16 RBI 3x interest rate / NY & CA Freelance Worker Protection Acts) only as an educational statutory shield during persistent evasion.

---

## 🏆 Hacker House Goa Sponsor Alignments

| Sponsor / Track | Integration & Proof |
| :--- | :--- |
| **Wispr Flow** | Entire codebase architecture, prompts, and documentation orchestrated via voice dictation. Complete speech-to-prompt log available in [`PROMPTS.md`](./PROMPTS.md). |
| **Dodo Payments** | Merchant of Record dynamic checkout generation (`src/lib/dodo.ts`), webhook verification (`src/app/api/webhook/dodo/route.ts`), and instant settlement. |
| **viaSocket MCP** | Automated post-call workflow tools (`src/lib/mcp.ts`): WhatsApp payment dispatch, CRM sync, and payment receipt triggers. |

---

## 🛠️ Tech Stack & Architecture

- **Frontend / Fullstack:** Next.js 15 (App Router), React 19, Tailwind CSS, Lucide Icons.
- **Telephony & Conversational AI:** ElevenLabs Conversational AI + Twilio Voice SIP trunking.
- **Database & State:** Supabase PostgreSQL + fast in-memory caching.
- **Payment Infrastructure:** Dodo Payments MoR SDK.
- **Automation Protocol:** Model Context Protocol (MCP) via viaSocket.

---

## 🚀 Quickstart & Verification

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Verification Test Suite
```bash
npm test
```
All 5 end-to-end integration tests (DB math, PTP NLP regex, Dodo checkout link generation, MCP dispatch, and invoice state transitions) will run deterministically.

### 3. Launch Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to access the **RevClaim AI Mission Control Cockpit**.

---

## 📊 Business Model & Unit Economics

- **Pricing:** 100% Free to use. **No win, no fee.**
- **Success Fee:** Flat ₹199 (Domestic INR) / $5.00 (Global USD) per successfully recovered invoice (or 2% on invoices > ₹25,000 / $1,000).
- **Cost per Recovery Call:** ₹8.55 ($0.10) for 2 minutes of telephony + AI synthesis.
- **Blended Gross Margin:** **82%+**.

---

## 📜 Documentation Dossier
- [Market Research & Evidence](./evaluation/MARKET_RESEARCH_EVIDENCE.md)
- [Competitor Proof & Differentiation](./evaluation/COMPETITOR_AND_MARKET_PROOF.md)
- [Adversarial Judge Defense & Edge Cases](./evaluation/ADVERSARIAL_DEFENSE_AND_EDGE_CASES.md)
- [Wispr Flow Voice Dictation Scripts](./PROMPTS.md)
- [Master Execution Plan](./MASTER_EXECUTION_PLAN.md)
- [Hacker House Goa Guidelines & Rules](./hhgoa/01_HHGOA_RULES_AND_SCHEDULE.md)
