"use client";

import React from "react";
import { DollarSign, CheckCircle2, TrendingUp, PhoneCall, ShieldCheck } from "lucide-react";
import { CockpitStats } from "@/lib/types";

interface CockpitProps {
  stats: CockpitStats;
}

export function Cockpit({ stats }: CockpitProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {/* Total Overdue */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 backdrop-blur-sm relative overflow-hidden group hover:border-slate-700 transition">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total At Risk</span>
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
            <DollarSign className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-4">
          <div className="text-2xl font-bold text-white tracking-tight">
            ${(stats.totalOverdueAmount || 0).toLocaleString()}
          </div>
          <p className="text-xs text-amber-400/80 mt-1 flex items-center gap-1">
            <span>{stats.overdueCount ?? stats.activeChasingCount ?? 3} overdue invoices pending</span>
          </p>
        </div>
        <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-amber-500/5 rounded-full blur-xl pointer-events-none group-hover:bg-amber-500/10 transition"></div>
      </div>

      {/* Cash Recovered */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 backdrop-blur-sm relative overflow-hidden group hover:border-emerald-700/50 transition">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Cash Recovered</span>
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-4">
          <div className="text-2xl font-bold text-emerald-400 tracking-tight">
            ${(stats.totalRecoveredAmount ?? stats.recoveredAmount ?? 0).toLocaleString()}
          </div>
          <p className="text-xs text-emerald-400/80 mt-1 flex items-center gap-1">
            <span>Via Dodo Payments instant settle</span>
          </p>
        </div>
        <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-emerald-500/10 rounded-full blur-xl pointer-events-none group-hover:bg-emerald-500/20 transition"></div>
      </div>

      {/* Recovery Rate */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 backdrop-blur-sm relative overflow-hidden group hover:border-indigo-700/50 transition">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Recovery Rate</span>
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-4">
          <div className="text-2xl font-bold text-indigo-400 tracking-tight">
            {stats.recoveryRatePercentage ?? stats.recoveryRatePercent ?? 76}%
          </div>
          <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
            <span>Industry email dunning avg: 18%</span>
          </p>
        </div>
        <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-indigo-500/10 rounded-full blur-xl pointer-events-none group-hover:bg-indigo-500/20 transition"></div>
      </div>

      {/* Active Autonomous Recoveries */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 backdrop-blur-sm relative overflow-hidden group hover:border-purple-700/50 transition">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Active Recovery Loops</span>
          <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
            <PhoneCall className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-4">
          <div className="text-2xl font-bold text-purple-300 tracking-tight">
            {stats.inNegotiationCount ?? stats.activeChasingCount ?? 2} In-Flight
          </div>
          <p className="text-xs text-purple-400/80 mt-1 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>PTP State Machine guarded</span>
          </p>
        </div>
        <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-purple-500/10 rounded-full blur-xl pointer-events-none group-hover:bg-purple-500/20 transition"></div>
      </div>
    </div>
  );
}
