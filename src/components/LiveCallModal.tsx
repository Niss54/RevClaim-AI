"use client";

import React, { useState, useEffect } from "react";
import { Invoice } from "@/lib/types";
import { X, Mic, CheckCircle2, MessageSquare, ArrowRight, ShieldCheck } from "lucide-react";

interface LiveCallModalProps {
  invoice: Invoice | null;
  isOpen: boolean;
  onClose: () => void;
  onCallCompleted: (invoiceId: string, recovered: boolean) => void;
}

export function LiveCallModal({
  invoice,
  isOpen,
  onClose,
  onCallCompleted,
}: LiveCallModalProps) {
  const [callPhase, setCallPhase] = useState<
    "initiating" | "speaking" | "negotiating" | "ptp_achieved" | "settled"
  >("initiating");
  const [transcriptIndex, setTranscriptIndex] = useState(0);
  const [isCalling, setIsCalling] = useState(false);
  const [dodoCheckoutUrl, setDodoCheckoutUrl] = useState<string | null>(null);

  const dialogue = [
    {
      speaker: "Sarah (RevClaim AI)",
      text: `Hi ${invoice?.debtorName || "Alex"}, this is Sarah calling from the accounts desk on behalf of ${invoice?.freelancerName || "Nishant Maurya"}. How's your week going?`,
      time: "00:03",
    },
    {
      speaker: `${invoice?.debtorName || "Alex"} (Client)`,
      text: "Oh, hi Sarah. A bit hectic honestly. What's this regarding?",
      time: "00:07",
    },
    {
      speaker: "Sarah (RevClaim AI)",
      text: `I'm reaching out about invoice ${invoice?.invoiceNumber || "INV-2026-081"} for $${invoice?.amount || 1500} which was due ${invoice?.daysOverdue || 35} days ago. Nishant loved working on this project with you, and we just want to ensure your records are up to date.`,
      time: "00:15",
    },
    {
      speaker: `${invoice?.debtorName || "Alex"} (Client)`,
      text: "Yeah, I saw that. Our client hasn't paid us yet so cash flow has been tight this month. I can't do the full amount today.",
      time: "00:23",
    },
    {
      speaker: "Sarah (RevClaim AI)",
      text: "I completely understand cash flow crunches — that happens. Nishant authorized me to offer you a 2-part installment plan, or a 5% discount if we settle 50% ($750) today via our secure Dodo Payments portal. Would that help relieve the crunch?",
      time: "00:34",
    },
    {
      speaker: `${invoice?.debtorName || "Alex"} (Client)`,
      text: "Actually yes, that would help a lot. If you send me the link, I can clear the first $750 right now, and the remainder next Friday.",
      time: "00:44",
    },
    {
      speaker: "Sarah (RevClaim AI)",
      text: "Fantastic! I've locked in your Promise-to-Pay for the balance on Friday, and I'm sending your instant checkout link via WhatsApp and SMS right now. Thank you so much for your partnership!",
      time: "00:54",
    },
  ];

  useEffect(() => {
    if (!isOpen) {
      setCallPhase("initiating");
      setTranscriptIndex(0);
      setIsCalling(false);
      setDodoCheckoutUrl(null);
      return;
    }

    setIsCalling(true);
    setCallPhase("speaking");

    // Progressive transcript reveal simulation
    const interval = setInterval(() => {
      setTranscriptIndex((prev) => {
        if (prev < dialogue.length - 1) {
          if (prev >= 2) setCallPhase("negotiating");
          if (prev >= 4) setCallPhase("ptp_achieved");
          return prev + 1;
        } else {
          clearInterval(interval);
          setCallPhase("ptp_achieved");
          return prev;
        }
      });
    }, 2800);

    return () => clearInterval(interval);
  }, [isOpen]);

  const handleSimulatePaymentSettlement = async () => {
    if (!invoice) return;
    setCallPhase("settled");

    // Call checkout webhook or update API
    try {
      await fetch("/api/webhook/dodo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "payment.succeeded",
          data: {
            invoice_id: invoice.id,
            amount: invoice.amount,
          },
        }),
      });
      onCallCompleted(invoice.id, true);
    } catch (e) {
      console.error(e);
    }
  };

  if (!isOpen || !invoice) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-indigo-600/30 border border-indigo-500 flex items-center justify-center text-indigo-400">
                <Mic className="w-5 h-5 animate-pulse" />
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-950"></span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-white text-sm">
                  Autonomous Call with {invoice.debtorName}
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                  ElevenLabs Conversational AI
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {invoice.debtorCompany} • {invoice.debtorPhone} • Balance: ${invoice.amount}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Audio Waveform Cockpit */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 h-8">
              <span className="w-1 bg-indigo-500 rounded-full wave-animate-1"></span>
              <span className="w-1 bg-indigo-400 rounded-full wave-animate-2"></span>
              <span className="w-1 bg-emerald-400 rounded-full wave-animate-3"></span>
              <span className="w-1 bg-indigo-400 rounded-full wave-animate-4"></span>
              <span className="w-1 bg-purple-400 rounded-full wave-animate-5"></span>
            </div>
            <div className="text-xs">
              <span className="font-mono text-emerald-400 font-semibold uppercase">
                {callPhase === "settled" ? "CALL SETTLED & CLOSED" : "ACTIVE VOICE STREAM (16kHz)"}
              </span>
              <p className="text-[11px] text-slate-500">
                Natural turn-taking • Twilio SIP Trunking • Latency: ~340ms
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                callPhase === "ptp_achieved" || callPhase === "settled"
                  ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                  : "bg-indigo-950 text-indigo-300 border border-indigo-800"
              }`}
            >
              {callPhase === "ptp_achieved"
                ? "🎯 PTP AGREED"
                : callPhase === "settled"
                ? "💰 CASH COLLECTED"
                : "⚡ IN NEGOTIATION"}
            </span>
          </div>
        </div>

        {/* Live Transcript Body */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4 max-h-[380px] bg-slate-900/40">
          {dialogue.slice(0, transcriptIndex + 1).map((msg, idx) => {
            const isAI = msg.speaker.startsWith("Sarah");
            return (
              <div
                key={idx}
                className={`flex flex-col ${isAI ? "items-start" : "items-end"} animate-in slide-in-from-bottom-2 duration-300`}
              >
                <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono mb-1">
                  <span>{msg.speaker}</span>
                  <span>•</span>
                  <span>{msg.time}</span>
                </div>
                <div
                  className={`p-3.5 rounded-2xl max-w-[85%] text-sm ${
                    isAI
                      ? "bg-indigo-950/70 border border-indigo-800/60 text-slate-200 rounded-tl-none"
                      : "bg-slate-800 border border-slate-700 text-white rounded-tr-none"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Preserving client rapport through respectful third-party mediation</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {callPhase === "settled" ? (
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                Done & Return to Cockpit
              </button>
            ) : (
              <>
                <button
                  onClick={handleSimulatePaymentSettlement}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg transition active:scale-95 flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Simulate Dodo Pay Link Click ($750)
                </button>
                <button
                  onClick={onClose}
                  className="w-full sm:w-auto px-3 py-2 rounded-xl text-xs text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition"
                >
                  Close
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
