import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/mongodb/client";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Loader2, Trophy, Award, Star } from "lucide-react";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

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

export default function Results() {
  const { data: resultsData, isLoading } = useQuery({
    queryKey: ["results"],
    queryFn: async () => {
      const { data, error } = await supabase.from("results").select("*").order("percentage", { ascending: false }).order("sort_order", { ascending: true });
      if (error) throw error;
      return data as Result[];
    }
  });

  const years = useMemo(() => {
    if (!resultsData) return [];
    return Array.from(new Set(resultsData.map(r => r.year))).sort((a, b) => b.localeCompare(a));
  }, [resultsData]);

  const [selectedYear, setSelectedYear] = useState<string | null>(null);

  // Set initial year once data is loaded
  useMemo(() => {
    if (years.length > 0 && !selectedYear) {
      setSelectedYear(years[0]);
    }
  }, [years, selectedYear]);

  const filteredResults = useMemo(() => {
    if (!resultsData || !selectedYear) return [];
    return resultsData.filter(r => r.year === selectedYear);
  }, [resultsData, selectedYear]);

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <Header />
      <main>
        {/* Hero */}
        <section className="pt-32 pb-20 bg-[#1a1a1a] relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_50%,rgba(217,119,6,0.15),transparent_50%)]" />
            <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_50%,rgba(217,119,6,0.1),transparent_50%)]" />
          </div>
          <div className="container relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center px-4 py-1.5 bg-amber-500/10 text-amber-500 rounded-full text-xs font-bold mb-6 uppercase tracking-widest border border-amber-500/20">
                <Award className="w-3.5 h-3.5 mr-2" />
                Academic Excellence
              </span>
              <h1 className="font-heading text-5xl md:text-7xl font-bold text-white mb-8 tracking-tight">
                Academic <span className="text-amber-500">Results</span>
              </h1>
              <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                Celebrating the outstanding milestones and academic achievements of our brilliant students.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Year Selector & Content */}
        <section className="py-12">
          <div className="container">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="w-12 h-12 animate-spin text-amber-600" />
                <p className="text-muted-foreground font-medium">Fetching academic records...</p>
              </div>
            ) : resultsData && resultsData.length > 0 ? (
              <div className="flex flex-col gap-8">
                {/* Year Selector */}
                <div className="flex flex-wrap justify-center gap-3 mb-4">
                  {years.map((year) => (
                    <button
                      key={year}
                      onClick={() => setSelectedYear(year)}
                      className={cn(
                        "px-6 py-2 rounded-full transition-all duration-300 font-bold border text-sm",
                        selectedYear === year
                          ? "bg-amber-600 text-white border-amber-600 shadow-md"
                          : "bg-white text-gray-600 border-gray-200 hover:border-amber-400 hover:text-amber-600"
                      )}
                    >
                      {year}
                    </button>
                  ))}
                </div>

                {/* Results Display */}
                <div className="w-full">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={selectedYear}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.4 }}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredResults.map((result, index) => (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                            key={result.id}
                            className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-500 group relative"
                          >
                            <div className="aspect-square relative overflow-hidden bg-gray-100">
                              {result.photo_url ? (
                                <img
                                  src={result.photo_url}
                                  alt={result.student_name}
                                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-amber-50">
                                  <Trophy className="w-12 h-12 text-amber-200" />
                                </div>
                              )}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                              
                              <div className="absolute bottom-3 left-3 right-3 text-white">
                                <span className="inline-block px-2 py-0.5 bg-amber-600 rounded-full text-[9px] font-bold uppercase tracking-wider mb-1">
                                  {result.category || "Topper"}
                                </span>
                                <h3 className="text-lg font-bold leading-tight drop-shadow-md">
                                  {result.student_name}
                                </h3>
                              </div>
                            </div>
                            
                            <div className="p-4">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex flex-col">
                                  <span className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Score</span>
                                  <span className="text-2xl font-black text-amber-600">
                                    {result.percentage}%
                                  </span>
                                </div>
                                <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                                  <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                                </div>
                              </div>
                              
                              <div className="pt-2 border-t border-gray-100">
                                <p className="text-gray-500 text-xs italic leading-relaxed line-clamp-2">
                                  "{result.remarks}"
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-[2rem] border border-dashed border-gray-200">
                <Trophy className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-1">Results are being compiled</h3>
                <p className="text-gray-400 text-sm max-w-sm mx-auto">We're currently updating our academic records for the current session.</p>
              </div>
            )}
          </div>
        </section>

        {/* Recognition Banner */}
        <section className="py-12 container">
          <div className="bg-amber-600 rounded-[2rem] p-8 relative overflow-hidden text-center text-white">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Award className="w-32 h-32" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4 relative z-10">Proud of Our Orbitians!</h2>
            <p className="text-amber-100/90 text-sm md:text-base max-w-2xl mx-auto relative z-10 leading-relaxed">
              Every result tells a story of dedication and pursuit of excellence. We congratulate all our students.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
