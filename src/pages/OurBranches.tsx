import { useState, useMemo } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MapPin, Phone, Mail, Clock, Loader2, Building, Search, Globe, Filter, ExternalLink, X } from "lucide-react";
import { useSiteSettings, useBranches } from "@/hooks/use-school-data";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import SEOHead, { breadcrumbSchema } from "@/components/SEOHead";

export function OurBranches() {
  const { data: settings } = useSiteSettings();
  const { data: branches, isLoading } = useBranches();
  const schoolName = settings?.school_name || "Orbit School";

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("all");
  const [selectedState, setSelectedState] = useState("all");

  const activeBranches = branches?.filter(b => b.is_active) || [];

  // Get unique cities and states for filters
  const cities = useMemo(() => {
    const uniqueCities = Array.from(new Set(activeBranches.map(b => b.city).filter(Boolean)));
    return ["all", ...uniqueCities];
  }, [activeBranches]);

  const states = useMemo(() => {
    const uniqueStates = Array.from(new Set(activeBranches.map(b => b.state).filter(Boolean)));
    return ["all", ...uniqueStates];
  }, [activeBranches]);

  const filteredBranches = useMemo(() => {
    return activeBranches.filter(branch => {
      const matchesSearch = 
        branch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        branch.address.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCity = selectedCity === "all" || branch.city === selectedCity;
      const matchesState = selectedState === "all" || branch.state === selectedState;

      return matchesSearch && matchesCity && matchesState;
    });
  }, [activeBranches, searchQuery, selectedCity, selectedState]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCity("all");
    setSelectedState("all");
  };

  return (
    <div className="min-h-screen">
      <SEOHead
          title="Our Branches"
          description="Explore the various branches of Beawar School across locations. Find a campus near you."
          keywords="school branches, campuses, Beawar School locations"
          jsonLd={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Our Branches", path: "/our-branches" }])}
        />
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

        {/* Filters Section */}
        <section className="py-8 bg-card border-b border-border sticky top-[80px] z-20 shadow-sm">
          <div className="container">
            <div className="flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-1 w-full">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Search Branches</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search by name or address..." 
                    className="pl-10 h-11"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <div className="w-full md:w-48">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">City</label>
                <Select value={selectedCity} onValueChange={setSelectedCity}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="All Cities" />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map(city => (
                      <SelectItem key={city} value={city || "all"}>
                        {city === "all" ? "All Cities" : city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-full md:w-48">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">State</label>
                <Select value={selectedState} onValueChange={setSelectedState}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="All States" />
                  </SelectTrigger>
                  <SelectContent>
                    {states.map(state => (
                      <SelectItem key={state} value={state || "all"}>
                        {state === "all" ? "All States" : state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {(searchQuery || selectedCity !== "all" || selectedState !== "all") && (
                <Button 
                  variant="ghost" 
                  className="h-11 px-4 text-muted-foreground"
                  onClick={clearFilters}
                >
                  <X className="w-4 h-4 mr-2" />
                  Clear
                </Button>
              )}
            </div>
          </div>
        </section>

        {/* Branches List */}
        <section className="py-16 bg-background">
          <div className="container">
            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : filteredBranches.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredBranches.map((branch) => (
                  <Card key={branch.id} className="group overflow-hidden border border-border shadow-sm hover:shadow-xl transition-all duration-500 rounded-2xl flex flex-col">
                    <div className="aspect-[16/10] relative overflow-hidden">
                      {branch.images && branch.images.length > 0 ? (
                        <img 
                          src={branch.images[0]} 
                          alt={branch.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                          <Building className="w-12 h-12 text-muted-foreground/20" />
                        </div>
                      )}
                      
                      {/* Badge overlays */}
                      <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                        {branch.city && (
                          <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm text-primary border-none shadow-sm">
                            {branch.city}
                          </Badge>
                        )}
                        {branch.state && (
                          <Badge variant="outline" className="bg-primary/90 backdrop-blur-sm text-white border-none shadow-sm">
                            {branch.state}
                          </Badge>
                        )}
                      </div>

                      {branch.website && (
                        <a 
                          href={branch.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-primary shadow-lg hover:bg-primary hover:text-white transition-all transform translate-y-12 group-hover:translate-y-0 duration-300"
                          title="Visit Website"
                        >
                          <Globe className="w-5 h-5" />
                        </a>
                      )}
                    </div>

                    <CardContent className="p-6 flex flex-col flex-1">
                      <div className="flex-1">
                        <h2 className="text-xl font-bold text-foreground mb-3 line-clamp-1 group-hover:text-primary transition-colors">
                          {branch.name}
                        </h2>
                        
                        <div className="space-y-3 mb-6">
                          <div className="flex items-start gap-3">
                            <MapPin className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                              {branch.address}
                            </p>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            {branch.phone && (
                              <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-accent-dark flex-shrink-0" />
                                <span className="text-xs text-muted-foreground truncate">{branch.phone}</span>
                              </div>
                            )}
                            {branch.email && (
                              <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                                <span className="text-xs text-muted-foreground truncate">{branch.email}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-border flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          <span>{branch.hours}</span>
                        </div>
                        {branch.website && (
                          <a 
                            href={branch.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-primary text-xs font-bold flex items-center gap-1 hover:underline"
                          >
                            Website <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-24 bg-muted/30 rounded-[2rem] border-2 border-dashed border-border">
                <div className="w-20 h-20 bg-background rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                  <Search className="w-10 h-10 text-muted-foreground/30" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2">No Matching Branches</h3>
                <p className="text-muted-foreground max-w-md mx-auto mb-8">
                  We couldn't find any branches matching your search criteria. Try adjusting your filters or search query.
                </p>
                <Button onClick={clearFilters} variant="outline" className="rounded-full px-8">
                  Reset All Filters
                </Button>
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

