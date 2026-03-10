import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/mongodb/client";
import { useSiteSettings } from "@/hooks/use-school-data";
import SEOHead, { buildBreadcrumbSchema } from "@/components/SEOHead";
import {
  FileText, Image, ExternalLink, Loader2, ShieldCheck,
  Download, AlertCircle, BookOpen
} from "lucide-react";

interface DisclosureDoc {
  id: string;
  name: string;
  file_url: string;
  file_type: "image" | "document";
  sort_order: number;
  is_published: boolean;
}

function isImageUrl(url: string) {
  return /\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i.test(url);
}

export default function MandatoryDisclosure() {
  const { data: settings } = useSiteSettings();
  const schoolName = settings?.school_name || "Our School";
  const siteUrl = settings?.site_url || "";

  const { data: docs = [], isLoading } = useQuery({
    queryKey: ["mandatory-disclosure"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("mandatory_disclosures")
        .select("*")
        .eq("is_published", true)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return (data || []) as DisclosureDoc[];
    },
  });

  return (
    <div className="min-h-screen">
      <SEOHead
        title="Mandatory Disclosure"
        description={`Mandatory disclosure documents for ${schoolName} as required by School Board regulations.`}
        keywords={`mandatory disclosure, school board, CBSE, documents, ${schoolName}`}
        jsonLd={buildBreadcrumbSchema(siteUrl, [
          { name: "Home", path: "/" },
          { name: "About", path: "/about-us" },
          { name: "Mandatory Disclosure", path: "/mandatory-disclosure" },
        ])}
      />
      <Header />

      <main>
        {/* Hero */}
        <section className="pt-32 pb-20 bg-gradient-to-b from-primary to-primary-dark relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.2),transparent_50%)]" />
          </div>
          <div className="container relative text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-foreground/10 text-primary-foreground rounded-full text-sm font-medium mb-4">
              <ShieldCheck className="w-4 h-4" />
              Transparency & Compliance
            </div>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6">
              Mandatory Disclosure
            </h1>
            <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">
              Official documents and disclosures of {schoolName} as required by the School Board regulations.
            </p>
          </div>
        </section>

        {/* Info Banner */}
        <section className="py-6 bg-amber-50 border-b border-amber-200">
          <div className="container">
            <div className="flex items-start gap-3 max-w-4xl mx-auto text-sm text-amber-800">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-amber-600" />
              <p>
                As per the directives of the Board, the following mandatory documents are disclosed for public access.
                These documents are related to the school's affiliation, infrastructure, staff, and academic activities.
              </p>
            </div>
          </div>
        </section>

        {/* Documents Table */}
        <section className="py-20 bg-gradient-to-br from-slate-50 via-white to-primary/5">
          <div className="container">
            <div className="max-w-5xl mx-auto">

              {/* Section label */}
              <div className="flex items-center justify-center gap-4 mb-12">
                <div className="h-px w-16 bg-gradient-to-r from-transparent to-primary/60" />
                <span className="inline-flex items-center gap-2 px-5 py-2 bg-primary/10 border border-primary/20 text-primary rounded-full text-sm font-semibold tracking-wider uppercase">
                  <BookOpen className="w-4 h-4" />
                  Document Repository
                </span>
                <div className="h-px w-16 bg-gradient-to-l from-transparent to-primary/60" />
              </div>

              {isLoading ? (
                <div className="py-20 flex justify-center">
                  <Loader2 className="w-10 h-10 animate-spin text-primary" />
                </div>
              ) : docs.length === 0 ? (
                <div className="py-20 text-center text-muted-foreground">
                  <FileText className="w-12 h-12 mx-auto mb-4 opacity-30" />
                  <p>No documents have been published yet.</p>
                </div>
              ) : (
                /* Premium Table */
                <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-primary/10 border border-primary/10">
                  {/* Top accent bar */}
                  <div className="h-1 w-full bg-gradient-to-r from-primary via-accent to-primary-dark" />

                  <table className="w-full">
                    {/* Head */}
                    <thead>
                      <tr className="bg-gradient-to-r from-primary/8 via-primary/5 to-accent/8">
                        <th className="text-left px-6 py-4 text-primary font-bold text-xs uppercase tracking-widest w-16">
                          S.No.
                        </th>
                        <th className="text-left px-6 py-4 text-primary font-bold text-xs uppercase tracking-widest">
                          Document Name
                        </th>
                        <th className="text-center px-6 py-4 text-primary font-bold text-xs uppercase tracking-widest w-32 hidden sm:table-cell">
                          Type
                        </th>
                        <th className="text-center px-6 py-4 text-primary font-bold text-xs uppercase tracking-widest w-36">
                          Action
                        </th>
                      </tr>
                    </thead>

                    {/* Body */}
                    <tbody className="bg-white">
                      {docs.map((doc, idx) => {
                        const isImg = isImageUrl(doc.file_url);
                        const isEven = idx % 2 === 0;
                        return (
                          <tr
                            key={doc.id}
                            className={`
                              group border-b border-slate-100 last:border-0 transition-all duration-200
                              ${isEven ? "bg-white" : "bg-slate-50/70"}
                              hover:bg-primary/5 hover:shadow-sm
                            `}
                          >
                            {/* Serial */}
                            <td className="px-6 py-4">
                              <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-sm group-hover:bg-primary group-hover:text-white transition-all duration-200">
                                {idx + 1}
                              </div>
                            </td>

                            {/* Name */}
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className={`
                                  w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200
                                  ${isImg
                                    ? "bg-blue-50 border border-blue-100 group-hover:bg-blue-100"
                                    : "bg-rose-50 border border-rose-100 group-hover:bg-rose-100"
                                  }
                                `}>
                                  {isImg
                                    ? <Image className="w-4 h-4 text-blue-600" />
                                    : <FileText className="w-4 h-4 text-rose-600" />
                                  }
                                </div>
                                <span className="font-semibold text-slate-800 text-sm leading-snug group-hover:text-primary transition-colors">
                                  {doc.name}
                                </span>
                              </div>
                            </td>

                            {/* Type badge */}
                            <td className="px-6 py-4 text-center hidden sm:table-cell">
                              <span className={`
                                inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold
                                ${isImg
                                  ? "bg-blue-50 text-blue-700 border border-blue-200"
                                  : "bg-rose-50 text-rose-700 border border-rose-200"
                                }
                              `}>
                                {isImg ? (
                                  <><Image className="w-3 h-3" /> Image</>
                                ) : (
                                  <><FileText className="w-3 h-3" /> Document</>
                                )}
                              </span>
                            </td>

                            {/* Action */}
                            <td className="px-6 py-4 text-center">
                              <a
                                href={doc.file_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`
                                  inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold
                                  transition-all duration-200 hover:scale-105 hover:shadow-md
                                  ${isImg
                                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                                    : "bg-primary hover:bg-primary-dark text-primary-foreground"
                                  }
                                `}
                              >
                                {isImg ? (
                                  <><ExternalLink className="w-3.5 h-3.5" /> View</>
                                ) : (
                                  <><Download className="w-3.5 h-3.5" /> Download</>
                                )}
                              </a>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>

                  {/* Bottom footer bar */}
                  <div className="bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 px-6 py-3 border-t border-primary/10 flex items-center justify-between">
                    <span className="text-xs text-muted-foreground font-medium">
                      {docs.length} document{docs.length !== 1 ? "s" : ""} listed
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {schoolName} &mdash; Mandatory Disclosure
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
