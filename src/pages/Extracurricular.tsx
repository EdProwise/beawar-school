import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Link } from "react-router-dom";
import { 
  Music, Trophy, Camera, Palette, Globe, Heart, 
  Users, Award, Clock, Target, Rocket, Star, Shield, Zap, BookOpen 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSiteSettings } from "@/hooks/use-school-data";

const iconMap: Record<string, React.ElementType> = {
  Music, Trophy, Camera, Palette, Globe, Heart, Rocket, Star, Shield, Zap, BookOpen, Users, Award, Clock, Target
};

const activityCategories = [
  {
    title: "Sports & Athletics",
    icon: Trophy,
    description: "From football and basketball to swimming and track & field, our sports programs foster teamwork, discipline, and physical fitness.",
    activities: ["Football", "Basketball", "Cricket", "Swimming", "Athletics", "Martial Arts"]
  },
  {
    title: "Performing Arts",
    icon: Music,
    description: "Express your creativity through our music, dance, and drama programs, featuring regular performances and workshops.",
    activities: ["Classical Dance", "Contemporary Dance", "Instrumental Music", "Vocal Music", "Theater & Drama", "Public Speaking"]
  },
  {
    title: "Visual Arts & Design",
    icon: Palette,
    description: "Nurture your artistic talents through painting, sculpture, digital design, and various craft workshops.",
    activities: ["Painting & Sketching", "Pottery & Sculpture", "Graphic Design", "Photography", "Craft & Origami", "Fashion Club"]
  },
  {
    title: "Clubs & Societies",
    icon: Globe,
    description: "Join specialized clubs to explore interests in science, technology, environment, and social service.",
    activities: ["Coding & Robotics", "Science Club", "Eco-Warriors", "Debate Society", "Literary Club", "Interact Club"]
  }
];

const highlights = [
  { icon: Rocket, title: "Holistic Growth", description: "Developing skills beyond the classroom for a well-rounded personality." },
  { icon: Star, title: "Expert Coaching", description: "Guidance from professional coaches and industry experts." },
  { icon: Shield, title: "Safe Environment", description: "All activities are conducted in a safe and supervised environment." },
  { icon: Zap, title: "State-of-the-art Equipment", description: "Access to professional-grade equipment and facilities." },
];

export function Extracurricular() {
  const { data: settings } = useSiteSettings();
  const schoolName = settings?.school_name || "Orbit School";

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
              Life Beyond Academics
            </span>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6">
              Extracurricular Activities
            </h1>
            <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">
              We believe in nurturing every child's talent. Our wide range of extracurricular activities ensures that students find their passion and develop essential life skills.
            </p>
          </div>
        </section>

        {/* Categories */}
        <section className="py-20 bg-background">
          <div className="container">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="inline-block px-4 py-2 bg-primary-light text-primary rounded-full text-sm font-medium mb-4">
                What We Offer
              </span>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
                Diverse Opportunities for Every Student
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {activityCategories.map((category, index) => {
                const IconComponent = category.icon;
                return (
                  <div key={index} className="bg-card p-8 rounded-2xl border border-border hover:shadow-strong transition-all group">
                    <div className="w-16 h-16 rounded-2xl bg-primary-light flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <IconComponent className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="font-heading text-2xl font-bold text-foreground mb-4">{category.title}</h3>
                    <p className="text-muted-foreground mb-6">{category.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {category.activities.map((activity, idx) => (
                        <span key={idx} className="px-3 py-1 bg-secondary text-foreground text-sm rounded-full">
                          {activity}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Highlights */}
        <section className="py-20 bg-secondary/50">
          <div className="container">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {highlights.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <div key={index} className="bg-card p-6 rounded-2xl border border-border text-center hover:shadow-medium transition-all">
                    <div className="w-14 h-14 rounded-full bg-primary-light flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="font-heading font-semibold text-foreground mb-2">{item.title}</h3>
                    <p className="text-muted-foreground text-sm">{item.description}</p>
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
              Join Our Vibrant Community
            </h2>
            <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
              Experience the joy of learning and growing through our diverse extracurricular programs at {schoolName}.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button variant="hero-gold" size="lg" asChild>
                <Link to="/admissions">Enroll Now</Link>
              </Button>
              <Button variant="hero" size="lg" asChild>
                <Link to="/contact">Enquire More</Link>
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
