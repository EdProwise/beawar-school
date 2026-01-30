import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/mongodb/client";
import { Trophy, Medal, Star, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Result {
  id: string;
  year: string;
  student_name: string;
  percentage: string;
  remarks: string;
  photo_url?: string;
  category: string;
  sort_order: number;
}

export function ResultsSection() {
  const { data: results, isLoading } = useQuery({
    queryKey: ["results-display"],
    queryFn: async () => {
      // First, get the latest year
      const { data: allYears } = await supabase
        .from("results")
        .select("year")
        .order("year", { ascending: false })
        .limit(1);

      if (!allYears || allYears.length === 0) return [];

      const latestYear = allYears[0].year;

      // Then get top 6 students from that year
      const { data, error } = await supabase
        .from("results")
        .select("*")
        .eq("year", latestYear)
        .order("percentage", { ascending: false })
        .limit(6);

      if (error) throw error;
      return data as Result[];
    },
  });

  if (isLoading || !results || results.length === 0) {
    return null;
  }

  const getRankBadge = (index: number) => {
    switch (index) {
      case 0:
        return (
          <div className="absolute -top-3 -right-3 w-12 h-12 bg-gradient-to-br from-amber-300 via-amber-500 to-amber-600 rounded-full flex items-center justify-center shadow-xl z-20 border-2 border-white dark:border-slate-900">
            <Trophy className="w-6 h-6 text-white" />
          </div>
        );
      case 1:
        return (
          <div className="absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-br from-slate-200 via-slate-400 to-slate-500 rounded-full flex items-center justify-center shadow-xl z-20 border-2 border-white dark:border-slate-900">
            <Medal className="w-5 h-5 text-white" />
          </div>
        );
      case 2:
        return (
          <div className="absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-br from-orange-300 via-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-xl z-20 border-2 border-white dark:border-slate-900">
            <Medal className="w-5 h-5 text-white" />
          </div>
        );
      default:
        return (
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary/20 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg z-20 border border-primary/30">
            <Star className="w-4 h-4 text-primary fill-primary" />
          </div>
        );
    }
  };

  return (
    <section className="py-24 relative overflow-hidden bg-[#fafafa] dark:bg-slate-950" id="results">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-40">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-amber-500/5 blur-[120px]" />
      </div>

      <div className="container px-4 mx-auto relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary font-semibold text-sm mb-6 border border-primary/20 shadow-sm"
          >
            <Trophy className="w-4 h-4" />
            <span className="tracking-wide uppercase text-[11px]">Academic Hall of Fame</span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold font-heading mb-6 tracking-tight text-slate-900 dark:text-white"
          >
            Celebrating Excellence: <span className="text-primary relative inline-block">
              Top Performers
              <span className="absolute bottom-1 left-0 w-full h-2 bg-primary/10 -z-10 rounded-full" />
            </span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed"
          >
            Our students consistently demonstrate remarkable academic prowess. Meet the exceptional toppers from the Class of {results[0]?.year}.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 lg:gap-8">
          {results.map((result, index) => (
            <motion.div
              key={result.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ 
                duration: 0.5, 
                delay: index * 0.1,
                type: "spring",
                stiffness: 100 
              }}
              viewport={{ once: true }}
              className="relative group"
            >
              {getRankBadge(index)}
              
              <Card className="h-full border-none shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] group-hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.2)] dark:shadow-[0_10px_40px_-15px_rgba(0,0,0,0.5)] transition-all duration-500 bg-white dark:bg-slate-900 overflow-hidden flex flex-col">
                <CardContent className="p-0 flex-grow">
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <div className="absolute inset-0 bg-slate-200 dark:bg-slate-800 animate-pulse" />
                    {result.photo_url ? (
                      <img
                        src={result.photo_url}
                        alt={result.student_name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 relative z-10"
                        onLoad={(e) => (e.currentTarget.previousElementSibling as HTMLElement).style.display = 'none'}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center relative z-10">
                        <Trophy className="w-16 h-16 text-slate-300 dark:text-slate-700" />
                      </div>
                    )}
                    
                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80 z-20" />
                    
                    {/* Percentage Badge */}
                    <div className="absolute bottom-4 left-4 z-30">
                      <div className="bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1 rounded-full shadow-lg">
                        <span className="text-white font-black text-lg tracking-tighter">
                          {result.percentage}%
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-5 flex flex-col items-center text-center relative z-30 -mt-2 bg-white dark:bg-slate-900 rounded-t-3xl border-t border-slate-100 dark:border-slate-800">
                    <Badge variant="secondary" className="mb-2 bg-primary/5 text-primary border-none text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5">
                      {result.category}
                    </Badge>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1 line-clamp-1 group-hover:text-primary transition-colors">
                      {result.student_name}
                    </h3>
                    <div className="w-8 h-1 bg-primary/20 rounded-full mb-3 group-hover:w-12 transition-all duration-300" />
                    <p className="text-slate-500 dark:text-slate-400 text-xs italic line-clamp-2 leading-relaxed px-2">
                      "{result.remarks}"
                    </p>
                  </div>
                </CardContent>
                
                <div className="px-5 py-3 bg-slate-50/50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center overflow-hidden group">
                  <span className="text-[10px] font-bold text-primary flex items-center gap-1.5 uppercase tracking-tighter group-hover:gap-2.5 transition-all">
                    View Success Story <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <a 
            href="/results" 
            className="inline-flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-4 rounded-full font-bold text-sm hover:bg-primary dark:hover:bg-primary hover:text-white transition-all duration-300 shadow-xl shadow-slate-200 dark:shadow-none"
          >
            Explore All Toppers
            <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}

