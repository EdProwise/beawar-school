import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Loader2, Sparkles, BookOpen, Target, Users, Heart, ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/mongodb/client";
import { FormattedContent } from "@/components/ui/formatted-content";
import { motion } from "framer-motion";

export default function TeachingMethod() {
  const { data: heroContent, isLoading: heroLoading } = useQuery({
    queryKey: ["teaching-method-content"],
    queryFn: async () => {
      const { data, error } = await supabase.from("teaching_method_content").select("*").maybeSingle();
      if (error) throw error;
      return data;
    }
  });

  const { data: methods, isLoading: methodsLoading } = useQuery({
    queryKey: ["teaching-methods"],
    queryFn: async () => {
      const { data, error } = await supabase.from("teaching_methods").select("*").order("sort_order", { ascending: true });
      if (error) throw error;
      return data;
    }
  });

  if (heroLoading || methodsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-10 h-10 animate-spin text-purple-600" />
      </div>
    );
  }

  const pageData = heroContent || {
    title: "THINGS for our students and what we do",
    center_image: "https://images.unsplash.com/photo-1580894732444-8ecdead79730?auto=format&fit=crop&q=80&w=800",
    description: "Our pedagogical approach is designed to inspire curiosity and foster holistic development in every child."
  };

  const getThemeColor = (index: number) => {
    const colors = [
      { bg: "bg-purple-50", text: "text-purple-600", accent: "bg-purple-600", border: "border-purple-100", gradient: "from-purple-600 to-indigo-600" },
      { bg: "bg-pink-50", text: "text-pink-600", accent: "bg-pink-600", border: "border-pink-100", gradient: "from-pink-600 to-rose-600" },
      { bg: "bg-blue-50", text: "text-blue-600", accent: "bg-blue-600", border: "border-blue-100", gradient: "from-blue-600 to-cyan-600" },
      { bg: "bg-emerald-50", text: "text-emerald-600", accent: "bg-emerald-600", border: "border-emerald-100", gradient: "from-emerald-600 to-teal-600" }
    ];
    return colors[index % colors.length];
  };

  const icons = [<BookOpen key="1" />, <Target key="2" />, <Users key="3" />, <Heart key="4" />];

  return (
    <div className="min-h-screen font-sans bg-white selection:bg-purple-100 selection:text-purple-900">
      <Header />
      <main>
        {/* Premium Hero Section */}
        <section className="relative pt-44 pb-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-purple-50/50 to-white -z-10" />
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-50/30 to-transparent -z-10 blur-3xl opacity-50" />
          
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white shadow-xl shadow-purple-100 border border-purple-100 text-purple-600 text-sm font-bold mb-8">
                <Sparkles className="w-4 h-4" />
                OUR PEDAGOGY
              </span>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-slate-900 mb-8 tracking-tighter leading-[1.1]">
                {pageData.title.split(' ').map((word: string, i: number) => (
                  <span key={i} className={i === 0 ? "text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600" : ""}>
                    {word}{' '}
                  </span>
                ))}
              </h1>
              <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-medium mb-12">
                {pageData.description}
              </p>
            </motion.div>

            {/* Floating Hero Image */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative max-w-5xl mx-auto"
            >
              <div className="relative aspect-[21/9] rounded-[3rem] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] border-[12px] border-white">
                <img 
                  src={pageData.center_image} 
                  alt="Teaching Method" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-8 left-8 right-8 text-left text-white">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                      <Sparkles className="w-6 h-6" />
                    </div>
                    <p className="text-lg font-bold">Innovation in every classroom</p>
                  </div>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-purple-600 rounded-3xl -z-10 rotate-12 animate-pulse" />
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-blue-500 rounded-full -z-10 opacity-20 blur-2xl" />
            </motion.div>
          </div>
        </section>

        {/* Dynamic Multi-color Methods Sections */}
        <section className="py-24">
          <div className="container mx-auto px-4 space-y-32">
            {methods?.map((method: any, index: number) => {
              const theme = getThemeColor(index);
              const isEven = index % 2 === 0;

              return (
                <div key={method.id} className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-16 lg:gap-24`}>
                  {/* Image side */}
                  <motion.div 
                    initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="w-full lg:w-1/2 relative"
                  >
                    <div className={`relative aspect-[4/3] rounded-[3rem] overflow-hidden shadow-2xl z-10 ${theme.border} border-8`}>
                      <img 
                        src={method.image_url || "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=800"} 
                        alt={method.title} 
                        className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                      />
                    </div>
                    {/* Decorative Background Shape */}
                    <div className={`absolute -inset-4 ${theme.bg} rounded-[3.5rem] -z-10 rotate-2 opacity-50`} />
                    <div className={`absolute -bottom-8 ${isEven ? '-right-8' : '-left-8'} w-48 h-48 ${theme.accent} rounded-full -z-10 opacity-10 blur-3xl`} />
                  </motion.div>

                  {/* Content side */}
                  <motion.div 
                    initial={{ opacity: 0, x: isEven ? 50 : -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="w-full lg:w-1/2 space-y-8"
                  >
                    <div className="space-y-4">
                      <div className={`inline-flex items-center gap-3 px-5 py-2 rounded-2xl ${theme.bg} ${theme.text} font-bold text-sm tracking-wide uppercase`}>
                        <div className={`p-1.5 rounded-lg bg-white shadow-sm`}>
                          {icons[index % icons.length]}
                        </div>
                        Method {index + 1}
                      </div>
                      <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                        {method.title}
                      </h2>
                    </div>
                    
                    <div className="prose prose-lg max-w-none text-slate-600 leading-relaxed font-medium">
                      <FormattedContent content={method.content} />
                    </div>

                    <div className="pt-4">
                      <button className={`inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-slate-900 text-white font-bold transition-all hover:gap-5 hover:pr-6 group`}>
                        Learn More 
                        <div className={`p-1 rounded-full bg-white/10 group-hover:bg-${theme.accent}`}>
                          <ArrowRight className="w-5 h-5" />
                        </div>
                      </button>
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-32">
          <div className="container mx-auto px-4">
            <div className="bg-slate-900 rounded-[4rem] p-12 md:p-24 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full opacity-20">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600 rounded-full blur-[100px]" />
              </div>
              
              <div className="relative z-10 max-w-4xl mx-auto space-y-8">
                <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight">
                  Ready to experience the <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Orbit Method?</span>
                </h2>
                <p className="text-xl text-slate-400 font-medium">
                  Join our community of lifelong learners and give your child the foundation they deserve.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
                  <a href="/admissions" className="w-full sm:w-auto px-10 py-5 bg-white text-slate-900 rounded-2xl font-black text-lg hover:scale-105 transition-transform shadow-2xl">
                    Enroll Now
                  </a>
                  <a href="/contact" className="w-full sm:w-auto px-10 py-5 bg-slate-800 text-white rounded-2xl font-black text-lg hover:bg-slate-700 transition-colors border border-slate-700">
                    Contact Us
                  </a>
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
