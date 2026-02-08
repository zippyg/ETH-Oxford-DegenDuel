import { HeroSection } from "~~/components/landing/HeroSection";
import { HowItWorks } from "~~/components/landing/HowItWorks";
import { TechShowcase } from "~~/components/landing/TechShowcase";

export default function Home() {
  return (
    <>
      <HeroSection />
      <HowItWorks />
      <TechShowcase />
    </>
  );
}
