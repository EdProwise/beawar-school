import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Loader2, ChevronRight, ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface Section {
  title: string;
  content: string;
}

interface LegalPageLayoutProps {
  title: string;
  lastUpdated?: string | null;
  introContent?: string | null;
  sections: Section[];
  isLoading: boolean;
  icon: React.ReactNode;
}

export function LegalPageLayout({
  title,
  lastUpdated,
  introContent,
  sections,
  isLoading,
  icon,
}: LegalPageLayoutProps) {
  const [activeSection, setActiveSection] = useState<number | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);

      const sectionElements = sections.map((_, i) => document.getElementById(`section-${i}`));
      const scrollPosition = window.scrollY + 200;

      const currentSection = sectionElements.findIndex((el) => {
        if (!el) return false;
        const top = el.offsetTop;
        const bottom = top + el.offsetHeight;
        return scrollPosition >= top && scrollPosition < bottom;
      });

      setActiveSection(currentSection !== -1 ? currentSection : null);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sections]);

  const scrollToSection = (index: number) => {
    const el = document.getElementById(`section-${index}`);
    if (el) {
      const offset = 100;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="relative">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute top-[20%] -right-[10%] w-[30%] h-[30%] bg-primary/10 rounded-full blur-[100px] animate-pulse [animation-delay:2s]" />
        </div>

        {/* Hero Section */}
        <section className="relative pt-32 pb-20 overflow-hidden">
          <div className="container relative z-10">
            <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full scale-150 animate-pulse" />
                <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-primary-foreground shadow-2xl shadow-primary/20">
                  {icon}
                </div>
              </div>
              <h1 className="font-heading text-4xl md:text-6xl font-bold tracking-tight text-foreground mb-6">
                {title}
              </h1>
              {lastUpdated && (
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-secondary text-secondary-foreground text-sm font-medium border border-border">
                  Last Updated: {lastUpdated}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="pb-24">
          <div className="container">
            <div className="grid lg:grid-cols-[280px_1fr] gap-12">
              
              {/* Sticky Sidebar Navigation */}
              <aside className="hidden lg:block">
                <div className="sticky top-32 space-y-4">
                  <div className="p-6 rounded-2xl border border-border bg-card/50 backdrop-blur-xl">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                      On This Page
                    </h3>
                    <nav className="space-y-1">
                      {sections.map((section, i) => (
                        <button
                          key={i}
                          onClick={() => scrollToSection(i)}
                          className={cn(
                            "group flex items-center w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200",
                            activeSection === i 
                              ? "bg-primary text-primary-foreground font-medium shadow-lg shadow-primary/20" 
                              : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                          )}
                        >
                          <span className={cn(
                            "w-1.5 h-1.5 rounded-full mr-3 transition-all",
                            activeSection === i ? "bg-primary-foreground" : "bg-border group-hover:bg-primary/50"
                          )} />
                          <span className="flex-1 truncate">{section.title}</span>
                          <ChevronRight className={cn(
                            "w-4 h-4 opacity-0 -translate-x-2 transition-all",
                            activeSection === i && "opacity-100 translate-x-0"
                          )} />
                        </button>
                      ))}
                    </nav>
                  </div>
                </div>
              </aside>

              {/* Main Content Area */}
              <div className="max-w-none">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-20 bg-card/30 rounded-3xl border border-dashed border-border">
                    <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
                    <p className="text-muted-foreground animate-pulse">Loading content...</p>
                  </div>
                ) : (
                  <div className="space-y-16">
                    {/* Intro */}
                    {introContent && (
                      <div 
                        className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-heading prose-a:text-primary hover:prose-a:text-primary/80 transition-colors"
                        dangerouslySetInnerHTML={{ __html: introContent }} 
                      />
                    )}

                    {/* Sections */}
                    <div className="space-y-12">
                      {sections.map((section, i) => (
                        <div 
                          key={i} 
                          id={`section-${i}`}
                          className="group relative p-8 md:p-10 rounded-3xl border border-border bg-card/30 hover:bg-card/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5"
                        >
                          <div className="absolute -left-3 top-10 w-1 h-12 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300" />
                          <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-6 flex items-center gap-4">
                            <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary text-lg font-bold">
                              {i + 1}
                            </span>
                            {section.title}
                          </h2>
                          <div 
                            className="prose prose-lg dark:prose-invert max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-li:text-muted-foreground prose-strong:text-foreground"
                            dangerouslySetInnerHTML={{ __html: section.content }} 
                          />
                        </div>
                      ))}

                      {sections.length === 0 && !introContent && (
                        <div className="text-center py-20 bg-secondary/20 rounded-3xl border border-dashed border-border">
                          <p className="text-muted-foreground text-lg">
                            Content is currently being updated. Please check back later.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Scroll to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={cn(
          "fixed bottom-8 right-8 p-4 rounded-full bg-primary text-primary-foreground shadow-2xl transition-all duration-300 z-50 hover:scale-110 active:scale-95",
          showScrollTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
        )}
      >
        <ArrowUp className="w-6 h-6" />
      </button>

      <Footer />
    </div>
  );
}
