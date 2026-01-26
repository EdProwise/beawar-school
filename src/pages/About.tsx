import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Link } from "react-router-dom";
import { Award, Target, Eye, Users, Heart, GraduationCap, CheckCircle, Loader2, Star, Shield, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAboutContent, useHighlightCards, useSiteSettings, useCoreValues } from "@/hooks/use-school-data";

const iconMap: Record<string, any> = {
  Award,
  Heart,
  Users,
  GraduationCap,
  Star,
  Shield,
  Target,
  Lightbulb,
};

const defaultMilestones = [
  { year: "1995", event: "School founded with 50 students" },
  { year: "2000", event: "Expanded to include Higher Secondary" },
  { year: "2005", event: "New campus inaugurated with modern facilities" },
  { year: "2010", event: "Achieved 100% board results" },
  { year: "2015", event: "Introduced digital learning initiatives" },
  { year: "2020", event: "Ranked among top 10 schools in the region" },
];

const About = () => {
  const { data: settings } = useSiteSettings();
  const { data: about, isLoading: aboutLoading } = useAboutContent();
  const { data: highlights = [] } = useHighlightCards();
  const { data: coreValues = [] } = useCoreValues();

  const schoolName = settings?.school_name || "Orbit School";
  const yearsOfExcellence = about?.years_of_excellence || 25;
  const foundingYear = new Date().getFullYear() - yearsOfExcellence;

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero */}
        <section className="pt-32 pb-20 bg-gradient-to-b from-primary to-primary-dark relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.2),transparent_50%)]" />
          </div>
          <div className="container relative text-center">
            <span className="inline-block px-4 py-2 bg-primary-foreground/10 text-primary-foreground rounded-full text-sm font-medium mb-4">
              About Us
            </span>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6">
              Shaping Futures Since {foundingYear}
            </h1>
            <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">
              Discover the story, mission, and values that drive {schoolName}'s commitment to excellence in education.
            </p>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-20 bg-background">
          <div className="container">
            {aboutLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <span className="inline-block px-4 py-2 bg-primary-light text-primary rounded-full text-sm font-medium mb-4">
                    Our Story
                  </span>
                  <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-6">
                    {about?.main_heading || "A Legacy of Educational Excellence"}
                  </h2>
                  <p className="text-muted-foreground mb-4">
                    {about?.main_description || `Founded in ${foundingYear} by visionary educators, ${schoolName} began with a simple mission: to provide world-class education that empowers students to reach their full potential.`}
                  </p>
                  {about?.history_text && (
                    <p className="text-muted-foreground mb-6">{about.history_text}</p>
                  )}
                  <div className="flex items-center gap-8">
                    <div>
                      <p className="font-heading text-4xl font-bold text-primary">{yearsOfExcellence}+</p>
                      <p className="text-muted-foreground text-sm">Years of Excellence</p>
                    </div>
                    <div>
                      <p className="font-heading text-4xl font-bold text-accent-dark">1500+</p>
                      <p className="text-muted-foreground text-sm">Students Enrolled</p>
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <img 
                    src={about?.main_image_url || "/hero_campus.png"} 
                    alt={schoolName}
                    className="rounded-2xl shadow-strong"
                  />
                  <div className="absolute -bottom-6 -left-6 bg-accent p-6 rounded-xl shadow-strong">
                    <p className="text-accent-foreground font-heading text-xl font-bold">Since {foundingYear}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-20 bg-secondary/50">
          <div className="container">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-card p-8 rounded-2xl border border-border">
                <div className="w-14 h-14 rounded-xl bg-primary-light flex items-center justify-center mb-6">
                  <Target className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-heading text-2xl font-bold text-foreground mb-4">
                  {about?.mission_title || "Our Mission"}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {about?.mission_text || "To provide holistic education that empowers students with knowledge, skills, and values to excel in a rapidly changing world while fostering a love for lifelong learning."}
                </p>
              </div>
              <div className="bg-card p-8 rounded-2xl border border-border">
                <div className="w-14 h-14 rounded-xl bg-accent-light flex items-center justify-center mb-6">
                  <Eye className="w-7 h-7 text-accent-dark" />
                </div>
                <h3 className="font-heading text-2xl font-bold text-foreground mb-4">
                  {about?.vision_title || "Our Vision"}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {about?.vision_text || "To be a globally recognized institution that transforms education and creates leaders who make a positive impact on society through innovation and excellence."}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className="py-20 bg-background">
          <div className="container">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="inline-block px-4 py-2 bg-accent-light text-accent-dark rounded-full text-sm font-medium mb-4">
                Core Values
              </span>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
                The Pillars of Our Education
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {coreValues.map((value, index) => {
                const IconComponent = iconMap[value.icon_name || "Award"] || Award;
                return (
                  <div key={value.id} className="text-center p-6 rounded-2xl bg-card border border-border hover:shadow-medium transition-all">
                    <div className="w-16 h-16 rounded-full bg-primary-light flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="font-heading text-xl font-semibold text-foreground mb-2">{value.title}</h3>
                    <p className="text-muted-foreground text-sm">{value.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-20 bg-primary relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.2),transparent_50%)]" />
          </div>
          <div className="container relative">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
                Our Journey
              </h2>
              <p className="text-primary-foreground/80">
                Key milestones in our {yearsOfExcellence}+ years of educational excellence
              </p>
            </div>
            <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-6">
              {defaultMilestones.map((milestone, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center mx-auto mb-4">
                    <span className="font-heading font-bold text-accent-foreground">{milestone.year}</span>
                  </div>
                  <p className="text-primary-foreground/80 text-sm">{milestone.event}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        {highlights.length > 0 && (
          <section className="py-20 bg-background">
            <div className="container">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
                  Why Choose {schoolName}?
                </h2>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {highlights.map((card) => (
                  <div key={card.id} className="p-6 rounded-2xl bg-card border border-border">
                    <CheckCircle className="w-8 h-8 text-primary mb-4" />
                    <h3 className="font-heading font-semibold text-foreground mb-2">{card.title}</h3>
                    <p className="text-muted-foreground text-sm">{card.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="py-20 bg-secondary/50">
          <div className="container text-center">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-6">
              Ready to Join Our Family?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Begin your child's journey to success with {schoolName}. Apply now or schedule a campus visit.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg" asChild>
                <Link to="/admissions">Apply Now</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/contact">Schedule a Visit</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
