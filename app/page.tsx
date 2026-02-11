import { FinalCta } from "@/components/landing/final-cta";
import { LandingFooter } from "@/components/landing/footer";
import { FaqSection } from "@/components/landing/faq";
import { LandingHero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { LandingNavbar } from "@/components/landing/navbar";
import { PricingPreview } from "@/components/landing/pricing-preview";
import { ProblemStatement } from "@/components/landing/problem-statement";
import { SocialProof } from "@/components/landing/social-proof";
import { SolutionShowcase } from "@/components/landing/solution-showcase";
import { FloatingParticles } from "@/components/shared/floating-particles";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <FloatingParticles />
      <LandingNavbar />
      <main className="relative z-10">
        <LandingHero />
        <ProblemStatement />
        <SolutionShowcase />
        <HowItWorks />
        <SocialProof />
        <PricingPreview />
        <FaqSection />
        <FinalCta />
      </main>
      <LandingFooter />
    </div>
  );
}
