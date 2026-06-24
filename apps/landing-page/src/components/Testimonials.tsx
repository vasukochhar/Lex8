export default function Testimonials() {
  const testimonials = [
    {
      quote: "The ability to produce a cryptographically signed EU AI Act compliant audit log for every brief generated is a paradigm shift. We won't use anything else.",
      author: "Managing Partner",
      role: "Magic Circle Firm"
    },
    {
      quote: "The governance framework means I finally trust an AI platform to draft initial arguments without exposing the firm to unacceptable malpractice risk.",
      author: "General Counsel",
      role: "Fortune 500 Enterprise"
    },
    {
      quote: "Lex8's Vault Vision pipeline caught a redaction leak our legacy tools missed. That one catch justified the platform for the next decade.",
      author: "Head of Litigation",
      role: "AmLaw 50 Firm"
    }
  ];

  return (
    <section className="py-32 px-6 lg:px-12 bg-transparent relative z-10 border-t border-[#e6d8c8]/50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl lg:text-5xl font-cormorant tracking-tight mb-20 text-center italic text-[#8b5a33]">
          Trusted by top firms.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <div key={idx} className="bg-white/80 p-10 rounded-3xl border border-[#e6d8c8] shadow-sm flex flex-col justify-between h-full hover:border-brand/50 transition-colors">
              <p className="text-xl font-cormorant text-[#8b5a33] leading-relaxed mb-8 italic">
                &quot;{t.quote}&quot;
              </p>
              <div>
                <p className="font-semibold text-[#2c1a12]">{t.author}</p>
                <p className="text-sm text-neutral-500">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
