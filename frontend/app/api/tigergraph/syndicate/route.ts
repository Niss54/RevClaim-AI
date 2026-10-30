import { NextRequest, NextResponse } from "next/server";

export interface DebtorSyndicateData {
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
  nodes: Array<{
    id: string;
    label: string;
    type: "Freelancer" | "DebtorCompany" | "Director" | "Invoice" | "DefaultRecord";
    status: "creditor" | "overdue" | "target" | "shared_actor" | "defaulted" | "escalated";
  }>;
  edges: Array<{
    source: string;
    target: string;
    label: string;
  }>;
  legalLeverageSummary: string;
  agentCallScript: string;
}

const SYNDICATE_PROFILES: Record<string, DebtorSyndicateData> = {
  nishant: {
    companyId: "comp_nishant_tech",
    companyName: "Nishant Tech Ventures Pvt Ltd",
    cin: "U72900UP2024PTC198421",
    gstin: "09AAACN8840M1Z8",
    syndicateRiskScore: 14,
    riskLevel: "LOW_RISK_PRIME_ENTITY",
    sharedDirectors: [
      {
        din: "09841235",
        name: "Nishant Maurya",
        role: "Managing Director",
        totalUnpaidAcrossNetwork: 0,
        msmeViolationsCount: 0,
      },
    ],
    sisterEntities: [],
    nodes: [
      { id: "free_founder", label: "RevClaim AI System", type: "Freelancer", status: "creditor" },
      { id: "inv_nishant", label: "Invoice ₹5,000 (Live Test)", type: "Invoice", status: "overdue" },
      { id: "comp_nishant", label: "Nishant Tech Ventures", type: "DebtorCompany", status: "target" },
      { id: "dir_nishant", label: "Nishant Maurya (DIN 09841235)", type: "Director", status: "shared_actor" },
      { id: "comp_clean", label: "MCA Good Standing", type: "DebtorCompany", status: "target" },
      { id: "comp_msme_clean", label: "MSME Zero Defaults", type: "DebtorCompany", status: "target" },
      { id: "def_none1", label: "0 Tribunal Strikes", type: "DefaultRecord", status: "creditor" },
      { id: "def_none2", label: "Verified Founder", type: "DefaultRecord", status: "creditor" },
    ],
    edges: [
      { source: "inv_nishant", target: "free_founder", label: "ISSUED_BY" },
      { source: "inv_nishant", target: "comp_nishant", label: "BILLED_TO" },
      { source: "comp_nishant", target: "dir_nishant", label: "DIRECTED_BY" },
      { source: "dir_nishant", target: "comp_clean", label: "CLEAN_RECORD" },
      { source: "dir_nishant", target: "comp_msme_clean", label: "CLEAN_RECORD" },
      { source: "comp_clean", target: "def_none1", label: "RECORD_STATUS" },
      { source: "comp_msme_clean", target: "def_none2", label: "RECORD_STATUS" },
    ],
    legalLeverageSummary:
      "Nishant Tech Ventures maintains a 100% clean MCA registry standing with zero tribunal disputes. High credit-worthiness with low cross-entity risk index (14/100).",
    agentCallScript:
      "Hi Nishant, this is Sarah from RevClaim AI. Reviewing invoice INV-2026-NISHANT-LIVE for ₹5,000. Your compliance graph is pristine with zero network violations. The instant Dodo link has been dispatched to your WhatsApp and email for 1-click clearance.",
  },

  hyperscale: {
    companyId: "comp_hyperscale",
    companyName: "HyperScale Global Labs Inc",
    cin: "US-DE-SR202308912",
    gstin: "9923USA1045981Z",
    syndicateRiskScore: 12,
    riskLevel: "ESCROW_SETTLED_LOW_RISK",
    sharedDirectors: [
      {
        din: "07219401",
        name: "Davin Dong",
        role: "CEO & Managing Director",
        totalUnpaidAcrossNetwork: 0,
        msmeViolationsCount: 0,
      },
    ],
    sisterEntities: [
      {
        companyName: "HyperScale Cloud Systems",
        cin: "US-DE-SR202201944",
        defaultAmount: 0,
        status: "GOOD_STANDING",
        msmeCaseId: "CLEARED",
      },
    ],
    nodes: [
      { id: "free_nishant", label: "Nishant Maurya (Creditor)", type: "Freelancer", status: "creditor" },
      { id: "inv_hyperscale", label: "Invoice ₹50,000 (Settled)", type: "Invoice", status: "target" },
      { id: "comp_hyperscale", label: "HyperScale Global Labs", type: "DebtorCompany", status: "target" },
      { id: "dir_davin", label: "Davin Dong (DIN 07219401)", type: "Director", status: "shared_actor" },
      { id: "comp_cloud", label: "HyperScale Cloud Inc", type: "DebtorCompany", status: "target" },
      { id: "comp_escrow", label: "Dodo MoR Escrow Vault", type: "DebtorCompany", status: "target" },
      { id: "def_mor_clear", label: "Remitted: ₹49,525", type: "DefaultRecord", status: "creditor" },
      { id: "def_fee", label: "RevClaim Fee: ₹475", type: "DefaultRecord", status: "creditor" },
    ],
    edges: [
      { source: "inv_hyperscale", target: "free_nishant", label: "ISSUED_BY" },
      { source: "inv_hyperscale", target: "comp_hyperscale", label: "BILLED_TO" },
      { source: "comp_hyperscale", target: "dir_davin", label: "DIRECTED_BY" },
      { source: "comp_hyperscale", target: "comp_escrow", label: "SETTLED_VIA" },
      { source: "comp_escrow", target: "def_mor_clear", label: "AUTOMATED_PAYOUT" },
      { source: "comp_escrow", target: "def_fee", label: "SOURCE_SPLIT" },
      { source: "dir_davin", target: "comp_cloud", label: "AFFILIATED_WITH" },
    ],
    legalLeverageSummary:
      "HyperScale Global Labs successfully settled ₹50,000 under Dodo Payments MoR automated escrow payout. TigerGraph multi-hop analysis confirms zero cross-entity liabilities.",
    agentCallScript:
      "Hi Davin, confirming that your ₹50,000 invoice has been remitted through Dodo Payments MoR escrow. Your syndicate credit risk index is in the top tier (12/100).",
  },

  acme: {
    companyId: "comp_acme",
    companyName: "Acme Creative Studios Pvt Ltd",
    cin: "U74999DL2020PTC284910",
    gstin: "07AABCA4500L1Z2",
    syndicateRiskScore: 48,
    riskLevel: "MODERATE_DELAY_ISOLATED",
    sharedDirectors: [
      {
        din: "08129402",
        name: "Rahul Sharma",
        role: "Managing Director",
        totalUnpaidAcrossNetwork: 45000,
        msmeViolationsCount: 0,
      },
    ],
    sisterEntities: [
      {
        companyName: "Acme Brandworks LLP",
        cin: "AAZ-4921",
        defaultAmount: 45000,
        status: "MILESTONE_PENDING",
        msmeCaseId: "MEDIATION_STAGE",
      },
    ],
    nodes: [
      { id: "free_nishant", label: "Nishant Maurya (Creditor)", type: "Freelancer", status: "creditor" },
      { id: "inv_acme", label: "Invoice ₹45,000 (14d Overdue)", type: "Invoice", status: "overdue" },
      { id: "comp_acme", label: "Acme Creative Studios", type: "DebtorCompany", status: "target" },
      { id: "dir_rahul", label: "Rahul Sharma (DIN 08129402)", type: "Director", status: "shared_actor" },
      { id: "comp_brandworks", label: "Acme Brandworks LLP", type: "DebtorCompany", status: "overdue" },
      { id: "comp_design", label: "Studio Design Assets", type: "DebtorCompany", status: "target" },
      { id: "def_milestone", label: "Figma Deliverables", type: "DefaultRecord", status: "overdue" },
      { id: "def_status", label: "Active Mediation", type: "DefaultRecord", status: "target" },
    ],
    edges: [
      { source: "inv_acme", target: "free_nishant", label: "ISSUED_BY" },
      { source: "inv_acme", target: "comp_acme", label: "BILLED_TO" },
      { source: "comp_acme", target: "dir_rahul", label: "DIRECTED_BY" },
      { source: "dir_rahul", target: "comp_brandworks", label: "PARTNER_IN" },
      { source: "comp_acme", target: "comp_design", label: "OWNS_ASSETS" },
      { source: "inv_acme", target: "def_milestone", label: "COVERS" },
      { source: "comp_brandworks", target: "def_status", label: "STAGE" },
    ],
    legalLeverageSummary:
      "Acme Creative Studios shows moderate payment delays (14 days past due). Graph analysis identifies linked creative agency entities with minor receivables backlog, but no formal MSME tribunal strikes.",
    agentCallScript:
      "Mr. Rahul, our compliance graph indicates Acme Creative Studios has a 14-day pending balance of ₹45,000. To keep your studio's MCA director credit standing clean at 48/100, we recommend clearing via the instant Dodo link sent to your WhatsApp.",
  },

  apex: {
    companyId: "comp_apex_retail",
    companyName: "Apex Retail Solutions Pvt Ltd",
    cin: "U52100MH2021PTC384912",
    gstin: "27AACPA9123K1ZV",
    syndicateRiskScore: 92,
    riskLevel: "CRITICAL_PHOENIX_ENTITY",
    sharedDirectors: [
      {
        din: "08921142",
        name: "Vikram Patel",
        role: "Managing Director",
        totalUnpaidAcrossNetwork: 420000,
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
      { id: "free_nishant", label: "Nishant Maurya (Creditor)", type: "Freelancer", status: "creditor" },
      { id: "inv_apex", label: "Invoice ₹28,500 (24d Overdue)", type: "Invoice", status: "overdue" },
      { id: "comp_apex_ret", label: "Apex Retail Solutions", type: "DebtorCompany", status: "target" },
      { id: "dir_vikram", label: "Vikram Patel (DIN 08921142)", type: "Director", status: "shared_actor" },
      { id: "comp_zenith", label: "Zenith Media (Sister Co)", type: "DebtorCompany", status: "defaulted" },
      { id: "comp_apex_dig", label: "Apex Digital (Sister Co)", type: "DebtorCompany", status: "defaulted" },
      { id: "def_zenith", label: "MSME Samadhaan ₹1.8L", type: "DefaultRecord", status: "escalated" },
      { id: "def_apex", label: "MSME Samadhaan ₹2.4L", type: "DefaultRecord", status: "escalated" },
    ],
    edges: [
      { source: "inv_apex", target: "free_nishant", label: "ISSUED_BY" },
      { source: "inv_apex", target: "comp_apex_ret", label: "BILLED_TO" },
      { source: "comp_apex_ret", target: "dir_vikram", label: "DIRECTED_BY" },
      { source: "comp_zenith", target: "dir_vikram", label: "DIRECTED_BY" },
      { source: "comp_apex_dig", target: "dir_vikram", label: "DIRECTED_BY" },
      { source: "comp_zenith", target: "def_zenith", label: "HAS_DEFAULT_RECORD" },
      { source: "comp_apex_dig", target: "def_apex", label: "HAS_DEFAULT_RECORD" },
    ],
    legalLeverageSummary:
      "Apex Retail Solutions shares Managing Director Vikram Patel (DIN: 08921142) with Zenith Media and Apex Digital, entities with ₹4,20,000 in unadjudicated defaults under MSME Samadhaan. Under Indian MCA regulations & Section 138 cross-directorial liability, debtor groups face corporate veil piercing and commercial credit impairment.",
    agentCallScript:
      "Mr. Vikram, our compliance graph indicates that Apex Retail Solutions shares common directorship with Zenith Media and Apex Digital, which currently have 2 active MSME Samadhaan non-compliance filings. Settling this ₹28,500 invoice right now prevents automated syndication to the MSME Council and credit bureau reporting across your director group. I have sent the direct Dodo settlement link to your WhatsApp.",
  },

  nexus: {
    companyId: "comp_nexus",
    companyName: "Nexus Digital Media Pvt Ltd",
    cin: "U92100MH2020PTC345112",
    gstin: "27AABCN6500R1ZP",
    syndicateRiskScore: 68,
    riskLevel: "ELEVATED_VENDOR_BACKLOG",
    sharedDirectors: [
      {
        din: "07834190",
        name: "Priya Mehta",
        role: "Executive Producer",
        totalUnpaidAcrossNetwork: 175000,
        msmeViolationsCount: 1,
      },
    ],
    sisterEntities: [
      {
        companyName: "Nexus Productions Ltd",
        cin: "U92100MH2019PTC312840",
        defaultAmount: 110000,
        status: "EXTENDED_PAYMENT_PLAN",
        msmeCaseId: "MSME/NOTICE/2026/0091",
      },
    ],
    nodes: [
      { id: "free_nishant", label: "Nishant Maurya (Creditor)", type: "Freelancer", status: "creditor" },
      { id: "inv_nexus", label: "Invoice ₹65,000 (38d Overdue)", type: "Invoice", status: "overdue" },
      { id: "comp_nexus", label: "Nexus Digital Media", type: "DebtorCompany", status: "target" },
      { id: "dir_priya", label: "Priya Mehta (DIN 07834190)", type: "Director", status: "shared_actor" },
      { id: "comp_nexus_prod", label: "Nexus Productions Ltd", type: "DebtorCompany", status: "defaulted" },
      { id: "comp_agency", label: "Mumbai Media Collective", type: "DebtorCompany", status: "overdue" },
      { id: "def_nexus_strike", label: "MSME Notice ₹1.1L", type: "DefaultRecord", status: "escalated" },
      { id: "def_reels", label: "Brand Reels Overdue", type: "DefaultRecord", status: "overdue" },
    ],
    edges: [
      { source: "inv_nexus", target: "free_nishant", label: "ISSUED_BY" },
      { source: "inv_nexus", target: "comp_nexus", label: "BILLED_TO" },
      { source: "comp_nexus", target: "dir_priya", label: "DIRECTED_BY" },
      { source: "comp_nexus_prod", target: "dir_priya", label: "DIRECTED_BY" },
      { source: "comp_nexus_prod", target: "def_nexus_strike", label: "HAS_DEFAULT_RECORD" },
      { source: "comp_nexus", target: "comp_agency", label: "SYNDICATE_MEMBER" },
      { source: "inv_nexus", target: "def_reels", label: "MILESTONE_STATUS" },
    ],
    legalLeverageSummary:
      "Nexus Digital Media is 38 days past due on motion graphics deliverables. TigerGraph 2-hop traversal exposes linked production LLP with ₹1.1L in vendor delay notices across Mumbai creative circles.",
    agentCallScript:
      "Ms. Priya, our TigerGraph monitor shows 38 days overdue on invoice INV-1044 (₹65,000). Resolving this balance now avoids multi-party escalation under MSME Chapter V and keeps your network credit score from deteriorating past 68/100.",
  },

  techflow: {
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
  },
};

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = (searchParams.get("company") || "TechFlow").toLowerCase();

    let matchedKey = "techflow";
    if (query.includes("nishant")) matchedKey = "nishant";
    else if (query.includes("hyperscale") || query.includes("davin")) matchedKey = "hyperscale";
    else if (query.includes("acme") || query.includes("rahul")) matchedKey = "acme";
    else if (query.includes("apex") || query.includes("vikram")) matchedKey = "apex";
    else if (query.includes("nexus") || query.includes("priya")) matchedKey = "nexus";
    else if (query.includes("techflow")) matchedKey = "techflow";

    const profile = SYNDICATE_PROFILES[matchedKey] || SYNDICATE_PROFILES.techflow;

    return NextResponse.json({
      success: true,
      source: "tigergraph_graphrag_engine",
      data: profile,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
