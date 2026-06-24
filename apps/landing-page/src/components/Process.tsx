export default function Process() {
  const steps = [
    { number: "01", title: "Drafter", desc: "LLM integration for brief drafting with inline hallucination checks." },
    { number: "02", title: "Filer", desc: "RPA PACER mock flow with pre-submit attorney HMAC auth guards." },
    { number: "03", title: "Vault Vision", desc: "OCR pipeline detecting redaction leaks by diffing text layers." },
    { number: "04", title: "Validator", desc: "Neuro-symbolic rules engine resolving logical compliance conflicts." }
  ];

  return (
    <section className="py-32 px-6 lg:px-12 bg-transparent relative z-10 border-t border-[#e6d8c8]/50" id="process">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl lg:text-5xl font-cormorant tracking-tight mb-20 text-center italic text-[#8b5a33]">
          The 8 Agent Archetypes
        </h2>

        <div className="flex flex-col lg:flex-row items-start justify-between relative">
          {/* Connecting line */}
          <div className="absolute top-8 left-8 lg:top-8 lg:left-0 w-0.5 h-full lg:w-full lg:h-0.5 bg-[#e6d8c8] -z-0" />

          {steps.map((step, idx) => (
            <div key={idx} className="relative z-10 flex flex-row lg:flex-col items-start gap-6 lg:gap-8 mb-12 lg:mb-0 lg:w-1/4 pr-4">
              <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center border-2 border-brand text-xl font-cormorant text-brand font-bold shrink-0 shadow-lg shadow-brand/10">
                {step.number}
              </div>
              <div>
                <h3 className="text-2xl font-cormorant font-semibold mb-3 text-[#2c1a12]">{step.title}</h3>
                <p className="text-neutral-500 leading-relaxed text-sm lg:text-base pr-4">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
