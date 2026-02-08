import { HeroSection } from "~~/components/landing/HeroSection";
import { ProblemSection } from "~~/components/landing/ProblemSection";
import { SolutionSection } from "~~/components/landing/SolutionSection";
import { HowItWorks } from "~~/components/landing/HowItWorks";
import { TechShowcase } from "~~/components/landing/TechShowcase";
import { FinalCTA } from "~~/components/landing/FinalCTA";

export default function Home() {
  return (
    <>
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <HowItWorks />
      <TechShowcase />
      <FinalCTA />
    </>
  );
}
