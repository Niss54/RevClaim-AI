"use client";

import React, { useState } from "react";
import {
  X,
  Radio,
  PhoneCall,
  ShieldCheck,
  Sparkles,
  Copy,
  Check,
  ExternalLink,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

interface TwilioSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetPhone?: string;
  isCustomGated?: boolean;
  onLaunchLiveKitWebRTC: () => void;
}

export function TwilioSetupModal({
  isOpen,
  onClose,
  targetPhone = "+91 8840301998",
  isCustomGated = false,
  onLaunchLiveKitWebRTC,
}: TwilioSetupModalProps) {
  const [copied, setCopied] = useState(false);
  const [showDevTrunk, setShowDevTrunk] = useState(false);

  if (!isOpen) return null;

  const twilioSnippet = `TWILIO_ACCOUNT_SID=AC_YOUR_TWILIO_ACCOUNT_SID
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+1xxxxxxxxxx`;

  const handleCopy = () => {
    navigator.clipboard.writeText(twilioSnippet);
    setCopied(true);
    toast.success("Twilio .env template copied to clipboard!");
    setTimeout(() => setCopied(false), 2500);
  };

  const cleanNumber = targetPhone.replace(/[\s\-\(\)]/g, "");
  const isVerifiedDevLine =
    cleanNumber === "+918840301998" ||
    cleanNumber === "8840301998" ||
    cleanNumber === "918840301998";
  const isGated = isCustomGated || !isVerifiedDevLine;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="clay-card relative w-full max-w-lg overflow-hidden border border-indigo-200/80 bg-white p-6 shadow-2xl dark:bg-[#18181c] dark:border-white/10">
        {/* Top Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
          title="Close dialog"
        >
          <X className="size-5" />
        </button>

        {/* Header Badge */}
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/70 dark:text-amber-300 dark:border-amber-800">
            <ShieldCheck className="size-3.5 text-amber-600" />
            {isGated
              ? "Telecom Regulatory Compliance (TRAI / DLT)"
              : "No Silent Mock Policy • 100% Transparent Telephony"}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2 flex items-center gap-2">
          <span>
            {isGated
              ? "Custom Cellular Dialing Currently Not Available"
              : "Physical Phone Cellular Trunk Required"}
          </span>
        </h3>

        {/* Transparent Description */}
        <p className="text-xs text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
          {isGated ? (
            <>
              Yeh feature (<strong className="font-mono text-indigo-600 dark:text-indigo-400">{targetPhone}</strong> par direct cellular call lagana) <strong>public demo mode mein currently available nahi hai</strong>. 
              Telecom regulations aur anti-spam compliance ke mutabiq, arbitrary personal numbers par cellular outbound calls restricted hoti hain.
            </>
          ) : (
            <>
              Aapne physical phone (<strong className="font-mono text-indigo-600 dark:text-indigo-400">{targetPhone}</strong>) par cellular network ke through ring bajane ki koshish ki. 
              RevClaim AI mein <strong>koi fake mock <code className="px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-rose-600 font-mono">CA_...</code> string print karke pretend karna strictly forbidden hai</strong>.
            </>
          )}
        </p>

        {/* Primary Option: Real-Time LiveKit WebRTC Voice Stream */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50/80 border border-emerald-200 dark:from-emerald-950/40 dark:to-teal-950/30 dark:border-emerald-800/60 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="size-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
              <Radio className="size-4 animate-pulse" />
            </div>
            <div>
              <h4 className="text-xs font-black text-emerald-950 dark:text-emerald-200">
                In-Browser Real-Time WebRTC Voice Engine (Instant &amp; Free)
              </h4>
              <span className="text-[10px] text-emerald-700 dark:text-emerald-300 font-medium">
                Zero Cellular Cost • &lt;400ms Ultra-Low Latency • Full 2-Way Audio
              </span>
            </div>
          </div>

          <p className="text-[11px] text-emerald-900 dark:text-emerald-200/90 mb-3 leading-relaxed">
            Aapko kisi physical carrier network ya premium recharge ki zaroorat nahi hai! 
            Aap <strong>LiveKit Real-Time WebRTC</strong> use kar sakte hain — yeh aapke computer microphone aur Sarah AI ke beech <strong>100% real-time 2-way audio stream</strong> hai jo bina kisi phone number ke instant live work karta hai!
          </p>

          <button
            onClick={() => {
              onClose();
              onLaunchLiveKitWebRTC();
            }}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md transition-all active:scale-95"
          >
            <Radio className="size-3.5" />
            <span>🎙️ Launch In-Browser Real-Time WebRTC (Works Instantly)</span>
          </button>
        </div>

        {/* Developer / Demo Recording Section */}
        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 dark:bg-slate-900/60 dark:border-white/5 mb-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <PhoneCall className="size-3.5 text-indigo-600" />
              Demo Video Recording Line: <span className="font-mono text-indigo-600 dark:text-indigo-400">+91 8840301998</span>
            </span>
            <button
              onClick={() => setShowDevTrunk(!showDevTrunk)}
              className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              {showDevTrunk ? "Hide .env" : "Show Twilio Setup"}
            </button>
          </div>

          {showDevTrunk && (
            <div className="mt-2.5 pt-2 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 space-y-1.5">
              <p>
                Aapke Twilio Free Trial account se aapke verified number (<code className="font-mono text-indigo-600">+91 8840301998</code>) par demo call 100% free lag sakti hai (Zero Upgrade / Zero Rupees):
              </p>
              <pre className="p-2 rounded-lg bg-slate-900 text-slate-100 font-mono text-[10px] overflow-x-auto">
                {twilioSnippet}
              </pre>
            </div>
          )}
        </div>

        {/* Action Footer */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200/80 dark:border-white/5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
