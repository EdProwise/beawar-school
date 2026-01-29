import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useBeyondAcademics } from "@/hooks/use-school-data";
import { FormattedContent } from "@/components/ui/formatted-content";
import { Loader2, Zap, Home, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

export default function ResidentialSchool() {
  const { data, isLoading } = useBeyondAcademics("residential-school");
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
        <section className="pt-40 pb-24 bg-[#A11B5A] relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_-20%,#FFFFFF,transparent_70%)]" />
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
          </div>
          <div className="container relative text-center">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 border border-white/20 text-white rounded-full text-sm font-semibold mb-6 backdrop-blur-sm">
                <Home className="w-4 h-4" />
                A Home Away From Home
              </span>
              <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-8 tracking-tight">
                Residential <span className="text-yellow-400">School</span>
              </h1>
              <p className="text-white/80 text-xl max-w-3xl mx-auto leading-relaxed">
                Providing a safe, nurturing, and disciplined environment where students grow into independent, responsible, and well-rounded individuals.
              </p>
            </motion.div>
          </div>
          
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
                <Loader2 className="w-12 h-12 animate-spin text-[#A11B5A]" />
                <p className="text-slate-500 font-medium animate-pulse">Loading residential life details...</p>
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
                    <div className={`${index % 2 === 1 ? 'lg:order-2' : ''} space-y-8`}>
                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center justify-center w-12 h-12 rounded-2xl bg-[#A11B5A] text-white font-bold text-xl shadow-lg shadow-[#A11B5A]/20">
                            {index + 1}
                          </span>
                          <div className="h-px flex-1 bg-gradient-to-r from-[#A11B5A]/20 to-transparent" />
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight leading-tight">
                          {section.title}
                        </h2>
                      </div>
                      
                      <div className="prose prose-lg prose-slate max-w-none text-slate-600 leading-relaxed break-words overflow-hidden">
                        <FormattedContent content={section.content} />
                      </div>
                    </div>

                    <div className={`${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                      <div className="relative group/media">
                        <div className="absolute -inset-6 bg-gradient-to-tr from-[#A11B5A]/10 to-yellow-500/10 rounded-[2.5rem] blur-2xl opacity-0 group-hover/media:opacity-100 transition-opacity duration-700" />
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
                              <ShieldCheck className="w-16 h-16 text-slate-300" />
                              <p className="text-slate-400 font-medium tracking-widest uppercase text-xs">Safe & Secure Campus</p>
                            </div>
                          )}
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
                <div className="w-20 h-20 bg-pink-50 rounded-3xl flex items-center justify-center mx-auto mb-8">
                  <Home className="w-10 h-10 text-[#A11B5A]" />
                </div>
                <h3 className="text-3xl font-bold text-slate-900 mb-4">Residential Program</h3>
                <p className="text-slate-500 text-lg">We are currently updating our residential school facilities and programs. Please check back later!</p>
              </motion.div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
