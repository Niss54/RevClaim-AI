export interface GraphNode {
  id: string;
  label: string;
  type: "Freelancer" | "DebtorCompany" | "Director" | "Invoice" | "DefaultRecord";
  status: "creditor" | "overdue" | "target" | "shared_actor" | "defaulted" | "escalated";
}

export interface GraphEdge {
  source: string;
  target: string;
  label: string;
}

export interface DebtorSyndicateResult {
  companyId: string;
  companyName: string;
  cin?: string;
  gstin?: string;
  syndicateRiskScore: number;
  riskLevel: string;
  sharedDirectors: Array<{
    din: string;
    name: string;
    role: string;
    totalUnpaidAcrossNetwork: number;
    msmeViolationsCount: number;
  }>;
  sisterEntities: Array<{
    companyName: string;
    cin: string;
    defaultAmount: number;
    status: string;
    msmeCaseId: string;
  }>;
  nodes: GraphNode[];
  edges: GraphEdge[];
  legalLeverageSummary: string;
  agentCallScript: string;
}

export async function fetchDebtorSyndicate(companyName: string): Promise<DebtorSyndicateResult | null> {
  try {
    const res = await fetch(`/api/tigergraph/syndicate?company=${encodeURIComponent(companyName)}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.data || null;
  } catch (err) {
    console.error("Failed to query TigerGraph syndicate:", err);
    return null;
  }
}
