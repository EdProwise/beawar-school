import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useSiteSettings } from "@/hooks/use-school-data";

interface SEOHeadProps {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  ogType?: string;
  canonicalPath?: string;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
  siteName?: string;
  siteUrl?: string;
}

const FALLBACK_SITE_NAME = "";
const FALLBACK_SITE_URL = "";

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
  siteName,
  siteUrl,
}: SEOHeadProps) => {
  const location = useLocation();
  const { data: settings } = useSiteSettings();
  const resolvedSiteName = siteName || settings?.school_name || FALLBACK_SITE_NAME;
  const resolvedSiteUrl = siteUrl || settings?.site_url || FALLBACK_SITE_URL;
  const path = canonicalPath || location.pathname;
  const canonicalUrl = `${resolvedSiteUrl}${path}`;
  const defaultOgImage = settings?.logo_url || `${resolvedSiteUrl}/og-image.png`;
  const fullTitle = path === "/" ? title : `${title} | ${resolvedSiteName}`;

  useEffect(() => {
    document.title = fullTitle;
    setMeta("name", "description", description);
    setMeta("name", "robots", "index, follow");
    if (keywords) setMeta("name", "keywords", keywords);
    setLink("canonical", canonicalUrl);

    // Open Graph
    setMeta("property", "og:title", fullTitle);
    setMeta("property", "og:description", description);
    setMeta("property", "og:type", ogType);
    setMeta("property", "og:url", canonicalUrl);
    setMeta("property", "og:site_name", resolvedSiteName);
    setMeta("property", "og:image", ogImage || defaultOgImage);

    // Twitter Card
    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", fullTitle);
    setMeta("name", "twitter:description", description);
    setMeta("name", "twitter:image", ogImage || defaultOgImage);

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
  }, [fullTitle, description, keywords, canonicalUrl, ogType, ogImage, jsonLd, resolvedSiteName, resolvedSiteUrl, defaultOgImage]);

  return null;
};

export default SEOHead;

// Dynamic schema builders — pass schoolName, siteUrl, etc. at call site
export const buildOrganizationSchema = (
  schoolName: string,
  siteUrl: string,
  phone?: string,
  email?: string,
  address?: string,
  logoUrl?: string,
  socialLinks?: string[],
  city?: string,
  state?: string
) => ({
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: schoolName,
  url: siteUrl,
  logo: logoUrl || `${siteUrl}/favicon.ico`,
  image: `${siteUrl}/og-image.png`,
  ...(socialLinks?.length ? { sameAs: socialLinks } : {}),
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "admissions",
    ...(phone ? { telephone: phone } : {}),
    ...(email ? { email } : {}),
    areaServed: "IN",
    availableLanguage: ["English", "Hindi"],
  },
  address: {
    "@type": "PostalAddress",
    streetAddress: address || "",
    ...(city ? { addressLocality: city } : {}),
    ...(state ? { addressRegion: state } : {}),
    addressCountry: "IN",
  },
});

export const buildBreadcrumbSchema = (
  siteUrl: string,
  items: { name: string; path: string }[]
) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: `${siteUrl}${item.path}`,
  })),
});

// Legacy exports kept for backward compatibility
export const organizationSchema = buildOrganizationSchema(FALLBACK_SITE_NAME, FALLBACK_SITE_URL);
export const breadcrumbSchema = (items: { name: string; path: string }[]) =>
  buildBreadcrumbSchema(FALLBACK_SITE_URL, items);
