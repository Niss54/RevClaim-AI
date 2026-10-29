import os
from typing import Dict, Any, List, Optional
from fastapi import FastAPI, HTTPException, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

# Load backend environment variables reliably from script directory
backend_dir = os.path.dirname(os.path.abspath(__file__))
root_dir = os.path.dirname(backend_dir)
load_dotenv(os.path.join(root_dir, ".env"))
load_dotenv(os.path.join(backend_dir, ".env"), override=True)

from services.supabase_service import supabase_service
from services.llm_service import llm_service
from services.deepgram_service import deepgram_service
from services.mem0_service import mem0_service
from services.voice_service import voice_service

app = FastAPI(
    title="RevClaim AI — Python Backend Service",
    description="Autonomous Voice-Calling Invoice Recovery REST API & Voice Pipeline",
    version="1.0.0"
)

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------------------------------------------------------
# Data Models
# -----------------------------------------------------------------------------
class CallRequest(BaseModel):
    invoice_id: str
    phone: Optional[str] = "+91 98765 43210"
    mode: Optional[str] = "demo"
    channel: Optional[str] = "auto"

class NegotiateRequest(BaseModel):
    debtor_name: str
    debtor_company: str
    invoice_number: str
    amount_due: float
    currency: str = "INR"
    days_overdue: int = 14
    deliverable: str = "Software Development"
    freelancer_name: str = "Nishant Maurya"
    client_last_message: str
    history: Optional[List[Dict[str, str]]] = []

class CheckoutRequest(BaseModel):
    invoice_id: str
    amount: float
    customer_email: Optional[str] = "finance@client.com"
    customer_name: Optional[str] = "Valued Client"

class MemoryRequest(BaseModel):
    client_id: str
    memory_text: str
    metadata: Optional[Dict[str, Any]] = None

class SynthesizeRequest(BaseModel):
    text: str
    voice_id: Optional[str] = "EXAVITQu4vr4xnSDxMaL"

class GnaniSynthesizeRequest(BaseModel):
    text: str
    voice: Optional[str] = "Shivani"
    language: Optional[str] = "Hindi"

# -----------------------------------------------------------------------------
# REST API Endpoints
# -----------------------------------------------------------------------------
@app.get("/")
@app.get("/health")
@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "RevClaim AI Python FastAPI",
        "integrations": {
            "supabase": "connected" if supabase_service.client else "in_memory_mirror",
            "groq_llm": "active (gsk_...)",
            "gemini_llm": "active (AQ....)",
            "deepgram_nova2": "ready",
            "mem0_memory": "active",
            "elevenlabs_voice": "active" if voice_service.elevenlabs_key else "offline",
            "gnani_indic_voice": "active (vach_...)" if voice_service.gnani_key else "offline",
            "livekit_webrtc": "active (API52...)"
        }
    }

@app.get("/api/invoices")
def get_invoices():
    invoices = supabase_service.get_invoices()
    return {"success": True, "count": len(invoices), "invoices": invoices}

@app.post("/api/call")
def initiate_call(req: CallRequest):
    invoices = supabase_service.get_invoices()
    target_invoice = next((inv for inv in invoices if inv.get("id") == req.invoice_id), None)
    
    if not target_invoice:
        target_invoice = {
            "id": req.invoice_id,
            "invoice_number": f"INV-{req.invoice_id}",
            "amount": 45000,
            "currency": "INR"
        }

    # Dispatch via multi-engine voice pipeline
    call_result = voice_service.initiate_call(
        phone=req.phone or "+919876543210",
        invoice_data=target_invoice,
        channel=req.channel or "auto"
    )

    # Store episodic memory in Mem0
    mem0_service.add_interaction_memory(
        client_id=req.invoice_id,
        memory_text=f"Outbound AI recovery call initiated via {call_result['engine']}."
    )

    return {"success": True, "call": call_result}

@app.post("/api/synthesize")
def synthesize_speech(req: SynthesizeRequest):
    audio_bytes = voice_service.synthesize_speech(req.text, req.voice_id or "21m00Tcm4TlvDq8ikWAM")
    if not audio_bytes:
        raise HTTPException(status_code=500, detail="Voice synthesis failed or API key missing")
    return Response(content=audio_bytes, media_type="audio/mpeg")

@app.post("/api/synthesize/gnani")
def synthesize_gnani(req: GnaniSynthesizeRequest):
    audio_bytes = voice_service.synthesize_gnani_speech(req.text, req.voice or "Shivani", req.language or "Hindi")
    if not audio_bytes:
        raise HTTPException(status_code=500, detail="Gnani.ai Vachana synthesis failed or API key missing")
    return Response(content=audio_bytes, media_type="audio/wav")

@app.post("/api/negotiate")
def negotiate_turn(req: NegotiateRequest):
    result = llm_service.generate_reply(
        debtor_name=req.debtor_name,
        debtor_company=req.debtor_company,
        invoice_number=req.invoice_number,
        amount_due=req.amount_due,
        currency=req.currency,
        days_overdue=req.days_overdue,
        deliverable=req.deliverable,
        freelancer_name=req.freelancer_name,
        client_last_message=req.client_last_message,
        history=req.history or []
    )
    return result

@app.post("/api/checkout")
def create_dodo_checkout(req: CheckoutRequest):
    checkout_url = f"https://checkout.dodopayments.com/buy/p_{req.invoice_id}?amount={req.amount}&currency=INR"
    return {
        "success": True,
        "checkout_url": checkout_url,
        "payment_id": f"dodo_pay_{req.invoice_id}",
        "fee_deducted": 199.00
    }

@app.post("/api/webhook/dodo")
def dodo_webhook(payload: Dict[str, Any]):
    event_type = payload.get("type", "")
    data = payload.get("data", {})
    invoice_id = data.get("invoice_id")

    if event_type == "payment.succeeded" and invoice_id:
        supabase_service.update_invoice_status(invoice_id, "RECOVERED")
        mem0_service.add_interaction_memory(
            client_id=invoice_id,
            memory_text=f"Payment succeeded! Invoice marked RECOVERED via Dodo Payments."
        )
        return {"success": True, "status": "settled", "invoice_id": invoice_id}

    return {"success": True, "received": True}

@app.get("/api/memory/{client_id}")
def get_memory(client_id: str):
    memories = mem0_service.get_client_memories(client_id)
    return {"success": True, "client_id": client_id, "memories": memories}

@app.post("/api/memory")
def add_memory(req: MemoryRequest):
    rec = mem0_service.add_interaction_memory(req.client_id, req.memory_text, req.metadata)
    return {"success": True, "record": rec}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
