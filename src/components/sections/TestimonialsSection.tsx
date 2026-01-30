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

  // Only take first 9 testimonials
  const limitedTestimonials = testimonials.slice(0, 9);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <section className="py-20 lg:py-32 bg-background relative overflow-hidden">
      {/* Premium Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/5 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,transparent_0%,hsl(var(--secondary)/0.3)_100%)]" />
      </div>

      <div className="container relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-semibold tracking-wide uppercase mb-6 border border-primary/20">
              Testimonials
            </span>
            <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 tracking-tight">
              What Our <span className="text-gradient-primary">Community</span> Says
            </h2>
            <div className="w-24 h-1.5 bg-gradient-to-r from-primary to-accent mx-auto rounded-full mb-8" />
            <p className="text-muted-foreground text-lg md:text-xl leading-relaxed">
              Discover why families choose Orbit School for their children's future. 
              Real stories from our dedicated parents and thriving students.
            </p>
          </motion.div>
        </div>

        {/* Masonry Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8"
        >
          {limitedTestimonials.map((testimonial) => (
            <motion.div
              key={testimonial.id}
              variants={itemVariants}
              className="break-inside-avoid group"
            >
              <div className={cn(
                "relative bg-card/40 backdrop-blur-md border border-white/10 rounded-3xl p-8 lg:p-10",
                "shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-500",
                "hover:shadow-[0_20px_50px_rgba(var(--primary-rgb),0.1)] hover:-translate-y-2 hover:bg-card/60",
                "group-hover:border-primary/20"
              )}>
                {/* Accent Line */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-primary to-accent rounded-b-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Quote Icon */}
                <div className="mb-8 flex justify-between items-start">
                  <div className="p-3 bg-primary/5 rounded-2xl group-hover:bg-primary/10 transition-colors duration-500">
                    <Quote className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex gap-1">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                    ))}
                  </div>
                </div>

                {/* Quote Text */}
                <blockquote className="text-foreground/90 leading-relaxed mb-8 text-lg font-medium italic">
                  "{testimonial.quote}"
                </blockquote>

                {/* Author Info */}
                <div className="flex items-center gap-5 pt-8 border-t border-border/50">
                  <div className="relative">
                    {testimonial.author_image ? (
                      <img
                        src={testimonial.author_image}
                        alt={testimonial.author_name}
                        className="w-14 h-14 rounded-2xl object-cover border-2 border-white/20 shadow-sm"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border-2 border-white/20">
                        <span className="text-primary font-bold text-xl">
                          {testimonial.author_name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-accent rounded-lg border-2 border-card flex items-center justify-center shadow-sm">
                      <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-foreground text-base tracking-wide">
                      {testimonial.author_name}
                    </h4>
                    <p className="text-sm text-muted-foreground font-medium">
                      {testimonial.author_role}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA or Badge */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-20 text-center"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-secondary/50 backdrop-blur-sm border border-border rounded-2xl">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-card bg-primary/10" />
              ))}
            </div>
            <p className="text-sm font-medium text-muted-foreground">
              Joined by <span className="text-foreground font-bold">500+</span> happy families this year
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
