import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Link } from "react-router-dom";
import { Award, Target, Eye, Users, Heart, GraduationCap, CheckCircle, Loader2, Star, Shield, Lightbulb, Calendar, TrendingUp, Flag, Rocket, BookOpen, Trophy, Zap, Globe, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormattedContent } from "@/components/ui/formatted-content";
import { useAboutContent, useHighlightCards, useSiteSettings, useCoreValues, useMilestones, useStatistics } from "@/hooks/use-school-data";
import SEOHead, { buildBreadcrumbSchema } from "@/components/SEOHead";

const iconMap: Record<string, any> = {
  Award,
  Heart,
  Users,
  GraduationCap,
  Star,
  Shield,
  Target,
  Lightbulb,
  CheckCircle,
  Calendar,
  TrendingUp,
};

const milestoneIcons = [Flag, Rocket, BookOpen, Trophy, Star, Zap, Globe, Award, GraduationCap, TrendingUp];

const milestoneColors = [
  { node: "from-violet-500 to-purple-600",  ring: "ring-violet-300",  glow: "shadow-violet-400/50",  badge: "bg-violet-50 text-violet-700 border-violet-200",  connector: "from-violet-400" },
  { node: "from-blue-500 to-cyan-600",      ring: "ring-blue-300",    glow: "shadow-blue-400/50",    badge: "bg-blue-50 text-blue-700 border-blue-200",          connector: "from-cyan-400" },
  { node: "from-emerald-500 to-teal-600",   ring: "ring-emerald-300", glow: "shadow-emerald-400/50", badge: "bg-emerald-50 text-emerald-700 border-emerald-200",  connector: "from-teal-400" },
  { node: "from-amber-500 to-orange-600",   ring: "ring-amber-300",   glow: "shadow-amber-400/50",   badge: "bg-amber-50 text-amber-700 border-amber-200",        connector: "from-orange-400" },
  { node: "from-rose-500 to-pink-600",      ring: "ring-rose-300",    glow: "shadow-rose-400/50",    badge: "bg-rose-50 text-rose-700 border-rose-200",          connector: "from-pink-400" },
  { node: "from-indigo-500 to-blue-600",    ring: "ring-indigo-300",  glow: "shadow-indigo-400/50",  badge: "bg-indigo-50 text-indigo-700 border-indigo-200",    connector: "from-indigo-400" },
];

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

export function AboutUs() {
  const { data: settings } = useSiteSettings();
  const { data: about, isLoading: aboutLoading } = useAboutContent();
  const { data: highlights = [] } = useHighlightCards();
  const { data: coreValues = [] } = useCoreValues();
  const { data: milestones = [] } = useMilestones();
  const { data: statistics = [] } = useStatistics();

  const schoolName = settings?.school_name || "";
  const tagline = settings?.tagline || "";
  const yearsOfExcellence = about?.years_of_excellence || 25;
  const foundingYear = new Date().getFullYear() - yearsOfExcellence;

  const siteUrl = settings?.site_url || "";

  return (
    <div className="min-h-screen">
      <SEOHead
        title="About Us"
        description={`Learn about ${schoolName} — our history, vision, mission, and core values. A trusted school in Beawar, Rajasthan shaping students since ${foundingYear}.`}
        keywords={`about ${schoolName}, school history Beawar, vision mission, core values, Rajasthan school`}
        jsonLd={buildBreadcrumbSchema(siteUrl, [{ name: "Home", path: "/" }, { name: "About Us", path: "/about" }])}
      />
      <Header />
      <main>
        {/* Hero */}
        <section className="pt-32 pb-20 bg-gradient-to-b from-primary to-primary-dark relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.2),transparent_50%)]" />
          </div>
          <div className="container relative text-center">
            <span className="inline-block px-4 py-2 bg-primary-foreground/10 text-primary-foreground rounded-full text-sm font-medium mb-4">
              About Us
            </span>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6">
              Shaping Futures Since {foundingYear}
            </h1>
              <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto break-words">
                Discover the story, mission, and values that drive {schoolName}'s commitment to excellence in education.
              </p>
          </div>
        </section>

          {/* Our Story */}
          <section className="py-24 bg-gradient-to-br from-slate-50 via-white to-primary/5 relative overflow-hidden">
            {/* Decorative blobs */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/8 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent/8 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-primary/4 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

            <div className="container relative z-10">
              {/* Section Label */}
              <div className="flex items-center justify-center gap-4 mb-16">
                <div className="h-px w-16 bg-gradient-to-r from-transparent to-primary/60" />
                <span className="inline-flex items-center gap-2 px-5 py-2 bg-primary/10 border border-primary/20 text-primary rounded-full text-sm font-semibold tracking-wider uppercase">
                  <GraduationCap className="w-4 h-4" />
                  Our Story
                </span>
                <div className="h-px w-16 bg-gradient-to-l from-transparent to-primary/60" />
              </div>

              {aboutLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : (
                  <div className="grid lg:grid-cols-2 gap-14 items-start">

                      {/* ── Left Column: Image first, History text below ── */}
                      <div className="flex flex-col gap-6 order-2 lg:order-1">

                        {/* Image — no color overlay */}
                        <div className="relative group">
                          {/* Decorative shadow halo */}
                          <div className="absolute -inset-3 rounded-[2.5rem] bg-gradient-to-br from-primary/20 via-accent/10 to-primary-dark/15 blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500 pointer-events-none" />
                          {/* Dashed decorative rings */}
                          <div className="absolute -inset-1.5 rounded-[2.25rem] border-2 border-dashed border-primary/25 -rotate-1 group-hover:rotate-0 transition-transform duration-500 pointer-events-none" />
                          <div className="absolute -inset-1.5 rounded-[2.25rem] border-2 border-dashed border-accent/20 rotate-1 group-hover:rotate-0 transition-transform duration-500 delay-75 pointer-events-none" />

                          <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white">
                            <img
                              src={about?.main_image_url || "/hero_campus.png"}
                              alt={schoolName}
                              className="w-full aspect-[4/3] object-cover transform transition-transform duration-700 group-hover:scale-105"
                            />
                            {/* Established badge */}
                            <div className="absolute bottom-4 left-4 flex items-center gap-2.5 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-xl border border-slate-100">
                              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
                                <Calendar className="w-3.5 h-3.5 text-primary-foreground" />
                              </div>
                              <div>
                                <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500 leading-none mb-0.5">Established</p>
                                <p className="font-heading text-base font-black text-primary leading-none">{foundingYear}</p>
                              </div>
                            </div>
                              {/* Top-right pill — shown only when tagline is set in Site Settings */}
                              {tagline && (
                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-primary text-[10px] font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full shadow-md border border-primary/15">
                                  {tagline}
                                </div>
                              )}
                          </div>
                        </div>

                        {/* History Card */}
                        <div className="relative bg-white rounded-[1.75rem] border border-slate-100 shadow-lg overflow-hidden">
                          {/* Top gradient stripe */}
                          <div className="h-1 w-full bg-gradient-to-r from-primary via-accent to-primary-dark" />
                          <div className="p-7">
                            <div className="flex items-center gap-3 mb-4">
                              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                                <TrendingUp className="w-4 h-4 text-primary" />
                              </div>
                              <span className="text-sm font-bold uppercase tracking-widest text-primary"></span>
                            </div>
                            {/* Subtle divider */}
                            <div className="w-10 h-0.5 bg-gradient-to-r from-primary to-accent rounded-full mb-4" />
                            <div className="text leading-relaxed text-[0.96rem]">
                              <FormattedContent
                                content={about?.history_text || `${schoolName} was established in ${foundingYear} with a dream to nurture young minds in Beawar, Rajasthan. What began as a small institution has grown into one of the region's most respected centres of learning — blending tradition with modern pedagogy, and shaping thousands of students into confident, compassionate leaders.`}
                              />
                            </div>
                          </div>
                        </div>

                      </div>

                    {/* ── Right Column: Heading + Description + Stats ── */}
                    <div className="order-1 lg:order-2 relative">
                      <span className="absolute -top-6 -left-4 text-[8rem] font-serif leading-none text-primary/8 select-none pointer-events-none">"</span>

                      <div className="relative bg-white rounded-[2rem] border border-primary/12 shadow-xl shadow-primary/5 overflow-hidden">
                        <div className="h-1.5 w-full bg-gradient-to-r from-primary via-accent to-primary-dark" />

                        <div className="p-8 md:p-10">
                          <h2 className="font-heading text-3xl md:text-4xl lg:text-[2.6rem] font-extrabold text-foreground mb-4 leading-tight">
                            {about?.main_heading || "A Legacy of Educational Excellence"}
                          </h2>

                          <div className="w-14 h-1 bg-gradient-to-r from-primary to-accent rounded-full mb-6" />

                          <div className="text leading-relaxed text-[1.04rem] mb-8">
                            <FormattedContent
                              content={about?.main_description || `Founded in ${foundingYear} by visionary educators, ${schoolName} began with a simple mission: to provide world-class education that empowers students to reach their full potential.`}
                            />
                          </div>

                          {/* Statistics grid */}
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6 border-t border-border/40">
                            {statistics.length > 0 ? (
                              statistics.map((stat) => (
                                <div
                                  key={stat.id}
                                  className="group/stat bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/10 rounded-2xl p-4 text-center hover:border-primary/30 hover:shadow-md transition-all duration-300"
                                >
                                  <p className="font-heading text-2xl md:text-3xl font-black text-primary leading-none mb-1">
                                    {stat.value}<span className="text-accent text-xl">{stat.suffix}</span>
                                  </p>
                                    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-600">{stat.label}</p>
                                </div>
                              ))
                            ) : (
                              <>
                                <div className="bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/10 rounded-2xl p-4 text-center">
                                  <p className="font-heading text-2xl md:text-3xl font-black text-primary leading-none mb-1">
                                    {yearsOfExcellence}<span className="text-accent text-xl">+</span>
                                  </p>
                                    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-600">Years of Glory</p>
                                  </div>
                                  <div className="bg-gradient-to-br from-accent/5 to-primary/5 border border-accent/10 rounded-2xl p-4 text-center">
                                    <p className="font-heading text-2xl md:text-3xl font-black text-accent-dark leading-none mb-1">
                                      1500<span className="text-primary text-xl">+</span>
                                    </p>
                                    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-600">Global Alumni</p>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
              )}
            </div>
          </section>

          {/* Timeline — Our Journey */}
          <section className="py-24 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #0a0a1a 0%, #0d1b3e 35%, #0a1628 65%, #0f0a1e 100%)" }}>

              {/* Animated mesh grid overlay */}
              <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
                style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />

              {/* Ambient glow orbs */}
              <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)" }} />
              <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%)" }} />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] rounded-full pointer-events-none" style={{ background: "radial-gradient(ellipse, rgba(139,92,246,0.08) 0%, transparent 70%)" }} />

              {/* Floating particles */}
              {[...Array(18)].map((_, i) => (
                <div key={i} className="absolute rounded-full animate-pulse pointer-events-none"
                  style={{
                    width: `${2 + (i % 3)}px`, height: `${2 + (i % 3)}px`,
                    background: ["rgba(139,92,246,0.6)","rgba(59,130,246,0.6)","rgba(16,185,129,0.6)","rgba(245,158,11,0.6)"][i % 4],
                    top: `${10 + (i * 17) % 80}%`, left: `${5 + (i * 13) % 90}%`,
                    animationDelay: `${(i * 0.4) % 3}s`, animationDuration: `${2 + (i % 3)}s`,
                  }} />
              ))}

              <div className="container relative z-10">

                {/* Section Header */}
                <div className="text-center mb-20">
                  <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-white/15 mb-6"
                    style={{ background: "rgba(255,255,255,0.05)", backdropFilter: "blur(12px)" }}>
                    <div className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
                    <span className="text-white/70 text-xs font-bold tracking-[0.25em] uppercase">Our Journey</span>
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" style={{ animationDelay: "1s" }} />
                  </div>
                  <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-black text-white mb-5 leading-tight">
                    Milestones That{" "}
                    <span className="relative inline-block">
                      <span style={{ background: "linear-gradient(135deg, #818cf8, #34d399, #fbbf24)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                        Define Us
                      </span>
                      <span className="absolute -bottom-1 left-0 w-full h-0.5 rounded-full" style={{ background: "linear-gradient(90deg, #818cf8, #34d399, #fbbf24)" }} />
                    </span>
                  </h2>
                  <p className="text-white text-lg max-w-xl mx-auto font-bold">
                    {yearsOfExcellence}+ years of unwavering commitment to shaping exceptional futures
                  </p>
                </div>

                {milestones.length > 0 ? (
                  <div className="relative">
                    <div className="overflow-x-auto pb-4" style={{ scrollbarWidth: "none" }}>
                      <div className="relative" style={{ minWidth: `${Math.max(milestones.length * 200, 900)}px`, padding: "0 60px" }}>
                        <div className="absolute left-[60px] right-[60px]" style={{ top: "calc(50% - 1px)", height: "2px", background: "linear-gradient(90deg, transparent, rgba(99,102,241,0.3), rgba(139,92,246,0.5), rgba(16,185,129,0.5), rgba(245,158,11,0.3), transparent)" }} />
                        <div className="absolute" style={{
                          top: "calc(50% - 2px)", left: "60px", height: "4px", width: "80px",
                          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)",
                          borderRadius: "9999px",
                          animation: "railTravel 4s linear infinite",
                        }} />
                        <div className="flex items-center justify-between" style={{ gap: 0 }}>
                          {milestones.map((milestone, index) => {
                            const isAbove = index % 2 === 0;
                            const colors = [
                              { node: "from-violet-500 to-purple-600", glow: "rgba(139,92,246,0.5)", badge: "#7c3aed", light: "rgba(139,92,246,0.1)", border: "rgba(139,92,246,0.3)", text: "#c4b5fd" },
                              { node: "from-blue-500 to-cyan-500",     glow: "rgba(59,130,246,0.5)",  badge: "#2563eb", light: "rgba(59,130,246,0.1)",  border: "rgba(59,130,246,0.3)",  text: "#93c5fd" },
                              { node: "from-emerald-500 to-teal-500",  glow: "rgba(16,185,129,0.5)",  badge: "#059669", light: "rgba(16,185,129,0.1)",  border: "rgba(16,185,129,0.3)",  text: "#6ee7b7" },
                              { node: "from-amber-500 to-orange-500",  glow: "rgba(245,158,11,0.5)",  badge: "#d97706", light: "rgba(245,158,11,0.1)",  border: "rgba(245,158,11,0.3)",  text: "#fcd34d" },
                              { node: "from-rose-500 to-pink-500",     glow: "rgba(244,63,94,0.5)",   badge: "#e11d48", light: "rgba(244,63,94,0.1)",   border: "rgba(244,63,94,0.3)",   text: "#fda4af" },
                              { node: "from-indigo-500 to-sky-500",    glow: "rgba(99,102,241,0.5)",  badge: "#4338ca", light: "rgba(99,102,241,0.1)",  border: "rgba(99,102,241,0.3)",  text: "#a5b4fc" },
                            ];
                            const c = colors[index % colors.length];
                            const MIcon = milestoneIcons[index % milestoneIcons.length];
                            return (
                              <div key={milestone.id} className="flex flex-col items-center group" style={{ flex: 1 }}>
                                <div className={`w-full px-2 transition-all duration-500 ${isAbove ? "opacity-100" : "opacity-0 pointer-events-none"}`}
                                  style={{ marginBottom: isAbove ? "20px" : "0" }}>
                                  {isAbove && (
                                    <div className="group-hover:scale-105 group-hover:-translate-y-1 transition-all duration-400 rounded-2xl border p-4 text-center"
                                      style={{ background: c.light, borderColor: c.border, backdropFilter: "blur(12px)", boxShadow: `0 4px 24px ${c.glow}` }}>
                                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black tracking-wider mb-2.5"
                                        style={{ background: c.badge, color: "#fff", letterSpacing: "0.1em" }}>
                                        <MapPin className="w-2.5 h-2.5" />
                                        {milestone.year}
                                      </div>
                                      <p className="text-white/85 text-xs font-medium leading-snug">{milestone.event}</p>
                                    </div>
                                  )}
                                </div>
                                <div className="relative flex flex-col items-center" style={{ zIndex: 10 }}>
                                  {isAbove && (
                                    <div className="w-px h-5" style={{ background: `linear-gradient(to bottom, transparent, ${c.badge})` }} />
                                  )}
                                  <div className="absolute rounded-full opacity-0 group-hover:opacity-100 transition-all duration-700"
                                    style={{ inset: "-8px", border: `2px solid ${c.badge}`, borderRadius: "9999px" }} />
                                  <div className={`relative w-14 h-14 rounded-full bg-gradient-to-br ${c.node} flex items-center justify-center border-2 border-white/20 group-hover:scale-110 transition-transform duration-300`}
                                    style={{ boxShadow: `0 0 20px ${c.glow}, 0 0 40px ${c.glow}33, inset 0 1px 0 rgba(255,255,255,0.3)` }}>
                                    <div className="absolute inset-0 rounded-full animate-ping opacity-20" style={{ background: c.badge }} />
                                    <MIcon className="w-5 h-5 text-white relative z-10 drop-shadow" />
                                  </div>
                                  {!isAbove && (
                                    <div className="w-px h-5" style={{ background: `linear-gradient(to bottom, ${c.badge}, transparent)` }} />
                                  )}
                                </div>
                                <div className={`w-full px-2 transition-all duration-500 ${!isAbove ? "opacity-100" : "opacity-0 pointer-events-none"}`}
                                  style={{ marginTop: !isAbove ? "20px" : "0" }}>
                                  {!isAbove && (
                                    <div className="group-hover:scale-105 group-hover:translate-y-1 transition-all duration-400 rounded-2xl border p-4 text-center"
                                      style={{ background: c.light, borderColor: c.border, backdropFilter: "blur(12px)", boxShadow: `0 4px 24px ${c.glow}` }}>
                                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black tracking-wider mb-2.5"
                                        style={{ background: c.badge, color: "#fff", letterSpacing: "0.1em" }}>
                                        <MapPin className="w-2.5 h-2.5" />
                                        {milestone.year}
                                      </div>
                                      <p className="text-white/85 text-xs font-medium leading-snug">{milestone.event}</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-10 px-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "rgba(139,92,246,0.2)", border: "1px solid rgba(139,92,246,0.4)" }}>
                          <Flag className="w-3.5 h-3.5 text-violet-400" />
                        </div>
                        <div>
                          <p className="text-white/30 text-[10px] font-bold uppercase tracking-[0.2em]">Founded</p>
                          <p className="text-white/70 text-sm font-black">{foundingYear}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {milestones.map((_, i) => (
                          <div key={i} className="rounded-full transition-all duration-300"
                            style={{
                              width: i === milestones.length - 1 ? "20px" : "6px",
                              height: "6px",
                              background: i === milestones.length - 1
                                ? "linear-gradient(90deg, #818cf8, #34d399)"
                                : `rgba(255,255,255,${0.15 + (i / milestones.length) * 0.4})`,
                            }} />
                        ))}
                      </div>
                      <div className="flex items-center gap-2.5">
                        <div>
                          <p className="text-white/30 text-[10px] font-bold uppercase tracking-[0.2em] text-right">Present</p>
                          <p className="text-white/70 text-sm font-black text-right">{new Date().getFullYear()}</p>
                        </div>
                        <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "rgba(16,185,129,0.2)", border: "1px solid rgba(16,185,129,0.4)" }}>
                          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-center text-white">No milestones added yet.</p>
                )}
              </div>

              <style>{`
                @keyframes railTravel {
                  0%   { left: 60px;  opacity: 0; }
                  5%   { opacity: 1; }
                  95%  { opacity: 1; }
                  100% { left: calc(100% - 140px); opacity: 0; }
                }
              `}</style>
            </section>

          {/* Mission & Vision */}
          <section className="py-24 bg-gradient-to-br from-secondary/30 via-background to-secondary/30 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_20%,rgba(var(--primary-rgb),0.05),transparent_50%),radial-gradient(circle_at_80%_80%,rgba(var(--accent-rgb),0.05),transparent_50%)]" />
          
          <div className="container relative">
            <div className="grid lg:grid-cols-2 gap-12 items-stretch">
              {/* Mission Card */}
              <div className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-primary/10 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative h-full bg-card p-10 rounded-3xl border border-border/50 shadow-xl backdrop-blur-sm flex flex-col">
                  <div className="flex items-start justify-between mb-8">
                    <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                      <Target className="w-10 h-10 text-primary" />
                    </div>
                    <span className="text-6xl font-bold text-primary/5 select-none">01</span>
                  </div>
                    <h3 className="font-heading text-3xl font-bold text-foreground mb-6 group-hover:text-primary transition-colors">
                      {about?.mission_title || "Our Mission"}
                    </h3>
                    <div className="flex-grow">
                      <FormattedContent 
                        content={about?.mission_text || "To provide holistic education that empowers students with knowledge, skills, and values to excel in a rapidly changing world while fostering a love for lifelong learning."} 
                      />
                    </div>
                  </div>
                </div>

                {/* Vision Card */}
                <div className="group relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-accent/20 to-accent/10 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                  <div className="relative h-full bg-card p-10 rounded-3xl border border-border/50 shadow-xl backdrop-blur-sm flex flex-col">
                    <div className="flex items-start justify-between mb-8">
                      <div className="w-20 h-20 rounded-2xl bg-accent/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                        <Eye className="w-10 h-10 text-accent-dark" />
                      </div>
                      <span className="text-6xl font-bold text-accent-dark/5 select-none">02</span>
                    </div>
                    <h3 className="font-heading text-3xl font-bold text-foreground mb-6 group-hover:text-accent-dark transition-colors">
                      {about?.vision_title || "Our Vision"}
                    </h3>
                    <div className="flex-grow">
                      <FormattedContent 
                        content={about?.vision_text || "To be a globally recognized institution that transforms education and creates leaders who make a positive impact on society through innovation and excellence."} 
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Core Values */}
          <section className="py-20 bg-background">
            <div className="container">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <span className="inline-block px-4 py-2 bg-accent-light text-accent-dark rounded-full text-sm font-medium mb-4">
                  Core Values
                </span>
                <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
                  The Pillars of Our Education
                </h2>
              </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  {coreValues.map((value, index) => {
                    const IconComponent = iconMap[value.icon_name || "Award"] || Award;
                    const style = cardStyles[index % cardStyles.length];
                    return (
                      <div 
                        key={value.id} 
                        className={`group relative p-8 rounded-3xl border ${style.border} ${style.light} ${style.hoverBorder} ${style.shadow} transition-all duration-500 hover:-translate-y-2 overflow-hidden`}
                      >
                        {/* Decorative Gradient Background */}
                        <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${style.gradient} rounded-bl-full -mr-16 -mt-16 transition-transform duration-500 group-hover:scale-150 opacity-50`} />
                        
                        <div className="relative z-10">
                          <div className={`w-16 h-16 rounded-2xl ${style.iconBg} flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-500`}>
                            <IconComponent className={`w-8 h-8 ${style.iconText}`} />
                          </div>
                          <h3 className="font-heading text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                            {value.title}
                          </h3>
                            <div className="text-slate-700 leading-relaxed">
                            <FormattedContent content={value.description || ""} />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
            </div>
          </section>

          {/* Why Choose Us */}
        {highlights.length > 0 && (
          <section className="py-20 bg-background">
            <div className="container">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
                  Why Choose {schoolName}?
                </h2>
              </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  {highlights.map((card, index) => {
                    const IconComponent = iconMap[card.icon_name || "CheckCircle"] || CheckCircle;
                    // Use cardStyles in reverse order for variety
                    const style = cardStyles[(cardStyles.length - 1 - index) % cardStyles.length];
                    return (
                      <div 
                        key={card.id} 
                        className={`group p-8 rounded-[2rem] bg-card border border-border hover:border-transparent ${style.shadow} transition-all duration-500 hover:-translate-y-2 relative overflow-hidden`}
                      >
                        {/* Hover Gradient Overlay */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${style.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                        
                        <div className="relative z-10">
                          <div className={`w-14 h-14 rounded-2xl ${style.iconBg} flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-sm`}>
                            <IconComponent className={`w-7 h-7 ${style.iconText}`} />
                          </div>
                            <h3 className="font-heading text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                              {card.title}
                            </h3>
                              <p className="text-slate-700 leading-relaxed break-words">
                              {card.description}
                            </p>
                          </div>

                        {/* Bottom Accent Line */}
                        <div className={`absolute bottom-0 left-0 h-1.5 w-0 bg-gradient-to-r ${style.gradient.replace('/20', '')} transition-all duration-500 group-hover:w-full`} />
                      </div>
                    );
                  })}
                </div>
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="py-20 bg-secondary/50">
          <div className="container text-center">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-6">
              Ready to Join Our Family?
            </h2>
              <p className="text-slate-700 mb-8 max-w-2xl mx-auto">
              Begin your child's journey to success with {schoolName}. Apply now or schedule a campus visit.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg" asChild>
                <Link to="/admissions/process">Apply Now</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/contact">Schedule a Visit</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default AboutUs;
