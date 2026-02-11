import { useEffect, useState, useRef } from "react";
import { Users, GraduationCap, Calendar, TrendingUp, Award, BookOpen, Target } from "lucide-react";
import { useStatistics } from "@/hooks/use-school-data";

const iconMap: Record<string, React.ElementType> = {
  Users, GraduationCap, Calendar, TrendingUp, Award, BookOpen, Target
};

function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const duration = 2000;
    const steps = 60;
    const stepValue = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += stepValue;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [isVisible, value]);

  return (
    <div ref={ref} className="font-heading text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-b from-white to-white/70 bg-clip-text text-transparent">
      {count.toLocaleString()}{suffix}
    </div>
  );
}

export function StatsSection() {
  const { data: stats = [], isLoading } = useStatistics();

  const defaultStats = [
    { id: "1", label: "Students", value: 1500, suffix: "+", icon_name: "Users" },
    { id: "2", label: "Expert Teachers", value: 120, suffix: "+", icon_name: "GraduationCap" },
    { id: "3", label: "Years of Excellence", value: 25, suffix: "+", icon_name: "Calendar" },
    { id: "4", label: "Success Rate", value: 98, suffix: "%", icon_name: "TrendingUp" },
  ];

  const displayStats = stats.length > 0 ? stats : defaultStats;

  if (isLoading) {
    return (
      <section className="py-5 lg:py-5 bg-primary">
        <div className="container">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="text-center animate-pulse">
                <div className="h-16 w-16 bg-white/10 rounded-2xl mx-auto mb-4" />
                <div className="h-12 bg-white/10 rounded w-28 mx-auto mb-3" />
                <div className="h-4 bg-white/10 rounded w-32 mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

    return (
    <section className="py-7 lg:py-10 relative overflow-hidden bg-gray-50">
          {/* Decorative elements */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-1/4 w-72 h-72 bg-primary/5 rounded-full blur-3xl -translate-y-1/2" />
            <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-accent/5 rounded-full blur-3xl translate-y-1/2" />
          </div>

        <div className="container relative z-10">
          {/* Section header */}
          <div className="text-center mb-10">
              <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium tracking-wide uppercase mb-3 border border-primary/20">
                Our Achievements
              </span>
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-gray-800">
              Numbers That Speak for Themselves
            </h2>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {displayStats.map((stat, index) => {
              const IconComponent = iconMap[stat.icon_name || "Users"] || Users;
              return (
                <div
                  key={stat.id}
                  className="group relative"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Card */}
                    <div className="relative rounded-xl p-4 md:p-5 text-center transition-all duration-500 bg-gradient-to-br from-primary-dark to-primary border border-primary/30 hover:border-primary/50 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/20">
                      {/* Glow on hover */}
                      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-b from-white/10 to-transparent" />

                    {/* Icon */}
                    <div className="relative inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-accent/20 to-accent/5 border border-accent/20 mb-3 group-hover:scale-110 transition-transform duration-500">
                      <IconComponent className="w-5 h-5 text-accent" />
                    </div>

                    {/* Counter */}
                    <AnimatedCounter value={stat.value} suffix={stat.suffix || ""} />

                    {/* Label */}
                    <p className="text-white/60 mt-2 font-medium text-xs md:text-sm tracking-wide group-hover:text-white/80 transition-colors duration-300">
                      {stat.label}
                    </p>

                    {/* Bottom accent line */}
                    <div className="mt-3 mx-auto w-6 h-0.5 rounded-full bg-accent/40 group-hover:w-12 group-hover:bg-accent transition-all duration-500" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
  );
}
