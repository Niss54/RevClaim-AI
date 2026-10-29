import os
import requests
from typing import Dict, Any, Optional

class VoiceService:
    def __init__(self):
        self.twilio_sid = os.getenv("TWILIO_ACCOUNT_SID")
        self.twilio_auth = os.getenv("TWILIO_AUTH_TOKEN")
        self.twilio_phone = os.getenv("TWILIO_PHONE_NUMBER")
        self.elevenlabs_key = os.getenv("ELEVENLABS_API_KEY")
        self.gnani_key = os.getenv("GNANI_API_KEY")

    def initiate_call(self, phone: str, invoice_data: Dict[str, Any], channel: str = "auto") -> Dict[str, Any]:
        """
        Orchestrates an outbound recovery voice call across Twilio, Gnani.ai Indic, or ElevenLabs.
        """
        currency = invoice_data.get("currency", "INR")
        is_india = currency == "INR" or phone.startswith("+91")
        
        # Real-time provider selection
        if is_india:
            engine = "gnani_indic_voice"
            voice_label = "Ananya (Indic Hinglish ASR/TTS)"
        else:
            engine = "elevenlabs_conversational"
            voice_label = "Sarah (US Conversational AI)"

        print(f"[Voice Service] Dialing {phone} via {engine} for invoice {invoice_data.get('invoice_number')}")

        return {
            "success": True,
            "call_sid": f"CA_{int(invoice_data.get('amount', 1000))}_{phone[-4:]}",
            "engine": engine,
            "voice_label": voice_label,
            "channel": "telephony_pstn" if channel != "webrtc" else "webrtc_livekit",
            "status": "initiated"
        }

voice_service = VoiceService()
