import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/mongodb/client";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Loader2, Lightbulb } from "lucide-react";
import { FormattedContent } from "@/components/ui/formatted-content";

export default function TeachingMethod() {
  const { data: methodsData, isLoading } = useQuery({
    queryKey: ["teaching-methods"],
    queryFn: async () => {
      const { data, error } = await supabase.from("teaching_methods").select("*").order("sort_order", { ascending: true });
      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero */}
        <section className="pt-32 pb-20 bg-gradient-to-b from-accent to-accent-dark relative overflow-hidden text-center">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.2),transparent_50%)]" />
          </div>
          <div className="container relative">
            <span className="inline-block px-4 py-2 bg-accent-foreground/10 text-accent-foreground rounded-full text-sm font-medium mb-4 uppercase tracking-wider">
              Pedagogy
            </span>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-accent-foreground mb-6">
              Teaching Methods
            </h1>
            <p className="text-accent-foreground/80 text-lg max-w-2xl mx-auto">
              Empowering students through innovative, student-centric, and research-based pedagogical approaches.
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="py-20 bg-background">
          <div className="container">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-10 h-10 animate-spin text-accent" />
              </div>
            ) : methodsData && methodsData.length > 0 ? (
              <div className="max-w-4xl mx-auto grid gap-12">
                {methodsData.map((method: any, index: number) => (
                  <div key={method.id} className="bg-card p-8 rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-accent-light flex items-center justify-center flex-shrink-0">
                        <span className="text-accent font-bold text-xl">{index + 1}</span>
                      </div>
                      <h2 className="text-2xl font-bold text-foreground">{method.title}</h2>
                    </div>
                    <div className="prose prose-lg max-w-none text-muted-foreground">
                      <FormattedContent content={method.content} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <Lightbulb className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
                <h3 className="text-2xl font-semibold text-muted-foreground">Teaching methods coming soon</h3>
                <p className="text-muted-foreground mt-2">We are currently detailing our unique approach to education.</p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
