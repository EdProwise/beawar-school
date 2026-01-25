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
    children: [
      { name: "Curriculum", path: "/academics#curriculum" },
      { name: "Pre-Primary", path: "/academics#pre-primary" },
      { name: "Primary", path: "/academics#primary" },
      { name: "Secondary", path: "/academics#secondary" },
    ],
  },
  { name: "Admissions", path: "/admissions" },
  { name: "Facilities", path: "/facilities" },
  { name: "Gallery", path: "/gallery" },
  { name: "News", path: "/news" },
  { name: "Contact", path: "/contact" },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const location = useLocation();
  const { data: settings } = useSiteSettings();
  const { user } = useAuth();

  const schoolName = settings?.school_name || "Orbit School";
  const tagline = settings?.tagline || "Excellence in Education";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-card/95 backdrop-blur-lg shadow-medium py-2"
          : "bg-transparent py-4"
      )}
    >
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300",
              isScrolled ? "bg-primary" : "bg-primary-foreground/10 backdrop-blur-sm"
            )}>
              {settings?.logo_url ? (
                <img src={settings.logo_url} alt={schoolName} className="w-8 h-8 object-contain" />
              ) : (
                <GraduationCap className={cn(
                  "w-7 h-7 transition-colors",
                  isScrolled ? "text-primary-foreground" : "text-primary-foreground"
                )} />
              )}
            </div>
            <div className="flex flex-col">
              <span className={cn(
                "font-heading font-bold text-xl transition-colors",
                isScrolled ? "text-primary" : "text-primary-foreground"
              )}>
                {schoolName}
              </span>
              <span className={cn(
                "text-xs font-medium transition-colors",
                isScrolled ? "text-muted-foreground" : "text-primary-foreground/70"
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
                    isScrolled
                      ? location.pathname === link.path
                        ? "text-primary bg-primary-light"
                        : "text-foreground hover:text-primary hover:bg-secondary"
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
                variant={isScrolled ? "ghost" : "hero"}
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
            <Button
              variant={isScrolled ? "outline" : "hero"}
              size="sm"
              className="hidden sm:flex"
              asChild
            >
              <Link to={settings?.cta_secondary_link || "/students"}>
                <User className="w-4 h-4" />
                {settings?.cta_secondary_text || "Portal"}
              </Link>
            </Button>
            <Button
              variant={isScrolled ? "default" : "hero-gold"}
              size="sm"
              asChild
            >
              <Link to={settings?.cta_primary_link || "/admissions"}>
                {settings?.cta_primary_text || "Apply Now"}
              </Link>
            </Button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={cn(
                "lg:hidden p-2 rounded-lg transition-colors",
                isScrolled
                  ? "text-foreground hover:bg-secondary"
                  : "text-primary-foreground hover:bg-primary-foreground/10"
              )}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-border/50 pt-4">
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <div key={link.name}>
                  <Link
                    to={link.path}
                    className={cn(
                      "block px-4 py-3 rounded-lg font-medium transition-colors",
                      isScrolled
                        ? location.pathname === link.path
                          ? "text-primary bg-primary-light"
                          : "text-foreground hover:bg-secondary"
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
                            isScrolled
                              ? "text-muted-foreground hover:text-primary hover:bg-secondary"
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
