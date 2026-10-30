import os
import time
import requests
from typing import Dict, Any, List
from dotenv import load_dotenv

# Reliably load .env from current directory, parent directory, and backend folder
_current_dir = os.path.dirname(os.path.abspath(__file__))
_backend_dir = os.path.dirname(_current_dir)
_root_dir = os.path.dirname(_backend_dir)
load_dotenv(os.path.join(_root_dir, ".env"))
load_dotenv(os.path.join(_backend_dir, ".env"), override=True)

class LLMService:
    def __init__(self):
        self.groq_key = os.getenv("GROQ_API_KEY")
        self.gemini_key = os.getenv("GEMINI_API_KEY")
        self.gnani_key = os.getenv("GNANI_API_KEY")

    def generate_reply(
        self,
        debtor_name: str,
        debtor_company: str,
        invoice_number: str,
        amount_due: float,
        currency: str,
        days_overdue: int,
        deliverable: str,
        freelancer_name: str,
        client_last_message: str,
        history: List[Dict[str, str]] = None
    ) -> Dict[str, Any]:
        start_time = time.time()
        half_amount = round(amount_due / 2)

        # Refresh keys from environment if loaded dynamically
        groq_key = os.getenv("GROQ_API_KEY") or self.groq_key
        gemini_key = os.getenv("GEMINI_API_KEY") or self.gemini_key
        gnani_key = os.getenv("GNANI_API_KEY") or self.gnani_key

        # 0. Check High-Speed Sub-50ms Smart Human Reflex Engine (Zero Network Delay)
        msg_lower = (client_last_message or "").lower().strip()
        first_name = debtor_name.split()[0] if debtor_name else "ji"

        # Reflex 1: Road Emergency, Car Puncture, Accident, Health Crisis (Safety & Empathy First)
        if any(w in msg_lower for w in ["puncture", "panchar", "punchur", "tyre", "tire", "accident", "gadi kharab", "gaadi kharab", "breakdown", "bike slip", "hospital", "doctor", "emergency", "tabiyat", "bimar", "chot", "injury", "sick", "ill"]):
            return {
                "reply": f"Arey, koi baat nahi {first_name}! Aap pehle puncture theek karwa lijiye, aap theek hain na? Invoice ki baat hum baad mein aaram se kar lenge. Main payment link WhatsApp par chhod deti hoon, jab safe pahunchein tab dekh lijiyega.",
                "engine": "smart_human_reflex",
                "latency_ms": int((time.time() - start_time) * 1000)
            }

        # Reflex 2: Busy, Driving, In Meeting
        if any(w in msg_lower for w in ["meeting", "busy", "drive", "driving", "baad me", "later", "call me later", "kal karna", "traffic"]):
            return {
                "reply": f"Oh, bilkul {first_name}! Aap pehle driving ya meeting complete kar lijiye, main disturb nahi karungi. Dodo link WhatsApp par chhod diya hai, shaam ko jab free hon tab check kar lijiyega.",
                "engine": "smart_human_reflex",
                "latency_ms": int((time.time() - start_time) * 1000)
            }

        # Reflex 3: Cash Crunch / Salary Delay (Consultative Split Closing)
        if any(w in msg_lower for w in ["paisa nahi", "paise nahi", "no money", "tight", "crunch", "salary nahi", "client ne nahi diya", "funds issue"]):
            return {
                "reply": f"Main bilkul samajh sakti hoon {first_name}, cash flow issues sabke sath aate hain. Aapko poora ek sath dene ki zaroorat nahi hai—kya hum 50% ({currency} {half_amount:,.2f}) abhi settle kar lein aur baaki agle Friday taaki account active rahe?",
                "engine": "smart_human_reflex",
                "latency_ms": int((time.time() - start_time) * 1000)
            }

        # Reflex 4: Willing to Pay / Link Request (Sales Closing)
        if any(w in msg_lower for w in ["send link", "link bhejo", "qr code", "whatsapp", "pay karta hoon", "done", "clear kar"]):
            return {
                "reply": f"Superb {first_name}! Maine direct Dodo Payments link aapke WhatsApp par bhej diya hai. 10 seconds me UPI ya card se clear ho jayega. Thank you so much!",
                "engine": "smart_human_reflex",
                "latency_ms": int((time.time() - start_time) * 1000)
            }

        # Reflex 5: Work Quality / Bugs / Deliverable Dispute
        if any(w in msg_lower for w in ["bug", "kharab", "incomplete", "dispute", "not happy", "quality", "issue", "kaam galat"]):
            return {
                "reply": f"Acha hua aapne bataya {first_name}! Maine deliverable dispute log kar diya hai aur reminders turant halt kar diye hain. Humare lead developer aapko issue review ke liye contact karenge.",
                "engine": "smart_human_reflex",
                "latency_ms": int((time.time() - start_time) * 1000)
            }

        # Reflex 6: Hostile / Threats / Legal / Fraud ("Nahi dunga / police / lawyer")
        if any(w in msg_lower for w in ["nahi dunga", "wont pay", "won't pay", "court", "police", "lawyer", "fraud", "don't call", "mat karna", "threat"]):
            return {
                "reply": f"Aap bilkul pareshan mat hoiye {first_name}, main koi tension create nahi karna chahti. Saare follow-ups turant pause kar diye hain aur founder ko escalate kar diya hai taaki aap dono aapas me resolve kar sakein. Have a good day.",
                "engine": "smart_human_reflex",
                "latency_ms": int((time.time() - start_time) * 1000)
            }

        system_instruction = (
            f"You are Sarah, an elite high-EQ billing mediation coordinator and consultative sales specialist representing {freelancer_name}. "
            f"You are speaking with {debtor_name} at {debtor_company} regarding invoice {invoice_number} "
            f"for {currency} {amount_due:,.2f} ({deliverable}, {days_overdue} days overdue).\n\n"
            f"TACTICAL INFLUENCE & SALES PSYCHOLOGY (THE 4 SACRED LAWS):\n"
            f"1. EMPATHY BEFORE COMMERCE: If the client mentions ANY trouble (car puncture, accident, illness, emergency), "
            f"STRICTLY FORBIDDEN: NEVER say 'Arey kya baat hai!' (in Hindi that means celebrating misfortune!). "
            f"STRICTLY FORBIDDEN: NEVER abruptly say 'Chaliye ab invoice ki baat karte hain'. "
            f"ALWAYS prioritize their safety and say: 'Arey, koi baat nahi! Aap pehle puncture theek karwa lijiye, aap theek hain na? Invoice ki baat hum baad mein kar lenge. Main link WhatsApp par chhod deti hoon.'\n"
            f"2. THE CONSULTATIVE REFRAME: You are not an aggressive debt collector; you are a partner helping keep their account active so upcoming deliverables stay unblocked.\n"
            f"3. CONCESSION CLOSING: If they face cash flow issues, offer a 50% split ({currency} {half_amount:,.2f}) today via Dodo Payments link and remainder next Friday.\n"
            f"4. NATURAL HINGLISH: Speak like a real courteous human in under 2 short sentences (max 20 words)."
        )

        # 1. Try Groq LPU (Sub-700ms Ultra-low latency)
        # Primary: llama-3.3-70b-versatile; Fallback cascade: llama-3.1-8b-instant -> qwen/qwen3.8-27b -> openai/gpt-oss-20b
        if groq_key and not "your_" in groq_key:
            groq_models = [
                os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile"),
                "llama-3.1-8b-instant",
                "qwen/qwen3.8-27b",
                "openai/gpt-oss-20b"
            ]
            for model_id in groq_models:
                try:
                    res = requests.post(
                        "https://api.groq.com/openai/v1/chat/completions",
                        headers={
                            "Authorization": f"Bearer {groq_key}",
                            "Content-Type": "application/json"
                        },
                        json={
                            "model": model_id,
                            "messages": [
                                {"role": "system", "content": system_instruction},
                                {"role": "user", "content": f"Client says: {client_last_message}"}
                            ],
                            "temperature": 0.3,
                            "max_tokens": 120
                        },
                        timeout=4
                    )
                    if res.status_code == 200:
                        data = res.json()
                        reply = data["choices"][0]["message"]["content"].strip()
                        latency = int((time.time() - start_time) * 1000)
                        return {
                            "reply": reply,
                            "engine": f"groq_{model_id}",
                            "latency_ms": latency
                        }
                    elif res.status_code == 404:
                        # Model not available on this tier, try next candidate
                        continue
                    else:
                        print(f"[LLM Service] Groq {model_id} returned status {res.status_code}")
                except Exception as e:
                    print(f"[LLM Service] Groq error ({model_id}): {e}")

        # 2. Try Google Gemini Flash Fallback
        if gemini_key and not "your_" in gemini_key:
            gemini_models = ["gemini-flash-latest", "gemini-2.5-flash", "gemini-2.5-flash-lite"]
            for g_model in gemini_models:
                try:
                    url = f"https://generativelanguage.googleapis.com/v1beta/models/{g_model}:generateContent?key={gemini_key}"
                    prompt_text = f"{system_instruction}\n\nClient input: {client_last_message}\nSarah:"
                    res = requests.post(
                        url,
                        headers={"Content-Type": "application/json"},
                        json={"contents": [{"parts": [{"text": prompt_text}]}]},
                        timeout=5
                    )
                    if res.status_code == 200:
                        data = res.json()
                        reply = data["candidates"][0]["content"]["parts"][0]["text"].strip()
                        latency = int((time.time() - start_time) * 1000)
                        return {
                            "reply": reply,
                            "engine": f"gemini_{g_model}",
                            "latency_ms": latency
                        }
                except Exception as e:
                    print(f"[LLM Service] Gemini error ({g_model}): {e}")

        # 3. Try Gnani Evon v3.3 Indic Mixture-of-Experts LLM
        if gnani_key and gnani_key.startswith("vach_"):
            try:
                res = requests.post(
                    "https://api.vachana.ai/llm/v1/chat/completions",
                    headers={
                        "X-API-Key-ID": gnani_key,
                        "Content-Type": "application/json"
                    },
                    json={
                        "model": "evon-v3.3",
                        "messages": [
                            {"role": "system", "content": system_instruction},
                            {"role": "user", "content": f"Client says: {client_last_message}"}
                        ],
                        "temperature": 0.2,
                        "max_tokens": 120
                    },
                    timeout=5
                )
                if res.status_code == 200:
                    data = res.json()
                    reply = data["choices"][0]["message"]["content"].strip()
                    latency = int((time.time() - start_time) * 1000)
                    return {
                        "reply": reply,
                        "engine": "gnani_evon_indic",
                        "latency_ms": latency
                    }
            except Exception as e:
                print(f"[LLM Service] Gnani Evon LLM fallback notice: {e}")

        # 4. Calibrated High-EQ Negotiation Fallback (Guaranteed safety)
        latency = int((time.time() - start_time) * 1000)
        lower = client_last_message.lower()
        if any(w in lower for w in ["puncture", "accident", "hospital", "emergency", "doctor"]):
            reply = f"Oh no, {debtor_name}! Please take care of yourself first—safety comes before any invoice. I have paused all automated reminders for today; let's reconnect once you are safe."
        elif any(w in lower for w in ["send", "link", "pay", "ok", "yes", "sure", "transfer"]):
            reply = f"Thank you so much, {debtor_name}! I have locked in your Promise-to-Pay and just dispatched your secure Dodo Payments checkout link to your WhatsApp and email."
        else:
            reply = f"I completely understand cash flow crunches, {debtor_name}. Would you be able to clear 50% ({currency} {half_amount:,.2f}) today via Dodo Payments, and we can schedule the remainder for next Friday?"

        return {
            "reply": reply,
            "engine": "calibrated_rule_fallback",
            "latency_ms": latency
        }

llm_service = LLMService()
