import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, GraduationCap, Award, Baby, Lightbulb, Users, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormattedContent } from "@/components/ui/formatted-content";
import { useAcademicPrograms } from "@/hooks/use-school-data";

const iconMap: Record<string, React.ElementType> = {
  BookOpen, GraduationCap, Award, Baby, Lightbulb, Users
};

const cardColors = [
  {
    gradient: "from-violet-500 to-purple-600",
    light: "bg-violet-50",
    text: "text-violet-600",
    border: "border-violet-200",
    ring: "ring-violet-100",
    badge: "bg-violet-100 text-violet-700",
    shadow: "hover:shadow-violet-200/50",
    iconBg: "bg-violet-500",
    stripe: "from-violet-500 to-purple-500",
  },
  {
    gradient: "from-amber-500 to-orange-600",
    light: "bg-amber-50",
    text: "text-amber-600",
    border: "border-amber-200",
    ring: "ring-amber-100",
    badge: "bg-amber-100 text-amber-700",
    shadow: "hover:shadow-amber-200/50",
    iconBg: "bg-amber-500",
    stripe: "from-amber-500 to-orange-500",
  },
  {
    gradient: "from-emerald-500 to-teal-600",
    light: "bg-emerald-50",
    text: "text-emerald-600",
    border: "border-emerald-200",
    ring: "ring-emerald-100",
    badge: "bg-emerald-100 text-emerald-700",
    shadow: "hover:shadow-emerald-200/50",
    iconBg: "bg-emerald-500",
    stripe: "from-emerald-500 to-teal-500",
  },
  {
    gradient: "from-sky-500 to-blue-600",
    light: "bg-sky-50",
    text: "text-sky-600",
    border: "border-sky-200",
    ring: "ring-sky-100",
    badge: "bg-sky-100 text-sky-700",
    shadow: "hover:shadow-sky-200/50",
    iconBg: "bg-sky-500",
    stripe: "from-sky-500 to-blue-500",
  },
  {
    gradient: "from-rose-500 to-pink-600",
    light: "bg-rose-50",
    text: "text-rose-600",
    border: "border-rose-200",
    ring: "ring-rose-100",
    badge: "bg-rose-100 text-rose-700",
    shadow: "hover:shadow-rose-200/50",
    iconBg: "bg-rose-500",
    stripe: "from-rose-500 to-pink-500",
  },
  {
    gradient: "from-indigo-500 to-blue-700",
    light: "bg-indigo-50",
    text: "text-indigo-600",
    border: "border-indigo-200",
    ring: "ring-indigo-100",
    badge: "bg-indigo-100 text-indigo-700",
    shadow: "hover:shadow-indigo-200/50",
    iconBg: "bg-indigo-500",
    stripe: "from-indigo-500 to-blue-700",
  },
];

export function AcademicsSection() {
  const { data: programs = [], isLoading } = useAcademicPrograms();

  const defaultPrograms = [
    { id: "1", title: "Pre-Primary", subtitle: "Ages 3-5", description: "Foundation years focusing on play-based learning", icon_name: "Baby" },
    { id: "2", title: "Primary School", subtitle: "Grades 1-5", description: "Building strong academic foundations", icon_name: "BookOpen" },
    { id: "3", title: "Secondary School", subtitle: "Grades 6-10", description: "Comprehensive education for higher studies", icon_name: "GraduationCap" },
    { id: "4", title: "Higher Secondary", subtitle: "Grades 11-12", description: "Specialized streams in Science, Commerce, Arts", icon_name: "Award" },
  ];

  const displayPrograms = programs.length > 0 ? programs : defaultPrograms;

  return (
    <section className="py-20 lg:py-28 relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* Decorative background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-200/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-200/20 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-100/10 rounded-full blur-[120px]" />
        {/* Dot grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }} />
      </div>

      <div className="container relative">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-violet-100 via-purple-50 to-pink-100 border border-violet-200/60 mb-6">
            <Sparkles className="w-4 h-4 text-violet-600" />
            <span className="text-sm font-semibold bg-gradient-to-r from-violet-700 to-purple-600 bg-clip-text text-transparent">
              Academic Excellence
            </span>
          </div>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-5">
            Our{" "}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Academic Programs
              </span>
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
                <path d="M2 8C50 3 100 2 150 5C200 8 250 4 298 7" stroke="url(#underline-grad)" strokeWidth="3" strokeLinecap="round" />
                <defs>
                  <linearGradient id="underline-grad" x1="0" y1="0" x2="300" y2="0">
                    <stop stopColor="#8b5cf6" />
                    <stop offset="0.5" stopColor="#a855f7" />
                    <stop offset="1" stopColor="#ec4899" />
                  </linearGradient>
                </defs>
              </svg>
            </span>
          </h2>
          <p className="text-gray-500 text-lg mt-4 leading-relaxed">
            Comprehensive curriculum designed to nurture every student's potential from early years to higher studies
          </p>
        </div>

        {/* Programs Grid */}
        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-7">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-3xl p-6 animate-pulse shadow-sm">
                <div className="w-full h-48 bg-gray-100 rounded-2xl mb-5" />
                <div className="h-6 bg-gray-100 rounded-lg w-3/4 mb-3" />
                <div className="h-4 bg-gray-100 rounded-lg w-1/2 mb-4" />
                <div className="h-16 bg-gray-100 rounded-lg" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-7">
            {displayPrograms.map((program, index) => {
              const IconComponent = iconMap[program.icon_name || "BookOpen"] || BookOpen;
              const color = cardColors[index % cardColors.length];
              const firstParagraph = (program.description || "").split(/\n+/).filter(p => p.trim())[0] || "";

              return (
                <Link
                  to="/academics"
                  key={program.id}
                  className={`group relative bg-white rounded-3xl border ${color.border} overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl ${color.shadow} flex flex-col`}
                >
                  {/* Top color stripe */}
                  <div className={`h-1.5 bg-gradient-to-r ${color.stripe}`} />

                  {/* Image */}
                  <div className="relative h-48 w-full overflow-hidden">
                    <img
                      src={program.image_url || `https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=800&auto=format&fit=crop`}
                      alt={program.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    {/* Gradient overlay on hover */}
                    <div className={`absolute inset-0 bg-gradient-to-t ${color.gradient} opacity-0 group-hover:opacity-40 transition-opacity duration-500`} />

                    {/* Floating icon badge */}
                    <div className={`absolute top-4 left-4 w-11 h-11 rounded-2xl ${color.iconBg} flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>

                    {/* Subtitle badge */}
                    {program.subtitle && (
                      <div className="absolute bottom-4 right-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${color.badge} backdrop-blur-sm shadow-sm`}>
                          {program.subtitle}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="font-heading text-xl font-bold text-gray-900 mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-gray-900 group-hover:to-gray-600 transition-colors duration-300">
                      {program.title}
                    </h3>

                    <div className="flex-grow">
                      <FormattedContent content={firstParagraph} className="text-sm text-gray-500 line-clamp-3 leading-relaxed" />
                    </div>

                    {/* Explore link */}
                    <div className={`inline-flex items-center gap-2 text-sm font-semibold ${color.text} mt-5 pt-4 border-t border-dashed ${color.border}`}>
                      <span>Explore Program</span>
                      <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                    </div>
                  </div>

                  {/* Corner decoration */}
                  <div className={`absolute -bottom-8 -right-8 w-24 h-24 rounded-full ${color.light} opacity-0 group-hover:opacity-60 transition-all duration-500 group-hover:-bottom-4 group-hover:-right-4`} />
                </Link>
              );
            })}
          </div>
        )}

        {/* CTA */}
        <div className="text-center mt-14">
          <Button
            variant="default"
            size="lg"
            asChild
            className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white shadow-lg shadow-violet-300/40 hover:shadow-xl hover:shadow-violet-300/50 rounded-full px-8 py-6 text-base font-semibold transition-all duration-300 hover:-translate-y-0.5"
          >
            <Link to="/academics">
              View Full Curriculum
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
