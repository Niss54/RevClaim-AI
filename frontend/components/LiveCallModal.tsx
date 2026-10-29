"use client";

import React, { useState, useEffect } from "react";
import { Invoice } from "@/lib/types";
import { X, Mic, CheckCircle2, MessageSquare, ArrowRight, ShieldCheck, Sparkles, Phone, PhoneOff, Volume2 } from "lucide-react";
import confetti from "canvas-confetti";

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

  const debtorName = invoice?.debtorName || invoice?.debtor?.contactPerson || "Alex";
  const debtorCompany = invoice?.debtorCompany || invoice?.debtor?.companyName || "Client Corp";
  const debtorPhone = invoice?.debtorPhone || invoice?.debtor?.phone || "+14155552671";
  const amount = invoice?.amount ?? invoice?.amountDue ?? 45000;
  const daysOverdue = invoice?.daysOverdue ?? invoice?.daysPastDue ?? 14;
  const freelancerName = invoice?.freelancerName || "Nishant Maurya";

  const dialogue = [
    {
      speaker: "Sarah (RevClaim AI)",
      text: `Hello ${debtorName}, this is Sarah calling from the finance team at ${freelancerName}. Hope you're having a great week!`,
      time: "00:03",
      isAi: true,
    },
    {
      speaker: `${debtorName} (Client)`,
      text: "Hi Sarah. A bit packed today, what is this regarding?",
      time: "00:07",
      isAi: false,
    },
    {
      speaker: "Sarah (RevClaim AI)",
      text: `I'm following up on invoice ${invoice?.invoiceNumber || "INV-1042"} for $${amount.toLocaleString()} which is currently overdue by ${daysOverdue} days. ${freelancerName} really appreciated the collaboration and we'd love to reconcile your statement.`,
      time: "00:15",
      isAi: true,
    },
    {
      speaker: `${debtorName} (Client)`,
      text: "Yes, I saw that. We've had a minor customer remittance delay on our side so cash flow is tight. I can't clear the full amount today.",
      time: "00:23",
      isAi: false,
    },
    {
      speaker: "Sarah (RevClaim AI)",
      text: `Understood completely. ${freelancerName} authorized me to offer you a 2-part installment plan, or a 5% prompt-pay discount if we settle $${Math.round(amount / 2).toLocaleString()} today via our secure Dodo Payments gateway. Would that ease the cash flow?`,
      time: "00:34",
      isAi: true,
    },
    {
      speaker: `${debtorName} (Client)`,
      text: `That would be great actually! Please text or email me the Dodo link, and I'll clear the first $${Math.round(amount / 2).toLocaleString()} right away.`,
      time: "00:44",
      isAi: false,
    },
    {
      speaker: "Sarah (RevClaim AI)",
      text: "Awesome! I've sent the Dodo link to your WhatsApp and registered your Promise-to-Pay for the remainder. Have a wonderful day ahead!",
      time: "00:54",
      isAi: true,
    },
  ];

  useEffect(() => {
    if (!isOpen) {
      setCallPhase("initiating");
      setTranscriptIndex(0);
      return;
    }

    setCallPhase("speaking");

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
    }, 2400);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen || !invoice) return null;

  const handleSettleNow = () => {
    confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
    setCallPhase("settled");
    onCallCompleted(invoice.id, true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-200">
      <div className="clay-card w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200/80 dark:border-white/10 flex items-center justify-between bg-slate-50/80 dark:bg-slate-800/40">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="size-10 rounded-2xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center border border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-400 dark:border-indigo-800">
                <Mic className="size-5 animate-pulse" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full bg-emerald-500 border-2 border-white dark:border-[#0f172a]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-slate-900 dark:text-white text-sm">
                  Autonomous Call with {debtorName}
                </h3>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-950/50 dark:text-indigo-300 dark:border-indigo-800">
                  Gnani × LiveKit Voice Agent
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {debtorCompany} • {debtorPhone} • Balance: ${amount.toLocaleString()}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Call Progress Status Bar */}
        <div className="px-5 py-2.5 bg-slate-100/60 dark:bg-slate-800/30 border-b border-slate-200/60 dark:border-white/5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 font-bold text-slate-700 dark:text-slate-300">
            <span className="size-2 rounded-full bg-emerald-500 animate-ping" />
            <span>
              {callPhase === "initiating" && "Dialing SIP endpoint..."}
              {callPhase === "speaking" && "Greeting & Relationship Context..."}
              {callPhase === "negotiating" && "B2B Cash Flow Installment Negotiation..."}
              {callPhase === "ptp_achieved" && "Promise-to-Pay Agreed & Dodo Link Dispatched"}
              {callPhase === "settled" && "🎉 Debt Successfully Settled via Dodo Payments"}
            </span>
          </div>
          <span className="font-mono text-slate-400">
            {dialogue[transcriptIndex]?.time || "00:00"}
          </span>
        </div>

        {/* Live Audio Dialogue Waveform & Bubbles */}
        <div className="p-5 flex-1 overflow-y-auto space-y-3">
          {dialogue.slice(0, transcriptIndex + 1).map((msg, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${
                msg.isAi ? "items-start" : "items-end"
              } animate-in fade-in slide-in-from-bottom-2 duration-300`}
            >
              <span className="text-[10px] font-bold text-slate-400 mb-1 px-1">
                {msg.speaker} • {msg.time}
              </span>
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs font-medium leading-relaxed shadow-sm ${
                  msg.isAi
                    ? "bg-slate-100 text-slate-900 border border-slate-200/80 dark:bg-slate-800 dark:text-white dark:border-white/10"
                    : "bg-indigo-600 text-white shadow-indigo-500/20"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {/* Modal Actions Bottom */}
        <div className="p-4 sm:p-5 border-t border-slate-200/80 dark:border-white/10 flex items-center justify-between gap-3 bg-slate-50/80 dark:bg-slate-800/40">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300">
            <ShieldCheck className="size-4 text-emerald-600" />
            <span>PTP Verified & Logged to Supabase</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSettleNow}
              className="clay-btn-primary flex items-center gap-1.5 px-4 py-2 text-xs font-bold shadow-md hover:scale-105 active:scale-95 transition"
            >
              <Sparkles className="size-3.5" />
              <span>Simulate Instant Dodo Payment</span>
            </button>
            <button
              onClick={onClose}
              className="px-3 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
