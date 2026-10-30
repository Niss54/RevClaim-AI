'use client';

import React, { useState } from 'react';
import {
  Building2,
  Check,
  Copy,
  CreditCard,
  Eye,
  EyeOff,
  Globe2,
  Key,
  PhoneCall,
  Save,
  Scale,
  ShieldCheck,
  Sparkles,
  Zap,
} from 'lucide-react';
import { toast } from 'sonner';

export function SettingsPanel() {
  const [isSaving, setIsSaving] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [copiedWebhook, setCopiedWebhook] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    orgName: 'Acme Creative Studios',
    billingEmail: 'finance@acmestudios.com',
    currency: 'INR',
    udyamNumber: 'UDYAM-UP-28-0091823',
    dodoApiKey: 'dodo_test_4ZdsiUM9bORAPQtA.VJxMBYbxGbBHQzwS0zFKp3RCfK8ZS0WU8t',
    dodoSecret: 'whsec_awFVdsgMP0X/kby7G//qOLqOmH2x/nvR',
    webhookEndpoint: 'https://rev-claim-ai.vercel.app/api/webhook/dodo',
    testMode: true,
    voicePersona: 'sarah_conversational',
    autoDispatchWhatsapp: true,
    frequencyCapDays: '48',
    viasocketMcp: 'https://mcp.docstar.io/connector/viasocket_api',
    mushroomOrgId: '84025',
  });

  const handleCopyWebhook = () => {
    navigator.clipboard.writeText(formData.webhookEndpoint);
    setCopiedWebhook(true);
    toast.success('Webhook endpoint copied to clipboard!');
    setTimeout(() => setCopiedWebhook(false), 2000);
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Settings updated successfully! RevClaim Voice Agent & Dodo MoR synchronized.');
    }, 800);
  };

  return (
    <div className="space-y-6 max-w-5xl w-full mx-auto pb-12" data-lenis-prevent>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4 dark:border-slate-800/80">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-tr from-sky-400 to-indigo-500 text-white shadow-md">
              <Zap className="size-5" />
            </span>
            Platform & Recovery Desk Settings
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Configure your Dodo Payments MoR merchant keys, telephony voice engine, MSME legal protections, and viaSocket MCP automation.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="clay-btn-primary flex items-center gap-2 self-start sm:self-auto px-5 py-2.5 text-xs font-black tracking-wide"
        >
          {isSaving ? (
            <span className="animate-spin">⏳</span>
          ) : (
            <Save className="size-4" />
          )}
          <span>{isSaving ? 'SAVING...' : 'SAVE SETTINGS'}</span>
        </button>
      </div>

      {/* Grid of Settings Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* ── CARD 1: Organization & Legal Profile ─────────────────────── */}
        <div className="clay-card flex flex-col justify-between p-5 space-y-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 border-b border-slate-200/60 pb-3 dark:border-slate-800/60">
              <Building2 className="size-4 text-sky-500" />
              <h3 className="text-sm font-black text-slate-800 dark:text-slate-100 uppercase tracking-wider">
                Organization & MSME Identity
              </h3>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Agency / Freelancer Studio Name
                </label>
                <input
                  type="text"
                  value={formData.orgName}
                  onChange={(e) => setFormData({ ...formData, orgName: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-white/80 px-3 py-2 font-medium text-slate-800 shadow-inner outline-none focus:ring-2 focus:ring-emerald-500 dark:border-white/10 dark:bg-[#121215] dark:text-white"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Billing Desk Contact Email
                </label>
                <input
                  type="email"
                  value={formData.billingEmail}
                  onChange={(e) => setFormData({ ...formData, billingEmail: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-white/80 px-3 py-2 font-medium text-slate-800 shadow-inner outline-none focus:ring-2 focus:ring-emerald-500 dark:border-white/10 dark:bg-[#121215] dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Base Currency
                  </label>
                  <select
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-white/80 px-3 py-2 font-medium text-slate-800 shadow-inner outline-none focus:ring-2 focus:ring-emerald-500 dark:border-white/10 dark:bg-[#121215] dark:text-white"
                  >
                    <option value="INR">INR (₹) — India Domestic</option>
                    <option value="USD">USD ($) — Global / US</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1 flex items-center gap-1">
                    <Scale className="size-3 text-emerald-500" />
                    MSME Status
                  </label>
                  <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-100 px-2.5 py-1 text-[11px] font-bold text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300">
                    <ShieldCheck className="size-3.5" /> MSMED Act Sec 16 Active
                  </span>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Udyam Registration Number (Statutory Interest Shield)
                </label>
                <input
                  type="text"
                  value={formData.udyamNumber}
                  onChange={(e) => setFormData({ ...formData, udyamNumber: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-white/80 px-3 py-2 font-mono font-medium text-slate-800 shadow-inner outline-none focus:ring-2 focus:ring-emerald-500 dark:border-white/10 dark:bg-[#121215] dark:text-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── CARD 2: Dodo Payments (Merchant of Record) ──────────────── */}
        <div className="clay-card flex flex-col justify-between p-5 space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200/60 pb-3 dark:border-slate-800/60">
              <div className="flex items-center gap-2.5">
                <CreditCard className="size-4 text-emerald-500" />
                <h3 className="text-sm font-black text-slate-800 dark:text-slate-100 uppercase tracking-wider">
                  Dodo Payments (MoR)
                </h3>
              </div>
              <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-mono font-black text-emerald-600 border border-emerald-500/20 dark:text-emerald-400">
                MERCHANT OF RECORD
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Dodo Secret API Key
                </label>
                <div className="relative flex items-center">
                  <input
                    type={showApiKey ? 'text' : 'password'}
                    value={formData.dodoApiKey}
                    onChange={(e) => setFormData({ ...formData, dodoApiKey: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-white/80 px-3 py-2 pr-9 font-mono font-medium text-slate-800 shadow-inner outline-none focus:ring-2 focus:ring-emerald-500 dark:border-white/10 dark:bg-[#121215] dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute right-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showApiKey ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Dodo Webhook Signing Secret
                </label>
                <input
                  type="password"
                  value={formData.dodoSecret}
                  onChange={(e) => setFormData({ ...formData, dodoSecret: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-white/80 px-3 py-2 font-mono font-medium text-slate-800 shadow-inner outline-none focus:ring-2 focus:ring-emerald-500 dark:border-white/10 dark:bg-[#121215] dark:text-white"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Live Webhook Callback URL
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={formData.webhookEndpoint}
                    className="w-full rounded-xl border border-slate-200 bg-slate-100/90 px-3 py-2 font-mono text-[11px] text-slate-600 shadow-inner outline-none dark:border-white/10 dark:bg-[#151518] dark:text-slate-300"
                  />
                  <button
                    type="button"
                    onClick={handleCopyWebhook}
                    className="clay-btn shrink-0 p-2 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
                    title="Copy Webhook URL"
                  >
                    {copiedWebhook ? <Check className="size-4 text-emerald-500" /> : <Copy className="size-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-slate-100/80 p-2.5 dark:bg-[#18181c] border border-slate-200/50 dark:border-white/5">
                <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                  Automated Source Deduction Split
                </span>
                <span className="text-[10px] font-mono font-black text-indigo-600 dark:text-indigo-400">
                  2.5% or ₹199 retained at source
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── CARD 3: Telephony & Autonomous Voice Specialist ─────────── */}
        <div className="clay-card flex flex-col justify-between p-5 space-y-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 border-b border-slate-200/60 pb-3 dark:border-slate-800/60">
              <PhoneCall className="size-4 text-purple-500" />
              <h3 className="text-sm font-black text-slate-800 dark:text-slate-100 uppercase tracking-wider">
                Voice Specialist & Telephony
              </h3>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  AI Specialist Voice Persona
                </label>
                <select
                  value={formData.voicePersona}
                  onChange={(e) => setFormData({ ...formData, voicePersona: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-white/80 px-3 py-2 font-medium text-slate-800 shadow-inner outline-none focus:ring-2 focus:ring-emerald-500 dark:border-white/10 dark:bg-[#121215] dark:text-white"
                >
                  <option value="sarah_conversational">Sarah — Accounts Recovery Lead (Courteous & Empathetic)</option>
                  <option value="nalini_indic">Nalini — Sovereign Indic Voice (Gnani Timbre v2.5)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Call Anti-Spam Frequency Cap
                </label>
                <select
                  value={formData.frequencyCapDays}
                  onChange={(e) => setFormData({ ...formData, frequencyCapDays: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-white/80 px-3 py-2 font-medium text-slate-800 shadow-inner outline-none focus:ring-2 focus:ring-emerald-500 dark:border-white/10 dark:bg-[#121215] dark:text-white"
                >
                  <option value="48">Strict 1 call every 48 hours (Recommended)</option>
                  <option value="72">Gentle 1 call every 72 hours</option>
                  <option value="24">Urgent 1 call every 24 hours</option>
                </select>
              </div>

              <div className="rounded-xl border border-emerald-200/80 bg-emerald-50/60 p-3 text-slate-700 dark:border-emerald-900/40 dark:bg-[#16211d] dark:text-slate-300">
                <span className="font-bold block text-emerald-800 dark:text-emerald-400 mb-0.5">
                  Autonomous Dispute Circuit Breaker:
                </span>
                If debtor states deliverable dispute or quality issue on the call, AI halts calls immediately and alerts billing lead.
              </div>
            </div>
          </div>
        </div>

        {/* ── CARD 4: viaSocket MCP & Multi-App Sync ──────────────────── */}
        <div className="clay-card flex flex-col justify-between p-5 space-y-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 border-b border-slate-200/60 pb-3 dark:border-slate-800/60">
              <Globe2 className="size-4 text-emerald-500" />
              <h3 className="text-sm font-black text-slate-800 dark:text-slate-100 uppercase tracking-wider">
                viaSocket MCP Automation
              </h3>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  DocStar MCP Connector Endpoint
                </label>
                <input
                  type="text"
                  value={formData.viasocketMcp}
                  onChange={(e) => setFormData({ ...formData, viasocketMcp: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-white/80 px-3 py-2 font-mono text-slate-800 shadow-inner outline-none focus:ring-2 focus:ring-emerald-500 dark:border-white/10 dark:bg-[#121215] dark:text-white"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  viaSocket Mushroom Organization ID
                </label>
                <input
                  type="text"
                  value={formData.mushroomOrgId}
                  onChange={(e) => setFormData({ ...formData, mushroomOrgId: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-white/80 px-3 py-2 font-mono text-slate-800 shadow-inner outline-none focus:ring-2 focus:ring-emerald-500 dark:border-white/10 dark:bg-[#121215] dark:text-white"
                />
              </div>

              <div className="flex items-center justify-between rounded-xl bg-slate-100/80 p-2.5 dark:bg-[#18181c] border border-slate-200/50 dark:border-white/5">
                <span className="font-bold text-slate-700 dark:text-slate-300">
                  Instant WhatsApp Receipt Sync
                </span>
                <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 font-bold text-emerald-700 dark:text-emerald-400">
                  ACTIVE
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
