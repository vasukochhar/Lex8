import type { Metadata } from "next";
import { Inter, Cormorant_Upright, Geist } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const cormorant = Cormorant_Upright({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-cormorant-custom",
});

const zaslia = localFont({
  src: "../fonts/Zaslia.otf",
  variable: "--font-zaslia-custom",
});

export const metadata: Metadata = {
  title: "Lex8 | The Defensible Legal AI Platform",
  description: "Every citation verified. Every action governed. Every output you would file in court.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn(inter.variable, zaslia.variable, cormorant.variable, "font-sans", geist.variable)}>
      <body className={`${inter.className} antialiased bg-noise`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
