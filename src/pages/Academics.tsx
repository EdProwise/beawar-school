import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Link } from "react-router-dom";
import { 
  Book, Microscope, Palette, Calculator, CheckCircle, ArrowRight, 
  Users, Award, Clock, Target, Baby, GraduationCap, Lightbulb, BookOpen, Loader2 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormattedContent } from "@/components/ui/formatted-content";
import { useAcademicPrograms, useSiteSettings, useAcademicExcellence } from "@/hooks/use-school-data";

const iconMap: Record<string, React.ElementType> = {
  Baby, BookOpen, GraduationCap, Award, Lightbulb, Users, Palette, Book, Microscope, Calculator, Clock, Target
};

const cardStyles = [
  {
    light: "bg-indigo-50/50",
    iconBg: "bg-indigo-100",
    iconText: "text-indigo-600",
    border: "border-indigo-100",
    hoverBorder: "group-hover:border-indigo-300",
    shadow: "hover:shadow-indigo-500/10",
    gradient: "from-indigo-500/20 to-transparent"
  },
  {
    light: "bg-rose-50/50",
    iconBg: "bg-rose-100",
    iconText: "text-rose-600",
    border: "border-rose-100",
    hoverBorder: "group-hover:border-rose-300",
    shadow: "hover:shadow-rose-500/10",
    gradient: "from-rose-500/20 to-transparent"
  },
  {
    light: "bg-amber-50/50",
    iconBg: "bg-amber-100",
    iconText: "text-amber-600",
    border: "border-amber-100",
    hoverBorder: "group-hover:border-amber-300",
    shadow: "hover:shadow-amber-500/10",
    gradient: "from-amber-500/20 to-transparent"
  },
  {
    light: "bg-emerald-50/50",
    iconBg: "bg-emerald-100",
    iconText: "text-emerald-600",
    border: "border-emerald-100",
    hoverBorder: "group-hover:border-emerald-300",
    shadow: "hover:shadow-emerald-500/10",
    gradient: "from-emerald-500/20 to-transparent"
  },
  {
    light: "bg-purple-50/50",
    iconBg: "bg-purple-100",
    iconText: "text-purple-600",
    border: "border-purple-100",
    hoverBorder: "group-hover:border-purple-300",
    shadow: "hover:shadow-purple-500/10",
    gradient: "from-purple-500/20 to-transparent"
  },
  {
    light: "bg-sky-50/50",
    iconBg: "bg-sky-100",
    iconText: "text-sky-600",
    border: "border-sky-100",
    hoverBorder: "group-hover:border-sky-300",
    shadow: "hover:shadow-sky-500/10",
    gradient: "from-sky-500/20 to-transparent"
  }
];

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

    const schoolName = settings?.school_name || "PRJ GyanJaya";
    const displayPrograms = programs.length > 0 ? programs : defaultPrograms;
    const displayExcellence = excellenceHighlights.length > 0 ? excellenceHighlights : features.map((f, i) => ({
      id: `feature-${i}`,
      title: f.title,
      description: f.description,
      icon_name: f.title.includes("Class") ? "Users" : f.title.includes("Faculty") ? "Award" : f.title.includes("Hours") ? "Clock" : "Target"
    }));

    return (

    <div className="min-h-screen bg-white">
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

        {/* Features */}
        <section className="py-20 bg-white">
          <div className="container">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="inline-block px-4 py-2 bg-accent-light text-accent-dark rounded-full text-sm font-medium mb-4">
                Why Choose Us
              </span>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
                Academic Excellence at {schoolName}
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {displayExcellence.map((feature, index) => {
                const IconComponent = iconMap[feature.icon_name || "Award"] || Award;
                const style = cardStyles[index % cardStyles.length];
                return (
                  <div 
                    key={feature.id} 
                    className={`group p-8 rounded-[2rem] bg-card border border-border hover:border-transparent ${style.shadow} transition-all duration-500 hover:-translate-y-2 relative overflow-hidden`}
                  >
                    {/* Hover Gradient Overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${style.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                    
                    <div className="relative z-10">
                      <div className={`w-14 h-14 rounded-2xl ${style.iconBg} flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-sm`}>
                        <IconComponent className={`w-7 h-7 ${style.iconText}`} />
                      </div>
                        <h3 className="font-heading text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">{feature.title}</h3>
                        <FormattedContent 
                          content={feature.description || ""} 
                          className="text-muted-foreground leading-relaxed text-sm prose-p:mb-0" 
                        />
                      </div>

                    {/* Bottom Accent Line */}
                    <div className={`absolute bottom-0 left-0 h-1.5 w-0 bg-gradient-to-r ${style.gradient.replace('/20', '')} transition-all duration-500 group-hover:w-full`} />
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Programs */}
        <section className="py-20 bg-white">
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
                        className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center"
                      >
                        <div className={`relative z-10 min-w-0 ${isEven ? '' : 'lg:order-2'}`}>
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-12 h-12 rounded-xl bg-primary-light flex items-center justify-center">
                            <IconComponent className="w-6 h-6 text-primary" />
                          </div>
                          <span className="text-accent font-medium">{program.subtitle || program.grade_range}</span>
                        </div>
                            <h3 className="font-heading text-3xl font-bold text-foreground mb-4 text-balance">
                              {program.title}
                            </h3>
                            <div className="mb-6">
                              <FormattedContent 
                                content={program.description || ""} 
                                className="prose-p:text-muted-foreground break-words"
                              />
                            </div>

                          <Button asChild>
                          <Link to="/admissions/process">
                            Apply for {program.title}
                            <ArrowRight className="w-4 h-4" />
                          </Link>
                        </Button>
                      </div>
                      <div className={`min-w-0 ${isEven ? '' : 'lg:order-1'}`}>
                        <div className="relative">
                          <img 
                            src={program.image_url || "/classroom.png"} 
                            alt={program.title}
                            className="rounded-2xl shadow-strong w-full object-cover"
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
                <Link to="/admissions/process">Apply Now</Link>
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
