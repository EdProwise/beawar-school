import { Link } from "react-router-dom";
import { ArrowRight, Award, Users, Globe, Building, Star, Target, Heart, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormattedContent } from "@/components/ui/formatted-content";
import { useAboutContent, useHighlightCards } from "@/hooks/use-school-data";
import { CampusCTA } from "./CampusCTA";

const iconMap: Record<string, React.ElementType> = {
  Award, Users, Globe, Building, Star, Target, Heart, Lightbulb
};

export function AboutSection() {
  const { data: about } = useAboutContent();
  const { data: highlights = [] } = useHighlightCards();

  return (
    <section className="py-20 lg:py-28 bg-background relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-accent/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="container relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start mb-16">
          {/* Left Content */}
          <div>
            <span className="inline-block px-4 py-2 bg-primary-light text-primary rounded-full text-sm font-medium mb-4">
              {about?.section_title || "About Us"}
            </span>
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              {about?.main_heading || "Welcome to Our School"}
            </h2>
            <div className="mb-8">
              <FormattedContent 
                content={
                  about?.main_description 
                    ? about.main_description.split('\n').filter(p => p.trim()).slice(0, 1).join('\n')
                    : "We provide quality education for all students."
                } 
                className="text-lg text-muted-foreground"
              />
            </div>

            <Button variant="default" size="lg" asChild>
              <Link to="/about">
                Know More
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>

          {/* Right Content - Highlight Cards */}
          <div className="relative">
            <div className="grid sm:grid-cols-2 gap-4">
              {highlights.length > 0 ? (
                highlights.map((card, index) => {
                  const IconComponent = iconMap[card.icon_name || "Star"] || Star;
                  return (
                    <div
                      key={card.id}
                      className={`p-6 rounded-2xl border border-border bg-card hover:shadow-medium transition-all duration-300 ${
                        index === 0 ? "sm:translate-y-8" : ""
                      }`}
                    >
                      <div className="w-12 h-12 rounded-xl bg-accent-light flex items-center justify-center mb-4">
                        <IconComponent className="w-6 h-6 text-accent-dark" />
                      </div>
                      <h3 className="font-heading font-semibold text-foreground mb-2">
                        {card.title}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        {card.description}
                      </p>
                    </div>
                  );
                })
              ) : (
                // Fallback cards
                <>
                  <div className="p-6 rounded-2xl border border-border bg-card sm:translate-y-8">
                    <div className="w-12 h-12 rounded-xl bg-accent-light flex items-center justify-center mb-4">
                      <Users className="w-6 h-6 text-accent-dark" />
                    </div>
                    <h3 className="font-heading font-semibold text-foreground mb-2">Expert Faculty</h3>
                    <p className="text-muted-foreground text-sm">Experienced teachers dedicated to student success</p>
                  </div>
                  <div className="p-6 rounded-2xl border border-border bg-card">
                    <div className="w-12 h-12 rounded-xl bg-primary-light flex items-center justify-center mb-4">
                      <Building className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-heading font-semibold text-foreground mb-2">Modern Facilities</h3>
                    <p className="text-muted-foreground text-sm">State-of-the-art infrastructure</p>
                  </div>
                  <div className="p-6 rounded-2xl border border-border bg-card">
                    <div className="w-12 h-12 rounded-xl bg-primary-light flex items-center justify-center mb-4">
                      <Award className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-heading font-semibold text-foreground mb-2">Holistic Development</h3>
                    <p className="text-muted-foreground text-sm">Focus on academics, sports, and arts</p>
                  </div>
                  <div className="p-6 rounded-2xl border border-border bg-card sm:translate-y-8">
                    <div className="w-12 h-12 rounded-xl bg-accent-light flex items-center justify-center mb-4">
                      <Globe className="w-6 h-6 text-accent-dark" />
                    </div>
                    <h3 className="font-heading font-semibold text-foreground mb-2">Global Standards</h3>
                    <p className="text-muted-foreground text-sm">International curriculum</p>
                  </div>
                </>
              )}
            </div>

            {/* Years Badge */}
            {about?.years_of_excellence && (
              <div className="absolute -bottom-6 -left-6 lg:-left-12 bg-primary text-primary-foreground p-6 rounded-2xl shadow-strong">
                <p className="font-heading text-4xl font-bold">{about.years_of_excellence}+</p>
                <p className="text-primary-foreground/80 text-sm">Years of Excellence</p>
              </div>
            )}
          </div>
        </div>

        <CampusCTA />

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 mt-12">
          {about?.mission_text && (
            <div className="flex gap-4 p-8 rounded-3xl bg-accent-light/30 border border-accent/10">
              <div className="w-14 h-14 rounded-2xl bg-accent-light flex items-center justify-center shrink-0">
                <Target className="w-7 h-7 text-accent-dark" />
              </div>
              <div>
                <h3 className="font-heading text-xl font-semibold text-foreground mb-2">
                  {about?.mission_title || "Our Mission"}
                </h3>
                <FormattedContent content={about.mission_text} className="text-muted-foreground" />
              </div>
            </div>
          )}
          {about?.vision_text && (
            <div className="flex gap-4 p-8 rounded-3xl bg-primary-light/30 border border-primary/10">
              <div className="w-14 h-14 rounded-2xl bg-primary-light flex items-center justify-center shrink-0">
                <Lightbulb className="w-7 h-7 text-primary" />
              </div>
              <div>
                <h3 className="font-heading text-xl font-semibold text-foreground mb-2">
                  {about?.vision_title || "Our Vision"}
                </h3>
                <FormattedContent content={about.vision_text} className="text-muted-foreground" />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
