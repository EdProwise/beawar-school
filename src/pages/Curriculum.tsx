import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/mongodb/client";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Loader2, BookOpen } from "lucide-react";
import { FormattedContent } from "@/components/ui/formatted-content";

export default function Curriculum() {
  const { data: curriculumData, isLoading } = useQuery({
    queryKey: ["curriculum"],
    queryFn: async () => {
      const { data, error } = await supabase.from("curriculum").select("*").order("sort_order", { ascending: true });
      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero */}
        <section className="pt-32 pb-20 bg-gradient-to-b from-primary to-primary-dark relative overflow-hidden text-center">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.2),transparent_50%)]" />
          </div>
          <div className="container relative">
            <span className="inline-block px-4 py-2 bg-primary-foreground/10 text-primary-foreground rounded-full text-sm font-medium mb-4 uppercase tracking-wider">
              Academics
            </span>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6">
              Our Curriculum
            </h1>
            <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">
              A balanced and rigorous educational framework designed to foster intellectual growth and personal development.
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="py-20 bg-background">
          <div className="container">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
              </div>
            ) : curriculumData && curriculumData.length > 0 ? (
              <div className="max-w-4xl mx-auto space-y-16">
                {curriculumData.map((section: any) => (
                  <div key={section.id} className="relative pl-8 border-l-2 border-primary-light">
                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-primary" />
                    <h2 className="text-3xl font-bold text-foreground mb-6">{section.title}</h2>
                    <div className="prose prose-lg max-w-none text-muted-foreground">
                      <FormattedContent content={section.content} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <BookOpen className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
                <h3 className="text-2xl font-semibold text-muted-foreground">Curriculum details coming soon</h3>
                <p className="text-muted-foreground mt-2">We are currently updating our curriculum information.</p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
