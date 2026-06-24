import { Lock, Shield, CheckCircle } from "lucide-react";

export default function Trust() {
  return (
    <section className="py-32 px-6 lg:px-12 bg-transparent relative z-10 border-t border-[#e6d8c8]/50" id="security">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
        <div className="lg:w-1/2">
          <h2 className="text-5xl lg:text-6xl font-cormorant tracking-tight mb-8 leading-[1.1] italic text-[#8b5a33]">
            Built for Defensibility.
          </h2>
          <p className="text-xl text-neutral-600 mb-10 leading-relaxed">
            Protecting your firm&apos;s reputation is our foundational principle.  
            Built from the ground up for the strictest EU AI Act Article 14 compliance standards.
          </p>
          
          <div className="space-y-8">
            <div className="flex gap-4 items-start">
              <Lock className="w-6 h-6 text-brand shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-lg mb-1 text-[#2c1a12]">Universal Agent Identity (UAI)</h4>
                <p className="text-neutral-500">Scope definitions on agent DIDs and fail-closed posture integrations via Redpanda.</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <Shield className="w-6 h-6 text-brand shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-lg mb-1 text-[#2c1a12]">The Defensibility Console</h4>
                <p className="text-neutral-500">Centralized dashboard showing action timelines, block analyzers, and juror disagreement logs.</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <CheckCircle className="w-6 h-6 text-brand shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-lg mb-1 text-[#2c1a12]">Forensic Narratives</h4>
                <p className="text-neutral-500">One-click downloads of signed PDF reports detailing the complete governance trail.</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="lg:w-1/2 w-full">
          <div className="aspect-square bg-white/50 rounded-[3rem] p-12 flex items-center justify-center border border-[#e6d8c8]">
            {/* Visual representation of trust/security */}
            <div className="w-full h-full border border-[#e6d8c8] rounded-full flex items-center justify-center relative shadow-[inset_0_0_40px_rgba(139,90,51,0.05)]">
              <div className="absolute inset-0 rounded-full border border-brand/20 animate-[spin_10s_linear_infinite]" />
              <div className="w-3/4 h-3/4 border border-[#e6d8c8] rounded-full flex items-center justify-center relative">
                 <div className="absolute inset-0 rounded-full border border-brand/30 animate-[spin_15s_linear_infinite_reverse]" />
                 <Shield className="w-24 h-24 text-brand/50" strokeWidth={1} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
