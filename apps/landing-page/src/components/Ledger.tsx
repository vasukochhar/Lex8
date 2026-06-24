"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin";

const logs = [
  { text: "[2026-05-19 14:30:13] AGENT: DID:eth:0x8F9a... REQUESTING CONTRACT EVALUATION [REF: 0928]", type: "normal" },
  { text: "[2026-05-19 14:30:14] AGENT: PARSING PENDING DISCLOSURE PARAGRAPHS... PRIVILEGE SUSPICION RAISED", type: "normal" },
  { text: "[2026-05-19 14:30:15] MONITOR: CHECKING PRIVILEGE INTERCEPT MATRIX (LANE 2)", type: "normal" },
  { text: "[2026-05-19 14:30:15] MONITOR: DETECTED INTERNAL MEMO REFERENCING TRADE SECRETS SEC_5.1a", type: "normal" },
  { text: "[2026-05-19 14:30:16] TRIBUNAL: SENT TO COURT JURORS. GEMINI: BLOCKED | CLAUDE: BLOCKED | DEEPSEEK: BLOCKED", type: "blocked" },
  { text: "[2026-05-19 14:30:16] TRIBUNAL: FINAL DECISION → BLOCKED_PRIVILEGE_LEAK (RISK: 0.89)", type: "blocked" },
  { text: "[2026-05-19 14:35:00] HUMAN_REVIEWER: J.Doe | OVERRIDE: FALSE | RECORD HASH: e3b0c442...", type: "human" },
  { text: "[2026-05-19 14:35:01] SYSTEM: SECURE BLOCK COMMIT COMPLETED. LEDGER UPDATED.", type: "success" },
];

export default function Ledger() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const logsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger, TextPlugin);

    if (!sectionRef.current || !containerRef.current || !logsRef.current) return;

    // Reset initial states
    const titleElements = sectionRef.current.querySelectorAll('.animate-title');
    gsap.set(titleElements, { opacity: 0, y: 30, filter: "blur(8px)" });
    gsap.set(containerRef.current, { opacity: 0, y: 40 });

    const rows = Array.from(logsRef.current.children);
    rows.forEach(row => {
      gsap.set(row, { opacity: 0, y: 8 });
      const textNode = row.querySelector('.text-node');
      const cursor = row.querySelector('.cursor');
      if (textNode) gsap.set(textNode, { text: "" });
      if (cursor) gsap.set(cursor, { opacity: 0 });
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 75%",
        once: true
      }
    });

    // 1. Entrance Animations
    tl.to(titleElements, {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      duration: 0.8,
      stagger: 0.15,
      ease: "power3.out"
    });

    tl.to(containerRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power3.out"
    }, "-=0.4");

    // 2. Stream logs sequence
    rows.forEach((row, index) => {
      const logData = logs[index];
      const textNode = row.querySelector('.text-node');
      const cursor = row.querySelector('.cursor');
      const duration = logData.text.length * 0.03; // ~30ms per character

      // Reveal row and flash background
      tl.to(row, {
        opacity: 1,
        y: 0,
        duration: 0.2,
        ease: "power2.out",
        onStart: () => {
          gsap.fromTo(row, 
            { backgroundColor: "rgba(255,255,255,0.1)" }, 
            { backgroundColor: "transparent", duration: 0.6 }
          );
          if (cursor) {
            // Start cursor blink
            gsap.to(cursor, { opacity: 1, duration: 0.1 });
            gsap.to(cursor, { opacity: 0, duration: 0.4, repeat: -1, yoyo: true, ease: "steps(1)" });
          }
        }
      });

      // Typewriter effect
      tl.to(textNode, {
        text: logData.text,
        duration: duration,
        ease: "none",
        onUpdate: () => {
          // Auto-scroll the container to bottom naturally
          if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
          }
        },
        onComplete: () => {
          if (cursor && index !== rows.length - 1) {
            gsap.killTweensOf(cursor);
            gsap.set(cursor, { opacity: 0 }); // Hide cursor if not last line
          }
        }
      });

      // Small pause between lines
      tl.to({}, { duration: 0.1 });
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  const getLogStyle = (type: string) => {
    switch (type) {
      case "blocked":
        return "text-red-400 drop-shadow-[0_0_10px_rgba(248,113,113,0.4)]";
      case "human":
        return "text-blue-400 drop-shadow-[0_0_10px_rgba(96,165,250,0.4)]";
      case "success":
        return "text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.4)]";
      default:
        return "text-neutral-300";
    }
  };

  return (
    <section ref={sectionRef} className="py-32 px-6 lg:px-12 bg-transparent relative z-10 border-t border-[#e6d8c8]/50" id="ledger">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="mb-16 relative z-20">
          <h2 className="animate-title text-4xl lg:text-5xl font-cormorant tracking-tight mb-4 text-[#2c1a12] font-semibold text-left">
            Immutable Activity Ledger
          </h2>
          <p className="animate-title text-neutral-600 text-lg max-w-2xl text-left">
            View real-time governance output intercepts scrolling in from the local gateway broker.
          </p>
        </div>

        {/* Terminal Panel */}
        <div 
          ref={containerRef}
          className="w-full bg-[#10192A] rounded-3xl border border-white/10 shadow-[0_20px_60px_rgba(16,25,42,0.4)] overflow-hidden relative backdrop-blur-md"
        >
          {/* Faint Noise Texture */}
          <div 
            className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay"
            style={{ backgroundImage: 'url("/paper-texture.png")' }}
          />
          
          {/* Scan line effect */}
          <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100%_4px] opacity-20" />

          {/* Top Bar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/[0.02]">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E]" />
              <div className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]" />
              <div className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29]" />
            </div>
            <div className="font-mono text-[11px] text-white/30 tracking-widest uppercase font-medium">
              lex8d —version 1.0.8-audit-broker
            </div>
          </div>

          {/* Logs Container */}
          <div 
            ref={scrollRef}
            className="p-6 lg:p-8 h-[400px] overflow-y-auto font-mono text-sm leading-relaxed scroll-smooth scrollbar-hide relative"
            style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
          >
            <div ref={logsRef} className="flex flex-col relative z-10">
              {logs.map((log, idx) => (
                <div 
                  key={idx} 
                  className="group flex items-start rounded px-2 py-1.5 -mx-2 hover:bg-white/[0.04] transition-colors duration-300"
                >
                  <span className={`text-node break-words w-full ${getLogStyle(log.type)} group-hover:brightness-110 transition-all`} />
                  <span className={`cursor inline-block w-2 h-4 ml-1 translate-y-0.5 bg-neutral-400 opacity-0 ${log.type === 'normal' ? 'bg-neutral-400' : 'bg-current'}`} />
                </div>
              ))}
            </div>
            {/* Inner glow shadow at bottom */}
            <div className="sticky bottom-0 h-12 bg-gradient-to-t from-[#10192A] to-transparent w-full pointer-events-none" />
          </div>
        </div>
      </div>
    </section>
  );
}
