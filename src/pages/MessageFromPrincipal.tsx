import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { usePrincipalMessage, useSiteSettings } from "@/hooks/use-school-data";
import { FormattedContent } from "@/components/ui/formatted-content";
import { Loader2, Building2, GraduationCap, Star, Quote, Users } from "lucide-react";
import SEOHead, { buildBreadcrumbSchema } from "@/components/SEOHead";

export function MessageFromPrincipal() {
  const { data: message, isLoading } = usePrincipalMessage();
  const { data: settings } = useSiteSettings();
  const schoolName = settings?.school_name || "";
  const siteUrl = settings?.site_url || "";

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={`Message from Principal | ${schoolName}`}
        description={`Read the inspiring message from the Principal of ${schoolName}. A vision for academic excellence and holistic development.`}
        keywords={`${schoolName} principal message, principal's address`}
        canonicalPath="/about/message-from-principal"
        jsonLd={buildBreadcrumbSchema(siteUrl, [{ name: "Home", path: "/" }, { name: "About", path: "/about" }, { name: "Message from Principal", path: "/about/message-from-principal" }])}
      />
      <Header />
      <main>

        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <section className="pt-32 pb-24 bg-gradient-to-b from-primary to-primary-dark relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,rgba(255,255,255,0.12),transparent_60%)]" />
          <div className="absolute top-8 right-12 w-72 h-72 rounded-full border border-white/10" />
          <div className="absolute top-20 right-28 w-48 h-48 rounded-full border border-white/10" />
          <div className="absolute bottom-8 left-12 w-56 h-56 rounded-full border border-white/10" />
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />
          <div className="container relative text-center">
            <div className="inline-flex items-center gap-2 px-5 py-2 bg-white/10 border border-white/20 rounded-full text-primary-foreground text-sm font-semibold mb-6 backdrop-blur-sm">
              <Building2 className="w-4 h-4" />
              Principal's Message
            </div>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-extrabold text-primary-foreground mb-5 leading-tight">
              {message?.message_heading || "Message from Principal"}
            </h1>
            {message?.message_subheading && (
              <p className="text-primary-foreground/75 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                {message.message_subheading}
              </p>
            )}
            <div className="flex items-center justify-center gap-3 mt-8">
              <div className="w-16 h-px bg-white/30" />
              <Star className="w-4 h-4 text-accent fill-accent" />
              <div className="w-16 h-px bg-white/30" />
            </div>
          </div>
        </section>

        {/* ── Message Body ─────────────────────────────────────────────────── */}
        <section className="py-24 bg-background relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage: "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
              backgroundSize: "40px 40px",
            }}
          />
          <div className="absolute top-0 right-0 w-1/2 h-80 bg-primary/4 rounded-bl-[8rem] -z-0" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-accent/5 rounded-full blur-3xl -z-0" />

          <div className="container relative z-10 max-w-6xl">
            {isLoading ? (
              <div className="flex items-center justify-center py-32">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
              </div>
            ) : message ? (
              <div className="grid lg:grid-cols-12 gap-12 items-start">

                {/* ── Left Sidebar ───────────────────────────────────────── */}
                <div className="lg:col-span-4 xl:col-span-3">
                  <div className="sticky top-28 space-y-5">

                    {/* Photo + name overlay */}
                    <div className="relative group">
                      <div className="absolute -inset-3 bg-gradient-to-br from-primary/25 to-accent/20 rounded-[2.5rem] blur-xl opacity-70 group-hover:opacity-90 transition-opacity duration-500" />
                      <div className="relative rounded-[2rem] overflow-hidden border border-border/60 shadow-2xl bg-card">
                        {message.sender_image_url ? (
                          <img
                            src={message.sender_image_url}
                            alt={message.sender_name}
                            className="w-full aspect-[3/4] object-cover object-top transition-transform duration-700 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full aspect-[3/4] bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10 flex flex-col items-center justify-center gap-4">
                            <div className="w-28 h-28 rounded-full bg-primary/10 border-4 border-primary/20 flex items-center justify-center">
                              <Users className="w-14 h-14 text-primary/50" />
                            </div>
                            <p className="text-muted-foreground text-sm font-medium">Photo</p>
                          </div>
                        )}
                        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/85 via-black/50 to-transparent px-6 pt-12 pb-6">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-6 h-0.5 bg-accent" />
                            <span className="text-accent text-[10px] font-bold uppercase tracking-widest">Leadership</span>
                          </div>
                          <h3 className="font-heading text-xl font-bold text-white leading-tight">{message.sender_name}</h3>
                          <p className="text-white/70 text-sm mt-1 font-medium">{message.sender_title}</p>
                        </div>
                      </div>
                    </div>

                    {/* School info pill only */}
                    {schoolName && (
                      <div className="flex items-center gap-3 px-4 py-3 bg-primary/6 border border-primary/15 rounded-2xl">
                        <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                          <GraduationCap className="w-4 h-4 text-primary" />
                        </div>
                        <p className="text-sm font-semibold text-foreground leading-tight">{schoolName}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* ── Right: Letter ──────────────────────────────────────── */}
                <div className="lg:col-span-8 xl:col-span-9 flex flex-col gap-6">
                  <div className="rounded-3xl overflow-hidden shadow-2xl border border-border/40">
                    <div className="h-2.5 bg-gradient-to-r from-primary via-accent to-primary-dark" />
                    <div className="bg-card px-8 md:px-14 py-10 md:py-14 relative overflow-hidden">
                      <div className="absolute top-4 right-6 opacity-[0.035] select-none pointer-events-none">
                        <Quote className="w-52 h-52 text-primary" />
                      </div>
                      <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                          <Quote className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <div className="flex gap-1 mb-1">
                            <div className="w-10 h-0.5 bg-primary rounded-full" />
                            <div className="w-6 h-0.5 bg-accent rounded-full" />
                          </div>
                          <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
                            A Message from Our Principal
                          </p>
                        </div>
                      </div>

                      <p className="font-heading text-xl font-bold text-foreground mb-7 border-l-4 border-primary pl-5 py-1 bg-primary/4 rounded-r-xl">
                        Dear Friends, Parents &amp; Students,
                      </p>

                      <div className="prose prose-lg max-w-none text-foreground/80 leading-[1.9] space-y-4 mb-10">
                        <FormattedContent content={message.message_content} />
                      </div>

                      <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-border/50" />
                        </div>
                        <div className="relative flex justify-center">
                          <div className="flex items-center gap-2 bg-card px-4">
                            <div className="w-2 h-2 rounded-full bg-primary/40" />
                            <div className="w-1.5 h-1.5 rounded-full bg-accent/40" />
                            <div className="w-2 h-2 rounded-full bg-primary/40" />
                          </div>
                        </div>
                      </div>

                      <div className="flex items-end justify-between flex-wrap gap-8">
                        <div>
                          {message.signature_text && (
                            <p className="text-muted-foreground text-sm italic mb-4">{message.signature_text},</p>
                          )}
                          <div className="mb-4">
                            <div className="w-48 h-px bg-foreground/25 mb-1" />
                            <div className="w-32 h-px bg-foreground/12" />
                          </div>
                          <p className="font-heading text-xl font-extrabold text-foreground tracking-tight">{message.sender_name}</p>
                          <p className="text-primary text-sm font-semibold mt-0.5">{message.sender_title}</p>
                          {schoolName && <p className="text-muted-foreground text-xs mt-1 font-medium">{schoolName}</p>}
                        </div>
                        <div className="shrink-0">
                          <div className="relative w-24 h-24 rounded-full border-[3px] border-primary/30 bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center shadow-inner">
                            <div className="absolute inset-[6px] rounded-full border-2 border-dashed border-primary/25" />
                            <div className="text-center z-10">
                              <Star className="w-6 h-6 text-primary mx-auto fill-primary/20" />
                              <p className="text-[8px] font-black text-primary/70 uppercase tracking-wider mt-0.5 leading-none">Verified</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="relative overflow-hidden rounded-2xl border border-primary/15 bg-gradient-to-r from-primary/6 via-background to-accent/6 px-8 py-6">
                    <div className="absolute left-0 top-0 w-1.5 h-full bg-gradient-to-b from-primary via-accent to-primary-dark rounded-l-2xl" />
                    <div className="flex items-start gap-4 pl-4">
                      <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                        <Building2 className="w-4 h-4 text-primary" />
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        This message reflects our unwavering commitment to providing world-class education
                        and shaping the leaders of tomorrow at{" "}
                        <span className="font-bold text-foreground">{schoolName || "our institution"}</span>.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-32">
                <div className="w-20 h-20 rounded-full bg-muted/30 flex items-center justify-center mx-auto mb-5">
                  <Building2 className="w-9 h-9 text-muted-foreground/30" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2">Message Coming Soon</h3>
                <p className="text-muted-foreground max-w-sm mx-auto">The principal's message will be published here shortly.</p>
              </div>
            )}
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}

export default MessageFromPrincipal;
