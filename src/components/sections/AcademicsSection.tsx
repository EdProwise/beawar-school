import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, GraduationCap, Award, Baby, Lightbulb, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormattedContent } from "@/components/ui/formatted-content";
import { useAcademicPrograms } from "@/hooks/use-school-data";

const iconMap: Record<string, React.ElementType> = {
  BookOpen, GraduationCap, Award, Baby, Lightbulb, Users
};

export function AcademicsSection() {
  const { data: programs = [], isLoading } = useAcademicPrograms();

  if (!isLoading && programs.length === 0) return null;

  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-28 bg-secondary/50 relative overflow-hidden">
      {/* Background */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />

      <div className="container relative">
        {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 lg:mb-16">
          <span className="inline-block px-4 py-2 bg-primary-light text-primary rounded-full text-sm font-medium mb-4">
            Academics
          </span>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Our <span className="text-gradient-primary">Academic Programs</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Comprehensive curriculum designed to nurture every student's potential
          </p>
        </div>

        {/* Programs Grid */}
        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-card rounded-2xl p-6 animate-pulse">
                <div className="w-14 h-14 bg-secondary rounded-xl mb-4" />
                <div className="h-6 bg-secondary rounded w-3/4 mb-2" />
                <div className="h-4 bg-secondary rounded w-1/2 mb-4" />
                <div className="h-16 bg-secondary rounded" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {programs.map((program) => {
                const IconComponent = iconMap[program.icon_name || "BookOpen"] || BookOpen;
                // Get only first paragraph
                const firstParagraph = (program.description || "").split(/\n+/).filter(p => p.trim())[0] || "";
                
                return (
                  <div
                    key={program.id}
                    className="group bg-card rounded-2xl border border-border hover:border-primary hover:shadow-strong transition-all duration-300 flex flex-col overflow-hidden"
                  >
                    {/* Image Section */}
                    <div className="relative h-48 w-full overflow-hidden">
                      <img 
                        src={program.image_url || `https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=800&auto=format&fit=crop`} 
                        alt={program.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute top-4 left-4 w-10 h-10 rounded-lg bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm">
                        <IconComponent className="w-5 h-5 text-primary" />
                      </div>
                    </div>

                    <div className="p-6 flex flex-col flex-grow">
                      <h3 className="font-heading text-xl font-semibold text-foreground mb-1">
                        {program.title}
                      </h3>
                      {program.subtitle && (
                        <p className="text-accent font-medium text-sm mb-3">
                          {program.subtitle}
                        </p>
                      )}
                      <div className="flex-grow">
                        <FormattedContent content={firstParagraph} className="text-sm line-clamp-3" />
                      </div>
                      <Link
                        to="/academics"
                        className="inline-flex items-center gap-1 text-sm font-medium text-primary mt-4"
                      >
                        Learn More <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                );
              })}
          </div>
        )}

        {/* CTA */}
        <div className="text-center mt-12">
          <Button variant="default" size="lg" asChild>
            <Link to="/academics">
              View Full Curriculum
              <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
