import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  GraduationCap, 
  MapPin, 
  Phone, 
  Mail, 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube,
  ArrowRight,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSubscribeNewsletter, useSiteSettings } from "@/hooks/use-school-data";

const quickLinks = [
  { name: "Home", path: "/" },
  { name: "About Us", path: "/about" },
  { name: "Academics", path: "/academics" },
  { name: "Admissions", path: "/admissions" },
  { name: "Contact", path: "/contact" },
];

const academicLinks = [
  { name: "Pre-Primary", path: "/academics#pre-primary" },
  { name: "Primary School", path: "/academics#primary" },
  { name: "Secondary School", path: "/academics#secondary" },
  { name: "Higher Secondary", path: "/academics#higher-secondary" },
  { name: "Extracurriculars", path: "/academics#extracurriculars" },
];

const resourceLinks = [
  { name: "Student Portal", path: "/students" },
  { name: "Parent Portal", path: "/parents" },
  { name: "Teacher Portal", path: "/teachers" },
  { name: "Gallery", path: "/gallery" },
  { name: "News & Events", path: "/news" },
];

export function Footer() {
  const [email, setEmail] = useState("");
  const subscribeMutation = useSubscribeNewsletter();
  const { data: settings } = useSiteSettings();

  const schoolName = settings?.school_name || "Orbit School";
  const tagline = settings?.tagline || "Excellence in Education";
  const footerText = settings?.footer_text || "Shaping future leaders with excellence.";
  const address = settings?.address || "123 Education Lane, Academic District, City 12345";
  const phone = settings?.phone || "+1 234 567 8900";
  const emailAddress = settings?.email || "info@orbitschool.edu";

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    subscribeMutation.mutate({ email }, {
      onSuccess: () => setEmail(""),
    });
  };

  return (
    <footer className="bg-primary-dark text-primary-foreground">
      {/* Newsletter Section */}
      <div className="border-b border-primary-foreground/10">
        <div className="container py-12">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-heading text-2xl font-bold mb-2">
                Subscribe to Our Newsletter
              </h3>
              <p className="text-primary-foreground/70">
                Stay updated with the latest news, events and announcements
              </p>
            </div>
            <form onSubmit={handleSubscribe} className="flex gap-3 w-full lg:w-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 max-w-xs"
                required
              />
              <Button 
                type="submit" 
                variant="gold" 
                className="gap-2"
                disabled={subscribeMutation.isPending}
              >
                {subscribeMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    Subscribe
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-primary-foreground/10 flex items-center justify-center">
                {settings?.logo_url ? (
                  <img src={settings.logo_url} alt={schoolName} className="w-7 h-7 object-contain" />
                ) : (
                  <GraduationCap className="w-7 h-7 text-primary-foreground" />
                )}
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-bold text-xl text-primary-foreground">
                  {schoolName}
                </span>
                <span className="text-xs text-primary-foreground/70">
                  {tagline}
                </span>
              </div>
            </Link>
            <p className="text-primary-foreground/70 mb-6 max-w-sm">
              {footerText}
            </p>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-accent mt-0.5 shrink-0" />
                <span className="text-primary-foreground/80 text-sm">
                  {address}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-accent shrink-0" />
                <span className="text-primary-foreground/80 text-sm">{phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-accent shrink-0" />
                <span className="text-primary-foreground/80 text-sm">{emailAddress}</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-semibold text-lg mb-4 pb-2 border-b-2 border-accent inline-block">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-primary-foreground/70 hover:text-accent transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Academics */}
          <div>
            <h4 className="font-heading font-semibold text-lg mb-4 pb-2 border-b-2 border-accent inline-block">
              Academics
            </h4>
            <ul className="space-y-3">
              {academicLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-primary-foreground/70 hover:text-accent transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-heading font-semibold text-lg mb-4 pb-2 border-b-2 border-accent inline-block">
              Resources
            </h4>
            <ul className="space-y-3">
              {resourceLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-primary-foreground/70 hover:text-accent transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-foreground/10">
        <div className="container py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-primary-foreground/60 text-sm">
              © {new Date().getFullYear()} {schoolName}. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link to="/privacy" className="text-primary-foreground/60 hover:text-accent text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-primary-foreground/60 hover:text-accent text-sm transition-colors">
                Terms & Conditions
              </Link>
            </div>
            <div className="flex items-center gap-4">
              {settings?.facebook_url && (
                <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer" className="text-primary-foreground/60 hover:text-accent transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
              )}
              {settings?.twitter_url && (
                <a href={settings.twitter_url} target="_blank" rel="noopener noreferrer" className="text-primary-foreground/60 hover:text-accent transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
              )}
              {settings?.instagram_url && (
                <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" className="text-primary-foreground/60 hover:text-accent transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
              )}
              {settings?.youtube_url && (
                <a href={settings.youtube_url} target="_blank" rel="noopener noreferrer" className="text-primary-foreground/60 hover:text-accent transition-colors">
                  <Youtube className="w-5 h-5" />
                </a>
              )}
              {!settings?.facebook_url && !settings?.twitter_url && !settings?.instagram_url && !settings?.youtube_url && (
                <>
                  <a href="#" className="text-primary-foreground/60 hover:text-accent transition-colors">
                    <Facebook className="w-5 h-5" />
                  </a>
                  <a href="#" className="text-primary-foreground/60 hover:text-accent transition-colors">
                    <Twitter className="w-5 h-5" />
                  </a>
                  <a href="#" className="text-primary-foreground/60 hover:text-accent transition-colors">
                    <Instagram className="w-5 h-5" />
                  </a>
                  <a href="#" className="text-primary-foreground/60 hover:text-accent transition-colors">
                    <Youtube className="w-5 h-5" />
                  </a>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
