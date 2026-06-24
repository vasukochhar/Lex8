"use client"

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { CheckCircle, XCircle, AlertTriangle, Shield, FileSearch, Code2 } from "lucide-react";

const jurors = [
  {
    id: "01",
    model: "Gemini 1.5",
    role: "Privilege Violation Check",
    verdict: "REJECT" as const,
    icon: Shield,
    detail:
      "Detected confidential internal corporate structure diagram reference in paragraph 4. Draft includes client identification hashes. Output contains high leakage potential.",
    confidence: 94,
  },
  {
    id: "02",
    model: "Claude 3.5",
    role: "Fact-Trace Validation",
    verdict: "REJECT" as const,
    icon: FileSearch,
    detail:
      "Citation in line 12 references Delaware General Corp Law § 144, but references non-existent subsection (d)(4). Citation validation failed on statutory source grounds.",
    confidence: 88,
  },
  {
    id: "03",
    model: "DeepSeek V3",
    role: "Syntactic Compliance",
    verdict: "APPROVE" as const,
    icon: Code2,
    detail:
      "Work-product formatting is structurally intact. Output complies with local Federal Rules of Civil Procedure Rule 11. No drafting abnormalities identified.",
    confidence: 97,
  },
];

function VerdictBadge({ verdict }: { verdict: "REJECT" | "APPROVE" }) {
  const isReject = verdict === "REJECT";
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] font-mono font-bold tracking-[0.12em] uppercase border ${
        isReject
          ? "bg-red-950/40 border-red-500/30 text-red-400"
          : "bg-emerald-950/40 border-emerald-500/30 text-emerald-400"
      }`}
    >
      {isReject ? (
        <XCircle className="w-3 h-3" />
      ) : (
        <CheckCircle className="w-3 h-3" />
      )}
      {verdict}
    </span>
  );
}

function ConfidenceBar({ value, delay }: { value: number; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  return (
    <div ref={ref} className="flex items-center gap-3 mt-auto pt-5">
      <span className="text-[10px] font-mono text-[#c4a482]/40 tracking-widest uppercase whitespace-nowrap">
        Confidence
      </span>
      <div className="flex-1 h-[2px] bg-[#c4a482]/10 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-[#c4a482]/60 to-[#c4a482]"
          initial={{ width: 0 }}
          animate={inView ? { width: `${value}%` } : { width: 0 }}
          transition={{ duration: 1.2, delay: delay + 0.4, ease: "easeOut" }}
        />
      </div>
      <span className="text-[11px] font-mono text-[#c4a482]/60 tabular-nums">{value}%</span>
    </div>
  );
}

function BlockedStamp({ visible }: { visible: boolean }) {
  return (
    <motion.div
      className="relative flex items-center justify-center"
      initial={{ opacity: 0, scale: 1.6, rotate: -12 }}
      animate={visible ? { opacity: 1, scale: 1, rotate: -8 } : { opacity: 0, scale: 1.6, rotate: -12 }}
      transition={{ type: "spring", stiffness: 320, damping: 22, delay: 0.1 }}
    >
      {/* Outer stamp border */}
      <div
        className="relative px-10 py-4 border-[3px] border-red-500/70 rounded-sm"
        style={{
          boxShadow: "0 0 0 1px rgba(239,68,68,0.15), inset 0 0 0 1px rgba(239,68,68,0.08)",
        }}
      >
        {/* Corner ticks */}
        {["-top-1 -left-1", "-top-1 -right-1", "-bottom-1 -left-1", "-bottom-1 -right-1"].map((pos, i) => (
          <span key={i} className={`absolute w-2 h-2 border-red-500/50 ${pos} ${i < 2 ? 'border-t' : 'border-b'} ${i % 2 === 0 ? 'border-l' : 'border-r'}`} />
        ))}
        <span className="block text-red-500 font-mono font-black text-3xl tracking-[0.35em] uppercase select-none"
          style={{ textShadow: "0 0 20px rgba(239,68,68,0.4), 0 0 40px rgba(239,68,68,0.15)" }}>
          Blocked
        </span>
      </div>
    </motion.div>
  );
}

export default function Tribunal() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-10% 0px" });
  const [stampVisible, setStampVisible] = useState(false);

  useEffect(() => {
    if (inView) {
      const t = setTimeout(() => setStampVisible(true), 900);
      return () => clearTimeout(t);
    }
  }, [inView]);

  return (
    <section
      ref={sectionRef}
      className="py-32 px-6 lg:px-12 bg-[#1a0f0a] relative z-10 border-t border-[#8b5a33]/20 overflow-hidden"
      id="tribunal"
    >
      {/* Background video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0 opacity-30 mix-blend-luminosity pointer-events-none"
      >
        <source src="/4471968-uhd_2560_1440_30fps.mp4" type="video/mp4" />
      </video>

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1a0f0a] via-transparent to-[#1a0f0a] z-0 pointer-events-none" />
      <div className="absolute inset-0 bg-[#1a0f0a]/50 z-0 pointer-events-none" />

      {/* Subtle noise */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none mix-blend-overlay z-0"
        style={{ backgroundImage: 'url("/paper-texture.png")', backgroundSize: "cover" }}
      />

      <div className="max-w-6xl mx-auto relative z-10">

        {/* Section header */}
        <div className="text-center mb-20">
          <motion.p
            className="text-[#3b82f6] text-[11px] font-mono font-bold tracking-[0.22em] uppercase mb-5 drop-shadow-md"
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            AI Supreme Court
          </motion.p>
          <motion.h2
            className="text-4xl lg:text-6xl font-cormorant tracking-tight mb-5 text-[#fdf8f0] font-semibold"
            style={{ textShadow: "0 4px 24px rgba(0,0,0,0.6)" }}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            Multi-Model Consensus Tribunal
          </motion.h2>
          <motion.p
            className="text-[#c4a482]/70 text-base lg:text-lg max-w-xl mx-auto leading-relaxed font-medium"
            style={{ textShadow: "0 2px 12px rgba(0,0,0,0.8)" }}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            Outputs are evaluated by three independent model nodes. A single dissenting vote
            blocks the draft to enforce absolute precision.
          </motion.p>
        </div>

        {/* Juror cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-14">
          {jurors.map((juror, i) => {
            const Icon = juror.icon;
            const isReject = juror.verdict === "REJECT";
            return (
              <motion.div
                key={juror.id}
                initial={{ opacity: 0, y: 32 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.25 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              >
                <div
                  className="group relative h-full flex flex-col p-7 rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-1"
                  style={{
                    background:
                      "linear-gradient(145deg, rgba(26,15,10,0.85) 0%, rgba(36,22,14,0.75) 60%, rgba(50,28,12,0.60) 100%)",
                    backdropFilter: "blur(16px) saturate(1.3)",
                    WebkitBackdropFilter: "blur(16px) saturate(1.3)",
                    border: isReject
                      ? "1px solid rgba(239,68,68,0.12)"
                      : "1px solid rgba(52,211,153,0.12)",
                    boxShadow: isReject
                      ? "0 1px 0 0 rgba(239,68,68,0.08) inset, 0 8px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(239,68,68,0.05)"
                      : "0 1px 0 0 rgba(52,211,153,0.08) inset, 0 8px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(52,211,153,0.05)",
                  }}
                >
                  {/* Hover sheen */}
                  <div
                    className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background:
                        "linear-gradient(145deg, rgba(253,248,240,0.06) 0%, rgba(196,164,130,0.03) 50%, transparent 100%)",
                    }}
                  />

                  {/* Top row: juror number + verdict */}
                  <div className="flex items-center justify-between mb-5 relative z-10">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{
                          background: "rgba(196,164,130,0.08)",
                          border: "1px solid rgba(196,164,130,0.12)",
                        }}
                      >
                        <Icon className="w-4 h-4 text-[#c4a482]" strokeWidth={1.5} />
                      </div>
                      <span className="text-[10px] font-mono text-[#c4a482]/50 tracking-[0.14em] uppercase font-bold">
                        Juror {juror.id}
                      </span>
                    </div>
                    <VerdictBadge verdict={juror.verdict} />
                  </div>

                  {/* Model name */}
                  <h3 className="text-xl font-cormorant font-bold text-[#fdf8f0] mb-1 relative z-10 leading-tight">
                    {juror.model}
                  </h3>

                  {/* Role label */}
                  <p className="text-[10px] font-mono font-bold tracking-[0.12em] text-[#c4a482]/50 uppercase mb-4 relative z-10">
                    {juror.role}
                  </p>

                  {/* Divider */}
                  <div className="w-full h-px bg-gradient-to-r from-transparent via-[#c4a482]/15 to-transparent mb-4" />

                  {/* Detail text */}
                  <p className="text-[#e6d8c8]/50 text-[13px] leading-relaxed relative z-10 flex-1">
                    {juror.detail}
                  </p>

                  {/* Confidence bar */}
                  <ConfidenceBar value={juror.confidence} delay={0.25 + i * 0.12} />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Verdict row */}
        <motion.div
          className="flex flex-col items-center gap-6"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          {/* Divider with label */}
          <div className="flex items-center gap-4 w-full max-w-sm">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[#c4a482]/20" />
            <div className="flex items-center gap-1.5">
              <AlertTriangle className="w-3 h-3 text-[#c4a482]/40" strokeWidth={1.5} />
              <span className="text-[10px] font-mono text-[#c4a482]/40 tracking-[0.16em] uppercase">
                Tribunal Decision
              </span>
            </div>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[#c4a482]/20" />
          </div>

          {/* Blocked stamp */}
          <BlockedStamp visible={stampVisible} />

          <p className="text-[#c4a482]/35 text-[11px] font-mono tracking-widest uppercase text-center">
            2 of 3 votes rejected · output quarantined · human review required
          </p>
        </motion.div>

      </div>
    </section>
  );
}
