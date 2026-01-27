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
      <div className="min-h-screen bg-white">
        <Header variant="light" />
        <main>
          {/* Hero Section */}
          <section className="relative pt-32 pb-20 bg-[#F9FAFB] overflow-hidden">
            <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 -skew-x-12 translate-x-1/2" />
            <div className="container relative">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                  <Shield className="w-4 h-4" />
                  <span>Legal Document</span>
                </div>
                <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-[#1A1A1A] mb-6">
                  {page?.page_title || "Privacy Policy"}
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  This privacy policy describes how we handle your personal information and ensure your data security while using our services.
                </p>
                {page?.last_updated && (
                  <div className="mt-8 flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="w-2 h-2 rounded-full bg-green-500" />
                    Last Updated: {page.last_updated}
                  </div>
                )}
              </div>
            </div>
          </section>
  
          {/* Content Section */}
          <section className="py-20 bg-white">
            <div className="container">
              <div className="flex flex-col lg:flex-row gap-16">
                {/* Sidebar Navigation */}
                <aside className="lg:w-1/4">
                  <div className="sticky top-32 space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-[#1A1A1A] mb-6">Contents</h3>
                    <nav className="space-y-1">
                      {page?.content && (
                        <a href="#introduction" className="block py-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                          Introduction
                        </a>
                      )}
                      {sections.map((section, index) => (
                        <a 
                          key={index} 
                          href={`#section-${index}`}
                          className="block py-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                          {index + 1}. {section.title}
                        </a>
                      ))}
                    </nav>
                  </div>
                </aside>
  
                {/* Main Content */}
                <div className="lg:w-3/4 max-w-none">
                  {isLoading ? (
                    <div className="flex justify-center py-12">
                      <Loader2 className="w-10 h-10 animate-spin text-primary" />
                    </div>
                  ) : (
                    <div className="prose prose-lg max-w-none prose-headings:font-heading prose-headings:text-[#1A1A1A] prose-p:text-muted-foreground prose-li:text-muted-foreground prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6">
                      {page?.content && (
                        <div id="introduction" className="mb-12 border-b border-border pb-12" dangerouslySetInnerHTML={{ __html: page.content }} />
                      )}
  
                      <div className="space-y-16">
                        {sections.map((section, index) => (
                          <div key={index} id={`section-${index}`} className="scroll-mt-32">
                            <h2 className="font-heading text-3xl font-bold text-[#1A1A1A] mb-6">
                              {index + 1}. {section.title}
                            </h2>
                            <div className="text-muted-foreground leading-relaxed" dangerouslySetInnerHTML={{ __html: section.content }} />
                          </div>
                        ))}
                      </div>
  
                      {sections.length === 0 && !page?.content && (
                        <div className="text-center py-20 bg-[#F9FAFB] rounded-3xl border border-dashed border-border">
                          <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                          <p className="text-muted-foreground">Privacy policy content is currently being updated.</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
};

export default Privacy;
