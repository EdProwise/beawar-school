import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Link } from "react-router-dom";
import { 
  Book, Microscope, Palette, Calculator, CheckCircle, ArrowRight, 
  Users, Award, Clock, Target, Baby, GraduationCap, Lightbulb, BookOpen, Loader2 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAcademicPrograms, useSiteSettings, useAcademicExcellence } from "@/hooks/use-school-data";

const iconMap: Record<string, React.ElementType> = {
  Baby, BookOpen, GraduationCap, Award, Lightbulb, Users, Palette, Book, Microscope, Calculator, Clock, Target
};

const features = [
  { icon: Users, title: "Small Class Sizes", description: "Personalized attention with optimal student-teacher ratio" },
  { icon: Award, title: "Experienced Faculty", description: "Highly qualified and passionate educators" },
  { icon: Clock, title: "Extended Hours", description: "After-school programs and tutoring available" },
  { icon: Target, title: "Outcome Focused", description: "100% board results with excellent ranks" },
];

const defaultPrograms = [
  {
    id: "pre-primary",
    icon_name: "Baby",
    title: "Pre-Primary",
    subtitle: "Ages 3-5",
    description: "Our pre-primary program provides a nurturing and stimulating environment where young learners develop foundational skills through play-based learning.",
    image_url: "/classroom.png",
  },
  {
    id: "primary",
    icon_name: "BookOpen",
    title: "Primary School",
    subtitle: "Grades 1-5",
    description: "The primary program builds a strong academic foundation while fostering curiosity, creativity, and critical thinking skills.",
    image_url: "/library.png",
  },
  {
    id: "secondary",
    icon_name: "GraduationCap",
    title: "Secondary School",
    subtitle: "Grades 6-10",
    description: "Our secondary program prepares students for board examinations with rigorous academics and co-curricular activities.",
    image_url: "/science_lab.png",
  },
  {
    id: "higher-secondary",
    icon_name: "Award",
    title: "Higher Secondary",
    subtitle: "Grades 11-12",
    description: "Specialized streams with expert faculty preparing students for competitive exams and higher education.",
    image_url: "/classroom.png",
  },
];

  const Academics = () => {
    const { data: settings } = useSiteSettings();
    const { data: programs = [], isLoading } = useAcademicPrograms();
    const { data: excellenceHighlights = [], isLoading: isLoadingExcellence } = useAcademicExcellence();

    const schoolName = settings?.school_name || "Orbit School";
    const displayPrograms = programs.length > 0 ? programs : defaultPrograms;
    const displayExcellence = excellenceHighlights.length > 0 ? excellenceHighlights : features.map((f, i) => ({
      id: `feature-${i}`,
      title: f.title,
      description: f.description,
      icon_name: f.title.includes("Class") ? "Users" : f.title.includes("Faculty") ? "Award" : f.title.includes("Hours") ? "Clock" : "Target"
    }));

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
              Academics
            </span>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6">
              Academic Excellence
            </h1>
            <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">
              Discover our comprehensive curriculum designed to nurture every student's potential from pre-primary to higher secondary.
            </p>
          </div>
        </section>

        {/* Programs */}
        <section className="py-20 bg-background">
          <div className="container">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="inline-block px-4 py-2 bg-primary-light text-primary rounded-full text-sm font-medium mb-4">
                Our Programs
              </span>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
                Academic Programs for All Ages
              </h2>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="space-y-16">
                {displayPrograms.map((program, index) => {
                  const IconComponent = iconMap[program.icon_name || "BookOpen"] || BookOpen;
                  const isEven = index % 2 === 0;

                  return (
                      <div 
                        key={program.id} 
                        id={program.title.toLowerCase().replace(/\s+/g, '-')}
                        className={`grid lg:grid-cols-2 gap-12 lg:gap-20 items-center ${isEven ? '' : 'lg:flex-row-reverse'}`}
                      >
                        <div className={`relative z-10 ${isEven ? '' : 'lg:order-2'}`}>
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-12 h-12 rounded-xl bg-primary-light flex items-center justify-center">
                            <IconComponent className="w-6 h-6 text-primary" />
                          </div>
                          <span className="text-accent font-medium">{program.subtitle || program.grade_range}</span>
                        </div>
                          <h3 className="font-heading text-3xl font-bold text-foreground mb-4 text-balance">
                            {program.title}
                          </h3>
                              <div className="prose prose-slate max-w-none prose-p:text-muted-foreground mb-6 leading-relaxed break-words whitespace-normal">
                                {program.description ? (
                                  <div dangerouslySetInnerHTML={{ __html: program.description }} />
                                ) : null}
                              </div>

                        <Button asChild>
                          <Link to="/admissions">
                            Apply for {program.title}
                            <ArrowRight className="w-4 h-4" />
                          </Link>
                        </Button>
                      </div>
                      <div className={isEven ? '' : 'lg:order-1'}>
                        <div className="relative">
                          <img 
                            src={program.image_url || "/classroom.png"} 
                            alt={program.title}
                            className="rounded-2xl shadow-strong w-full"
                          />
                          <div className="absolute -bottom-4 -right-4 bg-accent px-6 py-3 rounded-xl shadow-strong">
                            <p className="text-accent-foreground font-semibold">{program.subtitle || program.grade_range}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* Features */}
        <section className="py-20 bg-secondary/50">
          <div className="container">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="inline-block px-4 py-2 bg-accent-light text-accent-dark rounded-full text-sm font-medium mb-4">
                Why Choose Us
              </span>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
                Academic Excellence at {schoolName}
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {displayExcellence.map((feature) => {
                const IconComponent = iconMap[feature.icon_name || "Award"] || Award;
                return (
                  <div key={feature.id} className="bg-card p-6 rounded-2xl border border-border text-center hover:shadow-medium transition-all">
                    <div className="w-14 h-14 rounded-full bg-primary-light flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="font-heading font-semibold text-foreground mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm">{feature.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-primary relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.2),transparent_50%)]" />
          </div>
          <div className="container relative text-center">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
              Ready to Start Your Academic Journey?
            </h2>
            <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
              Join {schoolName} and experience world-class education that prepares students for success.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button variant="hero-gold" size="lg" asChild>
                <Link to="/admissions">Apply Now</Link>
              </Button>
              <Button variant="hero" size="lg" asChild>
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Academics;
