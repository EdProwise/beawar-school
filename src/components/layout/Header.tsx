import { useState, useEffect, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown, GraduationCap, User, Settings, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSiteSettings, useAdmissionSettings } from "@/hooks/use-school-data";
import { useAuth } from "@/hooks/use-auth";
import { ScrollingTicker } from "./ScrollingTicker";

const navLinks = [
  { name: "Home", path: "/" },
    { 
      name: "About", 
      path: "/about-us",
      children: [
        { name: "About Us", path: "/about-us" },
        { name: "Our Teams", path: "/our-teams" },
        { name: "Our Branches", path: "/our-branches" },
      ]
    },
  { 
    name: "Academics", 
    path: "/academics",
    children: [
      { name: "Academic Programs", path: "/academics" },
      { name: "Curriculum", path: "/curriculum" },
      { name: "Teaching Method", path: "/teaching-method" },
      { name: "Results", path: "/results" },
      { name: "Alumni", path: "/alumni" },
    ]
  },
  { 
    name: "Beyond Academics", 
    path: "/beyond-academics",
    children: [
      { name: "Beyond Academics", path: "/beyond-academics" },
      { name: "Entrepreneur Skills", path: "/beyond-academics/entrepreneur-skills" },
      { name: "Residential School", path: "/beyond-academics/residential-school" },
    ]
  },
    { 
      name: "Admissions", 
      path: "/admissions/process",
      children: [
        { name: "Admission Process", path: "/admissions/process" },
        { name: "Fees Structure", path: "/admissions/fees-structure" },
      ]
    },
  { name: "Infrastructure", path: "/infrastructure" },
  { name: "Gallery", path: "/gallery" },
  { name: "News", path: "/news" },
  { name: "Contact", path: "/contact" },
];

export interface HeaderProps {
  variant?: "transparent" | "solid" | "light";
}

  export function Header({ variant = "solid" }: HeaderProps) {
    const [isScrolled, setIsScrolled] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const location = useLocation();
    const { data: settings } = useSiteSettings();
    const { data: admissionSettings = {} } = useAdmissionSettings();
    const { user } = useAuth();
  
    const isLight = false;
    const isSolid = true;
  
    const schoolName = settings?.school_name || "Orbit School";
    const tagline = settings?.tagline || "Excellence in Education";
  
    const isExternalLink = (url: string) => {
      if (!url) return false;
      return url.startsWith('http://') || 
             url.startsWith('https://') || 
             url.startsWith('//') || 
             url.startsWith('mailto:') || 
             url.startsWith('tel:') ||
             url.endsWith('.pdf');
    };

    const dynamicNavLinks = useMemo(() => {
      const baseLinks = navLinks.map(link => {
        if (link.name === "Admissions" && link.children) {
          const hasProspectus = link.children.some(child => child.name === "Download Prospectus");
          if (!hasProspectus) {
            return {
              ...link,
              children: [
                ...link.children,
                { 
                  name: "Download Prospectus", 
                  path: (admissionSettings as any).brochure_url || "#",
                  isExternal: true 
                }
              ]
            };
          }
        }
        return link;
      });

      // Add CTA buttons as links for mobile menu visibility
      const ctaLinks = [];
      if (settings?.cta_secondary_text && settings?.cta_secondary_link) {
        ctaLinks.push({ name: settings.cta_secondary_text, path: settings.cta_secondary_link, isCta: true });
      }
      if (settings?.cta_primary_text && settings?.cta_primary_link) {
        ctaLinks.push({ name: settings.cta_primary_text, path: settings.cta_primary_link, isCta: true });
      }

      return [...baseLinks, ...ctaLinks];
    }, [admissionSettings, settings]);


  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(true);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 left-0 right-0 z-50 transition-all duration-300 bg-card/95 backdrop-blur-lg shadow-medium py-2"
        )}
      >
        <div className="container mx-auto px-4">
            <div className="flex items-center justify-between gap-4">
              {/* Logo */}
                <Link to="/" className="flex items-center gap-3 group shrink-0">
                  <div className="w-12 h-12 flex items-center justify-center transition-all duration-300">
                    {settings?.logo_url ? (
                      <img src={settings.logo_url} alt={schoolName} className="w-full h-full object-contain" />
                    ) : (
                      <GraduationCap className="w-10 h-10 text-foreground" />
                    )}
                  </div>
                    <div className="flex flex-col">
                      <span className="font-heading font-bold text-xl text-primary whitespace-nowrap">
                        {schoolName}
                      </span>
                      <span className="text-xs font-medium text-primary whitespace-nowrap">
                        {tagline}
                      </span>
                    </div>
                </Link>

                {/* Desktop Navigation Links (Center) */}
                <nav className="hidden lg:flex items-center justify-center flex-1 gap-1">
                  {dynamicNavLinks.filter(l => !(l as any).isCta).map((link) => (
                    <div key={link.name} className="relative group/dropdown">
                    {link.children ? (
                      <>
                        <button
                          className={cn(
                            "px-3 py-2 rounded-lg font-medium text-sm transition-all flex items-center gap-1 whitespace-nowrap",
                            isScrolled || isSolid
                              ? location.pathname.startsWith(link.path)
                                ? "text-primary bg-primary-light"
                                : "text-foreground hover:text-primary hover:bg-secondary"
                              : isLight
                                ? location.pathname.startsWith(link.path)
                                  ? "text-primary bg-primary/10"
                                  : "text-slate-700 hover:text-primary hover:bg-slate-100"
                                : location.pathname.startsWith(link.path)
                                  ? "text-primary-foreground bg-primary-foreground/20"
                                  : "text-primary-foreground/90 hover:text-primary-foreground hover:bg-primary-foreground/10 drop-shadow-sm"
                          )}
                        >
                          {link.name}
                          <ChevronDown className="w-4 h-4" />
                        </button>
                        <div className="absolute top-full left-0 mt-1 w-48 bg-card border border-border rounded-xl shadow-strong opacity-0 invisible group-hover/dropdown:opacity-100 group-hover/dropdown:visible transition-all duration-200 z-50 overflow-hidden">
                          {link.children.map((child) => {
                            const isExternal = (child as any).isExternal || isExternalLink(child.path);
                            if (isExternal) {
                              return (
                                <a
                                  key={child.name}
                                  href={child.path}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={cn(
                                    "block px-4 py-2.5 text-sm font-medium transition-colors hover:bg-secondary text-foreground flex items-center justify-between"
                                  )}
                                >
                                  {child.name}
                                  <FileDown className="w-4 h-4 opacity-50" />
                                </a>
                              );
                            }
                            return (
                              <Link
                                key={child.name}
                                to={child.path}
                                className={cn(
                                  "block px-4 py-2.5 text-sm font-medium transition-colors hover:bg-secondary",
                                  location.pathname === child.path ? "text-primary bg-primary/5" : "text-foreground"
                                )}
                              >
                                {child.name}
                              </Link>
                            );
                          })}
                        </div>
                      </>
                    ) : (
                      <Link
                        to={link.path}
                        className={cn(
                          "px-3 py-2 rounded-lg font-medium text-sm transition-all flex items-center gap-1 whitespace-nowrap",
                          isScrolled || isSolid
                            ? location.pathname === link.path
                              ? "text-primary bg-primary-light"
                              : "text-foreground hover:text-primary hover:bg-secondary"
                            : isLight
                              ? location.pathname === link.path
                                ? "text-primary bg-primary/10"
                                : "text-slate-700 hover:text-primary hover:bg-slate-100"
                              : location.pathname === link.path
                                ? "text-primary-foreground bg-primary-foreground/20"
                                : "text-primary-foreground/90 hover:text-primary-foreground hover:bg-primary-foreground/10 drop-shadow-sm"
                        )}
                      >
                        {link.name}
                      </Link>
                    )}
                  </div>
                ))}
              </nav>

              {/* Desktop CTA Buttons (Right) */}
              <div className="hidden lg:flex items-center gap-2 shrink-0">
                {settings?.cta_secondary_text && settings?.cta_secondary_link && (
                  <Button variant="outline" size="sm" asChild className="rounded-full px-6">
                    {isExternalLink(settings.cta_secondary_link) ? (
                      <a href={settings.cta_secondary_link} target="_blank" rel="noopener noreferrer">
                        {settings.cta_secondary_text}
                      </a>
                    ) : (
                      <Link to={settings.cta_secondary_link}>{settings.cta_secondary_text}</Link>
                    )}
                  </Button>
                )}

                {settings?.cta_primary_text && settings?.cta_primary_link && (
                  <Button variant="default" size="sm" asChild className="rounded-full px-6">
                    {isExternalLink(settings.cta_primary_link) ? (
                      <a href={settings.cta_primary_link} target="_blank" rel="noopener noreferrer">
                        {settings.cta_primary_text}
                      </a>
                    ) : (
                      <Link to={settings.cta_primary_link}>{settings.cta_primary_text}</Link>
                    )}
                  </Button>
                )}

                {user && (
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/admin/dashboard">
                      <Settings className="w-4 h-4" />
                    </Link>
                  </Button>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={cn(
                  "lg:hidden p-2 rounded-lg transition-colors shrink-0",
                  isScrolled || isSolid || isLight ? "text-foreground hover:bg-secondary" : "text-primary-foreground hover:bg-primary-foreground/10"
                )}
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

            </div>
          </div>

            {/* Mobile Navigation */}
            {isMobileMenuOpen && (
              <div className="lg:hidden absolute top-full left-0 right-0 bg-card border-b border-border shadow-strong p-4 max-h-[80vh] overflow-y-auto">
                <div className="flex flex-col gap-2">
                  {dynamicNavLinks.map((link) => (
                    <div key={link.name}>
                      {link.children ? (
                        <div className="space-y-1">
                          <div className="px-4 py-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                            {link.name}
                          </div>
                          {link.children.map((child) => {
                            const isExternal = (child as any).isExternal || isExternalLink(child.path);
                            if (isExternal) {
                              return (
                                <a
                                  key={child.name}
                                  href={child.path}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={cn(
                                    "block px-4 py-2.5 rounded-lg font-medium text-sm transition-all text-foreground hover:bg-secondary flex items-center justify-between"
                                  )}
                                >
                                  {child.name}
                                  <FileDown className="w-4 h-4 opacity-50" />
                                </a>
                              );
                            }
                            return (
                              <Link
                                key={child.name}
                                to={child.path}
                                className={cn(
                                  "block px-4 py-2.5 rounded-lg font-medium text-sm transition-all",
                                  location.pathname === child.path ? "bg-primary/10 text-primary" : "text-foreground hover:bg-secondary"
                                )}
                              >
                                {child.name}
                              </Link>
                            );
                          })}
                        </div>
                      ) : (

                          <Link
                            to={link.path}
                            className={cn(
                              "block px-4 py-3 rounded-lg font-medium text-sm transition-all",
                              (link as any).isCta 
                                ? "bg-primary text-primary-foreground hover:bg-primary/90 mt-2 text-center"
                                : location.pathname === link.path 
                                  ? "bg-primary/10 text-primary" 
                                  : "text-foreground hover:bg-secondary"
                            )}
                          >
                            {link.name}
                          </Link>
                    )}
                  </div>
                ))}
                <hr className="my-2 border-border" />
                
                {/* Mobile CTA Buttons */}
                <div className="flex flex-col gap-2 pt-2">
                  {settings?.cta_secondary_text && settings?.cta_secondary_link && (
                    <Button variant="outline" className="w-full justify-start" asChild>
                      {isExternalLink(settings.cta_secondary_link) ? (
                        <a href={settings.cta_secondary_link} target="_blank" rel="noopener noreferrer">
                          <User className="w-4 h-4 mr-2" />
                          {settings.cta_secondary_text}
                        </a>
                      ) : (
                        <Link to={settings.cta_secondary_link}>
                          <User className="w-4 h-4 mr-2" />
                          {settings.cta_secondary_text}
                        </Link>
                      )}
                    </Button>
                  )}

                  {settings?.cta_primary_text && settings?.cta_primary_link && (
                    <Button variant="default" className="w-full justify-start" asChild>
                      {isExternalLink(settings.cta_primary_link) ? (
                        <a href={settings.cta_primary_link} target="_blank" rel="noopener noreferrer">
                          <GraduationCap className="w-4 h-4 mr-2" />
                          {settings.cta_primary_text}
                        </a>
                      ) : (
                        <Link to={settings.cta_primary_link}>
                          <GraduationCap className="w-4 h-4 mr-2" />
                          {settings.cta_primary_text}
                        </Link>
                      )}
                    </Button>
                  )}

                  {user && (
                    <Link
                      to="/admin/dashboard"
                      className="px-4 py-3 rounded-lg font-medium text-sm text-primary hover:bg-primary/5 flex items-center gap-2"
                    >
                      <Settings className="w-4 h-4" /> Admin Panel
                    </Link>
                  )}
                </div>
              </div>
            </div>
          )}
        
        {/* Scrolling Ticker integrated into header so it's fixed below menu */}
        <ScrollingTicker />
      </header>
    </>
  );
}
