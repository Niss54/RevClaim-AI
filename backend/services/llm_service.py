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

        system_instruction = (
            f"You are Sarah, senior accounts manager representing {freelancer_name}. "
            f"You are speaking with {debtor_name} at {debtor_company} regarding invoice {invoice_number} "
            f"for {currency} {amount_due:,.2f} ({deliverable}, {days_overdue} days overdue). "
            f"Be respectful, empathetic, and professional. Address whatever the client mentions (accidents, car puncture, cash crunches, disputes) with high EQ. "
            f"If they face cash flow issues, offer a 50% split ({currency} {half_amount:,.2f}) today via Dodo Payments link and remainder next Friday. "
            f"Keep responses natural, empathetic, under 2 sentences in Hinglish or English."
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
