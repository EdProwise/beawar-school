import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Link } from "react-router-dom";
import { Award, Target, Eye, Users, Heart, GraduationCap, CheckCircle, Loader2, Star, Shield, Lightbulb, Calendar, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormattedContent } from "@/components/ui/formatted-content";
import { useAboutContent, useHighlightCards, useSiteSettings, useCoreValues, useMilestones, useStatistics } from "@/hooks/use-school-data";

const iconMap: Record<string, any> = {
  Award,
  Heart,
  Users,
  GraduationCap,
  Star,
  Shield,
  Target,
  Lightbulb,
  CheckCircle,
  Calendar,
  TrendingUp,
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

export function AboutUs() {
  const { data: settings } = useSiteSettings();
  const { data: about, isLoading: aboutLoading } = useAboutContent();
  const { data: highlights = [] } = useHighlightCards();
  const { data: coreValues = [] } = useCoreValues();
  const { data: milestones = [] } = useMilestones();
  const { data: statistics = [] } = useStatistics();

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
              <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto break-words">
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
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                  <div className="relative z-10">
                  <span className="inline-block px-4 py-2 bg-primary-light text-primary rounded-full text-sm font-medium mb-4">
                    Our Story
                  </span>
                      <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-6">
                        {about?.main_heading || "A Legacy of Educational Excellence"}
                      </h2>
                      <div className="mb-6">
                        <FormattedContent 
                          content={about?.main_description || `Founded in ${foundingYear} by visionary educators, ${schoolName} began with a simple mission: to provide world-class education that empowers students to reach their full potential.`} 
                        />
                        
                        {about?.history_text && (
                          <FormattedContent content={about.history_text} className="mt-4" />
                        )}
                      </div>

                        <div className="flex flex-wrap items-center gap-8">
                          {statistics.length > 0 ? (
                            statistics.map((stat) => (
                              <div key={stat.id}>
                                <p className="font-heading text-4xl font-bold text-primary">
                                  {stat.value}{stat.suffix}
                                </p>
                                <p className="text-muted-foreground text-sm">{stat.label}</p>
                              </div>
                            ))
                          ) : (
                            <>
                              <div>
                                <p className="font-heading text-4xl font-bold text-primary">{yearsOfExcellence}+</p>
                                <p className="text-muted-foreground text-sm">Years of Excellence</p>
                              </div>
                              <div>
                                <p className="font-heading text-4xl font-bold text-accent-dark">1500+</p>
                                <p className="text-muted-foreground text-sm">Students Enrolled</p>
                              </div>
                            </>
                          )}
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
        <section className="py-24 bg-gradient-to-br from-secondary/30 via-background to-secondary/30 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_20%,rgba(var(--primary-rgb),0.05),transparent_50%),radial-gradient(circle_at_80%_80%,rgba(var(--accent-rgb),0.05),transparent_50%)]" />
          
          <div className="container relative">
            <div className="grid lg:grid-cols-2 gap-12 items-stretch">
              {/* Mission Card */}
              <div className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-primary/10 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative h-full bg-card p-10 rounded-3xl border border-border/50 shadow-xl backdrop-blur-sm flex flex-col">
                  <div className="flex items-start justify-between mb-8">
                    <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                      <Target className="w-10 h-10 text-primary" />
                    </div>
                    <span className="text-6xl font-bold text-primary/5 select-none">01</span>
                  </div>
                    <h3 className="font-heading text-3xl font-bold text-foreground mb-6 group-hover:text-primary transition-colors">
                      {about?.mission_title || "Our Mission"}
                    </h3>
                    <div className="flex-grow">
                      <FormattedContent 
                        content={about?.mission_text || "To provide holistic education that empowers students with knowledge, skills, and values to excel in a rapidly changing world while fostering a love for lifelong learning."} 
                      />
                    </div>
                  </div>
                </div>

                {/* Vision Card */}
                <div className="group relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-accent/20 to-accent/10 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                  <div className="relative h-full bg-card p-10 rounded-3xl border border-border/50 shadow-xl backdrop-blur-sm flex flex-col">
                    <div className="flex items-start justify-between mb-8">
                      <div className="w-20 h-20 rounded-2xl bg-accent/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                        <Eye className="w-10 h-10 text-accent-dark" />
                      </div>
                      <span className="text-6xl font-bold text-accent-dark/5 select-none">02</span>
                    </div>
                    <h3 className="font-heading text-3xl font-bold text-foreground mb-6 group-hover:text-accent-dark transition-colors">
                      {about?.vision_title || "Our Vision"}
                    </h3>
                    <div className="flex-grow">
                      <FormattedContent 
                        content={about?.vision_text || "To be a globally recognized institution that transforms education and creates leaders who make a positive impact on society through innovation and excellence."} 
                      />
                    </div>
                  </div>
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
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  {coreValues.map((value, index) => {
                    const IconComponent = iconMap[value.icon_name || "Award"] || Award;
                    const style = cardStyles[index % cardStyles.length];
                    return (
                      <div 
                        key={value.id} 
                        className={`group relative p-8 rounded-3xl border ${style.border} ${style.light} ${style.hoverBorder} ${style.shadow} transition-all duration-500 hover:-translate-y-2 overflow-hidden`}
                      >
                        {/* Decorative Gradient Background */}
                        <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${style.gradient} rounded-bl-full -mr-16 -mt-16 transition-transform duration-500 group-hover:scale-150 opacity-50`} />
                        
                        <div className="relative z-10">
                          <div className={`w-16 h-16 rounded-2xl ${style.iconBg} flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-500`}>
                            <IconComponent className={`w-8 h-8 ${style.iconText}`} />
                          </div>
                          <h3 className="font-heading text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                            {value.title}
                          </h3>
                          <div className="text-muted-foreground leading-relaxed">
                            <FormattedContent content={value.description || ""} />
                          </div>
                        </div>
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
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
              {milestones.map((milestone, index) => (
                <div key={milestone.id} className="text-center">
                    <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center mx-auto mb-4">
                      <span className="font-heading font-bold text-accent-foreground">{milestone.year}</span>
                    </div>
                    <p className="text-primary-foreground/80 text-sm break-words">{milestone.event}</p>
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
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  {highlights.map((card, index) => {
                    const IconComponent = iconMap[card.icon_name || "CheckCircle"] || CheckCircle;
                    // Use cardStyles in reverse order for variety
                    const style = cardStyles[(cardStyles.length - 1 - index) % cardStyles.length];
                    return (
                      <div 
                        key={card.id} 
                        className={`group p-8 rounded-[2rem] bg-card border border-border hover:border-transparent ${style.shadow} transition-all duration-500 hover:-translate-y-2 relative overflow-hidden`}
                      >
                        {/* Hover Gradient Overlay */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${style.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                        
                        <div className="relative z-10">
                          <div className={`w-14 h-14 rounded-2xl ${style.iconBg} flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-sm`}>
                            <IconComponent className={`w-7 h-7 ${style.iconText}`} />
                          </div>
                            <h3 className="font-heading text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                              {card.title}
                            </h3>
                            <p className="text-muted-foreground leading-relaxed break-words">
                              {card.description}
                            </p>
                          </div>

                        {/* Bottom Accent Line */}
                        <div className={`absolute bottom-0 left-0 h-1.5 w-0 bg-gradient-to-r ${style.gradient.replace('/20', '')} transition-all duration-500 group-hover:w-full`} />
                      </div>
                    );
                  })}
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
}

export default AboutUs;
