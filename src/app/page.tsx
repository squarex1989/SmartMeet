import { LandingNav } from "@/components/landing/LandingNav";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { FooterCta } from "@/components/landing/FooterCta";
import { Footer } from "@/components/landing/Footer";

export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-hidden" data-theme="landing">
      {/* Aurora gradient background */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
        <div
          className="absolute h-[600px] w-[800px] rounded-full opacity-100 blur-[120px] animate-aurora-1"
          style={{
            top: "10%",
            left: "15%",
            background: "var(--aurora-1)",
          }}
        />
        <div
          className="absolute h-[500px] w-[600px] rounded-full opacity-100 blur-[100px] animate-aurora-2"
          style={{
            bottom: "15%",
            right: "10%",
            background: "var(--aurora-2)",
          }}
        />
        <div
          className="absolute h-[400px] w-[500px] rounded-full opacity-100 blur-[90px] animate-aurora-3"
          style={{
            top: "5%",
            right: "30%",
            background: "var(--aurora-3)",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <LandingNav />
        <main>
          <Hero />
          <Features />
          <HowItWorks />
          <FooterCta />
          <Footer />
        </main>
      </div>
    </div>
  );
}
