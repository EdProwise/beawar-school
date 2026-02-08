import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { 
import SEOHead, { breadcrumbSchema } from "@/components/SEOHead";
  BookOpen, Target, Users, Heart, ArrowRight, Loader2, Award, Sparkles, ZoomIn 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormattedContent } from "@/components/ui/formatted-content";
import { useTeachingMethods, useTeachingMethodHero, useSiteSettings } from "@/hooks/use-school-data";
import { Link } from "react-router-dom";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ImageLightbox } from "@/components/ui/image-lightbox";
import Autoplay from "embla-carousel-autoplay";

const iconMap: Record<string, React.ElementType> = {
  BookOpen, Target, Users, Heart, Award, Sparkles
};

export default function TeachingMethod() {
  const { data: settings } = useSiteSettings();
  const { data: heroData, isLoading: heroLoading } = useTeachingMethodHero();
  const { data: methods = [], isLoading: methodsLoading } = useTeachingMethods();

  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const openLightbox = (images: string[], index: number = 0) => {
    setLightboxImages(images);
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const schoolName = settings?.school_name || "Orbit School";

  if (heroLoading || methodsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const pageTitle = heroData?.title || "Our Teaching Methodology";
  const pageDescription = heroData?.description || "Our pedagogical approach is designed to inspire curiosity and foster holistic development in every child.";
  
  // Robust image logic: combine center_image with images array, filtering duplicates
  const getHeroImages = () => {
    const images = [...(heroData?.images || [])];
    if (heroData?.center_image && !images.includes(heroData.center_image)) {
      images.unshift(heroData.center_image);
    }
    return images.length > 0 ? images : ["/classroom.png"];
  };
  
  const heroImages = getHeroImages();

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
          title="Teaching Methods"
          description="Learn about the innovative teaching methods and pedagogical approaches at Beawar School."
          keywords="teaching methods, pedagogy, learning approach, Beawar School"
          jsonLd={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Teaching Methods", path: "/teaching-method" }])}
        />
      <Header />
        <main>
          {/* Hero Section */}
          <section className="pt-10 pb-10 lg:pt-48 lg:pb-32 bg-gradient-to-b from-primary to-primary-dark relative overflow-hidden text-primary-foreground">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.2),transparent_50%)]" />
            </div>
            <div className="container relative">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <motion.div 
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  className="text-center lg:text-left"
                >
                  <span className="inline-block px-4 py-2 bg-primary-foreground/10 text-primary-foreground rounded-full text-sm font-medium mb-4 uppercase tracking-wider">
                    Our Pedagogy
                  </span>
                  <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                    {pageTitle}
                  </h1>
                  <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto lg:mx-0 mb-8">
                    {pageDescription}
                  </p>
                  <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                    <Button variant="hero-gold" asChild>
                      <Link to="/admissions/process">Join Our School</Link>
                    </Button>
                    <div className="flex items-center gap-3 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm border border-white/10">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-primary-foreground" />
                      </div>
                      <p className="text-sm font-medium">Innovation in Education</p>
                    </div>
                  </div>
                </motion.div>

                <div className="relative group">
                  <motion.div
                    initial={{ opacity: 0, x: -100 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="relative z-10"
                  >
                    {heroImages.length > 1 ? (
                        <Carousel 
                          className="w-full" 
                          opts={{ loop: true }}
                          plugins={[
                            Autoplay({
                              delay: 3000,
                              stopOnInteraction: false,
                              stopOnMouseEnter: true,
                            }),
                          ]}
                        >
                          <CarouselContent>
                            {heroImages.map((img, idx) => (
                            <CarouselItem key={idx}>
                              <div 
                                className="aspect-[4/3] rounded-3xl overflow-hidden border-4 border-white/10 shadow-2xl relative cursor-pointer group/item"
                                onClick={() => openLightbox(heroImages, idx)}
                              >
                                <img 
                                  src={img} 
                                  alt={`Teaching Method Hero ${idx + 1}`} 
                                  className="w-full h-full object-cover transition-transform group-hover/item:scale-110 duration-700"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/item:opacity-100 transition-opacity flex flex-col items-center justify-center text-white">
                                  <ZoomIn className="w-12 h-12 mb-2" />
                                  <span className="text-sm font-medium uppercase tracking-widest">Click to Enlarge</span>
                                </div>
                              </div>
                            </CarouselItem>
                          ))}
                        </CarouselContent>
                        <div className="hidden md:block">
                          <CarouselPrevious className="left-4 bg-white/10 border-white/20 text-white hover:bg-white/20" />
                          <CarouselNext className="right-4 bg-white/10 border-white/20 text-white hover:bg-white/20" />
                        </div>
                      </Carousel>
                    ) : (
                      <div 
                        className="aspect-[4/3] rounded-3xl overflow-hidden border-4 border-white/10 shadow-2xl relative cursor-pointer group/item"
                        onClick={() => openLightbox(heroImages, 0)}
                      >
                        <img 
                          src={heroImages[0]} 
                          alt="Teaching Method" 
                          className="w-full h-full object-cover transition-transform group-hover/item:scale-110 duration-700"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/item:opacity-100 transition-opacity flex flex-col items-center justify-center text-white">
                          <ZoomIn className="w-12 h-12 mb-2" />
                          <span className="text-sm font-medium uppercase tracking-widest">Click to Enlarge</span>
                        </div>
                      </div>
                    )}
                  </motion.div>
                  {/* Decorative Elements */}
                  <div className="absolute -top-6 -right-6 w-32 h-32 bg-accent/20 rounded-full blur-3xl animate-pulse" />
                  <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-primary-light/20 rounded-full blur-3xl animate-pulse" />
                </div>
              </div>
            </div>
          </section>

          {/* Methods Section */}
        <section className="py-20 bg-background">
          <div className="container">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="inline-block px-4 py-2 bg-primary-light text-primary rounded-full text-sm font-medium mb-4">
                Our Approach
              </span>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
                How We Teach at {schoolName}
              </h2>
            </div>

            <div className="space-y-24">
                {methods.map((method, index) => {
                  const isEven = index % 2 === 0;
                  const IconComponent = iconMap[Object.keys(iconMap)[index % Object.keys(iconMap).length]] || BookOpen;
                  
                  // Combine image_url with images array
                  const getMethodImages = () => {
                    const images = [...(method.images || [])];
                    if (method.image_url && !images.includes(method.image_url)) {
                      images.unshift(method.image_url);
                    }
                    return images.length > 0 ? images : ["/classroom.png"];
                  };
                  
                  const methodImages = getMethodImages();

                  return (
                      <div 
                        key={method.id}
                        className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center"
                      >
                      <motion.div 
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className={`relative z-10 ${isEven ? '' : 'lg:order-2'}`}
                      >
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-12 h-12 rounded-xl bg-primary-light flex items-center justify-center">
                            <IconComponent className="w-6 h-6 text-primary" />
                          </div>
                          <span className="text-accent font-bold uppercase tracking-wide text-sm">Method {index + 1}</span>
                        </div>
                        <h3 className="font-heading text-3xl font-bold text-foreground mb-4">
                          {method.title}
                        </h3>
                        <div className="mb-8">
                          <FormattedContent 
                            content={method.content} 
                            className="prose-p:text-muted-foreground prose-p:leading-relaxed break-words"
                          />
                        </div>
                          <Button asChild>
                            <Link to="/admissions/process">
                              Learn More
                              <ArrowRight className="w-4 h-4 ml-2" />
                            </Link>
                          </Button>
                      </motion.div>
                      
                      <motion.div 
                        initial={{ opacity: 0, x: -100 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className={`${isEven ? '' : 'lg:order-1'}`}
                      >
                        <div className="relative group">
                          <div className="absolute inset-0 bg-primary/5 rounded-[2.5rem] -rotate-3 transition-transform group-hover:rotate-0" />
                          <div className="relative z-10">
                            {methodImages.length > 1 ? (
                              <Carousel className="w-full" opts={{ loop: true }}>
                                <CarouselContent>
                                  {methodImages.map((img, idx) => (
                                    <CarouselItem key={idx}>
                                      <div 
                                        className="relative cursor-pointer group/item overflow-hidden rounded-[2rem]"
                                        onClick={() => openLightbox(methodImages, idx)}
                                      >
                                        <img 
                                          src={img} 
                                          alt={`${method.title} ${idx + 1}`}
                                          className="rounded-[2rem] shadow-strong w-full object-cover aspect-video border-4 border-white transition-transform group-hover/item:scale-110 duration-700"
                                        />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/item:opacity-100 transition-opacity flex flex-col items-center justify-center text-white rounded-[2rem]">
                                          <ZoomIn className="w-12 h-12 mb-2" />
                                          <span className="text-sm font-medium uppercase tracking-widest">Click to Enlarge</span>
                                        </div>
                                      </div>
                                    </CarouselItem>
                                  ))}
                                </CarouselContent>
                                <div className="hidden md:block">
                                  <CarouselPrevious className="left-4" />
                                  <CarouselNext className="right-4" />
                                </div>
                              </Carousel>
                            ) : (
                              <div 
                                className="relative cursor-pointer group/item overflow-hidden rounded-[2rem]"
                                onClick={() => openLightbox(methodImages, 0)}
                              >
                                <img 
                                  src={methodImages[0]} 
                                  alt={method.title}
                                  className="rounded-[2rem] shadow-strong w-full object-cover aspect-video border-4 border-white transition-transform group-hover/item:scale-110 duration-700"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/item:opacity-100 transition-opacity flex flex-col items-center justify-center text-white rounded-[2rem]">
                                  <ZoomIn className="w-12 h-12 mb-2" />
                                  <span className="text-sm font-medium uppercase tracking-widest">Click to Enlarge</span>
                                </div>
                              </div>
                            )}
                          </div>
                          <div className={`absolute -bottom-6 ${isEven ? '-right-6' : '-left-6'} w-32 h-32 bg-accent/20 rounded-full blur-3xl -z-10`} />
                        </div>
                        </motion.div>
                      </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-24 bg-primary relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.2),transparent_50%)]" />
            </div>
            <div className="container relative text-center">
              <h2 className="font-heading text-4xl md:text-5xl font-bold text-primary-foreground mb-8">
                Experience the {schoolName} Way
              </h2>
              <p className="text-primary-foreground/80 mb-12 max-w-2xl mx-auto text-lg">
                Join our community of lifelong learners and give your child the foundation they deserve with our innovative teaching methods.
              </p>
              <div className="flex flex-wrap gap-6 justify-center">
                <Button variant="hero-gold" size="lg" className="h-14 px-10 text-lg" asChild>
                  <Link to="/admissions/process">Apply Now</Link>
                </Button>
                <Button variant="hero" size="lg" className="h-14 px-10 text-lg" asChild>
                  <Link to="/contact">Book a Tour</Link>
                </Button>
              </div>
            </div>
          </section>
        </main>
        <Footer />
        
        <ImageLightbox 
          images={lightboxImages}
          isOpen={lightboxOpen}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
        />
    </div>
  );
}
