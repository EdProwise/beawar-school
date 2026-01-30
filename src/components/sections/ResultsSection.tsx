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

  return (
    <section className="py-20 bg-gradient-to-b from-background to-secondary/30 overflow-hidden" id="results">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 font-medium text-sm mb-4 border border-amber-500/20">
            <Trophy className="w-4 h-4" />
            Academic Excellence
          </div>
          <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4 text-foreground">
            Our Outstanding <span className="text-primary italic">Results</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Celebrating the hard work and dedication of our toppers from the academic year {results[0]?.year}.
          </p>
          <Badge variant="outline" className="mt-6 text-base px-4 py-1.5 border-primary/20 bg-primary/5 text-primary">
            Academic Session {results[0]?.year}
          </Badge>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {results.map((result, index) => (
            <motion.div
              key={result.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="group relative overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-500 bg-card h-full">
                <div className="absolute top-0 right-0 p-2 z-10">
                  {index === 0 ? (
                    <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center shadow-lg shadow-amber-500/40 text-white">
                      <Trophy className="w-4 h-4" />
                    </div>
                  ) : index < 3 ? (
                    <div className="w-6 h-6 bg-slate-200 rounded-full flex items-center justify-center shadow-lg text-slate-600">
                      <Medal className="w-3 h-3" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                      <Star className="w-3 h-3 fill-primary" />
                    </div>
                  )}
                </div>

                <CardContent className="p-0">
                  <div className="flex flex-col">
                    <div className="relative aspect-[3/4] overflow-hidden">
                      {result.photo_url ? (
                        <img
                          src={result.photo_url}
                          alt={result.student_name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full bg-secondary flex items-center justify-center">
                          <Trophy className="w-12 h-12 text-muted-foreground/20" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                      
                      <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                        <Badge className="mb-1 bg-primary/90 border-none text-white font-bold text-[10px] px-1.5 py-0">
                          {result.percentage}%
                        </Badge>
                        <h3 className="text-sm font-bold font-heading leading-tight truncate">
                          {result.student_name}
                        </h3>
                        <p className="text-white/80 text-[10px] font-medium mt-0.5 truncate">
                          {result.category}
                        </p>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-card border-t border-border">
                      <p className="text-muted-foreground italic text-[10px] line-clamp-1">
                        "{result.remarks}"
                      </p>
                      <div className="mt-2 flex items-center justify-between text-[9px] font-semibold uppercase tracking-wider text-primary">
                        <span>Excellent</span>
                        <ArrowRight className="w-3 h-3 transform group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
