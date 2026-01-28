import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useBeyondAcademics } from "@/hooks/use-school-data";
import { FormattedContent } from "@/components/ui/formatted-content";
import { Loader2, Zap } from "lucide-react";

export default function BeyondAcademics() {
  const { data: sections, isLoading } = useBeyondAcademics();

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-20 bg-gradient-to-b from-primary to-primary-dark relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.2),transparent_50%)]" />
          </div>
          <div className="container relative text-center">
            <span className="inline-block px-4 py-2 bg-primary-foreground/10 text-primary-foreground rounded-full text-sm font-medium mb-4">
              Holistic Development
            </span>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6">
              Beyond Academics
            </h1>
            <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">
              Nurturing talents, building character, and providing diverse opportunities for growth outside the classroom.
            </p>
          </div>
        </section>

        {/* Content Sections */}
        <section className="py-20 bg-background">
          <div className="container">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : sections && sections.length > 0 ? (
              <div className="space-y-24">
                {sections.map((section, index) => (
                  <div 
                    key={section.id} 
                    className={`grid lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}
                  >
                    <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                      <h2 className="text-3xl font-bold mb-6 text-foreground flex items-center gap-3">
                        <span className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                          {index + 1}
                        </span>
                        {section.title}
                      </h2>
                      <div className="prose prose-slate max-w-none">
                        <FormattedContent content={section.content} />
                      </div>
                    </div>
                    <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                      <div className="relative group">
                        <div className="absolute -inset-4 bg-primary/5 rounded-[2rem] rotate-1 group-hover:rotate-0 transition-transform duration-500" />
                        <div className="relative aspect-video rounded-2xl bg-secondary flex items-center justify-center overflow-hidden border border-border">
                          <Zap className="w-12 h-12 text-primary/20" />
                          <p className="absolute bottom-4 text-xs text-muted-foreground uppercase tracking-widest font-medium">Enrichment Programs</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-card rounded-2xl border border-dashed border-border">
                <Zap className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Coming Soon</h3>
                <p className="text-muted-foreground">We are currently updating our enrichment programs. Please check back soon!</p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
