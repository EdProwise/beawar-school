import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Link } from "react-router-dom";
import { 
  Monitor, BookOpen, Dumbbell, FlaskConical, Bus, Laptop, Music, Palette, 
  ArrowRight, Building, Wifi, Utensils, Shield, Loader2, X 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFacilities, useSiteSettings } from "@/hooks/use-school-data";
import { motion, AnimatePresence } from "framer-motion";

const iconMap: Record<string, React.ElementType> = {
  Monitor, BookOpen, FlaskConical, Dumbbell, Bus, Wifi, Building, Laptop, Music, Palette, Utensils, Shield
};

const defaultFacilities = [
  { id: "1", title: "Smart Classrooms", description: "Digital learning with interactive boards", icon_name: "Monitor", image_url: "/classroom.png" },
  { id: "2", title: "Library", description: "20,000+ books and digital resources", icon_name: "BookOpen", image_url: "/library.png" },
  { id: "3", title: "Science Labs", description: "Well-equipped Physics, Chemistry, Biology labs", icon_name: "FlaskConical", image_url: "/science_lab.png" },
  { id: "4", title: "Sports Complex", description: "Indoor and outdoor sports facilities", icon_name: "Dumbbell", image_url: "/sports.png" },
  { id: "5", title: "Computer Lab", description: "Modern computers with high-speed internet", icon_name: "Monitor", image_url: "/classroom.png" },
  { id: "6", title: "Transport", description: "GPS-enabled buses for all routes", icon_name: "Bus", image_url: "/hero_campus.png" },
];

const getYouTubeEmbedUrl = (url: string) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : null;
};

const Facilities = () => {
  const { data: settings } = useSiteSettings();
  const { data: facilities = [], isLoading } = useFacilities();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const schoolName = settings?.school_name || "Orbit School";
  const displayFacilities = facilities.length > 0 ? facilities : (defaultFacilities as any[]);

  const campusVideoEmbedUrl = settings?.campus_video_url ? getYouTubeEmbedUrl(settings.campus_video_url) : null;

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
                    const galleryImages = facility.images || [];
                    const hasGallery = galleryImages.length > 0;
                    
                    return (
                      <div 
                        key={facility.id} 
                        className="group bg-card rounded-2xl overflow-hidden border border-border hover:shadow-strong transition-all duration-300 flex flex-col"
                      >
                        <div className="relative h-56 overflow-hidden">
                          <img 
                            src={facility.image_url || "/placeholder.svg"} 
                            alt={facility.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 cursor-pointer"
                            onClick={() => setSelectedImage(facility.image_url)}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/70 to-transparent pointer-events-none" />
                          <div className="absolute bottom-4 left-4 right-4 pointer-events-none">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
                                <IconComponent className="w-5 h-5 text-accent-foreground" />
                              </div>
                              <h3 className="font-heading text-lg font-semibold text-primary-foreground">
                                {facility.title}
                              </h3>
                            </div>
                          </div>
                        </div>

                        {hasGallery && (
                          <div className="px-4 pt-4">
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Gallery</p>
                            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide snap-x">
                              {galleryImages.map((img: string, idx: number) => (
                                <div 
                                  key={idx} 
                                  className="flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden cursor-pointer snap-start border border-border hover:border-primary transition-colors"
                                  onClick={() => setSelectedImage(img)}
                                >
                                  <img src={img} alt={`${facility.title} ${idx + 1}`} className="w-full h-full object-cover" />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="p-6 flex-grow">
                          <p className="text-muted-foreground text-sm">
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
                  <div className="relative aspect-video rounded-2xl overflow-hidden shadow-medium bg-muted group">
                    {campusVideoEmbedUrl ? (
                      <iframe
                        src={campusVideoEmbedUrl}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : settings?.campus_video_url ? (
                      <video 
                        src={settings.campus_video_url} 
                        controls 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img 
                        src="/hero_campus.png" 
                        alt="Campus" 
                        className="w-full h-full object-cover"
                      />
                    )}
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

        {/* Lightbox */}
        <AnimatePresence>
          {selectedImage && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 md:p-8"
              onClick={() => setSelectedImage(null)}
            >
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute top-4 right-4 text-white hover:bg-white/20 z-[110]"
                onClick={() => setSelectedImage(null)}
              >
                <X className="w-8 h-8" />
              </Button>
              <motion.img 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                src={selectedImage} 
                alt="Enlarged view" 
                className="max-w-full max-h-full object-contain rounded-lg"
                onClick={(e) => e.stopPropagation()}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

export default Facilities;
