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
  const schoolName = settings?.school_name || "Orbit School";

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  const activeTeams = teams?.filter(m => m.is_active) || [];

  const filteredTeams = activeTeams.filter(member => 
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.position.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
                {filteredTeams.map((member) => (
                  <Card 
                    key={member.id} 
                    className="group overflow-hidden border-border bg-card hover:shadow-elegant transition-all duration-500 rounded-2xl flex flex-col cursor-pointer"
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
                          <div className="w-full h-full bg-secondary/50 flex items-center justify-center">
                            <Users className="w-16 h-16 text-muted-foreground/20" />
                          </div>
                        )}
                      </div>

                      <CardContent className="p-6 text-center flex-1 flex flex-col">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                            {member.name}
                          </h3>
                          <p className="text-primary font-medium text-sm mb-3">
                            {member.position}
                          </p>
                          <div className="w-12 h-1 bg-primary/20 mx-auto rounded-full group-hover:w-20 group-hover:bg-primary transition-all duration-500 mb-6" />
                        </div>
                        <Button variant="gold" size="sm" className="w-full gap-2 mt-auto">
                          <Info className="w-4 h-4" />
                          View Profile
                        </Button>
                      </CardContent>
                  </Card>
                ))}
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
                    <Button variant="outline" size="sm" className="rounded-full pointer-events-none opacity-50">
                      <Mail className="w-4 h-4 mr-2" />
                      Contact via School
                    </Button>
                    <Button variant="outline" size="sm" className="rounded-full pointer-events-none opacity-50">
                      <Phone className="w-4 h-4 mr-2" />
                      Extension: --
                    </Button>
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
