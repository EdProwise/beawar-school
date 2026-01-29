import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useBeyondAcademics } from "@/hooks/use-school-data";
import { FormattedContent } from "@/components/ui/formatted-content";
import { Loader2, Zap, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface BeyondAcademicsSection {
  id: string;
  title: string;
  content: string;
  image_url?: string;
  video_url?: string;
  sort_order: number;
}

export default function BeyondAcademics() {
  const { data, isLoading } = useBeyondAcademics("beyond-academics");
  const sections = data;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="pt-40 pb-24 bg-[#0A192F] relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_-20%,#3B82F6,transparent_70%)]" />
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
          </div>
          <div className="container relative text-center">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-full text-sm font-semibold mb-6 backdrop-blur-sm">
                <Sparkles className="w-4 h-4" />
                Holistic Development
              </span>
              <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-8 tracking-tight">
                Beyond <span className="text-blue-500">Academics</span>
              </h1>
              <p className="text-slate-400 text-xl max-w-3xl mx-auto leading-relaxed">
                Nurturing talents, building character, and providing diverse opportunities for growth outside the classroom. We prepare students for life, not just exams.
              </p>
            </motion.div>
          </div>
          
          {/* Decorative bottom wave */}
          <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] transform rotate-180">
            <svg className="relative block w-[calc(100%+1.3px)] h-[60px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
              <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-[#fafafa]"></path>
            </svg>
          </div>
        </section>

        {/* Content Sections */}
        <section className="py-32 px-4 sm:px-6 lg:px-8">
          <div className="container max-w-7xl mx-auto">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-32 space-y-4">
                <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
                <p className="text-slate-500 font-medium animate-pulse">Loading enrichment programs...</p>
              </div>
            ) : sections && sections.length > 0 ? (
                <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-100px" }}
                  className="space-y-40"
                >
                  {sections.map((section, index) => (
                    <motion.div 
                      key={section.id} 
                      variants={itemVariants}
                      className={`group grid lg:grid-cols-2 gap-16 lg:gap-24 items-center`}
                    >
                      <div className={`${index % 2 === 1 ? 'lg:order-2' : ''} relative group/content`}>
                        {/* Modern Premium Card */}
                        <div className="relative p-10 md:p-14 rounded-[3rem] bg-white border border-slate-100 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] hover:shadow-[0_48px_80px_-16px_rgba(59,130,246,0.12)] transition-all duration-700 hover:-translate-y-2">
                          {/* Animated Corner Accent */}
                          <div className={`absolute top-0 ${index % 2 === 1 ? 'right-0 rounded-tr-[3rem]' : 'left-0 rounded-tl-[3rem]'} w-24 h-24 bg-gradient-to-br from-blue-600/10 to-transparent rounded-full -translate-x-8 -translate-y-8 blur-2xl group-hover/content:scale-150 transition-transform duration-1000`} />
                          
                          <div className="relative space-y-10">
                            <div className="space-y-6">
                              <div className="flex items-center gap-6">
                                <div className="relative group/num">
                                  <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full scale-150 opacity-0 group-hover/num:opacity-100 transition-opacity" />
                                  <span className="relative flex items-center justify-center w-16 h-16 rounded-2xl bg-[#0A192F] text-white font-bold text-2xl shadow-2xl shadow-blue-900/20 rotate-3 group-hover/content:rotate-0 transition-transform duration-500">
                                    {String(index + 1).padStart(2, '0')}
                                  </span>
                                </div>
                                <div className="flex-1 flex flex-col gap-1">
                                  <div className="h-0.5 w-full bg-gradient-to-r from-blue-500 via-blue-200 to-transparent rounded-full" />
                                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500/50">Excellence Pillar</span>
                                </div>
                              </div>
                              
                              <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-[1.1] group-hover:text-blue-600 transition-colors duration-500">
                                {section.title}
                              </h2>
                            </div>
                            
                            <div className="prose prose-lg prose-slate max-w-none text-slate-600 leading-relaxed font-medium">
                              <FormattedContent content={section.content} />
                            </div>
                            
                            <div className="flex items-center gap-4 pt-4">
                              <div className="h-px w-8 bg-blue-500/30" />
                              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-blue-50 text-blue-600 text-xs font-black uppercase tracking-widest border border-blue-100/50 shadow-sm">
                                <Zap className="w-3.5 h-3.5 fill-blue-600" />
                                Enrichment Program
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className={`${index % 2 === 1 ? 'lg:order-1' : ''}`}>

                      <div className="relative group/media">
                        {/* Decorative background elements */}
                        <div className="absolute -inset-6 bg-gradient-to-tr from-blue-500/10 to-purple-500/10 rounded-[2.5rem] blur-2xl opacity-0 group-hover/media:opacity-100 transition-opacity duration-700" />
                        <div className={`absolute -inset-4 bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 transition-transform duration-700 ${index % 2 === 1 ? '-rotate-2 group-hover/media:-rotate-1' : 'rotate-2 group-hover/media:rotate-1'}`} />
                        
                        <div className="relative aspect-[4/3] rounded-[2rem] overflow-hidden border border-white/50 shadow-xl bg-slate-100">
                          {section.video_url ? (
                            <video 
                              src={section.video_url} 
                              className="w-full h-full object-cover"
                              controls
                              poster={section.image_url}
                            />
                          ) : section.image_url ? (
                            <img 
                              src={section.image_url} 
                              alt={section.title}
                              className="w-full h-full object-cover transform group-hover/media:scale-105 transition-transform duration-700"
                            />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center space-y-4 bg-gradient-to-br from-slate-50 to-slate-100">
                              <Zap className="w-16 h-16 text-slate-300" />
                              <p className="text-slate-400 font-medium tracking-widest uppercase text-xs">Orbit School Excellence</p>
                            </div>
                          )}
                          
                          {/* Glass overlay on hover */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover/media:opacity-100 transition-opacity duration-500 pointer-events-none" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-24 bg-white rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40 max-w-2xl mx-auto"
              >
                <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto mb-8">
                  <Zap className="w-10 h-10 text-blue-500" />
                </div>
                <h3 className="text-3xl font-bold text-slate-900 mb-4">Coming Soon</h3>
                <p className="text-slate-500 text-lg">We are currently curating exceptional enrichment programs for our students. Please check back soon!</p>
              </motion.div>
            )}
          </div>
        </section>

        {/* Call to Action or Footer Info */}
        <section className="py-24 bg-white">
          <div className="container">
            <div className="bg-[#0A192F] rounded-[3rem] p-12 md:p-20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-32 -mt-32" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -ml-32 -mb-32" />
              
              <div className="relative text-center space-y-8 max-w-3xl mx-auto">
                <h2 className="text-3xl md:text-5xl font-bold text-white">Join Our Thriving Community</h2>
                <p className="text-slate-400 text-lg">Discover how our beyond academic programs can transform your child's future. Enrollment is now open for the upcoming session.</p>
                <div className="pt-4">
                  <button className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-all duration-300 shadow-lg shadow-blue-600/25 hover:scale-105 active:scale-95">
                    Inquire Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
