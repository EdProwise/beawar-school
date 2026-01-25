import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Link } from "react-router-dom";
import { 
  Monitor, BookOpen, Dumbbell, FlaskConical, Bus, Laptop, Music, Palette, 
  ArrowRight, Building, Wifi, Utensils, Shield, Loader2 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFacilities, useSiteSettings } from "@/hooks/use-school-data";

const iconMap: Record<string, React.ElementType> = {
  Monitor, BookOpen, FlaskConical, Dumbbell, Bus, Wifi, Building, Laptop, Music, Palette, Utensils, Shield
};

const defaultFacilities = [
  {
    id: "1",
    icon_name: "Monitor",
    title: "Smart Classrooms",
    description: "Air-conditioned classrooms equipped with interactive whiteboards, projectors, and modern teaching aids for an engaging learning experience.",
    image_url: "/classroom.png",
  },
  {
    id: "2",
    icon_name: "BookOpen",
    title: "Central Library",
    description: "A vast collection of over 20,000 books, journals, and digital resources. Quiet reading zones and group study areas available.",
    image_url: "/library.png",
  },
  {
    id: "3",
    icon_name: "FlaskConical",
    title: "Science Laboratories",
    description: "State-of-the-art Physics, Chemistry, and Biology labs with modern equipment for hands-on experiments and research.",
    image_url: "/science_lab.png",
  },
  {
    id: "4",
    icon_name: "Laptop",
    title: "Computer Labs",
    description: "Multiple computer labs with high-speed internet, latest hardware and software for coding, design, and digital literacy.",
    image_url: "/classroom.png",
  },
  {
    id: "5",
    icon_name: "Dumbbell",
    title: "Sports Complex",
    description: "Multi-sport facilities including football field, basketball court, swimming pool, tennis court, and indoor games arena.",
    image_url: "/sports.png",
  },
  {
    id: "6",
    icon_name: "Bus",
    title: "Transportation",
    description: "GPS-enabled fleet of buses covering all major routes with trained drivers and attendants ensuring safe commute.",
    image_url: "/hero_campus.png",
  },
];

const Facilities = () => {
  const { data: settings } = useSiteSettings();
  const { data: facilities = [], isLoading } = useFacilities();

  const schoolName = settings?.school_name || "Orbit School";
  const displayFacilities = facilities.length > 0 ? facilities : defaultFacilities;

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
              Facilities
            </span>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6">
              World-Class Infrastructure
            </h1>
            <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">
              State-of-the-art facilities designed to support holistic learning and development.
            </p>
          </div>
        </section>

        {/* Facilities Grid */}
        <section className="py-20 bg-background">
          <div className="container">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {displayFacilities.map((facility) => {
                  const IconComponent = iconMap[facility.icon_name || "Building"] || Building;
                  
                  return (
                    <div 
                      key={facility.id} 
                      className="group bg-card rounded-2xl overflow-hidden border border-border hover:shadow-strong transition-all duration-300"
                    >
                      <div className="relative h-56 overflow-hidden">
                        <img 
                          src={facility.image_url || "/placeholder.svg"} 
                          alt={facility.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/70 to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center">
                              <IconComponent className="w-6 h-6 text-accent-foreground" />
                            </div>
                            <h3 className="font-heading text-xl font-semibold text-primary-foreground">
                              {facility.title}
                            </h3>
                          </div>
                        </div>
                      </div>
                      <div className="p-6">
                        <p className="text-muted-foreground mb-4">
                          {facility.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* Virtual Tour CTA */}
        <section className="py-20 bg-secondary/50">
          <div className="container">
            <div className="bg-card rounded-3xl p-8 lg:p-12 border border-border">
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
                    Want to See Our Campus?
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    Schedule a visit to experience our world-class facilities in person. 
                    Our admissions team will be happy to give you a guided tour.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <Button size="lg" asChild>
                      <Link to="/contact">
                        Schedule a Visit
                        <ArrowRight className="w-5 h-5" />
                      </Link>
                    </Button>
                    <Button variant="outline" size="lg" asChild>
                      <Link to="/gallery">View Gallery</Link>
                    </Button>
                  </div>
                </div>
                <div className="relative">
                  <img 
                    src="/hero_campus.png" 
                    alt="Campus" 
                    className="rounded-2xl shadow-medium"
                  />
                </div>
              </div>
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
              Experience Excellence at {schoolName}
            </h2>
            <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
              Join us and benefit from our outstanding infrastructure designed for your child's success.
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

export default Facilities;
