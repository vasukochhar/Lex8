import Footer from "@/components/Footer";
import { Scale, Briefcase, FileCheck, Search, Globe2, ShieldAlert } from "lucide-react";

const solutions = [
  {
    category: "Litigation",
    Icon: Scale,
    title: "Litigation  &  Trial  Counsel",
    subtitle: "Verified Case Synthesis & Forecasts",
    description:
      "Automate timeline collation from chaotic multi-docket filings, stress-test briefing theories, and forecast judge responses with certified structural citations.",
    nodes: "Node 01, 04, 05",
  },
  {
    category: "Transactions",
    Icon: Briefcase,
    title: "Corporate  M&A",
    subtitle: "Contextual Clause Verification",
    description:
      "Execute due diligence across document repositories, map disclosures to representation schedules, and draft defensive transaction covenants.",
    nodes: "Node 02, 03, 08",
  },
  {
    category: "Governance",
    Icon: FileCheck,
    title: "Regulatory  Compliance",
    subtitle: "EU AI Act & Statutory Alignment",
    description:
      "Audit corporate operations against changing rules and frameworks automatically. Ingest, parse, and verify multi-regional regulatory alignments.",
    nodes: "Node 03, 06, 08",
  },
  {
    category: "Auditing",
    Icon: Search,
    title: "Internal  Investigations",
    subtitle: "Forensic Archive & Logic Auditing",
    description:
      "Scan historical employee communications and transaction records securely under local attorney-client privilege isolation boundaries.",
    nodes: "Node 06, 08",
  },
  {
    category: "Disputes",
    Icon: Globe2,
    title: "International  Arbitration",
    subtitle: "Cross-Border Treaty Mapping",
    description:
      "Cross-reference international treaty frameworks and foreign arbitration awards with semantic translation and cryptographic citation verification.",
    nodes: "Node 01, 02, 03",
  },
  {
    category: "Risk Assurance",
    Icon: ShieldAlert,
    title: "Insurance  Defense",
    subtitle: "Liability & Exposure Risk Profiling",
    description:
      "Automate claim record audits, verify policy applicability exclusions, and generate liability probability indices based on litigation records.",
    nodes: "Node 04, 05, 07",
  },
];

export default function SolutionsPage() {
  return (
    <main className="min-h-screen bg-[#fdf8f0] relative overflow-hidden">
      {/* Ambient warm glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(ellipse at top right, rgba(139,90,51,0.07) 0%, transparent 60%),
            radial-gradient(ellipse at bottom left, rgba(181,128,85,0.09) 0%, transparent 70%)`,
        }}
      />

      {/* Page Header */}
      <section className="relative z-10 pt-40 pb-20 px-6 lg:px-12 max-w-7xl mx-auto text-center">
        <div className="animate-in slide-in-from-bottom-4 fade-in duration-700 max-w-2xl mx-auto">
          <p className="text-[#8b5a33] text-[11px] font-mono font-bold tracking-[0.2em] uppercase mb-5">
            Enterprise Impact
          </p>
          <h1 className="font-zaslia text-5xl lg:text-6xl text-[#2c1a12] leading-[1.1] mb-6 [word-spacing:0.25em]">
            Solutions  Across  the  Legal  Enterprise
          </h1>
          <p className="text-[#2c1a12]/65 text-lg leading-relaxed font-light max-w-xl mx-auto">
            Lex8 structures defensive intelligence networks adapted specifically to corporate litigation teams, transaction counsel, and compliance departments.
          </p>
        </div>
      </section>

      {/* Divider */}
      <div className="border-t border-[#e6d8c8]/60 max-w-7xl mx-auto px-6 lg:px-12 mb-20" />

      {/* Solutions Grid */}
      <section className="relative z-10 pb-24 px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {solutions.map((sol, idx) => {
            const Icon = sol.Icon;
            return (
              <div
                key={idx}
                className="group rounded-2xl border border-[#e6d8c8]/70 bg-white/55 backdrop-blur-sm
                           p-7 flex flex-col gap-5
                           transition-all duration-300
                           hover:-translate-y-1 hover:border-[#c4a482]/50 hover:shadow-[0_8px_32px_rgba(139,90,51,0.08)]"
                style={{ animationDelay: `${idx * 80}ms` }}
              >
                {/* Top row: category label + icon */}
                <div className="flex items-center justify-between">
                  <p className="font-mono text-[10px] font-bold text-[#2c1a12]/40 tracking-[0.2em] uppercase">
                    {sol.category}
                  </p>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-[#8b5a33]/8 group-hover:bg-[#8b5a33]/15 transition-colors duration-300 shrink-0">
                    <Icon className="w-4.5 h-4.5 text-[#8b5a33]" strokeWidth={1.5} size={18} />
                  </div>
                </div>

                {/* Title */}
                <div>
                  <h3 className="font-zaslia text-xl text-[#2c1a12] leading-snug mb-1.5 [word-spacing:0.2em]">
                    {sol.title}
                  </h3>
                  {/* Subtitle */}
                  <p className="font-cormorant text-base italic text-[#8b5a33] leading-snug">
                    {sol.subtitle}
                  </p>
                </div>

                {/* Description */}
                <p className="text-[#2c1a12]/60 text-[13.5px] leading-[1.75] font-light flex-1">
                  {sol.description}
                </p>

                {/* Node badge */}
                <div className="border-t border-[#e6d8c8]/60 pt-4">
                  <span className="inline-flex items-center gap-2 px-3 py-1 border border-[#8b5a33]/18 rounded-full bg-[#8b5a33]/4">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#8b5a33]/50 shrink-0" />
                    <span className="font-mono text-[10px] font-semibold text-[#8b5a33] uppercase tracking-[0.15em]">
                      {sol.nodes}
                    </span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <Footer />
    </main>
  );
}
