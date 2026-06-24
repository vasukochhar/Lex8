"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const CheckIcon = () => (
  <Image src="/check.png" alt="Check" width={20} height={20} className="w-5 h-5 shrink-0 animated-icon" />
);

const CrossIcon = () => (
  <Image src="/cross-v2.png" alt="Cross" width={20} height={20} className="w-5 h-5 shrink-0 animated-icon opacity-80" />
);

export default function Comparison() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (!sectionRef.current || !containerRef.current) return;

    // Entrance Animation
    const titleElements = sectionRef.current.querySelectorAll('.animate-title');
    const tableContainer = sectionRef.current.querySelector('.animate-table');
    const rows = sectionRef.current.querySelectorAll('.animate-row');

    const entranceTl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 80%",
        once: true
      }
    });

    entranceTl.fromTo(titleElements, 
      { opacity: 0, y: 30 }, 
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: "power3.out" }
    );

    entranceTl.fromTo(tableContainer, 
      { opacity: 0, y: 40 }, 
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, 
      "-=0.4"
    );

    entranceTl.fromTo(rows, 
      { opacity: 0, y: 20 }, 
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power2.out" }, 
      "-=0.4"
    );

    // Looped Icon Animations
    const animatedIcons = sectionRef.current.querySelectorAll('.animated-icon');
    
    gsap.fromTo(animatedIcons, 
      {
        clipPath: "inset(0% 100% 0% 0%)",
        opacity: 0,
      },
      {
        clipPath: "inset(0% 0% 0% 0%)",
        opacity: 1,
        duration: 1.2,
        ease: "power2.out",
        stagger: 0.1,
        repeat: -1,
        repeatDelay: 0.5,
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  const features = [
    {
      name: "Multi-Model Consensus Tribunal",
      lex8: { text: "Yes (Fail-Closed)", icon: <CheckIcon /> },
      harvey: { text: "No (Single Model)", icon: <CrossIcon /> },
      legora: { text: "No (Single Model)", icon: <CrossIcon /> }
    },
    {
      name: "Cryptographic Document Provenance",
      lex8: { text: "Yes (Hash Verified)", icon: <CheckIcon /> },
      harvey: { text: "No (RAG Search)", icon: <CrossIcon /> },
      legora: { text: "No (RAG Search)", icon: <CrossIcon /> }
    },
    {
      name: "PII Filtering Latency",
      lex8: { text: "<1.2ms (Local Isolation)", icon: <CheckIcon /> },
      harvey: { text: ">120ms (API Level)", icon: <CrossIcon /> },
      legora: { text: ">80ms (API Level)", icon: <CrossIcon /> }
    },
    {
      name: "Local Host VPC Deployment",
      lex8: { text: "Yes (Full Sovereignty)", icon: <CheckIcon /> },
      harvey: { text: "No (SaaS Shared)", icon: <CrossIcon /> },
      legora: { text: "Yes (Custom Setup)", icon: <CheckIcon /> }
    },
    {
      name: "EU AI Act Compliance Architecture",
      lex8: { text: "Built-in (Article 14)", icon: <CheckIcon /> },
      harvey: { text: "Manual Audit", icon: <CrossIcon /> },
      legora: { text: "Manual Audit", icon: <CrossIcon /> }
    }
  ];

  return (
    <section ref={sectionRef} className="py-32 px-6 lg:px-12 bg-transparent relative z-10 border-t border-[#e6d8c8]/50" id="comparison">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 relative z-20">
          <h2 className="animate-title text-4xl lg:text-5xl font-cormorant tracking-tight mb-4 text-[#2c1a12] font-semibold">
            Institutional Comparison
          </h2>
          <p className="animate-title text-neutral-600 text-lg max-w-2xl mx-auto">
            Compare Lex8 architecture to legacy general-purpose startup chatbots.
          </p>
        </div>

        <div className="animate-table relative" ref={containerRef}>
          {/* Highlight Column Background (Absolute) */}
          <div className="hidden lg:block absolute top-0 bottom-0 left-[25%] w-[25%] bg-[#f4f9ff]/80 backdrop-blur-sm border-2 border-[#3b82f6]/40 rounded-2xl shadow-[0_8px_30px_rgba(59,130,246,0.12)] -z-10 transform scale-y-[1.02] origin-center" />
          
          <div className="w-full overflow-x-auto pb-4">
            <div className="min-w-[800px] w-full border border-[#e6d8c8]/40 rounded-xl bg-white/40 backdrop-blur-md shadow-[0_4px_30px_rgba(139,90,51,0.04)] lg:bg-transparent lg:border-none lg:shadow-none">
              
              {/* Header */}
              <div className="flex items-end border-b-2 border-[#2c1a12]/10 pb-6 mb-4 px-6 lg:px-0 relative z-10">
                <div className="w-[25%] text-xs font-bold text-[#2c1a12]/50 uppercase tracking-widest px-4">Feature Architecture</div>
                <div className="w-[25%] px-4">
                  <div className="inline-flex items-center gap-2">
                    <span className="text-lg font-bold text-[#1e3a8a] tracking-tight">Lex8 Engine</span>
                    <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold tracking-widest uppercase">Premium</span>
                  </div>
                </div>
                <div className="w-[25%] text-sm font-semibold text-[#2c1a12]/70 px-4">Harvey AI</div>
                <div className="w-[25%] text-sm font-semibold text-[#2c1a12]/70 px-4">Legora</div>
              </div>

              {/* Rows */}
              <div className="flex flex-col gap-2 px-4 lg:px-0 relative z-10">
                {features.map((feature, idx) => (
                  <div 
                    key={idx} 
                    className="animate-row group flex items-center py-5 border-b border-[#e6d8c8]/40 last:border-0 hover:bg-white/60 hover:shadow-sm rounded-lg transition-all duration-300"
                  >
                    <div className="w-[25%] px-4 font-medium text-[#2c1a12]/80 group-hover:text-[#2c1a12] transition-colors leading-relaxed pr-8">
                      {feature.name}
                    </div>
                    
                    <div className="w-[25%] px-4">
                      <div className="flex items-center gap-3 group-hover:scale-105 transition-transform duration-300 origin-left">
                        {feature.lex8.icon}
                        <span className="font-semibold text-[#1e3a8a] text-sm tracking-wide">{feature.lex8.text}</span>
                      </div>
                    </div>
                    
                    <div className="w-[25%] px-4">
                      <div className="flex items-center gap-3 group-hover:scale-105 transition-transform duration-300 origin-left">
                        {feature.harvey.icon}
                        <span className="font-medium text-neutral-500 group-hover:text-neutral-700 transition-colors text-sm">{feature.harvey.text}</span>
                      </div>
                    </div>
                    
                    <div className="w-[25%] px-4">
                      <div className="flex items-center gap-3 group-hover:scale-105 transition-transform duration-300 origin-left">
                        {feature.legora.icon}
                        <span className="font-medium text-neutral-500 group-hover:text-neutral-700 transition-colors text-sm">{feature.legora.text}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
