"use client"

import { FileText, Edit, Shield, AlertTriangle, LineChart, Lock, Inbox, Search } from "lucide-react"
import CardSwap, { Card } from './CardSwap'
import LiquidEther from './LiquidEther'

// Stable reference — must live outside the component so it never triggers a
// WebGL context re-initialisation on each render.
const LIQUID_COLORS = ['#3d1a08', '#8b5a33', '#c4a482', '#e6d8c8', '#fdf8f0'] as const;

const archetypes = [
  { id: "01", title: "Case Synthesis", desc: "Aggregates multi-docket records into verified timelines.", lane: "LANE 2 CHECKED", icon: FileText },
  { id: "02", title: "Contextual Drafter", desc: "Drafts highly specific legal briefings mapping case history.", lane: "LANE 3 CHECKED", icon: Edit },
  { id: "03", title: "Provenance Validator", desc: "Traces exact provenance for every reference in real time.", lane: "LANE 2 CHECKED", icon: Shield },
  { id: "04", title: "Red-Team Counsel", desc: "Stress tests arguments against adversarial legal defenses.", lane: "LANE 3 CHECKED", icon: AlertTriangle },
  { id: "05", title: "Predictive Forecast", desc: "Estimates trial success rates based on judge history databases.", lane: "LANE 2 CHECKED", icon: LineChart },
  { id: "06", title: "Privilege Intercept", desc: "Flags and intercepts attorney-client privilege leakage.", lane: "LANE 1 CHECKED", icon: Lock },
  { id: "07", title: "E-Filer", desc: "Formats, builds, and checks court-compliant filings automatically.", lane: "LANE 4 CHECKED", icon: Inbox },
  { id: "08", title: "Forensic Audit", desc: "Scans past partner work archives for logical anomalies.", lane: "LANE 2 CHECKED", icon: Search },
]

export default function Archetypes() {
    return (
        <section className="relative bg-[#1e0e06] z-10 py-16 border-t border-[#8b5a33]/20 overflow-hidden" id="archetypes">
            {/* Deep Background Layer */}
            <div className="absolute inset-0 z-0 bg-[#1e0e06]">
                {/* Liquid Ether — light cream fluid on dark ground */}
                <div className="absolute inset-0 opacity-60">
                    <LiquidEther
                        colors={LIQUID_COLORS as unknown as string[]}
                        mouseForce={30}
                        cursorSize={120}
                        isViscous={false}
                        viscous={30}
                        iterationsViscous={8}
                        iterationsPoisson={8}
                        resolution={0.3}
                        isBounce={false}
                        autoDemo={true}
                        autoSpeed={0.8}
                        autoIntensity={2.5}
                        takeoverDuration={0.25}
                        autoResumeDelay={2000}
                        autoRampDuration={0.8}
                    />
                </div>

                {/* Vignette to blend into dark edges */}
                <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_30%,#1e0e06_100%)] opacity-70" />
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-[#1e0e06] via-transparent to-[#1e0e06] opacity-80" />
            </div>

            <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-20 flex flex-col lg:flex-row items-center">
                {/* Left: Header intro */}
                <div className="lg:w-1/2 text-left mb-16 lg:mb-0">
                    <h2 className="text-4xl lg:text-6xl font-cormorant tracking-tight mb-6 text-[#fdf8f0] font-semibold">
                        8 Legal AI Archetypes
                    </h2>
                    <p className="text-[#c4a482]/80 text-lg lg:text-xl max-w-md leading-relaxed">
                        Modular agents built inside our fail-closed governance framework.
                    </p>
                </div>

                {/* Right: Card Swap Section */}
                <div className="lg:w-1/2 w-full flex lg:justify-end justify-center items-center relative z-20">
                    <div style={{ height: '500px', width: '100%', position: 'relative', transform: 'translateZ(0)', isolation: 'isolate' }}>
                        <CardSwap
                            width={540}
                            height={600}
                            cardDistance={100}
                            verticalDistance={80}
                            delay={3000}
                            pauseOnHover={false}
                            easing="linear"
                        >
                        {archetypes.map((item, idx) => {
                            const Icon = item.icon;
                            return (
                                <Card key={idx}>
                                    <div
                                        className="w-full h-full flex flex-col p-10 rounded-2xl overflow-hidden group relative mx-auto text-left"
                                        style={{
                                            // Solid opaque-enough dark bg — no backdropFilter needed since
                                            // cards are stacked on a fully dark section background.
                                            // Removing blur saves 8 compositor layer blits per frame.
                                            background: 'linear-gradient(145deg, rgba(30,14,6,0.96) 0%, rgba(44,26,18,0.94) 60%, rgba(60,32,12,0.90) 100%)',
                                            border: '1px solid rgba(196,164,130,0.15)',
                                            boxShadow: `
                                                0 1px 0 0 rgba(196,164,130,0.12) inset,
                                                0 -1px 0 0 rgba(0,0,0,0.3) inset,
                                                0 8px 32px rgba(0,0,0,0.3),
                                                0 2px 8px rgba(0,0,0,0.2)
                                            `,
                                        }}
                                    >
                                        {/* On-hover: lighter wash bleeds in from top */}
                                        <div
                                            className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                            style={{ background: 'linear-gradient(145deg, rgba(253,248,240,0.22) 0%, rgba(240,228,210,0.14) 50%, rgba(230,216,200,0.06) 100%)' }}
                                        />

                                        {/* Paper texture — very faint on dark */}
                                        <div
                                            className="absolute inset-0 pointer-events-none rounded-2xl"
                                            style={{
                                                backgroundImage: 'url("/paper-texture.png")',
                                                backgroundSize: 'cover',
                                                backgroundPosition: 'center',
                                                opacity: 0.04,
                                                mixBlendMode: 'screen',
                                            }}
                                        />

                                        <div className="relative z-10 flex flex-col h-full">
                                            <div className="mb-4">
                                                <span className="text-[#c4a482]/60 font-mono text-sm font-bold tracking-widest">{item.id}</span>
                                            </div>
                                            <div className="mb-6">
                                                <Icon className="w-8 h-8 text-[#c4a482] stroke-[1.5]" />
                                            </div>
                                            <h3 className="text-2xl font-cormorant font-bold text-[#fdf8f0] mb-3">
                                                {item.title}
                                            </h3>
                                            <p className="text-[#e6d8c8]/55 leading-relaxed font-medium text-sm mb-auto">
                                                {item.desc}
                                            </p>

                                            <div className="mt-6">
                                                <span
                                                    className="inline-block text-[10px] font-bold tracking-[0.1em] text-[#c4a482]/60 uppercase px-3 py-1.5 rounded-sm border border-[#c4a482]/15"
                                                    style={{ background: 'rgba(196,164,130,0.10)' }}
                                                >
                                                    {item.lane}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            )
                        })}
                    </CardSwap>
                </div>
                </div>
            </div>
        </section>
    )
}
