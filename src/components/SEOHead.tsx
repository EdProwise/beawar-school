import { useEffect } from "react";
import { useLocation } from "react-router-dom";

interface SEOHeadProps {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  ogType?: string;
  canonicalPath?: string;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

const SITE_NAME = "Beawar School";
const SITE_URL = "https://beawarschool.com"; // Update with actual domain
const DEFAULT_OG_IMAGE = `${SITE_URL}/hero_campus.png`;

function setMeta(attr: string, key: string, content: string) {
  let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setLink(rel: string, href: string) {
  let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

const SEOHead = ({
  title,
  description,
  keywords,
  ogImage,
  ogType = "website",
  canonicalPath,
  jsonLd,
}: SEOHeadProps) => {
  const location = useLocation();
  const path = canonicalPath || location.pathname;
  const canonicalUrl = `${SITE_URL}${path}`;
  const fullTitle = path === "/" ? title : `${title} | ${SITE_NAME}`;

  useEffect(() => {
    document.title = fullTitle;
    setMeta("name", "description", description);
    if (keywords) setMeta("name", "keywords", keywords);
    setLink("canonical", canonicalUrl);

    // Open Graph
    setMeta("property", "og:title", fullTitle);
    setMeta("property", "og:description", description);
    setMeta("property", "og:type", ogType);
    setMeta("property", "og:url", canonicalUrl);
    setMeta("property", "og:site_name", SITE_NAME);
    setMeta("property", "og:image", ogImage || DEFAULT_OG_IMAGE);

    // Twitter Card
    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", fullTitle);
    setMeta("name", "twitter:description", description);
    setMeta("name", "twitter:image", ogImage || DEFAULT_OG_IMAGE);

    // JSON-LD
    const scriptId = "seo-jsonld";
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (jsonLd) {
      if (!script) {
        script = document.createElement("script");
        script.id = scriptId;
        script.type = "application/ld+json";
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(jsonLd);
    } else if (script) {
      script.remove();
    }
  }, [fullTitle, description, keywords, canonicalUrl, ogType, ogImage, jsonLd]);

  return null;
};

export default SEOHead;

// Common structured data helpers
export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/favicon.ico`,
  image: `${SITE_URL}/hero_campus.png`,
  sameAs: [
    "https://www.facebook.com/beawarschool",
    "https://www.instagram.com/beawarschool",
    "https://www.youtube.com/@beawarschool",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "admissions",
    telephone: "+91-1462-XXXXXX",
    email: "info@beawarschool.com",
    areaServed: "IN",
    availableLanguage: ["English", "Hindi"],
  },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Beawar",
    addressRegion: "Rajasthan",
    addressCountry: "IN",
  },
};

export const breadcrumbSchema = (
  items: { name: string; path: string }[]
) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: `${SITE_URL}${item.path}`,
  })),
});
