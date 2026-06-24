"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Check, CheckCircle2, Scale, BookOpen, Shield, Link2 } from "lucide-react";

const citations = [
  {
    case: "Guth v. Loft, Inc.",
    cite: "5 A.2d 503 (Del. 1939)",
    relevance: "Corporate Opportunity Doctrine",
    sources: ["Westlaw", "Court Record Hash: 0x9b3c4f"],
    icon: Scale,
  },
  {
    case: "Broz v. Cellular Info. Systems, Inc.",
    cite: "673 A.2d 148 (Del. 1996)",
    relevance: "Director Loyalty — Individual Capacity",
    sources: ["LexisNexis", "PACER: 2:94-cv-00123"],
    icon: BookOpen,
  },
  {
    case: "In re Walt Disney Co. Deriv. Litig.",
    cite: "906 A.2d 27 (Del. 2006)",
    relevance: "Business Judgment Rule — Gross Negligence",
    sources: ["Westlaw", "SEC EDGAR: 0001193125-06"],
    icon: Shield,
  },
  {
    case: "In re Caremark Int'l Inc.",
    cite: "698 A.2d 959 (Del. Ch. 1996)",
    relevance: "Board Oversight & Monitoring Duty",
    sources: ["Westlaw", "Court Record Hash: 0xd4a7e2"],
    icon: Link2,
  },
];

export default function Provenance() {
  const sectionRef = useRef<HTMLElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Left column — slides in from left
      gsap.fromTo(
        leftRef.current,
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%", once: true },
        }
      );

      // Cards — stagger in from right
      if (cardsRef.current) {
        gsap.fromTo(
          Array.from(cardsRef.current.children),
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.1,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: { trigger: cardsRef.current, start: "top 85%", once: true },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-32 px-6 lg:px-12 relative z-10 border-t border-[#e6d8c8]/50 overflow-hidden bg-transparent"
      id="provenance"
    >
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.05]"
        style={{ backgroundImage: 'url("/paper-texture.png")', backgroundSize: "cover" }}
      />

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-20 items-start">

          {/* LEFT */}
          <div ref={leftRef} className="lg:w-2/5 lg:sticky lg:top-28">
            <p className="text-[#8b5a33] text-[11px] font-mono font-bold tracking-[0.2em] uppercase mb-5">
              Citation Intelligence
            </p>

            <h2 className="text-4xl lg:text-5xl font-cormorant tracking-tight mb-6 text-[#2c1a12] font-semibold leading-tight">
              Verified Citation<br />
              <span className="italic text-[#8b5a33]">Provenance</span>
            </h2>

            <p className="text-[#2c1a12]/60 text-base leading-relaxed mb-10 max-w-sm">
              Every reference is traced to its primary source and cross-validated before it reaches your draft. No hallucinated citations. No broken links.
            </p>

            {/* Inline verified badge — understated, part of the copy */}
            <div className="flex items-center gap-2.5 text-sm text-[#2c1a12]/50">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Cross-referenced against Westlaw, LexisNexis, and PACER</span>
            </div>
          </div>

          {/* RIGHT */}
          <div className="lg:w-3/5 w-full">
            <div ref={cardsRef} className="flex flex-col divide-y divide-[#e6d8c8]/50">
              {citations.map((c, i) => {
                const Icon = c.icon;
                return (
                  <div
                    key={i}
                    className="group py-6 flex items-start gap-5 transition-colors duration-300 first:pt-0"
                  >
                    {/* Index */}
                    <span className="flex-shrink-0 w-6 text-right text-[11px] font-mono text-[#2c1a12]/25 pt-0.5 leading-none select-none">
                      {String(i + 1).padStart(2, "0")}
                    </span>

                    {/* Icon */}
                    <div className="flex-shrink-0 mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center bg-[#8b5a33]/[0.07] group-hover:bg-[#8b5a33]/[0.12] transition-colors duration-300">
                      <Icon className="w-3.5 h-3.5 text-[#8b5a33]" strokeWidth={1.5} />
                    </div>

                    {/* Body */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-1">
                        <div>
                          <p className="text-sm font-semibold text-[#2c1a12] leading-snug">{c.case}</p>
                          <p className="text-[11px] font-mono text-[#2c1a12]/35 mt-0.5">{c.cite}</p>
                        </div>
                        {/* Verified marker */}
                        <span className="flex-shrink-0 flex items-center gap-1 text-[11px] font-sans font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded mt-0.5">
                          <Check className="w-3 h-3 stroke-[2.5]" />
                          Verified
                        </span>
                      </div>

                      <p className="text-xs text-[#2c1a12]/45 mb-3">{c.relevance}</p>

                      {/* Sources */}
                      <div className="flex flex-wrap gap-1.5">
                        {c.sources.map((src, si) => (
                          <span
                            key={si}
                            className="text-[10px] font-mono text-[#2c1a12]/40 px-2 py-0.5 rounded bg-[#2c1a12]/[0.04] border border-[#2c1a12]/[0.06]"
                          >
                            {src}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
