"use client";

import React, { useState } from "react";
import { X, UploadCloud, FileText, Check, Loader2 } from "lucide-react";
import { Invoice } from "@/lib/types";

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
  const [amount, setAmount] = useState("2800");
  const [phone, setPhone] = useState("+1 (555) 749-3921");
  const [email, setEmail] = useState("billing@vanguardtech.io");
  const [description, setDescription] = useState("Fullstack Web Platform Development");

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
          amount: parseFloat(amount) || 2800,
          description,
          daysOverdue: 42,
        }),
      });

      const data = await res.json();
      if (data.success && data.invoice) {
        onInvoiceCreated(data.invoice);
        onClose();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
              <UploadCloud className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-sm">Add Unpaid Invoice</h3>
              <p className="text-xs text-slate-400">Zero manual forms — auto-extract from PDF or quick-add</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="border-2 border-dashed border-slate-700 hover:border-indigo-500 rounded-xl p-4 text-center cursor-pointer bg-slate-950/40 transition">
            <FileText className="w-8 h-8 text-indigo-400 mx-auto mb-2 opacity-80" />
            <p className="text-xs text-slate-300 font-medium">Drag & drop your unpaid invoice PDF</p>
            <p className="text-[11px] text-slate-500 mt-1">
              Parsed instantly in ~1.5s (Wispr Flow / Gemini OCR extraction)
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="text-slate-400 font-medium block mb-1">Client / Company Name</label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label className="text-slate-400 font-medium block mb-1">Overdue Amount ($)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label className="text-slate-400 font-medium block mb-1">Client Phone (Twilio/WhatsApp)</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label className="text-slate-400 font-medium block mb-1">Client Billing Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-slate-400 font-medium block mb-1 text-xs">Scope of Work</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isProcessing}
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white transition flex items-center gap-1.5 shadow-lg shadow-indigo-600/20"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5" />
                  Enqueue for AI Recovery
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
