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
  onLaunchLiveKitWebRTC: () => void;
}

export function TwilioSetupModal({
  isOpen,
  onClose,
  targetPhone = "+91 8840301998",
  onLaunchLiveKitWebRTC,
}: TwilioSetupModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const twilioSnippet = `TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_PHONE_NUMBER=+1xxxxxxxxxx`;

  const handleCopy = () => {
    navigator.clipboard.writeText(twilioSnippet);
    setCopied(true);
    toast.success("Twilio .env template copied to clipboard!");
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="clay-card relative w-full max-w-lg overflow-hidden border border-indigo-200/80 bg-white p-6 shadow-2xl dark:bg-[#0c1420] dark:border-white/10">
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
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-950/70 dark:text-indigo-300 dark:border-indigo-800">
            <ShieldCheck className="size-3.5 text-indigo-600" />
            No Silent Mock Policy • 100% Transparent Telephony
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2 flex items-center gap-2">
          <span>Physical Phone Cellular Trunk Required</span>
        </h3>

        {/* Transparent Description */}
        <p className="text-xs text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
          Aapne physical phone (<strong className="font-mono text-indigo-600 dark:text-indigo-400">{targetPhone}</strong>) par cellular network ke through ring bajane ki koshish ki. 
          RevClaim AI me <strong>koi fake mock <code className="px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-rose-600 font-mono">CA_...</code> string generate karke pretend karna strictly forbidden hai</strong>.
        </p>

        {/* Primary Option: Real-Time LiveKit WebRTC Voice Stream */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50/80 border border-emerald-200 dark:from-emerald-950/40 dark:to-teal-950/30 dark:border-emerald-800/60 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="size-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
              <Radio className="size-4 animate-pulse" />
            </div>
            <div>
              <h4 className="text-xs font-black text-emerald-950 dark:text-emerald-200">
                In-Browser LiveKit WebRTC Real-Time Voice Engine
              </h4>
              <span className="text-[10px] text-emerald-700 dark:text-emerald-300 font-medium">
                Zero Telecom Cost • &lt;400ms Ultra-Low Latency
              </span>
            </div>
          </div>

          <p className="text-[11px] text-emerald-900 dark:text-emerald-200/90 mb-3 leading-relaxed">
            Aap <strong>LiveKit WebRTC Voice Engine</strong> use kar sakte hain — yeh koi test ya mock nahi hai, balki <strong>100% Real-Time Production Audio Stream</strong> hai jo bina kisi cellular recharge ke aapke browser aur Sarah AI ke beech directly real-time me work karta hai!
          </p>

          <button
            onClick={() => {
              onClose();
              onLaunchLiveKitWebRTC();
            }}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md transition-all active:scale-95"
          >
            <Radio className="size-3.5" />
            <span>Launch LiveKit Real-Time Voice Session</span>
          </button>
        </div>

        {/* Secondary Option: Physical Phone PSTN Setup (Twilio) */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 dark:bg-slate-900/60 dark:border-white/5 mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <PhoneCall className="size-3.5 text-indigo-600" />
              Physical Cellular Ringing (Twilio PSTN Setup)
            </span>
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
            >
              {copied ? <Check className="size-3 text-emerald-600" /> : <Copy className="size-3" />}
              <span>{copied ? "Copied" : "Copy Template"}</span>
            </button>
          </div>

          <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-2 leading-relaxed">
            Agar aap actual mobile phone par ghanti bajana chahte hain, toh apne <code className="font-mono text-indigo-600">.env</code> file me yeh 3 variables set kar dijiye:
          </p>

          <pre className="p-2.5 rounded-xl bg-slate-900 text-slate-100 font-mono text-[10px] overflow-x-auto border border-slate-800">
            {twilioSnippet}
          </pre>
        </div>

        {/* Action Footer */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200/80 dark:border-white/5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition"
          >
            Close / Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}
