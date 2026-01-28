import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/mongodb/client";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Loader2, Trophy, Calendar, ChevronRight, Award, Star } from "lucide-react";
import { FormattedContent } from "@/components/ui/formatted-content";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface Result {
  id: string;
  year: string;
  category: string;
  title: string;
  content: string;
  sort_order: number;
}

export default function Results() {
  const { data: resultsData, isLoading } = useQuery({
    queryKey: ["results"],
    queryFn: async () => {
      const { data, error } = await supabase.from("results").select("*").order("year", { ascending: false }).order("sort_order", { ascending: true });
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
                Celebrating the legacy of excellence and the outstanding milestones achieved by our students year after year.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Year Selector & Content */}
        <section className="py-20">
          <div className="container">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="w-12 h-12 animate-spin text-amber-600" />
                <p className="text-muted-foreground font-medium">Fetching academic records...</p>
              </div>
            ) : resultsData && resultsData.length > 0 ? (
              <div className="flex flex-col lg:flex-row gap-12">
                {/* Sidebar Year Selector */}
                <div className="lg:w-64 flex-shrink-0">
                  <div className="sticky top-32">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6 flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      Select Year
                    </h3>
                    <div className="flex lg:flex-col gap-2 overflow-x-auto pb-4 lg:pb-0 no-scrollbar">
                      {years.map((year) => (
                        <button
                          key={year}
                          onClick={() => setSelectedYear(year)}
                          className={cn(
                            "flex items-center justify-between px-6 py-4 rounded-xl transition-all duration-300 text-left whitespace-nowrap lg:whitespace-normal group",
                            selectedYear === year
                              ? "bg-white text-amber-600 shadow-[0_10px_30px_-10px_rgba(217,119,6,0.2)] border border-amber-100 font-bold translate-x-1"
                              : "text-gray-500 hover:bg-white hover:text-amber-600 border border-transparent"
                          )}
                        >
                          <span className="flex items-center">
                            {year}
                          </span>
                          <ChevronRight className={cn(
                            "w-4 h-4 transition-transform duration-300",
                            selectedYear === year ? "opacity-100" : "opacity-0 group-hover:opacity-50"
                          )} />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Results Display */}
                <div className="flex-grow">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={selectedYear}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.4 }}
                      className="space-y-10"
                    >
                      <div className="flex items-end justify-between border-b border-gray-200 pb-6 mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 flex items-center">
                          Academic Year {selectedYear}
                          <Star className="w-5 h-5 ml-3 text-amber-400 fill-amber-400" />
                        </h2>
                        <span className="text-sm text-gray-400 font-medium">
                          {filteredResults.length} records found
                        </span>
                      </div>

                      <div className="grid gap-8">
                        {filteredResults.map((result, index) => (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            key={result.id}
                            className="bg-white rounded-3xl border border-gray-100 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] overflow-hidden hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)] transition-all duration-500 group"
                          >
                            <div className="flex flex-col md:flex-row">
                              <div className="md:w-1/3 bg-[#f8f9fa] p-8 flex flex-col justify-center border-b md:border-b-0 md:border-r border-gray-100">
                                <span className="text-amber-600 font-bold text-xs uppercase tracking-widest mb-2 block">
                                  {result.category}
                                </span>
                                <h3 className="text-2xl font-bold text-gray-900 leading-tight">
                                  {result.title}
                                </h3>
                              </div>
                              <div className="md:w-2/3 p-8 md:p-10">
                                <div className="prose prose-amber max-w-none text-gray-600 leading-relaxed">
                                  <FormattedContent content={result.content} />
                                </div>
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
              <div className="text-center py-32 bg-white rounded-[3rem] border border-dashed border-gray-200">
                <Trophy className="w-20 h-20 text-gray-200 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Results are being compiled</h3>
                <p className="text-gray-400 max-w-sm mx-auto">We're currently updating our academic records for the current session. Please check back soon.</p>
              </div>
            )}
          </div>
        </section>

        {/* Recognition Banner */}
        <section className="py-20 container">
          <div className="bg-amber-600 rounded-[3rem] p-12 relative overflow-hidden text-center text-white">
            <div className="absolute top-0 right-0 p-12 opacity-10">
              <Award className="w-64 h-64" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 relative z-10">Proud of Our Orbitians!</h2>
            <p className="text-amber-100/90 text-lg max-w-2xl mx-auto mb-8 relative z-10 leading-relaxed">
              Every result tells a story of dedication, hard work, and the pursuit of excellence. We congratulate all our students on their brilliant success.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
