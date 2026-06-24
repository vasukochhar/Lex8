"use client";

import { useState } from "react";
import Footer from "@/components/Footer";
import { Check } from "lucide-react";

export default function ProductPage() {
  const [activeTab, setActiveTab] = useState(0);

  const modules = [
    {
      id: "case-synthesis",
      label: "Case Synthesis",
      title: "Case  Synthesis  Module",
      badge: "LANE 2 COMPLIANT",
      description:
        "Automates the ingestion, parsing, and semantic timeline alignment of multi-docket records. Integrates case history, pleading chronologies, and evidentiary sub-files into an auditable knowledge structure.",
      features: [
        "Deduplicates dockets across state and federal record databases.",
        "Generates cryptographic chronological indexes linked to source PDF pages.",
        "Integrates direct links to local file repos for rapid cross-referencing.",
      ],
      terminalHeader: "[RUNNING] case_synthesis_node_v1.0.8",
      terminalLogs: [
        "INGESTING DOCKET FILE: Dkt-2026-CA-00129...",
        "FOUND: 42 Pleading Entries, 11 Ex. Filings.",
        "SORTING TIMELINE CHRONOLOGY...",
        "  • 2026-01-12: Pleading #01 Filed [Verified DGCL § 144]",
        "  • 2026-02-09: Motion for SJ Submitted [Match Exhibit C]",
        "  • 2026-03-01: Opposition Brief Entered [Verified Guth standard]",
      ],
      terminalStatus: "STATUS: TIMELINE COMPLETED WITH 100% PROVENANCE TRACE",
      statusOk: true,
    },
    {
      id: "contextual-drafter",
      label: "Contextual Drafter",
      title: "Contextual  Drafter",
      badge: "LANE 3 COMPLIANT",
      description:
        "Compiles legally defensive briefings and pleadings using strict schema boundaries. Ensures drafts leverage direct case references instead of generalized model weights.",
      features: [
        "Aligns drafting style parameters to specific local court guidelines.",
        "Injects inline source verification tags for downstream validation.",
        "Adapts model output variables to law firm style frameworks.",
      ],
      terminalHeader: "[RUNNING] contextual_drafter_node_v1.0.8",
      terminalLogs: [
        "PARSING INPUT PROMPT: 'Draft Response to Pleading § 14...'",
        "ENFORCING ATTRIBUTE SCHEMA: DELAWARE_CHANCERY_V2",
        "GENERATING BODY...",
        "  > 'Respondent denies allegations in Paragraph 12 of Complaint, citing Guth v. Loft...'",
      ],
      terminalStatus: "CONSENSUS PASS: Model validation output verified.",
      statusOk: true,
    },
    {
      id: "provenance-validator",
      label: "Provenance Validator",
      title: "Provenance  Validator",
      badge: "LANE 2 COMPLIANT",
      description:
        "Traces all references in an AI draft back to specific client documents, statutory law, or local code. Blocks any citation that cannot be verified by cryptographic record tracking.",
      features: [
        "Maps statement claims to source document hashes (SHA-256).",
        "Compares citation parameters against state registry APIs.",
        "Identifies and prevents citation mismatches or factual slips.",
      ],
      terminalHeader: "[RUNNING] provenance_validator_node_v1.0.8",
      terminalLogs: [
        "SCANNING OUTPUT CONTENT FOR STATEMENTS...",
        "STATEMENT 01: 'Delaware law requires corporate officers to...'",
        "FINDING LINEAGE PATHWAY:",
        "  ✓ Match found: 8 Del. C. § 144 [Confidence: 100%]",
        "  ✓ Hash match: e3b0c44298fc1c149afbf4c8996fb924...",
      ],
      terminalStatus: "STATUS: LINEAGE VERIFIED SECURELY",
      statusOk: true,
    },
    {
      id: "redteam-counsel",
      label: "Red-Team Counsel",
      title: "Red-Team  Counsel",
      badge: "LANE 3 COMPLIANT",
      description:
        "An adversarial module that evaluates litigation strategies and pleading structures against opposing legal counter-arguments and procedural objections.",
      features: [
        "Simulates defense arguments based on regional court precedents.",
        "Flags vulnerability points in statutory interpretation logic.",
        "Identifies potential procedural objections beforehand.",
      ],
      terminalHeader: "[RUNNING] redteam_counsel_node_v1.0.8",
      terminalLogs: [
        "EVALUATING LITIGATION STRATEGY: COMPLAINT_PART_3",
        "GENERATING DEFENSE ATTACKS...",
        "  ! Vulnerability: Pleading susceptible to Motion to Dismiss under Rule 12(b)(6).",
        "  ! Recommendation: Expand factual linkage in Section 4.2.",
      ],
      terminalStatus: "SIMULATION COMPLETE: 2 RISKS LOGGED AND FLAGGED",
      statusOk: false,
    },
    {
      id: "predictive-forecast",
      label: "Predictive Forecast",
      title: "Predictive  Forecast",
      badge: "LANE 2 COMPLIANT",
      description:
        "Analyzes historical case patterns, rulings, and judge-specific behaviors to generate risk models and probability ranges for litigation tracks.",
      features: [
        "Parses over 10 million state and federal judicial filings.",
        "Models timeline estimates for motion resolutions.",
        "Generates visual success matrices for procedural steps.",
      ],
      terminalHeader: "[RUNNING] predictive_forecast_node_v1.0.8",
      terminalLogs: [
        "JUDICIAL ID: DE_CHANCERY_JUDGE_08",
        "TARGET ACTION: MOTION FOR INJUNCTION",
        "CALCULATING PROBABILITY GRID...",
        "  - Grant Probability: 68.4% (Based on 14 similar cases)",
        "  - Time-to-resolution median: 42 days",
      ],
      terminalStatus: "COMPUTATION COMPLETE: PROBABILITY SET EXPORTED",
      statusOk: true,
    },
    {
      id: "privilege-intercept",
      label: "Privilege Intercept",
      title: "Privilege  Intercept",
      badge: "LANE 1 COMPLIANT",
      description:
        "An in-line data guardrail that strips client identifiers, PII, and trade secrets before questions pass to the LLM processor pool.",
      features: [
        "Sub-millisecond token scanning and de-identification.",
        "Locally isolated regex and neural entity scrubbers.",
        "Flags work-product privilege indicators automatically.",
      ],
      terminalHeader: "[RUNNING] privilege_intercept_node_v1.0.8",
      terminalLogs: [
        "SCANNING USER QUERY INPUT...",
        "FOUND ENTITY: 'Acme Corp (ID: 082)' -> SCRUBBING",
        "FOUND REFERENCE: 'Memo by J. Smith' -> STRIPPING",
        "Output query: 'Identify Delaware Chancery precedents...'",
      ],
      terminalStatus: "GATEWAY STATUS: SAFE FOR ROUTING",
      statusOk: true,
    },
    {
      id: "efiler",
      label: "E-Filer",
      title: "E-Filer  Integration",
      badge: "LANE 4 COMPLIANT",
      description:
        "Formats, numbers, and validates court filings to ensure strict compliance with federal and regional court filing systems.",
      features: [
        "Constructs compliant tables of authorities with verified hyperlinks.",
        "Validates page formats, layouts, margins, and signature blocks.",
        "Direct interfaces to federal court filing (CM/ECF) portals.",
      ],
      terminalHeader: "[RUNNING] efiler_integration_node_v1.0.8",
      terminalLogs: [
        "VERIFYING FILE: Brief_Final_Submission.pdf",
        "CHECKING PAGE MARGINS: 1.00in -> OK",
        "BUILDING TABLE OF AUTHORITIES...",
        "  - Guth v. Loft, Inc., 5 A.2d 503... Page 4, 7, 12",
        "  - Broz v. Cellular Info. Systems... Page 9, 11",
      ],
      terminalStatus: "SYSTEM STATUS: SUBMISSION VERIFIED COMPLIANT",
      statusOk: true,
    },
    {
      id: "forensic-audit",
      label: "Forensic Audit",
      title: "Forensic  Audit",
      badge: "LANE 2 COMPLIANT",
      description:
        "Performs systematic checks over past partner work archives. Scans for anomalies, logic drifts, and contradictory positions taken in related cases.",
      features: [
        "Identifies logic drift across past briefs and litigation materials.",
        "Compares arguments against past statutory positions taken.",
        "Generates reports identifying logic gaps or exposure risks.",
      ],
      terminalHeader: "[RUNNING] forensic_audit_node_v1.0.8",
      terminalLogs: [
        "SCANNING REPOSITORY: LITIGATION_ARCHIVE_2025",
        "COMPARING CASE_08 BRIEF WITH CASE_14 POSITION...",
        "  ! Logic warning: Contradictory § 144 interpretations across briefs.",
        "  ! Potential expose: Contradictory positions found.",
      ],
      terminalStatus: "AUDIT COMPLETE: EXPOSURES MAPPED",
      statusOk: false,
    },
  ];

  const m = modules[activeTab];

  return (
    <main className="min-h-screen bg-[#fdf8f0] relative overflow-hidden">
      {/* Ambient background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(ellipse at top right, rgba(139,90,51,0.07) 0%, transparent 60%),
            radial-gradient(ellipse at bottom left, rgba(181,128,85,0.09) 0%, transparent 70%)`,
        }}
      />

      {/* Page Header */}
      <section className="relative z-10 pt-40 pb-16 px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="max-w-3xl animate-in slide-in-from-bottom-4 fade-in duration-700">
          <p className="text-[#8b5a33] text-[11px] font-mono font-bold tracking-[0.2em] uppercase mb-5">
            Modular Intelligence
          </p>
          <h1 className="font-zaslia text-5xl lg:text-6xl text-[#2c1a12] leading-[1.1] mb-6 [word-spacing:0.25em]">
            The  8  Legal  AI  Modules
          </h1>
          <p className="text-[#2c1a12]/65 text-lg leading-relaxed font-light max-w-2xl">
            Lex8 modules run as decentralized service nodes governed by local pipeline schemas,
            ensuring zero data pollution and complete auditability.
          </p>
        </div>
      </section>

      {/* Divider */}
      <div className="border-t border-[#e6d8c8]/60 max-w-7xl mx-auto px-6 lg:px-12 mb-12" />

      {/* Tabs + Panel */}
      <section className="relative z-10 pb-24 px-6 lg:px-12 max-w-7xl mx-auto animate-in slide-in-from-bottom-6 fade-in duration-1000 delay-150">

        {/* Tab Pills */}
        <div className="flex flex-nowrap overflow-x-auto gap-2 mb-8 pb-1 scrollbar-hide">
          {modules.map((mod, idx) => (
            <button
              key={mod.id}
              onClick={() => setActiveTab(idx)}
              className={`whitespace-nowrap flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-all duration-250
                ${activeTab === idx
                  ? "bg-[#2c1a12] text-[#fdf8f0] shadow-md"
                  : "bg-[#2c1a12]/5 text-[#2c1a12]/55 hover:bg-[#2c1a12]/10 hover:text-[#2c1a12]/80"
                }`}
            >
              <span className="font-mono text-[10px] opacity-60">0{idx + 1}</span>
              <span className="font-medium">{mod.label}</span>
            </button>
          ))}
        </div>

        {/* Panel — two-column native div */}
        <div
          className="rounded-2xl border border-[#e6d8c8]/70 overflow-hidden shadow-[0_8px_40px_rgba(139,90,51,0.07)]"
          style={{ backdropFilter: "blur(16px)", background: "rgba(253,248,240,0.5)" }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2">

            {/* Info side */}
            <div className="p-8 lg:p-12 flex flex-col gap-6 border-b lg:border-b-0 lg:border-r border-[#e6d8c8]/50">
              {/* Lane badge */}
              <div className="inline-flex items-center gap-2 w-fit px-3 py-1 bg-[#8b5a33]/8 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8b5a33]" />
                <span className="text-[10px] font-mono font-bold tracking-[0.18em] uppercase text-[#8b5a33]">
                  {m.badge}
                </span>
              </div>

              <div>
                <h2 className="font-zaslia text-3xl lg:text-4xl text-[#2c1a12] leading-snug mb-4 [word-spacing:0.2em]">
                  {m.title}
                </h2>
                <p className="text-[#2c1a12]/65 leading-[1.8] text-[15px] font-light">
                  {m.description}
                </p>
              </div>

              <ul className="flex flex-col gap-3">
                {m.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="text-[#8b5a33] shrink-0 mt-0.5" strokeWidth={2.5} size={15} />
                    <span className="text-[#2c1a12]/70 text-[13.5px] leading-snug font-light">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Terminal side */}
            <div className="bg-[#18120e] p-8 lg:p-12 flex flex-col min-h-[320px]">
              {/* macOS dots */}
              <div className="flex gap-2 mb-6">
                <div className="w-3 h-3 rounded-full bg-red-500/70" />
                <div className="w-3 h-3 rounded-full bg-yellow-400/70" />
                <div className="w-3 h-3 rounded-full bg-green-500/70" />
              </div>

              <div className="font-mono text-[12.5px] leading-relaxed flex-1 flex flex-col">
                {/* Header */}
                <div className="text-emerald-400/90 border-b border-white/8 pb-3 mb-5">
                  {m.terminalHeader}
                </div>

                {/* Logs */}
                <div className="flex flex-col gap-1.5 text-[#fdf8f0]/55 flex-1 mb-6">
                  {m.terminalLogs.map((log, i) => (
                    <span
                      key={i}
                      className={
                        log.startsWith("  !") ? "text-amber-400/90" :
                        log.startsWith("  ✓") ? "text-emerald-400/80" :
                        "text-[#fdf8f0]/55"
                      }
                    >
                      {log}
                    </span>
                  ))}
                </div>

                {/* Status */}
                <div
                  className={`border-t border-white/8 pt-4 font-semibold tracking-wide text-[12.5px] ${
                    m.statusOk ? "text-emerald-400" : "text-amber-400"
                  }`}
                >
                  {m.terminalStatus}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
