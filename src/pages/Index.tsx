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
import { HomepagePopup } from "@/components/sections/HomepagePopup";
import SEOHead, { buildOrganizationSchema } from "@/components/SEOHead";
import { useSiteSettings } from "@/hooks/use-school-data";

const Index = () => {
  const { data: settings } = useSiteSettings();
  const schoolName = settings?.school_name || "";
  const siteUrl = settings?.site_url || "";

  return (
    <div className="min-h-screen">
      <SEOHead
        title={schoolName}
        description={`Welcome to ${schoolName} — a leading school in Beawar, Rajasthan offering quality education from Nursery to Class 12. Admissions open.`}
        keywords={`${schoolName}, school in Beawar, Beawar school, Rajasthan school, CBSE school Beawar, admissions open`}
        jsonLd={buildOrganizationSchema(schoolName, siteUrl, settings?.phone, settings?.email, settings?.address, settings?.logo_url, undefined, settings?.city ?? undefined, settings?.state ?? undefined)}
      />
      <HomepagePopup />
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
