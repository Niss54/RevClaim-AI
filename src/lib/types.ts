export type RiskTier = "LOW" | "MEDIUM" | "CRITICAL";

export type InvoiceStatus = 
  | "OVERDUE"
  | "CALLING"
  | "PTP_AGREED"
  | "RECOVERED"
  | "DISPUTED"
  | "LEGAL_ESCALATED";

export interface Debtor {
  id: string;
  companyName: string;
  contactPerson: string;
  phone: string;
  email: string;
  riskTier: RiskTier;
  createdAt: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  debtorId: string;
  debtor: Debtor;
  amountDue: number;
  currency: string;
  dueDate: string;
  daysPastDue: number;
  deliverableSummary: string;
  status: InvoiceStatus;
  paymentLinkUrl?: string;
  ptpAmount?: number;
  ptpDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CallRecord {
  id: string;
  invoiceId: string;
  debtorName: string;
  debtorPhone: string;
  status: "idle" | "calling" | "completed" | "failed";
  mode: "live" | "demo";
  conversationId?: string;
  callSid?: string;
  createdAt: string;
  updatedAt: string;
  result?: CallResult;
}

export interface TranscriptUtterance {
  role: "agent" | "debtor";
  message: string;
  timestamp: string;
}

export interface CallResult {
  summary: string;
  ptpAmount?: number;
  ptpDate?: string;
  disputeReason?: string;
  confidence: "high" | "medium" | "low";
  transcript: TranscriptUtterance[];
}

export interface SettlementRecord {
  id: string;
  invoiceId: string;
  dodoPaymentId: string;
  amountRecovered: number;
  feeDeducted: number;
  paymentMethod: string;
  settledAt: string;
}

export interface CockpitStats {
  totalOverdueAmount: number;
  recoveredAmount: number;
  recoveryRatePercent: number;
  activeChasingCount: number;
  settledInvoicesCount: number;
}
