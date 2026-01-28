import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Music, Trophy, Camera, Palette, Globe, Heart, 
  Users, Award, Clock, Target, Rocket, Star, Shield, Zap, BookOpen, ArrowRight
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
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative pt-28 pb-20 lg:pt-40 lg:pb-32 bg-foreground overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03]">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }} />
          </div>
          
          <div className="container relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-white/80 text-sm font-medium tracking-wider uppercase mb-6"
              >
                Life Beyond Academics
              </motion.span>
              
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold text-white mb-6 tracking-tight"
              >
                Extracurricular Activities
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-10"
              >
                We believe in nurturing every child's unique talent through a diverse range of activities that build character, confidence, and community.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Button size="lg" className="rounded-full h-12 px-8 bg-white text-foreground hover:bg-white/90 font-semibold" asChild>
                  <Link to="/admissions">
                    Join Our Program
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-20 lg:py-32">
          <div className="container">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">Our Programs</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Discover a world of opportunities designed to help students explore their passions and develop new skills.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              {categories.map((category: any, index: number) => {
                const IconComponent = iconMap[category.icon_name || "Trophy"] || Trophy;
                return (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="group bg-card rounded-2xl border border-border overflow-hidden hover:shadow-xl transition-all duration-500"
                  >
                    {category.image_url && (
                      <div className="relative h-56 overflow-hidden">
                        <img 
                          src={category.image_url} 
                          alt={category.title} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                              <IconComponent className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-2xl font-heading font-bold text-white">
                              {category.title}
                            </h3>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {!category.image_url && (
                      <div className="p-6 pb-0">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-12 h-12 rounded-xl bg-foreground/5 flex items-center justify-center">
                            <IconComponent className="w-6 h-6 text-foreground" />
                          </div>
                          <h3 className="text-2xl font-heading font-bold text-foreground">
                            {category.title}
                          </h3>
                        </div>
                      </div>
                    )}
                    
                    <div className="p-6">
                      <p className="text-muted-foreground mb-6 leading-relaxed">
                        {category.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-2">
                        {category.activities?.map((activity: string, idx: number) => (
                          <span 
                            key={idx} 
                            className="px-3 py-1.5 rounded-full bg-foreground/5 text-foreground text-sm font-medium"
                          >
                            {activity}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Highlights Section */}
        <section className="py-20 lg:py-32 bg-foreground/[0.02]">
          <div className="container">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">Why Choose Us</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Our commitment to excellence ensures every student receives the best opportunities to grow and succeed.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {highlights.map((item, index) => {
                const IconComponent = iconMap[item.icon_name || "Star"] || Star;
                return (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="group bg-card p-8 rounded-2xl border border-border hover:border-foreground/20 transition-all duration-300"
                  >
                    <div className="w-14 h-14 rounded-xl bg-foreground/5 flex items-center justify-center mb-6 group-hover:bg-foreground group-hover:text-background transition-all duration-300">
                      <IconComponent className="w-7 h-7" />
                    </div>
                    <h4 className="text-xl font-heading font-bold mb-3 text-foreground">{item.title}</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 lg:py-32">
          <div className="container">
            <div className="bg-foreground rounded-3xl p-10 lg:p-16 text-center">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-white mb-6"
              >
                Ready to Discover Your Passion?
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-lg text-white/70 mb-10 max-w-2xl mx-auto"
              >
                Join {schoolName}'s vibrant community where every talent is celebrated and every student is empowered to excel.
              </motion.p>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="flex flex-wrap justify-center gap-4"
              >
                <Button size="lg" className="rounded-full h-12 px-8 bg-white text-foreground hover:bg-white/90 font-semibold" asChild>
                  <Link to="/admissions">Apply Now</Link>
                </Button>
                <Button size="lg" variant="outline" className="rounded-full h-12 px-8 border-white/30 text-white hover:bg-white/10 font-semibold" asChild>
                  <Link to="/contact">Contact Us</Link>
                </Button>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default Extracurricular;
