import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/mongodb/client";
import { Loader2, FileText } from "lucide-react";
import 'react-quill-new/dist/quill.snow.css';

interface Section {
  title: string;
  content: string;
}

const Terms = () => {
  const { data: page, isLoading } = useQuery({
    queryKey: ["legal-page-terms"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("legal_pages")
        .select("*")
        .eq("page_type", "terms")
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const defaultTerms = {
    page_title: "Terms & Conditions",
    last_updated: "January 2026",
    content: "<p>By accessing Orbit School's services and website, you agree to comply with the following terms and conditions.</p>",
    sections: [
      {
        title: "Admission & Enrollment",
        content: "<p>Enrollment is subject to our admission policy, seat availability, and completion of required documentation.</p>"
      },
      {
        title: "Fee Policy",
        content: "<p>All school fees must be paid according to the published schedule. Late payments may incur penalties or suspension of services.</p>"
      },
      {
        title: "Code of Conduct",
        content: "<p>Students and parents are expected to maintain the highest standards of behavior and respect within the school community.</p>"
      },
      {
        title: "Use of Facilities",
        content: "<p>School resources and facilities must be used responsibly and solely for educational purposes.</p>"
      },
      {
        title: "Limitation of Liability",
        content: "<p>While we strive for excellence, the school is not liable for indirect or incidental damages arising from the use of its services.</p>"
      }
    ]
  };

  const currentPage = page || defaultTerms;
  const sections: Section[] = Array.isArray(currentPage?.sections) ? currentPage.sections : [];

    return (
      <div className="min-h-screen bg-white">
        <Header variant="light" />
        <main>
          {/* Hero Section */}
          <section className="relative pt-32 pb-20 bg-[#F9FAFB] overflow-hidden">
            <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 skew-x-12 translate-x-1/2" />
            <div className="container relative">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                  <FileText className="w-4 h-4" />
                  <span>Legal Document</span>
                </div>
                <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-[#1A1A1A] mb-6">
                  {currentPage?.page_title || "Terms & Conditions"}
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  These terms and conditions outline the rules and regulations for the use of Orbit School's website and services.
                </p>
                {currentPage?.last_updated && (
                  <div className="mt-8 flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="w-2 h-2 rounded-full bg-primary" />
                    Last Updated: {currentPage.last_updated}
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
                      {currentPage?.content && (
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
                        <div className="">
                          <style>{`
                            .ql-editor {
                              font-size: 1rem;
                              line-height: 1.5;
                              padding: 0;
                            }
                            .ql-editor p {
                              margin-bottom: 0;
                            }
                          `}</style>
                          {currentPage?.content && (
                            <div id="introduction" className="mb-12 border-b border-border pb-12 ql-snow">
                              <div className="ql-editor" dangerouslySetInnerHTML={{ __html: currentPage.content }} />
                            </div>
                          )}
      
                          <div className="space-y-16">
                            {sections.map((section, index) => (
                              <div key={index} id={`section-${index}`} className="scroll-mt-32">
                                <h2 className="font-heading text-3xl font-bold text-[#1A1A1A] mb-6">
                                  {index + 1}. {section.title}
                                </h2>
                                <div className="ql-snow">
                                  <div className="ql-editor" dangerouslySetInnerHTML={{ __html: section.content }} />
                                </div>
                              </div>
                            ))}
                          </div>
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

export default Terms;
