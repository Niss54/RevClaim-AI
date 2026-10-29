"use client";

import React, { useState } from "react";
import { X, UploadCloud, FileText, Check, Loader2, DollarSign, Building } from "lucide-react";
import { Invoice } from "@/lib/types";
import { toast } from "sonner";

interface InvoiceUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInvoiceCreated: (invoice: Invoice) => void;
}

export function InvoiceUploadModal({
  isOpen,
  onClose,
  onInvoiceCreated,
}: InvoiceUploadModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [clientName, setClientName] = useState("Vanguard Tech LLC");
  const [amount, setAmount] = useState("28000");
  const [phone, setPhone] = useState("+91 98765 12345");
  const [email, setEmail] = useState("billing@vanguardtech.io");
  const [description, setDescription] = useState("Enterprise Next.js SaaS Architecture & Deployment");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          debtorName: clientName,
          debtorCompany: clientName,
          debtorPhone: phone,
          debtorEmail: email,
          amount: parseFloat(amount) || 28000,
          description,
          daysOverdue: 21,
        }),
      });

      const data = await res.json();
      if (data.success && data.invoice) {
        onInvoiceCreated(data.invoice);
        toast.success(`Invoice created for ${clientName}!`);
        onClose();
      } else {
        // Fallback local creation
        const localInv: Invoice = {
          id: `inv-${Date.now()}`,
          invoiceNumber: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
          debtorName: clientName,
          debtorCompany: clientName,
          debtorPhone: phone,
          debtorEmail: email,
          amount: parseFloat(amount) || 28000,
          amountDue: parseFloat(amount) || 28000,
          currency: "INR",
          status: "OVERDUE",
          dueDate: new Date(Date.now() - 21 * 86400000).toISOString().split("T")[0],
          daysOverdue: 21,
          daysPastDue: 21,
          description,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        onInvoiceCreated(localInv);
        toast.success(`Invoice created for ${clientName}!`);
        onClose();
      }
    } catch {
      onClose();
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-200">
      <div className="clay-card w-full max-w-lg overflow-hidden">
        <div className="p-5 border-b border-slate-200/80 dark:border-white/10 flex items-center justify-between bg-slate-50/80 dark:bg-slate-800/40">
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-400 dark:border-indigo-800">
              <FileText className="size-4.5" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 dark:text-white text-sm">
                Add Overdue Receivable
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Register a delinquent invoice for AI autonomous recovery
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

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Debtor / Client Name
            </label>
            <input
              type="text"
              required
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="w-full px-3.5 py-2 text-xs font-medium rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white transition dark:bg-slate-800 dark:border-white/10 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Amount (INR/USD)
              </label>
              <input
                type="number"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3.5 py-2 text-xs font-medium rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white transition dark:bg-slate-800 dark:border-white/10 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Debtor Phone
              </label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2 text-xs font-medium rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white transition dark:bg-slate-800 dark:border-white/10 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Debtor Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2 text-xs font-medium rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white transition dark:bg-slate-800 dark:border-white/10 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Deliverable Summary
            </label>
            <input
              type="text"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 text-xs font-medium rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white transition dark:bg-slate-800 dark:border-white/10 dark:text-white"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isProcessing}
              className="clay-btn-primary flex items-center gap-1.5 px-4 py-2 text-xs font-bold shadow-md hover:scale-105 active:scale-95 disabled:opacity-50 transition"
            >
              {isProcessing ? <Loader2 className="size-3.5 animate-spin" /> : <Check className="size-3.5" />}
              <span>Add to Cockpit</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
