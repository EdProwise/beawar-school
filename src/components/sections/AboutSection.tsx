import { Link } from "react-router-dom";
import { ArrowRight, Award, Users, Globe, Building, Star, Target, Heart, Lightbulb, Sparkles, CheckCircle2, GraduationCap, BookOpen, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormattedContent } from "@/components/ui/formatted-content";
import { useAboutContent, useHighlightCards } from "@/hooks/use-school-data";
import { CampusCTA } from "./CampusCTA";

const iconMap: Record<string, React.ElementType> = {
  Award, Users, Globe, Building, Star, Target, Heart, Lightbulb, GraduationCap, BookOpen, Trophy
};

// Vibrant multicolor themes for cards
const cardThemes = [
  { gradient: "from-violet-500 to-purple-600", iconBg: "bg-gradient-to-br from-violet-500 to-purple-600", border: "border-violet-200/60", hoverShadow: "hover:shadow-violet-200/40" },
  { gradient: "from-amber-500 to-orange-500", iconBg: "bg-gradient-to-br from-amber-500 to-orange-500", border: "border-amber-200/60", hoverShadow: "hover:shadow-amber-200/40" },
  { gradient: "from-emerald-500 to-teal-500", iconBg: "bg-gradient-to-br from-emerald-500 to-teal-500", border: "border-emerald-200/60", hoverShadow: "hover:shadow-emerald-200/40" },
  { gradient: "from-sky-500 to-blue-600", iconBg: "bg-gradient-to-br from-sky-500 to-blue-600", border: "border-sky-200/60", hoverShadow: "hover:shadow-sky-200/40" },
  { gradient: "from-rose-500 to-pink-500", iconBg: "bg-gradient-to-br from-rose-500 to-pink-500", border: "border-rose-200/60", hoverShadow: "hover:shadow-rose-200/40" },
  { gradient: "from-indigo-500 to-blue-500", iconBg: "bg-gradient-to-br from-indigo-500 to-blue-500", border: "border-indigo-200/60", hoverShadow: "hover:shadow-indigo-200/40" },
  { gradient: "from-cyan-500 to-teal-500", iconBg: "bg-gradient-to-br from-cyan-500 to-teal-500", border: "border-cyan-200/60", hoverShadow: "hover:shadow-cyan-200/40" },
  { gradient: "from-fuchsia-500 to-pink-600", iconBg: "bg-gradient-to-br from-fuchsia-500 to-pink-600", border: "border-fuchsia-200/60", hoverShadow: "hover:shadow-fuchsia-200/40" },
];

export function AboutSection() {
  const { data: about } = useAboutContent();
  const { data: highlights = [] } = useHighlightCards();

  return (
    <section className="py-24 lg:py-32 relative overflow-hidden">
      {/* Premium animated mesh background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-violet-50/80 via-white to-amber-50/40" />
      <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] bg-gradient-to-br from-violet-300/15 to-purple-300/10 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-gradient-to-br from-amber-300/15 to-orange-300/10 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '10s' }} />
      <div className="absolute top-[40%] left-[50%] w-[400px] h-[400px] bg-gradient-to-br from-emerald-300/10 to-teal-300/10 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '12s' }} />
      <div className="absolute top-[20%] right-[10%] w-[300px] h-[300px] bg-gradient-to-br from-sky-300/10 to-blue-300/10 rounded-full blur-[80px] animate-pulse" style={{ animationDuration: '9s' }} />

      {/* Decorative dot grid */}
      <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: 'radial-gradient(circle, #6366f1 1px, transparent 1px)', backgroundSize: '48px 48px' }} />

      <div className="container relative">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-white/80 backdrop-blur-sm border border-violet-200/50 shadow-sm shadow-violet-100/30 mb-8">
            <div className="w-6 h-6 rounded-full bg-gradient-to-r from-violet-500 to-purple-500 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm font-bold tracking-wide uppercase bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
              {about?.section_title || "About Us"}
            </span>
          </div>
          <h2 className="font-heading text-4xl md:text-5xl lg:text-[3.5rem] font-extrabold text-gray-900 mb-8 leading-[1.15] tracking-tight">
            {about?.main_heading ? (
              <span>{about.main_heading}</span>
            ) : (
              <>
                Welcome to Our{" "}
                <span className="relative inline-block">
                  <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">School</span>
                  <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none"><path d="M2 8C30 3 70 2 100 5C130 8 170 9 198 4" stroke="url(#grad1)" strokeWidth="3" strokeLinecap="round"/><defs><linearGradient id="grad1" x1="0" y1="0" x2="200" y2="0"><stop offset="0%" stopColor="#8b5cf6"/><stop offset="50%" stopColor="#f59e0b"/><stop offset="100%" stopColor="#10b981"/></linearGradient></defs></svg>
                </span>
              </>
            )}
          </h2>
          {/* Multicolor decorative line */}
          <div className="flex items-center justify-center gap-1.5">
            <div className="h-1 w-10 rounded-full bg-gradient-to-r from-violet-500 to-purple-500" />
            <div className="h-1.5 w-6 rounded-full bg-gradient-to-r from-amber-400 to-orange-500" />
            <div className="h-1 w-20 rounded-full bg-gradient-to-r from-emerald-400 via-sky-400 to-violet-500" />
            <div className="h-1.5 w-6 rounded-full bg-gradient-to-r from-rose-400 to-pink-500" />
            <div className="h-1 w-10 rounded-full bg-gradient-to-r from-sky-500 to-blue-500" />
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center mb-24">
          {/* Left - Image Showcase */}
          <div className="relative order-2 lg:order-1">
            {/* Main Image */}
            <div className="relative rounded-[2rem] overflow-hidden aspect-[4/3] shadow-2xl shadow-violet-200/30 ring-1 ring-black/5">
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 via-gray-900/20 to-transparent z-10" />
              <img
                  src={about?.main_image_url || "/hero_campus.png"}
                alt="Campus"
                className="w-full h-full object-cover"
                onError={(e) => {
                  const el = e.target as HTMLImageElement;
                  el.style.display = 'none';
                }}
              />
              {/* Floating glass badge */}
              <div className="absolute bottom-5 left-5 right-5 z-20">
                <div className="backdrop-blur-2xl bg-white/15 rounded-2xl p-5 border border-white/20">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-amber-400 to-orange-400 flex items-center justify-center">
                      <Trophy className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-white font-heading font-bold text-lg">Nurturing Future Leaders</p>
                  </div>
                  <p className="text-white/70 text-sm pl-11">Excellence in every dimension of education</p>
                </div>
              </div>
            </div>

            {/* Floating accent shapes */}
            <div className="absolute -top-6 -right-6 w-28 h-28 bg-gradient-to-br from-amber-400 to-orange-400 rounded-3xl opacity-15 rotate-12 blur-sm" />
            <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-full opacity-15 blur-sm" />
            <div className="absolute top-1/2 -right-4 w-12 h-12 bg-gradient-to-br from-sky-400 to-blue-400 rounded-xl opacity-20 -rotate-12" />

            {/* Years of Excellence floating card */}
            {about?.years_of_excellence && (
              <div className="absolute -top-4 -left-4 z-20 hidden lg:block">
                <div className="bg-white rounded-2xl p-4 shadow-xl shadow-violet-200/30 border border-violet-100/50">
                  <div className="text-center">
                    <span className="text-4xl font-black bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent font-heading">{about.years_of_excellence}+</span>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-1">Years of<br/>Excellence</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right - Content */}
          <div className="order-1 lg:order-2">
            {/* Multicolor accent bar */}
            <div className="flex gap-1 mb-8">
              <div className="w-1.5 h-16 rounded-full bg-gradient-to-b from-violet-500 to-purple-500" />
              <div className="w-1.5 h-16 rounded-full bg-gradient-to-b from-amber-400 to-orange-500 mt-2" />
              <div className="w-1.5 h-16 rounded-full bg-gradient-to-b from-emerald-400 to-teal-500 mt-4" />
            </div>

            <div className="space-y-6">
              <FormattedContent
                content={
                  about?.main_description
                    ? (() => {
                        const text = about.main_description;
                        const isHtml = /<[a-z][\s\S]*>/i.test(text);
                        if (isHtml) {
                          const paragraphs = text.split(/<\/p>/i).map(p => p.trim() ? p + "</p>" : "");
                          return paragraphs.slice(0, 10).join("");
                        }
                        return text.split('\n').slice(0, 10).join('\n');
                      })()
                    : "We provide quality education for all students."
                }
                className="text-lg leading-relaxed text-gray-600 [&>p]:mb-4"
              />

              {/* Mobile stats */}
              {about?.years_of_excellence && (
                <div className="flex lg:hidden">
                  <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-300/40">
                    <span className="text-3xl font-black font-heading">{about.years_of_excellence}+</span>
                    <span className="text-sm font-semibold text-white/90">Years of<br/>Excellence</span>
                  </div>
                </div>
              )}

              {/* Key highlights inline */}
              <div className="flex flex-wrap gap-3 pt-2">
                {["Quality Education", "Experienced Faculty", "Holistic Growth"].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm border border-gray-100">
                    <CheckCircle2 className={`w-4 h-4 ${["text-violet-500", "text-amber-500", "text-emerald-500"][i]}`} />
                    <span className="text-sm font-semibold text-gray-700">{item}</span>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <div className="pt-4">
                <Button
                  size="lg"
                  asChild
                  className="relative bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-700 hover:via-purple-700 hover:to-indigo-700 text-white shadow-xl shadow-violet-300/30 rounded-2xl px-10 h-14 text-base font-bold group overflow-hidden"
                >
                  <Link to="/about-us">
                    <span className="relative z-10 flex items-center">
                      Know More About Us
                      <ArrowRight className="w-5 h-5 ml-2.5 group-hover:translate-x-1.5 transition-transform duration-300" />
                    </span>
                    {/* Shimmer effect */}
                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Highlight Cards - Premium Multicolor Grid */}
        <div className="relative">
          <div className="text-center mb-12">
            <h3 className="font-heading text-2xl md:text-3xl font-bold text-gray-900 mb-3">Why Choose Us</h3>
            <p className="text-gray-500 max-w-lg mx-auto">Discover what makes our institution a beacon of excellence and innovation</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {highlights.length > 0 ? (
              highlights.map((card, index) => {
                const IconComponent = iconMap[card.icon_name || "Star"] || Star;
                const theme = cardThemes[index % cardThemes.length];
                return (
                  <div
                    key={card.id}
                    className={`group relative p-7 rounded-3xl border ${theme.border} bg-white/80 backdrop-blur-sm hover:bg-white hover:shadow-2xl ${theme.hoverShadow} transition-all duration-500 hover:-translate-y-2 overflow-hidden`}
                  >
                    <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${theme.gradient} opacity-80 group-hover:opacity-100 transition-opacity`} />
                    <div className={`w-16 h-16 rounded-2xl ${theme.iconBg} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-heading font-bold text-gray-900 mb-2.5 text-lg">{card.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{card.description}</p>
                    <div className={`absolute -bottom-8 -right-8 w-32 h-32 bg-gradient-to-br ${theme.gradient} opacity-0 group-hover:opacity-[0.06] rounded-full transition-all duration-500 group-hover:-bottom-4 group-hover:-right-4`} />
                  </div>
                );
              })
            ) : (
              <>
                {[
                  { icon: Users, title: "Expert Faculty", desc: "Experienced teachers dedicated to nurturing young minds and fostering academic success", idx: 0 },
                  { icon: Building, title: "Modern Facilities", desc: "State-of-the-art infrastructure designed for holistic and immersive learning", idx: 1 },
                  { icon: Award, title: "Holistic Development", desc: "Balanced focus on academics, athletics, arts, and character building", idx: 2 },
                  { icon: Globe, title: "Global Standards", desc: "International curriculum blended with values and cultural heritage", idx: 3 },
                ].map(({ icon: Icon, title, desc, idx }) => {
                  const theme = cardThemes[idx];
                  return (
                    <div key={idx} className={`group relative p-7 rounded-3xl border ${theme.border} bg-white/80 backdrop-blur-sm hover:bg-white hover:shadow-2xl ${theme.hoverShadow} transition-all duration-500 hover:-translate-y-2 overflow-hidden`}>
                      <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${theme.gradient} opacity-80 group-hover:opacity-100 transition-opacity`} />
                      <div className={`w-16 h-16 rounded-2xl ${theme.iconBg} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="font-heading font-bold text-gray-900 mb-2.5 text-lg">{title}</h3>
                      <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
                      <div className={`absolute -bottom-8 -right-8 w-32 h-32 bg-gradient-to-br ${theme.gradient} opacity-0 group-hover:opacity-[0.06] rounded-full transition-all duration-500 group-hover:-bottom-4 group-hover:-right-4`} />
                    </div>
                  );
                })}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Campus CTA */}
      <div className="container mt-20">
          <CampusCTA />
      </div>
    </section>
  );
}
