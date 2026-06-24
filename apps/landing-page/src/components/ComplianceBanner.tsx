"use client";

import React from "react";
import ScrollVelocity from "./ScrollVelocity";

export default function ComplianceBanner() {
  return (
    <section className="w-full bg-gradient-to-r from-[#1a0f0a] via-[#24150f] to-[#1a0f0a] py-20 lg:py-28 border-y border-[#8b5a33]/20 relative z-10 overflow-hidden shadow-[inset_0_0_100px_rgba(0,0,0,0.5)] flex flex-col justify-center" id="compliance">
      <div className="text-center mb-12">
        <h2 className="text-3xl lg:text-4xl font-cormorant tracking-widest text-[#e6d8c8] uppercase mb-4 font-semibold">
          Compliance & Sovereign Trust
        </h2>
        <p className="text-[#a89078] text-lg max-w-2xl mx-auto font-serif">
          Lex8 is built in strict adherence to Article 14 of the European Union AI Act.
        </p>
      </div>

      <ScrollVelocity
        texts={[
          'EU AI ACT ARTICLE 14 • ISO 27001 • ',
          'SOC 2 TYPE II • W3C DID • CRYPTOGRAPHIC LOGGING • '
        ]} 
        velocity={40} 
        className="font-mono text-[#d4c1ab] text-4xl lg:text-5xl px-4 font-bold tracking-[0.1em]"
        parallaxClassName="parallax mb-8 last:mb-0"
      />
    </section>
  );
}
