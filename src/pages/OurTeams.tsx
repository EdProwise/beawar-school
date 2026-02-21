import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useSiteSettings, useTeams, type TeamMember } from "@/hooks/use-school-data";
import { Loader2, Users, Search, X, Mail, Phone, Info } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FormattedContent } from "@/components/ui/formatted-content";

export function OurTeams() {
  const { data: settings } = useSiteSettings();
  const { data: teams, isLoading } = useTeams();
  const schoolName = settings?.school_name || "";

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  const activeTeams = teams?.filter(m => m.is_active) || [];

  const filteredTeams = activeTeams.filter(member => 
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.position.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const cardStyles = [
    { border: "border-indigo-500/20", accent: "bg-indigo-500", text: "text-indigo-600", light: "bg-indigo-50", shadow: "shadow-indigo-500/10" },
    { border: "border-emerald-500/20", accent: "bg-emerald-500", text: "text-emerald-600", light: "bg-emerald-50", shadow: "shadow-emerald-500/10" },
    { border: "border-amber-500/20", accent: "bg-amber-500", text: "text-amber-600", light: "bg-amber-50", shadow: "shadow-amber-500/10" },
    { border: "border-rose-500/20", accent: "bg-rose-500", text: "text-rose-600", light: "bg-rose-50", shadow: "shadow-rose-500/10" },
    { border: "border-cyan-500/20", accent: "bg-cyan-500", text: "text-cyan-600", light: "bg-cyan-50", shadow: "shadow-cyan-500/10" },
    { border: "border-violet-500/20", accent: "bg-violet-500", text: "text-violet-600", light: "bg-violet-50", shadow: "shadow-violet-500/10" },
  ];

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
              Our Educators & Leaders
            </span>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6">
              Our Teams
            </h1>
            <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">
              Meet the dedicated professionals who shape the future of our students at {schoolName}.
            </p>
          </div>
        </section>

        {/* Search Section */}
        <section className="py-8 bg-card border-b border-border sticky top-[80px] z-20 shadow-sm">
          <div className="container">
            <div className="max-w-xl mx-auto relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input 
                placeholder="Search by name or position..." 
                className="pl-11 h-12 rounded-full border-border focus:ring-primary shadow-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-secondary rounded-full transition-colors"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Teams List */}
        <section className="py-20 bg-background">
          <div className="container">
            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : filteredTeams.length > 0 ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {filteredTeams.map((member, idx) => {
                    const style = cardStyles[idx % cardStyles.length];
                    return (
                      <Card 
                        key={member.id} 
                        className={`group overflow-hidden border ${style.border} bg-card hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 rounded-2xl flex flex-col cursor-pointer ${style.shadow}`}
                        onClick={() => setSelectedMember(member)}
                      >
                        <div className="aspect-[4/5] relative overflow-hidden">
                          {member.images?.[0] ? (
                            <img 
                              src={member.images[0]} 
                              alt={member.name}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                          ) : (
                            <div className={`w-full h-full ${style.light} flex items-center justify-center`}>
                              <Users className={`w-16 h-16 ${style.text} opacity-20`} />
                            </div>
                          )}
                          <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6`}>
                            <span className="text-white text-sm font-medium flex items-center gap-2">
                              Click to View Full Profile <Info className="w-4 h-4" />
                            </span>
                          </div>
                          <div className={`absolute top-4 left-4 ${style.accent} text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-lg`}>
                            {member.position.split(' ')[0]}
                          </div>
                        </div>

                        <CardContent className="p-6 text-center flex-1 flex flex-col relative">
                          <div className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-1.5 ${style.accent} rounded-full`} />
                          <div className="flex-1">
                            <h3 className={`text-xl font-bold text-foreground mb-1 group-hover:${style.text} transition-colors`}>
                              {member.name}
                            </h3>
                            <p className={`${style.text} font-semibold text-sm mb-4`}>
                              {member.position}
                            </p>
                          </div>
                          <Button variant="outline" size="sm" className={`w-full gap-2 mt-auto border-2 ${style.border} hover:${style.accent} hover:text-white transition-all duration-300 font-bold rounded-xl group-hover:shadow-lg`}>
                            View Profile
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

            ) : (
              <div className="text-center py-20 bg-secondary/20 rounded-3xl border-2 border-dashed border-border">
                <Users className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-foreground mb-2">No Team Members Found</h3>
                <p className="text-muted-foreground">Try adjusting your search query.</p>
                <Button variant="outline" onClick={() => setSearchQuery("")} className="mt-6 rounded-full">
                  Show All Members
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* Member Profile Modal */}
        <Dialog open={!!selectedMember} onOpenChange={(open) => !open && setSelectedMember(null)}>
          <DialogContent className="max-w-4xl p-0 overflow-hidden border-none rounded-2xl sm:rounded-3xl shadow-strong">
            {selectedMember && (
              <div className="grid md:grid-cols-5 h-full max-h-[90vh] overflow-y-auto md:overflow-hidden">
                <div className="md:col-span-2 aspect-[4/5] md:aspect-auto relative bg-secondary/30">
                  {selectedMember.images?.[0] ? (
                    <img 
                      src={selectedMember.images[0]} 
                      alt={selectedMember.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Users className="w-24 h-24 text-muted-foreground/20" />
                    </div>
                  )}
                </div>
                <div className="md:col-span-3 p-8 md:p-12 bg-card flex flex-col h-full overflow-y-auto">
                  <DialogHeader className="mb-8">
                    <DialogTitle className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                      {selectedMember.name}
                    </DialogTitle>
                    <p className="text-xl text-primary font-semibold">
                      {selectedMember.position}
                    </p>
                  </DialogHeader>
                  
                  <div className="prose prose-sm md:prose-base max-w-none text-muted-foreground leading-relaxed flex-1">
                    <FormattedContent content={selectedMember.description} />
                  </div>

                    <div className="mt-12 pt-8 border-t border-border flex flex-wrap gap-4">
                      {selectedMember.email && (
                        <a 
                          href={`mailto:${selectedMember.email}`}
                          className="flex items-center gap-3 px-6 py-3 bg-secondary/50 hover:bg-primary hover:text-white transition-all duration-300 rounded-2xl group shadow-sm hover:shadow-lg border border-border"
                        >
                          <div className="w-10 h-10 rounded-xl bg-background flex items-center justify-center group-hover:bg-white/20 transition-colors">
                            <Mail className="w-5 h-5 text-primary group-hover:text-white" />
                          </div>
                          <div>
                            <p className="text-[10px] uppercase font-bold tracking-wider opacity-60">Email Address</p>
                            <p className="text-sm font-semibold">{selectedMember.email}</p>
                          </div>
                        </a>
                      )}
                    </div>

                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </main>
      <Footer />
    </div>
  );
}

export default OurTeams;
