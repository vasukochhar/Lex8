import Footer from "@/components/Footer";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#fdf8f0] relative overflow-hidden">
      {/* Ambient background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(ellipse at top right, rgba(139,90,51,0.08) 0%, transparent 65%),
            radial-gradient(ellipse at bottom left, rgba(181,128,85,0.10) 0%, transparent 75%)`,
        }}
      />

      {/* Page Header */}
      <section className="relative z-10 pt-40 pb-20 px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="max-w-2xl animate-in slide-in-from-bottom-4 fade-in duration-700">
          <p className="text-[#8b5a33] text-[11px] font-mono font-bold tracking-[0.2em] uppercase mb-5">
            Our Core Mission
          </p>
          <h1 className="font-zaslia text-5xl lg:text-6xl text-[#2c1a12] leading-[1.1] mb-6 [word-spacing:0.25em]">
            Founding  Philosophy
          </h1>
          <p className="text-[#2c1a12]/65 text-lg leading-relaxed font-light max-w-xl">
            Lex8 was founded by a coalition of legal scholars, cryptographic engineers, and AI safety researchers to build defensible systems for high-stakes environments.
          </p>
        </div>
      </section>

      {/* Divider */}
      <div className="border-t border-[#e6d8c8]/60 max-w-7xl mx-auto px-6 lg:px-12" />

      {/* Editorial Section */}
      <section className="relative z-10 py-20 px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">

          {/* Narrative Content */}
          <div className="lg:col-span-7 flex flex-col gap-8 animate-in slide-in-from-bottom-6 fade-in duration-1000 delay-150">
            <h2 className="font-zaslia text-3xl lg:text-4xl text-[#2c1a12] leading-snug [word-spacing:0.2em]">
              Governing  Intelligence  Before  Harm  Occurs
            </h2>

            <p className="text-[#2c1a12]/65 leading-[1.8] text-[15px] font-light">
              Legal workflows demand absolute certainty. In high-stakes litigation, M&A
              transactions, and regulatory filings, a single hallucinated case citation or
              work-product disclosure can compromise an entire matter. Yet general-purpose
              large language models are structurally prone to drift, hallucination, and
              privacy leakages.
            </p>

            {/* Pull Quote */}
            <div className="pl-8 border-l-2 border-[#8b5a33]/25 py-2">
              <blockquote className="font-cormorant text-2xl lg:text-3xl italic text-[#2c1a12]/80 leading-snug mb-4">
                &ldquo;We did not build another productivity chatbot for lawyers. We built
                the safety rails that sit between AI models and firm liability. Lex8 is an
                institutional platform for enterprise trust.&rdquo;
              </blockquote>
              <p className="font-mono text-[11px] text-[#8b5a33] font-bold tracking-[0.18em] uppercase">
                &mdash;&nbsp;Marcus Vance, Co-Founder &amp; Director of Architecture
              </p>
            </div>

            <p className="text-[#2c1a12]/65 leading-[1.8] text-[15px] font-light">
              Our primary engineering breakthrough is the decoupling of legal reasoning from
              model weights. By enforcing a multi-layered local validation pipeline, Lex8
              intercepts model inputs to protect privilege and audits outputs across a
              consensus tribunal before they can reach the user.
            </p>
          </div>

          {/* Stats Sidebar */}
          <div className="lg:col-span-5 animate-in slide-in-from-bottom-6 fade-in duration-1000 delay-300">
            <div
              className="rounded-2xl border border-[#e6d8c8]/70 bg-white/55 p-8 lg:sticky lg:top-32 flex flex-col gap-0"
              style={{ backdropFilter: "blur(16px)" }}
            >
              <h3 className="font-zaslia text-2xl text-[#2c1a12] mb-1 [word-spacing:0.2em]">
                Anchor8  Governance  Fabric
              </h3>
              <p className="font-mono text-[10px] text-[#8b5a33] font-bold tracking-[0.18em] uppercase mb-5">
                Cryptographic Registry Protocol
              </p>
              <p className="text-[#2c1a12]/60 text-sm leading-relaxed font-light mb-8">
                The underlying protocol ensuring immutable operations ledger storage across
                local firm VPC clusters.
              </p>

              <div className="flex flex-col divide-y divide-[#e6d8c8]/60">
                {[
                  { val: "48M+", label: "Governed Operations" },
                  { val: "<1.5ms", label: "Node Latency" },
                  { val: "100%", label: "Consensus Integrity Rate" },
                ].map((stat) => (
                  <div key={stat.label} className="py-5 flex flex-col gap-1">
                    <span className="font-mono text-3xl font-bold text-[#2c1a12] tracking-tight">
                      {stat.val}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-[#8b5a33] uppercase tracking-[0.2em]">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>

      <Footer />
    </main>
  );
}
