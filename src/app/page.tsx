import { LandingNav } from "@/components/landing/LandingNav";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { FooterCta } from "@/components/landing/FooterCta";
import { Footer } from "@/components/landing/Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#EDEDED]">
      <LandingNav />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <FooterCta />
        <Footer />
      </main>
    </div>
  );
}
