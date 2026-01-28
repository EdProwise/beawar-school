import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Music, Trophy, Camera, Palette, Globe, Heart, 
  Users, Award, Clock, Target, Rocket, Star, Shield, Zap, BookOpen, ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  useSiteSettings, 
  useExtracurricularCategories, 
  useExtracurricularHighlights 
} from "@/hooks/use-school-data";
import { cn } from "@/lib/utils";

const iconMap: Record<string, React.ElementType> = {
  Music, Trophy, Camera, Palette, Globe, Heart, Rocket, Star, Shield, Zap, BookOpen, Users, Award, Clock, Target
};

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
  const { data: dbCategories } = useExtracurricularCategories();
  const { data: dbHighlights } = useExtracurricularHighlights();
  
  const schoolName = settings?.school_name || "Orbit School";
  const categories = dbCategories && dbCategories.length > 0 ? dbCategories : defaultCategories;
  const highlights = dbHighlights && dbHighlights.length > 0 ? dbHighlights : defaultHighlights;

  return (
    <div className="min-h-screen bg-background selection:bg-primary selection:text-primary-foreground">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-40 overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <motion.div 
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 90, 0],
                opacity: [0.1, 0.2, 0.1]
              }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -top-1/4 -right-1/4 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px]" 
            />
            <motion.div 
              animate={{ 
                scale: [1.2, 1, 1.2],
                rotate: [90, 0, 90],
                opacity: [0.1, 0.2, 0.1]
              }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] bg-accent/20 rounded-full blur-[100px]" 
            />
          </div>

          <div className="container relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold tracking-wide uppercase mb-6 border border-primary/20 backdrop-blur-sm">
                  <Star className="w-4 h-4" />
                  Life Beyond Academics
                </span>
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-5xl md:text-7xl lg:text-8xl font-heading font-bold text-foreground mb-8 tracking-tight"
              >
                Discover Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary-dark to-accent">Passion</span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed"
              >
                We believe in nurturing every child's talent through a diverse range of activities that build character, confidence, and community.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="flex flex-wrap items-center justify-center gap-6"
              >
                <Button size="lg" className="rounded-full h-14 px-8 text-lg font-semibold shadow-glow hover:shadow-strong transition-all" asChild>
                  <Link to="/admissions">Join Our Program</Link>
                </Button>
                <Link to="#categories" className="group flex items-center gap-2 text-lg font-semibold text-foreground hover:text-primary transition-colors">
                  Explore Activities
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Categories Section - Alternating Layout */}
        <section id="categories" className="py-24 lg:py-40 relative">
          <div className="container">
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mb-24 lg:mb-32"
            >
              <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">Our Diverse Ecosystem</h2>
              <div className="w-24 h-1.5 bg-gradient-to-r from-primary to-accent mx-auto rounded-full" />
            </motion.div>

            <div className="space-y-32 lg:space-y-48">
              {categories.map((category: any, index: number) => {
                const isEven = index % 2 === 0;
                const IconComponent = iconMap[category.icon_name || "Trophy"] || Trophy;
                
                return (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                    className={cn(
                      "flex flex-col lg:items-center gap-12 lg:gap-24",
                      isEven ? "lg:flex-row" : "lg:flex-row-reverse"
                    )}
                  >
                    {/* Image Column */}
                    <div className="flex-1 relative group">
                      <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-strong transform group-hover:scale-[1.02] transition-transform duration-700">
                        <img 
                          src={category.image_url || "https://images.unsplash.com/photo-1526676037777-05a232554f77?q=80&w=2070&auto=format&fit=crop"} 
                          alt={category.title} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      </div>
                      
                      {/* Floating Decorative Element */}
                      <div className={cn(
                        "absolute -z-10 w-full h-full border-2 border-primary/20 rounded-3xl transform -translate-x-4 translate-y-4 group-hover:-translate-x-6 group-hover:translate-y-6 transition-transform duration-700",
                        isEven ? "-translate-x-4" : "translate-x-4"
                      )} />
                    </div>

                    {/* Content Column */}
                    <div className="flex-1">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary mb-8 shadow-sm">
                        <IconComponent className="w-8 h-8" />
                      </div>
                      <h3 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-6 text-foreground tracking-tight">
                        {category.title}
                      </h3>
                      <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
                        {category.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-3 mb-12">
                        {category.activities?.map((activity: string, idx: number) => (
                          <span 
                            key={idx} 
                            className="px-5 py-2 rounded-full bg-secondary/50 border border-border text-foreground font-medium hover:bg-primary/10 hover:border-primary/30 transition-colors"
                          >
                            {activity}
                          </span>
                        ))}
                      </div>

                      <Button variant="outline" className="rounded-full px-8 group" asChild>
                        <Link to="/contact">
                          Inquire about {category.title}
                          <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </Button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Highlights Section - Premium Grid */}
        <section className="py-24 lg:py-40 bg-secondary/30 relative overflow-hidden">
          <div className="container relative z-10">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {highlights.map((item, index) => {
                const IconComponent = iconMap[item.icon_name || "Star"] || Star;
                return (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="group bg-card p-10 rounded-3xl border border-border/50 hover:border-primary/30 hover:shadow-strong transition-all duration-500 hover:-translate-y-2"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-8 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500">
                      <IconComponent className="w-8 h-8" />
                    </div>
                    <h4 className="text-2xl font-heading font-bold mb-4">{item.title}</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section - Elegant Design */}
        <section className="py-24 lg:py-40 relative overflow-hidden">
          <div className="container relative z-10">
            <div className="relative bg-primary rounded-[3rem] p-12 lg:p-24 overflow-hidden text-center">
              {/* Background Shapes */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-primary-dark rounded-full -mr-48 -mt-48 blur-[80px] opacity-50" />
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent rounded-full -ml-48 -mb-48 blur-[80px] opacity-30" />
              
              <div className="relative z-10 max-w-3xl mx-auto">
                <motion.h2 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-primary-foreground mb-8"
                >
                  Ready to Shape Your Future?
                </motion.h2>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="text-xl text-primary-foreground/80 mb-12 leading-relaxed"
                >
                  Join {schoolName}'s vibrant community where every talent is celebrated and every student is empowered to excel beyond limits.
                </motion.p>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="flex flex-wrap justify-center gap-6"
                >
                  <Button variant="hero-gold" size="lg" className="rounded-full h-14 px-10 text-lg shadow-xl" asChild>
                    <Link to="/admissions">Begin Your Journey</Link>
                  </Button>
                  <Button variant="hero" size="lg" className="rounded-full h-14 px-10 text-lg border-white/20 hover:bg-white/10" asChild>
                    <Link to="/contact">Request Information</Link>
                  </Button>
                </motion.div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default Extracurricular;
