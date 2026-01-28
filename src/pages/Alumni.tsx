import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/mongodb/client";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Loader2, GraduationCap } from "lucide-react";
import { FormattedContent } from "@/components/ui/formatted-content";

export default function Alumni() {
  const { data: alumniData, isLoading } = useQuery({
    queryKey: ["alumni"],
    queryFn: async () => {
      const { data, error } = await supabase.from("alumni").select("*").order("sort_order", { ascending: true });
      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero */}
        <section className="pt-32 pb-20 bg-gradient-to-b from-indigo-600 to-indigo-800 relative overflow-hidden text-center">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.2),transparent_50%)]" />
          </div>
          <div className="container relative">
            <span className="inline-block px-4 py-2 bg-indigo-100/10 text-indigo-100 rounded-full text-sm font-medium mb-4 uppercase tracking-wider">
              Network
            </span>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Our Alumni
            </h1>
            <p className="text-indigo-100/80 text-lg max-w-2xl mx-auto">
              Connecting our global community of graduates and celebrating their journeys beyond the classroom.
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="py-20 bg-background">
          <div className="container">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
              </div>
            ) : alumniData && alumniData.length > 0 ? (
              <div className="max-w-4xl mx-auto space-y-12">
                {alumniData.map((section: any) => (
                  <div key={section.id} className="relative group">
                    <div className="absolute -inset-4 bg-indigo-50/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                        <GraduationCap className="w-6 h-6" />
                      </div>
                      <h2 className="text-3xl font-bold text-foreground">{section.title}</h2>
                    </div>
                    <div className="prose prose-lg max-w-none text-muted-foreground">
                      <FormattedContent content={section.content} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <GraduationCap className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
                <h3 className="text-2xl font-semibold text-muted-foreground">Alumni portal coming soon</h3>
                <p className="text-muted-foreground mt-2">We are building a platform to connect our alumni worldwide.</p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
