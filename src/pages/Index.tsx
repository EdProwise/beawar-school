import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/sections/HeroSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { StatsSection } from "@/components/sections/StatsSection";
import { AcademicsSection } from "@/components/sections/AcademicsSection";
import { FacilitiesSection } from "@/components/sections/FacilitiesSection";
import { ResultsSection } from "@/components/sections/ResultsSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { NewsSection } from "@/components/sections/NewsSection";
import { ContactCTASection } from "@/components/sections/ContactCTASection";
import { AladdinLamp } from "@/components/sections/AladdinLamp";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <AladdinLamp />
      <main>
        <HeroSection />
        <AboutSection />
        <StatsSection />
        <AcademicsSection />
        <FacilitiesSection />
        <ResultsSection />
        <TestimonialsSection />
        <NewsSection />
        <ContactCTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
