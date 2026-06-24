"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Lock, Link, Users } from "lucide-react";

const lanes = [
  {
    id: "Lane 01",
    title: "Input Isolation",
    desc: "Lex8 parses incoming queries locally to strip PII and enforce work-product privilege constraints before data ever touches an LLM.",
    detail: "Client confidentiality preserved at the transport layer.",
    icon: Lock,
  },
  {
    id: "Lane 02",
    title: "Lineage Verification",
    desc: "Every statement in an output is mapped back cryptographically to its exact document origin. No hallucinated citations. No broken references.",
    detail: "Hash-verified provenance chain on every assertion.",
    icon: Link,
  },
  {
    id: "Lane 03",
    title: "Consensus Tribunal",
    desc: "Three distinct model architectures evaluate every generated draft independently. If consensus fails or a rule threshold is violated, the output is blocked.",
    detail: "A single dissenting vote kills the draft instantly.",
    icon: Users,
  },
];

export default function SecurityLanes() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const rowsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        headingRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%", once: true },
        }
      );

      if (rowsRef.current) {
        gsap.fromTo(
          Array.from(rowsRef.current.children),
          { opacity: 0, y: 28 },
          {
            opacity: 1, y: 0, stagger: 0.12, duration: 0.75, ease: "power3.out",
            scrollTrigger: { trigger: rowsRef.current, start: "top 85%", once: true },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-32 px-6 lg:px-12 bg-transparent relative z-10 border-t border-[#e6d8c8]/50 overflow-hidden"
    >
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{ backgroundImage: 'url("/paper-texture.png")', backgroundSize: "cover" }}
      />

      <div className="max-w-7xl mx-auto">

        {/* Section header */}
        <div ref={headingRef} className="mb-16 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div>
            <p className="text-[#8b5a33] text-[11px] font-mono font-bold tracking-[0.2em] uppercase mb-4">
              Governance Architecture
            </p>
            <h2 className="text-4xl lg:text-5xl font-cormorant tracking-tight text-[#2c1a12] font-semibold leading-tight">
              Three-Lane<br />
              <span className="italic text-[#8b5a33]">Security Pipeline</span>
            </h2>
          </div>
          <p className="text-[#2c1a12]/50 text-base leading-relaxed max-w-sm lg:text-right">
            Every query passes through three independent enforcement layers before a response is returned.
          </p>
        </div>

        {/* Lanes */}
        <div ref={rowsRef} className="flex flex-col">
          {lanes.map((lane, i) => {
            const Icon = lane.icon;
            return (
              <div
                key={i}
                className="group relative flex flex-col lg:flex-row lg:items-start gap-6 lg:gap-12 py-10 border-t border-[#e6d8c8]/60 last:border-b last:border-[#e6d8c8]/60 transition-colors duration-300 hover:bg-[#2c1a12]/[0.015] -mx-6 lg:-mx-12 px-6 lg:px-12"
              >
                {/* Left: number + icon */}
                <div className="flex items-center gap-4 lg:flex-col lg:items-start lg:w-32 flex-shrink-0">
                  <span className="text-[11px] font-mono text-[#2c1a12]/30 tracking-widest uppercase leading-none">
                    {lane.id}
                  </span>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#8b5a33]/[0.07] group-hover:bg-[#8b5a33]/[0.13] transition-colors duration-300">
                    <Icon className="w-3.5 h-3.5 text-[#8b5a33]" strokeWidth={1.5} />
                  </div>
                </div>

                {/* Center: title + desc */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-2xl lg:text-3xl font-cormorant font-semibold text-[#2c1a12] mb-3 leading-tight">
                    {lane.title}
                  </h3>
                  <p className="text-[#2c1a12]/60 text-[15px] leading-relaxed max-w-xl">
                    {lane.desc}
                  </p>
                </div>

                {/* Right: detail callout */}
                <div className="lg:w-64 flex-shrink-0 flex items-start lg:justify-end pt-0.5">
                  <p className="text-[11px] font-mono text-[#2c1a12]/35 leading-relaxed lg:text-right border-l lg:border-l-0 lg:border-r border-[#c4a482]/40 pl-4 lg:pl-0 lg:pr-4">
                    {lane.detail}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
