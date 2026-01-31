import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { 
  BookOpen, Target, Users, Heart, ArrowRight, Loader2, Award, Sparkles 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormattedContent } from "@/components/ui/formatted-content";
import { useTeachingMethods, useTeachingMethodHero, useSiteSettings } from "@/hooks/use-school-data";
import { Link } from "react-router-dom";

const iconMap: Record<string, React.ElementType> = {
  BookOpen, Target, Users, Heart, Award, Sparkles
};

export default function TeachingMethod() {
  const { data: settings } = useSiteSettings();
  const { data: heroData, isLoading: heroLoading } = useTeachingMethodHero();
  const { data: methods = [], isLoading: methodsLoading } = useTeachingMethods();

  const schoolName = settings?.school_name || "Orbit School";

  if (heroLoading || methodsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const pageTitle = heroData?.title || "Our Teaching Methodology";
  const pageDescription = heroData?.description || "Our pedagogical approach is designed to inspire curiosity and foster holistic development in every child.";
  const heroImage = heroData?.center_image || "/classroom.png";

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-20 bg-gradient-to-b from-primary to-primary-dark relative overflow-hidden text-primary-foreground">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.2),transparent_50%)]" />
          </div>
          <div className="container relative text-center">
            <span className="inline-block px-4 py-2 bg-primary-foreground/10 text-primary-foreground rounded-full text-sm font-medium mb-4 uppercase tracking-wider">
              Our Pedagogy
            </span>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              {pageTitle}
            </h1>
            <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">
              {pageDescription}
            </p>
          </div>
        </section>

        {/* Hero Image Section (Optional, based on Academic Programs Page style) */}
        <section className="py-20 bg-background border-b border-border/50">
          <div className="container">
            <div className="relative max-w-5xl mx-auto">
              <img 
                src={heroImage} 
                alt="Teaching Method" 
                className="rounded-3xl shadow-strong w-full aspect-[21/9] object-cover"
              />
              <div className="absolute -bottom-4 -right-4 bg-accent px-8 py-4 rounded-2xl shadow-strong border border-white/20 backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-accent-foreground font-bold text-lg">Innovation in Education</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Methods Section */}
        <section className="py-20 bg-background">
          <div className="container">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="inline-block px-4 py-2 bg-primary-light text-primary rounded-full text-sm font-medium mb-4">
                Our Approach
              </span>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
                How We Teach at {schoolName}
              </h2>
            </div>

            <div className="space-y-24">
              {methods.map((method, index) => {
                const isEven = index % 2 === 0;
                const IconComponent = iconMap[Object.keys(iconMap)[index % Object.keys(iconMap).length]] || BookOpen;

                return (
                  <div 
                    key={method.id} 
                    className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center"
                  >
                    <div className={`relative z-10 ${isEven ? '' : 'lg:order-2'}`}>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-primary-light flex items-center justify-center">
                          <IconComponent className="w-6 h-6 text-primary" />
                        </div>
                        <span className="text-accent font-bold uppercase tracking-wide text-sm">Method {index + 1}</span>
                      </div>
                      <h3 className="font-heading text-3xl font-bold text-foreground mb-4">
                        {method.title}
                      </h3>
                      <div className="mb-8">
                        <FormattedContent 
                          content={method.content} 
                          className="prose-p:text-muted-foreground prose-p:leading-relaxed break-words"
                        />
                      </div>
                      <Button asChild>
                        <Link to="/admissions">
                          Learn More
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                      </Button>
                    </div>
                    <div className={`${isEven ? '' : 'lg:order-1'}`}>
                      <div className="relative group">
                        <div className="absolute inset-0 bg-primary/5 rounded-[2.5rem] -rotate-3 transition-transform group-hover:rotate-0" />
                        <img 
                          src={method.image_url || "/classroom.png"} 
                          alt={method.title}
                          className="rounded-[2rem] shadow-strong w-full object-cover aspect-video relative z-10 border-4 border-white transition-transform group-hover:scale-[1.02]"
                        />
                        <div className={`absolute -bottom-6 ${isEven ? '-right-6' : '-left-6'} w-32 h-32 bg-accent/20 rounded-full blur-3xl -z-10`} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-primary relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.2),transparent_50%)]" />
          </div>
          <div className="container relative text-center">
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-primary-foreground mb-8">
              Experience the {schoolName} Way
            </h2>
            <p className="text-primary-foreground/80 mb-12 max-w-2xl mx-auto text-lg">
              Join our community of lifelong learners and give your child the foundation they deserve with our innovative teaching methods.
            </p>
            <div className="flex flex-wrap gap-6 justify-center">
              <Button variant="hero-gold" size="lg" className="h-14 px-10 text-lg" asChild>
                <Link to="/admissions">Apply Now</Link>
              </Button>
              <Button variant="hero" size="lg" className="h-14 px-10 text-lg" asChild>
                <Link to="/contact">Book a Tour</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
