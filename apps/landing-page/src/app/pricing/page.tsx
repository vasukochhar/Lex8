import Footer from "@/components/Footer";
import { Check } from "lucide-react";

export default function PricingPage() {
  const tiers = [
    {
      name: "Per  Seat  Model",
      badge: "Firmwide Allocation",
      description:
        "Designed for top-tier firms integrating modular AI agents into everyday partner work streams.",
      price: "Custom",
      sub: "/ seat / month",
      features: [
        "Access to the 8 core module nodes",
        "Local VPC deployment support",
        "Lane 1 & Lane 3 validation loops",
        "Active Directory / SSO integration",
      ],
      highlighted: false,
    },
    {
      name: "Per  Governed  Action",
      badge: "High Volume Transactional",
      description:
        "For enterprise firms seeking unlimited seat distribution focused on transactional audit volume.",
      price: "Volume",
      sub: "/ ledger transaction",
      features: [
        "Unlimited user seat allocation",
        "High-performance localized proxy nodes",
        "Full Lane 1-4 validation ledgers",
        "Cryptographic lineage auditing",
      ],
      highlighted: true,
    },
    {
      name: "Compliance  Tier",
      badge: "Sovereign Protocol",
      description:
        "For defense, banking, or multi-national law groups with strict sovereignty constraints.",
      price: "Enterprise",
      sub: "/ custom deployment",
      features: [
        "Dedicated host hardware installation",
        "Sovereign protocol access",
        "Custom tribunal weighting matrices",
        "Article 14 local auditor console",
      ],
      highlighted: false,
    },
  ];

  return (
    <main className="min-h-screen bg-[#fdf8f0] relative overflow-hidden">
      {/* Ambient warm glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(ellipse at top center, rgba(139,90,51,0.07) 0%, transparent 60%),
            radial-gradient(ellipse at bottom left, rgba(181,128,85,0.09) 0%, transparent 70%)`,
        }}
      />

      {/* Page Header */}
      <section className="relative z-10 pt-40 pb-20 px-6 lg:px-12 max-w-7xl mx-auto text-center">
        <div className="animate-in slide-in-from-bottom-4 fade-in duration-700 max-w-2xl mx-auto">
          <p className="text-[#8b5a33] text-[11px] font-mono font-bold tracking-[0.2em] uppercase mb-5">
            Firmwide Deployment
          </p>
          <h1 className="font-zaslia text-5xl lg:text-6xl text-[#2c1a12] leading-[1.1] mb-6 [word-spacing:0.25em]">
            Pricing  Architecture
          </h1>
          <p className="text-[#2c1a12]/65 text-lg leading-relaxed font-light max-w-xl mx-auto">
            Predictable enterprise cost structures with zero variable API pass-through risk. Secure local instances adapted to your firm size.
          </p>
        </div>
      </section>

      {/* Divider */}
      <div className="border-t border-[#e6d8c8]/60 max-w-7xl mx-auto px-6 lg:px-12 mb-20" />

      {/* Pricing Grid */}
      <section className="relative z-10 pb-24 px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {tiers.map((tier, idx) => (
            <div
              key={idx}
              className={`relative rounded-2xl flex flex-col gap-0 overflow-hidden
                          transition-transform duration-300 hover:-translate-y-1.5
                          ${tier.highlighted
                            ? "border border-[#c4a482]/60 bg-white/70 shadow-[0_16px_48px_rgba(139,90,51,0.10)]"
                            : "border border-[#e6d8c8]/70 bg-white/50 shadow-[0_4px_20px_rgba(139,90,51,0.05)]"
                          }`}
              style={{ backdropFilter: "blur(16px)", animationDelay: `${idx * 100}ms` }}
            >
              {/* Highlighted accent bar */}
              {tier.highlighted && (
                <div className="h-[2px] w-full bg-gradient-to-r from-[#8b5a33] via-[#c4a482] to-[#8b5a33]" />
              )}

              <div className="p-7 flex flex-col gap-6 flex-1">
                {/* Badge */}
                <p className="text-[10px] font-mono font-bold tracking-[0.2em] uppercase text-[#8b5a33]">
                  {tier.badge}
                </p>

                {/* Name + description */}
                <div>
                  <h3 className="font-zaslia text-2xl text-[#2c1a12] leading-snug mb-3 [word-spacing:0.2em]">
                    {tier.name}
                  </h3>
                  <p className="text-[#2c1a12]/60 text-[13.5px] leading-relaxed font-light">
                    {tier.description}
                  </p>
                </div>

                {/* Price */}
                <div className="flex items-end gap-3 border-b border-[#e6d8c8]/60 pb-5">
                  <span className="font-zaslia text-3xl text-[#2c1a12] [word-spacing:0.2em]">
                    {tier.price}
                  </span>
                  <span className="text-[10px] font-mono text-[#2c1a12]/45 uppercase tracking-[0.12em] mb-1">
                    {tier.sub}
                  </span>
                </div>

                {/* Features */}
                <ul className="flex flex-col gap-3 flex-1">
                  {tier.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check
                        className="text-[#8b5a33] shrink-0 mt-0.5"
                        strokeWidth={2.5}
                        size={15}
                      />
                      <span className="text-[#2c1a12]/70 text-[13.5px] leading-snug font-light">
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <button
                  className={`w-full py-3 px-6 rounded-full text-sm font-medium tracking-wide transition-all duration-300 mt-2
                    ${tier.highlighted
                      ? "bg-[#8b5a33] text-[#fdf8f0] hover:bg-[#a67b5b] shadow-md shadow-[#8b5a33]/20"
                      : "bg-transparent border border-[#8b5a33]/25 text-[#2c1a12] hover:border-[#8b5a33]/50 hover:bg-[#8b5a33]/5"
                    }`}
                >
                  Contact Sales
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
