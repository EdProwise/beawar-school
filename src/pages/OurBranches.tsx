import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MapPin, Phone, Mail, Clock, Loader2, Building } from "lucide-react";
import { useSiteSettings, useBranches } from "@/hooks/use-school-data";

export function OurBranches() {
  const { data: settings } = useSiteSettings();
  const { data: branches, isLoading } = useBranches();
  const schoolName = settings?.school_name || "Orbit School";

  const activeBranches = branches?.filter(b => b.is_active) || [];

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero */}
        <section className="pt-32 pb-20 bg-gradient-to-b from-primary to-primary-dark relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.2),transparent_50%)]" />
          </div>
          <div className="container relative text-center">
            <span className="inline-block px-4 py-2 bg-primary-foreground/10 text-primary-foreground rounded-full text-sm font-medium mb-4">
              Our Presence
            </span>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6">
              Our Branches
            </h1>
            <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">
              Find the {schoolName} campus nearest to you and join our community of learners.
            </p>
          </div>
        </section>

        {/* Branches List */}
        <section className="py-20 bg-background">
          <div className="container">
            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : activeBranches.length > 0 ? (
              <div className="grid lg:grid-cols-2 gap-12">
                {activeBranches.map((branch) => (
                  <div key={branch.id} className="bg-card border border-border rounded-3xl overflow-hidden shadow-strong group hover:-translate-y-1 transition-all duration-300">
                    <div className="aspect-video relative overflow-hidden">
                      {branch.map_url ? (
                        <iframe
                          src={branch.map_url}
                          width="100%"
                          height="100%"
                          style={{ border: 0 }}
                          allowFullScreen
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                          title={branch.name}
                          className="grayscale group-hover:grayscale-0 transition-all duration-500"
                        ></iframe>
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                          <MapPin className="w-12 h-12 text-muted-foreground/30" />
                        </div>
                      )}
                    </div>
                    <div className="p-8">
                      <h2 className="font-heading text-2xl font-bold text-foreground mb-6">{branch.name}</h2>
                      <div className="space-y-4">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <MapPin className="w-5 h-5 text-primary" />
                          </div>
                          <p className="text-muted-foreground pt-2">{branch.address}</p>
                        </div>
                        {branch.phone && (
                          <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                              <Phone className="w-5 h-5 text-accent-dark" />
                            </div>
                            <p className="text-muted-foreground pt-2">{branch.phone}</p>
                          </div>
                        )}
                        {branch.email && (
                          <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0">
                              <Mail className="w-5 h-5 text-indigo-600" />
                            </div>
                            <p className="text-muted-foreground pt-2">{branch.email}</p>
                          </div>
                        )}
                        {branch.hours && (
                          <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
                              <Clock className="w-5 h-5 text-emerald-600" />
                            </div>
                            <p className="text-muted-foreground pt-2">{branch.hours}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-muted/30 rounded-3xl border-2 border-dashed border-border">
                <Building className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
                <h3 className="text-xl font-heading font-semibold mb-2">No Branches Found</h3>
                <p className="text-muted-foreground">We are coming soon to your area!</p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default OurBranches;
