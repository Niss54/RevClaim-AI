import os
import time
import requests
from typing import Dict, Any, List

class LLMService:
    def __init__(self):
        self.groq_key = os.getenv("GROQ_API_KEY")
        self.gemini_key = os.getenv("GEMINI_API_KEY")

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
        history: List[Dict[str, str]]
    ) -> Dict[str, Any]:
        start_time = time.time()
        half_amount = round(amount_due / 2)

        system_instruction = (
            f"You are Sarah, accounts manager representing {freelancer_name}. "
            f"You are speaking with {debtor_name} at {debtor_company} regarding invoice {invoice_number} "
            f"for {currency} {amount_due:,.2f} ({deliverable}, {days_overdue} days overdue). "
            f"Be respectful and empathetic. If they face cash flow issues, offer a 50% split ({currency} {half_amount:,.2f}) "
            f"today via Dodo Payments link and remainder next Friday. Keep responses under 2 sentences."
        )

        # 1. Try Groq (Ultra-fast low latency)
        if self.groq_key and not "your_" in self.groq_key:
            try:
                res = requests.post(
                    "https://api.groq.com/openai/v1/chat/completions",
                    headers={
                        "Authorization": f"Bearer {self.groq_key}",
                        "Content-Type": "application/json"
                    },
                    json={
                        "model": "openai/gpt-oss-20b",
                        "messages": [
                            {"role": "system", "content": system_instruction},
                            {"role": "user", "content": f"Client says: {client_last_message}"}
                        ],
                        "temperature": 0.3,
                        "max_tokens": 200
                    },
                    timeout=4
                )
                if res.status_code == 200:
                    data = res.json()
                    reply = data["choices"][0]["message"]["content"].strip()
                    latency = int((time.time() - start_time) * 1000)
                    return {
                        "reply": reply,
                        "engine": "groq_llama",
                        "latency_ms": latency
                    }
            except Exception as e:
                print(f"[LLM Service] Groq error, attempting fallback: {e}")

        # 2. Try Gemini Fallback
        if self.gemini_key and not "your_" in self.gemini_key:
            try:
                url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key={self.gemini_key}"
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
                        "engine": "gemini_flash",
                        "latency_ms": latency
                    }
            except Exception as e:
                print(f"[LLM Service] Gemini error: {e}")

        # 3. Rule-based Calibrated Negotiation Fallback
        latency = int((time.time() - start_time) * 1000)
        lower = client_last_message.lower()
        if any(w in lower for w in ["send", "link", "pay", "ok", "yes", "sure", "transfer"]):
            reply = f"Thank you so much, {debtor_name}! I have locked in your Promise-to-Pay and just dispatched your secure Dodo Payments checkout link to your WhatsApp."
        else:
            reply = f"I completely understand cash flow crunches, {debtor_name}. Would you be able to clear 50% ({currency} {half_amount:,.2f}) today, and we can schedule the remaining balance for next Friday?"

        return {
            "reply": reply,
            "engine": "calibrated_rule_fallback",
            "latency_ms": latency
        }

llm_service = LLMService()
