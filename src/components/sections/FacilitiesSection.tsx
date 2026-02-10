import { Link } from "react-router-dom";
import { 
  Monitor, BookOpen, FlaskConical, Dumbbell, Bus, Wifi, 
  Building, Laptop, Music, Palette, Utensils, Shield,
  ArrowRight, Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFacilities } from "@/hooks/use-school-data";

const iconMap: Record<string, React.ElementType> = {
  Monitor, BookOpen, FlaskConical, Dumbbell, Bus, Wifi,
  Building, Laptop, Music, Palette, Utensils, Shield
};

const cardThemes = [
  { gradient: "from-violet-500 to-purple-600", bg: "bg-violet-50", text: "text-violet-600", border: "border-violet-200", shadow: "shadow-violet-200/50", ring: "ring-violet-500/20" },
  { gradient: "from-amber-500 to-orange-600", bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-200", shadow: "shadow-amber-200/50", ring: "ring-amber-500/20" },
  { gradient: "from-emerald-500 to-teal-600", bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-200", shadow: "shadow-emerald-200/50", ring: "ring-emerald-500/20" },
  { gradient: "from-sky-500 to-blue-600", bg: "bg-sky-50", text: "text-sky-600", border: "border-sky-200", shadow: "shadow-sky-200/50", ring: "ring-sky-500/20" },
  { gradient: "from-rose-500 to-pink-600", bg: "bg-rose-50", text: "text-rose-600", border: "border-rose-200", shadow: "shadow-rose-200/50", ring: "ring-rose-500/20" },
  { gradient: "from-indigo-500 to-blue-600", bg: "bg-indigo-50", text: "text-indigo-600", border: "border-indigo-200", shadow: "shadow-indigo-200/50", ring: "ring-indigo-500/20" },
];

export function FacilitiesSection() {
  const { data: facilities = [], isLoading } = useFacilities();

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
    <section className="py-20 lg:py-28 relative overflow-hidden">
      {/* Multi-color background blobs */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-violet-200/40 to-purple-200/30 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute top-1/2 right-0 w-80 h-80 bg-gradient-to-bl from-amber-200/40 to-orange-200/30 rounded-full blur-3xl translate-x-1/3" />
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-gradient-to-tr from-emerald-200/30 to-teal-200/20 rounded-full blur-3xl translate-y-1/3" />
        <div className="absolute top-1/4 left-1/2 w-72 h-72 bg-gradient-to-br from-sky-200/30 to-blue-200/20 rounded-full blur-3xl" />
        {/* Dot pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
      </div>

      <div className="container relative">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 border border-emerald-200/60 rounded-full mb-6">
            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 animate-pulse" />
            <span className="text-sm font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Our Infrastructure</span>
          </div>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-5">
            World-Class{" "}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-600 bg-clip-text text-transparent">Infrastructure</span>
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 8C50 2 150 2 198 8" stroke="url(#infra-grad)" strokeWidth="3" strokeLinecap="round"/>
                <defs><linearGradient id="infra-grad" x1="0" y1="0" x2="200" y2="0"><stop stopColor="#10b981"/><stop offset="0.5" stopColor="#14b8a6"/><stop offset="1" stopColor="#06b6d4"/></linearGradient></defs>
              </svg>
            </span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            State-of-the-art facilities designed to inspire creativity, foster innovation, and support comprehensive learning
          </p>
        </div>

        {/* Facilities Grid */}
        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-3xl overflow-hidden animate-pulse shadow-sm">
                <div className="h-52 bg-gray-100" />
                <div className="p-6">
                  <div className="h-6 bg-gray-100 rounded-lg w-3/4 mb-3" />
                  <div className="h-4 bg-gray-100 rounded-lg w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {displayFacilities.slice(0, 6).map((facility, index) => {
              const theme = cardThemes[index % cardThemes.length];
              const IconComponent = iconMap[facility.icon_name || "Building"] || Building;
              return (
                <div
                  key={facility.id}
                  className="group relative bg-white rounded-3xl overflow-hidden border border-gray-100 hover:border-transparent transition-all duration-500 hover:-translate-y-2"
                  style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = `0 20px 40px -12px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.02)`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)';
                  }}
                >
                  {/* Gradient top accent */}
                  <div className={`h-1.5 bg-gradient-to-r ${theme.gradient}`} />

                  {/* Image */}
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={facility.image_url || "/placeholder.svg"}
                      alt={facility.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500`} />
                    
                    {/* Floating icon badge */}
                    <div className={`absolute bottom-4 left-4 w-14 h-14 rounded-2xl bg-gradient-to-br ${theme.gradient} flex items-center justify-center shadow-lg ring-4 ring-white/30 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                      <IconComponent className="w-7 h-7 text-white" />
                    </div>

                    {/* Decorative corner circle */}
                    <div className={`absolute -top-6 -right-6 w-24 h-24 rounded-full bg-gradient-to-br ${theme.gradient} opacity-0 group-hover:opacity-20 transition-all duration-500 group-hover:-top-3 group-hover:-right-3`} />
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="font-heading text-xl font-bold text-gray-900 mb-2 group-hover:bg-gradient-to-r group-hover:from-gray-900 group-hover:to-gray-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                      {facility.title}
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed mb-4">
                      {facility.description}
                    </p>
                    <div className={`flex items-center gap-2 text-sm font-semibold ${theme.text} opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0`}>
                      <span>Learn More</span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* CTA */}
        <div className="text-center mt-14">
          <Button asChild className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-700 hover:via-teal-700 hover:to-cyan-700 text-white rounded-full px-8 py-6 text-base font-semibold shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 transition-all duration-300 hover:-translate-y-0.5">
            <Link to="/infrastructure">
              <Sparkles className="w-5 h-5 mr-2" />
              Explore All Infrastructure
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
