"use client";

import { useState } from "react";
import Footer from "@/components/Footer";
import { ChevronDown } from "lucide-react";

const accordions = [
  {
    title: "Article 14 — Human Oversight Architecture",
    content:
      "Lex8 incorporates a dual-key human authorization loop. Any autonomous action that registers a structural safety exception requires secondary signature authorization before release. This log is cryptographically committed back to the local audit ledger.",
  },
  {
    title: "Article 15 — Accuracy, Robustness & Cybersecurity",
    content:
      "By running multiple model architectures (Gemini, Claude, DeepSeek) inside a sovereign tribunal, Lex8 guarantees outputs are mathematically verified. Discrepancies in syntax or logic automatically freeze execution, eliminating hallucinated references.",
  },
  {
    title: "Article 9 — Risk Management Framework",
    content:
      "Continuous logging checks analyze prompts and answers for work-product leakage, compliance deviation, and statutory validity. Local security loops allow immediate response execution if safety triggers occur.",
  },
  {
    title: "Article 12 — Traceability & Lineage Mapping",
    content:
      "All citation traces run through a secondary cryptographic checking node that records document lineage. If citation roots do not correspond exactly to source files or verified registries, the pipeline rejects output delivery.",
  },
];

export default function SecurityPage() {
  const [openAccordion, setOpenAccordion] = useState<number | null>(0);

  return (
    <main className="min-h-screen bg-[#fdf8f0] relative overflow-hidden">
      {/* Ambient warm glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(ellipse at top left, rgba(139,90,51,0.07) 0%, transparent 60%),
            radial-gradient(ellipse at bottom right, rgba(181,128,85,0.09) 0%, transparent 70%)`,
        }}
      />

      {/* Page Header */}
      <section className="relative z-10 pt-40 pb-20 px-6 lg:px-12 max-w-7xl mx-auto text-center">
        <div className="animate-in slide-in-from-bottom-4 fade-in duration-700 max-w-2xl mx-auto">
          <p className="text-[#8b5a33] text-[11px] font-mono font-bold tracking-[0.2em] uppercase mb-5">
            Zero Trust Governance
          </p>
          <h1 className="font-zaslia text-5xl lg:text-6xl text-[#2c1a12] leading-[1.1] mb-6 [word-spacing:0.25em]">
            Sovereign  Security  Framework
          </h1>
          <p className="text-[#2c1a12]/65 text-lg leading-relaxed font-light max-w-xl mx-auto">
            Every operation in Lex8 is designed around a fail-closed local loop. Your data is
            isolated, outputs are verified, and audit paths are cryptographically immutable.
          </p>
        </div>
      </section>

      {/* Divider */}
      <div className="border-t border-[#e6d8c8]/60 max-w-7xl mx-auto px-6 lg:px-12 mb-20" />

      {/* Body */}
      <section className="relative z-10 pb-24 px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">

          {/* Flowchart */}
          <div className="animate-in slide-in-from-bottom-6 fade-in duration-1000 delay-100">
            <div
              className="rounded-2xl border border-[#e6d8c8]/70 bg-white/55 p-8 flex flex-col gap-6"
              style={{ backdropFilter: "blur(16px)" }}
            >
              <div className="text-center">
                <p className="text-[#8b5a33] text-[10px] font-mono font-bold tracking-[0.2em] uppercase mb-1">
                  Pipeline Architecture
                </p>
                <h3 className="font-zaslia text-2xl text-[#2c1a12] [word-spacing:0.2em]">
                  Local  Fail-Closed  Pipeline
                </h3>
              </div>

              <div className="flex justify-center">
                <svg
                  className="w-full max-w-[340px] h-auto"
                  viewBox="0 0 400 480"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <marker id="arr" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                      <polygon points="0 0, 8 3, 0 6" fill="#8b5a33" />
                    </marker>
                    <marker id="arr-red" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                      <polygon points="0 0, 8 3, 0 6" fill="#c0392b" />
                    </marker>
                  </defs>

                  <rect x="110" y="20" width="180" height="44" rx="8" fill="rgba(44,26,18,0.92)" />
                  <text x="200" y="47" fill="#fdf8f0" fontSize="10" fontFamily="monospace" textAnchor="middle" fontWeight="600">CLIENT GATEWAY (VPC)</text>

                  <rect x="110" y="112" width="180" height="44" rx="8" fill="rgba(253,248,240,0.95)" stroke="#c4a482" strokeWidth="1.5" />
                  <text x="200" y="138" fill="#2c1a12" fontSize="11" textAnchor="middle" fontWeight="500">01. Privilege Isolation</text>

                  <rect x="110" y="204" width="180" height="44" rx="8" fill="rgba(253,248,240,0.95)" stroke="#c4a482" strokeWidth="1.5" />
                  <text x="200" y="230" fill="#2c1a12" fontSize="11" textAnchor="middle" fontWeight="500">02. LLM Processing</text>

                  <rect x="110" y="296" width="180" height="44" rx="8" fill="rgba(253,248,240,0.95)" stroke="#c4a482" strokeWidth="1.5" />
                  <text x="200" y="322" fill="#2c1a12" fontSize="11" textAnchor="middle" fontWeight="500">03. Consensus Tribunal</text>

                  <rect x="110" y="388" width="180" height="44" rx="8" fill="rgba(139,90,51,0.88)" />
                  <text x="200" y="414" fill="#fdf8f0" fontSize="10" fontFamily="monospace" textAnchor="middle" fontWeight="600">OUTPUT GATEWAY (SECURE)</text>

                  <path d="M200 64 L200 104" stroke="#8b5a33" strokeWidth="2" markerEnd="url(#arr)" />
                  <path d="M200 156 L200 196" stroke="#8b5a33" strokeWidth="2" markerEnd="url(#arr)" />
                  <path d="M200 248 L200 288" stroke="#8b5a33" strokeWidth="2" markerEnd="url(#arr)" />
                  <path d="M200 340 L200 380" stroke="#8b5a33" strokeWidth="2" markerEnd="url(#arr)" />

                  <path d="M290 316 Q372 316 372 200 T290 36" stroke="#c0392b" strokeWidth="1.5" strokeDasharray="5,4" fill="none" markerEnd="url(#arr-red)" />
                  <text x="378" y="175" fill="#c0392b" fontSize="8.5" fontFamily="monospace" fontWeight="700" transform="rotate(90 378 175)">FAIL-CLOSED INTERCEPT</text>
                </svg>
              </div>
            </div>
          </div>

          {/* Accordion */}
          <div className="flex flex-col gap-5 animate-in slide-in-from-bottom-6 fade-in duration-1000 delay-250">
            <div>
              <p className="text-[#8b5a33] text-[10px] font-mono font-bold tracking-[0.2em] uppercase mb-2">
                Compliance Matrix
              </p>
              <h3 className="font-zaslia text-3xl text-[#2c1a12] mb-3 [word-spacing:0.2em]">
                EU  AI  Act  Framework
              </h3>
              <p className="text-[#2c1a12]/60 text-[15px] leading-[1.8] font-light">
                Lex8 maps every core engineering layer to the strict compliance controls set by
                the EU AI Act for high-risk AI systems deployed in legal contexts.
              </p>
            </div>

            <div className="flex flex-col gap-3 mt-3">
              {accordions.map((item, idx) => {
                const isOpen = openAccordion === idx;
                return (
                  <div
                    key={idx}
                    className={`rounded-xl border overflow-hidden transition-all duration-300
                      ${isOpen
                        ? "border-[#c4a482]/45 bg-white/60 shadow-[0_6px_20px_rgba(139,90,51,0.07)]"
                        : "border-[#e6d8c8]/70 bg-white/38 hover:border-[#c4a482]/35"
                      }`}
                    style={{ backdropFilter: "blur(10px)" }}
                  >
                    <button
                      onClick={() => setOpenAccordion(isOpen ? null : idx)}
                      className="w-full flex items-center justify-between px-5 py-4 text-left focus:outline-none"
                    >
                      <span className="font-cormorant text-[18px] text-[#2c1a12] leading-snug font-semibold pr-4">
                        {item.title}
                      </span>
                      <ChevronDown
                        className={`text-[#8b5a33] shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                        size={18}
                      />
                    </button>

                    <div
                      className={`overflow-hidden transition-all duration-350 ease-in-out ${
                        isOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
                      }`}
                    >
                      <p className="px-5 pb-5 text-[#2c1a12]/65 text-[14px] leading-[1.8] font-light border-t border-[#e6d8c8]/50 pt-4">
                        {item.content}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </section>

      <Footer />
    </main>
  );
}
