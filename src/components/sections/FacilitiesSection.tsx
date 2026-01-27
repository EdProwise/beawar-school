import { Link } from "react-router-dom";
import { 
  Monitor, BookOpen, FlaskConical, Dumbbell, Bus, Wifi, 
  Building, Laptop, Music, Palette, Utensils, Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFacilities } from "@/hooks/use-school-data";

const iconMap: Record<string, React.ElementType> = {
  Monitor, BookOpen, FlaskConical, Dumbbell, Bus, Wifi,
  Building, Laptop, Music, Palette, Utensils, Shield
};

export function FacilitiesSection() {
  const { data: facilities = [], isLoading } = useFacilities();

  // Fallback facilities
  const defaultFacilities = [
    { id: "1", title: "Smart Classrooms", description: "Digital learning with interactive boards", icon_name: "Monitor", image_url: "/classroom.png" },
    { id: "2", title: "Library", description: "20,000+ books and digital resources", icon_name: "BookOpen", image_url: "/library.png" },
    { id: "3", title: "Science Labs", description: "Well-equipped Physics, Chemistry, Biology labs", icon_name: "FlaskConical", image_url: "/science_lab.png" },
    { id: "4", title: "Sports Complex", description: "Indoor and outdoor sports facilities", icon_name: "Dumbbell", image_url: "/sports.png" },
    { id: "5", title: "Computer Lab", description: "Modern computers with high-speed internet", icon_name: "Monitor", image_url: "/classroom.png" },
    { id: "6", title: "Transport", description: "GPS-enabled buses for all routes", icon_name: "Bus", image_url: "/hero_campus.png" },
  ];

  const displayFacilities = facilities.length > 0 ? facilities : defaultFacilities;

  return (
    <section className="py-20 lg:py-28 bg-background relative overflow-hidden">
      {/* Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/3 rounded-full blur-3xl" />

      <div className="container relative">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-2 bg-accent-light text-accent-dark rounded-full text-sm font-medium mb-4">
            Facilities
          </span>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            World-Class <span className="text-gradient-gold">Infrastructure</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            State-of-the-art facilities designed to support comprehensive learning
          </p>
        </div>

        {/* Facilities Grid */}
        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-card rounded-2xl overflow-hidden animate-pulse">
                <div className="h-48 bg-secondary" />
                <div className="p-6">
                  <div className="h-6 bg-secondary rounded w-3/4 mb-2" />
                  <div className="h-4 bg-secondary rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayFacilities.slice(0, 6).map((facility) => {
                const IconComponent = iconMap[facility.icon_name || "Building"] || Building;
              return (
                <div
                  key={facility.id}
                  className="group bg-card rounded-2xl overflow-hidden border border-border hover:shadow-strong transition-all duration-300"
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={facility.image_url || "/placeholder.svg"}
                      alt={facility.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/60 to-transparent" />
                    <div className="absolute bottom-4 left-4">
                      <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center">
                        <IconComponent className="w-6 h-6 text-accent-foreground" />
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="font-heading text-xl font-semibold text-foreground mb-2">
                      {facility.title}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {facility.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* CTA */}
        <div className="text-center mt-12">
          <Button variant="gold" size="lg" asChild>
            <Link to="/facilities">
              Explore All Facilities
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
