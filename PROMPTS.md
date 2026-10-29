# 🎙️ RevClaim AI — Wispr Flow Voice Engineering Dossier (`PROMPTS.md`)

> **Purpose:** Voice dictation prompts used to architect, build, and orchestrate RevClaim AI.  
> **How to Use:** Dictate these prompts into the **Antigravity IDE / Cursor** using **Wispr Flow**. Capture screenshots showing Wispr Flow's microphone dictation bar and analytics (WPM, total words) for the official `WISPR_EVIDENCE.md` audit dossier.

---

### 🎙️ Commit #1 Prompt (Phase 1: Next.js 15 App Router Scaffolding)
* **Estimated Words:** 180 words | **Target Cadence:** ~90 WPM  
* **Wispr Flow Dictation Script:**  
> *"Hey pair programmer, let's scaffold the root Next.js 15 App Router architecture for RevClaim AI. We need a clean TypeScript setup with Tailwind CSS, Lucide React icons, and a dark mode aesthetic matching Linear and DispatcherAI. Set up the root layout with Inter font, configure the globals CSS with modern slate and zinc design tokens, create the base page with an instant ROI calculator hero section, and create a types directory with core data models for Invoices, Debtors, CallSessions, and Dodo checkout payloads. Make sure package.json has scripts for dev, build, lint, and test, and verify that npm run build passes with zero TypeScript warnings."*

---

### 🎙️ Commit #2 Prompt (Phase 2: Supabase Data Layer & Schema)
* **Estimated Words:** 195 words | **Target Cadence:** ~95 WPM  
* **Wispr Flow Dictation Script:**  
> *"Now let's build the complete Supabase PostgreSQL database layer in lib db ts and schema sql. We need five core relational tables: organizations for freelance agencies, debtors for delinquent client profiles with risk tiers, invoices with invoice number, amount due, days past due, and deliverable summary, call sessions with call SID, sentiment, duration, and JSONB transcripts, and settlements for Dodo payment confirmations. Implement helper functions for creating invoices, fetching overdue debts, logging Promise-to-Pay commitments, and updating settlement status. Also provide a realistic seed dataset in demo data ts with three sample clients like Acme Corp and TechStart so evaluators can test instantly."*

---

### 🎙️ Commit #3 Prompt (Phase 3: ElevenLabs Conversational Voice Engine)
* **Estimated Words:** 210 words | **Target Cadence:** ~92 WPM  
* **Wispr Flow Dictation Script:**  
> *"Let's implement the outbound telephony caller in lib elevenlabs ts and app api call route ts. Integrate ElevenLabs Conversational AI outbound call endpoint at api elevenlabs io slash v1 slash convai slash twilio slash outbound call. We need to pass dynamic client variables including debtor first name, invoice number, amount due, days past due, and live Dodo payment link. Set up the POST route to validate the invoice ID, resolve the ElevenLabs agent ID, trigger the Twilio call, and return the call SID and conversation ID. Also implement a status polling endpoint at api call id route ts and an HMAC SHA256 webhook signature verifier to securely receive post-call transcripts."*

---

### 🎙️ Commit #4 Prompt (Phase 4: B2B Debt Negotiation Prompts & PTP State Machine)
* **Estimated Words:** 225 words | **Target Cadence:** ~88 WPM  
* **Wispr Flow Dictation Script:**  
> *"Let's build the domain-specific debt negotiation prompt engine in lib prompts ts adapted from our fintech research. We need a strict five-rule prompt: first, verify identity by first name before mentioning any financial details; second, cite the exact project deliverable and days overdue; third, handle hardship empathetically by offering fifty-percent split payments; fourth, cite statutory compliance under Indian MSMED Act Section 16 and US Prompt Payment acts to prevent compounding late interest; and fifth, secure a binding Promise-to-Pay commitment with exact amount and date. Create a deterministic parser that extracts promised amounts and settlement dates from raw conversation transcripts."*

---

### 🎙️ Commit #5 Prompt (Phase 5: Interactive In-Browser Demo Simulation Engine)
* **Estimated Words:** 190 words | **Target Cadence:** ~94 WPM  
* **Wispr Flow Dictation Script:**  
> *"Implement the dual-mode interactive simulation engine in lib demo call ts. When an evaluator or hackathon judge tests RevClaim AI without connecting active Twilio credentials or dialing real phone numbers, the platform must seamlessly fall back to an interactive browser simulation. Generate realistic simulated call stages from ringing to debtor pickup, live dual-speaker transcript stream with Sarah from Accounts and Rahul from client, hardship negotiation of twenty-five thousand rupees, and automated Promise-to-Pay commitment capture. Ensure the cockpit UI renders the exact same audio visualizer and settlement state."*

---

### 🎙️ Commit #6 Prompt (Phase 6: Dodo Payments Checkout & Webhook Settlement)
* **Estimated Words:** 215 words | **Target Cadence:** ~91 WPM  
* **Wispr Flow Dictation Script:**  
> *"Let's integrate the Dodo Payments Merchant of Record billing engine in lib dodo ts and app api checkout route ts and app api webhook dodo route ts. Use the official Dodo Payments Next.js SDK to dynamically create checkout sessions with product name, amount due, currency, and customer phone number. Implement the POST webhook listener that verifies Dodo webhook signatures, listens for onPaymentSucceeded events, extracts the invoice ID from payment metadata, marks the invoice as RECOVERED in the database, and logs the one hundred ninety-nine rupee RevClaim success fee. Also generate a shareable shortlink and QR code for instant settlement."*

---

### 🎙️ Commit #7 Prompt (Phase 7: viaSocket MCP Workflow Automation)
* **Estimated Words:** 185 words | **Target Cadence:** ~90 WPM  
* **Wispr Flow Dictation Script:**  
> *"Now connect viaSocket MCP in lib mcp ts and app api mcp sync route ts. When a call session completes with an agreed Promise-to-Pay commitment, the MCP tool execution layer should trigger three automated actions: first, dispatch an SMS and WhatsApp message to the debtor with the live Dodo checkout link; second, append the recovery status and transcript summary to the freelancer's Google Sheet; and third, send a real-time celebration alert to their Slack channel. Ensure all tool calls adhere to the Model Context Protocol specifications."*

---

### 🎙️ Commit #8 Prompt (Phase 8: Mission Control Cockpit UI & Waveform Visualizer)
* **Estimated Words:** 220 words | **Target Cadence:** ~93 WPM  
* **Wispr Flow Dictation Script:**  
> *"Let's assemble the front-end user experience in components Cockpit tsx, InvoiceTable tsx, and LiveCallModal tsx inspired by DispatcherAI. Build a high-contrast operator console featuring overdue metrics, outstanding recovery volume, and recovery rate percentage. The invoice table needs one-click Action buttons to trigger the AI agent. The live call modal should feature an interactive audio waveform visualizer, real-time transcript bubbles distinguishing between Agent and Debtor, live negotiation status badges, and an instant Dodo QR code. Ensure the interface is responsive, accessible, and supports zero-friction PDF drag-and-drop ingestion."*

---

### 🎙️ Commit #9 Prompt (Phase 9: End-to-End Integration Tests & Verification)
* **Estimated Words:** 175 words | **Target Cadence:** ~89 WPM  
* **Wispr Flow Dictation Script:**  
> *"Write comprehensive automated end-to-end integration tests in tests e2e test ts. Test the entire lifecycle: creating an overdue invoice, triggering the outbound call endpoint, verifying dynamic variable compilation, validating the Promise-to-Pay parser against sample transcripts, simulating a Dodo payment webhook, and verifying the invoice state changes from OVERDUE to RECOVERED. Enforce Gravitas verification invariants so that every test run outputs a deterministic VERDICT PASS."*

---

### 🎙️ Commit #10 Prompt (Phase 10: Production Deployment & Evidence Dossier)
* **Estimated Words:** 160 words | **Target Cadence:** ~96 WPM  
* **Wispr Flow Dictation Script:**  
> *"Finalize the production deployment documentation and Wispr Flow audit evidence. Update the root README md with architecture diagrams, quickstart instructions, and live Vercel URL. Compile the final WISPR EVIDENCE md mapping every prompt number to files changed, word counts, and visual screenshot proofs. Verify all environment variables in dot env example and ensure the repository is completely production-ready for the Hacker House Goa 2026 judges."*
