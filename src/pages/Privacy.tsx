import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/mongodb/client";
import { Loader2, Shield } from "lucide-react";

interface Section {
  title: string;
  content: string;
}

const Privacy = () => {
  const { data: page, isLoading } = useQuery({
    queryKey: ["legal-page-privacy"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("legal_pages")
        .select("*")
        .eq("page_type", "privacy")
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const sections: Section[] = Array.isArray(page?.sections) ? page.sections : [];

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero */}
        <section className="pt-32 pb-16 bg-gradient-to-b from-primary to-primary-dark">
          <div className="container text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-foreground/10 mb-6">
              <Shield className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
              {page?.page_title || "Privacy Policy"}
            </h1>
            {page?.last_updated && (
              <p className="text-primary-foreground/70">
                Last Updated: {page.last_updated}
              </p>
            )}
          </div>
        </section>

        {/* Content */}
        <section className="py-16 bg-background">
          <div className="container max-w-4xl">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : (
                <div className="prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-li:text-muted-foreground">
                  {page?.content && (
                    <div className="mb-8" dangerouslySetInnerHTML={{ __html: page.content }} />
                  )}

                  {sections.map((section, index) => (
                    <div key={index} className="mb-8">
                      <h2 className="font-heading text-2xl font-bold text-foreground mb-4">
                        {index + 1}. {section.title}
                      </h2>
                      <div dangerouslySetInnerHTML={{ __html: section.content }} />
                    </div>
                  ))}


                {sections.length === 0 && !page?.content && (
                  <p className="text-center text-muted-foreground py-12">
                    Privacy policy content coming soon.
                  </p>
                )}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Privacy;
