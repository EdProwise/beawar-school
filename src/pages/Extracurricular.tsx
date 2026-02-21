import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Link } from "react-router-dom";
import { 
  Music, Trophy, Camera, Palette, Globe, Heart, 
  Users, Award, Clock, Target, Rocket, Star, Shield, Zap, BookOpen, ArrowRight, Loader2, Play
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  useSiteSettings, 
  useExtracurricularCategories, 
  useExtracurricularHighlights 
} from "@/hooks/use-school-data";

const iconMap: Record<string, React.ElementType> = {
  Music, Trophy, Camera, Palette, Globe, Heart, Rocket, Star, Shield, Zap, BookOpen, Users, Award, Clock, Target
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

const defaultCategories = [
  {
    title: "Sports & Athletics",
    icon_name: "Trophy",
    description: "From football and basketball to swimming and track & field, our sports programs foster teamwork, discipline, and physical fitness.",
    activities: ["Football", "Basketball", "Cricket", "Swimming", "Athletics", "Martial Arts"],
    image_url: "https://images.unsplash.com/photo-1526676037777-05a232554f77?q=80&w=2070&auto=format&fit=crop"
  },
  {
    title: "Performing Arts",
    icon_name: "Music",
    description: "Express your creativity through our music, dance, and drama programs, featuring regular performances and workshops.",
    activities: ["Classical Dance", "Contemporary Dance", "Instrumental Music", "Vocal Music", "Theater & Drama", "Public Speaking"],
    image_url: "https://images.unsplash.com/photo-1514525253361-bee8718a34e1?q=80&w=1915&auto=format&fit=crop"
  },
  {
    title: "Visual Arts & Design",
    icon_name: "Palette",
    description: "Nurture your artistic talents through painting, sculpture, digital design, and various craft workshops.",
    activities: ["Painting & Sketching", "Pottery & Sculpture", "Graphic Design", "Photography", "Craft & Origami", "Fashion Club"],
    image_url: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?q=80&w=2080&auto=format&fit=crop"
  },
  {
    title: "Clubs & Societies",
    icon_name: "Globe",
    description: "Join specialized clubs to explore interests in science, technology, environment, and social service.",
    activities: ["Coding & Robotics", "Science Club", "Eco-Warriors", "Debate Society", "Literary Club", "Interact Club"],
    image_url: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=2070&auto=format&fit=crop"
  }
];

const defaultHighlights = [
  { icon_name: "Rocket", title: "Holistic Growth", description: "Developing skills beyond the classroom for a well-rounded personality." },
  { icon_name: "Star", title: "Expert Coaching", description: "Guidance from professional coaches and industry experts." },
  { icon_name: "Shield", title: "Safe Environment", description: "All activities are conducted in a safe and supervised environment." },
  { icon_name: "Zap", title: "Modern Facilities", description: "Access to professional-grade equipment and state-of-the-art facilities." },
];

export function Extracurricular() {
  const { data: settings } = useSiteSettings();
  const { data: dbCategories, isLoading } = useExtracurricularCategories();
  const { data: dbHighlights, isLoading: isLoadingHighlights } = useExtracurricularHighlights();
  
  const schoolName = settings?.school_name || "";
  const categories = dbCategories && dbCategories.length > 0 ? dbCategories : defaultCategories;
    const highlights = dbHighlights && dbHighlights.length > 0 ? dbHighlights : defaultHighlights;
  
    return (
      <div className="min-h-screen overflow-x-hidden">
        <Header />
        <main>
          {/* Hero - Removed redundant spacer to allow header overlay */}
          <section className="pt-40 pb-20 bg-gradient-to-b from-primary to-primary-dark relative overflow-hidden">

          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.2),transparent_50%)]" />
          </div>
          <div className="container relative text-center">
            <span className="inline-block px-4 py-2 bg-primary-foreground/10 text-primary-foreground rounded-full text-sm font-medium mb-4">
              Life Beyond Academics
            </span>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6">
              Extracurricular Activities
            </h1>
            <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">
              We believe in nurturing every child's unique talent through a diverse range of activities that build character, confidence, and community.
            </p>
          </div>
        </section>

        {/* Categories */}
        <section className="py-20 bg-background">
          <div className="container">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="inline-block px-4 py-2 bg-primary-light text-primary rounded-full text-sm font-medium mb-4">
                Our Programs
              </span>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
                Discover Your Passion
              </h2>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
              ) : (
                <div className="space-y-24">
                  {categories.map((category: any, index: number) => {
                    const IconComponent = iconMap[category.icon_name || "Trophy"] || Trophy;
                    const isEven = index % 2 === 0;
                    
                    return (
                      <div 
                        key={index}
                        className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center"
                      >
                        <div className={`relative z-10 min-w-0 ${isEven ? '' : 'lg:order-2'}`}>
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-xl bg-primary-light flex items-center justify-center">
                              <IconComponent className="w-6 h-6 text-primary" />
                            </div>
                          </div>
                          <h3 className="font-heading text-3xl font-bold text-foreground mb-4 text-balance">
                            {category.title}
                          </h3>
                          <p className="text-muted-foreground mb-6 leading-relaxed text-lg">
                            {category.description}
                          </p>
                          <div className="flex flex-wrap gap-2 mb-8">
                            {category.activities?.map((activity: string, idx: number) => (
                              <span 
                                key={idx} 
                                className="px-3 py-1.5 rounded-full bg-primary-light text-primary text-sm font-medium border border-primary/10"
                              >
                                {activity}
                              </span>
                            ))}
                          </div>
                          <Button asChild>
                            <Link to="/admissions/process">
                              Enquire for {category.title}
                              <ArrowRight className="w-4 h-4 ml-2" />
                            </Link>
                          </Button>
                        </div>
                          <div className={`min-w-0 ${isEven ? '' : 'lg:order-1'}`}>
                            <div className="relative group/media">
                              {category.video_url ? (
                                <div className="relative rounded-2xl overflow-hidden shadow-strong aspect-video bg-black group/video">
                                  <video 
                                    src={category.video_url} 
                                    className="w-full h-full object-cover"
                                    controls
                                    poster={category.image_url || undefined}
                                  />
                                  {!category.image_url && (
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none group-hover/video:opacity-0 transition-opacity">
                                      <div className="w-16 h-16 rounded-full bg-primary/80 flex items-center justify-center">
                                        <Play className="w-8 h-8 text-white fill-current ml-1" />
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div className="relative">
                                  <img 
                                    src={category.image_url || "https://images.unsplash.com/photo-1526676037777-05a232554f77?q=80&w=2070&auto=format&fit=crop"} 
                                    alt={category.title}
                                    className="rounded-2xl shadow-strong w-full h-[400px] object-cover"
                                  />
                                  <div className="absolute -bottom-4 -right-4 bg-accent px-6 py-3 rounded-xl shadow-strong">
                                    <p className="text-accent-foreground font-semibold">{category.title}</p>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                      </div>
                    );
                  })}
                </div>
              )}
          </div>
        </section>

        {/* Highlights */}
        <section className="py-20 bg-background">
          <div className="container">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="inline-block px-4 py-2 bg-accent-light text-accent-dark rounded-full text-sm font-medium mb-4">
                Why Choose Us
              </span>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
                Excellence in Every Activity
              </h2>
            </div>

            {isLoadingHighlights ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {highlights.map((item, index) => {
                  const IconComponent = iconMap[item.icon_name || "Star"] || Star;
                  const style = cardStyles[index % cardStyles.length];
                  return (
                    <div 
                      key={index} 
                      className={`group p-8 rounded-[2rem] bg-card border border-border hover:border-transparent ${style.shadow} transition-all duration-500 hover:-translate-y-2 relative overflow-hidden`}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${style.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                      
                      <div className="relative z-10">
                        <div className={`w-14 h-14 rounded-2xl ${style.iconBg} flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-sm`}>
                          <IconComponent className={`w-7 h-7 ${style.iconText}`} />
                        </div>
                        <h3 className="font-heading text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">{item.title}</h3>
                        <p className="text-muted-foreground leading-relaxed text-sm">{item.description}</p>
                      </div>

                      <div className={`absolute bottom-0 left-0 h-1.5 w-0 bg-gradient-to-r ${style.gradient.replace('/20', '')} transition-all duration-500 group-hover:w-full`} />
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
              Ready to Discover Your Passion?
            </h2>
            <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
              Join {schoolName}'s vibrant community where every talent is celebrated and every student is empowered to excel.
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
}

export default Extracurricular;
