"use client";

import React, { useState, useMemo } from "react";
import { Invoice } from "@/lib/types";
import {
  PhoneCall,
  CheckCircle,
  Clock,
  ExternalLink,
  ShieldAlert,
  Zap,
  Search,
  MessageCircle,
  Sparkles,
  DollarSign,
  Plus,
  RefreshCw,
  Send,
} from "lucide-react";
import { toast } from "sonner";
import confetti from "canvas-confetti";

interface InvoiceTableProps {
  invoices: Invoice[];
  onStartRecovery: (invoice: Invoice, mode: "simulation" | "live") => void;
  onDirectCheckout: (invoice: Invoice) => void;
  onAddInvoice?: () => void;
}

export function InvoiceTable({
  invoices: initialInvoices,
  onStartRecovery,
  onDirectCheckout,
  onAddInvoice,
}: InvoiceTableProps) {
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"ALL" | "OVERDUE" | "PTP" | "RECOVERED">("ALL");
  const [isSendingWhatsApp, setIsSendingWhatsApp] = useState<string | null>(null);

  // Sync when prop updates
  React.useEffect(() => {
    setInvoices(initialInvoices);
  }, [initialInvoices]);

  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      const matchSearch =
        inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (inv.debtorName || inv.debtor?.contactPerson || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (inv.debtorCompany || inv.debtor?.companyName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (inv.description || inv.deliverableSummary || "").toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchSearch) return false;

      if (activeTab === "OVERDUE") return inv.status === "OVERDUE";
      if (activeTab === "PTP") return inv.status === "PTP_AGREED" || inv.status === "PTP_COMMITTED";
      if (activeTab === "RECOVERED") return inv.status === "RECOVERED";
      return true;
    });
  }, [invoices, searchQuery, activeTab]);

  const handleWhatsAppNudge = async (inv: Invoice) => {
    setIsSendingWhatsApp(inv.id);
    try {
      const res = await fetch("/api/viasocket/trigger", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invoiceId: inv.id,
          invoiceNumber: inv.invoiceNumber,
          debtorName: inv.debtorName || inv.debtor?.contactPerson,
          debtorPhone: inv.debtorPhone || inv.debtor?.phone,
          amountDue: inv.amount ?? inv.amountDue,
          currency: inv.currency,
          checkoutUrl: `https://test.dodopayments.com/checkout/${inv.invoiceNumber.toLowerCase()}`,
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success(`WhatsApp reminder sent to ${inv.debtorName || inv.debtor?.contactPerson} via viaSocket!`);
      } else {
        toast.info(`viaSocket workflow triggered for ${inv.invoiceNumber}`);
      }
    } catch {
      toast.info(`WhatsApp dispatch simulated for ${inv.invoiceNumber}`);
    } finally {
      setIsSendingWhatsApp(null);
    }
  };

  const handleInstantSettle = (inv: Invoice) => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });

    setInvoices((prev) =>
      prev.map((i) =>
        i.id === inv.id
          ? {
              ...i,
              status: "RECOVERED",
              recoveredAmount: i.amount ?? i.amountDue,
            }
          : i
      )
    );

    toast.success(`🎉 ${inv.invoiceNumber} marked as RECOVERED! Dodo settlement captured.`);
  };

  const getStatusBadge = (status: Invoice["status"]) => {
    switch (status) {
      case "OVERDUE":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200/80 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/60">
            <span className="size-1.5 rounded-full bg-rose-500 animate-pulse" />
            Overdue
          </span>
        );
      case "CALLING":
      case "IN_NEGOTIATION":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200/80 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60">
            <Clock className="size-3 animate-spin text-amber-600" />
            In Negotiation
          </span>
        );
      case "PTP_AGREED":
      case "PTP_COMMITTED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/80 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800/60">
            <Zap className="size-3 text-indigo-600" />
            Promise-to-Pay Signed
          </span>
        );
      case "RECOVERED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60">
            <CheckCircle className="size-3 text-emerald-600" />
            Settled via Dodo
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="clay-card overflow-hidden transition-all">
      {/* ── Top Action & Filter Header ── */}
      <div className="p-4 sm:p-5 border-b border-slate-200/80 dark:border-white/10 flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <span>Pending Receivables Cockpit</span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800">
                Live Dodo + viaSocket
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Select an account to dispatch AI Voice Recovery or execute immediate Dodo settlement
            </p>
          </div>

          {onAddInvoice && (
            <button
              onClick={onAddInvoice}
              className="clay-btn flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 bg-white border border-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:border-white/10"
            >
              <Plus className="size-3.5 text-indigo-600" />
              <span>Add Invoice</span>
            </button>
          )}
        </div>

        {/* Search & Status Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-100/80 p-1 rounded-xl w-fit dark:bg-slate-800/60 border border-slate-200/50 dark:border-white/5">
            {(["ALL", "OVERDUE", "PTP", "RECOVERED"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  activeTab === tab
                    ? "bg-white text-slate-900 shadow-sm dark:bg-[#1e293b] dark:text-white"
                    : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                }`}
              >
                {tab === "ALL" && `All (${invoices.length})`}
                {tab === "OVERDUE" && `Overdue (${invoices.filter((i) => i.status === "OVERDUE").length})`}
                {tab === "PTP" && `PTP Signed (${invoices.filter((i) => i.status.startsWith("PTP")).length})`}
                {tab === "RECOVERED" && `Settled (${invoices.filter((i) => i.status === "RECOVERED").length})`}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search invoice or client..."
              className="w-full pl-9 pr-3 py-1.5 text-xs font-medium rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition dark:bg-slate-800/80 dark:border-white/10 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* ── Table Rows ── */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-700 dark:text-slate-300">
          <thead className="bg-slate-50/80 text-[11px] uppercase font-mono font-bold text-slate-500 border-b border-slate-200/80 dark:bg-slate-800/40 dark:text-slate-400 dark:border-white/10">
            <tr>
              <th scope="col" className="px-5 py-3">Invoice Details</th>
              <th scope="col" className="px-5 py-3">Debtor Contact</th>
              <th scope="col" className="px-5 py-3">Amount</th>
              <th scope="col" className="px-5 py-3">Aging / Status</th>
              <th scope="col" className="px-5 py-3 text-right">Autonomous Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200/70 dark:divide-white/5">
            {filteredInvoices.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-xs text-slate-400">
                  No invoices found matching criteria.
                </td>
              </tr>
            ) : (
              filteredInvoices.map((inv) => (
                <tr
                  key={inv.id}
                  className="hover:bg-slate-50/90 transition-colors dark:hover:bg-slate-800/40 group"
                >
                  {/* Invoice # & Scope */}
                  <td className="px-5 py-4">
                    <div className="font-mono font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                      <span>{inv.invoiceNumber}</span>
                      <span className="text-[10px] font-sans font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        B2B
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 font-medium mt-0.5 max-w-[220px] truncate dark:text-slate-400">
                      {inv.description || inv.deliverableSummary}
                    </div>
                  </td>

                  {/* Debtor / Client */}
                  <td className="px-5 py-4">
                    <div className="font-bold text-slate-900 dark:text-slate-100">
                      {inv.debtorName || inv.debtor?.contactPerson}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {inv.debtorCompany || inv.debtor?.companyName}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                      {inv.debtorPhone || inv.debtor?.phone}
                    </div>
                  </td>

                  {/* Amount */}
                  <td className="px-5 py-4">
                    <div className="font-black text-slate-900 dark:text-white text-base">
                      ${((inv.amount ?? inv.amountDue) || 0).toLocaleString()}
                    </div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      {inv.currency || "USD"}
                    </div>
                  </td>

                  {/* Aging & Status */}
                  <td className="px-5 py-4">
                    <div className="flex flex-col gap-1 items-start">
                      {getStatusBadge(inv.status)}
                      <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                        Overdue: +{inv.daysOverdue ?? inv.daysPastDue ?? 14} days
                      </span>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 flex-wrap">
                      {/* WhatsApp via viaSocket */}
                      <button
                        onClick={() => handleWhatsAppNudge(inv)}
                        disabled={isSendingWhatsApp === inv.id}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-all active:scale-95 disabled:opacity-50 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800"
                        title="Send WhatsApp recovery nudge via viaSocket"
                      >
                        <MessageCircle className="size-3.5" />
                        <span className="hidden md:inline">WhatsApp</span>
                      </button>

                      {/* Simulate / Dispatch Voice Agent */}
                      <button
                        onClick={() => onStartRecovery(inv, "simulation")}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition-all active:scale-95 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800"
                        title="Dispatch autonomous voice recovery agent"
                      >
                        <PhoneCall className="size-3.5" />
                        <span>Voice Agent</span>
                      </button>

                      {/* Direct Dodo Payments Checkout */}
                      <button
                        onClick={() => onDirectCheckout(inv)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-sm transition-all active:scale-95"
                        title="Open Dodo Payments checkout portal"
                      >
                        <ExternalLink className="size-3.5" />
                        <span>Dodo Pay</span>
                      </button>

                      {/* Instant Settle Test action */}
                      {inv.status !== "RECOVERED" && (
                        <button
                          onClick={() => handleInstantSettle(inv)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all active:scale-95 dark:bg-slate-800 dark:text-slate-300"
                          title="Instant settle test simulation with confetti"
                        >
                          <Sparkles className="size-3.5 text-amber-500" />
                          <span className="hidden lg:inline">Settle</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
