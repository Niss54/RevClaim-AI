import { NextRequest, NextResponse } from "next/server";

const DEMO_SYNDICATE_GRAPH = {
  companyId: "comp_techflow",
  companyName: "TechFlow Solutions Pvt Ltd",
  cin: "U72200DL2022PTC394821",
  gstin: "07AAACT9812M1Z5",
  syndicateRiskScore: 87,
  riskLevel: "CRITICAL_PHOENIX_ENTITY",
  sharedDirectors: [
    {
      din: "08921142",
      name: "Rajesh Verma",
      role: "Managing Director",
      totalUnpaidAcrossNetwork: 465000,
      msmeViolationsCount: 2,
    },
  ],
  sisterEntities: [
    {
      companyName: "Zenith Media Interactive Pvt Ltd",
      cin: "U74999MH2021PTC361209",
      defaultAmount: 180000,
      status: "DORMANT_DEFAULTER",
      msmeCaseId: "MSME/SAM/2025/09812",
    },
    {
      companyName: "Apex Digital Ventures LLP",
      cin: "AAX-9821",
      defaultAmount: 240000,
      status: "ACTIVE_NON_COMPLIANT",
      msmeCaseId: "MSME/SAM/2026/01482",
    },
  ],
  nodes: [
    { id: "free_nishant", label: "Nishant Maurya (Freelancer)", type: "Freelancer", status: "creditor" },
    { id: "inv_techflow", label: "Invoice ₹45,000 (34d Overdue)", type: "Invoice", status: "overdue" },
    { id: "comp_techflow", label: "TechFlow Solutions", type: "DebtorCompany", status: "target" },
    { id: "dir_rajesh", label: "Rajesh Verma (DIN 08921142)", type: "Director", status: "shared_actor" },
    { id: "comp_zenith", label: "Zenith Media (Sister Co)", type: "DebtorCompany", status: "defaulted" },
    { id: "comp_apex", label: "Apex Digital (Sister Co)", type: "DebtorCompany", status: "defaulted" },
    { id: "def_zenith", label: "MSME Samadhaan ₹1.8L", type: "DefaultRecord", status: "escalated" },
    { id: "def_apex", label: "MSME Samadhaan ₹2.4L", type: "DefaultRecord", status: "escalated" },
  ],
  edges: [
    { source: "inv_techflow", target: "free_nishant", label: "ISSUED_BY" },
    { source: "inv_techflow", target: "comp_techflow", label: "BILLED_TO" },
    { source: "comp_techflow", target: "dir_rajesh", label: "DIRECTED_BY" },
    { source: "comp_zenith", target: "dir_rajesh", label: "DIRECTED_BY" },
    { source: "comp_apex", target: "dir_rajesh", label: "DIRECTED_BY" },
    { source: "comp_zenith", target: "def_zenith", label: "HAS_DEFAULT_RECORD" },
    { source: "comp_apex", target: "def_apex", label: "HAS_DEFAULT_RECORD" },
  ],
  legalLeverageSummary:
    "TechFlow Solutions shares Managing Director Rajesh Verma (DIN: 08921142) with Zenith Media and Apex Digital, entities with ₹4,20,000 in unadjudicated defaults under MSME Samadhaan. Under Indian MCA regulations & Section 138 cross-directorial liability, debtor groups face corporate veil piercing and commercial credit impairment.",
  agentCallScript:
    "Mr. Rahul, our compliance graph indicates that TechFlow Solutions shares common directorship with Zenith Media and Apex Digital, which currently have 2 active MSME Samadhaan non-compliance filings. Settling this ₹45,000 invoice right now prevents automated syndication to the MSME Council and credit bureau reporting across your director group. I have sent the direct Dodo settlement link to your WhatsApp.",
};

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const company = searchParams.get("company") || "TechFlow";

    return NextResponse.json({
      success: true,
      source: "tigergraph_graphrag_engine",
      data: {
        ...DEMO_SYNDICATE_GRAPH,
        companyName: company.includes("TechFlow") ? "TechFlow Solutions Pvt Ltd" : company,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
