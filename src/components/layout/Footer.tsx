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
  const { data: settings } = useSiteSettings();

  const schoolName = settings?.school_name || "Orbit School";
  const tagline = settings?.tagline || "Excellence in Education";
  const footerText = settings?.footer_text || "Market place for school which offers wide range of services including technology integration, professional development, providing holistic support tailored to enhance every aspect of educational operations.";
  const address = settings?.address || "New Delhi, Delhi, India.";
  const phone = settings?.phone || "+91-9958528306";
  const emailAddress = settings?.email || "Info@Edprowise.Com";

  const topographyPattern = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cpath d='M0 10C10 10 10 0 20 0S30 10 40 10 50 0 60 0 70 10 80 10 90 0 100 0' fill='none' stroke='%23ffffff' stroke-opacity='0.03' stroke-width='1'/%3E%3Cpath d='M0 30C10 30 10 20 20 20S30 30 40 30 50 20 60 20 70 30 80 30 90 20 100 20' fill='none' stroke='%23ffffff' stroke-opacity='0.03' stroke-width='1'/%3E%3Cpath d='M0 50C10 50 10 40 20 40S30 50 40 50 50 40 60 40 70 50 80 50 90 40 100 40' fill='none' stroke='%23ffffff' stroke-opacity='0.03' stroke-width='1'/%3E%3Cpath d='M0 70C10 70 10 60 20 60S30 70 40 70 50 60 60 60 70 70 80 70 90 60 100 60' fill='none' stroke='%23ffffff' stroke-opacity='0.03' stroke-width='1'/%3E%3Cpath d='M0 90C10 90 10 80 20 80S30 90 40 90 50 80 60 80 70 90 80 90 90 80 100 80' fill='none' stroke='%23ffffff' stroke-opacity='0.03' stroke-width='1'/%3E%3C/svg%3E")`;

  return (
    <footer className="relative text-white overflow-hidden font-body" style={{ backgroundColor: '#1c1926' }}>
      {/* Topography Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-40 pointer-events-none" 
        style={{ 
          backgroundImage: topographyPattern,
          backgroundSize: '400px 400px'
        }} 
      />

      <div className="container relative z-10 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand Column */}
          <div className="space-y-6">
            <Link to="/" className="inline-block">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-[#2a2638] flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-[#00d4ff]" />
                </div>
                <span className="text-2xl font-bold tracking-tight">
                  <span className="text-[#00d4ff]">Ed</span>Prowise
                </span>
              </div>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              {footerText}
            </p>
            <div className="flex items-center gap-3">
              {[Facebook, Twitter, Instagram, Youtube].map((Icon, idx) => (
                <a 
                  key={idx} 
                  href="#" 
                  className="w-10 h-10 rounded-full bg-[#2a2638] flex items-center justify-center hover:bg-[#3a354d] transition-colors"
                >
                  <Icon className="w-4 h-4 text-gray-300" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="text-2xl font-serif font-bold">Quick Links</h4>
            <ul className="space-y-4">
              {["Home", "About Us", "Services", "Community Connect"].map((item) => (
                <li key={item}>
                  <Link to="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Useful Links */}
          <div className="space-y-6">
            <h4 className="text-2xl font-serif font-bold">Useful Links</h4>
            <ul className="space-y-4">
              {["Contact Us", "Career", "FAQ", "Download Brochure"].map((item) => (
                <li key={item}>
                  <Link to="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Us */}
          <div className="space-y-6">
            <h4 className="text-2xl font-serif font-bold">Contact Us</h4>
            <ul className="space-y-5">
              <li className="flex items-start gap-4">
                <div className="w-10 h-10 rounded bg-[#2a2638] flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-gray-300" />
                </div>
                <div className="pt-2">
                  <a href={`mailto:${emailAddress}`} className="text-gray-300 hover:text-white transition-colors text-sm">
                    {emailAddress}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-10 h-10 rounded bg-[#2a2638] flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-gray-300" />
                </div>
                <div className="pt-2">
                  <a href={`tel:${phone}`} className="text-gray-300 hover:text-white transition-colors text-sm">
                    {phone}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-10 h-10 rounded bg-[#2a2638] flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-gray-300" />
                </div>
                <div className="pt-2">
                  <span className="text-gray-300 text-sm">
                    {address}
                  </span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative z-10 border-t border-white/5 py-6" style={{ backgroundColor: '#161320' }}>
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm">
              All Copyright © {new Date().getFullYear()} EdProwise Tech PVT LTD. All Rights Reserved.
            </p>
            <div className="flex items-center gap-8">
              <Link to="/privacy" className="text-gray-500 hover:text-white text-sm transition-colors">
                Privacy & Policy
              </Link>
              <Link to="/terms" className="text-gray-500 hover:text-white text-sm transition-colors">
                Terms & Conditions
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

