import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useEffect } from "react";
import SEOHead from "@/components/SEOHead";
import { Search, Home, Phone, Images, UserPlus, ArrowLeft } from "lucide-react";

const quickLinks = [
  { label: "Home", href: "/", icon: Home },
  { label: "Admissions", href: "/admissions/process", icon: UserPlus },
  { label: "Gallery", href: "/gallery", icon: Images },
  { label: "Contact", href: "/contact", icon: Phone },
];

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    // Map common keywords to routes
    const map: Record<string, string> = {
      news: "/news",
      gallery: "/gallery",
      contact: "/contact",
      admission: "/admissions/process",
      fee: "/admissions/fees-structure",
      fees: "/admissions/fees-structure",
      result: "/results",
      results: "/results",
      career: "/career",
      about: "/about-us",
      team: "/our-teams",
      facility: "/infrastructure",
      facilities: "/infrastructure",
      infrastructure: "/infrastructure",
      curriculum: "/curriculum",
      alumni: "/alumni",
    };
    const matched = Object.entries(map).find(([key]) =>
      q.toLowerCase().includes(key)
    );
    navigate(matched ? matched[1] : `/news?search=${encodeURIComponent(q)}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <SEOHead
        title="404 - Page Not Found"
        description="The page you are looking for does not exist. Return to the home page."
        canonicalPath={location.pathname}
      />

      <div className="max-w-lg w-full text-center">
        {/* Big 404 */}
        <div className="relative mb-6 select-none">
          <span className="text-[120px] font-extrabold leading-none text-primary/10">
            404
          </span>
          <p className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-gray-800">
            Page Not Found
          </p>
        </div>

        <p className="text-gray-500 mb-8">
          The page{" "}
          <span className="font-mono text-sm bg-gray-100 px-2 py-0.5 rounded text-gray-700">
            {location.pathname}
          </span>{" "}
          doesn't exist. Try searching or use a quick link below.
        </p>

        {/* Search bar */}
        <form onSubmit={handleSearch} className="flex gap-2 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search the site..."
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary bg-white"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Search
          </button>
        </form>

        {/* Quick links */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {quickLinks.map(({ label, href, icon: Icon }) => (
            <Link
              key={href}
              to={href}
              className="flex flex-col items-center gap-2 p-3 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:border-primary hover:text-primary hover:shadow-sm transition-all"
            >
              <Icon className="w-5 h-5" />
              {label}
            </Link>
          ))}
        </div>

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Go back
        </button>
      </div>
    </div>
  );
};

export default NotFound;
