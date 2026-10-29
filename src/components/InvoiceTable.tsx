"use client";

import React from "react";
import { Invoice } from "@/lib/types";
import { PhoneCall, CheckCircle, Clock, ExternalLink, ShieldAlert, Zap } from "lucide-react";

interface InvoiceTableProps {
  invoices: Invoice[];
  onStartRecovery: (invoice: Invoice, mode: "simulation" | "live") => void;
  onDirectCheckout: (invoice: Invoice) => void;
}

export function InvoiceTable({
  invoices,
  onStartRecovery,
  onDirectCheckout,
}: InvoiceTableProps) {
  const getStatusBadge = (status: Invoice["status"]) => {
    switch (status) {
      case "OVERDUE":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <ShieldAlert className="w-3 h-3" />
            Overdue
          </span>
        );
      case "CALLING":
      case "IN_NEGOTIATION":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Clock className="w-3 h-3 animate-spin" />
            Calling / Negotiating
          </span>
        );
      case "PTP_AGREED":
      case "PTP_COMMITTED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Zap className="w-3 h-3 text-indigo-400" />
            Promise-to-Pay Signed
          </span>
        );
      case "RECOVERED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle className="w-3 h-3" />
            Recovered & Settled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-300">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-sm shadow-xl">
      <div className="p-5 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-white">Pending Receivables</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Select an overdue client account to dispatch Sarah (AI Voice Billing Desk)
          </p>
        </div>
        <div className="text-xs text-slate-500 font-mono">
          Live Sync: Supabase + Twilio SIP + Dodo MoR
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-950/60 text-xs uppercase font-mono text-slate-400 border-b border-slate-800">
            <tr>
              <th scope="col" className="px-6 py-3.5">Invoice #</th>
              <th scope="col" className="px-6 py-3.5">Debtor / Client</th>
              <th scope="col" className="px-6 py-3.5">Amount</th>
              <th scope="col" className="px-6 py-3.5">Status</th>
              <th scope="col" className="px-6 py-3.5">Overdue Aging</th>
              <th scope="col" className="px-6 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {invoices.map((inv) => (
              <tr key={inv.id} className="hover:bg-slate-800/30 transition">
                <td className="px-6 py-4 font-mono font-medium text-white">
                  {inv.invoiceNumber}
                  <div className="text-xs text-slate-500 font-sans mt-0.5">
                    {inv.description || inv.deliverableSummary}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-semibold text-slate-200">{inv.debtorName || inv.debtor?.contactPerson}</div>
                  <div className="text-xs text-slate-400">{inv.debtorCompany || inv.debtor?.companyName}</div>
                  <div className="text-xs text-slate-500 font-mono mt-0.5">{inv.debtorPhone || inv.debtor?.phone}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-bold text-white text-base">
                    ${((inv.amount ?? inv.amountDue) || 0).toLocaleString()}
                  </div>
                  <div className="text-[11px] text-slate-500 uppercase">{inv.currency}</div>
                </td>
                <td className="px-6 py-4">
                  {getStatusBadge(inv.status)}
                  {(inv.promiseToPayDate || inv.ptpDate) && (
                    <div className="text-xs text-indigo-400 font-mono mt-1">
                      PTP: {inv.promiseToPayDate || inv.ptpDate} (${inv.promiseToPayAmount || inv.ptpAmount})
                    </div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                        (inv.daysOverdue ?? inv.daysPastDue ?? 0) > 30
                          ? "bg-rose-950 text-rose-300 border border-rose-800"
                          : "bg-slate-800 text-slate-300"
                      }`}
                    >
                      +{inv.daysOverdue ?? inv.daysPastDue ?? 0} days
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 mt-1">Due: {inv.dueDate}</div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {inv.status !== "RECOVERED" ? (
                      <>
                        <button
                          onClick={() => onStartRecovery(inv, "simulation")}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white shadow-sm transition active:scale-95"
                          title="Interactive evaluation simulator (Voice waveform & dual dialogue)"
                        >
                          <PhoneCall className="w-3.5 h-3.5" />
                          Simulate Call
                        </button>
                        <button
                          onClick={() => onDirectCheckout(inv)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-900/40 transition active:scale-95"
                          title="Direct Dodo Payments checkout link"
                        >
                          <ExternalLink className="w-3 h-3" />
                          Dodo Pay
                        </button>
                      </>
                    ) : (
                      <span className="text-xs text-emerald-400 font-mono flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" />
                        Settled
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
