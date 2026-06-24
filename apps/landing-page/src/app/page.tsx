import Hero from "@/components/Hero";
import SecurityLanes from "@/components/SecurityLanes";
import Archetypes from "@/components/Archetypes";
import Provenance from "@/components/Provenance";
import Tribunal from "@/components/Tribunal";
import Comparison from "@/components/Comparison";
import ComplianceBanner from "@/components/ComplianceBanner";
import Ledger from "@/components/Ledger";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-background relative">
      <Hero />
      <SecurityLanes />
      <Archetypes />
      <Provenance />
      <Tribunal />
      <Comparison />
      <ComplianceBanner />
      <Ledger />
      <FinalCTA />
      <Footer />
    </main>
  );
}
