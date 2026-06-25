import type { Metadata } from 'next';
import { Inter, Cormorant_Upright, Geist } from "next/font/google";
import localFont from 'next/font/local';
import Providers from '../components/providers';
import { cn } from '../lib/utils';
import './globals.css';

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
});

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
  src: "./fonts/Zaslia.otf",
  variable: "--font-zaslia-custom",
});

export const metadata: Metadata = {
  title: 'Lex8 | Institutional AI Litigation Platform',
  description: 'The Defensible Legal AI Platform & Drafting Workspace.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn(inter.variable, zaslia.variable, cormorant.variable, "font-sans", geist.variable, geistMono.variable)}>
      <body className={cn(inter.className, "antialiased bg-noise")}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}

