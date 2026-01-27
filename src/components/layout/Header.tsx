import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown, GraduationCap, User, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSiteSettings } from "@/hooks/use-school-data";
import { useAuth } from "@/hooks/use-auth";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
    {
      name: "Academics",
      path: "/academics",
    },
    { name: "Extracurricular", path: "/extracurricular" },
  { name: "Admissions", path: "/admissions" },
  { name: "Infrastructure", path: "/infrastructure" },
  { name: "Gallery", path: "/gallery" },
  { name: "News", path: "/news" },
  { name: "Contact", path: "/contact" },
];

export interface HeaderProps {
  variant?: "transparent" | "solid" | "light";
}

export function Header({ variant = "transparent" }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(variant === "solid");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const location = useLocation();
  const { data: settings } = useSiteSettings();
  const { user } = useAuth();

  const isLight = variant === "light";
  const isSolid = variant === "solid";

  const schoolName = settings?.school_name || "Orbit School";
  const tagline = settings?.tagline || "Excellence in Education";

  const isExternalLink = (url: string) => {
    if (!url) return false;
    return url.startsWith('http://') || 
           url.startsWith('https://') || 
           url.startsWith('//') || 
           url.startsWith('mailto:') || 
           url.startsWith('tel:');
  };

  const renderCTAButton = (link: string | null | undefined, text: string, icon?: React.ReactNode, btnVariant: any = "default", className?: string) => {
    const url = link || "#";
    const external = isExternalLink(url);

    if (external) {
      return (
        <Button variant={btnVariant} size="sm" className={className} asChild>
          <a href={url} target="_blank" rel="noopener noreferrer">
            {icon}
            {text}
          </a>
        </Button>
      );
    }

    return (
      <Button variant={btnVariant} size="sm" className={className} asChild>
        <Link to={url}>
          {icon}
          {text}
        </Link>
      </Button>
    );
  };

  useEffect(() => {
    const handleScroll = () => {
      if (variant !== "solid") {
        setIsScrolled(window.scrollY > 20);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [variant]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled || isSolid
          ? "bg-card/95 backdrop-blur-lg shadow-medium py-2"
          : isLight 
            ? "bg-transparent py-4" 
            : "bg-transparent py-4"
      )}
    >
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300",
              isScrolled || isSolid ? "bg-primary" : isLight ? "bg-primary/10 backdrop-blur-sm" : "bg-primary-foreground/10 backdrop-blur-sm"
            )}>
              {settings?.logo_url ? (
                <img src={settings.logo_url} alt={schoolName} className="w-8 h-8 object-contain" />
              ) : (
                <GraduationCap className={cn(
                  "w-7 h-7 transition-colors",
                  isScrolled || isSolid ? "text-primary-foreground" : isLight ? "text-primary" : "text-primary-foreground"
                )} />
              )}
            </div>
            <div className="flex flex-col">
              <span className={cn(
                "font-heading font-bold text-xl transition-colors",
                isScrolled || isSolid ? "text-primary" : isLight ? "text-primary" : "text-primary-foreground"
              )}>
                {schoolName}
              </span>
              <span className={cn(
                "text-xs font-medium transition-colors",
                isScrolled || isSolid ? "text-muted-foreground" : isLight ? "text-slate-600" : "text-primary-foreground/70"
              )}>
                {tagline}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <div
                key={link.name}
                className="relative"
                onMouseEnter={() => link.children && setOpenDropdown(link.name)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <Link
                  to={link.path}
                  className={cn(
                    "px-4 py-2 rounded-lg font-medium text-sm transition-all flex items-center gap-1",
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
                          : "text-primary-foreground/90 hover:text-primary-foreground hover:bg-primary-foreground/10"
                  )}
                >
                  {link.name}
                  {link.children && <ChevronDown className="w-4 h-4" />}
                </Link>

                {/* Dropdown */}
                {link.children && openDropdown === link.name && (
                  <div className="absolute top-full left-0 pt-2">
                    <div className="bg-card rounded-xl border border-border shadow-strong py-2 min-w-[180px]">
                      {link.children.map((child) => (
                        <Link
                          key={child.name}
                          to={child.path}
                          className="block px-4 py-2 text-sm text-foreground hover:bg-secondary hover:text-primary transition-colors"
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Right Actions */}
            <div className="flex items-center gap-3">
              {user && (
                <Button
                  variant={isScrolled || isSolid ? "ghost" : isLight ? "outline" : "hero"}
                  size="sm"
                  className="hidden sm:flex"
                  asChild
                >
                  <Link to="/admin/dashboard">
                    <Settings className="w-4 h-4" />
                    Admin
                  </Link>
                </Button>
              )}
              {renderCTAButton(
                settings?.cta_secondary_link || "/students",
                settings?.cta_secondary_text || "Portal",
                <User className="w-4 h-4" />,
                isScrolled || isSolid ? "outline" : isLight ? "outline" : "hero",
                "hidden sm:flex"
              )}
              {renderCTAButton(
                settings?.cta_primary_link || "/admissions",
                settings?.cta_primary_text || "Apply Now",
                null,
                isScrolled || isSolid ? "default" : isLight ? "default" : "hero-gold"
              )}


            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={cn(
                "lg:hidden p-2 rounded-lg transition-colors",
                isScrolled || isSolid
                  ? "text-foreground hover:bg-secondary"
                  : isLight
                    ? "text-slate-700 hover:bg-slate-100"
                    : "text-primary-foreground hover:bg-primary-foreground/10"
              )}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className={cn(
            "lg:hidden mt-4 pb-4 border-t border-border/50 pt-4 rounded-b-2xl",
            !isScrolled && !isSolid && isLight ? "bg-white/90 backdrop-blur-md shadow-lg" : ""
          )}>
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <div key={link.name}>
                  <Link
                    to={link.path}
                    className={cn(
                      "block px-4 py-3 rounded-lg font-medium transition-colors",
                      isScrolled || isSolid
                        ? location.pathname === link.path
                          ? "text-primary bg-primary-light"
                          : "text-foreground hover:bg-secondary"
                        : isLight
                          ? location.pathname === link.path
                            ? "text-primary bg-primary/10"
                            : "text-slate-700 hover:bg-slate-100"
                          : location.pathname === link.path
                            ? "text-primary-foreground bg-primary-foreground/20"
                            : "text-primary-foreground/90 hover:bg-primary-foreground/10"
                    )}
                  >
                    {link.name}
                  </Link>
                  {link.children && (
                    <div className="pl-4 mt-1 space-y-1">
                      {link.children.map((child) => (
                        <Link
                          key={child.name}
                          to={child.path}
                          className={cn(
                            "block px-4 py-2 rounded-lg text-sm transition-colors",
                            isScrolled || isSolid
                              ? "text-muted-foreground hover:text-primary hover:bg-secondary"
                              : isLight
                                ? "text-slate-500 hover:text-primary hover:bg-slate-100"
                                : "text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10"
                          )}
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
