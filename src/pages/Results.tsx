import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/mongodb/client";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Loader2, Trophy } from "lucide-react";
import { FormattedContent } from "@/components/ui/formatted-content";

export default function Results() {
  const { data: resultsData, isLoading } = useQuery({
    queryKey: ["results"],
    queryFn: async () => {
      const { data, error } = await supabase.from("results").select("*").order("sort_order", { ascending: true });
      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero */}
        <section className="pt-32 pb-20 bg-gradient-to-b from-amber-600 to-amber-800 relative overflow-hidden text-center">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.2),transparent_50%)]" />
          </div>
          <div className="container relative">
            <span className="inline-block px-4 py-2 bg-amber-100/10 text-amber-100 rounded-full text-sm font-medium mb-4 uppercase tracking-wider">
              Achievements
            </span>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Our Results
            </h1>
            <p className="text-amber-100/80 text-lg max-w-2xl mx-auto">
              Celebrating the academic excellence and outstanding achievements of our students across various examinations.
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="py-20 bg-background">
          <div className="container">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-10 h-10 animate-spin text-amber-600" />
              </div>
            ) : resultsData && resultsData.length > 0 ? (
              <div className="max-w-5xl mx-auto space-y-12">
                {resultsData.map((result: any) => (
                  <div key={result.id} className="group bg-card rounded-2xl border border-border overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
                    <div className="bg-amber-50 px-8 py-4 border-b border-border flex items-center justify-between">
                      <h2 className="text-2xl font-bold text-amber-900">{result.title}</h2>
                      <Trophy className="w-6 h-6 text-amber-600" />
                    </div>
                    <div className="p-8 prose prose-lg max-w-none text-muted-foreground">
                      <FormattedContent content={result.content} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <Trophy className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
                <h3 className="text-2xl font-semibold text-muted-foreground">Results coming soon</h3>
                <p className="text-muted-foreground mt-2">We are compiling our latest academic achievements.</p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
