import { useState } from "react";
import { Quote, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTestimonials } from "@/hooks/use-school-data";

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { data: testimonials = [], isLoading } = useTestimonials();

  const goToPrev = () => {
    if (testimonials.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToNext = () => {
    if (testimonials.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

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

  const visibleTestimonials = [
    testimonials[currentIndex],
    testimonials[(currentIndex + 1) % testimonials.length],
    testimonials[(currentIndex + 2) % testimonials.length],
  ].filter(Boolean);

  return (
    <section className="py-20 lg:py-28 bg-secondary/50 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />

      <div className="container relative">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
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

        {/* Testimonials Carousel */}
        <div className="relative">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleTestimonials.map((testimonial, index) => (
              <div
                key={`${testimonial.id}-${index}`}
                className={cn(
                  "bg-card rounded-2xl p-6 lg:p-8 border-l-4 border-accent shadow-soft transition-all duration-300 hover:shadow-medium",
                  index === 2 && "hidden lg:block"
                )}
              >
                {/* Quote Icon */}
                <div className="mb-4">
                  <Quote className="w-10 h-10 text-primary-light" />
                </div>

                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-accent text-accent" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-foreground leading-relaxed mb-6 italic">
                  "{testimonial.quote}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-4">
                  {testimonial.author_image && (
                    <img
                      src={testimonial.author_image}
                      alt={testimonial.author_name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-accent"
                    />
                  )}
                  <div>
                    <p className="font-heading font-semibold text-foreground">
                      {testimonial.author_name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.author_role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex justify-center items-center gap-4 mt-10">
            <button
              onClick={goToPrev}
              className="p-3 rounded-full border border-border hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-200"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all duration-200",
                    index === currentIndex
                      ? "bg-primary w-6"
                      : "bg-border hover:bg-muted-foreground"
                  )}
                />
              ))}
            </div>
            <button
              onClick={goToNext}
              className="p-3 rounded-full border border-border hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-200"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
