import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useHeroSlides } from "@/hooks/use-school-data";

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { data: slides = [], isLoading } = useHeroSlides();

  const goToNextSlide = useCallback(() => {
    if (slides.length === 0) return;
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const goToPrevSlide = () => {
    if (slides.length === 0) return;
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    if (slides.length === 0) return;
    const interval = setInterval(goToNextSlide, 5000);
    return () => clearInterval(interval);
  }, [slides.length, goToNextSlide]);

  if (isLoading) {
    return (
      <section className="relative min-h-[71vh] flex items-center justify-center bg-primary">
        <div className="animate-pulse text-primary-foreground">Loading...</div>
      </section>
    );
  }

  if (slides.length === 0) {
    return (
      <section className="relative min-h-[71vh] flex items-center justify-center bg-gradient-to-br from-primary-dark via-primary to-primary">
        <div className="text-center text-primary-foreground">
          <h1 className="font-heading text-4xl font-bold mb-4">Welcome</h1>
          <p>Configure hero slides in admin panel</p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-[71vh] flex items-center overflow-hidden">
      {/* Background Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={cn(
            "absolute inset-0 transition-opacity duration-1000",
            index === currentSlide ? "opacity-100" : "opacity-0"
          )}
        >
          <img
            src={slide.image_url}
            alt={slide.title}
            className="w-full h-full object-cover"
          />
          {/* <div className="absolute inset-0 bg-gradient-to-r from-primary-dark/90 via-primary/80 to-primary/70" /> */}
        </div>
      ))}

      {/* Content */}
      <div className="container relative z-10">
        <div className="max-w-3xl">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={cn(
                "transition-all duration-700",
                index === currentSlide
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8 absolute pointer-events-none"
              )}
            >
              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-primary-foreground mb-6 leading-tight">
                {slide.title}
              </h1>
              {slide.subtitle && (
                <p className="text-lg md:text-xl text-primary-foreground/90 mb-8 max-w-xl">
                  {slide.subtitle}
                </p>
              )}
              <div className="flex flex-wrap gap-4">
                {slide.cta_primary_text && slide.cta_primary_link && (
                  <Button variant="hero-gold" size="xl" asChild>
                    <Link to={slide.cta_primary_link}>
                      {slide.cta_primary_text}
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </Button>
                )}
                {slide.cta_secondary_text && slide.cta_secondary_link && (
                  <Button variant="hero" size="xl" asChild>
                    <Link to={slide.cta_secondary_link}>
                      {slide.cta_secondary_text}
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={goToPrevSlide}
            className="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 text-primary-foreground backdrop-blur-sm transition-all"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={goToNextSlide}
            className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 text-primary-foreground backdrop-blur-sm transition-all"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Slide Indicators */}
      {slides.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={cn(
                "w-3 h-3 rounded-full transition-all duration-300",
                index === currentSlide
                  ? "bg-accent w-8"
                  : "bg-primary-foreground/50 hover:bg-primary-foreground/70"
              )}
            />
          ))}
        </div>
      )}

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10" />
    </section>
  );
}
