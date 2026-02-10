import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Menu, X, ChevronDown, ChevronRight, GraduationCap, Settings, FileDown,
  Phone, Mail, MapPin, ArrowRight, Sparkles,
  BookOpen, Users, Building2, Award, FlaskConical, Brain, Home as HomeIcon,
  Image, Newspaper, MessageSquare, ClipboardList, DollarSign, School,
  Lightbulb, Hotel, GalleryHorizontalEnd,
  Facebook, Instagram, Linkedin, Youtube
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSiteSettings, useAdmissionSettings } from "@/hooks/use-school-data";
import { useAuth } from "@/hooks/use-auth";
import { ScrollingTicker } from "./ScrollingTicker";
import { motion, AnimatePresence } from "framer-motion";

const ensureAbsoluteUrl = (url: string) => {
  if (!url) return url;
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("//") || url.startsWith("mailto:") || url.startsWith("tel:")) return url;
  if (url.startsWith("www.")) return `https://${url}`;
  return url;
};

// Icon map for dropdown items
const iconMap: Record<string, any> = {
  "About Us": Users,
  "Our Teams": Users,
  "Our Branches": Building2,
  "Career": Award,
  "Academic Programs": BookOpen,
  "Curriculum": BookOpen,
  "Teaching Method": Brain,
  "Results": Award,
  "Alumni": GraduationCap,
  "Beyond Academics": FlaskConical,
  "Entrepreneur Skills": Lightbulb,
  "Residential School": Hotel,
  "Admission Process": ClipboardList,
  "Fees Structure": DollarSign,
  "Download Prospectus": FileDown,
};

const navLinks = [
  { name: "Home", path: "/" },
  {
    name: "About",
    path: "/about-us",
    children: [
      { name: "About Us", path: "/about-us", desc: "Our story & mission" },
      { name: "Our Teams", path: "/our-teams", desc: "Meet our educators" },
      { name: "Our Branches", path: "/our-branches", desc: "Campus locations" },
      { name: "Career", path: "/career", desc: "Join our team" },
    ],
  },
  {
    name: "Academics",
    path: "/academics",
    children: [
      { name: "Academic Programs", path: "/academics", desc: "Programs offered" },
      { name: "Curriculum", path: "/curriculum", desc: "Our curriculum framework" },
      { name: "Teaching Method", path: "/teaching-method", desc: "Innovative pedagogy" },
      { name: "Results", path: "/results", desc: "Student achievements" },
      { name: "Alumni", path: "/alumni", desc: "Our proud alumni" },
    ],
  },
  {
    name: "Beyond Academics",
    path: "/beyond-academics",
    children: [
      { name: "Beyond Academics", path: "/beyond-academics", desc: "Holistic development" },
      { name: "Entrepreneur Skills", path: "/beyond-academics/entrepreneur-skills", desc: "Future leaders program" },
      { name: "Residential School", path: "/beyond-academics/residential-school", desc: "Boarding facilities" },
    ],
  },
  {
    name: "Admissions",
    path: "/admissions/process",
    children: [
      { name: "Admission Process", path: "/admissions/process", desc: "How to apply" },
      { name: "Fees Structure", path: "/admissions/fees-structure", desc: "Fee details" },
    ],
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openMobileDropdown, setOpenMobileDropdown] = useState<string | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const dropdownTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const location = useLocation();
  const { data: settings } = useSiteSettings();
  const { data: admissionSettings = {} } = useAdmissionSettings();
  const { user } = useAuth();

  const schoolName = settings?.school_name || "Orbit School";
    const tagline = settings?.tagline || "Excellence in Education";

    // Dynamically set browser tab favicon and title from settings
      useEffect(() => {
        if (settings?.logo_url) {
          // Remove all existing favicon links to avoid conflicts
          document.querySelectorAll("link[rel*='icon']").forEach(el => el.remove());
          // Create fresh favicon link
          const link = document.createElement("link");
          link.rel = "icon";
          link.href = settings.logo_url;
          // Set type based on URL extension
          if (settings.logo_url.endsWith(".png")) link.type = "image/png";
          else if (settings.logo_url.endsWith(".svg")) link.type = "image/svg+xml";
          else if (settings.logo_url.endsWith(".ico")) link.type = "image/x-icon";
          document.head.appendChild(link);
        }
        if (settings?.school_name) {
          document.title = settings.school_name;
        }
      }, [settings?.logo_url, settings?.school_name]);

  const isExternalLink = (url: string) => {
    if (!url) return false;
    return (
      url.startsWith("http://") || url.startsWith("https://") || url.startsWith("//") ||
      url.startsWith("mailto:") || url.startsWith("tel:") || url.startsWith("www.") || url.endsWith(".pdf")
    );
  };

  const dynamicNavLinks = useMemo(() => {
    return navLinks.map((link) => {
      if (link.name === "Admissions" && link.children) {
        const hasProspectus = link.children.some((child) => child.name === "Download Prospectus");
        if (!hasProspectus) {
          return {
            ...link,
            children: [
              ...link.children,
              {
                name: "Download Prospectus",
                path: (admissionSettings as any).brochure_url || "#",
                desc: "Download brochure",
                isExternal: true,
              },
            ],
          };
        }
      }
      return link;
    });
  }, [admissionSettings]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setOpenMobileDropdown(null);
  }, [location]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleDropdownEnter = useCallback((name: string) => {
    if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
    setActiveDropdown(name);
  }, []);

  const handleDropdownLeave = useCallback(() => {
    dropdownTimeout.current = setTimeout(() => setActiveDropdown(null), 120);
  }, []);

  const isActivePath = (path: string, children?: any[]) => {
    if (children) return children.some((c) => location.pathname === c.path) || location.pathname.startsWith(path);
    return location.pathname === path;
  };

  return (
    <>
      <header
        className={cn(
          "sticky top-0 left-0 right-0 z-50 transition-all duration-500",
          scrolled
            ? "bg-white/80 backdrop-blur-2xl shadow-[0_1px_30px_rgba(0,0,0,0.06)] border-b border-white/60"
            : "bg-white border-b border-gray-100/80"
        )}
      >
          {/* Top Info Bar */}
          <div className="hidden lg:block text-white" style={{ backgroundColor: settings?.topbar_bg_color || '#1f2937' }}>
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-between h-10 text-[12px]">
                <div className="flex items-center gap-5">
                    {settings?.phone && (
                      <a href={`tel:${settings.phone}`} className="flex items-center gap-1.5 text-white hover:text-white/80 transition-colors font-bold group">
                        <Phone className="w-3.5 h-3.5" />
                        <span>{settings.phone}</span>
                      </a>
                    )}
                    {settings?.email && (
                      <a href={`mailto:${settings.email}`} className="flex items-center gap-1.5 text-white hover:text-white/80 transition-colors font-bold group">
                        <Mail className="w-3.5 h-3.5" />
                        <span>{settings.email}</span>
                      </a>
                    )}
                    {settings?.address && (
                      <span className="flex items-center gap-1.5 text-white font-bold">
                        <MapPin className="w-3.5 h-3.5" />
                        <span className="truncate max-w-[260px]">{settings.address}</span>
                      </span>
                    )}
                    {/* Social Media Links */}
                    {(settings?.facebook_url || settings?.instagram_url || settings?.linkedin_url || settings?.youtube_url) && (
                      <>
                        <span className="w-px h-4 bg-white/30" />
                        <div className="flex items-center gap-2">
                          {settings?.facebook_url && (
                            <a href={ensureAbsoluteUrl(settings.facebook_url)} target="_blank" rel="noopener noreferrer" className="w-6 h-6 flex items-center justify-center rounded-full bg-white/15 hover:bg-white/30 text-white transition-all duration-200">
                              <Facebook className="w-3 h-3" />
                            </a>
                          )}
                          {settings?.instagram_url && (
                            <a href={ensureAbsoluteUrl(settings.instagram_url)} target="_blank" rel="noopener noreferrer" className="w-6 h-6 flex items-center justify-center rounded-full bg-white/15 hover:bg-white/30 text-white transition-all duration-200">
                              <Instagram className="w-3 h-3" />
                            </a>
                          )}
                          {settings?.linkedin_url && (
                            <a href={ensureAbsoluteUrl(settings.linkedin_url)} target="_blank" rel="noopener noreferrer" className="w-6 h-6 flex items-center justify-center rounded-full bg-white/15 hover:bg-white/30 text-white transition-all duration-200">
                              <Linkedin className="w-3 h-3" />
                            </a>
                          )}
                          {settings?.youtube_url && (
                            <a href={ensureAbsoluteUrl(settings.youtube_url)} target="_blank" rel="noopener noreferrer" className="w-6 h-6 flex items-center justify-center rounded-full bg-white/15 hover:bg-white/30 text-white transition-all duration-200">
                              <Youtube className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-2.5">
                  {settings?.cta_primary_text && settings?.cta_primary_link && (
                    isExternalLink(settings.cta_primary_link) ? (
                      <a
                        href={ensureAbsoluteUrl(settings.cta_primary_link)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-4 py-1 rounded-full bg-white text-gray-900 text-[11.5px] font-bold hover:bg-white/90 transition-all duration-200"
                      >
                        {settings.cta_primary_text}
                        <ArrowRight className="w-3 h-3" />
                      </a>
                    ) : (
                      <Link
                        to={settings.cta_primary_link}
                        className="flex items-center gap-1.5 px-4 py-1 rounded-full bg-white text-gray-900 text-[11.5px] font-bold hover:bg-white/90 transition-all duration-200"
                      >
                        {settings.cta_primary_text}
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    )
                  )}
                  {settings?.cta_secondary_text && settings?.cta_secondary_link && (
                    isExternalLink(settings.cta_secondary_link) ? (
                      <a
                        href={ensureAbsoluteUrl(settings.cta_secondary_link)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-4 py-1 rounded-full border border-white/40 text-white text-[11.5px] font-bold hover:bg-white/10 transition-all duration-200"
                      >
                        {settings.cta_secondary_text}
                      </a>
                    ) : (
                      <Link
                        to={settings.cta_secondary_link}
                        className="flex items-center gap-1.5 px-4 py-1 rounded-full border border-white/40 text-white text-[11.5px] font-bold hover:bg-white/10 transition-all duration-200"
                      >
                        {settings.cta_secondary_text}
                      </Link>
                    )
                  )}
                  {user && (
                    <Link to="/admin/dashboard" className="flex items-center gap-1.5 text-white/80 hover:text-white transition-colors font-bold ml-1">
                      <Settings className="w-3.5 h-3.5" />
                      <span>Admin</span>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>

        {/* Main Navigation Bar */}
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-[70px]">
            {/* Logo */}
              <Link to="/" className="flex items-center gap-3.5 group shrink-0 relative">
                {settings?.logo_url ? (
                  <img src={settings.logo_url} alt={schoolName} className="w-12 h-12 object-contain" />
                ) : (
                  <GraduationCap className="w-10 h-10 text-primary" />
                )}
              <div className="flex flex-col">
                <span className="font-heading font-bold text-[18px] text-gray-900 leading-tight tracking-tight group-hover:text-primary transition-colors duration-300">
                  {schoolName}
                </span>
                <span className="text-[10.5px] font-semibold text-primary/60 leading-tight tracking-[0.15em] uppercase mt-0.5">
                  {tagline}
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden xl:flex items-center gap-0.5 flex-1 justify-center">
              {dynamicNavLinks.map((link) => (
                <div
                  key={link.name}
                  className="relative"
                  onMouseEnter={() => link.children ? handleDropdownEnter(link.name) : undefined}
                  onMouseLeave={link.children ? handleDropdownLeave : undefined}
                >
                  {link.children ? (
                    <>
                      <button
                        className={cn(
                          "relative px-3.5 py-2.5 text-[15px] font-semibold transition-all duration-200 flex items-center gap-1 rounded-xl whitespace-nowrap group/nav",
                            isActivePath(link.path, link.children)
                              ? "text-primary"
                              : "text-black hover:text-primary"
                        )}
                      >
                        {link.name}
                        <ChevronDown
                          className={cn(
                            "w-3.5 h-3.5 transition-all duration-300",
                            activeDropdown === link.name ? "rotate-180 text-primary" : ""
                          )}
                        />
                        {/* Active bottom bar */}
                        <span className={cn(
                          "absolute bottom-0 left-3 right-3 h-[2.5px] rounded-full transition-all duration-300",
                          isActivePath(link.path, link.children)
                            ? "bg-primary scale-x-100"
                            : "bg-primary scale-x-0 group-hover/nav:scale-x-100"
                        )} />
                      </button>

                      {/* Dropdown Menu */}
                      <AnimatePresence>
                        {activeDropdown === link.name && (
                          <motion.div
                            initial={{ opacity: 0, y: 8, scale: 0.96 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 4, scale: 0.98 }}
                            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                            className="absolute top-full left-1/2 -translate-x-1/2 pt-3 z-50"
                          >
                            <div className="bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.1)] border border-gray-100/80 p-2 min-w-[260px] overflow-hidden backdrop-blur-xl">
                              {/* Gradient accent bar */}
                              <div className="h-1 bg-gradient-to-r from-primary via-primary/60 to-accent rounded-full mx-2 mb-2" />

                              {link.children.map((child, idx) => {
                                const ext = (child as any).isExternal || isExternalLink(child.path);
                                const isActive = location.pathname === child.path;
                                const Icon = iconMap[child.name] || BookOpen;

                                const itemContent = (
                                  <div className="flex items-center gap-3 w-full">
                                    <div className={cn(
                                      "w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200",
                                      isActive
                                        ? "bg-primary text-white shadow-md shadow-primary/25"
                                        : "bg-gray-50 text-gray-400 group-hover/item:bg-primary/10 group-hover/item:text-primary"
                                    )}>
                                      <Icon className="w-4 h-4" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className={cn(
                                        "text-[13px] font-semibold leading-tight transition-colors duration-150",
                                        isActive ? "text-primary" : "text-gray-700 group-hover/item:text-gray-900"
                                      )}>
                                        {child.name}
                                      </div>
                                      {(child as any).desc && (
                                        <div className="text-[11px] text-gray-400 mt-0.5 truncate">
                                          {(child as any).desc}
                                        </div>
                                      )}
                                    </div>
                                    {ext ? (
                                      <FileDown className="w-3.5 h-3.5 text-gray-300 shrink-0" />
                                    ) : (
                                      <ChevronRight className={cn(
                                        "w-3.5 h-3.5 shrink-0 transition-all duration-200 opacity-0 -translate-x-1 group-hover/item:opacity-100 group-hover/item:translate-x-0",
                                        isActive ? "text-primary" : "text-gray-300"
                                      )} />
                                    )}
                                  </div>
                                );

                                const commonClasses = cn(
                                  "group/item flex items-center px-2 py-2.5 rounded-xl transition-all duration-200 cursor-pointer",
                                  isActive
                                    ? "bg-primary/5"
                                    : "hover:bg-gray-50"
                                );

                                if (ext) {
                                  return (
                                    <a
                                      key={child.name}
                                      href={ensureAbsoluteUrl(child.path)}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className={commonClasses}
                                    >
                                      {itemContent}
                                    </a>
                                  );
                                }
                                return (
                                  <Link key={child.name} to={child.path} className={commonClasses}>
                                    {itemContent}
                                  </Link>
                                );
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  ) : (
                    <Link
                      to={link.path}
                      className={cn(
                        "relative px-3.5 py-2.5 text-[15px] font-semibold transition-all duration-200 rounded-xl whitespace-nowrap block group/nav",
                          isActivePath(link.path)
                            ? "text-primary"
                            : "text-black hover:text-primary"
                      )}
                    >
                      {link.name}
                      <span className={cn(
                        "absolute bottom-0 left-3 right-3 h-[2.5px] rounded-full transition-all duration-300",
                        isActivePath(link.path)
                          ? "bg-primary scale-x-100"
                          : "bg-primary scale-x-0 group-hover/nav:scale-x-100"
                      )} />
                    </Link>
                  )}
                </div>
              ))}
            </nav>

              {/* Desktop - no CTA buttons here, they are in the top info bar */}
              <div className="hidden xl:flex items-center gap-2.5 shrink-0">
                {user && !settings?.phone && (
                  <Link to="/admin/dashboard" className="flex items-center gap-1.5 text-gray-500 hover:text-primary text-sm font-medium transition-colors">
                    <Settings className="w-4 h-4" />
                    Admin
                  </Link>
                )}
              </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={cn(
                "xl:hidden relative w-11 h-11 flex items-center justify-center rounded-2xl transition-all duration-300",
                isMobileMenuOpen
                  ? "bg-primary/10 text-primary"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              )}
            >
              <span className={cn(
                "absolute transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
                isMobileMenuOpen ? "opacity-0 rotate-90 scale-0" : "opacity-100 rotate-0 scale-100"
              )}>
                <Menu className="w-[22px] h-[22px]" strokeWidth={2.2} />
              </span>
              <span className={cn(
                "absolute transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
                isMobileMenuOpen ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-0"
              )}>
                <X className="w-[22px] h-[22px]" strokeWidth={2.2} />
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="xl:hidden fixed inset-0 top-[calc(70px+40px)] lg:top-[70px] bg-black/30 backdrop-blur-sm z-40"
                onClick={() => setIsMobileMenuOpen(false)}
              />

              {/* Panel */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="xl:hidden fixed top-[calc(70px+40px)] lg:top-[70px] left-0 right-0 bottom-0 z-50 bg-white overflow-y-auto"
              >
                {/* Contact info on mobile */}
                <div className="flex items-center gap-3 px-5 py-3 bg-gray-50 border-b border-gray-100 text-[12px] overflow-x-auto">
                  {settings?.phone && (
                    <a href={`tel:${settings.phone}`} className="flex items-center gap-1.5 text-gray-500 hover:text-primary shrink-0">
                      <Phone className="w-3 h-3" />
                      <span>{settings.phone}</span>
                    </a>
                  )}
                  {settings?.email && (
                    <a href={`mailto:${settings.email}`} className="flex items-center gap-1.5 text-gray-500 hover:text-primary shrink-0">
                      <Mail className="w-3 h-3" />
                      <span>{settings.email}</span>
                    </a>
                  )}
                </div>

                <div className="p-4 pb-32">
                  {/* Nav Links */}
                  <div className="space-y-1">
                    {dynamicNavLinks.map((link, linkIdx) => (
                      <motion.div
                        key={link.name}
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: linkIdx * 0.04, duration: 0.3 }}
                      >
                        {link.children ? (
                          <div>
                            <button
                              onClick={() =>
                                setOpenMobileDropdown(openMobileDropdown === link.name ? null : link.name)
                              }
                              className={cn(
                                "w-full flex items-center justify-between px-4 py-3.5 rounded-2xl text-[15px] font-semibold transition-all duration-200",
                                isActivePath(link.path, link.children)
                                  ? "text-primary bg-primary/5"
                                  : "text-gray-700 hover:bg-gray-50 active:bg-gray-100"
                              )}
                            >
                              <span>{link.name}</span>
                              <motion.div
                                animate={{ rotate: openMobileDropdown === link.name ? 180 : 0 }}
                                transition={{ duration: 0.3 }}
                              >
                                <ChevronDown className="w-4 h-4" />
                              </motion.div>
                            </button>

                            <AnimatePresence>
                              {openMobileDropdown === link.name && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                                  className="overflow-hidden"
                                >
                                  <div className="ml-3 pl-3 border-l-2 border-primary/15 space-y-0.5 py-2">
                                    {link.children.map((child, idx) => {
                                      const ext = (child as any).isExternal || isExternalLink(child.path);
                                      const isActive = location.pathname === child.path;
                                      const Icon = iconMap[child.name] || BookOpen;

                                      const mobileItemContent = (
                                        <div className="flex items-center gap-3 w-full">
                                          <div className={cn(
                                            "w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors",
                                            isActive
                                              ? "bg-primary text-white"
                                              : "bg-gray-100 text-gray-400"
                                          )}>
                                            <Icon className="w-3.5 h-3.5" />
                                          </div>
                                          <div className="flex-1 min-w-0">
                                            <div className={cn(
                                              "text-[13.5px] font-semibold",
                                              isActive ? "text-primary" : "text-gray-600"
                                            )}>
                                              {child.name}
                                            </div>
                                            {(child as any).desc && (
                                              <div className="text-[11px] text-gray-400 truncate">
                                                {(child as any).desc}
                                              </div>
                                            )}
                                          </div>
                                          {ext && <FileDown className="w-3.5 h-3.5 text-gray-300 shrink-0" />}
                                        </div>
                                      );

                                      if (ext) {
                                        return (
                                          <a
                                            key={child.name}
                                            href={ensureAbsoluteUrl(child.path)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
                                          >
                                            {mobileItemContent}
                                          </a>
                                        );
                                      }
                                      return (
                                        <Link
                                          key={child.name}
                                          to={child.path}
                                          className={cn(
                                            "flex items-center px-3 py-2.5 rounded-xl transition-colors",
                                            isActive ? "bg-primary/5" : "hover:bg-gray-50"
                                          )}
                                        >
                                          {mobileItemContent}
                                        </Link>
                                      );
                                    })}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        ) : (
                          <Link
                            to={link.path}
                            className={cn(
                              "flex items-center gap-3 px-4 py-3.5 rounded-2xl text-[15px] font-semibold transition-all duration-200",
                              isActivePath(link.path)
                                ? "text-primary bg-primary/5"
                                : "text-gray-700 hover:bg-gray-50 active:bg-gray-100"
                            )}
                          >
                            {isActivePath(link.path) && (
                              <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                            )}
                            {link.name}
                          </Link>
                        )}
                      </motion.div>
                    ))}
                  </div>

                  {/* Divider */}
                  <div className="my-5 mx-2">
                    <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
                  </div>

                  {/* Mobile CTA Buttons */}
                  <div className="space-y-3 px-1">
                    {settings?.cta_secondary_text && settings?.cta_secondary_link && (
                      <Button
                        variant="outline"
                        className="w-full justify-center rounded-2xl h-12 text-[14px] font-semibold border-gray-200 hover:border-primary/30 hover:text-primary hover:bg-primary/5 transition-all duration-300"
                        asChild
                      >
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
                      <Button
                        className="w-full justify-center rounded-2xl h-12 text-[14px] font-semibold bg-gradient-to-r from-primary to-primary/85 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 group/mcta"
                        asChild
                      >
                        {isExternalLink(settings.cta_primary_link) ? (
                          <a href={ensureAbsoluteUrl(settings.cta_primary_link)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                            {settings.cta_primary_text}
                            <ArrowRight className="w-4 h-4 group-hover/mcta:translate-x-0.5 transition-transform" />
                          </a>
                        ) : (
                          <Link to={settings.cta_primary_link} className="flex items-center gap-2">
                            {settings.cta_primary_text}
                            <ArrowRight className="w-4 h-4 group-hover/mcta:translate-x-0.5 transition-transform" />
                          </Link>
                        )}
                      </Button>
                    )}

                    {user && (
                      <Link
                        to="/admin/dashboard"
                        className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-2xl text-[14px] font-semibold text-gray-500 hover:text-primary hover:bg-primary/5 transition-all duration-200 border border-dashed border-gray-200"
                      >
                        <Settings className="w-4 h-4" />
                        Admin Panel
                      </Link>
                    )}
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Scrolling Ticker */}
        <ScrollingTicker />
      </header>
    </>
  );
}
