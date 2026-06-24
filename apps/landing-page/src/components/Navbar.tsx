"use client";
import Link from "next/link";
import GlassSurface from "./GlassSurface";

export default function Navbar() {
  return (
    <div className="fixed top-4 left-0 right-0 z-50 flex justify-center px-6 pointer-events-none">
      <nav className="pointer-events-auto w-full max-w-4xl">
        <GlassSurface
          width="100%"
          height={60}
          borderRadius={40}
          brightness={62}
          opacity={0.88}
          blur={9}
          displace={0}
          distortionScale={-120}
          redOffset={0}
          greenOffset={8}
          blueOffset={16}
          backgroundOpacity={0.88}
          saturation={1.3}
          mixBlendMode="difference"
          style={{
            /* Force a cream background that overrides the SVG filter bleed-through */
            background: 'rgba(253, 248, 240, 0.88)',
            boxShadow: '0 8px 32px rgba(139,90,51,0.1), 0 2px 8px rgba(44,26,18,0.06), 0 0 0 1px rgba(196,164,130,0.2)',
          }}
        >
          <div className="w-full flex items-center justify-between px-6">
            {/* Logo */}
            <Link
              href="/"
              className="font-zaslia text-2xl font-medium tracking-tight text-[#2c1a12]"
              style={{ textShadow: '0 1px 3px rgba(253,248,240,0.8)' }}
            >
              Lex8
            </Link>

            {/* Nav links */}
            <div className="hidden md:flex items-center gap-7 text-sm font-medium">
              {[
                { label: 'Product', href: '/product' },
                { label: 'Solutions', href: '/solutions' },
                { label: 'Pricing', href: '/pricing' },
                { label: 'Security', href: '/security' },
                { label: 'About', href: '/about' }
              ].map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-[#2c1a12]/70 hover:text-[#8b5a33] transition-colors"
                  style={{ textShadow: '0 1px 4px rgba(253,248,240,0.9)' }}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* CTA */}
            <div className="flex items-center gap-3">
              <a
                href={`${process.env.NEXT_PUBLIC_WEB_APP_URL ?? "http://localhost:3001"}/dashboard`}
                className="hidden md:block px-4 py-2 text-sm font-medium text-[#2c1a12] hover:bg-[#e6d8c8]/50 rounded-full transition-colors"
                style={{ textShadow: '0 1px 3px rgba(253,248,240,0.8)' }}
              >
                Sign In
              </a>
              <button className="px-4 py-2 bg-[#8b5a33] text-[#fdf8f0] text-sm font-medium rounded-full hover:bg-[#a67b5b] transition-colors shadow-sm">
                Get Started
              </button>
            </div>
          </div>
        </GlassSurface>
      </nav>
    </div>
  );
}
