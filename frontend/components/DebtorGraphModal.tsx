"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  ShieldAlert,
  Share2,
  Building2,
  User,
  AlertTriangle,
  FileText,
  Scale,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Info,
} from "lucide-react";
import { fetchDebtorSyndicate, DebtorSyndicateResult, GraphNode } from "@/lib/tigergraph";

interface DebtorGraphModalProps {
  isOpen: boolean;
  onClose: () => void;
  debtorCompany: string;
}

export function DebtorGraphModal({ isOpen, onClose, debtorCompany }: DebtorGraphModalProps) {
  const [data, setData] = useState<DebtorSyndicateResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    fetchDebtorSyndicate(debtorCompany).then((res) => {
      setData(res);
      if (res?.nodes?.length) {
        // default select the shared director node
        const directorNode = res.nodes.find((n) => n.type === "Director") || res.nodes[0];
        setSelectedNode(directorNode);
      }
      setLoading(false);
    });
  }, [isOpen, debtorCompany]);

  if (!isOpen) return null;

  const getNodeColor = (type: string, status: string) => {
    switch (type) {
      case "Freelancer":
        return "fill-emerald-500 stroke-emerald-600 text-emerald-600";
      case "Invoice":
        return "fill-amber-500 stroke-amber-600 text-amber-600";
      case "DebtorCompany":
        return status === "defaulted"
          ? "fill-rose-500 stroke-rose-600 text-rose-600"
          : "fill-blue-500 stroke-blue-600 text-blue-600";
      case "Director":
        return "fill-purple-500 stroke-purple-600 text-purple-600";
      case "DefaultRecord":
        return "fill-red-600 stroke-red-700 text-red-600";
      default:
        return "fill-slate-500 stroke-slate-600 text-slate-600";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="clay-card w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-slate-200 dark:border-white/10">
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200/80 dark:border-white/10 flex items-center justify-between bg-slate-50/90 dark:bg-[#18181c]">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-200 dark:bg-rose-950/60 dark:text-rose-400 dark:border-rose-800 shadow-xs">
              <Share2 className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-slate-900 dark:text-white text-base">
                  TigerGraph Debtor Syndicate Intelligence
                </h3>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300">
                  Savanna GSQL
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Multi-Hop Corporate Veil Piercing & Serial Defaulter Ring Detection
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-800 transition"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {/* Syndicate Risk Metric Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-rose-50/80 border border-rose-200 dark:bg-rose-950/30 dark:border-rose-800/50 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider block">
                  Syndicate Risk Score
                </span>
                <span className="text-2xl font-black text-rose-700 dark:text-rose-300 font-mono">
                  {data?.syndicateRiskScore || 87} / 100
                </span>
              </div>
              <ShieldAlert className="size-8 text-rose-500 shrink-0" />
            </div>

            <div className="p-4 rounded-2xl bg-purple-50/80 border border-purple-200 dark:bg-purple-950/30 dark:border-purple-800/50 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider block">
                  Shared Directors
                </span>
                <span className="text-xl font-black text-purple-700 dark:text-purple-300">
                  {data?.sharedDirectors?.[0]?.name || "Rajesh Verma"}
                </span>
                <span className="text-[10px] text-purple-500 font-mono block">DIN: 08921142</span>
              </div>
              <User className="size-7 text-purple-500 shrink-0" />
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 dark:bg-amber-950/30 dark:border-amber-800/50 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider block">
                  Linked Unpaid Debt
                </span>
                <span className="text-2xl font-black text-amber-800 dark:text-amber-300 font-mono">
                  ₹4,65,000
                </span>
                <span className="text-[10px] text-amber-600 block">Across 2 Sister Entities</span>
              </div>
              <Scale className="size-8 text-amber-600 shrink-0" />
            </div>
          </div>

          {/* Interactive Graph Canvas Visualizer */}
          <div className="relative rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-900 p-4 overflow-hidden h-72 flex items-center justify-center">
            {/* SVG Graph Topology */}
            <svg className="w-full h-full" viewBox="0 0 700 240">
              <defs>
                <marker id="arrow" viewBox="0 0 10 10" refX="22" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#64748b" />
                </marker>
              </defs>

              {/* Edges */}
              <line x1="80" y1="120" x2="200" y2="120" stroke="#64748b" strokeWidth="2" strokeDasharray="4" markerEnd="url(#arrow)" />
              <line x1="200" y1="120" x2="330" y2="120" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrow)" />
              <line x1="330" y1="120" x2="460" y2="120" stroke="#a855f7" strokeWidth="2.5" markerEnd="url(#arrow)" />
              <line x1="460" y1="120" x2="570" y2="60" stroke="#f43f5e" strokeWidth="2" markerEnd="url(#arrow)" />
              <line x1="460" y1="120" x2="570" y2="180" stroke="#f43f5e" strokeWidth="2" markerEnd="url(#arrow)" />
              <line x1="570" y1="60" x2="660" y2="60" stroke="#ef4444" strokeWidth="2" strokeDasharray="3" />
              <line x1="570" y1="180" x2="660" y2="180" stroke="#ef4444" strokeWidth="2" strokeDasharray="3" />

              {/* Edge Labels */}
              <text x="140" y="112" fill="#94a3b8" fontSize="9" textAnchor="middle">ISSUED_BY</text>
              <text x="265" y="112" fill="#94a3b8" fontSize="9" textAnchor="middle">BILLED_TO</text>
              <text x="395" y="112" fill="#c084fc" fontSize="9" textAnchor="middle" fontWeight="bold">DIRECTED_BY</text>
              <text x="500" y="80" fill="#fda4af" fontSize="9" textAnchor="middle">CO-DIRECTS</text>
              <text x="500" y="160" fill="#fda4af" fontSize="9" textAnchor="middle">CO-DIRECTS</text>

              {/* Nodes */}
              {/* Node 1: Freelancer */}
              <g className="cursor-pointer" onClick={() => setSelectedNode(data?.nodes[0] || null)}>
                <circle cx="80" cy="120" r="18" fill="#10b981" />
                <text x="80" y="152" fill="#e2e8f0" fontSize="10" textAnchor="middle" fontWeight="bold">Nishant (Creditor)</text>
              </g>

              {/* Node 2: Invoice */}
              <g className="cursor-pointer" onClick={() => setSelectedNode(data?.nodes[1] || null)}>
                <circle cx="200" cy="120" r="15" fill="#f59e0b" />
                <text x="200" y="152" fill="#e2e8f0" fontSize="10" textAnchor="middle" fontWeight="bold">₹45k Invoice</text>
              </g>

              {/* Node 3: Target Company */}
              <g className="cursor-pointer" onClick={() => setSelectedNode(data?.nodes[2] || null)}>
                <circle cx="330" cy="120" r="22" fill="#3b82f6" stroke="#93c5fd" strokeWidth="3" />
                <text x="330" y="156" fill="#e2e8f0" fontSize="11" textAnchor="middle" fontWeight="black">TechFlow Solutions</text>
              </g>

              {/* Node 4: Shared Director (Central Pivot) */}
              <g className="cursor-pointer" onClick={() => setSelectedNode(data?.nodes[3] || null)}>
                <circle cx="460" cy="120" r="22" fill="#8b5cf6" stroke="#c084fc" strokeWidth="3" />
                <text x="460" y="156" fill="#f3e8ff" fontSize="11" textAnchor="middle" fontWeight="black">Rajesh Verma (DIN)</text>
              </g>

              {/* Node 5: Sister Company 1 */}
              <g className="cursor-pointer" onClick={() => setSelectedNode(data?.nodes[4] || null)}>
                <circle cx="570" cy="60" r="17" fill="#f43f5e" />
                <text x="570" y="92" fill="#fecdd3" fontSize="10" textAnchor="middle" fontWeight="bold">Zenith Media</text>
              </g>

              {/* Node 6: Sister Company 2 */}
              <g className="cursor-pointer" onClick={() => setSelectedNode(data?.nodes[5] || null)}>
                <circle cx="570" cy="180" r="17" fill="#f43f5e" />
                <text x="570" y="212" fill="#fecdd3" fontSize="10" textAnchor="middle" fontWeight="bold">Apex Digital</text>
              </g>

              {/* Node 7: MSME Default 1 */}
              <g className="cursor-pointer" onClick={() => setSelectedNode(data?.nodes[6] || null)}>
                <rect x="645" y="48" width="24" height="24" rx="4" fill="#dc2626" />
                <text x="657" y="64" fill="#fff" fontSize="9" textAnchor="middle" fontWeight="bold">₹1.8L</text>
              </g>

              {/* Node 8: MSME Default 2 */}
              <g className="cursor-pointer" onClick={() => setSelectedNode(data?.nodes[7] || null)}>
                <rect x="645" y="168" width="24" height="24" rx="4" fill="#dc2626" />
                <text x="657" y="184" fill="#fff" fontSize="9" textAnchor="middle" fontWeight="bold">₹2.4L</text>
              </g>
            </svg>

            <div className="absolute top-3 left-3 flex items-center gap-2 bg-slate-950/80 px-2.5 py-1 rounded-lg text-[10px] text-slate-300 font-mono border border-slate-800">
              <span className="size-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>GSQL Traversal: 14ms (3-hop neighborhood)</span>
            </div>
          </div>

          {/* Legal Leverage Excerpt Used by Voice Agent */}
          <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 dark:bg-indigo-950/30 dark:border-indigo-800/50 space-y-2">
            <div className="flex items-center gap-2 text-xs font-black text-indigo-900 dark:text-indigo-300">
              <Scale className="size-4 text-indigo-600 dark:text-indigo-400" />
              <span>Voice Agent Call Leverage (Grounded in Graph Proof)</span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed italic bg-white/70 dark:bg-[#151518] p-3 rounded-xl border border-indigo-100 dark:border-indigo-900/40 font-serif">
              "{data?.agentCallScript || "Mr. Rahul, our compliance graph indicates that TechFlow Solutions shares common directorship with Zenith Media and Apex Digital, which currently have 2 active MSME Samadhaan non-compliance filings. Settling this invoice right now prevents cross-entity credit impairment across your director group."}"
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200/80 dark:border-white/10 flex items-center justify-between bg-slate-50/90 dark:bg-[#18181c]">
          <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Info className="size-3.5" />
            <span>TigerGraph Savanna MCP Model Context Protocol Enabled</span>
          </span>
          <button
            onClick={onClose}
            className="clay-btn-primary px-5 py-2 text-xs font-bold shadow-md hover:scale-105 active:scale-95 transition"
          >
            Close Investigation
          </button>
        </div>
      </div>
    </div>
  );
}
