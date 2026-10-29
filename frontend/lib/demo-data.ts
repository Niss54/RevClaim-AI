import { Invoice } from "./types";

export const INITIAL_INVOICES: Invoice[] = [
  {
    id: "inv-1042",
    invoiceNumber: "INV-1042",
    debtorId: "deb-1",
    debtor: {
      id: "deb-1",
      companyName: "Acme Creative Studios",
      contactPerson: "Rahul Sharma",
      phone: "+91 98765 43210",
      email: "rahul@acmestudios.in",
      riskTier: "MEDIUM",
      createdAt: "2026-09-10T10:00:00Z"
    },
    amountDue: 45000,
    currency: "INR",
    dueDate: "2026-10-15",
    daysPastDue: 14,
    deliverableSummary: "Figma UI/UX Design System & Mobile App Wireframes",
    status: "OVERDUE",
    paymentLinkUrl: "https://checkout.dodopayments.com/buy/p_inv_1042",
    createdAt: "2026-09-15T10:00:00Z",
    updatedAt: "2026-10-29T06:00:00Z"
  },
  {
    id: "inv-1043",
    invoiceNumber: "INV-1043",
    debtorId: "deb-2",
    debtor: {
      id: "deb-2",
      companyName: "Apex Retail Solutions",
      contactPerson: "Vikram Patel",
      phone: "+91 91234 56789",
      email: "vikram@apexretail.com",
      riskTier: "CRITICAL",
      createdAt: "2026-08-01T10:00:00Z"
    },
    amountDue: 28500,
    currency: "INR",
    dueDate: "2026-10-05",
    daysPastDue: 24,
    deliverableSummary: "Custom Shopify Liquid Theme Development & Speed Optimization",
    status: "OVERDUE",
    paymentLinkUrl: "https://checkout.dodopayments.com/buy/p_inv_1043",
    createdAt: "2026-09-05T10:00:00Z",
    updatedAt: "2026-10-29T06:00:00Z"
  },
  {
    id: "inv-1044",
    invoiceNumber: "INV-1044",
    debtorId: "deb-3",
    debtor: {
      id: "deb-3",
      companyName: "Nexus Digital Media",
      contactPerson: "Priya Mehta",
      phone: "+91 99887 76655",
      email: "priya@nexusmedia.agency",
      riskTier: "LOW",
      createdAt: "2026-09-20T10:00:00Z"
    },
    amountDue: 65000,
    currency: "INR",
    dueDate: "2026-09-21",
    daysPastDue: 38,
    deliverableSummary: "Motion Graphics Brand Pack & 4x Video Reels Editing",
    status: "OVERDUE",
    paymentLinkUrl: "https://checkout.dodopayments.com/buy/p_inv_1044",
    createdAt: "2026-08-20T10:00:00Z",
    updatedAt: "2026-10-29T06:00:00Z"
  }
];

export const demoInvoices: Invoice[] = INITIAL_INVOICES;

export const initialCockpitStats: {
  totalOverdueAmount: number;
  recoveredAmount: number;
  recoveryRatePercent: number;
  activeChasingCount: number;
  settledInvoicesCount: number;
} = {
  totalOverdueAmount: 138500,
  recoveredAmount: 45000,
  recoveryRatePercent: 76,
  activeChasingCount: 3,
  settledInvoicesCount: 1,
};
