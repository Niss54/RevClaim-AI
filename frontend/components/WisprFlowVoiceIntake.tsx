"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Mic,
  MicOff,
  Sparkles,
  Zap,
  CheckCircle2,
  AlertCircle,
  X,
  ArrowRight,
  ShieldCheck,
  Volume2,
} from "lucide-react";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import { Invoice } from "@/lib/types";
import { parseVoiceToInvoice, VoiceParsedInvoice } from "@/lib/wispr";

interface WisprFlowVoiceIntakeProps {
  onInvoiceCreated?: (invoice: Invoice) => void;
}

export function WisprFlowVoiceIntake({ onInvoiceCreated }: WisprFlowVoiceIntakeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [parsedData, setParsedData] = useState<VoiceParsedInvoice | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [micSupported, setMicSupported] = useState(true);

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        setMicSupported(false);
      }
    }
  }, []);

  // Update parsed invoice fields in real-time as transcript changes
  useEffect(() => {
    if (transcript.trim().length > 5) {
      const parsed = parseVoiceToInvoice(transcript);
      setParsedData(parsed);
    } else {
      setParsedData(null);
    }
  }, [transcript]);

  const startListening = () => {
    setTranscript("");
    setParsedData(null);

    if (typeof window !== "undefined") {
      const SpeechRecognitionClass =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognitionClass) {
        try {
          const rec = new SpeechRecognitionClass();
          rec.continuous = true;
          rec.interimResults = true;
          rec.lang = "en-IN"; // Handles Indian English and Code-mixed Hinglish

          rec.onstart = () => {
            setIsListening(true);
            toast.info("🔴 Wispr Flow Listening... Speak naturally into your mic.");
          };

          rec.onresult = (event: any) => {
            let current = "";
            for (let i = 0; i < event.results.length; i++) {
              current += event.results[i][0].transcript;
            }
            setTranscript(current);
          };

          rec.onerror = (e: any) => {
            console.warn("Speech recognition warning:", e);
            setIsListening(false);
          };

          rec.onend = () => {
            setIsListening(false);
          };

          rec.start();
          recognitionRef.current = rec;
          return;
        } catch (err) {
          console.warn("Failed to initialize speech recognition:", err);
        }
      }
    }

    // Fallback if browser permission denied
    setIsListening(true);
    toast.info("🔴 Wispr Flow listening... Speak invoice details.");
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
      recognitionRef.current = null;
    }
    setIsListening(false);
  };

  const handleApplySample = (sampleText: string) => {
    setTranscript(sampleText);
    const parsed = parseVoiceToInvoice(sampleText);
    setParsedData(parsed);
    toast.success("Sample dictation applied to Wispr Flow Auto-Edit engine!");
  };

  const handleCreateInvoice = async () => {
    if (!parsedData) return;
    setIsSubmitting(true);

    try {
      const payload = {
        debtorName: parsedData.debtorPerson || parsedData.clientName,
        debtorCompany: parsedData.clientName,
        debtorPhone: parsedData.phone,
        debtorEmail: parsedData.email,
        amount: parsedData.amount,
        description: parsedData.description,
        daysOverdue: parsedData.daysOverdue,
      };

      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success && data.invoice) {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
        toast.success(
          `🎙️ Wispr Flow: Created invoice for ${parsedData.clientName} (₹${parsedData.amount.toLocaleString()})!`
        );
        if (onInvoiceCreated) {
          onInvoiceCreated(data.invoice);
        }
        setIsOpen(false);
      } else {
        toast.error("Failed to create invoice from voice data");
      }
    } catch (e: any) {
      toast.error(`Error saving voice invoice: ${e.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* ── Top Floating / Header Pill in Cockpit ── */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <button
          type="button"
          onClick={() => {
            setIsOpen(true);
            setTimeout(() => startListening(), 200);
          }}
          className="group relative inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-600 p-[1.5px] shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/35 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
        >
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-[14px] bg-white dark:bg-slate-900 transition-colors group-hover:bg-opacity-90">
            <span className="relative flex size-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full size-3 bg-cyan-500" />
            </span>
            <Mic className="size-4 text-cyan-600 dark:text-cyan-400 group-hover:rotate-12 transition-transform" />
            <div className="flex flex-col text-left">
              <span className="text-xs font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-1.5">
                🎙️ Wispr Flow Voice Intake
                <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded-full bg-cyan-100 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-800">
                  Sub-400ms Auto-Edit
                </span>
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium hidden sm:inline">
                Speak to add invoice • Self-corrections resolved on the fly
              </span>
            </div>
          </div>
        </button>

        <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-bold">
            <Sparkles className="size-3 text-indigo-500" />
            Track Stacking: Inbound (Wispr Flow) • Outbound (Gnani.ai TTS)
          </span>
        </div>
      </div>

      {/* ── Interactive Voice Intake Modal ── */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="clay-card relative w-full max-w-xl overflow-hidden border border-cyan-200/80 bg-white p-6 shadow-2xl dark:bg-[#0c1420] dark:border-white/10">
            {/* Close Button */}
            <button
              onClick={() => {
                stopListening();
                setIsOpen(false);
              }}
              className="absolute right-4 top-4 rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
            >
              <X className="size-5" />
            </button>

            {/* Header Badge */}
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-cyan-50 text-cyan-700 border border-cyan-200 dark:bg-cyan-950/70 dark:text-cyan-300 dark:border-cyan-800">
                <Mic className="size-3.5 text-cyan-600 animate-pulse" />
                Wispr Flow Real-Time Inbound Voice Engine
              </span>
            </div>

            {/* Title */}
            <h3 className="text-lg font-black text-slate-900 dark:text-white mb-1">
              Speak Your Overdue Invoice
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Dictate client name, amount, and overdue days. Wispr Flow automatically catches and corrects verbal edits like <em>&quot;actually make it 50k&quot;</em>!
            </p>

            {/* Listening & Waveform Box */}
            <div className="relative p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white mb-4 overflow-hidden border border-indigo-900">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`size-2.5 rounded-full ${
                      isListening ? "bg-rose-500 animate-ping" : "bg-slate-500"
                    }`}
                  />
                  <span className="text-xs font-bold uppercase tracking-wider text-cyan-300">
                    {isListening ? "🔴 Listening to your mic..." : "Mic Paused"}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={isListening ? stopListening : startListening}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                    isListening
                      ? "bg-rose-600 hover:bg-rose-700 text-white"
                      : "bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-black"
                  }`}
                >
                  {isListening ? "Stop Mic" : "Start Mic"}
                </button>
              </div>

              {/* Pulsing Audio Waves */}
              {isListening && (
                <div className="flex items-center justify-center gap-1 my-3 h-8">
                  {[40, 75, 100, 60, 90, 45, 80, 100, 65, 85, 50, 95].map((h, idx) => (
                    <span
                      key={idx}
                      className="w-1 bg-gradient-to-t from-cyan-400 to-indigo-400 rounded-full animate-pulse"
                      style={{
                        height: `${h}%`,
                        animationDelay: `${idx * 0.08}s`,
                      }}
                    />
                  ))}
                </div>
              )}

              {/* Live Transcript Display */}
              <div className="p-3 rounded-xl bg-slate-950/70 border border-white/10 font-mono text-xs text-slate-200 min-h-[52px] leading-relaxed">
                {transcript ? (
                  <span>&quot;{transcript}&quot;</span>
                ) : (
                  <span className="text-slate-500 italic">
                    Say something like: &quot;Add an invoice for Davin at Acme Corp for 45 thousand due yesterday, actually make it 50 thousand.&quot;
                  </span>
                )}
              </div>
            </div>

            {/* Quick 1-Click Spoken Test Utterances */}
            <div className="mb-4">
              <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1.5 block">
                Or Click to Test Voice Self-Correction (Auto-Edit Benchmark):
              </span>
              <div className="flex flex-col gap-1.5">
                <button
                  type="button"
                  onClick={() =>
                    handleApplySample(
                      "Add an invoice for Davin at Acme Corp for 45 thousand due yesterday, actually make it 50 thousand."
                    )
                  }
                  className="text-left text-[11px] p-2 rounded-xl bg-slate-50 hover:bg-cyan-50 dark:bg-slate-900/60 dark:hover:bg-cyan-950/40 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-200 transition"
                >
                  🎯 <strong>Self-Correction:</strong> &quot;Add an invoice for Davin at Acme Corp for 45 thousand due yesterday, <u>actually make it 50 thousand</u>.&quot;
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleApplySample(
                      "TechFlow Solutions ka invoice add karo Rahul Sharma 45000 overdue, nahi 50 hazar kar do"
                    )
                  }
                  className="text-left text-[11px] p-2 rounded-xl bg-slate-50 hover:bg-cyan-50 dark:bg-slate-900/60 dark:hover:bg-cyan-950/40 border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-200 transition"
                >
                  🇮🇳 <strong>Hinglish Auto-Edit:</strong> &quot;TechFlow Solutions ka invoice add karo Rahul Sharma 45000 overdue, <u>nahi 50 hazar kar do</u>&quot;
                </button>
              </div>
            </div>

            {/* Parsed JSON Preview */}
            {parsedData && (
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 mb-4 animate-in fade-in">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <CheckCircle2 className="size-4 text-emerald-500" />
                    Structured Extraction ({Math.round(parsedData.confidence * 100)}% Confidence)
                  </span>
                  {parsedData.autoEditDetected && (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 flex items-center gap-1">
                      <Zap className="size-3 text-amber-600" />
                      Auto-Edit: {parsedData.supersededAmount ? `₹${parsedData.supersededAmount.toLocaleString()} ➔ ` : ""}₹{parsedData.amount.toLocaleString()}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Company / Client</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {parsedData.clientName} {parsedData.debtorPerson ? `(${parsedData.debtorPerson})` : ""}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Amount Due</span>
                    <span className="font-black text-emerald-600 dark:text-emerald-400 text-sm">
                      ₹{parsedData.amount.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Overdue Duration</span>
                    <span className="font-semibold text-rose-600 dark:text-rose-400">
                      {parsedData.daysOverdue} days overdue
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Contact Phone</span>
                    <span className="font-mono text-slate-700 dark:text-slate-300">
                      {parsedData.phone}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-white/5">
              <button
                type="button"
                onClick={() => {
                  stopListening();
                  setIsOpen(false);
                }}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateInvoice}
                disabled={!parsedData || isSubmitting}
                className="clay-btn-primary px-5 py-2 text-xs font-bold flex items-center gap-1.5 disabled:opacity-50"
              >
                <Zap className="size-3.5" />
                <span>{isSubmitting ? "Creating Invoice..." : "Create Invoice via Wispr Flow"}</span>
                <ArrowRight className="size-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
