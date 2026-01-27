import { Quote, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTestimonials, Testimonial } from "@/hooks/use-school-data";
import { motion } from "framer-motion";

export function TestimonialsSection() {
  const { data: testimonials = [], isLoading } = useTestimonials();

  if (isLoading || testimonials.length === 0) {
    return (
      <section className="py-20 lg:py-28 bg-secondary/50">
        <div className="container">
          <div className="text-center">
            <div className="h-8 bg-secondary rounded w-48 mx-auto mb-4 animate-pulse" />
            <div className="h-12 bg-secondary rounded w-96 mx-auto animate-pulse" />
          </div>
        </div>
      </section>
    );
  }

    // Only take first 9 testimonials as requested
    const limitedTestimonials = testimonials.slice(0, 9);

    // Distribute testimonials into two rows
    let firstRow: Testimonial[] = [];
    let secondRow: Testimonial[] = [];

    if (limitedTestimonials.length <= 3) {
      firstRow = limitedTestimonials;
    } else {
      const midPoint = Math.ceil(limitedTestimonials.length / 2);
      firstRow = limitedTestimonials.slice(0, midPoint);
      secondRow = limitedTestimonials.slice(midPoint);
    }

    return (
      <section className="py-20 lg:py-28 bg-secondary/50 relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />

        <div className="container relative mb-16">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-block px-4 py-2 bg-primary-light text-primary rounded-full text-sm font-medium mb-4">
              Testimonials
            </span>
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              What Our <span className="text-gradient-primary">Community</span> Says
            </h2>
            <p className="text-muted-foreground text-lg">
              Hear from parents and students about their experience at Orbit School
            </p>
          </div>
        </div>

        {/* Testimonials Marquee */}
        <div className="flex flex-col gap-8">
          {firstRow.length > 0 && (
            <MarqueeRow 
              items={firstRow} 
              direction="right" 
              speed={40} 
            />
          )}
          
          {secondRow.length > 0 && (
            <MarqueeRow 
              items={secondRow} 
              direction="left" 
              speed={30} 
            />
          )}
        </div>
      </section>
    );
  }

  interface MarqueeRowProps {
    items: Testimonial[];
    direction: "left" | "right";
    speed: number;
  }

  function MarqueeRow({ items, direction, speed }: MarqueeRowProps) {
    // Double the items for a seamless loop
    const duplicatedItems = [...items, ...items];


  return (
    <div className="flex overflow-hidden select-none">
      <motion.div
        animate={{
          x: direction === "right" ? ["-50%", "0%"] : ["0%", "-50%"],
        }}
        transition={{
          duration: speed,
          repeat: Infinity,
          ease: "linear",
        }}
        className="flex gap-6 px-3"
      >
        {duplicatedItems.map((testimonial, index) => (
          <div
            key={`${testimonial.id}-${index}`}
            className={cn(
              "flex-shrink-0 w-[350px] md:w-[400px] bg-card rounded-2xl p-6 lg:p-8 border-l-4 border-accent shadow-soft transition-all duration-300 hover:shadow-medium"
            )}
          >
            {/* Quote Icon */}
            <div className="mb-4">
              <Quote className="w-8 h-8 text-primary-light" />
            </div>

            {/* Rating */}
            <div className="flex gap-1 mb-4">
              {Array.from({ length: testimonial.rating }).map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-accent text-accent" />
              ))}
            </div>

            {/* Quote */}
            <p className="text-foreground leading-relaxed mb-6 italic text-sm md:text-base line-clamp-4">
              "{testimonial.quote}"
            </p>

            {/* Author */}
            <div className="flex items-center gap-4">
              {testimonial.author_image && (
                <img
                  src={testimonial.author_image}
                  alt={testimonial.author_name}
                  className="w-10 h-10 rounded-full object-cover border-2 border-accent"
                />
              )}
              <div>
                <p className="font-heading font-semibold text-foreground text-sm">
                  {testimonial.author_name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {testimonial.author_role}
                </p>
              </div>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
