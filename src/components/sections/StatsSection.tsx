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
      { threshold: 0.5 }
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
    <div ref={ref} className="font-heading text-4xl md:text-5xl font-bold text-primary-foreground">
      {count.toLocaleString()}{suffix}
    </div>
  );
}

export function StatsSection() {
  const { data: stats = [], isLoading } = useStatistics();

  // Fallback stats if none in database
  const defaultStats = [
    { id: "1", label: "Students", value: 1500, suffix: "+", icon_name: "Users" },
    { id: "2", label: "Expert Teachers", value: 120, suffix: "+", icon_name: "GraduationCap" },
    { id: "3", label: "Years of Excellence", value: 25, suffix: "+", icon_name: "Calendar" },
    { id: "4", label: "Success Rate", value: 98, suffix: "%", icon_name: "TrendingUp" },
  ];

  const displayStats = stats.length > 0 ? stats : defaultStats;

  if (isLoading) {
    return (
      <section className="py-16 lg:py-20 bg-primary">
        <div className="container">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="text-center animate-pulse">
                <div className="h-12 bg-primary-foreground/20 rounded w-24 mx-auto mb-2" />
                <div className="h-4 bg-primary-foreground/20 rounded w-32 mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 lg:py-20 bg-primary relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.2),transparent_50%)]" />
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_50%,rgba(255,255,255,0.1),transparent_40%)]" />
      </div>

      <div className="container relative">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {displayStats.map((stat) => {
            const IconComponent = iconMap[stat.icon_name || "Users"] || Users;
            return (
              <div key={stat.id} className="text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary-foreground/10 mb-4">
                  <IconComponent className="w-7 h-7 text-accent" />
                </div>
                <AnimatedCounter value={stat.value} suffix={stat.suffix || ""} />
                <p className="text-primary-foreground/80 mt-2 font-medium">
                  {stat.label}
                </p>
                <div className="w-10 h-1 bg-accent mx-auto mt-3 rounded-full" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
