"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const frameCount = 240;

const currentFrame = (index: number) =>
  `/frames/ezgif-frame-${(index + 1).toString().padStart(3, "0")}.jpg`;

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    // Set canvas dimensions
    canvas.width = 1152;
    canvas.height = 864;

    const images: HTMLImageElement[] = [];
    const airpods = { frame: 0 };

    for (let i = 0; i < frameCount; i++) {
      const img = new Image();
      img.src = currentFrame(i);
      images.push(img);
    }

    images[0].onload = render;

    function render() {
      if (images[airpods.frame]) {
        context?.clearRect(0, 0, canvas!.width, canvas!.height);
        // Cover logic to maintain aspect ratio could be applied, 
        // but drawing full dimensions is fine for exact dimensions
        context?.drawImage(images[airpods.frame], 0, 0, canvas!.width, canvas!.height);
      }
    }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "+=3000",
        scrub: 0.5,
        pin: true,
      },
    });

    tl.to(airpods, {
      frame: frameCount - 1,
      snap: "frame",
      ease: "none",
      onUpdate: render,
    });

    // Content fade up animations
    gsap.fromTo(
      contentRef.current!.children,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: "power3.out", delay: 0.2 }
    );

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <section ref={containerRef} className="relative h-screen w-full flex overflow-hidden bg-[#fdf8f0]">
      {/* Background Canvas */}
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
        <canvas
          ref={canvasRef}
          className="w-full h-full object-cover mix-blend-multiply opacity-75"
        />
        {/* Gradient overlay to ensure text remains readable */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#fdf8f0] via-[#fdf8f0]/70 to-transparent pointer-events-none" />
      </div>
      
      <div className="w-full max-w-7xl mx-auto flex flex-col justify-center h-full px-6 lg:px-12 relative z-10">
        {/* Content */}
        <div ref={contentRef} className="w-full lg:w-3/4 flex flex-col justify-center h-full pt-20 lg:pt-0">
          <h1 className="text-5xl lg:text-7xl font-zaslia tracking-normal text-[#2c1a12] leading-[1.1] mb-6 drop-shadow-sm [word-spacing:0.2em]">
            The Defensible Legal <br /> AI Platform.
          </h1>
          <p className="text-2xl lg:text-3xl font-cormorant text-[#8b5a33] mb-10 max-w-2xl leading-relaxed italic">
            Every citation verified. Every action governed. Every output you would confidently file in court.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <button className="px-8 py-4 bg-brand text-[#fdf8f0] rounded-full font-medium hover:bg-brand-light transition-colors shadow-xl shadow-brand/20">
              Deploy Lex8
            </button>
            <button className="px-8 py-4 bg-white/80 backdrop-blur-md text-[#2c1a12] rounded-full font-medium border border-[#e6d8c8] hover:border-brand/50 transition-colors">
              Read the Whitepaper
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
