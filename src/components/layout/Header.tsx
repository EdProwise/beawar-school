import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown, GraduationCap, User, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSiteSettings } from "@/hooks/use-school-data";
import { useAuth } from "@/hooks/use-auth";
import { ScrollingTicker } from "./ScrollingTicker";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Academics", path: "/academics" },
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

export function Header({ variant = "solid" }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const location = useLocation();
  const { data: settings } = useSiteSettings();
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
           url.startsWith('tel:');
  };

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
                <Link
                  key={link.name}
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
                          : "text-primary-foreground/90 hover:text-primary-foreground hover:bg-primary-foreground/10 drop-shadow-sm"
                  )}
                >
                  {link.name}
                </Link>
              ))}
              
              {user ? (
                <Button variant="default" size="sm" className="ml-4" asChild>
                  <Link to="/admin/dashboard">Admin Panel</Link>
                </Button>
              ) : (
                <Button variant="outline" size="sm" className="ml-4" asChild>
                  <Link to="/admin/login">Portal</Link>
                </Button>
              )}
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={cn(
                "lg:hidden p-2 rounded-lg transition-colors",
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
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={cn(
                    "px-4 py-3 rounded-lg font-medium text-sm transition-all",
                    location.pathname === link.path ? "bg-primary/10 text-primary" : "text-foreground hover:bg-secondary"
                  )}
                >
                  {link.name}
                </Link>
              ))}
              <hr className="my-2 border-border" />
              {user ? (
                <Link
                  to="/admin/dashboard"
                  className="px-4 py-3 rounded-lg font-medium text-sm text-primary hover:bg-primary/5 flex items-center gap-2"
                >
                  <Settings className="w-4 h-4" /> Admin Panel
                </Link>
              ) : (
                <Link
                  to="/admin/login"
                  className="px-4 py-3 rounded-lg font-medium text-sm text-primary hover:bg-primary/5 flex items-center gap-2"
                >
                  <User className="w-4 h-4" /> Student/Teacher Portal
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
