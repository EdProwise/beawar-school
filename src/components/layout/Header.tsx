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
          { name: "Career", path: "/career" },
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
    const [mobileOpenDropdown, setMobileOpenDropdown] = useState<string | null>(null);
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const location = useLocation();
    const { data: settings } = useSiteSettings();
    const { data: admissionSettings = {} } = useAdmissionSettings();
    const { user } = useAuth();
  
    // Track page visit
    useEffect(() => {
      // Skip admin pages
      if (location.pathname.startsWith('/admin')) return;
      const controller = new AbortController();
      fetch('/api/visits/record', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          page: location.pathname,
          referrer: document.referrer,
          user_agent: navigator.userAgent,
        }),
        signal: controller.signal,
      }).catch(() => {});
      return () => controller.abort();
    }, [location.pathname]);

    const isLight = false;
    const isSolid = true;
  
    const schoolName = settings?.school_name || "";
    const tagline = settings?.tagline || "";
  
    const isExternalLink = (url: string) => {
      if (!url) return false;
      return url.startsWith('http://') || 
             url.startsWith('https://') || 
             url.startsWith('//') || 
             url.startsWith('mailto:') || 
             url.startsWith('tel:') ||
             url.endsWith('.pdf') ||
             /^www\./i.test(url);
    };

    const ensureAbsoluteUrl = (url: string) => {
      if (!url) return url;
      if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('//') || url.startsWith('mailto:') || url.startsWith('tel:')) {
        return url;
      }
      if (/^www\./i.test(url) || (!url.startsWith('/') && url.includes('.'))) {
        return `https://${url}`;
      }
      return url;
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
                      <div className="flex flex-col overflow-hidden">
                        <span className="font-heading font-bold text-lg sm:text-xl text-primary leading-tight">
                          {schoolName}
                        </span>
                        <span className="text-[10px] sm:text-xs font-medium text-primary leading-tight truncate">
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
                        <a href={ensureAbsoluteUrl(settings.cta_secondary_link)} target="_blank" rel="noopener noreferrer">
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
                        <a href={ensureAbsoluteUrl(settings.cta_primary_link)} target="_blank" rel="noopener noreferrer">
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
                <div className="flex flex-col gap-1">
                  {dynamicNavLinks.map((link) => (
                    <div key={link.name} className="border-b border-border last:border-0 pb-1 mb-1 last:pb-0 last:mb-0">
                      {link.children ? (
                        <div className="space-y-1">
                          <button
                            onClick={() => setMobileOpenDropdown(mobileOpenDropdown === link.name ? null : link.name)}
                            className="w-full flex items-center justify-between px-4 py-3 rounded-lg font-medium text-sm text-foreground hover:bg-secondary transition-all"
                          >
                            {link.name}
                            <ChevronDown className={cn("w-4 h-4 transition-transform duration-200", mobileOpenDropdown === link.name && "rotate-180")} />
                          </button>
                          
                          {mobileOpenDropdown === link.name && (
                            <div className="pl-4 pb-2 space-y-1 bg-secondary/30 rounded-lg mt-1">
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
                                      location.pathname === child.path ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-secondary"
                                    )}
                                  >
                                    {child.name}
                                  </Link>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      ) : (
                        (link as any).isCta && isExternalLink(link.path) ? (
                              <a
                                href={ensureAbsoluteUrl(link.path)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block px-4 py-3 rounded-lg font-medium text-sm transition-all bg-primary text-primary-foreground hover:bg-primary/90 mt-2 text-center shadow-gold font-bold"
                              >
                                {link.name}
                              </a>
                            ) : (
                              <Link
                                to={link.path}
                                className={cn(
                                  "block px-4 py-3 rounded-lg font-medium text-sm transition-all",
                                  (link as any).isCta 
                                    ? "bg-primary text-primary-foreground hover:bg-primary/90 mt-2 text-center shadow-gold font-bold"
                                    : location.pathname === link.path 
                                      ? "bg-primary text-primary-foreground" 
                                      : "text-foreground hover:bg-secondary"
                                )}
                              >
                                {link.name}
                              </Link>
                            )
                      )}
                    </div>
                  ))}
                  
                  {/* Mobile Admin Link if logged in */}
                  {user && (
                    <Link
                      to="/admin/dashboard"
                      className="px-4 py-3 mt-2 rounded-lg font-medium text-sm bg-secondary text-primary hover:bg-primary/5 flex items-center gap-2 border border-primary/20"
                    >
                      <Settings className="w-4 h-4" /> Admin Panel
                    </Link>
                  )}
                </div>
              </div>
            )}
        
        {/* Scrolling Ticker integrated into header so it's fixed below menu */}
        <ScrollingTicker />
      </header>
    </>
  );
}
