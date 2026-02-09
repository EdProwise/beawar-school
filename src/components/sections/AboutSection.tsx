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
    <section className="py-12 sm:py-16 md:py-20 lg:py-28 bg-background relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-accent/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="container relative">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-start mb-8 sm:mb-16">
          {/* Left Content */}
            <div>
              <span className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 bg-primary-light text-primary rounded-full text-xs sm:text-sm font-medium mb-3 sm:mb-4">
                {about?.section_title || "About Us"}
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 sm:mb-6">
                {about?.main_heading || "Welcome to Our School"}
              </h2>
              <div className="mb-6 sm:mb-8">
                  <FormattedContent 
                    content={
                      about?.main_description 
                        ? (() => {
                            const text = about.main_description;
                            const isHtml = /<[a-z][\s\S]*>/i.test(text);
                              if (isHtml) {
                                const paragraphs = text.split(/<\/p>/i).map(p => p.trim() ? p + "</p>" : "");
                                return paragraphs.slice(0, 10).join("");
                              }
                              return text.split('\n').slice(0, 10).join('\n');
                          })()
                        : "We provide quality education for all students."
                    } 
                    className="text-sm sm:text-lg text-muted-foreground break-words"
                  />
              </div>

              <Button variant="default" size="lg" asChild>
                <Link to="/about-us">
                  Know More
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </div>

            {/* Right Content - Highlight Cards */}
          <div className="relative">
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {highlights.length > 0 ? (
                  highlights.map((card, index) => {
                    const IconComponent = iconMap[card.icon_name || "Star"] || Star;
                    return (
                      <div
                        key={card.id}
                        className={`p-4 sm:p-6 rounded-2xl border border-border bg-card hover:shadow-medium transition-all duration-300 ${
                          index === 0 ? "sm:translate-y-8" : ""
                        }`}
                      >
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-accent-light flex items-center justify-center mb-3 sm:mb-4">
                          <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-accent-dark" />
                        </div>
                        <h3 className="font-heading font-semibold text-foreground mb-1 sm:mb-2 text-sm sm:text-base">
                          {card.title}
                        </h3>
                        <p className="text-muted-foreground text-xs sm:text-sm break-words">
                          {card.description}
                        </p>
                      </div>
                  );
                })
              ) : (
                // Fallback cards
                <>
                    <div className="p-4 sm:p-6 rounded-2xl border border-border bg-card sm:translate-y-8">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-accent-light flex items-center justify-center mb-3 sm:mb-4">
                        <Users className="w-5 h-5 sm:w-6 sm:h-6 text-accent-dark" />
                      </div>
                      <h3 className="font-heading font-semibold text-foreground mb-1 sm:mb-2 text-sm sm:text-base">Expert Faculty</h3>
                      <p className="text-muted-foreground text-xs sm:text-sm">Experienced teachers dedicated to student success</p>
                    </div>
                    <div className="p-4 sm:p-6 rounded-2xl border border-border bg-card">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary-light flex items-center justify-center mb-3 sm:mb-4">
                        <Building className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                      </div>
                      <h3 className="font-heading font-semibold text-foreground mb-1 sm:mb-2 text-sm sm:text-base">Modern Facilities</h3>
                      <p className="text-muted-foreground text-xs sm:text-sm">State-of-the-art infrastructure</p>
                    </div>
                    <div className="p-4 sm:p-6 rounded-2xl border border-border bg-card">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary-light flex items-center justify-center mb-3 sm:mb-4">
                        <Award className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                      </div>
                      <h3 className="font-heading font-semibold text-foreground mb-1 sm:mb-2 text-sm sm:text-base">Holistic Development</h3>
                      <p className="text-muted-foreground text-xs sm:text-sm">Focus on academics, sports, and arts</p>
                    </div>
                    <div className="p-4 sm:p-6 rounded-2xl border border-border bg-card sm:translate-y-8">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-accent-light flex items-center justify-center mb-3 sm:mb-4">
                        <Globe className="w-5 h-5 sm:w-6 sm:h-6 text-accent-dark" />
                      </div>
                      <h3 className="font-heading font-semibold text-foreground mb-1 sm:mb-2 text-sm sm:text-base">Global Standards</h3>
                      <p className="text-muted-foreground text-xs sm:text-sm">International curriculum</p>
                    </div>
                  </>
              )}
            </div>

              {/* Years Badge */}
                {about?.years_of_excellence && (
                  <div className="mt-6 md:mt-0 md:absolute md:-bottom-4 md:-left-4 lg:-bottom-6 lg:-left-6 bg-primary text-primary-foreground p-3 sm:p-4 md:p-6 rounded-xl md:rounded-2xl shadow-strong inline-flex md:block items-center gap-2 md:gap-0">
                    <p className="font-heading text-xl sm:text-2xl md:text-4xl font-bold">{about.years_of_excellence}+</p>
                    <p className="text-primary-foreground/80 text-[10px] sm:text-xs md:text-sm">Years of Excellence</p>
                  </div>
                )}
            </div>
          </div>
        </div>
        
        <div className="mt-12">
          <CampusCTA className="rounded-none border-x-0" />
        </div>
      </section>
  );
}
