import { Invoice, InvoiceStatus, CallRecord, CockpitStats } from "./types";
import { INITIAL_INVOICES } from "./demo-data";

// In-memory persistent state (mirroring Supabase tables)
class DataStore {
  private invoices: Map<string, Invoice> = new Map();
  private calls: Map<string, CallRecord> = new Map();

  constructor() {
    INITIAL_INVOICES.forEach((inv) => this.invoices.set(inv.id, { ...inv }));
  }

  public getInvoices(): Invoice[] {
    return Array.from(this.invoices.values());
  }

  public getInvoice(id: string): Invoice | undefined {
    return this.invoices.get(id);
  }

  public addInvoice(invoice: Invoice): Invoice {
    this.invoices.set(invoice.id, invoice);
    return invoice;
  }

  public updateInvoiceStatus(
    id: string,
    status: InvoiceStatus,
    extra?: { ptpAmount?: number; ptpDate?: string }
  ): Invoice | undefined {
    const inv = this.invoices.get(id);
    if (!inv) return undefined;
    inv.status = status;
    inv.updatedAt = new Date().toISOString();
    if (extra?.ptpAmount !== undefined) inv.ptpAmount = extra.ptpAmount;
    if (extra?.ptpDate !== undefined) inv.ptpDate = extra.ptpDate;
    return inv;
  }

  public getCockpitStats(): CockpitStats {
    let totalOverdue = 0;
    let recovered = 0;
    let settledCount = 0;
    let activeChasing = 0;

    this.invoices.forEach((inv) => {
      if (inv.status === "RECOVERED") {
        recovered += inv.amountDue;
        settledCount++;
      } else {
        totalOverdue += inv.amountDue;
        if (inv.status === "CALLING" || inv.status === "PTP_AGREED") {
          activeChasing++;
        }
      }
    });

    const total = totalOverdue + recovered;
    const rate = total > 0 ? Math.round((recovered / total) * 100) : 0;

    return {
      totalOverdueAmount: totalOverdue,
      recoveredAmount: recovered,
      recoveryRatePercent: rate,
      activeChasingCount: activeChasing,
      settledInvoicesCount: settledCount,
    };
  }
}

export const db = new DataStore();

export const getInvoices = () => db.getInvoices();
export const getInvoiceById = (id: string) => db.getInvoice(id);
export const addInvoice = (invoice: Invoice) => db.addInvoice(invoice);
export const updateInvoiceStatus = (id: string, status: InvoiceStatus, extra?: { ptpAmount?: number; ptpDate?: string }) => db.updateInvoiceStatus(id, status, extra);
export const markInvoicePaid = (id: string) => db.updateInvoiceStatus(id, "RECOVERED");
export const getCockpitStats = () => db.getCockpitStats();
